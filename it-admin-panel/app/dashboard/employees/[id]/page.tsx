"use client"

import { EmployeeDetails } from "@/components/employees/employee-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

interface EmployeePageProps {
  params: {
    id: string
  }
}

export default function EmployeePage({ params }: EmployeePageProps) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/employees">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("employees.details.back")}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("employees.details_title")}</h1>
            <p className="text-muted-foreground">{t("employees.details_description")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/employees/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <EmployeeDetails employeeId={params.id} />
    </div>
  )
}
