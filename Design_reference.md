# Modern Design Best Practices

## Philosophy

Create unique, memorable experiences while maintaining consistency through modern design principles. Every project should feel distinct yet professional, innovative yet intuitive.

---

## Landing Pages & Marketing Sites

### Hero Sections
**Go beyond static backgrounds:**
- Animated gradients with subtle movement
- Particle systems or geometric shapes floating
- Interactive canvas backgrounds (Three.js, WebGL)
- Video backgrounds with proper fallbacks
- Parallax scrolling effects
- Gradient mesh animations
- Morphing blob animations


### Layout Patterns
**Use modern grid systems:**
- Bento grids (asymmetric card layouts)
- Masonry layouts for varied content
- Feature sections with diagonal cuts or curves
- Overlapping elements with proper z-index
- Split-screen designs with scroll-triggered reveals

**Avoid:** Traditional 3-column equal grids

### Scroll Animations
**Engage users as they scroll:**
- Fade-in and slide-up animations for sections
- Scroll-triggered parallax effects
- Progress indicators for long pages
- Sticky elements that transform on scroll
- Horizontal scroll sections for portfolios
- Text reveal animations (word by word, letter by letter)
- Number counters animating into view

**Avoid:** Static pages with no scroll interaction

### Call-to-Action Areas
**Make CTAs impossible to miss:**
- Gradient buttons with hover effects
- Floating action buttons with micro-interactions
- Animated borders or glowing effects
- Scale/lift on hover
- Interactive elements that respond to mouse position
- Pulsing indicators for primary actions

---

## Dashboard Applications

### Layout Structure
**Always use collapsible side navigation:**
- Sidebar that can collapse to icons only
- Smooth transition animations between states
- Persistent navigation state (remember user preference)
- Mobile: drawer that slides in/out
- Desktop: sidebar with expand/collapse toggle
- Icons visible even when collapsed

**Structure:**
```
/dashboard (layout wrapper with sidebar)
  /dashboard/overview
  /dashboard/analytics
  /dashboard/settings
  /dashboard/users
  /dashboard/projects
```

All dashboard pages should be nested inside the dashboard layout, not separate routes.

### Data Tables
**Modern table design:**
- Sticky headers on scroll
- Row hover states with subtle elevation
- Sortable columns with clear indicators
- Pagination with items-per-page control
- Search/filter with instant feedback
- Selection checkboxes with bulk actions
- Responsive: cards on mobile, table on desktop
- Loading skeletons, not spinners
- Empty states with illustrations or helpful text

**Use modern table libraries:**
- TanStack Table (React Table v8)
- AG Grid for complex data
- Data Grid from MUI (if using MUI)

### Charts & Visualizations
**Use the latest charting libraries:**
- Recharts (for React, simple charts)
- Chart.js v4 (versatile, well-maintained)
- Apache ECharts (advanced, interactive)
- D3.js (custom, complex visualizations)
- Tremor (for dashboards, built on Recharts)

**Chart best practices:**
- Animated transitions when data changes
- Interactive tooltips with detailed info
- Responsive sizing
- Color scheme matching design system
- Legend placement that doesn't obstruct data
- Loading states while fetching data

### Dashboard Cards
**Metric cards should stand out:**
- Gradient backgrounds or colored accents
- Trend indicators (↑ ↓ with color coding)
- Sparkline charts for historical data
- Hover effects revealing more detail
- Icon representing the metric
- Comparison to previous period

---

## Color & Visual Design

### Color Palettes
**Create depth with gradients:**
- Primary gradient (not just solid primary color)
- Subtle background gradients
- Gradient text for headings
- Gradient borders on cards
- Elevated surfaces for depth

**Color usage:**
- 60-30-10 rule (dominant, secondary, accent)
- Consistent semantic colors (success, warning, error)
- Accessible contrast ratios (WCAG AA minimum)

### Typography
**Create hierarchy through contrast:**
- Large, bold headings (48-72px for heroes)
- Clear size differences between levels
- Variable font weights (300, 400, 600, 700)
- Letter spacing for small caps
- Line height 1.5-1.7 for body text
- Inter, Poppins, or DM Sans for modern feel

