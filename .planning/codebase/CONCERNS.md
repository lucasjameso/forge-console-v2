# Codebase Concerns

**Analysis Date:** 2026-03-22

## Tech Debt

**Supabase client cast as `null` with forced typing:**
- Issue: When Supabase is not configured, `supabase` is set to `null as unknown as SupabaseClient<Database>`, bypassing type safety entirely. Any code path that forgets to check `isSupabaseConfigured` before calling `supabase` will throw a runtime null-dereference at the network layer with no compile-time warning.
- Files: `src/lib/supabase.ts` (line 11)
- Impact: Silent runtime crash if `isSupabaseConfigured` check is accidentally omitted in a new hook. Error message will be cryptic (cannot read property 'from' of null).
- Fix approach: Use a proper guard pattern — either throw a descriptive error in a proxy, or export a typed `supabase | null` and force call sites to handle null explicitly.

**Mutations use `supabase as any` to bypass type system:**
- Issue: Three mutation functions cast the Supabase client to `any` to avoid TypeScript's insert/update type checking. This defeats the purpose of the typed `SupabaseClient<Database>` setup.
- Files: `src/hooks/useBrainDump.ts` (line 91), `src/hooks/useProjects.ts` (lines 142, 164), `src/hooks/useContentReviews.ts` (line 36)
- Impact: Typos in column names, wrong data shapes, and missing required fields silently pass TypeScript compilation and only fail at runtime with Supabase errors.
- Fix approach: Add `brain_dumps`, `tasks`, `project_notes`, and `content_reviews` insert/update types to the `Database` interface in `src/types/database.ts` and remove the `as any` casts.

**`page_feedback` table missing from the `Database` type:**
- Issue: The `page_feedback` Supabase table exists in production (used by `usePageFeedback`) but is absent from `src/types/database.ts`. The hook uses a runtime cast (`supabase.from('page_feedback') as ReturnType<typeof supabase.from>`) to bypass the type system entirely, and inserts use `as never`.
- Files: `src/hooks/usePageFeedback.ts` (lines 22, 39), `src/types/database.ts`
- Impact: No type safety on feedback queries or inserts. Schema drift between code and database will not be caught by TypeScript.
- Fix approach: Add `page_feedback` table definition to `src/types/database.ts` with `PageFeedback` as the row type. The `PageFeedback` interface is already defined in the hook file and can be moved to `database.ts`.

**Settings value typed as `unknown`:**
- Issue: `Setting.value` in `src/types/database.ts` (line 253) is typed as `unknown`. Every consumer will require a cast or type guard before using the value.
- Files: `src/types/database.ts` (line 253)
- Impact: Callers cannot use settings values without unsafe casts. No hook currently uses the `settings` table, so this is currently dormant but will matter when settings are wired up.
- Fix approach: Use `Record<string, unknown>` or a discriminated union based on key, or at minimum `JsonValue` to convey intent.

**Brain dump tasks written to Supabase but never read back:**
- Issue: The `brain_dump_tasks` table exists in both the schema (`supabase/schema.sql`) and `database.ts`, but there is no hook (`useBrainDumpTasks`) and no UI that reads from it. The brain dump flow writes to `brain_dumps` with a `parsed_output` JSONB blob, but individual tasks are never promoted to the `brain_dump_tasks` table or to the real `tasks` table.
- Files: `src/hooks/useBrainDump.ts`, `supabase/schema.sql` (lines 83-92), `src/types/database.ts` (lines 173-182)
- Impact: Brain dump parsing produces structured tasks visible in the UI immediately after submission, but these tasks are never written anywhere actionable. The `brain_dump_tasks` table and `BrainDumpTask` type are dead code.
- Fix approach: Either write parsed tasks to `brain_dump_tasks` after saving the dump, or remove the table and type if it will never be used, or add a "promote to task" action in the UI.

