# RESUME HERE -- Forge Console v2

## Current Status (March 21, 2026 -- end of day)

Phases 1-7 COMPLETE. All 7 pages fully built and functional. Build passes with zero errors. All 5 integrations configured in `.env.local`. Supabase schema deployed (14 tables + RLS). Repo pushed to https://github.com/lucasjameso/forge-console-v2.

**What works right now:** Run `npm run dev`, open http://localhost:5173. All pages render with mock data. Settings page shows all integrations connected. Supabase is live but tables are empty.

---

## Morning TODO (in order)

### 1. Seed Supabase with real data
The 14 tables exist but are empty. The app falls back to mock data when `isSupabaseConfigured` is true but tables return nothing -- so right now you see empty states on the live connection.

**Tasks:**
- [ ] Create `supabase/seed.sql` with INSERT statements for the 3 projects, tasks, milestones, action items, notes, content reviews, social platforms, activity log, system health, brain dumps, and next session prompts
- [ ] Run the seed SQL in Supabase dashboard SQL Editor
- [ ] Verify the Dashboard, Projects, and Content Pipeline all show real data from Supabase

### 2. Deploy to Cloudflare Pages
**Tasks:**
- [ ] Install wrangler if needed: `npm install -g wrangler`
- [ ] Authenticate: `wrangler login`
- [ ] Create the Pages project: `wrangler pages project create forge-console-v2`
- [ ] Build and deploy: `npm run build && wrangler pages deploy dist`
- [ ] Set env vars in Cloudflare Pages dashboard (Settings > Environment Variables) -- same values as `.env.local`
- [ ] Smoke test the live URL

### 3. Wire up n8n integration
The env vars are set but nothing calls n8n yet.

**Tasks:**
- [ ] Add a "Dispatch to n8n" button on ProjectDetail quick actions
- [ ] Create a `useN8n` hook that calls the n8n API to trigger workflows
- [ ] Test triggering a workflow from the console

### 4. Wire up Slack notifications
The webhook URL is set but nothing sends to Slack yet.

**Tasks:**
- [ ] On content approve/reject in ContentPipeline, POST to the Slack webhook
- [ ] Include post title, status, and feedback in the Slack message
- [ ] Test approve/reject flow sends to `#content-queue`

### 5. Polish + remaining items
- [ ] Fix: hooks currently return mock data when `isSupabaseConfigured` is false, but show empty when true and tables have no rows. Decide on behavior (always fall back to mock, or show empty states).
- [ ] Add error boundary to App.tsx so runtime errors show a friendly message instead of blank screen
- [ ] Consider adding a favicon that matches the coral "F" logo in the sidebar

---

## Quick Start

```bash
cd ~/Forge/Projects/forge-console-v2
npm run dev    # http://localhost:5173
npm run build  # verify zero errors
```

## Key Files

| File | Purpose |
|------|---------|
| `.env.local` | All 7 env vars (Supabase, Claude, n8n, CF, Slack) |
| `supabase/schema.sql` | 14 table definitions + RLS |
| `src/data/mock.ts` | Mock data (use as seed reference) |
| `src/lib/supabase.ts` | Supabase client (null when not configured) |
| `PROGRESS.md` | Full build log for all phases |
| `SETUP_CHECKLIST.md` | Integration config status (all done) |

## Rules (NEVER BREAK)
- NO em dashes anywhere (use "---" or rephrase)
- NO spinners (skeleton shimmer only)
- NO `any` in TypeScript (minimized, eslint-disable where needed)
- NO hardcoded colors (CSS variables only)
- Framer Motion for ALL animations
- React Query for ALL data fetching
- `npm run build` must pass after every change
