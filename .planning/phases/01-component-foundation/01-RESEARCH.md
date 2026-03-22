# Phase 1: Component Foundation - Research

**Researched:** 2026-03-22
**Domain:** shadcn/ui adoption, design token bridging, toast notifications, error boundaries, favicon
**Confidence:** HIGH

## Summary

Phase 1 replaces all custom CSS component classes with shadcn/ui primitives, bridges the existing Forge Console design tokens to shadcn's CSS variable system, adds toast notifications via sonner, implements error boundaries, and creates a branded favicon. The project already has 90% of the shadcn foundation in place (cn() utility, 11 Radix primitives, CVA, path aliases). The main work is: (1) running shadcn init safely without overwriting globals.css, (2) converting hex/rgba tokens to HSL, (3) mapping shadcn variables to existing tokens, (4) installing and configuring shadcn components, (5) migrating 46 usages of custom CSS classes across 13 files, (6) wiring sonner toasts to 3 existing mutation hooks, and (7) creating error boundary components.

**Primary recommendation:** Run shadcn init with manual globals.css merge, install all components via CLI, then migrate by component type (all buttons, then all cards, etc.) rather than page-by-page to avoid orphaned CSS inconsistency.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Keep existing CSS variable names as the source of truth. Map shadcn's expected variables (--background, --primary, --border, etc.) to point at the existing Forge Console tokens (--bg-root, --accent-coral, --border-subtle, etc.)
- **D-02:** Convert all existing hex (#C75B3F) and rgba values to HSL format to match shadcn conventions. This means rewriting globals.css token values to HSL.
- **D-03:** Back up globals.css before running shadcn init. Manual merge after -- do NOT let the CLI overwrite the existing file.
- **D-04:** Self-host Inter font via @fontsource/inter. Remove the Google Fonts CDN import from globals.css. Required for PWA offline support in Phase 8.
- **D-05:** Install ALL shadcn component groups (Core primitives, Data display, Feedback, Layout).
- **D-06:** Replace existing SkeletonBlock component with shadcn's Skeleton component.
- **D-07:** Replace existing Badge component with shadcn's Badge (preserve existing variant names if possible).
- **D-08:** StatusDot component may remain as custom but should use shadcn styling conventions.
- **D-09:** Remove custom CSS component classes immediately as each shadcn component replaces them. Clean as you go.
- **D-10:** Use sonner for all toast notifications.
- **D-11:** Toast position: bottom-right of viewport.
- **D-12:** Toast duration: 3 seconds default.
- **D-13:** Every mutating action must trigger a toast confirming the result. Both success and error states.
- **D-14:** Two-layer error boundary architecture (per-section + full-page).
- **D-15:** Error fallback UI includes: "Something went wrong" message, "Try again" retry button, and expandable error details.
- **D-16:** Coral F on navy background. SVG favicon preferred.

### Claude's Discretion
- Exact shadcn init configuration flags
- Order of component migration (which components first)
- How to handle Framer Motion + Radix animation boundaries
- Error boundary component implementation details
- Exact HSL values for token conversion (mathematically equivalent to current hex)

### Deferred Ideas (OUT OF SCOPE)
None -- discussion stayed within phase scope.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUN-01 | shadcn/ui adopted with CSS variable token mapping bridging existing design system to shadcn conventions | Token bridge strategy (HSL conversion + variable mapping), shadcn init procedure, components.json configuration |
| FOUN-02 | All custom CSS component classes replaced with shadcn/ui primitives | 46 usages across 13 files identified; migration-by-component-type strategy; complete CSS class inventory |
| FOUN-03 | Toast notifications (sonner) fire on every user action | 3 mutation hooks with onSuccess callbacks identified; Sonner Toaster configuration; toast() API pattern |
| FOUN-04 | Error boundaries wrap every page and critical sections with graceful fallback UI | react-error-boundary v6 patterns; two-layer architecture; FallbackComponent pattern with resetErrorBoundary |
| FOUN-05 | Favicon shows coral F on navy background in browser tab | SVG favicon creation; index.html link tag; existing favicon is Vite default (needs replacement) |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| shadcn CLI | latest (v4+) | Component scaffolding and generation | Official CLI auto-detects Tailwind v3, generates components compatible with existing setup |
| tailwindcss-animate | 1.0.7 | Animation utilities for shadcn components | Required dependency for shadcn/ui on Tailwind v3 (NOT tw-animate-css which is v4 only) |
| sonner | 2.0.7 | Toast notification system | shadcn/ui's official toast solution; pre-styled, accessible, small bundle |
| react-error-boundary | 6.1.1 | Error boundary components | Standard React error boundary library; provides FallbackComponent, resetErrorBoundary, onError props |
| @fontsource/inter | 5.2.8 | Self-hosted Inter font | Eliminates Google Fonts CDN dependency; required for future PWA offline support |

### Supporting (already installed)

| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| class-variance-authority | 0.7.1 | Component variant composition | Already installed, shadcn dependency |
| clsx | 2.1.1 | Conditional CSS class names | Already installed, shadcn dependency |
| tailwind-merge | 3.5.0 | Tailwind class conflict resolution | Already installed, shadcn dependency |
| @radix-ui/* (11 packages) | Various | Accessible component primitives | Already installed, shadcn wraps these |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| react-error-boundary | Custom class component | Library provides resetErrorBoundary, onError, and useErrorBoundary hook; hand-rolling misses edge cases |
| sonner | react-hot-toast | sonner is shadcn's default; pre-integrated styling; newer API |
| @fontsource/inter | Keep Google Fonts CDN | CDN blocks offline usage and adds external dependency; @fontsource is required for Phase 8 PWA |

**Installation:**
```bash
# New dependencies
npm install sonner react-error-boundary @fontsource/inter tailwindcss-animate

# shadcn/ui initialization (after backing up globals.css)
npx shadcn@latest init

# Add shadcn components (after init and token bridge)
npx shadcn@latest add button card badge input label select separator tabs dialog tooltip switch checkbox progress table dropdown-menu sheet scroll-area skeleton sonner alert textarea
```

## Architecture Patterns

### Recommended Project Structure

```
src/
  components/
    ui/           # shadcn-generated components (Button, Card, Badge, etc.)
                  # Plus custom: StatusDot.tsx, ErrorFallback.tsx
    layout/       # PageShell, Sidebar (existing)
    dashboard/    # Dashboard cards (existing)
    projects/     # Project components (existing)
    pipeline/     # Content pipeline components (existing)
  hooks/          # React Query hooks (existing) -- add toast calls here
  lib/
    utils.ts      # cn() utility (existing, shadcn-compatible)
  styles/
    globals.css   # Design tokens + shadcn variable bridge
```

### Pattern 1: Token Bridge (CSS Variable Mapping)

**What:** Map shadcn's expected CSS variables to Forge Console's existing token values in HSL format.
**When to use:** During shadcn init merge into globals.css.

```css
/* Source: Computed from existing Forge Console design tokens */
:root {
  /* Forge Console tokens (converted to HSL) */
  --bg-root: 220 27% 98%;
  --bg-surface: 0 0% 100%;
  --bg-elevated: 220 27% 96%;
  --bg-active: 218 21% 93%;
  --text-primary: 223 17% 8%;
  --text-secondary: 218 12% 42%;
  --text-tertiary: 218 10% 64%;
  --accent-coral: 12 55% 51%;
  --accent-coral-light: 13 61% 62%;
  --accent-coral-dark: 13 54% 42%;
  --accent-navy: 206 50% 21%;
  --accent-navy-light: 206 50% 29%;
  --status-success: 142 76% 36%;
  --status-warning: 32 95% 44%;
  --status-error: 0 72% 51%;
  --status-info: 221 83% 53%;
  --status-success-bg: 138 76% 97%;
  --status-warning-bg: 48 100% 96%;
  --status-error-bg: 0 86% 97%;
  --status-info-bg: 214 100% 97%;

  /* shadcn variable bridge -- points to Forge Console tokens */
  --background: var(--bg-root);
  --foreground: var(--text-primary);
  --card: var(--bg-surface);
  --card-foreground: var(--text-primary);
  --popover: var(--bg-surface);
  --popover-foreground: var(--text-primary);
  --primary: var(--accent-coral);
  --primary-foreground: 0 0% 100%;
  --secondary: var(--bg-elevated);
  --secondary-foreground: var(--text-primary);
  --muted: var(--bg-elevated);
  --muted-foreground: var(--text-secondary);
  --accent: var(--accent-navy);
  --accent-foreground: 0 0% 100%;
  --destructive: var(--status-error);
  --destructive-foreground: 0 0% 100%;
  --border: var(--border-subtle);
  --input: var(--border-default);
  --ring: var(--accent-coral);
  --radius: 0.625rem;
}
```

**Important:** shadcn expects HSL values WITHOUT the `hsl()` wrapper. The format is `220 27% 98%` not `hsl(220, 27%, 98%)`. shadcn's Tailwind plugin wraps them in `hsl()` automatically.

**Border variables are special:** The existing border values use `rgba()` format (`rgba(0,0,0,0.06)`). These cannot be expressed as bare HSL values. Options: (a) convert to closest solid HSL equivalent, or (b) keep border variables as full CSS values and override shadcn's `hsl()` wrapper in the Tailwind config. Recommendation: convert to solid HSL equivalents (`0 0% 91%` for the subtle border) since the transparency effect is minimal on the white/near-white backgrounds used.

### Pattern 2: Sonner Toast Wiring

**What:** Add toast() calls to existing React Query mutation onSuccess/onError callbacks.
**When to use:** Every mutation hook in src/hooks/.

```typescript
// Source: sonner documentation + existing mutation pattern
import { toast } from 'sonner'

// In existing mutation hooks, add toast calls:
return useMutation({
  mutationFn: async (data) => {
    // existing mutation logic
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['brain-dumps'] })
    toast.success('Brain dump saved successfully')
  },
  onError: (error: Error) => {
    toast.error('Failed to save brain dump', {
      description: error.message,
    })
  },
})
```

**Existing mutation hooks to wire:**
1. `src/hooks/useBrainDump.ts` -- line 84 (brain dump submission)
2. `src/hooks/useProjects.ts` -- line 137 (create project), line 155 (update task status)
3. `src/hooks/useContentReviews.ts` -- line 23 (review action: approve/reject)

### Pattern 3: Two-Layer Error Boundary

**What:** Per-section and full-page error boundaries with graceful fallback UI.
**When to use:** Wrap every page component and critical dashboard sections.

```typescript
// Source: react-error-boundary v6 documentation
import { ErrorBoundary } from 'react-error-boundary'

