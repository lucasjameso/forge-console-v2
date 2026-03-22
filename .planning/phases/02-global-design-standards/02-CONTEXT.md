# Phase 2: Global Design Standards - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Establish consistent sidebar polish, card styling, typography hierarchy, and spacing rules across every page in the app. This phase creates the visual quality bar that all subsequent page-level work (Phase 4) builds on. It does NOT redesign individual page layouts -- it standardizes the shared primitives they all use.

</domain>

<decisions>
## Implementation Decisions

### Warm Color Palette
- **D-18:** Replace all cool gray background tokens with warm cream/beige tones matching Claude's UI aesthetic. The app should feel warm, not cold like a generic SaaS dashboard.
- **D-19:** Exact token values:
  - `--bg-root`: `#f5f0eb` (warm cream, replaces current cool gray `#f8f9fb`)
  - `--bg-surface`: `#ffffff` (white cards stay unchanged)
  - `--bg-elevated`: `#ece5de` (warm beige hover state, replaces cool gray)
  - `--bg-active`: `#e4ddd5` (warm pressed state)
  - `--bg-sidebar`: `#f0ebe5` (warm sidebar background)
- **D-20:** Border tokens shift to warm tint:
  - `--border-subtle`: `rgba(120, 90, 60, 0.08)` (warm tint, not pure black alpha)
  - `--border-default`: `rgba(120, 90, 60, 0.12)`
- **D-21:** Text colors stay unchanged (dark text on warm backgrounds works fine). Accent coral `#C75B3F` and navy `#1B3A52` stay unchanged.
- **D-22:** All HSL conversions for shadcn bridge variables must use the warm palette values, not the old cool grays.

### Sidebar Refinement
- **D-01:** Add hover state to nav items: elevated background (`bg-elevated`) + text shifts from `text-secondary` to `text-primary`. No color accent on hover -- coral is reserved for the active state.
- **D-02:** Active nav item gets full-width subtle elevated background + coral left border (2px). Clean up the current padding-shift hack so active/inactive items have identical padding.
- **D-03:** Increase nav item gap from 2px to 4px. Keep the sidebar compact but clearly separated.
- **D-04:** Migrate mobile sidebar drawer from custom Framer Motion spring animation to shadcn Sheet component. Gets focus trap, ESC close, and screen reader support for free.

### Card System Unification
- **D-05:** Fix the shadcn `Card` component (`card.tsx`) to use `rounded-lg` and `shadow-card` instead of `rounded-xl` and bare `shadow`. This aligns it with the spec: 14px radius, 24px padding, 1px subtle border.
- **D-06:** Migrate all inline card class strings (`rounded-lg border bg-card p-6 shadow-card`) to use the shadcn `<Card>` component. Single source of truth for card styling.
- **D-07:** Card hover shadow (`shadow-card-hover`: `0 2px 8px rgba(0,0,0,0.06)`) applied ONLY to clickable/interactive cards (project cards, content cards that navigate). Static display cards (system health, stats) stay flat. Hover = affordance signal.
- **D-08:** Two-tier inner row padding system:
  - Compact: `py-2 px-3` (8px 12px) -- for dense lists: activity log rows, system health rows, kanban task items
  - Normal: `py-3 px-4` (12px 16px) -- for standard rows: brain dump tasks, notes, settings items
- **D-09:** Inner card list gaps match row tier: 6px gap for compact rows, 10px gap for normal rows.

### Typography System Extension
- **D-10:** Add `.text-body-sm` class: 13px, weight 400, `--text-primary`. For dense list text, secondary descriptions, sidebar nav labels. Fills the gap between 14px body and 12px caption.
- **D-11:** Add `.text-overline` class: 11px, weight 600, uppercase, letter-spacing 0.05em, `--text-tertiary`. For section dividers, status labels, uppercase chips.
- **D-12:** Eliminate ALL raw inline `fontSize` styles across the codebase. Every font size must map to a `.text-*` class. The full type ladder becomes: 36px stat / 28px page-title / 18px section-header / 15px card-title / 14px body / 13px body-sm / 12px caption / 11px overline.
- **D-13:** Add a `.text-stat` class at 36px if not already present (it exists in globals.css -- verify and use consistently).

### Spacing and Layout
- **D-14:** Apply `max-w-[1280px] mx-auto` to the content area inside PageShell. Sidebar stays fixed outside. On 1440px+ screens, content is centered with balanced margins.
- **D-15:** Section gaps 32-40px and card gaps 20-24px enforced uniformly (already close -- audit and fix outliers).

