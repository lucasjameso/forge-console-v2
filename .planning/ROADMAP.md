# Roadmap: Forge Console v2 -- Quality Redesign

## Overview

This milestone transforms the working Forge Console prototype into a premium, Apple-quality command center. The path starts with adopting shadcn/ui as the component foundation (prerequisite for all visual work), then establishes global design standards, redesigns the dashboard, polishes every remaining page, builds the three major feature additions (brain dump task flow, content pipeline depth, social media/podcast tracking), adds mobile capture as an independent route, and ships to Cloudflare Pages. Every phase delivers a coherent, verifiable capability that builds on the previous.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Component Foundation** - Adopt shadcn/ui with design token mapping, toast system, error boundaries, and favicon
- [ ] **Phase 2: Global Design Standards** - Establish sidebar polish, card system, typography hierarchy, and spacing rules app-wide
- [ ] **Phase 3: Dashboard Redesign** - Rebuild dashboard with dense grid layout, stat hierarchy, project indicators, and content calendar strip
- [ ] **Phase 4: Page-by-Page Visual Polish** - Apply design standards to all remaining pages (Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings)
- [ ] **Phase 5: Brain Dump Task Flow** - Wire parsed brain dump tasks into project boards with assign, create, batch process, and bulk actions
- [ ] **Phase 6: Content Pipeline Features** - Add caption editing, Slack webhook integration, and kanban drag-and-drop
- [ ] **Phase 7: Social Media and Podcast** - Build cross-platform content calendar and podcast guest tracker with pipeline management
- [ ] **Phase 8: Mobile Capture** - Purpose-built /capture route for iPhone quick-capture with optimistic submit
- [ ] **Phase 9: Deployment and Hardening** - Claude API proxy, Cloudflare Pages deployment, production env vars, and smoke test

## Phase Details

### Phase 1: Component Foundation
**Goal**: The app runs on shadcn/ui primitives with a unified design token system, consistent feedback via toasts, graceful error handling, and a branded favicon
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05
**Success Criteria** (what must be TRUE):
  1. All buttons, cards, badges, inputs, and form elements render as shadcn/ui components with Forge Console design tokens (coral primary, navy accent, Inter font)
  2. Every mutating user action (save, create, delete, approve, reject) triggers a visible toast notification confirming the result
  3. Navigating to a page with a simulated error shows a graceful fallback UI instead of a white screen
  4. The browser tab displays a coral F on navy background as the favicon
  5. No orphaned custom CSS component classes remain in globals.css (all replaced by shadcn primitives)
**Plans**: 3 plans

Plans:
- [x] 01-01-PLAN.md -- shadcn/ui init, token bridge, font migration, favicon
- [x] 01-02-PLAN.md -- Install all shadcn components, Badge/Skeleton migration, CSS cleanup
- [x] 01-03-PLAN.md -- Toast notifications on all mutations, error boundaries

### Phase 2: Global Design Standards
**Goal**: Every page in the app shares consistent sidebar polish, card styling, typography hierarchy, and spacing -- establishing the visual quality bar
**Depends on**: Phase 1
**Requirements**: VISL-01, VISL-02, VISL-03, VISL-04
**Success Criteria** (what must be TRUE):
  1. Sidebar has refined spacing, visual weight, and premium feel that matches the shadcn design system
  2. All cards across every page use 24px padding, 14px radius, 1px border, and subtle hover shadow (0 2px 8px rgba(0,0,0,0.06))
  3. Typography hierarchy is consistent everywhere: 28px page titles, 18px section headers, 15px card titles, 14px body text, 12px meta text
  4. Section gaps are 32-40px and card gaps are 20-24px uniformly across all pages
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md -- Warm palette tokens, typography classes, Card/Button component fixes
- [x] 02-02-PLAN.md -- Sidebar refinement with Sheet mobile drawer, PageShell max-width
- [x] 02-03-PLAN.md -- Card/Button/fontSize migration sweep across all pages and components

### Phase 3: Dashboard Redesign
**Goal**: The dashboard is a dense, scannable command center that surfaces project health, action items, and upcoming content at a glance
**Depends on**: Phase 2
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Success Criteria** (what must be TRUE):
  1. Dashboard renders a 2-3 column grid at 1440px+ with clear visual hierarchy between sections
  2. Key stats (tasks, posts, brain dumps) display as large 36px numbers with small labels, scannable in under 2 seconds
  3. Project cards show color-coded "days since last activity" indicators (green under 24h, amber 1-3 days, red over 3 days)
  4. A 7-day content calendar strip shows upcoming scheduled posts inline on the dashboard
  5. Action items from all projects appear aggregated and sorted by urgency
**Plans**: 2 plans

Plans:
- [x] 03-01-PLAN.md -- Stat tiles row, system health strip, action items cap, dashboard layout rebuild
- [ ] 03-02-PLAN.md -- Project cards with days-since indicators, 7-day content calendar strip

