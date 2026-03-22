# Codebase Structure

**Analysis Date:** 2026-03-22

## Directory Layout

```
forge-console-v2/
├── src/
│   ├── assets/               # SVG icons, images, static files
│   ├── components/           # Reusable React components organized by feature
│   │   ├── ui/              # Primitive UI components (Badge, SkeletonBlock, StatusDot)
│   │   ├── layout/          # Layout wrappers (Sidebar, PageShell)
│   │   ├── dashboard/       # Dashboard-specific cards (ActionItemsCard, SystemHealthCard)
│   │   ├── projects/        # Project-related components (ProjectCard)
│   │   ├── pipeline/        # Content pipeline components (ContentCard)
│   │   ├── activity/        # Activity log components
│   │   ├── settings/        # Settings page components
│   │   └── social/          # Social media components
│   ├── data/                # Mock data and fixtures
│   │   └── mock.ts          # Mock projects, tasks, brain dumps, etc.
│   ├── hooks/               # Custom React hooks for data fetching
│   │   ├── useProjects.ts   # Fetch projects, tasks, milestones, notes
│   │   ├── useBrainDump.ts  # Brain dump queries and AI parsing
│   │   ├── useActivityLog.ts # Activity log queries with filters
│   │   ├── useContentReviews.ts
│   │   ├── useSocialPlatforms.ts
│   │   └── useSystemHealth.ts
│   ├── lib/                 # Utility libraries and configuration
│   │   ├── supabase.ts      # Supabase client initialization
│   │   ├── queryClient.ts   # TanStack React Query client config
│   │   └── utils.ts         # Formatting helpers (formatDate, formatRelativeTime, cn)
│   ├── pages/               # Route-specific page components
│   │   ├── Dashboard.tsx    # Home page with dashboard cards
│   │   ├── Projects.tsx     # Projects list
│   │   ├── ProjectDetail.tsx # Single project detail view
│   │   ├── BrainDump.tsx    # Brain dump input and review
│   │   ├── ContentPipeline.tsx # Content review workflow
│   │   ├── SocialMedia.tsx  # Social media management
│   │   ├── ActivityLog.tsx  # Activity history view
│   │   └── Settings.tsx     # User settings
│   ├── styles/              # Global CSS and Tailwind configuration
│   │   └── globals.css      # Global styles, CSS variables, theme
│   ├── types/               # TypeScript type definitions
│   │   └── database.ts      # Database schema types (Project, Task, etc.)
│   ├── App.tsx              # Root component with routing setup
│   └── main.tsx             # React root and DOM mount
├── public/                  # Static assets served at root
├── dist/                    # Built output (gitignored)
├── supabase/                # Supabase configuration and migrations
├── index.html               # HTML entry point
├── vite.config.ts           # Vite bundler configuration
├── tsconfig.json            # TypeScript root config (delegates to app/node)
├── tsconfig.app.json        # TypeScript config for src/
├── tsconfig.node.json       # TypeScript config for build files
├── tailwind.config.ts       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration for Tailwind
├── eslint.config.js         # ESLint configuration
├── package.json             # Dependencies and scripts
└── .env.local               # Environment variables (DO NOT COMMIT)
```

## Directory Purposes

**src/assets/:**
- Purpose: Static images and icons
- Contains: SVG files, PNG images
- Key files: None documented yet

**src/components/:**
- Purpose: All React components organized by functional domain
- Contains: Reusable and page-specific React components
- Key files: See subdirectories below

**src/components/ui/:**
- Purpose: Primitive, domain-agnostic UI components
- Contains: Badge, SkeletonBlock, StatusDot (small, reusable)
- Key files: `Badge.tsx`, `SkeletonBlock.tsx`, `StatusDot.tsx`

**src/components/layout/:**
- Purpose: Structural layout components used across pages
- Contains: Sidebar, PageShell
- Key files: `Sidebar.tsx` (navigation), `PageShell.tsx` (page wrapper)

