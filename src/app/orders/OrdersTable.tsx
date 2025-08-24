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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ChevronRight,
  Package,
  Clock,
  DollarSign,
  Truck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Order {
  id: number;
  productName: string;
  purchaseDate: string;
  orderPrice: number;
  status: string;
}

interface OrdersTableProps {
  orders: Order[];
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

export default function OrdersTable({ orders }: OrdersTableProps) {
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "MMM d, yyyy");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  // Mobile card view for each order
  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="p-4 space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium">Order #{order.id}</p>
          <p className="text-sm text-muted-foreground">{order.productName}</p>
        </div>
        <span
          className={cn(
            "px-2 py-1 rounded-full text-xs font-medium",
            getStatusColor(order.status)
          )}
        >
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span>{formatDate(order.purchaseDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-muted-foreground" />
          <span>{formatPrice(order.orderPrice)}</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => setExpandedOrder(order.id === expandedOrder ? null : order.id)}
      >
        {order.id === expandedOrder ? "Hide Details" : "View Details"}
      </Button>

      {order.id === expandedOrder && (
        <div className="pt-4 space-y-3 text-sm">
          <p className="font-medium">Order Details</p>
          {/* Add more order details here */}
          <p className="text-muted-foreground">
            Additional order information can be displayed here.
          </p>
        </div>
      )}
    </Card>
  );

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
                  <TableCell>{order.productName}</TableCell>
                  <TableCell>{formatDate(order.purchaseDate)}</TableCell>
                  <TableCell>{formatPrice(order.orderPrice)}</TableCell>
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
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() =>
                        setExpandedOrder(order.id === expandedOrder ? null : order.id)
                      }
                    >
                      Details
                      <ChevronRight className="w-4 h-4" />
                    </Button>
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
