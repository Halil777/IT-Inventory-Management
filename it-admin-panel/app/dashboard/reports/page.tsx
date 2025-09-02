"use client"

import { ReportList } from "@/components/reports/report-list"
import { useI18n } from "@/lib/i18n"

export default function ReportsPage() {
  const { t } = useI18n()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("reports.title")}</h1>
        <p className="text-muted-foreground">{t("reports.subtitle")}</p>
      </div>

      <ReportList />
    </div>
  )
}
