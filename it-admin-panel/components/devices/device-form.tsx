"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeviceFormProps {
  deviceId?: string
}

export function DeviceForm({ deviceId }: DeviceFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!deviceId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would make an API call here
      console.log(isEditing ? "Updating device..." : "Creating device...")

      router.push("/dashboard/devices")
    } catch (err) {
      setError("Failed to save device. Please try again.")
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
          <Label htmlFor="category">Category *</Label>
          <Select name="category" defaultValue={isEditing ? "Computer" : "Select device category"} required>
            <SelectTrigger>
              <SelectValue placeholder="Select device category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer">Computer</SelectItem>
              <SelectItem value="Monitor">Monitor</SelectItem>
              <SelectItem value="Printer">Printer</SelectItem>
              <SelectItem value="Plotter">Plotter</SelectItem>
              <SelectItem value="Peripheral">Peripheral</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select name="status" defaultValue={isEditing ? "in-use" : "new"} required>
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
          <Label htmlFor="assignedTo">Assigned To</Label>
          <Select name="assignedTo" defaultValue={isEditing ? "john-smith" : "Select employee or department"}>
            <SelectTrigger>
              <SelectValue placeholder="Select employee or department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Unassigned</SelectItem>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
              <SelectItem value="it-department">IT Department</SelectItem>
              <SelectItem value="marketing-department">Marketing Department</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Building A, Floor 3"
            defaultValue={isEditing ? "Building A, Floor 3" : "Enter location"}
          />
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
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Device" : "Create Device"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
