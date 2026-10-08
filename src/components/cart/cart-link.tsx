"use client";

import Link from "next/link";

import { CartIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart-store";
import { marketHref } from "@/lib/markets";
import type { MarketCode } from "@/types";

/** Header cart link with a live item-count badge (lines, not units). */
export function CartLink({ market }: { market: MarketCode }) {
  const { lines } = useCart(market);
  const count = lines?.length ?? 0;
  const label = count ? `Cart, ${count} ${count === 1 ? "item" : "items"}` : "Cart";

  return (
    <Link
      href={marketHref(market, "/cart")}
      aria-label={label}
      className="relative inline-flex size-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-slate-900"
    >
      <CartIcon className="size-6" />
      {count > 0 && (
        <span
          aria-hidden="true"
          className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-brand-700 px-1 text-xs font-bold text-white"
        >
          {count}
        </span>
      )}
    </Link>
  );
}