### Shadows & Depth
**Layer UI elements:**
- Multi-layer shadows for realistic depth
- Colored shadows matching element color
- Elevated states on hover
- Neumorphism for special elements (sparingly)

---

## Interactions & Micro-animations

### Button Interactions
**Every button should react:**
- Scale slightly on hover (1.02-1.05)
- Lift with shadow on hover
- Ripple effect on click
- Loading state with spinner or progress
- Disabled state clearly visible
- Success state with checkmark animation

### Card Interactions
**Make cards feel alive:**
- Lift on hover with increased shadow
- Subtle border glow on hover
- Tilt effect following mouse (3D transform)
- Smooth transitions (200-300ms)
- Click feedback for interactive cards

### Form Interactions
**Guide users through forms:**
- Input focus states with border color change
- Floating labels that animate up
- Real-time validation with inline messages
- Success checkmarks for valid inputs
- Error states with shake animation
- Password strength indicators
- Character count for text areas

### Page Transitions
**Smooth between views:**
- Fade + slide for page changes
- Skeleton loaders during data fetch
- Optimistic UI updates
- Stagger animations for lists
- Route transition animations

---

## Mobile Responsiveness

### Mobile-First Approach
**Design for mobile, enhance for desktop:**
- Touch targets minimum 44x44px
- Generous padding and spacing
- Sticky bottom navigation on mobile
- Collapsible sections for long content
- Swipeable cards and galleries
- Pull-to-refresh where appropriate

### Responsive Patterns
**Adapt layouts intelligently:**
- Hamburger menu → full nav bar
- Card grid → stack on mobile
- Sidebar → drawer
- Multi-column → single column
- Data tables → card list
- Hide/show elements based on viewport

---

## Loading & Empty States

### Loading States
**Never leave users wondering:**
- Skeleton screens matching content layout
- Progress bars for known durations
- Animated placeholders
- Spinners only for short waits (<3s)
- Stagger loading for multiple elements
- Shimmer effects on skeletons

### Empty States
**Make empty states helpful:**
- Illustrations or icons
- Helpful copy explaining why it's empty
- Clear CTA to add first item
- Examples or suggestions
- No "no data" text alone

---

## Unique Elements to Stand Out

### Distinctive Features
**Add personality:**
- Custom cursor effects on landing pages
- Animated page numbers or section indicators
- Unusual hover effects (magnification, distortion)
- Custom scrollbars
- Glassmorphism for overlays
- Animated SVG icons
- Typewriter effects for hero text
- Confetti or celebration animations for actions

### Interactive Elements
**Engage users:**
- Drag-and-drop interfaces
- Sliders and range controls
- Toggle switches with animations
- Progress steps with animations
- Expandable/collapsible sections
- Tabs with slide indicators
- Image comparison sliders
- Interactive demos or playgrounds

---

## Consistency Rules

### Maintain Consistency
**What should stay consistent:**
- Spacing scale (4px, 8px, 16px, 24px, 32px, 48px, 64px)
- Border radius values
- Animation timing (200ms, 300ms, 500ms)
- Color system (primary, secondary, accent, neutrals)
- Typography scale
- Icon style (outline vs filled)
- Button styles across the app
- Form element styles

### What Can Vary
**Project-specific customization:**
- Color palette (different colors, same system)
- Layout creativity (grids, asymmetry)
- Illustration style
- Animation personality
- Feature-specific interactions
- Hero section design
- Card styling variations
- Background patterns or textures

---

## Technical Excellence

### Performance
- Optimize images (WebP, lazy loading)
- Code splitting for faster loads
- Debounce search inputs
- Virtualize long lists
- Minimize re-renders
- Use proper memoization

### Accessibility
- Keyboard navigation throughout
- ARIA labels where needed
- Focus indicators visible
- Screen reader friendly
- Sufficient color contrast
- Respect reduced motion preferences

---

