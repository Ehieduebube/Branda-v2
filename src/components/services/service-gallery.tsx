"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";
import type { ServiceImage } from "@/types";

/**
 * Image gallery. The first image is the page's LCP element, so it loads
 * eagerly with high fetch priority. The other (2–3) large images are stacked
 * underneath and load lazily at normal priority, so switching is instant
 * instead of flashing an empty frame while a new image downloads.
 */
export function ServiceGallery({ images, name }: { images: ServiceImage[]; name: string }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100">
        {images.map((image, index) => (
          <Image
            key={image.src}
            src={image.src}
            alt={index === activeIndex ? image.alt : ""}
            aria-hidden={index === activeIndex ? undefined : true}
            fill
            sizes="(min-width: 1280px) 620px, (min-width: 1024px) 50vw, 100vw"
            quality={80}
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            className={cn(
              "object-cover transition-opacity duration-300",
              index === activeIndex ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
      </div>

      {images.length > 1 && (
        <ul aria-label={`${name} images`} className="mt-3 grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={`Show image ${index + 1} of ${images.length}: ${image.alt}`}
                className={cn(
                  "relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 ring-offset-2 transition",
                  index === activeIndex ? "ring-2 ring-brand-700" : "opacity-80 hover:opacity-100",
                )}
              >
                <Image src={image.src} alt="" fill sizes="(min-width: 1024px) 140px, 25vw" quality={70} className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
