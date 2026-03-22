---
phase: 01-component-foundation
plan: 02
subsystem: ui
tags: [shadcn, radix-ui, badge, skeleton, css-cleanup, tailwind]

requires:
  - phase: 01-component-foundation plan 01
    provides: "HSL design tokens, shadcn variable bridge, components.json, tailwindcss-animate"
provides:
  - "21 shadcn/ui component primitives (button, card, badge, input, etc.)"
  - "Badge component with 11 variants including 7 Forge Console custom variants"
  - "SkeletonBlock compatibility wrapper around shadcn Skeleton"
  - "Clean globals.css with only typography, status-dot, scrollbar, and selection styles"
affects: [02-visual-quality, 03-dashboard-redesign, all-ui-phases]

tech-stack:
  added: [sonner, "@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu", "@radix-ui/react-label", "@radix-ui/react-scroll-area", "@radix-ui/react-select", "@radix-ui/react-separator", "@radix-ui/react-switch", "@radix-ui/react-tabs", "@radix-ui/react-tooltip", "@radix-ui/react-checkbox", "@radix-ui/react-progress"]
  patterns: ["shadcn component primitives with CVA variants", "SkeletonBlock wrapper delegating to shadcn Skeleton"]

key-files:
  created:
    - src/components/ui/button.tsx
    - src/components/ui/card.tsx
    - src/components/ui/badge.tsx
    - src/components/ui/skeleton.tsx
    - src/components/ui/sonner.tsx
    - src/components/ui/dialog.tsx
    - src/components/ui/dropdown-menu.tsx
    - src/components/ui/input.tsx
    - src/components/ui/label.tsx
    - src/components/ui/select.tsx
    - src/components/ui/separator.tsx
    - src/components/ui/tabs.tsx
    - src/components/ui/tooltip.tsx
    - src/components/ui/switch.tsx
    - src/components/ui/checkbox.tsx
    - src/components/ui/progress.tsx
    - src/components/ui/table.tsx
    - src/components/ui/sheet.tsx
    - src/components/ui/alert.tsx
    - src/components/ui/scroll-area.tsx
    - src/components/ui/textarea.tsx
  modified:
    - src/components/ui/SkeletonBlock.tsx
    - src/styles/globals.css
    - src/pages/BrainDump.tsx
    - src/pages/ActivityLog.tsx
    - src/pages/ContentPipeline.tsx
    - src/pages/ProjectDetail.tsx
    - src/pages/Settings.tsx
    - src/pages/SocialMedia.tsx
    - src/pages/Projects.tsx

key-decisions:
  - "Moved shadcn files from literal @/ directory to src/ after CLI path resolution issue"
  - "Replaced 37 className='card' usages with Tailwind utilities instead of shadcn Card components"
  - "Replaced btn-primary, btn-ghost, input CSS classes with inline Tailwind utility strings"
  - "Fixed sonner.tsx circular import by importing from sonner package instead of self-reference"

patterns-established:
  - "shadcn components in src/components/ui/ with lowercase filenames"
  - "Badge variants include both shadcn defaults (default, secondary, destructive, outline) and Forge Console customs (success, warning, error, info, navy, coral, neutral)"
  - "SkeletonBlock wrapper pattern for backward compatibility"

requirements-completed: [FOUN-02]

duration: 5min
completed: 2026-03-22
---

# Phase 01 Plan 02: shadcn Component Library Summary

**21 shadcn/ui primitives installed with custom Badge variants (success/warning/error/info/navy/coral/neutral), SkeletonBlock compatibility wrapper, and globals.css cleaned of all replaced CSS component classes**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-22T12:44:31Z
- **Completed:** 2026-03-22T12:49:44Z
- **Tasks:** 2
- **Files modified:** 50

## Accomplishments
- Installed 21 shadcn/ui component primitives via CLI (button, card, badge, input, select, dialog, etc.)
- Extended badge.tsx with 7 Forge Console custom variants preserving existing API compatibility
- Created SkeletonBlock wrapper that delegates to shadcn Skeleton for backward compatibility
- Removed all orphaned CSS component classes (.card, .btn-primary, .btn-ghost, .badge, .input, .skeleton) from globals.css
- Replaced 37 className="card" usages and all btn-primary/btn-ghost/input class usages with Tailwind utilities

## Task Commits

Each task was committed atomically:

1. **Task 1: Install shadcn components and extend Badge** - `623dddb` (feat)
2. **Task 2: Remove orphaned CSS and replace class usages** - `f6a98a2` (chore)

