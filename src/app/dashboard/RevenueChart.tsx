'use client'

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface RevenueDatum {
  date: string
  revenue: number
  orders: number
  [key: string]: string | number
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

const RevenueChart = ({ data }: { data: RevenueDatum[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue trend</CardTitle>
      </CardHeader>
      <CardContent className='h-[320px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data} margin={{ left: 0, right: 0, bottom: 12 }}>
            <defs>
              <linearGradient id='colorRevenue' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='#fb923c' stopOpacity={0.7} />
                <stop offset='95%' stopColor='#fb923c' stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#e5e7eb' />
            <XAxis dataKey='date' tickLine={false} axisLine={false} minTickGap={20} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => currencyFormatter.format(value)}
            />
            <Tooltip
              formatter={(value: number, name: string) =>
                name === 'revenue'
                  ? currencyFormatter.format(value)
                  : `${value} orders`
              }
              labelClassName='text-sm font-medium'
              contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }}
            />
            <Legend verticalAlign='top' height={36} />
            <Area
              type='monotone'
              dataKey='revenue'
              stroke='#f97316'
              fill='url(#colorRevenue)'
              strokeWidth={2}
              name='Revenue'
              activeDot={{ r: 6 }}
            />
            <Area
              type='monotone'
              dataKey='orders'
              stroke='#64748b'
              fill='#cbd5f5'
              fillOpacity={0.3}
              strokeWidth={2}
              name='Orders'
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default RevenueChart
