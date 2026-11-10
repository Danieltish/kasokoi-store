export function deliveryFeeFor(
  zone: { feeKes: number; freeOverKes: number | null },
  subtotalKes: number,
) {
  if (zone.freeOverKes !== null && subtotalKes >= zone.freeOverKes) {
    return 0;
  }

  return zone.feeKes;
}
