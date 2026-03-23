# Phase 4: Visual Polish (All Pages) - Research

**Researched:** 2026-03-22
**Domain:** React UI polish, CSS design tokens, brand icons, component patterns
**Confidence:** HIGH

## Summary

Phase 4 is a 64-item visual polish pass across 6 pages (Dashboard, Brain Dump, Content Pipeline, Social Media, Activity Log, Settings) plus 7 cross-cutting VISL requirements. The work is primarily CSS/component-level changes with some hook modifications (pagination, debounce, dynamic data). No new pages or major architectural changes.

The codebase has a well-established design token system in `globals.css` with HSL variables, a shadcn/ui component library, and Tailwind configuration. The primary gap is: (1) no project color system, (2) heavy inline `style={{}}` usage throughout all pages, (3) no brand icon package, (4) several components need structural refactoring (calendar, activity log grouping, feedback rendering). The existing Badge component with CVA variants is the right extension point for priority/status/project badges.

**Primary recommendation:** Build the shared foundation first (project colors, brand icons, badge variants, utility functions), then sweep page-by-page converting inline styles and applying fixes. Each page file is 200-500 lines -- manageable in single-task passes.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Build shared components and foundations FIRST, then fix pages sequentially. Shared work includes: brand icon setup, project color system, consistent badge/status components, and any cross-cutting utilities.
- **D-02:** Page priority order after shared work: Dashboard, ProjectDetail, Brain Dump, Content Pipeline, Social Media, Activity Log, Settings.
- **D-03:** Rationale: Dashboard is the front door (highest visibility), ProjectDetail is where 80% of time is spent, Brain Dump is the most-used action. Settings is last because it is set-once-and-forget.
- **D-04:** Use `@icons-pack/react-simple-icons` for all brand/platform icons. Not react-icons (bundle bloat), not hand-picked SVGs (maintenance burden).
- **D-05:** Applies to: Social Media platform cards (SFIX-01), Settings integration cards (STFIX-01), and Dashboard project card GitHub links (deferred to Phase 8 but icon package available).
- **D-06:** Install as a production dependency. Import individual icons to keep bundle size down: `import { SiLinkedin } from '@icons-pack/react-simple-icons'`.
- **D-07:** CSS variables mapped from a config object. HSL values defined in the CSS variable system alongside existing design tokens in `globals.css`.
- **D-08:** Store color assignment in Supabase on the `projects` table -- add a `color` column containing the CSS variable name (e.g., `project-ridgeline`). One source of truth.
- **D-09:** Initial color mapping: Ridgeline=green, CLARITY=coral, Forge=navy, Meridian=blue, Atlas=gray.
- **D-10:** Single `getProjectColor(slug)` utility reads from the config and returns the CSS variable.
- **D-11:** Page/feedback type colors use same CSS variable pattern but as static map.
- **D-12:** Clean as you go -- every file touched must have inline `style={{}}` converted to Tailwind utilities or CSS variables.
- **D-13:** Remove `<style>` tag injections in SocialMedia.tsx (line 242) and Settings.tsx (line 368). Replace with Tailwind responsive grid utilities.
- **D-14:** Color values that are currently inline HSL strings must be converted to Tailwind classes.
- **D-15:** Add `page_feedback` table definition to database.ts, remove `as ReturnType` cast in usePageFeedback.ts.
- **D-16:** Add debounce (300ms) to Activity Log search input.
- **D-17:** Fix mixed inline styles on every page as part of D-12.
- **D-18:** Card system from Phase 2: 24px padding, 14px radius, 1px warm border, hover shadow.
- **D-19:** Typography ladder from Phase 2: 28px page titles, 18px section headers, 15px card titles, 14px body, 12px meta.
- **D-20:** Recency thresholds: green <48h, amber 48h-5d, red 5d+.
- **D-21:** Project card order: static positions, no auto-sorting.

### Claude's Discretion
- Exact Tailwind class choices for replacing inline styles (as long as visual output matches)
- Plan splitting strategy (how many plans, how tasks are grouped)
- Order of fixes within each page (as long as shared components come first)
- Skeleton shimmer implementation details for new loading states

