"use client"

import { useState } from "react"
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

export default function NewGamePage() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const { toast } = useToast()

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
  })

  const [coverImage, setCoverImage] = useState(null)
  const [screenshots, setScreenshots] = useState([])
  const [loading, setLoading] = useState(false)

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
      if (!formData.title || !formData.description || !formData.price || !coverImage) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields and upload a cover image.",
          variant: "destructive",
        })
        return
      }

      // Upload cover image to Vercel Blob
      let coverImageUrl = ""
      if (coverImage) {
        const filename = `${user.id}/${Date.now()}-${coverImage.name}`
        const blob = new Blob([coverImage], { type: coverImage.type })
        const { url } = await put(filename, blob, { access: "public" })
        coverImageUrl = url
      }

      // Upload screenshots to Vercel Blob
      const screenshotUrls = []
      for (const screenshot of screenshots) {
        const filename = `${user.id}/${Date.now()}-${screenshot.name}`
        const blob = new Blob([screenshot], { type: screenshot.type })
        const { url } = await put(filename, blob, { access: "public" })
        screenshotUrls.push(url)
      }

      // Insert game into Supabase
      const { data, error } = await supabase
        .from("games")
        .insert({
          title: formData.title,
          description: formData.description,
          price: Number.parseFloat(formData.price),
          discount: Number.parseInt(formData.discount) || 0,
          release_date: formData.release_date,
          developer: formData.developer,
          publisher: formData.publisher,
          cover_image_url: coverImageUrl,
          screenshot_urls: screenshotUrls,
          genres: formData.genres,
          platforms: formData.platforms,
          seller_id: user.id,
        })
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Game Added",
        description: "Your game has been successfully added to the catalog.",
      })

      router.push("/seller/games")
    } catch (error) {
      console.error("Error adding game:", error)
      toast({
        title: "Error",
        description: "Failed to add your game. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
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
          <CardTitle>Add New Game</CardTitle>
          <CardDescription>Fill in the details below to add a new game to your catalog</CardDescription>
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
                <Label htmlFor="cover_image">
                  Cover Image <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("cover_image").click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {coverImage ? "Change Cover Image" : "Upload Cover Image"}
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
                <Label htmlFor="screenshots">Screenshots (Optional)</Label>
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("screenshots").click()}
                    className="w-full"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {screenshots.length > 0 ? `${screenshots.length} Screenshot(s) Selected` : "Upload Screenshots"}
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
                  <div className="text-sm text-muted-foreground mt-2">{screenshots.length} file(s) selected</div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => router.push("/seller/games")} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Adding Game..." : "Add Game"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

