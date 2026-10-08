import { NextResponse, type NextRequest } from "next/server";

import { DEFAULT_MARKET } from "@/data/markets";
import { SERVICE_RECORDS } from "@/data/services";
import { isMarketCode, MARKET_COOKIE, marketFromCountry } from "@/lib/markets";

/**
 * Runs before rendering, which makes it the right place for two things:
 *
 * 1. Market routing for URLs without a market prefix ("/", "/services/...").
 *    Preference: the visitor's saved choice, then the CDN's geo-IP country
 *    header, then the default market. Prefixed URLs are never redirected, so
 *    shared links always open the market they were shared from.
 *
 * 2. Real 404 status codes. With Partial Prerendering an unknown param is
 *    served the static App Shell first, which commits a 200 before the page
 *    can call `notFound()`. Checking here (a Set lookup, no data fetching)
 *    lets unknown markets and services return 404s that crawlers respect.
 */

const MARKETLESS_SECTIONS = new Set(["", "services", "cart", "checkout"]);

// Mock catalog: slugs come from the data module. With a real CMS this would be
// a slug manifest generated at build time or read from an edge key-value store.
const SERVICE_SLUGS = new Set(SERVICE_RECORDS.map((service) => service.slug));

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const [first = "", second, third, ...rest] = pathname.split("/").slice(1);

  if (isMarketCode(first)) {
    const isUnknownService = second === "services" && third && !rest.length && !SERVICE_SLUGS.has(third);
    if (isUnknownService) {
      return NextResponse.rewrite(new URL(`/${first}/services/unavailable`, request.url));
    }
    return NextResponse.next();
  }

  // Unknown prefix (e.g. "/fr"): render the root 404, which lists our markets.
  if (!MARKETLESS_SECTIONS.has(first)) {
    return NextResponse.rewrite(new URL("/_not-found", request.url));
  }

  const saved = request.cookies.get(MARKET_COOKIE)?.value;
  const market = isMarketCode(saved)
    ? saved
    : (marketFromCountry(request.headers.get("x-vercel-ip-country") ?? request.headers.get("cf-ipcountry")) ??
      DEFAULT_MARKET);

  const url = request.nextUrl.clone();
  url.pathname = `/${market}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  // 307: the target depends on the visitor, so it must not be cached as permanent.
  const response = NextResponse.redirect(url, 307);
  response.headers.set("Vary", "Cookie");
  return response;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (assets).
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
