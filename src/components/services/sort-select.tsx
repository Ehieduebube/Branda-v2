"use client";

import { useCatalogNavigation } from "@/components/services/catalog-navigation";
import { SORT_OPTIONS } from "@/data/taxonomy";
import { buildServicesHref } from "@/lib/service-query";
import type { MarketCode, ServiceQuery, SortOption } from "@/types";

export function SortSelect({ market, query }: { market: MarketCode; query: ServiceQuery }) {
  const { navigate } = useCatalogNavigation();
  // "Best match" is only meaningful while searching.
  const options = SORT_OPTIONS.filter((option) => option.value !== "relevance" || query.q);

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="shrink-0 text-sm text-slate-600">
        Sort by
      </label>
      <select
        id="sort"
        value={query.sort}
        onChange={(event) =>
          navigate(buildServicesHref(market, query, { sort: event.target.value as SortOption }))
        }
        className="min-h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 hover:border-slate-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
