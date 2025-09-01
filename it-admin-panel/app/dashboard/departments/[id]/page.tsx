import { DepartmentDetails } from "@/components/departments/department-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import Link from "next/link"

interface DepartmentPageProps {
  params: {
    id: string
  }
}

export default function DepartmentPage({ params }: DepartmentPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/departments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Departments
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Department Details</h1>
            <p className="text-muted-foreground">View and manage department information</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/departments/${params.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <DepartmentDetails departmentId={params.id} />
    </div>
  )
}
