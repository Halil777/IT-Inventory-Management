"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { getNotifications } from "@/lib/api"

const iconMap: Record<string, any> = {
  warning: AlertTriangle,
  error: AlertTriangle,
  info: Info,
  success: CheckCircle,
}

type Notification = {
  id: number
  type: string
  message: string
}

export function NotificationPanel() {
  const { t } = useI18n()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    getNotifications()
      .then((data) => setNotifications(data || []))
      .catch((err) => console.error("Failed to load notifications", err))
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.notifications.title")}</CardTitle>
        <CardDescription>{t("dashboard.notifications.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => {
          const Icon = iconMap[notification.type] || Info
          return (
            <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border">
              <Icon
                className={`h-5 w-5 mt-0.5 ${
                  notification.type === "warning"
                    ? "text-yellow-600"
                    : notification.type === "error"
                      ? "text-red-600"
                      : notification.type === "success"
                        ? "text-green-600"
                        : "text-blue-600"
                }`}
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{notification.message}</p>
                  <Badge
                    variant={
                      notification.type === "warning"
                        ? "secondary"
                        : notification.type === "error"
                          ? "destructive"
                          : notification.type === "success"
                            ? "default"
                            : "outline"
                    }
                  >
                    {notification.type}
                  </Badge>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
