/** Join class names, skipping falsy values. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count.toLocaleString("en")} ${count === 1 ? singular : plural}`;
}

export function formatTurnaround({ minDays, maxDays }: { minDays: number; maxDays: number }): string {
  return minDays === maxDays ? `${minDays} business days` : `${minDays}–${maxDays} business days`;
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
