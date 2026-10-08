import Link from "next/link";

import { buildServicesHref } from "@/lib/service-query";
import { cn } from "@/lib/utils";
import type { MarketCode, ServiceQuery } from "@/types";

/** Page numbers with ellipses: 1 … 4 5 6 … 12 */
function pageWindow(current: number, count: number): (number | "gap")[] {
  const pages = new Set([1, count, current - 1, current, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= count).sort((a, b) => a - b);
  return sorted.flatMap((page, i) => (i > 0 && page - sorted[i - 1] > 1 ? ["gap" as const, page] : [page]));
}

/** Link-based pagination: each page has a real, shareable, crawlable URL. */
export function Pagination({
  market,
  query,
  pageCount,
}: {
  market: MarketCode;
  query: ServiceQuery;
  pageCount: number;
}) {
  if (pageCount <= 1) return null;
  const current = Math.min(query.page, pageCount);
  const href = (page: number) => buildServicesHref(market, query, { page });
  const itemClass = "inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg px-3 text-sm font-medium";

  return (
    <nav aria-label="Pagination" className="mt-10 flex justify-center">
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          {current > 1 ? (
            <Link href={href(current - 1)} rel="prev" className={cn(itemClass, "text-slate-700 hover:bg-slate-100")}>
              <span aria-hidden="true">←</span>
              <span className="ml-1">Previous</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(itemClass, "cursor-not-allowed text-slate-400")}>
              <span aria-hidden="true">←</span>
              <span className="ml-1">Previous</span>
            </span>
          )}
        </li>

        {pageWindow(current, pageCount).map((page, i) =>
          page === "gap" ? (
            <li key={`gap-${i}`} aria-hidden="true" className="px-1 text-slate-500">
              …
            </li>
          ) : (
            <li key={page}>
              <Link
                href={href(page)}
                aria-current={page === current ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={cn(
                  itemClass,
                  page === current ? "bg-brand-700 text-white" : "text-slate-700 hover:bg-slate-100",
                )}
              >
                {page}
              </Link>
            </li>
          ),
        )}

        <li>
          {current < pageCount ? (
            <Link href={href(current + 1)} rel="next" className={cn(itemClass, "text-slate-700 hover:bg-slate-100")}>
              <span className="mr-1">Next</span>
              <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <span aria-disabled="true" className={cn(itemClass, "cursor-not-allowed text-slate-400")}>
              <span className="mr-1">Next</span>
              <span aria-hidden="true">→</span>
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