## Key Principles

1. **Be Bold** - Don't be afraid to try unique layouts and interactions
2. **Be Consistent** - Use the same patterns for similar functions
3. **Be Responsive** - Design works beautifully on all devices
4. **Be Fast** - Animations are smooth, loading is quick
5. **Be Accessible** - Everyone can use what you build
6. **Be Modern** - Use current design trends and technologies
7. **Be Unique** - Each project should have its own personality
8. **Be Intuitive** - Users shouldn't need instructions


---

# Project-Specific Customizations

**IMPORTANT: This section contains the specific design requirements for THIS project. The guidelines above are universal best practices - these customizations below take precedence for project-specific decisions.**

## User Design Requirements

# RepoMarket — Development Blueprint

## Project Concept
RepoMarket is a web application that converts a GitHub repository into an evidence-backed go-to-market (GTM) strategy. Purpose: enable founders, early product teams, consultants, and investors to derive product intent, maturity, target users, competitors, pricing patterns, messaging angles, and prioritized next steps directly from repository signals combined with live market research. Vision: provide a fast, code-first, trustworthy "mini-consultant" that synthesizes repository intelligence (code, README, manifests, APIs) with live market evidence (Perplexity) and structured LLM interpretation (Anthropic) to produce exportable GTM reports. Built on a lean stack: Supabase (auth, DB, storage, serverless), GitHub OAuth & content APIs, Anthropic for interpretation, Perplexity for research, Stripe for billing, SendGrid for transactional email.

AI app description: ingest repo snapshots, run structured Anthropic prompts to extract product context and maturity, run Perplexity queries to gather evidence and citations, synthesize deterministic JSON report schema, enable inline editing/versioning, and export to PDF/Markdown with access controls.

## Problem Statement
- Core problems:
  - Founders lack rapid, evidence-based GTM guidance tied to their actual product codebase.
  - Existing GTM advice is generic, questionnaire-driven, or disconnected from technical signals.
  - Manual competitor research and pricing discovery is time-consuming and error-prone.
- Who experiences these problems:
  - Solo founders, early-stage startups, technical PMs, product consultants, accelerators/investors.
- Why these problems matter:
  - Wrong or generic GTM choices waste time, budget, and slow product-market fit discovery.
  - Founders need high-confidence, actionable recommendations grounded in product reality and market signals.
- Current state/gaps without this solution:
  - No simple tool converts repository signals into a structured GTM plan with live citations.
  - Research and synthesis is manual or requires expensive consulting.
  - Lack of reproducible, auditable evidence linking claims to sources increases risk of misinformation.

## Solution
- How it addresses problems:
  - Leverages GitHub repo signals to infer product purpose, users, flows, and maturity.
  - Uses Anthropic LLM to extract structured product understanding (JSON schema) from code and documentation.
  - Uses Perplexity to gather live market evidence: competitors, pricing, reviews, category language, and citations.
  - Synthesizes findings into a prioritized GTM report with confidence scores, evidence links, and actionable next steps.
- Approach and methodology:
  - Secure GitHub OAuth → repo snapshot (selective or archive) → sanitization & storage in Supabase → chunking & summarization → Anthropic structured prompts → parallel Perplexity queries → deterministic synthesis engine merges structured product data + evidence into report JSON → store, present, edit, export.
  - Asynchronous job queue for ingestion/analysis, caching and retries, and rate-limit handling for external APIs.
- Key differentiators:
  - Code-first insights (not questionnaires), evidence-backed claims (Perplexity citations), deterministic synthesis (JSON schema), exportable consultant-style reports, lean stack implementation.
- Value creation:
  - Rapid, actionable GTM outputs (<2 min target for typical repos), increased confidence via evidence links, reproducible reports for investor/partner review, frictionless onboarding from repo to strategy.

## Requirements

