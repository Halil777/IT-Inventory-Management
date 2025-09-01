import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { DashboardCharts } from "@/components/dashboard/dashboard-charts"
import { NotificationPanel } from "@/components/dashboard/notification-panel"
import { RecentActivity } from "@/components/dashboard/recent-activity"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to the IT Admin Panel. Here's an overview of your system.</p>
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
