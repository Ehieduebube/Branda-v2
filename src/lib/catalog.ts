import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { SERVICE_RECORDS } from "@/data/services";
import { URGENCIES } from "@/data/taxonomy";
import { getMarket } from "@/lib/markets";
import { applyDiscount, localizePrice } from "@/lib/pricing";
import { buildSearchIndex, searchIndex } from "@/lib/search";
import type {
  CategorySlug,
  Market,
  MarketCode,
  Service,
  ServiceQuery,
  ServiceRecord,
  ServiceSearchResult,
} from "@/types";

/**
 * Catalog data-access layer. Pages and components call these functions and
 * never import mock data directly, so switching to a real API/CMS only
 * changes `fetchServiceRecords` (and possibly moves filtering server-side).
 */

export const PAGE_SIZE = 9;

async function fetchServiceRecords(): Promise<ServiceRecord[]> {
  // Real implementation, e.g.:
  //   const res = await fetch(`${process.env.CATALOG_API_URL}/services`);
  //   if (!res.ok) throw new Error(`Catalog request failed: ${res.status}`);
  //   return res.json();
  return SERVICE_RECORDS;
}

function localizeService(record: ServiceRecord, market: Market): Service {
  const optionGroups = record.optionGroups.map((group) => ({
    id: group.id,
    label: group.label,
    choices: group.choices.map(({ priceUSD, ...choice }) => ({
      ...choice,
      price: localizePrice(priceUSD, market),
    })),
  }));

  const cheapest = optionGroups.reduce(
    (sum, group) => sum + Math.min(...group.choices.map((c) => c.price)),
    0,
  );
  const startingPrice = applyDiscount(cheapest, record.discount?.percent, market);

  return {
    ...record,
    market: market.code,
    optionGroups,
    startingPrice,
    startingPriceBeforeDiscount: startingPrice !== cheapest ? cheapest : undefined,
  };
}

/**
 * All services priced for a market. Cached across requests: catalog content
 * changes rarely, and `revalidateTag("catalog")` from a CMS webhook would
 * refresh it on demand.
 */
export async function getServices(marketCode: MarketCode): Promise<Service[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("catalog", `catalog:${marketCode}`);

  const market = getMarket(marketCode);
  const records = await fetchServiceRecords();
  return records.map((record) => localizeService(record, market));
}

export async function getService(marketCode: MarketCode, slug: string): Promise<Service | undefined> {
  const services = await getServices(marketCode);
  return services.find((service) => service.slug === slug);
}

export async function getServiceSlugs(): Promise<string[]> {
  const records = await fetchServiceRecords();
  return records.map((record) => record.slug);
}

/** Resolve slugs to services, preserving order and skipping unknown slugs. */
function pickBySlugs(services: Service[], slugs: string[]): Service[] {
  const bySlug = new Map(services.map((service) => [service.slug, service]));
  return slugs.flatMap((slug) => bySlug.get(slug) ?? []);
}

export async function getFeaturedServices(marketCode: MarketCode): Promise<Service[]> {
  const services = await getServices(marketCode);
  return pickBySlugs(services, getMarket(marketCode).content.featuredSlugs);
}

/**
 * Curated alternatives first, topped up with the most popular services from
 * the same category so the section is never sparse.
 */
export async function getRelatedServices(
  marketCode: MarketCode,
  service: Service,
  limit = 3,
): Promise<Service[]> {
  const services = await getServices(marketCode);
  const curated = pickBySlugs(services, service.related);
  const exclude = new Set([service.slug, ...service.complementary, ...curated.map((s) => s.slug)]);
  const sameCategory = services
    .filter((s) => s.category === service.category && !exclude.has(s.slug))
    .sort((a, b) => b.popularity - a.popularity);
  return [...curated, ...sameCategory].slice(0, limit);
}

/** Services customers order alongside this one — curated per service. */
export async function getComplementaryServices(marketCode: MarketCode, service: Service): Promise<Service[]> {
  const services = await getServices(marketCode);
  return pickBySlugs(services, service.complementary);
}

const SORTERS: Record<
  ServiceQuery["sort"],
  (a: { service: Service; score: number }, b: { service: Service; score: number }) => number
> = {
  relevance: (a, b) => b.score - a.score || b.service.popularity - a.service.popularity,
  popular: (a, b) => b.service.popularity - a.service.popularity,
  "price-low": (a, b) =>
    a.service.startingPrice - b.service.startingPrice || b.service.popularity - a.service.popularity,
  "price-high": (a, b) =>
    b.service.startingPrice - a.service.startingPrice || b.service.popularity - a.service.popularity,
};

/** Search, filter, sort and paginate the catalog for one listing URL. */
export async function searchServices(
  marketCode: MarketCode,
  query: ServiceQuery,
): Promise<ServiceSearchResult> {
  const services = await getServices(marketCode);
  const maxDays = URGENCIES.find((u) => u.slug === query.urgency)?.maxDays;

  // Every filter except category, so category chips can show live counts.
  const matches = searchIndex(buildSearchIndex(services), query.q).filter(
    ({ service }) =>
      (!query.industry || service.industries.includes(query.industry)) &&
      (!query.useCase || service.useCases.includes(query.useCase)) &&
      (!maxDays || service.turnaround.maxDays <= maxDays),
  );

  const categoryCounts = { digital: 0, gifts: 0, create: 0, studio: 0, prints: 0 } satisfies Record<
    CategorySlug,
    number
  >;
  for (const { service } of matches) categoryCounts[service.category] += 1;

  const filtered = query.category
    ? matches.filter(({ service }) => service.category === query.category)
    : matches;

  const sorted = filtered.sort(SORTERS[query.sort]);
  const total = sorted.length;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (query.page - 1) * PAGE_SIZE;

  return {
    items: sorted.slice(start, start + PAGE_SIZE).map(({ service }) => service),
    total,
    page: query.page,
    pageCount,
    pageSize: PAGE_SIZE,
    categoryCounts,
  };
}