### 1. Pages (UI Screens)
- Landing Page (Public marketing)
  - Purpose: convert visitors into signups; explain value proposition and CTAs.
  - Key sections: hero (headline, subline, primary CTA "Get started / Connect GitHub", secondary CTA "See demo report"), 3–4 feature cards, 4-step "How it works" flow, pricing teaser, testimonials/logos, footer.
  - Contribution: educates target users rapidly and drives activation.
- Login / Signup Page
  - Purpose: account access via Supabase auth.
  - Key sections: email/password form (validation, strength meter), GitHub OAuth button, optional Google OAuth, links (forgot password, TOS, Privacy).
  - Contribution: frictionless onboarding and secure auth.
- Email Verification Page
  - Purpose: confirm user emails post-signup.
  - Key sections: status messaging (pending, success, error), resend verification (rate-limited), CTA to dashboard when verified.
- Password Reset Page
  - Purpose: request and complete password reset.
  - Key sections: request form, tokenized reset form, password rules & strength feedback.
- Dashboard (Projects)
  - Purpose: user landing for all repo analyses and actions.
  - Key sections: top nav (logo, analyze repo CTA, search, account menu), project list/grid with cards (maturity score, snippet, last-run), CTA panel to Analyze, activity feed, subscription status.
  - Contribution: enables multi-project management and quick actions.
- Repository Selection / Connect GitHub
  - Purpose: authorize GitHub and choose repo + ingestion options.
  - Key sections: GitHub OAuth connect state, repo browser + filters (org, language, private/public), ingestion options (branch, clone depth, include private, file filters), retention checkbox, start analysis CTA.
  - Contribution: secure repo selection and configurable ingestion.
- Analysis Progress
  - Purpose: show real-time ingestion & analysis pipeline.
  - Key sections: progress timeline (queued → fetching → parsing → LLM analysis → research → synthesize → complete), live logs (sanitized), ETA, cancel/retry buttons, skeleton preview partial results.
  - Contribution: transparency into pipeline and error handling.
- Analysis Results (Report Landing)
  - Purpose: primary report overview and evidence presentation.
  - Key sections: executive summary card (one-paragraph description, maturity), competitor snapshot (top 5 + snippets + links), ICP & personas, positioning & differentiators, pricing patterns, next-step roadmap, evidence panel with citations and repo snippets, actions (customize, export, schedule monitoring).
  - Contribution: central actionable deliverable with evidence.
- Report Viewer / Editor
  - Purpose: edit, annotate, version report prior to export.
  - Key sections: rich block editor mapped to report schema, evidence side-panel (Perplexity sources + repo snippets attachable), comments/annotations, version history and revert.
  - Contribution: customization and auditability for final deliverable.
- Report Export / Download
  - Purpose: export reports with template & access controls.
  - Key sections: format options (PDF, Markdown, DOCX optional), template choices (compact, consultant-style, investor one-pager), access controls (public link, password, expiry), export progress and delivery.
  - Contribution: deliverable distribution and monetization gating.
- Settings & Preferences
  - Purpose: account management and data/privacy controls.
  - Key sections: account details, connected GitHub accounts, retention/purge controls, API keys, notification preferences, plan management link.
  - Contribution: trust, privacy control, and user account self-service.
- User Profile
  - Purpose: public/private user overview and recent public reports.
  - Key sections: avatar, name, org, plan badge, recent public reports, manage team link.
- Pricing Page
  - Purpose: explain plans and convert to paid tiers.
  - Key sections: tier cards (Free, Solo, Team, Agency), feature comparison, quotas, FAQ, CTA.
- Checkout / Payment Page
  - Purpose: collect payment via Stripe and complete purchase.
  - Key sections: order summary, card input (Stripe Elements), promo code, legal consent, success/failure messaging.
- Billing & Order History
  - Purpose: invoices and subscription management.
  - Key sections: subscription summary, invoice list (download), payment methods (add/remove), change plan/cancel.
- Help & About
  - Purpose: docs, onboarding guides, support.
  - Key sections: getting started guide, FAQ, contact form, release notes/roadmap.
- Admin Dashboard
  - Purpose: internal monitoring and user management.
  - Key sections: MAU/new signups, active analyses, queue health, API error rates, quick actions (impersonate, re-run).