### Deferred Ideas (OUT OF SCOPE)
- Quick Capture bar on Dashboard -- Phase 8 (DSUG-01)
- Today's Focus section -- Phase 8 (DSUG-03)
- GitHub octocat icon on project cards -- Phase 8 (DSUG-04)
- Action items inline resolve/snooze -- Phase 8 (PDSUG-01)
- Kanban drag-and-drop -- Phase 8 (PDSUG-04)
- Content creation modal -- Phase 6 (CSUG-01), CFIX-12 adds button only
- Real-time activity feed -- Phase 7 (ASUG-07)
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VISL-05 | Projects page polished | Inline style cleanup + card spacing fixes |
| VISL-06 | ProjectDetail page polished | Command-center depth, info density |
| VISL-07 | BrainDump page polished | Project selector, history grouping, shimmer |
| VISL-08 | ContentPipeline polished across 4 views | Calendar grid, status badges, navigation |
| VISL-09 | SocialMedia page polished | Brand icons, card sizing, stat row |
| VISL-10 | ActivityLog page polished | Day grouping, tiered weight, pagination |
| VISL-11 | Settings page polished | Brand logos, feedback rendering, sections |
| DFIX-01 | Priority badge colors (red/amber/green) | Extend Badge CVA variants; update Supabase project priorities |
| DFIX-02 | Progress bar health colors | Conditional color logic on progress component |
| DFIX-03 | Intelligent week selection for calendar | date-fns logic to find next content-bearing week |
| DFIX-04 | "View all" expands inline | Replace Link with expand/collapse state |
| DFIX-05 | Stat tile recency borders | Use useProjectLastActivity hook, add border-left |
| DFIX-06 | CLARITY countdown urgency | Threshold logic + Framer Motion pulse animation |
| DFIX-07 | Recency colors verified | Fix to use activity_log not project.updated_at |
| DFIX-08 | Dynamic greeting subtitle | New function deriving context from action items/deadlines |
| BFIX-01 | Project selector on capture | Pill row component using project colors |
| BFIX-02 | Submit button + keyboard hint | Full-width button, ghost text hint |
| BFIX-03 | History project-colored borders | getProjectColor utility + badge styling |
| BFIX-04 | Expanded entry parsed output | Visual divider, task cards, action buttons |
| BFIX-05 | Status progression | Breadcrumb/status pill component |
| BFIX-06 | Textarea auto-grow | CSS resize + JS height calculation |
| BFIX-07 | Processing shimmer | SkeletonBlock with label during mutation |
| BFIX-08 | History grouped by day | date-fns grouping with sticky headers |
| CFIX-01 | Month view real calendar | CSS grid with fixed date headers, borders |
| CFIX-02 | Empty day cells show dates | Always render date number |
| CFIX-03 | Month navigation arrows | State management + slide transition |
| CFIX-04 | List view compact cards | Truncation, 80-90px height |
| CFIX-05 | Week view stronger containers | Card wrapper + header bar |
| CFIX-06 | Kanban empty columns | Dashed border, max-height scroll |
| CFIX-07 | Kanban card metadata | Status badge, date, platform icon |
| CFIX-08 | Content detail modal | Dialog component 680px+ with actions |
| CFIX-09 | Standardized status badges | ContentStatusBadge component |
| CFIX-10 | Today indicator all views | date-fns isToday check + visual treatment |
| CFIX-11 | "Text post" vs "0 slides" | Conditional text logic |
| CFIX-12 | "Add Content" button | Button in PageShell actions, placeholder modal |
| SFIX-01 | Real brand icons | @icons-pack/react-simple-icons |
| SFIX-02 | Cards sized by importance | Adaptive grid (2-col active, 3-col setup) |
| SFIX-03 | Setup banner replaced with badge | Badge + amber left border |
| SFIX-04 | Unset platforms minimal | Conditional rendering based on status |
| SFIX-05 | Stats moved to top | Hero stat row component |
| SFIX-06 | LinkedIn follower goal visual | Progress bar + percentage + projection |
| SFIX-07 | Card content density | Active=rich, setup=minimal templates |
| SFIX-08 | CLARITY launch badges | "Needed for launch" coral badge |
| SFIX-09 | External link icons | Consistent icon button placement |
| SFIX-10 | Dynamic page subtitle | Computed from platform data |
| SFIX-11 | Adaptive grid layout | Tailwind responsive grid replacing <style> tag |
| SFIX-12 | Sort dropdown | Select component with sort logic |
| STFIX-01 | Integration brand logos | @icons-pack/react-simple-icons |
| STFIX-02 | Feedback markdown rendering | react-markdown or strip + truncate |
| STFIX-03 | Compact feedback entries | Collapsed by default with expand |
| STFIX-04 | Human-readable integration labels | Label map replacing env var display |
| STFIX-05 | Connected/disconnected visual | Green/red border + badge |
| STFIX-06 | Dashboard links per integration | URL map + external link buttons |
| STFIX-07 | About section enhanced | Build date, commit hash, DB stats |
| STFIX-08 | Organized sections | Tab navigation or accordion |
| STFIX-09 | Test connection buttons | Health check functions per service |
| STFIX-10 | Filter tabs with counts | Count badges on filter chips |
| STFIX-11 | Fix vs suggestion distinction | Icon + border color differentiation |
| STFIX-12 | Page-colored badges | Static color map for page identity |
| AFIX-01 | Day grouping + sticky headers | date-fns grouping, CSS sticky |
| AFIX-02 | Color-coded timeline dots | Tool-type color map |
| AFIX-03 | Three-tier visual weight | Major/standard/background templates |
| AFIX-04 | Filter chips active state | CVA variants for chip states |
| AFIX-05 | Debounced search | 300ms debounce + result count |
| AFIX-06 | Standardized timestamps | Relative <24h, time within day groups |
| AFIX-07 | Pagination/infinite scroll | useInfiniteQuery or load-more pattern |
| AFIX-08 | Consistent project badge colors | getProjectColor utility |
| AFIX-09 | Activity density heatmap | 14-day bar chart component |
| AFIX-10 | Tool badges distinct shape | Rounded rect with icon vs pill |
| AFIX-11 | Entry text truncation | 1-line truncation + expand |
| AFIX-12 | Manual activity entry | Inline form with project selector |
</phase_requirements>

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| React | 19.2.4 | UI framework | Already in use |
| Tailwind CSS | 3.4.19 | Utility styling | Already in use, pinned to v3 |
| shadcn/ui | latest | Component primitives | Already in use (Badge, Card, Dialog, etc.) |
| Framer Motion | 12.38.0 | Animations | Already in use for page transitions |
| date-fns | 4.1.0 | Date manipulation | Already in use for calendar/timestamps |
| Lucide React | 0.577.0 | General icons | Already in use throughout |
| CVA | 0.7.1 | Component variants | Already in use for Badge |

