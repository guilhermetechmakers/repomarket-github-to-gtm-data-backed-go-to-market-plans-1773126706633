import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Try RepoMarket with limited analyses.',
    features: ['3 analyses / month', '1 export per report', 'Email support'],
    cta: 'Get started',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Solo',
    price: '$29',
    description: 'For founders and indie makers.',
    features: ['20 analyses / month', '10 exports / month', 'Priority email'],
    cta: 'Start free trial',
    href: '/checkout?plan=solo',
    highlighted: true,
  },
  {
    name: 'Team',
    price: '$99',
    description: 'Shared credits and collaboration.',
    features: ['100 analyses / month', 'Unlimited exports', 'Shared projects'],
    cta: 'Contact sales',
    href: '/checkout?plan=team',
    highlighted: false,
  },
  {
    name: 'Agency',
    price: 'Custom',
    description: 'High volume and white-label.',
    features: ['Custom limits', 'API access', 'Dedicated support'],
    cta: 'Contact sales',
    href: 'mailto:sales@repomarket.com',
    highlighted: false,
  },
]

export default function Pricing() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <AnimatedPage>
          <section className="mx-auto max-w-[1100px] px-4 py-16 sm:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold text-foreground">
                Simple pricing
              </h1>
              <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
                Start free. Upgrade when you need more analyses and exports.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={tier.highlighted ? 'ring-2 ring-accent' : ''}
                >
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                    <p className="text-2xl font-bold text-foreground mt-2">
                      {tier.price}
                      {tier.price !== 'Custom' && (
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      )}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {tier.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-accent shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <Button
                      className="w-full"
                      variant={tier.highlighted ? 'default' : 'outline'}
                      asChild
                    >
                      <Link to={tier.href}>{tier.cta}</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
