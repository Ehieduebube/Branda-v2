import { majorToMinor, roundForDisplay } from "@/lib/currency";
import type { Market, OptionGroup, SelectedOption, Service } from "@/types";

/** Convert an authored USD price into the market's price (minor units). */
export function localizePrice(priceUSD: number, market: Market): number {
  if (priceUSD === 0) return 0;
  const { multiplier, roundTo } = market.pricing;
  const major = Math.max(roundTo, Math.round((priceUSD * multiplier) / roundTo) * roundTo);
  return majorToMinor(major);
}

export function applyDiscount(price: number, percent: number | undefined, market: Market): number {
  if (!percent) return price;
  return roundForDisplay(price * (1 - percent / 100), market);
}

/** Selection map: option group id → choice id. */
export type Selections = Record<string, string>;

/** The first choice of every group — the cheapest configuration by convention. */
export function defaultSelections(groups: OptionGroup[]): Selections {
  return Object.fromEntries(groups.map((group) => [group.id, group.choices[0].id]));
}

/**
 * Resolve a selection map against a service's option groups.
 * Returns null if any group is missing or references an unknown choice,
 * so tampered client input can't produce a price.
 */
export function resolveSelections(
  groups: OptionGroup[],
  selections: Selections,
): { selected: SelectedOption[]; price: number } | null {
  const selected: SelectedOption[] = [];
  let price = 0;

  for (const group of groups) {
    const choice = group.choices.find((c) => c.id === selections[group.id]);
    if (!choice) return null;
    price += choice.price;
    selected.push({
      groupId: group.id,
      groupLabel: group.label,
      choiceId: choice.id,
      choiceLabel: choice.label,
    });
  }

  return { selected, price };
}

export interface UnitPrice {
  unitPrice: number;
  /** Present only when a discount applies. */
  unitPriceBeforeDiscount?: number;
  selected: SelectedOption[];
}

/** Single source of truth for what one unit of a configured service costs. */
export function computeUnitPrice(
  service: Pick<Service, "optionGroups" | "discount">,
  selections: Selections,
  market: Market,
): UnitPrice | null {
  const resolved = resolveSelections(service.optionGroups, selections);
  if (!resolved) return null;

  const unitPrice = applyDiscount(resolved.price, service.discount?.percent, market);
  return {
    unitPrice,
    unitPriceBeforeDiscount: unitPrice !== resolved.price ? resolved.price : undefined,
    selected: resolved.selected,
  };
}

export function clampQuantity(quantity: number, min: number, max: number): number {
  if (!Number.isFinite(quantity)) return min;
  return Math.min(max, Math.max(min, Math.round(quantity)));
}
