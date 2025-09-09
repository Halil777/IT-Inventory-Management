"use client"
import { CredentialList } from "@/components/credentials/credential-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CredentialsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Credentials</h1>
          <p className="text-muted-foreground">Manage user mails and passwords</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/credentials/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Credential
          </Link>
        </Button>
      </div>

      <CredentialList />
    </div>
  )
}
