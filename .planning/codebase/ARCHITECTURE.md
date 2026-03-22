# Architecture

**Analysis Date:** 2026-03-22

## Pattern Overview

**Overall:** React SPA with React Router for client-side routing, TanStack React Query for server state management, Supabase for backend persistence.

**Key Characteristics:**
- Component-based UI with page-level route separation
- Hook-based data fetching with fallback to mock data
- Graceful degradation when Supabase is not configured
- Animation-first design with Framer Motion
- Tailwind CSS + Radix UI for styling and accessible components
- TypeScript for type-safe database interactions

## Layers

**Presentation (UI Components):**
- Purpose: Render user interface and handle user interactions
- Location: `src/components/`
- Contains: Page components, layout shells, card components, reusable UI primitives (Badge, SkeletonBlock, StatusDot)
- Depends on: Hooks, utilities, styling
- Used by: Pages

**Page Layer:**
- Purpose: Route-specific containers that compose dashboard and feature sections
- Location: `src/pages/`
- Contains: Dashboard, Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings
- Depends on: Components, hooks, PageShell layout wrapper
- Used by: React Router

**Data Access (Hooks):**
- Purpose: Encapsulate data fetching, caching, and mutations
- Location: `src/hooks/`
- Contains: `useProjects()`, `useTasks()`, `useBrainDumps()`, `useActivityLog()`, `useSocialPlatforms()`, `useContentReviews()`, `useSystemHealth()`, and related mutations
- Depends on: Supabase client, TanStack React Query, mock data
- Used by: Components and pages

**Infrastructure (Library):**
- Purpose: Provide client configuration, utilities, and service integrations
- Location: `src/lib/`
- Contains: `supabase.ts` (Supabase client initialization), `queryClient.ts` (TanStack React Query config), `utils.ts` (formatting and helper functions)
- Depends on: External SDKs (Supabase, React Query)
- Used by: Hooks and components

**Data Models & Types:**
- Purpose: Define TypeScript types for database entities and validation
- Location: `src/types/database.ts`
- Contains: Zod-like Database interface mapping, entity types (Project, Task, BrainDump, etc.), status enums
- Depends on: Nothing
- Used by: All layers for type safety

**Mock Data:**
- Purpose: Fallback data for offline/unconfigured environments
- Location: `src/data/mock.ts`
- Contains: Mock instances of all major entities (mockProjects, mockTasks, mockBrainDumps, etc.)
- Depends on: Nothing
- Used by: Hooks when Supabase is not configured

## Data Flow

**Fetch Data (Read-Heavy Flow):**

1. Page or component mounts and calls a hook (e.g., `useProjects()`)
2. Hook checks if `isSupabaseConfigured` flag is true
3. If configured: Query hits Supabase via authenticated client (`supabase.from('table').select()`)
4. If not configured: Hook returns mock data from `src/data/mock.ts`
5. TanStack React Query caches the result with a queryKey (e.g., `['projects']`)
6. Component renders with data; loading state shows `<SkeletonBlock />` while fetching
7. Subsequent page navigations reuse cached data; stale data refetches after 2 minutes

**Mutation Flow (Write):**

1. User action (form submission, checkbox toggle) calls mutation hook (e.g., `useUpdateTask()`)
2. Hook wraps mutation in `useMutation()` which calls Supabase `.insert()` or `.update()`
3. On success: `queryClient.invalidateQueries()` with matching queryKey triggers refetch
4. Component automatically re-renders with new data from fresh query
5. Error state handled by React Query (retry once by default)

**Brain Dump AI Flow:**

1. User submits raw text via BrainDump form
2. `useSubmitBrainDump()` mutation calls `parseBrainDumpWithClaude()` function
3. Function checks for Anthropic API key; if missing, uses simple local parse fallback
4. Claude API parses text into structured tasks with project hints and priorities
5. Parsed result inserted into Supabase `brain_dumps` table
6. Query invalidation triggers `useBrainDumps()` refetch

**State Management:**
- Server state (data from Supabase): Managed by TanStack React Query with automatic caching and invalidation
- Local UI state (form inputs, modal open/close): React `useState()` at component level
- No global state management library (Redux, Zustand); Query client serves as single source of truth for server data

## Key Abstractions

