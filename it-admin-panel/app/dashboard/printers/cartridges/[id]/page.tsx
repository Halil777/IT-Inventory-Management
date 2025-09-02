"use client"
import { CartridgeDetails } from "@/components/printers/cartridge-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default function CartridgePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/printers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Printers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Cartridge Details</h1>
            <p className="text-muted-foreground">View cartridge information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/printers/cartridges/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <CartridgeDetails id={params.id} />
    </div>
  )
}

