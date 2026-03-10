import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[720px] px-4 py-12 sm:px-6">
        <AnimatedPage>
          <h1 className="text-3xl font-bold text-foreground mb-6">
            Terms of Service
          </h1>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>Last updated: {new Date().toLocaleDateString()}</p>
            <p>
              By using RepoMarket you agree to these terms. We provide a service that analyzes your GitHub repositories and produces GTM reports. You must have the right to authorize us to access the repositories you connect.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">
              Acceptable use
            </h2>
            <p>
              You may not use the service for illegal purposes, to infringe others’ rights, or to abuse our systems. We may suspend or terminate access for violations.
            </p>
            <h2 className="text-xl font-semibold text-foreground mt-8">
              Service level
            </h2>
            <p>
              We strive for high availability but do not guarantee uptime. Reports are provided “as is” and we are not liable for decisions made based on them.
            </p>
            <p className="mt-8">
              For privacy practices, see our Privacy Policy.
            </p>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
