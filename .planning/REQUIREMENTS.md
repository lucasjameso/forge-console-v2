# Requirements: Forge Console v2 -- Quality Redesign

**Defined:** 2026-03-22
**Core Value:** Every page feels like a premium, Apple-quality product -- dense with useful information but visually clean and organized

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Component Foundation

- [x] **FOUN-01**: shadcn/ui adopted with CSS variable token mapping bridging existing design system to shadcn conventions
- [x] **FOUN-02**: All custom CSS component classes (buttons, cards, badges, inputs) replaced with shadcn/ui primitives
- [x] **FOUN-03**: Toast notifications (sonner) fire on every user action (approve, reject, save, create, delete)
- [x] **FOUN-04**: Error boundaries wrap every page and critical sections with graceful fallback UI
- [x] **FOUN-05**: Favicon shows coral F on navy background in browser tab

### Dashboard

- [ ] **DASH-01**: Dashboard uses dense grid layout (2-3 columns at 1440px+) with clear typographic hierarchy
- [ ] **DASH-02**: Stat numbers rendered large (36px) with small labels, scannable in 2 seconds
- [ ] **DASH-03**: Project cards show color-coded "days since" indicators (green <24h, amber 1-3 days, red >3 days)
- [ ] **DASH-04**: 7-day content calendar strip shows upcoming posts inline on dashboard
- [ ] **DASH-05**: Action items aggregated across all projects with urgency-based sorting
- [ ] **DASH-06**: Dashboard has generous whitespace between sections (32-40px gaps) without wasting space

### Visual Polish

- [ ] **VISL-01**: Sidebar has proper spacing, visual refinement, and premium feel
- [ ] **VISL-02**: All cards use 24px padding, 14px radius, 1px subtle border, hover shadow (0 2px 8px rgba(0,0,0,0.06))
- [ ] **VISL-03**: Typography hierarchy consistent across all pages (28px titles, 18px section headers, 15px card titles, 14px body, 12px meta)
- [ ] **VISL-04**: Section gaps 32-40px, card gaps 20-24px across all pages
- [ ] **VISL-05**: Projects page polished with proper spacing, card breathing room, and visual refinement
- [ ] **VISL-06**: ProjectDetail page polished with command-center depth and proper information density
- [ ] **VISL-07**: BrainDump page polished with proper spacing and clear visual flow
- [ ] **VISL-08**: ContentPipeline page polished across all 4 view modes
- [ ] **VISL-09**: SocialMedia page polished with proper card layout and spacing
- [ ] **VISL-10**: ActivityLog page polished with proper timeline spacing and filter layout
- [ ] **VISL-11**: Settings page polished with proper integration card layout

### Content Pipeline

- [ ] **CONT-01**: User can edit post captions inline in content detail view with save/cancel
- [ ] **CONT-02**: Slack webhook fires to #content-queue on approve with post title and status
- [ ] **CONT-03**: Slack webhook fires to #content-queue on reject with post title, status, and feedback
- [ ] **CONT-04**: User can drag content cards between status columns in kanban view

### Brain Dump

- [ ] **BRAIN-01**: Each parsed brain dump task has an "Assign to [Project]" action
- [ ] **BRAIN-02**: Assigning a brain dump task creates a real task on the target project's kanban board
- [ ] **BRAIN-03**: Claude API parsing detects project context from task content (matches against known project names)
- [ ] **BRAIN-04**: Batch processing view shows all unprocessed brain dump tasks grouped by source dump
- [ ] **BRAIN-05**: User can bulk assign or dismiss pending brain dump tasks

### Social Media

- [ ] **SOCL-01**: Cross-platform content calendar shows what is posted where and when, color-coded by platform
- [ ] **SOCL-02**: Podcast guest tracker table with pipeline columns (outreach/scheduled/recorded/published)
- [ ] **SOCL-03**: Podcast entries have inline date and notes editing
- [ ] **SOCL-04**: Platform cards show posting cadence (posts this week vs target) as progress indicator

### Mobile Capture

- [ ] **MOBL-01**: Purpose-built /capture route with mobile-optimized layout (no sidebar, no desktop nav)
- [ ] **MOBL-02**: Large text input area with big submit button optimized for iPhone
- [ ] **MOBL-03**: Optimistic submit -- shows "Saved" immediately, syncs in background
- [ ] **MOBL-04**: Captured text writes to brain_dumps table for later desktop processing

### Deployment

- [ ] **DEPL-01**: Claude API proxy so API key is not exposed in client bundle
- [ ] **DEPL-02**: Production build deployed to Cloudflare Pages via Wrangler
- [ ] **DEPL-03**: Production environment variables configured in Cloudflare Pages dashboard
- [ ] **DEPL-04**: Smoke test passes on live Cloudflare Pages URL

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Dashboard Enhancements

