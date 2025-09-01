import { DeviceForm } from "@/components/devices/device-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditDevicePageProps {
  params: {
    id: string
  }
}

export default function EditDevicePage({ params }: EditDevicePageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/devices/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Device
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Device</h1>
          <p className="text-muted-foreground">Update device information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Device Information</CardTitle>
          <CardDescription>Update the device details</CardDescription>
        </CardHeader>
        <CardContent>
          <DeviceForm deviceId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
