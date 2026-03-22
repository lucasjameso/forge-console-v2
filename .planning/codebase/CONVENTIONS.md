# Coding Conventions

**Analysis Date:** 2026-03-22

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension (e.g., `Badge.tsx`, `ProjectCard.tsx`)
- Hooks: camelCase prefixed with `use` (e.g., `useProjects.ts`, `useBrainDump.ts`)
- Utility modules: camelCase (e.g., `utils.ts`, `queryClient.ts`, `supabase.ts`)
- Type/interface definitions: PascalCase in dedicated `database.ts` file
- Data/mock files: camelCase (e.g., `mock.ts`)
- Page files: PascalCase matching route structure (e.g., `Dashboard.tsx`, `ProjectDetail.tsx`)

**Functions:**
- React components: PascalCase with `export function` declaration
- Regular utility functions: camelCase with `export function` or `export const`
- Internal/helper functions: camelCase without export (e.g., `getProjectBadge`, `urgencyBadge`)
- Hooks: PascalCase prefix with `use` (e.g., `function useProjects()`)

**Variables:**
- React state: camelCase (e.g., `const [mobileOpen, setMobileOpen]`, `const [now, setNow]`)
- Component props: camelCase object keys
- Temporary/loop variables: camelCase (e.g., `const proj`, `const item`, `idx`)
- Constants: camelCase (e.g., `const navItems`, `const statusVariant`, `const supabaseUrl`)

**Types:**
- Interface names: PascalCase (e.g., `BadgeProps`, `SkeletonBlockProps`, `Database`)
- Union types: PascalCase (e.g., `ProjectStatus`, `TaskStatus`, `BadgeVariant`)
- Type imports: `import type { TypeName }` for explicit type imports

## Code Style

**Formatting:**
- ESLint configuration in `eslint.config.js` using flat config format
- No Prettier config detected; relies on ESLint formatting rules
- No `.prettierrc` file present
- Default Vite + ESLint setup without additional formatters

**Linting:**
- Tool: ESLint 9.39.4 with flat config system
- Config file: `eslint.config.js`
- Active plugins:
  - `@eslint/js` - Recommended preset
  - `typescript-eslint` - TypeScript support with recommended rules
  - `eslint-plugin-react-hooks` - React hooks linting
  - `eslint-plugin-react-refresh` - Vite react-refresh support
- Key rules enforced:
  - `@typescript-eslint/no-explicit-any` violations noted in code with `eslint-disable-next-line` comments
  - React hooks dependencies checked
  - React refresh compatibility

**TypeScript Strict Mode:**
- `strict: true` enabled in `tsconfig.app.json`
- `noUnusedLocals: true` - Unused variables cause errors
- `noUnusedParameters: true` - Unused function parameters cause errors
- `noFallthroughCasesInSwitch: true` - Switch statements must have returns or breaks
- `erasableSyntaxOnly: true` - Only syntax that can be fully erased is allowed
- `noUncheckedSideEffectImports: true` - Module side effects must be explicit

## Import Organization

**Order:**
1. React and external dependencies (e.g., `import { useState } from 'react'`)
2. Third-party libraries (e.g., `import { motion } from 'framer-motion'`, `import { useQuery } from '@tanstack/react-query'`)
3. Icons and UI libraries (e.g., `import { AlertCircle } from 'lucide-react'`)
4. Internal components and utilities with `@/` alias (e.g., `import { Badge } from '@/components/ui/Badge'`)
5. Type imports as `import type { TypeName }` at top of relevant groups

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `vite.config.ts` and `tsconfig.app.json`)
- All internal imports use the `@/` prefix consistently
- Examples: `@/lib/queryClient`, `@/components/layout/Sidebar`, `@/hooks/useProjects`, `@/types/database`

**Example from codebase:**
```typescript
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { SkeletonBlock } from '@/components/ui/SkeletonBlock'
import { useActionItems } from '@/hooks/useProjects'
import { formatRelativeTime } from '@/lib/utils'
import type { Project, Task } from '@/types/database'
```

