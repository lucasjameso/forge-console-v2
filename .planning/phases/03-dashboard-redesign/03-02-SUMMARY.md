---
phase: 03-dashboard-redesign
plan: 02
subsystem: ui
tags: [react, framer-motion, dashboard, date-fns, recency-indicators, calendar-strip]

# Dependency graph
requires:
  - phase: 03-dashboard-redesign
    provides: Full-width stacked dashboard layout, StatTilesRow, SystemHealthStrip, ActionItemsCard
provides:
  - Project cards with days-since-last-activity colored borders and timestamp badges
  - 7-day content calendar strip with Mon-Sun week view
  - useProjectLastActivity hook for per-project recency computation
affects: [dashboard, content-pipeline]

# Tech tracking
tech-stack:
  added: []
  patterns: [recency-color-border, calendar-strip-grid, content-item-mini-card]

key-files:
  created:
    - src/hooks/useDashboardStats.ts
    - src/components/dashboard/ContentCalendarStrip.tsx
  modified:
    - src/components/dashboard/ProjectQuickGlanceCard.tsx
    - src/data/mock.ts
    - src/pages/Dashboard.tsx

key-decisions:
  - "Recency colors use CSS variable status tokens (status-success/warning/error) for consistency"
  - "Calendar strip uses date-fns startOfWeek with weekStartsOn: 1 for Monday start"

patterns-established:
  - "Recency border pattern: 3px solid left border with green/amber/red mapped from hsl CSS variables"
  - "Calendar strip pattern: 7-column grid with today highlighting, 2-item cap per day, dashed empty placeholder"
  - "Content mini-card pattern: compact card with platform icon + status badge + truncated title"

requirements-completed: [DASH-03, DASH-04]

# Metrics
duration: 2min
completed: 2026-03-22
---

# Phase 03 Plan 02: Project Recency and Content Calendar Summary

**Project cards with green/amber/red recency borders from activity log, plus 7-day Mon-Sun content calendar strip with today highlighting and 2-item-per-day cap**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-22T16:28:12Z
- **Completed:** 2026-03-22T16:30:28Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Created useProjectLastActivity hook computing per-project recency from activity log entries with 48h/120h thresholds
- Added colored left border (green/amber/red) and color-matched timestamp badge to ProjectQuickGlanceCard
- Built ContentCalendarStrip showing current Mon-Sun week with content items grouped by scheduled_date
- Today column highlighted with elevated background and coral-colored day label
- Replaced UpcomingContentCard horizontal scroll with structured 7-column calendar grid

## Task Commits

Each task was committed atomically:

1. **Task 1: Create useDashboardStats hook and add recency indicators to ProjectQuickGlanceCard** - `0eaf1a2` (feat)
2. **Task 2: Build ContentCalendarStrip and wire into Dashboard** - `d48ace8` (feat)

## Files Created/Modified
- `src/hooks/useDashboardStats.ts` - useProjectLastActivity hook computing recency from activity log
- `src/components/dashboard/ContentCalendarStrip.tsx` - 7-day calendar strip with content items per day
- `src/components/dashboard/ProjectQuickGlanceCard.tsx` - Added recency colored border and timestamp badge
- `src/data/mock.ts` - Updated ridgeline activity entry to 4 days ago for amber recency demo
- `src/pages/Dashboard.tsx` - Replaced UpcomingContentCard with ContentCalendarStrip

## Decisions Made
- Recency colors use the existing status CSS variable tokens (status-success, status-warning, status-error) rather than custom colors
- Calendar strip uses date-fns startOfWeek with Monday start (weekStartsOn: 1) per D-19
- Content items sorted by status priority (pending first, then draft, approved, posted) within each day column
- Mobile responsive uses overflow-x: auto on the grid rather than column reflow

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Dashboard redesign complete with all 5 sections: StatTilesRow, SystemHealthStrip, ActionItemsCard, ProjectQuickGlanceCard (with recency), ContentCalendarStrip
- UpcomingContentCard.tsx still exists for potential use by other pages
- SystemHealthCard.tsx still exists (superseded by SystemHealthStrip in Plan 01) for cleanup

---
*Phase: 03-dashboard-redesign*
*Completed: 2026-03-22*
