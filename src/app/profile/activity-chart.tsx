
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { week: "Week 1", cooked: 3, added: 1 },
  { week: "Week 2", cooked: 5, added: 0 },
  { week: "Week 3", cooked: 2, added: 2 },
  { week: "Week 4", cooked: 7, added: 0 },
]

const chartConfig = {
  cooked: {
    label: "Cooked",
    color: "hsl(var(--primary))",
  },
  added: {
    label: "Added",
    color: "hsl(var(--secondary))",
  },
}

export function ActivityChart() {
  return (
    <div className="h-[250px] w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="week"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="cooked" fill={chartConfig.cooked.color} radius={4} />
          <Bar dataKey="added" fill={chartConfig.added.color} radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
