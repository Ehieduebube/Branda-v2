import { notFound } from "next/navigation";

/**
 * Rewrite target for unknown service slugs (see `src/proxy.ts`). Throwing
 * here — before any Suspense boundary — returns a real 404 status with the
 * services not-found UI, while the browser keeps the URL it requested.
 */
export default function UnavailableService() {
  notFound();
}
