# Codebase Concerns

**Analysis Date:** 2026-03-22

## Tech Debt

**Type Safety Gaps (Supabase Casting):**
- Issue: Multiple files use `// eslint-disable-next-line @typescript-eslint/no-explicit-any` with `(supabase as any)` casts to suppress TypeScript errors
- Files:
  - `src/hooks/useProjects.ts` (lines 141, 159)
  - `src/hooks/useContentReviews.ts` (line 35)
  - `src/hooks/useBrainDump.ts` (line 90)
- Impact: Type safety is lost on mutation operations; changes to Supabase client interface won't be caught at compile time
- Fix approach: Properly type the mutation parameters or use Supabase's generic update/insert types instead of casting to `any`. Consider generating types from Supabase schema.

**Missing Error Boundaries:**
- Issue: No error boundary component in `src/App.tsx`. If any component throws an uncaught error, the entire app will go blank
- Files: `src/App.tsx` (main App component)
- Impact: Runtime errors cause complete application failure with no user-facing error message
- Fix approach: Add React error boundary wrapper around `<AppRoutes />` that catches errors and displays a friendly fallback UI

**Incomplete API Error Handling:**
- Issue: Brain dump Claude API calls lack comprehensive error handling for edge cases (network failures, API timeouts, malformed responses)
- Files: `src/hooks/useBrainDump.ts` (lines 64-78)
- Impact: User may see cryptic error messages; parsing failures fall back to simple line-splitting with no context
- Fix approach: Add retry logic, better error messages distinguishing API vs parsing errors, and user-friendly feedback

## Known Bugs

**Data Fallback Ambiguity:**
- Symptoms: When `isSupabaseConfigured` is true but tables are empty (freshly deployed), users see empty states instead of mock data
- Files: All hooks in `src/hooks/` (useProjects.ts, useBrainDump.ts, useContentReviews.ts, useActivityLog.ts)
- Trigger: Database configured but unseeded; run app with Supabase keys set but no INSERT statements executed
- Workaround: Seed database immediately after deployment, or always display mock data for development/preview
- Root cause: Logic is `if (!isSupabaseConfigured) return mockData` — no graceful degradation when DB is configured but empty

**Claude API Direct Browser Access:**
- Symptoms: Brain dump feature works in development but will fail in production if `anthropic-dangerous-direct-browser-access: true` is removed
- Files: `src/hooks/useBrainDump.ts` (line 44)
- Trigger: Deploying to production without proper CORS handling or backend proxy
- Workaround: Implement backend API endpoint to proxy Claude API calls
- Impact: Security risk (API key exposed in browser); violates Anthropic's recommended architecture

## Security Considerations

**Exposed API Keys in Client Code:**
- Risk: Anthropic API key is fetched directly in browser via `import.meta.env.VITE_ANTHROPIC_API_KEY` and sent to Claude API with dangerous-direct-browser-access header
- Files: `src/hooks/useBrainDump.ts` (line 22), `src/lib/supabase.ts`
- Current mitigation: Environment variables loaded from `.env.local` (dev only)
- Recommendations:
  - Implement backend API endpoint for Claude integration
  - Use token-based auth instead of direct API keys in frontend
  - Add rate limiting on backend
  - Never expose API keys in production builds

**Supabase Anon Key Exposure:**
- Risk: Supabase anonymous key is embedded in client code and sent with every request
- Files: `src/lib/supabase.ts` (lines 4-5)
- Current mitigation: RLS policies defined in schema, but keys are still publicly visible
- Recommendations:
  - Enable RLS on all tables (verify in `supabase/schema.sql`)
  - Rotate anon keys regularly
  - Implement request signing/verification
  - Consider service-to-service authentication for sensitive operations

