# Roadmap: Forge Console v2 -- Quality Redesign

## Overview

This milestone transforms the working Forge Console prototype into a premium, Apple-quality command center. The path starts with adopting shadcn/ui as the component foundation (prerequisite for all visual work), then establishes global design standards, redesigns the dashboard, fixes every visual and UX issue across all pages, builds deep feature additions for every major page, adds shared interactive components for Dashboard and Project Detail, and ships with settings depth, mobile capture, and production deployment. Every phase delivers a coherent, verifiable capability that builds on the previous.

**Feedback-Driven:** Phases 4-9 are enriched with 150 specific feedback items captured via the page feedback system on 2026-03-22. Authoritative specs live in `.planning/feedback/PHASE-{NN}-*-SPEC.md`.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Component Foundation** - Adopt shadcn/ui with design token mapping, toast system, error boundaries, and favicon
- [x] **Phase 2: Global Design Standards** - Establish sidebar polish, card system, typography hierarchy, and spacing rules app-wide
- [x] **Phase 3: Dashboard Redesign** - Rebuild dashboard with dense grid layout, stat hierarchy, project indicators, and content calendar strip
- [ ] **Phase 4: Visual Polish (All Pages)** - Fix every visual, UX, and data issue across all 7 pages (64 fix items from feedback)
- [ ] **Phase 4.1: UAT Remediation** - Fix 51 UAT gaps (2 blockers, 30 major, 19 minor) across all 7 pages
- [ ] **Phase 5: Brain Dump Depth** - Transform brain dump from simple capture into full thought-to-action pipeline with project routing, agent refinement, and task creation
- [ ] **Phase 6: Content Pipeline Depth** - Transform content pipeline into a full content management and publishing workflow with calendar nav, drag-drop, templates, and analytics
- [ ] **Phase 7: Social Media + Activity Log** - Transform both pages from static directories into dynamic dashboards with setup wizards, growth tracking, session grouping, and real-time updates
- [ ] **Phase 8: Dashboard + Project Detail Power Features** - Build shared interactive components (task modals, action items, quick capture, subtask system, kanban board) powering both command centers
- [ ] **Phase 9: Settings + Feedback Page + Mobile Capture + Deployment** - Complete the app with settings depth, dedicated feedback page, mobile capture route, and Cloudflare Pages deployment

## Phase Details

### Phase 1: Component Foundation
**Goal**: The app runs on shadcn/ui primitives with a unified design token system, consistent feedback via toasts, graceful error handling, and a branded favicon
**Depends on**: Nothing (first phase)
**Requirements**: FOUN-01, FOUN-02, FOUN-03, FOUN-04, FOUN-05
**Status**: Complete
**Success Criteria** (what must be TRUE):
  1. All buttons, cards, badges, inputs, and form elements render as shadcn/ui components with Forge Console design tokens (coral primary, navy accent, Inter font)
  2. Every mutating user action (save, create, delete, approve, reject) triggers a visible toast notification confirming the result
  3. Navigating to a page with a simulated error shows a graceful fallback UI instead of a white screen
  4. The browser tab displays a coral F on navy background as the favicon
  5. No orphaned custom CSS component classes remain in globals.css (all replaced by shadcn primitives)

Plans:
- [x] 01-01-PLAN.md -- shadcn/ui init, token bridge, font migration, favicon
- [x] 01-02-PLAN.md -- Install all shadcn components, Badge/Skeleton migration, CSS cleanup
- [x] 01-03-PLAN.md -- Toast notifications on all mutations, error boundaries

### Phase 2: Global Design Standards
**Goal**: Every page in the app shares consistent sidebar polish, card styling, typography hierarchy, and spacing -- establishing the visual quality bar
**Depends on**: Phase 1
**Requirements**: VISL-01, VISL-02, VISL-03, VISL-04
**Status**: Complete
**Success Criteria** (what must be TRUE):
  1. Sidebar has refined spacing, visual weight, and premium feel that matches the shadcn design system
  2. All cards across every page use 24px padding, 14px radius, 1px border, and subtle hover shadow (0 2px 8px rgba(0,0,0,0.06))
  3. Typography hierarchy is consistent everywhere: 28px page titles, 18px section headers, 15px card titles, 14px body text, 12px meta text
  4. Section gaps are 32-40px and card gaps are 20-24px uniformly across all pages

Plans:
- [x] 02-01-PLAN.md -- Warm palette tokens, typography classes, Card/Button component fixes
- [x] 02-02-PLAN.md -- Sidebar refinement with Sheet mobile drawer, PageShell max-width
- [x] 02-03-PLAN.md -- Card/Button/fontSize migration sweep across all pages and components

