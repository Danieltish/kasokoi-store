import { assert, jsonValue, property } from "fast-check";
import { describe, expect, it } from "vitest";

import { serializeJsonLd } from "./json-ld";

describe("serializeJsonLd", () => {
  it("never emits a raw '<' character", () => {
    assert(
      property(jsonValue(), (value) => {
        return !serializeJsonLd(value).includes("<");
      }),
    );
  });

  it("remains valid JSON with the original value", () => {
    assert(
      property(jsonValue(), (value) => {
        const serialized = serializeJsonLd(value);

        return JSON.stringify(JSON.parse(serialized)) === JSON.stringify(value);
      }),
    );
  });

  it("escapes a closing script tag payload", () => {
    const value = { description: "</script><script>alert(1)</script>" };
    const serialized = serializeJsonLd(value);

    expect(serialized).not.toContain("</script>");
    expect(JSON.parse(serialized)).toEqual(value);
  });
});
