
import { Suspense } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import OrdersTable from "./OrdersTable";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { db } from "@/db";
import { notFound } from "next/navigation";

async function OrdersContent() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    return notFound();
  }

  const orders = await db.order.findMany({
    where: {
      userId: user.id,
    },
    include: {
      configuration: true,
      shippingAddress: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    status: order.status,
    amount: order.amount,
    isPaid: order.isPaid,
    configuration: order.configuration,
    shippingAddress: order.shippingAddress,
  }));

  return (
    <>
      {formattedOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Package className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Make your case now</h3>
          <p className="text-muted-foreground mt-2 mb-6">
            Start creating your custom phone case today.
          </p>
          <Button asChild>
            <Link href="/configure/upload">Create Your Case</Link>
          </Button>
        </div>
      ) : (
        <OrdersTable orders={formattedOrders} />
      )}
    </>
  );
}

export default function OrdersPage() {

  return (
    <MaxWidthWrapper className="py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and manage your order history
        </p>
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-muted p-4 mb-4">
                <Package className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold">Loading orders...</h3>
            </div>
          }
        >
          <OrdersContent />
        </Suspense>
      </div>
    </MaxWidthWrapper>
  );
}
