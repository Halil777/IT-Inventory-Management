import { DeviceForm } from "@/components/devices/device-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewDevicePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/devices">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Devices
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Device</h1>
          <p className="text-muted-foreground">Register a new device in the system</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Enter the details for the new device</CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceForm />
        </CardContent>
      </Card>
    </div>
  )
}
