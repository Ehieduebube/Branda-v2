import type {
  CategorySlug,
  IndustrySlug,
  SortOption,
  UrgencySlug,
  UseCaseSlug,
} from "@/types";

export interface Category {
  slug: CategorySlug;
  label: string;
  tagline: string;
  description: string;
}

/** The five Branda ecosystem categories, in navigation order. */
export const CATEGORIES: Category[] = [
  {
    slug: "prints",
    label: "Prints",
    tagline: "Print & large format",
    description: "Business cards, flyers, banners, apparel and labels, produced to spec.",
  },
  {
    slug: "gifts",
    label: "Gifts",
    tagline: "Corporate gifting",
    description: "Branded mugs, bottles, notebooks and curated gift boxes for clients and teams.",
  },
  {
    slug: "create",
    label: "Create",
    tagline: "Creative & design",
    description: "Logos, identity systems, packaging, product photography and pitch decks.",
  },
  {
    slug: "digital",
    label: "Digital",
    tagline: "Web & social",
    description: "Websites, social media design and management, SEO and email templates.",
  },
  {
    slug: "studio",
    label: "Studio",
    tagline: "Workspace design",
    description: "Office interiors, wall branding, reception signage and meeting rooms.",
  },
];

export const INDUSTRIES: { slug: IndustrySlug; label: string }[] = [
  { slug: "real-estate", label: "Real estate" },
  { slug: "hospitality", label: "Hospitality" },
  { slug: "retail", label: "Retail & e-commerce" },
  { slug: "technology", label: "Technology" },
  { slug: "finance", label: "Finance" },
  { slug: "healthcare", label: "Healthcare" },
  { slug: "education", label: "Education" },
];

export const USE_CASES: { slug: UseCaseSlug; label: string }[] = [
  { slug: "brand-launch", label: "Brand launch" },
  { slug: "events", label: "Events & exhibitions" },
  { slug: "marketing-campaign", label: "Marketing campaign" },
  { slug: "gifting", label: "Client & staff gifting" },
  { slug: "office-setup", label: "Office setup" },
  { slug: "online-presence", label: "Online presence" },
  { slug: "product-launch", label: "Product launch" },
];

/** Urgency filters match services whose slowest turnaround fits the window. */
export const URGENCIES: { slug: UrgencySlug; label: string; maxDays: number }[] = [
  { slug: "express", label: "Express (3 days or less)", maxDays: 3 },
  { slug: "within-week", label: "Within a week", maxDays: 7 },
  { slug: "within-2-weeks", label: "Within two weeks", maxDays: 14 },
];

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Best match" },
  { value: "popular", label: "Most popular" },
  { value: "price-low", label: "Price: low to high" },
  { value: "price-high", label: "Price: high to low" },
];
