"use client"

import { AuditLogList } from "@/components/audit-logs/audit-log-list"

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
        <p className="text-muted-foreground">Trace changes across the system</p>
      </div>

      <AuditLogList />
    </div>
  )
}

