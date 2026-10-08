"use client";

import Link from "next/link";
import { useEffect } from "react";

import { buttonClasses } from "@/components/ui/button";

/** Last-resort boundary for errors outside a market layout. */
export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    // Production: report to an error tracker (Sentry, Datadog) with error.digest.
    console.error(error);
  }, [error]);

  return (
    <main id="main" className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-900">Something went wrong</h1>
      <p className="mt-3 text-slate-600">
        An unexpected error stopped this page from loading. Please try again.
        {error.digest && <span className="mt-2 block text-xs text-slate-600">Reference: {error.digest}</span>}
      </p>
      <div className="mt-8 flex gap-3">
        <button type="button" onClick={() => retry()} className={buttonClasses()}>
          Try again
        </button>
        <Link href="/" className={buttonClasses({ variant: "secondary" })}>
          Go to homepage
        </Link>
      </div>
    </main>
  );
}
