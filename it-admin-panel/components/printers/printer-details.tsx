"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getPrinter } from "@/lib/api"

interface PrinterDetailsProps {
  printerId: string
}

export function PrinterDetails({ printerId }: PrinterDetailsProps) {
  const [printer, setPrinter] = useState<any | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    getPrinter(printerId)
      .then(setPrinter)
      .catch((e) => {
        console.error(e)
        setError("Failed to load printer")
      })
  }, [printerId])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Printer Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && <div className="text-sm text-destructive">{error}</div>}
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">ID:</span>
              <span className="text-sm">{printer?.id ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Model:</span>
              <span className="text-sm">{printer?.model ?? "-"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Department:</span>
              <span className="text-sm">{printer?.department?.name ?? "-"}</span>
            </div>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground">No additional fields yet.</div>
        </CardContent>
      </Card>
    </div>
  )
}

