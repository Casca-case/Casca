import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import OrdersTable from "./OrdersTable";

export default async function OrdersPage() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  // TODO: Fetch orders from your database
  const orders = [
    {
      id: 1,
      productName: "Custom Phone Case - Nature Design",
      purchaseDate: "2025-08-20",
      orderPrice: 29.99,
      status: "Delivered",
    },
    {
      id: 2,
      productName: "Custom Phone Case - Abstract Art",
      purchaseDate: "2025-08-22",
      orderPrice: 29.99,
      status: "Shipped",
    },
    {
      id: 3,
      productName: "Custom Phone Case - Personal Photo",
      purchaseDate: "2025-08-24",
      orderPrice: 34.99,
      status: "Pending",
    },
  ];

  return (
    <MaxWidthWrapper className="py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and manage your order history
        </p>
        <OrdersTable orders={orders} />
      </div>
    </MaxWidthWrapper>
  );
}
