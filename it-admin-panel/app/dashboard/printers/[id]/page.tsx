"use client"
import { PrinterDetails } from "@/components/printers/printer-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { deletePrinter } from "@/lib/api"
import { toast } from "sonner"

interface PrinterPageProps {
  params: {
    id: string
  }
}

export default function PrinterPage({ params }: PrinterPageProps) {
  const router = useRouter()
  const onDelete = async () => {
    if (!confirm("Delete this printer?")) return
    try {
      await deletePrinter(params.id)
      toast.success("Printer deleted")
      router.push("/dashboard/printers")
    } catch (e) {
      console.error(e)
      toast.error("Failed to delete printer")
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/printers">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Printers
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Printer Details</h1>
            <p className="text-muted-foreground">View and manage printer information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/printers/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <PrinterDetails printerId={params.id} />
    </div>
  )
}

