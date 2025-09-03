"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getNotifications } from "@/lib/api"
import useSWR from "swr"
import { useI18n } from "@/lib/i18n"

export function NotificationList() {
  const { t } = useI18n()
  const [notifications, setNotifications] = useState<any[]>([])
  const { data: cartridges } = useSWR<any[]>("/cartridges")
  const { data: consumables } = useSWR<any[]>("/consumables")

  useEffect(() => {
    getNotifications().then(setNotifications).catch((err) => console.error(err))
  }, [])

  const lowStockRows = useMemo(() => {
    const list = cartridges || []
    const cons = consumables || []
    const enriched = list.map((c) => {
      const total = cons.filter((i: any) => (i.type || "").toLowerCase() === (c.type || "").toLowerCase())
        .reduce((sum: number, i: any) => sum + (Number(i.quantity) || 0), 0)
      const message = `${t("cartridges.list_title")}: ${c.type} — ${t("common.quantity")}: ${total}`
      return { id: `LS-${c.id}`, message, type: "LOW_STOCK", user: null, status: total <= 2 ? "low" : "ok" }
    })
    return enriched.filter((e) => e.status === "low")
  }, [cartridges, consumables, t])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>{t("notifications.title")}</CardTitle>
          <CardDescription>{t("notifications.subtitle")}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Message</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...lowStockRows, ...notifications].map((n) => (
              <TableRow key={n.id}>
                <TableCell>{n.id}</TableCell>
                <TableCell>{n.message}</TableCell>
                <TableCell>{n.type}</TableCell>
                <TableCell>{n.user?.name}</TableCell>
                <TableCell>{n.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
