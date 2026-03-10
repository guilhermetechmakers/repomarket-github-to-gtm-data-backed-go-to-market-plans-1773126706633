import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedPage } from '@/components/AnimatedPage'

const schema = z.object({ email: z.string().email('Invalid email') })
type FormData = z.infer<typeof schema>

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (_data: FormData) => {
    // TODO: Supabase reset password
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={false} />
      <main className="flex-1 flex items-center justify-center p-4">
        <AnimatedPage className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle>Reset password</CardTitle>
              <CardDescription>
                Enter your email and we’ll send a reset link.
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending…' : 'Send reset link'}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
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
