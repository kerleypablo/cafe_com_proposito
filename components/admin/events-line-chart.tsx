'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

interface EventsLineChartProps {
  data: Array<{
    id: string
    title: string
    shortTitle: string
    registrations: number
  }>
}

const chartConfig = {
  registrations: {
    label: 'Inscrições',
    color: 'var(--color-primary)',
  },
}

export function EventsLineChart({ data }: EventsLineChartProps) {
  const maxValue = Math.max(...data.map((item) => item.registrations), 0)

  return (
    <ChartContainer config={chartConfig} className="h-[20rem] w-full">
      <LineChart data={data} margin={{ left: 4, right: 16, top: 16, bottom: 8 }}>
        <CartesianGrid vertical={false} strokeDasharray="4 4" />
        <XAxis
          dataKey="shortTitle"
          tickLine={false}
          axisLine={false}
          interval={0}
          tickMargin={10}
        />
        <YAxis
          domain={[0, Math.max(1, maxValue + 1)]}
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          width={32}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload?.title || ''}
              formatter={(value) => [`${value} inscrições`, 'Participantes']}
            />
          }
        />
        <Line
          type="monotone"
          dataKey="registrations"
          stroke="var(--color-registrations)"
          strokeWidth={3}
          dot={{ r: 4, fill: 'var(--color-registrations)' }}
          activeDot={{ r: 6, fill: 'var(--color-registrations)' }}
          animationDuration={1300}
          animationEasing="ease-out"
        />
      </LineChart>
    </ChartContainer>
  )
}
