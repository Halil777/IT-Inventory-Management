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

interface DepartmentFormProps {
  departmentId?: string
}

export function DepartmentForm({ departmentId }: DepartmentFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const isEditing = !!departmentId

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // In a real app, you would make an API call here
      console.log(isEditing ? "Updating department..." : "Creating department...")

      router.push("/dashboard/departments")
    } catch (err) {
      setError("Failed to save department. Please try again.")
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
          <Label htmlFor="name">Department Name *</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g., Information Technology"
            defaultValue={isEditing ? "Information Technology" : ""}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="code">Department Code</Label>
          <Input id="code" name="code" placeholder="e.g., IT" defaultValue={isEditing ? "IT" : ""} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="head">Head of Department</Label>
          <Select name="head" defaultValue={isEditing ? "john-smith" : ""}>
            <SelectTrigger>
              <SelectValue placeholder="Select department head" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="mike-wilson">Mike Wilson</SelectItem>
              <SelectItem value="emily-davis">Emily Davis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="budget">Annual Budget</Label>
          <Input
            id="budget"
            name="budget"
            type="number"
            placeholder="250000"
            defaultValue={isEditing ? "250000" : ""}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            placeholder="e.g., Building A, Floor 3"
            defaultValue={isEditing ? "Building A, Floor 3" : ""}
          />
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

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Brief description of the department's role and responsibilities"
          defaultValue={isEditing ? "Responsible for managing IT infrastructure and support" : ""}
          rows={3}
        />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : isEditing ? "Update Department" : "Create Department"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
