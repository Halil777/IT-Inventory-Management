"use client"
import { DepartmentDetails } from "@/components/departments/department-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { deleteDepartment } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useI18n } from "@/lib/i18n"

interface DepartmentPageProps {
  params: {
    id: string
  }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  const router = useRouter()
  const { t } = useI18n()
  const onDelete = async () => {
    if (!confirm(t("departments.delete_confirm"))) return
    try {
      await deleteDepartment(params.id)
      router.push("/dashboard/departments")
      toast.success(t("departments.deleted"))
    } catch (e) {
      toast.error(t("departments.delete_failed"))
      console.error(e)
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/departments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {t("departments.details.back")}
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t("departments.details.title")}
            </h1>
            <p className="text-muted-foreground">
              {t("departments.details.description")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/departments/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              {t("common.edit")}
            </Link>
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            {t("common.delete")}
          </Button>
        </div>
      </div>

      <DepartmentDetails departmentId={params.id} />
    </div>
  )
}
