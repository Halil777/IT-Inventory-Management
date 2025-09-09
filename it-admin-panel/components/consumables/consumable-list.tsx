"use client"

import { useMemo, useRef, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download, FileText, Printer as PrinterIcon } from "lucide-react"
import { deleteConsumable, assignConsumable } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"
import { exportToXlsx } from "@/lib/export"

export function ConsumableList() {
  const { t } = useI18n()
  const { data: consumables, mutate } = useSWR<any[]>("/consumables")
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() =>
    (consumables || []).filter((c) => (c.type || "").toLowerCase().includes(searchTerm.toLowerCase())),
  [consumables, searchTerm])

  const handleDelete = async (id: number) => {
    if (!confirm(t("consumables.delete_confirm"))) return
    try {
      await deleteConsumable(id)
      setConsumables((prev) => prev.filter((c) => c.id !== id))
      toast.success(t("consumables.deleted"))
    } catch (e) {
      console.error(e)
      toast.error(t("consumables.delete_failed"))
    }
  }

  const handleExportExcel = async () => {
    try {
      const headers = ["ID", "Type", "Quantity", "Status", "Department", "User"]
      const rows = filtered.map((i) => [
        i.id,
        i.type ?? "",
        i.quantity ?? 0,
        i.status ?? "",
        i.department?.name ?? "",
        i.user?.name ?? "",
      ]) as (string | number)[][]
      await exportToXlsx(headers, rows, "consumables")
    } catch (e) {
      console.error(e)
    }
  }

  const handleExportPDF = async () => {
    try {
      const pdfMakeMod: any = await import("pdfmake/build/pdfmake.js")
      const pdfFonts: any = await import("pdfmake/build/vfs_fonts.js")
      const pdfMake = pdfMakeMod.default || pdfMakeMod
      pdfMake.vfs = (pdfFonts.default && pdfFonts.default.vfs) || pdfFonts.vfs
      const headers = [
        t("common.id"),
        t("consumables.type"),
        t("consumables.quantity"),
        t("consumables.status"),
        t("common.department"),
        t("consumables.user"),
      ]
      const body = [
        headers,
        ...filtered.map((i) => [
          String(i.id ?? ""),
          i.type ?? "",
          String(i.quantity ?? 0),
          i.status ?? "",
          i.department?.name ?? "",
          i.user?.name ?? "",
        ]),
      ]
      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20],
        content: [
          { text: t("consumables.list_title"), style: "header" },
          { table: { headerRows: 1, widths: [40, 80, 60, 60, "*", "*"] as any, body }, layout: "lightHorizontalLines" },
        ],
        styles: { header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] } },
      }
      pdfMake.createPdf(docDefinition).download("consumables.pdf")
    } catch (e) {
      console.error(e)
    }
  }

  const handlePrint = () => {
    const node = printRef.current
    if (!node) return
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Consumables</title>
        <style>
          * { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji"; }
          body { padding: 12mm; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
          th { background: #f5f5f5; text-align: left; }
          @page { size: A4; margin: 0; }
        </style>
      </head>
      <body>
        <h2>Consumables</h2>
        ${node.innerHTML}
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 50); }<\/script>
      </body>
    </html>`
    const iframe = document.createElement("iframe")
    iframe.style.position = "fixed"
    iframe.style.right = "0"
    iframe.style.bottom = "0"
    iframe.style.width = "0"
    iframe.style.height = "0"
    iframe.style.border = "0"
    document.body.appendChild(iframe)
    const doc = iframe.contentWindow?.document
    if (!doc) return
    doc.open()
    doc.write(html)
    doc.close()
    const cleanup = () => setTimeout(() => document.body.removeChild(iframe), 500)
    iframe.contentWindow?.addEventListener("afterprint", cleanup)
    iframe.contentWindow?.addEventListener("blur", cleanup)
  }

  const handleAssignUser = async (id: number) => {
    const input = prompt(t("consumables.prompt_assign_user"), "")
    if (input === null) return
    const userId = input.trim() === "" ? undefined : Number(input)
    try {
      await assignConsumable({ consumableId: id, userId })
      toast.success(t("consumables.assign_updated"))
      mutate()
    } catch (e) {
      console.error(e)
      toast.error(t("consumables.assign_failed"))
    }
  }

  const handleAssignDepartment = async (id: number) => {
    const input = prompt(t("consumables.prompt_assign_department"), "")
    if (input === null) return
    const departmentId = input.trim() === "" ? undefined : Number(input)
    try {
      await assignConsumable({ consumableId: id, departmentId })
      toast.success(t("consumables.assign_updated"))
      mutate()
    } catch (e) {
      console.error(e)
      toast.error(t("consumables.assign_failed"))
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("consumables.list_title")}</CardTitle>
            <CardDescription>{t("consumables.list_desc")}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              {t("common.export_to_excel")}
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              {t("common.export_to_pdf")}
            </Button>
            <Button onClick={handlePrint} variant="outline">
              <PrinterIcon className="mr-2 h-4 w-4" />
              {t("common.print")}
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("consumables.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent ref={printRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.id")}</TableHead>
              <TableHead>{t("consumables.type")}</TableHead>
              <TableHead>{t("consumables.quantity")}</TableHead>
              <TableHead>{t("consumables.status")}</TableHead>
              <TableHead>{t("common.department")}</TableHead>
              <TableHead>{t("consumables.user")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.department?.name}</TableCell>
                <TableCell>{item.user?.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/consumables/${item.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignUser(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("consumables.assign_user")}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAssignDepartment(item.id)}>
                        <Edit className="mr-2 h-4 w-4" />
                        {t("consumables.assign_department")}
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/consumables/${item.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
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
