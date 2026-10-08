import { DEFAULT_MARKET, MARKETS, MARKET_CODES } from "@/data/markets";
import type { Market, MarketCode } from "@/types";

export const MARKET_COOKIE = "branda-market";

export function isMarketCode(value: string | undefined | null): value is MarketCode {
  return !!value && (MARKET_CODES as string[]).includes(value);
}

export function getMarket(code: MarketCode): Market {
  return MARKETS[code];
}

export function listMarkets(): Market[] {
  return MARKET_CODES.map((code) => MARKETS[code]);
}

/** Prefix an app path with the market segment: ("ng", "/services") → "/ng/services". */
export function marketHref(market: MarketCode, path = ""): string {
  const suffix = path === "/" ? "" : path;
  return `/${market}${suffix}`;
}

/**
 * The equivalent URL in another market. Every market shares one route tree,
 * so the path maps 1:1 — except checkout, because carts are per market
 * (prices are in different currencies), which maps to the target market's cart.
 */
export function getEquivalentPath(pathname: string, target: MarketCode): string {
  const segments = pathname.split("/").filter(Boolean);
  if (isMarketCode(segments[0])) segments.shift();

  if (segments[0] === "checkout") return marketHref(target, "/cart");

  return marketHref(target, segments.length ? `/${segments.join("/")}` : "");
}

/**
 * hreflang alternates for a market-agnostic path, used by `generateMetadata`.
 * `x-default` points to the default market for unmatched locales.
 */
export function getLanguageAlternates(path: string): Record<string, string> {
  const alternates: Record<string, string> = {};
  for (const code of MARKET_CODES) {
    alternates[MARKETS[code].locale] = marketHref(code, path);
  }
  alternates["x-default"] = marketHref(DEFAULT_MARKET, path);
  return alternates;
}

/** Map an ISO 3166 country code (e.g. from a CDN geo header) to a market. */
export function marketFromCountry(country: string | null | undefined): MarketCode | undefined {
  switch (country?.toUpperCase()) {
    case "NG":
      return "ng";
    case "US":
      return "us";
    case "GB":
      return "uk";
    case "CA":
      return "ca";
    default:
      return undefined;
  }
}