**Missing Input Validation:**
- Risk: Brain dump text and content feedback inputs are not validated before sending to Claude or database
- Files: `src/pages/BrainDump.tsx`, `src/pages/ContentPipeline.tsx`
- Current mitigation: None enforced
- Recommendations:
  - Add length limits (max 5000 chars for brain dumps, max 500 for feedback)
  - Sanitize content before display
  - Validate JSON responses from Claude before parsing

## Performance Bottlenecks

**Large Mock Data File:**
- Problem: `src/data/mock.ts` is 602 lines with hardcoded mock data for all tables
- Files: `src/data/mock.ts`
- Cause: All mock data imported at module load time; not tree-shakeable
- Improvement path:
  - Split mock data by feature (mockProjects.ts, mockContent.ts, etc.)
  - Lazy-load mock data only in development
  - Consider importing from JSON file instead of TypeScript object

**No Request Caching Beyond React Query:**
- Problem: Every page load re-fetches all data; no persistent cache
- Files: All hooks in `src/hooks/`
- Cause: React Query cache only persists in-memory; clears on page refresh
- Improvement path:
  - Configure React Query persistence to localStorage
  - Use Supabase real-time subscriptions for automatic cache updates
  - Implement request deduplication for concurrent queries

**Inefficient Brain Dump Parsing:**
- Problem: Simple line-splitting fallback is crude (splits on `.!?\n` globally)
- Files: `src/hooks/useBrainDump.ts` (lines 26-27)
- Cause: No structured parsing when Claude API unavailable
- Improvement path:
  - Implement regex-based sentence detection
  - Parse known task patterns (due dates, priorities, assignees)
  - Batch multiple dumps if possible

**Page Chunk Sizes:**
- Problem: Largest page chunks noted at ~488 lines (ContentPipeline.tsx) and ~485 lines (ProjectDetail.tsx)
- Files: `src/pages/ContentPipeline.tsx`, `src/pages/ProjectDetail.tsx`
- Cause: Complex pages with multiple views/modals bundled together
- Improvement path:
  - Extract modal components to separate files
  - Lazy-load view modes (list/week/month/kanban views)
  - Move utility functions to dedicated modules

## Fragile Areas

**Mock/Real Data Toggle Without Runtime Validation:**
- Files: All hooks in `src/hooks/`, `src/lib/supabase.ts`
- Why fragile: Single `isSupabaseConfigured` boolean switches all data sources; no per-table override capability
- Safe modification:
  - Test with Supabase configured and empty tables
  - Test with Supabase unconfigured
  - Add logging to trace which data source is being used
- Test coverage: Unit tests missing for both mock and real data paths

**ContentPipeline View Modes Without Shared State:**
- Files: `src/pages/ContentPipeline.tsx`
- Why fragile: Four views (list/week/month/kanban) each have their own filtering/sorting logic; inconsistencies possible
- Safe modification:
  - Extract shared state management (filters, sorting) to custom hook
  - Create reusable view component with pluggable renderers
- Test coverage: No tests for view switching or data consistency across modes

**Task Drag-Drop Without Optimistic Updates:**
- Files: `src/pages/ProjectDetail.tsx` (Kanban column implementation)
- Why fragile: Drag-drop updates tasks but relies on query invalidation; UI won't update until mutation succeeds
- Safe modification:
  - Implement optimistic UI updates
  - Handle rollback on mutation failure
  - Add loading state during drag
- Test coverage: No tests for drag-drop failures or network errors

**Brain Dump Error Handling Chain:**
- Files: `src/pages/BrainDump.tsx`, `src/hooks/useBrainDump.ts`
- Why fragile: Error can occur at 3 stages (Claude API, JSON parsing, DB insert) with different failure modes
- Safe modification:
  - Log errors to separate error tracking (not implemented)
  - Show user which stage failed
  - Persist failed dumps for retry
- Test coverage: Only basic error UI is shown; no test for API failures

## Scaling Limits

