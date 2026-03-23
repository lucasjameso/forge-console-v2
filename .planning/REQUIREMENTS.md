# Requirements: Forge Console v2 -- Quality Redesign

**Defined:** 2026-03-22
**Core Value:** Every page feels like a premium, Apple-quality product -- dense with useful information but visually clean and organized
**Feedback Source:** 150 items captured via page feedback system on 2026-03-22

## v1 Requirements

Requirements for this milestone. Each maps to roadmap phases.

### Component Foundation (Phase 1 -- Complete)

- [x] **FOUN-01**: shadcn/ui adopted with CSS variable token mapping bridging existing design system to shadcn conventions
- [x] **FOUN-02**: All custom CSS component classes (buttons, cards, badges, inputs) replaced with shadcn/ui primitives
- [x] **FOUN-03**: Toast notifications (sonner) fire on every user action (approve, reject, save, create, delete)
- [x] **FOUN-04**: Error boundaries wrap every page and critical sections with graceful fallback UI
- [x] **FOUN-05**: Favicon shows coral F on navy background in browser tab

### Visual Polish (Phase 2 -- Complete)

- [x] **VISL-01**: Sidebar has proper spacing, visual refinement, and premium feel
- [x] **VISL-02**: All cards use 24px padding, 14px radius, 1px subtle border, hover shadow (0 2px 8px rgba(0,0,0,0.06))
- [x] **VISL-03**: Typography hierarchy consistent across all pages (28px titles, 18px section headers, 15px card titles, 14px body, 12px meta)
- [x] **VISL-04**: Section gaps 32-40px, card gaps 20-24px across all pages

### Dashboard (Phase 3 -- Complete)

- [x] **DASH-01**: Dashboard uses dense grid layout (2-3 columns at 1440px+) with clear typographic hierarchy
- [x] **DASH-02**: Stat numbers rendered large (36px) with small labels, scannable in 2 seconds
- [x] **DASH-03**: Project cards show color-coded "days since" indicators (green <24h, amber 1-3 days, red >3 days)
- [x] **DASH-04**: 7-day content calendar strip shows upcoming posts inline on dashboard
- [x] **DASH-05**: Action items aggregated across all projects with urgency-based sorting
- [x] **DASH-06**: Dashboard has generous whitespace between sections (32-40px gaps) without wasting space

### Visual Polish -- All Pages (Phase 4)

- [ ] **VISL-05**: Projects page polished with proper spacing, card breathing room, and visual refinement
- [ ] **VISL-06**: ProjectDetail page polished with command-center depth and proper information density
- [ ] **VISL-07**: BrainDump page polished with proper spacing and clear visual flow
- [ ] **VISL-08**: ContentPipeline page polished across all 4 view modes
- [ ] **VISL-09**: SocialMedia page polished with proper card layout and spacing
- [ ] **VISL-10**: ActivityLog page polished with proper timeline spacing and filter layout
- [ ] **VISL-11**: Settings page polished with proper integration card layout

#### Dashboard Fixes (Phase 4)

- [ ] **DFIX-01**: Priority badges use correct colors (red=high, amber=medium, green=low), Meridian/Atlas set to medium
- [ ] **DFIX-02**: Progress bars color-coded by health (green=on track, amber=behind, red=critical)
- [ ] **DFIX-03**: Content calendar strip shows intelligent week selection (current if has content, else next)
- [ ] **DFIX-04**: "View all" on action items expands inline instead of navigating to Activity Log
- [ ] **DFIX-05**: Stat tiles have colored recency borders matching project cards
- [ ] **DFIX-06**: CLARITY countdown has threshold-based urgency treatment (amber 14-30d, red <14d)
- [ ] **DFIX-07**: Recency colors verified against activity_log (green <48h, amber 3-5d, red 5d+)
- [ ] **DFIX-08**: Greeting subtitle is dynamic and contextual from real data

#### Brain Dump Fixes (Phase 4)

