"use client"
import { PrinterList } from "@/components/printers/printer-list"
import { CartridgeList } from "@/components/printers/cartridge-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function PrintersPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("printers.title")}</h1>
          <p className="text-muted-foreground">{t("printers.subtitle")}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/printers/new">
              <Plus className="mr-2 h-4 w-4" />
              {t("printers.add")}
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/printers/cartridges/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Cartridge
            </Link>
          </Button>
        </div>
      </div>

      <PrinterList />
      <CartridgeList />
    </div>
  )
}

