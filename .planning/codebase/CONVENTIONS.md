# Coding Conventions

**Analysis Date:** 2026-03-22

## Naming Patterns

**Files:**
- React components: PascalCase `.tsx` (e.g., `ProjectCard.tsx`, `ActionItemsCard.tsx`, `SkeletonBlock.tsx`)
- React pages: PascalCase `.tsx` matching route concept (e.g., `Dashboard.tsx`, `ContentPipeline.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useProjects.ts`, `useBrainDump.ts`, `useActivityLog.ts`)
- Utility modules: camelCase (e.g., `utils.ts`, `queryClient.ts`, `supabase.ts`)
- Type files: camelCase (e.g., `database.ts`)
- Mock data: camelCase (e.g., `mock.ts`)
- shadcn/ui primitives: kebab-case `.tsx` (e.g., `badge.tsx`, `dropdown-menu.tsx`, `scroll-area.tsx`)

**Functions:**
- React components: `export function ComponentName()` PascalCase declaration (never `const Component = () =>`)
- Custom hooks: `export function useHookName()` PascalCase prefix
- Internal helpers: camelCase without export (e.g., `urgencyBadge`, `getProjectBadge`, `parseBrainDumpWithClaude`)
- Utility functions: camelCase named exports (e.g., `formatRelativeTime`, `getGreeting`, `formatDate`)

**Variables:**
- React state: camelCase pairs (e.g., `const [mobileOpen, setMobileOpen]`, `const [now, setNow]`)
- Query results: destructure with semantic aliases (e.g., `const { data: items, isLoading: loadingItems }`)
- Loop variables: camelCase shorthand (e.g., `proj`, `item`, `idx`)
- Constants/lookup tables: camelCase (e.g., `const statusVariant`, `const navItems`, `const statusConfig`)
- Query client reference: abbreviated `qc` (e.g., `const qc = useQueryClient()`)

**Types and Interfaces:**
- Interfaces: PascalCase (e.g., `BadgeProps`, `SkeletonBlockProps`, `ActivityFilters`, `Database`)
- Union/literal types: PascalCase (e.g., `ProjectStatus`, `TaskStatus`, `ViewMode`, `ContentStatus`)
- Type imports: use `import type { TypeName }` syntax consistently
- Database entity interfaces: PascalCase matching table concept (e.g., `Project`, `Task`, `BrainDump`)

## Code Style

**Formatting:**
- No Prettier config; formatting is ad-hoc (ESLint-driven)
- Single quotes for strings in TypeScript files
- No trailing commas in function parameters (files vary slightly)
- 2-space indentation

