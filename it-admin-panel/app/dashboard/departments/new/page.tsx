"use client"

import { DepartmentForm } from "@/components/departments/department-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useI18n } from "@/lib/i18n"

export default function NewDepartmentPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/departments">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("departments.back_to_list")}
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {t("departments.new.title")}
          </h1>
          <p className="text-muted-foreground">
            {t("departments.new.description")}
          </p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{t("departments.info_title")}</CardTitle>
          <CardDescription>{t("departments.new.info_description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentForm />
        </CardContent>
      </Card>
    </div>
  )
}
