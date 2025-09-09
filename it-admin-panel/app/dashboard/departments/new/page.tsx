"use client"

import dynamic from "next/dynamic"
const DepartmentForm = dynamic(() => import("@/components/departments/department-form").then(m => m.DepartmentForm), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
    </div>
  ),
})
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
