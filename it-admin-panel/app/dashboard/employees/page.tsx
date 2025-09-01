"use client"
import { EmployeeList } from "@/components/employees/employee-list"
import { EmployeeStats } from "@/components/employees/employee-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function EmployeesPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("employees.title")}</h1>
          <p className="text-muted-foreground">{t("employees.subtitle")}</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/employees/new">
            <Plus className="mr-2 h-4 w-4" />
            {t("employees.add")}
          </Link>
        </Button>
      </div>

      <EmployeeStats />
      <EmployeeList />
    </div>
  )
}