**`useDashboardStats` is not a real stat hook:**
- Issue: `src/hooks/useDashboardStats.ts` is named like a data hook but only derives a recency map from `useActivityLog()`. It returns no stats from Supabase. `StatTilesRow` on the dashboard likely computes stats inline from project/task data rather than using this hook.
- Files: `src/hooks/useDashboardStats.ts`, `src/components/dashboard/StatTilesRow.tsx`
- Impact: Misleadingly named file. Real dashboard stats (task counts, content metrics) must be recomputed in each component rather than centralized.
- Fix approach: Rename to `useProjectRecency` to match what it actually does, or expand it to be a true stats aggregator.

**Inline `<style>` blocks for responsive grids:**
- Issue: `src/pages/SocialMedia.tsx` (lines 242-245) and `src/pages/Settings.tsx` (lines 368-371) inject `<style>` tags at render time to define `.social-grid` and `.settings-grid` CSS classes. This bypasses Tailwind and creates global side effects.
- Files: `src/pages/SocialMedia.tsx` (line 242), `src/pages/Settings.tsx` (line 368)
- Impact: Class names are global and could collide. The pattern circumvents Tailwind's utility approach. Both `<style>` blocks are effectively duplicates of each other.
- Fix approach: Replace with Tailwind responsive grid utilities (`grid-cols-1 md:grid-cols-2`) or a shared responsive grid wrapper component.

**Mixed inline styles and Tailwind classes throughout all pages:**
- Issue: Every page and most components mix Tailwind utility classes with `style={{ }}` inline objects for spacing, colors, and layout. There is no clear rule for when to use one vs. the other. Some colors use `hsl(var(--accent-coral))` inline while others use Tailwind `text-coral` or `bg-coral`.
- Files: All `src/pages/*.tsx`, `src/components/dashboard/*.tsx`, `src/components/pipeline/ContentCard.tsx`
- Impact: Inconsistent codebase makes refactoring colors or spacing difficult. Inline styles cannot be purged, overridden by Tailwind's responsive prefixes, or themed.
- Fix approach: Establish a rule (CSS variables via Tailwind theme tokens only) and migrate inline style color/spacing to Tailwind classes where possible.

## Known Bugs

**`ContentPipeline` month view ignores items with unrecognized `day_label`:**
- Symptoms: If a `ContentReview` record has a `day_label` not in the hardcoded `dayMap` (e.g., an abbreviated name like "Mon" instead of "Monday"), the item silently disappears from the month grid.
- Files: `src/pages/ContentPipeline.tsx` (lines 288-291, 316)
- Trigger: Any content record seeded with a non-full-name day label.
- Workaround: Use list or week view instead.

**Kanban drag-and-drop has no optimistic update:**
- Symptoms: After dragging a task to a new column, the card stays in its original position until the Supabase mutation completes and `invalidateQueries` triggers a refetch. On slow connections this creates a noticeable snap-back effect.
- Files: `src/pages/ProjectDetail.tsx` (line 169), `src/hooks/useProjects.ts` (lines 136-156)
- Trigger: Drag task on the project detail page with Supabase connected.
- Workaround: None currently.

**`useProject` returns `data as Project` when Supabase `.single()` returns `null`:**
- Symptoms: When a project is not found and `error.code === 'PGRST116'` (no rows found), the current code throws the error unconditionally (`if (error) throw error`). The `not found` case for project detail relies entirely on whether Supabase returns PGRST116 vs. the query returning no data.
- Files: `src/hooks/useProjects.ts` (lines 36-44)
- Trigger: Navigate to `/projects/unknown-slug` with Supabase connected.
- Workaround: The `useProject` hook for detail page does handle `!project` with a "not found" render, but only after the error is thrown — which means React Query shows `isError` state, not the custom not-found card.

**Activity log search fires a new Supabase query on every keystroke:**
- Symptoms: The search input in `src/pages/ActivityLog.tsx` feeds directly into `useActivityLog({ search })`. Each character typed creates a new query key `['activity-log', { search: "..." }]` and triggers a debounce-free Supabase `ilike` request.
- Files: `src/pages/ActivityLog.tsx` (lines 38-42), `src/hooks/useActivityLog.ts` (lines 43-44)
- Trigger: Type quickly in the activity log search box.
- Workaround: None. Supabase rate limits will suppress errors, but UX is degraded.

## Security Considerations

