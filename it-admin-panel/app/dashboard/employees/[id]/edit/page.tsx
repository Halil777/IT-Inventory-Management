"use client"

import { EmployeeForm } from "@/components/employees/employee-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

interface EditEmployeePageProps {
  params: {
    id: string
  }
}

export default function EditEmployeePage({ params }: EditEmployeePageProps) {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/employees/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("employees.edit.back")}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("employees.edit.title")}</h1>
          <p className="text-muted-foreground">{t("employees.edit.description")}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("employees.info_title")}</CardTitle>
          <CardDescription>{t("employees.edit.info_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm employeeId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