- [ ] **BFIX-01**: Project selector pill row on capture input with persistent selection
- [ ] **BFIX-02**: Submit button larger with visible keyboard shortcut hint
- [ ] **BFIX-03**: History entries have project-colored left borders and weighted status badges
- [ ] **BFIX-04**: Expanded entries show parsed output with proper formatting and action buttons
- [ ] **BFIX-05**: Status progression visible (Captured -> Parsed -> Tasks Created -> Actioned)
- [ ] **BFIX-06**: Textarea starts at 120px and auto-grows, placeholder shortened
- [ ] **BFIX-07**: Skeleton shimmer with "Parsing..." label during AI processing
- [ ] **BFIX-08**: History grouped by day with day headers and actual timestamps

#### Content Pipeline Fixes (Phase 4)

- [ ] **CFIX-01**: Month view has fixed date headers, visible borders, consistent heights, sticky columns
- [ ] **CFIX-02**: Empty day cells show date number in top-left corner
- [ ] **CFIX-03**: Month/week navigation with forward/back arrows and "Today" button
- [ ] **CFIX-04**: List view cards compact (80-90px) with 1-line truncated description
- [ ] **CFIX-05**: Week groups have stronger visual containers with 32px gaps
- [ ] **CFIX-06**: Kanban empty columns show proper empty state, max-height with scroll
- [ ] **CFIX-07**: Kanban cards have metadata (status badge, date, platform icon, warm styling)
- [ ] **CFIX-08**: Content detail modal 680px+ with editable caption and action buttons
- [ ] **CFIX-09**: Status badges standardized across all views (size, padding, colors)
- [ ] **CFIX-10**: Today indicator present in all 4 views
- [ ] **CFIX-11**: "Text post" shown instead of "0 slides" for non-carousel items
- [ ] **CFIX-12**: "Add Content" button in page header opens creation modal

#### Social Media Fixes (Phase 4)

- [ ] **SFIX-01**: Real platform brand icons (react-icons) replacing all generic Lucide icons
- [ ] **SFIX-02**: Platform cards sized by importance (active=larger, setup=compact 3-per-row)
- [ ] **SFIX-03**: "Setup Needed" banner replaced with badge + amber left border
- [ ] **SFIX-04**: Unset platforms show only icon + name + handle + badge (no zero counts)
- [ ] **SFIX-05**: Overview stats moved to top as hero stat row
- [ ] **SFIX-06**: LinkedIn follower goal shows percentage, green bar, projected date
- [ ] **SFIX-07**: Card content density standardized (active=rich, setup=minimal)
- [ ] **SFIX-08**: CLARITY launch platforms tagged with "Needed for launch" badge
- [ ] **SFIX-09**: External link icons standardized, "View profile" text removed
- [ ] **SFIX-10**: Page subtitle shows dynamic platform/follower counts
- [ ] **SFIX-11**: Adaptive grid layout (2-col active, 3-col setup)
- [ ] **SFIX-12**: Sort dropdown (Priority, Alphabetical, Followers, Last active)

#### Settings Fixes (Phase 4)

- [ ] **STFIX-01**: Integration cards use real brand logos
- [ ] **STFIX-02**: Feedback log renders markdown or strips it with "Read more" toggle
- [ ] **STFIX-03**: Feedback entries compact by default (8-10 per screen), expandable
- [ ] **STFIX-04**: Integration cards show human-readable labels (not env var names)
- [ ] **STFIX-05**: Connected/disconnected visual distinction (green/red borders + badges)
- [ ] **STFIX-06**: All integrations have "Open dashboard" links
- [ ] **STFIX-07**: About section enhanced with build date, commit hash, database stats
- [ ] **STFIX-08**: Page organized into sections (Integrations, Feedback, Preferences, Data, System)
- [ ] **STFIX-09**: "Test connection" button per integration with health check results
- [ ] **STFIX-10**: Feedback filter tabs show count badges, "Open" is default
- [ ] **STFIX-11**: Fix vs suggestion entries have distinct visual treatment (wrench/lightbulb + border color)
- [ ] **STFIX-12**: Feedback page badges color-coded by page identity

#### Activity Log Fixes (Phase 4)

