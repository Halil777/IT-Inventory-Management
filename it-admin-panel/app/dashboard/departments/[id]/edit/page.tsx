import { DepartmentForm } from "@/components/departments/department-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface EditDepartmentPageProps {
  params: {
    id: string
  }
}

export default function EditDepartmentPage({ params }: EditDepartmentPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/departments/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Department
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Department</h1>
          <p className="text-muted-foreground">Update department information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Department Information</CardTitle>
          <CardDescription>Update the department details</CardDescription>
        </CardHeader>
        <CardContent>
          <DepartmentForm departmentId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}
