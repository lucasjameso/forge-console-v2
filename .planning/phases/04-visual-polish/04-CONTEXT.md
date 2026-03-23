# Phase 4: Visual Polish (All Pages) - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Fix every visual, UX, and data issue identified across all 7 pages -- 64 fix items from the page feedback system. This is polish and correction, not new features. Every page must meet the premium quality bar established in Phases 1-3. Inline style cleanup is mandatory on every touched file.

</domain>

<decisions>
## Implementation Decisions

### Execution Strategy
- **D-01:** Build shared components and foundations FIRST, then fix pages sequentially. Shared work includes: brand icon setup, project color system, consistent badge/status components, and any cross-cutting utilities.
- **D-02:** Page priority order after shared work: Dashboard, ProjectDetail, Brain Dump, Content Pipeline, Social Media, Activity Log, Settings.
- **D-03:** Rationale: Dashboard is the front door (highest visibility), ProjectDetail is where 80% of time is spent, Brain Dump is the most-used action. Settings is last because it is set-once-and-forget.

### Brand Icon Package
- **D-04:** Use `@icons-pack/react-simple-icons` for all brand/platform icons. Not react-icons (bundle bloat), not hand-picked SVGs (maintenance burden).
- **D-05:** Applies to: Social Media platform cards (SFIX-01: LinkedIn, Facebook, Instagram, TikTok, YouTube, X, Medium, Reddit, Goodreads, Amazon, Beehiiv, Gumroad), Settings integration cards (STFIX-01: Supabase, n8n, Cloudflare, Slack, Anthropic), and Dashboard project card GitHub links (DSUG-04 -- deferred to Phase 8 but icon package available).
- **D-06:** Install as a production dependency. Import individual icons to keep bundle size down: `import { SiLinkedin } from '@icons-pack/react-simple-icons'`.

### Project Color System
- **D-07:** CSS variables mapped from a config object. HSL values defined in the CSS variable system alongside existing design tokens in `globals.css`.
- **D-08:** Store color assignment in Supabase on the `projects` table -- add a `color` column containing the CSS variable name (e.g., `project-ridgeline`). One source of truth.
- **D-09:** Initial color mapping:
  - Ridgeline: green tint (`--project-ridgeline`)
  - CLARITY: coral tint (`--project-clarity`)
  - Forge Console: navy tint (`--project-forge`)
  - Meridian: blue tint (`--project-meridian`)
  - Atlas: gray tint (`--project-atlas`)
- **D-10:** These colors are used everywhere a project is referenced: badge pills, left borders, progress bars, activity log dots, chart segments. A single `getProjectColor(slug)` utility reads from the config and returns the CSS variable.
- **D-11:** For pages and feedback type colors (Dashboard=coral, Brain Dump=purple, etc.), use the same CSS variable pattern but as a static map (not from Supabase, since pages are fixed).

### Inline Style Cleanup
- **D-12:** Clean as you go. Every file touched during Phase 4 must have its inline `style={{ }}` objects converted to Tailwind utilities or CSS variables before the fix is marked complete. No separate cleanup sweep.
- **D-13:** Specifically target the `<style>` tag injections in `SocialMedia.tsx` (line 242) and `Settings.tsx` (line 368). Replace with Tailwind responsive grid utilities.
- **D-14:** Color values that are currently inline HSL strings (e.g., `style={{ color: 'hsl(var(--accent-coral))' }}`) must be converted to Tailwind classes using the theme tokens (e.g., `text-coral` or `text-[hsl(var(--accent-coral))]`).

### Tech Debt Fixes (from CONCERNS.md, addressed opportunistically)
- **D-15:** Add `page_feedback` table definition to `src/types/database.ts` and remove the `as ReturnType<typeof supabase.from>` cast in `usePageFeedback.ts`. Fix when touching Settings page.
- **D-16:** Add debounce (300ms) to Activity Log search input. Fix when touching Activity Log page (AFIX-05).
- **D-17:** Fix mixed inline styles on every page as part of D-12. This is the primary tech debt reduction mechanism for Phase 4.

### Prior Decisions Carried Forward
- **D-18:** Card system from Phase 2: 24px padding, 14px radius, 1px warm border, hover shadow. All new/modified cards must match.
- **D-19:** Typography ladder from Phase 2: 28px page titles, 18px section headers, 15px card titles, 14px body, 12px meta. Verify consistency on every page.
- **D-20:** Recency thresholds from Phase 3: green <48h, amber 3-5d, red 5d+ calculated from activity_log. Verify working correctly (DFIX-07 flags broken logic on Atlas/Meridian).
- **D-21:** Project card order from Phase 3: static positions, no auto-sorting. Spatial memory matters.

