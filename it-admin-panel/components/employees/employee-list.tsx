"use client"

import { useMemo, useRef, useState } from "react"
import useSWR from "swr"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download, FileText, Printer as PrinterIcon } from "lucide-react"
import { deleteEmployee } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"
import { exportToXlsx } from "@/lib/export"

export function EmployeeList() {
  const { t } = useI18n()
  const { data: employees, mutate } = useSWR<any[]>("/employees")
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() =>
    (employees || []).filter((e) =>
      e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.role || "").toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  [employees, searchTerm])

  const handleDelete = async (id: number) => {
    if (!confirm(t("employees.delete_confirm"))) return
    try {
      await deleteEmployee(id)
      mutate((prev) => (prev || []).filter((e: any) => e.id !== id), false)
      toast.success("Employee deleted")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete employee")
    }
  }

  const handleExportExcel = async () => {
    try {
      const headers = [
        t("common.id"),
        t("employees.full_name"),
        t("employees.email"),
        t("common.department"),
        t("employees.role"),
        t("employees.form.phone_label"),
        t("employees.civil_number"),
        t("employees.status"),
      ]
      const rows = filtered.map((e) => [
        e.id,
        e.name,
        e.email || "",
        e.department?.name || "",
        e.role || "",
        e.phone || "",
        e.civilNumber || "",
        e.status || "",
      ]) as (string | number)[][]
      await exportToXlsx(headers, rows, "employees")
    } catch (e) {
      console.error(e)
      toast.error(t("employees.export_failed"))
    }
  }

  const handleExportPDF = async () => {
    try {
      const pdfMakeMod: any = await import("pdfmake/build/pdfmake.js")
      const pdfFonts: any = await import("pdfmake/build/vfs_fonts.js")
      const pdfMake = pdfMakeMod.default || pdfMakeMod
      pdfMake.vfs = (pdfFonts.default && pdfFonts.default.vfs) || pdfFonts.vfs
      const headers = [
        t("employees.full_name"),
        t("employees.email"),
        t("common.department"),
        t("employees.role"),
        t("employees.civil_number"),
        t("employees.status"),
      ]
      const body = [
        headers,
        ...filtered.map((e) => [
          e.name ?? "",
          e.email ?? "",
          e.department?.name ?? "",
          e.role ?? "",
          e.civilNumber ?? "",
          e.status ? t(`employees.status_${e.status}`) : "",
        ]),
      ]
      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20],
        content: [
          { text: t("employees.list_title"), style: "header" },
          { table: { headerRows: 1, widths: [100, 120, 80, 70, 70, 50] as any, body }, layout: "lightHorizontalLines" },
        ],
        styles: { header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] } },
      }
      pdfMake.createPdf(docDefinition).download("employees.pdf")
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
        <title>${t("employees.list_title")}</title>
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
        <h2>${t("employees.list_title")}</h2>
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

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("employees.list_title")}</CardTitle>
            <CardDescription>{t("employees.list_desc")}</CardDescription>
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
              placeholder={t("employees.search_placeholder")}
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
              <TableHead>{t("employees.full_name")}</TableHead>
              <TableHead>{t("employees.email")}</TableHead>
              <TableHead>{t("common.department")}</TableHead>
              <TableHead>{t("employees.role")}</TableHead>
              <TableHead>{t("employees.civil_number")}</TableHead>
              <TableHead>{t("employees.status")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{employee.name}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department?.name || '-'}</TableCell>
                <TableCell>{employee.role || '-'}</TableCell>
                <TableCell>{employee.civilNumber || '-'}</TableCell>
                <TableCell>{t(`employees.status_${employee.status}`)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/employees/${employee.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(employee.id)}>
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