## Error Handling

**Patterns:**
- Async queries/mutations throw errors directly: `if (error) throw error`
- React Query handles promise rejections automatically
- Fallback parsing in async operations: `try/catch` blocks with sensible defaults
- Conditional error checking (e.g., `if (error && error.code !== 'PGRST116') throw error`) for expected errors
- Mock data fallback pattern: `if (!isSupabaseConfigured) return mockData`
- No global error boundary detected; errors propagate to React Query

**Examples:**
- `useProjects.ts` lines 22, 40, 56, 72, 97: `if (error) throw error`
- `useBrainDump.ts` lines 71-76: `try/catch` with fallback data structure
- `useProjects.ts` line 129: Specific error code handling for PGRST116 (not found)
- Mutation errors: `mutationFn` throws directly, `onSuccess` callback doesn't execute if error occurs

## Logging

**Framework:** No dedicated logging library; uses native `console` if needed

**Patterns:**
- No explicit logging statements in examined codebase
- React Query handles state management without logging
- Error visibility through browser DevTools and React Query DevTools (`@tanstack/react-query-devtools`)
- Console logging not observed in production code

## Comments

**When to Comment:**
- Very limited use of comments in codebase
- Inline comments used only for clarification of non-obvious logic
- No JSDoc comments observed in functional components

**JSDoc/TSDoc:**
- Not used for components or hooks in this codebase
- Type information provided through TypeScript interfaces and inline type annotations instead

## Function Design

**Size:**
- Hooks are compact (15-50 lines typical)
- Components are medium-sized (50-150 lines typical for smaller components, 200+ lines for complex pages)
- Utility functions are small and focused (5-15 lines)

**Parameters:**
- React components accept single `props` parameter with destructuring (e.g., `{ children, variant = 'neutral', className }`)
- Custom hooks accept simple parameters (single string for IDs)
- Utility functions use specific parameter lists rather than objects
- Default parameters used for optional props (e.g., `variant = 'neutral'`)

**Return Values:**
- React components return JSX
- Hooks return React Query hooks or mutations (QueryResult, MutationResult)
- Utility functions return primitives (strings, numbers, objects)
- Conditional returns: early exit pattern for loading states (e.g., `if (isLoading) return <SkeletonBlock>`)

**Pattern Examples:**
```typescript
// Simple component with defaults
export function Badge({ children, variant = 'neutral', className }: BadgeProps) {
  return <span className={cn('badge', `badge-${variant}`, className)}>{children}</span>
}

// Hook returning React Query hook
export function useProjects() {
  return useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => { ... }
  })
}

// Utility function returning primitives
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const target = new Date(date)
  // calculation logic
  return 'just now'
}
```

## Module Design

**Exports:**
- Named exports used consistently (no default exports in hooks or utilities)
- React components exported as `export function ComponentName() {}`
- Multiple exports per file when logically grouped (e.g., `Badge.tsx` and `SkeletonBlock.tsx` are separate but could be grouped)
- Hook files export multiple related hooks (e.g., `useProjects.ts` exports `useProjects`, `useProject`, `useTasks`, `useMilestones`, `useActionItems`, etc.)

**Barrel Files:**
- No barrel files (index.ts) observed in codebase
- Components imported directly from their individual files
- Hooks imported directly from their specific hook files

**Example file structure for hooks:**
```typescript
// useProjects.ts - exports 10+ related hooks
export function useProjects() { ... }
export function useProject(slug: string) { ... }
export function useTasks(projectId: string) { ... }
export function useMilestones(projectId: string) { ... }
export function useActionItems(projectId?: string) { ... }
export function useProjectNotes(projectId: string) { ... }
export function useNextSessionPrompt(projectId: string) { ... }
export function useUpdateTask() { ... }
export function useAddNote() { ... }
```

---

*Convention analysis: 2026-03-22*
