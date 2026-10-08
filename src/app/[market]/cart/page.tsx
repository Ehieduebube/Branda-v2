import type { Metadata } from "next";

import { CartView } from "@/components/cart/cart-view";
import { getMarket, isMarketCode } from "@/lib/markets";
import { buildMarketMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[market]/cart">): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};
  return buildMarketMetadata({
    market: getMarket(code),
    path: "/cart",
    title: "Your cart",
    description: "Review the services in your cart.",
    noIndex: true,
  });
}

/** Static shell; the cart itself is client state rendered by <CartView>. */
export default async function CartPage({ params }: PageProps<"/[market]/cart">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">Your cart</h1>
      <CartView market={code} />
    </div>
  );
}
