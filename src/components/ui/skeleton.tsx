import { cn } from "@/lib/utils";

/** Decorative loading placeholder; containers announce loading state instead. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-md bg-slate-200", className)} />;
}