**Hook-Based Data Access:**
- Purpose: Encapsulate Supabase queries and provide consistent caching interface
- Examples: `src/hooks/useProjects.ts`, `src/hooks/useBrainDump.ts`, `src/hooks/useActivityLog.ts`
- Pattern: Each hook exports `useXxx()` query hook + `useXxxMutation()` mutation hook; gracefully falls back to mock data

**Card Components:**
- Purpose: Reusable dashboard widget containers with consistent styling and animation
- Examples: `src/components/dashboard/ActionItemsCard.tsx`, `src/components/dashboard/SystemHealthCard.tsx`
- Pattern: Accept data via props, show loading skeleton while fetching, render motion-animated content

**UI Primitives:**
- Purpose: Low-level reusable UI elements wrapping Radix UI or custom implementations
- Examples: `src/components/ui/Badge.tsx`, `src/components/ui/SkeletonBlock.tsx`, `src/components/ui/StatusDot.tsx`
- Pattern: Accept variant prop for styling (error, warning, success, neutral), compose into higher-level components

**PageShell:**
- Purpose: Consistent page layout wrapper with header, title, subtitle, action buttons, and animated transition
- Location: `src/components/layout/PageShell.tsx`
- Pattern: All pages wrap content in `<PageShell>` for consistent styling and page transition animations

**Configuration Gradual Degradation:**
- Purpose: Allow app to function with or without Supabase backend
- Examples: Every hook checks `isSupabaseConfigured` before calling Supabase
- Pattern: Hooks return mock data when backend is unavailable; UI remains fully functional

## Entry Points

**Root Mount Point:**
- Location: `src/main.tsx`
- Triggers: Browser DOM load
- Responsibilities: Creates React root and renders `<App />` component

**App Component:**
- Location: `src/App.tsx`
- Triggers: Mounted by main.tsx
- Responsibilities: Wraps entire app with `<QueryClientProvider>` and `<BrowserRouter>`; renders `<AppRoutes />`

**AppRoutes Component:**
- Location: `src/App.tsx` (nested in App)
- Triggers: Router initialization
- Responsibilities: Defines all route `<Route>` definitions; renders `<Sidebar />` and `<main>` layout; manages page transitions via `<AnimatePresence>`

**Page Components:**
- Location: `src/pages/*.tsx`
- Triggers: Route navigation
- Responsibilities: Fetch page-specific data, compose dashboard cards or detail components, wrap in `<PageShell>`

## Error Handling

**Strategy:** Fail gracefully with user-visible fallbacks; no hard crashes.

**Patterns:**

**Supabase Errors:**
- Caught in hook `queryFn`; thrown to React Query
- React Query shows error state in UI (component handles via `isError` state)
- User sees error message in card footer or toast notification (not yet implemented, needs CONCERNS)

**Claude API Errors:**
- Network errors caught in `parseBrainDumpWithClaude()` fetch
- Falls back to simple local parsing (split by sentence, assign generic metadata)
- User sees parsed result even if Claude fails

**Missing Configuration:**
- `isSupabaseConfigured` flag (environment variables missing) → app uses mock data transparently
- `VITE_ANTHROPIC_API_KEY` missing → brain dump parsing uses fallback parser
- No error thrown; feature degrades gracefully

**Type Safety:**
- TypeScript enforces correct data shape via Database interface
- Supabase client typed with `SupabaseClient<Database>`
- Mutations require correctly-shaped input (no runtime surprises)

## Cross-Cutting Concerns

**Logging:** None configured; could use browser console or external service

**Validation:**
- Form validation: Ad-hoc in component (not yet centralized)
- API response validation: Implicit via TypeScript types; no Zod runtime validation

**Authentication:**
- Not implemented; assumes public/demo environment
- Supabase supports auth but not wired up in hooks
- Environment variable exists for API key but auth layer not present

**Caching & Revalidation:**
- TanStack React Query handles all caching
- Stale time: 2 minutes (queries marked stale after 2min idle)
- Retry strategy: 1 automatic retry on failure
- Manual invalidation: Mutations call `queryClient.invalidateQueries()` to refetch related queries

**Loading States:**
- Components show `<SkeletonBlock />` while data is loading
- No global loading overlay; granular per-component
- Framer Motion provides smooth fade-in transitions on data arrival

---

*Architecture analysis: 2026-03-22*
