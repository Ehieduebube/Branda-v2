"use client";

import { useState } from "react";

import { MinusIcon, PlusIcon } from "@/components/ui/icons";
import { clampQuantity } from "@/lib/pricing";
import { cn } from "@/lib/utils";

/**
 * Accessible quantity control: real buttons plus a numeric input that can be
 * typed into. Typed values are committed (and clamped) on blur or Enter so
 * intermediate states like an empty field don't fight the user.
 */
export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  /** Accessible name, e.g. "Quantity for Business Cards". */
  label: string;
  size?: "sm" | "md";
}) {
  const [draft, setDraft] = useState<string | null>(null);
  const step = max - min >= 100 ? 5 : 1;

  function commit(raw: string) {
    setDraft(null);
    const parsed = Number.parseInt(raw, 10);
    onChange(clampQuantity(Number.isNaN(parsed) ? value : parsed, min, max));
  }

  const buttonClass = cn(
    "flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-300 disabled:hover:bg-transparent",
    size === "sm" ? "size-9" : "size-11",
  );

  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-lg border border-slate-300 bg-white">
      <button
        type="button"
        className={cn(buttonClass, "rounded-l-lg")}
        onClick={() => onChange(clampQuantity(value - step, min, max))}
        disabled={value <= min}
        aria-label={`Decrease by ${step}`}
      >
        <MinusIcon className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={draft ?? String(value)}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={(event) => commit(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(event.currentTarget.value);
          }
        }}
        aria-label="Quantity"
        className={cn(
          "border-x border-slate-300 text-center font-semibold text-slate-900 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          size === "sm" ? "h-9 w-14 text-sm" : "h-11 w-20",
        )}
      />
      <button
        type="button"
        className={cn(buttonClass, "rounded-r-lg")}
        onClick={() => onChange(clampQuantity(value + step, min, max))}
        disabled={value >= max}
        aria-label={`Increase by ${step}`}
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}