- **DASH-V2-01**: Command palette (Cmd+K) for instant navigation to any page, project, or action
- **DASH-V2-02**: "Focus block" showing single most important priority derived from urgency + deadline
- **DASH-V2-03**: Stat counters with 7-day sparkline trends (tasks completed, posts, brain dumps)

### Project Enhancements

- **PROJ-V2-01**: Agent dispatch quick actions via n8n webhook from project detail
- **PROJ-V2-02**: Computed project health score (badge: green/amber/red)

### Content Pipeline Enhancements

- **CONT-V2-01**: Content performance annotations (impressions, engagement rate) entered manually post-posting

### Brain Dump Enhancements

- **BRAIN-V2-01**: Offline-capable mobile capture with service worker sync queue

### Activity Log

- **ACTV-V2-01**: Activity log export capability

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Authentication / multi-user | Single user app, no auth needed |
| Dark mode | Light mode primary, design system built for light. CSS variables enable future swap. |
| Full responsive mobile layout | Desktop app is information-dense by design. Mobile is capture-only (/capture). |
| Social media API integrations | OAuth complexity, rate limits, token management for zero value |
| Real-time WebSocket streaming | React Query with 2-min stale time sufficient for single user |
| Drag-and-drop everywhere | Only kanban columns. Click actions elsewhere. |
| Email integration | Out of scope. Brain dump captures email tasks. |
| AI-generated content drafts | AI for parsing only. Content creation stays manual. |
| Complex charting / analytics | Simple sparklines in v2. No chart libraries. |
| Push notifications | Visual indicators + Slack webhook cover critical path |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1: Component Foundation | Complete |
| FOUN-02 | Phase 1: Component Foundation | Complete |
| FOUN-03 | Phase 1: Component Foundation | Complete |
| FOUN-04 | Phase 1: Component Foundation | Complete |
| FOUN-05 | Phase 1: Component Foundation | Complete |
| DASH-01 | Phase 3: Dashboard Redesign | Pending |
| DASH-02 | Phase 3: Dashboard Redesign | Pending |
| DASH-03 | Phase 3: Dashboard Redesign | Pending |
| DASH-04 | Phase 3: Dashboard Redesign | Pending |
| DASH-05 | Phase 3: Dashboard Redesign | Pending |
| DASH-06 | Phase 3: Dashboard Redesign | Pending |
| VISL-01 | Phase 2: Global Design Standards | Pending |
| VISL-02 | Phase 2: Global Design Standards | Pending |
| VISL-03 | Phase 2: Global Design Standards | Pending |
| VISL-04 | Phase 2: Global Design Standards | Pending |
| VISL-05 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-06 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-07 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-08 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-09 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-10 | Phase 4: Page-by-Page Visual Polish | Pending |
| VISL-11 | Phase 4: Page-by-Page Visual Polish | Pending |
| CONT-01 | Phase 6: Content Pipeline Features | Pending |
| CONT-02 | Phase 6: Content Pipeline Features | Pending |
| CONT-03 | Phase 6: Content Pipeline Features | Pending |
| CONT-04 | Phase 6: Content Pipeline Features | Pending |
| BRAIN-01 | Phase 5: Brain Dump Task Flow | Pending |
| BRAIN-02 | Phase 5: Brain Dump Task Flow | Pending |
| BRAIN-03 | Phase 5: Brain Dump Task Flow | Pending |
| BRAIN-04 | Phase 5: Brain Dump Task Flow | Pending |
| BRAIN-05 | Phase 5: Brain Dump Task Flow | Pending |
| SOCL-01 | Phase 7: Social Media and Podcast | Pending |
| SOCL-02 | Phase 7: Social Media and Podcast | Pending |
| SOCL-03 | Phase 7: Social Media and Podcast | Pending |
| SOCL-04 | Phase 7: Social Media and Podcast | Pending |
| MOBL-01 | Phase 8: Mobile Capture | Pending |
| MOBL-02 | Phase 8: Mobile Capture | Pending |
| MOBL-03 | Phase 8: Mobile Capture | Pending |
| MOBL-04 | Phase 8: Mobile Capture | Pending |
| DEPL-01 | Phase 9: Deployment and Hardening | Pending |
| DEPL-02 | Phase 9: Deployment and Hardening | Pending |
| DEPL-03 | Phase 9: Deployment and Hardening | Pending |
| DEPL-04 | Phase 9: Deployment and Hardening | Pending |

**Coverage:**
- v1 requirements: 43 total
- Mapped to phases: 43
- Unmapped: 0

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after roadmap creation*
