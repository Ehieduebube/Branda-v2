import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Explains what happened and offers a next step. */
export function EmptyState({
  title,
  description,
  actions,
  icon,
  headingLevel = "h2",
  className,
}: {
  title: string;
  description: ReactNode;
  actions?: ReactNode;
  icon?: ReactNode;
  headingLevel?: "h1" | "h2";
  className?: string;
}) {
  const Heading = headingLevel;
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-white text-brand-700 shadow-sm" aria-hidden="true">
          {icon}
        </div>
      )}
      <Heading className="text-lg font-semibold text-slate-900">{title}</Heading>
      <div className="mt-2 max-w-md text-sm text-slate-600">{description}</div>
      {actions && <div className="mt-6 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
