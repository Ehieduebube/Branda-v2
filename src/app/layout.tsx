import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";

import { SITE_URL } from "@/lib/utils";

import "./globals.css";

// Self-hosted at build time by next/font: no request to Google at runtime,
// `font-display: swap` and a size-adjusted fallback to avoid layout shift.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Branda — Branding services, ordered online",
    template: "%s | Branda",
  },
  description:
    "Order print, gifts, creative, digital and workspace branding services from Branda.",
};

export const viewport: Viewport = {
  themeColor: "#0a6e33",
};

/**
 * Root layout: document shell only. Market-specific chrome (header, footer,
 * currency) lives in `app/[market]/layout.tsx`, so root-level error and
 * not-found pages still render inside a valid document.
 */
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col font-sans">{children}</body>
    </html>
  );
}
