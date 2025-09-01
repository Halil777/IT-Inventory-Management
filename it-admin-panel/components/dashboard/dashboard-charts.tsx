"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"

const deviceUsageData = [
  { month: "Jan", computers: 120, printers: 15, monitors: 95 },
  { month: "Feb", computers: 125, printers: 18, monitors: 98 },
  { month: "Mar", computers: 130, printers: 16, monitors: 102 },
  { month: "Apr", computers: 135, printers: 20, monitors: 105 },
  { month: "May", computers: 140, printers: 22, monitors: 108 },
  { month: "Jun", computers: 145, printers: 19, monitors: 112 },
]

const cartridgeUsageData = [
  { month: "Jan", used: 45, refilled: 12, new: 8 },
  { month: "Feb", used: 52, refilled: 15, new: 10 },
  { month: "Mar", used: 48, refilled: 18, new: 6 },
  { month: "Apr", used: 61, refilled: 14, new: 12 },
  { month: "May", used: 55, refilled: 20, new: 9 },
  { month: "Jun", used: 67, refilled: 16, new: 14 },
]

const chartConfig = {
  computers: {
    label: "Computers",
    color: "hsl(var(--chart-1))",
  },
  printers: {
    label: "Printers",
    color: "hsl(var(--chart-2))",
  },
  monitors: {
    label: "Monitors",
    color: "hsl(var(--chart-3))",
  },
  used: {
    label: "Used",
    color: "hsl(var(--chart-1))",
  },
  refilled: {
    label: "Refilled",
    color: "hsl(var(--chart-2))",
  },
  new: {
    label: "New",
    color: "hsl(var(--chart-3))",
  },
}

export function DashboardCharts() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Device Usage Trends</CardTitle>
          <CardDescription>Monthly device allocation across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={deviceUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="computers" stroke="var(--color-computers)" strokeWidth={2} />
                <Line type="monotone" dataKey="printers" stroke="var(--color-printers)" strokeWidth={2} />
                <Line type="monotone" dataKey="monitors" stroke="var(--color-monitors)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cartridge Usage Statistics</CardTitle>
          <CardDescription>Monthly cartridge consumption and refill rates</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={cartridgeUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="used" fill="var(--color-used)" />
                <Bar dataKey="refilled" fill="var(--color-refilled)" />
                <Bar dataKey="new" fill="var(--color-new)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
