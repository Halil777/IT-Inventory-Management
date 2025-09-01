"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createEmployee, updateEmployee, getDepartments, getEmployee } from "@/lib/api"
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
  const [departments, setDepartments] = useState<any[]>([])
  const [departmentId, setDepartmentId] = useState<string>("")

  const isEditing = !!employeeId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const form = new FormData(e.currentTarget)
      const data = {
        name: String(form.get("firstName") || "").trim(),
        surname: String(form.get("lastName") || "").trim(),
        role: String(form.get("role") || "").trim(),
        email: String(form.get("email") || "").trim(),
        phone: String(form.get("phone") || "").trim() || undefined,
        departmentId: departmentId ? Number(departmentId) : NaN,
      }

      if (!data.name || !data.surname || !data.role || !data.email || Number.isNaN(data.departmentId)) {
        throw new Error("Missing required fields")
      }

      if (isEditing) {
        await updateEmployee(employeeId!, data)
        toast.success("Employee updated")
      } else {
        await createEmployee(data)
        toast.success("Employee created")
      }

      router.push("/dashboard/employees")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save employee. Please try again.")
      toast.error("Failed to save employee")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDepartments()
      .then((list) => setDepartments(list))
      .catch((e) => console.error(e))

    if (employeeId) {
      getEmployee(employeeId)
        .then((emp) => {
          const setVal = (id: string, val: string) => {
            const el = document.getElementById(id) as HTMLInputElement | null
            if (el) el.value = val || ""
          }
          setVal("firstName", emp.name || "")
          setVal("lastName", emp.surname || "")
          setVal("email", emp.email || "")
          setVal("role", emp.role || "")
          setVal("phone", emp.phone || "")
          setDepartmentId(emp.department?.id ? String(emp.department.id) : "")
        })
        .catch((e) => console.error(e))
    }
  }, [employeeId])

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name *</Label>
          <Input id="firstName" name="firstName" placeholder="John" defaultValue={isEditing ? "John" : ""} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name *</Label>
          <Input id="lastName" name="lastName" placeholder="Smith" defaultValue={isEditing ? "Smith" : ""} required />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john.smith@company.com"
            defaultValue={isEditing ? "john.smith@company.com" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+1 (555) 123-4567"
            defaultValue={isEditing ? "+1 (555) 123-4567" : ""}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="role">Role *</Label>
          <Input
            id="role"
            name="role"
            placeholder="e.g., IT Director"
            defaultValue={isEditing ? "IT Director" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentId">Department *</Label>
          <input type="hidden" name="departmentId" value={departmentId} />
          <Select value={departmentId} onValueChange={setDepartmentId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="hireDate">Hire Date</Label>
          <Input id="hireDate" name="hireDate" type="date" defaultValue={isEditing ? "2020-01-15" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue={isEditing ? "active" : "active"}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID</Label>
          <Input id="employeeId" name="employeeId" placeholder="EMP001" defaultValue={isEditing ? "EMP001" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="manager">Manager</Label>
          <Select name="manager" defaultValue={isEditing ? "sarah-johnson" : ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
              <SelectItem value="emily-davis">Emily Davis</SelectItem>
              <SelectItem value="david-brown">David Brown</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
