import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const activities = [
  {
    id: 1,
    user: "Admin",
    action: "Added new device",
    target: "Dell Laptop DL-001",
    time: "5 minutes ago",
    initials: "AD",
  },
  {
    id: 2,
    user: "John Doe",
    action: "Updated employee",
    target: "Sarah Wilson profile",
    time: "1 hour ago",
    initials: "JD",
  },
  {
    id: 3,
    user: "Admin",
    action: "Created department",
    target: "Quality Assurance",
    time: "3 hours ago",
    initials: "AD",
  },
  {
    id: 4,
    user: "Jane Smith",
    action: "Assigned device",
    target: "Monitor to Marketing",
    time: "6 hours ago",
    initials: "JS",
  },
]

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest actions performed in the system</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{activity.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <p className="text-sm">
                <span className="font-medium">{activity.user}</span> {activity.action}{" "}
                <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
