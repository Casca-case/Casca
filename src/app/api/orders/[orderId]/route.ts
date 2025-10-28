import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma, OrderStatus } from "@prisma/client";

const updateOrderSchema = z.object({
  orderId: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
});

export async function PATCH(req: Request) {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { orderId, status } = updateOrderSchema.parse(body);

    const order = await db.order.findUnique({
      where: {
        id: orderId,
        userId: user.id,
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    // Update the order using raw SQL to handle enum
    await db.$executeRaw`
      UPDATE "Order" 
      SET status = ${status}::\"OrderStatus\", 
          "updatedAt" = NOW() 
      WHERE id = ${orderId}
    `;

    // Fetch the updated order with relations
    const updatedOrder = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        configuration: true,
        shippingAddress: true,
        billingAddress: true,
      },
    });

    if (!updatedOrder) {
      return new NextResponse("Failed to update order", { status: 500 });
    }
    
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error("[ORDER_UPDATE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}