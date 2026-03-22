# Architecture Patterns

**Domain:** Personal productivity command center -- quality redesign
**Researched:** 2026-03-22

## Current Architecture

The app is a Vite SPA with client-side routing. The existing structure is sound and should not be restructured -- this milestone is about visual quality, not architectural changes.

```
src/
  components/        # Shared components
    ui/              # Primitive UI components (Badge, SkeletonBlock, StatusDot)
    layout/          # Layout components (Sidebar, PageContainer)
    [domain]/        # Domain-specific components (dashboard/, projects/, etc.)
  hooks/             # React Query hooks for each data domain
  lib/               # Utilities (cn, formatRelativeTime, etc.)
  pages/             # Route-level page components
  types/             # TypeScript type definitions
  styles/            # Global CSS (globals.css)
  App.tsx            # Router + QueryClientProvider + layout
  main.tsx           # Entry point
```

## Recommended Architecture Changes

### 1. shadcn/ui Component Layer

After `shadcn init`, components land in `src/components/ui/`. This is already the convention in the project. shadcn components will coexist with existing custom components during migration.

**Target structure after adoption:**
```
src/components/ui/
  button.tsx          # shadcn Button (replaces .btn-primary, .btn-ghost)
  card.tsx            # shadcn Card (replaces .card CSS class)
  badge.tsx           # shadcn Badge (replaces custom Badge.tsx)
  input.tsx           # shadcn Input (replaces .input CSS class)
  textarea.tsx        # shadcn Textarea (new)
  table.tsx           # shadcn Table (new)
  dialog.tsx          # shadcn Dialog (wraps existing Radix dialog)
  select.tsx          # shadcn Select (wraps existing Radix select)
  tabs.tsx            # shadcn Tabs (wraps existing Radix tabs)
  ... etc
  skeleton-block.tsx  # Keep custom (if shadcn Skeleton doesn't match design)
  status-dot.tsx      # Keep custom (not a shadcn component)
```

### 2. Mobile Capture Route

Add a dedicated `/capture` route that renders a completely different layout -- no sidebar, no navigation, just the capture experience.

```
src/
  pages/
    Capture.tsx       # Mobile-only capture page
  components/
    capture/
      CaptureInput.tsx      # Auto-growing textarea with submit
      CaptureSuccess.tsx    # Success state after submission
```

**Route detection pattern:**
```typescript
// In App.tsx router
<Route path="/capture" element={<CaptureLayout />}>
  <Route index element={<Capture />} />
</Route>
<Route path="/" element={<MainLayout />}>
  {/* All existing desktop routes */}
</Route>
```

The `/capture` route uses its own layout (no sidebar, full-screen input) while all other routes use the existing `MainLayout` with sidebar.

### 3. Design Token Architecture

The existing CSS variable system in globals.css is the right approach. After shadcn adoption, the architecture becomes:

```
Layer 1: CSS Variables (globals.css :root)
  |-- Forge Console design tokens (--bg-root, --accent-coral, etc.)
  |-- shadcn mapped variables (--background, --primary, etc.)

Layer 2: Tailwind Config (tailwind.config.ts)
  |-- Extends theme with custom values
  |-- References CSS variables where needed

Layer 3: shadcn Components (src/components/ui/)
  |-- Use shadcn variables (--primary, --border, etc.)
  |-- Customized via CSS variable values, not component code changes

Layer 4: Custom Components (src/components/)
  |-- Use shadcn components as building blocks
  |-- Use Forge Console design tokens for custom styling
  |-- Use cn() for conditional classes
```

**Key principle:** Customize shadcn via CSS variable values in `:root`, not by editing component source code. This keeps shadcn components updatable.

### Component Boundaries