### New Dependencies
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @icons-pack/react-simple-icons | 13.13.0 | Brand/platform icons | SFIX-01, STFIX-01 (Social Media + Settings) |
| react-markdown | 10.1.0 | Render markdown feedback | STFIX-02 (Settings feedback log) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @icons-pack/react-simple-icons | react-icons | react-icons bundles multiple icon sets (bloat), simple-icons is brand-focused and smaller |
| react-markdown | Strip markdown manually | react-markdown handles edge cases (links, code, bold) that regex stripping misses |

**Installation:**
```bash
npm install @icons-pack/react-simple-icons react-markdown
```

**Version verification:**
- `@icons-pack/react-simple-icons`: 13.13.0 (verified via npm view 2026-03-22)
- `react-markdown`: 10.1.0 (verified via npm view 2026-03-22)

## Architecture Patterns

### New Shared Components and Utilities

```
src/
├── lib/
│   ├── utils.ts              # Extend: getProjectColor(), getPageColor(), getDynamicSubtitle()
│   ├── colors.ts             # NEW: project color config, page color map, priority/status color helpers
│   └── icons.ts              # NEW: platform icon map (platform_name -> SiComponent)
├── components/
│   └── ui/
│       ├── badge.tsx          # Extend: add project-* variants to CVA
│       ├── PriorityBadge.tsx  # NEW: wraps Badge with priority color logic
│       ├── StatusBadge.tsx    # NEW: content status badge (Draft/Pending/Approved/Rejected/Posted)
│       └── ProjectBadge.tsx   # NEW: wraps Badge with project color from getProjectColor()
├── hooks/
│   ├── useActivityLog.ts     # Modify: add pagination support (useInfiniteQuery)
│   ├── useDashboardStats.ts  # Modify: rename consideration deferred; extend with more data
│   └── useDebounce.ts        # NEW: generic debounce hook for search inputs
├── styles/
│   └── globals.css            # Extend: add --project-* CSS variables
└── types/
    └── database.ts            # Modify: add page_feedback table, add color to Project
```

