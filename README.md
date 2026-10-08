# Branda V2 — Service Ordering Interface

A multi-market service ordering interface for Branda, built for the Frontend Developer technical assessment.

**Stack:** Next.js 16 (App Router, Cache Components), React 19, TypeScript (strict), Tailwind CSS 4.

Customers can browse and search Branda's five service categories (Prints, Gifts, Create, Digital, Studio), configure a service with live pricing, and order through a cart and checkout. All of this works in four markets: Nigeria, USA, UK and Canada.

| Document | Covers |
| --- | --- |
| [`docs/architecture.md`](docs/architecture.md) | Task 3 — structure, rendering, state, data layer, forms, errors, auth, multi-market, accessibility, Git workflow |
| [`docs/performance.md`](docs/performance.md) | Task 2 — measured baseline, the six performance scenarios, techniques, rendering strategy, Core Web Vitals |
| [`docs/branda-review.md`](docs/branda-review.md) | Task 4 — evidence-based review of branda.com.ng and three V2 priorities |
| [`docs/screening-answers.md`](docs/screening-answers.md) | Task 5 — short answers |

---

## Getting started

### Prerequisites

- **Node.js 20.9 or newer** (developed on Node 24) and npm.
- **Google Chrome**, only for the optional end-to-end test.

### 1. Install

```bash
git clone <repository-url> branda
cd branda
npm install
```

### 2. Run in development

```bash
npm run dev
```

Open **http://localhost:3000**. It redirects to `/ng` (Nigeria), or to the market you last chose.

### 3. Run the production build (recommended for review)

The dev server is slower and adds development overlays. To see real rendering and performance:

```bash
npm run build
npm start
```

Then open http://localhost:3000.

### 4. Try the main journey

| What to try | Where |
| --- | --- |
| Switch market with the selector in the header (currency changes; you stay on the same page) | any page |
| Search (typos work: `buisness card`), filter, sort and paginate. The URL updates, so the link can be shared or refreshed | `/ng/services` |
| A pre-filtered listing opened straight from a URL | `/ng/services?category=prints&industry=real-estate&sort=popular` |
| Change options and quantity and watch the price update, then Add to cart or Order now | `/ng/services/business-cards` |
| Edit quantities, remove items, check out (any name and email), see the confirmation | `/ng/cart` |
| Other markets | `/us`, `/uk`, `/ca` |
| An unknown service (returns HTTP 404 with recovery links) | `/ng/services/abc` |

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server on port 3000 |
| `npm run build` | Production build (prerenders 145 pages) |
| `npm start` | Serves the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` + TypeScript rules) |
| `npm run typecheck` | Generates route types, then `tsc --noEmit` |
| `npm test` | Unit tests (Vitest) for pricing, cart, search and URL state |
| `npm run e2e` | End-to-end journey in your installed Chrome. Start the app first (`npm start`), then run this in a second terminal. Screenshots go to `e2e-artifacts/` |

### Configuration

There is no `.env` file to set up. One variable is optional:

| Variable | Default | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | Base URL for canonical links, hreflang, Open Graph and `sitemap.xml`. Set it to the real domain when deploying |

### Troubleshooting

- **Port 3000 is in use:** run `npm run dev -- -p 3001` (or `npm start -- -p 3001`) and open that port.
- **`npm run e2e` can't find Chrome:** set `CHROME_PATH` to your Chrome executable. To test a different port, pass the URL: `npm run e2e -- http://localhost:3001`.

---

## Key decisions

These are the decisions that shape the codebase. Each one has a short reason here; [`docs/architecture.md`](docs/architecture.md) covers them in depth.

**1. One route tree for all markets, driven by config.**
`/ng`, `/us`, `/uk` and `/ca` share `app/[market]/`. Currency, tax, hero copy and featured services all come from [`src/data/markets.ts`](src/data/markets.ts).
*Why:* subfolders keep one domain for SEO and one deployment. Launching a market means adding a config entry, not copying pages.

**2. The URL is the source of truth for the listing.**
Search, category, filters, sort and page are all search params, parsed in one place ([`src/lib/service-query.ts`](src/lib/service-query.ts)). Results are rendered on the server from them. Client controls only change the URL; they don't hold filter state.
*Why:* links can be shared and bookmarked, refresh and the back button work, and results are server-rendered and crawlable.

**3. A rendering strategy per kind of content, not one for the whole app.**

| Content | Strategy |
| --- | --- |
| Market homepages and all 100 service pages (25 services × 4 markets) | Static, generated at build time |
| Listing | A static page frame, with results rendered on the server for each request (Partial Prerendering) |
| Cart and checkout | Client-side |

*Why:* catalog content is the same for everyone and should come from the CDN; filtered results depend on the URL; the cart belongs to one visitor.

**4. A server-only data-access layer.**
Pages get data only through [`src/lib/catalog.ts`](src/lib/catalog.ts), which is cached with `'use cache'` and tagged for on-demand revalidation. The mock data sits behind one function.
*Why:* replacing the mock catalog with a real API or CMS changes that function, not the UI.

**5. The cart is client state with no provider.**
It's stored in `localStorage`, one cart per market, and read with `useSyncExternalStore` ([`src/lib/cart-store.ts`](src/lib/cart-store.ts)).
*Why:* the server snapshot is empty, so server and client agree during hydration (no mismatch errors). No provider wraps the layout, so the rest of the app stays Server Components. Carts are per market because a naira price can't be paid in dollars.

