"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getDeviceReports, getPrinterReports, getConsumableReports } from "@/lib/api"

export function ReportList() {
  const [devicesByDept, setDevicesByDept] = useState<any[]>([])
  const [printersStats, setPrintersStats] = useState<any[]>([])
  const [consumablesStats, setConsumablesStats] = useState<any[]>([])

  useEffect(() => {
    Promise.all([getDeviceReports(), getPrinterReports(), getConsumableReports()])
      .then(([d, p, c]) => {
        setDevicesByDept(d)
        setPrintersStats(p)
        setConsumablesStats(c)
      })
      .catch((err) => console.error(err))
  }, [])

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div>
            <CardTitle>Devices by Department</CardTitle>
            <CardDescription>Counts grouped by department</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(devicesByDept, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Printers Stats</CardTitle>
            <CardDescription>Aggregations for printers</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(printersStats, null, 2)}</pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div>
            <CardTitle>Consumables Stats</CardTitle>
            <CardDescription>Inventory and usage totals</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(consumablesStats, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  )
}
