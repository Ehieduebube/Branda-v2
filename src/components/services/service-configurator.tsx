"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonClasses } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { createLineKey, getLineTotal } from "@/lib/cart";
import { useCart } from "@/lib/cart-store";
import { getMarket, marketHref } from "@/lib/markets";
import { computeUnitPrice, defaultSelections, type Selections } from "@/lib/pricing";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

/**
 * The only interactive part of the detail page. It receives a service that
 * is already priced for the market (from the server) and uses the shared
 * pricing functions, so the price shown here is computed exactly as the
 * cart and the server-side order check compute it.
 */
export function ServiceConfigurator({ service }: { service: Service }) {
  const router = useRouter();
  const market = getMarket(service.market);
  const { add } = useCart(service.market);

  const [selections, setSelections] = useState<Selections>(() => defaultSelections(service.optionGroups));
  const [quantity, setQuantity] = useState(service.quantity.min);
  const [addedKey, setAddedKey] = useState<string | null>(null);

  // Defaults always resolve; null only if option data were inconsistent.
  const price = computeUnitPrice(service, selections, market);
  if (!price) return null;

  const lineKey = createLineKey(service.slug, price.selected);
  const total = getLineTotal({ unitPrice: price.unitPrice, quantity });
  const totalBeforeDiscount = price.unitPriceBeforeDiscount
    ? getLineTotal({ unitPrice: price.unitPriceBeforeDiscount, quantity })
    : undefined;
  const unitLabel = (n: number) => (n === 1 ? service.quantity.unit : service.quantity.unitPlural);

  function addToCart() {
    if (!price) return;
    add({
      key: lineKey,
      slug: service.slug,
      name: service.name,
      image: service.images[0],
      selections: price.selected,
      unitPrice: price.unitPrice,
      quantity,
      minQuantity: service.quantity.min,
      maxQuantity: service.quantity.max,
      unit: service.quantity.unit,
      unitPlural: service.quantity.unitPlural,
    });
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        addToCart();
        setAddedKey(lineKey);
      }}
      className="space-y-6"
    >
      {service.optionGroups.map((group, groupIndex) => (
        <fieldset key={group.id}>
          <legend className="text-sm font-semibold text-slate-900">{group.label}</legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {group.choices.map((choice) => {
              const checked = selections[group.id] === choice.id;
              return (
                <label
                  key={choice.id}
                  className={cn(
                    "relative flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-brand-700",
                    checked ? "border-brand-700 bg-brand-50" : "border-slate-300 hover:border-slate-400",
                  )}
                >
                  <input
                    type="radio"
                    name={group.id}
                    value={choice.id}
                    checked={checked}
                    onChange={() => {
                      setSelections((current) => ({ ...current, [group.id]: choice.id }));
                      setAddedKey(null);
                    }}
                    className="mt-0.5 size-4 accent-brand-700 focus-visible:outline-none"
                  />
                  <span className="flex-1">
                    <span className="block text-sm font-medium text-slate-900">{choice.label}</span>
                    {choice.detail && <span className="block text-xs text-slate-600">{choice.detail}</span>}
                  </span>
                  <span className="text-sm text-slate-700">
                    {/* The first group sets the base price; later groups are add-ons. */}
                    {groupIndex === 0 ? (
                      <Price amount={choice.price} market={market} className="font-medium" />
                    ) : choice.price === 0 ? (
                      "Included"
                    ) : (
                      <>
                        +<Price amount={choice.price} market={market} className="font-medium" />
                      </>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      ))}

      <div>
        <p className="text-sm font-semibold text-slate-900">
          Quantity <span className="font-normal text-slate-600">({service.quantity.unitPlural})</span>
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={quantity}
            min={service.quantity.min}
            max={service.quantity.max}
            label={`Quantity of ${service.quantity.unitPlural}`}
            onChange={(next) => {
              setQuantity(next);
              setAddedKey(null);
            }}
          />
          <span className="text-sm text-slate-600">
            {service.quantity.min > 1 ? `Minimum ${service.quantity.min}, ` : ""}maximum{" "}
            {service.quantity.max.toLocaleString("en")}
          </span>
        </div>
      </div>

      {/* Sticky on phones so the price and actions stay reachable while choosing options. */}
      <div className="sticky bottom-0 -mx-4 border-t border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:static sm:mx-0 sm:rounded-2xl sm:border sm:bg-slate-50 sm:p-5">
        <div className="flex items-end justify-between gap-4" aria-live="polite" aria-atomic="true">
          <div>
            <p className="text-sm text-slate-600">
              Total for {quantity.toLocaleString("en")} {unitLabel(quantity)}
            </p>
            <Price amount={total} original={totalBeforeDiscount} market={market} className="text-2xl" />
          </div>
          <p className="text-right text-sm text-slate-600">
            <Price amount={price.unitPrice} market={market} className="font-medium text-slate-700" /> per{" "}
            {service.quantity.unit}
          </p>
        </div>
        <p className="mt-1 text-xs text-slate-600">{market.tax.label} is added at checkout.</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <button type="submit" className={buttonClasses({ variant: "secondary", size: "lg" })}>
            Add to cart
          </button>
          <button
            type="button"
            onClick={() => {
              addToCart();
              router.push(marketHref(service.market, "/checkout"));
            }}
            className={buttonClasses({ size: "lg" })}
          >
            Order now
          </button>
        </div>

        <div role="status" className="min-h-0">
          {addedKey === lineKey && (
            <p className="mt-3 flex flex-wrap items-center gap-x-2 text-sm text-brand-800">
              <CheckIcon className="size-4" />
              Added to your cart.
              <Link href={marketHref(service.market, "/cart")} className="font-semibold underline underline-offset-2">
                View cart
              </Link>
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
