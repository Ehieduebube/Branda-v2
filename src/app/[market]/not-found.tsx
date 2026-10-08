"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { DEFAULT_MARKET } from "@/data/markets";
import { isMarketCode, marketHref } from "@/lib/markets";

export default function MarketNotFound() {
  const params = useParams<{ market: string }>();
  const market = isMarketCode(params.market) ? params.market : DEFAULT_MARKET;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <EmptyState
        headingLevel="h1"
        title="We couldn't find that page"
        description="The link may be outdated or mistyped. You can browse our services or head back to the homepage."
        actions={
          <>
            <Link href={marketHref(market, "/services")} className={buttonClasses()}>
              Browse services
            </Link>
            <Link href={marketHref(market)} className={buttonClasses({ variant: "secondary" })}>
              Go to homepage
            </Link>
          </>
        }
      />
    </div>
  );
}
