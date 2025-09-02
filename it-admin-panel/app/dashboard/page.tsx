"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { NotificationPanel } from "@/components/dashboard/notification-panel"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useI18n } from "@/lib/i18n"

export default function DashboardPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
      </div>

      <DashboardStats />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="col-span-4">
          <DashboardCharts />
        </div>
        <div className="col-span-3 space-y-6">
          <NotificationPanel />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
