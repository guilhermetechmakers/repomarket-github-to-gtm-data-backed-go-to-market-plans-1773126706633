import { useParams, Link } from 'react-router-dom'
import { useProject } from '@/hooks/useProjects'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'

export default function ProjectDetails() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading, error } = useProject(id ?? '')

  if (isLoading || !id) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8">
          <Skeleton className="h-8 w-48 mb-4" />
          <Skeleton className="h-24 w-full" />
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <Card className="max-w-md w-full">
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                Project not found or you don’t have access.
              </p>
              <Button className="w-full mt-4" asChild>
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="mb-6">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">← Back to dashboard</Link>
            </Button>
          </div>
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  {project.repo_owner}/{project.repo_name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {project.description || 'No description'}
                </p>
              </div>
              <Badge variant="secondary">{project.status}</Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              {project.maturity_score != null && (
                <p className="text-sm text-muted-foreground">
                  Maturity score: {project.maturity_score}/100
                </p>
              )}
              {project.report_id ? (
                <Button asChild>
                  <Link to={`/report/${project.report_id}`}>View report</Link>
                </Button>
              ) : (
                <Button asChild>
                  <Link to={`/analysis/progress/${project.id}`}>
                    View analysis progress
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
