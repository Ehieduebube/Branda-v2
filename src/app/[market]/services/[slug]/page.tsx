import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ServiceCard } from "@/components/services/service-card";
import { ServiceConfigurator } from "@/components/services/service-configurator";
import { ServiceGallery } from "@/components/services/service-gallery";
import { CheckIcon, ClockIcon } from "@/components/ui/icons";
import { Price } from "@/components/ui/price";
import { CATEGORIES } from "@/data/taxonomy";
import { getComplementaryServices, getRelatedServices, getService, getServiceSlugs } from "@/lib/catalog";
import { getMarket, isMarketCode, marketHref } from "@/lib/markets";
import { buildServicesHref } from "@/lib/service-query";
import { buildMarketMetadata } from "@/lib/seo";
import { formatTurnaround } from "@/lib/utils";
import { formatMoney } from "@/lib/currency";
import type { Service } from "@/types";

/** Statically generate every service for every market at build time. */
export async function generateStaticParams() {
  const slugs = await getServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/[market]/services/[slug]">): Promise<Metadata> {
  const { market: code, slug } = await params;
  if (!isMarketCode(code)) return {};
  const service = await getService(code, slug);
  if (!service) return { title: "Service not found", robots: { index: false } };

  const market = getMarket(code);
  return buildMarketMetadata({
    market,
    path: `/services/${service.slug}`,
    title: service.name,
    description: `${service.summary} From ${formatMoney(service.startingPrice, market)} per ${service.quantity.unit}, ready in ${formatTurnaround(service.turnaround)}. Order online from Branda ${market.country}.`,
    image: service.images[0],
  });
}

export default async function ServiceDetailPage({ params }: PageProps<"/[market]/services/[slug]">) {
  const { market: code, slug } = await params;
  if (!isMarketCode(code)) notFound();

  const service = await getService(code, slug);
  if (!service) notFound();

  // Independent lookups run in parallel rather than as a waterfall.
  const [related, complementary] = await Promise.all([
    getRelatedServices(code, service),
    getComplementaryServices(code, service),
  ]);

  const market = getMarket(code);
  const category = CATEGORIES.find((c) => c.slug === service.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-600">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <li>
            <Link href={marketHref(code)} className="hover:text-slate-900 hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={marketHref(code, "/services")} className="hover:text-slate-900 hover:underline">
              Services
            </Link>
          </li>
          {category && (
            <>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={buildServicesHref(code, { category: category.slug })}
                  className="hover:text-slate-900 hover:underline"
                >
                  {category.label}
                </Link>
              </li>
            </>
          )}
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="font-medium text-slate-900">
            {service.name}
          </li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ServiceGallery images={service.images} name={service.name} />
        </div>

        <div>
          <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">
            {category?.label} · {category?.tagline}
          </p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{service.name}</h1>
          <p className="mt-3 text-lg text-slate-600">{service.summary}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="flex items-baseline gap-2">
              <span className="text-sm text-slate-600">From</span>
              <Price
                amount={service.startingPrice}
                original={service.startingPriceBeforeDiscount}
                market={market}
                className="text-xl"
              />
              <span className="text-sm text-slate-600">per {service.quantity.unit}</span>
            </p>
            {service.discount && (
              <span className="rounded-full bg-red-700 px-2.5 py-1 text-xs font-bold text-white">
                {service.discount.label}
              </span>
            )}
          </div>
          <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-700">
            <ClockIcon className="size-4 text-brand-700" />
            Turnaround: {formatTurnaround(service.turnaround)} after artwork approval
          </p>

          <div className="mt-8 border-t border-slate-200 pt-8">
            <h2 className="sr-only">Configure your order</h2>
            <ServiceConfigurator service={service} />
          </div>
        </div>
      </div>

      <div className="mt-14 grid gap-10 border-t border-slate-200 pt-10 lg:grid-cols-3">
        <section className="lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">About this service</h2>
          <p className="mt-3 leading-relaxed text-slate-700">{service.description}</p>
        </section>
        <section>
          <h2 className="text-xl font-semibold text-slate-900">What&apos;s included</h2>
          <ul className="mt-3 space-y-2">
            {service.included.map((item) => (
              <li key={item} className="flex gap-2 text-slate-700">
                <CheckIcon className="mt-0.5 size-5 shrink-0 text-brand-700" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <ServiceRail
        id="related"
        title="Related services"
        description={`Other ways to meet the same need as ${service.name.toLowerCase()}.`}
        services={related}
      />
      <ServiceRail
        id="complementary"
        title="Frequently ordered together"
        description={`Services customers add alongside ${service.name.toLowerCase()} to complete the brand.`}
        services={complementary}
      />
    </div>
  );
}

function ServiceRail({
  id,
  title,
  description,
  services,
}: {
  id: string;
  title: string;
  description: string;
  services: Service[];
}) {
  if (!services.length) return null;
  return (
    <section aria-labelledby={`${id}-heading`} className="mt-14">
      <h2 id={`${id}-heading`} className="text-xl font-semibold text-slate-900">
        {title}
      </h2>
      <p className="mt-1 text-sm text-slate-600">{description}</p>
      <ul className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <li key={s.slug}>
            <ServiceCard service={s} />
          </li>
        ))}
      </ul>
    </section>
  );
}
