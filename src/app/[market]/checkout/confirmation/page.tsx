import type { Metadata } from "next";

import { OrderConfirmation } from "@/components/cart/order-confirmation";
import { isMarketCode } from "@/lib/markets";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage({ params }: PageProps<"/[market]/checkout/confirmation">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <OrderConfirmation market={code} />
    </div>
  );
}
