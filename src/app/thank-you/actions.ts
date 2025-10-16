'use server'

import { BASE_PRICE } from '@/config/products'
import { stripe } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const createCartCheckoutSession = async ({
  cartItems,
}: {
  cartItems: any[]
}) => {
  try {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user) {
      throw new Error('You need to be logged in')
    }

    if (!cartItems || cartItems.length === 0) {
      throw new Error('No items in cart')
    }

    console.log('Creating checkout session for user:', user.id)
    console.log('Cart items:', cartItems.length)
    
    // Calculate totals to match order summary
    const itemPrice = 29900 // ₹299 in paise
    const subtotal = cartItems.length * itemPrice
    const tax = Math.round(subtotal * 0.18)
    const total = subtotal + tax

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/?payment=success',
      cancel_url: 'http://localhost:3000/thank-you',
      payment_method_types: ['card'],
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['IN', 'US'] },
      metadata: {
        userId: user.id,
      },
      line_items: [
        ...cartItems.map((item, i) => ({
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Custom Phone Case ${i + 1}`,
              description: 'Premium quality custom phone case',
            },
            unit_amount: itemPrice,
          },
          quantity: 1,
        })),
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: 'Tax (18%)',
              description: 'Goods and Services Tax',
            },
            unit_amount: tax,
          },
          quantity: 1,
        }
      ],
    })

    console.log('Stripe session created:', stripeSession.id)
    return { url: stripeSession.url }
  } catch (error) {
    console.error('Stripe error:', error)
    throw error
  }
}