"use client";

import Image from "next/image";
import { useRef, useState, type DragEvent } from "react";

import { CloseIcon, GripIcon, StarIcon, UploadIcon } from "@/components/icons";
import { isAllowedImageUrl } from "@/lib/image-urls";

export type ProductImageInput = {
  url: string;
  alt?: string | null;
};

type ImageItem = {
  key: string;
  url: string;
};

const MAX_DIMENSION = 1600;
const WEBP_QUALITY = 0.82;

async function compressImage(file: File) {
  if (file.type === "image/gif") {
    return file;
  }

  const bitmap = await loadImage(file);
  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  if (!context) {
    return file;
  }

  context.drawImage(bitmap.source, 0, 0, width, height);

  const source = bitmap.source;

  if (typeof (source as ImageBitmap).close === "function") {
    (source as ImageBitmap).close();
  }

  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, "image/webp", WEBP_QUALITY);
  });

  if (!blob || blob.size >= file.size) {
    return file;
  }

  const name = file.name.replace(/\.[^.]+$/, "") || "product-image";

  return new File([blob], `${name}.webp`, { type: "image/webp" });
}

type LoadedImage = {
  source: CanvasImageSource & { width: number; height: number; close?: () => void };
  width: number;
  height: number;
};

async function loadImage(file: File): Promise<LoadedImage> {
  if (typeof createImageBitmap === "function") {
    const bitmap = await createImageBitmap(file);

    return { source: bitmap, width: bitmap.width, height: bitmap.height };
  }

  const url = URL.createObjectURL(file);
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const element = new window.Image();
    element.onload = () => resolve(element);
    element.onerror = () => reject(new Error("Could not read the image."));
    element.src = url;
  });

  return { source: image, width: image.naturalWidth, height: image.naturalHeight };
}

export function ProductImages({
  initialImages,
}: {
  initialImages: ProductImageInput[];
}) {
  const [images, setImages] = useState<ImageItem[]>(() =>
    initialImages.map((image, index) => ({
      key: `existing-${index}`,
      url: image.url,
    })),
  );
  const [pending, setPending] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dragIndex = useRef<number | null>(null);

  function addUrl(value: string) {
    const url = value.trim();

    if (!isAllowedImageUrl(url)) {
      setError("Paste a valid https image URL (or a path starting with /).");
      return;
    }

    if (images.some((image) => image.url === url)) {
      setError("That image is already added.");
      return;
    }

    setImages((current) => [
      ...current,
      { key: `url-${Date.now()}-${current.length}`, url },
    ]);
    setUrlInput("");
    setError(null);
  }

  async function uploadFiles(fileList: FileList | null) {
    const files = Array.from(fileList ?? []);

    if (files.length === 0) {
      return;
    }

    setError(null);
    setPending((count) => count + files.length);

    for (const file of files) {
      try {
        const compressed = await compressImage(file);
        const body = new FormData();
        body.append("files", compressed);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body,
        });
        const result = (await response.json().catch(() => null)) as
          | { images?: { url: string }[]; error?: string }
          | null;

        if (!response.ok || !result?.images?.length) {
          throw new Error(result?.error ?? "Could not upload the image.");
        }

        setImages((current) => [
          ...current,
          ...result.images!.map((image, index) => ({
            key: `upload-${Date.now()}-${index}-${Math.random()
              .toString(36)
              .slice(2)}`,
            url: image.url,
          })),
        ]);
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : "Could not upload the image.",
        );
      } finally {
        setPending((count) => Math.max(0, count - 1));
      }
    }

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removeImage(key: string) {
    setImages((current) => current.filter((image) => image.key !== key));
  }

  function makeCover(index: number) {
    setImages((current) => {
      const next = [...current];
      const [item] = next.splice(index, 1);

      return [item, ...next];
    });
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDraggingOver(false);
    void uploadFiles(event.dataTransfer.files);
  }

  function handleReorderDrop(event: DragEvent<HTMLLIElement>, index: number) {
    event.preventDefault();

    const from = dragIndex.current;
    dragIndex.current = null;

    if (from === null || from === index) {
      return;
    }

    setImages((current) => {
      const next = [...current];
      const [item] = next.splice(from, 1);
      next.splice(index, 0, item);

      return next;
    });
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="font-semibold">Product images</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Add as many images as you like. The first one is used as the cover.
          </p>
        </div>
        <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          {images.length} image{images.length === 1 ? "" : "s"}
        </span>
      </div>

      {images.length > 0 || pending > 0 ? (
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {images.map((image, index) => (
            <li
              key={image.key}
              draggable
              onDragStart={() => {
                dragIndex.current = index;
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleReorderDrop(event, index)}
              className="group relative aspect-square cursor-grab overflow-hidden rounded-xl border border-border bg-muted active:cursor-grabbing"
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="object-cover"
              />

              {index === 0 ? (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                  <StarIcon className="size-3" />
                  Cover
                </span>
              ) : (
                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
                  <GripIcon className="size-3" />
                  {index + 1}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-2 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                {index === 0 ? (
                  <span className="text-[11px] font-medium text-white">
                    Cover image
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => makeCover(index)}
                    className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-semibold text-black hover:bg-white"
                  >
                    Set cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(image.key)}
                  aria-label="Remove image"
                  className="inline-flex size-7 items-center justify-center rounded-md bg-white/90 text-black hover:bg-white"
                >
                  <CloseIcon className="size-4" />
                </button>
              </div>
            </li>
          ))}

          {Array.from({ length: pending }).map((_, index) => (
            <li
              key={`pending-${index}`}
              className="flex aspect-square animate-pulse flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-muted text-xs font-medium text-muted-foreground"
            >
              <UploadIcon className="size-5" />
              Uploading…
            </li>
          ))}
        </ul>
      ) : null}

      <div
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDraggingOver(true);
        }}
        onDragOver={(event) => event.preventDefault()}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={handleDrop}
        className={`mt-4 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          isDraggingOver
            ? "border-primary bg-brand-50 dark:bg-brand-950/30"
            : "border-border bg-muted/30"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          className="sr-only"
          id="product-image-upload"
          onChange={(event) => void uploadFiles(event.target.files)}
        />
        <label
          htmlFor="product-image-upload"
          className="flex cursor-pointer flex-col items-center gap-2"
        >
          <span className="inline-flex size-10 items-center justify-center rounded-full bg-card text-primary shadow-sm">
            <UploadIcon className="size-5" />
          </span>
          <span className="text-sm font-semibold">
            Click to upload or drag &amp; drop
          </span>
          <span className="text-xs text-muted-foreground">
            JPG, PNG, WebP or GIF · resized and compressed automatically
          </span>
        </label>
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={urlInput}
          onChange={(event) => setUrlInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addUrl(urlInput);
            }
          }}
          placeholder="Or paste an image URL"
          className="h-11 flex-1 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:text-sm"
        />
        <button
          type="button"
          onClick={() => addUrl(urlInput)}
          disabled={!urlInput.trim()}
          className="h-11 rounded-lg border border-border px-4 text-sm font-semibold hover:bg-muted disabled:opacity-50"
        >
          Add URL
        </button>
      </div>

      {images.map((image) => (
        <input
          key={image.key}
          type="hidden"
          name="imageUrls"
          value={image.url}
        />
      ))}

      {error ? (
        <p
          role="alert"
          className="mt-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
