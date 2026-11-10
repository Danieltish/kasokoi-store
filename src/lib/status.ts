export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Awaiting confirmation",
  CONFIRMED: "Confirmed",
  PACKED: "Packed",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
  RETURNED: "Returned",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  UNPAID: "Not paid",
  PENDING: "Payment pending",
  PAID: "Paid",
  FAILED: "Payment failed",
  REFUNDED: "Refunded",
};

export const ORDER_STATUS_OPTIONS = [
  "PENDING",
  "CONFIRMED",
  "PACKED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
] as const;

export const PAYMENT_STATUS_OPTIONS = [
  "UNPAID",
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
] as const;