**Anthropic API key exposed in browser bundle:**
- Risk: `VITE_ANTHROPIC_API_KEY` is a `VITE_` prefixed environment variable, meaning it is compiled into the JavaScript bundle and visible to anyone who opens DevTools or inspects the built `dist/` files. The Claude API call is made directly from the browser (`useBrainDump.ts` line 39) with the raw key in the `x-api-key` header.
- Files: `src/hooks/useBrainDump.ts` (lines 22-44)
- Current mitigation: The `AccessGate` component (`src/components/AccessGate.tsx`) provides a numeric access code check, but this only prevents casual UI access, not direct API requests.
- Recommendations: Move the Claude API call to a Cloudflare Worker or Pages Function that holds the key server-side. The browser calls the worker, the worker calls Anthropic. Alternatively, use the Supabase Edge Functions approach. Do not ship `VITE_ANTHROPIC_API_KEY` in production.

**RLS policies grant full anonymous access to all tables:**
- Risk: All 14 tables have `"Allow anon all" ... using (true) with check (true)` policies, meaning any person with the Supabase anon key (which is also in the client bundle as `VITE_SUPABASE_ANON_KEY`) can read, write, update, and delete all data with no restrictions.
- Files: `supabase/schema.sql` (lines 199-212)
- Current mitigation: The `AccessGate` component provides a UI-level check. The Supabase anon key is non-secret by design (it is meant to be in client code), but the open RLS policies mean anyone who discovers the Supabase project URL can manipulate all data directly.
- Recommendations: For production deployment, add Supabase Auth (even anonymous sessions with a service-role for writes) or tighten RLS policies to require specific JWT claims. At minimum, restrict DELETE and UPDATE to authenticated sessions.

**Access code stored in `sessionStorage` with no expiry:**
- Risk: `forge_authenticated = 'true'` is written to `sessionStorage` on successful login and read back on every render. `sessionStorage` persists across page refreshes within the same tab but does not expire. Any XSS vulnerability could read or set this flag.
- Files: `src/components/AccessGate.tsx` (lines 7-12, 29-31)
- Current mitigation: `sessionStorage` is tab-scoped. No XSS vectors observed in the current codebase.
- Recommendations: This is acceptable for a single-user local tool but consider a time-based expiry if deploying publicly.

**`VITE_N8N_API_KEY` and `VITE_SLACK_WEBHOOK_URL` in browser bundle:**
- Risk: Both keys are referenced in `src/pages/Settings.tsx` via `import.meta.env` to render connection status. They are compiled into the bundle even though neither is currently used for actual API calls. If n8n or Slack integration is wired up later using these keys directly from the browser, credentials will be exposed.
- Files: `src/pages/Settings.tsx` (lines 49-52, 69-71)
- Current mitigation: Keys are only checked for truthiness to show "Connected" badge. No actual API calls made.
- Recommendations: Before implementing n8n or Slack integrations, route those calls through a Cloudflare Worker. Remove `VITE_N8N_API_KEY` from frontend config; use it only server-side.

## Performance Bottlenecks

**`useSystemHealth` fetches all rows and deduplicates in-memory:**
- Problem: The hook selects `*` from `system_health` ordered by `checked_at desc`, then iterates all rows in JavaScript to find the latest record per service. As the health check table grows (frequent n8n writes), this query returns an unbounded number of rows.
- Files: `src/hooks/useSystemHealth.ts` (lines 12-27)
- Cause: No database-level deduplication. The correct approach is a `DISTINCT ON (service)` query or a database view.
- Improvement path: Replace with `supabase.from('system_health').select('*').order('service').order('checked_at', { ascending: false })` combined with a Postgres `DISTINCT ON (service)` via RPC, or add a materialized view. Add a limit of 50 rows as a short-term guard.

**Activity log loaded with a hard limit of 100, no pagination:**
- Problem: `useActivityLog` fetches up to 100 rows on every filter change (including search). There is no pagination, infinite scroll, or cursor. As activity accumulates, the initial page load will always transfer 100 rows even when filters narrow it to a few results.
- Files: `src/hooks/useActivityLog.ts` (line 35)
- Cause: Single `.limit(100)` call with no offset mechanism.
- Improvement path: Add cursor-based pagination using React Query's `useInfiniteQuery`, or add a `page` parameter and Supabase `.range(offset, offset + 20)`.

