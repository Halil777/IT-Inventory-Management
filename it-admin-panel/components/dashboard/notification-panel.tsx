import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Info, CheckCircle } from "lucide-react"

const notifications = [
  {
    id: 1,
    type: "warning",
    title: "Low Cartridge Stock",
    message: "HP LaserJet cartridges running low (3 remaining)",
    time: "2 hours ago",
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: "error",
    title: "Device Under Repair",
    message: "Printer PRT-001 in IT Department needs maintenance",
    time: "4 hours ago",
    icon: AlertTriangle,
  },
  {
    id: 3,
    type: "info",
    title: "New Employee Added",
    message: "John Smith assigned to Marketing Department",
    time: "1 day ago",
    icon: Info,
  },
  {
    id: 4,
    type: "success",
    title: "Backup Completed",
    message: "Weekly system backup completed successfully",
    time: "2 days ago",
    icon: CheckCircle,
  },
]

export function NotificationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notifications</CardTitle>
        <CardDescription>Latest system alerts and updates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="flex items-start space-x-3 p-3 rounded-lg border">
            <notification.icon
              className={`h-5 w-5 mt-0.5 ${
                notification.type === "warning"
                  ? "text-yellow-600"
                  : notification.type === "error"
                    ? "text-red-600"
                    : notification.type === "success"
                      ? "text-green-600"
                      : "text-blue-600"
              }`}
            />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{notification.title}</p>
                <Badge
                  variant={
                    notification.type === "warning"
                      ? "secondary"
                      : notification.type === "error"
                        ? "destructive"
                        : notification.type === "success"
                          ? "default"
                          : "outline"
                  }
                >
                  {notification.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{notification.message}</p>
              <p className="text-xs text-muted-foreground">{notification.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
