"use client"

"use client"

import dynamic from "next/dynamic"
const EmployeeForm = dynamic(() => import("@/components/employees/employee-form").then(m => m.EmployeeForm), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-10 bg-muted animate-pulse rounded" />
        <div className="h-10 bg-muted animate-pulse rounded" />
      </div>
    </div>
  ),
})
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function NewEmployeePage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/employees">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("employees.back_to_list")}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("employees.new.title")}</h1>
          <p className="text-muted-foreground">{t("employees.new.description")}</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("employees.info_title")}</CardTitle>
          <CardDescription>{t("employees.new.info_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeForm />
        </CardContent>
      </Card>
    </div>
  )
}
