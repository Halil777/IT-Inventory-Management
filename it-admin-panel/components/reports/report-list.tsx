"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { getDeviceReports } from "@/lib/api"

export function ReportList() {
  const [report, setReport] = useState<any[]>([])

  useEffect(() => {
    getDeviceReports().then(setReport).catch((err) => console.error(err))
  }, [])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Device Report</CardTitle>
          <CardDescription>Devices by department</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <pre className="text-sm whitespace-pre-wrap break-words">{JSON.stringify(report, null, 2)}</pre>
      </CardContent>
    </Card>
  )
}