### Phase 3: Dashboard Redesign
**Goal**: The dashboard is a dense, scannable command center that surfaces project health, action items, and upcoming content at a glance
**Depends on**: Phase 2
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06
**Status**: Complete
**Success Criteria** (what must be TRUE):
  1. Dashboard renders a 2-3 column grid at 1440px+ with clear visual hierarchy between sections
  2. Key stats (tasks, posts, brain dumps) display as large 36px numbers with small labels, scannable in under 2 seconds
  3. Project cards show color-coded "days since last activity" indicators (green under 24h, amber 1-3 days, red over 3 days)
  4. A 7-day content calendar strip shows upcoming scheduled posts inline on the dashboard
  5. Action items from all projects appear aggregated and sorted by urgency

Plans:
- [x] 03-01-PLAN.md -- Stat tiles row, system health strip, action items cap, dashboard layout rebuild
- [x] 03-02-PLAN.md -- Project cards with days-since indicators, 7-day content calendar strip

### Phase 4: Visual Polish (All Pages)
**Goal**: Fix every visual, UX, and data issue identified across all 7 pages so every screen meets the premium quality bar
**Depends on**: Phase 3
**Requirements**: VISL-05, VISL-06, VISL-07, VISL-08, VISL-09, VISL-10, VISL-11, DFIX-01 through DFIX-08, BFIX-01 through BFIX-08, CFIX-01 through CFIX-12, SFIX-01 through SFIX-12, STFIX-01 through STFIX-12, AFIX-01 through AFIX-12
**Feedback Spec**: `.planning/feedback/PHASE-04-FIXES-SPEC.md` (64 items)
**Plans:** 6 plans
**Success Criteria** (what must be TRUE):
  1. Dashboard: priority badges use correct colors (red/amber/green), progress bars reflect project health, content calendar shows intelligent week, greeting is contextual
  2. Brain Dump: project selector on input, history grouped by day with project colors, expanded entries show parsed output properly, processing shimmer visible
  3. Content Pipeline: month view is a real calendar with dates on every cell, navigation arrows, today indicator, consistent status badges, "Add Content" button
  4. Social Media: real brand icons on all platforms, cards sized by importance, stats moved to top, CLARITY launch badges, consistent density
  5. Activity Log: entries grouped by day with sticky headers, tiered visual weight, color-coded dots, real-time search, pagination
  6. Settings: brand logos on integrations, feedback log compact with markdown rendering, connection test buttons, organized sections
  7. All pages use consistent project badge colors, recency indicators, and status badge styling

Plans:
- [x] 04-01-PLAN.md -- Shared foundation: project colors, brand icons, badge components, utilities
- [x] 04-02-PLAN.md -- Dashboard fixes (DFIX-01-08) + Projects/ProjectDetail polish (VISL-05, VISL-06)
- [x] 04-03-PLAN.md -- Brain Dump fixes (BFIX-01-08) + page polish (VISL-07)
- [x] 04-04-PLAN.md -- Content Pipeline fixes (CFIX-01-12) + page polish (VISL-08)
- [x] 04-05-PLAN.md -- Social Media fixes (SFIX-01-12) + Settings fixes (STFIX-01-12) + polish (VISL-09, VISL-11)
- [x] 04-06-PLAN.md -- Activity Log fixes (AFIX-01-12) + page polish (VISL-10)

### Phase 04.1: Phase 4 UAT Remediation -- 51 gaps (2 blockers, 30 major, 19 minor) across all 7 pages (INSERTED)

