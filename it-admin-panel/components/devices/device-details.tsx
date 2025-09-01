"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Monitor, Calendar, DollarSign, MapPin, User, QrCode, FileText, Wrench } from "lucide-react"

interface DeviceDetailsProps {
  deviceId: string
}

// Mock data - in real app this would be fetched based on deviceId
const deviceData = {
  id: "1",
  category: "Computer",
  brand: "Dell",
  model: "Latitude 7420",
  serialNumber: "DL7420001",
  status: "in-use",
  assignedTo: "John Smith",
  department: "IT",
  location: "Building A, Floor 3",
  purchaseDate: "2023-01-15",
  warrantyExpiry: "2026-01-15",
  purchasePrice: "$1,299.99",
  supplier: "Dell Technologies",
  qrCode: "QR001",
  specifications: "Intel i7-1185G7, 16GB RAM, 512GB SSD, 14-inch FHD Display",
  notes: "Primary work laptop for IT Director",
  createdAt: "2023-01-15",
  updatedAt: "2024-01-10",
}

const maintenanceHistory = [
  {
    id: "1",
    date: "2024-01-10",
    type: "Maintenance",
    description: "Regular system update and cleaning",
    technician: "IT Support",
    cost: "$0.00",
  },
  {
    id: "2",
    date: "2023-08-15",
    type: "Repair",
    description: "Replaced keyboard due to key malfunction",
    technician: "John Doe",
    cost: "$85.00",
  },
  {
    id: "3",
    date: "2023-01-15",
    type: "Setup",
    description: "Initial device setup and configuration",
    technician: "IT Support",
    cost: "$0.00",
  },
]

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  "in-use": "bg-green-100 text-green-800",
  active: "bg-green-100 text-green-800",
  "under-repair": "bg-yellow-100 text-yellow-800",
  decommissioned: "bg-gray-100 text-gray-800",
}

export function DeviceDetails({ deviceId }: DeviceDetailsProps) {
  const handleGenerateQR = () => {
    // In a real app, this would generate a QR code
    console.log("Generating QR code for device...")
    alert("QR code generation would be implemented here")
  }

  return (
    <div className="space-y-6">
      {/* Device Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {deviceData.brand} {deviceData.model}
              </h3>
              <Badge className={statusColors[deviceData.status as keyof typeof statusColors]}>
                {deviceData.status.replace("-", " ")}
              </Badge>
            </div>
            <Separator />
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Category:</span>
                <Badge variant="outline">{deviceData.category}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Serial Number:</span>
                <span className="text-sm font-mono">{deviceData.serialNumber}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">QR Code:</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono">{deviceData.qrCode}</span>
                  <Button size="sm" variant="outline" onClick={handleGenerateQR}>
                    <QrCode className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Assigned to: <strong>{deviceData.assignedTo}</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{deviceData.location}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Purchase & Warranty</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Purchased: {deviceData.purchaseDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Warranty expires: {deviceData.warrantyExpiry}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Purchase price: {deviceData.purchasePrice}</span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-1">Supplier:</p>
              <p className="text-sm text-muted-foreground">{deviceData.supplier}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Specifications and Notes */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Specifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{deviceData.specifications}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{deviceData.notes}</p>
          </CardContent>
        </Card>
      </div>

      {/* Maintenance History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Maintenance History
          </CardTitle>
          <CardDescription>Service records and maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maintenanceHistory.map((record) => (
              <div key={record.id} className="flex items-start justify-between p-4 border rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{record.type}</Badge>
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                  </div>
                  <p className="text-sm font-medium">{record.description}</p>
                  <p className="text-xs text-muted-foreground">Technician: {record.technician}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{record.cost}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
