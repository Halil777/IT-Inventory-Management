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
        toast.success("Device updated")
      } else {
        await createDevice(data)
        toast.success("Device created")
      }

      router.push("/dashboard/devices")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save device. Please try again.")
      toast.error("Failed to save device")
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
    getEmployees().then(setEmployees).catch(console.error)
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

  const seedDefaults = async () => {
    const defaults = ["Computer", "Monitor", "Printer", "Peripheral", "Plotter"]
    try {
      for (const name of defaults) {
        await createDeviceType({ name })
      }
      const list = await getDeviceTypes()
      setDeviceTypes(list)
      if (list.length > 0) setTypeId(String(list[0].id))
      toast.success("Default device types created")
    } catch (e) {
      console.error(e)
      toast.error("Failed to create default device types")
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
            No device types found. Create default types to proceed.
            <Button size="sm" className="ml-2" type="button" onClick={seedDefaults}>
              Create defaults
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="typeId">Device Type *</Label>
          <input type="hidden" name="typeId" value={typeId} />
          <Select value={typeId} onValueChange={setTypeId} required>
            <SelectTrigger>
              <SelectValue placeholder="Select device type" />
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
          <Label htmlFor="status">Status *</Label>
          <input type="hidden" name="status" value={status} />
          <Select value={status} onValueChange={setStatus} required>
            <SelectTrigger>
              <SelectValue placeholder="Select device status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under-repair">Under Repair</SelectItem>
              <SelectItem value="decommissioned">Decommissioned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand *</Label>
          <Input
            id="brand"
            name="brand"
            placeholder="e.g., Dell"
            defaultValue={isEditing ? "Dell" : "Enter brand"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input
            id="model"
            name="model"
            placeholder="e.g., Latitude 7420"
            defaultValue={isEditing ? "Latitude 7420" : "Enter model"}
            required
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serial Number *</Label>
          <Input
            id="serialNumber"
            name="serialNumber"
            placeholder="e.g., DL7420001"
            defaultValue={isEditing ? "DL7420001" : "Enter serial number"}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qrCode">QR Code / Barcode</Label>
          <Input
            id="qrCode"
            name="qrCode"
            placeholder="e.g., QR001"
            defaultValue={isEditing ? "QR001" : "Enter QR code"}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input id="purchaseDate" name="purchaseDate" type="date" defaultValue={isEditing ? "2023-01-15" : ""} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
          <Input id="warrantyExpiry" name="warrantyExpiry" type="date" defaultValue={isEditing ? "2026-01-15" : ""} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="userId">Assigned User</Label>
          <input type="hidden" name="userId" value={userId} />
          <Select value={userId || undefined} onValueChange={(v) => setUserId(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select user (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              {employees.map((u) => (
                <SelectItem key={u.id} value={String(u.id)}>
                  {u.name} {u.surname}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentId">Assigned Department</Label>
          <input type="hidden" name="departmentId" value={departmentId} />
          <Select value={departmentId || undefined} onValueChange={(v) => setDepartmentId(v === "none" ? "" : v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select department (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
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
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            name="purchasePrice"
            type="number"
            step="0.01"
            placeholder="1299.99"
            defaultValue={isEditing ? "1299.99" : "Enter purchase price"}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="supplier">Supplier</Label>
          <Input
            id="supplier"
            name="supplier"
            placeholder="e.g., Dell Technologies"
            defaultValue={isEditing ? "Dell Technologies" : "Enter supplier"}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="specifications">Specifications</Label>
        <Textarea
          id="specifications"
          name="specifications"
          placeholder="Device specifications and technical details"
          defaultValue={
            isEditing ? "Intel i7-1185G7, 16GB RAM, 512GB SSD, 14-inch FHD Display" : "Enter specifications"
          }
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Additional notes or comments"
          defaultValue={isEditing ? "Primary work laptop for IT Director" : "Enter notes"}
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
