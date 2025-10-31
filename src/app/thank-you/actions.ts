"use server"

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()

    if (!user?.id || !user.email) {
        throw new Error('You need to be logged in to view this page.')
    }

    // Handle multiple order IDs (comma-separated)
    const orderIds = orderId.includes(',') ? orderId.split(',') : [orderId]
    
    // Get the first order (or only order)
    const order = await db.order.findFirst({
        where: { 
          id: orderIds[0], 
          userId: user.id 
        },
        include: {
            billingAddress: true,
            configuration: true,
            shippingAddress: true,
            user: true,
          },
    })

    if (!order) throw new Error('This order does not exist.')

    if (order.isPaid) {
      return order
    } else {
       return false
    }
    
}