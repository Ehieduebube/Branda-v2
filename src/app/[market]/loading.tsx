import { Skeleton } from "@/components/ui/skeleton";

/**
 * Generic page skeleton for every market route. Switching market swaps the
 * header/footer immediately and shows this while the new page streams in,
 * instead of holding the old page until the new one is fully rendered.
 */
export default function MarketLoading() {
  return (
    <div role="status" aria-label="Loading page" className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <Skeleton className="h-10 w-2/3 max-w-xl" />
      <Skeleton className="mt-4 h-5 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-5 w-1/2 max-w-md" />
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <Skeleton className="aspect-[4/3] w-full rounded-2xl" />
            <Skeleton className="mt-4 h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/3" />
          </li>
        ))}
      </ul>
    </div>
  );
}
