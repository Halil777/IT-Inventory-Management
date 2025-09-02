"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useI18n } from "@/lib/i18n"
import { getAuditLogs } from "@/lib/api"

type AuditLog = {
  id: number
  action: string
  entity: string
  user?: { name: string; surname: string }
  timestamp: string
}

export function RecentActivity() {
  const { t } = useI18n()
  const [logs, setLogs] = useState<AuditLog[]>([])

  useEffect(() => {
    getAuditLogs()
      .then((data) => setLogs(data || []))
      .catch((err) => console.error("Failed to load audit logs", err))
  }, [])

  function initials(user?: { name: string; surname: string }) {
    return `${user?.name?.[0] || ""}${user?.surname?.[0] || ""}`.toUpperCase()
  }

  function userName(user?: { name: string; surname: string }) {
    return user ? `${user.name} ${user.surname}` : t("dashboard.activity.system")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("dashboard.activity.title")}</CardTitle>
        <CardDescription>{t("dashboard.activity.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{initials(log.user)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{userName(log.user)}</span> {log.action}{" "}
                <span className="font-medium">{log.entity}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(log.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
