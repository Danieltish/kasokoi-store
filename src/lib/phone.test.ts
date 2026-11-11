import { assert, property, string } from "fast-check";
import { describe, expect, it } from "vitest";

import { displayKenyanPhone, normalizeKenyanPhone } from "./phone";

const VALID_NORMALIZED = /^254[71]\d{8}$/;

describe("normalizeKenyanPhone", () => {
  it("always returns null or a valid Kenyan number", () => {
    assert(
      property(string(), (value) => {
        const result = normalizeKenyanPhone(value);

        return result === null || VALID_NORMALIZED.test(result);
      }),
    );
  });

  it("is idempotent for valid normalized numbers", () => {
    assert(
      property(string(), (value) => {
        const first = normalizeKenyanPhone(value);

        return first === null || normalizeKenyanPhone(first) === first;
      }),
    );
  });

  it("normalizes common local and international formats", () => {
    expect(normalizeKenyanPhone("0712 345 678")).toBe("254712345678");
    expect(normalizeKenyanPhone("712345678")).toBe("254712345678");
    expect(normalizeKenyanPhone("+254 712 345 678")).toBe("254712345678");
    expect(normalizeKenyanPhone("0112345678")).toBe("254112345678");
    expect(normalizeKenyanPhone("123")).toBeNull();
  });
});

describe("displayKenyanPhone", () => {
  it("formats valid numbers and leaves invalid input unchanged", () => {
    assert(
      property(string(), (value) => {
        const normalized = normalizeKenyanPhone(value);

        if (!normalized) {
          return displayKenyanPhone(value) === value;
        }

        const displayed = displayKenyanPhone(normalized);

        return (
          displayed.startsWith("+254 ") &&
          displayed.replace(/\D/g, "") === normalized
        );
      }),
    );
  });
});
