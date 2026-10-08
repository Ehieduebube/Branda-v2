import Link from "next/link";

import { CartLink } from "@/components/cart/cart-link";
import { MarketSelector } from "@/components/market/market-selector";
import { CATEGORIES } from "@/data/taxonomy";
import { marketHref } from "@/lib/markets";
import { buildServicesHref } from "@/lib/service-query";
import type { MarketCode } from "@/types";

/**
 * Server Component. Only the market selector and cart badge are client
 * islands; navigation is plain links that work before JavaScript loads.
 */
export function SiteHeader({ market }: { market: MarketCode }) {
  const navLinks = [
    { href: marketHref(market, "/services"), label: "All services" },
    ...CATEGORIES.map((category) => ({
      href: buildServicesHref(market, { category: category.slug }),
      label: category.label,
    })),
  ];

  return (
    // -scroll-mt-32 cancels html's scroll-padding-top (8rem) for header controls:
    // they're always on screen, but focusing one (e.g. opening the market
    // selector) otherwise makes the browser scroll the page to "reveal" it.
    <header className="sticky top-0 z-40 [&_*]:-scroll-mt-32 border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-4 sm:px-6 lg:px-8">
        <Link
          href={marketHref(market)}
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-slate-900"
        >
          <span aria-hidden="true" className="flex size-8 items-center justify-center rounded-lg bg-brand-700 text-white">
            B
          </span>
          {/* Wordmark hides on very narrow phones; the link keeps its accessible name. */}
          <span className="max-[359px]:sr-only">Branda</span>
        </Link>

        <nav aria-label="Main" className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <MarketSelector current={market} />
          <CartLink market={market} />
        </div>
      </div>

      {/* Mobile/tablet: categories as a swipeable row instead of a hidden menu. */}
      <nav aria-label="Categories" className="border-t border-slate-100 lg:hidden">
        <ul className="scrollbar-none mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6">
          {navLinks.map((link) => (
            <li key={link.href} className="shrink-0">
              <Link
                href={link.href}
                className="inline-flex min-h-9 items-center rounded-full border border-slate-200 px-3.5 text-sm font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
