"use client"

import { ConsumableList } from "@/components/consumables/consumable-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function ConsumablesPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("consumables.title")}</h1>
          <p className="text-muted-foreground">{t("consumables.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/consumables/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("consumables.add")}
          </Link>
        </Button>
      </div>

      <ConsumableList />
    </div>
  )
}