**Linting:**
- ESLint 9 flat config via `eslint.config.js`
- Plugins active: `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- `@typescript-eslint/no-explicit-any` enforced; suppressed with line-level `// eslint-disable-next-line` in 4 mutation functions where Supabase typing is incomplete
- TypeScript strict mode: `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, `erasableSyntaxOnly`, `noUncheckedSideEffectImports`

**TypeScript:**
- All files use strict TypeScript; `any` is forbidden and requires explicit suppression comment
- Generic type parameters on React Query calls (e.g., `useQuery<Project[]>`, `useQuery<Task | null>`)
- `Record<string, T>` for lookup tables (e.g., `Record<string, 'success' | 'warning' | 'info' | 'neutral'>`)
- Database types use `Omit<Entity, 'id' | 'created_at'>` pattern for Insert/Update shapes

## Import Organization

**Order observed (enforced by convention, not tooling):**
1. React core (e.g., `import { useState, useEffect } from 'react'`)
2. Third-party libraries (e.g., `framer-motion`, `lucide-react`, `react-router-dom`, `@tanstack/react-query`)
3. Internal components using `@/` alias (e.g., `@/components/layout/PageShell`)
4. Internal hooks (e.g., `@/hooks/useProjects`)
5. Internal utilities and lib (e.g., `@/lib/utils`, `@/lib/supabase`)
6. Type imports (e.g., `import type { Project } from '@/types/database'`)

**Path Aliases:**
- `@/*` maps to `./src/*` -- use this for ALL internal imports without exception
- Never use relative paths like `../../components/`; always use `@/components/`

**Type import syntax:**
- Use `import type { TypeName }` for all type-only imports (required by `verbatimModuleSyntax`)

## Error Handling

**Query functions:**
```typescript
const { data, error } = await supabase.from('table').select('*')
if (error) throw error
return data as EntityType[]
```

**Expected errors (e.g., 404 not found from Supabase):**
```typescript
if (error && error.code !== 'PGRST116') throw error
return data as Entity | null
```

**Mutations use `onError` callback:**
```typescript
onError: (error: Error) => {
  toast.error('Failed to update task', { description: error.message })
}
```

**Graceful degradation pattern (every hook):**
```typescript
if (!isSupabaseConfigured) return mockData
```

**Async utility functions:**
```typescript
try {
  return JSON.parse(content) as ParsedType
} catch {
  return fallbackValue
}
```

**No global error boundary for data errors** -- errors propagate to React Query and surface via `isError` state in components. App-level `<ErrorBoundary FallbackComponent={PageErrorFallback}>` catches render crashes only.

## Logging

- No `console.log` or logging framework in production code
- Errors surface through React Query DevTools (`@tanstack/react-query-devtools`) during development
- User-facing error feedback via `toast.error()` from `sonner` in mutation `onError` callbacks
- User-facing success feedback via `toast.success()` in mutation `onSuccess` callbacks

## Comments

**When to comment:**
- Only for non-obvious logic (e.g., a fallback JSON parse block)
- Required before each `eslint-disable-next-line` suppression
- Section labels in long JSX are acceptable (e.g., `{/* Page header */}`, `{/* Footer */}`)
- No JSDoc or TSDoc comments on any functions or components

**Pattern:**
```typescript
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { error } = await (supabase as any).from('table')...
```

## Function Design

**Component size:**
- Small utility components: 10-30 lines (e.g., `SkeletonBlock`, `StatusDot`)
- Dashboard cards: 50-150 lines
- Page components: 40-300+ lines for complex pages with multiple view modes

**Parameter style:**
- Components accept single destructured props object: `{ project, index }: ProjectCardProps`
- Hooks accept typed parameters directly: `useProject(slug: string)`, `useTasks(projectId: string)`
- Optional parameters use `?` not default: `useActionItems(projectId?: string)`
- Mutation functions accept typed inline objects: `{ id: string; status: Task['status'] }`

**Return patterns:**
- Components: early return for loading state (`if (isLoading) return <SkeletonCard />`)
- Hooks: return the React Query result object directly (do not destructure before returning)
- Utility functions: return primitives or typed objects

**Animation pattern (required for all data-loaded content):**
```typescript
<motion.div
  initial={{ opacity: 0, y: 12 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
>
  {/* content */}
</motion.div>
```

## Module Design

**Exports:**
- Named exports only; no default exports in hooks, utilities, or custom components
- shadcn/ui primitives (`src/components/ui/*.tsx`) use shadcn's own export style (also named)
- Multiple related hooks grouped in one file (e.g., `useProjects.ts` exports `useProjects`, `useProject`, `useTasks`, `useMilestones`, `useActionItems`, `useProjectNotes`, `useNextSessionPrompt`, `useUpdateTask`, `useAddNote`)

**Barrel files:**
- No `index.ts` barrel files; always import directly from the source file

**Lookup tables at module scope:**
- Status-to-variant mappings defined as `const` at module scope (outside components):
```typescript
const statusVariant: Record<string, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  archived: 'neutral',
}
```

## Styling Conventions

**Colors:**
- Never hardcode hex or rgb values; always use CSS variables: `hsl(var(--accent-coral))`, `hsl(var(--text-primary))`, `hsl(var(--bg-elevated))`
- Tailwind utility classes used for layout (e.g., `flex`, `flex-col`, `items-center`)
- Inline `style` props used for spacing and precise layout values

**No spinners:**
- Loading states use skeleton shimmer only via `<SkeletonBlock>` or `<SkeletonCard>` from `src/components/ui/SkeletonBlock.tsx`

**Framer Motion:**
- Required for all animated content entrance; use consistent easing `[0.16, 1, 0.3, 1]`
- Staggered list animations use `delay: index * 0.05` or `delay: index * 0.08` pattern

---

*Convention analysis: 2026-03-22*