// Error fallback component (shared)
function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error
  resetErrorBoundary: () => void
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <Card className="border-destructive">
      <CardContent className="p-6 text-center">
        <p className="text-lg font-medium">Something went wrong</p>
        <p className="text-sm text-muted-foreground mt-1">
          This section encountered an error
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button onClick={resetErrorBoundary} variant="outline" size="sm">
            Try again
          </Button>
          <Button
            onClick={() => setShowDetails(!showDetails)}
            variant="ghost"
            size="sm"
          >
            {showDetails ? 'Hide' : 'Show'} details
          </Button>
        </div>
        {showDetails && (
          <pre className="mt-4 text-xs text-left bg-muted p-3 rounded-md overflow-auto">
            {error.message}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}

// Per-section usage (wraps individual dashboard cards)
<ErrorBoundary FallbackComponent={ErrorFallback}>
  <SystemHealthCard />
</ErrorBoundary>

// Full-page usage (wraps entire page content)
<ErrorBoundary FallbackComponent={PageErrorFallback}>
  <Routes>...</Routes>
</ErrorBoundary>
```

### Pattern 4: shadcn Badge with Custom Variants

**What:** Extend shadcn Badge to preserve existing variant names (success, warning, error, info, navy, coral, neutral).
**When to use:** After installing shadcn Badge component.

```typescript
// Extend shadcn Badge variants in src/components/ui/badge.tsx after generation
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        // Forge Console custom variants
        success: "border-transparent bg-[hsl(var(--status-success-bg))] text-[hsl(var(--status-success))]",
        warning: "border-transparent bg-[hsl(var(--status-warning-bg))] text-[hsl(var(--status-warning))]",
        error: "border-transparent bg-[hsl(var(--status-error-bg))] text-[hsl(var(--status-error))]",
        info: "border-transparent bg-[hsl(var(--status-info-bg))] text-[hsl(var(--status-info))]",
        navy: "border-transparent bg-[hsl(var(--accent-navy)/0.1)] text-[hsl(var(--accent-navy))]",
        coral: "border-transparent bg-[hsl(var(--accent-coral)/0.1)] text-[hsl(var(--accent-coral))]",
        neutral: "border-transparent bg-secondary text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)
```

### Anti-Patterns to Avoid

- **Page-by-page migration:** Migrating one page at a time leaves visual inconsistency between pages. Migrate by component type instead (all buttons first, then all cards, etc.).
- **Letting shadcn init overwrite globals.css:** Back up first, merge manually. The CLI assumes it owns the CSS file.
- **Using tw-animate-css:** That is for Tailwind v4 only. Use tailwindcss-animate for v3.
- **Mixing hsl() wrapper with bare HSL values:** shadcn expects bare values (e.g., `220 27% 98%`) in CSS variables. The framework adds `hsl()` automatically in Tailwind classes.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Toast notifications | Custom toast system with portals and timers | sonner 2.0.7 | Handles stacking, animations, swipe-to-dismiss, promise states, accessibility |
| Error boundaries | Custom class component with getDerivedStateFromError | react-error-boundary 6.1.1 | Provides resetErrorBoundary, onError callback, useErrorBoundary hook, proper cleanup |
| Component variants | Custom className string concatenation | CVA (class-variance-authority) via shadcn | Type-safe variants, compound variants, default variants |
| Accessible primitives | Custom dialog, select, tooltip implementations | Radix UI via shadcn wrappers | ARIA compliance, keyboard navigation, focus management, screen reader support |
| CSS class merging | Manual className ordering | cn() utility (clsx + tailwind-merge) | Already in place; handles Tailwind class conflicts correctly |

**Key insight:** The existing codebase already has the foundation (Radix primitives, CVA, cn()). The work is wrapping them in shadcn's opinionated component layer, not building from scratch.

## Common Pitfalls

### Pitfall 1: shadcn Init Overwrites globals.css
**What goes wrong:** Running `npx shadcn@latest init` generates a new globals.css that overwrites 56 existing custom CSS variables and all component classes.
**Why it happens:** shadcn init assumes it owns the CSS file.
**How to avoid:** (1) Copy globals.css to globals.css.backup before init. (2) Run init. (3) Manually merge shadcn's additions into the backup. (4) Replace the generated file with the merged version.
**Warning signs:** App colors change dramatically after init; custom component classes stop working.

### Pitfall 2: Tailwind v4 Accidental Migration
**What goes wrong:** shadcn CLI or npm install pulls Tailwind v4 instead of v3. Build breaks with `@theme` directive errors.
**Why it happens:** Tailwind v4 is the latest version; package managers default to latest.
**How to avoid:** Verify `tailwindcss` stays at `^3.4.19` in package.json after every install. Do NOT run Tailwind upgrade commands.
**Warning signs:** Build errors mentioning `@theme`, missing tailwind.config.ts, OKLCH color format errors.

### Pitfall 3: Border Variables with rgba
**What goes wrong:** The existing border tokens use rgba format (`rgba(0,0,0,0.06)`) which cannot be expressed as bare HSL values that shadcn expects.
**Why it happens:** shadcn's Tailwind plugin wraps CSS variable values in `hsl()`, but rgba is a different color space.
**How to avoid:** Convert border rgba values to their visual-equivalent solid HSL values. On the white (#ffffff) background, `rgba(0,0,0,0.06)` renders as approximately `0 0% 94%`. On the near-white (#f8f9fb) background, it is approximately `220 6% 92%`. Use these solid equivalents for the shadcn bridge variables.
**Warning signs:** Borders appear invisible or too dark after token conversion.

### Pitfall 4: Google Fonts Double Import
**What goes wrong:** After switching to @fontsource, the old Google Fonts import remains in both globals.css AND index.html, causing duplicate font loading.
**Why it happens:** The font is imported in two places (CSS @import and HTML link tags).
**How to avoid:** Remove the `@import url('https://fonts.googleapis.com/...')` from globals.css AND the three `<link>` tags (preconnect + stylesheet) from index.html. Add @fontsource imports in main.tsx.
**Warning signs:** Network tab shows requests to fonts.googleapis.com after migration.

### Pitfall 5: Sonner Z-Index vs Radix Dialog
**What goes wrong:** Toast notifications appear behind Radix Dialog/Sheet overlays.
**Why it happens:** Radix portals have high z-index; Sonner default may be lower.
**How to avoid:** Render `<Toaster />` as the last child in the app root (after all other providers). If needed, add a custom className with higher z-index.
**Warning signs:** Toasts invisible when a dialog is open.

### Pitfall 6: SkeletonBlock to Skeleton Migration API Mismatch
**What goes wrong:** Existing SkeletonBlock takes width/height as props; shadcn Skeleton uses className for sizing.
**Why it happens:** Different component APIs between custom and shadcn implementations.
**How to avoid:** After installing shadcn Skeleton, update all 48 usages across 11 files to use className-based sizing (e.g., `<Skeleton className="h-4 w-[60%]" />`). Also migrate SkeletonCard to use shadcn Card + Skeleton composition.
**Warning signs:** Build errors about missing props; skeletons rendering at wrong sizes.

## Code Examples

### shadcn components.json Configuration

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/styles/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

**Key choices:**
- `style: "new-york"` -- the only supported style (default was removed)
- `rsc: false` -- no React Server Components (Vite SPA)
- `baseColor: "neutral"` -- closest to existing design; will be overridden by token bridge anyway
- `cssVariables: true` -- required for the token bridge approach
- Icon library: lucide -- already installed

### HSL Color Conversion Reference

| Token | Current Value | HSL Equivalent |
|-------|--------------|----------------|
| --bg-root | #f8f9fb | 220 27% 98% |
| --bg-surface | #ffffff | 0 0% 100% |
| --bg-elevated | #f1f3f7 | 220 27% 96% |
| --bg-active | #e8ebf0 | 218 21% 93% |
| --text-primary | #111318 | 223 17% 8% |
| --text-secondary | #5f6878 | 218 12% 42% |
| --text-tertiary | #9aa1ad | 218 10% 64% |
| --accent-coral | #C75B3F | 12 55% 51% |
| --accent-coral-light | #d97c63 | 13 61% 62% |
| --accent-coral-dark | #a64a31 | 13 54% 42% |
| --accent-navy | #1B3A52 | 206 50% 21% |
| --accent-navy-light | #254e6e | 206 50% 29% |
| --status-success | #16a34a | 142 76% 36% |
| --status-warning | #d97706 | 32 95% 44% |
| --status-error | #dc2626 | 0 72% 51% |
| --status-info | #2563eb | 221 83% 53% |
| --status-success-bg | #f0fdf4 | 138 76% 97% |
| --status-warning-bg | #fffbeb | 48 100% 96% |
| --status-error-bg | #fef2f2 | 0 86% 97% |
| --status-info-bg | #eff6ff | 214 100% 97% |

### Border Token Conversion (rgba to solid HSL)

These require special handling because rgba cannot map to bare HSL. Compute the effective color against the primary background (#f8f9fb):

| Token | Current Value | Effective Solid | HSL Equivalent |
|-------|--------------|-----------------|----------------|
| --border-subtle | rgba(0,0,0,0.06) | ~#e9eaeb | 220 6% 92% |
| --border-default | rgba(0,0,0,0.10) | ~#dfe0e2 | 220 6% 88% |
| --border-strong | rgba(0,0,0,0.15) | ~#d3d5d8 | 216 6% 83% |

### Tailwind Config Update

```typescript
// tailwind.config.ts -- add tailwindcss-animate plugin
import type { Config } from 'tailwindcss'
import tailwindAnimate from 'tailwindcss-animate'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // existing theme config preserved
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        coral: {
          DEFAULT: 'hsl(var(--accent-coral))',
          light: 'hsl(var(--accent-coral-light))',
          dark: 'hsl(var(--accent-coral-dark))',
        },
        navy: {
          DEFAULT: 'hsl(var(--accent-navy))',
          light: 'hsl(var(--accent-navy-light))',
        },
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'calc(var(--radius) + 4px)',
        xl: 'calc(var(--radius) + 8px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      // existing boxShadow config can stay as-is
    },
  },
  plugins: [tailwindAnimate],
}
```

### Sonner Toaster Configuration

```typescript
// In App.tsx -- add Toaster component
import { Toaster } from 'sonner'

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster
          position="bottom-right"
          duration={3000}
          richColors
          closeButton
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
```

### Font Migration

```typescript
// In src/main.tsx -- replace Google Fonts with @fontsource
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import './styles/globals.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