### Pattern 1: Project Color System
**What:** CSS variables + TypeScript config map + Tailwind utilities
**When to use:** Everywhere a project slug appears in the UI
**Example:**
```css
/* globals.css */
:root {
  --project-ridgeline: 142 76% 36%;    /* green tint */
  --project-clarity: 12 55% 51%;       /* coral tint */
  --project-forge: 206 50% 21%;        /* navy tint */
  --project-meridian: 221 83% 53%;     /* blue tint */
  --project-atlas: 218 10% 64%;        /* gray tint */
  --project-ridgeline-bg: 138 76% 97%;
  --project-clarity-bg: 13 61% 97%;
  --project-forge-bg: 206 50% 97%;
  --project-meridian-bg: 221 83% 97%;
  --project-atlas-bg: 218 10% 97%;
}
```

```typescript
// src/lib/colors.ts
const PROJECT_COLORS: Record<string, string> = {
  ridgeline: 'project-ridgeline',
  clarity: 'project-clarity',
  forge: 'project-forge',
  meridian: 'project-meridian',
  atlas: 'project-atlas',
}

export function getProjectColor(slug: string): string {
  return PROJECT_COLORS[slug] ?? 'project-atlas'
}

export function getProjectColorVar(slug: string): string {
  return `var(--${getProjectColor(slug)})`
}

// Page identity colors (static, not from Supabase)
const PAGE_COLORS: Record<string, string> = {
  dashboard: 'accent-coral',
  projects: 'accent-navy',
  'brain-dump': '280 60% 50%',   // purple
  'content-pipeline': 'status-success',
  'social-media': 'status-info',
  'activity-log': 'status-warning',
  settings: 'text-tertiary',
}
```

### Pattern 2: Inline Style to Tailwind Conversion
**What:** Replace `style={{}}` objects with Tailwind utility classes
**When to use:** Every file touched in Phase 4 (D-12)
**Example:**
```tsx
// BEFORE (current pattern throughout codebase)
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
  <span style={{ color: 'hsl(var(--text-tertiary))' }}>Label</span>
</div>

// AFTER (Tailwind utilities)
<div className="flex items-center gap-2 mb-4">
  <span className="text-[hsl(var(--text-tertiary))]">Label</span>
</div>
```

Key conversion reference:
| Inline Style | Tailwind Class |
|-------------|---------------|
| `gap: 4` | `gap-1` |
| `gap: 8` | `gap-2` |
| `gap: 12` | `gap-3` |
| `gap: 16` | `gap-4` |
| `gap: 24` | `gap-6` |
| `gap: 32` | `gap-8` |
| `padding: '12px 14px'` | `px-3.5 py-3` |
| `marginBottom: 16` | `mb-4` |
| `borderRadius: 10` | `rounded-[10px]` or `rounded-lg` |
| `display: 'flex', flexDirection: 'column'` | `flex flex-col` |
| `display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)'` | `grid grid-cols-5` |
| `color: 'hsl(var(--text-tertiary))'` | `text-[hsl(var(--text-tertiary))]` |
| `backgroundColor: 'hsl(var(--bg-elevated))'` | `bg-[hsl(var(--bg-elevated))]` |

