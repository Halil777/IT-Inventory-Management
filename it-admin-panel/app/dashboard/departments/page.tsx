"use client"
import { DepartmentList } from "@/components/departments/department-list"
import { DepartmentStats } from "@/components/departments/department-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function DepartmentsPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("departments.title")}</h1>
          <p className="text-muted-foreground">{t("departments.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/departments/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("departments.add")}
          </Link>
        </Button>
      </div>

      <DepartmentStats />
      <DepartmentList />
    </div>
  )
}

