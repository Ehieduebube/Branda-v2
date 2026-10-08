/**
 * Domain types shared by the data layer, business logic and UI.
 *
 * Money is always an integer in the market currency's minor unit
 * (kobo, cents, pence) so totals never accumulate floating-point error.
 */

export type MarketCode = "ng" | "us" | "uk" | "ca";

export type CategorySlug = "digital" | "gifts" | "create" | "studio" | "prints";

export type IndustrySlug =
  | "real-estate"
  | "hospitality"
  | "retail"
  | "technology"
  | "finance"
  | "healthcare"
  | "education";

export type UseCaseSlug =
  | "brand-launch"
  | "events"
  | "marketing-campaign"
  | "gifting"
  | "office-setup"
  | "online-presence"
  | "product-launch";

export type UrgencySlug = "express" | "within-week" | "within-2-weeks";

export type SortOption = "relevance" | "popular" | "price-low" | "price-high";

export interface Market {
  code: MarketCode;
  country: string;
  /** BCP 47 locale used for number formatting and `lang`/`hreflang`. */
  locale: string;
  currency: {
    code: string;
    /** Displayed symbol. Set explicitly so CAD renders as "CA$", not "$". */
    symbol: string;
    /** Minor-unit digits shown to customers (0 for NGN, 2 for USD/GBP/CAD). */
    displayFractionDigits: number;
  };
  tax: {
    rate: number;
    label: string;
  };
  /**
   * Mock pricing rule: catalog base prices are authored in USD and converted
   * per market. A real backend would return a market-specific price book.
   */
  pricing: {
    multiplier: number;
    /** Round converted prices to this many major units (e.g. ₦500). */
    roundTo: number;
  };
  content: {
    heroEyebrow: string;
    heroTitle: string;
    heroSubtitle: string;
    featuredHeading: string;
    featuredSlugs: string[];
    serviceAreaNote: string;
  };
}

export interface ServiceImage {
  src: string;
  alt: string;
}

export interface Turnaround {
  /** Business days. */
  minDays: number;
  maxDays: number;
}

/** A service exactly as authored in the catalog source (USD base prices). */
export interface ServiceRecord {
  slug: string;
  name: string;
  category: CategorySlug;
  summary: string;
  description: string;
  images: ServiceImage[];
  industries: IndustrySlug[];
  useCases: UseCaseSlug[];
  /** Extra search vocabulary: synonyms, materials, common misspellings. */
  keywords: string[];
  included: string[];
  turnaround: Turnaround;
  /** Relative demand score used for "Most popular" sorting. */
  popularity: number;
  discount?: { percent: number; label: string };
  optionGroups: {
    id: string;
    label: string;
    choices: { id: string; label: string; detail?: string; priceUSD: number }[];
  }[];
  quantity: { min: number; max: number; unit: string; unitPlural: string };
  /** Alternatives to this service (similar need, different scope). */
  related: string[];
  /** Services customers typically order alongside this one. */
  complementary: string[];
}

export interface OptionChoice {
  id: string;
  label: string;
  detail?: string;
  /** Price contribution in market minor units, before discount. */
  price: number;
}

export interface OptionGroup {
  id: string;
  label: string;
  choices: OptionChoice[];
}

/** A service priced for one market — what the UI consumes. */
export interface Service
  extends Omit<ServiceRecord, "optionGroups"> {
  market: MarketCode;
  optionGroups: OptionGroup[];
  /** Cheapest configuration per unit, after discount. */
  startingPrice: number;
  /** Cheapest configuration per unit, before discount (when discounted). */
  startingPriceBeforeDiscount?: number;
}

export interface ServiceQuery {
  q: string;
  category?: CategorySlug;
  industry?: IndustrySlug;
  useCase?: UseCaseSlug;
  urgency?: UrgencySlug;
  sort: SortOption;
  page: number;
}

export interface ServiceSearchResult {
  items: Service[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  /** Result counts per category with every other filter applied. */
  categoryCounts: Record<CategorySlug, number>;
}

export interface SelectedOption {
  groupId: string;
  groupLabel: string;
  choiceId: string;
  choiceLabel: string;
}

export interface CartLine {
  /** Stable identity: service slug + chosen option ids. */
  key: string;
  slug: string;
  name: string;
  image: ServiceImage;
  selections: SelectedOption[];
  /** Per-unit price in minor units, after discount. */
  unitPrice: number;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unit: string;
  unitPlural: string;
}

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
}
