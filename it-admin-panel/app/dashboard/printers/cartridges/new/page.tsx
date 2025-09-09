"use client"

import dynamic from "next/dynamic"
const CartridgeForm = dynamic(() => import("@/components/printers/cartridge-form").then(m => m.CartridgeForm), {
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

export default function NewCartridgePage() {
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
          <h1 className="text-3xl font-bold tracking-tight">Add Cartridge</h1>
          <p className="text-muted-foreground">Create a new printer cartridge</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Cartridge Information</CardTitle>
          <CardDescription>Enter details for the cartridge</CardDescription>
        </CardHeader>
        <CardContent>
          <CartridgeForm />
        </CardContent>
      </Card>
    </div>
  )
}
