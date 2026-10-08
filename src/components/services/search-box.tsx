"use client";

import { useEffect, useRef, useState } from "react";

import { useCatalogNavigation } from "@/components/services/catalog-navigation";
import { CloseIcon, SearchIcon } from "@/components/ui/icons";
import { buildServicesHref, MAX_QUERY_LENGTH, PARAM } from "@/lib/service-query";
import { marketHref } from "@/lib/markets";
import type { MarketCode, ServiceQuery } from "@/types";

const DEBOUNCE_MS = 350;

/**
 * Search-as-you-type that writes `?q=` to the URL. Typing is debounced so a
 * request isn't made per keystroke, and uses `replace` so the back button
 * isn't flooded with intermediate queries. Without JavaScript it is a plain
 * GET form, so search still works.
 */
export function SearchBox({ market, query }: { market: MarketCode; query: ServiceQuery }) {
  const { navigate, isPending } = useCatalogNavigation();
  const [value, setValue] = useState(query.q);
  const [syncedQuery, setSyncedQuery] = useState(query.q);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync when the URL changes from elsewhere (e.g. "Clear all"), without
  // clobbering what the user is typing. React's "adjust state on prop change".
  if (query.q !== syncedQuery) {
    setSyncedQuery(query.q);
    if (query.q !== value.trim()) setValue(query.q);
  }

  useEffect(() => () => clearTimeout(timer.current), []);

  function commit(next: string, replace: boolean) {
    clearTimeout(timer.current);
    if (next.trim() === query.q) return;
    navigate(buildServicesHref(market, query, { q: next }), { replace });
  }

  function handleChange(next: string) {
    setValue(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => commit(next, true), DEBOUNCE_MS);
  }

  return (
    <form
      role="search"
      action={marketHref(market, "/services")}
      onSubmit={(event) => {
        event.preventDefault();
        commit(value, false);
      }}
      className="relative"
    >
      <label htmlFor="service-search" className="sr-only">
        Search services
      </label>
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500" />
      <input
        id="service-search"
        name={PARAM.q}
        type="search"
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        maxLength={MAX_QUERY_LENGTH}
        placeholder="Search services, e.g. business cards, mugs, logo"
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-12 pl-12 text-base text-slate-900 placeholder:text-slate-500 hover:border-slate-400 [&::-webkit-search-cancel-button]:hidden"
      />
      {/* Preserve active filters for the no-JS GET submission. */}
      {query.category && <input type="hidden" name={PARAM.category} value={query.category} />}
      {query.industry && <input type="hidden" name={PARAM.industry} value={query.industry} />}
      {query.useCase && <input type="hidden" name={PARAM.useCase} value={query.useCase} />}
      {query.urgency && <input type="hidden" name={PARAM.urgency} value={query.urgency} />}
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue("");
            commit("", false);
          }}
          className="absolute top-1/2 right-3 flex size-8 -translate-y-1/2 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          aria-label="Clear search"
        >
          <CloseIcon className="size-4" />
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {isPending ? "Updating results" : ""}
      </span>
    </form>
  );
}
