"use client"

import { useMemo, useRef, useState } from "react"
import useSWR from "swr"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Trash2, Download } from "lucide-react"
import { deleteCredential } from "@/lib/api"
import { toast } from "sonner"

export function CredentialList() {
  const { data: credentials, mutate } = useSWR<any[]>("/credentials")
  const [searchTerm, setSearchTerm] = useState("")
  const printRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () =>
      (credentials || []).filter((c) =>
        (c.fullName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.login || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.password || "").toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [credentials, searchTerm],
  )

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this record?")) return
    try {
      await deleteCredential(id)
      mutate((prev) => (prev || []).filter((e: any) => e.id !== id), false)
      toast.success("Record deleted")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete record")
    }
  }

  const handleExportExcel = () => {
    try {
      const rows = filtered.map((c) => ({ id: c.id, fullName: c.fullName || "", login: c.login || "", password: c.password || "" }))
      const header = "id,fullName,login,password\n"
      const csv =
        header +
        rows
          .map((r) => `${r.id},"${r.fullName.replace(/"/g, '""')}","${r.login.replace(/"/g, '""')}","${r.password.replace(/"/g, '""')}"`)
          .join("\n")
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "credentials.csv"
      link.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
      toast.error("Failed to export")
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>User Credentials</CardTitle>
            <CardDescription>Full name, login, and password</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleExportExcel} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export to Excel
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search credentials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent ref={printRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Login</TableHead>
              <TableHead>Password</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.fullName}</TableCell>
                <TableCell>{item.login}</TableCell>
                <TableCell>{item.password}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(item.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
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