### Pattern 3: Brand Icon Mapping
**What:** Central map from platform/service name to icon component
**When to use:** Social Media cards (SFIX-01), Settings integrations (STFIX-01)
**Example:**
```typescript
// src/lib/icons.ts
import {
  SiLinkedin, SiFacebook, SiInstagram, SiTiktok, SiYoutube,
  SiX, SiMedium, SiReddit, SiGoodreads, SiAmazon,
  SiSubstack, SiGumroad, SiSupabase, SiN8N, SiCloudflare,
  SiSlack, SiAnthropic,
} from '@icons-pack/react-simple-icons'
import type { ComponentType } from 'react'

interface IconProps {
  size?: number
  color?: string
  className?: string
}

// Platform icon map (matches social_platforms.platform_name or icon_name)
export const PLATFORM_ICONS: Record<string, ComponentType<IconProps>> = {
  linkedin: SiLinkedin,
  facebook: SiFacebook,
  instagram: SiInstagram,
  tiktok: SiTiktok,
  youtube: SiYoutube,
  x: SiX,
  medium: SiMedium,
  reddit: SiReddit,
  goodreads: SiGoodreads,
  amazon: SiAmazon,
  beehiiv: SiSubstack,  // Beehiiv may not have icon; Substack as fallback
  gumroad: SiGumroad,
}

// Integration icon map (for Settings page)
export const INTEGRATION_ICONS: Record<string, ComponentType<IconProps>> = {
  supabase: SiSupabase,
  n8n: SiN8N,
  cloudflare: SiCloudflare,
  slack: SiSlack,
  anthropic: SiAnthropic,
}
```

**Note on Beehiiv:** Simple Icons may not have a Beehiiv-specific icon. Fallback options: use SiSubstack (similar newsletter platform) or a Lucide Mail icon. Verify at build time -- if import fails, use Lucide fallback. LOW confidence on Beehiiv availability.

### Pattern 4: Debounce Hook
**What:** Generic debounce hook for search inputs
**When to use:** Activity Log search (AFIX-05), potentially elsewhere
**Example:**
```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
```

### Pattern 5: Day Grouping for Lists
**What:** Group entries by date with sticky headers
**When to use:** Brain Dump history (BFIX-08), Activity Log (AFIX-01)
**Example:**
```typescript
import { isToday, isYesterday, format } from 'date-fns'

interface GroupedItems<T> {
  label: string
  date: Date
  items: T[]
}

function groupByDay<T extends { created_at: string }>(items: T[]): GroupedItems<T>[] {
  const groups = new Map<string, T[]>()

  for (const item of items) {
    const date = new Date(item.created_at)
    const key = format(date, 'yyyy-MM-dd')
    const existing = groups.get(key) ?? []
    existing.push(item)
    groups.set(key, existing)
  }

  return Array.from(groups.entries()).map(([key, groupItems]) => {
    const date = new Date(key)
    let label: string
    if (isToday(date)) label = 'Today'
    else if (isYesterday(date)) label = 'Yesterday'
    else label = format(date, 'MMMM d, yyyy')

    return { label, date, items: groupItems }
  })
}
```

### Pattern 6: <style> Tag Replacement
**What:** Replace inline `<style>` tags with Tailwind responsive grid utilities
**When to use:** SocialMedia.tsx (D-13), Settings.tsx (D-13), StatTilesRow.tsx
**Example:**
```tsx
// BEFORE (SocialMedia.tsx line 242)
<style>{`
  .social-grid { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 768px) { .social-grid { grid-template-columns: 1fr; } }
`}</style>

// AFTER
<div className="grid grid-cols-1 md:grid-cols-2 gap-5">
  {/* cards */}
</div>

// For StatTilesRow responsive grid:
<div className="grid grid-cols-2 md:grid-cols-5 gap-4">
  {/* tiles -- 5th tile spans full width on mobile via last:col-span-2 md:last:col-span-1 */}
</div>
```

### Anti-Patterns to Avoid
- **Inline style objects for layout:** Use Tailwind `flex`, `grid`, `gap-*`, `p-*` utilities instead.
- **Hardcoded HSL strings in JSX:** Use CSS variables via `text-[hsl(var(--token))]` or extend Tailwind theme.
- **Global `<style>` tag injection at component render:** Use Tailwind responsive prefixes (`md:`, `lg:`) on the element itself.
- **Duplicate color logic per component:** Centralize in `src/lib/colors.ts` and use `getProjectColor()` everywhere.
- **`as any` / `as ReturnType<>` casts:** Fix the type system (add `page_feedback` to Database type) rather than casting around it.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Brand icons | SVG files or inline SVGs | @icons-pack/react-simple-icons | 3150+ brand icons, maintained, tree-shakeable |
| Markdown rendering | Regex-based strip/render | react-markdown | Handles edge cases: nested formatting, links, code blocks |
| Debounce | setTimeout in component | useDebounce hook | Cleanup on unmount, reusable, no stale closure bugs |
| Date grouping | Manual date string parsing | date-fns (isToday, isYesterday, format) | Timezone-safe, locale-aware, well-tested |
| Infinite scroll | Custom IntersectionObserver | @tanstack/react-query useInfiniteQuery | Cache-aware, handles refetch/invalidation correctly |
| Component variants | Conditional className strings | CVA (class-variance-authority) | Type-safe variants, composable, already in Badge |
| Responsive grids | `<style>` tag injection | Tailwind responsive prefixes | SSR-safe, no global CSS collisions, standard pattern |

