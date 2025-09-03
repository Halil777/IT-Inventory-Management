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
import { deletePrinter } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

export function PrinterList() {
  const { t } = useI18n()
  const { data: printers, mutate } = useSWR<any[]>("/printers")
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() =>
    (printers || []).filter((p) => (p.model || "").toLowerCase().includes(searchTerm.toLowerCase())),
  [printers, searchTerm])

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this printer?")) return
    try {
      await deletePrinter(id)
      mutate((prev) => (prev || []).filter((p: any) => p.id !== id), false)
      toast.success("Printer deleted")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete printer")
    }
  }

  const handleExportExcel = () => {
    try {
      // Prepare CSV content
      const headers = [t("common.id"), t("printers.model"), t("common.department")]
      const rows = filtered.map((p) => [p.id, p.model ?? "", p.department?.name ?? ""]) as (string | number)[][]
      const csv = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell ?? "")
              // Escape quotes and wrap if needed
              const needsWrap = /[",\n;]/.test(str)
              const escaped = str.replace(/"/g, '""')
              return needsWrap ? `"${escaped}"` : escaped
            })
            .join(","),
        )
        .join("\n")
      const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "printers.csv"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
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
      const headers = [t("common.id"), t("printers.model"), t("common.department")]
      const body = [headers, ...filtered.map((p) => [String(p.id ?? ""), p.model ?? "", p.department?.name ?? ""])];
      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20],
        content: [
          { text: t("printers.list_title"), style: "header" },
          {
            table: { headerRows: 1, widths: [50, "*", "*"], body },
            layout: "lightHorizontalLines",
          },
        ],
        styles: { header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] } },
      }
      pdfMake.createPdf(docDefinition).download("printers.pdf")
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
        <title>${t("printers.list_title")}</title>
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
        <h2>${t("printers.list_title")}</h2>
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
    // Clean up after printing
    const remove = () => {
      setTimeout(() => {
        document.body.removeChild(iframe)
      }, 500)
    }
    iframe.contentWindow?.addEventListener("afterprint", remove)
    iframe.contentWindow?.addEventListener("blur", remove)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("printers.list_title")}</CardTitle>
            <CardDescription>{t("printers.list_desc")}</CardDescription>
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
              placeholder={t("printers.search_placeholder")}
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
              <TableHead>{t("printers.model")}</TableHead>
              <TableHead>{t("common.department")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((printer) => (
              <TableRow key={printer.id}>
                <TableCell>{printer.id}</TableCell>
                <TableCell>{printer.model}</TableCell>
                <TableCell>{printer.department?.name}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/printers/${printer.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/printers/${printer.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(printer.id)}>
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
