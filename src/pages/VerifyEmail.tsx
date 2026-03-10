import { Link } from 'react-router-dom'
import { Mail, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function VerifyEmail() {
  const status = 'pending' as 'pending' | 'success' | 'error'

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={false} />
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatedPage className="w-full max-w-md">
          <Card>
            <CardHeader>
              {status === 'pending' && (
                <>
                  <div className="mx-auto rounded-full bg-accent/10 p-3 w-fit">
                    <Mail className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="text-center">Check your email</CardTitle>
                  <CardDescription className="text-center">
                    We sent a verification link. Click it to activate your account.
                  </CardDescription>
                </>
              )}
              {status === 'success' && (
                <>
                  <div className="mx-auto rounded-full bg-green-100 p-3 w-fit">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-center">Email verified</CardTitle>
                  <CardDescription className="text-center">
                    Your account is active. Head to the dashboard to get started.
                  </CardDescription>
                </>
              )}
              {status === 'error' && (
                <>
                  <div className="mx-auto rounded-full bg-red-100 p-3 w-fit">
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                  <CardTitle className="text-center">Verification failed</CardTitle>
                  <CardDescription className="text-center">
                    The link may have expired. Request a new one below.
                  </CardDescription>
                </>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {status === 'pending' && (
                <Button variant="outline" className="w-full" disabled>
                  Resend email (rate limited)
                </Button>
              )}
              {status === 'success' && (
                <Button className="w-full" asChild>
                  <Link to="/dashboard">Go to dashboard</Link>
                </Button>
              )}
              {status === 'error' && (
                <Button className="w-full">Resend verification email</Button>
              )}
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/login" className="underline hover:text-foreground">
                  Back to log in
                </Link>
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
    </div>
  )
}
