import { Link } from 'react-router-dom'
import {
  User,
  Key,
  Github,
  Shield,
  Bell,
  CreditCard,
  FileText,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedPage } from '@/components/AnimatedPage'
import { useAuthUser } from '@/hooks/useAuthUser'
import { useRetentionByUser, useSetRetention } from '@/hooks/useRetention'
import { useDataAuditLogs } from '@/hooks/useDataAuditLogs'
import { cn } from '@/lib/utils'

export default function Settings() {
  const { data: user, isLoading: userLoading } = useAuthUser()
  const userId = user?.id ?? undefined
  const { data: retentionPolicies = [], isLoading: retentionLoading } = useRetentionByUser(userId)
  const setRetention = useSetRetention()
  const { data: auditData, isLoading: auditLoading } = useDataAuditLogs({ limit: 20 })
  const auditLogs = auditData?.data ?? []

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar showAuth={true} />
      <main className="flex-1 mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6">
        <AnimatedPage>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-foreground">Settings & Preferences</h1>
            <p className="text-muted-foreground mt-1">
              Manage your account, privacy, and security.
            </p>
          </div>

          {userLoading ? (
            <Skeleton className="h-96 w-full rounded-xl" />
          ) : !user ? (
            <Card className="rounded-2xl border-border shadow-card">
              <CardContent className="py-12 text-center">
                <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-lg font-semibold text-foreground">Sign in required</h2>
                <p className="mt-2 text-sm text-muted-foreground max-w-sm mx-auto">
                  Sign in to manage your account, API keys, GitHub connection, and data retention.
                </p>
                <Button className="mt-6" asChild>
                  <Link to="/login">Sign in</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="account" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-1 bg-muted p-1 rounded-xl">
                <TabsTrigger value="account" className="gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Account</span>
                </TabsTrigger>
                <TabsTrigger value="api-keys" className="gap-2">
                  <Key className="h-4 w-4" />
                  <span className="hidden sm:inline">API Keys</span>
                </TabsTrigger>
                <TabsTrigger value="github" className="gap-2">
                  <Github className="h-4 w-4" />
                  <span className="hidden sm:inline">GitHub</span>
                </TabsTrigger>
                <TabsTrigger value="privacy" className="gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Privacy</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="plan" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span className="hidden sm:inline">Plan</span>
                </TabsTrigger>
                <TabsTrigger value="audit" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Audit</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="account" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Account details</CardTitle>
                    <CardDescription>Email and display name. Change password in your auth provider.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={user?.email ?? ''}
                        readOnly
                        className="mt-1 bg-muted/50"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Two-factor authentication can be enabled in your account security settings.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="api-keys" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>API keys & secrets</CardTitle>
                    <CardDescription>Manage API keys for integrations. Keys are hashed and never shown in full.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="rounded-xl">
                      <Key className="mr-2 h-4 w-4" />
                      Create API key
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">
                      No API keys yet. Create one to use with external tools.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="github" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Connected GitHub accounts</CardTitle>
                    <CardDescription>OAuth connections, linked organizations, and repo scope.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="rounded-xl" asChild>
                      <a href="/api/auth/github">
                        <Github className="mr-2 h-4 w-4" />
                        Connect GitHub
                      </a>
                    </Button>
                    <p className="mt-4 text-sm text-muted-foreground">
                      Connect your GitHub account to analyze repositories. We request minimal scopes (repo, read:user).
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Privacy & data retention</CardTitle>
                    <CardDescription>Set retention periods and purge options per data type.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Default retention (snapshots)</Label>
                      <Select
                        onValueChange={(value) =>
                          userId &&
                          setRetention.mutate({
                            target_id: userId,
                            target_type: 'user',
                            data_type: 'snapshot',
                            retention_days: Number(value),
                            purge_on_expire: true,
                          })
                        }
                      >
                        <SelectTrigger className="w-full max-w-xs rounded-xl">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">1 year</SelectItem>
                        </SelectContent>
                      </Select>
                      {retentionLoading && <Skeleton className="h-4 w-48" />}
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Purge on expiry</p>
                        <p className="text-sm text-muted-foreground">Automatically delete data when retention period ends.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current policies: {Array.isArray(retentionPolicies) ? retentionPolicies.length : 0} configured.
                    </p>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-accent" />
                      Security indicators
                    </CardTitle>
                    <CardDescription>Encryption and last security events.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Encryption at rest</span>
                      <span className="text-sm font-medium text-accent">Active</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Last purge</span>
                      <span className="text-sm text-foreground">—</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-t border-border">
                      <span className="text-sm text-muted-foreground">Last scrub</span>
                      <span className="text-sm text-foreground">—</span>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Notification preferences</CardTitle>
                    <CardDescription>Email, in-app, and webhooks.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Email notifications</p>
                        <p className="text-sm text-muted-foreground">Security and product updates.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Marketing emails</p>
                        <p className="text-sm text-muted-foreground">Tips and offers.</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="plan" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Plan & billing</CardTitle>
                    <CardDescription>Subscription status and billing info. Handle securely.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between rounded-xl border border-border p-4">
                      <div>
                        <p className="font-medium text-foreground">Current plan</p>
                        <p className="text-sm text-muted-foreground">Free tier</p>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-lg" asChild>
                        <Link to="/pricing">Upgrade</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="audit" className="space-y-6">
                <Card className="rounded-2xl border-border shadow-card transition-all duration-200 hover:shadow-lg">
                  <CardHeader>
                    <CardTitle>Security & audit log</CardTitle>
                    <CardDescription>Recent data access, purges, and retention actions.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {auditLoading ? (
                      <div className="space-y-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                      </div>
                    ) : auditLogs.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-6 text-center">
                        No audit events yet.
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-[400px] overflow-y-auto">
                        {(auditLogs ?? []).slice(0, 20).map((log) => (
                          <div
                            key={log.id}
                            className={cn(
                              'flex items-center justify-between rounded-xl border border-border p-3 text-sm transition-colors hover:bg-muted/50'
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-foreground">{log.action}</span>
                              <span className="text-muted-foreground">{log.resource_type}</span>
                            </div>
                            <span className="text-muted-foreground text-xs">
                              {log.timestamp ? new Date(log.timestamp).toLocaleDateString() : '—'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    <Button variant="outline" size="sm" className="mt-4 rounded-lg">
                      Export audit report
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </AnimatedPage>
      </main>
      <Footer />
    </div>
  )
}
