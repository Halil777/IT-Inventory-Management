"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2 } from "lucide-react"
import { getDepartment } from "@/lib/api"

interface DepartmentDetailsProps {
  departmentId: string
}

export function DepartmentDetails({ departmentId }: DepartmentDetailsProps) {
  const [dept, setDept] = useState<any | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getDepartment(departmentId)
      .then(setDept)
      .catch((e) => {
        console.error(e)
        setError("Failed to load department")
      })
  }, [departmentId])

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="text-sm text-destructive">{error}</div>}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{dept?.id ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{dept?.name ?? "-"}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant="secondary">n/a</Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <span className="text-sm text-muted-foreground">Additional fields can be populated as backend evolves.</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
            <CardDescription>Coming soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">No statistics available for this entity.</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
