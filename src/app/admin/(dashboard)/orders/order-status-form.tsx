"use client";

import { useActionState } from "react";

import {
  ORDER_STATUS_LABELS,
  ORDER_STATUS_OPTIONS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
} from "@/lib/status";

import { updateOrderAction, type OrderUpdateState } from "./actions";

const initialState: OrderUpdateState = {};

const fieldClass =
  "h-11 rounded-lg border border-border bg-background px-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 sm:h-10 sm:text-sm";

export function OrderStatusForm({
  id,
  status,
  paymentStatus,
}: {
  id: string;
  status: string;
  paymentStatus: string;
}) {
  const [state, formAction, pending] = useActionState(
    updateOrderAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="id" value={id} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm font-medium">
          Order status
          <select name="status" defaultValue={status} className={fieldClass}>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {ORDER_STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium">
          Payment status
          <select
            name="paymentStatus"
            defaultValue={paymentStatus}
            className={fieldClass}
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {PAYMENT_STATUS_LABELS[option]}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.error ? (
        <p className="rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-success/30 bg-success/10 p-3 text-sm text-success">
          Order updated.
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-60 sm:w-auto sm:py-2"
      >
        {pending ? "Saving…" : "Update order"}
      </button>
    </form>
  );
}
