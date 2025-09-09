"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createDevice, updateDevice, getDeviceTypes, getEmployees, getDepartments, getDevice, createDeviceType } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

interface DeviceFormProps {
  deviceId?: string
}

export function DeviceForm({ deviceId }: DeviceFormProps) {
  const router = useRouter()
  const { t } = useI18n()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [deviceTypes, setDeviceTypes] = useState<any[]>([])
  const [typeId, setTypeId] = useState<string>("")
  const [status, setStatus] = useState<string>("new")
  const [allEmployees, setAllEmployees] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [departments, setDepartments] = useState<any[]>([])
  const [userId, setUserId] = useState<string>("")
  const [departmentId, setDepartmentId] = useState<string>("")

  const isEditing = !!deviceId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const tid = typeId ? Number(typeId) : NaN
      if (Number.isNaN(tid) || !status) throw new Error("Missing required fields")

      const data: any = { typeId: tid, status }
      if (userId) data.userId = Number(userId)
      if (departmentId) data.departmentId = Number(departmentId)
      if (isEditing) {
        await updateDevice(deviceId!, data)
        toast.success(t("devices.form.updated"))
      } else {
        await createDevice(data)
        toast.success(t("devices.form.created"))
      }

      router.push("/dashboard/devices")
    } catch {
      setError(t("devices.form.save_failed"))
      toast.error(t("devices.form.save_failed"))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDeviceTypes()
      .then((list) => {
        setDeviceTypes(list)
        if (!deviceId && list.length > 0) {
          setTypeId(String(list[0].id))
        }
      })
      .catch(console.error)
    getEmployees().then(setAllEmployees).catch(console.error)
    getDepartments().then(setDepartments).catch(console.error)

    if (deviceId) {
      getDevice(deviceId)
        .then((dev) => {
          setTypeId(dev.type?.id ? String(dev.type.id) : "")
          setStatus(dev.status || "new")
          setUserId(dev.user?.id ? String(dev.user.id) : "")
          setDepartmentId(dev.department?.id ? String(dev.department.id) : "")
        })
        .catch(console.error)
    }
  }, [deviceId])

  useEffect(() => {
    if (departmentId) {
      const filtered = allEmployees.filter((u) => u.department?.id === Number(departmentId))
      setEmployees(filtered)
      if (!filtered.some((u) => String(u.id) === userId)) {
        setUserId("")
      }
    } else {
      setEmployees([])
      setUserId("")
    }
  }, [departmentId, allEmployees])

  const seedDefaults = async () => {
    const defaults = ["Computer", "Monitor", "Printer", "Peripheral", "Plotter"]
    try {
      for (const name of defaults) {
        await createDeviceType({ name })
      }
      const list = await getDeviceTypes()
      setDeviceTypes(list)
      if (list.length > 0) setTypeId(String(list[0].id))
      toast.success(t("devices.form.defaults_created"))
    } catch (e) {
      console.error(e)
      toast.error(t("devices.form.defaults_failed"))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {deviceTypes.length === 0 && (
        <Alert>
          <AlertDescription>
            {t("devices.form.no_types")}
            <Button size="sm" className="ml-2" type="button" onClick={seedDefaults}>
              {t("devices.form.create_defaults")}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="typeId">{t("devices.form.type_label")}</Label>
          <input type="hidden" name="typeId" value={typeId} />
          <Select value={typeId} onValueChange={setTypeId} required>
            <SelectTrigger>
              <SelectValue placeholder={t("devices.form.type_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              {deviceTypes.map((t) => (
                <SelectItem key={t.id} value={String(t.id)}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">{t("devices.form.status_label")}</Label>
          <input type="hidden" name="status" value={status} />
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger>
              <SelectValue placeholder={t("devices.form.status_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">{t("devices.status_new")}</SelectItem>
              <SelectItem value="in-use">{t("devices.status_in_use")}</SelectItem>
              <SelectItem value="active">{t("devices.status_active")}</SelectItem>
              <SelectItem value="under-repair">{t("devices.status_under_repair")}</SelectItem>
              <SelectItem value="decommissioned">{t("devices.status_decommissioned")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brand">{t("devices.form.brand_label")}</Label>
          <Input id="brand" name="brand" placeholder={t("devices.form.brand_placeholder")} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">{t("devices.form.model_label")}</Label>
          <Input id="model" name="model" placeholder={t("devices.form.model_placeholder")} />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serialNumber">{t("devices.form.serial_number_label")}</Label>
        <Input
          id="serialNumber"
          name="serialNumber"
          placeholder={t("devices.form.serial_number_placeholder")}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchaseDate">{t("devices.form.purchase_date_label")}</Label>
        <Input id="purchaseDate" name="purchaseDate" type="date" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="departmentId">{t("devices.form.department_label")}</Label>
          <input type="hidden" name="departmentId" value={departmentId} />
          <Select value={departmentId || undefined} onValueChange={(v) => setDepartmentId(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder={t("devices.form.department_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("common.unassigned")}</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d.id} value={String(d.id)}>
                  {d.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="userId">{t("devices.form.user_label")}</Label>
          <input type="hidden" name="userId" value={userId} />
          <Select
            disabled={!departmentId}
            value={userId || undefined}
            onValueChange={(v) => setUserId(v === "none" ? "" : v)}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("devices.form.user_placeholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">{t("common.unassigned")}</SelectItem>
              {employees.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">{t("devices.form.specs_label")}</Label>
        <Textarea
          id="specifications"
          name="specifications"
          placeholder={t("devices.form.specs_placeholder")}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t("devices.form.notes_label")}</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder={t("devices.form.notes_placeholder")}
          rows={2}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading || !typeId || deviceTypes.length === 0}>
          {isEditing ? t("common.edit") : t("common.add")}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  )
}
