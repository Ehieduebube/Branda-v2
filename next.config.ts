import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  // Dev only: let phones on the same Wi-Fi (http://192.168.x.x:3000) load the
  // dev server's scripts. Without this the page renders but never hydrates.
  allowedDevOrigins: ["192.168.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    // Catalog imagery is served from Unsplash's CDN. Only photo paths are
    // allowed so the optimizer can't be used as an open image proxy.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/photo-**",
      },
    ],
    // AVIF first (smallest), WebP as the fallback for browsers without AVIF.
    formats: ["image/avif", "image/webp"],
    qualities: [70, 80],
    // Optimized variants are immutable for a given src, so cache them for a day.
    minimumCacheTTL: 86400,
  },
};

export default nextConfig;