// Also remove from index.html:
// <link rel="preconnect" href="https://fonts.googleapis.com" />
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
// <link href="https://fonts.googleapis.com/css2?family=Inter..." rel="stylesheet" />

// Also remove from globals.css:
// @import url('https://fonts.googleapis.com/css2?family=Inter...');
```

### SVG Favicon

```svg
<!-- public/favicon.svg -- Coral F on navy background -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1B3A52"/>
  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle"
        font-family="Inter, system-ui, sans-serif" font-weight="700"
        font-size="22" fill="#C75B3F">F</text>
</svg>
```

Note: SVG text rendering varies across browsers. A cleaner approach is to draw the F as a `<path>` element for pixel-perfect rendering at all sizes. The executor should generate the path data or use a simple geometric F shape.

## Migration Scope Inventory

### Custom CSS Classes to Remove (from globals.css)

| CSS Class | Replacement | Usages Found |
|-----------|------------|--------------|
| `.btn-primary`, `.btn-primary:hover`, `.btn-primary:disabled` | `<Button>` (default variant) | 9 across 3 files |
| `.btn-ghost`, `.btn-ghost:hover` | `<Button variant="ghost">` | (included in btn count) |
| `.card`, `.card:hover` | `<Card>` | ~20+ across 13 files |
| `.badge`, `.badge-*` (7 variants) | `<Badge variant="...">` | ~10+ across 9 files |
| `.input`, `.input:focus`, `.input::placeholder` | `<Input>` | ~7+ across files |
| `.skeleton`, `@keyframes skeleton-shimmer` | `<Skeleton>` | 48 usages across 11 files |

### Classes to KEEP (not replaced by shadcn)

| CSS Class | Reason |
|-----------|--------|
| `.text-page-title` | Typography hierarchy -- no shadcn equivalent |
| `.text-section-header` | Typography hierarchy -- no shadcn equivalent |
| `.text-card-title` | Typography hierarchy -- no shadcn equivalent |
| `.text-body` | Typography hierarchy -- no shadcn equivalent |
| `.text-caption` | Typography hierarchy -- no shadcn equivalent |
| `.text-stat` | Typography hierarchy -- no shadcn equivalent |
| `.status-dot`, `.status-dot-*` | Custom component (D-08) -- stays but aligned to shadcn conventions |
| Scrollbar styles | Custom scrollbar -- no shadcn equivalent (ScrollArea handles its own) |
| `::selection` | Selection color styling |
| Focus-visible styles | May be handled by shadcn, evaluate during migration |

### Mutation Hooks to Wire with Toasts

| File | Hook | Action | Toast Message |
|------|------|--------|---------------|
| `src/hooks/useBrainDump.ts:84` | useMutation | Submit brain dump | "Brain dump saved" / "Failed to save brain dump" |
| `src/hooks/useProjects.ts:137` | useMutation | Create project | "Project created" / "Failed to create project" |
| `src/hooks/useProjects.ts:155` | useMutation | Update task status | "Task updated" / "Failed to update task" |
| `src/hooks/useContentReviews.ts:23` | useMutation | Approve/reject content | "Content approved/rejected" / "Failed to update content" |

## Framer Motion + Radix Animation Boundaries

Framer Motion and Radix both want to control transitions. Establish these boundaries:

1. **Page transitions:** Framer Motion owns these (AnimatePresence in App.tsx). No change needed.
2. **Card hover/enter animations:** Framer Motion owns these (motion.div in dashboard cards). No change needed.
3. **Dialog/Sheet open/close:** Radix owns these via its built-in animations. Do NOT wrap Radix Dialog content in motion.div. Use `tailwindcss-animate` for Radix-compatible enter/exit animations (data-[state=open] / data-[state=closed] attributes).
4. **Toast animations:** Sonner owns these. Do not wrap toasts in Framer Motion.
5. **Layout animations (layoutId):** Do NOT apply to elements that trigger Radix portals (dialogs, popovers, tooltips). Portals break layout animation context.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| shadcn "default" style | "new-york" only | 2025 | Only one style option now |
| shadcn toast component | sonner integration | 2024 | Original toast deprecated; sonner is the replacement |
| Tailwind v3 config file | Tailwind v4 CSS-first | 2025 | Stay on v3 -- v4 requires full rewrite |
| Google Fonts CDN | @fontsource self-hosting | Ongoing | Better performance, offline support |

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework installed |
| Config file | None |
| Quick run command | `npm run build` (type-check + build as smoke test) |
| Full suite command | `npm run build` |

### Phase Requirements to Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUN-01 | shadcn CSS variables resolve to Forge Console token values | manual | Visual inspection + `npm run build` passes | N/A |
| FOUN-02 | No custom CSS component classes remain; all shadcn primitives render | manual + build | `npm run build` + grep for orphaned classes | N/A |
| FOUN-03 | Toast fires on every mutation action | manual | Click each action, verify toast appears | N/A |
| FOUN-04 | Error boundary shows fallback UI on simulated error | manual | Temporarily throw in component, verify fallback renders | N/A |
| FOUN-05 | Favicon shows coral F on navy in browser tab | manual | Open app, inspect tab icon | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (must pass -- catches TypeScript errors, unused vars, import issues)
- **Per wave merge:** `npm run build` + visual inspection of key pages
- **Phase gate:** Full build green + all 5 success criteria manually verified

### Wave 0 Gaps
- No test framework installed -- all validation is manual + build verification
- No visual regression testing -- rely on manual inspection
- This is acceptable for Phase 1 (foundation work); test framework is explicitly out of scope per STACK.md

## Open Questions

1. **shadcn init exact behavior with existing globals.css**
   - What we know: The CLI will try to modify globals.css and create components.json
   - What's unclear: Whether it detects existing Tailwind v3 correctly in all cases with the current CLI version
   - Recommendation: Back up globals.css, run init, inspect diff, merge manually. If init fails or misbehaves, create components.json manually (schema is well-documented).

2. **Border rgba-to-HSL visual fidelity**
   - What we know: rgba(0,0,0,0.06) on white gives a slightly transparent border; solid HSL equivalent will be opaque
   - What's unclear: Whether the visual difference is perceptible on non-white backgrounds (elevated surfaces)
   - Recommendation: Use the solid HSL equivalents computed against --bg-root. Test on elevated surfaces (--bg-elevated) and adjust if borders look wrong.

3. **shadcn Skeleton shimmer animation**
   - What we know: Current SkeletonBlock has a custom shimmer animation; shadcn Skeleton uses a pulse animation
   - What's unclear: Whether the shimmer or pulse animation looks better in context
   - Recommendation: Use shadcn's default pulse animation. The CLAUDE.md rule "no spinners (skeleton shimmer only)" likely means "use skeletons instead of spinners" rather than "must use shimmer specifically." If shimmer is strongly preferred, customize shadcn Skeleton's animation.

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Vite Installation](https://ui.shadcn.com/docs/installation/vite) -- official installation guide
- [shadcn/ui components.json](https://ui.shadcn.com/docs/components-json) -- configuration schema
- [shadcn/ui Sonner](https://ui.shadcn.com/docs/components/radix/sonner) -- toast integration
- npm registry -- verified versions: sonner 2.0.7, tailwindcss-animate 1.0.7, @fontsource/inter 5.2.8, react-error-boundary 6.1.1
- Codebase analysis -- 46 custom CSS class usages across 13 files, 48 skeleton usages across 11 files, 3 mutation hooks

### Secondary (MEDIUM confidence)
- [react-error-boundary GitHub](https://github.com/bvaughn/react-error-boundary) -- v6 API and patterns
- HSL color conversions -- computed mathematically from hex values; verified correct

### Tertiary (LOW confidence)
- Border rgba-to-solid-HSL conversion -- visual equivalence is approximate; needs visual verification
- shadcn Skeleton animation (pulse vs shimmer) -- preference interpretation of CLAUDE.md rule

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH -- all packages verified on npm registry, versions confirmed
- Architecture: HIGH -- patterns derived from official shadcn docs and existing codebase analysis
- Token bridge: HIGH -- HSL values computed mathematically; mapping follows shadcn convention
- Pitfalls: HIGH -- documented from prior project research (PITFALLS.md) and verified against current codebase
- Migration scope: HIGH -- grep counts are exact; file inventory is complete

**Research date:** 2026-03-22
**Valid until:** 2026-04-22 (stable domain, shadcn/sonner APIs well-established)
