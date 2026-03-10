/**
 * GTM Synthesis & Report types.
 * All list/array fields are typed for null-safe usage (default to [] when consuming).
 */

export type GtmReportStatus = 'draft' | 'final' | 'exported'
export type NextStepPriority = 'low' | 'med' | 'high'
export type ExportFormat = 'pdf' | 'markdown' | 'html' | 'docx'
export type ExportStatus = 'queued' | 'processing' | 'completed' | 'failed'
export type AccessControl = 'public' | 'private' | 'password-protected'

export type ReportSectionKey =
  | 'execSummary'
  | 'competitors'
  | 'icp'
  | 'positioning'
  | 'pricing'
  | 'messagingAngles'
  | 'nextSteps'

export interface GtmReportSection {
  id: string
  reportId: string
  key: ReportSectionKey
  title: string
  content: string
  order: number
  createdAt?: string
  updatedAt?: string
}

export interface GtmEvidence {
  id: string
  reportId: string
  statement: string
  source: string
  strength: number
  notes?: string
  createdAt?: string
}

export interface GtmCompetitor {
  id: string
  reportId: string
  name: string
  positioning: string
  dataSource?: string
  confidence: number
  createdAt?: string
}

export interface GtmICP {
  id: string
  reportId: string
  segment: string
  persona: string
  needs: string
  evidenceRefs: string[]
  createdAt?: string
}

export interface GtmPricing {
  id: string
  reportId: string
  patterns: string
  guidance: string
  notes?: string
  createdAt?: string
}

export interface GtmMessagingAngle {
  id: string
  reportId: string
  angle: string
  copy: string
  evidenceRefs: string[]
  createdAt?: string
}

export interface GtmNextStep {
  id: string
  reportId: string
  step: string
  priority: NextStepPriority
  owner?: string
  dueDate?: string
  createdAt?: string
}

export interface GtmReportExport {
  id: string
  reportId: string
  userId: string
  format: ExportFormat
  template: string
  accessControl: AccessControl
  status: ExportStatus
  fileUrl?: string
  fileSizeBytes?: number
  createdAt: string
  completedAt?: string
}

export interface GtmReportVersion {
  id: string
  reportId: string
  versionNumber: number
  changesSummary?: string
  createdAt: string
  authorId?: string
}

/** Full GTM report for Analysis Results / Editor (API response shape) */
export interface AnalysisResult {
  id: string
  projectId: string
  version: number
  status: GtmReportStatus
  execSummary: string
  maturityScore?: number
  confidenceScore?: number
  sections: GtmReportSection[]
  evidence: GtmEvidence[]
  competitors: GtmCompetitor[]
  icp: GtmICP[]
  pricing: GtmPricing[]
  messagingAngles: GtmMessagingAngle[]
  nextSteps: GtmNextStep[]
  sources: { url?: string; title?: string }[]
  createdAt: string
  updatedAt: string
}

/** Synthesis request payload */
export interface SynthesizeReportInput {
  repositoryId: string
  userId: string
  options?: {
    model?: string
    sourcingRules?: Record<string, unknown>
    confidenceWeights?: Record<string, number>
  }
}

/** Synthesis response */
export interface SynthesizeReportResponse {
  reportId: string
  version: number
  status: GtmReportStatus
  sections: GtmReportSection[]
  confidence: number
}

/** Version patch payload */
export interface ReportVersionPatchInput {
  changes: Record<string, unknown> | { sections?: Partial<GtmReportSection>[] }
}

/** Export request */
export interface ExportReportInput {
  reportId: string
  format: ExportFormat
  template: string
  accessControl: AccessControl
  emailCopy?: boolean
  password?: string
}

/** Export job response */
export interface ExportJobResponse {
  exportId: string
  status: ExportStatus
}

/** Export status response */
export interface ExportStatusResponse {
  status: ExportStatus
  fileUrl?: string
  progress?: number
  fileSizeBytes?: number
  createdAt?: string
}

/** Editor draft (client-side editing state) */
export interface EditorDraft {
  reportId: string
  version: number
  sections: Partial<GtmReportSection>[]
  evidenceAnnotations: Record<string, string>
  lastSavedAt?: string
}
