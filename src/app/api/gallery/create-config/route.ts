import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-04-10',
})

export async function POST(req: NextRequest) {
  try {
    const { items, totalAmount } = await req.json()

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map((item: any, index: number) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            name: `Custom Phone Case #${index + 1}`,
            description: 'Premium quality custom phone case',
            images: [item.imageUrl],
          },
          unit_amount: 29900, // ₹299 in paise
        },
        quantity: 1,
      })),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you`,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
