'use client'

import { Pie, PieChart, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const COLORS = ['#34d399', '#fb923c', '#60a5fa']

interface StatusDatum {
  status: string
  count: number
  [key: string]: string | number
}

const OrderStatusChart = ({ data }: { data: StatusDatum[] }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order status mix</CardTitle>
      </CardHeader>
      <CardContent className='h-[320px]'>
        <ResponsiveContainer width='100%' height='100%'>
          <PieChart>
            <Pie
              data={data}
              cx='50%'
              cy='45%'
              innerRadius={60}
              outerRadius={100}
              paddingAngle={4}
              dataKey='count'
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${entry.status}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => `${value} orders`}
              labelFormatter={(label) => label}
              contentStyle={{ borderRadius: 8, borderColor: '#e5e7eb' }}
            />
            <Legend
              layout='vertical'
              align='right'
              verticalAlign='middle'
              formatter={(value, entry, index) => {
                const count = data[index]?.count ?? 0
                const percent = total === 0 ? 0 : Math.round((count / total) * 100)
                return `${value} (${percent}%)`
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

export default OrderStatusChart
