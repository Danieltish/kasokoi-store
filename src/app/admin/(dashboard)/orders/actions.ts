"use server";

import { revalidatePath } from "next/cache";

import {
  OrderStatus,
  PaymentStatus,
} from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export type OrderUpdateState = { error?: string; success?: boolean };

export async function updateOrderAction(
  _previous: OrderUpdateState,
  formData: FormData,
): Promise<OrderUpdateState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "");
  const statusValue = String(formData.get("status") ?? "");
  const paymentValue = String(formData.get("paymentStatus") ?? "");

  const status = Object.values(OrderStatus).find(
    (value) => value === statusValue,
  );
  const paymentStatus = Object.values(PaymentStatus).find(
    (value) => value === paymentValue,
  );

  if (!id || !status || !paymentStatus) {
    return { error: "Choose a valid order and payment status." };
  }

  try {
    await prisma.order.update({
      where: { id },
      data: { status, paymentStatus },
    });
  } catch (error) {
    console.error("Failed to update order", error);

    return { error: "Could not update the order. Please try again." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");

  return { success: true };
}
