import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Demo() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-12 sm:px-6">
        <AnimatedPage>
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <h1 className="text-2xl font-semibold text-foreground">
                Demo report
              </h1>
              <p className="text-muted-foreground">
                This is a sample GTM report so you can see the output without connecting a repo.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                A full demo report would show executive summary, competitors, ICP, positioning, pricing patterns, next steps, and evidence with citations. For a real report, sign up and run an analysis on your repository.
              </p>
              <Button asChild>
                <Link to="/signup">Get started — Create your own report</Link>
              </Button>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
