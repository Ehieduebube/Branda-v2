import Link from "next/link";

import { buttonClasses } from "@/components/ui/button";
import { listMarkets, marketHref } from "@/lib/markets";

/** Root 404: unknown market codes and URLs outside any market. */
export default function NotFound() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-sm font-semibold text-brand-700">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">We couldn&apos;t find that page</h1>
      <p className="mt-3 text-slate-600">
        The link may be outdated, or the market in the address isn&apos;t one we serve yet. Choose your market to
        continue.
      </p>
      <ul className="mt-8 flex flex-wrap justify-center gap-3">
        {listMarkets().map((market) => (
          <li key={market.code}>
            <Link href={marketHref(market.code)} className={buttonClasses({ variant: "secondary" })}>
              {market.country} ({market.currency.code})
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
