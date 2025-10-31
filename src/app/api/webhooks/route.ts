import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { Resend } from 'resend'
import OrderReceivedEmail from '@/components/emails/0rderReceivedEmail'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(req: Request) {
  try {
    const body = await req.text()
    const signature = headers().get('stripe-signature')

    if (!signature) {
      return new Response('Invalid signature', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session

      if (!session.customer_details?.email) {
        throw new Error('Missing user email')
      }

      const { userId, orderId, orderIds } = session.metadata || {
        userId: null,
        orderId: null,
        orderIds: null,
      }

      if (!userId || (!orderId && !orderIds)) {
        throw new Error('Invalid request metadata')
      }

      const billingAddress = session.customer_details?.address
      const shippingAddress = session.shipping_details?.address

      // Handle multiple orders (from cart) or single order
      const orderIdsArray = orderIds 
        ? orderIds.split(',') 
        : orderId 
        ? [orderId] 
        : []

      // Update all orders
      await Promise.all(
        orderIdsArray.map((id) =>
          db.order.update({
            where: { id },
            data: {
              isPaid: true,
              shippingAddress: {
                create: {
                  name: session.customer_details!.name || '',
                  city: shippingAddress?.city || '',
                  country: shippingAddress?.country || '',
                  postalCode: shippingAddress?.postal_code || '',
                  state: shippingAddress?.state || '',
                },
              },
              billingAddress: {
                create: {
                  name: session.customer_details!.name || '',
                  city: billingAddress?.city || '',
                  country: billingAddress?.country || '',
                  postalCode: billingAddress?.postal_code || '',
                  state: billingAddress?.state || '',
                },
              },
            },
          })
        )
      )

      // Get the first order for email
      const updatedOrder = await db.order.findUnique({
        where: { id: orderIdsArray[0] },
      })

      if (!updatedOrder) {
        throw new Error('Order not found')
      }

      if (resend) {
        await resend.emails.send({
          from: 'casca.case@gmail.com',
          to: [session.customer_details.email],
          subject: 'Thank you for your order!',
          react: OrderReceivedEmail({
            orderId: orderIdsArray[0],
            orderDate: updatedOrder.createdAt.toLocaleDateString(),
            shippingAddress: {
              name: session.customer_details.name || '',
              city: shippingAddress?.city || '',
              country: shippingAddress?.country || '',
              postalCode: shippingAddress?.postal_code || '',
              state: shippingAddress?.state || '',
              id: '',
              phoneNumber: null,
            },
          }),
        })
      } else {
        console.warn('RESEND_API_KEY missing — skipping confirmation email send.')
      }
    }

    return NextResponse.json({ result: event, ok: true })
  } catch (err) {
    console.error(err)

    return NextResponse.json(
      { message: 'Something went wrong', ok: false },
      { status: 500 }
    )
  }
}
