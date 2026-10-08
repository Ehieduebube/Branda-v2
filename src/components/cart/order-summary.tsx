import Image from "next/image";
import type { ReactNode } from "react";

import { formatQuantity, getLineTotal } from "@/lib/cart";
import { formatMoney } from "@/lib/currency";
import type { CartTotals, Market, SelectedOption, ServiceImage } from "@/types";

interface SummaryLine {
  key: string;
  name: string;
  image: ServiceImage;
  selections: SelectedOption[];
  quantity: number;
  unit: string;
  unitPlural: string;
  unitPrice: number;
}

/**
 * Presentational order summary (no state), shared by checkout and the
 * confirmation screen. Totals are passed in — computed once by
 * `calculateTotals` — so every screen shows identical numbers.
 */
export function OrderSummary({
  lines,
  totals,
  market,
  title = "Order summary",
  footer,
}: {
  lines: SummaryLine[];
  totals: CartTotals;
  market: Market;
  title?: string;
  footer?: ReactNode;
}) {
  return (
    <section aria-labelledby="order-summary-heading" className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
      <h2 id="order-summary-heading" className="text-lg font-semibold text-slate-900">
        {title}
      </h2>

      <ul className="mt-4 divide-y divide-slate-200">
        {lines.map((line) => (
          <li key={line.key} className="flex gap-3 py-4 first:pt-0">
            <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
              <Image src={line.image.src} alt="" fill sizes="64px" quality={70} className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-slate-900">{line.name}</p>
              <SelectedOptions selections={line.selections} />
              <p className="mt-1 text-sm text-slate-600">
                {formatQuantity(line.quantity, line)} × {formatMoney(line.unitPrice, market)}
              </p>
            </div>
            <p className="text-right font-semibold text-slate-900">{formatMoney(getLineTotal(line), market)}</p>
          </li>
        ))}
      </ul>

      <TotalsTable totals={totals} market={market} />
      {footer}
    </section>
  );
}

export function SelectedOptions({ selections }: { selections: SelectedOption[] }) {
  if (!selections.length) return null;
  return (
    <dl className="mt-0.5 text-sm text-slate-600">
      {selections.map((s) => (
        <div key={s.groupId}>
          <dt className="inline">{s.groupLabel}: </dt>
          <dd className="inline text-slate-800">{s.choiceLabel}</dd>
        </div>
      ))}
    </dl>
  );
}

export function TotalsTable({ totals, market }: { totals: CartTotals; market: Market }) {
  return (
    <dl className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
      <div className="flex justify-between">
        <dt className="text-slate-600">Subtotal ({formatQuantity(totals.itemCount, { unit: "unit", unitPlural: "units" })})</dt>
        <dd className="font-medium text-slate-900">{formatMoney(totals.subtotal, market)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-slate-600">{market.tax.label}</dt>
        <dd className="font-medium text-slate-900">{formatMoney(totals.tax, market)}</dd>
      </div>
      <div className="flex justify-between border-t border-slate-200 pt-3 text-base">
        <dt className="font-semibold text-slate-900">Total</dt>
        <dd className="font-bold text-slate-900">{formatMoney(totals.total, market)}</dd>
      </div>
    </dl>
  );
}