**Key insight:** Most of Phase 4 is applying existing tools (Tailwind, CVA, date-fns, React Query) correctly rather than building new abstractions. The primary work is converting existing inline patterns to standard patterns.

## Common Pitfalls

### Pitfall 1: Tailwind Class Purging with Dynamic Values
**What goes wrong:** Tailwind purges classes it cannot find at build time. Dynamic class construction like `` `text-${color}` `` gets purged.
**Why it happens:** Tailwind scans source files for complete class strings. Template literals break detection.
**How to avoid:** Always use complete class strings. For project colors, use the `style` attribute with CSS variables (`style={{ borderColor: 'hsl(var(--project-ridgeline))' }}`) or use Tailwind arbitrary values with complete variable references (`border-l-[hsl(var(--project-ridgeline))]`). Do NOT construct class names dynamically.
**Warning signs:** Colors or borders disappearing in production build but working in dev.

### Pitfall 2: Inline Style Cleanup Breaking Visual Output
**What goes wrong:** Converting `style={{}}` to Tailwind changes specificity or computed values slightly.
**Why it happens:** Inline styles have highest specificity. Tailwind utilities may lose to other rules.
**How to avoid:** Test visually after each conversion. Use `!important` sparingly via Tailwind's `!` prefix only if needed. Prefer CSS variables in Tailwind arbitrary values over hardcoded values.
**Warning signs:** Elements losing spacing, colors, or layout after conversion.

### Pitfall 3: Badge Variant Explosion
**What goes wrong:** Creating too many Badge variants (one per project, one per status, etc.) making the component unwieldy.
**Why it happens:** Each visual variation gets its own CVA variant.
**How to avoid:** Keep Badge variants semantic (success/warning/error/info/neutral). For project-specific colors, use a wrapper component (ProjectBadge) that applies colors via style prop rather than adding 5+ project variants to the base Badge.
**Warning signs:** Badge.tsx growing beyond 80 lines of variant definitions.

### Pitfall 4: CSS Variable Scope Confusion
**What goes wrong:** Using `hsl(var(--project-ridgeline))` but the variable is defined without the `hsl()` wrapper, or vice versa.
**Why it happens:** The codebase uses bare HSL values in CSS variables (e.g., `--accent-coral: 12 55% 51%`) and wraps with `hsl()` at usage. New project color variables must follow the same pattern.
**How to avoid:** All new CSS variables must be bare HSL triplets (e.g., `--project-ridgeline: 142 76% 36%`). Usage is always `hsl(var(--project-ridgeline))` or `hsl(var(--project-ridgeline) / 0.1)` for opacity.
**Warning signs:** Colors rendering as black or transparent.

### Pitfall 5: useInfiniteQuery Migration Complexity
**What goes wrong:** Switching useActivityLog from useQuery to useInfiniteQuery changes the return shape, breaking all consumers.
**Why it happens:** `useInfiniteQuery` returns `{ pages: T[][] }` instead of `{ data: T[] }`. Every component using `useActivityLog` needs updating.
**How to avoid:** Either (a) add a wrapper that flattens pages into a single array matching the old interface, or (b) keep useQuery and add manual "Load more" with offset state (simpler, fewer breaking changes). Option (b) is recommended for Phase 4 scope.
**Warning signs:** TypeScript errors on `data` access in Dashboard stats, Activity Log page, and any other consumer.

### Pitfall 6: react-markdown Bundle Size
**What goes wrong:** react-markdown v10 uses ESM and pulls in remark/rehype ecosystem.
**Why it happens:** Full markdown parsing is heavier than expected.
**How to avoid:** Only use react-markdown on the Settings feedback page. For simple bold/italic elsewhere, consider a lightweight approach (string replacement). Restrict allowed elements to avoid rendering unexpected HTML.
**Warning signs:** Bundle size increase >50KB.

