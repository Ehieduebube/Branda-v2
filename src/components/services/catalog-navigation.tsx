"use client";

import { useRouter } from "next/navigation";
import { createContext, use, useCallback, useMemo, useTransition, type ReactNode } from "react";

interface CatalogNavigation {
  navigate: (href: string, options?: { replace?: boolean }) => void;
  isPending: boolean;
}

const CatalogNavigationContext = createContext<CatalogNavigation | null>(null);

/**
 * Filter controls change the URL; the Server Component re-renders the
 * results for the new search params. Navigating inside a transition keeps
 * the current results on screen (dimmed) until the new ones are ready.
 */
export function CatalogNavigationProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const navigate = useCallback<CatalogNavigation["navigate"]>(
    (href, options) => {
      startTransition(() => {
        if (options?.replace) router.replace(href, { scroll: false });
        else router.push(href, { scroll: false });
      });
    },
    [router],
  );

  const value = useMemo(() => ({ navigate, isPending }), [navigate, isPending]);
  return <CatalogNavigationContext value={value}>{children}</CatalogNavigationContext>;
}

export function useCatalogNavigation(): CatalogNavigation {
  const context = use(CatalogNavigationContext);
  if (!context) throw new Error("useCatalogNavigation must be used inside CatalogNavigationProvider");
  return context;
}

/** Wraps server-rendered results and reflects pending navigation. */
export function CatalogResultsRegion({ children, label }: { children: ReactNode; label: string }) {
  const { isPending } = useCatalogNavigation();
  return (
    <section
      aria-label={label}
      aria-busy={isPending}
      className="transition-opacity duration-200 aria-busy:opacity-60"
    >
      {children}
    </section>
  );
}
