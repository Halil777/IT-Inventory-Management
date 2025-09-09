"use client"

import dynamic from "next/dynamic"
const ConsumableForm = dynamic(() => import("@/components/consumables/consumable-form").then(m => m.ConsumableForm), {
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

export default function NewConsumablePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/consumables">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Consumables
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Consumable</h1>
          <p className="text-muted-foreground">Create a new consumable item</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Consumable Information</CardTitle>
          <CardDescription>Enter details for the consumable</CardDescription>
        </CardHeader>
        <CardContent>
          <ConsumableForm />
        </CardContent>
      </Card>
    </div>
  )
}
