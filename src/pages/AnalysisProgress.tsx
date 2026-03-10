import { Link, useParams } from 'react-router-dom'
import { Loader2, Check, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useProject } from '@/hooks/useProjects'
import { Navbar } from '@/components/layout/Navbar'
import { AnimatedPage } from '@/components/AnimatedPage'

const steps = [
  { key: 'queued', label: 'Queued' },
  { key: 'fetching', label: 'Fetching repo' },
  { key: 'parsing', label: 'Parsing' },
  { key: 'analyzing', label: 'LLM analysis' },
  { key: 'researching', label: 'Market research' },
  { key: 'synthesizing', label: 'Synthesizing report' },
  { key: 'complete', label: 'Complete' },
]

export default function AnalysisProgress() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading } = useProject(id ?? '')
  const currentStep = project?.status ?? 'pending'
  const stepIndex = steps.findIndex((s) => s.key === currentStep)
  const progress = stepIndex < 0 ? 0 : ((stepIndex + 1) / steps.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="mb-8">
            <Button variant="ghost" asChild>
              <Link to="/dashboard">← Back to dashboard</Link>
            </Button>
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Analysis in progress
          </h1>
          {project && (
            <p className="text-muted-foreground mb-8">
              {project.repo_owner}/{project.repo_name}
            </p>
          )}

          {isLoading ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Loading…
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <Progress value={progress} className="mb-8" />
                <ul className="space-y-4">
                  {steps.map((step, i) => {
                    const done = stepIndex > i || (step.key === currentStep && project?.status === 'complete')
                    const active = step.key === currentStep && project?.status !== 'complete'
                    return (
                      <li
                        key={step.key}
                        className="flex items-center gap-3"
                      >
                        {done ? (
                          <Check className="h-5 w-5 text-accent shrink-0" />
                        ) : active ? (
                          <Loader2 className="h-5 w-5 text-accent animate-spin shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
                        )}
                        <span
                          className={
                            active
                              ? 'font-medium text-foreground'
                              : 'text-muted-foreground'
                          }
                        >
                          {step.label}
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <div className="mt-8 flex gap-3">
                  <Button variant="outline" disabled>
                    Cancel
                  </Button>
                  <Button variant="outline" disabled>
                    Retry
                  </Button>
                </div>
                {project?.status === 'complete' && project.report_id && (
                  <Button className="mt-4" asChild>
                    <Link to={`/report/${project.report_id}`}>
                      View report
                    </Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </AnimatedPage>
      </main>
    </div>
  )
}
