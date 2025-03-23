import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Check, Info, ShoppingCart, Heart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AnimatedButton } from "@/components/animated-button"
import { DigitalProductCard } from "@/components/digital-product-card"
import { getDigitalProductById, getDigitalProductsByType } from "@/lib/digital-products-data"

interface DigitalProductPageProps {
  params: {
    id: string
  }
}

export default function DigitalProductPage({ params }: DigitalProductPageProps) {
  const product = getDigitalProductById(params.id)

  if (!product) {
    notFound()
  }

  // Get similar products
  const similarProducts = getDigitalProductsByType(product.type)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  // Calculate discounted price
  const discountedPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

  return (
    <div className="container px-4 py-8">
      <Link href="/digital-products">
        <Button variant="ghost" className="mb-4 flex items-center gap-2 pl-0 text-muted-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Digital Products
        </Button>
      </Link>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr]">
        <div>
          {/* Product Header */}
          <div className="mb-6">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="outline">{product.platform}</Badge>
              <Badge variant="outline">{product.type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</Badge>
            </div>
            <h1 className="mb-2 text-3xl font-bold tracking-tight">{product.title}</h1>
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          {/* Product Image */}
          <div className="relative mb-6 aspect-video overflow-hidden rounded-lg">
            <Image
              src={product.image || "/placeholder.svg?height=500&width=900"}
              alt={product.title}
              fill
              className="object-cover"
              priority
            />
            {product.discount > 0 && (
              <Badge className="absolute left-4 top-4 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800">
                {product.discount}% OFF
              </Badge>
            )}
          </div>

          {/* Product Tabs */}
          <Tabs defaultValue="details" className="mb-8">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="instructions">Instructions</TabsTrigger>
              <TabsTrigger value="requirements">Requirements</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="pt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Product Details</h2>
                <p className="text-muted-foreground">{product.description}</p>

                {product.options && product.options.length > 0 && (
                  <div className="mt-4">
                    <h3 className="mb-2 font-semibold">Available Options</h3>
                    <div className="space-y-2">
                      {product.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between rounded-md border p-3">
                          <span>{option.name}</span>
                          <div className="flex items-center gap-2">
                            {option.discount && option.discount > 0 ? (
                              <>
                                <span className="text-sm text-muted-foreground line-through">
                                  ${option.price.toFixed(2)}
                                </span>
                                <span className="font-bold">
                                  ${(option.price * (1 - option.discount / 100)).toFixed(2)}
                                </span>
                                <Badge
                                  variant="outline"
                                  className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-800"
                                >
                                  {option.discount}% OFF
                                </Badge>
                              </>
                            ) : (
                              <span className="font-bold">${option.price.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="instructions" className="pt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Redemption Instructions</h2>
                <p className="text-muted-foreground">
                  {product.instructions || "No specific instructions provided for this product."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="requirements" className="pt-4">
              <div className="space-y-4">
                <h2 className="text-xl font-bold">Requirements</h2>
                {product.requirements && product.requirements.length > 0 ? (
                  <ul className="list-inside list-disc space-y-2 text-muted-foreground">
                    {product.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No specific requirements for this product.</p>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Similar Products */}
          {similarProducts.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                {similarProducts.map((product) => (
                  <DigitalProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Card */}
          <Card>
            <CardHeader>
              <CardTitle>Purchase Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {product.options && product.options.length > 0 ? (
                <RadioGroup defaultValue={product.options[0].id}>
                  {product.options.map((option) => {
                    const optionDiscountedPrice = option.discount
                      ? option.price * (1 - option.discount / 100)
                      : option.price

                    return (
                      <div key={option.id} className="flex items-center space-x-2">
                        <RadioGroupItem value={option.id} id={option.id} />
                        <Label
                          htmlFor={option.id}
                          className="flex w-full cursor-pointer justify-between rounded-md p-2 hover:bg-muted"
                        >
                          <span>{option.name}</span>
                          <div className="flex items-center gap-2">
                            {option.discount && option.discount > 0 && (
                              <span className="text-sm text-muted-foreground line-through">
                                ${option.price.toFixed(2)}
                              </span>
                            )}
                            <span className="font-bold">${optionDiscountedPrice.toFixed(2)}</span>
                          </div>
                        </Label>
                      </div>
                    )
                  })}
                </RadioGroup>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="font-medium">Price</span>
                  <div className="flex items-center gap-2">
                    {product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
                    )}
                    <span className="text-xl font-bold">${discountedPrice.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <div className="rounded-md bg-muted p-3">
                <div className="flex items-start gap-2 text-sm">
                  <Info className="mt-0.5 h-4 w-4 text-blue-500" />
                  <p className="text-muted-foreground">
                    Digital products are delivered instantly to your email after purchase.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <AnimatedButton className="w-full">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </AnimatedButton>

                <Button variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Add to Wishlist
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Instant Digital Delivery</p>
                    <p className="text-xs text-muted-foreground">Delivered to your email immediately</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Secure Transaction</p>
                    <p className="text-xs text-muted-foreground">Your payment information is secure</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">24/7 Customer Support</p>
                    <p className="text-xs text-muted-foreground">Help when you need it</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

