import type { Market } from "@/types";

/** Every supported currency uses two minor-unit digits (kobo, cents, pence). */
const MINOR_UNIT_DIGITS = 2;

const formatterCache = new Map<string, Intl.NumberFormat>();

function getFormatter(market: Market): Intl.NumberFormat {
  const key = market.code;
  let formatter = formatterCache.get(key);
  if (!formatter) {
    formatter = new Intl.NumberFormat(market.locale, {
      style: "currency",
      currency: market.currency.code,
      minimumFractionDigits: market.currency.displayFractionDigits,
      maximumFractionDigits: market.currency.displayFractionDigits,
    });
    formatterCache.set(key, formatter);
  }
  return formatter;
}

/**
 * Format an amount in minor units for a market, e.g. 1250000 → "₦12,500".
 * The currency symbol comes from market config so ambiguous dollars are
 * explicit (CA$ vs $) regardless of the runtime's locale data.
 */
export function formatMoney(minorUnits: number, market: Market): string {
  const major = minorUnits / 10 ** MINOR_UNIT_DIGITS;
  return getFormatter(market)
    .formatToParts(major)
    .map((part) => (part.type === "currency" ? market.currency.symbol : part.value))
    .join("");
}

/** The smallest amount shown to customers, in minor units (₦1 = 100, $0.01 = 1). */
export function displayStep(market: Market): number {
  return 10 ** (MINOR_UNIT_DIGITS - market.currency.displayFractionDigits);
}

/** Round minor units to what the market displays, so shown parts add up to shown totals. */
export function roundForDisplay(minorUnits: number, market: Market): number {
  const step = displayStep(market);
  return Math.round(minorUnits / step) * step;
}

export function majorToMinor(major: number): number {
  return Math.round(major * 10 ** MINOR_UNIT_DIGITS);
}