**src/components/dashboard/:**
- Purpose: Dashboard page-specific card components
- Contains: ActionItemsCard, SystemHealthCard, ProjectQuickGlanceCard, UpcomingContentCard
- Key files: All dashboard cards

**src/components/projects/, pipeline/, activity/, etc.:**
- Purpose: Feature-specific UI components
- Contains: Cards and component trees for that feature
- Key files: Organized by feature name

**src/data/:**
- Purpose: Mock data for offline/demo mode
- Contains: Fallback data matching database schema exactly
- Key files: `mock.ts` (all mock data fixtures)

**src/hooks/:**
- Purpose: Custom React hooks encapsulating data fetching and mutations
- Contains: One file per major domain (projects, brain dump, activity, etc.)
- Key files: `useProjects.ts`, `useBrainDump.ts`, `useActivityLog.ts`, `useContentReviews.ts`, `useSocialPlatforms.ts`, `useSystemHealth.ts`

**src/lib/:**
- Purpose: Shared utility code and configuration
- Contains: Client initialization, query setup, formatting functions
- Key files: `supabase.ts`, `queryClient.ts`, `utils.ts`

**src/pages/:**
- Purpose: Route handlers; one component per route
- Contains: Top-level page components that compose features
- Key files: One `.tsx` per route (Dashboard, Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings)

**src/styles/:**
- Purpose: Global CSS and design tokens
- Contains: CSS variables, Tailwind directives, global class definitions
- Key files: `globals.css` (single file with all global styles)

**src/types/:**
- Purpose: Shared TypeScript type definitions
- Contains: Database entity types, status enums, interface definitions
- Key files: `database.ts` (all type definitions sourced from Supabase schema)

**supabase/:**
- Purpose: Supabase configuration and SQL migrations
- Contains: Database schema migrations, RLS policies, edge functions
- Key files: Not yet explored

**Root configuration files:**
- `package.json`: npm dependencies and build scripts
- `vite.config.ts`: Bundler config with React plugin and path alias (`@` → `src/`)
- `tsconfig.json`: TypeScript root config
- `tailwind.config.ts`: Tailwind CSS color tokens and custom theme
- `eslint.config.js`: Code quality rules
- `postcss.config.js`: Tailwind processing setup

## Key File Locations

**Entry Points:**
- `src/main.tsx`: React root initialization; mounts App to #root DOM element
- `src/App.tsx`: Root component; provides QueryClientProvider and BrowserRouter
- `index.html`: HTML entry point; defines #root div

**Configuration:**
- `vite.config.ts`: Build tool config with `@` alias pointing to `src/`
- `tsconfig.app.json`: Source code TypeScript settings
- `tailwind.config.ts`: Design token colors and theme customization
- `.env.local`: Runtime environment variables (never committed)

**Core Logic:**
- `src/lib/supabase.ts`: Initializes Supabase client; exports `isSupabaseConfigured` flag
- `src/lib/queryClient.ts`: TanStack React Query configuration (2min stale time, 1 retry)
- `src/hooks/useProjects.ts`: Primary data-fetching hook for projects, tasks, milestones, notes
- `src/data/mock.ts`: Fallback mock data used when Supabase is unconfigured

**Testing:**
- No test files present; testing infrastructure not yet set up

## Naming Conventions

**Files:**
- React components: PascalCase (e.g., `Dashboard.tsx`, `ActionItemsCard.tsx`)
- Hooks: `use` prefix + camelCase (e.g., `useProjects.ts`, `useBrainDump.ts`)
- Utilities: camelCase (e.g., `utils.ts`, `queryClient.ts`, `supabase.ts`)
- Types/interfaces: Located in `src/types/database.ts` with PascalCase (e.g., `Project`, `Task`, `BrainDump`)
- Constants/enums: UPPER_CASE or camelCase depending on usage

**Directories:**
- Feature domains: lowercase plural (e.g., `components/dashboard/`, `components/projects/`)
- Internal structure: flat within feature (no nested folders; one component per file unless very small)

