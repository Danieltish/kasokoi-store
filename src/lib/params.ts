export function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export const PRODUCT_CONDITIONS = [
  "NEW",
  "REFURBISHED",
  "USED",
  "EX_UK",
] as const;
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

export const MAX_PRICE_KES = 2_147_483_647;

export function parseTextFilter(value: string | undefined, maxLength = 80) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return undefined;
  }

  return trimmed.slice(0, maxLength);
}

export function parseMaxPrice(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  const parsed = Math.floor(Number(value));

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return undefined;
  }

  // Keep the value inside PostgreSQL's 32-bit integer range.
  return Math.min(parsed, MAX_PRICE_KES);
}
