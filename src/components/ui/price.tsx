import { formatMoney } from "@/lib/currency";
import { cn } from "@/lib/utils";
import type { Market } from "@/types";

/**
 * Displays a price with an optional struck-through original. The original
 * is announced explicitly so screen readers don't read two bare numbers.
 */
export function Price({
  amount,
  original,
  market,
  className,
  originalClassName,
}: {
  amount: number;
  original?: number;
  market: Market;
  className?: string;
  originalClassName?: string;
}) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-2">
      <span className={cn("font-semibold text-slate-900", className)}>{formatMoney(amount, market)}</span>
      {original !== undefined && original > amount && (
        <s className={cn("text-sm text-slate-500", originalClassName)}>
          <span className="sr-only">was </span>
          {formatMoney(original, market)}
        </s>
      )}
    </span>
  );
}
