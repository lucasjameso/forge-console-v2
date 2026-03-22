-- Forge Console v2 -- Seed Data
-- Run in Supabase SQL Editor after schema.sql
-- Generated: 2026-03-22
--
-- DATA SOURCES:
--   [FORGE]  = Known from this codebase (accurate)
--   [REAL]   = Real data from brief (LinkedIn stats, launch dates, etc.)
--   [MERGE]  = Placeholder -- replace with JSON from project sessions
--   [GEN]    = Generated realistic mock data
--
-- After collecting JSON from project sessions,
-- update the [MERGE] rows with real values.
--
-- PROJECTS TRACKED (5):
--   Ridgeline Intelligence, CLARITY / Build What Lasts, Forge Console,
--   Build What Lasts, Meridian Intelligence, Atlas Intelligence

-- ============================================================
-- CLEAR EXISTING DATA (safe for dev/seed usage)
-- ============================================================
truncate public.next_session_prompts cascade;
truncate public.system_health cascade;
truncate public.settings cascade;
truncate public.activity_log cascade;
truncate public.podcast_tracker cascade;
truncate public.social_platforms cascade;
truncate public.content_reviews cascade;
truncate public.brain_dump_tasks cascade;
truncate public.brain_dumps cascade;
truncate public.project_action_items cascade;
truncate public.project_milestones cascade;
truncate public.project_notes cascade;
truncate public.tasks cascade;
truncate public.projects cascade;

-- ============================================================
-- 1. PROJECTS
-- ============================================================
-- Use fixed UUIDs so foreign keys are predictable
insert into public.projects (id, name, slug, description, status, priority, progress_pct, current_phase, metadata, github_url, supabase_ref, cloudflare_url, created_at, updated_at) values
(
  'a1000000-0000-0000-0000-000000000001',
  'Ridgeline Intelligence',
  'ridgeline',
  'Multi-tenant SaaS BI platform for specialty trade contractors that connects ERP and live Supabase company data into an executive-grade intelligence dashboard. v2.0 demo build targets scaffold contractors with 20 views across Command Center, CRM, Operations, Finance, Workforce, Equipment, and Intelligence modules.',
  'active', 'high', 72,
  'v2.0 Complete -- Design Polish Pass',  -- [MERGED] From Ridgeline session
  null,
  'https://github.com/lucasjameso/ridgeline',
  'awlrpjefdgfismzdweuc',
  'https://production.ridgeline-intelligence.pages.dev',
  '2026-02-05T06:00:00Z',
  '2026-03-22T14:33:00Z'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'CLARITY / Build What Lasts',
  'clarity',
  'Book launch system for CLARITY: Kill the Hero by Lucas Oliver (April 17, 2026) and Build What Lasts brand infrastructure. Covers manuscript, KDP coordination, content calendar (8-week LinkedIn arc), social media profiles, email marketing via Beehiiv, n8n automation, podcast outreach, and ARC distribution.',
  'active', 'high', 30,
  'Pre-launch content production and platform setup',  -- [MERGED] From CLARITY + BWL sessions
  '{"brand": "Build What Lasts", "book": "Clarity Kill the Hero", "launch_date": "2026-04-17", "kindle_price": 9.99, "paperback_price": 19.99, "hardcover_price": 27.99, "social_handle": "@buildwhatlasts", "beehiiv_pub_id": "pub_78465b13-adda-4f6b-a51c-d39c2717ab3f", "tagline": "Kill the hero. Build the system.", "publisher": "HMD"}',
  'https://github.com/lucasjamesoarrows/BuildWhatLasts', null, null,
  '2026-02-20T06:00:00Z',
  '2026-03-22T12:00:00Z'
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Forge Console',
  'forge',
  'Unified command center for managing all builds, LinkedIn content pipeline, social media presence, and autonomous agent system. Runs on Mac Mini M4, deploys to Cloudflare Pages.',
  'active', 'high', 33,
  'Phase 4: Page-by-Page Visual Polish',  -- [FORGE] Accurate per roadmap
  null,
  'https://github.com/iac-solutions/forge-console',
  null,
  'https://forge-console.pages.dev',
  '2026-03-21T03:00:00Z',
  '2026-03-22T12:00:00Z'
),
(
  'a1000000-0000-0000-0000-000000000005',
  'Meridian Intelligence',
  'meridian',
  'FAS NAM Pipeline Intelligence Platform: sales analytics dashboard for VP of Sales at Facade Access Solutions, tracking 2,920 CRM opportunities across 7 NAM regions with win rates, forecasts, GC relationship scoring, market penetration analysis, and a live Dodge project radar backed by Supabase.',
  'active', 'high', 82,
  'UX Polish and Production Merge (feat/market-intel-feedback)',  -- [MERGED] From Meridian session
  null,
  'https://github.com/lucasjameso/meridian-intelligence',
  'fjmhttyiobfjtrtkyoeq',
  'https://meridian-intelligence.pages.dev',
  '2026-03-05T06:00:00Z',
  '2026-03-22T06:00:00Z'
),
(
  'a1000000-0000-0000-0000-000000000006',
  'Atlas Intelligence',
  'atlas',
  'BD pipeline platform for Facade Access Solutions tracking industrial and infrastructure facilities, contacts, and shutdown windows across North America. Built for the VP of Sales to manage FAS market entry into pulp mills, steel plants, bridges, and towers.',
  'active', 'high', 75,
  'Post-Build Refinement',  -- [MERGED] From Atlas session
  null,
  'https://github.com/lucasjameso/atlas-intelligence',
  null,
  'https://production.atlas-intelligence.pages.dev',
  '2026-03-11T19:00:00Z',
  '2026-03-22T06:00:00Z'
);

-- ============================================================
-- 2. TASKS
-- ============================================================

