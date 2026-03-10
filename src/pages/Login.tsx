import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedPage } from '@/components/AnimatedPage'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (_data: FormData) => {
    // TODO: Supabase signIn; for now redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={false} />
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatedPage className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Log in</CardTitle>
              <CardDescription>
                Sign in to your RepoMarket account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <a href="/api/auth/github">
                  <Github className="mr-2 h-4 w-4" />
                  Continue with GitHub
                </a>
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or with email
                  </span>
                </div>
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="mt-1"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    className="mt-1"
                    {...register('password')}
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Signing in…' : 'Sign in'}
                </Button>
              </form>
              <p className="text-center text-sm text-muted-foreground">
                <Link to="/forgot-password" className="underline hover:text-foreground">
                  Forgot password?
                </Link>
                {' · '}
                <Link to="/signup" className="underline hover:text-foreground">
                  Sign up
                </Link>
              </p>
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to our{' '}
                <Link to="/terms" className="underline">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="underline">Privacy Policy</Link>.
              </p>
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
    </div>
  )
}
