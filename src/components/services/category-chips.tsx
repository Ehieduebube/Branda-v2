import Link from "next/link";

import { CATEGORIES } from "@/data/taxonomy";
import { buildServicesHref } from "@/lib/service-query";
import { cn } from "@/lib/utils";
import type { CategorySlug, MarketCode, ServiceQuery } from "@/types";

/**
 * Category filter as links: crawlable, prefetchable, and usable without JS.
 * Counts reflect every other active filter, so empty options are visible
 * before they're clicked.
 */
export function CategoryChips({
  market,
  query,
  counts,
}: {
  market: MarketCode;
  query: ServiceQuery;
  counts: Record<CategorySlug, number>;
}) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const chips = [
    { slug: undefined, label: "All", count: total },
    ...CATEGORIES.map((c) => ({ slug: c.slug, label: c.label, count: counts[c.slug] })),
  ];

  return (
    <nav aria-label="Filter by category">
      <ul className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {chips.map((chip) => {
          const active = query.category === chip.slug;
          return (
            <li key={chip.label} className="shrink-0">
              <Link
                href={buildServicesHref(market, query, { category: chip.slug })}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors",
                  active
                    ? "border-brand-700 bg-brand-700 text-white"
                    : "border-slate-300 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
                )}
              >
                {chip.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-xs",
                    active ? "bg-white text-brand-800" : "bg-slate-100 text-slate-600",
                  )}
                >
                  <span className="sr-only">(</span>
                  {chip.count}
                  <span className="sr-only"> services)</span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
