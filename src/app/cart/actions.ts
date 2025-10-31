'use server'

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products'
import { db } from '@/db'
import { stripe } from '@/lib/stripe'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const createCartCheckoutSession = async ({
  cartItems,
}: {
  cartItems: any[]
}) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    throw new Error('You need to be logged in')
  }

  if (!cartItems || cartItems.length === 0) {
    throw new Error('Cart is empty')
  }

  // Create orders for all cart items
  const orders = await Promise.all(
    cartItems.map(async (item) => {
      const configuration = await db.configuration.findUnique({
        where: { id: item.configId },
      })

      if (!configuration) {
        throw new Error('Configuration not found')
      }

      const { finish, material } = configuration

      let price = BASE_PRICE
      if (finish === 'textured') price += PRODUCT_PRICES.finish.textured
      if (material === 'polycarbonate')
        price += PRODUCT_PRICES.material.polycarbonate

      // Check if order already exists
      const existingOrder = await db.order.findFirst({
        where: {
          userId: user.id,
          configurationId: configuration.id,
          isPaid: false,
        },
      })

      if (existingOrder) {
        return { order: existingOrder, configuration, price }
      }

      const order = await db.order.create({
        data: {
          amount: price / 100,
          userId: user.id,
          configurationId: configuration.id,
        },
      })

      return { order, configuration, price }
    })
  )

  // Create Stripe line items
  const lineItems = await Promise.all(
    orders.map(async ({ configuration, price }) => {
      const product = await stripe.products.create({
        name: 'Custom iPhone Case',
        images: [configuration.imageUrl],
        default_price_data: {
          currency: 'INR',
          unit_amount: price,
        },
      })

      return {
        price: product.default_price as string,
        quantity: 1,
      }
    })
  )

  // Store order IDs for the thank you page
  const orderIds = orders.map((o) => o.order.id).join(',')

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${orderIds}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
    payment_method_types: ['card'],
    mode: 'payment',
    shipping_address_collection: { allowed_countries: ['US', 'IN'] },
    metadata: {
      userId: user.id,
      orderIds: orderIds,
    },
    line_items: lineItems,
  })

  return { url: stripeSession.url }
}
