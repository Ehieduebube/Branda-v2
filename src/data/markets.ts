import type { Market, MarketCode } from "@/types";

/**
 * Central market configuration. Launching a market means adding an entry
 * here; routing, currency, tax, hreflang and the selector all derive from it.
 */
export const MARKETS: Record<MarketCode, Market> = {
  ng: {
    code: "ng",
    country: "Nigeria",
    locale: "en-NG",
    currency: { code: "NGN", symbol: "₦", displayFractionDigits: 0 },
    tax: { rate: 0.075, label: "VAT (7.5%)" },
    pricing: { multiplier: 450, roundTo: 500 },
    content: {
      heroEyebrow: "Branda Nigeria",
      heroTitle: "Brand everything your business touches",
      heroSubtitle:
        "Print, gifts, creative, digital and workspace branding in one order — produced for teams across Lagos, Abuja and Port Harcourt.",
      featuredHeading: "Popular with Nigerian businesses",
      featuredSlugs: [
        "business-cards",
        "branded-t-shirts",
        "corporate-gift-boxes",
        "event-backdrops",
      ],
      serviceAreaNote: "Prices in Naira (₦), including production. VAT is added at checkout.",
    },
  },
  us: {
    code: "us",
    country: "United States",
    locale: "en-US",
    currency: { code: "USD", symbol: "$", displayFractionDigits: 2 },
    tax: { rate: 0.08, label: "Estimated sales tax (8%)" },
    pricing: { multiplier: 1, roundTo: 1 },
    content: {
      heroEyebrow: "Branda USA",
      heroTitle: "Launch-ready branding for growing US businesses",
      heroSubtitle:
        "From your first logo to a website that converts — creative and digital services with clear pricing and fast turnaround.",
      featuredHeading: "Popular with US startups",
      featuredSlugs: [
        "logo-design",
        "website-design",
        "product-packaging",
        "social-media-design",
      ],
      serviceAreaNote: "Prices in US dollars. Sales tax is estimated at checkout.",
    },
  },
  uk: {
    code: "uk",
    country: "United Kingdom",
    locale: "en-GB",
    currency: { code: "GBP", symbol: "£", displayFractionDigits: 2 },
    tax: { rate: 0.2, label: "VAT (20%)" },
    pricing: { multiplier: 0.8, roundTo: 1 },
    content: {
      heroEyebrow: "Branda UK",
      heroTitle: "Considered branding for UK teams",
      heroSubtitle:
        "Brand identity, client gifting and workspace branding delivered as one joined-up programme.",
      featuredHeading: "Popular with UK businesses",
      featuredSlugs: [
        "brand-identity",
        "corporate-gift-boxes",
        "pitch-deck-design",
        "office-wall-branding",
      ],
      serviceAreaNote: "Prices in pounds sterling, excluding VAT. VAT is added at checkout.",
    },
  },
  ca: {
    code: "ca",
    country: "Canada",
    locale: "en-CA",
    currency: { code: "CAD", symbol: "CA$", displayFractionDigits: 2 },
    tax: { rate: 0.05, label: "GST (5%)" },
    pricing: { multiplier: 1.35, roundTo: 1 },
    content: {
      heroEyebrow: "Branda Canada",
      heroTitle: "Branding that works as hard as your team",
      heroSubtitle:
        "Print, merchandise and digital services for Canadian businesses — configured online, priced in Canadian dollars.",
      featuredHeading: "Popular with Canadian businesses",
      featuredSlugs: [
        "branded-water-bottles",
        "website-design",
        "roll-up-banners",
        "brand-identity",
      ],
      serviceAreaNote: "Prices in Canadian dollars. GST is added at checkout; provincial tax may apply.",
    },
  },
};

export const MARKET_CODES = Object.keys(MARKETS) as MarketCode[];

export const DEFAULT_MARKET: MarketCode = "ng";
