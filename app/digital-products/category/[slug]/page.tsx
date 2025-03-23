import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { DigitalProductCard } from "@/components/digital-product-card"
import { getCategoryById, getDigitalProductsByCategory } from "@/lib/digital-products-data"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryById(params.slug)

  if (!category) {
    notFound()
  }

  const products = getDigitalProductsByCategory(category.id)

  return (
    <div className="container px-4 py-8">
      <Link href="/digital-products">
        <Button variant="ghost" className="mb-4 flex items-center gap-2 pl-0 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Digital Products
        </Button>
      </Link>

      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight">{category.name}</h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">{category.description}</p>
      </div>

      <Separator className="mb-8" />

      {products.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <DigitalProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <h2 className="mb-2 text-xl font-medium">No products found</h2>
          <p className="mb-6 text-muted-foreground">There are currently no products available in this category.</p>
          <Button asChild>
            <Link href="/digital-products">Browse All Products</Link>
          </Button>
        </div>
      )}
    </div>
  )
}

