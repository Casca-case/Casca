"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Firestore orders are plain JS objects, not Prisma types
interface OrdersTableProps {
  orders: any[];
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "delivered":
      return "bg-green-100 text-green-800";
    case "shipped":
      return "bg-blue-100 text-blue-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const OrderCard = ({ order }: { order: any }) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: 'User requested cancellation' })
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      // Optionally, refresh the page or update state
      window.location.reload();
    } catch (err) {
      alert('Could not cancel order.');
    }
  };

  return (
    <Card>
      <div className="p-4">
        <div className="flex items-center gap-4">
          {order.configuration.imageUrl && (
            <img
              src={order.configuration.imageUrl}
              alt="Case"
              className="w-16 h-16 object-cover rounded border"
            />
          )}
          <div>
            <p className="font-medium">{order.configuration.model ? `${order.configuration.model} Case` : 'Custom Design'}</p>
            <p className="text-sm text-muted-foreground">Order #{order.id}</p>
            <p className="text-sm">{formatDate(order.createdAt.toString())}</p>
            <p className="text-sm font-medium">{formatPrice(order.amount)}</p>
            <span className={cn("px-2 py-1 rounded-full text-xs font-medium", getStatusColor(order.status))}>
              {order.status}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-4">
          <a href={`/thank-you?orderId=${order.id}`} className="flex items-center gap-1 text-orange-600 hover:underline">
            Details <ChevronRight className="w-4 h-4" />
          </a>
          <button
            title="Cancel Order"
            className="text-red-600 hover:text-red-800"
            onClick={() => handleCancelOrder(order.id)}
            style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          >
            <svg xmlns="http://www.w3.org/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V4h6v3m-7 4v9a2 2 0 002 2h4a2 2 0 002-2V11m-7 0h10" /></svg>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, reason: 'User requested cancellation' })
      });
      if (!res.ok) throw new Error('Failed to cancel order');
      // Optionally, refresh the page or update state
      window.location.reload();
    } catch (err) {
      alert('Could not cancel order.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <div>
      {/* Mobile View (Cards) */}
      <div className="space-y-4 md:hidden">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>

      {/* Desktop View (Table) */}
      <div className="hidden md:block">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">#</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Purchase Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col items-center">
                      {order.configuration.imageUrl && (
                        <img
                          src={order.configuration.imageUrl}
                          alt="Case"
                          className="w-16 h-16 object-cover rounded mb-2 border"
                        />
                      )}
                      <span className="text-xs text-muted-foreground">{order.id}</span>
                      <span className="block mt-1">
                        {order.configuration.model ? `${order.configuration.model} Case` : 'Custom Design'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(order.createdAt.toString())}</TableCell>
                  <TableCell>{formatPrice(order.amount)}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        getStatusColor(order.status)
                      )}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <a
                        href={`/thank-you?orderId=${order.id}`}
                        className="flex items-center gap-1 text-orange-600 hover:underline"
                      >
                        Details
                        <ChevronRight className="w-4 h-4" />
                      </a>
                      <button
                        title="Cancel Order"
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleCancelOrder(order.id)}
                        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                      >
                        <svg xmlns="http://www.w3.org/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 7h12M9 7V4h6v3m-7 4v9a2 2 0 002 2h4a2 2 0 002-2V11m-7 0h10" /></svg>
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