- [ ] **AFIX-01**: Entries grouped by day with sticky headers and count per day
- [ ] **AFIX-02**: Timeline dots color-coded by tool type, significant events get larger dots
- [ ] **AFIX-03**: Three-tier visual weight (major/standard/background entries)
- [ ] **AFIX-04**: Filter chips show clear active/inactive state with count badges
- [ ] **AFIX-05**: Real-time search with debounce, result count, highlighted matches
- [ ] **AFIX-06**: Timestamps standardized (relative <24h, time-only within day groups)
- [ ] **AFIX-07**: Pagination/infinite scroll (20 entries per batch) with total count
- [ ] **AFIX-08**: Project badges use consistent per-project colors across app
- [ ] **AFIX-09**: Activity density heatmap/bar chart at top (14-day, stacked by project)
- [ ] **AFIX-10**: Tool badges visually distinct from project badges (different shape + icon)
- [ ] **AFIX-11**: Entry text truncated to 1 line, bold first phrase, expand on click
- [ ] **AFIX-12**: "Log activity" button for manual entries

### Brain Dump Depth (Phase 5)

- [ ] **BSUG-01**: Brain dump history filterable by project with tabs and count badges
- [ ] **BSUG-02**: 5-stage agent refinement workflow (Capture -> Parse -> Refine -> Approve -> Action)
- [ ] **BSUG-03**: Rapid-fire dumps within 10min grouped into sessions
- [ ] **BSUG-04**: Voice capture via Web Speech API with dictation indicator
- [ ] **BSUG-05**: Smart project detection with confidence indicator and correction
- [ ] **BSUG-06**: Inline task creation from parsed output with "Create all" batch button
- [ ] **BSUG-07**: Analytics strip showing capture count, action rate, and project breakdown
- [ ] **BSUG-08**: Cross-project brain dump linking (single dump -> multiple project tasks)
- [ ] **BSUG-09**: Recurring brain dump templates as clickable pills
- [ ] **BSUG-10**: "Dispatch to agent" button for agent workflow integration
- [ ] **BSUG-11**: Full-text search across all brain dumps
- [ ] **BSUG-12**: Export brain dump session as markdown document

### Content Pipeline Depth (Phase 6)

- [ ] **CSUG-01**: Full calendar navigation with month/year browsing and slide animations
- [ ] **CSUG-02**: Drag-and-drop content rescheduling in month and week views
- [ ] **CSUG-03**: Carousel slide preview with image thumbnails in detail modal
- [ ] **CSUG-04**: Inline caption editing with character count and AI refinement
- [ ] **CSUG-05**: Bulk actions via floating action bar (approve all, reschedule, delete)
- [ ] **CSUG-06**: Content performance tracking post-publish (impressions, engagement)
- [ ] **CSUG-07**: Content templates and recurring series with tags
- [ ] **CSUG-08**: Multi-platform content management with per-platform tabs
- [ ] **CSUG-09**: Content approval workflow with two-way Slack integration
- [ ] **CSUG-10**: Publishing scheduler with optimal time suggestions
- [ ] **CSUG-11**: Revision history with side-by-side diff and revert
- [ ] **CSUG-12**: Content calendar analytics strip (monthly summary, cadence, gap alerts)

### Social Media + Activity Log (Phase 7)

