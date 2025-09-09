"use client"

import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2 } from "lucide-react"
import { useI18n } from "@/lib/i18n"

interface DepartmentDetailsProps {
  departmentId: string
}

export function DepartmentDetails({ departmentId }: DepartmentDetailsProps) {
  const { t } = useI18n()
  const { data: dept, error } = useSWR<any>(
    departmentId ? `/departments/${departmentId}` : null,
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {t("departments.info_title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-sm text-destructive">
                {t("departments.details.load_failed")}
              </div>
            )}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("common.id")}:</span>
                <span className="text-sm">{dept?.id ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("departments.form.name_label")}:</span>
                <span className="text-sm">{dept?.name ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{t("departments.form.head_label")}:</span>
                <span className="text-sm">{dept?.head ?? "-"}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">{t("departments.form.description_label")}:</span>
                <span className="text-sm">{dept?.description ?? "-"}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("departments.details.stats_title")}</CardTitle>
            <CardDescription>{t("departments.details.stats_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">{t("departments.details.no_stats")}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
