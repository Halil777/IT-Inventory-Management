"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Laptop, Printer, HardDrive, AlertTriangle } from "lucide-react"
import { getDevices } from "@/lib/api"

export function DeviceStats() {
  const [devices, setDevices] = useState<any[]>([])

  useEffect(() => {
    getDevices().then(setDevices).catch((err) => console.error(err))
  }, [])

  const total = devices.length
  const computers = devices.filter((d) => d.type?.name === "Computer").length
  const printers = devices.filter((d) => d.type?.name === "Printer").length
  const peripherals = devices.filter((d) => d.type?.name === "Peripheral").length
  const underRepair = devices.filter((d) => d.status === "under-repair").length

  const stats = [
    { title: "Total Devices", value: total, icon: Monitor, color: "text-blue-600" },
    { title: "Computers", value: computers, icon: Laptop, color: "text-green-600" },
    { title: "Printers", value: printers, icon: Printer, color: "text-purple-600" },
    { title: "Peripherals", value: peripherals, icon: HardDrive, color: "text-orange-600" },
    { title: "Under Repair", value: underRepair, icon: AlertTriangle, color: "text-red-600" },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
