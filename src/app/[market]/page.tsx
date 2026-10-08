import type { Metadata } from "next";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";

import { ServiceCard } from "@/components/services/service-card";
import { buttonClasses } from "@/components/ui/button";
import { ArrowRightIcon, SearchIcon } from "@/components/ui/icons";
import { CATEGORIES } from "@/data/taxonomy";
import { getFeaturedServices, getServices } from "@/lib/catalog";
import { getMarket, isMarketCode, marketHref } from "@/lib/markets";
import { buildServicesHref, PARAM } from "@/lib/service-query";
import { buildMarketMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: PageProps<"/[market]">): Promise<Metadata> {
  const { market: code } = await params;
  if (!isMarketCode(code)) return {};
  const market = getMarket(code);
  return buildMarketMetadata({
    market,
    path: "",
    title: market.content.heroTitle,
    description: market.content.heroSubtitle,
  });
}

/** Fully static per market: content comes from market config and the cached catalog. */
export default async function MarketHome({ params }: PageProps<"/[market]">) {
  const { market: code } = await params;
  if (!isMarketCode(code)) return null; // The market layout already 404s.
  const market = getMarket(code);

  const [featured, services] = await Promise.all([getFeaturedServices(code), getServices(code)]);

  // Represent each category with its most popular service's photo.
  const categoryTiles = CATEGORIES.map((category) => {
    const top = services
      .filter((s) => s.category === category.slug)
      .sort((a, b) => b.popularity - a.popularity)[0];
    return { ...category, image: top?.images[0] };
  });

  const popularSearches = featured.slice(0, 3).map((s) => s.name);

  return (
    <>
      <section className="border-b border-slate-200 bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-wide text-brand-700 uppercase">{market.content.heroEyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-balance text-slate-900 sm:text-5xl">
              {market.content.heroTitle}
            </h1>
            <p className="mt-4 text-lg text-pretty text-slate-600">{market.content.heroSubtitle}</p>

            {/* GET form: navigates client-side with JS, works as a plain form without it. */}
            <Form action={marketHref(code, "/services")} role="search" className="mt-8 flex flex-col gap-3 sm:flex-row">
              <label htmlFor="home-search" className="sr-only">
                Search services
              </label>
              <div className="relative flex-1">
                <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-slate-500" />
                <input
                  id="home-search"
                  name={PARAM.q}
                  type="search"
                  placeholder="What do you need? e.g. business cards"
                  enterKeyHint="search"
                  className="min-h-12 w-full rounded-xl border border-slate-300 bg-white py-3 pr-4 pl-12 text-base text-slate-900 placeholder:text-slate-500"
                />
              </div>
              <button type="submit" className={buttonClasses({ size: "lg" })}>
                Search
              </button>
            </Form>

            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span>Popular:</span>
              {popularSearches.map((term) => (
                <Link
                  key={term}
                  href={buildServicesHref(code, { q: term })}
                  className="rounded-full bg-white px-3 py-1 font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-slate-300"
                >
                  {term}
                </Link>
              ))}
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="categories-heading" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 id="categories-heading" className="text-2xl font-bold tracking-tight text-slate-900">
              The Branda ecosystem
            </h2>
            <p className="mt-1 text-slate-600">Five service lines, one cart and one checkout.</p>
          </div>
          <Link href={marketHref(code, "/services")} className="hidden text-sm font-semibold text-brand-700 hover:underline sm:inline">
            View all services
          </Link>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {categoryTiles.map((category) => (
            <li key={category.slug}>
              <Link
                href={buildServicesHref(code, { category: category.slug })}
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white hover:shadow-md"
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {category.image && (
                    <Image
                      src={category.image.src}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 240px, (min-width: 768px) 33vw, 50vw"
                      quality={70}
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-900">{category.label}</p>
                  <p className="text-sm text-slate-600">{category.tagline}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="featured-heading" className="bg-slate-50 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 id="featured-heading" className="text-2xl font-bold tracking-tight text-slate-900">
            {market.content.featuredHeading}
          </h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((service) => (
              <li key={service.slug}>
                <ServiceCard service={service} />
              </li>
            ))}
          </ul>
          <div className="mt-10 text-center">
            <Link href={marketHref(code, "/services")} className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Browse all services
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
