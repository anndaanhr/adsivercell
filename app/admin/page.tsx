import { Suspense } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InitializeDbButton } from "@/components/initialize-db-button"

export default function AdminPage() {
  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Admin Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Database Management</CardTitle>
            <CardDescription>Initialize or reset the database</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <InitializeDbButton />
            </Suspense>
          </CardContent>
        </Card>

        {/* Add more admin cards here */}
      </div>
    </div>
  )
}

