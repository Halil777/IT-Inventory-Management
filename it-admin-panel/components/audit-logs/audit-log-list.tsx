"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getAuditLogs } from "@/lib/api"

export function AuditLogList() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    getAuditLogs().then(setLogs).catch(console.error)
  }, [])

  return (
    <Card>
      <CardHeader>
        <div>
          <CardTitle>Audit Logs</CardTitle>
          <CardDescription>Recent actions and changes</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Entity</TableHead>
              <TableHead>Entity ID</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((l) => (
              <TableRow key={l.id}>
                <TableCell>{l.id}</TableCell>
                <TableCell>{l.action}</TableCell>
                <TableCell>{l.entity}</TableCell>
                <TableCell>{l.entityId ?? '-'}</TableCell>
                <TableCell>{l.user?.name ?? l.userId ?? '-'}</TableCell>
                <TableCell>{l.createdAt ? new Date(l.createdAt).toLocaleString() : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

