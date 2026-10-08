"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DEFAULT_MARKET } from "@/data/markets";
import { CATEGORIES } from "@/data/taxonomy";
import { isMarketCode, marketHref } from "@/lib/markets";
import { buildServicesHref } from "@/lib/service-query";

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

/**
 * Unknown service slug (e.g. /ng/services/does-not-exist), thrown by the
 * proxy rewrite to `services/unavailable`. `not-found` files don't receive
 * props, so the market and slug are read from the URL to keep the user in the
 * market they were browsing.
 */
export default function ServiceNotFound() {
  const params = useParams<{ market: string }>();
  const pathname = usePathname();
  const market = isMarketCode(params.market) ? params.market : DEFAULT_MARKET;
  // The proxy rewrites unknown slugs, so read the slug from the visible URL.
  const lastSegment = pathname.split("/").filter(Boolean).at(-1) ?? "";
  const attempted = ["services", "unavailable"].includes(lastSegment) ? "" : safeDecode(lastSegment).replace(/-/g, " ").trim().slice(0, 60);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        headingLevel="h1"
        title="This service isn't available"
        description="The service may have been renamed or retired, or the link may contain a typo. Search for it or browse a category instead."
        actions={
          <>
            {attempted && (
              <Link href={buildServicesHref(market, { q: attempted })} className={buttonClasses()}>
                Search for “{attempted}”
              </Link>
            )}
            <Link
              href={marketHref(market, "/services")}
              className={buttonClasses({ variant: attempted ? "secondary" : "primary" })}
            >
              Browse all services
            </Link>
          </>
        }
      />
      <nav aria-label="Categories" className="mt-8">
        <ul className="flex flex-wrap justify-center gap-2">
          {CATEGORIES.map((category) => (
            <li key={category.slug}>
              <Link
                href={buildServicesHref(market, { category: category.slug })}
                className="inline-flex min-h-10 items-center rounded-full border border-slate-300 px-4 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {category.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
