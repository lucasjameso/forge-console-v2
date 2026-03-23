# Architecture

**Analysis Date:** 2026-03-22

## Pattern Overview

**Overall:** Single-page application with layered React architecture, hook-based data access, and graceful mock-data degradation.

**Key Characteristics:**
- All server state is owned by TanStack React Query; local state is React `useState` only
- Every data hook checks `isSupabaseConfigured` and falls back to `src/data/mock.ts` transparently
- All page transitions are animated via Framer Motion `AnimatePresence` at the router level
- No global state store (Redux, Zustand, Context) -- Query client is the single server-state authority
- Access control is a lightweight session-storage gate (`src/components/AccessGate.tsx`), not a full auth system

## Layers

**UI Primitives:**
- Purpose: Low-level reusable elements wrapping shadcn/ui and Radix UI primitives
- Location: `src/components/ui/`
- Contains: `Badge`, `SkeletonBlock`, `SkeletonCard`, `StatusDot`, `ErrorFallback`, `PageErrorFallback`, plus shadcn wrappers (`button.tsx`, `card.tsx`, `dialog.tsx`, `input.tsx`, `select.tsx`, `tabs.tsx`, etc.)
- Depends on: Nothing in src except `@/lib/utils`
- Used by: All other component layers and pages

**Layout Components:**
- Purpose: App shell, navigation, and page-level layout structure
- Location: `src/components/layout/`
- Contains: `Sidebar.tsx` (fixed left nav, responsive mobile drawer), `PageShell.tsx` (animated page wrapper with header/content slots)
- Depends on: UI primitives, React Router, Framer Motion
- Used by: `App.tsx` (Sidebar), all page components (PageShell)

**Feature Components:**
- Purpose: Domain-specific composable cards and widgets that render fetched data
- Location: `src/components/dashboard/`, `src/components/activity/`, `src/components/pipeline/`, `src/components/projects/`, `src/components/settings/`, `src/components/social/`
- Contains: `ActionItemsCard.tsx`, `ContentCalendarStrip.tsx`, `ProjectQuickGlanceCard.tsx`, `StatTilesRow.tsx`, `SystemHealthCard.tsx`, `SystemHealthStrip.tsx`, `UpcomingContentCard.tsx`, `ContentCard.tsx`, `ProjectCard.tsx`
- Depends on: Hooks, UI primitives
- Used by: Pages

**Global Feature Components:**
- Purpose: App-wide overlay features independent of routing
- Location: `src/components/`
- Contains: `AccessGate.tsx` (session-storage PIN gate), `FeedbackWidget.tsx` (floating feedback form using `useSubmitFeedback`)
- Depends on: Hooks, UI primitives, React Router (for page name detection)
- Used by: `App.tsx` -- wraps entire app tree

**Pages:**
- Purpose: Route-bound containers that compose feature components into full page layouts
- Location: `src/pages/`
- Contains: `Dashboard.tsx`, `Projects.tsx`, `ProjectDetail.tsx`, `BrainDump.tsx`, `ContentPipeline.tsx`, `SocialMedia.tsx`, `ActivityLog.tsx`, `Settings.tsx`
- Depends on: Feature components, hooks, `PageShell`, UI primitives, React Router params
- Used by: React Router (`App.tsx`)

**Hooks:**
- Purpose: Encapsulate all data fetching, mutation, caching, and mock-fallback logic
- Location: `src/hooks/` (files located inside `src/pages/` directory due to file system co-location -- hooks are inside `src/hooks/` NOT `src/pages/`)
- Contains: `useProjects.ts`, `useBrainDump.ts`, `useActivityLog.ts`, `useContentReviews.ts`, `useDashboardStats.ts`, `usePageFeedback.ts`, `useSocialPlatforms.ts`, `useSystemHealth.ts`
- Depends on: `src/lib/supabase.ts`, `src/lib/queryClient.ts`, `src/data/mock.ts`, TanStack React Query
- Used by: Pages and feature components

