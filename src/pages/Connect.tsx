import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Github,
  Check,
  GitBranch,
  Layers,
  Lock,
  Calendar,
  AlertTriangle,
  Loader2,
  Shield,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { cn } from '@/lib/utils'

const INGESTION_STEPS = [
  { id: 'authorize', label: 'Authorize' },
  { id: 'fetch', label: 'Fetch' },
  { id: 'scrub', label: 'Scrub' },
  { id: 'store', label: 'Store' },
  { id: 'analyze', label: 'Analyze' },
] as const

export default function Connect() {
  const navigate = useNavigate()
  const [connected, setConnected] = useState(false)
  const [repo, setRepo] = useState('')
  const [branch, setBranch] = useState('main')
  const [depth, setDepth] = useState(1)
  const [includePrivate, setIncludePrivate] = useState(false)
  const [schedule, setSchedule] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [secretsDetected, setSecretsDetected] = useState<number | null>(null)
  const [secretsScrubbed, setSecretsScrubbed] = useState<number | null>(null)

  const handleStartAnalysis = () => {
    setIsRunning(true)
    setCurrentStep(0)
    setSecretsDetected(null)
    setSecretsScrubbed(null)
    const steps = INGESTION_STEPS.length
    const interval = setInterval(() => {
      setCurrentStep((s) => {
        const next = s + 1
        if (next === 3) {
          setSecretsDetected(0)
          setSecretsScrubbed(0)
        }
        if (next >= steps) {
          clearInterval(interval)
          setTimeout(() => navigate('/analysis/progress/1'), 400)
          return steps - 1
        }
        return next
      })
    }, 800)
  }

  const progressPercent = ((currentStep + 1) / INGESTION_STEPS.length) * 100

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={true} />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <h1 className="text-2xl font-semibold text-foreground mb-2">
            Connect GitHub
          </h1>
          <p className="text-muted-foreground mb-8">
            Authorize RepoMarket to read your repositories. We use minimal scopes (repo, read:user, status).
          </p>

          {!connected ? (
            <Card className="max-w-lg rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
              <CardHeader>
                <CardTitle>Connect your GitHub account</CardTitle>
                <CardDescription>
                  You'll be redirected to GitHub to authorize. We only read repo metadata and content for analysis.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                  onClick={() => setConnected(true)}
                  asChild
                >
                  <a href="/api/auth/github">
                    <Github className="mr-2 h-4 w-4" />
                    Connect with GitHub
                  </a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-accent" />
                    GitHub connected
                  </CardTitle>
                  <CardDescription>
                    Choose a repository and ingestion options, then start analysis. Secret scrubbing runs automatically.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="repo">Organization / Repository</Label>
                    <Input
                      id="repo"
                      placeholder="owner/repo or select from list"
                      className="mt-1 rounded-xl"
                      value={repo}
                      onChange={(e) => setRepo(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="branch" className="flex items-center gap-2">
                        <GitBranch className="h-4 w-4" />
                        Branch
                      </Label>
                      <Input
                        id="branch"
                        placeholder="main"
                        className="mt-1 rounded-xl"
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Default: main. Toggle to allow all branches.</p>
                    </div>
                    <div>
                      <Label htmlFor="depth" className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        Depth
                      </Label>
                      <Input
                        id="depth"
                        type="number"
                        min={0}
                        max={100}
                        className="mt-1 rounded-xl"
                        value={depth}
                        onChange={(e) => setDepth(Number(e.target.value) || 0)}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Shallow (0) or full clone. Moderate default.</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-border p-4">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-foreground">Include private repositories</p>
                        <p className="text-sm text-muted-foreground">Access to private repos; data is stored securely.</p>
                      </div>
                    </div>
                    <Switch checked={includePrivate} onCheckedChange={setIncludePrivate} />
                  </div>

                  <div>
                    <Label htmlFor="schedule" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Ingestion schedule
                    </Label>
                    <Input
                      id="schedule"
                      placeholder="Immediate or cron (e.g. 0 */6 * * *)"
                      className="mt-1 rounded-xl"
                      value={schedule}
                      onChange={(e) => setSchedule(e.target.value)}
                    />
                  </div>

                  {!isRunning ? (
                    <div className="flex gap-3 pt-2">
                      <Button
                        className="rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all duration-200 hover:scale-[1.02]"
                        onClick={handleStartAnalysis}
                        disabled={!repo.trim()}
                      >
                        Start analysis
                      </Button>
                      <Button variant="outline" className="rounded-xl" asChild>
                        <Link to="/dashboard">Cancel</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 pt-2">
                      <Progress value={progressPercent} className="h-2 rounded-full" />
                      <div className="flex flex-wrap gap-2">
                        {INGESTION_STEPS.map((step, i) => (
                          <span
                            key={step.id}
                            className={cn(
                              'inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors',
                              i <= currentStep ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                            )}
                          >
                            {i < currentStep ? <Check className="h-3 w-3" /> : i === currentStep ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                            {step.label}
                          </span>
                        ))}
                      </div>
                      {secretsDetected !== null && (
                        <div className="flex items-center gap-2 rounded-xl border border-border p-3 bg-muted/30">
                          <Shield className="h-4 w-4 text-accent" />
                          <span className="text-sm text-foreground">
                            Secrets detected: <strong>{secretsDetected}</strong> · Scrubbed: <strong>{secretsScrubbed ?? 0}</strong> (redacted in storage)
                          </span>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg" disabled>
                          Pause
                        </Button>
                        <Button variant="ghost" size="sm" className="rounded-lg" disabled>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-2xl border-border shadow-card transition-all duration-200">
                <CardHeader>
                  <CardTitle className="text-base">Ingestion configuration summary</CardTitle>
                  <CardDescription>Current selection. Data is encrypted at rest.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Repository</span>
                    <span className="font-medium">{repo || '—'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Branch</span>
                    <span className="font-medium">{branch || 'main'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Depth</span>
                    <span className="font-medium">{depth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Include private</span>
                    <span className="font-medium">{includePrivate ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium">{isRunning ? 'Running…' : 'Ready'}</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 p-4">
                <AlertTriangle className="h-5 w-5 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Pause and cancel actions are recorded in the audit log. Purge is irreversible; set retention policies in Settings.
                </p>
              </div>
            </div>
          )}
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
