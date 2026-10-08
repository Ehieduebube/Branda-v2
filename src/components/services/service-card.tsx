import Image from "next/image";
import Link from "next/link";

import { ArrowRightIcon, ClockIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { CATEGORIES } from "@/data/taxonomy";
import { getMarket, marketHref } from "@/lib/markets";
import { formatTurnaround } from "@/lib/utils";
import type { Service } from "@/types";

const categoryLabel = new Map(CATEGORIES.map((c) => [c.slug, c.label]));

/** Grid widths: 1 col on phones, 2 on tablets, 3 on desktop (inside a max-w-7xl page). */
export const SERVICE_CARD_SIZES = "(min-width: 1280px) 320px, (min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw";

/**
 * Server Component. The title link is stretched over the card so the whole
 * card is clickable while keyboard and screen reader users get one link.
 */
export function ServiceCard({
  service,
  headingLevel = "h3",
  isLcpCandidate = false,
}: {
  service: Service;
  headingLevel?: "h2" | "h3";
  /** The first card above the fold may be the LCP element: load it eagerly. */
  isLcpCandidate?: boolean;
}) {
  const Heading = headingLevel;
  const market = getMarket(service.market);
  const image = service.images[0];
  const quantityNote =
    service.quantity.min > 1 ? `per ${service.quantity.unit} · min. ${service.quantity.min}` : `per ${service.quantity.unit}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-brand-700 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={SERVICE_CARD_SIZES}
          quality={70}
          loading={isLcpCandidate ? "eager" : "lazy"}
          fetchPriority={isLcpCandidate ? "high" : "auto"}
          className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {service.discount && (
          <span className="absolute top-3 left-3 rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white">
            {service.discount.label}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold tracking-wide text-brand-700 uppercase">
          {categoryLabel.get(service.category)}
        </p>
        <Heading className="mt-1 text-lg font-semibold text-slate-900">
          <Link
            href={marketHref(service.market, `/services/${service.slug}`)}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {service.name}
          </Link>
        </Heading>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{service.summary}</p>

        <p className="mt-3 flex items-center gap-1.5 text-xs text-slate-600">
          <ClockIcon className="size-4" />
          {formatTurnaround(service.turnaround)}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <p className="text-xs text-slate-600">From</p>
            <Price
              amount={service.startingPrice}
              original={service.startingPriceBeforeDiscount}
              market={market}
              className="text-lg"
            />
            <p className="text-xs text-slate-600">{quantityNote}</p>
          </div>
          {/* Visual affordance only — the stretched title link makes the card clickable. */}
          <span
            aria-hidden="true"
            className="inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-lg bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-800 group-hover:bg-brand-100"
          >
            View more
            <ArrowRightIcon className="size-4" />
          </span>
        </div>
      </div>
    </article>
  );
}
