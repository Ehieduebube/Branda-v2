# Task 2 — Frontend Performance

**My approach:** first measure what's actually slow, then fix the biggest cause, then measure again to confirm it improved. I'd measure with real-user data and tools like Lighthouse and Chrome DevTools.

## The six problems

| Problem | Why it usually happens | How I'd fix it |
| --- | --- | --- |
| **The first page load is slow** | The server builds the page from scratch on every visit, and scripts block the page from showing | Build pages in advance and serve them from servers close to the user (a CDN). Show the page first and load slow parts after |
| **Images load slowly** | Images are too big or in old formats, and the main image is loaded last | Send smaller, modern images sized for each screen. Load the main image first and the rest only when needed |
| **The site is slow on phones** | Too much JavaScript for a phone's processor to run | Do most of the work on the server and send phones less code |
| **Too many API requests** | Data is fetched again on every visit, on every keystroke, or one item at a time | Fetch once on the server and reuse it, wait until the user stops typing, and ask for many items in one request |
| **Components re-render unnecessarily** | One small change causes large parts of the page to redraw | Keep each piece of data close to where it's used, so a change only redraws what it affects |
| **The JavaScript bundle is too large** | Code that doesn't need to run in the browser is sent there anyway, plus heavy libraries | Find the biggest pieces, keep them on the server, replace or remove heavy libraries, and load rare features only when needed |

## How each technique helps

**Images**
- Use Next.js's `next/image` component. It shrinks images, converts them to modern formats and only loads them when they're about to appear on screen.
- Use modern formats: AVIF and WebP files are much smaller than JPEG or PNG.
- Tell the browser how wide each image will be (`sizes`), so a phone downloads a phone-sized image, not a desktop one.
- Mark only the main image as high priority (in Next.js: `loading="eager"` and `fetchPriority="high"`). If every image is "high priority", none of them is, and the important one arrives later.

**Lazy loading and dynamic imports**
- *Lazy loading* means loading something only when it's needed.
- Load large features (for example an artwork upload tool or dashboard charts) only when the user opens them, using `next/dynamic`.
- Load chat widgets after the page is ready, using `next/script` with `lazyOnload`.
- Small components don't need this: Next.js already loads each page's code separately.

**Code splitting**
- Next.js automatically splits code per page, so visiting the homepage doesn't download the checkout's code.
- Parts of the page that never change (text, cards, navigation) can be *Server Components*: built on the server and sent as plain HTML, with no JavaScript.
- Only interactive parts (search, filters, the cart) need code in the browser.

**Caching** — saving a result so it doesn't have to be fetched or built again
- **On the server:** save catalog data instead of fetching it on every visit (`'use cache'` or the `fetch` cache).
- **Revalidation:** refresh saved data automatically every hour, or instantly when content is updated in the CMS.
- **On a CDN:** store finished pages on servers around the world, so users get them from somewhere nearby.
- **In the browser:** let the browser keep files it has already downloaded.
- **Never cache personal data** (carts, accounts, final checkout prices) where other users could receive it.

**API requests**
- **Deduplicate:** if several parts of a page need the same data, fetch it once and share it.
- **Batch:** ask for related items in one request, not one request per item.
- **Debounce:** wait until the user stops typing (about a third of a second) before searching.
- **Run in parallel:** start independent requests at the same time instead of one after another.

**Components**
- Build on the server by default; those parts never redraw in the browser.
- Keep each piece of data in the component that uses it, so changes stay local.
- *Memoisation* (`React.memo`, `useMemo`, `useCallback`) saves a result so React can skip work. Use it only where measurement shows a real gain; overusing it adds complexity for no benefit.

**Bundle size**
- Measure what's inside the bundle with the bundle analyzer (`npx next analyze`).
- *Tree shaking* is the build automatically dropping code you import but never use. It works best when you import only the specific functions you need.
- Prefer features built into the browser over libraries (for example, `Intl` to format currency).
- Load third-party scripts (analytics, chat) once, and only after the page is usable.

**Rendering strategy** — when and where a page is built

| Strategy | What it means | Best for (in Branda) |
| --- | --- | --- |
| **SSG** (static) | Built once in advance | Service and category pages |
| **ISR** (static, refreshed) | Built in advance and rebuilt when content changes | The same pages, when the catalog is updated |
| **SSR** (per request) | Built fresh for each visit | Search results and logged-in pages |
| **Streaming** | Page is sent in parts, so the user sees it immediately while slower parts load | Search results |
| **Client-side** | Built in the browser | The cart (it belongs to one visitor) |

No single strategy fits the whole site; each kind of page uses the one that suits it.

**Mobile performance**
- Send less code.
- Use smaller images.
- Serve pages from nearby servers and plan for slow connections.
- Use the phone's built-in controls (dropdowns, buttons) and tap targets at least 44 px across.
- Host fonts with the site (`next/font`) instead of fetching them from another server.
- Reserve space for content so nothing jumps around while loading.

**Core Web Vitals** — Google's three main measures of user experience

| Metric | What it measures | Good score | How to improve it |
| --- | --- | --- | --- |
| **LCP** (Largest Contentful Paint) | How quickly the main content appears | 2.5 s or less | Pre-built pages, the main image loaded first, no blocking scripts |
| **INP** (Interaction to Next Paint) | How quickly the page reacts to taps and clicks | 200 ms or less | Less JavaScript, slow scripts loaded later |
| **CLS** (Cumulative Layout Shift) | How much the page jumps around while loading | 0.1 or less | Reserve space for images and other content before it loads |

## Results in this app

Measured with Lighthouse, simulating a phone on a slow 4G connection:

| | This app | Current branda.com.ng homepage |
| --- | --- | --- |
| Main content appears (LCP) | 3.4–3.9 s | 9.9 s |
| Layout jumps (CLS) | 0 on every page | 0.008 |
| Accessibility score | 100 | 84 |

Both were measured on the same machine with the same settings. On desktop, this app's homepage scores 96/100 for performance.