### Button Migration
- **D-16:** Replace all manual inline button class strings (`inline-flex items-center gap-1.5 rounded-md bg-coral px-4 py-2...`) with the shadcn `<Button>` component. Update `button.tsx` variants if needed to support coral primary and ghost styles.
- **D-17:** All other unused shadcn components (Dialog, Tabs, Sheet for non-sidebar use, Progress, Table, Separator) stay unwired until Phase 4 page-level polish. Only Button is migrated in this phase.

### Claude's Discretion
- Exact implementation of Sheet-based mobile sidebar (animation timing, backdrop opacity)
- Whether to create Tailwind @apply utilities for the two-tier row padding or use raw classes
- How to handle Framer Motion transitions that currently wrap card elements (preserve or simplify)
- Order of file changes (sidebar first vs. cards first vs. typography first)
- Exact Button variant names and mapping to existing inline button styles

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System Spec
- `idea.md` -- Full design system spec: colors, typography ladder, spacing scale, component patterns, absolute rules
- `src/styles/globals.css` -- CSS variables (design tokens), typography utility classes, shadow tokens

### Sidebar
- `src/components/layout/Sidebar.tsx` -- Current sidebar: nav items, hover/active states, mobile drawer, spacing

### Card System
- `src/components/ui/card.tsx` -- shadcn Card component (needs radius/shadow fix)
- `src/components/ui/button.tsx` -- shadcn Button component (needs variant updates for coral primary)

### Page Shell
- `src/components/layout/PageShell.tsx` -- Layout wrapper where max-width constraint goes

### Pages (for typography/spacing audit)
- `src/pages/Dashboard.tsx` -- Dashboard cards and stat display
- `src/pages/Projects.tsx` -- Project card list
- `src/pages/ProjectDetail.tsx` -- Dense command-center layout
- `src/pages/BrainDump.tsx` -- Input-to-results flow
- `src/pages/ContentPipeline.tsx` -- Four view modes
- `src/pages/SocialMedia.tsx` -- Platform cards and stats
- `src/pages/ActivityLog.tsx` -- Timeline rows
- `src/pages/Settings.tsx` -- Integration cards

### Phase 1 Context
- `.planning/phases/01-component-foundation/01-CONTEXT.md` -- Token bridge decisions, shadcn adoption approach

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` -- `cn()` utility (clsx + tailwind-merge) for composing className strings
- `src/styles/globals.css` -- Typography classes (`.text-page-title`, `.text-section-header`, `.text-card-title`, `.text-body`, `.text-caption`, `.text-stat`) already defined. Shadow tokens (`--shadow-card`, `--shadow-card-hover`) defined but hover never used.
- `src/components/ui/sheet.tsx` -- shadcn Sheet already installed, ready for mobile sidebar migration

### Established Patterns
- All pages wrap in `<PageShell>` -- max-width constraint goes in one place
- Cards use inline `rounded-lg border bg-card p-6 shadow-card` pattern consistently -- migration to `<Card>` is mechanical
- Buttons use 3 inline patterns (coral primary, ghost, outline) -- need to map to shadcn Button variants

### Integration Points
- `src/components/layout/Sidebar.tsx` -- Hover states, gap, Sheet migration, nav label font class
- `src/components/ui/card.tsx` -- Fix rounded-xl to rounded-lg, shadow to shadow-card
- `src/components/ui/button.tsx` -- Add coral variant, update ghost variant
- `src/components/layout/PageShell.tsx` -- Add max-w-[1280px] mx-auto to content wrapper
- `src/styles/globals.css` -- Add .text-body-sm and .text-overline classes
- Every page file in `src/pages/` -- Replace inline fontSize with classes, migrate card strings to <Card>, migrate button strings to <Button>

</code_context>

<specifics>
## Specific Ideas

- The shadcn Card component currently uses `rounded-xl` (18px) and bare Tailwind `shadow` -- must be changed to `rounded-lg` (14px) and `shadow-card` to match the spec exactly.
- `--shadow-card-hover` is already defined in globals.css as `0 2px 8px rgba(0,0,0,0.06)` but never referenced anywhere. Wire it into clickable cards.
- The sidebar's 2px coral left border currently causes a padding shift (paddingLeft drops from 10 to 8 to compensate). Fix this so layout doesn't jump.
- 25 shadcn components installed in Phase 1 but only Badge, SkeletonBlock (custom), StatusDot (custom), and ErrorFallback are actually used. Button migration happens here; the rest wait for Phase 4.

</specifics>

<deferred>
## Deferred Ideas

- Wiring Dialog, Tabs, Progress, Table, Separator shadcn components -- Phase 4 page-level polish
- Individual page layout redesigns -- Phase 3 (Dashboard) and Phase 4 (all other pages)
- Sonner toast provider wiring -- should already be done from Phase 1, verify

</deferred>

---

*Phase: 02-global-design-standards*
*Context gathered: 2026-03-22*
