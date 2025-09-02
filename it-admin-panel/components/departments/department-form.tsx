"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createDepartment, getDepartment, updateDepartment } from "@/lib/api"
import { useI18n } from "@/lib/i18n"
import { toast } from "sonner"

interface DepartmentFormProps {
  departmentId?: string
}

export function DepartmentForm({ departmentId }: DepartmentFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [department, setDepartment] = useState<any | null>(null)

  const isEditing = !!departmentId

  useEffect(() => {
    if (departmentId) {
      getDepartment(departmentId)
        .then(setDepartment)
        .catch((e) => {
          console.error(e)
          setError(t("departments.form.save_failed"))
        })
    }
  }, [departmentId, t])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const form = new FormData(e.currentTarget)
      const name = String(form.get("name") || "").trim()
      const head = String(form.get("head") || "").trim()
      const description = String(form.get("description") || "").trim()
      if (!name) throw new Error(t("departments.form.name_label"))

      if (isEditing) {
        await updateDepartment(departmentId!, { name, head, description })
        toast.success(t("departments.form.updated"))
      } else {
        await createDepartment({ name, head, description })
        toast.success(t("departments.form.created"))
      }

      router.push("/dashboard/departments")
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t("departments.form.save_failed"),
      )
      toast.error(t("departments.form.save_failed"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("departments.form.name_label")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("departments.form.name_placeholder")}
            defaultValue={isEditing ? department?.name || "" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="head">{t("departments.form.head_label")}</Label>
          <Input
            id="head"
            name="head"
            placeholder={t("departments.form.head_placeholder")}
            defaultValue={isEditing ? department?.head || "" : ""}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("departments.form.description_label")}</Label>
        <Textarea
          id="description"
          name="description"
          placeholder={t("departments.form.description_placeholder")}
          defaultValue={isEditing ? department?.description || "" : ""}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isEditing ? t("common.edit") : t("common.add")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
