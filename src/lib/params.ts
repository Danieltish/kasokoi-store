export function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const PRODUCT_CONDITIONS = ["NEW", "REFURBISHED", "USED"] as const;
export const PRODUCT_SORTS = [
  "newest",
  "price-asc",
  "price-desc",
  "name",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];
export type ValidCondition = (typeof PRODUCT_CONDITIONS)[number];

export function parseCondition(
  value: string | undefined,
): ValidCondition | undefined {
  return PRODUCT_CONDITIONS.find((condition) => condition === value);
}

export function parseSort(value: string | undefined): ProductSort {
  return PRODUCT_SORTS.find((sort) => sort === value) ?? "newest";
}

export function parseMaxPrice(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}
