import { assert, constant, integer, oneof, property } from "fast-check";
import { describe, it } from "vitest";

import { deliveryFeeFor } from "./pricing";

describe("deliveryFeeFor", () => {
  it("charges the fee, or zero when the free-delivery threshold is met", () => {
    assert(
      property(
        integer({ min: 0, max: 50_000 }),
        oneof(constant(null), integer({ min: 0, max: 200_000 })),
        integer({ min: 0, max: 300_000 }),
        (feeKes, freeOverKes, subtotalKes) => {
          const result = deliveryFeeFor(
            { feeKes, freeOverKes },
            subtotalKes,
          );

          if (freeOverKes !== null && subtotalKes >= freeOverKes) {
            return result === 0;
          }

          return result === feeKes;
        },
      ),
    );
  });
});
