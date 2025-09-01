import { ConsumableList } from "@/components/consumables/consumable-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ConsumablesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consumables</h1>
          <p className="text-muted-foreground">Manage consumable inventory and assignments</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/consumables/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Consumable
          </Link>
        </Button>
      </div>

      <ConsumableList />
    </div>
  )
}
