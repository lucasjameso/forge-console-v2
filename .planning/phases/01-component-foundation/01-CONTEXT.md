# Phase 1: Component Foundation - Context

**Gathered:** 2026-03-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Adopt shadcn/ui as the component system, replacing all custom CSS component classes with shadcn primitives. Bridge existing design tokens to shadcn's variable system. Add toast notifications (sonner), error boundaries, and a branded favicon. After this phase, every UI element renders as a shadcn component with Forge Console design tokens.

</domain>

<decisions>
## Implementation Decisions

### Token Bridge Strategy
- **D-01:** Keep existing CSS variable names as the source of truth. Map shadcn's expected variables (--background, --primary, --border, etc.) to point at the existing Forge Console tokens (--bg-root, --accent-coral, --border-subtle, etc.)
- **D-02:** Convert all existing hex (#C75B3F) and rgba values to HSL format to match shadcn conventions. This means rewriting globals.css token values to HSL.
- **D-03:** Back up globals.css before running shadcn init. Manual merge after -- do NOT let the CLI overwrite the existing file.
- **D-04:** Self-host Inter font via @fontsource/inter. Remove the Google Fonts CDN import from globals.css. Required for PWA offline support in Phase 8.

### Component Migration Scope
- **D-05:** Install ALL shadcn component groups:
  - Core primitives: Button, Card, Badge, Input, Label, Select, Separator, Tabs, Dialog, Tooltip, Switch, Checkbox, Progress
  - Data display: Table, Dropdown Menu, Sheet (for mobile sidebar)
  - Feedback: Sonner (toasts), Alert
  - Layout: Scroll Area, Skeleton
- **D-06:** Replace existing SkeletonBlock component with shadcn's Skeleton component
- **D-07:** Replace existing Badge component with shadcn's Badge (preserve existing variant names if possible)
- **D-08:** StatusDot component may remain as custom (shadcn has no equivalent) but should use shadcn styling conventions

### Cleanup Strategy
- **D-09:** Remove custom CSS component classes (.btn-primary, .card, .badge-*, .input-*) immediately as each shadcn component replaces them. Clean as you go, do not leave dead code.

### Toast Behavior
- **D-10:** Use sonner for all toast notifications
- **D-11:** Toast position: bottom-right of viewport
- **D-12:** Toast duration: 3 seconds default
- **D-13:** Every mutating action (save, create, delete, approve, reject) must trigger a toast confirming the result. Both success and error states.

### Error Boundary UX
- **D-14:** Two-layer error boundary architecture:
  - Per-section ErrorBoundary around individual components/cards (broken section shows error card, rest of page works)
  - Full-page ErrorBoundary as outer safety net (catches anything sections miss)
- **D-15:** Error fallback UI includes: "Something went wrong" message, "Try again" retry button, and expandable error details section for debugging

### Favicon
- **D-16:** Coral F on navy background. SVG favicon preferred for crisp rendering at all sizes.

### Claude's Discretion
- Exact shadcn init configuration flags
- Order of component migration (which components first)
- How to handle Framer Motion + Radix animation boundaries
- Error boundary component implementation details
- Exact HSL values for token conversion (mathematically equivalent to current hex)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System
- `idea.md` -- Full design system spec (colors, typography, spacing, component patterns, absolute rules)
- `src/styles/globals.css` -- Current CSS variables and custom component classes (source of truth for token values)

### Current Components
- `src/components/ui/Badge.tsx` -- Existing Badge to be replaced
- `src/components/ui/SkeletonBlock.tsx` -- Existing Skeleton to be replaced
- `src/components/ui/StatusDot.tsx` -- Custom component to keep but align with shadcn conventions

### Stack Context
- `.planning/codebase/STACK.md` -- Current dependency versions (Radix, Tailwind, CVA, clsx, tailwind-merge)
- `.planning/research/STACK.md` -- Research on shadcn adoption approach, specific install commands, version pinning
- `.planning/research/PITFALLS.md` -- Critical warnings about shadcn init overwriting globals.css and Tailwind v4 migration risk

### Build Configuration
- `tailwind.config.ts` -- Custom theme with coral/navy colors, radius, shadows
- `vite.config.ts` -- Path alias (@) configuration
- `tsconfig.app.json` -- Strict TypeScript settings

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/lib/utils.ts` -- Already has `cn()` utility (clsx + tailwind-merge) which shadcn requires
- `src/lib/queryClient.ts` -- React Query client for wiring toast notifications to mutation callbacks
- 11 Radix UI primitives already installed (dialog, checkbox, dropdown-menu, label, progress, select, separator, slot, switch, tabs, tooltip)

### Established Patterns
- All data fetching via React Query hooks in `src/hooks/`
- Mutations use `useMutation` with `onSuccess`/`onError` callbacks -- natural place to wire toasts
- Tailwind utility classes used directly in page components for buttons, cards, inputs (no component abstraction)
- Framer Motion used for page transitions (AnimatePresence in App.tsx) and card animations

### Integration Points
- `src/App.tsx` -- Add Sonner Toaster provider and outer ErrorBoundary here
- `src/styles/globals.css` -- Token bridge happens here (add shadcn variables mapping to existing tokens)
- `src/components/ui/` -- shadcn components will be generated here via CLI
- Every page in `src/pages/` -- Will consume new shadcn components (but migration of page code is Phase 2-4, not this phase)
- `tailwind.config.ts` -- May need updates for shadcn's animation plugin (tailwindcss-animate)

</code_context>

<specifics>
## Specific Ideas

- shadcn init must NOT overwrite globals.css. Back up first, then manually merge shadcn's additions.
- Stay on Tailwind v3 (3.4.19). Do NOT migrate to Tailwind v4. Use `tailwindcss-animate` (not `tw-animate-css` which is v4 only).
- The existing Radix primitives are the same ones shadcn wraps -- migration should be straightforward.
- Research flagged that Framer Motion and Radix both want to control transitions. Establish clear animation boundaries during adoption.

</specifics>

<deferred>
## Deferred Ideas

None -- discussion stayed within phase scope

</deferred>

---

*Phase: 01-component-foundation*
*Context gathered: 2026-03-22*
