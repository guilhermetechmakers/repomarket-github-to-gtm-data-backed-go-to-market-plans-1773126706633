import { Link } from 'react-router-dom'
import { Plus, Search, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useProjects } from '@/hooks/useProjects'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { Badge } from '@/components/ui/badge'

export default function Dashboard() {
  const { data: projects, isLoading, error } = useProjects()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={true} />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <h1 className="text-2xl font-semibold text-foreground">
              Projects
            </h1>
            <Button asChild>
              <Link to="/connect">
                <Plus className="mr-2 h-4 w-4" />
                Analyze a repository
              </Link>
            </Button>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search projects..."
                className="pl-9 max-w-sm"
              />
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="py-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  {error.message}
                </p>
              </CardContent>
            </Card>
          )}

          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !projects?.length ? (
            <Card className="flex flex-col items-center justify-center py-16">
              <CardContent className="text-center">
                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">
                  No projects yet
                </h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm">
                  Connect a GitHub repository to run your first GTM analysis.
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/connect">Analyze a repository</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <Link key={project.id} to={`/project/${project.id}`}>
                  <Card className="card-hover cursor-pointer">
                    <CardHeader className="flex flex-row items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {project.repo_owner}/{project.repo_name}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {project.description || 'No description'}
                        </p>
                      </div>
                      <Badge variant="secondary">{project.status}</Badge>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        {project.maturity_score != null && (
                          <span>Maturity: {project.maturity_score}/100</span>
                        )}
                        {project.report_id && (
                          <Link
                            to={`/report/${project.report_id}`}
                            className="text-accent hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            View report
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-8 p-4 rounded-lg border border-border bg-card/50">
            <p className="text-sm text-muted-foreground">
              <strong>Subscription:</strong> Free plan. Upgrade for more analyses and exports.
            </p>
          </div>
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
