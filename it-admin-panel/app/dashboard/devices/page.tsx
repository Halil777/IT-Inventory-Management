"use client"
import { DeviceList } from "@/components/devices/device-list"
import { DeviceStats } from "@/components/devices/device-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function DevicesPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("devices.title")}</h1>
          <p className="text-muted-foreground">{t("devices.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/devices/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("devices.add")}
          </Link>
        </Button>
      </div>

      <DeviceStats />
      <DeviceList />
    </div>
  )
}

