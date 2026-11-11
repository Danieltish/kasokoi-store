import { assert, property, string } from "fast-check";
import { describe, expect, it } from "vitest";

import { slugify } from "./slug";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

describe("slugify", () => {
  it("only produces safe URL slugs", () => {
    assert(
      property(string(), (value) => {
        const slug = slugify(value);

        return slug === "" || SLUG_PATTERN.test(slug);
      }),
    );
  });

  it("is idempotent", () => {
    assert(
      property(string(), (value) => {
        const slug = slugify(value);

        return slugify(slug) === slug;
      }),
    );
  });

  it("normalizes common input", () => {
    expect(slugify("  Hello, World!  ")).toBe("hello-world");
    expect(slugify("HP EliteBook 830 G5")).toBe("hp-elitebook-830-g5");
    expect(slugify("---")).toBe("");
  });
});
