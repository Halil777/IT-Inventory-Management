"use client"

import dynamic from "next/dynamic"
const PrinterForm = dynamic(() => import("@/components/printers/printer-form").then(m => m.PrinterForm), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="h-6 w-40 bg-muted animate-pulse rounded" />
      <div className="h-10 w-full bg-muted animate-pulse rounded" />
    </div>
  ),
})
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPrinterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/printers">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Printers
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Printer</h1>
          <p className="text-muted-foreground">Register a new printer in the system</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Printer Information</CardTitle>
          <CardDescription>Enter the details for the new printer</CardDescription>
        </CardHeader>
        <CardContent>
          <PrinterForm />
        </CardContent>
      </Card>
    </div>
  )
}
