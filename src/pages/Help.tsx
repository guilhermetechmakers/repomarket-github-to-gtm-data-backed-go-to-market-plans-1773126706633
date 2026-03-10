import { Link } from 'react-router-dom'
import { Book, MessageCircle, FileText } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Help() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-12 sm:px-6">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Help & support
          </h1>
          <p className="text-muted-foreground mb-10">
            Get started and find answers to common questions.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="card-hover">
              <CardHeader>
                <Book className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Getting started</CardTitle>
                <CardDescription>
                  Connect GitHub, pick a repo, and run your first GTM analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  Go to dashboard →
                </Link>
              </CardContent>
            </Card>
            <Card className="card-hover">
              <CardHeader>
                <FileText className="h-8 w-8 text-accent mb-2" />
                <CardTitle>FAQ</CardTitle>
                <CardDescription>
                  Billing, exports, and how we use your repo data.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  See our FAQ section on the Pricing page.
                </p>
              </CardContent>
            </Card>
            <Card className="card-hover md:col-span-2">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-accent mb-2" />
                <CardTitle>Contact support</CardTitle>
                <CardDescription>
                  Something not working? We’re here to help.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href="mailto:support@repomarket.com"
                  className="text-sm font-medium text-accent hover:underline"
                >
                  support@repomarket.com
                </a>
              </CardContent>
            </Card>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
