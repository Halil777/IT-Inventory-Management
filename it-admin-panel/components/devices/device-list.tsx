"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MoreHorizontal, Edit, Eye, Trash2, Download, QrCode, UserPlus } from "lucide-react"

// Mock data - in real app this would come from API
const devices = [
  {
    id: "1",
    category: "Computer",
    brand: "Dell",
    model: "Latitude 7420",
    serialNumber: "DL7420001",
    status: "in-use",
    assignedTo: "John Smith",
    department: "IT",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2026-01-15",
    qrCode: "QR001",
  },
  {
    id: "2",
    category: "Monitor",
    brand: "Dell",
    model: "UltraSharp U2720Q",
    serialNumber: "DLU2720001",
    status: "in-use",
    assignedTo: "John Smith",
    department: "IT",
    purchaseDate: "2023-01-15",
    warrantyExpiry: "2026-01-15",
    qrCode: "QR002",
  },
  {
    id: "3",
    category: "Printer",
    brand: "HP",
    model: "LaserJet Pro M404n",
    serialNumber: "HPM404001",
    status: "active",
    assignedTo: "IT Department",
    department: "IT",
    purchaseDate: "2022-06-10",
    warrantyExpiry: "2025-06-10",
    qrCode: "QR003",
  },
  {
    id: "4",
    category: "Computer",
    brand: "Apple",
    model: "MacBook Pro 16",
    serialNumber: "APMBP16001",
    status: "under-repair",
    assignedTo: "Sarah Johnson",
    department: "Marketing",
    purchaseDate: "2023-03-20",
    warrantyExpiry: "2026-03-20",
    qrCode: "QR004",
  },
  {
    id: "5",
    category: "Peripheral",
    brand: "Logitech",
    model: "MX Master 3",
    serialNumber: "LGMX3001",
    status: "new",
    assignedTo: null,
    department: null,
    purchaseDate: "2024-01-10",
    warrantyExpiry: "2027-01-10",
    qrCode: "QR005",
  },
]

const statusColors = {
  new: "bg-blue-100 text-blue-800",
  "in-use": "bg-green-100 text-green-800",
  active: "bg-green-100 text-green-800",
  "under-repair": "bg-yellow-100 text-yellow-800",
  decommissioned: "bg-gray-100 text-gray-800",
}

export function DeviceList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (device.assignedTo && device.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesCategory = categoryFilter === "all" || device.category === categoryFilter
    const matchesStatus = statusFilter === "all" || device.status === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleExport = () => {
    // In a real app, this would generate and download an Excel file
    console.log("Exporting device list to Excel...")
    alert("Export functionality would be implemented here")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Devices</CardTitle>
            <CardDescription>Manage your organization's IT equipment</CardDescription>
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
              placeholder="Search devices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Computer">Computers</SelectItem>
              <SelectItem value="Monitor">Monitors</SelectItem>
              <SelectItem value="Printer">Printers</SelectItem>
              <SelectItem value="Plotter">Plotters</SelectItem>
              <SelectItem value="Peripheral">Peripherals</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-use">In Use</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="under-repair">Under Repair</SelectItem>
              <SelectItem value="decommissioned">Decommissioned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Serial Number</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>QR Code</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDevices.map((device) => (
              <TableRow key={device.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">
                      {device.brand} {device.model}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {device.department && `${device.department} Department`}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{device.category}</Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{device.serialNumber}</TableCell>
                <TableCell>{device.assignedTo || "Unassigned"}</TableCell>
                <TableCell>
                  <Badge className={statusColors[device.status as keyof typeof statusColors]}>
                    {device.status.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <QrCode className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-mono">{device.qrCode}</span>
                  </div>
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
                        <Link href={`/dashboard/devices/${device.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/devices/${device.id}/edit`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Assign to Employee
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
