import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Monitor, Laptop, Printer, HardDrive, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Devices",
    value: "1,234",
    change: "+45 this month",
    icon: Monitor,
    color: "text-blue-600",
  },
  {
    title: "Computers",
    value: "567",
    change: "+23 this month",
    icon: Laptop,
    color: "text-green-600",
  },
  {
    title: "Printers",
    value: "89",
    change: "+3 this month",
    icon: Printer,
    color: "text-purple-600",
  },
  {
    title: "Peripherals",
    value: "456",
    change: "+15 this month",
    icon: HardDrive,
    color: "text-orange-600",
  },
  {
    title: "Under Repair",
    value: "23",
    change: "+5 this month",
    icon: AlertTriangle,
    color: "text-red-600",
  },
]

export function DeviceStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
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
