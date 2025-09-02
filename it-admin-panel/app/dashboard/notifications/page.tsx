"use client"

import { NotificationList } from "@/components/notifications/notification-list"
import { useI18n } from "@/lib/i18n"

export default function NotificationsPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("notifications.title")}</h1>
        <p className="text-muted-foreground">{t("notifications.subtitle")}</p>
      </div>

      <NotificationList />
    </div>
  )
}
