import { NotificationList } from "@/components/notifications/notification-list"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
        <p className="text-muted-foreground">View system notifications and alerts</p>
      </div>

      <NotificationList />
    </div>
  )
}
