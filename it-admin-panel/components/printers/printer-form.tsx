"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createPrinter, getDepartments, getPrinter, updatePrinter } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

interface PrinterFormProps {
  printerId?: string
}

export function PrinterForm({ printerId }: PrinterFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [departments, setDepartments] = useState<any[]>([])
  const [departmentId, setDepartmentId] = useState<string>("")
  const [model, setModel] = useState<string>("")

  const isEditing = !!printerId

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error)
    if (printerId) {
      getPrinter(printerId)
        .then((p) => {
          setModel(p.model || "")
          setDepartmentId(p.department?.id ? String(p.department.id) : "")
        })
        .catch(console.error)
    }
  }, [printerId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const depId = departmentId ? Number(departmentId) : NaN
      if (!model.trim() || Number.isNaN(depId)) {
        throw new Error("Model and Department are required")
      }
      const payload = { model: model.trim(), departmentId: depId }
      if (isEditing) {
        await updatePrinter(printerId!, payload)
        toast.success("Printer updated")
      } else {
        await createPrinter(payload)
        toast.success("Printer created")
      }
      router.push("/dashboard/printers")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save printer")
      toast.error("Failed to save printer")
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
          <Label htmlFor="model">Model *</Label>
          <Input id="model" name="model" value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g., HP LaserJet" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentId">Department *</Label>
          <input type="hidden" name="departmentId" value={departmentId} />
          <Select value={departmentId || undefined} onValueChange={setDepartmentId} required>
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

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading || !model || !departmentId}>
          {isEditing ? t("common.edit") : t("common.add")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
