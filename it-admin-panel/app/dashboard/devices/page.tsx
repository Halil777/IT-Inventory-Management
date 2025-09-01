import { DeviceList } from "@/components/devices/device-list"
import { DeviceStats } from "@/components/devices/device-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DevicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Device Management</h1>
          <p className="text-muted-foreground">Manage computers, monitors, printers, and other IT equipment</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/devices/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Link>
        </Button>
      </div>

      <DeviceStats />
      <DeviceList />
    </div>
  )
}
