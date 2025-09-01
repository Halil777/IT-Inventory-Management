import { DepartmentList } from "@/components/departments/department-list"
import { DepartmentStats } from "@/components/departments/department-stats"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function DepartmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Department Management</h1>
          <p className="text-muted-foreground">Manage organizational departments and their resources</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/departments/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Department
          </Link>
        </Button>
      </div>

      <DepartmentStats />
      <DepartmentList />
    </div>
  )
}
