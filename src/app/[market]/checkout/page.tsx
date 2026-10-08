import type { Metadata } from "next";

import { CheckoutView } from "@/components/cart/checkout-view";
import { getMarket, isMarketCode } from "@/lib/markets";
import { buildMarketMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[market]/checkout">): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};
  return buildMarketMetadata({
    market: getMarket(code),
    path: "/checkout",
    title: "Checkout",
    description: "Review your order and confirm.",
    noIndex: true,
  });
}

export default async function CheckoutPage({ params }: PageProps<"/[market]/checkout">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-slate-900">Checkout</h1>
      <CheckoutView market={code} />
    </div>
  );
}