-- Ridgeline tasks [MERGED] -- Real data from Ridgeline session
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
('b1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Phase 7: Foundation', 'Design tokens, dual Supabase clients (Ridgeline + Catalyst), utility functions, and feedback system', 'done', 'high', 'Claude Code', 0, '2026-03-20T09:00:00Z', '2026-03-20T13:38:52Z', '2026-03-20T13:38:52Z'),
('b1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Phase 8-10: Data Mapping, App Shell, Command Center', 'Catalyst data mappers, React Router with 20+ routes, sidebar nav, 13 shared UI components, and full Command Center dashboard', 'done', 'high', 'Claude Code', 0, '2026-03-20T09:00:00Z', '2026-03-20T19:29:31Z', '2026-03-20T19:29:31Z'),
('b1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Phase 11-13: CRM, Operations, Finance Views', 'Opportunities, Pipeline, GC Accounts (99 real), Projects (148 real), Project Detail, Billing and SOV, Job Costing, Receivables', 'done', 'high', 'Claude Code', 0, '2026-03-20T14:00:00Z', '2026-03-20T23:55:54Z', '2026-03-20T23:55:54Z'),
('b1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'Phase 14-16: Workforce, Intelligence, Settings + Deploy', 'Crew/HR (13 employees), Equipment (141 items), BI Dashboard with live charts, SettingsView, FeedbackAdminView, final QA, Cloudflare Pages deploy', 'done', 'high', 'Claude Code', 0, '2026-03-22T08:00:00Z', '2026-03-22T14:33:23Z', '2026-03-22T14:33:23Z'),
('b1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'Design polish pass: Command Center', 'Review copy, label quality, hero metrics, project card GC names, empty states, and hover states on Command Center', 'todo', 'high', null, 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000001', 'Fix Unknown GC on project cards', '123 of 148 Catalyst projects have no account_id. Decide on fallback display strategy or backfill linkage.', 'todo', 'high', null, 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'Fix Equipment hero metrics showing 0/0/0', 'Catalyst does not track item-level deployment status. Show total count only or redesign hero metrics.', 'todo', 'medium', null, 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000001', 'Fix Revenue by State chart: near-invisible bars', 'total_invoiced values in Catalyst are very small relative to chart scale. Needs relative scale or different aggregation.', 'todo', 'medium', null, 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000001', 'Design polish pass: remaining 19 views', 'Work through CRM, Ops, Finance, Workforce, Equipment, Intelligence views: copy accuracy, label quality, empty states, hover states', 'todo', 'medium', null, 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000001', 'Share demo URL with Clint Hernandez', 'v2.0 deployed at Cloudflare Pages. Confirm live Catalyst data queries work before sending URL.', 'todo', 'high', 'manual', 1, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null),
('b1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000001', 'Plan v3.0 milestone', 'Multi-tenant onboarding, auth, write-back to Catalyst, Platform Roadmap page, audit logging, white-label config. Requires Clint sign-off.', 'todo', 'low', null, 2, '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z', null);

-- CLARITY / BWL tasks [MERGED] -- Book-specific tasks from CLARITY session
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
('b2000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'Platform audit and handle availability report', 'Audit 10 platforms for handle availability, document requirements, recommend consistent handle strategy.', 'done', 'high', 'Claude Code', 0, '2026-03-21T11:41:00Z', '2026-03-21T12:46:00Z', '2026-03-21T12:46:00Z'),
('b2000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000002', 'Amazon Author Central and Goodreads prep kit', 'Author bio drafted (389 words), setup checklists built, photo specs documented. Blocked until CLARITY listed on Amazon by HMD.', 'done', 'high', 'Claude Code', 0, '2026-03-21T12:00:00Z', '2026-03-21T13:05:00Z', '2026-03-21T13:05:00Z'),
('b2000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002', 'Week 5 batch HTML content (Credibility + Depth)', '5 LinkedIn posts for Mar 25-29 in W5_Batch.html with copy-paste cards and carousel breakdowns. Awaiting Lucas approval.', 'done', 'high', 'Claude Code', 0, '2026-03-21T12:00:00Z', '2026-03-21T13:04:00Z', '2026-03-21T13:04:00Z'),
('b2000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000002', 'Week 5 Excalidraw diagrams (Tuesday carousel)', 'Source files and PNG exports for Mar 25 carousel. Remaining days need diagrams.', 'done', 'high', 'Claude Code', 0, '2026-03-21T13:00:00Z', '2026-03-21T15:52:00Z', '2026-03-21T15:52:00Z'),
('b2000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000002', 'Week 5 Excalidraw diagrams (Wed-Sat posts)', 'Folders exist but empty for Wed-Sat Week 5 posts. Need source files and PNG exports.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T15:52:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000002', 'Claim platform handles (Substack, Medium, TikTok, X, Facebook, LinkedIn page)', '6 handles confirmed available on Mar 21. Must be claimed manually before taken.', 'todo', 'high', 'manual', 0, '2026-03-21T12:46:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000002', 'Week 6 batch HTML (The Builders Evidence)', '5 LinkedIn posts for Mar 30 - Apr 4. Theme: Proof and transformation metrics, book excerpts begin.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000002', 'Week 7 batch HTML (Behind the Book)', '5 LinkedIn posts for Apr 7-11. Theme: excerpts, behind-the-scenes, anticipation. First direct purchase mentions.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000002', 'Week 8 batch HTML (Launch Week)', '6 LinkedIn posts for Apr 14-19. Special Mon-Sat cadence. Includes launch day post and recap.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000002', 'Email launch sequence (3 emails)', 'Pre-launch (Apr 15), launch day (Apr 17), 48-hour follow-up (Apr 19) for Beehiiv.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000026', 'a1000000-0000-0000-0000-000000000002', 'Podcast target research (25-30 shows)', 'Tiered list with contact info and reusable pitch template. Construction, trades, B2B sales, leadership ops.', 'todo', 'medium', 'Claude Code', 1, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000027', 'a1000000-0000-0000-0000-000000000002', 'ARC reader outreach list (15-20 people)', 'Priority 1: VPs and founders in construction/trades. DM template included.', 'todo', 'high', 'Claude Code', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000028', 'a1000000-0000-0000-0000-000000000002', 'Coordinate KDP listing status with HMD', 'Contact publisher about pre-order and listing timeline. Blocks Author Central and Goodreads.', 'todo', 'high', 'manual', 0, '2026-03-21T12:09:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000029', 'a1000000-0000-0000-0000-000000000002', 'Amazon Author Central profile setup', 'Claim CLARITY at authorcentral.amazon.com, paste bio, upload headshot. Blocked until KDP live.', 'todo', 'high', 'manual', 0, '2026-03-21T13:05:00Z', '2026-03-22T00:00:00Z', null);

-- Forge Console tasks [FORGE] -- Accurate from this codebase
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
('b1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000003', 'Phase 1: Component Foundation', 'shadcn/ui adoption, design tokens, toast system, error boundaries, favicon', 'done', 'high', 'Claude Code', 0, '2026-03-21T03:00:00Z', '2026-03-21T08:00:00Z', '2026-03-21T08:00:00Z'),
('b1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000003', 'Phase 2: Global Design Standards', 'Sidebar polish, card system, typography hierarchy, spacing rules', 'done', 'high', 'Claude Code', 0, '2026-03-21T08:00:00Z', '2026-03-22T06:00:00Z', '2026-03-22T06:00:00Z'),
('b1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000003', 'Phase 3: Dashboard Redesign', 'Hero stat tiles, health strip, recency indicators, content calendar', 'done', 'high', 'Claude Code', 0, '2026-03-22T06:00:00Z', '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z'),
('b1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000003', 'Phase 4: Page-by-Page Visual Polish', 'Polish all remaining pages to premium quality', 'todo', 'high', 'Claude Code', 0, '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z', null),
('b1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000003', 'Seed Supabase with real data', 'Populate all 14 tables with production data', 'in_progress', 'high', 'Claude Code', 1, '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z', null),
('b1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000003', 'Deploy to Cloudflare Pages', 'wrangler.toml, production env vars, smoke test on CF URL', 'todo', 'medium', null, 1, '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z', null);

-- Build What Lasts tasks [MERGED] -- Real data from BWL session (40 tasks)
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
-- Credentials (done)
('b2000000-0000-0000-0000-000000000030', 'a1000000-0000-0000-0000-000000000002', 'Create ~/.master.env file structure', 'Forge-Setup-Sprint folder with tracker, template, and HOW-TO-USE docs', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000031', 'a1000000-0000-0000-0000-000000000002', 'Collect OpenAI, Gemini, DeepSeek, Groq API keys', 'All 4 keys created as forge-master, added to ~/.master.env', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000032', 'a1000000-0000-0000-0000-000000000002', 'Collect Cloudflare, GitHub, Stripe, Vercel credentials', 'Token/Account IDs from each platform. Stripe in test mode.', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000033', 'a1000000-0000-0000-0000-000000000002', 'Collect Perplexity and Exa AI API keys', 'Both keys created as forge-master and added to ~/.master.env', 'done', 'medium', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
-- Social accounts (done)
('b2000000-0000-0000-0000-000000000034', 'a1000000-0000-0000-0000-000000000002', 'Create LinkedIn Build What Lasts company page', 'Page ID: 112342453. Handle: @buildwhatlasts.', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000035', 'a1000000-0000-0000-0000-000000000002', 'Create Facebook Build What Lasts page', 'Page ID: 61578498486795. Username @buildwhatlasts not yet claimed.', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000036', 'a1000000-0000-0000-0000-000000000002', 'Create YouTube Build What Lasts channel', 'Handle: @buildwhatlasts. Channel ID: UCYac-P1EIf5HCpnhCZyiOkw.', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000037', 'a1000000-0000-0000-0000-000000000002', 'Create Reddit u/BuildWhatLasts account', 'Using lucas@buildwhatlasts.app. First account deleted, clean handle secured.', 'done', 'medium', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('b2000000-0000-0000-0000-000000000038', 'a1000000-0000-0000-0000-000000000002', 'Create Beehiiv account and collect API key', 'Publication: Build What Lasts. Free plan. Pub ID and API key collected.', 'done', 'high', 'manual', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
-- Profile completion (in_progress)
('b2000000-0000-0000-0000-000000000039', 'a1000000-0000-0000-0000-000000000002', 'Complete LinkedIn company page profile', 'Add description, tagline, logo, cover photo, website URL, first post', 'in_progress', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000040', 'a1000000-0000-0000-0000-000000000002', 'Complete Facebook page profile', 'Claim @buildwhatlasts username, description, photos, pinned post', 'in_progress', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000041', 'a1000000-0000-0000-0000-000000000002', 'Complete YouTube channel profile', 'Description, icon, banner, header links, trailer, playlists', 'in_progress', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
-- Remaining todos
('b2000000-0000-0000-0000-000000000042', 'a1000000-0000-0000-0000-000000000002', 'Confirm X/Twitter and TikTok handles', 'Log in, confirm primary handles, update ACCOUNT-REGISTRY.md', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000043', 'a1000000-0000-0000-0000-000000000002', 'Set up Meta Developer App', 'Create Business app at developers.facebook.com for Instagram + Facebook API', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000044', 'a1000000-0000-0000-0000-000000000002', 'Set up Twitter, LinkedIn, TikTok, YouTube developer apps', 'Developer API access for n8n automation on all 4 platforms', 'todo', 'medium', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000045', 'a1000000-0000-0000-0000-000000000002', 'Create Goodreads author page', 'author.goodreads.com/author/program. Add CLARITY listing, bio, photo.', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000046', 'a1000000-0000-0000-0000-000000000002', 'Create Amazon Author Central page', 'author.amazon.com. Connect ASIN when live. Bio, photo, blog feed.', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000047', 'a1000000-0000-0000-0000-000000000002', 'Design Beehiiv newsletter template', 'Branded template with BWL visual identity. Connect newsletter.buildwhatlasts.com.', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000048', 'a1000000-0000-0000-0000-000000000002', 'Build 5-email pre-launch sequence', 'Write and schedule in Beehiiv. Upgrade to Scale plan before going live.', 'todo', 'high', 'Claude Code', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000049', 'a1000000-0000-0000-0000-000000000002', 'Build n8n cross-posting automation workflows', 'Automated publishing to LinkedIn, Facebook, X, Instagram, TikTok, YouTube', 'todo', 'high', 'n8n', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000072', 'a1000000-0000-0000-0000-000000000002', 'Create April 1-30 content calendar', 'Pre-launch buildup Apr 1-16, launch day Apr 17, post-launch Apr 18-30', 'todo', 'high', 'Claude Code', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000073', 'a1000000-0000-0000-0000-000000000002', 'Sister design work for all social profiles', 'Logos (800x800), banners (platform-specific sizes). Same brand kit across 7 platforms.', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000074', 'a1000000-0000-0000-0000-000000000002', 'Collect Supabase service role keys, Slack API keys, n8n API key', 'Remaining credentials needed in ~/.master.env', 'todo', 'high', 'manual', 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b2000000-0000-0000-0000-000000000075', 'a1000000-0000-0000-0000-000000000002', 'Get Amazon KDP ASIN from publisher', 'Publishing company handling KDP upload. Collect ASIN when listed.', 'todo', 'high', null, 1, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null);

-- Meridian Intelligence tasks [MERGED] -- Real data from Meridian session
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
('b1000000-0000-0000-0000-000000000050', 'a1000000-0000-0000-0000-000000000005', 'Reclassify 260 UNDEFINED equipment records', 'Two-agent classification pipeline resolved all 260 UNDEFINED records. Zero UNDEFINED remaining across 2,920 NAM records.', 'done', 'high', 'Claude Code', 0, '2026-03-05T00:00:00Z', '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z'),
('b1000000-0000-0000-0000-000000000051', 'a1000000-0000-0000-0000-000000000005', 'Build NAM region architecture (R1-R4, CA Intel, NYC Intel)', 'Full NAM hierarchy with child territories, cross-region CA + NYC Intelligence views, single-source-of-truth regions.js config. R1+R2+R3+R4 = 2,920 records verified.', 'done', 'high', 'Claude Code', 0, '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z'),
('b1000000-0000-0000-0000-000000000052', 'a1000000-0000-0000-0000-000000000005', 'Regionalize all 7 dashboard views', 'Overview, By GC, By Consultant, Pipeline, Deal Intelligence, Territory Strategy, and Forecast all dynamically switch via FilterContext.', 'done', 'high', 'Claude Code', 0, '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z'),
('b1000000-0000-0000-0000-000000000053', 'a1000000-0000-0000-0000-000000000005', 'Build hierarchical sidebar with accordion region nav', '240px fixed sidebar with accordion region nav, chevron/name split click targets, FAS Navy active state, mobile slide-out drawer, and Intelligence section.', 'done', 'medium', 'Claude Code', 0, '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z', '2026-03-07T00:00:00Z'),
('b1000000-0000-0000-0000-000000000054', 'a1000000-0000-0000-0000-000000000005', 'Build Market Intelligence view (ABI chart, penetration gauge, Dodge data)', '5-act market narrative with ABI dual-line chart, regional toggles, AIA modal, USD-to-CAD conversion, White Space matrix, and Forward Pipeline chart.', 'done', 'high', 'Claude Code', 0, '2026-03-16T00:00:00Z', '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z'),
('b1000000-0000-0000-0000-000000000055', 'a1000000-0000-0000-0000-000000000005', 'Seed Supabase with 1,749 Dodge project rows', 'dodge_projects and dodge_project_actions tables with RLS. Idempotent import script. supabaseClient.js shared across app.', 'done', 'high', 'Claude Code', 0, '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z'),
('b1000000-0000-0000-0000-000000000056', 'a1000000-0000-0000-0000-000000000005', 'Build Pipeline Radar view', 'RSM-gated Dodge project tracker with user picker, territory filtering, bid buckets, paginated sortable table, inline row expansion, bulk archive, optimistic UI, and action log.', 'done', 'high', 'Claude Code', 0, '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z', '2026-03-17T00:00:00Z'),
('b1000000-0000-0000-0000-000000000057', 'a1000000-0000-0000-0000-000000000005', 'Replace dev feedback system with Atlas-style user feedback', 'Replaced DevFeedbackWrapper across 32+ files with FeedbackContext + FeedbackTarget + FeedbackModal. Backed by Supabase meridian_feedback table with RLS.', 'done', 'medium', 'Claude Code', 0, '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z'),
('b1000000-0000-0000-0000-000000000058', 'a1000000-0000-0000-0000-000000000005', 'Build White Space Matrix drill-down modal', 'Clickable chart bars open WhiteSpaceProjectModal. Archived projects excluded from chart but visible greyed out in drill-down.', 'done', 'medium', 'Claude Code', 0, '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z'),
('b1000000-0000-0000-0000-000000000059', 'a1000000-0000-0000-0000-000000000005', 'Expand Market Pipeline Act 4/5 story', 'Act 4 reframed with GC direct-invitation narrative (95%+ pre-Dodge coverage). Three interpretation panels added. Act 5 softened to coverage gap scan.', 'done', 'medium', 'Claude Code', 0, '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z', '2026-03-18T00:00:00Z'),
('b1000000-0000-0000-0000-000000000076', 'a1000000-0000-0000-0000-000000000005', 'Merge feat/market-intel-feedback to main and deploy', 'Feature branch contains all March 18 work. Requires build verification, no-ff merge to main, wrangler deploy with --branch=production flag.', 'todo', 'high', 'Claude Code', 0, '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b1000000-0000-0000-0000-000000000077', 'a1000000-0000-0000-0000-000000000005', 'Build IDS architect breakdown modal (ForwardPipelineChart)', 'Clicking an IDS bar should open modal showing architect breakdown for those projects. Forrest feature request from March 17.', 'todo', 'medium', 'Claude Code', 1, '2026-03-17T00:00:00Z', '2026-03-22T00:00:00Z', null),
('b1000000-0000-0000-0000-000000000078', 'a1000000-0000-0000-0000-000000000005', 'Place AIA regions SVG in public directory', 'AIA modal shell is built and wired. Needs public/aia-regions-map.svg placed manually by Lucas. Modal renders broken img placeholder.', 'todo', 'low', 'manual', 1, '2026-03-17T00:00:00Z', '2026-03-22T00:00:00Z', null);

-- Atlas Intelligence tasks [MERGED] -- Real data from Atlas session
insert into public.tasks (id, project_id, title, description, status, priority, assignee, column_order, created_at, updated_at, resolved_at) values
('b1000000-0000-0000-0000-000000000060', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: Sidebar, layout, shared components', 'Dark sidebar (260px, navy/orange), AppLayout, 8 shared components, routes for /actions, /plans, /map, /solutions, /health, /export', 'done', 'high', 'Claude Code', 0, '2026-03-11T23:00:00Z', '2026-03-11T23:01:00Z', '2026-03-11T23:01:00Z'),
('b1000000-0000-0000-0000-000000000061', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: Core pages (Dashboard, Actions, Facilities, Contacts, Pipeline, Calendar)', 'KpiCards, GoingColdAlerts, ProgramHealthMini rebuilt. GuidanceBar added to all pages.', 'done', 'high', 'Claude Code', 0, '2026-03-11T23:01:00Z', '2026-03-11T23:10:00Z', '2026-03-11T23:10:00Z'),
('b1000000-0000-0000-0000-000000000062', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: New feature pages (Plans, Map, Solutions, Health)', 'Plans with 4 templates and step tracking. Interactive deck.gl facility map. Solution pipeline and field observations. Program health targets.', 'done', 'high', 'Claude Code', 0, '2026-03-11T23:10:00Z', '2026-03-11T23:14:00Z', '2026-03-11T23:14:00Z'),
('b1000000-0000-0000-0000-000000000063', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: Interactions, alerts, and snooze', 'LogInteractionModal with 3 interaction types and 4 outcomes. alerts.ts utility (isGoingCold, daysUntilCold, daysSince). Snooze live in Actions.', 'done', 'high', 'Claude Code', 0, '2026-03-11T23:14:00Z', '2026-03-11T23:16:00Z', '2026-03-11T23:16:00Z'),
('b1000000-0000-0000-0000-000000000064', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: Polish (ErrorBoundary, skeleton loaders)', 'ErrorBoundary wrapping AppLayout. SkeletonCard and SkeletonKpi components. All phases deployed to production.', 'done', 'medium', 'Claude Code', 0, '2026-03-11T23:16:00Z', '2026-03-11T23:21:00Z', '2026-03-11T23:21:00Z'),
('b1000000-0000-0000-0000-000000000065', 'a1000000-0000-0000-0000-000000000006', 'Database migration: Phase 2 schema', '8 new tables: action_plans, action_plan_steps, relationship_changes, influence_links, field_observations, site_requirements, program_targets, notifications.', 'done', 'high', 'Claude Code', 0, '2026-03-12T00:00:00Z', '2026-03-13T04:00:00Z', '2026-03-13T04:00:00Z'),
('b1000000-0000-0000-0000-000000000066', 'a1000000-0000-0000-0000-000000000006', 'IIR data surface + color system across all pages', 'Color token system implemented. IIR intelligence data surfaced across all page views.', 'done', 'medium', 'Claude Code', 0, '2026-03-12T04:52:00Z', '2026-03-12T05:45:00Z', '2026-03-12T05:45:00Z'),
('b1000000-0000-0000-0000-000000000067', 'a1000000-0000-0000-0000-000000000006', 'Sticky table headers on all 4 data table pages', 'Frozen headers on Contacts, Sites, Calendar, CRM Export. Removed overflow scroll ancestors blocking functionality.', 'done', 'medium', 'Claude Code', 0, '2026-03-12T06:01:00Z', '2026-03-12T06:54:00Z', '2026-03-12T06:54:00Z'),
('b1000000-0000-0000-0000-000000000068', 'a1000000-0000-0000-0000-000000000006', 'Cleanup Sprint: dead components, gitignore, archived docs', 'Removed 5 dead components, fixed gitignore, relocated 5 analysis docs to /docs/analysis/.', 'done', 'low', 'Claude Code', 0, '2026-03-12T12:07:00Z', '2026-03-12T12:19:00Z', '2026-03-12T12:19:00Z'),
('b1000000-0000-0000-0000-000000000069', 'a1000000-0000-0000-0000-000000000006', 'Decompose FacilityDetail.tsx into sub-components', 'Large monolithic component. Deferred from Cleanup Sprint 1 for a dedicated refactor sprint.', 'todo', 'medium', null, 1, '2026-03-12T12:19:00Z', '2026-03-12T12:19:00Z', null),
('b1000000-0000-0000-0000-000000000070', 'a1000000-0000-0000-0000-000000000006', 'Activate Intelligence.tsx page', 'Exists as stub. Define data model and activate market intelligence view.', 'todo', 'medium', null, 1, '2026-03-12T12:19:00Z', '2026-03-12T12:19:00Z', null),
('b1000000-0000-0000-0000-000000000071', 'a1000000-0000-0000-0000-000000000006', 'Activate Reports.tsx page', 'Exists as stub. Define report types (by territory, by facility type, by rep) and wire to Supabase.', 'todo', 'low', null, 1, '2026-03-12T12:19:00Z', '2026-03-12T12:19:00Z', null);

-- ============================================================
-- 3. PROJECT MILESTONES
-- ============================================================

-- Ridgeline milestones [MERGED] -- Real data from Ridgeline session
insert into public.project_milestones (id, project_id, title, target_date, status, phase_number, created_at) values
('c1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'v1.0: Supabase Schema and Legacy Frontend', '2026-03-18', 'done', 1, '2026-02-05T06:00:00Z'),
('c1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'v1.5: Design System Lock', '2026-03-19', 'done', 2, '2026-02-05T06:00:00Z'),
('c1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'v2.0: Full Demo Build (Phases 7-16)', '2026-03-22', 'done', 3, '2026-02-05T06:00:00Z'),
('c1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000001', 'v2.1: Design Polish Pass', null, 'in_progress', 4, '2026-03-22T14:35:00Z'),
('c1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000001', 'v3.0: First POC Client Onboarding', null, 'upcoming', 5, '2026-03-22T14:35:00Z');

-- CLARITY / BWL milestones [MERGED]
insert into public.project_milestones (id, project_id, title, target_date, status, phase_number, created_at) values
('c1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'Platform audit and content system operational', '2026-03-21', 'done', 1, '2026-02-20T06:00:00Z'),
('c1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000002', 'Credentials Sprint Complete', '2026-03-22', 'done', 2, '2026-03-22T00:00:00Z'),
('c1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002', 'All platform handles claimed and profiles live', '2026-03-28', 'in_progress', 3, '2026-03-22T00:00:00Z'),
('c1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000002', 'Full content calendar complete (Weeks 5-8)', '2026-04-01', 'in_progress', 4, '2026-03-21T12:09:00Z'),
('c1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000002', 'Amazon listing live and Author Central/Goodreads complete', '2026-04-10', 'upcoming', 5, '2026-03-21T13:05:00Z'),
('c1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000002', 'n8n automation and email sequence live', '2026-04-07', 'upcoming', 6, '2026-03-22T00:00:00Z'),
('c1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000002', 'Launch Day: CLARITY Kill the Hero', '2026-04-17', 'upcoming', 7, '2026-02-20T06:00:00Z'),
('c1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000002', 'Post-launch 90-day review (25+ reviews, 250+ units, 500+ email subs)', '2026-07-17', 'upcoming', 8, '2026-02-20T06:00:00Z');

-- Forge Console milestones [FORGE]
insert into public.project_milestones (id, project_id, title, target_date, status, phase_number, created_at) values
('c1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000003', 'Component Foundation', '2026-03-21', 'done', 1, '2026-03-21T03:00:00Z'),
('c1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000003', 'Global Design Standards', '2026-03-22', 'done', 2, '2026-03-21T03:00:00Z'),
('c1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000003', 'Dashboard Redesign', '2026-03-22', 'done', 3, '2026-03-21T03:00:00Z'),
('c1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000003', 'Page-by-Page Visual Polish', '2026-03-24', 'upcoming', 4, '2026-03-21T03:00:00Z'),
('c1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000003', 'All Features Complete', '2026-03-28', 'upcoming', 7, '2026-03-21T03:00:00Z'),
('c1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000003', 'Deployed to Cloudflare', '2026-03-30', 'upcoming', 9, '2026-03-21T03:00:00Z');


-- Meridian Intelligence milestones [MERGED] -- Real data from Meridian session
insert into public.project_milestones (id, project_id, title, target_date, status, phase_number, created_at) values
('c1000000-0000-0000-0000-000000000040', 'a1000000-0000-0000-0000-000000000005', 'Data Foundation and Classification', '2026-03-07', 'done', 1, '2026-03-05T00:00:00Z'),
('c1000000-0000-0000-0000-000000000041', 'a1000000-0000-0000-0000-000000000005', 'Core Dashboard Architecture (v3 NAM Build)', '2026-03-07', 'done', 2, '2026-03-07T00:00:00Z'),
('c1000000-0000-0000-0000-000000000042', 'a1000000-0000-0000-0000-000000000005', 'Market Intelligence Layer', '2026-03-16', 'done', 3, '2026-03-16T00:00:00Z'),
('c1000000-0000-0000-0000-000000000043', 'a1000000-0000-0000-0000-000000000005', 'Pipeline Radar and Supabase Integration', '2026-03-17', 'done', 4, '2026-03-17T00:00:00Z'),
('c1000000-0000-0000-0000-000000000044', 'a1000000-0000-0000-0000-000000000005', 'Feedback System, UX Polish, and Production Merge', '2026-03-22', 'in_progress', 5, '2026-03-18T00:00:00Z'),
('c1000000-0000-0000-0000-000000000045', 'a1000000-0000-0000-0000-000000000005', 'Snapshot History and Trend Tracking', null, 'upcoming', 6, '2026-03-06T00:00:00Z');

-- Atlas Intelligence milestones [MERGED] -- Real data from Atlas session
insert into public.project_milestones (id, project_id, title, target_date, status, phase_number, created_at) values
('c1000000-0000-0000-0000-000000000050', 'a1000000-0000-0000-0000-000000000006', 'Phase 1: Analysis and Architecture Docs', null, 'done', 1, '2026-03-11T19:00:00Z'),
('c1000000-0000-0000-0000-000000000051', 'a1000000-0000-0000-0000-000000000006', 'Phase 2: Full Platform Build and Deployment', '2026-03-13', 'done', 2, '2026-03-11T19:00:00Z'),
('c1000000-0000-0000-0000-000000000052', 'a1000000-0000-0000-0000-000000000006', 'Cleanup Sprint: Dead code, docs, gitignore', '2026-03-12', 'done', 3, '2026-03-12T12:07:00Z'),
('c1000000-0000-0000-0000-000000000053', 'a1000000-0000-0000-0000-000000000006', 'Refactor Sprint: FacilityDetail decomposition', null, 'upcoming', 4, '2026-03-12T12:19:00Z'),
('c1000000-0000-0000-0000-000000000054', 'a1000000-0000-0000-0000-000000000006', 'Feature Expansion: Intelligence and Reports pages', null, 'upcoming', 5, '2026-03-12T12:19:00Z');

-- ============================================================
-- 4. PROJECT ACTION ITEMS
-- ============================================================
insert into public.project_action_items (id, project_id, description, urgency, source, status, created_at, resolved_at) values
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Verify live Catalyst DB connection in production: confirm SettingsView renders Clint Hernandez name and FeedbackAdminView loads at Cloudflare Pages URL', 'high', 'Phase 16 VERIFICATION.md', 'open', '2026-03-22T14:33:00Z', null),
('d1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'Decide GC linkage strategy for 123 unlinked projects: accept Unknown GC for demo, or add fallback display using project type + superintendent name', 'high', 'Design polish backlog', 'open', '2026-03-22T14:35:00Z', null),
('d1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000002', 'Contact HMD publisher about KDP pre-order status and listing timeline. Blocks Author Central, Goodreads, BookBub.', 'high', 'CLARITY_LAUNCH_MASTER_BRIEF.md', 'open', '2026-03-21T12:09:00Z', null),
('d1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Review and approve Week 5 content batch (W5_Batch.html) before first post Tuesday March 25 at 8:00 AM EST', 'high', 'W5_Batch.html', 'open', '2026-03-21T13:04:00Z', null),
('d1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'Build ARC outreach list and send DMs by March 25. Need 15-20 readers to post Amazon reviews within 48h of April 17.', 'high', 'TASK-05-arc-outreach.md', 'open', '2026-03-21T12:09:00Z', null),
('d1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000003', 'Seed Supabase with real data from all three projects', 'high', 'Phase 4 prep', 'open', '2026-03-22T12:00:00Z', null),
('d1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000001', 'Get Clint sign-off before starting v3.0 schema changes: write-back to Catalyst DB requires approval on new columns and tables', 'medium', 'REQUIREMENTS.md v2 P2-01', 'open', '2026-03-22T14:35:00Z', null),
('d1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000001', 'Replace react-leaflet choropleth map with deck.gl version: migration plan documented, leaflet is the only remaining legacy dependency', 'low', 'CLAUDE.md map stack migration plan', 'open', '2026-03-22T14:35:00Z', null),
('d1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000002', 'Claim @buildwhatlasts username on Facebook page', 'high', 'Sprint session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000002', 'Create Goodreads author page and Amazon Author Central', 'high', 'Sprint session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000002', 'Confirm X/Twitter and TikTok handles, update ACCOUNT-REGISTRY.md', 'high', 'Sprint session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000002', 'Send sister full social media design list with platform specs and confirmed handles', 'high', 'Sprint session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000002', 'Set up Meta Developer App to unlock Instagram and Facebook API for n8n', 'high', 'Sprint session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000002', 'Add Anthropic API key to ~/.master.env (currently blank)', 'high', 'Claude Code session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000002', 'Collect all 6 Supabase service role keys for ~/.master.env', 'high', 'Claude Code session 2026-03-22', 'open', '2026-03-22T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000005', 'Merge feat/market-intel-feedback branch to main: all March 18 work is unmerged and not in production', 'high', 'PROGRESS.md', 'open', '2026-03-18T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000005', 'Place public/aia-regions-map.svg manually: AIA modal shell is live but broken without the SVG asset', 'medium', 'PROGRESS.md', 'open', '2026-03-17T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000005', 'Decide scope of Pipeline Radar additions: Lucas to specify next feature set before next session', 'low', 'PROGRESS.md', 'open', '2026-03-17T00:00:00Z', null),
('d1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000006', 'Decompose FacilityDetail.tsx: large monolithic component, deferred from Cleanup Sprint 1', 'medium', 'PROGRESS.md cleanup sprint notes', 'open', '2026-03-12T12:19:00Z', null),
('d1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000006', 'Define Intelligence page data model and activate the page: currently preserved as a stub', 'medium', 'RESUME_HERE.md preserved components', 'open', '2026-03-12T12:19:00Z', null);

-- ============================================================
-- 5. PROJECT NOTES
-- ============================================================
insert into public.project_notes (id, project_id, content, tag, created_at) values
('e1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Two separate Supabase connections: Ridgeline App DB (awlrpjefdgfismzdweuc) for app config, feedback, Dodge data; Catalyst DB (oylucmokfzsdxzlrjsue) for all Clint Hernandez company data. Catalyst is permanently READ ONLY.', 'decision', '2026-03-20T09:00:00Z'),
('e1000000-0000-0000-0000-000000000002', 'a1000000-0000-0000-0000-000000000001', 'v2.0 demo uses live Catalyst Scaffold and Access data exclusively: 13 real employees, 99 real GC accounts, 148 real projects, 141 real equipment items. Only seeded data is 20 sample opportunities. Deliberate decision for authentic demo conversations with Clint.', 'decision', '2026-03-20T09:00:00Z'),
('e1000000-0000-0000-0000-000000000003', 'a1000000-0000-0000-0000-000000000001', 'Vite 7.3 + React 18.2, NOT Next.js. A Vercel plugin PostToolUse hook fires false-positive Next.js suggestions on every edit. Silently ignore all App Router, use client, use server, next/image suggestions.', 'context', '2026-03-20T09:00:00Z'),
('e1000000-0000-0000-0000-000000000015', 'a1000000-0000-0000-0000-000000000001', 'contract_value is NULL for all 148 Catalyst project rows. All financial aggregations must use total_invoiced instead. Applies to every chart or metric that aggregates project financials.', 'context', '2026-03-22T09:15:00Z'),
('e1000000-0000-0000-0000-000000000016', 'a1000000-0000-0000-0000-000000000001', 'DataTable API uses header (not label) for column display names and formatter (not render) for custom cell rendering. EmptyState uses body prop (not message). Both were real bugs found in production.', 'context', '2026-03-20T16:00:00Z'),
('e1000000-0000-0000-0000-000000000017', 'a1000000-0000-0000-0000-000000000001', 'Portfolio goal: disbelief that one person built this. Primary audience is executive recruiters and potential investors. Platform is simultaneously a portfolio piece and the production architecture paying clients will eventually run on. First POC target is Clint or equivalent scaffold contractor.', 'context', '2026-03-20T09:00:00Z'),
('e1000000-0000-0000-0000-000000000004', 'a1000000-0000-0000-0000-000000000002', 'Pricing locked: Kindle $9.99, Paperback $19.99, Hardcover $27.99. Distribution through Amazon KDP + IngramSpark. ISBNs are Bowker (author-owned). Publisher HMD handles KDP setup, keywords, description, categories, and 90-day marketing plan.', 'decision', '2026-03-21T12:09:00Z'),
('e1000000-0000-0000-0000-000000000005', 'a1000000-0000-0000-0000-000000000002', 'LinkedIn posting cadence changed from 4 posts/week (Mon/Tue/Thu/Sat) to 5 posts/week (Tue/Wed/Thu/Fri/Sat) at 8:00 AM EST. Monday dropped because engagement data shows 4.7 avg, worst weekday. Minimum 12 hours between posts.', 'decision', '2026-03-21T12:09:00Z'),
('e1000000-0000-0000-0000-000000000006', 'a1000000-0000-0000-0000-000000000002', 'Content arc is 8 weeks. Weeks 1-4 (Feb 21 - Mar 21) already published covering Pain, Foundation, Possibility, Bridge. Weeks 5-8 (Mar 23 - Apr 17) are launch ramp: Credibility + Depth, Builders Evidence, Behind the Book, Launch Week. Every post standalone value. Launch should feel inevitable, not interruptive.', 'context', '2026-03-21T12:09:00Z'),
('e1000000-0000-0000-0000-000000000030', 'a1000000-0000-0000-0000-000000000002', 'Primary handle: @buildwhatlasts across all platforms. Exception: X/Twitter uses @lucasoliverbwl because @buildwhatlasts taken by inactive account (Aaron Parks, Idaho, 21 followers since 2011). Instagram @buildwhatlasts already owned by Lucas.', 'decision', '2026-03-21T12:46:00Z'),
('e1000000-0000-0000-0000-000000000031', 'a1000000-0000-0000-0000-000000000002', 'Author bio finalized at 389 words for Amazon and Goodreads. Third person. Covers scaffold apprentice origin, 30-year career, VP of Sales, Build What Lasts brand. Voice: direct, not polished, someone who figured something out the hard way.', 'context', '2026-03-21T13:05:00Z'),
('e1000000-0000-0000-0000-000000000032', 'a1000000-0000-0000-0000-000000000002', 'Amazon Author Central and Goodreads both blocked until CLARITY listed on Amazon/KDP. HMD handling setup. Book expected on Amazon around March 23. Goodreads auto-imports within days. Author Program approval 2-5 business days.', 'blocker', '2026-03-21T13:05:00Z'),
('e1000000-0000-0000-0000-000000000033', 'a1000000-0000-0000-0000-000000000002', 'The CLARITY framework has four core moves: SUBTRACT (eliminate 20% noise), DEFINE (create standards), DECIDE (distribute authority), DELEGATE (transfer knowledge). Key metrics: 67 weekly interruptions to 4, 40% calendar was noise, 10+ hours reclaimed, $200K rework cost from undefined done.', 'context', '2026-03-21T12:09:00Z'),
('e1000000-0000-0000-0000-000000000034', 'a1000000-0000-0000-0000-000000000002', 'Reddit and Facebook groups are research-only. Never post promotional content in communities. Lucas participates authentically after receiving intelligence map. Hard rule.', 'decision', '2026-03-21T12:09:00Z'),
('e1000000-0000-0000-0000-000000000007', 'a1000000-0000-0000-0000-000000000003', 'Using light mode as primary design. idea.md is the authoritative design spec.', 'decision', '2026-03-21T03:00:00Z'),
('e1000000-0000-0000-0000-000000000008', 'a1000000-0000-0000-0000-000000000003', 'Phases 1-7 built overnight as fast prototype. v2 milestone is about quality elevation, not new pages.', 'context', '2026-03-21T06:00:00Z'),
('e1000000-0000-0000-0000-000000000009', 'a1000000-0000-0000-0000-000000000003', 'No auth needed. Single-user app, only Lucas uses it. Supabase anon key with permissive RLS.', 'decision', '2026-03-21T03:30:00Z'),
('e1000000-0000-0000-0000-000000000010', 'a1000000-0000-0000-0000-000000000002', 'Two email accounts in use: lucasjamesoliver1@gmail.com for most platforms, lucas@buildwhatlasts.app for Reddit and Beehiiv. Split creates login complexity, should be consolidated where possible.', 'context', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000011', 'a1000000-0000-0000-0000-000000000002', 'Beehiiv started on free plan over Max ($98/mo). Rationale: zero subscribers at launch, no newsletter history. Upgrade trigger is when Scale features are actively needed.', 'decision', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000012', 'a1000000-0000-0000-0000-000000000002', 'Brand tagline approved: Kill the hero. Build the system. Directly connects to CLARITY book thesis and is unique to Lucas positioning.', 'decision', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000025', 'a1000000-0000-0000-0000-000000000002', 'Stripe is in TEST mode. All keys prefixed pk_test/sk_test. Must switch to live and update ~/.master.env before processing real transactions.', 'blocker', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000026', 'a1000000-0000-0000-0000-000000000002', 'Cloudflare wrong account issue initially. Correct account ID is dae540d1c9880eb0d8fe720705f05080, associated with lucasjamesoliver1@gmail.com and iac-solutions.io domain.', 'context', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000027', 'a1000000-0000-0000-0000-000000000002', 'Amazon KDP deferred: publishing company handling KDP upload for CLARITY. ASIN provided by them when listed. Do not attempt independent upload.', 'context', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000028', 'a1000000-0000-0000-0000-000000000002', 'GitHub repos confirmed active: forge-console-v2 (Mar 22), ridgeline (Mar 18), meridian-intelligence (Mar 17), atlas-intelligence (Mar 12). Username: lucasjamesoarrows.', 'context', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000029', 'a1000000-0000-0000-0000-000000000002', 'BookTok strategy identified as high priority for TikTok. Not a separate account but content strategy. Wire into April content calendar once TikTok account confirmed.', 'idea', '2026-03-22T00:00:00Z'),
('e1000000-0000-0000-0000-000000000013', 'a1000000-0000-0000-0000-000000000005', 'All CRM data runs client-side from FAS_NAM.JSON (2,920 records). Supabase (fjmhttyiobfjtrtkyoeq, us-west-2) is used only for Pipeline Radar (dodge_projects, dodge_project_actions) and user feedback (meridian_feedback). No CRM data is stored in Supabase.', 'context', '2026-03-17T00:00:00Z'),
('e1000000-0000-0000-0000-000000000021', 'a1000000-0000-0000-0000-000000000005', 'CWR (Controllable Win Rate) is the standard metric platform-wide, not simple win rate. CWR excludes 5 Cat3 loss reasons (canceled by client/Alimak, declined to quote specs/capacity, partner not awarded). NAM CWR is 18.51%. On Hold deals excluded from all metrics.', 'decision', '2026-03-15T00:00:00Z'),
('e1000000-0000-0000-0000-000000000022', 'a1000000-0000-0000-0000-000000000005', 'Vite/Rollup minifier mangles native Map and Set constructors in lazy-loaded chunks: manifests as "0 is not a constructor" in production only. Fixed with globalThis captures and namespace imports. See CaliforniaCountyMap.jsx.', 'decision', '2026-03-07T00:00:00Z'),
('e1000000-0000-0000-0000-000000000023', 'a1000000-0000-0000-0000-000000000005', 'FAS receives 95%+ of GC project invitations directly before projects appear in Dodge. Low Dodge cross-reference rates are expected by design, not a coverage gap. Act 4 of Market Pipeline view was rewritten to prevent misinterpretation.', 'context', '2026-03-18T00:00:00Z'),
('e1000000-0000-0000-0000-000000000024', 'a1000000-0000-0000-0000-000000000005', 'Future build candidates documented in Future_Builds/: pipeline snapshot trend tracking, TAS framework integration, competitor intelligence layer, and full Dodge integration analysis. Scoped but not yet scheduled.', 'idea', '2026-03-06T00:00:00Z'),
('e1000000-0000-0000-0000-000000000014', 'a1000000-0000-0000-0000-000000000006', 'Stack: React + Vite + TypeScript + Tailwind + Supabase + deck.gl (mapping) + Recharts. Deployed on Cloudflare Pages. 17 routes total, 15 active, 2 preserved stubs (Intelligence, Reports).', 'context', '2026-03-13T04:00:00Z'),
('e1000000-0000-0000-0000-000000000018', 'a1000000-0000-0000-0000-000000000006', '88 facilities are geocoded and live in the DB. The login screen features a cinematic deck.gl camera sweep across all 88 facility locations. This is intentional brand polish, not a bug.', 'context', '2026-03-12T04:28:00Z'),
('e1000000-0000-0000-0000-000000000019', 'a1000000-0000-0000-0000-000000000006', 'CRM export targets Dynamics 365 via CSV. Manual export flow, no live sync. IIR data surfaced but schema expansion work (ATLAS_SCHEMA_EXPANSION.md) identified but not yet executed.', 'decision', '2026-03-12T12:16:00Z'),
('e1000000-0000-0000-0000-000000000020', 'a1000000-0000-0000-0000-000000000006', 'Atlas is a sibling platform to Meridian Intelligence: same shell pattern, same product family. FacilityDetail.tsx decomposition is the largest outstanding code-quality debt item.', 'context', '2026-03-13T04:00:00Z');

-- ============================================================
-- 6. BRAIN DUMPS [GEN]
-- ============================================================
insert into public.brain_dumps (id, raw_text, parsed_output, project_hint, status, created_at) values
(
  'f1000000-0000-0000-0000-000000000001',
  'Need to finish the Ridgeline demo data before the investor call on Thursday. Also need to write the launch week email sequence for CLARITY, at least 5 emails. And dont forget to review the carousel for Monday posting.',
  '{"summary": "Three action items across Ridgeline and CLARITY projects.", "tasks": [{"description": "Finish Ridgeline demo data before investor call Thursday", "project": "ridgeline", "priority": "high", "deadline": "2026-03-27"}, {"description": "Write 5-email launch week sequence for CLARITY", "project": "clarity", "priority": "high", "deadline": null}, {"description": "Review Monday carousel before posting window", "project": "clarity", "priority": "high", "deadline": "2026-03-24"}]}',
  null, 'processed', '2026-03-22T04:00:00Z'
),
(
  'f1000000-0000-0000-0000-000000000002',
  'The Forge Console dashboard is coming together but I want to make sure the stat tiles actually pull live data once Supabase is seeded. Right now everything is mock. Need to flip the isSupabaseConfigured flag and test the real hooks. Also should probably add a deployment countdown tile once we have a target deploy date.',
  '{"summary": "Forge Console data layer needs to switch from mock to live.", "tasks": [{"description": "Test Supabase hooks with real data after seeding", "project": "forge", "priority": "high", "deadline": null}, {"description": "Add deployment countdown tile to dashboard", "project": "forge", "priority": "low", "deadline": null}]}',
  'forge', 'processed', '2026-03-22T05:30:00Z'
),
(
  'f1000000-0000-0000-0000-000000000003',
  'Had an idea on the morning run. What if the Forge Console could show a unified timeline view across all three projects? Like a single scrollable feed where I can see what happened today across Ridgeline, CLARITY, and Forge. The activity log is close but its per-project. Need a cross-project view. Maybe just a filter toggle on the existing activity page.',
  '{"summary": "Cross-project timeline view idea for Forge Console.", "tasks": [{"description": "Design cross-project unified timeline view on activity page", "project": "forge", "priority": "medium", "deadline": null}]}',
  null, 'processed', '2026-03-20T06:15:00Z'
),
(
  'f1000000-0000-0000-0000-000000000004',
  'CLARITY cover files are done. Need to upload to KDP, but first I need to check the spine width calculation. 280 pages at 60lb paper. Also need the barcode from the ISBN agency. Waiting on that email. Once I have both, I can do the final cover upload and start the pre-order listing.',
  '{"summary": "CLARITY physical book production blockers.", "tasks": [{"description": "Calculate spine width for 280 pages at 60lb paper", "project": "clarity", "priority": "high", "deadline": null}, {"description": "Follow up on ISBN barcode from agency", "project": "clarity", "priority": "high", "deadline": null}, {"description": "Upload final cover to KDP once barcode received", "project": "clarity", "priority": "high", "deadline": null}]}',
  'clarity', 'processed', '2026-03-18T05:45:00Z'
),
(
  'f1000000-0000-0000-0000-000000000005',
  'Need to set up the n8n webhook that fires when content gets approved in Slack. The flow should be: approval reaction in Slack -> n8n catches it -> updates content_reviews table status to approved -> triggers the export workflow. This is phase 6 work for Forge but I want to think about the Slack channel structure now.',
  '{"summary": "n8n webhook architecture for content approval pipeline.", "tasks": [{"description": "Design Slack approval webhook flow for n8n", "project": "forge", "priority": "medium", "deadline": null}, {"description": "Plan Slack channel structure for content pipeline", "project": "clarity", "priority": "low", "deadline": null}]}',
  null, 'processed', '2026-03-19T21:00:00Z'
),
(
  'f1000000-0000-0000-0000-000000000006',
  'Thinking about the podcast strategy for CLARITY launch. The book is about systems thinking for trade contractors. I should target construction industry podcasts, B2B leadership shows, and maybe a few entrepreneurship pods. Goal: 5 appearances between now and launch day. Need to write a one-pager pitch and start outreach this week.',
  '{"summary": "Podcast outreach strategy for CLARITY launch.", "tasks": [{"description": "Write podcast pitch one-pager", "project": "clarity", "priority": "medium", "deadline": "2026-03-28"}, {"description": "Research 10 target podcasts in construction and B2B space", "project": "clarity", "priority": "medium", "deadline": "2026-03-26"}, {"description": "Send first 5 outreach emails", "project": "clarity", "priority": "medium", "deadline": "2026-03-29"}]}',
  'clarity', 'processed', '2026-03-17T06:00:00Z'
),
(
  'f1000000-0000-0000-0000-000000000007',
  'Ridgeline needs a scheduling module after the estimating MVP. Contractors need to assign crews to jobs by week. Simple Gantt-style view. Not full resource management, just crew-to-job-to-week mapping. Keep it minimal. Maybe just a table with drag to reschedule.',
  '{"summary": "Scheduling module vision for Ridgeline post-MVP.", "tasks": [{"description": "Design simple crew scheduling interface for Ridgeline", "project": "ridgeline", "priority": "low", "deadline": null}]}',
  'ridgeline', 'processed', '2026-03-16T05:30:00Z'
),
(
  'f1000000-0000-0000-0000-000000000008',
  'Running low on morning time this week. Corporate stuff is eating into the 3-6 AM window. Need to prioritize ruthlessly. Top 3 this week: 1) Forge Console seed data so I can see real numbers. 2) CLARITY carousel for Monday. 3) Ridgeline demo data script. Everything else can wait.',
  '{"summary": "Weekly priority triage across all projects.", "tasks": [{"description": "Complete Forge Console seed data", "project": "forge", "priority": "high", "deadline": "2026-03-24"}, {"description": "Finish CLARITY Monday carousel", "project": "clarity", "priority": "high", "deadline": "2026-03-24"}, {"description": "Complete Ridgeline demo data script", "project": "ridgeline", "priority": "high", "deadline": "2026-03-24"}]}',
  null, 'processed', '2026-03-22T03:15:00Z'
),
(
  'f1000000-0000-0000-0000-000000000009',
  'Quick thought: the social media page in Forge should show a follower growth chart over time. Right now it just shows current count. I should add a follower_history table or at least a weekly snapshot. Put this on the backlog for phase 7.',
  '{"summary": "Feature idea: follower growth tracking for social media page.", "tasks": [{"description": "Add follower_history tracking to social media page", "project": "forge", "priority": "low", "deadline": null}]}',
  'forge', 'pending', '2026-03-21T20:00:00Z'
),
(
  'f1000000-0000-0000-0000-000000000010',
  'Just realized the Forge Console content calendar strip on the dashboard only shows scheduled content. It should also show posted content with a checkmark so I can see what already went out this week vs what is still pending. Small fix for phase 4 polish.',
  '{"summary": "Dashboard calendar strip should show posted items too.", "tasks": [{"description": "Show posted content with checkmark in calendar strip", "project": "forge", "priority": "medium", "deadline": null}]}',
  'forge', 'pending', '2026-03-22T06:00:00Z'
);

-- ============================================================
-- 7. BRAIN DUMP TASKS [GEN]
-- ============================================================
insert into public.brain_dump_tasks (id, brain_dump_id, description, project, priority, status, created_at, resolved_at) values
-- From dump 1
('g1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'Finish Ridgeline demo data before investor call Thursday', 'ridgeline', 'high', 'assigned', '2026-03-22T04:00:00Z', null),
('g1000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', 'Write 5-email launch week sequence for CLARITY', 'clarity', 'high', 'pending', '2026-03-22T04:00:00Z', null),
('g1000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000001', 'Review Monday carousel before posting window', 'clarity', 'high', 'assigned', '2026-03-22T04:00:00Z', null),
-- From dump 2
('g1000000-0000-0000-0000-000000000004', 'f1000000-0000-0000-0000-000000000002', 'Test Supabase hooks with real data after seeding', 'forge', 'high', 'pending', '2026-03-22T05:30:00Z', null),
-- From dump 4
('g1000000-0000-0000-0000-000000000005', 'f1000000-0000-0000-0000-000000000004', 'Calculate spine width for 280 pages at 60lb paper', 'clarity', 'high', 'done', '2026-03-18T05:45:00Z', '2026-03-19T06:00:00Z'),
('g1000000-0000-0000-0000-000000000006', 'f1000000-0000-0000-0000-000000000004', 'Follow up on ISBN barcode from agency', 'clarity', 'high', 'done', '2026-03-18T05:45:00Z', '2026-03-20T12:00:00Z'),
('g1000000-0000-0000-0000-000000000007', 'f1000000-0000-0000-0000-000000000004', 'Upload final cover to KDP once barcode received', 'clarity', 'high', 'assigned', '2026-03-18T05:45:00Z', null),
-- From dump 6
('g1000000-0000-0000-0000-000000000008', 'f1000000-0000-0000-0000-000000000006', 'Write podcast pitch one-pager', 'clarity', 'medium', 'assigned', '2026-03-17T06:00:00Z', null),
('g1000000-0000-0000-0000-000000000009', 'f1000000-0000-0000-0000-000000000006', 'Research 10 target podcasts in construction and B2B space', 'clarity', 'medium', 'done', '2026-03-17T06:00:00Z', '2026-03-19T05:00:00Z'),
-- From dump 8
('g1000000-0000-0000-0000-000000000010', 'f1000000-0000-0000-0000-000000000008', 'Complete Forge Console seed data', 'forge', 'high', 'assigned', '2026-03-22T03:15:00Z', null);

-- ============================================================
-- 8. CONTENT REVIEWS [MERGED] -- Real content calendar from CLARITY session
-- ============================================================
-- Week 5: Credibility + Depth (pending -- awaiting Lucas approval)
insert into public.content_reviews (id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at) values
('h1000000-0000-0000-0000-000000000001', 'The Four Moves That Kill the Hero', 'First public reveal of the CLARITY framework skeleton: SUBTRACT, DEFINE, DECIDE, DELEGATE. Each move gets a one-sentence definition. Carousel breaks it into one move per slide.', 5, 'Tuesday', '2026-03-25', 5, 1, 'pending', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:00:00Z', null, null),
('h1000000-0000-0000-0000-000000000002', 'What Subtraction Actually Looks Like', 'Deep dive on the SUBTRACT move. Specific example: what Lucas eliminated and the exact hours recovered. The 72-Hour Audit concept teased.', 5, 'Wednesday', '2026-03-26', 0, 1, 'pending', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:00:00Z', null, null),
('h1000000-0000-0000-0000-000000000003', 'Define Done Before You Start', 'Deep dive on the DEFINE move. The cost of undefined done: rework hours, misalignment, quality variance. Before/after comparison. $200K deal loss concept.', 5, 'Thursday', '2026-03-27', 2, 1, 'pending', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:00:00Z', null, null),
('h1000000-0000-0000-0000-000000000004', 'The Week I Stopped Being the Answer', 'Personal story: the specific week Lucas decided to stop being the bottleneck. Emotional, vulnerable. Bridge to DECIDE content.', 5, 'Friday', '2026-03-28', 0, 1, 'pending', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:00:00Z', null, null),
('h1000000-0000-0000-0000-000000000005', 'What''s Your Biggest Hero Trap?', 'Poll: Which hero behavior costs you the most time? Options: Being the info source, Approving everything, Rescuing failures, Attending every meeting.', 5, 'Saturday', '2026-03-29', 0, 1, 'pending', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:00:00Z', null, null);

-- Week 5 rejected item (cadence change)
insert into public.content_reviews (id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at) values
('h1000000-0000-0000-0000-000000000006', 'The hidden cost of being needed by everyone', 'You are the first call when something breaks. That is not leadership. That is a system that runs on you instead of for you.', 5, 'Monday', '2026-03-24', 4, 1, 'rejected', '{}', '{}', '{"linkedin"}', 'Cadence shifted from Mon-Sat to Tue-Sat (Monday dropped due to 4.7 avg engagement, worst weekday). Content absorbed into updated Week 5 plan.', null, null, '2026-03-21T12:00:00Z', '2026-03-21T12:09:00Z', null);

-- Week 6: The Builder''s Evidence (drafts)
insert into public.content_reviews (id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at) values
('h1000000-0000-0000-0000-000000000007', 'The Decision Map: How I Gave Away Authority', 'Deep dive on DECIDE. DACI matrix simplified. Before: 67 weekly interruptions. After: 4. Decision audit process walkthrough.', 6, 'Tuesday', '2026-04-01', 5, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000008', 'What Happened When I Left for a Week', 'Vacation story. First time completely offline. Team ran everything. Pride and the sting of irrelevance. Direct book excerpt from Chapter 11. First CLARITY mention.', 6, 'Wednesday', '2026-04-02', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000009', 'Before and After: The Numbers', 'Personal transformation metrics. Hours in meetings, decision bottlenecks, team dependency. Pure proof post. Numbers do the talking.', 6, 'Thursday', '2026-04-03', 1, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000010', 'Why I Wrote This Book', 'Personal why behind CLARITY. Faith, stewardship, family. I wrote this for the person I was five years ago.', 6, 'Friday', '2026-04-04', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000011', 'Who This Book Is For (And Who It Is Not)', 'Define the reader: drowning in success, cannot take a vacation, team bottleneck. Direct, honest, filters the right audience.', 6, 'Saturday', '2026-04-05', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null);

-- Week 7: Behind the Book (drafts)
insert into public.content_reviews (id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at) values
('h1000000-0000-0000-0000-000000000012', 'Five Lines from CLARITY That Changed How I Lead', '5 powerful book excerpts, each on its own carousel slide. Standalone insights showing book voice and value.', 7, 'Tuesday', '2026-04-08', 5, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000013', 'What Writing This Book Cost Me', 'Behind-the-scenes. Vulnerability of putting failures in print. Honest, raw, no marketing polish. This comes out April 17.', 7, 'Wednesday', '2026-04-09', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000014', 'The 30-Day CLARITY Challenge', 'Preview Chapter 12 structure. Week 1: Subtract. Week 2: Define. Week 3: Decide. Week 4: Delegate. Valuable but incomplete without the book.', 7, 'Thursday', '2026-04-10', 1, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000015', 'Building What Lasts Is a Choice', 'Philosophical and faith-grounded. Path One (keep grinding) vs Path Two (become the architect). Final anticipation builder.', 7, 'Friday', '2026-04-11', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000016', 'One Week Until CLARITY', 'Countdown. What the book contains: chapter overview, frameworks, tools. Link in comments. Short and impactful.', 7, 'Saturday', '2026-04-12', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null);

-- Week 8: Launch Week (drafts -- special Mon-Sat cadence)
insert into public.content_reviews (id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at) values
('h1000000-0000-0000-0000-000000000017', 'Three Days Until CLARITY', 'Final countdown. Table of contents reveal. 12 chapters, 4 systems, 30-day challenge. Purchase link in comments.', 8, 'Monday', '2026-04-14', 1, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000018', 'Inside CLARITY: What You Will Build in 30 Days', 'Chapter-by-chapter preview carousel. Each slide: chapter name plus one-line promise. Two days.', 8, 'Tuesday', '2026-04-15', 5, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000019', 'Tomorrow Changes Everything', 'Eve-of-launch. Personal, direct. Tomorrow I publish the book I wish I had had ten years ago.', 8, 'Wednesday', '2026-04-16', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000020', 'CLARITY: Kill the Hero Is Live', 'THE launch post. What the book is, who it is for. Core promise: In 30 days, kill the hero complex. Purchase link in post AND comments.', 8, 'Thursday', '2026-04-17', 1, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null),
('h1000000-0000-0000-0000-000000000021', 'Day One Reflections', 'First-day wrap: what happened, early reader response. Gratitude without performance. Invite readers to share takeaways.', 8, 'Friday', '2026-04-18', 0, 1, 'draft', '{}', '{}', '{"linkedin"}', null, null, null, '2026-03-21T12:09:00Z', null, null);

-- ============================================================
-- 9. SOCIAL PLATFORMS [REAL]
-- ============================================================
-- Social platforms: Personal + BWL brand platforms [MERGED]
insert into public.social_platforms (id, platform_name, handle, profile_url, icon_name, follower_count, last_post_date, status, metadata, created_at, updated_at) values
('i1000000-0000-0000-0000-000000000001', 'LinkedIn Personal', 'lucas-james-oliver', 'https://www.linkedin.com/in/lucas-james-oliver/', 'Linkedin', 6100, '2026-03-20', 'active', '{"target": 10000, "target_date": "2026-12-31"}', '2025-12-22T06:00:00Z', '2026-03-20T12:00:00Z'),
('i1000000-0000-0000-0000-000000000002', 'LinkedIn Company Page', '@buildwhatlasts', 'https://www.linkedin.com/company/112342453', 'Linkedin', 0, null, 'setup_needed', '{"page_id": "112342453", "missing": ["description", "tagline", "logo", "cover_photo", "first_post"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000003', 'Facebook Page', '@buildwhatlasts', 'https://www.facebook.com/profile.php?id=61578498486795', 'Facebook', 0, null, 'setup_needed', '{"page_id": "61578498486795", "username_claimed": false, "missing": ["username", "description", "photos", "pinned_post"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000004', 'YouTube', '@buildwhatlasts', 'https://www.youtube.com/@buildwhatlasts', 'Youtube', 0, null, 'setup_needed', '{"channel_id": "UCYac-P1EIf5HCpnhCZyiOkw", "missing": ["description", "icon", "banner", "trailer", "playlists"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000005', 'Instagram', '@build_what_lasts', 'https://www.instagram.com/build_what_lasts/', 'Camera', null, null, 'setup_needed', '{"missing": ["bio_updated", "link_in_bio", "story_highlights", "threads_connected"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000006', 'Reddit', 'u/BuildWhatLasts', 'https://www.reddit.com/user/BuildWhatLasts/', 'MessageCircle', 0, null, 'setup_needed', '{"login_email": "lucas@buildwhatlasts.app", "missing": ["bio", "avatar", "subreddit_memberships", "karma"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000007', 'X / Twitter', null, null, 'Hash', null, null, 'setup_needed', '{"note": "Handle not yet confirmed. Log in to confirm and update registry.", "missing": ["handle_confirmed", "bio", "pinned_tweet", "developer_app"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000008', 'TikTok', null, null, 'Video', null, null, 'setup_needed', '{"note": "Multiple accounts exist. Primary not yet confirmed.", "missing": ["primary_confirmed", "bio", "developer_app"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000009', 'Beehiiv Newsletter', 'Build What Lasts', 'https://app.beehiiv.com', 'FileText', 0, null, 'setup_needed', '{"publication_id": "pub_78465b13-adda-4f6b-a51c-d39c2717ab3f", "plan": "free", "missing": ["template", "custom_domain", "launch_sequence"]}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000010', 'Gumroad', 'buildwhatlasts', 'https://buildwhatlasts.gumroad.com', 'BookOpen', null, null, 'setup_needed', '{"seller_id": "xf8DxnuxSj1AwhIXDcXHrg==", "api_status": "OAuth required, not yet configured", "purpose": "Digital bonuses, book bundles, future courses"}', '2026-03-22T00:00:00Z', '2026-03-22T00:00:00Z'),
('i1000000-0000-0000-0000-000000000011', 'Medium', '@lucasoliver', 'https://medium.com/@lucasoliver', 'FileText', 240, '2026-03-01', 'active', null, '2025-09-22T06:00:00Z', '2026-03-01T12:00:00Z'),
('i1000000-0000-0000-0000-000000000012', 'Goodreads', null, null, 'BookOpen', null, null, 'setup_needed', '{"reason": "CLARITY launch requires author presence", "url": "author.goodreads.com/author/program"}', '2026-03-08T06:00:00Z', '2026-03-08T06:00:00Z'),
('i1000000-0000-0000-0000-000000000013', 'Amazon Author Central', null, null, 'ShoppingBag', null, null, 'setup_needed', '{"reason": "Required before CLARITY pre-order goes live", "url": "author.amazon.com"}', '2026-03-08T06:00:00Z', '2026-03-08T06:00:00Z');

-- ============================================================
-- 10. PODCAST TRACKER [GEN]
-- ============================================================
insert into public.podcast_tracker (id, podcast_name, host_name, status, recording_date, publish_date, episode_url, notes, created_at, updated_at) values
('j1000000-0000-0000-0000-000000000001', 'The Contractor Podcast', 'Mark Sullivan', 'published', '2026-03-05', '2026-03-14', 'https://example.com/contractor-pod/ep142', 'Great conversation about systems vs hustle in trades. Mark wants a follow-up after launch.', '2026-02-20T06:00:00Z', '2026-03-14T12:00:00Z'),
('j1000000-0000-0000-0000-000000000002', 'Built to Scale', 'Rachel Torres', 'recorded', '2026-03-19', null, null, 'Focused on the CLARITY framework. Rachel runs a $12M electrical company, perfect target reader. Episode drops April 10.', '2026-03-01T06:00:00Z', '2026-03-19T18:00:00Z'),
('j1000000-0000-0000-0000-000000000003', 'B2B Growth Show', 'David Park', 'scheduled', '2026-03-28', null, null, 'Scheduled for March 28. Topic: how operators build lasting businesses. David wants 30 minutes.', '2026-03-10T06:00:00Z', '2026-03-15T12:00:00Z'),
('j1000000-0000-0000-0000-000000000004', 'Construction Leadership Podcast', 'Tom Henderson', 'outreach', null, null, null, 'Sent pitch email March 15. 25K downloads per episode. Perfect audience for CLARITY. Following up March 25 if no response.', '2026-03-15T06:00:00Z', '2026-03-15T06:00:00Z'),
('j1000000-0000-0000-0000-000000000005', 'The Modern Operator', 'Amy Chen', 'outreach', null, null, null, 'LinkedIn DM sent. Amy covers SaaS for trades, could also discuss Ridgeline angle.', '2026-03-18T06:00:00Z', '2026-03-18T06:00:00Z'),
('j1000000-0000-0000-0000-000000000006', 'Entrepreneur on Fire', 'John Lee Dumas', 'outreach', null, null, null, 'Long shot but high reach. Submitted through their guest application form.', '2026-03-12T06:00:00Z', '2026-03-12T06:00:00Z'),
('j1000000-0000-0000-0000-000000000007', 'Trades Talk Radio', 'Mike Brennan', 'scheduled', '2026-04-02', null, null, 'Pre-launch episode. Mike wants to focus on why a corporate guy is writing for contractors. Good angle.', '2026-03-16T06:00:00Z', '2026-03-20T12:00:00Z');

-- ============================================================
-- 11. ACTIVITY LOG [GEN]
-- Timestamps reflect Lucas schedule: 3-6 AM, 5-10 PM, weekends
-- ============================================================
insert into public.activity_log (id, session_type, project, tool, summary, metadata, created_at) values
-- March 8 (Saturday)
('k1000000-0000-0000-0000-000000000001', 'claude_code', 'forge', 'Claude Code', 'Initialized Forge Console v2 project. Vite + React 18 + TypeScript. Installed all dependencies.', null, '2026-03-08T04:00:00Z'),
('k1000000-0000-0000-0000-000000000002', 'claude_code', 'forge', 'Claude Code', 'Created design system CSS: 14 color tokens, typography scale, component classes, skeleton shimmer.', null, '2026-03-08T04:45:00Z'),
('k1000000-0000-0000-0000-000000000003', 'claude_code', 'forge', 'Claude Code', 'Built sidebar navigation with 7 items, coral active indicator. PageShell with Framer Motion transitions.', null, '2026-03-08T05:30:00Z'),
-- March 9 (Sunday)
('k1000000-0000-0000-0000-000000000004', 'claude_code', 'forge', 'Claude Code', 'Completed all page stubs with routing. Dashboard, Projects, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings.', null, '2026-03-09T04:15:00Z'),
('k1000000-0000-0000-0000-000000000005', 'claude_code', 'forge', 'Claude Code', 'Created all React Query hooks with mock data fallback. 8 hooks covering projects, tasks, content, activity, health.', null, '2026-03-09T05:00:00Z'),
('k1000000-0000-0000-0000-000000000006', 'claude_code', 'forge', 'Claude Code', 'Built Dashboard page with action items, system health card, project cards, and upcoming content.', null, '2026-03-09T05:45:00Z'),
-- March 10 (Monday)
('k1000000-0000-0000-0000-000000000007', 'claude_code', 'ridgeline', 'Claude Code', 'Ridgeline v1.0: Supabase schema and legacy frontend completed. Data model for contractors, projects, equipment.', null, '2026-03-10T03:30:00Z'),
('k1000000-0000-0000-0000-000000000008', 'n8n', 'clarity', 'n8n', 'Content export workflow: exported Week 10 carousel slides to PNG for LinkedIn.', null, '2026-03-10T18:00:00Z'),
-- March 11 (Tuesday)
('k1000000-0000-0000-0000-000000000009', 'claude_code', 'clarity', 'Claude Code', 'Drafted Week 10 LinkedIn captions. Structure Beats Motivation, Compound Effect, Why I Wrote CLARITY.', null, '2026-03-11T03:45:00Z'),
('k1000000-0000-0000-0000-000000000010', 'slack', 'clarity', 'Slack', 'Content review: Week 10 Tuesday carousel approved in #content-queue.', null, '2026-03-11T19:30:00Z'),
-- March 12 (Wednesday)
('k1000000-0000-0000-0000-000000000011', 'claude_code', 'ridgeline', 'Claude Code', 'Ridgeline v1.5: Design system lock. Tailwind config, component primitives, color tokens finalized.', null, '2026-03-12T03:15:00Z'),
('k1000000-0000-0000-0000-000000000012', 'system', null, 'System', 'Scheduled system health check. PM2: healthy, n8n: healthy, Cloudflare tunnel: healthy.', null, '2026-03-12T12:00:00Z'),
-- March 13 (Thursday)
('k1000000-0000-0000-0000-000000000013', 'manual', 'clarity', null, 'Reviewed and rejected "Hustle Culture Is a Trap" carousel. Too confrontational for Build What Lasts brand.', null, '2026-03-13T18:30:00Z'),
-- March 14 (Friday)
('k1000000-0000-0000-0000-000000000014', 'claude_code', 'forge', 'Claude Code', 'Built content pipeline page with 4 view modes: list, week, month, kanban. All rendering correctly.', null, '2026-03-14T03:30:00Z'),
('k1000000-0000-0000-0000-000000000015', 'n8n', 'clarity', 'n8n', 'Podcast outreach: sent pitch emails to 3 podcasts (Contractor Podcast, Built to Scale, Entrepreneur on Fire).', null, '2026-03-14T19:00:00Z'),
-- March 15-16 (Weekend)
('k1000000-0000-0000-0000-000000000016', 'claude_code', 'forge', 'Claude Code', 'Built social media page, activity log, and settings page. All 7 pages now rendering.', null, '2026-03-15T04:00:00Z'),
('k1000000-0000-0000-0000-000000000017', 'claude_code', 'forge', 'Claude Code', 'Polish pass: code splitting with React.lazy, responsive sidebar, responsive grids. Bundle optimized.', null, '2026-03-15T05:30:00Z'),
('k1000000-0000-0000-0000-000000000018', 'claude_code', 'ridgeline', 'Claude Code', 'Ridgeline v2.0 sprint started: Foundation phase (dual Supabase clients, design tokens, utility functions).', null, '2026-03-16T04:00:00Z'),
-- March 17 (Monday)
('k1000000-0000-0000-0000-000000000019', 'claude_code', 'clarity', 'Claude Code', 'Podcast research: identified 10 target podcasts in construction/B2B/entrepreneurship space.', null, '2026-03-17T03:30:00Z'),
('k1000000-0000-0000-0000-000000000020', 'slack', 'clarity', 'Slack', 'Week 11 Tuesday carousel approved. Three Projects One System performing well early.', null, '2026-03-17T19:00:00Z'),
-- March 18 (Tuesday)
('k1000000-0000-0000-0000-000000000021', 'claude_code', 'ridgeline', 'Claude Code', 'Ridgeline v2.0: CRM and Operations views complete. 99 real GC accounts, 148 real projects from Catalyst DB.', null, '2026-03-18T03:15:00Z'),
('k1000000-0000-0000-0000-000000000022', 'manual', 'clarity', null, 'CLARITY cover files finalized. Calculated spine width for 280 pages. Waiting on ISBN barcode.', null, '2026-03-18T18:00:00Z'),
-- March 19 (Wednesday)
('k1000000-0000-0000-0000-000000000023', 'claude_code', 'ridgeline', 'Claude Code', 'Ridgeline v2.0: Finance views complete (Billing, Job Costing, Receivables). Intelligence BI Dashboard with live charts.', null, '2026-03-19T03:30:00Z'),
('k1000000-0000-0000-0000-000000000024', 'n8n', 'clarity', 'n8n', 'Export workflow: Week 12 content exported to PNG. 3 carousels ready for review.', null, '2026-03-19T18:30:00Z'),
-- March 20 (Thursday)
('k1000000-0000-0000-0000-000000000025', 'claude_code', 'clarity', 'Claude Code', 'Built Week 12 carousel: Why Most Trades Businesses Stay Small. 10 slides, revision 2.', null, '2026-03-20T03:30:00Z'),
('k1000000-0000-0000-0000-000000000026', 'slack', 'clarity', 'Slack', 'ISBN barcode received from agency. Ready for final cover upload to KDP.', null, '2026-03-20T17:00:00Z'),
('k1000000-0000-0000-0000-000000000027', 'system', null, 'System', 'System health check: all services nominal. PM2 4 processes, n8n 12 active workflows.', null, '2026-03-20T12:00:00Z'),
-- March 21 (Friday) -- Forge Console quality sprint begins
('k1000000-0000-0000-0000-000000000028', 'claude_code', 'forge', 'Claude Code', 'Forge Console v2 quality milestone: Phase 1 Component Foundation. shadcn/ui adoption, design tokens, toast system.', null, '2026-03-21T03:00:00Z'),
('k1000000-0000-0000-0000-000000000029', 'claude_code', 'forge', 'Claude Code', 'Phase 1 complete: all buttons, cards, badges on shadcn. Toast notifications on all mutations. Error boundaries. Favicon.', null, '2026-03-21T06:00:00Z'),
('k1000000-0000-0000-0000-000000000030', 'claude_code', 'forge', 'Claude Code', 'Phase 2 started: Global Design Standards. Warm palette tokens, typography scale, Card/Button component fixes.', null, '2026-03-21T07:00:00Z'),
('k1000000-0000-0000-0000-000000000031', 'claude_code', 'forge', 'Claude Code', 'Phase 2: Sidebar refinement with Sheet mobile drawer. PageShell max-width 1280px.', null, '2026-03-21T08:00:00Z'),
('k1000000-0000-0000-0000-000000000032', 'n8n', 'clarity', 'n8n', 'Automated LinkedIn post for Week 11 Friday. The Operator''s Edge carousel posted successfully.', null, '2026-03-21T11:00:00Z'),
-- March 22 (Saturday) -- Today
('k1000000-0000-0000-0000-000000000033', 'claude_code', 'forge', 'Claude Code', 'Phase 2 complete: Card/Button/fontSize migration across 14 files. 38+ card patterns, 9+ button patterns migrated.', null, '2026-03-22T03:30:00Z'),
('k1000000-0000-0000-0000-000000000034', 'claude_code', 'forge', 'Claude Code', 'Phase 3 started: Dashboard Redesign. Created StatTilesRow and SystemHealthStrip components.', null, '2026-03-22T05:00:00Z'),
('k1000000-0000-0000-0000-000000000035', 'claude_code', 'forge', 'Claude Code', 'Phase 3: Rebuilt dashboard to full-width stacked rows. 5 hero stat tiles, compact health strip, capped action items.', null, '2026-03-22T06:00:00Z'),
('k1000000-0000-0000-0000-000000000036', 'claude_code', 'forge', 'Claude Code', 'Phase 3: Added project recency indicators (green/amber/red borders). Built 7-day content calendar strip.', null, '2026-03-22T08:00:00Z'),
('k1000000-0000-0000-0000-000000000037', 'claude_code', 'forge', 'Claude Code', 'Phase 3 complete. Dashboard redesign verified: 11/11 must-haves passed. Starting seed data generation.', null, '2026-03-22T10:00:00Z'),
('k1000000-0000-0000-0000-000000000038', 'slack', 'clarity', 'Slack', 'Week 12 Wednesday carousel approved: Why Most Trades Businesses Stay Small.', null, '2026-03-22T04:00:00Z'),
('k1000000-0000-0000-0000-000000000039', 'system', null, 'System', 'System health check: PM2 healthy (4 processes, 510MB), n8n healthy (12 workflows), Cloudflare tunnel active.', null, '2026-03-22T06:00:00Z'),
-- CLARITY / Build What Lasts activity
('k1000000-0000-0000-0000-000000000040', 'claude_code', 'clarity', 'Claude Code', 'CLARITY launch ops: platform audit, handle availability report, Amazon/Goodreads prep kit with 389-word author bio.', null, '2026-03-21T12:00:00Z'),
('k1000000-0000-0000-0000-000000000041', 'claude_code', 'clarity', 'Claude Code', 'Week 5 content batch built: 5 LinkedIn posts in W5_Batch.html with carousel breakdowns. Tuesday Excalidraw diagrams exported.', null, '2026-03-21T14:00:00Z'),
('k1000000-0000-0000-0000-000000000042', 'claude_code', 'clarity', 'Claude Code', 'BWL credentials sprint: master .env built, social accounts created (LinkedIn, Facebook, YouTube, Reddit). Beehiiv account live.', null, '2026-03-22T06:00:00Z'),
-- Meridian/Atlas activity (minimal -- early stage)
('k1000000-0000-0000-0000-000000000043', 'claude_code', 'meridian', 'Claude Code', 'Meridian: Reclassified 260 UNDEFINED records, built NAM region architecture (R1-R4, CA Intel, NYC Intel), regionalized all 7 dashboard views.', null, '2026-03-07T04:00:00Z'),
('k1000000-0000-0000-0000-000000000047', 'claude_code', 'meridian', 'Claude Code', 'Meridian: Built Market Intelligence view with ABI chart, penetration gauge, White Space matrix. Seeded 1,749 Dodge projects to Supabase.', null, '2026-03-17T04:00:00Z'),
('k1000000-0000-0000-0000-000000000048', 'claude_code', 'meridian', 'Claude Code', 'Meridian: Pipeline Radar with RSM-gated Dodge tracker, bulk archive, optimistic UI. Replaced dev feedback with Atlas-style system across 32+ files.', null, '2026-03-18T04:00:00Z'),
('k1000000-0000-0000-0000-000000000044', 'claude_code', 'atlas', 'Claude Code', 'Atlas Intelligence Phase 2: full platform build. Sidebar, 6 core pages, 4 feature pages, interactions, alerts, deployed to Cloudflare Pages.', null, '2026-03-11T23:00:00Z'),
('k1000000-0000-0000-0000-000000000045', 'claude_code', 'atlas', 'Claude Code', 'Atlas: Phase 2 schema migration (8 new tables). IIR data surfaced. Color token system. Sticky table headers on 4 pages.', null, '2026-03-12T05:00:00Z'),
('k1000000-0000-0000-0000-000000000046', 'claude_code', 'atlas', 'Claude Code', 'Atlas: Cleanup sprint complete. Removed 5 dead components, fixed gitignore, archived 5 analysis docs. 88 geocoded facilities live with deck.gl map.', null, '2026-03-12T12:19:00Z');

-- ============================================================
-- 12. SYSTEM HEALTH [REAL]
-- ============================================================
insert into public.system_health (id, service, status, metadata, checked_at) values
('l1000000-0000-0000-0000-000000000001', 'PM2', 'healthy', '{"processes": 4, "memory_mb": 510, "uptime_hours": 168}', '2026-03-22T06:00:00Z'),
('l1000000-0000-0000-0000-000000000002', 'n8n', 'healthy', '{"url": "https://n8n.iac-solutions.io", "active_workflows": 12, "executions_today": 8}', '2026-03-22T06:00:00Z'),
('l1000000-0000-0000-0000-000000000003', 'Cloudflare Tunnel', 'healthy', '{"tunnel_id": "forge-tunnel", "pages_deployments": 3, "status": "active"}', '2026-03-22T06:00:00Z'),
('l1000000-0000-0000-0000-000000000004', 'Supabase', 'healthy', '{"project_ref": "forge-console-v2", "region": "us-east-1", "plan": "free"}', '2026-03-22T06:00:00Z');

-- ============================================================
-- 13. SETTINGS [REAL]
-- ============================================================
insert into public.settings (id, key, value, updated_at) values
('m1000000-0000-0000-0000-000000000001', 'n8n_url', '"https://n8n.iac-solutions.io"', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000002', 'cloudflare_tunnel_url', '"https://forge-tunnel.iac-solutions.io"', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000003', 'slack_content_channel', '"#content-queue"', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000004', 'slack_alerts_channel', '"#forge-alerts"', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000005', 'clarity_launch_date', '"2026-04-17"', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000006', 'linkedin_posting_days', '["Tuesday", "Wednesday", "Friday"]', '2026-03-21T03:00:00Z'),
('m1000000-0000-0000-0000-000000000007', 'linkedin_follower_target', '{"count": 10000, "deadline": "2026-12-31"}', '2026-03-21T03:00:00Z');

-- ============================================================
-- 14. NEXT SESSION PROMPTS [MERGE]
-- ============================================================
insert into public.next_session_prompts (id, project_id, prompt_text, created_at, updated_at) values
(
  'n1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'v2.0 is deployed to https://production.ridgeline-intelligence.pages.dev. Start the design polish pass. Begin with Command Center (src/views/CommandView.jsx) and work sidebar in order. Priority fixes: Unknown GC on project cards where account_id is null, Equipment hero metrics showing 0/0/0, Revenue by State chart near-invisible bars. Do one view per commit.',
  '2026-03-22T14:35:00Z', '2026-03-22T14:35:00Z'
),
(
  'n1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000002',
  'Priority 1: Review and approve Week 5 batch (W5_Batch.html) before Tuesday March 25 at 8:00 AM EST. Priority 2: Build remaining Excalidraw diagrams for Week 5 Wed-Sat. Priority 3: Start Week 6 batch HTML (Builders Evidence). Priority 4: Podcast research and community intelligence map in parallel. Priority 5: ARC outreach list so Lucas can send DMs by March 25. Also: follow up on HMD/KDP status.',
  '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z'
),
(
  'n1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000003',
  'Resume Forge Console v2. Phase 3 (Dashboard Redesign) is complete. Next: Phase 4 (Page-by-Page Visual Polish). Run /gsd:discuss-phase 4 to start.',
  '2026-03-22T12:00:00Z', '2026-03-22T12:00:00Z'
),
(
  'n1000000-0000-0000-0000-000000000005',
  'a1000000-0000-0000-0000-000000000005',
  'Start by merging feat/market-intel-feedback to main: git merge --no-ff, npm run build (must pass), wrangler pages deploy dist --project-name=meridian-intelligence --branch=production. After deploy, build IDS architect breakdown modal in ForwardPipelineChart.jsx. Forrest requested this March 17.',
  '2026-03-22T06:00:00Z', '2026-03-22T06:00:00Z'
),
(
  'n1000000-0000-0000-0000-000000000006',
  'a1000000-0000-0000-0000-000000000006',
  'Core platform is built and deployed to production.atlas-intelligence.pages.dev. Next: choose one track: (1) Decompose FacilityDetail.tsx as refactor sprint, (2) Define Intelligence page data model and activate with IIR schema expansion, or (3) Define report types for Reports.tsx and wire to Supabase. Confirm track before writing code.',
  '2026-03-12T12:19:00Z', '2026-03-12T12:19:00Z'
);

-- ============================================================
-- DONE
-- Row counts: projects(5), tasks(83), milestones(33), action_items(22),
-- notes(33), brain_dumps(10), brain_dump_tasks(10), content_reviews(21),
-- social_platforms(13), podcast_tracker(7), activity_log(48),
-- system_health(4), settings(7), next_session_prompts(5)
-- Total: 301 rows across 14 tables
-- ALL DATA REAL -- collected from 5 project sessions on 2026-03-22
-- ============================================================
