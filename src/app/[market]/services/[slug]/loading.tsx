import { Skeleton } from "@/components/ui/skeleton";

/** Matches the detail layout (gallery + configurator) to avoid layout shift. */
export default function ServiceDetailLoading() {
  return (
    <div role="status" aria-label="Loading service" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Skeleton className="mb-6 h-4 w-64" />
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-3 h-10 w-3/4" />
          <Skeleton className="mt-4 h-5 w-full" />
          <Skeleton className="mt-6 h-7 w-48" />
          <div className="mt-10 grid gap-2 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-8 h-11 w-40" />
          <Skeleton className="mt-8 h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
