import Link from "next/link"
import { Frown } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container flex h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Frown className="mb-6 h-20 w-20 text-muted-foreground" />
      <h1 className="mb-4 text-4xl font-bold">Page Not Found</h1>
      <p className="mb-6 max-w-md text-muted-foreground">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <div className="flex gap-4">
        <Button asChild>
          <Link href="/">Return Home</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/games">Browse Games</Link>
        </Button>
      </div>
    </div>
  )
}

