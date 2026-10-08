"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

import { OrderSummary } from "@/components/cart/order-summary";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CheckIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useLastOrder } from "@/lib/cart-store";
import { getMarket, marketHref } from "@/lib/markets";
import type { MarketCode } from "@/types";

/**
 * Reads the confirmed order from sessionStorage, so the confirmation
 * survives a refresh but doesn't linger across browser sessions.
 */
export function OrderConfirmation({ market: code }: { market: MarketCode }) {
  const order = useLastOrder();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const hasOrder = !!order && order.market === code;

  // Move focus to the confirmation so screen reader users hear the outcome.
  useEffect(() => {
    if (hasOrder) headingRef.current?.focus();
  }, [hasOrder]);

  if (order === null) {
    return (
      <div role="status" aria-label="Loading your order" className="space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!hasOrder) {
    return (
      <EmptyState
        headingLevel="h1"
        title="No recent order to show"
        description="Order confirmations are shown for the browser session in which the order was placed. Browse our services to start a new order."
        actions={
          <Link href={marketHref(code, "/services")} className={buttonClasses()}>
            Browse services
          </Link>
        }
      />
    );
  }

  const market = getMarket(order.market);
  const placedAt = new Intl.DateTimeFormat(market.locale, { dateStyle: "long", timeStyle: "short" }).format(
    new Date(order.placedAt),
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div>
        <div className="flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-700" aria-hidden="true">
          <CheckIcon className="size-8" />
        </div>
        <h1 ref={headingRef} tabIndex={-1} className="mt-5 text-3xl font-bold tracking-tight text-slate-900 outline-none">
          Thank you, {order.contact.name.split(" ")[0]} — your order is confirmed
        </h1>
        <p className="mt-3 text-slate-600">
          Our team will contact you at <strong className="text-slate-900">{order.contact.email}</strong> about next steps
          and artwork proofs.
        </p>
        <p className="mt-2 text-sm text-slate-600">
          This is a demo order: no payment was taken and no email is sent.
        </p>

        <dl className="mt-8 grid gap-4 rounded-2xl border border-slate-200 p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm text-slate-600">Order number</dt>
            <dd className="mt-0.5 font-mono text-lg font-semibold text-slate-900">{order.id}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate-600">Placed</dt>
            <dd className="mt-0.5 font-medium text-slate-900">{placedAt}</dd>
          </div>
          {order.contact.company && (
            <div>
              <dt className="text-sm text-slate-600">Company</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{order.contact.company}</dd>
            </div>
          )}
          <div>
            <dt className="text-sm text-slate-600">Market</dt>
            <dd className="mt-0.5 font-medium text-slate-900">
              {market.country} ({market.currency.code})
            </dd>
          </div>
        </dl>

        <h2 className="mt-8 text-lg font-semibold text-slate-900">What happens next</h2>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-slate-700">
          <li>Our team reviews your order and contacts you about artwork or briefs.</li>
          <li>You approve a proof or concept before anything is produced.</li>
          <li>We produce and deliver within each service&apos;s turnaround.</li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={marketHref(code, "/services")} className={buttonClasses()}>
            Continue browsing
          </Link>
          <Link href={marketHref(code)} className={buttonClasses({ variant: "secondary" })}>
            Back to homepage
          </Link>
        </div>
      </div>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary lines={order.lines} totals={order.totals} market={market} title="Order details" />
      </div>
    </div>
  );
}
