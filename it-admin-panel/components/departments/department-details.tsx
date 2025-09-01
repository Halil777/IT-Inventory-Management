"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, User, Monitor, DollarSign, MapPin, Calendar } from "lucide-react"

interface DepartmentDetailsProps {
  departmentId: string
}

// Mock data - in real app this would be fetched based on departmentId
const departmentData = {
  id: "1",
  name: "Information Technology",
  code: "IT",
  head: "John Smith",
  employeeCount: 45,
  deviceCount: 120,
  status: "active",
  budget: "$250,000",
  location: "Building A, Floor 3",
  description:
    "Responsible for managing IT infrastructure, software development, and technical support across the organization.",
  createdAt: "2023-01-15",
  updatedAt: "2024-01-10",
}

const departmentEmployees = [
  { name: "John Smith", role: "IT Director", email: "john.smith@company.com" },
  { name: "Alice Johnson", role: "Senior Developer", email: "alice.johnson@company.com" },
  { name: "Bob Wilson", role: "System Administrator", email: "bob.wilson@company.com" },
  { name: "Carol Davis", role: "Network Engineer", email: "carol.davis@company.com" },
  { name: "David Brown", role: "Help Desk Specialist", email: "david.brown@company.com" },
]

const departmentDevices = [
  { type: "Laptops", count: 45, status: "In Use" },
  { type: "Desktop Computers", count: 25, status: "In Use" },
  { type: "Monitors", count: 70, status: "In Use" },
  { type: "Printers", count: 8, status: "Active" },
  { type: "Network Equipment", count: 15, status: "Active" },
]

export function DepartmentDetails({ departmentId }: DepartmentDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Department Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Department Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{departmentData.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Code:</span>
                <span className="text-sm">{departmentData.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Head:</span>
                <span className="text-sm">{departmentData.head}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={departmentData.status === "active" ? "default" : "secondary"}>
                  {departmentData.status}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{departmentData.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Annual Budget: {departmentData.budget}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Created: {departmentData.createdAt}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Employees</span>
                </div>
                <span className="text-2xl font-bold">{departmentData.employeeCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Devices</span>
                </div>
                <span className="text-2xl font-bold">{departmentData.deviceCount}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{departmentData.description}</p>
        </CardContent>
      </Card>

      {/* Employees and Devices */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Department Employees</CardTitle>
            <CardDescription>Key personnel in this department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentEmployees.slice(0, 5).map((employee, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{employee.name}</div>
                    <div className="text-xs text-muted-foreground">{employee.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Department Devices</CardTitle>
            <CardDescription>Equipment assigned to this department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {departmentDevices.map((device, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                  <div>
                    <div className="text-sm font-medium">{device.type}</div>
                    <div className="text-xs text-muted-foreground">{device.status}</div>
                  </div>
                  <span className="text-sm font-bold">{device.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
