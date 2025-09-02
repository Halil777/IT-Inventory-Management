"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createConsumable, updateConsumable, getConsumable, getDepartments, getEmployees } from "@/lib/api"
import { toast } from "sonner"

interface ConsumableFormProps {
  consumableId?: string
}

export function ConsumableForm({ consumableId }: ConsumableFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [type, setType] = useState("")
  const [quantity, setQuantity] = useState<string>("1")
  const [status, setStatus] = useState("available")
  const [departments, setDepartments] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [departmentId, setDepartmentId] = useState<string>("")
  const [userId, setUserId] = useState<string>("")

  const isEditing = !!consumableId

  useEffect(() => {
    getDepartments().then(setDepartments).catch(console.error)
    getEmployees().then(setEmployees).catch(console.error)
    if (consumableId) {
      getConsumable(consumableId)
        .then((c) => {
          setType(c.type || "")
          setQuantity(String(c.quantity ?? 1))
          setStatus(c.status || "available")
          setDepartmentId(c.department?.id ? String(c.department.id) : "")
          setUserId(c.user?.id ? String(c.user.id) : "")
        })
        .catch(console.error)
    }
  }, [consumableId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      if (!type) throw new Error("Type is required")
      const payload: any = {
        type,
        quantity: Number(quantity) || 0,
        status,
      }
      if (departmentId) payload.departmentId = Number(departmentId)
      if (userId) payload.userId = Number(userId)

      if (isEditing) {
        await updateConsumable(consumableId!, payload)
        toast.success("Consumable updated")
      } else {
        await createConsumable(payload)
        toast.success("Consumable created")
      }
      router.push("/dashboard/consumables")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save consumable")
      toast.error("Failed to save consumable")
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
          <Label htmlFor="type">Type *</Label>
          <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g., Keyboard" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity *</Label>
          <Input id="quantity" type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} min={0} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departmentId">Department</Label>
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

      <div className="space-y-2">
        <Label htmlFor="userId">Assigned User</Label>
        <Select value={userId || undefined} onValueChange={(v) => setUserId(v === "none" ? "" : v)}>
          <SelectTrigger>
            <SelectValue placeholder="Select user (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Unassigned</SelectItem>
            {employees.map((u) => (
              <SelectItem key={u.id} value={String(u.id)}>
                {u.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading || !type}>
          {isEditing ? "Save Changes" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

