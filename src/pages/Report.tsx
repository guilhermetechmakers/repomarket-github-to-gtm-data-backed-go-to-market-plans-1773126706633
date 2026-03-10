import { useParams, Link } from 'react-router-dom'
import { FileText, Download, Edit, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

// Placeholder report data; in production would come from API/hook
const placeholderSummary =
  'This repository appears to be a developer tool for API testing. Target users include backend engineers and QA. Maturity is early-stage with clear README and basic structure.'

export default function Report() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              GTM Report
            </h1>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to={`/report/${id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Customize
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to={`/report/${id}/export`}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Link>
              </Button>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-accent" />
                <span className="font-medium">Executive summary</span>
                <Badge variant="accent">Maturity: 65/100</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{placeholderSummary}</p>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-foreground">
                  Competitors
                </h2>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Postman — API client</li>
                  <li>• Insomnia — REST client</li>
                  <li>• Bruno — Open-source API client</li>
                </ul>
                <a
                  href="#"
                  className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline"
                >
                  View sources <ExternalLink className="h-3 w-3" />
                </a>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <h2 className="font-semibold text-foreground">
                  Next steps
                </h2>
              </CardHeader>
              <CardContent>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  <li>Define ICP and messaging</li>
                  <li>Add pricing page and trial</li>
                  <li>Set up basic analytics</li>
                </ol>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <h2 className="font-semibold text-foreground">
                Evidence & citations
              </h2>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Evidence panel: Perplexity sources and repo snippets will appear here. Use the editor to attach citations to sections.
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
