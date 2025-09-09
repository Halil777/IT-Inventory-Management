"use client"
import { CredentialForm } from "@/components/credentials/credential-form"

export default function NewCredentialPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Credential</h1>
        <p className="text-muted-foreground">Create a new user credential</p>
      </div>
      <CredentialForm />
    </div>
  )
}

