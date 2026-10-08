"use server";

import { calculateTotals } from "@/lib/cart";
import { getServices } from "@/lib/catalog";
import {
  validateContact,
  type ConfirmedOrderLine,
  type ContactDetails,
  type OrderLineInput,
  type PlaceOrderResult,
} from "@/lib/checkout";
import { getMarket, isMarketCode } from "@/lib/markets";
import { clampQuantity, computeUnitPrice } from "@/lib/pricing";

const MAX_LINES = 50;

function isLineInput(value: unknown): value is OrderLineInput {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.key === "string" &&
    typeof v.slug === "string" &&
    typeof v.quantity === "number" &&
    typeof v.expectedUnitPrice === "number" &&
    !!v.selections &&
    typeof v.selections === "object"
  );
}

/**
 * Places a (mock) order. Server Actions are public endpoints, so every input
 * is treated as untrusted: the market, quantities and selections are
 * re-validated and every price is recomputed from the catalog. The client's
 * prices are only compared to detect changes, never used.
 *
 * A real implementation would persist the order, then hand off to a payment
 * provider; the assessment scope stops at a confirmation.
 */
export async function placeOrder(input: {
  market: string;
  contact: ContactDetails;
  lines: OrderLineInput[];
}): Promise<PlaceOrderResult> {
  if (!isMarketCode(input?.market)) return { status: "error", message: "Unknown market." };
  const market = getMarket(input.market);

  const contact: ContactDetails = {
    name: String(input.contact?.name ?? "").trim(),
    email: String(input.contact?.email ?? "").trim(),
    phone: String(input.contact?.phone ?? "").trim(),
    company: String(input.contact?.company ?? "").trim(),
    notes: String(input.contact?.notes ?? "").trim(),
  };
  const errors = validateContact(contact);
  if (Object.keys(errors).length) {
    return { status: "invalid", message: "Please correct the highlighted fields.", errors };
  }

  if (!Array.isArray(input.lines) || input.lines.length === 0) {
    return { status: "error", message: "Your cart is empty." };
  }
  if (input.lines.length > MAX_LINES || !input.lines.every(isLineInput)) {
    return { status: "error", message: "Your cart couldn't be read. Please refresh and try again." };
  }

  const services = new Map((await getServices(market.code)).map((s) => [s.slug, s]));
  const lines: ConfirmedOrderLine[] = [];
  const changedPrices: { key: string; unitPrice: number }[] = [];

  for (const line of input.lines) {
    const service = services.get(line.slug);
    const price = service && computeUnitPrice(service, line.selections, market);
    if (!service || !price) {
      return {
        status: "error",
        message: "An item in your cart is no longer available. Please remove it and try again.",
      };
    }
    if (price.unitPrice !== line.expectedUnitPrice) {
      changedPrices.push({ key: line.key, unitPrice: price.unitPrice });
    }
    lines.push({
      key: line.key,
      name: service.name,
      image: service.images[0],
      selections: price.selected,
      quantity: clampQuantity(line.quantity, service.quantity.min, service.quantity.max),
      unit: service.quantity.unit,
      unitPlural: service.quantity.unitPlural,
      unitPrice: price.unitPrice,
    });
  }

  if (changedPrices.length) {
    return {
      status: "price-changed",
      message: "Some prices have changed since you added them. We've updated your cart — please review the new total.",
      prices: changedPrices,
    };
  }

  return {
    status: "success",
    order: {
      id: `BR-${market.code.toUpperCase()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
      market: market.code,
      placedAt: new Date().toISOString(),
      contact: { name: contact.name, email: contact.email, company: contact.company },
      lines,
      totals: calculateTotals(lines, market),
    },
  };
}
