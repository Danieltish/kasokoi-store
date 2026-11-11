import { assert, integer, property, string } from "fast-check";
import { describe, expect, it } from "vitest";

import {
  MAX_PRICE_KES,
  PRODUCT_CONDITIONS,
  PRODUCT_SORTS,
  first,
  parseCondition,
  parseMaxPrice,
  parseSort,
  parseTextFilter,
} from "./params";

describe("parseMaxPrice", () => {
  it("always returns undefined or a safe positive integer", () => {
    assert(
      property(string(), (value) => {
        const result = parseMaxPrice(value);

        return (
          result === undefined ||
          (Number.isInteger(result) &&
            result >= 1 &&
            result <= MAX_PRICE_KES)
        );
      }),
    );
  });

  it("clamps values above the PostgreSQL integer range", () => {
    assert(
      property(
        integer({
          min: MAX_PRICE_KES + 1,
          max: MAX_PRICE_KES + 1_000_000,
        }),
        (value) => parseMaxPrice(String(value)) === MAX_PRICE_KES,
      ),
    );
  });

  it("ignores invalid, negative and non-finite values", () => {
    expect(parseMaxPrice(undefined)).toBeUndefined();
    expect(parseMaxPrice("")).toBeUndefined();
    expect(parseMaxPrice("0")).toBeUndefined();
    expect(parseMaxPrice("-1")).toBeUndefined();
    expect(parseMaxPrice("Infinity")).toBeUndefined();
    expect(parseMaxPrice("not-a-number")).toBeUndefined();
  });

  it("handles the previously reported oversized value", () => {
    expect(
      parseMaxPrice("555888880008555566666999823355"),
    ).toBe(MAX_PRICE_KES);
  });
});

describe("parseCondition", () => {
  it("returns only whitelisted conditions", () => {
    assert(
      property(string(), (value) => {
        const result = parseCondition(value);

        return (
          result === undefined || PRODUCT_CONDITIONS.includes(result)
        );
      }),
    );
  });

  it("returns every valid condition unchanged", () => {
    for (const condition of PRODUCT_CONDITIONS) {
      expect(parseCondition(condition)).toBe(condition);
    }
  });
});

describe("parseSort", () => {
  it("always returns a whitelisted sort", () => {
    assert(
      property(string(), (value) => {
        return PRODUCT_SORTS.includes(parseSort(value));
      }),
    );
  });

  it("returns every valid sort unchanged", () => {
    for (const sort of PRODUCT_SORTS) {
      expect(parseSort(sort)).toBe(sort);
    }
  });
});

describe("parseTextFilter", () => {
  it("returns undefined or a trimmed string within the limit", () => {
    assert(
      property(string(), integer({ min: 1, max: 200 }), (value, max) => {
        const result = parseTextFilter(value, max);

        return (
          result === undefined ||
          (result.length <= max && result === result.trim())
        );
      }),
    );
  });

  it("ignores empty and whitespace-only values", () => {
    expect(parseTextFilter(undefined)).toBeUndefined();
    expect(parseTextFilter("")).toBeUndefined();
    expect(parseTextFilter("   ")).toBeUndefined();
  });

  it("trims and truncates long values", () => {
    expect(parseTextFilter("  hello  ", 10)).toBe("hello");
    expect(parseTextFilter("abcdefghijklmno", 5)).toBe("abcde");
  });
});

describe("first", () => {
  it("returns the first item of an array or the value itself", () => {
    expect(first(["a", "b"])).toBe("a");
    expect(first("a")).toBe("a");
    expect(first(undefined)).toBeUndefined();
  });
});
