import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import type { Prisma } from "@prisma/client";

const cancelOrderSchema = z.object({
  orderId: z.string(),
  reason: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { orderId, reason } = cancelOrderSchema.parse(body);

    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Check if order can be cancelled
    const nonCancellableStatuses = new Set(['DELIVERED', 'CANCELLED']);
    if (nonCancellableStatuses.has(order.status)) {
      return new NextResponse("Cannot cancel this order", { status: 400 });
    }

    // Update the order using executeRaw for direct database update
    await db.$executeRaw`
      UPDATE "Order" 
      SET status = 'CANCELLED'::\"OrderStatus\", 
          "updatedAt" = NOW() 
      WHERE id = ${orderId}
    `;

    // Fetch the updated order
    const updatedOrder = await db.order.findUnique({
      where: { id: orderId },
    });

        if (!updatedOrder) {
      return new NextResponse("Failed to update order", { status: 500 });
    }

    return NextResponse.json({ order: updatedOrder });
  } catch (error) {
    console.error("[ORDER_CANCEL]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}