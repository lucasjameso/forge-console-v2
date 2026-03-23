# Testing Patterns

**Analysis Date:** 2026-03-22

## Test Framework

**Runner:**
- None. No test framework is installed or configured.
- No Jest, Vitest, Mocha, Playwright, Cypress, or any other test runner detected.
- No `jest.config.*`, `vitest.config.*`, or test setup files exist.

**Assertion Library:**
- None.

**Run Commands:**
```bash
# No test commands available
npm run build    # Only quality gate is a successful TypeScript + Vite build
```

## Test File Organization

**Location:**
- No test files exist anywhere in the repository.
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files detected.

**Naming:**
- Not applicable.

## Test Structure

No tests exist. The codebase has no test infrastructure at all.

## Mocking

**Framework:** None.

**Mock data pattern (used for development/offline, not testing):**

The codebase uses a mock data module at `src/data/mock.ts` that serves as offline fallback when Supabase is not configured. Every hook checks `isSupabaseConfigured` and returns mock data when the environment variables are missing:

```typescript
// Pattern in every hook (src/hooks/useProjects.ts, useContentReviews.ts, etc.)
queryFn: async () => {
  if (!isSupabaseConfigured) return mockProjects
  const { data, error } = await supabase.from('projects').select('*')
  if (error) throw error
  return data as Project[]
}
```

This is a development convenience pattern, not a test mock. Mock data lives in `src/data/mock.ts` and exports typed instances of all entities: `mockProjects`, `mockTasks`, `mockMilestones`, `mockActionItems`, `mockNotes`, `mockBrainDumps`, `mockContentReviews`, `mockActivity`, `mockSocialPlatforms`, `mockSystemHealth`.

## Fixtures and Factories

**Test Data:**
- Not applicable (no tests).

**Mock data helpers in `src/data/mock.ts`:**
```typescript
// Date helpers used to generate relative timestamps in mock data
const now = new Date().toISOString()
const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString()
const daysAgo = (d: number) => new Date(Date.now() - d * 86400_000).toISOString()
const daysFromNow = (d: number) => new Date(Date.now() + d * 86400_000).toISOString()
```

## Coverage

**Requirements:** None enforced.

**View Coverage:**
```bash
# Not available
```

## Test Types

**Unit Tests:** Not present.

**Integration Tests:** Not present.

**E2E Tests:** Not present.

## Quality Gates (Current Substitute for Tests)

The only automated quality check is the TypeScript + Vite build:

```bash
npm run build    # Must pass with zero TypeScript errors
```

TypeScript is configured with strict mode in `tsconfig.app.json`:
- `strict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noFallthroughCasesInSwitch: true`
- `erasableSyntaxOnly: true`

ESLint runs via:
```bash
npm run lint     # ESLint flat config (eslint.config.js)
```

These build and lint checks are the only automated correctness guarantees in the project.

## Adding Tests (Guidance for Future Work)

If tests are introduced, the recommended approach given the existing stack:

**Framework to add:** Vitest (compatible with Vite, no separate config needed)
```bash
npm install -D vitest @testing-library/react @testing-library/user-event jsdom
```

**Config to add to `vite.config.ts`:**
```typescript
test: {
  environment: 'jsdom',
  globals: true,
  setupFiles: ['./src/test/setup.ts'],
}
```

**File location convention to follow:**
- Co-locate test files next to source: `src/hooks/useProjects.test.ts`
- Or group in `src/__tests__/` directory

**Highest-value test targets (given current code):**
- `src/lib/utils.ts` -- pure functions (`formatRelativeTime`, `getGreeting`, `formatDate`) are trivially testable
- `src/hooks/useBrainDump.ts` -- `parseBrainDumpWithClaude` fallback parser logic
- `src/hooks/useProjects.ts` -- mock data branch logic in `useActionItems` (filtering by projectId)
- `src/data/mock.ts` -- shape validation against TypeScript interfaces

**Mocking Supabase in tests:**
```typescript
// Mock the isSupabaseConfigured flag to force mock data path
vi.mock('@/lib/supabase', () => ({
  isSupabaseConfigured: false,
  supabase: null,
}))
```

---

*Testing analysis: 2026-03-22*
