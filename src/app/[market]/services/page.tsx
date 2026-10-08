import type { Metadata } from "next";
import { Suspense } from "react";

import { CatalogSkeleton } from "@/components/services/catalog-skeleton";
import { ServiceCatalog } from "@/components/services/service-catalog";
import { CATEGORIES } from "@/data/taxonomy";
import { getMarket, isMarketCode } from "@/lib/markets";
import { buildServicesHref, parseServiceQuery } from "@/lib/service-query";
import { buildMarketMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
  searchParams,
}: PageProps<"/[market]/services">): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};
  const market = getMarket(code);
  const query = parseServiceQuery(await searchParams);
  const category = CATEGORIES.find((c) => c.slug === query.category);

  const metadata = buildMarketMetadata({
    market,
    path: "/services",
    title: category ? `${category.label} services` : "Branding services",
    description: category
      ? `${category.description} Order online from Branda ${market.country} with prices in ${market.currency.code}.`
      : `Browse print, gifts, creative, digital and workspace branding services from Branda ${market.country}. Prices in ${market.currency.code}.`,
    // Internal search results and deep filter combinations shouldn't be indexed.
    noIndex: Boolean(query.q || query.industry || query.useCase || query.urgency || query.page > 1),
  });

  // Category pages are worth indexing on their own URL.
  if (category && metadata.alternates) {
    metadata.alternates.canonical = buildServicesHref(code, { category: category.slug });
  }
  return metadata;
}

/**
 * Service listing. The heading and layout are prerendered (static shell);
 * results depend on the URL's search params, so they stream in behind a
 * skeleton and are server-rendered per request.
 */
export default async function ServicesPage({ params, searchParams }: PageProps<"/[market]/services">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) return null; // The market layout already 404s.
  const market = getMarket(code);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <header className="mb-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Branding services</h1>
        <p className="mt-2 text-slate-600">
          Configure and order print, gifts, creative, digital and workspace services. {market.content.serviceAreaNote}
        </p>
      </header>

      <Suspense fallback={<CatalogSkeleton />}>
        <ServiceCatalog market={code} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
