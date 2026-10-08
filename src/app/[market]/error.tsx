"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { buttonClasses } from "@/components/ui/button";
import { DEFAULT_MARKET } from "@/data/markets";
import { isMarketCode, marketHref } from "@/lib/markets";

/**
 * Error boundary for market pages. Rendered inside the market layout, so the
 * header, market selector and cart remain usable while the page recovers.
 */
export default function MarketError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const params = useParams<{ market: string }>();
  const market = isMarketCode(params.market) ? params.market : DEFAULT_MARKET;

  useEffect(() => {
    // Production: report to an error tracker with error.digest for correlation.
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">We couldn&apos;t load this page</h1>
      <p className="mt-3 text-slate-600">
        This is usually temporary. Try again, or keep browsing — your cart is saved on this device.
      </p>
      {error.digest && <p className="mt-2 text-xs text-slate-600">Reference: {error.digest}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className={buttonClasses()}>
          Try again
        </button>
        <Link href={marketHref(market, "/services")} className={buttonClasses({ variant: "secondary" })}>
          Browse services
        </Link>
      </div>
    </div>
  );
}
