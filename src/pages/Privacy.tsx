import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Privacy Policy
          </h1>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              RepoMarket collects and uses your information to provide the service, improve product quality, and communicate with you. We do not sell your data.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">
              Information we collect
            </h2>
            <p>
              Account data (email, name when provided), GitHub OAuth data (repos you authorize), repository content used for analysis, and usage data (e.g. analyses run, exports).
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">
              How we use it
            </h2>
            <p>
              To run GTM analyses, generate reports, enforce quotas, send transactional and product emails, and improve our service.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">
              Data retention & your rights
            </h2>
            <p>
              You can request deletion of your data from Settings. We retain data as needed to provide the service and as required by law.
            </p>
            <p className="mt-8">
              For full terms and contact details, see our Terms of Service.
            </p>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
