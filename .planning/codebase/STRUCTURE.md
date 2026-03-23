# Codebase Structure

**Analysis Date:** 2026-03-22

## Directory Layout

```
forge-console-v2/
├── src/
│   ├── assets/              # Static assets (images, svgs)
│   ├── components/
│   │   ├── ui/              # Low-level shadcn/ui + custom primitives
│   │   ├── layout/          # Sidebar, PageShell
│   │   ├── dashboard/       # Dashboard-specific cards and strips
│   │   ├── activity/        # Activity log feature components
│   │   ├── pipeline/        # Content pipeline cards
│   │   ├── projects/        # Project card components
│   │   ├── settings/        # Settings page components
│   │   ├── social/          # Social media feature components
│   │   ├── AccessGate.tsx   # PIN auth gate (app-wide)
│   │   └── FeedbackWidget.tsx # Floating feedback form (app-wide)
│   ├── data/
│   │   └── mock.ts          # Offline fallback data for all entities
│   ├── hooks/               # TanStack React Query data hooks
│   ├── lib/                 # Supabase client, queryClient, utils
│   ├── pages/               # Route-bound page components
│   ├── styles/
│   │   └── globals.css      # CSS custom properties (design tokens) + Tailwind base
│   ├── types/
│   │   └── database.ts      # All TypeScript interfaces and the Supabase Database type
│   ├── App.tsx              # Root component, router, providers
│   └── main.tsx             # ReactDOM entry point
├── supabase/
│   ├── schema.sql           # Full Supabase table definitions
│   └── seed.sql             # Seed data for development
├── prompts/                 # AI prompt files for project data collection
├── public/                  # Static public assets served at root
├── dist/                    # Vite build output (generated, not committed)
├── .planning/               # GSD workflow planning artifacts
│   ├── codebase/            # Codebase map documents (this file lives here)
│   ├── phases/              # Phase plans by number
│   ├── feedback/            # Page feedback captures
│   ├── research/            # Research notes
│   └── todos/               # Pending and done task lists
├── index.html               # HTML entry point
├── vite.config.ts           # Vite config with @ path alias
├── tailwind.config.ts       # Tailwind theme with design tokens
├── tsconfig.app.json        # TypeScript strict config for src/
├── package.json             # Dependencies and scripts
├── eslint.config.js         # ESLint flat config
└── components.json          # shadcn/ui config (component install target)
```

## Directory Purposes

**`src/components/ui/`:**
- Purpose: Atomic, reusable UI building blocks
- Contains: shadcn/ui-generated components (button, card, dialog, input, select, tabs, badge, etc.) plus custom primitives (`SkeletonBlock.tsx`, `SkeletonCard.tsx`, `StatusDot.tsx`, `ErrorFallback.tsx`, `PageErrorFallback.tsx`)
- Key files: `src/components/ui/SkeletonBlock.tsx`, `src/components/ui/badge.tsx`, `src/components/ui/card.tsx`

**`src/components/layout/`:**
- Purpose: App shell scaffolding -- navigation and page frame
- Contains: `Sidebar.tsx` (fixed 220px left nav with mobile Sheet drawer), `PageShell.tsx` (animated page wrapper with title/subtitle/actions header)
- Key files: `src/components/layout/PageShell.tsx`, `src/components/layout/Sidebar.tsx`

**`src/components/dashboard/`:**
- Purpose: Dashboard page widgets -- each is a self-contained card that calls its own hook
- Contains: `ActionItemsCard.tsx`, `ContentCalendarStrip.tsx`, `ProjectQuickGlanceCard.tsx`, `StatTilesRow.tsx`, `SystemHealthCard.tsx`, `SystemHealthStrip.tsx`, `UpcomingContentCard.tsx`
- Key files: `src/components/dashboard/StatTilesRow.tsx`, `src/components/dashboard/ActionItemsCard.tsx`

