import Link from "next/link"
import { DollarSign, Package, ShoppingCart, TrendingUp, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireSeller } from "@/lib/auth-roles"

export default async function SellerDashboardPage() {
  // Check if the user has seller access
  await requireSeller()

  return (
    <div className="flex flex-col space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/seller/games/new">
              Add New Game
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="products">My Products</TabsTrigger>
          <TabsTrigger value="stats">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$12,546.89</div>
                <p className="text-xs text-muted-foreground">+15.2% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Product Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+573</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Products</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 since last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.3%</div>
                <p className="text-xs text-muted-foreground">+0.5% from last month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8">
            <Card className="col-span-5">
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>View your sales performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px] w-full rounded-md bg-muted/50 flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Sales chart will be displayed here</span>
                </div>
              </CardContent>
            </Card>

            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { id: 1, name: "Cyberpunk 2077", sales: 148, revenue: 6656 },
                    { id: 2, name: "Elden Ring", sales: 89, revenue: 5340 },
                    { id: 3, name: "Steam Wallet Card", sales: 34, revenue: 1020 },
                  ].map((product) => (
                    <div key={product.id} className="flex items-center justify-between space-y-0 rounded-md border p-3">
                      <div>
                        <p className="text-sm font-medium leading-none">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.sales} units sold</p>
                      </div>
                      <div className="text-sm font-medium">${product.revenue}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>My Products</CardTitle>
                  <CardDescription>
                    Manage your games and digital products
                  </CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href="/seller/games">
                    View All Products
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-sm font-medium">Games</h3>
                  <p className="text-sm text-muted-foreground">
                    List and manage game keys for various platforms.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/seller/games">
                        Manage Games
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/seller/games/new">
                        Add New Game
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="rounded-md border p-4">
                  <h3 className="mb-2 text-sm font-medium">Digital Products</h3>
                  <p className="text-sm text-muted-foreground">
                    Manage digital products like gift cards, wallet top-ups, and more.
                  </p>
                  <div className="mt-3 flex gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href="/seller/digital-products">
                        Manage Products
                      </Link>
                    </Button>
                    <Button asChild size="sm">
                      <Link href="/seller/digital-products/new">
                        Add New Product
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Analytics</CardTitle>
              <CardDescription>
                Detailed statistics and insights about your sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full rounded-md bg-muted/50 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">
                  Advanced analytics will be displayed here
                </span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
