
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import OrdersTable from "./OrdersTable";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function OrdersPage() {
  const { user, isLoading: authLoading } = useKindeBrowserClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user || !user.id) {
      window.location.href = "/";
      return;
    }

    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const ordersRef = collection(db, "orders");
        const q = query(ordersRef, where("userId", "==", user!.id));
        const querySnapshot = await getDocs(q);
        const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setOrders(ordersData);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load orders. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, [user, authLoading]);

  return (
    <MaxWidthWrapper className="py-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">
          View and manage your order history
        </p>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Loading orders...</h3>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
              <Package className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">Error loading orders</h3>
            <p className="text-muted-foreground mt-2 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : orders.length === 0 ? (
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
          <OrdersTable orders={orders} />
        )}
      </div>
    </MaxWidthWrapper>
  );
}
