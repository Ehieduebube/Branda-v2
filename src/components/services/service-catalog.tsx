import Link from "next/link";

import { ActiveFilters } from "@/components/services/active-filters";
import { CatalogNavigationProvider, CatalogResultsRegion } from "@/components/services/catalog-navigation";
import { CategoryChips } from "@/components/services/category-chips";
import { FilterPanel } from "@/components/services/filter-panel";
import { Pagination } from "@/components/services/pagination";
import { SearchBox } from "@/components/services/search-box";
import { ServiceCard } from "@/components/services/service-card";
import { SortSelect } from "@/components/services/sort-select";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchIcon } from "@/components/ui/icons";
import { CATEGORIES } from "@/data/taxonomy";
import { searchServices } from "@/lib/catalog";
import { buildServicesHref, countActiveFilters, parseServiceQuery } from "@/lib/service-query";
import { pluralize } from "@/lib/utils";
import type { MarketCode } from "@/types";

/**
 * Server Component: reads the URL's search params, queries the catalog and
 * renders results. It sits inside <Suspense> so the page shell is prerendered
 * and this part streams in per request.
 */
export async function ServiceCatalog({
  market,
  searchParams,
}: {
  market: MarketCode;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = parseServiceQuery(await searchParams);
  const result = await searchServices(market, query);
  const activeCount = countActiveFilters(query);
  const category = CATEGORIES.find((c) => c.slug === query.category);
  const beyondLastPage = result.total > 0 && query.page > result.pageCount;

  const heading = query.q
    ? `Results for “${query.q}”${category ? ` in ${category.label}` : ""}`
    : category
      ? `${category.label} services`
      : "All services";

  return (
    <CatalogNavigationProvider>
      <div className="space-y-5">
        <SearchBox market={market} query={query} />
        <CategoryChips market={market} query={query} counts={result.categoryCounts} />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <aside aria-label="Filters" className="lg:sticky lg:top-24 lg:self-start">
          <FilterPanel market={market} query={query} activeCount={activeCount} />
        </aside>

        <CatalogResultsRegion label={heading}>
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-slate-900">{heading}</h2>
              {/* Announced to screen readers whenever results change. */}
              <p className="mt-1 text-sm text-slate-600" role="status">
                {pluralize(result.total, "service")} found
                {category && !query.q ? ` · ${category.description}` : ""}
              </p>
            </div>
            {result.total > 0 && (
              <div className="shrink-0">
                <SortSelect market={market} query={query} />
              </div>
            )}
          </div>

          <div className="mt-4">
            <ActiveFilters market={market} query={query} />
          </div>

          {result.total === 0 ? (
            <EmptyState
              className="mt-6"
              icon={<SearchIcon className="size-6" />}
              title="No services match your search"
              description={
                <>
                  {query.q ? (
                    <>
                      Nothing matched <strong>“{query.q}”</strong>
                      {activeCount ? " with the filters you selected" : ""}. Try a broader term like
                      “cards”, “gifts” or “website”, or remove a filter.
                    </>
                  ) : (
                    "No services fit this combination of filters. Remove a filter to see more options."
                  )}
                </>
              }
              actions={
                <>
                  {activeCount > 0 && query.q && (
                    <Link href={buildServicesHref(market, { q: query.q })} className={buttonClasses()}>
                      Search all categories
                    </Link>
                  )}
                  <Link
                    href={buildServicesHref(market, {})}
                    className={buttonClasses({ variant: activeCount > 0 && query.q ? "secondary" : "primary" })}
                  >
                    Browse all services
                  </Link>
                </>
              }
            />
          ) : beyondLastPage ? (
            <EmptyState
              className="mt-6"
              title={`Page ${query.page} doesn’t exist`}
              description={`These results only have ${pluralize(result.pageCount, "page")}.`}
              actions={
                <Link href={buildServicesHref(market, query, { page: result.pageCount })} className={buttonClasses()}>
                  Go to the last page
                </Link>
              }
            />
          ) : (
            <>
              <ul className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {result.items.map((service, index) => (
                  <li key={service.slug}>
                    <ServiceCard service={service} isLcpCandidate={index === 0 && query.page === 1} />
                  </li>
                ))}
              </ul>
              <Pagination market={market} query={query} pageCount={result.pageCount} />
            </>
          )}
        </CatalogResultsRegion>
      </div>
    </CatalogNavigationProvider>
  );
}
