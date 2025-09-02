import { CartridgeForm } from "@/components/printers/cartridge-form"
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

