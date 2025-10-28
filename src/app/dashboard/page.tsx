import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { db } from '@/db'
import { formatPrice } from '@/lib/utils'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound } from 'next/navigation'
import StatusDropdown from './StatusDropdown'
import RevenueChart from './RevenueChart'
import OrderStatusChart from './OrderStatusChart'

const STATUS_LABELS: Record<string, string> = {
  awaiting_shipment: 'Awaiting Shipment',
  shipped: 'Shipped',
  fulfilled: 'Fulfilled',
}

const DATE_FORMATTER = new Intl.DateTimeFormat('en-IN', {
  month: 'short',
  day: 'numeric',
})
 
  
  const Page = async () => {
    const { getUser } = getKindeServerSession()
    const user = await getUser()
  
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL
  
    if (!user || user.email !== ADMIN_EMAIL) {
      return notFound()
    }

    const now = new Date()
    const sevenDaysAgo = new Date(now)
    sevenDaysAgo.setDate(now.getDate() - 7)
    const thirtyDaysAgo = new Date(now)
    thirtyDaysAgo.setDate(now.getDate() - 30)

    const orders = await db.order.findMany({
      where: {
        isPaid: true,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: true,
        shippingAddress: true,
      },
    })

    const monthlyOrders = await db.order.findMany({
      where: {
        isPaid: true,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      select: {
        createdAt: true,
        amount: true,
        status: true,
      },
    })

    const lastWeekSum = await db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const lastMonthSum = await db.order.aggregate({
      where: {
        isPaid: true,
        createdAt: {
          gte: thirtyDaysAgo,
        },
      },
      _sum: {
        amount: true,
      },
    })

    const totalMonthlyRevenue = lastMonthSum._sum.amount ?? 0
    const totalMonthlyOrders = monthlyOrders.length
    const averageOrderValue =
      totalMonthlyOrders > 0 ? totalMonthlyRevenue / totalMonthlyOrders : 0

    const revenueAccumulator = monthlyOrders.reduce(
      (acc, order) => {
        const key = order.createdAt.toISOString().split('T')[0]
        const entry = acc.get(key) ?? { revenue: 0, orders: 0 }
        entry.revenue += order.amount
        entry.orders += 1
        acc.set(key, entry)
        return acc
      },
      new Map<string, { revenue: number; orders: number }>()
    )

    const daysToShow = 30
    const startDate = new Date(now)
    startDate.setDate(now.getDate() - (daysToShow - 1))

    const revenueData = Array.from({ length: daysToShow }, (_, index) => {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + index)
      const isoKey = date.toISOString().split('T')[0]
      const stats = revenueAccumulator.get(isoKey) ?? { revenue: 0, orders: 0 }

      return {
        date: DATE_FORMATTER.format(date),
        revenue: Math.round(stats.revenue * 100) / 100,
        orders: stats.orders,
      }
    })

    const statusCounts = monthlyOrders.reduce<Record<string, number>>(
      (acc, order) => {
        acc[order.status] = (acc[order.status] ?? 0) + 1
        return acc
      },
      {}
    )

    const orderStatusData = Object.entries(STATUS_LABELS).map(
      ([status, label]) => ({
        status: label,
        count: statusCounts[status] ?? 0,
      })
    )

    const WEEKLY_GOAL = 500
    const MONTHLY_GOAL = 2500
  
    return (
      <div className='flex min-h-screen w-full bg-muted/40'>
        <div className='max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4'>
          <div className='flex flex-col gap-16'>
            <div className='grid gap-4 sm:grid-cols-3'>
              <Card>
                <CardHeader className='pb-2'>
                  <CardDescription>Last Week</CardDescription>
                  <CardTitle className='text-4xl'>
                    {formatPrice(lastWeekSum._sum.amount ?? 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-sm text-muted-foreground'>
                    of {formatPrice(WEEKLY_GOAL)} goal
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={((lastWeekSum._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardDescription>Last Month</CardDescription>
                  <CardTitle className='text-4xl'>
                    {formatPrice(lastMonthSum._sum.amount ?? 0)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-sm text-muted-foreground'>
                    of {formatPrice(MONTHLY_GOAL)} goal
                  </div>
                </CardContent>
                <CardFooter>
                  <Progress
                    value={((lastMonthSum._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                  />
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className='pb-2'>
                  <CardDescription>Average order value</CardDescription>
                  <CardTitle className='text-4xl'>
                    {formatPrice(averageOrderValue)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-sm text-muted-foreground'>
                    Based on {totalMonthlyOrders} paid orders in the last 30 days
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className='grid gap-4 lg:grid-cols-7'>
              <div className='lg:col-span-4'>
                <RevenueChart data={revenueData} />
              </div>
              <div className='lg:col-span-3'>
                <OrderStatusChart data={orderStatusData} />
              </div>
            </div>
  
            <h1 className='text-4xl font-bold tracking-tight'>Incoming orders</h1>
  
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className='hidden sm:table-cell'>Status</TableHead>
                  <TableHead className='hidden sm:table-cell'>
                    Purchase date
                  </TableHead>
                  <TableHead className='text-right'>Amount</TableHead>
                </TableRow>
              </TableHeader>
  
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className='bg-accent'>
                    <TableCell>
                      <div className='font-medium'>
                        {order.shippingAddress?.name}
                      </div>
                      <div className='hidden text-sm text-muted-foreground md:inline'>
                        {order.user.email}
                      </div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      <StatusDropdown id={order.id} orderStatus={order.status} />
                    </TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                    <TableCell className='text-right'>
                      {formatPrice(order.amount)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    )
  }
  
  export default Page