"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCartridge, updateCartridge, getCartridge } from "@/lib/api"
import { toast } from "sonner"

export function CartridgeForm({ cartridgeId }: { cartridgeId?: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [type, setType] = useState("")
  const [status, setStatus] = useState("available")

  const isEditing = !!cartridgeId

  useEffect(() => {
    if (cartridgeId) {
      getCartridge(cartridgeId)
        .then((c) => {
          setType(c.type || "")
          setStatus(c.status || "available")
        })
        .catch(console.error)
    }
  }, [cartridgeId])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      if (!type) throw new Error("Type is required")
      const payload: any = { type, status }
      if (isEditing) {
        await updateCartridge(cartridgeId!, payload)
        toast.success("Cartridge updated")
      } else {
        await createCartridge(payload)
        toast.success("Cartridge created")
      }
      router.push("/dashboard/printers")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save cartridge")
      toast.error("Failed to save cartridge")
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
          <Input id="type" value={type} onChange={(e) => setType(e.target.value)} placeholder="e.g., HP 206A" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="installed">Installed</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="disposed">Disposed</SelectItem>
            </SelectContent>
          </Select>
        </div>
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

