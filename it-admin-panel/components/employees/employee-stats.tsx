"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Monitor } from "lucide-react"
import { getEmployees, getDevices } from "@/lib/api"

export function EmployeeStats() {
  const [total, setTotal] = useState(0)
  const [withDevices, setWithDevices] = useState(0)
  const [deviceTotal, setDeviceTotal] = useState(0)

  useEffect(() => {
    Promise.all([getEmployees(), getDevices()])
      .then(([emps, devs]) => {
        setTotal(emps.length)
        setDeviceTotal(devs.length)
        const assignedIds = new Set(devs.filter((d: any) => d.user).map((d: any) => d.user.id))
        setWithDevices(assignedIds.size)
      })
      .catch((err) => console.error(err))
  }, [])

  const stats = [
    { title: "Total Employees", value: total, icon: Users, color: "text-blue-600" },
    { title: "With Devices", value: withDevices, icon: UserCheck, color: "text-green-600" },
    { title: "Without Devices", value: total - withDevices, icon: UserX, color: "text-red-600" },
    { title: "Total Devices", value: deviceTotal, icon: Monitor, color: "text-purple-600" },
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