**Library / Services:**
- Purpose: Client initialization, query configuration, and shared utility functions
- Location: `src/lib/`
- Contains: `supabase.ts` (Supabase client with `isSupabaseConfigured` flag), `queryClient.ts` (React Query client, 2-min stale time, 1 retry), `utils.ts` (cn, formatRelativeTime, formatDate, formatTime, formatShortDate, getGreeting)
- Depends on: External SDKs only
- Used by: Hooks and components

**Types:**
- Purpose: Single source of truth for all TypeScript types and the Supabase Database interface
- Location: `src/types/database.ts`
- Contains: `Database` interface (Supabase-typed schema), entity interfaces (`Project`, `Task`, `BrainDump`, `ContentReview`, `ActivityEntry`, `SystemHealth`, `Setting`, etc.), status union types (`ProjectStatus`, `TaskStatus`, `ContentStatus`, etc.)
- Depends on: Nothing
- Used by: All layers

**Mock Data:**
- Purpose: Offline/unconfigured fallback data matching production entity shapes
- Location: `src/data/mock.ts`
- Contains: `mockProjects`, `mockTasks`, `mockMilestones`, `mockActionItems`, `mockNotes`, `mockBrainDumps`, `mockActivity`, `mockSystemHealth`, `mockNextSessionPrompts`
- Depends on: Types
- Used by: All hooks (when `isSupabaseConfigured` is false)

## Data Flow

**Server State (read):**

1. Page or feature component calls a hook (e.g., `useProjects()`)
2. Hook calls `useQuery` with a stable `queryKey`
3. `queryFn` checks `isSupabaseConfigured`; if false, returns mock data immediately
4. If configured, `queryFn` executes Supabase client query, throws on error
5. React Query caches result, marks stale after 2 minutes
6. Component receives `{ data, isLoading, isError }` and renders accordingly
7. While loading, component renders `<SkeletonBlock>` or `<SkeletonCard>` (no spinners)

**Server State (write/mutation):**

1. Component calls mutation hook (e.g., `useUpdateTask()`)
2. `mutationFn` checks `isSupabaseConfigured`; returns early if not configured
3. Supabase client runs `update`/`insert`/`delete`
4. `onSuccess` calls `queryClient.invalidateQueries()` to trigger refetch
5. `onSuccess` fires `toast.success()` via sonner; `onError` fires `toast.error()`

**Brain Dump special flow:**

1. User submits raw text via `useSubmitBrainDump()`
2. `mutationFn` calls `parseBrainDumpWithClaude()` -- direct `fetch` to Anthropic API
3. If `VITE_ANTHROPIC_API_KEY` is absent, falls back to local sentence-splitting parser
4. Parsed result is inserted into Supabase `brain_dumps` table
5. Query cache for `['brain-dumps']` is invalidated

**Page Transitions:**

1. React Router location changes
2. `AnimatePresence mode="wait"` in `App.tsx` unmounts outgoing page
3. Incoming page's `PageShell` runs Framer Motion `initial -> animate` (opacity 0->1, y 8->0, 220ms)

**State Management:**
- Server/async state: TanStack React Query (single `queryClient` instance, `src/lib/queryClient.ts`)
- Local UI state: `useState` at component level (modals, form inputs, toggles)
- Auth/session: `sessionStorage` key `forge_authenticated` (via `AccessGate.tsx`)
- No shared client-side state store

## Key Abstractions

**Data Hooks:**
- Purpose: Typed interface to Supabase with transparent mock fallback
- Examples: `src/hooks/useProjects.ts`, `src/hooks/useBrainDump.ts`, `src/hooks/useActivityLog.ts`, `src/hooks/useSystemHealth.ts`
- Pattern: Each hook file exports one or more `useXxx()` query hooks and optionally `useXxxMutation()` mutation hooks. Query keys are arrays. All queries check `isSupabaseConfigured` as the first line of `queryFn`.

**PageShell:**
- Purpose: Uniform animated wrapper for every page, providing consistent header/content layout
- Location: `src/components/layout/PageShell.tsx`
- Pattern: All pages wrap their entire JSX in `<PageShell title="..." subtitle="..." actions={...}>`. Max-width 1280px, responsive padding.

