"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download } from "lucide-react"
import { deleteDevice, getDevices } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

export function DeviceList() {
  const { t } = useI18n()
  const [devices, setDevices] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    getDevices().then(setDevices).catch((err) => console.error(err))
  }, [])

  const filtered = devices.filter((d) =>
    (d.type?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.status || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (!confirm(t("devices.delete_confirm"))) return
    try {
      await deleteDevice(id)
      setDevices((prev) => prev.filter((d) => d.id !== id))
      toast.success(t("devices.deleted"))
    } catch (e) {
      console.error(e)
      toast.error(t("devices.delete_failed"))
    }
  }

  const handleExport = () => {
    try {
      const headers = [
        t("common.id"),
        t("devices.type"),
        t("devices.status"),
        t("devices.user"),
        t("common.department"),
      ]
      const rows = devices.map((d) => [
        d.id,
        d.type?.name || "",
        d.status ? t(`devices.status_${d.status.replace(/-/g, "_")}`) : "",
        d.user?.name || "",
        d.department?.name || "",
      ])
      let csv = headers.join(",") + "\n"
      rows.forEach((r) => {
        csv += r
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",") + "\n"
      })
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", "devices.csv")
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (e) {
      console.error(e)
      toast.error(t("devices.export_failed"))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("devices.list_title")}</CardTitle>
            <CardDescription>{t("devices.list_desc")}</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export_to_excel")}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("devices.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.id")}</TableHead>
              <TableHead>{t("devices.type")}</TableHead>
              <TableHead>{t("devices.status")}</TableHead>
              <TableHead>{t("devices.user")}</TableHead>
              <TableHead>{t("common.department")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((device) => (
              <TableRow key={device.id}>
                <TableCell>{device.id}</TableCell>
                <TableCell>{device.type?.name}</TableCell>
                <TableCell>
                  {device.status ? t(`devices.status_${device.status.replace(/-/g, "_")}`) : ""}
                </TableCell>
                <TableCell>{device.user?.name}</TableCell>
                <TableCell>{device.department?.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/devices/${device.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/devices/${device.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(device.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