## Code Examples

### Priority Badge Component
```typescript
// src/components/ui/PriorityBadge.tsx
import { Badge } from '@/components/ui/badge'
import type { ProjectPriority } from '@/types/database'

const PRIORITY_VARIANT: Record<ProjectPriority, 'error' | 'warning' | 'success'> = {
  high: 'error',
  medium: 'warning',
  low: 'success',
}

export function PriorityBadge({ priority }: { priority: ProjectPriority }) {
  return (
    <Badge variant={PRIORITY_VARIANT[priority]}>
      {priority}
    </Badge>
  )
}
```

### Content Status Badge
```typescript
// src/components/ui/StatusBadge.tsx
import type { ContentStatus } from '@/types/database'

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-tertiary))] border-[hsl(var(--border-subtle))]',
  pending: 'bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning))] border-transparent',
  approved: 'bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success))] border-transparent',
  rejected: 'bg-[hsl(var(--status-error-bg))] text-[hsl(var(--status-error))] border-transparent',
  posted: 'bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info))] border-transparent',
}

export function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${STATUS_STYLES[status]}`}>
      {status}
    </span>
  )
}
```

### CLARITY Countdown with Urgency
```typescript
// In StatTilesRow or dedicated component
import { motion } from 'framer-motion'

function clarityUrgencyClass(daysUntilLaunch: number): string {
  if (daysUntilLaunch <= 0) return 'text-[hsl(var(--status-success))]'
  if (daysUntilLaunch < 14) return 'text-[hsl(var(--status-error))]'
  if (daysUntilLaunch <= 30) return 'text-[hsl(var(--status-warning))]'
  return ''
}

function clarityBorderClass(daysUntilLaunch: number): string {
  if (daysUntilLaunch < 14) return 'border-l-4 border-l-[hsl(var(--status-error))]'
  if (daysUntilLaunch <= 30) return 'border-l-4 border-l-[hsl(var(--status-warning))]'
  return ''
}

// Pulse animation for <14 days:
// <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ repeat: Infinity, duration: 5 }}>
```

### Textarea Auto-Grow
```typescript
// For BFIX-06
function handleTextareaInput(e: React.FormEvent<HTMLTextAreaElement>) {
  const el = e.currentTarget
  el.style.height = 'auto'
  el.style.height = `${Math.min(el.scrollHeight, window.innerHeight * 0.5)}px`
}

