"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { User, Mail, Phone, Building2, Calendar, Monitor, Download } from "lucide-react"

interface EmployeeDetailsProps {
  employeeId: string
}

// Mock data - in real app this would be fetched based on employeeId
const employeeData = {
  id: "1",
  firstName: "John",
  lastName: "Smith",
  email: "john.smith@company.com",
  phone: "+1 (555) 123-4567",
  role: "IT Director",
  department: "Information Technology",
  status: "active",
  employeeId: "EMP001",
  hireDate: "2020-01-15",
  manager: "Sarah Johnson",
  location: "Building A, Floor 3",
}

const assignedDevices = [
  {
    id: "1",
    type: "Laptop",
    brand: "Dell",
    model: "Latitude 7420",
    serialNumber: "DL7420001",
    assignedDate: "2020-01-15",
    status: "In Use",
  },
  {
    id: "2",
    type: "Monitor",
    brand: "Dell",
    model: "UltraSharp U2720Q",
    serialNumber: "DLU2720001",
    assignedDate: "2020-01-15",
    status: "In Use",
  },
  {
    id: "3",
    type: "Phone",
    brand: "Cisco",
    model: "IP Phone 8841",
    serialNumber: "CSC8841001",
    assignedDate: "2020-01-15",
    status: "In Use",
  },
]

export function EmployeeDetails({ employeeId }: EmployeeDetailsProps) {
  const handleExportDevices = () => {
    // In a real app, this would generate and download an Excel file
    console.log("Exporting employee device list to Excel...")
    alert("Export functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      {/* Employee Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Employee Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {employeeData.firstName.charAt(0)}
                  {employeeData.lastName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {employeeData.firstName} {employeeData.lastName}
                </h3>
                <p className="text-sm text-muted-foreground">{employeeData.role}</p>
                <Badge variant={employeeData.status === "active" ? "default" : "secondary"}>
                  {employeeData.status}
                </Badge>
              </div>
            </div>
            <Separator />
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{employeeData.department}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Hired: {employeeData.hireDate}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Employee ID:</span>
                <span className="text-sm">{employeeData.employeeId}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Manager:</span>
                <span className="text-sm">{employeeData.manager}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{employeeData.location}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Devices Assigned:</span>
                <Badge variant="outline">{assignedDevices.length} devices</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assigned Devices */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Assigned Devices
              </CardTitle>
              <CardDescription>Equipment assigned to this employee</CardDescription>
            </div>
            <Button onClick={handleExportDevices} variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignedDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">
                      {device.brand} {device.model}
                    </h4>
                    <Badge variant="outline">{device.type}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <div>Serial: {device.serialNumber}</div>
                    <div>Assigned: {device.assignedDate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={device.status === "In Use" ? "default" : "secondary"}>{device.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
