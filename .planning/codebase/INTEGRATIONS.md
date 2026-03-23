# External Integrations

**Analysis Date:** 2026-03-22

## APIs & External Services

**AI / LLM:**
- Anthropic Claude API - Brain dump parsing and structured task extraction
  - SDK: `@anthropic-ai/sdk` 0.80.0 installed but NOT used via SDK; calls made via raw `fetch()` to avoid server-side SDK requirement in browser
  - Endpoint: `https://api.anthropic.com/v1/messages` (direct browser fetch)
  - Model: `claude-sonnet-4-20250514`
  - Auth: `VITE_ANTHROPIC_API_KEY` env var; header `x-api-key`
  - Special header: `anthropic-dangerous-direct-browser-access: true` (browser CORS override)
  - Implementation: `src/hooks/useBrainDump.ts` (`parseBrainDumpWithClaude()`)
  - Fallback: If `VITE_ANTHROPIC_API_KEY` absent, local sentence-splitting parser runs instead

**Workflow Automation:**
- n8n - Workflow automation and task dispatching
  - Instance URL: `https://n8n.iac-solutions.io` (self-hosted)
  - Auth: `VITE_N8N_URL` + `VITE_N8N_API_KEY`
  - Status: Configured as integration in `src/pages/Settings.tsx` but no active API calls detected in source; connection status display only

**Notifications:**
- Slack - Notifications and content approval flow
  - Auth: `VITE_SLACK_WEBHOOK_URL` (incoming webhook)
  - Status: Configured as integration in `src/pages/Settings.tsx`; connection status display only; no active webhook calls detected in source
  - Schema: `content_reviews` table has `slack_ts` and `slack_channel` columns for Slack message tracking

## Data Storage

**Databases:**
- Supabase (PostgreSQL) - Primary database for all app data
  - Connection: `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
  - Client: `@supabase/supabase-js` 2.99.3 with `SupabaseClient<Database>` typed interface
  - Initialization: `src/lib/supabase.ts`
  - Schema: `supabase/schema.sql` - 13 tables
  - Seed data: `supabase/seed.sql`
  - RLS: Enabled on all tables; anon-all policies (single user, no auth)
  - Tables:
    - `projects` - Active builds with status, priority, progress tracking
    - `tasks` - Kanban tasks linked to projects
    - `project_notes` - Freeform notes per project
    - `project_milestones` - Phase milestones with target dates
    - `project_action_items` - Urgent action items per project
    - `brain_dumps` - Raw + parsed AI output for brain dumps
    - `brain_dump_tasks` - Extracted tasks from brain dumps
    - `content_reviews` - LinkedIn content pipeline with approval workflow
    - `social_platforms` - Social media platform metadata and follower counts
    - `podcast_tracker` - Podcast outreach and recording pipeline
    - `activity_log` - Session activity from claude_code, n8n, slack, cowork, system, manual sources
    - `system_health` - Service health status checks
    - `settings` - Key/value app settings store
    - `next_session_prompts` - Per-project resume prompts (not yet in TypeScript Database type)
    - `page_feedback` - In-app feedback (not yet in TypeScript Database type; accessed with cast in `src/hooks/usePageFeedback.ts`)

**File Storage:**
- Local filesystem only (no cloud file storage integration)

**Caching:**
- TanStack React Query in-memory cache only
  - Stale time: 2 minutes (global default in `src/lib/queryClient.ts`)
  - System health: 1 minute stale, 5 minute refetch interval (`src/hooks/useSystemHealth.ts`)
  - No persistent cache (no localStorage/IndexedDB layer)

## Authentication & Identity

**Access Gate:**
- Custom single-code access gate: `src/components/AccessGate.tsx`
- Auth: `VITE_ACCESS_CODE` env var (6-digit numeric code)
- Session: `sessionStorage.setItem('forge_authenticated', 'true')` persists within tab session
- Behavior: If `VITE_ACCESS_CODE` is not set, gate is bypassed entirely (local dev)
- Not a multi-user auth system; single owner access only

**Supabase Auth:**
- Not wired up; Supabase client initialized with anon key only
- RLS policies grant full anon access to all tables

## Monitoring & Observability

**Error Tracking:**
- `react-error-boundary` 6.1.1 - `<ErrorBoundary>` with `PageErrorFallback` component wraps entire app
- No external error tracking service (no Sentry, Datadog, etc.)

**System Health:**
- Internal `system_health` Supabase table tracks service status
- `src/hooks/useSystemHealth.ts` polls every 5 minutes
- Displayed in `src/components/dashboard/SystemHealthCard.tsx`

**Logs:**
- `activity_log` Supabase table captures session activity
- Session types: `claude_code`, `n8n`, `slack`, `cowork`, `system`, `manual`
- No external logging service

**Dev Tools:**
- `@tanstack/react-query-devtools` 5.94.5 - Query state debugging in browser

## CI/CD & Deployment

**Hosting:**
- Cloudflare Pages - Static hosting for production
  - Account config: `VITE_CF_ACCOUNT_ID` env var
  - Deployment: Wrangler CLI (referenced in project docs; no `wrangler.toml` detected in root)
  - Output: `dist/` directory from `npm run build`

**CI Pipeline:**
- None detected (no `.github/workflows/`, no CircleCI, no Netlify CI config)

## Environment Configuration

**Required env vars (app non-functional without these):**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous API key

**Optional env vars (features degrade gracefully):**
- `VITE_ANTHROPIC_API_KEY` - Claude API key; brain dump uses local fallback parser if absent
- `VITE_ACCESS_CODE` - 6-digit access gate code; gate skipped if absent (local dev)
- `VITE_CF_ACCOUNT_ID` - Cloudflare account ID; display-only in Settings
- `VITE_SLACK_WEBHOOK_URL` - Slack incoming webhook; display-only in Settings
- `VITE_N8N_URL` - n8n instance URL; display-only in Settings
- `VITE_N8N_API_KEY` - n8n API key; display-only in Settings

**Secrets location:**
- `.env.local` (present, not committed to git)

## Webhooks & Callbacks

**Incoming:**
- None (static SPA; no server to receive webhooks)

**Outgoing:**
- Anthropic API: `POST https://api.anthropic.com/v1/messages` - triggered on brain dump submit
- Supabase: REST and realtime WebSocket connections via SDK
- Slack webhook: Configured (`VITE_SLACK_WEBHOOK_URL`) but no active outgoing calls in source yet
- n8n: Configured (`VITE_N8N_URL`) but no active API calls in source yet

---

*Integration audit: 2026-03-22*
