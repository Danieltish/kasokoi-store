"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = {
  url: string;
  alt: string | null;
};

export function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-square lg:max-h-[calc(100vh-10rem)]">
        {active ? (
          <Image
            src={active.url}
            alt={active.alt ?? name}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 600px, 100vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </div>
        )}

        {images.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        ) : null}
      </div>

      {images.length > 1 ? (
        <ul className="no-scrollbar mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                className={`relative size-16 overflow-hidden rounded-lg border bg-muted transition sm:size-20 ${
                  index === activeIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
