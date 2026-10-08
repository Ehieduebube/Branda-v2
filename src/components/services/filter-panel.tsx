"use client";

import { useId, useState } from "react";

import { useCatalogNavigation } from "@/components/services/catalog-navigation";
import { buttonClasses } from "@/components/ui/button";
import { FilterIcon } from "@/components/ui/icons";
import { INDUSTRIES, URGENCIES, USE_CASES } from "@/data/taxonomy";
import { marketHref } from "@/lib/markets";
import { buildServicesHref, PARAM } from "@/lib/service-query";
import type { MarketCode, ServiceQuery } from "@/types";

type FilterKey = "industry" | "useCase" | "urgency";

const FILTERS: { key: FilterKey; param: string; label: string; anyLabel: string; options: { slug: string; label: string }[] }[] = [
  { key: "industry", param: PARAM.industry, label: "Industry", anyLabel: "All industries", options: INDUSTRIES },
  { key: "useCase", param: PARAM.useCase, label: "Use case", anyLabel: "All use cases", options: USE_CASES },
  { key: "urgency", param: PARAM.urgency, label: "Turnaround", anyLabel: "Any turnaround", options: URGENCIES },
];

/**
 * Secondary filters. On desktop they sit in a sidebar; on phones and tablets
 * they collapse behind a "Filters" toggle so results stay above the fold.
 * Each change navigates immediately; without JS the form submits via GET.
 */
export function FilterPanel({
  market,
  query,
  activeCount,
}: {
  market: MarketCode;
  query: ServiceQuery;
  activeCount: number;
}) {
  const { navigate } = useCatalogNavigation();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const secondaryCount = FILTERS.filter((f) => query[f.key]).length;

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        className={buttonClasses({ variant: "secondary", className: "w-full lg:hidden" })}
      >
        <FilterIcon className="size-4" />
        {open ? "Hide filters" : "Filters"}
        {secondaryCount > 0 && (
          <span className="rounded-full bg-brand-700 px-2 py-0.5 text-xs text-white">{secondaryCount}</span>
        )}
      </button>

      <form
        id={panelId}
        action={marketHref(market, "/services")}
        className={`${open ? "block" : "hidden"} mt-3 space-y-5 rounded-2xl border border-slate-200 bg-white p-4 lg:mt-0 lg:block lg:border-0 lg:p-0`}
        onSubmit={(event) => event.preventDefault()}
      >
        <h2 className="hidden text-sm font-semibold text-slate-900 lg:block">Refine results</h2>
        {query.q && <input type="hidden" name={PARAM.q} value={query.q} />}
        {query.category && <input type="hidden" name={PARAM.category} value={query.category} />}

        {FILTERS.map((filter) => (
          <FilterSelect
            key={filter.key}
            label={filter.label}
            name={filter.param}
            value={query[filter.key] ?? ""}
            anyLabel={filter.anyLabel}
            options={filter.options}
            onChange={(value) =>
              navigate(buildServicesHref(market, query, { [filter.key]: value || undefined }))
            }
          />
        ))}

        <noscript>
          <button type="submit" className={buttonClasses({ className: "w-full" })}>
            Apply filters
          </button>
        </noscript>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => navigate(buildServicesHref(market, { q: query.q, sort: query.sort }))}
            className="text-sm font-semibold text-brand-700 underline-offset-2 hover:underline"
          >
            Clear all filters
          </button>
        )}
      </form>
    </div>
  );
}

function FilterSelect({
  label,
  name,
  value,
  anyLabel,
  options,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  anyLabel: string;
  options: { slug: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1.5 min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 hover:border-slate-400"
      >
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.slug} value={option.slug}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
