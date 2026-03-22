<!-- GSD:project-start source:PROJECT.md -->
## Project

**Forge Console v2 -- Quality Redesign**

Forge Console is Lucas Oliver's personal command center for managing his three active builds (Ridgeline Intelligence, CLARITY Book Launch, Forge Console), his LinkedIn content pipeline, his social media presence, and his autonomous agent system. It runs locally on a Mac Mini (M4 2024) and deploys to Cloudflare Pages. Single user, no auth, no multi-tenant.

Phases 1-7 were completed in a fast overnight build. All 7 pages render, the build compiles with zero errors, and Supabase schema is deployed. This milestone is about taking the working prototype and elevating it to premium quality -- fixing visual polish, adding functional depth, wiring real integrations, and deploying.

**Core Value:** Every page should feel like a premium, Apple-quality product that Lucas wants to open every morning -- dense with useful information but visually clean and organized, never cramped or cluttered.

### Constraints

- **Tech stack**: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Framer Motion + React Query + Supabase. No Next.js.
- **Code rules**: No em dashes anywhere. No spinners (skeleton shimmer only). No `any` in TypeScript. No hardcoded colors (CSS variables only). Framer Motion for all animations. React Query for all data fetching. `npm run build` must pass after every change.
- **Deployment**: Cloudflare Pages via Wrangler.
- **Single user**: No auth, no multi-tenant, no user management.
- **Design system**: Must follow idea.md spec (colors, typography, spacing, component patterns).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9.3 - Full codebase with strict mode enabled
- TSX/JSX - React component files with strict null checks
- JavaScript - Configuration files (vite, eslint, postcss)
- CSS - Tailwind CSS utility-first styling
## Runtime
- Node.js v25.8.1 (development)
- Browser-based execution (React SPA)
- npm 11.11.0
- Lockfile: `package-lock.json` present
## Frameworks
- React 19.2.4 - UI library and component framework
- React Router DOM 7.13.1 - Client-side routing (8 routes)
- Vite 8.0.1 - Build tool and dev server
- TanStack React Query 5.94.5 - Server state management with query caching
- TanStack React Query DevTools 5.94.5 - Development debugging
- Radix UI (multiple packages) - Accessible component primitives
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- Tailwind Forms 0.5.11 - Form component styling utilities
- Framer Motion 12.38.0 - Animation library for transitions
- Lucide React 0.577.0 - Icon library
- Date-fns 4.1.0 - Date parsing and formatting
- Class Variance Authority 0.7.1 - CSS-in-JS variant composition
- clsx 2.1.1 - Conditional CSS class names
- Tailwind Merge 3.5.0 - Tailwind class conflict resolution
- No test framework detected (no Jest, Vitest, etc.)
- @vitejs/plugin-react 6.0.1 - React optimization for Vite
- TypeScript 5.9.3 - Type checking
- ESLint 9.39.4 - Code linting
- TypeScript ESLint 8.57.0 - TypeScript linting rules
- ESLint Plugin React Hooks 7.0.1 - React hooks best practices
- ESLint Plugin React Refresh 0.5.2 - React Fast Refresh support
- Autoprefixer 10.4.27 - CSS vendor prefix generation
- PostCSS 8.5.8 - CSS processing pipeline
## Key Dependencies
- @supabase/supabase-js 2.99.3 - Database and backend-as-a-service client
- @anthropic-ai/sdk 0.80.0 - Anthropic Claude API client (installed but used via direct HTTP)
- @tanstack/react-query 5.94.5 - Query caching, state synchronization, automatic refetching
- framer-motion 12.38.0 - Page transitions and UI animations
- lucide-react 0.577.0 - 577 SVG icons
## Configuration
- `.env.local` - Local environment configuration (present, not committed)
- Vite environment variables with `VITE_` prefix used for browser access:
- `vite.config.ts` - Vite configuration with React plugin and `@` path alias
- `tsconfig.json` - References `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` - Strict TypeScript settings (ES2023 target, strict mode enabled)
- `tailwind.config.ts` - Custom theme with coral/navy colors, custom radius, shadows
- `postcss.config.js` - Tailwind CSS and Autoprefixer plugins
- `eslint.config.js` - Flat config with recommended rules, TypeScript ESLint, React Hooks
## Platform Requirements
- Node.js 20+ (tested with v25.8.1)
- npm 10+ (tested with v11.11.0)
- Browser with ES2023 support
- `.env.local` file with Supabase and Anthropic API credentials
- Static hosting (Vite outputs to `dist/`)
- Cloudflare, GitHub Pages, Vercel, or similar (no Node runtime needed)
- Browser with ES2023 support
- Access to external APIs: Supabase (database), Anthropic Claude API (brain dump parsing)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Components: PascalCase with `.tsx` extension (e.g., `Badge.tsx`, `ProjectCard.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useProjects.ts`, `useBrainDump.ts`)
- Utility modules: camelCase (e.g., `utils.ts`, `queryClient.ts`, `supabase.ts`)
- Type/interface definitions: PascalCase in dedicated `database.ts` file
- Data/mock files: camelCase (e.g., `mock.ts`)
- Page files: PascalCase matching route structure (e.g., `Dashboard.tsx`, `ProjectDetail.tsx`)
- React components: PascalCase with `export function` declaration
- Regular utility functions: camelCase with `export function` or `export const`
- Internal/helper functions: camelCase without export (e.g., `getProjectBadge`, `urgencyBadge`)
- Hooks: PascalCase prefix with `use` (e.g., `function useProjects()`)
- React state: camelCase (e.g., `const [mobileOpen, setMobileOpen]`, `const [now, setNow]`)
- Component props: camelCase object keys
- Temporary/loop variables: camelCase (e.g., `const proj`, `const item`, `idx`)
- Constants: camelCase (e.g., `const navItems`, `const statusVariant`, `const supabaseUrl`)
- Interface names: PascalCase (e.g., `BadgeProps`, `SkeletonBlockProps`, `Database`)
- Union types: PascalCase (e.g., `ProjectStatus`, `TaskStatus`, `BadgeVariant`)
- Type imports: `import type { TypeName }` for explicit type imports
## Code Style
- ESLint configuration in `eslint.config.js` using flat config format
- No Prettier config detected; relies on ESLint formatting rules
- No `.prettierrc` file present
- Default Vite + ESLint setup without additional formatters
- Tool: ESLint 9.39.4 with flat config system
- Config file: `eslint.config.js`
- Active plugins:
- Key rules enforced:
- `strict: true` enabled in `tsconfig.app.json`
- `noUnusedLocals: true` - Unused variables cause errors
- `noUnusedParameters: true` - Unused function parameters cause errors
- `noFallthroughCasesInSwitch: true` - Switch statements must have returns or breaks
- `erasableSyntaxOnly: true` - Only syntax that can be fully erased is allowed
- `noUncheckedSideEffectImports: true` - Module side effects must be explicit
## Import Organization
- `@/*` maps to `./src/*` (configured in `vite.config.ts` and `tsconfig.app.json`)
- All internal imports use the `@/` prefix consistently
- Examples: `@/lib/queryClient`, `@/components/layout/Sidebar`, `@/hooks/useProjects`, `@/types/database`
## Error Handling
- Async queries/mutations throw errors directly: `if (error) throw error`
- React Query handles promise rejections automatically
- Fallback parsing in async operations: `try/catch` blocks with sensible defaults
- Conditional error checking (e.g., `if (error && error.code !== 'PGRST116') throw error`) for expected errors
- Mock data fallback pattern: `if (!isSupabaseConfigured) return mockData`
- No global error boundary detected; errors propagate to React Query
- `useProjects.ts` lines 22, 40, 56, 72, 97: `if (error) throw error`
- `useBrainDump.ts` lines 71-76: `try/catch` with fallback data structure
- `useProjects.ts` line 129: Specific error code handling for PGRST116 (not found)
- Mutation errors: `mutationFn` throws directly, `onSuccess` callback doesn't execute if error occurs
## Logging
- No explicit logging statements in examined codebase
- React Query handles state management without logging
- Error visibility through browser DevTools and React Query DevTools (`@tanstack/react-query-devtools`)
- Console logging not observed in production code
## Comments
- Very limited use of comments in codebase
- Inline comments used only for clarification of non-obvious logic
- No JSDoc comments observed in functional components
- Not used for components or hooks in this codebase
- Type information provided through TypeScript interfaces and inline type annotations instead
## Function Design
- Hooks are compact (15-50 lines typical)
- Components are medium-sized (50-150 lines typical for smaller components, 200+ lines for complex pages)
- Utility functions are small and focused (5-15 lines)
- React components accept single `props` parameter with destructuring (e.g., `{ children, variant = 'neutral', className }`)
- Custom hooks accept simple parameters (single string for IDs)
- Utility functions use specific parameter lists rather than objects
- Default parameters used for optional props (e.g., `variant = 'neutral'`)
- React components return JSX
- Hooks return React Query hooks or mutations (QueryResult, MutationResult)
- Utility functions return primitives (strings, numbers, objects)
- Conditional returns: early exit pattern for loading states (e.g., `if (isLoading) return <SkeletonBlock>`)
## Module Design
- Named exports used consistently (no default exports in hooks or utilities)
- React components exported as `export function ComponentName() {}`
- Multiple exports per file when logically grouped (e.g., `Badge.tsx` and `SkeletonBlock.tsx` are separate but could be grouped)
- Hook files export multiple related hooks (e.g., `useProjects.ts` exports `useProjects`, `useProject`, `useTasks`, `useMilestones`, `useActionItems`, etc.)
- No barrel files (index.ts) observed in codebase
- Components imported directly from their individual files
- Hooks imported directly from their specific hook files
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- Component-based UI with page-level route separation
- Hook-based data fetching with fallback to mock data
- Graceful degradation when Supabase is not configured
- Animation-first design with Framer Motion
- Tailwind CSS + Radix UI for styling and accessible components
- TypeScript for type-safe database interactions
## Layers
- Purpose: Render user interface and handle user interactions
- Location: `src/components/`
- Contains: Page components, layout shells, card components, reusable UI primitives (Badge, SkeletonBlock, StatusDot)
- Depends on: Hooks, utilities, styling
- Used by: Pages
- Purpose: Route-specific containers that compose dashboard and feature sections
- Location: `src/pages/`
- Contains: Dashboard, Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings
- Depends on: Components, hooks, PageShell layout wrapper
- Used by: React Router
- Purpose: Encapsulate data fetching, caching, and mutations
- Location: `src/hooks/`
- Contains: `useProjects()`, `useTasks()`, `useBrainDumps()`, `useActivityLog()`, `useSocialPlatforms()`, `useContentReviews()`, `useSystemHealth()`, and related mutations
- Depends on: Supabase client, TanStack React Query, mock data
- Used by: Components and pages
- Purpose: Provide client configuration, utilities, and service integrations
- Location: `src/lib/`
- Contains: `supabase.ts` (Supabase client initialization), `queryClient.ts` (TanStack React Query config), `utils.ts` (formatting and helper functions)
- Depends on: External SDKs (Supabase, React Query)
- Used by: Hooks and components
- Purpose: Define TypeScript types for database entities and validation
- Location: `src/types/database.ts`
- Contains: Zod-like Database interface mapping, entity types (Project, Task, BrainDump, etc.), status enums
- Depends on: Nothing
- Used by: All layers for type safety
- Purpose: Fallback data for offline/unconfigured environments
- Location: `src/data/mock.ts`
- Contains: Mock instances of all major entities (mockProjects, mockTasks, mockBrainDumps, etc.)
- Depends on: Nothing
- Used by: Hooks when Supabase is not configured
## Data Flow
- Server state (data from Supabase): Managed by TanStack React Query with automatic caching and invalidation
- Local UI state (form inputs, modal open/close): React `useState()` at component level
- No global state management library (Redux, Zustand); Query client serves as single source of truth for server data
## Key Abstractions
- Purpose: Encapsulate Supabase queries and provide consistent caching interface
- Examples: `src/hooks/useProjects.ts`, `src/hooks/useBrainDump.ts`, `src/hooks/useActivityLog.ts`
- Pattern: Each hook exports `useXxx()` query hook + `useXxxMutation()` mutation hook; gracefully falls back to mock data
- Purpose: Reusable dashboard widget containers with consistent styling and animation
- Examples: `src/components/dashboard/ActionItemsCard.tsx`, `src/components/dashboard/SystemHealthCard.tsx`
- Pattern: Accept data via props, show loading skeleton while fetching, render motion-animated content
- Purpose: Low-level reusable UI elements wrapping Radix UI or custom implementations
- Examples: `src/components/ui/Badge.tsx`, `src/components/ui/SkeletonBlock.tsx`, `src/components/ui/StatusDot.tsx`
- Pattern: Accept variant prop for styling (error, warning, success, neutral), compose into higher-level components
- Purpose: Consistent page layout wrapper with header, title, subtitle, action buttons, and animated transition
- Location: `src/components/layout/PageShell.tsx`
- Pattern: All pages wrap content in `<PageShell>` for consistent styling and page transition animations
- Purpose: Allow app to function with or without Supabase backend
- Examples: Every hook checks `isSupabaseConfigured` before calling Supabase
- Pattern: Hooks return mock data when backend is unavailable; UI remains fully functional
## Entry Points
- Location: `src/main.tsx`
- Triggers: Browser DOM load
- Responsibilities: Creates React root and renders `<App />` component
- Location: `src/App.tsx`
- Triggers: Mounted by main.tsx
- Responsibilities: Wraps entire app with `<QueryClientProvider>` and `<BrowserRouter>`; renders `<AppRoutes />`
- Location: `src/App.tsx` (nested in App)
- Triggers: Router initialization
- Responsibilities: Defines all route `<Route>` definitions; renders `<Sidebar />` and `<main>` layout; manages page transitions via `<AnimatePresence>`
- Location: `src/pages/*.tsx`
- Triggers: Route navigation
- Responsibilities: Fetch page-specific data, compose dashboard cards or detail components, wrap in `<PageShell>`
## Error Handling
- Caught in hook `queryFn`; thrown to React Query
- React Query shows error state in UI (component handles via `isError` state)
- User sees error message in card footer or toast notification (not yet implemented, needs CONCERNS)
- Network errors caught in `parseBrainDumpWithClaude()` fetch
- Falls back to simple local parsing (split by sentence, assign generic metadata)
- User sees parsed result even if Claude fails
- `isSupabaseConfigured` flag (environment variables missing) → app uses mock data transparently
- `VITE_ANTHROPIC_API_KEY` missing → brain dump parsing uses fallback parser
- No error thrown; feature degrades gracefully
- TypeScript enforces correct data shape via Database interface
- Supabase client typed with `SupabaseClient<Database>`
- Mutations require correctly-shaped input (no runtime surprises)
## Cross-Cutting Concerns
- Form validation: Ad-hoc in component (not yet centralized)
- API response validation: Implicit via TypeScript types; no Zod runtime validation
- Not implemented; assumes public/demo environment
- Supabase supports auth but not wired up in hooks
- Environment variable exists for API key but auth layer not present
- TanStack React Query handles all caching
- Stale time: 2 minutes (queries marked stale after 2min idle)
- Retry strategy: 1 automatic retry on failure
- Manual invalidation: Mutations call `queryClient.invalidateQueries()` to refetch related queries
- Components show `<SkeletonBlock />` while data is loading
- No global loading overlay; granular per-component
- Framer Motion provides smooth fade-in transitions on data arrival
<!-- GSD:architecture-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd:quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd:debug` for investigation and bug fixing
- `/gsd:execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd:profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
