# External Integrations

**Analysis Date:** 2026-03-22

## APIs & External Services

**AI/LLM:**
- Anthropic Claude API - Parses freeform brain dump text into structured tasks
  - SDK: Not used; direct HTTP POST to `https://api.anthropic.com/v1/messages`
  - Model: `claude-sonnet-4-20250514`
  - Auth: `VITE_ANTHROPIC_API_KEY` (browser-exposed, marked as dangerous direct browser access)
  - Usage: `src/hooks/useBrainDump.ts` - `parseBrainDumpWithClaude()`
  - Fallback: Local text parsing when API key not configured

## Data Storage

**Databases:**
- Supabase PostgreSQL (remote)
  - Client: `@supabase/supabase-js` v2.99.3
  - Connection: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (public anon key)
  - Location: `src/lib/supabase.ts`
  - Graceful degradation: When not configured, falls back to mock data

**Supabase Tables:**
- `projects` - Project tracking with priority, status, phase, GitHub/Supabase/Cloudflare URLs
- `tasks` - Kanban tasks with status (todo/in_progress/done), priority, assignee
- `project_milestones` - Phase tracking with status and phase numbers
- `project_action_items` - Action items with urgency, status (open/resolved/snoozed)
- `project_notes` - Notes with tags
- `brain_dumps` - Raw text and Claude-parsed output
- `brain_dump_tasks` - Individual tasks extracted from brain dumps
- `content_reviews` - Content pipeline with status (draft/pending/approved/rejected/posted)
- `social_platforms` - Social media account tracking with follower counts
- `podcast_tracker` - Podcast episode tracking (outreach/scheduled/recorded/published)
- `activity_log` - Session activity with session type (claude_code/n8n/slack/cowork/system/manual)
- `system_health` - Service status monitoring (healthy/degraded/down)
- `settings` - Configuration key-value store
- `next_session_prompts` - Per-project session prompts

**File Storage:**
- Not detected - Only metadata/URLs stored, actual files stored elsewhere (GitHub, Cloudflare, local)

**Caching:**
- TanStack React Query - In-memory cache with 2-minute stale time (configurable)
- Refetch on window focus disabled
- DevTools: @tanstack/react-query-devtools available in dev

## Authentication & Identity

**Auth Provider:**
- Supabase (anonymous/public anon key)
  - Implementation: Public API key only - no user authentication layer
  - Risk: All data uses public anon key with RLS (Row Level Security) expected

**Access Control:**
- Relies on Supabase Row Level Security policies (not visible in client code)

## Monitoring & Observability

**Error Tracking:**
- None detected - Errors logged to console only

**Logs:**
- Browser console only
- Activity logs stored in `activity_log` table for audit trail

**System Health:**
- `system_health` table tracks service status
- Manual polling interval: 5 minutes (`refetchInterval: 1000 * 60 * 5` in `src/hooks/useSystemHealth.ts`)

## CI/CD & Deployment

**Hosting:**
- Not detected - Config agnostic to hosting platform
- Build output: `dist/` directory
- Suitable for: Cloudflare Pages, Vercel, Netlify, GitHub Pages, static hosting

**CI Pipeline:**
- Not configured in codebase

**Build Steps:**
```bash
npm run build  # Runs: tsc -b && vite build
```

## Environment Configuration

**Required env vars:**
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase public anon key
- `VITE_ANTHROPIC_API_KEY` - Anthropic API key (optional, brain dump falls back to local parsing)

**Secrets location:**
- `.env.local` (development only, in `.gitignore`)

**Configuration notes:**
- Vite uses `VITE_` prefix to make vars accessible in browser bundle
- `.env.local` is standard for local development secrets
- Production: Set env vars via hosting platform (Cloudflare, Vercel, etc.)

## Data Flow

**Brain Dump Processing:**
1. User submits raw text via `/brain-dump` page
2. `useSubmitBrainDump()` calls `parseBrainDumpWithClaude(text)`
3. Claude API parses text into structured `{summary, tasks[]}`
4. Insert parsed output to Supabase `brain_dumps` table
5. Invalidate `brain-dumps` query cache, trigger UI refresh

**Project Data Fetching:**
1. React Query fetches from Supabase tables
2. 2-minute stale time cache applied
3. Refetch on mount, manual invalidation on mutation
4. On Supabase error: throw error (no retry after 1 attempt)
5. If `!isSupabaseConfigured`: serve mock data instead

**Activity Tracking:**
1. User actions recorded to `activity_log` table
2. Session type: claude_code, n8n, slack, cowork, system, or manual
3. Queryable by project, session type, or search

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Supabase will trigger RLS policies on update/insert
- Content review status updates trigger mutations to `content_reviews` table
- Task status updates trigger mutations to `tasks` table
- Brain dump submission inserts to two tables: `brain_dumps` and implicitly triggers processing

**Query Invalidation Hooks:**
- Task update → invalidate `['tasks']` query key
- Note add → invalidate `['notes', projectId]`
- Content review → invalidate `['content-reviews']`
- Brain dump → invalidate `['brain-dumps']`

---

*Integration audit: 2026-03-22*