- Admin — User Management
  - Purpose: manage users, credits, and purge.
  - Key sections: user list & filters, user detail panel (repos, invoices), actions (change plan, purge data).
- Privacy Policy, Terms of Service, Cookie Policy
  - Purpose: legal & compliance.
  - Key sections: full policy texts and controls for cookie consent.
- 404 & 500 Error Pages
  - Purpose: friendly error handling and diagnostics.
  - Key sections: guidance, search, contact support, "Report this issue" prefilled button.
- Operation Status / Loading Success (UX primitives)
  - Purpose: generic success/loading feedback across app.
  - Key sections: animated icons, short messages, CTAs.

### 2. Features
- User Authentication & Session Management
  - Implementation: Supabase Auth for email/password + GitHub OAuth; httpOnly cookies for session tokens; email verification via SendGrid; password reset tokens; session expiration policies; session audit logs; rate-limit flows.
  - Contribution: secure access and onboarding.
- GitHub Integration & Repo Ingestion
  - Implementation: GitHub OAuth minimal scopes (repo:read), server-side ingestion worker (background job), use Contents API or archive downloads, selective fetch of README, package manifests, OpenAPI specs, Dockerfiles, source file heuristics; sanitize secrets and exclude large binaries; store sanitized snapshots in Supabase Storage with retention metadata; optional webhooks to trigger re-analysis.
  - Contribution: code-first signal extraction.
- Repository Understanding (Anthropic)
  - Implementation: chunk & summarize repo text; structured prompt templates to output JSON (product_description, problems_solved, user_personas, core_flows, maturity_score, code_evidence_refs, confidence); post-validate JSON and attach confidence; caching and retry logic; rate-limit backoff.
  - Contribution: structured product insight extraction.
- Market Research (Perplexity)
  - Implementation: query templates seeded with product summary and intents (competitors, pricing, reviews, category language); parallel queries with caching and rate-limit management; normalize results (url, snippet, timestamp, relevance); store evidence artifacts and relevance scores.
  - Contribution: live, citable market evidence.
- GTM Synthesis & Report Generation
  - Implementation: deterministic synthesis pipeline that merges Anthropic JSON + Perplexity evidence into canonical report schema (report_id, repo_ref, exec_summary, competitors[], ICP[], positioning[], pricing[], messaging[], next_steps[], evidence[]); confidence scoring algorithm; generate preview HTML; store versioned reports.
  - Contribution: single source of truth report output.
- Report Customization & Editor
  - Implementation: block-level rich editor mapped to report JSON; evidence side-panel to attach sources to paragraphs; autosave drafts; versioning and compare/revert; role-based editing.
  - Contribution: customizable, collaborative final reports.
- Report Export & Delivery
  - Implementation: server-side PDF/Markdown renderer (headless Chromium or templated renderer), enforce export quotas per plan, generate public share links with optional password and expiry, email delivery via SendGrid, audit logs of exports.
  - Contribution: distribution and monetization.
- Notifications & Emails
  - Implementation: SendGrid templated emails for verification, report ready, billing; in-app notifications table in Supabase; webhooks/background triggers; retry/queue and rate limits.
  - Contribution: user engagement and transactional flows.
- Billing & Subscription Management
  - Implementation: Stripe integration for subscriptions, webhooks for invoice/payment events, metering for research credits & export quotas in Supabase, admin overrides for credits, receipts storage.
  - Contribution: monetization and plan enforcement.
- Admin Tools & Analytics
  - Implementation: role-based admin endpoints, aggregated metrics dashboard (Supabase queries), queue/job controls, impersonation audit logs, manual re-run.
  - Contribution: operational control and monitoring.
- Security & Data Privacy Controls
  - Implementation: encryption at rest for storage; secret scanning & redaction during ingestion; user-initiated purge endpoint; retention policies configurable per repo; least-privilege roles and Supabase RLS policies.
  - Contribution: trust, compliance, and privacy.
