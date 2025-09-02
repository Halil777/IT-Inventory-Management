"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getCartridge } from "@/lib/api"

export function CartridgeDetails({ id }: { id: string }) {
  const [item, setItem] = useState<any | null>(null)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    getCartridge(id)
      .then(setItem)
      .catch((e) => {
        console.error(e)
        setError("Failed to load cartridge")
      })
  }, [id])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cartridge #{item?.id ?? '-'}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <div className="text-sm text-destructive">{error}</div>}
        <div className="flex items-center justify-between">
          <div className="text-sm">Type</div>
          <div className="text-sm font-medium">{item?.type ?? '-'}</div>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div className="text-sm">Status</div>
          <Badge variant="outline">{item?.status ?? '-'}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

