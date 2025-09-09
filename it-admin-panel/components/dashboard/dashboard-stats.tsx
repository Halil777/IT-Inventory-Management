"use client"

import useSWR from "swr"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Monitor, Printer, Users, Building2, Package, AlertTriangle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import {
  getDevices,
  getPrinters,
  getEmployees,
  getDepartments,
  getConsumables,
  getNotifications,
} from "@/lib/api"

export function DashboardStats() {
  const { t } = useI18n()
  const { data: counts } = useSWR("dashboard-stats", async () => {
    const [devices, printers, employees, departments, consumables, notifications] = await Promise.all([
      getDevices(),
      getPrinters(),
      getEmployees(),
      getDepartments(),
      getConsumables(),
      getNotifications(),
    ])
    return {
      devices: devices.length || 0,
      printers: printers.length || 0,
      employees: employees.length || 0,
      departments: departments.length || 0,
      consumables: consumables.length || 0,
      alerts: notifications.length || 0,
    }
  })

  const stats = [
    {
      titleKey: "dashboard.stats.total_devices",
      value: counts?.devices ?? 0,
      icon: Monitor,
      color: "text-blue-600",
    },
    {
      titleKey: "dashboard.stats.active_printers",
      value: counts?.printers ?? 0,
      icon: Printer,
      color: "text-green-600",
    },
    {
      titleKey: "dashboard.stats.employees",
      value: counts?.employees ?? 0,
      icon: Users,
      color: "text-purple-600",
    },
    {
      titleKey: "dashboard.stats.departments",
      value: counts?.departments ?? 0,
      icon: Building2,
      color: "text-orange-600",
    },
    {
      titleKey: "dashboard.stats.consumables",
      value: counts?.consumables ?? 0,
      icon: Package,
      color: "text-cyan-600",
    },
    {
      titleKey: "dashboard.stats.alerts",
      value: counts?.alerts ?? 0,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {counts
        ? stats.map((stat) => (
            <Card key={stat.titleKey}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t(stat.titleKey)}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))
        : Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
    </div>
  )
}
