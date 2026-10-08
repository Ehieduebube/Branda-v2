import { describe, expect, it } from "vitest";

import { MARKETS } from "@/data/markets";
import { addLine, calculateTotals, createLineKey, removeLine, setLineQuantity } from "@/lib/cart";
import type { CartLine } from "@/types";

const line = (overrides: Partial<CartLine> = {}): CartLine => ({
  key: "business-cards?pack=100&finish=matte",
  slug: "business-cards",
  name: "Business Cards",
  image: { src: "https://images.unsplash.com/photo-x", alt: "" },
  selections: [],
  unitPrice: 1_035_000, // ₦10,350.00 in kobo
  quantity: 1,
  minQuantity: 1,
  maxQuantity: 20,
  unit: "design",
  unitPlural: "designs",
  ...overrides,
});

describe("cart operations", () => {
  it("builds a stable key from the service and its selected options", () => {
    const key = createLineKey("business-cards", [
      { groupId: "pack", groupLabel: "Pack", choiceId: "500", choiceLabel: "500 cards" },
      { groupId: "finish", groupLabel: "Finish", choiceId: "spot-uv", choiceLabel: "Spot UV" },
    ]);
    expect(key).toBe("business-cards?pack=500&finish=spot-uv");
  });

  it("merges the same configuration instead of duplicating lines", () => {
    const lines = addLine(addLine([], line({ quantity: 2 })), line({ quantity: 3 }));
    expect(lines).toHaveLength(1);
    expect(lines[0].quantity).toBe(5);
  });

  it("keeps different configurations as separate lines", () => {
    const lines = addLine([line()], line({ key: "business-cards?pack=500&finish=matte" }));
    expect(lines).toHaveLength(2);
  });

  it("clamps quantities to the service's minimum and maximum", () => {
    const mugs = line({ key: "mugs", minQuantity: 12, maxQuantity: 1000, quantity: 12 });
    expect(setLineQuantity([mugs], "mugs", 3)[0].quantity).toBe(12);
    expect(setLineQuantity([mugs], "mugs", 5000)[0].quantity).toBe(1000);
    expect(addLine([line({ quantity: 19 })], line({ quantity: 5 }))[0].quantity).toBe(20);
  });

  it("removes a line by key", () => {
    expect(removeLine([line(), line({ key: "other" })], "other")).toHaveLength(1);
  });
});

describe("calculateTotals", () => {
  it("computes subtotal, VAT and total for Nigeria (7.5%)", () => {
    const totals = calculateTotals([line({ quantity: 2 }), line({ key: "b", unitPrice: 297_500, quantity: 12 })], MARKETS.ng);
    expect(totals.subtotal).toBe(2 * 1_035_000 + 12 * 297_500);
    expect(totals.itemCount).toBe(14);
    expect(totals.total).toBe(totals.subtotal + totals.tax);
  });

  it("rounds tax to the displayed precision so shown parts add up", () => {
    // ₦1,000.00 × 7.5% = ₦75.00 exactly; ₦1,010.00 × 7.5% = ₦75.75 → ₦76 (NGN shows whole naira).
    expect(calculateTotals([line({ unitPrice: 101_000 })], MARKETS.ng).tax).toBe(7_600);
    // US shows cents: $10.10 × 8% = $0.808 → $0.81.
    expect(calculateTotals([line({ unitPrice: 1_010 })], MARKETS.us).tax).toBe(81);
  });

  it("returns zeros for an empty cart", () => {
    expect(calculateTotals([], MARKETS.uk)).toEqual({ itemCount: 0, subtotal: 0, tax: 0, total: 0 });
  });
});
