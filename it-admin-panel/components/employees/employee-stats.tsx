import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Monitor } from "lucide-react"

const stats = [
  {
    title: "Total Employees",
    value: "456",
    change: "+23 this month",
    icon: Users,
    color: "text-blue-600",
  },
  {
    title: "Active Employees",
    value: "442",
    change: "+20 this month",
    icon: UserCheck,
    color: "text-green-600",
  },
  {
    title: "Inactive Employees",
    value: "14",
    change: "+3 this month",
    icon: UserX,
    color: "text-red-600",
  },
  {
    title: "Devices Assigned",
    value: "1,234",
    change: "+45 this month",
    icon: Monitor,
    color: "text-purple-600",
  },
]

export function EmployeeStats() {
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
