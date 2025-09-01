"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download } from "lucide-react"

// Mock data - in real app this would come from API
const departments = [
  {
    id: "1",
    name: "Information Technology",
    head: "John Smith",
    employeeCount: 45,
    deviceCount: 120,
    status: "active",
    budget: "$250,000",
    location: "Building A, Floor 3",
  },
  {
    id: "2",
    name: "Human Resources",
    head: "Sarah Johnson",
    employeeCount: 12,
    deviceCount: 25,
    status: "active",
    budget: "$80,000",
    location: "Building A, Floor 2",
  },
  {
    id: "3",
    name: "Marketing",
    head: "Mike Wilson",
    employeeCount: 28,
    deviceCount: 65,
    status: "active",
    budget: "$150,000",
    location: "Building B, Floor 1",
  },
  {
    id: "4",
    name: "Finance",
    head: "Emily Davis",
    employeeCount: 18,
    deviceCount: 35,
    status: "active",
    budget: "$120,000",
    location: "Building A, Floor 4",
  },
  {
    id: "5",
    name: "Operations",
    head: "David Brown",
    employeeCount: 32,
    deviceCount: 78,
    status: "active",
    budget: "$180,000",
    location: "Building C, Floor 1",
  },
]

export function DepartmentList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDepartments = departments.filter(
    (dept) =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.head.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExport = () => {
    // In a real app, this would generate and download an Excel file
    console.log("Exporting departments to Excel...")
    alert("Export functionality would be implemented here")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Departments</CardTitle>
            <CardDescription>Manage your organization's departments</CardDescription>
          </div>
          <Button onClick={handleExport} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export to Excel
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
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
              <TableHead>Department</TableHead>
              <TableHead>Head of Department</TableHead>
              <TableHead>Employees</TableHead>
              <TableHead>Devices</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDepartments.map((dept) => (
              <TableRow key={dept.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{dept.name}</div>
                    <div className="text-sm text-muted-foreground">{dept.location}</div>
                  </div>
                </TableCell>
                <TableCell>{dept.head}</TableCell>
                <TableCell>{dept.employeeCount}</TableCell>
                <TableCell>{dept.deviceCount}</TableCell>
                <TableCell>{dept.budget}</TableCell>
                <TableCell>
                  <Badge variant={dept.status === "active" ? "default" : "secondary"}>{dept.status}</Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/departments/${dept.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/departments/${dept.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
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