**`useActivityLog` creates a new query key for every unique filter object:**
- Problem: The query key is `['activity-log', filters]` where `filters` is a plain object. React Query uses deep equality for keys, but a new object reference is created on every render of `ActivityLog.tsx` and `Dashboard.tsx` (via `useProjectLastActivity`). This means the cache is never reused between renders; every navigation away and back triggers a fresh fetch.
- Files: `src/hooks/useActivityLog.ts` (line 14), `src/hooks/useDashboardStats.ts` (line 13), `src/pages/ActivityLog.tsx` (lines 38-42)
- Cause: Object reference instability in query keys. React Query does deep-compare keys for cache hits but the object is recreated on every render.
- Improvement path: Serialize the filter to a stable primitive: `['activity-log', filters?.project ?? null, filters?.sessionType ?? null, filters?.search ?? null]`.

## Fragile Areas

**`ProjectDetail` fires 7 parallel queries before showing any content:**
- Files: `src/pages/ProjectDetail.tsx` (lines 128-134)
- Why fragile: Every section of the project detail page (action items, tasks, milestones, notes, session prompt, activity) has its own independent query. If any query has an error, it silently shows an empty section with no error state. The `projectId` defaults to `''` (empty string) while the project is loading, meaning all sub-queries fire with `projectId = ''` immediately on mount, receive empty results, and then re-fire once the real ID is available. This causes a double-fetch waterfall on every page load.
- Safe modification: Gate sub-queries on `enabled: Boolean(projectId)` in each `useQuery` call to eliminate the empty-string requests.
- Test coverage: None.

**`BrainDump` parsed result displayed via mutation state, not persisted state:**
- Files: `src/pages/BrainDump.tsx` (lines 25, 74-129)
- Why fragile: The `lastResult` shown after submission is `submitMutation.data` — it lives only in mutation state. If the user navigates away and returns, or if the mutation is reset, the "Parsed Result" card disappears. The result exists in Supabase, but the history list renders the `raw_text` expanded view rather than re-displaying the parsed result prominently.
- Safe modification: The history list's expanded view already shows `parsed_output`, so the experience is not lost, but the "New" badge and prominent display pattern suggests the user expects persistence.
- Test coverage: None.

**`AccessGate` access code comparison uses `===` on plain string with no rate limiting:**
- Files: `src/components/AccessGate.tsx` (line 28)
- Why fragile: The 6-digit code check has no attempt counter, no lockout, and no delay. An automated script can enumerate all 1,000,000 6-digit codes in seconds since the check runs purely in JavaScript. The `shaking` animation adds only a 600ms visual delay, not a functional one.
- Safe modification: Add a failed-attempt counter in component state. After 5 failures, disable the form for 30 seconds before re-enabling.
- Test coverage: None.

**`ContentDetail` modal closes immediately on approve without waiting for mutation:**
- Files: `src/pages/ContentPipeline.tsx` (lines 66-69)
- Why fragile: `handleApprove` calls `updateStatus.mutate(...)` and then immediately calls `onClose()`. If the mutation fails, the modal is already gone and the user sees only a toast error with no way to retry from context. The rejected item reverts visually (React Query refetches), but the UX is disorienting.
- Safe modification: Move `onClose()` to the `onSuccess` callback of the mutation, similar to how `handleReject` is structured (though `handleReject` has the same issue).
- Test coverage: None.

**`MonthView` hardcodes `day_label` mapping using full English day names:**
- Files: `src/pages/ContentPipeline.tsx` (lines 288-291)
- Why fragile: The `dayMap` object maps `Monday`, `Tuesday`, etc. to column indices. If any `ContentReview` record in Supabase uses an abbreviated or localized day name, the item will be silently omitted from the month grid with no error or warning. The `day_label` column has no database constraint enforcing allowed values.
- Safe modification: Add a database check constraint on `content_reviews.day_label` matching the exact allowed values, and add a fallback in the UI for unrecognized labels.
- Test coverage: None.

## Scaling Limits

