import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Monitor, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Departments",
    value: "12",
    change: "+1 this month",
    icon: Building2,
    color: "text-blue-600",
  },
  {
    title: "Total Employees",
    value: "456",
    change: "+23 this month",
    icon: Users,
    color: "text-green-600",
  },
  {
    title: "Total Devices",
    value: "1,234",
    change: "+45 this month",
    icon: Monitor,
    color: "text-purple-600",
  },
  {
    title: "Avg. Employees/Dept",
    value: "38",
    change: "+2 this month",
    icon: TrendingUp,
    color: "text-orange-600",
  },
]

export function DepartmentStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
