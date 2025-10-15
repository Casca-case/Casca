import { db } from '@/db';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function OrderDetailsPage({ params, searchParams }: { params: { orderId: string }, searchParams?: any }) {
  const orderId = params.orderId || searchParams?.orderId;
  if (!orderId) return notFound();

  const order = await db.order.findUnique({
    where: { id: orderId },
    include: {
      configuration: true,
      shippingAddress: true,
      billingAddress: true,
    },
  });

  if (!order) return notFound();

  return (
    <div className="max-w-xl mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>
      <div className="mb-6">
        <span className="text-sm text-muted-foreground">Order ID:</span>
        <div className="font-mono text-lg">{order.id}</div>
      </div>
      <div className="flex flex-col items-center mb-6">
        {order.configuration.imageUrl && (
          <Image src={order.configuration.imageUrl} alt="Case" width={128} height={128} className="rounded border mb-2" />
        )}
        <div className="font-semibold text-lg">
          {order.configuration.model ? `${order.configuration.model} Case` : 'Custom Design'}
        </div>
        <div className="text-muted-foreground">{order.status}</div>
      </div>
      <div className="mb-4">
        <div><strong>Price:</strong> ${order.amount.toFixed(2)}</div>
        <div><strong>Purchase Date:</strong> {order.createdAt.toLocaleDateString()}</div>
        <div><strong>Status:</strong> {order.status}</div>
      </div>
      {order.shippingAddress && (
        <div className="mb-4">
          <div className="font-semibold mb-1">Shipping Address</div>
          <div>{order.shippingAddress.name}</div>
          <div>{order.shippingAddress.city}, {order.shippingAddress.state || ''} {order.shippingAddress.postalCode}</div>
          <div>{order.shippingAddress.country}</div>
          {order.shippingAddress.phoneNumber && <div>Phone: {order.shippingAddress.phoneNumber}</div>}
        </div>
      )}
      {order.billingAddress && (
        <div className="mb-4">
          <div className="font-semibold mb-1">Billing Address</div>
          <div>{order.billingAddress.name}</div>
          <div>{order.billingAddress.city}, {order.billingAddress.state || ''} {order.billingAddress.postalCode}</div>
          <div>{order.billingAddress.country}</div>
          {order.billingAddress.phoneNumber && <div>Phone: {order.billingAddress.phoneNumber}</div>}
        </div>
      )}
    </div>
  );
}