| Component | Responsibility | Communicates With |
|-----------|---------------|-------------------|
| App.tsx | Router, QueryClient, global providers | All pages |
| MainLayout | Sidebar + content area for desktop | All desktop pages |
| CaptureLayout | Minimal layout for mobile capture | Capture page only |
| Sidebar | Navigation, active route indicator | React Router |
| Page components | Data fetching (via hooks), page-level layout | React Query hooks, UI components |
| Domain components | Feature-specific UI (ProjectCard, ContentCalendar) | Page components, shadcn primitives |
| shadcn/ui components | Accessible, styled primitives | Any component that needs UI elements |
| React Query hooks | Server state, caching, mutations | Supabase client, page/domain components |

### Data Flow

```
User Interaction
  --> React component event handler
    --> React Query mutation (optimistic update optional)
      --> Supabase client API call
        --> Supabase database
      <-- Response
    <-- Cache invalidation + refetch
  <-- UI update via React Query cache
  <-- Toast notification via sonner
```

For mobile capture specifically:
```
User types in /capture
  --> Submit handler
    --> React Query mutation to brain_dump_entries
      --> Supabase insert
    <-- Success
  <-- Toast "Captured!" + reset textarea
  (Later, at desk: brain dump page shows new entries for parsing)
```

## Patterns to Follow

### Pattern 1: Composable Card Sections
**What:** Build page sections from shadcn Card primitives with consistent spacing.
**When:** Every dashboard section, every data display region.
**Example:**
```typescript
<Card>
  <CardHeader>
    <CardTitle className="text-section-header">Active Projects</CardTitle>
    <CardDescription>3 projects in progress</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    {projects.map(p => <ProjectRow key={p.id} project={p} />)}
  </CardContent>
</Card>
```

### Pattern 2: Mutation + Toast Feedback
**What:** Every mutation triggers a toast on success/error.
**When:** Any user action that modifies data.
**Example:**
```typescript
const mutation = useMutation({
  mutationFn: approveContent,
  onSuccess: () => {
    toast.success('Content approved')
    queryClient.invalidateQueries({ queryKey: ['content'] })
  },
  onError: () => toast.error('Failed to approve content'),
})
```

### Pattern 3: Skeleton Loading per Region
**What:** Each data-dependent region shows its own skeleton, not a page-level spinner.
**When:** Every component that uses React Query data.
**Example:**
```typescript
function ProjectStats() {
  const { data, isLoading } = useProjects()
  if (isLoading) return <ProjectStatsSkeleton />
  return <div>{/* actual content */}</div>
}
```

### Pattern 4: CSS Variable Theming (Not Prop Drilling)
**What:** All colors come from CSS variables, never hardcoded hex values or Tailwind color classes.
**When:** Always.
**Why:** Single source of truth for the design system. Change a variable, change the entire app.

## Anti-Patterns to Avoid

### Anti-Pattern 1: Editing shadcn Component Source for Styling
**What:** Modifying the generated shadcn component files to change colors/spacing.
**Why bad:** Makes components non-updatable. Changes get lost when re-adding components.
**Instead:** Override via CSS variables in `:root` or via className props when using the component.

### Anti-Pattern 2: Mixed Styling Approaches
**What:** Some components use CSS classes from globals.css, others use shadcn, others use inline Tailwind.
**Why bad:** Inconsistent DX, hard to maintain, visual inconsistencies.
**Instead:** Migrate fully to shadcn components. Use Tailwind utilities for layout (flex, grid, spacing). Keep globals.css for base styles and CSS variables only.

### Anti-Pattern 3: Page-Level Loading States
**What:** Showing a full-page skeleton while any query on the page is loading.
**Why bad:** Blocks the entire page when only one section is loading. Feels slow.
**Instead:** Each section manages its own loading state independently.

### Anti-Pattern 4: Responsive Breakpoints for Desktop Layout
**What:** Adding sm:, md:, lg: breakpoints to make desktop pages work on mobile.
**Why bad:** The app targets 1440px and 1920px. Mobile has its own /capture route. Responsive breakpoints add complexity for zero value.
**Instead:** Design for 1440px minimum. Use CSS Grid with fixed column counts, not responsive ones.

## Sources

- shadcn/ui component architecture: https://ui.shadcn.com/docs
- Existing codebase analysis from .planning/codebase/STACK.md
- Project constraints from .planning/PROJECT.md
