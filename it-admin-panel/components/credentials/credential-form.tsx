"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createCredential } from "@/lib/api"
import { toast } from "sonner"

export function CredentialForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    try {
      const form = new FormData(e.currentTarget)
      const data = {
        fullName: String(form.get("fullName") || "").trim(),
        login: String(form.get("login") || "").trim(),
        password: String(form.get("password") || "").trim(),
      }

      if (!data.fullName || !data.login || !data.password) {
        throw new Error("All fields are required")
      }

      await createCredential(data)
      toast.success("Credential created")
      router.push("/dashboard/credentials")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save credential")
      toast.error("Failed to save credential")
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
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" placeholder="John Doe" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="login">Login (Email)</Label>
          <Input id="login" name="login" type="email" placeholder="john.doe@company.com" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" name="password" type="text" placeholder="Password" required />
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isLoading}>
          Add
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

