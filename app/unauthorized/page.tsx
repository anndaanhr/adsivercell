import Link from "next/link"
import { Shield, ArrowLeft, Store, ShieldAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
  return (
    <div className="container flex h-screen max-w-lg items-center justify-center">
      <Card className="w-full">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="rounded-full bg-red-100 p-3 dark:bg-red-900">
              <ShieldAlert className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Access Denied</CardTitle>
          <CardDescription className="text-center">
            You don't have permission to access this page. This area requires special privileges.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-3 rounded-md border p-4">
            <div className="flex items-start space-x-3">
              <Shield className="mt-0.5 h-5 w-5 text-blue-500" />
              <div>
                <h3 className="font-medium">Admin Access</h3>
                <p className="text-sm text-muted-foreground">
                  The admin area is restricted to platform administrators only. Admin accounts are created by the platform owner.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3 rounded-md border p-4">
            <div className="flex items-start space-x-3">
              <Store className="mt-0.5 h-5 w-5 text-green-500" />
              <div>
                <h3 className="font-medium">Seller Access</h3>
                <p className="text-sm text-muted-foreground">
                  The seller area is for approved sellers on the platform. You need a seller account to access these features.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Button asChild className="w-full">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Link>
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            If you believe you should have access to this area, please contact the site administrator.
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
