"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  ExpandIcon,
  GripIcon,
} from "@/components/icons";

type GalleryImage = {
  url: string;
  alt: string | null;
};

type Position = {
  x: number;
  y: number;
};

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ x: 50, y: 50 });
  const active = images[activeIndex] ?? images[0];
  const drag = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
    moved: boolean;
  } | null>(null);
  const hasDragged = useRef(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) => (index + 1) % images.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex(
          (index) => (index - 1 + images.length) % images.length,
        );
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, images.length]);

  function handlePointerDown(event: ReactPointerEvent<HTMLButtonElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    hasDragged.current = false;
    drag.current = {
      startX: event.clientX,
      startY: event.clientY,
      posX: position.x,
      posY: position.y,
      moved: false,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLButtonElement>) {
    const state = drag.current;

    if (!state) {
      return;
    }

    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (!state.moved && Math.hypot(dx, dy) > 4) {
      state.moved = true;
      hasDragged.current = true;
    }

    if (!state.moved) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();

    setPosition({
      x: clampPercentage(state.posX - (dx / rect.width) * 100),
      y: clampPercentage(state.posY - (dy / rect.height) * 100),
    });
  }

  function handlePointerUp() {
    drag.current = null;
    window.setTimeout(() => {
      hasDragged.current = false;
    }, 0);
  }

  function handleImageClick() {
    if (hasDragged.current) {
      hasDragged.current = false;
      return;
    }

    if (active) {
      setIsOpen(true);
    }
  }

  function showPrevious() {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  }

  function showNext() {
    setActiveIndex((index) => (index + 1) % images.length);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleImageClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="View full-size image"
        className="group relative block aspect-[4/3] w-full touch-pan-y select-none overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-square sm:cursor-grab sm:touch-none sm:active:cursor-grabbing lg:aspect-[4/3] lg:max-h-[calc(100vh-10rem)]"
      >
        {active ? (
          <Image draggable={false}
            src={active.url}
            alt={active.alt ?? name}
            fill
            priority
            quality={90}
            sizes="(min-width: 1024px) 600px, 100vw"
            style={{ objectPosition: `${position.x}% ${position.y}%` }}
            className="object-cover"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-sm text-muted-foreground">
            No image yet
          </span>
        )}

        {active ? (
          <>
            <span className="pointer-events-none absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm sm:hidden">
              <ExpandIcon className="size-3.5" />
              Tap to enlarge
            </span>
            <span className="pointer-events-none absolute bottom-3 left-3 hidden items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm sm:inline-flex">
              <GripIcon className="size-3.5" />
              Drag to move
            </span>
          </>
        ) : null}

        {images.length > 1 ? (
          <span className="absolute bottom-3 right-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-sm">
            {activeIndex + 1} / {images.length}
          </span>
        ) : null}
      </button>

      {images.length > 1 ? (
        <ul className="no-scrollbar mt-4 flex gap-4 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="shrink-0">
              <button
                type="button"
                onClick={() => {
                  setActiveIndex(index);
                  setPosition({ x: 50, y: 50 });
                }}
                aria-label={`View image ${index + 1} of ${images.length}`}
                aria-pressed={index === activeIndex}
                className={`relative size-20 overflow-hidden rounded-lg border bg-muted transition sm:size-24 ${
                  index === activeIndex
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <Image
                  draggable={false}
                  src={image.url}
                  alt=""
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {isOpen && active ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} — full-size image`}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between px-4 py-3 text-white">
            <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-medium">
              {activeIndex + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close image"
              className="inline-flex size-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <CloseIcon className="size-5" />
            </button>
          </div>

          <div
            onClick={(event) => event.stopPropagation()}
            className="relative min-h-0 flex-1"
          >
            <Image draggable={false}
              src={active.url}
              alt={active.alt ?? name}
              fill
              quality={95}
              sizes="100vw"
              className="object-contain p-2 sm:p-6"
            />

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={showPrevious}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronLeftIcon className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 inline-flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                >
                  <ChevronRightIcon className="size-6" />
                </button>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
