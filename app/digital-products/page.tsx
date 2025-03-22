import { Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { Wallet, Gamepad2, CreditCard, Gift, ArrowRight, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DigitalProductCard } from "@/components/digital-product-card"
import {
  digitalProductCategories,
  getFeaturedDigitalProducts,
  getPopularDigitalProducts,
} from "@/lib/digital-products-data"

export default function DigitalProductsPage() {
  // Get featured and popular products
  const featuredProducts = getFeaturedDigitalProducts(4)
  const popularProducts = getPopularDigitalProducts(8)

  return (
    <div className="container px-4 py-8">
      {/* Hero Section */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">Digital Products</h1>
            <p className="mt-2 max-w-xl">
              From wallet top-ups to game currencies and premium subscriptions - get instant digital delivery for all
              your gaming needs.
            </p>
          </div>
          <div className="flex w-full max-w-md items-center gap-2 rounded-md bg-white/20 p-2 backdrop-blur-sm">
            <Input
              type="search"
              placeholder="Search digital products..."
              className="border-0 bg-transparent text-white placeholder:text-white/70 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20 hover:text-white">
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Categories</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {digitalProductCategories.map((category) => (
            <Link key={category.id} href={`/digital-products/category/${category.slug}`}>
              <Card className="overflow-hidden transition-all hover:shadow-md">
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <Image
                    src={category.image || `/placeholder.svg?height=225&width=400&text=${category.name}`}
                    alt={category.name}
                    width={400}
                    height={225}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="pb-2 pt-4">
                  <CardTitle className="flex items-center text-xl">
                    {category.id === "wallet-topups" && <Wallet className="mr-2 h-5 w-5 text-blue-500" />}
                    {category.id === "game-currencies" && <Gamepad2 className="mr-2 h-5 w-5 text-green-500" />}
                    {category.id === "subscriptions" && <CreditCard className="mr-2 h-5 w-5 text-purple-500" />}
                    {category.id === "gift-cards" && <Gift className="mr-2 h-5 w-5 text-red-500" />}
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2">
                  <CardDescription>{category.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" className="w-full justify-between px-2 text-sm">
                    Browse Products
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredProducts.map((product) => (
            <DigitalProductCard key={product.id} product={product} featured />
          ))}
        </div>
      </div>

      {/* All Products */}
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Popular Products</h2>
          <Button variant="outline" asChild>
            <Link href="/digital-products/all">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="wallet">Wallet Top-ups</TabsTrigger>
            <TabsTrigger value="currency">Game Currencies</TabsTrigger>
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Suspense fallback={<div>Loading products...</div>}>
                {popularProducts.map((product) => (
                  <DigitalProductCard key={product.id} product={product} />
                ))}
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="wallet" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Suspense fallback={<div>Loading products...</div>}>
                {popularProducts
                  .filter((product) => product.type === "wallet_topup")
                  .map((product) => (
                    <DigitalProductCard key={product.id} product={product} />
                  ))}
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="currency" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Suspense fallback={<div>Loading products...</div>}>
                {popularProducts
                  .filter((product) => product.type === "game_currency")
                  .map((product) => (
                    <DigitalProductCard key={product.id} product={product} />
                  ))}
              </Suspense>
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="mt-6">
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Suspense fallback={<div>Loading products...</div>}>
                {popularProducts
                  .filter((product) => product.type === "subscription")
                  .map((product) => (
                    <DigitalProductCard key={product.id} product={product} />
                  ))}
              </Suspense>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