**Goal:** Close all 51 UAT gaps from Phase 4 testing -- fix both blockers (Brain Dump API parsing, Content Pipeline review modal), resolve 30 major visual/UX issues, and polish 19 minor items across all 7 pages
**Requirements**: UAT-GLOBAL-BORDER-RADIUS, UAT-DEPS, UAT-DASH-STAT-TILES-GRID, UAT-DASH-STAT-TILES-LEFT-BORDER, UAT-DASH-CLARITY-PULSE, UAT-DASH-ACTION-ITEMS-INTERACTIVE, UAT-DASH-ACTION-ITEMS-COMPACT, UAT-DASH-CALENDAR-HEIGHT, UAT-DASH-CALENDAR-TYPE, UAT-DASH-GREETING-INSIGHTS, UAT-BRAIN-API-BLOCKER, UAT-BRAIN-ADD-PROJECT, UAT-BRAIN-SUBMIT-STATE, UAT-BRAIN-STEP-PROGRESS, UAT-BRAIN-INLINE-ACTIONS, UAT-BRAIN-PROJECT-BORDERS, UAT-BRAIN-STICKY-HEADERS, UAT-CONTENT-REVIEW-MODAL-BLOCKER, UAT-CONTENT-REJECT-WORKFLOW, UAT-CONTENT-APPROVE-WORKFLOW, UAT-CONTENT-CALENDAR-RESPONSIVE, UAT-CONTENT-BORDER-RADIUS, UAT-CONTENT-ADD-MODAL, UAT-CONTENT-KANBAN-DRAG, UAT-CONTENT-MULTI-PLATFORM, UAT-CONTENT-DETAIL-ALL-VIEWS, UAT-SOCIAL-BRAND-ICONS, UAT-SOCIAL-MEDIUM-DATA, UAT-SOCIAL-CARD-SIZE, UAT-SOCIAL-SETUP-MODAL, UAT-SOCIAL-ACTIVE-DATA, UAT-SOCIAL-HERO-READINESS, UAT-SOCIAL-EXTERNAL-LINKS, UAT-SOCIAL-BORDER-RADIUS, UAT-SETTINGS-TEST-BUTTONS, UAT-SETTINGS-FEEDBACK-MARKDOWN, UAT-SETTINGS-FEEDBACK-ACTIONS, UAT-SETTINGS-SYSTEM-TAB, UAT-SETTINGS-GRAYED-TABS, UAT-SETTINGS-BRAND-ICONS, UAT-SETTINGS-BORDER-RADIUS, UAT-ACTIVITY-DENSITY-CHART, UAT-ACTIVITY-TIERS, UAT-ACTIVITY-CLICKABLE, UAT-ACTIVITY-DOT-LEGEND, UAT-ACTIVITY-DATE-FILTER, UAT-ACTIVITY-ALIGNMENT, UAT-ACTIVITY-MANUAL-ENTRY, UAT-ACTIVITY-STICKY-HEADERS, UAT-ACTIVITY-BORDER-RADIUS, UAT-ACTIVITY-LOAD-MORE
**Depends on:** Phase 4
**Plans:** 1/8 plans executed
**Success Criteria** (what must be TRUE):
  1. Border radius halved globally -- clean and modern across all pages
  2. Brain Dump Claude API parsing works reliably (BLOCKER resolved)
  3. Content review modal shows full post body, char count, copy buttons, approve/reject workflows (BLOCKER resolved)
  4. Dashboard stat tiles use CSS grid with equal sizing, left accent borders, interactive action items
  5. Social Media platforms show real brand icons with equal card sizing and setup modals
  6. Activity Log has tall density chart, three visual tiers, date filters, and manual entry form
  7. Settings has working Claude API test, markdown feedback, enriched system tab
  8. Content Pipeline has redesigned Add Content modal, draggable Kanban, multi-platform support

Plans:
- [x] 04.1-01-PLAN.md -- Global border-radius fix + install new dependencies
- [ ] 04.1-02-PLAN.md -- Dashboard fixes: stat tiles, action items, calendar, greeting
- [ ] 04.1-03-PLAN.md -- Brain Dump fixes: API blocker, task cards, step progress, history
- [ ] 04.1-04-PLAN.md -- Social Media fixes: brand icons, card sizing, setup modals, data
- [ ] 04.1-05-PLAN.md -- Activity Log fixes: density chart, tiers, filters, manual entry
- [ ] 04.1-06-PLAN.md -- Content Pipeline: review modal blocker, approve/reject, responsive calendar
- [ ] 04.1-07-PLAN.md -- Content Pipeline: Add Content modal, Kanban drag, multi-platform
- [ ] 04.1-08-PLAN.md -- Settings fixes: integration tests, feedback markdown, system tab

### Phase 5: Brain Dump Depth
**Goal**: Transform Brain Dump from a simple capture tool into a full thought-to-action pipeline with project routing, AI refinement, task creation, and analytics
**Depends on**: Phase 4
**Requirements**: BRAIN-01 through BRAIN-12, BSUG-01 through BSUG-12
**Feedback Spec**: `.planning/feedback/PHASE-05-BRAIN-DUMP-SPEC.md` (12 suggestions)
**Success Criteria** (what must be TRUE):
  1. Each brain dump can be routed to a specific project via selector pills that persist between submissions
  2. The 5-stage pipeline (Capture -> Parse -> Refine -> Approve -> Action) is visible on each expanded entry
  3. Parsed tasks can be created in project boards with one click ("Create task") or batch ("Create all")
  4. History is filterable by project with count badges, grouped by day, and searchable
  5. Analytics strip shows capture count, action rate, and most active project

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

### Phase 6: Content Pipeline Depth
**Goal**: Transform the content pipeline into a full content management and publishing workflow with calendar navigation, drag-drop rescheduling, AI editing, templates, and analytics
**Depends on**: Phase 4
**Requirements**: CONT-01 through CONT-12, CSUG-01 through CSUG-12
**Feedback Spec**: `.planning/feedback/PHASE-06-CONTENT-PIPELINE-SPEC.md` (12 suggestions)
**Success Criteria** (what must be TRUE):
  1. Calendar navigation allows browsing months forward/back with slide animations and a "Today" button
  2. Content items can be dragged between days in month view to reschedule (updates Supabase, shows toast)
  3. Caption editing in detail modal includes character count and "Refine with AI" integration
  4. Bulk actions (approve all, reschedule, delete) work via floating action bar when items are selected
  5. Analytics strip shows monthly summary, posting cadence indicator, and gap alerts

