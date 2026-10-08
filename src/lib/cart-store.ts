import { useCallback, useMemo, useSyncExternalStore } from "react";

import { addLine, isCartLine, removeLine, setLineQuantity } from "@/lib/cart";
import type { ConfirmedOrder } from "@/lib/checkout";
import type { CartLine, MarketCode } from "@/types";

/**
 * Client-side cart persisted to localStorage, one cart per market because
 * prices are in that market's currency.
 *
 * Read through `useSyncExternalStore` with a `null` server snapshot: the
 * server render and the hydration render both see "not loaded yet", then
 * React re-renders with the stored cart. That is what prevents hydration
 * mismatches without `useEffect` + `setState` flicker on every navigation.
 * No provider is needed, so no part of the layout becomes a Client Component
 * just to host cart state.
 */

const CART_PREFIX = "branda:cart:v1:";
const LAST_ORDER_KEY = "branda:last-order:v1";

type Listener = () => void;
const listeners = new Set<Listener>();

// Fallback when storage is unavailable (private mode, blocked site data).
const memoryStore = new Map<string, string>();

function readStorage(storage: "local" | "session", key: string): string | null {
  try {
    return (storage === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return memoryStore.get(key) ?? null;
  }
}

function writeStorage(storage: "local" | "session", key: string, value: string | null): void {
  try {
    const target = storage === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) target.removeItem(key);
    else target.setItem(key, value);
  } catch {
    if (value === null) memoryStore.delete(key);
    else memoryStore.set(key, value);
  }
}

function emitChange() {
  for (const listener of listeners) listener();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  // Keep tabs in sync: another tab editing the cart fires a storage event here.
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key.startsWith(CART_PREFIX)) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// getSnapshot must return a stable reference while data is unchanged.
const snapshotCache = new Map<string, { raw: string | null; value: unknown }>();

function readCached<T>(storage: "local" | "session", key: string, parse: (raw: string | null) => T): T {
  const raw = readStorage(storage, key);
  const cached = snapshotCache.get(key);
  if (cached && cached.raw === raw) return cached.value as T;
  const value = parse(raw);
  snapshotCache.set(key, { raw, value });
  return value;
}

function parseCart(raw: string | null): CartLine[] {
  if (!raw) return [];
  try {
    const data: unknown = JSON.parse(raw);
    return Array.isArray(data) ? data.filter(isCartLine) : [];
  } catch {
    return [];
  }
}

function getCart(market: MarketCode): CartLine[] {
  return readCached("local", CART_PREFIX + market, parseCart);
}

function updateCart(market: MarketCode, update: (lines: CartLine[]) => CartLine[]) {
  const next = update(getCart(market));
  writeStorage("local", CART_PREFIX + market, next.length ? JSON.stringify(next) : null);
  emitChange();
}

const getServerSnapshot = () => null;

/** `lines` is null until the client has read storage (server + hydration render). */
export function useCart(market: MarketCode) {
  const lines = useSyncExternalStore(
    subscribe,
    useCallback(() => getCart(market), [market]),
    getServerSnapshot,
  );

  const actions = useMemo(
    () => ({
      add: (line: CartLine) => updateCart(market, (current) => addLine(current, line)),
      setQuantity: (key: string, quantity: number) =>
        updateCart(market, (current) => setLineQuantity(current, key, quantity)),
      remove: (key: string) => updateCart(market, (current) => removeLine(current, key)),
      applyPrices: (prices: { key: string; unitPrice: number }[]) =>
        updateCart(market, (current) =>
          current.map((line) => {
            const update = prices.find((p) => p.key === line.key);
            return update ? { ...line, unitPrice: update.unitPrice } : line;
          }),
        ),
      clear: () => updateCart(market, () => []),
    }),
    [market],
  );

  return { lines, ...actions };
}

// ─── Last confirmed order (session-scoped, survives a refresh) ────────────

function parseOrder(raw: string | null): ConfirmedOrder | undefined {
  if (!raw) return undefined;
  try {
    const order = JSON.parse(raw) as ConfirmedOrder;
    return typeof order?.id === "string" && Array.isArray(order.lines) ? order : undefined;
  } catch {
    return undefined;
  }
}

export function saveLastOrder(order: ConfirmedOrder) {
  writeStorage("session", LAST_ORDER_KEY, JSON.stringify(order));
  emitChange();
}

/** null while hydrating; undefined when there is no recent order. */
export function useLastOrder(): ConfirmedOrder | undefined | null {
  return useSyncExternalStore(
    subscribe,
    () => readCached("session", LAST_ORDER_KEY, parseOrder),
    getServerSnapshot,
  );
}
