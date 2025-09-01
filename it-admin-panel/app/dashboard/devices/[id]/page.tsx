"use client"
import { DeviceDetails } from "@/components/devices/device-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deleteDevice } from "@/lib/api"
import { toast } from "sonner"

interface DevicePageProps {
  params: {
    id: string
  }
}

export default function DevicePage({ params }: DevicePageProps) {
  const router = useRouter()
  const onDelete = async () => {
    if (!confirm("Delete this device?")) return
    try {
      await deleteDevice(params.id)
      toast.success("Device deleted")
      router.push("/dashboard/devices")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete device")
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/devices">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Devices
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Device Details</h1>
            <p className="text-muted-foreground">View and manage device information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/devices/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <DeviceDetails deviceId={params.id} />
    </div>
  )
}
