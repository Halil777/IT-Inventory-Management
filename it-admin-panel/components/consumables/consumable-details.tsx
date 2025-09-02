"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getConsumable } from "@/lib/api"

export function ConsumableDetails({ id }: { id: string }) {
  const [item, setItem] = useState<any | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getConsumable(id)
      .then(setItem)
      .catch((e) => {
        console.error(e)
        setError("Failed to load consumable")
      })
  }, [id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Consumable #{item?.id ?? '-'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex items-center justify-between">
          <div className="text-sm">Type</div>
          <div className="text-sm font-medium">{item?.type ?? '-'}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="text-sm">Quantity</div>
          <div className="text-sm font-medium">{item?.quantity ?? '-'}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">Status</div>
          <Badge variant="outline">{item?.status ?? '-'}</Badge>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">Department</div>
          <div className="text-sm font-medium">{item?.department?.name ?? '-'}</div>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-sm">User</div>
          <div className="text-sm font-medium">{item?.user ? item.user.name : '-'}</div>
        </div>
      </CardContent>
    </Card>
  )
}

