import type { Metadata } from "next";

import { getLanguageAlternates, marketHref } from "@/lib/markets";
import type { Market, ServiceImage } from "@/types";

/**
 * Consistent metadata for market pages: market-suffixed title, canonical URL
 * for this market, hreflang alternates for every market, and Open Graph.
 * Relative URLs resolve against `metadataBase` from the root layout.
 */
export function buildMarketMetadata({
  market,
  path,
  title,
  description,
  image,
  noIndex = false,
}: {
  market: Market;
  /** Market-agnostic path, e.g. "/services/business-cards". */
  path: string;
  title: string;
  description: string;
  image?: ServiceImage;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = `${title} | Branda ${market.country}`;
  const url = marketHref(market.code, path);

  return {
    // `absolute` bypasses the root template: the market suffix is the brand here.
    title: { absolute: fullTitle },
    description,
    alternates: {
      canonical: url,
      languages: getLanguageAlternates(path),
    },
    openGraph: {
      type: "website",
      siteName: "Branda",
      title: fullTitle,
      description,
      url,
      locale: market.locale.replace("-", "_"),
      images: image ? [{ url: ogImageUrl(image.src), width: 1200, height: 630, alt: image.alt }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: fullTitle,
      description,
    },
    robots: noIndex ? { index: false, follow: true } : undefined,
  };
}

/** Request a 1200×630 crop for social cards (the recommended OG size). */
function ogImageUrl(src: string): string {
  const url = new URL(src);
  url.searchParams.set("w", "1200");
  url.searchParams.set("h", "630");
  url.searchParams.set("fit", "crop");
  return url.toString();
}
