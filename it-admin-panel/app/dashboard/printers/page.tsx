import { PrinterList } from "@/components/printers/printer-list"
import { CartridgeList } from "@/components/printers/cartridge-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function PrintersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Printers & Cartridges</h1>
          <p className="text-muted-foreground">Manage printers and cartridge inventory</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/printers/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Printer
          </Link>
        </Button>
      </div>

      <PrinterList />
      <CartridgeList />
    </div>
  )
}
