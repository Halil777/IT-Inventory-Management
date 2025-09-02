"use client"
import { ConsumableDetails } from "@/components/consumables/consumable-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"

export default function ConsumablePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/consumables">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Consumables
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Consumable Details</h1>
            <p className="text-muted-foreground">View and manage consumable</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/consumables/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <ConsumableDetails id={params.id} />
    </div>
  )
}

