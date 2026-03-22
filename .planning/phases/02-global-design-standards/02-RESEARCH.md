# Phase 2: Global Design Standards - Research

**Researched:** 2026-03-22
**Domain:** CSS design tokens, Tailwind CSS component standardization, typography systems, shadcn/ui component migration
**Confidence:** HIGH

## Summary

Phase 2 is a systematic standardization pass across the entire codebase. The work is primarily mechanical: updating CSS variables to warm tones, fixing the shadcn Card component defaults, migrating 38 inline card class strings to `<Card>`, migrating 9+ inline button class strings to `<Button>`, eliminating 60+ inline `fontSize` styles in favor of typography classes, converting the mobile sidebar to use the already-installed shadcn Sheet component, adding a max-width constraint to PageShell, and auditing spacing gaps for consistency.

The codebase is well-structured for this work. All pages already use `<PageShell>`, all card styling uses a consistent inline pattern (`rounded-lg border bg-card p-6 shadow-card`), and buttons follow exactly 3 inline patterns (coral primary, ghost/outline, destructive). The shadcn Sheet component is already installed. The typography class system is already partially in place (6 classes exist in globals.css, 2 more need to be added).

**Primary recommendation:** Execute as a layered sequence -- tokens/foundations first, then component primitives (Card, Button, Sheet), then page-level migration sweeps for typography and spacing.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-18 through D-22:** Warm color palette with exact token values specified (bg-root #f5f0eb, bg-surface #ffffff, bg-elevated #ece5de, bg-active #e4ddd5, bg-sidebar #f0ebe5, warm-tinted borders)
- **D-01 through D-04:** Sidebar refinement (hover states, active coral border fix, 4px nav gap, Sheet migration for mobile)
- **D-05 through D-09:** Card system unification (fix Card component, migrate inline cards, hover-only-on-interactive, two-tier row padding)
- **D-10 through D-13:** Typography extensions (text-body-sm 13px, text-overline 11px, eliminate all inline fontSize, text-stat verification)
- **D-14 through D-15:** Layout constraints (max-w-[1280px] in PageShell, uniform section/card gaps)
- **D-16 through D-17:** Button migration to shadcn Button only; other shadcn components deferred to Phase 4

### Claude's Discretion
- Exact Sheet-based mobile sidebar animation timing and backdrop opacity
- Whether to create Tailwind @apply utilities for two-tier row padding or use raw classes
- How to handle Framer Motion transitions currently wrapping card elements (preserve or simplify)
- Order of file changes (sidebar first vs. cards first vs. typography first)
- Exact Button variant names and mapping to existing inline button styles

### Deferred Ideas (OUT OF SCOPE)
- Wiring Dialog, Tabs, Progress, Table, Separator shadcn components -- Phase 4
- Individual page layout redesigns -- Phase 3 (Dashboard) and Phase 4 (all other pages)
- Sonner toast provider wiring -- should already be done from Phase 1, verify only
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| VISL-01 | Sidebar has proper spacing, visual refinement, and premium feel | Decisions D-01 through D-04 specify exact hover, active, gap, and Sheet migration changes. Current sidebar code analyzed -- padding-shift bug confirmed on line 98. |
| VISL-02 | All cards use 24px padding, 14px radius, 1px subtle border, hover shadow | Card component uses wrong `rounded-xl` (18px) and bare `shadow`. 38 inline card strings across 14 files need migration to `<Card>`. Hover shadow token exists but is unwired. |
| VISL-03 | Typography hierarchy consistent across all pages | 60+ inline `fontSize` styles found across pages and components. 6 typography classes exist, 2 need adding (body-sm, overline). Every inline fontSize maps to an existing or planned class. |
| VISL-04 | Section gaps 32-40px, card gaps 20-24px across all pages | Dashboard already uses 32px section gap and 20px card gap. Other pages need audit -- many use inline style gaps that vary. |
</phase_requirements>

## Standard Stack

### Core (already installed, no new dependencies)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Tailwind CSS | 3.4.19 | Utility-first styling | Already configured with custom design tokens |
| shadcn/ui | N/A (copy-paste) | Card, Button, Sheet components | Already installed from Phase 1 |
| Framer Motion | 12.38.0 | Page transitions, whileTap on buttons | Already wired into PageShell and nav items |
| Radix UI Dialog | (via Sheet) | Mobile sidebar drawer accessibility | Sheet component already installed, wraps Radix Dialog |
| class-variance-authority | 0.7.1 | Button/Sheet variant composition | Already used in button.tsx and sheet.tsx |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| clsx + tailwind-merge | via `cn()` | Class name composition | Every className prop composition |

### Alternatives Considered
None. All decisions are locked. No new dependencies needed.

**Installation:** No new packages required.

## Architecture Patterns

### Recommended Change Sequence

The work layers naturally into foundation-then-consumption order:

```
Wave 1: Token Foundation
  globals.css     -- warm palette tokens, new typography classes, HSL bridge updates
  tailwind.config -- verify shadow utilities match tokens

Wave 2: Component Primitives
  card.tsx        -- fix rounded-xl to rounded-lg, shadow to shadow-card
  button.tsx      -- add coral variant, update ghost variant for warm palette
  Sidebar.tsx     -- hover states, gap, active border fix, Sheet migration
  PageShell.tsx   -- max-w-[1280px] mx-auto constraint

Wave 3: Page Migration Sweep
  All pages       -- replace inline card strings with <Card>, inline buttons with <Button>
  All pages       -- replace inline fontSize with typography classes
  All pages       -- audit and fix spacing gaps
```

### Pattern 1: Card Migration Pattern

**What:** Replace inline card class strings with shadcn `<Card>` component
**When to use:** Every occurrence of `className="rounded-lg border bg-card p-6 shadow-card"`

Current pattern (38 occurrences across 14 files):
```tsx
<div className="rounded-lg border bg-card p-6 shadow-card" style={{ padding: '14px 20px' }}>
```

Target pattern:
```tsx
import { Card, CardContent } from '@/components/ui/card'

// Simple card (no header needed)
<Card className="p-5">  {/* override default padding if needed */}
  {content}
</Card>

// Interactive card (gets hover shadow)
<Card className="p-6 transition-shadow hover:shadow-card-hover cursor-pointer">
  {content}
</Card>
```

Key detail: Many inline cards override the `p-6` padding via inline `style={{ padding: '14px 20px' }}`. After migration, these become className overrides on `<Card>` since `<Card>` itself has no padding (padding is on `CardHeader`/`CardContent` or via className).

### Pattern 2: Button Migration Pattern

**What:** Replace inline button class strings with shadcn `<Button>` component
**When to use:** Every occurrence of `inline-flex items-center gap-1.5 rounded-md bg-coral...`

Three inline button patterns identified:

1. **Coral primary** (4 occurrences):
```tsx
// Before
<button className="inline-flex items-center gap-1.5 rounded-md bg-coral px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-coral-dark cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">

// After (shadcn Button default variant already maps to --primary which is coral)
<Button>
```

2. **Ghost/outline** (5 occurrences):
```tsx
// Before
<button className="inline-flex items-center gap-1.5 rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary cursor-pointer">

// After
<Button variant="outline">
```

3. **Destructive** (1 occurrence in ContentPipeline reject):
```tsx
// Before
<button className="..." style={{ backgroundColor: 'hsl(var(--status-error))' }}>

// After
<Button variant="destructive">
```

Current `button.tsx` variant `default` uses `bg-primary` which maps to `--accent-coral` via the bridge. This means the default Button is already coral-styled. The `outline` variant maps correctly too. The `ghost` variant uses `--accent` (navy) which may need adjustment since the original ghost buttons hover to `bg-secondary` not navy.

### Pattern 3: Typography Class Replacement

**What:** Replace every inline `fontSize` style with a typography utility class
**When to use:** Every `style={{ fontSize: N }}` in the codebase

Mapping table (from D-12):
| Inline fontSize | Maps to class | Notes |
|-----------------|---------------|-------|
| 36px | `.text-stat` | Already exists |
| 28px | `.text-page-title` | Already exists |
| 20px | None -- use `text-xl` Tailwind | Only 1 occurrence (progress %) |
| 18px | `.text-section-header` | Already exists |
| 15px | `.text-card-title` | Already exists |
| 14px | `.text-body` | Already exists |
| 13px | `.text-body-sm` | NEW -- must add |
| 12px | `.text-caption` | Already exists |
| 11px | `.text-overline` | NEW -- must add |

The 13px `text-body-sm` is the most heavily used size in inline styles (30+ occurrences). Adding this class eliminates the biggest chunk of inline fontSize usage.

### Pattern 4: Warm Palette HSL Conversion

**What:** Convert hex warm palette values to bare HSL for shadcn variable format
**When to use:** Updating CSS variables in globals.css

| Token | Hex (from D-19) | HSL (bare, no hsl() wrapper) |
|-------|-----------------|------------------------------|
| --bg-root | #f5f0eb | 30 33% 94% |
| --bg-surface | #ffffff | 0 0% 100% |
| --bg-elevated | #ece5de | 30 26% 89% |
| --bg-active | #e4ddd5 | 32 22% 86% |
| --bg-sidebar | #f0ebe5 | 33 28% 92% |

Border tokens (D-20) use rgba with warm tint. These need conversion to solid HSL equivalents approximated against white background:
| Token | rgba value | Approximate solid HSL |
|-------|------------|----------------------|
| --border-subtle | rgba(120, 90, 60, 0.08) | 30 10% 94% |
| --border-default | rgba(120, 90, 60, 0.12) | 30 10% 91% |

Note: The existing `--border-strong` will need a matching warm shift for consistency.

### Anti-Patterns to Avoid
- **Mixing Card component with inline card classes:** After migration, NEVER use `rounded-lg border bg-card p-6 shadow-card` as raw classes on a `<div>`. Always use `<Card>`.
- **Adding hover shadow to non-interactive cards:** D-07 is explicit -- hover shadow is an affordance signal for clickable elements only. Static display cards (SystemHealthCard, stat cards) stay flat.
- **Inline fontSize after typography class system:** D-12 is explicit -- zero inline fontSize styles should remain after this phase.
- **Overriding warm palette back to cool grays:** Every HSL value in the bridge must use the warm palette.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Mobile sidebar drawer | Custom Framer Motion spring animation + manual overlay | shadcn `<Sheet side="left">` | Gets focus trap, ESC close, screen reader support, proper z-indexing for free |
| Button variant system | Inline className strings with coral/ghost/outline patterns | shadcn `<Button>` with CVA variants | Single source of truth, consistent hover/focus/disabled states |
| Card wrapper | Inline `rounded-lg border bg-card p-6 shadow-card` | shadcn `<Card>` component | One fix in card.tsx propagates everywhere |
| Typography scale | Inline `style={{ fontSize: N }}` | CSS utility classes in globals.css | Responsive breakpoint overrides, consistency, searchability |

**Key insight:** This phase is about collapsing 38 card patterns, 9+ button patterns, and 60+ fontSize patterns into 3 component sources of truth (card.tsx, button.tsx, globals.css). After this phase, changing a design token or component default propagates instantly everywhere.

## Common Pitfalls

### Pitfall 1: Padding Override Conflicts
**What goes wrong:** `<Card>` has no default padding on the root element, but `CardHeader` and `CardContent` each add `p-6`. If you wrap content in `<Card>` with only a `p-6` className and also use `CardContent`, you get double padding.
**Why it happens:** The current inline pattern puts `p-6` directly on the card div. The shadcn Card splits padding across subcomponents.
**How to avoid:** For simple cards that don't use CardHeader/CardContent, put padding directly on `<Card className="p-6">`. For structured cards, use CardContent for padding.
**Warning signs:** Cards that look like they have too much internal whitespace after migration.

### Pitfall 2: Shadow Utility vs CSS Variable
**What goes wrong:** `shadow-card` in Tailwind config is a hardcoded value (`0 1px 3px rgba(0,0,0,0.06)...`), while `--shadow-card` is a CSS variable with the same value. Using `shadow-[var(--shadow-card)]` is fragile and verbose.
**Why it happens:** Tailwind shadow utilities and CSS custom properties serve different authoring needs.
**How to avoid:** Use the Tailwind utility class `shadow-card` and `shadow-card-hover` directly. They are already defined in `tailwind.config.ts` with matching values. The CSS variables are for non-Tailwind contexts only.
**Warning signs:** `shadow-[var(--shadow-card)]` appearing in className strings.

### Pitfall 3: HSL Bridge Mismatch After Warm Palette
**What goes wrong:** shadcn bridge variables (`--background`, `--card`, `--secondary`, etc.) point to Forge tokens via `var()`. After updating Forge tokens to warm values, verify the bridge still maps correctly.
**Why it happens:** Bridge uses `var(--bg-root)` for `--background`, so updating `--bg-root` automatically flows through. But if any bridge variable hardcodes an HSL value instead of using var(), it won't update.
**How to avoid:** Audit the bridge section after changing tokens. Every shadcn variable should reference a Forge token via `var()`, never a raw HSL value.
**Warning signs:** Some elements appear warm while others remain cool gray.

### Pitfall 4: Sidebar Padding-Shift Bug
**What goes wrong:** Active nav items currently use `paddingLeft: 8` while inactive use `paddingLeft: 10`, creating a 2px layout shift when navigating. This is a compensation hack for the 2px coral left border.
**Why it happens:** The `borderLeft: 2px solid` adds 2px width, so the developer subtracted 2px from padding.
**How to avoid:** Use a transparent border on inactive items (`2px solid transparent`) so the total box width is always the same. This is already half-done (line 97-98 of Sidebar.tsx) but the padding still shifts.
**Warning signs:** Nav items visually "jump" left/right when switching pages.

### Pitfall 5: Ghost Button Hover Color
**What goes wrong:** The current shadcn ghost variant hovers to `--accent` (navy), but existing inline ghost buttons hover to `--bg-secondary` (a neutral background). After migration, ghost buttons would turn navy on hover instead of subtle gray.
**Why it happens:** shadcn defaults assume `--accent` is a neutral gray, but Forge maps it to navy.
**How to avoid:** Update the ghost variant in button.tsx to use `hover:bg-secondary` instead of `hover:bg-accent` for this project. Or keep `hover:bg-accent` and remap `--accent` -- but that affects all accent usage.
**Warning signs:** Ghost buttons turning dark navy on hover when they should show subtle background shift.

## Code Examples

### Warm Palette Token Update (globals.css)
```css
/* Source: D-19, D-20 from CONTEXT.md */
:root {
  /* Backgrounds -- warm cream/beige */
  --bg-root: 30 33% 94%;         /* #f5f0eb */
  --bg-surface: 0 0% 100%;       /* #ffffff (unchanged) */
  --bg-elevated: 30 26% 89%;     /* #ece5de */
  --bg-active: 32 22% 86%;       /* #e4ddd5 */
  --bg-sidebar: 33 28% 92%;      /* #f0ebe5 (NEW token) */

  /* Borders -- warm tint */
  --border-subtle: 30 10% 94%;   /* rgba(120,90,60,0.08) on white */
  --border-default: 30 10% 91%;  /* rgba(120,90,60,0.12) on white */
}
```

### New Typography Classes (globals.css)
```css
/* Source: D-10, D-11 from CONTEXT.md */
.text-body-sm {
  font-size: 13px;
  font-weight: 400;
  color: hsl(var(--text-primary));
}

.text-overline {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: hsl(var(--text-tertiary));
}
```

### Card Component Fix (card.tsx)
```tsx
// Source: D-05 from CONTEXT.md
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-card",
      //  ^^^ was rounded-xl                           ^^^ was shadow
      className
    )}
    {...props}
  />
))
```

### Sheet-Based Mobile Sidebar
```tsx
// Source: D-04 from CONTEXT.md
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'

// Replace AnimatePresence mobile overlay with:
<Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
  <SheetContent side="left" className="w-[260px] p-0">
    <SheetTitle className="sr-only">Navigation</SheetTitle>
    <SidebarContent onNavigate={() => setMobileOpen(false)} />
  </SheetContent>
</Sheet>
```

Note: SheetTitle with `sr-only` satisfies the Radix Dialog accessibility requirement for a title element without showing visible text.

### PageShell Max-Width Constraint
```tsx
// Source: D-14 from CONTEXT.md
<div
  className="page-shell-content"
  style={{ padding: '24px 40px 48px', flex: 1 }}
>
  <div className="max-w-[1280px] mx-auto">
    {children}
  </div>
</div>
```

### Sidebar Active Border Fix
```tsx
// Source: D-02 from CONTEXT.md -- fix padding-shift bug
// Both active and inactive get 2px border (transparent when inactive)
style={{
  borderLeft: '2px solid',
  borderLeftColor: isActive ? 'hsl(var(--accent-coral))' : 'transparent',
  paddingLeft: 8,  // consistent regardless of active state
}}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Cool gray palette (#f8f9fb) | Warm cream palette (#f5f0eb) | This phase (D-18) | All background/border tokens shift warm |
| Inline card class strings | shadcn Card component | This phase (D-06) | 38 inline patterns collapse to 1 component |
| Inline button class strings | shadcn Button component | This phase (D-16) | 9+ inline patterns collapse to 3 variants |
| Inline fontSize styles | Typography utility classes | This phase (D-12) | 60+ inline styles collapse to 8 classes |
| Custom Framer Motion mobile drawer | shadcn Sheet (Radix Dialog) | This phase (D-04) | Focus trap, ESC, screen reader for free |

**Deprecated/outdated:**
- `rounded-xl` on Card: Must become `rounded-lg` (14px, per spec)
- Bare `shadow` on Card: Must become `shadow-card` (spec-compliant shadow)
- All inline `fontSize` styles: Must map to typography classes
- Custom mobile sidebar animation: Replaced by Sheet

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected (no Jest, Vitest, etc.) |
| Config file | none -- see Wave 0 |
| Quick run command | `npm run build` (TypeScript compilation check) |
| Full suite command | `npm run build` (only available validation) |

### Phase Requirements to Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| VISL-01 | Sidebar spacing, hover, active states, Sheet mobile drawer | manual-only | Visual inspection in browser | N/A |
| VISL-02 | Card padding/radius/border/hover shadow consistency | manual-only + build | `npm run build` verifies no TS errors from Card migration | N/A |
| VISL-03 | Typography hierarchy consistent, no inline fontSize | grep audit | `grep -r "fontSize" src/pages/ src/components/ --include="*.tsx"` | N/A |
| VISL-04 | Section gaps 32-40px, card gaps 20-24px | manual-only | Visual inspection in browser | N/A |

**Justification for manual-only:** These are visual design requirements. Without a visual regression testing tool (Chromatic, Percy, etc.), browser inspection is the only reliable verification. The `npm run build` check catches TypeScript and import errors from migrations.

### Sampling Rate
- **Per task commit:** `npm run build`
- **Per wave merge:** `npm run build` + visual spot-check
- **Phase gate:** Full `npm run build` + visual audit of all 8 pages

### Wave 0 Gaps
- No test framework installed -- visual requirements cannot be automatically tested
- Grep audit for leftover inline fontSize is automatable: `grep -rn "fontSize" src/pages/ src/components/ --include="*.tsx" | grep -v "node_modules"`
- Grep audit for leftover inline card classes: `grep -rn "rounded-lg border bg-card p-6 shadow-card" src/ --include="*.tsx"`

## Open Questions

1. **Ghost button hover color mismatch**
   - What we know: shadcn ghost variant uses `hover:bg-accent` (navy). Existing inline ghosts use `hover:bg-secondary` (neutral).
   - What's unclear: Whether to update the ghost variant or remap `--accent`.
   - Recommendation: Update ghost variant to `hover:bg-secondary hover:text-secondary-foreground`. Safest change, no side effects on other accent usage.

2. **Sidebar background token**
   - What we know: D-19 introduces `--bg-sidebar: #f0ebe5` as a new token not in current globals.css.
   - What's unclear: Whether the desktop sidebar background should use `--bg-sidebar` (warm) or stay `--bg-surface` (white).
   - Recommendation: Desktop sidebar uses `--bg-sidebar` for warm tone. Add the token and wire it.

3. **Border-strong warm shift**
   - What we know: D-20 specifies warm border-subtle and border-default. `--border-strong` is not mentioned.
   - What's unclear: Whether border-strong should also shift warm.
   - Recommendation: Shift it warm for consistency. Use `30 10% 87%` (matching the warm tint pattern).

## Scope Quantification

| Item | Count | Files |
|------|-------|-------|
| Inline card class strings to migrate | 38 | 14 files |
| Inline button class strings to migrate | 9+ | 3 page files + 2 component files |
| Inline fontSize styles to replace | 60+ | 8 page files + 6 component files |
| CSS token updates (warm palette) | ~10 variables | 1 file (globals.css) |
| New typography classes | 2 | 1 file (globals.css) |
| Component fixes (Card, Button) | 2 files | card.tsx, button.tsx |
| Sidebar refactor | 1 file | Sidebar.tsx |
| PageShell update | 1 file | PageShell.tsx |

Total estimated file touches: ~25 files

## Sources

### Primary (HIGH confidence)
- `src/styles/globals.css` -- Current token definitions, typography classes, shadow tokens
- `src/components/ui/card.tsx` -- Current Card component (confirmed `rounded-xl` and bare `shadow` issues)
- `src/components/ui/button.tsx` -- Current Button variants (confirmed ghost hover uses `--accent`)
- `src/components/ui/sheet.tsx` -- Confirmed Sheet component installed and functional
- `src/components/layout/Sidebar.tsx` -- Confirmed padding-shift bug on lines 96-98
- `src/components/layout/PageShell.tsx` -- Confirmed no max-width constraint currently
- `tailwind.config.ts` -- Confirmed borderRadius math: `rounded-lg` = 14px, `rounded-xl` = 18px

### Secondary (MEDIUM confidence)
- Grep audit across all pages/components -- 38 card patterns, 9+ button patterns, 60+ fontSize instances
- HSL conversions from hex values -- computed, may need fine-tuning by visual inspection

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- no new dependencies, all already installed
- Architecture: HIGH -- patterns derived directly from existing code and locked decisions
- Pitfalls: HIGH -- confirmed by reading actual source code
- Typography mapping: HIGH -- every inline fontSize maps to an existing or planned class
- Warm palette HSL values: MEDIUM -- hex-to-HSL conversions may need visual fine-tuning

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable -- design tokens and component APIs don't change frequently)