## Files Created/Modified
- `src/components/ui/button.tsx` - shadcn Button with size/variant props
- `src/components/ui/card.tsx` - shadcn Card with Header/Content/Footer subcomponents
- `src/components/ui/badge.tsx` - shadcn Badge extended with 7 Forge Console variants
- `src/components/ui/skeleton.tsx` - shadcn Skeleton (animate-pulse)
- `src/components/ui/SkeletonBlock.tsx` - Compatibility wrapper around shadcn Skeleton
- `src/components/ui/sonner.tsx` - Toast notification wrapper (fixed circular import)
- `src/components/ui/dialog.tsx` - Modal dialog via Radix
- `src/components/ui/dropdown-menu.tsx` - Dropdown menu via Radix
- `src/components/ui/select.tsx` - Select input via Radix
- `src/components/ui/tabs.tsx` - Tab navigation via Radix
- `src/components/ui/tooltip.tsx` - Tooltip via Radix
- `src/components/ui/sheet.tsx` - Side panel via Radix
- `src/components/ui/switch.tsx` - Toggle switch via Radix
- `src/components/ui/checkbox.tsx` - Checkbox via Radix
- `src/components/ui/progress.tsx` - Progress bar via Radix
- `src/components/ui/scroll-area.tsx` - Custom scroll area via Radix
- `src/components/ui/input.tsx` - Text input primitive
- `src/components/ui/label.tsx` - Form label primitive
- `src/components/ui/separator.tsx` - Visual separator
- `src/components/ui/table.tsx` - Table components
- `src/components/ui/alert.tsx` - Alert banner
- `src/components/ui/textarea.tsx` - Multi-line text input
- `src/styles/globals.css` - Removed .card, .btn-primary, .btn-ghost, .badge, .input, .skeleton classes; kept typography, status-dot, scrollbar, selection

## Decisions Made
- Moved shadcn output files from literal `@/` directory to `src/` -- the shadcn CLI resolved the path alias literally instead of following the Vite alias mapping
- Replaced className="card" usages with Tailwind utilities (`rounded-lg border bg-card p-6 shadow-card`) rather than converting to shadcn Card components -- keeps the scope manageable and preserves existing inline style overrides
- Fixed sonner.tsx which had a circular self-import and a next-themes dependency -- rewrote to import directly from the sonner package without theme support (not needed for single-user app)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed shadcn CLI path resolution**
- **Found during:** Task 1 (shadcn component installation)
- **Issue:** shadcn CLI created files in literal `@/components/ui/` directory instead of `src/components/ui/`
- **Fix:** Moved all 21 files from `@/components/ui/` to `src/components/ui/` and removed the `@/` directory
- **Files modified:** 21 component files (moved)
- **Verification:** All files exist at correct paths, imports resolve, build passes
- **Committed in:** 623dddb (Task 1 commit)

**2. [Rule 1 - Bug] Fixed sonner.tsx circular import**
- **Found during:** Task 1 (build verification)
- **Issue:** Generated sonner.tsx imported `Toaster as Sonner` from itself (`@/components/ui/sonner`) instead of the `sonner` package, and referenced `next-themes` which is not installed
- **Fix:** Rewrote to import from `sonner` package directly and removed theme dependency
- **Files modified:** src/components/ui/sonner.tsx
- **Verification:** Build passes, no circular reference errors
- **Committed in:** 623dddb (Task 1 commit)

**3. [Rule 3 - Blocking] Replaced className="card" and other CSS class usages**
- **Found during:** Task 2 (CSS cleanup)
- **Issue:** 37 files used `className="card"` and several used `btn-primary`, `btn-ghost`, `input` CSS classes that were being removed
- **Fix:** Bulk-replaced all usages with equivalent Tailwind utility strings
- **Files modified:** 12 page and component files
- **Verification:** Build passes, no missing class errors
- **Committed in:** f6a98a2 (Task 2 commit)

---

**Total deviations:** 3 auto-fixed (1 bug, 2 blocking)
**Impact on plan:** All auto-fixes necessary for build correctness. No scope creep.

## Issues Encountered
- shadcn CLI v4.1.0 path alias resolution does not honor Vite/tsconfig path mappings -- resolved by manually moving files
- sonner.tsx template assumes next-themes and self-references -- resolved by rewriting import

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 21 shadcn primitives available for use in visual quality pass (Plan 03 and Phase 02)
- Badge component ready with all Forge Console variants
- SkeletonBlock backward-compatible, existing loading states work
- globals.css clean -- only typography, status-dot, scrollbar, selection remain
- Tailwind v3.4.19 confirmed

## Self-Check: PASSED

- All key files exist (button.tsx, card.tsx, badge.tsx, skeleton.tsx, sonner.tsx, SkeletonBlock.tsx)
- All commits verified (623dddb, f6a98a2)
- Build passes with zero TypeScript errors

---
*Phase: 01-component-foundation*
*Completed: 2026-03-22*