### Phase 4: Page-by-Page Visual Polish
**Goal**: Every remaining page (Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings) meets the same premium quality bar as the dashboard
**Depends on**: Phase 3
**Requirements**: VISL-05, VISL-06, VISL-07, VISL-08, VISL-09, VISL-10, VISL-11
**Success Criteria** (what must be TRUE):
  1. Projects page has proper card breathing room, consistent spacing, and polished visual presentation
  2. ProjectDetail page renders with command-center depth showing project status, task board, and activity in a dense but clear layout
  3. BrainDump page has clear visual flow from input to parsed results to pending tasks
  4. ContentPipeline page looks polished across all 4 view modes (list, week, month, kanban)
  5. SocialMedia, ActivityLog, and Settings pages all meet the design system standards with proper card layouts, timeline spacing, and integration card presentation
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD
- [ ] 04-03: TBD

### Phase 5: Brain Dump Task Flow
**Goal**: Parsed brain dump tasks flow seamlessly into project task boards, completing the capture-to-action pipeline
**Depends on**: Phase 4
**Requirements**: BRAIN-01, BRAIN-02, BRAIN-03, BRAIN-04, BRAIN-05
**Success Criteria** (what must be TRUE):
  1. Each parsed brain dump task shows an "Assign to [Project]" action that lists all active projects
  2. Assigning a brain dump task creates a real task on the target project's kanban board and the task appears immediately
  3. Claude API parsing detects project context from task content and suggests the matching project
  4. A batch processing view shows all unprocessed tasks grouped by their source brain dump
  5. User can select multiple pending tasks and bulk assign or dismiss them in one action
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Content Pipeline Features
**Goal**: The content pipeline supports the full review workflow with inline editing, Slack notifications, and drag-and-drop kanban management
**Depends on**: Phase 4
**Requirements**: CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. User can click a post caption in the content detail view, edit it inline, and save or cancel the change
  2. Approving a content item fires a Slack webhook to #content-queue with the post title and new status
  3. Rejecting a content item fires a Slack webhook to #content-queue with the post title, status, and feedback
  4. User can drag content cards between status columns in kanban view and the status updates persist
**Plans**: TBD

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Social Media and Podcast
**Goal**: The social media page becomes a cross-platform content hub with calendar visibility and podcast guest pipeline management
**Depends on**: Phase 4
**Requirements**: SOCL-01, SOCL-02, SOCL-03, SOCL-04
**Success Criteria** (what must be TRUE):
  1. A cross-platform content calendar shows what is posted where and when, color-coded by platform (LinkedIn, Twitter, etc.)
  2. Podcast guest tracker displays a pipeline table with outreach, scheduled, recorded, and published status columns
  3. User can edit dates and notes on podcast entries inline without navigating away
  4. Platform cards show posting cadence as a progress indicator (posts this week vs target)
**Plans**: TBD

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Mobile Capture
**Goal**: Lucas can pull out his iPhone, type a thought into a purpose-built capture screen, and close the app -- the thought lands in brain dumps for later desktop processing
**Depends on**: Phase 1
**Requirements**: MOBL-01, MOBL-02, MOBL-03, MOBL-04
**Success Criteria** (what must be TRUE):
  1. Navigating to /capture shows a mobile-optimized layout with no sidebar and no desktop navigation
  2. The capture screen has a large text input area and a big submit button that are easy to tap on iPhone
  3. Tapping submit shows "Saved" immediately (optimistic) while the data syncs in the background
  4. Captured text appears in the brain_dumps table and is visible on the desktop BrainDump page for processing
**Plans**: TBD

Plans:
- [ ] 08-01: TBD

### Phase 9: Deployment and Hardening
**Goal**: Forge Console v2 is live on Cloudflare Pages with production environment variables, a Claude API proxy protecting the API key, and a passing smoke test
**Depends on**: Phase 8
**Requirements**: DEPL-01, DEPL-02, DEPL-03, DEPL-04
**Success Criteria** (what must be TRUE):
  1. Claude API calls route through a Cloudflare Function proxy so the API key is never in the client bundle
  2. The production build deploys to Cloudflare Pages via Wrangler without errors
  3. All environment variables (Supabase, Claude, n8n, Slack) are configured in the Cloudflare Pages dashboard
  4. A smoke test on the live Cloudflare Pages URL confirms all pages load, navigation works, and data displays
**Plans**: TBD

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7 -> 8 -> 9
Note: Phases 5, 6, 7 all depend on Phase 4 but not on each other. Phase 8 depends only on Phase 1.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Component Foundation | 0/3 | Planning complete | - |
| 2. Global Design Standards | 0/3 | Planning complete | - |
| 3. Dashboard Redesign | 0/0 | Not started | - |
| 4. Page-by-Page Visual Polish | 0/0 | Not started | - |
| 5. Brain Dump Task Flow | 0/0 | Not started | - |
| 6. Content Pipeline Features | 0/0 | Not started | - |
| 7. Social Media and Podcast | 0/0 | Not started | - |
| 8. Mobile Capture | 0/0 | Not started | - |
| 9. Deployment and Hardening | 0/0 | Not started | - |