**Activity Log Pagination:**
- Current capacity: Hardcoded limit of 100 entries (`src/hooks/useActivityLog.ts`, line 35)
- Limit: UI will only show 100 most recent entries; older data inaccessible
- Scaling path:
  - Implement cursor-based pagination
  - Add infinite scroll component
  - Create archive mechanism for old entries

**Brain Dump Storage Without Cleanup:**
- Current capacity: No automatic cleanup or archival of brain dumps
- Limit: Table will grow indefinitely; no deletion policy
- Scaling path:
  - Auto-delete processed dumps after 30 days
  - Add admin dashboard for manual cleanup
  - Implement soft-delete (status = 'archived') for recovery

**Content Pipeline Without Filtering:**
- Current capacity: All content reviews fetched at once
- Limit: Will become sluggish when managing 1000+ pieces of content
- Scaling path:
  - Add date range filtering
  - Implement platform-specific views
  - Add status filter optimization in database query

## Dependencies at Risk

**React Router v7:**
- Risk: Recent major version (v7.13) in ecosystem; fewer examples/answers online
- Impact: If bugs found, may need to patch or downgrade
- Migration plan: Have v6 as fallback; monitor release notes

**Framer Motion v12:**
- Risk: Heavy animation library; can cause performance issues on lower-end devices
- Impact: Page transitions and hover effects may stutter
- Migration plan: Could fall back to CSS transitions for basic animations

**Anthropic SDK v0.80 (High dependency):**
- Risk: Early versions may have breaking changes; SDK still evolving
- Impact: Brain dump feature will break if SDK API changes
- Migration plan: Pin version in package.json; implement backend proxy for stability

**Supabase JS v2.99 (High dependency):**
- Risk: Pre-1.0 status; API may change
- Impact: All data fetching will break
- Migration plan: Monitor Supabase changelog; test major version upgrades in staging

## Missing Critical Features

**Offline Support:**
- Problem: No offline-first architecture; app requires constant internet
- Blocks: Usability on poor connections; mobile users without data
- Priority: Medium
- Solution: Implement service worker + offline data storage

**Analytics & Monitoring:**
- Problem: No visibility into which features are used, performance metrics, or error rates
- Blocks: Can't optimize based on user behavior; debugging production issues is blind
- Priority: Medium
- Solution: Add error tracking (Sentry), analytics (Mixpanel), performance monitoring (Vercel Analytics)

**User Authentication:**
- Problem: No actual user login; anyone with URL can access console
- Blocks: Multi-user support, audit logs, permissions
- Priority: High
- Solution: Implement Supabase Auth or external provider (GitHub, Google)

**Webhook Integration Wiring:**
- Problem: n8n webhook URL and Slack webhook URL are in env vars but no code calls them
- Blocks: Automation features are non-functional
- Priority: High
- Solution: Implement dispatch handlers in ProjectDetail and ContentPipeline

## Test Coverage Gaps

**No Unit Tests:**
- Untested area: All business logic (hooks, utilities)
- Files: `src/hooks/`, `src/lib/utils.ts`
- Risk: Refactoring breaks functionality silently; regressions undetected
- Priority: High

**No Integration Tests:**
- Untested area: Data fetching with Supabase (real and mock paths)
- Files: All hooks
- Risk: Database schema changes break hooks; fallback logic not verified
- Priority: High

**No Component Tests:**
- Untested area: UI rendering, user interactions, form submissions
- Files: All pages and components
- Risk: Broken layouts, missing error states, inaccessible forms undetected
- Priority: Medium

**No E2E Tests:**
- Untested area: Full workflows (e.g., submit brain dump → parse → display results)
- Files: All pages
- Risk: Critical user flows broken until found in production
- Priority: Medium

**No Snapshot Tests:**
- Untested area: Modal dialogs, complex page layouts
- Files: `src/pages/ContentPipeline.tsx`, `src/pages/ProjectDetail.tsx`
- Risk: Visual regressions in complex components undetected
- Priority: Low

---

*Concerns audit: 2026-03-22*
