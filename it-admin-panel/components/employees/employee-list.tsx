"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download } from "lucide-react"
import { deleteEmployee, getEmployees } from "@/lib/api"
import { toast } from "sonner"
import { useI18n } from "@/lib/i18n"

export function EmployeeList() {
  const { t } = useI18n()
  const [employees, setEmployees] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    getEmployees().then(setEmployees).catch((err) => console.error(err))
  }, [])

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.department?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.role || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = async (id: number) => {
    if (!confirm(t("employees.delete_confirm"))) return
    try {
      await deleteEmployee(id)
      setEmployees((prev) => prev.filter((e) => e.id !== id))
      toast.success("Employee deleted")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete employee")
    }
  }

  const handleExport = () => {
    try {
      const rows = employees.map((e) => ({
        id: e.id,
        name: e.name,
        email: e.email || "",
        department: e.department?.name || "",
        role: e.role || "",
        phone: e.phone || "",
        civilNumber: e.civilNumber || "",
        status: e.status || "",
      }))
      const header = "id,name,email,department,role,phone,civilNumber,status\n"
      const csv =
        header +
        rows
          .map((r) =>
            `${r.id},"${r.name.replace(/"/g, '""')}","${r.email.replace(/"/g, '""')}","${r.department.replace(/"/g, '""')}","${r.role.replace(/"/g, '""')}","${r.phone.replace(/"/g, '""')}","${r.civilNumber.replace(/"/g, '""')}","${r.status.replace(/"/g, '""')}"`,
          )
          .join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "employees.csv"
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      toast.error(t("employees.export_failed"))
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{t("employees.list_title")}</CardTitle>
            <CardDescription>{t("employees.list_desc")}</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            {t("common.export_to_excel")}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("employees.search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("employees.full_name")}</TableHead>
              <TableHead>{t("employees.email")}</TableHead>
              <TableHead>{t("common.department")}</TableHead>
              <TableHead>{t("employees.role")}</TableHead>
              <TableHead>{t("employees.civil_number")}</TableHead>
              <TableHead>{t("employees.status")}</TableHead>
              <TableHead className="w-[70px]">{t("common.actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">{employee.name}</div>
                  </div>
                </TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.department?.name || '-'}</TableCell>
                <TableCell>{employee.role || '-'}</TableCell>
                <TableCell>{employee.civilNumber || '-'}</TableCell>
                <TableCell>{t(`employees.status_${employee.status}`)}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/employees/${employee.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t("common.view_details")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/employees/${employee.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("common.edit")}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(employee.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t("common.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