**`src/components/pipeline/` and `src/components/projects/`:**
- Purpose: Feature-specific card components used within their respective pages
- Contains: `ContentCard.tsx` (content review card), `ProjectCard.tsx` (project list card)

**`src/hooks/`:**
- Purpose: All data access -- queries and mutations wired to Supabase with mock fallback
- Contains: One file per domain area; each exports named hook functions
- Key files: `src/hooks/useProjects.ts`, `src/hooks/useBrainDump.ts`, `src/hooks/useActivityLog.ts`, `src/hooks/useContentReviews.ts`, `src/hooks/useDashboardStats.ts`, `src/hooks/usePageFeedback.ts`, `src/hooks/useSocialPlatforms.ts`, `src/hooks/useSystemHealth.ts`

**`src/lib/`:**
- Purpose: Singleton service instances and pure utility functions
- Key files: `src/lib/supabase.ts` (Supabase client + `isSupabaseConfigured` flag), `src/lib/queryClient.ts` (React Query client singleton), `src/lib/utils.ts` (cn, date/time formatters, getGreeting)

**`src/types/`:**
- Purpose: Shared TypeScript type definitions -- single file for entire codebase
- Key files: `src/types/database.ts` (all entity interfaces, status unions, Supabase Database generic)

**`src/data/`:**
- Purpose: Static mock data matching all entity shapes for offline/unconfigured use
- Key files: `src/data/mock.ts`

**`src/pages/`:**
- Purpose: Route-level containers that compose feature components into complete views
- Key files: `src/pages/Dashboard.tsx`, `src/pages/ProjectDetail.tsx`, `src/pages/ContentPipeline.tsx` (503 lines -- most complex), `src/pages/Settings.tsx`, `src/pages/BrainDump.tsx`

**`src/styles/`:**
- Purpose: Global CSS with design tokens and Tailwind base layer
- Key files: `src/styles/globals.css` (CSS custom properties for colors, spacing, shadows, radius, sidebar width; shadcn/ui variable bridge)

**`supabase/`:**
- Purpose: Database schema definitions and seed data (not auto-generated -- hand-authored)
- Key files: `supabase/schema.sql`, `supabase/seed.sql`

**`.planning/`:**
- Purpose: GSD workflow artifacts -- planning, phase execution, todos, research
- Generated: No (hand-maintained)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `src/main.tsx`: ReactDOM root mount, global CSS import, font imports
- `src/App.tsx`: Provider tree, error boundary, access gate, routing, page transitions
- `index.html`: HTML shell, mounts `#root`

**Configuration:**
- `vite.config.ts`: Vite plugins, `@` path alias pointing to `./src`
- `tailwind.config.ts`: Custom theme with coral/navy accent palette
- `tsconfig.app.json`: Strict TypeScript settings (ES2023, strict mode, noUnusedLocals)
- `eslint.config.js`: ESLint flat config with TypeScript ESLint and React Hooks rules
- `components.json`: shadcn/ui configuration (paths, style, base color)
- `src/styles/globals.css`: All CSS design tokens and Tailwind directives

**Core Logic:**
- `src/lib/supabase.ts`: Supabase client initialization and `isSupabaseConfigured` export
- `src/lib/queryClient.ts`: React Query client with 2-minute stale time, 1 retry
- `src/lib/utils.ts`: `cn()`, date/time formatting utilities
- `src/types/database.ts`: All entity types and Supabase Database interface
- `src/data/mock.ts`: All mock data for offline mode

**Data Hooks (domain-by-domain):**
- `src/hooks/useProjects.ts`: `useProjects`, `useProject`, `useTasks`, `useMilestones`, `useActionItems`, `useProjectNotes`, `useNextSessionPrompt`, `useUpdateTask`, `useAddNote`
- `src/hooks/useBrainDump.ts`: `useBrainDumps`, `useSubmitBrainDump`, `parseBrainDumpWithClaude`
- `src/hooks/useActivityLog.ts`: `useActivityLog` (with filter params)
- `src/hooks/useContentReviews.ts`: `useContentReviews`
- `src/hooks/useDashboardStats.ts`: `useDashboardStats`
- `src/hooks/usePageFeedback.ts`: `useSubmitFeedback`
- `src/hooks/useSocialPlatforms.ts`: `useSocialPlatforms`
- `src/hooks/useSystemHealth.ts`: `useSystemHealth`

