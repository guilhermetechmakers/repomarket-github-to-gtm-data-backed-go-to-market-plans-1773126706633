import { Link } from 'react-router-dom'
import { Github, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Connect() {
  const connected = false

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Connect GitHub
          </h1>
          <p className="text-muted-foreground mb-8">
            Authorize RepoMarket to read your repositories. We use minimal scopes (repo:read).
          </p>

          {!connected ? (
            <Card className="max-w-lg">
              <CardHeader>
                <CardTitle>Connect your GitHub account</CardTitle>
                <CardDescription>
                  You’ll be redirected to GitHub to authorize. We only read repo metadata and content for analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <a href="/api/auth/github">
                    <Github className="mr-2 h-4 w-4" />
                    Connect with GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-accent" />
                  GitHub connected
                </CardTitle>
                <CardDescription>
                  Choose a repository and options below, then start analysis.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Repository</Label>
                  <Input placeholder="owner/repo" className="mt-1" />
                </div>
                <div>
                  <Label>Branch (optional)</Label>
                  <Input placeholder="main" className="mt-1" />
                </div>
                <div className="flex gap-4 pt-4">
                  <Button asChild>
                    <Link to="/analysis/progress/1">Start analysis</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link to="/dashboard">Cancel</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
