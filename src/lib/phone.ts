export function normalizeKenyanPhone(input: string): string | null {
  const digits = input.replace(/\D/g, "");

  let normalized = digits;

  if (normalized.startsWith("0")) {
    normalized = `254${normalized.slice(1)}`;
  } else if (normalized.startsWith("7") || normalized.startsWith("1")) {
    normalized = `254${normalized}`;
  }

  return /^254[71]\d{8}$/.test(normalized) ? normalized : null;
}

export function displayKenyanPhone(normalized: string) {
  if (!normalized.startsWith("254") || normalized.length !== 12) {
    return normalized;
  }

  return `+${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}