- Search & Filter Reports
  - Implementation: full-text search (Postgres tsvector or Meilisearch) for reports and repos; filters (status, date, maturity, language); debounced queries and pagination.
  - Contribution: manage scale and discoverability.

### 3. User Journeys
- Anonymous Visitor → Signup → Analyze Demo
  1. Visitor sees Landing Page → clicks "See demo report".
  2. Opens demo report (seeded sample) without auth to evaluate product.
  3. Click "Get started" → Signup page → create account via GitHub OAuth or email.
  4. If email signup: verify email via SendGrid link → redirected to Dashboard.
- New User → Connect GitHub → Run Analysis
  1. User on Dashboard clicks "Analyze a repository".
  2. Connect GitHub (OAuth) if not connected.
  3. Repo browser lists accessible repos; user selects repo and configures ingestion options (branch, depth, file filters).
  4. Start analysis → server enqueues ingestion job; UI shows Analysis Progress timeline.
  5. Ingestion fetches repo snapshot, sanitizes, stores snapshot.
  6. Repo text chunking + Anthropic prompts produce structured product JSON.
  7. In parallel, Perplexity queries run to gather competitors & evidence.
  8. Synthesis merges results into report JSON → notification/email sent when ready.
  9. User views Analysis Results page: reads exec summary, inspects evidence panel, and reviews next steps.
- User → Customize & Export
  1. From Report Landing, user opens Report Viewer/Editor.
  2. Edits messaging, attaches evidence snippets, comments inline, saves draft.
  3. Click Export → choose template & format → system checks export quota/plan.
  4. If allowed, server renders PDF/Markdown; progress shown; file delivered and optionally emailed.
- Team / Admin Flow
  1. Team admin purchases Team plan → invites members.
  2. Team members see shared projects in Dashboard and can run analyses with shared credits.
  3. Admin uses Admin Dashboard to monitor quotas, re-run jobs, or purge user data on request.
- Error & Retry Flow (Ingestion or API failure)
  1. Analysis Progress shows failure step and sanitized error log.
  2. User can retry or cancel; system implements exponential backoff and admin can re-run from admin tools.
  3. If Anthropic/Perplexity rate-limited, partial results exposed with confidence markers and "re-run research" CTA.
- Data Purge and Privacy Flow
  1. User navigates to Settings → Data & Privacy → selects repo snapshot → requests purge.
  2. System enqueues deletion job, removes files from storage, wipes analysis records per audit trail, and notifies user when completed.

## UI Guide
(Design tokens, components, and behavior summarized for implementation.)

### Visual Style
Follow the provided color palette, typography, spacing, and component behavior exactly. Use Inter or Poppins as primary font. Maintain centered hero with max content width 980–1100px. Use 8/16/24 spacing scale and internal card padding 22–28px.

### Color Palette:
- Primary background: #F6F7F9
- Content surface / cards: #FFFFFF
- Primary text: #0F1724
- Body text: #6B7280
- Border / divider: #E6E9EE
- Accent: #21C7A7
- Accent light: #E7FAF6
- Primary button (dark pill): #111827
- Analytics gradient: #2FD7BC → #14B9A0
- Shadow: rgba(16,24,40,0.06)

### Typography & Layout:
- H1: 48–64px, 700, #0F1724
- H2: 24–32px, 600, #0F1724
- Body: 16px, 400, #6B7280
- Captions: 12–14px, #9CA3AF
- Micro labels/pills: 12px, 600, small-caps
- Grid: hero single-column, feature grid 3 cards desktop → 1 column mobile.

### Key Design Elements
- Card design: rounded 14–18px, 1px border #E6E9EE, shadow 0 6px 18px rgba(16,24,40,0.06), hover translateY(-4px).
- Navigation: white bar, left logo, center links #6B7280, right primary pill CTA #111827.
- Data viz: minimal charts inside cards, rounded bar caps, teal gradient for positive metrics.
- Buttons: primary dark pill #111827; secondary ghost border #E6E9EE; accent teal #21C7A7.
- Forms: rounded inputs 8–10px radius, 1px border #E6E9EE, focus ring rgba(33,199,167,0.18).
- Micro-interactions: subtle transitions 150–220ms.

