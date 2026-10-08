import { notFound } from "next/navigation";

/** Any unmatched URL inside a market renders the market's 404 (with header and cart). */
export default function CatchAll() {
  notFound();
}
