import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MARKET_CODES } from "@/data/markets";
import { getMarket, isMarketCode } from "@/lib/markets";

/** Prerender every market's routes at build time. */
export function generateStaticParams() {
  return MARKET_CODES.map((market) => ({ market }));
}

/**
 * Market layout: one shared tree for every market (/ng, /us, /uk, /ca).
 * Market-specific behaviour comes from config, not duplicated routes.
 * Unknown codes 404 here (Cache Components doesn't allow `dynamicParams`).
 */
export default async function MarketLayout({ children, params }: LayoutProps<"/[market]">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) notFound();
  const market = getMarket(code);

  return (
    // Regional language tag for assistive tech and translation tools.
    <div lang={market.locale} className="flex flex-1 flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 font-semibold text-slate-900 shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      <SiteHeader market={code} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter market={market} />
    </div>
  );
}
