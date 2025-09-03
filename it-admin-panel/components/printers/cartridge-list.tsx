"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  FileText,
  Printer as PrinterIcon,
} from "lucide-react";
import { deleteCartridge } from "@/lib/api";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

export function CartridgeList() {
  const { t } = useI18n();
  const { data: cartridges, mutate } = useSWR<any[]>("/cartridges");
  const { data: consumables } = useSWR<any[]>("/consumables");
  const [searchTerm, setSearchTerm] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () =>
      (cartridges || [])
        .map((c) => {
          const related = (consumables || []).filter(
            (i: any) =>
              (i.type || "").toLowerCase() === (c.type || "").toLowerCase()
          );
          const total = related.reduce(
            (sum: number, i: any) => sum + (Number(i.quantity) || 0),
            0
          );
          const assigned = related
            .filter(
              (i: any) => i.userId || i.departmentId || i.user || i.department
            )
            .reduce(
              (sum: number, i: any) => sum + (Number(i.quantity) || 0),
              0
            );
          const available = Math.max(total - assigned, 0);
          return {
            ...c,
            __total: total,
            __assigned: assigned,
            __available: available,
          };
        })
        .filter((c) =>
          (c.type || "").toLowerCase().includes(searchTerm.toLowerCase())
        ),
    [cartridges, consumables, searchTerm]
  );

  useEffect(() => {
    if (!filtered || filtered.length === 0) return;
    const low = filtered.filter((c) => c.__available <= 2);
    if (low.length > 0) {
      toast.warning(`${low.length} ${t("cartridges.low_stock_items")}`);
    }
  }, [filtered]);

  const handleDelete = async (id: number) => {
    if (!confirm(t("cartridges.delete_confirm"))) return;
    try {
      await deleteCartridge(id);
      mutate((prev) => (prev || []).filter((c: any) => c.id !== id), false);
      toast.success(t("cartridges.deleted"));
    } catch (e) {
      console.error(e);
      toast.error(t("cartridges.delete_failed"));
    }
  };

  const handleExportExcel = () => {
    try {
      const headers = ["ID", "Type", "Status"];
      const rows = filtered.map((c) => [
        c.id,
        c.type ?? "",
        c.status ?? "",
      ]) as (string | number)[][];
      const csv = [headers, ...rows]
        .map((row) =>
          row
            .map((cell) => {
              const str = String(cell ?? "");
              const needsWrap = /[",\n;]/.test(str);
              const escaped = str.replace(/"/g, '""');
              return needsWrap ? `"${escaped}"` : escaped;
            })
            .join(",")
        )
        .join("\n");
      const blob = new Blob(["\ufeff" + csv], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "cartridges.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportPDF = async () => {
    try {
      const pdfMakeMod: any = await import("pdfmake/build/pdfmake.js");
      const pdfFonts: any = await import("pdfmake/build/vfs_fonts.js");
      const pdfMake = pdfMakeMod.default || pdfMakeMod;
      pdfMake.vfs = (pdfFonts.default && pdfFonts.default.vfs) || pdfFonts.vfs;
      const headers = [
        t("common.id"),
        t("cartridges.type"),
        t("cartridges.status"),
      ];
      const body = [
        headers,
        ...filtered.map((c) => [
          String(c.id ?? ""),
          c.type ?? "",
          c.status ?? "",
        ]),
      ];
      const docDefinition = {
        pageSize: "A4",
        pageMargins: [20, 20, 20, 20],
        content: [
          { text: t("cartridges.list_title"), style: "header" },
          {
            table: { headerRows: 1, widths: [60, "*", 80] as any, body },
            layout: "lightHorizontalLines",
          },
        ],
        styles: { header: { fontSize: 14, bold: true, margin: [0, 0, 0, 10] } },
      };
      pdfMake.createPdf(docDefinition).download("cartridges.pdf");
    } catch (e) {
      console.error(e);
    }
  };

  const handlePrint = () => {
    const node = printRef.current;
    if (!node) return;
    const html = `<!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <title>Cartridges</title>
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
        <h2>Cartridges</h2>
        ${node.innerHTML}
        <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 50); }<\/script>
      </body>
    </html>`;
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(html);
    doc.close();
    const cleanup = () =>
      setTimeout(() => document.body.removeChild(iframe), 500);
    iframe.contentWindow?.addEventListener("afterprint", cleanup);
    iframe.contentWindow?.addEventListener("blur", cleanup);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("cartridges.list_title")}</CardTitle>
            <CardDescription>{t("cartridges.list_desc")}</CardDescription>
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
              placeholder={t("cartridges.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent ref={printRef}>
        {/* Low stock reminder */}
        <div className="mb-4">
          {filtered.some((c) => c.__available <= 2) && (
            <div className="rounded-md border border-amber-300 bg-amber-50 p-3 text-amber-900 text-sm">
              <strong className="mr-1">
                {t("cartridges.low_stock_title")}:
              </strong>
              {t("cartridges.low_stock_desc")}
              <div className="mt-2">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("cartridges.type")}</TableHead>
                      <TableHead>{t("cartridges.available")}</TableHead>
                      <TableHead>{t("cartridges.total")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered
                      .filter((c) => c.__available <= 2)
                      .map((c) => (
                        <TableRow key={`low-${c.id}`}>
                          <TableCell>{c.type}</TableCell>
                          <TableCell className="font-medium text-red-600">
                            {c.__available}
                          </TableCell>
                          <TableCell>{c.__total}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("common.id")}</TableHead>
              <TableHead>{t("cartridges.type")}</TableHead>
              <TableHead>{t("common.quantity")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((cartridge) => (
              <TableRow key={cartridge.id}>
                <TableCell>{cartridge.id}</TableCell>
                <TableCell>{cartridge.type}</TableCell>
                <TableCell>{cartridge.__total}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/printers/cartridges/${cartridge.id}`}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dashboard/printers/cartridges/${cartridge.id}/edit`}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDelete(cartridge.id)}
                      >
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
  );
}
