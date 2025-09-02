"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from "recharts"
import { useI18n } from "@/lib/i18n"
import { getDeviceReports, getCartridgeUsage } from "@/lib/api"

export function DashboardCharts() {
  const { t } = useI18n()
  const [deviceUsageData, setDeviceUsageData] = useState<any[]>([])
  const [cartridgeUsageData, setCartridgeUsageData] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      try {
        const [devices, cartridges] = await Promise.all([
          getDeviceReports(),
          getCartridgeUsage(),
        ])
        setDeviceUsageData(devices || [])
        setCartridgeUsageData(cartridges || [])
      } catch (err) {
        console.error("Failed to load charts", err)
      }
    }
    load()
  }, [])

  const chartConfig = {
    computers: {
      label: t("dashboard.charts.computers"),
      color: "hsl(var(--chart-1))",
    },
    printers: {
      label: t("dashboard.charts.printers"),
      color: "hsl(var(--chart-2))",
    },
    monitors: {
      label: t("dashboard.charts.monitors"),
      color: "hsl(var(--chart-3))",
    },
    used: {
      label: t("dashboard.charts.used"),
      color: "hsl(var(--chart-1))",
    },
    refilled: {
      label: t("dashboard.charts.refilled"),
      color: "hsl(var(--chart-2))",
    },
    new: {
      label: t("dashboard.charts.new"),
      color: "hsl(var(--chart-3))",
    },
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("dashboard.charts.device_usage_title")}</CardTitle>
          <CardDescription>{t("dashboard.charts.device_usage_desc")}</CardDescription>
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
          <CardTitle>{t("dashboard.charts.cartridge_usage_title")}</CardTitle>
          <CardDescription>{t("dashboard.charts.cartridge_usage_desc")}</CardDescription>
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
