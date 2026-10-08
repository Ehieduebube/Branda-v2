import Link from "next/link";

import { CloseIcon } from "@/components/ui/icons";
import { CATEGORIES, INDUSTRIES, URGENCIES, USE_CASES } from "@/data/taxonomy";
import { buildServicesHref } from "@/lib/service-query";
import type { MarketCode, ServiceQuery } from "@/types";

/** Removable chips summarising what is applied — each one is a link. */
export function ActiveFilters({ market, query }: { market: MarketCode; query: ServiceQuery }) {
  const chips: { label: string; remove: Partial<ServiceQuery> }[] = [];
  const labelOf = (list: { slug: string; label: string }[], slug?: string) =>
    list.find((item) => item.slug === slug)?.label ?? slug ?? "";

  if (query.q) chips.push({ label: `“${query.q}”`, remove: { q: "" } });
  if (query.category) chips.push({ label: labelOf(CATEGORIES, query.category), remove: { category: undefined } });
  if (query.industry) chips.push({ label: labelOf(INDUSTRIES, query.industry), remove: { industry: undefined } });
  if (query.useCase) chips.push({ label: labelOf(USE_CASES, query.useCase), remove: { useCase: undefined } });
  if (query.urgency) chips.push({ label: labelOf(URGENCIES, query.urgency), remove: { urgency: undefined } });

  if (!chips.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-slate-600">Applied:</span>
      <ul className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <li key={chip.label}>
            <Link
              href={buildServicesHref(market, query, chip.remove)}
              scroll={false}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-slate-100 py-1 pr-2 pl-3 text-sm text-slate-800 hover:bg-slate-200"
            >
              {chip.label}
              <CloseIcon className="size-3.5" />
              <span className="sr-only">Remove filter</span>
            </Link>
          </li>
        ))}
      </ul>
      {chips.length > 1 && (
        <Link
          href={buildServicesHref(market, { sort: query.sort })}
          scroll={false}
          className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
        >
          Clear all
        </Link>
      )}
    </div>
  );
}
