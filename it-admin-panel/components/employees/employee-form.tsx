"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createEmployee, updateEmployee, getEmployee } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

interface EmployeeFormProps {
  employeeId?: string
}

export function EmployeeForm({ employeeId }: EmployeeFormProps) {
  const { t } = useI18n()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!employeeId

  useEffect(() => {
    if (employeeId) {
      getEmployee(employeeId)
        .then((emp) => {
          const setVal = (id: string, val: string) => {
            const el = document.getElementById(id) as HTMLInputElement | HTMLSelectElement | null
            if (el) el.value = val || ""
          }
          setVal("name", emp.name || "")
          setVal("email", emp.email || "")
          setVal("phone", emp.phone || "")
          setVal("civilNumber", emp.civilNumber || "")
          setVal("status", emp.status || "active")
        })
        .catch((e) => console.error(e))
    }
  }, [employeeId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const form = new FormData(e.currentTarget)
      const data = {
        name: String(form.get("name") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim() || undefined,
        civilNumber: String(form.get("civilNumber") || "").trim() || undefined,
        status: String(form.get("status") || "").trim(),
      }

      if (!data.name || !data.email || !data.status) {
        throw new Error("Missing required fields")
      }

      if (isEditing) {
        await updateEmployee(employeeId!, data)
        toast.success(t("employees.form.updated"))
      } else {
        await createEmployee(data)
        toast.success(t("employees.form.created"))
      }

      router.push("/dashboard/employees")
    } catch (err) {
      setError(err instanceof Error ? err.message : t("employees.form.save_failed"))
      toast.error(t("employees.form.save_failed"))
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
          <Label htmlFor="name">{t("employees.form.full_name_label")}</Label>
          <Input id="name" name="name" placeholder="John Doe" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("employees.form.email_label")}</Label>
          <Input id="email" name="email" type="email" placeholder="john.doe@company.com" required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">{t("employees.form.phone_label")}</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="civilNumber">{t("employees.form.civil_number_label")}</Label>
          <Input id="civilNumber" name="civilNumber" placeholder="1234567890" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">{t("employees.form.status_label")}</Label>
        <Select name="status" defaultValue="active">
          <SelectTrigger id="status">
            <SelectValue placeholder={t("employees.form.status_label")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">{t("employees.status_active")}</SelectItem>
            <SelectItem value="inactive">{t("employees.status_inactive")}</SelectItem>
          </SelectContent>
        </Select>
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