## Naming Conventions

**Files:**
- React components: PascalCase `.tsx` (e.g., `ProjectCard.tsx`, `PageShell.tsx`)
- Hooks: camelCase with `use` prefix `.ts` (e.g., `useProjects.ts`, `useBrainDump.ts`)
- Utilities and lib modules: camelCase `.ts` (e.g., `utils.ts`, `queryClient.ts`, `supabase.ts`)
- Type files: camelCase `.ts` (e.g., `database.ts`)
- Mock/data files: camelCase `.ts` (e.g., `mock.ts`)
- shadcn-generated UI: lowercase with hyphens `.tsx` (e.g., `dropdown-menu.tsx`, `scroll-area.tsx`)

**Directories:**
- Feature component groups: lowercase (e.g., `dashboard/`, `pipeline/`, `projects/`)
- Top-level src directories: lowercase (e.g., `components/`, `hooks/`, `pages/`, `lib/`, `types/`, `data/`)

**React Components:**
- PascalCase `export function` declarations (e.g., `export function ProjectCard() {}`)
- No default exports in components

**Hooks:**
- camelCase with `use` prefix (e.g., `function useProjects()`)
- Named exports only

## Where to Add New Code

**New Page:**
- Page component: `src/pages/NewPageName.tsx` -- wrap content in `<PageShell title="..." subtitle="...">`
- Route: Add `<Route path="/new-path" element={<NewPageName />} />` in `src/App.tsx` AppRoutes
- Nav link: Add entry to `navItems` array in `src/components/layout/Sidebar.tsx`

**New Feature Component (dashboard widget, feature card):**
- Implementation: `src/components/{feature-area}/ComponentName.tsx`
- Example: A new dashboard card goes in `src/components/dashboard/NewCard.tsx`
- Import into the relevant page

**New Data Hook:**
- Implementation: `src/hooks/useNewDomain.ts`
- Pattern: Check `isSupabaseConfigured`, return mock data if false, otherwise query Supabase
- Export named hook functions (no default exports)
- Add corresponding mock data to `src/data/mock.ts`
- Add entity interfaces to `src/types/database.ts`

**New UI Primitive:**
- Custom primitives: `src/components/ui/ComponentName.tsx`
- shadcn/ui components: Run `npx shadcn@latest add component-name` (writes to `src/components/ui/`)

**New Entity / Database Table:**
1. Add TypeScript interface to `src/types/database.ts`
2. Add table mapping to the `Database` interface in `src/types/database.ts`
3. Add mock data entry to `src/data/mock.ts`
4. Create hook in `src/hooks/useNewEntity.ts`
5. Add table to `supabase/schema.sql`

**Shared Utility Functions:**
- Add to `src/lib/utils.ts`
- Export as named function

## Special Directories

**`dist/`:**
- Purpose: Vite production build output
- Generated: Yes (`npm run build`)
- Committed: No (in `.gitignore`)

**`node_modules/`:**
- Purpose: npm package dependencies
- Generated: Yes (`npm install`)
- Committed: No

**`.planning/`:**
- Purpose: GSD workflow planning artifacts (phases, todos, research, codebase docs)
- Generated: No (maintained via GSD commands and manually)
- Committed: Yes

**`.wrangler/`:**
- Purpose: Wrangler (Cloudflare) temporary deployment artifacts
- Generated: Yes
- Committed: No

**`supabase/`:**
- Purpose: Hand-authored schema and seed SQL files for Supabase project setup
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-22*
