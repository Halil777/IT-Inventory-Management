import { PrinterForm } from "@/components/printers/printer-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditPrinterPageProps {
  params: {
    id: string
  }
}

export default function EditPrinterPage({ params }: EditPrinterPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/printers/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Printer
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Printer</h1>
          <p className="text-muted-foreground">Update printer information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Printer Information</CardTitle>
          <CardDescription>Update the printer details</CardDescription>
        </CardHeader>
        <CardContent>
          <PrinterForm printerId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}

