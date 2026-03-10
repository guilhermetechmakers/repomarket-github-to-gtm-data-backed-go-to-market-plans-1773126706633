import { Link } from 'react-router-dom'
import { FileText, BarChart3, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

const features = [
  {
    icon: FileText,
    title: 'Code-first insights',
    description: 'Extract product intent and maturity from your repo—no questionnaires.',
  },
  {
    icon: BarChart3,
    title: 'Evidence-backed claims',
    description: 'Live market research with citations so every recommendation is traceable.',
  },
  {
    icon: Zap,
    title: 'GTM in minutes',
    description: 'From repository to structured GTM report in under 2 minutes.',
  },
]

const steps = [
  'Connect your GitHub repository',
  'We analyze code, README, and manifests',
  'Perplexity gathers market evidence',
  'Get your exportable GTM report',
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatedPage>
          <section className="mx-auto max-w-[980px] px-4 py-16 sm:px-6 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                GitHub to{' '}
                <span className="text-accent">evidence-backed</span> GTM strategy
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-lg text-muted-foreground">
                Turn your repository into a go-to-market plan. We infer product intent, run live
                market research, and deliver a consultant-style report with citations.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/signup">Get started — Connect GitHub</Link>
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link to="/demo">See demo report</Link>
                </Button>
              </div>
            </div>
          </section>

          <section className="border-t border-border bg-card/50 py-16">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
              <h2 className="text-2xl font-semibold text-center text-foreground mb-10">
                How it works
              </h2>
              <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {steps.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold text-sm">
                      {i + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="py-16">
            <div className="mx-auto max-w-[1100px] px-4 sm:px-6">
              <h2 className="text-2xl font-semibold text-center text-foreground mb-10">
                Built for founders and product teams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map(({ icon: Icon, title, description }) => (
                  <Card
                    key={title}
                    className="card-hover p-6 animate-fade-in-up"
                  >
                    <CardContent className="p-0">
                      <div className="rounded-lg bg-accent/10 p-3 w-fit mb-4">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <h3 className="font-semibold text-foreground">{title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="border-t border-border py-16">
            <div className="mx-auto max-w-[980px] px-4 text-center">
              <h2 className="text-2xl font-semibold text-foreground">
                Ready to turn your repo into a GTM plan?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Free tier available. No credit card required.
              </p>
              <Button size="lg" className="mt-6" asChild>
                <Link to="/signup">Get started</Link>
              </Button>
            </div>
          </section>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