// <Textarea
//   className="min-h-[120px] resize-none"
//   onInput={handleTextareaInput}
//   placeholder="What's on your mind?"
// />
```

### Load More Pagination (simpler than useInfiniteQuery)
```typescript
// For AFIX-07 -- add to useActivityLog
export function useActivityLog(filters?: ActivityFilters & { limit?: number; offset?: number }) {
  const limit = filters?.limit ?? 20
  const offset = filters?.offset ?? 0

  return useQuery<{ items: ActivityEntry[]; total: number }>({
    queryKey: ['activity-log', filters?.project, filters?.sessionType, filters?.search, limit, offset],
    queryFn: async () => {
      // ... query with .range(offset, offset + limit - 1)
      // Use Supabase count: 'exact' header for total
    },
  })
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| inline `style={{}}` for all layout | Tailwind utilities | Phase 2 established standard | Eliminates specificity wars, enables responsive design |
| `<style>` tag injection for responsive grids | Tailwind responsive prefixes (`md:`, `lg:`) | Standard practice | No global CSS collisions, SSR-safe |
| Hardcoded color strings | CSS variables via design token system | Phase 1 established | Single source of truth for theming |
| `useQuery` for paginated data | `useInfiniteQuery` or offset-based | TanStack Query v5 | Proper cache management for list views |

**Deprecated/outdated:**
- react-icons: Bloated bundle for brand icons. @icons-pack/react-simple-icons is more focused.
- Manual CSS @media queries in component files: Tailwind responsive utilities are more maintainable.

## Open Questions

1. **Beehiiv icon availability in Simple Icons**
   - What we know: Simple Icons has 3150+ brand icons. Major platforms are covered.
   - What's unclear: Beehiiv is relatively new and may not have a Simple Icons entry.
   - Recommendation: Check at install time. If missing, use Lucide `Mail` icon as fallback. LOW confidence.

2. **Supabase schema migration for `projects.color` column**
   - What we know: D-08 requires adding a `color` column to the `projects` table.
   - What's unclear: Whether to use a SQL migration script or manual Supabase Dashboard update.
   - Recommendation: Add to `supabase/schema.sql` for documentation. Apply manually via Supabase Dashboard since there is no migration runner. Update mock data to include color field.

3. **react-markdown ESM compatibility with Vite**
   - What we know: react-markdown v10 is ESM-only. Vite handles ESM natively.
   - What's unclear: Whether any remark/rehype plugins needed will cause issues.
   - Recommendation: Install and test basic rendering before building full feedback log. If issues arise, fall back to a simple `stripMarkdown()` utility. MEDIUM confidence.

4. **Activity density heatmap (AFIX-09) implementation**
   - What we know: Needs a 14-day stacked bar chart showing activity counts per project.
   - What's unclear: Whether to use a chart library or build with pure CSS/divs.
   - Recommendation: Build with pure CSS (stacked div bars with Tailwind) since it is a simple 14-bar visualization. No chart library needed for this scope. HIGH confidence this works.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- zero test infrastructure |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (TypeScript + Vite build check) |
| Full suite command | `npm run build` (only available validation) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| DFIX-01 | Priority badges use correct colors | manual-only | Visual inspection | N/A |
| DFIX-07 | Recency colors match thresholds | unit | Could test `useProjectLastActivity` threshold logic | No |
| BFIX-08 | History grouped by day | unit | Could test `groupByDay` utility | No |
| CFIX-09 | Status badges consistent | manual-only | Visual inspection | N/A |
| AFIX-05 | Search debounce works | unit | Could test `useDebounce` hook | No |
| All | TypeScript compiles | build | `npm run build` | Yes |
| All | No runtime errors | manual-only | Browser testing | N/A |

**Justification for manual-only:** This phase is primarily visual polish. The meaningful automated checks are: (1) TypeScript compilation passes, (2) utility function logic is correct. Visual correctness requires browser inspection. No test framework exists in the project.

### Sampling Rate
- **Per task commit:** `npm run build` (must pass)
- **Per wave merge:** `npm run build` + visual inspection of affected pages
- **Phase gate:** Full build green + visual review of all 7 pages

### Wave 0 Gaps
No test framework exists. For Phase 4 (visual polish), `npm run build` is the primary automated gate. Installing a test framework is out of scope for this phase -- the cost/benefit ratio is poor for visual-only changes. If utility functions (groupByDay, getProjectColor, useDebounce) are extracted, they could be unit tested in a future phase.

## Sources

### Primary (HIGH confidence)
- Project codebase: `src/styles/globals.css`, `tailwind.config.ts`, `src/components/ui/badge.tsx`, `src/types/database.ts` -- direct inspection
- `.planning/feedback/PHASE-04-FIXES-SPEC.md` -- authoritative 64-item spec
- `.planning/phases/04-visual-polish/04-CONTEXT.md` -- all user decisions

### Secondary (MEDIUM confidence)
- [npm registry](https://www.npmjs.com/package/@icons-pack/react-simple-icons) -- @icons-pack/react-simple-icons v13.13.0
- [GitHub: icons-pack/react-simple-icons](https://github.com/icons-pack/react-simple-icons) -- import syntax and props documentation
- [npm registry](https://www.npmjs.com/package/react-markdown) -- react-markdown v10.1.0
- [Simple Icons](https://simpleicons.org/) -- 3150+ brand icon catalog

### Tertiary (LOW confidence)
- Beehiiv icon availability in Simple Icons -- not verified, may need fallback

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all libraries verified via npm, existing stack well understood from codebase inspection
- Architecture: HIGH -- patterns derived from existing codebase conventions and CONTEXT.md locked decisions
- Pitfalls: HIGH -- identified from direct codebase analysis (inline styles, CSS variable patterns, Tailwind purging)
- Icon availability: MEDIUM -- major brands confirmed via Simple Icons (3150+), Beehiiv uncertain

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable domain, no fast-moving dependencies)