### Design Philosophy
- Clarity-first, evidence-focused, developer-friendly, actionable & efficient. Emphasize citations, confidence scores, and minimal decorative elements. Ensure components are reusable and accessible.

Implementation Notes: apply design tokens globally; ensure color contrast meets accessibility; build design system components (Button, Card, Modal, Editor blocks, Evidence Panel, Progress Timeline, Repo Browser, Chart primitives).

## Instructions to AI Development Tool
1. Refer to Project Concept, Problem Statement, and Solution for the "why" behind features.
2. Ensure all pages and features align with solving identified problems.
3. Verify implementations against the requirements before completing each task.
4. Adhere strictly to the UI Guide for visual elements, spacing, and interactions.
5. Maintain consistent approach across the stack: Supabase for auth/DB/storage, GitHub for ingestion, Anthropic for structured interpretation, Perplexity for evidence, Stripe for billing, SendGrid for email.
6. Implement robust error handling, caching, retry/backoff strategies, and rate-limit-aware queuing for external APIs.
7. Provide unit/integration tests for ingestion, LLM prompt pipelines, synthesis, and export rendering; include e2e tests for key user flows (signup, connect GitHub, analyze, edit, export).
8. Ensure security controls: secret scrubbing, encryption at rest, RLS policies, least-privilege service keys, and audit logs for admin actions.
9. Produce seed/demo data (sample repos and reports) and report templates (compact one-pager, consultant-style, investor summary) for onboarding and marketing.
10. Deliver developer-friendly docs (API, data schema, prompt templates, deployment steps) and deployment automation (IaC for Supabase & server components, CI workflows, environment secrets management).

PROJECT CONTEXT (concise)
- Project: RepoMarket — GitHub-to-GTM: convert repo signals + live market research → evidence-backed GTM report.
- Stack: Supabase (auth, DB, storage, serverless), GitHub API, Anthropic (LLM), Perplexity (research), Stripe, SendGrid.
- Target users: founders, early-stage startups, product consultants, investors.
- Core flows: signup → connect GitHub → select repo → ingest & analyze → Perplexity research → synthesize GTM report → customize & export.
- Success metrics: activation (repo connect %), conversion (free→paid), time-to-insight (<2 min target), report quality (NPS), retention.
- Scope: logo/icon set, onboarding illustrations, report templates (PDF/Markdown), sample reports/demo data, design system, full page & feature set enumerated above.
- Key challenges & mitigations: LLM hallucinations (structured prompts + citations), security/privacy (sanitization + retention controls), API rate limits (caching + queues), export quotas & billing controls.

End of blueprint.

## Implementation Notes

When implementing this project:

1. **Follow Universal Guidelines**: Use the design best practices documented above as your foundation
2. **Apply Project Customizations**: Implement the specific design requirements stated in the "User Design Requirements" section
3. **Priority Order**: Project-specific requirements override universal guidelines when there's a conflict
4. **Color System**: Extract and implement color values as CSS custom properties in RGB format
5. **Typography**: Define font families, sizes, and weights based on specifications
6. **Spacing**: Establish consistent spacing scale following the design system
7. **Components**: Style all Shadcn components to match the design aesthetic
8. **Animations**: Use Motion library for transitions matching the design personality
9. **Responsive Design**: Ensure mobile-first responsive implementation

## Implementation Checklist

- [ ] Review universal design guidelines above
- [ ] Extract project-specific color palette and define CSS variables
- [ ] Configure Tailwind theme with custom colors
- [ ] Set up typography system (fonts, sizes, weights)
- [ ] Define spacing and sizing scales
- [ ] Create component variants matching design
- [ ] Implement responsive breakpoints
- [ ] Add animations and transitions
- [ ] Ensure accessibility standards
- [ ] Validate against user design requirements

---

**Remember: Always reference this file for design decisions. Do not use generic or placeholder designs.**
