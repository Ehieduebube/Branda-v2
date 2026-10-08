import type { MetadataRoute } from "next";

import { MARKET_CODES } from "@/data/markets";
import { CATEGORIES } from "@/data/taxonomy";
import { getServiceSlugs } from "@/lib/catalog";
import { getLanguageAlternates, marketHref } from "@/lib/markets";
import { buildServicesHref } from "@/lib/service-query";
import { SITE_URL } from "@/lib/utils";

const absolute = (path: string) => new URL(path, SITE_URL).toString();

/**
 * Every indexable page in every market, each with hreflang alternates so
 * search engines serve /ng to Nigeria, /us to the USA, and so on.
 * Search, filter combinations, cart and checkout are deliberately excluded.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await getServiceSlugs();
  const paths = ["", "/services", ...slugs.map((slug) => `/services/${slug}`)];

  const withAlternates = (url: string, path: string) => ({
    url: absolute(url),
    alternates: {
      languages: Object.fromEntries(
        Object.entries(getLanguageAlternates(path)).map(([lang, href]) => [lang, absolute(href)]),
      ),
    },
  });

  return MARKET_CODES.flatMap((market) => [
    ...paths.map((path) => withAlternates(marketHref(market, path), path)),
    // Category landing pages are canonical on their own URL.
    ...CATEGORIES.map((category) => ({ url: absolute(buildServicesHref(market, { category: category.slug })) })),
  ]);
}
