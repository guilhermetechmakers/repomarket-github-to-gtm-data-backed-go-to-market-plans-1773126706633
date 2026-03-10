import { Link } from 'react-router-dom'
import { FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <FileQuestion className="h-16 w-16 text-muted-foreground" />
        <h1 className="mt-4 text-2xl font-semibold text-foreground">404</h1>
        <p className="mt-2 text-muted-foreground text-center max-w-md">
          This page doesn’t exist. Check the URL or go back home.
        </p>
        <div className="mt-6 flex gap-3">
          <Button asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <a href="mailto:support@repomarket.com?subject=Report%20broken%20link">
              Report this issue
            </a>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
}
