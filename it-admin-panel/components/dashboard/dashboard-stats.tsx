import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Printer, Users, Building2, Package, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Devices",
    value: "1,234",
    change: "+12%",
    icon: Monitor,
    color: "text-blue-600",
  },
  {
    title: "Active Printers",
    value: "89",
    change: "+3%",
    icon: Printer,
    color: "text-green-600",
  },
  {
    title: "Employees",
    value: "456",
    change: "+8%",
    icon: Users,
    color: "text-purple-600",
  },
  {
    title: "Departments",
    value: "12",
    change: "0%",
    icon: Building2,
    color: "text-orange-600",
  },
  {
    title: "Consumables",
    value: "2,567",
    change: "-5%",
    icon: Package,
    color: "text-cyan-600",
  },
  {
    title: "Alerts",
    value: "23",
    change: "+15%",
    icon: AlertTriangle,
    color: "text-red-600",
  },
]

export function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span
                className={
                  stat.change.startsWith("+")
                    ? "text-green-600"
                    : stat.change.startsWith("-")
                      ? "text-red-600"
                      : "text-gray-600"
                }
              >
                {stat.change}
              </span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
