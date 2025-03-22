import Link from "next/link"
import { Search, SortDesc, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function Marketplace() {
  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-700 py-12">
        <div className="container mx-auto px-4">
          <h1 className="mb-6 text-3xl font-bold text-white md:text-4xl">Marketplace</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search for accounts, products, or services..."
              className="h-12 bg-white pl-10 text-base shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          {/* Filters Sidebar */}
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                Reset All
              </Button>
            </div>

            <div className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="mb-3 font-medium">Category</h3>
                <div className="space-y-2">
                  {["Gaming", "Social Media", "Streaming", "Digital Products", "Services"].map((category) => (
                    <div key={category} className="flex items-center">
                      <input
                        type="checkbox"
                        id={category}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600"
                      />
                      <label htmlFor={category} className="ml-2 text-sm">
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="mb-3 font-medium">Price Range</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Input placeholder="Min" type="number" className="h-9" />
                  <Input placeholder="Max" type="number" className="h-9" />
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="mb-3 font-medium">Seller Rating</h3>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`rating-${rating}`}
                        className="h-4 w-4 rounded border-gray-300 text-violet-600"
                      />
                      <label htmlFor={`rating-${rating}`} className="ml-2 flex items-center text-sm">
                        {rating}+ <span className="ml-1 text-yellow-500">★</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Status */}
              <div>
                <h3 className="mb-3 font-medium">Verification</h3>
                <div className="space-y-2">
                  {["Verified Sellers", "Verified Products"].map((item) => (
                    <div key={item} className="flex items-center">
                      <input type="checkbox" id={item} className="h-4 w-4 rounded border-gray-300 text-violet-600" />
                      <label htmlFor={item} className="ml-2 text-sm">
                        {item}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <Button className="w-full bg-violet-600 hover:bg-violet-700">Apply Filters</Button>
            </div>
          </div>

          {/* Products Grid */}
          <div>
            {/* Sorting and View Options */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <Tabs defaultValue="all" className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="accounts">Accounts</TabsTrigger>
                  <TabsTrigger value="products">Products</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2">
                <Select defaultValue="newest">
                  <SelectTrigger className="h-9 w-[180px]">
                    <SortDesc className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Products */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 9 }).map((_, index) => (
                <Link href="#" key={index}>
                  <Card className="overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      <img
                        src={`/placeholder.svg?height=300&width=300`}
                        alt="Product"
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                      {index % 3 === 0 && (
                        <Badge className="absolute left-2 top-2 bg-emerald-500 hover:bg-emerald-600">Featured</Badge>
                      )}
                      {index % 4 === 0 && (
                        <Badge className="absolute left-2 top-2 bg-amber-500 hover:bg-amber-600">Hot Deal</Badge>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="outline" className="rounded-sm px-2 py-0 text-xs font-normal">
                          {index % 3 === 0 ? "Gaming" : index % 3 === 1 ? "Social Media" : "Digital Product"}
                        </Badge>
                        <div className="flex items-center text-sm text-yellow-500">
                          {4 + (index % 2)} <span className="ml-1">★</span>
                        </div>
                      </div>
                      <h3 className="mb-1 font-semibold">
                        {index % 3 === 0
                          ? "Premium Gaming Account"
                          : index % 3 === 1
                            ? "Social Media Profile"
                            : "Digital Asset Bundle"}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-violet-600">${50 + index * 10}.00</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Tag className="mr-1 h-3 w-3" />
                          {10 + index} sold
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-1">
              <Button variant="outline" size="icon" className="h-8 w-8">
                1
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                2
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 bg-violet-50">
                3
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                4
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                5
              </Button>
              <span className="mx-1">...</span>
              <Button variant="outline" size="icon" className="h-8 w-8">
                10
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