- [ ] **SSUG-01**: Platform setup wizard with step-by-step checklists stored in Supabase
- [ ] **SSUG-02**: Follower growth tracking with sparklines and historical chart
- [ ] **SSUG-03**: Cross-platform content calendar integration on Social Media page
- [ ] **SSUG-04**: Podcast guest tracker with pipeline management
- [ ] **SSUG-05**: Platform health scoring system with circular progress rings
- [ ] **SSUG-06**: Quick-post composer per platform
- [ ] **SSUG-07**: Handle availability checker for new platform setup
- [ ] **SSUG-08**: Platform grouping by purpose (Primary/Launch/Brand/Exploration)
- [ ] **SSUG-09**: Social media analytics dashboard (aggregated cross-platform)
- [ ] **SSUG-10**: Competitor/inspiration tracking section
- [ ] **SSUG-11**: Platform connection status monitoring with health checks
- [ ] **SSUG-12**: Social media playbook integration with per-platform strategy notes
- [ ] **ASUG-01**: Daily and weekly auto-generated progress summaries
- [ ] **ASUG-02**: Activity timeline with visual branches per project
- [ ] **ASUG-03**: Session grouping with duration tracking
- [ ] **ASUG-04**: Date range filtering with calendar picker and presets
- [ ] **ASUG-05**: Activity entry detail expansion with related context links
- [ ] **ASUG-06**: Productivity analytics (activity by hour, project, tool, streaks, velocity)
- [ ] **ASUG-07**: Real-time activity feed via Supabase Realtime
- [ ] **ASUG-08**: Export activity log as formatted report
- [ ] **ASUG-09**: Saved filter presets for quick-access views
- [ ] **ASUG-10**: Agent audit trail with approve/revert on agent actions
- [ ] **ASUG-11**: Pinned/starred important entries with gold border
- [ ] **ASUG-12**: Activity notifications and daily digest via Slack

### Dashboard + Project Detail Power Features (Phase 8)

- [ ] **DSUG-01**: Quick Capture bar on Dashboard ("/" focus, project routing, background parsing)
- [ ] **DSUG-02**: Project cards surface #1 blocker inline
- [ ] **DSUG-03**: Today's Focus section with pinnable tasks and daily reset
- [ ] **DSUG-04**: Project cards link directly to GitHub repos via octocat icon
- [ ] **DSUG-05**: Content calendar empty days open "Schedule content" flow
- [ ] **DSUG-06**: "F" keyboard shortcut for feedback widget from any page
- [ ] **DSUG-07**: System health strip clickable with detail popups
- [ ] **DSUG-08**: Projects section split into Core Builds and Corporate Platforms
- [ ] **PDSUG-01**: Needs Your Attention as interactive command center (resolve, snooze, expand)
- [ ] **PDSUG-02**: Progress section as visual roadmap with clickable milestones
- [ ] **PDSUG-03**: Recent Activity timeline with impact indicators
- [ ] **PDSUG-04**: Kanban board with drag-and-drop, inline add, task count
- [ ] **PDSUG-05**: Task detail modal (Linear-quality) with metadata, description, subtasks
- [ ] **PDSUG-06**: Subtask system with checkboxes, progress bar, completion logging
- [ ] **PDSUG-07**: Notes & Decisions section with typed tags and markdown
- [ ] **PDSUG-08**: Linked Resources as living cards with live status
- [ ] **PDSUG-09**: Next Session Prompt as prominent editable handoff document
- [ ] **PDSUG-10**: Dashboard greeting with contextual subtitle from real data
- [ ] **PDSUG-11**: Stat tiles with health-coded colors and urgency animations
- [ ] **PDSUG-12**: System health strip (compact when healthy, expands when degraded)
- [ ] **PDSUG-13**: Action items with inline resolve/snooze and expand
- [ ] **PDSUG-14**: Projects quick glance with Core/Corporate split and enhanced cards
- [ ] **PDSUG-15**: Content calendar strip with intelligent week and today highlight
- [ ] **PDSUG-16**: Dashboard page-level design rules (hierarchy, spacing, loading, keyboard)
- [ ] **PDSUG-17**: Project Detail page-level design rules (sections, spacing, loading, responsive)

### Settings + Mobile Capture + Deployment (Phase 9)

