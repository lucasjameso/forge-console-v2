# Phase 3: Dashboard Redesign - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Rebuild the dashboard into a dense, scannable command center. The layout changes from the current 2fr/1fr grid to full-width stacked rows with a stat tile row, compact system health strip, capped action items, 3-col project cards with recency indicators, and a 7-day content calendar strip. After this phase, the dashboard is the premium first-impression page Lucas opens every morning.

</domain>

<decisions>
## Implementation Decisions

### Stat Block (Hero Row)
- **D-01:** Five standalone mini-cards in a full-width row across the top. No shared card wrapper -- each stat is its own tile with visual weight, like Apple Health stat rings.
- **D-02:** The five stats are:
  1. Ridgeline Intelligence progress % (e.g., "42%")
  2. CLARITY Book Launch progress % (e.g., "68%")
  3. Forge Console progress % (e.g., "15%")
  4. Pending content approvals count
  5. CLARITY launch countdown (days to April 17, 2026) -- hardcoded, manually updated when priorities shift
- **D-03:** Numbers render at 36px (text-stat class) with small labels below. Scannable in 2 seconds.
- **D-04:** Keep OUT of hero area: total task count, brain dump count, follower counts, system health. Five stats max.

### Grid Layout and Information Hierarchy
- **D-05:** Full-width stacked rows, NOT multi-column layout. At 1280px max-width, the scan order top to bottom:
  1. Stat tiles row (5 equal tiles spanning full width)
  2. System health strip (compact horizontal bar, not a card)
  3. Action items (full width, fixed height)
  4. Project cards (3-col grid within full-width row)
  5. Content calendar strip (full width)
- **D-06:** This is a row-based layout. No side-by-side competition between sections. Every section gets its own full-width row to breathe.

### System Health Strip
- **D-07:** Compact horizontal bar, not a full card. Thin strip showing service name + colored status dot inline: "Supabase [green] n8n [green] Cloudflare [green]"
- **D-08:** When everything is healthy, takes up almost no vertical space. Degraded/down services catch the eye with yellow/red dots.
- **D-09:** Stays on the dashboard (not moved to Settings) because you need to see problems immediately, not discover them later.

### Action Items
- **D-10:** Fixed height showing 3-4 visible items max, sorted by urgency (high first).
- **D-11:** If more items exist, show a "View all" link. No scrollable list inside the card -- that's a UX trap that pushes everything below the fold.
- **D-12:** Each item shows description, urgency badge, project badge, and relative time (same as current, but capped).

### Project Cards with "Days Since" Indicators
- **D-13:** Recency thresholds adjusted for solo operator:
  - Green: active within 48 hours
  - Amber: 3-5 days since last activity
  - Red: 5+ days since last activity
- **D-14:** Dual indicator system: (a) colored left border on the project card (consistent with sidebar active state pattern) + (b) small timestamp badge ("2h ago" / "3d ago") that shifts color to match the border.
- **D-15:** "Days since" is calculated from the last activity log entry for that project, not the project's updated_at field. Activity log captures real work (tasks, notes, commits, sessions).
- **D-16:** Do NOT change the progress bar color based on recency -- progress bar communicates how far along, not how recently touched. Separate concerns.
- **D-17:** Project card positions are static (always same order). No auto-sorting based on recency or status. Spatial memory matters. Red border + "5d ago" badge is sufficient gentle pressure.
- **D-18:** 3-column grid for project cards (existing pattern, keep it).

### 7-Day Content Calendar Strip
- **D-19:** Shows current calendar week (Monday through Sunday), not today-forward. Seeing earlier days as "posted" gives confidence the week is on track.
- **D-20:** Today's column gets special treatment: subtle warm background tint (slightly deeper cream than page background) + day label in coral or bold. Enough to orient, not enough to scream.
- **D-21:** Cap at 2 content items per day column. If more exist, show "+1 more" linking to the pipeline page filtered to that day. Priority order: pending review first, then scheduled, then posted.
- **D-22:** Each content card in the strip shows: platform icon (16px), post title (one line, truncated with ellipsis), and status badge. Click opens content detail in the pipeline.
- **D-23:** Empty day columns show just the day label with a subtle dashed border or light placeholder. No "nothing scheduled" text.
- **D-24:** The strip is a glance tool. Fixed height, compact cards. Vertical stacking uncapped would blow out row height.

