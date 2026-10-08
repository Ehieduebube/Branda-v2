# Task 4 — Review of branda.com.ng

**What I reviewed:** the homepage, the shop page and the Business Cards page, on 7 October 2026.

**How:**
- I tested the site with **Lighthouse**, a free Google tool that scores how fast and usable a page is, simulating a phone on a slow 4G connection.
- I took screenshots on a phone-sized and a laptop-sized screen.
- I read the page code.

Everything below comes from those checks.

## The scores at a glance (homepage, on a phone)

| What was measured | Result | What that means |
| --- | --- | --- |
| Speed score | **25 / 100** | Slow |
| Time until the main content appears | **9.9 seconds** | Google's target is 2.5 seconds |
| Files the page downloads | **148 files, 2.6 MB** | A lot for a phone on mobile data |
| Accessibility score | 84 / 100 | Some people with disabilities will struggle |
| SEO score (how well Google can read the site) | **100 / 100** | Excellent |
| Layout stability (does the page jump while loading?) | **Very stable** | Excellent |

## Three things that work well

1. **Google can read the site well.**
   - The site scores 100/100 for SEO.
   - Each page has a clear title that matches what people search for, for example "Fastest Online Business Card Printing Company in Nigeria".
   - This is a strong base to build on.

2. **It works on phones, and the page doesn't jump around.**
   - On a phone screen, nothing spills off the side.
   - Content stays in place while loading.
   - Product pages are phone-friendly: a "Show Filters" button, two products per row, and a sort option.

3. **Customers can find products and see prices themselves.**
   - The shop has a search box, sorting, a price filter and pages of results.
   - Prices are shown in naira, for example "₦3,000 – ₦60,000".
   - The main button, "Get An Instant Quote", is easy to spot.

## Five things to improve

1. **The site is very slow.**
   - On a phone, the main content takes almost 10 seconds to appear. Many visitors leave long before that.
   - **Pages are rebuilt for every visitor.** The site is set up so pages can't be stored and reused, so each one is built from scratch every time.
   - **Phones re-download the same files on every visit.** Common files aren't kept by the browser between visits, which wastes mobile data.

2. **The site loads far more code than it needs.**
   The homepage loads 50 script files and 49 style files, including:
   - three different slideshow tools and two different photo pop-up tools that do similar jobs;
   - the Google analytics code twice;
   - several icon packs, some loaded twice;
   - a chat widget that shows errors behind the scenes;
   - a loading animation (a 525 KB image) that hides the page until everything has loaded.

3. **Some people will find it hard to use.**
   - **No main heading.** Pages have no `h1`. People using screen readers (software that reads pages aloud for blind users) rely on it to understand the page.
   - **Moving headline.** The headline types itself out letter by letter, so it's often half-finished ("Prints & M…") when someone reads it.
   - **Hard-to-read buttons.** The green buttons have white text with low contrast (2.4:1; the accessibility standard asks for at least 4.5:1).
   - **Unlabelled button.** The "back to top" button has no label for screen readers.

4. **The menu doesn't match how Branda describes itself.**
   - The homepage introduces five brands: **Prints, Gifts, Create, Digital and Studio by Branda.** But the menu is organised differently: Web & App Development, Workspace Design, Shop, Specialized Services, and so on.
   - **The Shop menu is crowded.** It has 30+ mixed items (t-shirts, wedding souvenirs, umbrellas, calendars), which is hard to scan, especially on a phone.
   - **Two menu items lead to the same page.**
   - **Web addresses are long and inconsistent,** for example `/product-category/all-products/paper-branding-agency-nigeria/business-cards-printer-nigeria/`.

5. **It isn't ready for other countries, and shared links look poor.**
   - The site tells browsers it's an American-English site, although it targets Nigeria.
   - Prices are naira only.
   - Nothing tells Google about other country versions.
   - The preview image shown when the site is shared on social media is extremely wide (8612 × 1139 pixels), so it gets cropped into an unreadable strip.

## What I would do first on the Branda V2 team

1. **Make the pages fast, and give each country its own section of the site.**
   - **What:** rebuild the site with Next.js, a modern framework that can prepare pages in advance and deliver them from servers close to each visitor. Give each market its own section: `/ng`, `/us`, `/uk`, `/ca`.
   - **Keep Google rankings:** redirect the old web addresses to the new ones.
   - **Why:** this fixes the slowness at its root, and it means launching in the USA, UK or Canada is a settings change, not a new website. The demo app in this project does this: its main content appears in 3.4–3.9 seconds on the same slow-phone test, versus 9.9 seconds today.

2. **Make services easier to find and order.**
   - **Organise the menu around the five Branda brands** (Prints, Gifts, Create, Digital, Studio).
   - **Add filters by industry, purpose and delivery time,** plus a search that understands typos.
   - **Show live prices as customers choose options and quantities,** so they can order directly instead of waiting for a quote.
   - **Suggest matching services,** such as brand identity alongside business cards, to grow order value.

3. **Set clear standards for speed and accessibility, and track them.**
   - **Cut what slows the site down:** remove duplicate tools, load the chat widget only when needed, drop the loading animation, and use smaller, modern image formats.
   - **Fix accessibility:** a darker green so button text is readable, proper headings, and a headline that doesn't animate.
   - **Track real speed for each country,** with Nigerian visitors on mid-range Android phones as the main benchmark.
