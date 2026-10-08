import type { ServiceRecord } from "@/types";

/**
 * Mock catalog. Shaped like an API/CMS response so it can be swapped for a
 * real data source behind `src/lib/catalog.ts` without touching the UI.
 *
 * Prices are authored in USD and localized per market by `src/lib/pricing.ts`.
 * Photography: Unsplash (https://unsplash.com), used under the Unsplash License.
 */

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?fm=jpg&fit=crop&w=1600&h=1200&q=80`;

export const SERVICE_RECORDS: ServiceRecord[] = [
  // ─── Prints ────────────────────────────────────────────────────────────
  {
    slug: "business-cards",
    name: "Business Cards",
    category: "prints",
    summary: "Premium cards on 400gsm stock with your choice of finish.",
    description:
      "Make a strong first impression with business cards printed on heavyweight 400gsm board. Upload a print-ready file or send us your details and our designers will lay out a card that matches your brand. Every order includes a digital proof for approval before printing.",
    images: [
      { src: photo("1718670013921-2f144aba173a"), alt: "Two black business cards with white lettering on a marble counter" },
      { src: photo("1769893464274-ef3af10359f9"), alt: "Hand holding two printed business cards against a dark background" },
      { src: photo("1599590984817-0c15f31b1fa5"), alt: "Hand holding a dark green business card in front of a brick wall" },
    ],
    industries: ["real-estate", "finance", "healthcare", "technology", "hospitality"],
    useCases: ["brand-launch", "events"],
    keywords: ["visiting cards", "name cards", "complimentary cards", "stationery", "contact cards", "buisness"],
    included: [
      "Free layout using your logo and details",
      "Digital proof before printing",
      "400gsm premium board",
      "Packed in branded card boxes",
    ],
    turnaround: { minDays: 2, maxDays: 3 },
    popularity: 98,
    discount: { percent: 10, label: "10% off" },
    optionGroups: [
      {
        id: "pack",
        label: "Cards per design",
        choices: [
          { id: "100", label: "100 cards", priceUSD: 25 },
          { id: "250", label: "250 cards", priceUSD: 40 },
          { id: "500", label: "500 cards", priceUSD: 65 },
          { id: "1000", label: "1000 cards", priceUSD: 110 },
        ],
      },
      {
        id: "finish",
        label: "Finish",
        choices: [
          { id: "matte", label: "Matte", detail: "Standard", priceUSD: 0 },
          { id: "soft-touch", label: "Soft-touch laminate", priceUSD: 15 },
          { id: "spot-uv", label: "Spot UV", detail: "Raised gloss on logo", priceUSD: 30 },
        ],
      },
    ],
    quantity: { min: 1, max: 20, unit: "design", unitPlural: "designs" },
    related: ["flyers", "stickers-and-labels"],
    complementary: ["logo-design", "brand-identity", "branded-notebooks"],
  },
  {
    slug: "flyers",
    name: "Flyers",
    category: "prints",
    summary: "Full-colour flyers for promotions, menus and launches.",
    description:
      "Vibrant full-colour flyers printed on 170gsm silk paper — ideal for open days, product launches, menus and door-to-door campaigns. Choose single or double-sided and we'll check your artwork for bleed and resolution before it goes to press.",
    images: [
      { src: photo("1707299650047-cd1b1bfd98c5"), alt: "Stack of bright yellow printed flyers on a white surface" },
      { src: photo("1695634621375-0b66a9d5d1bc"), alt: "Folded printed leaflet with black and white artwork" },
      { src: photo("1769893715447-8f12c382e49c"), alt: "Folded brochures and pamphlets standing upright on a dark background" },
    ],
    industries: ["real-estate", "hospitality", "retail", "education", "healthcare"],
    useCases: ["marketing-campaign", "events", "product-launch"],
    keywords: ["leaflets", "handbills", "pamphlets", "brochures", "menus", "flier"],
    included: ["Artwork pre-flight check", "170gsm silk paper", "Digital proof before printing"],
    turnaround: { minDays: 2, maxDays: 4 },
    popularity: 90,
    optionGroups: [
      {
        id: "quantity",
        label: "Print run",
        choices: [
          { id: "250", label: "250 flyers", priceUSD: 45 },
          { id: "500", label: "500 flyers", priceUSD: 70 },
          { id: "1000", label: "1000 flyers", priceUSD: 110 },
          { id: "2500", label: "2500 flyers", priceUSD: 220 },
        ],
      },
      {
        id: "format",
        label: "Size & sides",
        choices: [
          { id: "a5-single", label: "A5, single-sided", priceUSD: 0 },
          { id: "a5-double", label: "A5, double-sided", priceUSD: 15 },
          { id: "a4-double", label: "A4, double-sided", priceUSD: 45 },
        ],
      },
    ],
    quantity: { min: 1, max: 10, unit: "design", unitPlural: "designs" },
    related: ["business-cards", "roll-up-banners"],
    complementary: ["social-media-design", "brand-identity", "product-photography"],
  },
  {
    slug: "roll-up-banners",
    name: "Roll-Up Banners",
    category: "prints",
    summary: "Portable pull-up banners for stands, lobbies and pop-ups.",
    description:
      "Self-standing roll-up banners that set up in under a minute and pack into a carry bag. Printed on anti-curl material with vivid colour that reads from across an exhibition hall. Perfect for trade shows, product activations and reception areas.",
    images: [
      { src: photo("1761195689615-9469b65dac01"), alt: "Exhibition stand with large branded blue banners and staff greeting visitors" },
      { src: photo("1762028892701-692dc360db08"), alt: "Presenter at a trade show booth in front of branded backdrop graphics" },
    ],
    industries: ["real-estate", "technology", "finance", "education", "healthcare"],
    useCases: ["events", "marketing-campaign", "product-launch"],
    keywords: ["pull up banner", "rollup", "standee", "exhibition stand", "pop up banner", "x-banner"],
    included: ["Aluminium base & pole", "Padded carry bag", "Artwork check and proof"],
    turnaround: { minDays: 2, maxDays: 3 },
    popularity: 84,
    optionGroups: [
      {
        id: "model",
        label: "Banner model",
        choices: [
          { id: "economy", label: "Economy", detail: "85 × 200 cm", priceUSD: 70 },
          { id: "premium", label: "Premium", detail: "85 × 200 cm, wide base", priceUSD: 110 },
          { id: "wide", label: "Wide format", detail: "120 × 200 cm", priceUSD: 150 },
        ],
      },
    ],
    quantity: { min: 1, max: 50, unit: "banner", unitPlural: "banners" },
    related: ["event-backdrops", "flyers"],
    complementary: ["branded-t-shirts", "branded-tote-bags", "business-cards"],
  },
  {
    slug: "event-backdrops",
    name: "Event Backdrops",
    category: "prints",
    summary: "Step-and-repeat and stage backdrops built for photos.",
    description:
      "Large-format backdrops for conferences, launches, award nights and press walls. We print on low-glare material so your logos stay crisp in photos and video, and supply the frame so your backdrop is ready to stand on the day.",
    images: [
      { src: photo("1769798644300-e53957efab03"), alt: "Panel speakers on stage in front of a branded step-and-repeat backdrop" },
      { src: photo("1769798643582-32ef781c45d8"), alt: "Conference audience facing a large branded stage backdrop" },
      { src: photo("1762968274962-20c12e6e8ecd"), alt: "Speaker on a lit stage with large branded screens behind them" },
    ],
    industries: ["hospitality", "technology", "finance", "real-estate", "education"],
    useCases: ["events", "product-launch", "marketing-campaign"],
    keywords: ["step and repeat", "press wall", "stage backdrop", "photo wall", "large format", "banner"],
    included: ["Low-glare print material", "Free-standing frame", "Layout of logo repeat pattern"],
    turnaround: { minDays: 3, maxDays: 5 },
    popularity: 80,
    optionGroups: [
      {
        id: "size",
        label: "Size",
        choices: [
          { id: "2x2", label: "2 × 2 m", priceUSD: 180 },
          { id: "3x2.5", label: "3 × 2.5 m", priceUSD: 260 },
          { id: "4x3", label: "4 × 3 m", priceUSD: 380 },
        ],
      },
      {
        id: "material",
        label: "Material",
        choices: [
          { id: "flex", label: "Flex banner on frame", priceUSD: 0 },
          { id: "fabric", label: "Fabric pop-up", detail: "Reusable, crease-free", priceUSD: 120 },
        ],
      },
    ],
    quantity: { min: 1, max: 10, unit: "backdrop", unitPlural: "backdrops" },
    related: ["roll-up-banners", "office-wall-branding"],
    complementary: ["branded-t-shirts", "corporate-gift-boxes", "social-media-design"],
  },
  {
    slug: "branded-t-shirts",
    name: "Branded T-Shirts",
    category: "prints",
    summary: "Team, event and merch tees printed with your logo.",
    description:
      "Branded tees for staff uniforms, events and merchandise. Choose your print coverage and fabric; we'll match your brand colours and send a digital mock-up before production. Mixed sizes in a single order are no problem.",
    images: [
      { src: photo("1562157873-818bc0726f68"), alt: "Folded white and navy t-shirts laid on a wooden surface" },
      { src: photo("1581655353564-df123a1eb820"), alt: "Plain white crew-neck t-shirt on a hanger against a grey wall" },
      { src: photo("1643216672038-ac3776e8b80b"), alt: "Hands operating a screen-printing press" },
    ],
    industries: ["technology", "education", "hospitality", "retail", "healthcare"],
    useCases: ["events", "brand-launch", "marketing-campaign", "gifting"],
    keywords: ["tee shirts", "tshirts", "uniforms", "merch", "apparel", "polo", "custom shirts"],
    included: ["Digital mock-up for approval", "Mixed sizes S–3XL", "Colour matching to your brand"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 92,
    optionGroups: [
      {
        id: "print",
        label: "Print coverage",
        choices: [
          { id: "1c-front", label: "1-colour front", priceUSD: 9 },
          { id: "full-front", label: "Full-colour front", priceUSD: 12 },
          { id: "full-both", label: "Full-colour front & back", priceUSD: 16 },
        ],
      },
      {
        id: "fabric",
        label: "Garment",
        choices: [
          { id: "standard", label: "Standard cotton tee", priceUSD: 0 },
          { id: "premium", label: "Premium ring-spun tee", priceUSD: 3 },
          { id: "polo", label: "Polo shirt", priceUSD: 6 },
        ],
      },
    ],
    quantity: { min: 10, max: 2000, unit: "shirt", unitPlural: "shirts" },
    related: ["branded-tote-bags", "branded-mugs"],
    complementary: ["event-backdrops", "roll-up-banners", "logo-design"],
  },
  {
    slug: "stickers-and-labels",
    name: "Stickers & Labels",
    category: "prints",
    summary: "Product labels, packaging seals and promo stickers.",
    description:
      "Durable vinyl stickers and product labels for packaging, jars, bottles and giveaways. Water-resistant and available kiss-cut on sheets or as custom die-cut shapes that follow your artwork.",
    images: [
      { src: photo("1593747176945-ef77e62547eb"), alt: "Black die-cut sticker with gold script lettering on a yellow surface" },
      { src: photo("1724155090003-fd4e48ab8c8f"), alt: "Wall covered in many colourful printed stickers" },
    ],
    industries: ["retail", "hospitality", "healthcare", "technology"],
    useCases: ["product-launch", "marketing-campaign", "brand-launch"],
    keywords: ["labels", "decals", "seals", "packaging labels", "vinyl stickers", "die cut"],
    included: ["Water-resistant vinyl", "Artwork check and proof", "Kiss-cut sheets or loose stickers"],
    turnaround: { minDays: 3, maxDays: 5 },
    popularity: 70,
    optionGroups: [
      {
        id: "quantity",
        label: "Quantity",
        choices: [
          { id: "100", label: "100 stickers", priceUSD: 35 },
          { id: "500", label: "500 stickers", priceUSD: 80 },
          { id: "1000", label: "1000 stickers", priceUSD: 130 },
        ],
      },
      {
        id: "shape",
        label: "Shape",
        choices: [
          { id: "standard", label: "Round or square", priceUSD: 0 },
          { id: "die-cut", label: "Custom die-cut", priceUSD: 20 },
        ],
      },
    ],
    quantity: { min: 1, max: 20, unit: "design", unitPlural: "designs" },
    related: ["product-packaging", "business-cards"],
    complementary: ["product-photography", "logo-design", "branded-water-bottles"],
  },

  // ─── Gifts ─────────────────────────────────────────────────────────────
  {
    slug: "branded-mugs",
    name: "Branded Mugs",
    category: "gifts",
    summary: "Dishwasher-safe mugs printed with your logo or artwork.",
    description:
      "A desk staple that keeps your brand in sight every day. Our mugs are printed with dishwasher-safe sublimation inks and individually boxed, ready for staff welcome packs, client gifts or your office kitchen.",
    images: [
      { src: photo("1770615674400-92006cec2a2d"), alt: "Printed white mug of coffee on a table in warm sunlight" },
      { src: photo("1509545344343-6410b9f9eb41"), alt: "White ceramic cup and saucer filled with latte" },
    ],
    industries: ["technology", "finance", "hospitality", "education", "real-estate"],
    useCases: ["gifting", "office-setup", "events"],
    keywords: ["cups", "coffee mugs", "custom mugs", "magic mug", "travel mug", "drinkware"],
    included: ["Individual gift box", "Dishwasher-safe print", "Digital mock-up before production"],
    turnaround: { minDays: 4, maxDays: 6 },
    popularity: 88,
    discount: { percent: 15, label: "15% off bulk" },
    optionGroups: [
      {
        id: "type",
        label: "Mug type",
        choices: [
          { id: "ceramic", label: "Ceramic 11oz", priceUSD: 8 },
          { id: "magic", label: "Colour-changing", detail: "Reveals print when hot", priceUSD: 12 },
          { id: "enamel", label: "Enamel camp mug", priceUSD: 11 },
          { id: "travel", label: "Insulated travel mug", priceUSD: 18 },
        ],
      },
    ],
    quantity: { min: 12, max: 1000, unit: "mug", unitPlural: "mugs" },
    related: ["branded-water-bottles", "branded-notebooks"],
    complementary: ["corporate-gift-boxes", "branded-tote-bags", "branded-t-shirts"],
  },
  {
    slug: "corporate-gift-boxes",
    name: "Corporate Gift Boxes",
    category: "gifts",
    summary: "Curated, branded gift boxes for clients and teams.",
    description:
      "Thoughtfully curated gift boxes for end-of-year appreciation, onboarding and client milestones. Every item is branded, packed in your choice of box and finished with a printed message card. We can deliver in bulk or to individual addresses.",
    images: [
      { src: photo("1625552185153-7a8d8f3794a3"), alt: "Hands opening a branded kraft gift box with an embossed logo" },
      { src: photo("1625552186152-668cd2f0b707"), alt: "White gift boxes tied with pink ribbon beside dried flowers" },
    ],
    industries: ["finance", "technology", "real-estate", "healthcare", "hospitality"],
    useCases: ["gifting", "events"],
    keywords: ["hampers", "gift packs", "welcome kit", "onboarding kit", "end of year gifts", "christmas gifts", "swag box"],
    included: ["Branded items and packaging", "Printed message card", "Assembly and quality check"],
    turnaround: { minDays: 7, maxDays: 10 },
    popularity: 86,
    discount: { percent: 12, label: "12% off" },
    optionGroups: [
      {
        id: "tier",
        label: "Box contents",
        choices: [
          { id: "essentials", label: "Essentials", detail: "Mug, A5 notebook, pen", priceUSD: 45 },
          { id: "signature", label: "Signature", detail: "Bottle, notebook, tote, pen", priceUSD: 75 },
          { id: "executive", label: "Executive", detail: "Insulated bottle, leather notebook, power bank", priceUSD: 130 },
        ],
      },
      {
        id: "packaging",
        label: "Packaging",
        choices: [
          { id: "kraft", label: "Branded kraft box", priceUSD: 0 },
          { id: "rigid", label: "Rigid magnetic box", detail: "With foam insert", priceUSD: 12 },
        ],
      },
    ],
    quantity: { min: 10, max: 500, unit: "box", unitPlural: "boxes" },
    related: ["branded-notebooks", "branded-mugs"],
    complementary: ["branded-water-bottles", "branded-tote-bags", "business-cards"],
  },
  {
    slug: "branded-notebooks",
    name: "Branded Notebooks",
    category: "gifts",
    summary: "A5 notebooks with debossed or printed covers.",
    description:
      "Notebooks your team and clients will actually use. Choose soft cover, hard cover or PU leather, then add your logo as a subtle deboss or a full-colour print. Lined 80gsm pages with ribbon marker and elastic closure.",
    images: [
      { src: photo("1636014724389-270c4e9c0100"), alt: "Open notebook beside orange and red notebooks on a teal surface" },
      { src: photo("1647119371389-895d54d8aa5c"), alt: "Grey fabric notebook with pen and branded cards on a table" },
      { src: photo("1516414447565-b14be0adf13e"), alt: "Dark notebook with a printed cover on a wooden desk" },
    ],
    industries: ["finance", "education", "technology", "healthcare", "real-estate"],
    useCases: ["gifting", "office-setup", "events"],
    keywords: ["jotters", "notepads", "journals", "diaries", "planners", "stationery"],
    included: ["Lined 80gsm pages", "Ribbon marker & elastic closure", "Mock-up before production"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 72,
    optionGroups: [
      {
        id: "cover",
        label: "Cover",
        choices: [
          { id: "soft", label: "A5 soft cover", priceUSD: 9 },
          { id: "hard", label: "A5 hard cover", priceUSD: 13 },
          { id: "leather", label: "A5 PU leather", priceUSD: 18 },
        ],
      },
      {
        id: "branding",
        label: "Logo application",
        choices: [
          { id: "deboss", label: "Debossed", priceUSD: 0 },
          { id: "print", label: "Full-colour print", priceUSD: 2 },
        ],
      },
    ],
    quantity: { min: 10, max: 1000, unit: "notebook", unitPlural: "notebooks" },
    related: ["branded-mugs", "business-cards"],
    complementary: ["corporate-gift-boxes", "branded-tote-bags", "branded-water-bottles"],
  },
  {
    slug: "branded-water-bottles",
    name: "Branded Water Bottles",
    category: "gifts",
    summary: "Reusable bottles printed or laser-engraved with your logo.",
    description:
      "Reusable bottles that travel with your customers and team — to the gym, the office and every event. Choose aluminium, insulated stainless steel or glass, with a printed or permanently laser-engraved logo.",
    images: [
      { src: photo("1664714628878-9d2aa898b9e3"), alt: "Silver aluminium water bottle on a light grey background" },
      { src: photo("1602143407151-7111542de6e8"), alt: "Matte green insulated bottle on a white table" },
    ],
    industries: ["technology", "healthcare", "education", "hospitality", "retail"],
    useCases: ["gifting", "events", "marketing-campaign"],
    keywords: ["flasks", "tumblers", "drinkware", "thermos", "sports bottle", "eco"],
    included: ["Leak-proof lid", "Mock-up before production", "Individually boxed"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 75,
    optionGroups: [
      {
        id: "type",
        label: "Bottle",
        choices: [
          { id: "aluminium", label: "Aluminium 600ml", priceUSD: 9 },
          { id: "insulated", label: "Insulated steel 500ml", detail: "Hot 12h / cold 24h", priceUSD: 16 },
          { id: "glass", label: "Glass with bamboo lid", priceUSD: 13 },
        ],
      },
      {
        id: "branding",
        label: "Logo application",
        choices: [
          { id: "print", label: "1-colour print", priceUSD: 0 },
          { id: "engrave", label: "Laser engraving", priceUSD: 3 },
        ],
      },
    ],
    quantity: { min: 12, max: 1000, unit: "bottle", unitPlural: "bottles" },
    related: ["branded-mugs", "branded-tote-bags"],
    complementary: ["corporate-gift-boxes", "branded-t-shirts", "branded-notebooks"],
  },
  {
    slug: "branded-tote-bags",
    name: "Branded Tote Bags",
    category: "gifts",
    summary: "Cotton, jute and canvas totes for events and retail.",
    description:
      "Durable tote bags that double as walking billboards. Ideal for conference delegate packs, retail packaging and eco-friendly giveaways, printed in one colour or full colour on one side.",
    images: [
      { src: photo("1625552189081-9a268f141875"), alt: "Person holding a personalised jute tote bag printed with initials" },
      { src: photo("1574365569389-a10d488ca3fb"), alt: "Plain natural cotton tote bag on a grey surface" },
      { src: photo("1630381260512-e3fe55c11973"), alt: "Person in jeans holding a white canvas tote bag" },
    ],
    industries: ["retail", "education", "technology", "hospitality"],
    useCases: ["events", "gifting", "marketing-campaign"],
    keywords: ["bags", "shopping bags", "canvas bags", "jute bags", "eco bags", "delegate bags"],
    included: ["Reinforced handles", "Mock-up before production"],
    turnaround: { minDays: 5, maxDays: 8 },
    popularity: 68,
    optionGroups: [
      {
        id: "material",
        label: "Material",
        choices: [
          { id: "cotton", label: "Cotton canvas", priceUSD: 6 },
          { id: "jute", label: "Jute", priceUSD: 8 },
          { id: "heavy", label: "Heavy canvas with gusset", priceUSD: 11 },
        ],
      },
      {
        id: "print",
        label: "Print",
        choices: [
          { id: "1c", label: "1-colour, one side", priceUSD: 0 },
          { id: "full", label: "Full-colour, one side", priceUSD: 3 },
        ],
      },
    ],
    quantity: { min: 25, max: 2000, unit: "bag", unitPlural: "bags" },
    related: ["branded-t-shirts", "branded-water-bottles"],
    complementary: ["corporate-gift-boxes", "roll-up-banners", "stickers-and-labels"],
  },

  // ─── Create ────────────────────────────────────────────────────────────
  {
    slug: "logo-design",
    name: "Logo Design",
    category: "create",
    summary: "Original logo concepts from a dedicated designer.",
    description:
      "Work one-to-one with a senior designer to create a distinctive, versatile logo. We start with a short brief and mood board, present original concepts, refine your favourite and hand over every file format you need for print, web and social.",
    images: [
      { src: photo("1611532736597-de2d4265fba3"), alt: "Tablet showing a letter A logo sketch beside a stylus and design book" },
      { src: photo("1523726491678-bf852e717f6a"), alt: "Pen sketching logo ideas in a notebook" },
      { src: photo("1561070791-36c11767b26a"), alt: "Tablet displaying colourful gradient logo explorations" },
    ],
    industries: ["technology", "retail", "hospitality", "real-estate", "finance", "healthcare", "education"],
    useCases: ["brand-launch", "online-presence"],
    keywords: ["logo", "logotype", "brand mark", "emblem", "icon", "rebrand", "design"],
    included: [
      "Creative brief and mood board",
      "Original concepts by a senior designer",
      "Vector, PNG and SVG files",
      "Full copyright transfer",
    ],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 95,
    discount: { percent: 20, label: "20% off" },
    optionGroups: [
      {
        id: "package",
        label: "Package",
        choices: [
          { id: "starter", label: "Starter", detail: "2 concepts, 2 revision rounds", priceUSD: 350 },
          { id: "professional", label: "Professional", detail: "4 concepts, unlimited revisions", priceUSD: 650 },
          { id: "premium", label: "Premium", detail: "6 concepts + mini brand guide", priceUSD: 950 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "logo", unitPlural: "logos" },
    related: ["brand-identity", "product-packaging"],
    complementary: ["business-cards", "social-media-design", "website-design"],
  },
  {
    slug: "brand-identity",
    name: "Brand Identity",
    category: "create",
    summary: "A complete visual identity system and brand guidelines.",
    description:
      "Go beyond a logo with a full identity system: logo suite, colour palette, typography, imagery direction and brand guidelines your team and partners can follow. Ideal for new ventures and established businesses ready to rebrand.",
    images: [
      { src: photo("1561070791-2526d30994b5"), alt: "Colour swatch book fanned open beside a tablet showing brand colours" },
      { src: photo("1633533452148-a9657d2c9a5f"), alt: "Person holding branded coffee cups and packaging with a consistent identity" },
      { src: photo("1614036634955-ae5e90f9b9eb"), alt: "Open brand guidelines book showing yellow and black brand assets" },
    ],
    industries: ["technology", "finance", "hospitality", "retail", "real-estate", "healthcare", "education"],
    useCases: ["brand-launch", "online-presence", "product-launch"],
    keywords: ["branding", "brand guidelines", "visual identity", "rebrand", "style guide", "corporate identity"],
    included: [
      "Discovery workshop",
      "Logo suite and colour palette",
      "Typography and imagery direction",
      "Brand guidelines (PDF)",
    ],
    turnaround: { minDays: 10, maxDays: 14 },
    popularity: 89,
    optionGroups: [
      {
        id: "package",
        label: "Package",
        choices: [
          { id: "essential", label: "Essential identity", detail: "Logo suite, palette, type", priceUSD: 1200 },
          { id: "complete", label: "Complete identity", detail: "+ guidelines & stationery", priceUSD: 2400 },
          { id: "rollout", label: "Identity + rollout", detail: "+ social, signage & templates", priceUSD: 3800 },
        ],
      },
    ],
    quantity: { min: 1, max: 3, unit: "brand", unitPlural: "brands" },
    related: ["logo-design", "pitch-deck-design"],
    complementary: ["business-cards", "website-design", "office-wall-branding"],
  },
  {
    slug: "product-packaging",
    name: "Product Packaging",
    category: "create",
    summary: "Packaging and label design that sells on the shelf.",
    description:
      "Packaging design for food, beauty, wellness and consumer products. We design to your dieline (or create one), prepare print-ready files and can produce physical prototypes so you can test on shelf before a full run.",
    images: [
      { src: photo("1617825295690-28ae56c56135"), alt: "Rows of green and pink printed product boxes" },
      { src: photo("1595246135406-803418233494"), alt: "Brown kraft product box with sliding drawer on a beige background" },
    ],
    industries: ["retail", "hospitality", "healthcare"],
    useCases: ["product-launch", "brand-launch"],
    keywords: ["packaging design", "box design", "label design", "dieline", "pack", "unboxing"],
    included: ["Dieline preparation", "Print-ready artwork", "3D packaging mock-ups"],
    turnaround: { minDays: 10, maxDays: 15 },
    popularity: 74,
    optionGroups: [
      {
        id: "scope",
        label: "Scope",
        choices: [
          { id: "label", label: "Label design", detail: "1 SKU", priceUSD: 300 },
          { id: "box", label: "Box or pack design", detail: "1 SKU", priceUSD: 650 },
          { id: "range", label: "Packaging range", detail: "Up to 5 SKUs", priceUSD: 2200 },
        ],
      },
      {
        id: "prototype",
        label: "Prototypes",
        choices: [
          { id: "digital", label: "Digital files only", priceUSD: 0 },
          { id: "printed", label: "3 printed prototypes", priceUSD: 150 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "product line", unitPlural: "product lines" },
    related: ["stickers-and-labels", "brand-identity"],
    complementary: ["product-photography", "social-media-design", "website-design"],
  },
  {
    slug: "product-photography",
    name: "Product Photography",
    category: "create",
    summary: "Studio and lifestyle photos for e-commerce and ads.",
    description:
      "Clean, consistent product photography for online stores, marketplaces and ads. Send us your products and receive retouched images sized for your website and social channels. Lifestyle shoots include styling and props.",
    images: [
      { src: photo("1611930022073-b7a4ba5fcccd"), alt: "Bottle and jars stacked in a balanced studio product shot on a grey background" },
      { src: photo("1525966222134-fcfa99b8ae77"), alt: "Maroon canvas shoe photographed against a bright yellow backdrop" },
    ],
    industries: ["retail", "hospitality", "healthcare", "technology"],
    useCases: ["product-launch", "online-presence", "marketing-campaign"],
    keywords: ["photos", "photoshoot", "e-commerce images", "packshots", "studio", "lifestyle photography"],
    included: ["Studio set-up and lighting", "Colour-corrected, retouched images", "Web and social crops"],
    turnaround: { minDays: 3, maxDays: 5 },
    popularity: 77,
    optionGroups: [
      {
        id: "package",
        label: "Shoot",
        choices: [
          { id: "white-10", label: "10 studio shots", detail: "White background", priceUSD: 250 },
          { id: "white-25", label: "25 studio shots", detail: "White background", priceUSD: 520 },
          { id: "lifestyle-15", label: "15 lifestyle shots", detail: "Styled with props", priceUSD: 750 },
        ],
      },
      {
        id: "retouch",
        label: "Retouching",
        choices: [
          { id: "standard", label: "Standard retouch", priceUSD: 0 },
          { id: "advanced", label: "Advanced retouch", detail: "Clipping paths & shadows", priceUSD: 120 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "shoot", unitPlural: "shoots" },
    related: ["social-media-design", "product-packaging"],
    complementary: ["website-design", "social-media-management", "flyers"],
  },
  {
    slug: "pitch-deck-design",
    name: "Pitch Deck Design",
    category: "create",
    summary: "Investor and sales decks that tell a clear story.",
    description:
      "Turn your content into a deck that wins rooms. We structure the narrative, design every slide on-brand and deliver an editable master template so your team can keep presentations consistent.",
    images: [
      { src: photo("1505373877841-8d25f7d46678"), alt: "Presenter on stage in front of a large slide in a darkened auditorium" },
      { src: photo("1590098563831-d28f8c52726b"), alt: "Laptop on a desk showing a designed presentation slide" },
      { src: photo("1675716823435-054de29a2402"), alt: "Woman presenting in front of a projected slide" },
    ],
    industries: ["technology", "finance", "real-estate", "healthcare", "education"],
    useCases: ["brand-launch", "events", "product-launch"],
    keywords: ["presentation", "slides", "powerpoint", "keynote", "google slides", "investor deck", "sales deck"],
    included: ["Narrative structure review", "Custom slide design", "Editable master template"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 66,
    optionGroups: [
      {
        id: "length",
        label: "Deck length",
        choices: [
          { id: "12", label: "Up to 12 slides", priceUSD: 450 },
          { id: "20", label: "Up to 20 slides", priceUSD: 700 },
          { id: "30", label: "Up to 30 slides", priceUSD: 950 },
        ],
      },
      {
        id: "copy",
        label: "Copywriting",
        choices: [
          { id: "design", label: "Design only", priceUSD: 0 },
          { id: "story", label: "Copy editing & storyline", priceUSD: 250 },
        ],
      },
    ],
    quantity: { min: 1, max: 3, unit: "deck", unitPlural: "decks" },
    related: ["brand-identity", "website-design"],
    complementary: ["business-cards", "logo-design", "event-backdrops"],
  },

  // ─── Digital ───────────────────────────────────────────────────────────
  {
    slug: "website-design",
    name: "Website Design & Build",
    category: "digital",
    summary: "Fast, mobile-first websites built to convert.",
    description:
      "A responsive, SEO-ready website designed around your customers. We handle UX, design, build and launch, with analytics set up from day one. Choose a CMS if your team wants to edit content without a developer.",
    images: [
      { src: photo("1547658719-da2b51169166"), alt: "Desktop monitor, tablet and phone displaying a responsive website" },
      { src: photo("1499951360447-b19be8fe80f5"), alt: "Laptop and desktop computer showing website designs on a tidy desk" },
      { src: photo("1781606989061-420b8dda8a17"), alt: "Tablet displaying a website layout with images and text" },
    ],
    industries: ["technology", "real-estate", "hospitality", "retail", "finance", "healthcare", "education"],
    useCases: ["online-presence", "brand-launch", "product-launch"],
    keywords: ["website", "web design", "web development", "landing page", "e-commerce", "online store", "site"],
    included: [
      "UX wireframes and design",
      "Responsive build and launch",
      "On-page SEO and analytics set-up",
      "30 days post-launch support",
    ],
    turnaround: { minDays: 15, maxDays: 25 },
    popularity: 91,
    optionGroups: [
      {
        id: "package",
        label: "Website type",
        choices: [
          { id: "landing", label: "Landing page", detail: "Single page", priceUSD: 900 },
          { id: "business", label: "Business website", detail: "Up to 6 pages", priceUSD: 2400 },
          { id: "store", label: "E-commerce store", detail: "Up to 50 products", priceUSD: 4200 },
        ],
      },
      {
        id: "cms",
        label: "Content editing",
        choices: [
          { id: "static", label: "Managed by Branda", priceUSD: 0 },
          { id: "cms", label: "Self-edit with a CMS", priceUSD: 600 },
        ],
      },
    ],
    quantity: { min: 1, max: 3, unit: "website", unitPlural: "websites" },
    related: ["email-newsletter-design", "social-media-design"],
    complementary: ["seo-audit", "product-photography", "brand-identity"],
  },
  {
    slug: "social-media-design",
    name: "Social Media Design",
    category: "digital",
    summary: "On-brand post and story designs, ready to publish.",
    description:
      "A batch of scroll-stopping post and story designs sized for Instagram, LinkedIn, Facebook and X. We create reusable templates in your brand style so every post looks consistent, whether we publish it or your team does.",
    images: [
      { src: photo("1781606989068-50d248c5b22b"), alt: "Smartphone and tablet displaying social media posts" },
      { src: photo("1784729553984-9738651e9dc6"), alt: "Hand holding a smartphone showing a social media feed" },
    ],
    industries: ["retail", "hospitality", "technology", "real-estate", "education", "healthcare"],
    useCases: ["online-presence", "marketing-campaign", "product-launch"],
    keywords: ["instagram posts", "social posts", "graphics", "content design", "stories", "linkedin", "carousel"],
    included: ["Post and story sizes", "Editable templates", "Two revision rounds"],
    turnaround: { minDays: 3, maxDays: 5 },
    popularity: 87,
    discount: { percent: 10, label: "10% off" },
    optionGroups: [
      {
        id: "pack",
        label: "Design pack",
        choices: [
          { id: "10", label: "10 post designs", priceUSD: 180 },
          { id: "20", label: "20 post designs", priceUSD: 320 },
          { id: "30", label: "30 posts + 5 story templates", priceUSD: 450 },
        ],
      },
    ],
    quantity: { min: 1, max: 12, unit: "pack", unitPlural: "packs" },
    related: ["social-media-management", "flyers"],
    complementary: ["logo-design", "product-photography", "website-design"],
  },
  {
    slug: "social-media-management",
    name: "Social Media Management",
    category: "digital",
    summary: "Monthly content planning, publishing and reporting.",
    description:
      "Hand over your social channels to a dedicated content manager. Each month we plan a content calendar, design and publish posts, respond to comments and report on what is working.",
    images: [
      { src: photo("1563986768494-4dee2763ff3f"), alt: "Person using a laptop and smartphone to manage social media" },
      { src: photo("1563986768609-322da13575f3"), alt: "Hands holding a phone beside a laptop showing a social media dashboard" },
    ],
    industries: ["retail", "hospitality", "real-estate", "education", "healthcare", "technology"],
    useCases: ["online-presence", "marketing-campaign"],
    keywords: ["social media manager", "community management", "content calendar", "posting", "smm", "instagram management"],
    included: ["Monthly content calendar", "Design and publishing", "Monthly performance report"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 79,
    optionGroups: [
      {
        id: "plan",
        label: "Plan",
        choices: [
          { id: "starter", label: "Starter", detail: "2 platforms, 12 posts/month", priceUSD: 600 },
          { id: "growth", label: "Growth", detail: "3 platforms, 20 posts/month", priceUSD: 1000 },
          { id: "pro", label: "Pro", detail: "4 platforms, 30 posts + reporting call", priceUSD: 1500 },
        ],
      },
    ],
    quantity: { min: 1, max: 12, unit: "month", unitPlural: "months" },
    related: ["social-media-design", "seo-audit"],
    complementary: ["product-photography", "website-design", "email-newsletter-design"],
  },
  {
    slug: "seo-audit",
    name: "SEO Audit & Optimisation",
    category: "digital",
    summary: "Find and fix what keeps your site off page one.",
    description:
      "A technical and content SEO review of your website with a prioritised action plan. Upgrade to include keyword strategy or three months of hands-on optimisation by our team.",
    images: [
      { src: photo("1551288049-bebda4e38f71"), alt: "Laptop screen showing website performance analytics charts" },
      { src: photo("1460925895917-afdab827c52f"), alt: "Laptop on a glass table displaying traffic graphs" },
      { src: photo("1633307057722-a4740ba0c5d0"), alt: "Computer screen showing a site overview line graph" },
    ],
    industries: ["technology", "retail", "real-estate", "hospitality", "finance", "healthcare", "education"],
    useCases: ["online-presence", "marketing-campaign"],
    keywords: ["search engine optimisation", "optimization", "google ranking", "keywords", "site audit", "traffic"],
    included: ["Technical crawl report", "Prioritised action plan", "Walk-through call"],
    turnaround: { minDays: 5, maxDays: 7 },
    popularity: 62,
    optionGroups: [
      {
        id: "scope",
        label: "Scope",
        choices: [
          { id: "audit", label: "Technical audit", detail: "Up to 50 pages", priceUSD: 400 },
          { id: "strategy", label: "Audit + keyword strategy", priceUSD: 750 },
          { id: "optimise", label: "Audit + 3 months optimisation", priceUSD: 1800 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "website", unitPlural: "websites" },
    related: ["website-design", "social-media-management"],
    complementary: ["email-newsletter-design", "social-media-design"],
  },
  {
    slug: "email-newsletter-design",
    name: "Email Newsletter Design",
    category: "digital",
    summary: "Responsive email templates that render everywhere.",
    description:
      "On-brand, responsive email templates tested across major email clients. Delivered as clean HTML or built directly in your email marketing platform, ready for newsletters, promotions and onboarding sequences.",
    images: [
      { src: photo("1486312338219-ce68d2c6f44d"), alt: "Hands typing on a laptop keyboard" },
      { src: photo("1596526131083-e8c633c948d2"), alt: "Close-up of a mail app icon with a notification badge on a phone" },
    ],
    industries: ["retail", "technology", "finance", "education", "hospitality"],
    useCases: ["marketing-campaign", "online-presence", "product-launch"],
    keywords: ["email template", "newsletter", "mailchimp", "email marketing", "html email", "edm"],
    included: ["Responsive HTML template", "Cross-client testing", "Style guide for future emails"],
    turnaround: { minDays: 3, maxDays: 5 },
    popularity: 58,
    optionGroups: [
      {
        id: "package",
        label: "Templates",
        choices: [
          { id: "1", label: "1 template", priceUSD: 220 },
          { id: "3", label: "3 templates + style guide", priceUSD: 520 },
        ],
      },
      {
        id: "delivery",
        label: "Delivery",
        choices: [
          { id: "html", label: "HTML files", priceUSD: 0 },
          { id: "platform", label: "Built in your email platform", priceUSD: 80 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "set", unitPlural: "sets" },
    related: ["social-media-design", "website-design"],
    complementary: ["seo-audit", "product-photography", "brand-identity"],
  },

  // ─── Studio ────────────────────────────────────────────────────────────
  {
    slug: "office-interior-design",
    name: "Office Interior Design",
    category: "studio",
    summary: "Workspaces designed around how your team works.",
    description:
      "From space planning to finishes, our workspace designers create offices that reflect your brand and support focus, collaboration and wellbeing. Add 3D visuals to see the space before you build, or let us manage the fit-out end to end.",
    images: [
      { src: photo("1758630737900-a28682c5aa69"), alt: "Bright modern office with rows of desks and glass partitions" },
      { src: photo("1716703373229-b0e43de7dd5c"), alt: "Open-plan office with colourful ceiling features and workstations" },
      { src: photo("1497366811353-6870744d04b2"), alt: "Industrial-style office with a meeting table beside large windows" },
    ],
    industries: ["technology", "finance", "real-estate", "healthcare", "education"],
    useCases: ["office-setup", "brand-launch"],
    keywords: ["interior design", "office design", "workspace", "fit out", "space planning", "renovation"],
    included: ["Site survey and space plan", "Material and finish board", "Furniture specification"],
    turnaround: { minDays: 20, maxDays: 30 },
    popularity: 64,
    optionGroups: [
      {
        id: "scope",
        label: "Scope",
        choices: [
          { id: "concept", label: "Concept design", detail: "Up to 100 m²", priceUSD: 2500 },
          { id: "visuals", label: "Design + 3D visuals", detail: "Up to 300 m²", priceUSD: 5500 },
          { id: "build", label: "Design & build management", detail: "Up to 300 m²", priceUSD: 9500 },
        ],
      },
    ],
    quantity: { min: 1, max: 5, unit: "floor", unitPlural: "floors" },
    related: ["meeting-room-makeover", "office-wall-branding"],
    complementary: ["reception-signage", "branded-mugs", "branded-notebooks"],
  },
  {
    slug: "office-wall-branding",
    name: "Office Wall Branding",
    category: "studio",
    summary: "Feature walls, murals and glass manifestation.",
    description:
      "Bring your brand and values into the workplace with printed feature walls, frosted glass manifestation and hand-painted murals. We survey, design, print and install with minimal disruption to your team.",
    images: [
      { src: photo("1765366417031-60bc8543189c"), alt: "Office lounge with a large illustrated mural on the wall" },
      { src: photo("1715593949878-1e1495ca2e50"), alt: "Office break area with a branded wall graphic and lettering" },
      { src: photo("1764298493216-9e201bf30e16"), alt: "Wall with a hand-lettered sign behind green plants" },
    ],
    industries: ["technology", "finance", "hospitality", "education", "healthcare"],
    useCases: ["office-setup", "brand-launch"],
    keywords: ["wall graphics", "murals", "wallpaper", "glass frosting", "manifestation", "office branding", "wall art"],
    included: ["Site survey and measurements", "Design mock-ups in situ", "Professional installation"],
    turnaround: { minDays: 7, maxDays: 10 },
    popularity: 69,
    optionGroups: [
      {
        id: "size",
        label: "Area",
        choices: [
          { id: "10", label: "Feature wall", detail: "Up to 10 m²", priceUSD: 650 },
          { id: "25", label: "Up to 25 m²", priceUSD: 1300 },
          { id: "50", label: "Up to 50 m²", priceUSD: 2300 },
        ],
      },
      {
        id: "finish",
        label: "Finish",
        choices: [
          { id: "wallpaper", label: "Printed wallpaper", priceUSD: 0 },
          { id: "glass", label: "Vinyl on glass", priceUSD: 150 },
          { id: "mural", label: "Hand-painted mural", priceUSD: 900 },
        ],
      },
    ],
    quantity: { min: 1, max: 10, unit: "area", unitPlural: "areas" },
    related: ["reception-signage", "event-backdrops"],
    complementary: ["brand-identity", "meeting-room-makeover", "branded-mugs"],
  },
  {
    slug: "reception-signage",
    name: "Reception Signage",
    category: "studio",
    summary: "Logo signs that make your entrance unmistakable.",
    description:
      "Make arrival memorable with a reception logo sign in acrylic, brushed metal or backlit LED. We produce to scale from your vector logo and install securely on walls or reception desks.",
    images: [
      { src: photo("1764727291644-5dcb0b1a0375"), alt: "Modern reception desk with a sign mounted overhead" },
      { src: photo("1777573361248-f05f1efcc431"), alt: "Brushed metal reception desk in an office lobby" },
      { src: photo("1470290378698-263fa7ca60ab"), alt: "Minimal white reception counter with a pendant light" },
    ],
    industries: ["finance", "real-estate", "healthcare", "hospitality", "technology"],
    useCases: ["office-setup", "brand-launch"],
    keywords: ["signage", "logo sign", "3d letters", "led sign", "lobby sign", "acrylic sign", "signboard"],
    included: ["Scale drawing for approval", "Fixings and installation", "12-month workmanship warranty"],
    turnaround: { minDays: 7, maxDays: 12 },
    popularity: 60,
    optionGroups: [
      {
        id: "type",
        label: "Sign type",
        choices: [
          { id: "acrylic", label: "Acrylic logo panel", priceUSD: 450 },
          { id: "metal", label: "3D brushed-metal letters", priceUSD: 900 },
          { id: "led", label: "Backlit LED logo", priceUSD: 1400 },
        ],
      },
      {
        id: "size",
        label: "Width",
        choices: [
          { id: "1m", label: "Up to 1 m wide", priceUSD: 0 },
          { id: "2m", label: "Up to 2 m wide", priceUSD: 350 },
        ],
      },
    ],
    quantity: { min: 1, max: 10, unit: "sign", unitPlural: "signs" },
    related: ["office-wall-branding", "roll-up-banners"],
    complementary: ["office-interior-design", "business-cards", "brand-identity"],
  },
  {
    slug: "meeting-room-makeover",
    name: "Meeting Room Makeover",
    category: "studio",
    summary: "Branded meeting rooms ready for clients and calls.",
    description:
      "Transform tired meeting rooms into spaces you are proud to host clients in. We redesign layout, lighting, acoustics and branding, and can source furniture and video-conferencing equipment.",
    images: [
      { src: photo("1758711516684-e7a87556015e"), alt: "Meeting room with orange chairs around a white table and framed artwork" },
      { src: photo("1764810815228-b7f9432eec5c"), alt: "Wood-panelled boardroom with an oval table and wall-mounted screen" },
      { src: photo("1431540015161-0bf868a2d407"), alt: "Long conference table with chairs beside floor-to-ceiling windows" },
    ],
    industries: ["finance", "technology", "real-estate", "healthcare", "education"],
    useCases: ["office-setup"],
    keywords: ["boardroom", "conference room", "meeting space", "huddle room", "office refurbishment"],
    included: ["Layout and lighting plan", "Acoustic recommendations", "Branding and finishes"],
    turnaround: { minDays: 15, maxDays: 20 },
    popularity: 52,
    optionGroups: [
      {
        id: "room",
        label: "Room size",
        choices: [
          { id: "huddle", label: "Huddle room", detail: "2–4 seats", priceUSD: 1800 },
          { id: "boardroom", label: "Boardroom", detail: "8–12 seats", priceUSD: 4200 },
        ],
      },
      {
        id: "scope",
        label: "Scope",
        choices: [
          { id: "design", label: "Design & branding only", priceUSD: 0 },
          { id: "sourcing", label: "Including AV & furniture sourcing", priceUSD: 1500 },
        ],
      },
    ],
    quantity: { min: 1, max: 10, unit: "room", unitPlural: "rooms" },
    related: ["office-interior-design", "office-wall-branding"],
    complementary: ["pitch-deck-design", "reception-signage", "branded-notebooks"],
  },
];
