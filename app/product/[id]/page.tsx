import Link from "next/link"
import { ArrowLeft, Check, Heart, Share2, ShieldCheck, Star, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProductPage() {
  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <Link href="/marketplace" className="flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Marketplace
        </Link>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="overflow-hidden rounded-lg border bg-white">
              <img src="/placeholder.svg?height=600&width=600" alt="Product" className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((img) => (
                <div key={img} className="cursor-pointer overflow-hidden rounded-md border bg-white">
                  <img
                    src={`/placeholder.svg?height=150&width=150`}
                    alt={`Product thumbnail ${img}`}
                    className="h-full w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6 flex items-center gap-2">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Verified</Badge>
              <Badge variant="outline">Gaming Account</Badge>
            </div>
            <h1 className="mb-2 text-3xl font-bold">Premium Gaming Account - Max Level</h1>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex items-center">
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="mr-1 h-5 w-5 fill-yellow-400 text-yellow-400" />
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="ml-2 text-sm font-medium">5.0 (48 reviews)</span>
              </div>
              <span className="text-sm text-muted-foreground">120 sold</span>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-bold text-violet-600">$199.99</span>
              <span className="ml-2 text-sm text-muted-foreground line-through">$249.99</span>
              <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600">20% OFF</span>
            </div>

            <Separator className="my-6" />

            <div className="mb-6 space-y-4">
              <h3 className="font-semibold">Description</h3>
              <p className="text-muted-foreground">
                This is a premium gaming account with all characters at max level. The account includes rare skins,
                weapons, and achievements that are no longer available to new players. Perfect for serious gamers who
                want to skip the grinding phase.
              </p>
              <ul className="grid gap-2">
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>All characters unlocked and at max level</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>Rare limited-edition skins and items</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>All achievements completed</span>
                </li>
                <li className="flex items-start">
                  <Check className="mr-2 h-5 w-5 text-emerald-500" />
                  <span>Account in good standing with no bans or warnings</span>
                </li>
              </ul>
            </div>

            <div className="mb-6 flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Seller" />
                  <AvatarFallback>SC</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">SellerName</p>
                  <p className="text-xs text-muted-foreground">Verified Seller</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="ml-auto">
                <User className="mr-2 h-4 w-4" />
                View Profile
              </Button>
            </div>

            <div className="flex gap-4">
              <Button className="flex-1 bg-violet-600 hover:bg-violet-700">
                ex-1 bg-violet-600 hover:bg-violet-700"> Buy Now
              </Button>
              <Button variant="outline" className="flex-1">
                Make Offer
              </Button>
              <Button variant="outline" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            <div className="mt-6 rounded-lg border bg-muted/50 p-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-emerald-500" />
                <p className="text-sm font-medium">Secure Transaction</p>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                This transaction is protected by our escrow system. Payment is only released to the seller after you
                confirm receipt.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12">
          <Tabs defaultValue="details">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="reviews">Reviews (48)</TabsTrigger>
              <TabsTrigger value="seller">Seller Info</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Product Details</h3>
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <h4 className="mb-2 font-medium">Account Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Game</span>
                          <span>Epic Adventure RPG</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Account Level</span>
                          <span>100 (Max)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Characters</span>
                          <span>All Unlocked (25)</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Rare Items</span>
                          <span>45+</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Account Age</span>
                          <span>3 years</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="mb-2 font-medium">Transfer Information</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Transfer Method</span>
                          <span>Full Account Access</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Time</span>
                          <span>Within 24 hours</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Support After Sale</span>
                          <span>30 days</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-muted-foreground">Returns</span>
                          <span>Not Accepted</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <h3 className="mb-4 text-lg font-semibold">Customer Reviews</h3>
                  <div className="mb-6 flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">5.0</div>
                      <div className="flex items-center justify-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="mt-1 text-sm text-muted-foreground">48 reviews</div>
                    </div>
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="mb-1 flex items-center gap-2">
                          <div className="text-sm">{rating} stars</div>
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full bg-yellow-400"
                              style={{ width: rating === 5 ? "100%" : rating === 4 ? "0%" : "0%" }}
                            ></div>
                          </div>
                          <div className="text-sm">{rating === 5 ? "48" : "0"}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-6" />
                  <div className="space-y-6">
                    {[1, 2, 3].map((review) => (
                      <div key={review}>
                        <div className="mb-2 flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt="Reviewer" />
                            <AvatarFallback>U{review}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">User{review}</p>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span className="ml-2 text-xs text-muted-foreground">1 month ago</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Excellent account! Everything was as described and the transfer process was smooth. The seller
                          was very helpful and responsive. Highly recommended!
                        </p>
                        {review !== 3 && <Separator className="my-4" />}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" className="mt-4 w-full">
                    View All Reviews
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Similar Products */}
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">Similar Products</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <Link href="#" key={item}>
                <Card className="overflow-hidden border-none transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                  <div className="relative aspect-square overflow-hidden bg-muted">
                    <img
                      src={`/placeholder.svg?height=300&width=300`}
                      alt="Product"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="mb-1 font-semibold">Gaming Account - Level 80</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-violet-600">${120 + item * 10}.00</span>
                      <div className="flex items-center text-sm text-yellow-500">
                        4.8 <span className="ml-1">★</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

