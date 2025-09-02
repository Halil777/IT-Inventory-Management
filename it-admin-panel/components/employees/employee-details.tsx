"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Mail, Phone, IdCard } from "lucide-react"
import { getEmployee } from "@/lib/api"
import { useI18n } from "@/lib/i18n"

interface EmployeeDetailsProps {
  employeeId: string
}

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const { t } = useI18n()
  const [employee, setEmployee] = useState<any | null>(null)

  useEffect(() => {
    getEmployee(employeeId).then(setEmployee).catch((e) => console.error(e))
  }, [employeeId])

  if (!employee) return null

  const initials = employee.name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .slice(0, 2)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("employees.details_title")}</CardTitle>
        <CardDescription>{t("employees.details_description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-semibold">{employee.name}</h3>
            <Badge variant={employee.status === "active" ? "default" : "secondary"}>{t(`employees.status_${employee.status}`)}</Badge>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.phone || '-'}</span>
          </div>
          <div className="flex items-center gap-2">
            <IdCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{employee.civilNumber || '-'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
