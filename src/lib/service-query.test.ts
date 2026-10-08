import { describe, expect, it } from "vitest";

import { getEquivalentPath } from "@/lib/markets";
import { buildServicesHref, parseServiceQuery } from "@/lib/service-query";

describe("parseServiceQuery", () => {
  it("reads every supported filter from the URL", () => {
    expect(
      parseServiceQuery({
        q: " business cards ",
        category: "prints",
        industry: "real-estate",
        "use-case": "events",
        urgency: "express",
        sort: "price-low",
        page: "2",
      }),
    ).toEqual({
      q: "business cards",
      category: "prints",
      industry: "real-estate",
      useCase: "events",
      urgency: "express",
      sort: "price-low",
      page: 2,
    });
  });

  it("ignores invalid values instead of failing", () => {
    const query = parseServiceQuery({ category: "bogus", sort: "nonsense", page: "-3", industry: ["retail", "finance"] });
    expect(query).toMatchObject({ category: undefined, sort: "popular", page: 1, industry: "retail" });
  });

  it("defaults to relevance only when searching", () => {
    expect(parseServiceQuery({ q: "mugs" }).sort).toBe("relevance");
    expect(parseServiceQuery({ sort: "relevance" }).sort).toBe("popular");
  });
});

describe("buildServicesHref", () => {
  it("produces the canonical, shareable URL", () => {
    expect(
      buildServicesHref("ng", { category: "prints", industry: "real-estate", sort: "popular" }, { page: 2 }),
    ).toBe("/ng/services?category=prints&industry=real-estate&page=2");
  });

  it("resets to page 1 when a filter changes", () => {
    expect(buildServicesHref("us", { q: "cards", page: 3, sort: "relevance" }, { category: "prints" })).toBe(
      "/us/services?q=cards&category=prints",
    );
  });

  it("round-trips through the parser", () => {
    const href = buildServicesHref("uk", { q: "logo", useCase: "brand-launch", sort: "price-high", page: 2 }, { page: 2 });
    const params = Object.fromEntries(new URL(href, "http://x").searchParams);
    expect(parseServiceQuery(params)).toMatchObject({ q: "logo", useCase: "brand-launch", sort: "price-high", page: 2 });
  });
});

describe("getEquivalentPath", () => {
  it("maps the same page into another market", () => {
    expect(getEquivalentPath("/ng/services/logo-design", "us")).toBe("/us/services/logo-design");
    expect(getEquivalentPath("/ng", "ca")).toBe("/ca");
  });

  it("sends checkout to the target market's cart (carts are per currency)", () => {
    expect(getEquivalentPath("/ng/checkout/confirmation", "uk")).toBe("/uk/cart");
  });
});
