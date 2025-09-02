"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [counts, setCounts] = useState({
    devices: 0,
    printers: 0,
    employees: 0,
    departments: 0,
    consumables: 0,
    alerts: 0,
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [devices, printers, employees, departments, consumables, notifications] = await Promise.all([
          getDevices(),
          getPrinters(),
          getEmployees(),
          getDepartments(),
          getConsumables(),
          getNotifications(),
        ])
        setCounts({
          devices: devices.length || 0,
          printers: printers.length || 0,
          employees: employees.length || 0,
          departments: departments.length || 0,
          consumables: consumables.length || 0,
          alerts: notifications.length || 0,
        })
      } catch (err) {
        console.error("Failed to load dashboard stats", err)
      }
    }
    fetchStats()
  }, [])

  const stats = [
    {
      titleKey: "dashboard.stats.total_devices",
      value: counts.devices,
      icon: Monitor,
      color: "text-blue-600",
    },
    {
      titleKey: "dashboard.stats.active_printers",
      value: counts.printers,
      icon: Printer,
      color: "text-green-600",
    },
    {
      titleKey: "dashboard.stats.employees",
      value: counts.employees,
      icon: Users,
      color: "text-purple-600",
    },
    {
      titleKey: "dashboard.stats.departments",
      value: counts.departments,
      icon: Building2,
      color: "text-orange-600",
    },
    {
      titleKey: "dashboard.stats.consumables",
      value: counts.consumables,
      icon: Package,
      color: "text-cyan-600",
    },
    {
      titleKey: "dashboard.stats.alerts",
      value: counts.alerts,
      icon: AlertTriangle,
      color: "text-red-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.titleKey}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t(stat.titleKey)}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
