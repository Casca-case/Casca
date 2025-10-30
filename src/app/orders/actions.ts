"use server";

import { db } from "@/db";
import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";

export async function cancelOrder(orderId: string, reason: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${orderId}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, reason }),
    });

    if (!response.ok) {
      throw new Error("Failed to cancel order");
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("[CANCEL_ORDER]", error);
    return { success: false, error: "Failed to cancel order" };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId, status }),
    });

    if (!response.ok) {
      throw new Error("Failed to update order status");
    }

    revalidatePath("/orders");
    return { success: true };
  } catch (error) {
    console.error("[UPDATE_ORDER_STATUS]", error);
    return { success: false, error: "Failed to update order status" };
  }
}