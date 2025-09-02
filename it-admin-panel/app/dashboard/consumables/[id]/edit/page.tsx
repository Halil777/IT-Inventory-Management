import { ConsumableForm } from "@/components/consumables/consumable-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function EditConsumablePage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/consumables/${params.id}`}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Consumable
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Consumable</h1>
          <p className="text-muted-foreground">Update consumable information</p>
        </div>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Consumable Information</CardTitle>
          <CardDescription>Update the consumable details</CardDescription>
        </CardHeader>
        <CardContent>
          <ConsumableForm consumableId={params.id} />
        </CardContent>
      </Card>
    </div>
  )
}

