import { roundForDisplay } from "@/lib/currency";
import { clampQuantity } from "@/lib/pricing";
import type { CartLine, CartTotals, Market, SelectedOption } from "@/types";

/**
 * Pure cart operations. Every function returns a new array so they work
 * directly as state transitions and are trivial to unit test.
 */

export function createLineKey(slug: string, selections: SelectedOption[]): string {
  const options = selections.map((s) => `${s.groupId}=${s.choiceId}`).join("&");
  return options ? `${slug}?${options}` : slug;
}

/** Add a line, merging into an existing line with the same configuration. */
export function addLine(lines: CartLine[], line: CartLine): CartLine[] {
  const existing = lines.find((l) => l.key === line.key);
  if (!existing) {
    return [...lines, { ...line, quantity: clampQuantity(line.quantity, line.minQuantity, line.maxQuantity) }];
  }
  return lines.map((l) =>
    l.key === line.key
      ? {
          ...l,
          // Latest price wins: the customer just saw it on the service page.
          unitPrice: line.unitPrice,
          quantity: clampQuantity(l.quantity + line.quantity, l.minQuantity, l.maxQuantity),
        }
      : l,
  );
}

export function setLineQuantity(lines: CartLine[], key: string, quantity: number): CartLine[] {
  return lines.map((l) =>
    l.key === key ? { ...l, quantity: clampQuantity(quantity, l.minQuantity, l.maxQuantity) } : l,
  );
}

export function removeLine(lines: CartLine[], key: string): CartLine[] {
  return lines.filter((l) => l.key !== key);
}

export function getLineTotal(line: Pick<CartLine, "unitPrice" | "quantity">): number {
  return line.unitPrice * line.quantity;
}

/**
 * Subtotal, tax and total for a set of lines. Tax is rounded to the market's
 * display precision so the displayed subtotal + tax always equals the total.
 */
export function calculateTotals(
  lines: Pick<CartLine, "unitPrice" | "quantity">[],
  market: Market,
): CartTotals {
  const subtotal = lines.reduce((sum, line) => sum + getLineTotal(line), 0);
  const tax = roundForDisplay(subtotal * market.tax.rate, market);
  return {
    itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
    subtotal,
    tax,
    total: subtotal + tax,
  };
}

export function formatQuantity(quantity: number, line: Pick<CartLine, "unit" | "unitPlural">): string {
  return `${quantity.toLocaleString("en")} ${quantity === 1 ? line.unit : line.unitPlural}`;
}

/** Runtime guard for data read back from localStorage (may be stale or edited). */
export function isCartLine(value: unknown): value is CartLine {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.slug === "string" &&
    typeof v.name === "string" &&
    typeof v.unitPrice === "number" &&
    typeof v.quantity === "number" &&
    typeof v.minQuantity === "number" &&
    typeof v.maxQuantity === "number" &&
    typeof v.unit === "string" &&
    typeof v.unitPlural === "string" &&
    Array.isArray(v.selections) &&
    !!v.image &&
    typeof (v.image as Record<string, unknown>).src === "string"
  );
}