### Claude's Discretion
- Exact mini-card dimensions and internal spacing
- System health strip implementation (flexbox, inner padding)
- Action items card max-height value and overflow behavior
- How "View all" on action items works (expand inline vs. navigate to a page)
- Content calendar strip responsive behavior below 1280px
- Framer Motion entrance animations for stat tiles and calendar
- How to fetch/compute CLARITY countdown and pending approvals count
- Whether to create new hooks or extend existing ones for stat data

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `idea.md` -- Full design system spec (colors, typography, spacing, component patterns)
- `src/styles/globals.css` -- CSS variables, typography classes, shadow tokens

### Current Dashboard
- `src/pages/Dashboard.tsx` -- Current layout (will be rebuilt)
- `src/components/dashboard/ActionItemsCard.tsx` -- Current action items (needs height cap + "View all")
- `src/components/dashboard/SystemHealthCard.tsx` -- Current system health (needs redesign to compact strip)
- `src/components/dashboard/ProjectQuickGlanceCard.tsx` -- Current project cards (needs recency indicators)
- `src/components/dashboard/UpcomingContentCard.tsx` -- Current content display (needs calendar redesign)

### Data Layer
- `src/hooks/useProjects.ts` -- useProjects(), useActionItems() hooks
- `src/hooks/useSystemHealth.ts` -- useSystemHealth() hook
- `src/hooks/useContentReviews.ts` -- useContentReviews() hook
- `src/hooks/useActivityLog.ts` -- useActivityLog() hook (needed for "days since" calculation)
- `src/data/mock.ts` -- Mock data structure (3 projects, tasks, content reviews, system health, activity log)

### Prior Phase Decisions
- `.planning/phases/01-component-foundation/01-CONTEXT.md` -- shadcn/ui adoption, toast system, token bridge
- `.planning/phases/02-global-design-standards/02-CONTEXT.md` -- Warm palette, card system, typography ladder, spacing rules, Button/Card components

### Build Progress (Original Phases)
- `PROGRESS.md` -- Original phase 2 built the dashboard; current components are from that build

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card` component (shadcn): 24px padding, 14px radius, hover shadow -- base for stat tiles and project cards
- `Badge` component: urgency (error/warning/neutral), project (navy), status (success/info/coral) variants
- `StatusDot` component: green/yellow/red dots -- reuse in system health strip
- `SkeletonBlock` component: shimmer loading states for all cards
- Typography classes: text-stat (36px), text-section-header (18px), text-card-title (15px), text-body-sm (13px), text-caption (12px), text-overline (11px)
- `formatRelativeTime()`, `formatDate()`, `formatShortDate()` utilities
- `useActionItems()` already fetches and filters open items
- `useContentReviews()` already fetches content with status, platforms, scheduled_date, day_label

### Established Patterns
- motion.div wrapper + Card inner component for animated cards (Phase 2 decision)
- Staggered entrance animations with delay: idx * 0.05
- Inline style objects for layout (flex, gap) with Tailwind for color/typography
- Cards use `className="p-6"` consistently

### Integration Points
- `src/pages/Dashboard.tsx` -- Complete rebuild of layout and section ordering
- `src/components/dashboard/` -- All 4 components need modification or replacement
- `src/hooks/useActivityLog.ts` -- May need a new hook or query for per-project last activity date
- `src/data/mock.ts` -- May need activity log entries with project_id associations for "days since" to work with mock data
- PageShell max-w-[1280px] already applied (Phase 2)

</code_context>

<specifics>
## Specific Ideas

- Stat tiles should feel like Apple Health rings -- each one its own element with visual weight, not grouped into a report table
- "Days since" indicators use the same colored-left-border pattern as the sidebar active state -- consistent design language
- Content calendar strip is inspired by Apple Calendar week view but compressed into a single horizontal strip
- GitHub contribution graph energy for project recency -- active projects feel alive, stale ones feel visually different
- Dashboard should feel like a command center, not a status page. Dense with information but every element earns its space.
- The CLARITY countdown is the single most urgent deadline. It deserves hero stat treatment alongside progress percentages.

</specifics>

<deferred>
## Deferred Ideas

- Command palette (Cmd+K) for instant navigation -- v2 requirement (DASH-V2-01)
- "Focus block" showing single most important priority -- v2 requirement (DASH-V2-02)
- Stat counters with 7-day sparkline trends -- v2 requirement (DASH-V2-03)
- Agent dispatch quick actions from project cards -- v2 requirement (PROJ-V2-01)

</deferred>

---

*Phase: 03-dashboard-redesign*
*Context gathered: 2026-03-22*
