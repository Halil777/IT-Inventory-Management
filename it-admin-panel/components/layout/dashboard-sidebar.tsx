"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  Building2,
  Users,
  Monitor,
  Printer,
  Package,
  BarChart3,
  Bell,
  Settings,
  LogOut,
} from "lucide-react"
import { useI18n } from "@/lib/i18n"

export function DashboardSidebar() {
  const pathname = usePathname()
  const { t } = useI18n()
  const menuItems = [
    { title: t("sidebar.dashboard") || t("dashboard.title"), url: "/dashboard", icon: LayoutDashboard },
    { title: t("sidebar.departments") || t("departments.title"), url: "/dashboard/departments", icon: Building2 },
    { title: t("sidebar.employees") || t("employees.title"), url: "/dashboard/employees", icon: Users },
    { title: t("sidebar.devices") || t("devices.title"), url: "/dashboard/devices", icon: Monitor },
    { title: t("sidebar.printers") || t("printers.title"), url: "/dashboard/printers", icon: Printer },
    { title: t("sidebar.consumables") || t("consumables.title"), url: "/dashboard/consumables", icon: Package },
    { title: t("sidebar.reports") || t("reports.title"), url: "/dashboard/reports", icon: BarChart3 },
    { title: t("sidebar.audit_logs") || "Audit Logs", url: "/dashboard/audit-logs", icon: Bell },
    { title: t("sidebar.notifications") || t("notifications.title"), url: "/dashboard/notifications", icon: Bell },
  ]

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Monitor className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{t("app.name")}</span>
            <span className="text-xs text-muted-foreground">{t("app.tagline")}</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton asChild isActive={pathname === item.url}>
                <Link href={item.url}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span>{t("sidebar.settings") || "Settings"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/auth/login">
                <LogOut className="h-4 w-4" />
                <span>{t("sidebar.logout") || "Logout"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
