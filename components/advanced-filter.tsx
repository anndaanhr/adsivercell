"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import {
  Filter,
  ChevronDown,
  ChevronUp,
  Star,
  Calendar,
  Tag,
  Monitor,
  DollarSign,
  Percent,
  X,
  Search,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"

import { genres, platforms, publishers } from "@/lib/game-database"

interface AdvancedFilterProps {
  onFilterChange: (filters: FilterState) => void
  initialFilters?: Partial<FilterState>
  totalGames: number
  className?: string
}

interface FilterState {
  search: string
  genres: string[]
  platforms: string[]
  publishers: string[]
  priceRange: [number, number]
  rating: number | null
  releaseYear: string | null
  onSale: boolean
  sortBy: string
}

const defaultFilterState: FilterState = {
  search: "",
  genres: [],
  platforms: [],
  publishers: [],
  priceRange: [0, 100],
  rating: null,
  releaseYear: null,
  onSale: false,
  sortBy: "relevance",
}

// Create a client component that uses searchParams
function FilterContent({ onFilterChange, totalGames, initialFilters }: AdvancedFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const isMounted = useRef(false)
  const initialRenderRef = useRef(true)
  const pendingUpdateRef = useRef(false)
  const lastUrlUpdateRef = useRef("")

  // Initialize filters from props (which come from URL)
  const [filters, setFilters] = useState<FilterState>(() => {
    return { ...defaultFilterState, ...initialFilters }
  })

  const [expanded, setExpanded] = useState({
    genres: true,
    platforms: true,
    publishers: false,
    price: true,
    rating: false,
    release: false,
    other: false,
  })

  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Set mounted flag after initial render
  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Handle URL updates when filters change
  useEffect(() => {
    // Skip the first render to avoid double updates
    if (initialRenderRef.current) {
      initialRenderRef.current = false
      return
    }

    // Prevent multiple updates in quick succession
    if (pendingUpdateRef.current) {
      return
    }

    pendingUpdateRef.current = true

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      if (!isMounted.current) return

      // Notify parent component
      onFilterChange(filters)

      // Update URL with filters
      const params = new URLSearchParams()

      if (filters.search) params.set("q", filters.search)

      filters.genres.forEach((genre) => params.append("genre", genre))
      filters.platforms.forEach((platform) => params.append("platform", platform))
      filters.publishers.forEach((publisher) => params.append("publisher", publisher))

      if (filters.priceRange[0] > 0) params.set("min", filters.priceRange[0].toString())
      if (filters.priceRange[1] < 100) params.set("max", filters.priceRange[1].toString())

      if (filters.rating) params.set("rating", filters.rating.toString())
      if (filters.releaseYear) params.set("year", filters.releaseYear)
      if (filters.onSale) params.set("sale", "true")
      if (filters.sortBy !== "relevance") params.set("sort", filters.sortBy)

      const url = `${pathname}?${params.toString()}`

      // Only update if the URL has actually changed
      if (url !== lastUrlUpdateRef.current) {
        lastUrlUpdateRef.current = url
        router.push(url, { scroll: false })
      }

      pendingUpdateRef.current = false
    }, 500)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [filters, onFilterChange, router, pathname])

  const handleGenreChange = (genreId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      genres: checked ? [...prev.genres, genreId] : prev.genres.filter((id) => id !== genreId),
    }))
  }

  const handlePlatformChange = (platformId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      platforms: checked ? [...prev.platforms, platformId] : prev.platforms.filter((id) => id !== platformId),
    }))
  }

  const handlePublisherChange = (publisherId: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      publishers: checked ? [...prev.publishers, publisherId] : prev.publishers.filter((id) => id !== publisherId),
    }))
  }

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [value[0], value[1]],
    }))
  }

  const handleRatingChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      rating: value === "any" ? null : Number(value),
    }))
  }

  const handleReleaseYearChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      releaseYear: value === "any" ? null : value,
    }))
  }

  const handleSortChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      sortBy: value,
    }))
  }

  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      search: value,
    }))
  }

  const handleOnSaleChange = (checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      onSale: checked,
    }))
  }

  const resetFilters = () => {
    setFilters(defaultFilterState)
    router.push(pathname)
  }

  const hasActiveFilters = () => {
    return (
      filters.genres.length > 0 ||
      filters.platforms.length > 0 ||
      filters.publishers.length > 0 ||
      filters.priceRange[0] > 0 ||
      filters.priceRange[1] < 100 ||
      filters.rating !== null ||
      filters.releaseYear !== null ||
      filters.onSale ||
      filters.sortBy !== "relevance"
    )
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.genres.length > 0) count++
    if (filters.platforms.length > 0) count++
    if (filters.publishers.length > 0) count++
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 100) count++
    if (filters.rating !== null) count++
    if (filters.releaseYear !== null) count++
    if (filters.onSale) count++
    return count
  }

  // Current year for release year filter
  const currentYear = new Date().getFullYear()
  const releaseYears = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString())

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="sticky top-16 z-30 flex items-center justify-between bg-background p-4 md:hidden">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => setShowMobileFilters(!showMobileFilters)}
        >
          <Filter className="h-4 w-4" />
          Filters
          {getActiveFilterCount() > 0 && (
            <Badge variant="secondary" className="ml-1">
              {getActiveFilterCount()}
            </Badge>
          )}
        </Button>

        <div className="flex items-center gap-2">
          <Label htmlFor="mobile-sort" className="sr-only">
            Sort by
          </Label>
          <select
            id="mobile-sort"
            className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
            value={filters.sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="relevance">Relevance</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="rating-desc">Highest Rated</option>
            <option value="release-desc">Newest</option>
            <option value="discount-desc">Biggest Discount</option>
          </select>
        </div>
      </div>

      {/* Mobile Filters */}
      <div
        className={`fixed inset-0 z-50 flex flex-col bg-background transition-transform duration-300 md:hidden ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={() => setShowMobileFilters(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <Accordion type="multiple" defaultValue={["search", "genres", "platforms", "price"]}>
            <AccordionItem value="search">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  <span>Search</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <Input
                    placeholder="Search games..."
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="genres">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4" />
                  <span>Genres</span>
                  {filters.genres.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.genres.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {genres.map((genre) => (
                    <div key={genre.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-genre-${genre.id}`}
                        checked={filters.genres.includes(genre.id)}
                        onCheckedChange={(checked) => handleGenreChange(genre.id, checked === true)}
                      />
                      <label
                        htmlFor={`mobile-genre-${genre.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {genre.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="platforms">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span>Platforms</span>
                  {filters.platforms.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.platforms.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {platforms.map((platform) => (
                    <div key={platform.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-platform-${platform.id}`}
                        checked={filters.platforms.includes(platform.id)}
                        onCheckedChange={(checked) => handlePlatformChange(platform.id, checked === true)}
                      />
                      <label
                        htmlFor={`mobile-platform-${platform.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {platform.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="publishers">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Publishers</span>
                  {filters.publishers.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.publishers.length}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {publishers.map((publisher) => (
                    <div key={publisher.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mobile-publisher-${publisher.id}`}
                        checked={filters.publishers.includes(publisher.id)}
                        onCheckedChange={(checked) => handlePublisherChange(publisher.id, checked === true)}
                      />
                      <label
                        htmlFor={`mobile-publisher-${publisher.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {publisher.name}
                      </label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="price">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Price Range</span>
                  {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
                    <Badge variant="secondary" className="ml-1">
                      ${filters.priceRange[0]} - ${filters.priceRange[1]}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 px-1 pt-2">
                  <Slider
                    defaultValue={[0, 100]}
                    value={[filters.priceRange[0], filters.priceRange[1]]}
                    max={100}
                    step={1}
                    onValueChange={handlePriceChange}
                    className="py-4"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-sm">${filters.priceRange[0]}</span>
                    <span className="text-sm">${filters.priceRange[1]}</span>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="rating">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Rating</span>
                  {filters.rating && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.rating}+ Stars
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={filters.rating === null ? "any" : filters.rating.toString()}
                  onValueChange={handleRatingChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="mobile-rating-any" />
                    <Label htmlFor="mobile-rating-any">Any Rating</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="4" id="mobile-rating-4" />
                    <Label htmlFor="mobile-rating-4">4+ Stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="3" id="mobile-rating-3" />
                    <Label htmlFor="mobile-rating-3">3+ Stars</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2" id="mobile-rating-2" />
                    <Label htmlFor="mobile-rating-2">2+ Stars</Label>
                  </div>
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="release">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Release Year</span>
                  {filters.releaseYear && (
                    <Badge variant="secondary" className="ml-1">
                      {filters.releaseYear}
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={filters.releaseYear === null ? "any" : filters.releaseYear}
                  onValueChange={handleReleaseYearChange}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="mobile-year-any" />
                    <Label htmlFor="mobile-year-any">Any Year</Label>
                  </div>
                  {releaseYears.map((year) => (
                    <div key={year} className="flex items-center space-x-2">
                      <RadioGroupItem value={year} id={`mobile-year-${year}`} />
                      <Label htmlFor={`mobile-year-${year}`}>{year}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other">
              <AccordionTrigger className="py-3">
                <div className="flex items-center gap-2">
                  <Percent className="h-4 w-4" />
                  <span>Other Filters</span>
                  {filters.onSale && (
                    <Badge variant="secondary" className="ml-1">
                      1
                    </Badge>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="mobile-on-sale"
                      checked={filters.onSale}
                      onCheckedChange={(checked) => handleOnSaleChange(checked === true)}
                    />
                    <label
                      htmlFor="mobile-on-sale"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      On Sale
                    </label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={resetFilters} disabled={!hasActiveFilters()}>
              Reset Filters
            </Button>
            <Button onClick={() => setShowMobileFilters(false)}>Show {totalGames} Results</Button>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      <Card className={`hidden md:block`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filters</CardTitle>
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 px-2 text-xs">
                Reset All
              </Button>
            )}
          </div>
          <CardDescription>Refine your game search</CardDescription>

          <div className="pt-2">
            <Input
              placeholder="Search games..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-5 px-4 pb-6">
          <Collapsible
            open={expanded.genres}
            onOpenChange={() => setExpanded({ ...expanded, genres: !expanded.genres })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <h3 className="text-sm font-medium">Genres</h3>
                {filters.genres.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.genres.length}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.genres ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {genres.map((genre) => (
                  <div key={genre.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`genre-${genre.id}`}
                      checked={filters.genres.includes(genre.id)}
                      onCheckedChange={(checked) => handleGenreChange(genre.id, checked === true)}
                    />
                    <label
                      htmlFor={`genre-${genre.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {genre.name}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible
            open={expanded.platforms}
            onOpenChange={() => setExpanded({ ...expanded, platforms: !expanded.platforms })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <h3 className="text-sm font-medium">Platforms</h3>
                {filters.platforms.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.platforms.length}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.platforms ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                {platforms.map((platform) => (
                  <div key={platform.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`platform-${platform.id}`}
                      checked={filters.platforms.includes(platform.id)}
                      onCheckedChange={(checked) => handlePlatformChange(platform.id, checked === true)}
                    />
                    <label
                      htmlFor={`platform-${platform.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {platform.name}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible
            open={expanded.publishers}
            onOpenChange={() => setExpanded({ ...expanded, publishers: !expanded.publishers })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <h3 className="text-sm font-medium">Publishers</h3>
                {filters.publishers.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.publishers.length}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.publishers ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {publishers.map((publisher) => (
                  <div key={publisher.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`publisher-${publisher.id}`}
                      checked={filters.publishers.includes(publisher.id)}
                      onCheckedChange={(checked) => handlePublisherChange(publisher.id, checked === true)}
                    />
                    <label
                      htmlFor={`publisher-${publisher.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {publisher.name}
                    </label>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible open={expanded.price} onOpenChange={() => setExpanded({ ...expanded, price: !expanded.price })}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <h3 className="text-sm font-medium">Price Range</h3>
                {(filters.priceRange[0] > 0 || filters.priceRange[1] < 100) && (
                  <Badge variant="secondary" className="ml-1">
                    ${filters.priceRange[0]} - ${filters.priceRange[1]}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-4 px-1 pt-2">
                <Slider
                  defaultValue={[0, 100]}
                  value={[filters.priceRange[0], filters.priceRange[1]]}
                  max={100}
                  step={1}
                  onValueChange={handlePriceChange}
                  className="py-4"
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm">${filters.priceRange[0]}</span>
                  <span className="text-sm">${filters.priceRange[1]}</span>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible
            open={expanded.rating}
            onOpenChange={() => setExpanded({ ...expanded, rating: !expanded.rating })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                <h3 className="text-sm font-medium">Rating</h3>
                {filters.rating && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.rating}+ Stars
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.rating ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <RadioGroup
                value={filters.rating === null ? "any" : filters.rating.toString()}
                onValueChange={handleRatingChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="rating-any" />
                  <Label htmlFor="rating-any">Any Rating</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="4" id="rating-4" />
                  <Label htmlFor="rating-4">4+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3" id="rating-3" />
                  <Label htmlFor="rating-3">3+ Stars</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="rating-2" />
                  <Label htmlFor="rating-2">2+ Stars</Label>
                </div>
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible
            open={expanded.release}
            onOpenChange={() => setExpanded({ ...expanded, release: !expanded.release })}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <h3 className="text-sm font-medium">Release Year</h3>
                {filters.releaseYear && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.releaseYear}
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.release ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <RadioGroup
                value={filters.releaseYear === null ? "any" : filters.releaseYear}
                onValueChange={handleReleaseYearChange}
                className="space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="any" id="year-any" />
                  <Label htmlFor="year-any">Any Year</Label>
                </div>
                {releaseYears.map((year) => (
                  <div key={year} className="flex items-center space-x-2">
                    <RadioGroupItem value={year} id={`year-${year}`} />
                    <Label htmlFor={`year-${year}`}>{year}</Label>
                  </div>
                ))}
              </RadioGroup>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <Collapsible open={expanded.other} onOpenChange={() => setExpanded({ ...expanded, other: !expanded.other })}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Percent className="h-4 w-4" />
                <h3 className="text-sm font-medium">Other Filters</h3>
                {filters.onSale && (
                  <Badge variant="secondary" className="ml-1">
                    1
                  </Badge>
                )}
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  {expanded.other ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="pt-2">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="on-sale"
                    checked={filters.onSale}
                    onCheckedChange={(checked) => handleOnSaleChange(checked === true)}
                  />
                  <label
                    htmlFor="on-sale"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    On Sale
                  </label>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Separator />

          <div className="pt-2">
            <h3 className="mb-3 text-sm font-medium">Sort By</h3>
            <select
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
              value={filters.sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="rating-desc">Highest Rated</option>
              <option value="release-desc">Newest</option>
              <option value="discount-desc">Biggest Discount</option>
            </select>
          </div>

          <div className="pt-4">
            <Button className="w-full" onClick={() => onFilterChange(filters)}>
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

// Main component wrapper with Suspense
export function AdvancedFilter({ onFilterChange, totalGames, initialFilters, className = "" }: AdvancedFilterProps) {
  return (
    <Suspense fallback={<div className="w-full h-96 bg-muted/30 animate-pulse rounded-md"></div>}>
      <FilterContent onFilterChange={onFilterChange} totalGames={totalGames} initialFilters={initialFilters} />
    </Suspense>
  )
}

