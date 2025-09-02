"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Monitor, User } from "lucide-react"
import { getDevice } from "@/lib/api"

interface DeviceDetailsProps {
  deviceId: string
}

export function DeviceDetails({ deviceId }: DeviceDetailsProps) {
  const [device, setDevice] = useState<any | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getDevice(deviceId)
      .then(setDevice)
      .catch((e) => {
        console.error(e)
        setError("Failed to load device")
      })
  }, [deviceId])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Device #{device?.id ?? "-"}</h3>
              <Badge variant="outline">{device?.status ?? "-"}</Badge>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Type:</span>
                <span className="text-sm">{device?.type?.name ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Department:</span>
                <span className="text-sm">{device?.department?.name ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Assigned User:</span>
                <span className="text-sm flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  {device?.user ? device.user.name : "-"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No additional fields for this entity yet.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
