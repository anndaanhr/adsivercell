"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { ArrowLeft, Upload, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { put } from "@vercel/blob"

export default function EditGamePage({ params }) {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()
  const { id } = params

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    discount: "0",
    release_date: "",
    developer: "",
    publisher: "",
    genres: [],
    platforms: [],
    cover_image_url: "",
    screenshot_urls: [],
  })

  const [coverImage, setCoverImage] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  // Available options
  const genreOptions = [
    "Action",
    "Adventure",
    "RPG",
    "Strategy",
    "Simulation",
    "Sports",
    "Racing",
    "Puzzle",
    "Shooter",
    "Platformer",
  ]

  const platformOptions = [
    "PC",
    "PlayStation 5",
    "PlayStation 4",
    "Xbox Series X/S",
    "Xbox One",
    "Nintendo Switch",
    "Mac",
    "Linux",
  ]

  useEffect(() => {
    async function fetchGame() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Fetch game details
        const { data, error } = await supabase.from("games").select("*").eq("id", id).single()

        if (error) {
          throw error
        }

        // Check if user is the seller of this game
        if (data.seller_id !== user.id) {
          toast({
            title: "Unauthorized",
            description: "You do not have permission to edit this game.",
            variant: "destructive",
          })
          router.push("/seller/games")
          return
        }

        // Format date for input field
        let formattedDate = ""
        if (data.release_date) {
          const date = new Date(data.release_date)
          formattedDate = date.toISOString().split("T")[0]
        }

        // Set form data
        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price?.toString() || "",
          discount: data.discount?.toString() || "0",
          release_date: formattedDate,
          developer: data.developer || "",
          publisher: data.publisher || "",
          genres: data.genres || [],
          platforms: data.platforms || [],
          cover_image_url: data.cover_image_url || "",
          screenshot_urls: data.screenshot_urls || [],
        })
      } catch (error) {
        console.error("Error fetching game:", error)
        toast({
          title: "Error",
          description: "Failed to load game details. Please try again.",
          variant: "destructive",
        })
        router.push("/seller/games")
      } finally {
        setInitialLoading(false)
      }
    }

    fetchGame()
  }, [id, router, supabase, toast])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleGenreChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      genres: value.split(","),
    }))
  }

  const handlePlatformChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      platforms: value.split(","),
    }))
  }

  const handleCoverImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0])
    }
  }

  const handleScreenshotsChange = (e) => {
    if (e.target.files) {
      setScreenshots(Array.from(e.target.files))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      // Validate form
      if (!formData.title || !formData.description || !formData.price) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Prepare update data
      const updateData = {
        title: formData.title,
        description: formData.description,
        price: Number.parseFloat(formData.price),
        discount: Number.parseInt(formData.discount) || 0,
        release_date: formData.release_date,
        developer: formData.developer,
        publisher: formData.publisher,
        genres: formData.genres,
        platforms: formData.platforms,
      }

      // Upload new cover image if selected
      if (coverImage) {
        const filename = `${user.id}/${Date.now()}-${coverImage.name}`
        const blob = new Blob([coverImage], { type: coverImage.type })
        const { url } = await put(filename, blob, { access: "public" })
        updateData.cover_image_url = url
      }

      // Upload new screenshots if selected
      if (screenshots.length > 0) {
        const screenshotUrls = []
        for (const screenshot of screenshots) {
          const filename = `${user.id}/${Date.now()}-${screenshot.name}`
          const blob = new Blob([screenshot], { type: screenshot.type })
          const { url } = await put(filename, blob, { access: "public" })
          screenshotUrls.push(url)
        }
        updateData.screenshot_urls = [...formData.screenshot_urls, ...screenshotUrls]
      }

      // Update game in Supabase
      const { data, error } = await supabase.from("games").update(updateData).eq("id", id).select()

      if (error) {
        throw error
      }

      toast({
        title: "Game Updated",
        description: "Your game has been successfully updated.",
      })

      router.push("/seller/games")
    } catch (error) {
      console.error("Error updating game:", error)
      toast({
        title: "Error",
        description: "Failed to update your game. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="container max-w-4xl mx-auto py-12 flex justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-12">
      <Button
        variant="ghost"
        className="mb-6 flex items-center gap-2 pl-0 text-muted-foreground"
        onClick={() => router.back()}
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Games
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Edit Game</CardTitle>
          <CardDescription>Update the details of your game</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Game Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter game title"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="release_date">Release Date</Label>
                  <Input
                    id="release_date"
                    name="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter game description"
                  rows={5}
                  required
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="developer">Developer</Label>
                  <Input
                    id="developer"
                    name="developer"
                    value={formData.developer}
                    onChange={handleChange}
                    placeholder="Enter developer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleChange}
                    placeholder="Enter publisher name"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Price ($) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="29.99"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    name="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="genres">Genres</Label>
                  <Select onValueChange={handleGenreChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select genres" />
                    </SelectTrigger>
                    <SelectContent>
                      {genreOptions.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.genres.map((genre) => (
                        <div key={genre} className="bg-muted text-xs px-2 py-1 rounded">
                          {genre}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="platforms">Platforms</Label>
                  <Select onValueChange={handlePlatformChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select platforms" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formData.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {formData.platforms.map((platform) => (
                        <div key={platform} className="bg-muted text-xs px-2 py-1 rounded">
                          {platform}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cover_image">Cover Image</Label>
                {formData.cover_image_url && (
                  <div className="mb-2">
                    <img
                      src={formData.cover_image_url || "/placeholder.svg"}
                      alt="Current cover"
                      className="h-40 w-auto object-cover rounded-md"
                    />
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("cover_image").click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {coverImage ? "Change Cover Image" : "Upload New Cover Image"}
                  </Button>
                  <Input
                    id="cover_image"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverImageChange}
                    className="hidden"
                  />
                  {coverImage && <span className="text-sm text-muted-foreground">{coverImage.name}</span>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="screenshots">Screenshots</Label>
                {formData.screenshot_urls && formData.screenshot_urls.length > 0 && (
                  <div className="mb-2 flex gap-2 overflow-x-auto pb-2">
                    {formData.screenshot_urls.map((url, index) => (
                      <img
                        key={index}
                        src={url || "/placeholder.svg"}
                        alt={`Screenshot ${index + 1}`}
                        className="h-24 w-auto object-cover rounded-md"
                      />
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("screenshots").click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {screenshots.length > 0
                      ? `${screenshots.length} New Screenshot(s) Selected`
                      : "Upload Additional Screenshots"}
                  </Button>
                  <Input
                    id="screenshots"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleScreenshotsChange}
                    className="hidden"
                  />
                </div>
                {screenshots.length > 0 && (
                  <div className="text-sm text-muted-foreground mt-2">{screenshots.length} new file(s) selected</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/seller/games")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Updating Game..." : "Update Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

