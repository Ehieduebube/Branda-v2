import { describe, expect, it } from "vitest";

import { SERVICE_RECORDS } from "@/data/services";
import { buildSearchIndex, searchIndex, tokenize } from "@/lib/search";
import type { Service } from "@/types";

// Search only reads text fields, so prices can be stubbed.
const services: Service[] = SERVICE_RECORDS.map((record) => ({
  ...record,
  market: "us",
  optionGroups: [],
  startingPrice: 0,
}));
const index = buildSearchIndex(services);

const top = (query: string, n = 1) =>
  searchIndex(index, query)
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((r) => r.service.slug);

describe("tokenize", () => {
  it("normalises case, punctuation, plurals and stop words", () => {
    expect(tokenize("Business Cards for my Café!")).toEqual(["business", "card", "cafe"]);
    expect(tokenize("boxes & bottles")).toEqual(["box", "bottle"]);
  });
});

describe("searchIndex", () => {
  it("ranks exact name matches first", () => {
    expect(top("business cards")).toEqual(["business-cards"]);
    expect(top("logo design")).toEqual(["logo-design"]);
  });

  it("tolerates typos", () => {
    expect(top("buisness card")).toEqual(["business-cards"]);
    expect(top("flyres")).toEqual(["flyers"]);
  });

  it("matches synonyms and prefixes", () => {
    expect(top("visiting cards")).toEqual(["business-cards"]);
    expect(top("leaflets")).toEqual(["flyers"]);
    expect(top("pack")).toContain("product-packaging");
  });

  it("matches industry and use-case vocabulary", () => {
    expect(top("real estate flyers")).toEqual(["flyers"]);
    const gifting = searchIndex(index, "client gifting").map((r) => r.service.category);
    expect(gifting.length).toBeGreaterThan(0);
    expect(gifting.every((category) => category === "gifts" || category === "prints")).toBe(true);
  });

  it("requires every term to match", () => {
    expect(searchIndex(index, "mugs xylophone")).toHaveLength(0);
  });

  it("returns everything for an empty query", () => {
    expect(searchIndex(index, "   ")).toHaveLength(services.length);
  });
});
