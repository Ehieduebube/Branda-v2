import { describe, expect, it } from "vitest";

import { MARKETS } from "@/data/markets";
import { formatMoney } from "@/lib/currency";
import { computeUnitPrice, localizePrice } from "@/lib/pricing";
import type { OptionGroup } from "@/types";

const groups: OptionGroup[] = [
  {
    id: "pack",
    label: "Pack",
    choices: [
      { id: "100", label: "100 cards", price: 2_500 },
      { id: "500", label: "500 cards", price: 6_500 },
    ],
  },
  {
    id: "finish",
    label: "Finish",
    choices: [
      { id: "matte", label: "Matte", price: 0 },
      { id: "spot-uv", label: "Spot UV", price: 3_000 },
    ],
  },
];

describe("localizePrice", () => {
  it("converts USD base prices with each market's rule", () => {
    expect(localizePrice(25, MARKETS.us)).toBe(2_500); // $25.00
    expect(localizePrice(25, MARKETS.ng)).toBe(1_150_000); // 25 × 450 = 11,250 → nearest ₦500 = ₦11,500
    expect(localizePrice(25, MARKETS.uk)).toBe(2_000); // £20.00
    expect(localizePrice(0, MARKETS.ng)).toBe(0); // free add-ons stay free
  });
});

describe("computeUnitPrice", () => {
  it("sums the selected options", () => {
    const price = computeUnitPrice({ optionGroups: groups }, { pack: "500", finish: "spot-uv" }, MARKETS.us);
    expect(price?.unitPrice).toBe(9_500);
    expect(price?.unitPriceBeforeDiscount).toBeUndefined();
  });

  it("applies discounts and keeps the original price", () => {
    const price = computeUnitPrice(
      { optionGroups: groups, discount: { percent: 10, label: "10% off" } },
      { pack: "100", finish: "matte" },
      MARKETS.us,
    );
    expect(price?.unitPrice).toBe(2_250);
    expect(price?.unitPriceBeforeDiscount).toBe(2_500);
  });

  it("rejects unknown or missing choices (tampered client input)", () => {
    expect(computeUnitPrice({ optionGroups: groups }, { pack: "999", finish: "matte" }, MARKETS.us)).toBeNull();
    expect(computeUnitPrice({ optionGroups: groups }, { pack: "100" }, MARKETS.us)).toBeNull();
  });
});

describe("formatMoney", () => {
  it("uses each market's currency symbol, including CA$ for Canada", () => {
    expect(formatMoney(1_150_000, MARKETS.ng)).toBe("₦11,500");
    expect(formatMoney(2_250, MARKETS.us)).toBe("$22.50");
    expect(formatMoney(2_000, MARKETS.uk)).toBe("£20.00");
    expect(formatMoney(3_400, MARKETS.ca)).toBe("CA$34.00");
  });
});
