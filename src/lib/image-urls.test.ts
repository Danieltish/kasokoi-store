import { assert, property, string, webUrl } from "fast-check";
import { describe, expect, it } from "vitest";

import { isAllowedImageUrl } from "./image-urls";

const SUPABASE_HOST_SUFFIX = ".supabase.co";

function hasAllowedHost(hostname: string) {
  return (
    hostname === "res.cloudinary.com" ||
    hostname === "images.unsplash.com" ||
    hostname.endsWith(SUPABASE_HOST_SUFFIX)
  );
}

describe("isAllowedImageUrl", () => {
  it("only allows supported https and same-origin relative URLs", () => {
    assert(
      property(string(), (value) => {
        if (!isAllowedImageUrl(value)) {
          return true;
        }

        const trimmed = value.trim();

        if (trimmed.startsWith("/")) {
          return !trimmed.startsWith("//");
        }

        try {
          const url = new URL(trimmed);

          return url.protocol === "https:" && hasAllowedHost(url.hostname);
        } catch {
          return false;
        }
      }),
    );
  });

  it("rejects http, protocol-relative, javascript and unknown hosts", () => {
    assert(
      property(webUrl(), (value) => {
        if (!isAllowedImageUrl(value)) {
          return true;
        }

        const url = new URL(value);

        return url.protocol === "https:" && hasAllowedHost(url.hostname);
      }),
    );

    expect(isAllowedImageUrl("http://res.cloudinary.com/a.png")).toBe(false);
    expect(isAllowedImageUrl("//example.com/a.png")).toBe(false);
    expect(isAllowedImageUrl("javascript:alert(1)")).toBe(false);
    expect(isAllowedImageUrl("https://example.com/a.png")).toBe(false);
  });

  it("allows the configured image hosts and local paths", () => {
    expect(isAllowedImageUrl("/products/networking.svg")).toBe(true);
    expect(
      isAllowedImageUrl("https://res.cloudinary.com/demo/image.png"),
    ).toBe(true);
    expect(
      isAllowedImageUrl("https://images.unsplash.com/photo-123"),
    ).toBe(true);
    expect(
      isAllowedImageUrl(
        "https://mbidqvrmviiwoyeqidcc.supabase.co/storage/v1/object/public/product-images/a.webp",
      ),
    ).toBe(true);
  });
});
