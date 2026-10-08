# Task 3 — Code Quality and Architecture

Branda V2 is **one Next.js app** with three parts that share components and code:
- **Customer ordering platform:** browse, configure, cart, checkout.
- **Content and SEO layer:** homepages, service pages, guides, fed by a CMS.
- **Role-based dashboards:** for customers, operations, designers, partners and admins.

## 1. Folder structure (App Router)

Folders are URLs. `[market]` is a variable in the URL. `(group)` is a **route group**: it organises files and gives a section its own layout, without appearing in the URL.

```
src/
├── app/
│   ├── [market]/              /ng, /us, /uk, /ca — one set of pages for every market
│   │   ├── layout.tsx         Header, footer, market selector
│   │   ├── (shop)/            services, services/[slug], cart, checkout
│   │   ├── (content)/         home, guides/[slug], blog/[slug] (CMS)
│   │   └── (account)/         orders, profile — signed-in customers
│   └── (dashboard)/dashboard/ /dashboard/ops, /dashboard/admin — own layout + role check
├── components/                Reusable UI
├── lib/                       Business logic and data access (no UI)
├── data/                      Config: markets, categories
└── proxy.ts                   Runs before each request: market redirects, sign-in checks
```

- **Layouts** give each section its shell once: the shop gets the header and cart; dashboards get a sidebar and a sign-in check.
- **Per-market routing:** all markets share the same pages. The market code in the URL loads that market's currency, prices and content from one config file. Adding a new market means adding one config entry, not copying pages.
- *This repo builds the shop and content pages directly under `[market]/`. The route groups above are how I'd organise them as dashboards and accounts are added.*

## 2. Component architecture

| Layer | Examples | Rule |
| --- | --- | --- |
| UI primitives | Button styles, Price, Skeleton, EmptyState | No Branda knowledge; reusable everywhere, including dashboards |
| Feature components | ServiceCard, FilterPanel, CartView | Built from primitives for one feature |
| Pages | `services/page.tsx` | Fetch data and arrange components; no business rules |
| Logic (`lib/`) | Prices, totals, search, validation | Plain, tested functions shared by browser and server |

Each business rule is written once, so the product page, cart, checkout and server always agree on prices.

## 3. State management

| Kind | Where it lives | Example |
| --- | --- | --- |
| **Server state:** business data, the same for everyone | Fetched on the server and cached | Services, prices, categories |
| **URL state:** shareable choices | The address bar | Search, filters, sort, page |
| **Client state:** belongs to one visitor | Browser storage | The cart |
| **UI state:** temporary | Inside the component | The selected option |

- **The cart is client state:** it's personal, changes often and must work without signing in. After sign-in it would merge into a server-side cart.
- **The catalog stays on the server:** it's shared, needed in the HTML for SEO, and cacheable.

## 4. API and service layer

- Pages call **one server-only data layer** (`lib/catalog.ts`), never APIs directly. Swapping the mock data for a real API or CMS means changing that file only.
- **Reads** are cached and refreshed when the CMS publishes.
- **Writes** go through Server Actions (server functions that forms call directly).
- **The server never trusts the browser:** it re-validates every order and recalculates prices.

## 5. Forms and validation

- The validation rules are written once and run twice: in the browser for instant feedback, then on the server as the final check.
- Errors appear next to each field, are announced to screen readers, and focus moves to the first problem.
- Plain React handles small forms. For large or multi-step forms I'd use **React Hook Form + Zod**.

## 6. Error handling

- `loading.tsx` shows a skeleton shaped like the real page.
- `error.tsx` shows a friendly message with **Try again**; the header and cart keep working.
- `not-found.tsx` shows a helpful 404 with a real 404 status code.
- Empty states (no results, empty cart) explain what happened and suggest a next step.
- Checkout and network errors show a clear message, and the cart is kept.
- In production, errors are also reported to a monitoring tool (for example Sentry).

## 7. Authentication and user state *(approach only, not built)*

- **Social login:** Google, Apple and LinkedIn, plus email magic links, using Auth.js or Clerk.
- **Sessions:** a secure, HTTP-only cookie (unreadable by JavaScript); never tokens in `localStorage`.
- **Protected routes:** `proxy.ts` redirects signed-out users away from `/account` and `/dashboard`. **The server checks again** on every page and action, because the first check alone can be bypassed.
- **Role-based access:** users have roles (customer, ops, designer, partner, admin). Dashboards check the role on the server, and the data layer checks it again. Hiding a button is never the only protection.

## 8. Multi-market, currency and localisation

- **One config file** (`data/markets.ts`) holds each market's country, language, currency, tax and content.
- **Subfolder URLs** (`/ng`, `/us`, `/uk`, `/ca`), not subdomains: one domain builds SEO strength for all markets, and there's one deployment.
- **Currency** is shown in local format (₦11,500, $25.00, £20.00, CA$34.00). Prices are stored as whole kobo or cents so rounding can't drift.
- **Localised content:** each market has its own headline and featured services. Translations would be added per language if needed (for example `fr-CA`).
- **Localised metadata:** titles and descriptions per page and market, for example "Business Cards | Branda Nigeria".
- **hreflang** links each page to its versions in the other markets, so Google shows the right market to each country. It's in both the page `<head>` and the sitemap.
- **Canonical URLs** point search engines to the main version of a page, so filter and search URLs don't compete with it.

## 9. Responsive design

- **Mobile-first with Tailwind CSS,** with a deliberate layout per screen size. On phones: a swipeable category row, a filters button, and a pinned "Add to cart" bar.
- **Accessible by default:** real buttons and form fields, keyboard support, visible focus outlines, descriptive alt text, and WCAG AA text contrast.
- Tested from 320 px to 1366 px wide.

## 10. Maintainability, testing and documentation

- **TypeScript in strict mode** catches mistakes before the code runs.
- **Clear separation:** URLs in `app/`, UI in `components/`, rules in `lib/`.
- **Tests:**
  - Unit tests (Vitest) for prices, totals, tax, search and URLs.
  - End-to-end tests drive a real browser through the whole order journey.
  - Both run in CI on every change.
- **Linting** (ESLint) enforces consistent code.
- **Documentation:** a README (setup and key decisions), short docs like this one, and comments that explain *why*.

## 11. Git workflow

- **Protected `main`:** changes only arrive through pull requests.
- **One branch per change** (`feat/cart`, `fix/checkout-error`) with small, clear commits (`feat(cart): save cart per market`).
- **Pull requests** include what changed and why, screenshots, and a preview link.
- **Merging** needs passing checks (lint, types, tests, build) and one approving review.
- **Squash merge** keeps history clean; **feature flags** hide unfinished work such as a new market.