**Supabase `system_health` table grows unbounded:**
- Current capacity: Unknown (no row limit or TTL set).
- Limit: `useSystemHealth` fetches all rows for client-side deduplication. Once the table exceeds a few thousand rows, the query will become noticeably slow.
- Scaling path: Add a Postgres trigger or scheduled n8n job to delete `system_health` rows older than 7 days. Alternatively, add a `.limit(50)` guard immediately.

**Brain dump history has no pagination:**
- Current capacity: All brain dump records are fetched in a single query via `useBrainDumps`.
- Limit: Will degrade once there are hundreds of entries.
- Scaling path: Add `.limit(20)` with a "load more" button, or use `useInfiniteQuery`.

## Dependencies at Risk

**`@anthropic-ai/sdk` installed but not used:**
- Risk: The Anthropic SDK package (`@anthropic-ai/sdk 0.80.0`) is installed as a dependency but the actual Claude API call in `useBrainDump.ts` uses a raw `fetch()` to the Anthropic REST endpoint, not the SDK. The SDK adds bundle weight (and a direct browser import would require the dangerous-direct-browser-access workaround anyway).
- Impact: Unnecessary bundle weight. If the SDK is never used, it is confusing dead code. If it is intended for future use, it needs a server-side context.
- Migration plan: Either remove the package and keep the raw fetch approach, or migrate to the SDK in a Cloudflare Worker context.

**React version mismatch in package.json:**
- Risk: `package.json` lists `react 19.2.4` and `react-dom 19.2.4`, but the `CLAUDE.md` describes the stack as "React 18". React 19 introduced breaking changes (notably the new concurrent rendering model and changed behavior for `useEffect` in StrictMode). Some Radix UI primitives may not yet be fully compatible with React 19.
- Impact: Potential subtle rendering bugs in Radix components. `AnimatePresence` from Framer Motion may exhibit changed behavior under React 19's stricter effect rules.
- Migration plan: Verify all Radix UI packages are React 19 compatible. Update `CLAUDE.md` to reflect actual React version in use.

## Missing Critical Features

**No error boundary around individual dashboard cards:**
- Problem: The single `<ErrorBoundary>` in `src/App.tsx` wraps the entire application. If any card component throws during render (e.g., unexpected null in `parsed_output`), the entire app is replaced with the `PageErrorFallback` component.
- Blocks: Graceful degradation when individual data sources fail.
- Files: `src/App.tsx` (line 61), `src/components/ui/PageErrorFallback.tsx`

**No debounce on activity log search:**
- Problem: Every keystroke in the search input triggers an `ilike` query to Supabase with no debounce. This is both a performance concern and a UX issue (results flicker on each character).
- Blocks: Usable search experience with live Supabase data.
- Files: `src/pages/ActivityLog.tsx` (line 57), `src/hooks/useActivityLog.ts` (line 43)

**No way to delete brain dumps, tasks, notes, or action items from the UI:**
- Problem: All write operations in the current UI are insert-only. There are no delete mutations in any hook. The user cannot remove a brain dump entry, clear a task, delete a note, or dismiss an action item through the interface.
- Blocks: Data hygiene, correcting mistakes.
- Files: All mutation hooks in `src/hooks/`

**`podcast_tracker` table and `PodcastEntry` type exist with no page or hook:**
- Problem: The `podcast_tracker` database table is defined in `supabase/schema.sql` and `PodcastEntry` is typed in `database.ts`, but there is no page, hook, or navigation entry for it. It is completely dead infrastructure.
- Blocks: Podcast tracking feature.
- Files: `src/types/database.ts` (lines 219-230), `supabase/schema.sql` (lines 132-143)

## Test Coverage Gaps

**Zero automated tests across the entire codebase:**
- What is not tested: All hooks, all components, all utility functions, all data transformations, the Claude API fallback parser, the access gate logic.
- Files: All files in `src/`
- Risk: Any refactor or new feature can silently break existing behavior. The brain dump parser, kanban drag-and-drop, activity log filtering, and content status state machine are particularly high-risk areas with no regression protection.
- Priority: High for hooks (data fetching logic) and medium for components (visual regressions).

---

*Concerns audit: 2026-03-22*
