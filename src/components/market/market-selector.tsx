"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useRef, useTransition } from "react";

import { GlobeIcon } from "@/components/ui/icons";
import { MARKETS, MARKET_CODES } from "@/data/markets";
import { getEquivalentPath, isMarketCode, MARKET_COOKIE } from "@/lib/markets";
import type { MarketCode } from "@/types";

/**
 * Country/currency selector. A native <select> gives keyboard, screen reader
 * and mobile picker support for free. Switching keeps the user on the
 * equivalent page (and query string) in the target market.
 */
export function MarketSelector({ current }: { current: MarketCode }) {
  const router = useRouter();
  const pathname = usePathname();
  const id = useId();
  const [isPending, startTransition] = useTransition();
  const prefetched = useRef(false);

  function targetHref(target: MarketCode) {
    const path = getEquivalentPath(pathname, target);
    const keepQuery = !path.endsWith("/cart");
    return keepQuery ? path + window.location.search : path;
  }

  // Warm the other markets' equivalent pages once the user shows intent, so
  // the switch renders from cache (or at least shows loading.tsx instantly).
  function prefetchMarkets() {
    if (prefetched.current) return;
    prefetched.current = true;
    for (const code of MARKET_CODES) {
      if (code !== current) router.prefetch(targetHref(code));
    }
  }

  // A new page means new equivalent paths to prefetch.
  useEffect(() => {
    prefetched.current = false;
  }, [pathname, current]);

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const target = event.target.value;
    if (!isMarketCode(target) || target === current) return;

    // Remember the choice so "/" sends returning visitors to their market.
    document.cookie = `${MARKET_COOKIE}=${target}; path=/; max-age=31536000; samesite=lax`;

    // Same page in another currency: keep the reader where they were.
    startTransition(() => router.push(targetHref(target), { scroll: false }));
  }

  return (
    <div className="relative flex items-center">
      <label htmlFor={id} className="sr-only">
        Country and currency
      </label>
      <GlobeIcon className="pointer-events-none absolute left-2.5 size-4 text-slate-500" />
      <select
        id={id}
        value={current}
        onChange={handleChange}
        onPointerEnter={prefetchMarkets}
        onFocus={prefetchMarkets}
        aria-busy={isPending}
        className="min-h-10 w-40 appearance-none truncate rounded-lg border border-slate-300 bg-white py-1.5 pr-8 pl-8 text-sm font-medium text-slate-900 hover:border-slate-400 sm:w-auto"
      >
        {MARKET_CODES.map((code) => {
          const market = MARKETS[code];
          return (
            <option key={code} value={code}>
              {market.country} ({market.currency.symbol} {market.currency.code})
            </option>
          );
        })}
      </select>
      <svg
        aria-hidden="true"
        viewBox="0 0 20 20"
        className="pointer-events-none absolute right-2.5 size-4 text-slate-500"
        fill="currentColor"
      >
        <path d="M5.5 7.5 10 12l4.5-4.5" stroke="currentColor" strokeWidth="1.8" fill="none" />
      </svg>
    </div>
  );
}