**Functions:**
- Event handlers: `handle` prefix (not yet seen, but convention)
- Hooks: `use` prefix + PascalCase return type (e.g., `useProjects()` returns `Project[]`)
- Utilities: Descriptive verb + noun (e.g., `formatRelativeTime()`, `getGreeting()`)

**Variables:**
- State: `data`, `isLoading`, `error` (React Query conventions)
- Derived: descriptive camelCase (e.g., `openItems`, `getProjectBadge`)
- Temporal: `now`, `hoursAgo`, `daysAgo` (consistent date helpers)

**Types:**
- Database rows: Entity names without suffix (e.g., `Project`, `Task`)
- Status enums: Suffixed with `Status` (e.g., `ProjectStatus = 'active' | 'paused'`)
- Input types: Optional `Insert`, `Update` variants in Database interface
- Response wrapper: None; hooks return `T | null | undefined`

## Where to Add New Code

**New Feature (e.g., new dashboard card):**
- Primary code: Create `.tsx` file in `src/components/[feature]/` (e.g., `src/components/dashboard/NewCard.tsx`)
- Styles: Use Tailwind classes inline; if many rules, add class in `src/styles/globals.css`
- Data fetching: If new table, add hook in `src/hooks/useNewFeature.ts` following `useProjects.ts` pattern
- Types: Add type definition to `src/types/database.ts` Database interface
- Mock data: Add mock array to `src/data/mock.ts`

**New Page/Route:**
- Implementation: Create `.tsx` file in `src/pages/RouteName.tsx`
- Add route: Insert `<Route path="/route-path" element={<RouteName />} />` in `src/App.tsx` AppRoutes component
- Wrap content: Use `<PageShell title="..." subtitle="...">` for consistent header and transitions
- Compose: Import feature cards/components and arrange in layout

**New Utility Function:**
- Shared helpers: Add to `src/lib/utils.ts` (e.g., date formatting, class name combining)
- Client config: Add to `src/lib/supabase.ts` (Supabase initialization) or `src/lib/queryClient.ts` (React Query setup)
- Export: Named export from file; import in consumers via `@/lib/utils`

**New Data Hook:**
- Location: Create file in `src/hooks/use[Feature].ts`
- Pattern: Copy structure from `src/hooks/useProjects.ts`:
  - Define `useQuery()` with queryKey (e.g., `['feature']`)
  - Check `isSupabaseConfigured` to decide between Supabase or mock
  - Return Supabase query result or mock data
  - Export mutations as separate hooks (e.g., `useAddFeature()`, `useUpdateFeature()`)
- Cache invalidation: Always call `qc.invalidateQueries({ queryKey: ['feature'] })` on mutation success

**New UI Primitive:**
- Location: Create file in `src/components/ui/ComponentName.tsx`
- Pattern: Small, reusable component with variant prop (e.g., `variant="error" | "warning" | "success"`)
- Export: From `src/components/ui/` for import in higher-level components

## Special Directories

**node_modules/:**
- Purpose: npm package dependencies
- Generated: Yes (generated by `npm install`)
- Committed: No (in .gitignore)

**dist/:**
- Purpose: Built JavaScript, CSS, and assets (Vite output)
- Generated: Yes (generated by `npm run build`)
- Committed: No (in .gitignore)

**.planning/codebase/:**
- Purpose: Architecture and planning documents (this file lives here)
- Generated: No (hand-written by GSD analysis tools)
- Committed: Yes (documents future work)

**.git/:**
- Purpose: Git version control metadata
- Generated: Yes (generated by `git init`)
- Committed: No (.gitignore irrelevant; git manages itself)

**supabase/:**
- Purpose: Supabase backend configuration and migrations
- Generated: Partially (migrations auto-generated by Supabase CLI)
- Committed: Yes (migrations need version control)

---

*Structure analysis: 2026-03-22*