### Claude's Discretion
- Exact Tailwind class choices for replacing inline styles (as long as visual output matches)
- Plan splitting strategy (how many plans, how tasks are grouped)
- Order of fixes within each page (as long as shared components come first)
- Skeleton shimmer implementation details for new loading states

</decisions>

<specifics>
## Specific Ideas

- Priority badges: "high" = red text on red-tinted background, "medium" = amber text on amber-tinted background, "low" = green text on green-tinted background. Not all red.
- Progress bars: green (on track), amber (behind), red (critical). Never all the same coral color. Simple rule: overdue high-urgency items = red, any overdue = amber, none overdue = green.
- CLARITY countdown urgency: 30+ days normal, 14-30 amber number + amber border + date shown, <14 days red number + red glow + subtle pulse every 5s.
- Activity log three-tier visual weight: Major events (full card, shadow), Standard events (compact card), Background events (inline text, 60% opacity).
- Content pipeline status badges standardized: Draft=gray, Pending=amber, Approved=green, Rejected=red, Posted=blue. 11px uppercase, 600 weight, 4px 10px padding, pill-shaped.
- Feedback log: render markdown or strip it, truncate to 3-4 lines with "Read more" expand. Not raw markdown walls.
- "0 slides" on text posts: show "Text post" instead. If carousel with 0: "No slides yet" in amber.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Feedback Spec (authoritative for all 64 fix items)
- `.planning/feedback/PHASE-04-FIXES-SPEC.md` -- All 64 fix items with IDs (DFIX, BFIX, CFIX, SFIX, STFIX, AFIX), organized by page. This is THE spec.

### Requirements
- `.planning/REQUIREMENTS.md` -- VISL-05 through VISL-11, DFIX-01 through DFIX-08, BFIX-01 through BFIX-08, CFIX-01 through CFIX-12, SFIX-01 through SFIX-12, STFIX-01 through STFIX-12, AFIX-01 through AFIX-12

### Codebase State
- `.planning/codebase/CONCERNS.md` -- Tech debt items to fix opportunistically (inline styles, type casts, search debounce)
- `.planning/codebase/CONVENTIONS.md` -- Naming patterns, code style, import order to follow
- `.planning/codebase/ARCHITECTURE.md` -- Layer boundaries, hook patterns, component patterns

### Prior Phase Decisions
- `.planning/phases/01-component-foundation/01-CONTEXT.md` -- shadcn/ui setup, toast system, design tokens
- `.planning/phases/02-global-design-standards/02-CONTEXT.md` -- Card system, typography, spacing rules
- `.planning/phases/03-dashboard-redesign/03-CONTEXT.md` -- Recency thresholds, stat tiles, project card design, content calendar

### Design System
- `src/index.css` -- CSS variables, design tokens, color system
- `tailwind.config.ts` -- Theme configuration, custom colors, spacing

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Badge.tsx`: shadcn Badge with variants -- extend for priority/status/project badge colors
- `src/components/ui/SkeletonBlock.tsx`: Skeleton shimmer component -- use for all loading states
- `src/components/layout/PageShell.tsx`: Page wrapper with header, title, subtitle -- update subtitle to support dynamic content (DFIX-08)
- `src/lib/utils.ts`: `formatRelativeTime`, `getGreeting`, `formatDate` -- extend for contextual greeting subtitle
- `src/hooks/useDashboardStats.ts`: Returns project recency map -- extend for recency border colors on stat tiles

### Established Patterns
- React Query for all data fetching with `queryKey` arrays and `invalidateQueries` on mutations
- `isSupabaseConfigured` guard in every hook before Supabase calls, fallback to mock data
- Framer Motion `AnimatePresence` for page transitions, `motion.div` for section animations
- shadcn/ui primitives for all form elements, badges, buttons, cards

### Integration Points
- `src/types/database.ts`: Add `page_feedback` table type, add `color` column to Project type
- `supabase/schema.sql`: Add `color` column to `projects` table
- `src/index.css`: Add project color CSS variables
- `tailwind.config.ts`: Register project colors in theme if needed for Tailwind classes

</code_context>

<deferred>
## Deferred Ideas

- Quick Capture bar on Dashboard -- Phase 8 (DSUG-01)
- Today's Focus section -- Phase 8 (DSUG-03)
- GitHub octocat icon on project cards -- Phase 8 (DSUG-04), but icon package from D-04 will be available
- Action items inline resolve/snooze -- Phase 8 (PDSUG-01), Phase 4 only fixes visual issues
- Kanban drag-and-drop -- Phase 8 (PDSUG-04), Phase 4 only fixes card visual weight
- Content creation modal -- Phase 6 (CSUG-01), CFIX-12 adds the button but modal is Phase 6 scope
- Real-time activity feed -- Phase 7 (ASUG-07), Phase 4 only fixes visual hierarchy

</deferred>

---

*Phase: 04-visual-polish*
*Context gathered: 2026-03-22*
