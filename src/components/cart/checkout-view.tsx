"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, useTransition, type ComponentProps } from "react";

import { placeOrder } from "@/app/[market]/checkout/actions";
import { OrderSummary } from "@/components/cart/order-summary";
import { buttonClasses } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { CartIcon } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { calculateTotals } from "@/lib/cart";
import { saveLastOrder, useCart } from "@/lib/cart-store";
import {
  CONTACT_LIMITS,
  readContact,
  toOrderLineInput,
  validateContact,
  type ContactDetails,
  type ContactErrors,
} from "@/lib/checkout";
import { formatMoney } from "@/lib/currency";
import { getMarket, marketHref } from "@/lib/markets";
import type { MarketCode } from "@/types";

export function CheckoutView({ market: code }: { market: MarketCode }) {
  const market = getMarket(code);
  const router = useRouter();
  const { lines, clear, applyPrices } = useCart(code);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const messageRef = useRef<HTMLDivElement>(null);

  if (lines === null) return <CheckoutSkeleton />;

  if (lines.length === 0 && !isConfirmed) {
    return (
      <EmptyState
        icon={<CartIcon className="size-6" />}
        title="There's nothing to check out yet"
        description="Your cart is empty. Add a service to your cart, then come back here to place your order."
        actions={
          <Link href={marketHref(code, "/services")} className={buttonClasses()}>
            Browse services
          </Link>
        }
      />
    );
  }

  const totals = calculateTotals(lines, market);

  function focusFirstError(fieldErrors: ContactErrors) {
    const first = (Object.keys(fieldErrors) as (keyof ContactDetails)[])[0];
    if (first) document.getElementById(`checkout-${first}`)?.focus();
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!lines?.length) return;
    const contact = readContact(new FormData(event.currentTarget));

    // Instant feedback with the same rules the server enforces.
    const clientErrors = validateContact(contact);
    setErrors(clientErrors);
    if (Object.keys(clientErrors).length) {
      setFormMessage("Please correct the highlighted fields.");
      focusFirstError(clientErrors);
      return;
    }

    setFormMessage(null);
    startTransition(async () => {
      try {
        const result = await placeOrder({ market: code, contact, lines: lines.map(toOrderLineInput) });

        if (result.status === "success") {
          setIsConfirmed(true);
          saveLastOrder(result.order);
          clear();
          router.replace(marketHref(code, "/checkout/confirmation"));
          return;
        }
        if (result.status === "invalid") {
          setErrors(result.errors);
          focusFirstError(result.errors);
        }
        if (result.status === "price-changed") applyPrices(result.prices);
        setFormMessage(result.message);
      } catch {
        setFormMessage("We couldn't reach our servers. Check your connection and try again — your cart is saved.");
      }
      messageRef.current?.focus();
    });
  }

  if (isConfirmed) return <CheckoutSkeleton label="Confirming your order" />;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <form onSubmit={handleSubmit} noValidate className="min-w-0" aria-describedby={formMessage ? "checkout-message" : undefined}>
        <div ref={messageRef} tabIndex={-1} className="outline-none">
          {formMessage && (
            <div
              id="checkout-message"
              role="alert"
              className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800"
            >
              {formMessage}
            </div>
          )}
        </div>

        <fieldset className="min-w-0 space-y-5" disabled={isPending}>
          <legend className="text-lg font-semibold text-slate-900">Contact details</legend>
          <p className="text-sm text-slate-600">
            We&apos;ll send your order confirmation and artwork proofs here. Fields marked * are required.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field name="name" label="Full name *" error={errors.name} autoComplete="name" required maxLength={CONTACT_LIMITS.name} />
            <Field name="email" label="Email *" error={errors.email} type="email" autoComplete="email" required maxLength={CONTACT_LIMITS.email} />
            <Field name="phone" label="Phone" error={errors.phone} type="tel" autoComplete="tel" maxLength={CONTACT_LIMITS.phone} />
            <Field name="company" label="Company" error={errors.company} autoComplete="organization" maxLength={CONTACT_LIMITS.company} />
          </div>
          <Field
            name="notes"
            label="Project notes"
            hint="Brand colours, deadlines or delivery details."
            error={errors.notes}
            multiline
            maxLength={CONTACT_LIMITS.notes}
          />
        </fieldset>

        <div className="mt-8 rounded-2xl border border-slate-200 p-5">
          <p className="text-sm text-slate-600">
            Payment isn&apos;t collected in this demo. Confirming creates a mock order and shows its confirmation.
          </p>
          <button
            type="submit"
            disabled={isPending}
            aria-disabled={isPending}
            className={buttonClasses({ size: "lg", className: "mt-4 w-full" })}
          >
            {isPending ? "Placing order…" : `Confirm order · ${formatMoney(totals.total, market)}`}
          </button>
          <Link href={marketHref(code, "/cart")} className="mt-4 inline-block text-sm font-semibold text-brand-700 hover:underline">
            ← Back to cart
          </Link>
        </div>
      </form>

      <div className="lg:sticky lg:top-24 lg:self-start">
        <OrderSummary lines={lines} totals={totals} market={market} />
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  error,
  hint,
  multiline = false,
  ...inputProps
}: {
  name: keyof ContactDetails;
  label: string;
  error?: string;
  hint?: string;
  multiline?: boolean;
} & Omit<ComponentProps<"input">, "name">) {
  const hintId = useId();
  const errorId = useId();
  const id = `checkout-${name}`;
  const describedBy = [hint && hintId, error && errorId].filter(Boolean).join(" ") || undefined;
  const className = `mt-1.5 w-full rounded-lg border bg-white px-3 py-2.5 text-base text-slate-900 disabled:bg-slate-50 ${
    error ? "border-red-600" : "border-slate-300 hover:border-slate-400"
  }`;

  return (
    <div className={multiline ? "sm:col-span-2" : undefined}>
      <label htmlFor={id} className="block text-sm font-medium text-slate-800">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-slate-600">
          {hint}
        </p>
      )}
      {multiline ? (
        <textarea
          id={id}
          name={name}
          rows={4}
          maxLength={inputProps.maxLength}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      ) : (
        <input
          id={id}
          name={name}
          type="text"
          {...inputProps}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={className}
        />
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

function CheckoutSkeleton({ label = "Loading checkout" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <div className="space-y-5">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-80 w-full rounded-2xl" />
    </div>
  );
}
