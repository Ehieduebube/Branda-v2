import Link from "next/link";

import { CATEGORIES } from "@/data/taxonomy";
import { listMarkets, marketHref } from "@/lib/markets";
import { buildServicesHref } from "@/lib/service-query";
import type { Market } from "@/types";

export function SiteFooter({ market }: { market: Market }) {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-3 sm:px-6 lg:px-8">
        <div>
          <p className="text-lg font-bold text-slate-900">Branda</p>
          <p className="mt-2 text-sm text-slate-600">{market.content.serviceAreaNote}</p>
        </div>

        <nav aria-label="Service categories">
          <h2 className="text-sm font-semibold text-slate-900">Services</h2>
          <ul className="mt-3 space-y-2">
            {CATEGORIES.map((category) => (
              <li key={category.slug}>
                <Link
                  href={buildServicesHref(market.code, { category: category.slug })}
                  className="text-sm text-slate-600 hover:text-slate-900 hover:underline"
                >
                  {category.label} — {category.tagline}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Markets">
          <h2 className="text-sm font-semibold text-slate-900">Markets</h2>
          <ul className="mt-3 space-y-2">
            {listMarkets().map((m) => (
              <li key={m.code}>
                <Link
                  href={marketHref(m.code)}
                  hrefLang={m.locale}
                  aria-current={m.code === market.code ? "true" : undefined}
                  className="text-sm text-slate-600 hover:text-slate-900 hover:underline aria-[current]:font-semibold aria-[current]:text-slate-900"
                >
                  {m.country} ({m.currency.code})
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <p className="border-t border-slate-200 px-4 py-4 text-center text-xs text-slate-600">
        Assessment build with mock catalog data. Photography from Unsplash.
      </p>
    </footer>
  );
}