**6. The server is the authority on prices.**
Checkout calls a Server Action that re-validates the input and recomputes every price from the catalog. Prices sent by the browser are only compared, to detect changes.
*Why:* anything sent from the browser can be modified.

**7. Business rules are pure functions shared by client and server.**
Pricing, cart totals, tax rounding, search and URL handling live in `src/lib` and are unit-tested.
*Why:* the configurator, cart, checkout and server action compute prices with the same code, so they can't disagree.

**8. Real 404s for unknown services and markets.**
[`src/proxy.ts`](src/proxy.ts) checks the market and service slug before rendering.
*Why:* with Partial Prerendering, Next.js starts streaming a `200` page before a page component can call `notFound()`. The proxy check makes `/ng/services/abc` return a true `404`, which search engines respect.

**9. Minimal dependencies.**
Besides Next.js and React, the only runtime dependency is `server-only`. Currency formatting uses `Intl`, controls are native `<select>` and radio inputs, icons are inline SVG, and form validation is one shared function.
*Why:* less JavaScript for mobile users (7–9 KB gzipped of app code per route), and nothing a library would add that the brief needs. React Hook Form and Zod would make sense for larger, multi-step forms.

**10. Accessibility shapes the UI choices.**
Native controls give keyboard and screen reader support for free. Each service card has a single link. The brand green is darkened to `#0a6e33` (6.4:1 contrast with white). Result counts and price changes are announced. There's a skip link.
*Why:* Lighthouse scores Accessibility 100 on every page audited.

**11. Images are optimised, with one priority image per page.**
`next/image` serves AVIF/WebP with `sizes` that match the layout. Only the likely LCP image loads eagerly with high priority; the rest load lazily.
*Why:* thumbnails come out at 6–18 KB, and layout shift (CLS) is 0 on every page.

---

## Project structure

```
src/
├── app/            Routes only: pages, layouts, loading/error/not-found, metadata, sitemap, robots
│   └── [market]/   Shared tree for /ng /us /uk /ca (home, services, services/[slug], cart, checkout)
├── components/     UI primitives (ui/) and domain components (services/, cart/, market/, layout/)
├── data/           Mock sources shaped like API responses: services, markets, taxonomy
├── lib/            Business logic and data access (no JSX) plus unit tests
├── proxy.ts        Market redirects and 404 checks (runs before rendering)
└── types/          Shared domain types
scripts/e2e.mjs     End-to-end journey (puppeteer-core)
docs/               Assessment write-ups
```

## What's implemented

- **Service listing:**
  - Search over name, synonyms, category, industry, use case and description, tolerant of typos.
  - Category filter with live counts; Industry, Use case and Turnaround filters; sort by popularity or price; page-number pagination.
  - Skeleton loading, empty-result and error states.
- **Service detail:**
  - Image gallery, description, what's included, turnaround.
  - Option groups and quantity (with per-service minimums) that update the price live.
  - Add to Cart, Order Now, and hand-picked related and complementary services.
  - Per-service title, description, Open Graph image, canonical and hreflang.
- **Cart and checkout:**
  - Add, remove, increase and decrease; subtotal, tax and total from one shared function; empty-cart state.
  - Contact form validated in the browser and on the server, then a confirmation page that survives a refresh.
- **Multi-market:**
  - Country/currency selector that keeps you on the same page; ₦, $, £ and CA$ formatting.
  - Market-specific hero copy and featured services.
- **SEO:** dynamic metadata, canonical URLs, hreflang for all four markets, `sitemap.xml`, `robots.txt`, and `noindex` on search results, cart and checkout.
- **Responsive:** layouts designed per breakpoint, for example a swipeable category row, collapsible filters and a sticky price bar on phones. Checked at 320, 390, 820 and 1366 px.

## Validation

All of these were run against the production build:

| Check | Result |
| --- | --- |
| `npm run lint`, `npm run typecheck` | Pass |
| `npm test` | 28/28 unit tests pass |
| `npm run build` | Pass, 145 pages prerendered |
| `npm run e2e` | 87/87 checks. Covers all 23 steps of the brief's validation list, plus browser console (no errors or hydration warnings), no viewport overflow at four widths, and keyboard checks |
| Lighthouse | Accessibility 100, Best Practices 100, CLS 0 on all audited pages; desktop homepage Performance 96 (details in [`docs/performance.md`](docs/performance.md)) |

## Scope limitations

These come from the brief's mock-data, no-payment scope:

- **Mock catalog and pricing.** Prices are authored in USD and converted per market by a rule. A real backend would provide a price list per market.
- **No payment, persistence or email.** An order is validated and priced on the server and gets a mock order number. Nothing is stored or sent, and the confirmation page says so.
- **Flat tax rate per market**, labelled as an estimate. Real US and Canadian tax depends on the delivery address, and UK consumer prices are usually shown VAT-inclusive.
- **No authentication.** The production approach is described in `docs/architecture.md` rather than faked.
- **Unknown-service 404s use the mock slug list.** With a CMS, this would be a list generated on publish.

## Credits

Photography from [Unsplash](https://unsplash.com), used under the Unsplash License. Each photo was chosen to match its service and avoid prominent third-party trademarks, with alt text written for each image.
