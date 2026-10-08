import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors the listing layout so streamed results don't shift the page. */
export function CatalogSkeleton() {
  return (
    <div role="status" aria-label="Loading services">
      <Skeleton className="h-12 w-full rounded-xl" />
      <div className="mt-5 flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-10 w-24 shrink-0 rounded-full" />
        ))}
      </div>
      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr]">
        <div className="space-y-5">
          <Skeleton className="h-11 w-full lg:hidden" />
          <div className="hidden space-y-5 lg:block">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-2 h-11 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-7 w-48" />
          <Skeleton className="mt-2 h-4 w-32" />
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <li key={i} className="overflow-hidden rounded-2xl border border-slate-200">
                <Skeleton className="aspect-[4/3] w-full rounded-none" />
                <div className="space-y-3 p-5">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