- [ ] **STSUG-01**: Feedback Log as its own page (/feedback) or first tab in Settings
- [ ] **STSUG-02**: Feedback-to-action workflow with Claude Code integration
- [ ] **STSUG-03**: User preferences section (defaults, notifications, date format, compact mode)
- [ ] **STSUG-04**: Data management tools (export, import, clear mock data, database stats)
- [ ] **STSUG-05**: Integration configuration editing (inline, runtime vs build-time labels)
- [ ] **STSUG-06**: Webhook and notification testing panel
- [ ] **STSUG-07**: Agent configuration section (future-ready, scaffolded UI)
- [ ] **STSUG-08**: Appearance and theme settings (dark mode toggle, accent color, font size)
- [ ] **STSUG-09**: Keyboard shortcut reference panel ("?" opens modal overlay)
- [ ] **STSUG-10**: API usage and cost tracking across all integrations
- [ ] **STSUG-11**: System health dashboard (expanded, per-service cards with history)
- [ ] **STSUG-12**: Backup and restore settings (export/import JSON)
- [ ] **MOBL-01**: Purpose-built /capture route with mobile-optimized layout (no sidebar, no desktop nav)
- [ ] **MOBL-02**: Large text input area with big submit button optimized for iPhone
- [ ] **MOBL-03**: Optimistic submit -- shows "Saved" immediately, syncs in background
- [ ] **MOBL-04**: Captured text writes to brain_dumps table for later desktop processing
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
| Dark mode (functional) | Light mode primary. Theme toggle scaffolded in Phase 9 but dark mode deferred. |
| Full responsive mobile layout | Desktop is info-dense by design. Mobile is capture-only (/capture). |
| Social media API posting | OAuth complexity. Compose + copy-to-clipboard for now. |
| Email integration | Out of scope. Brain dump captures email tasks. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUN-01 | Phase 1: Component Foundation | Complete |
| FOUN-02 | Phase 1: Component Foundation | Complete |
| FOUN-03 | Phase 1: Component Foundation | Complete |
| FOUN-04 | Phase 1: Component Foundation | Complete |
| FOUN-05 | Phase 1: Component Foundation | Complete |
| VISL-01 | Phase 2: Global Design Standards | Complete |
| VISL-02 | Phase 2: Global Design Standards | Complete |
| VISL-03 | Phase 2: Global Design Standards | Complete |
| VISL-04 | Phase 2: Global Design Standards | Complete |
| DASH-01 | Phase 3: Dashboard Redesign | Complete |
| DASH-02 | Phase 3: Dashboard Redesign | Complete |
| DASH-03 | Phase 3: Dashboard Redesign | Complete |
| DASH-04 | Phase 3: Dashboard Redesign | Complete |
| DASH-05 | Phase 3: Dashboard Redesign | Complete |
| DASH-06 | Phase 3: Dashboard Redesign | Complete |
| VISL-05 through VISL-11 | Phase 4: Visual Polish | Pending |
| DFIX-01 through DFIX-08 | Phase 4: Visual Polish | Pending |
| BFIX-01 through BFIX-08 | Phase 4: Visual Polish | Pending |
| CFIX-01 through CFIX-12 | Phase 4: Visual Polish | Pending |
| SFIX-01 through SFIX-12 | Phase 4: Visual Polish | Pending |
| STFIX-01 through STFIX-12 | Phase 4: Visual Polish | Pending |
| AFIX-01 through AFIX-12 | Phase 4: Visual Polish | Pending |
| BSUG-01 through BSUG-12 | Phase 5: Brain Dump Depth | Pending |
| CSUG-01 through CSUG-12 | Phase 6: Content Pipeline Depth | Pending |
| SSUG-01 through SSUG-12 | Phase 7: Social Media + Activity Log | Pending |
| ASUG-01 through ASUG-12 | Phase 7: Social Media + Activity Log | Pending |
| DSUG-01 through DSUG-08 | Phase 8: Dashboard + Project Detail Power | Pending |
| PDSUG-01 through PDSUG-17 | Phase 8: Dashboard + Project Detail Power | Pending |
| STSUG-01 through STSUG-12 | Phase 9: Settings + Mobile + Deploy | Pending |
| MOBL-01 through MOBL-04 | Phase 9: Settings + Mobile + Deploy | Pending |
| DEPL-01 through DEPL-04 | Phase 9: Settings + Mobile + Deploy | Pending |

**Coverage:**
- v1 requirements: 150 total (17 original + 133 from feedback)
- Phases 1-3 complete: 17 requirements satisfied
- Phases 4-9 pending: 133 requirements mapped
- Unmapped: 0

---
*Requirements defined: 2026-03-22*
*Last updated: 2026-03-22 after feedback integration and roadmap consolidation*
