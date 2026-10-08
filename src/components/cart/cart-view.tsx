"use client";

import Image from "next/image";
import Link from "next/link";

import { SelectedOptions, TotalsTable } from "@/components/cart/order-summary";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartIcon, TrashIcon } from "@/components/ui/icons";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTotals, getLineTotal } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { formatMoney } from "@/lib/currency";
import { getMarket, marketHref } from "@/lib/markets";
import type { MarketCode } from "@/types";

export function CartView({ market: code }: { market: MarketCode }) {
  const market = getMarket(code);
  const { lines, setQuantity, remove } = useCart(code);

  // Server render and hydration: storage hasn't been read yet.
  if (lines === null) return <CartSkeleton />;

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<CartIcon className="size-6" />}
        title="Your cart is empty"
        description="Browse our print, gifts, creative, digital and studio services, configure what you need and add it here."
        actions={
          <Link href={marketHref(code, "/services")} className={buttonClasses()}>
            Browse services
          </Link>
        }
      />
    );
  }

  const totals = calculateTotals(lines, market);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <section aria-labelledby="cart-items-heading">
        <h2 id="cart-items-heading" className="sr-only">
          Items in your cart
        </h2>
        <ul className="divide-y divide-slate-200 border-y border-slate-200">
          {lines.map((line) => (
            <li key={line.key} className="flex gap-4 py-5">
              <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:size-28">
                <Image src={line.image.src} alt={line.image.alt} fill sizes="(min-width: 640px) 112px, 80px" quality={70} className="object-cover" />
              </div>

              <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:justify-between">
                <div className="min-w-0">
                  <h3 className="font-semibold text-slate-900">
                    <Link href={marketHref(code, `/services/${line.slug}`)} className="hover:underline">
                      {line.name}
                    </Link>
                  </h3>
                  <SelectedOptions selections={line.selections} />
                  <p className="mt-1 text-sm text-slate-600">
                    {formatMoney(line.unitPrice, market)} per {line.unit}
                    {line.minQuantity > 1 && ` · min. ${line.minQuantity}`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:flex-col sm:items-end">
                  <QuantityStepper
                    size="sm"
                    value={line.quantity}
                    min={line.minQuantity}
                    max={line.maxQuantity}
                    onChange={(quantity) => setQuantity(line.key, quantity)}
                    label={`Quantity for ${line.name}`}
                  />
                  <p className="font-semibold text-slate-900">
                    <span className="sr-only">Line total: </span>
                    {formatMoney(getLineTotal(line), market)}
                  </p>
                  <button
                    type="button"
                    onClick={() => remove(line.key)}
                    className="inline-flex min-h-9 items-center gap-1.5 rounded-lg px-2 text-sm font-medium text-red-700 hover:bg-red-50"
                  >
                    <TrashIcon className="size-4" />
                    Remove<span className="sr-only"> {line.name}</span>
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <Link
          href={marketHref(code, "/services")}
          className="mt-6 inline-block text-sm font-semibold text-brand-700 hover:underline"
        >
          ← Continue shopping
        </Link>
      </section>

      <aside aria-labelledby="cart-totals-heading" className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <h2 id="cart-totals-heading" className="text-lg font-semibold text-slate-900">
            Order total
          </h2>
          <div aria-live="polite">
            <TotalsTable totals={totals} market={market} />
          </div>
          <Link href={marketHref(code, "/checkout")} className={buttonClasses({ size: "lg", className: "mt-6 w-full" })}>
            Proceed to checkout
          </Link>
        </div>
      </aside>
    </div>
  );
}

function CartSkeleton() {
  return (
    <div role="status" aria-label="Loading your cart" className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <div className="space-y-5">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="flex gap-4">
            <Skeleton className="size-20 rounded-xl sm:size-28" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        ))}
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
