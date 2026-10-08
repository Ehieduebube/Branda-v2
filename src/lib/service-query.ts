import { CATEGORIES, INDUSTRIES, SORT_OPTIONS, URGENCIES, USE_CASES } from "@/data/taxonomy";
import { marketHref } from "@/lib/markets";
import type {
  CategorySlug,
  IndustrySlug,
  MarketCode,
  ServiceQuery,
  SortOption,
  UrgencySlug,
  UseCaseSlug,
} from "@/types";

/**
 * The service listing's state lives in the URL. This module is the only place
 * that knows the parameter names, so links, forms and the server agree.
 *
 *   /ng/services?q=business+cards&category=prints&industry=real-estate
 *               &use-case=events&urgency=express&sort=price-low&page=2
 */

export const PARAM = {
  q: "q",
  category: "category",
  industry: "industry",
  useCase: "use-case",
  urgency: "urgency",
  sort: "sort",
  page: "page",
} as const;

export const MAX_QUERY_LENGTH = 80;

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function oneOf<T extends string>(value: string | undefined, allowed: readonly { slug: T }[]): T | undefined {
  return allowed.find((item) => item.slug === value)?.slug;
}

/** Default sort: relevance when searching, otherwise popularity. */
export function defaultSort(q: string): SortOption {
  return q ? "relevance" : "popular";
}

/**
 * Parse untrusted search params. Unknown or malformed values are ignored
 * rather than erroring, so a hand-edited or outdated URL still renders.
 */
export function parseServiceQuery(params: RawSearchParams): ServiceQuery {
  const q = (first(params[PARAM.q]) ?? "").trim().slice(0, MAX_QUERY_LENGTH);

  const sortParam = first(params[PARAM.sort]);
  const sortIsValid = SORT_OPTIONS.some((option) => option.value === sortParam);
  // "Best match" only makes sense with a search term.
  const sort =
    sortIsValid && !(sortParam === "relevance" && !q) ? (sortParam as SortOption) : defaultSort(q);

  const page = Number.parseInt(first(params[PARAM.page]) ?? "1", 10);

  return {
    q,
    category: oneOf<CategorySlug>(first(params[PARAM.category]), CATEGORIES),
    industry: oneOf<IndustrySlug>(first(params[PARAM.industry]), INDUSTRIES),
    useCase: oneOf<UseCaseSlug>(first(params[PARAM.useCase]), USE_CASES),
    urgency: oneOf<UrgencySlug>(first(params[PARAM.urgency]), URGENCIES),
    sort,
    page: Number.isFinite(page) && page > 0 ? page : 1,
  };
}

/**
 * Build a listing URL from the current query plus overrides. Any filter change
 * resets to page 1 unless `page` is overridden explicitly. Defaults are
 * omitted so equivalent states share one URL.
 */
export function buildServicesHref(
  market: MarketCode,
  current: Partial<ServiceQuery>,
  overrides: Partial<ServiceQuery> = {},
): string {
  const next = { ...current, page: 1, ...overrides };
  const q = next.q?.trim() ?? "";
  const params = new URLSearchParams();

  if (q) params.set(PARAM.q, q);
  if (next.category) params.set(PARAM.category, next.category);
  if (next.industry) params.set(PARAM.industry, next.industry);
  if (next.useCase) params.set(PARAM.useCase, next.useCase);
  if (next.urgency) params.set(PARAM.urgency, next.urgency);
  const sort = next.sort === "relevance" && !q ? undefined : next.sort;
  if (sort && sort !== defaultSort(q)) params.set(PARAM.sort, sort);
  if (next.page && next.page > 1) params.set(PARAM.page, String(next.page));

  const search = params.toString();
  return marketHref(market, `/services${search ? `?${search}` : ""}`);
}

/** Number of narrowing filters applied (excludes search, sort and page). */
export function countActiveFilters(query: ServiceQuery): number {
  return [query.category, query.industry, query.useCase, query.urgency].filter(Boolean).length;
}
