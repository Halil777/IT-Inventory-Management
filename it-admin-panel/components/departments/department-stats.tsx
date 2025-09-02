"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Monitor, TrendingUp } from "lucide-react"
import { getDepartments, getEmployees, getDevices } from "@/lib/api"
import { useI18n } from "@/lib/i18n"

export function DepartmentStats() {
  const [deptCount, setDeptCount] = useState(0)
  const [empCount, setEmpCount] = useState(0)
  const [deviceCount, setDeviceCount] = useState(0)
  const { t } = useI18n()

  useEffect(() => {
    Promise.all([getDepartments(), getEmployees(), getDevices()])
      .then(([depts, emps, devs]) => {
        setDeptCount(depts.length)
        setEmpCount(emps.length)
        setDeviceCount(devs.length)
      })
      .catch((err) => console.error(err))
  }, [])

  const stats = [
    {
      title: t("departments.stats.total_departments"),
      value: deptCount,
      icon: Building2,
      color: "text-blue-600",
    },
    {
      title: t("departments.stats.total_employees"),
      value: empCount,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: t("departments.stats.total_devices"),
      value: deviceCount,
      icon: Monitor,
      color: "text-purple-600",
    },
    {
      title: t("departments.stats.avg_employees_per_dept"),
      value: deptCount ? Math.round(empCount / deptCount) : 0,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
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