Plans:
- [ ] 06-01: TBD
- [ ] 06-02: TBD

### Phase 7: Social Media + Activity Log
**Goal**: Transform both pages from static directories into dynamic dashboards with setup wizards, growth tracking, session grouping, and real-time activity updates
**Depends on**: Phase 4
**Requirements**: SOCL-01 through SOCL-12, SSUG-01 through SSUG-12, ASUG-01 through ASUG-12
**Feedback Spec**: `.planning/feedback/PHASE-07-SOCIAL-ACTIVITY-SPEC.md` (24 suggestions)
**Success Criteria** (what must be TRUE):
  1. Social Media: platforms grouped by purpose (Primary/Launch/Brand/Exploration) with collapsible sections
  2. Social Media: podcast guest tracker section with pipeline management
  3. Social Media: follower growth sparklines on active platform cards
  4. Activity Log: daily/weekly auto-generated summaries at top of day groups
  5. Activity Log: session grouping for consecutive Claude Code entries with duration tracking
  6. Activity Log: real-time feed via Supabase Realtime subscriptions

Plans:
- [ ] 07-01: TBD
- [ ] 07-02: TBD

### Phase 8: Dashboard + Project Detail Power Features
**Goal**: Build shared interactive components (task modals, action items, quick capture, subtask system, kanban board) that power both the Dashboard command center and the Project Detail nerve center
**Depends on**: Phase 4
**Requirements**: DSUG-01 through DSUG-08, PDSUG-01 through PDSUG-17
**Feedback Spec**: `.planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md` (25 items)
**Success Criteria** (what must be TRUE):
  1. Quick Capture bar on Dashboard: "/" to focus, project routing, Cmd+Enter submit, background parsing
  2. Action items on both pages: inline resolve/snooze with animations, expand for full context, keyboard navigation
  3. Today's Focus section: pin 2-3 tasks, checkbox completion with strikethrough, daily reset
  4. Kanban board on Project Detail: drag-and-drop between columns, inline add task, task detail modal with subtasks
  5. Task modal (Linear-quality): editable title, metadata pills, description, subtask checkboxes, activity timeline
  6. Notes & Decisions section: tagged entries (Decision/Blocker/Idea/Question), add at top, markdown rendering

Plans:
- [ ] 08-01: TBD
- [ ] 08-02: TBD
- [ ] 08-03: TBD

### Phase 9: Settings + Feedback Page + Mobile Capture + Deployment
**Goal**: Complete the app with settings depth, a dedicated feedback page, purpose-built mobile capture, and production deployment to Cloudflare Pages
**Depends on**: Phase 8
**Requirements**: STSUG-01 through STSUG-12, MOBL-01 through MOBL-04, DEPL-01 through DEPL-04
**Feedback Spec**: `.planning/feedback/PHASE-09-SETTINGS-MOBILE-DEPLOY-SPEC.md` (32 items)
**Success Criteria** (what must be TRUE):
  1. Feedback Log is accessible as its own page (/feedback) with compact entries, markdown rendering, and filter counts
  2. Settings organized into tabs: Integrations, Preferences, Data Management, System Info
  3. Integration cards have test connection buttons showing health and response time
  4. /capture route works on iPhone: large input, big submit, optimistic save, no sidebar
  5. Claude API calls route through Cloudflare Function proxy (no API key in client)
  6. Production build deployed to Cloudflare Pages with all env vars configured and smoke test passing

Plans:
- [ ] 09-01: TBD
- [ ] 09-02: TBD
- [ ] 09-03: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 4.1 -> 5 -> 6 -> 7 -> 8 -> 9
Note: Phases 5, 6, 7, 8 all depend on Phase 4.1 but not on each other. Phase 9 depends on Phase 8.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Component Foundation | 3/3 | Complete | 2026-03-22 |
| 2. Global Design Standards | 3/3 | Complete | 2026-03-22 |
| 3. Dashboard Redesign | 2/2 | Complete | 2026-03-22 |
| 4. Visual Polish (All Pages) | 6/6 | Complete | 2026-03-22 |
| 4.1 UAT Remediation | 0/8 | Not started | - |
| 5. Brain Dump Depth | 0/0 | Not started | - |
| 6. Content Pipeline Depth | 0/0 | Not started | - |
| 7. Social Media + Activity Log | 0/0 | Not started | - |
| 8. Dashboard + Project Detail Power | 0/0 | Not started | - |
| 9. Settings + Mobile + Deployment | 0/0 | Not started | - |
