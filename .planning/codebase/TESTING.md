# Testing Patterns

**Analysis Date:** 2026-03-22

## Test Framework

**Status:** Testing infrastructure not yet implemented

**Runner:**
- Not detected - No Jest, Vitest, or other test runner configured
- No test configuration files present (`jest.config.*`, `vitest.config.*`)

**Assertion Library:**
- Not detected

**Run Commands:**
```bash
npm run lint              # Run ESLint only (available)
npm run build             # Compile TypeScript and build
npm run dev               # Start development server
npm run preview           # Preview production build
```

**Note:** No test script in `package.json`. Testing infrastructure is absent from this codebase.

## Test File Organization

**Location:**
- Not applicable - No test files exist in codebase
- Glob search for `*.test.*` and `*.spec.*` in `/src` directory returned no results
- Only test files found are in `node_modules` (external dependencies)

**Naming:**
- Not established

**Structure:**
- Not applicable

## Test Structure

Not applicable - No tests currently exist in codebase.

## Mocking

**Framework:**
- React Query provides mock/stale data strategy (no dedicated mocking library)
- Fallback mock data patterns used in hooks instead of test mocks

**Patterns:**

Mock data is managed through feature flags and fallback data structures:

```typescript
// Pattern from useBrainDump.ts
export function useBrainDumps() {
  return useQuery<BrainDump[]>({
    queryKey: ['brain-dumps'],
    queryFn: async () => {
      if (!isSupabaseConfigured) return mockBrainDumps  // Fallback to mock data
      const { data, error } = await supabase
        .from('brain_dumps')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      return data as BrainDump[]
    },
  })
}
```

Mock data is stored in `/src/data/mock.ts` with exports:
- `mockProjects: Project[]`
- `mockTasks: Record<string, Task[]>`
- `mockMilestones: Record<string, ProjectMilestone[]>`
- `mockActionItems: Record<string, ProjectActionItem[]>`
- `mockNotes: Record<string, ProjectNote[]>`
- `mockNextSessionPrompts: Record<string, NextSessionPrompt>`
- `mockContentReviews: ContentReview[]`
- `mockSocialPlatforms: SocialPlatform[]`
- `mockActivity: ActivityEntry[]`
- `mockSystemHealth: SystemHealth[]`
- `mockBrainDumps: BrainDump[]`

**What to Mock (Development):**
- All database queries when `isSupabaseConfigured` is false
- Entire hook responses fall back to static mock data
- No dynamic mock generation or factories

**What NOT to Mock:**
- React components render with actual mock data instead of mocks
- Browser APIs (handled natively)
- Network calls that can fall back to mock data instead

## Fixtures and Factories

**Test Data:**
Mock data structures are predefined in `/src/data/mock.ts`:

```typescript
export const mockProjects: Project[] = [
  {
    id: 'proj-001',
    name: 'Ridgeline',
    slug: 'ridgeline',
    description: '...',
    status: 'active',
    priority: 'high',
    // ... additional fields
  },
  // more projects
]
```

**Location:**
- `/src/data/mock.ts` - Contains all mock data exports
- Mock data is imported directly in hooks where needed (e.g., `import { mockProjects } from '@/data/mock'`)
- No factory functions or dynamic fixture generation

## Coverage

**Requirements:**
- Not enforced - No coverage configuration present
- No coverage targets specified in `package.json` or configuration files

**View Coverage:**
- Not applicable - No testing framework configured

## Test Types

**Unit Tests:**
- Not implemented
- Would typically test utility functions, hooks, and component logic in isolation

**Integration Tests:**
- Not implemented
- React components are rendered against mock data (de facto integration testing through mock fallback)

**E2E Tests:**
- Not implemented
- Would be candidates for: navigation flows, form submissions, data mutations

## Common Patterns

Not applicable - No tests exist to demonstrate patterns.

### Recommended Patterns for Future Testing

**Async Testing (when implemented):**
```typescript
// Expected pattern based on existing async code:
describe('useProjects', () => {
  it('should fetch projects when Supabase is configured', async () => {
    // Would test the async queryFn
  })

  it('should return mock data when Supabase is not configured', async () => {
    // Test the fallback behavior
  })
})
```

**Error Testing (when implemented):**
```typescript
// Expected pattern based on existing error handling:
describe('useProjects', () => {
  it('should throw error when Supabase query fails', async () => {
    // Test the: if (error) throw error pattern
  })

  it('should handle specific error codes', async () => {
    // Test pattern from useProjects.ts line 129:
    // if (error && error.code !== 'PGRST116') throw error
  })
})
```

## Development vs. Production Data

**Configuration:**
- Environment variables for Supabase configuration: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Environment variables for Claude API: `VITE_ANTHROPIC_API_KEY`
- Configuration checked in `/src/lib/supabase.ts`: `const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)`

**Fallback Pattern:**
When development environment lacks real service credentials, all hooks automatically serve mock data:
```typescript
// Universal pattern across all data hooks
if (!isSupabaseConfigured) return mockData
// else: query real Supabase
```

This allows development and testing without requiring credentials to be configured.

---

*Testing analysis: 2026-03-22*

**Note:** Testing infrastructure is not yet established in this project. No test files, test configuration, or testing framework exists. The codebase relies on a mock data fallback pattern for development work rather than formal unit/integration tests. Adding test infrastructure would be a recommended improvement for quality assurance.