**SkeletonBlock / SkeletonCard:**
- Purpose: Loading state placeholders -- no spinners allowed per project rules
- Location: `src/components/ui/SkeletonBlock.tsx`
- Pattern: Feature components use `if (isLoading) return <SkeletonCard />` or inline `<SkeletonBlock height={N} width="X%" />` for granular shimmer effects.

**isSupabaseConfigured flag:**
- Purpose: Enables fully functional offline/local mode without any code-path changes
- Location: `src/lib/supabase.ts` (line 7)
- Pattern: Exported boolean; every `queryFn` checks it as first conditional and returns mock data when false.

**Database interface:**
- Purpose: Supabase client typing that gives compile-time safety on all `.from()` table calls
- Location: `src/types/database.ts`
- Pattern: `SupabaseClient<Database>` generic ensures table names, column names, and row shapes are type-checked.

## Entry Points

**`src/main.tsx`:**
- Location: `src/main.tsx`
- Triggers: Browser DOM load (`document.getElementById('root')`)
- Responsibilities: Creates React root in StrictMode, imports global CSS and Inter font faces, renders `<App />`

**`src/App.tsx` -- App component:**
- Location: `src/App.tsx`
- Triggers: Rendered by `main.tsx`
- Responsibilities: Wraps everything with `QueryClientProvider`, `BrowserRouter`, `ErrorBoundary` (using `PageErrorFallback`), `AccessGate`, and `Toaster`; renders `AppRoutes` and `FeedbackWidget`

**`src/App.tsx` -- AppRoutes component:**
- Location: `src/App.tsx` (lines 20-55)
- Triggers: Router initialization
- Responsibilities: Fixed sidebar + main content layout; `AnimatePresence` wrapping all `<Routes>`; defines all 8 routes

**Page components:**
- Location: `src/pages/*.tsx`
- Triggers: Route match
- Responsibilities: Fetch data via hooks, compose feature cards, render inside `PageShell`

**`index.html`:**
- Location: `index.html`
- Triggers: Browser request / Cloudflare Pages CDN
- Responsibilities: Root HTML, mounts `<div id="root">`, loads Vite entry (`src/main.tsx`)

## Error Handling

**Strategy:** Errors propagate upward; React Query surfaces them via `isError` flag; global React ErrorBoundary catches unhandled render errors.

**Patterns:**
- Query errors: `queryFn` throws; React Query sets `isError = true`; components conditionally render error UI
- Mutation errors: `mutationFn` throws; `onError` callback fires `toast.error()` via sonner
- Expected Supabase 404: `PGRST116` error code is checked and swallowed (e.g., `useNextSessionPrompt` for optional rows)
- Anthropic API failure: `parseBrainDumpWithClaude()` falls back to local parser on network error or missing key
- Render errors: `ErrorBoundary` at app root renders `PageErrorFallback` component (`src/components/ui/PageErrorFallback.tsx`)
- No configured Supabase: `isSupabaseConfigured = false` → all hooks return mock data, no error thrown

## Cross-Cutting Concerns

**Styling:** CSS custom properties (HSL tokens) in `src/styles/globals.css`; all colors reference `hsl(var(--token-name))`, no hardcoded hex/rgb values in components. Tailwind utilities compose with inline `style` props for spacing.

**Animation:** Framer Motion used exclusively for all motion. Page transitions in `App.tsx`, micro-interactions (whileTap scale) in `Sidebar.tsx`, section fade-ins in `ProjectDetail.tsx`. No CSS `transition` for layout animations.

**Logging:** `sonner` toast library used for user-facing mutation feedback. No console logging in production code. React Query DevTools available in development.

**Validation:** TypeScript compile-time only; no runtime schema validation (no Zod). Supabase Database interface enforces shape at the type level.

**Authentication:** `AccessGate.tsx` provides a PIN-code gate backed by `sessionStorage`. Configured via `VITE_ACCESS_CODE` env var. If env var is absent, gate is bypassed (local dev mode).

---

*Architecture analysis: 2026-03-22*
