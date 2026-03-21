-- Forge Console v2 -- Supabase Schema
-- Run this in the Supabase SQL editor to create all tables

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  slug text not null unique,
  description text not null default '',
  status text not null default 'active' check (status in ('active', 'paused', 'completed', 'archived')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  progress_pct integer not null default 0 check (progress_pct >= 0 and progress_pct <= 100),
  current_phase text,
  metadata jsonb,
  github_url text,
  supabase_ref text,
  cloudflare_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Tasks
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'todo' check (status in ('todo', 'in_progress', 'done')),
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  assignee text,
  column_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Project Notes
create table if not exists public.project_notes (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  content text not null,
  tag text,
  created_at timestamptz not null default now()
);

-- Project Milestones
create table if not exists public.project_milestones (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null,
  target_date date,
  status text not null default 'upcoming' check (status in ('upcoming', 'in_progress', 'done')),
  phase_number integer not null default 1,
  created_at timestamptz not null default now()
);

-- Project Action Items
create table if not exists public.project_action_items (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  description text not null,
  urgency text not null default 'medium' check (urgency in ('high', 'medium', 'low')),
  source text,
  status text not null default 'open' check (status in ('open', 'resolved', 'snoozed')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Brain Dumps
create table if not exists public.brain_dumps (
  id uuid default uuid_generate_v4() primary key,
  raw_text text not null,
  parsed_output jsonb,
  project_hint text,
  status text not null default 'pending' check (status in ('pending', 'processed', 'dismissed')),
  created_at timestamptz not null default now()
);

-- Brain Dump Tasks
create table if not exists public.brain_dump_tasks (
  id uuid default uuid_generate_v4() primary key,
  brain_dump_id uuid not null references public.brain_dumps(id) on delete cascade,
  description text not null,
  project text not null,
  priority text not null default 'medium' check (priority in ('high', 'medium', 'low')),
  status text not null default 'pending' check (status in ('pending', 'assigned', 'done')),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

-- Content Reviews
create table if not exists public.content_reviews (
  id uuid default uuid_generate_v4() primary key,
  post_title text not null,
  caption text,
  week_number integer not null,
  day_label text not null,
  scheduled_date date,
  slide_count integer not null default 0,
  revision integer not null default 1,
  status text not null default 'draft' check (status in ('draft', 'pending', 'approved', 'rejected', 'posted')),
  export_paths text[] not null default '{}',
  excalidraw_paths text[] not null default '{}',
  platforms text[] not null default '{}',
  feedback text,
  slack_ts text,
  slack_channel text,
  created_at timestamptz not null default now(),
  resolved_at timestamptz,
  posted_at timestamptz
);

-- Social Platforms
create table if not exists public.social_platforms (
  id uuid default uuid_generate_v4() primary key,
  platform_name text not null,
  handle text,
  profile_url text,
  icon_name text not null,
  follower_count integer,
  last_post_date date,
  status text not null default 'active' check (status in ('active', 'setup_needed', 'inactive')),
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Podcast Tracker
create table if not exists public.podcast_tracker (
  id uuid default uuid_generate_v4() primary key,
  podcast_name text not null,
  host_name text,
  status text not null default 'outreach' check (status in ('outreach', 'scheduled', 'recorded', 'published')),
  recording_date date,
  publish_date date,
  episode_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Activity Log
create table if not exists public.activity_log (
  id uuid default uuid_generate_v4() primary key,
  session_type text not null check (session_type in ('claude_code', 'n8n', 'slack', 'cowork', 'system', 'manual')),
  project text,
  tool text,
  summary text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

-- System Health
create table if not exists public.system_health (
  id uuid default uuid_generate_v4() primary key,
  service text not null,
  status text not null default 'healthy' check (status in ('healthy', 'degraded', 'down')),
  metadata jsonb,
  checked_at timestamptz not null default now()
);

-- Settings
create table if not exists public.settings (
  id uuid default uuid_generate_v4() primary key,
  key text not null unique,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- Next Session Prompts
create table if not exists public.next_session_prompts (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid not null references public.projects(id) on delete cascade unique,
  prompt_text text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS (no auth needed since single user, but good practice)
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.project_notes enable row level security;
alter table public.project_milestones enable row level security;
alter table public.project_action_items enable row level security;
alter table public.brain_dumps enable row level security;
alter table public.brain_dump_tasks enable row level security;
alter table public.content_reviews enable row level security;
alter table public.social_platforms enable row level security;
alter table public.podcast_tracker enable row level security;
alter table public.activity_log enable row level security;
alter table public.system_health enable row level security;
alter table public.settings enable row level security;
alter table public.next_session_prompts enable row level security;

-- Allow anon access (single user app, no auth)
create policy "Allow anon all" on public.projects for all using (true) with check (true);
create policy "Allow anon all" on public.tasks for all using (true) with check (true);
create policy "Allow anon all" on public.project_notes for all using (true) with check (true);
create policy "Allow anon all" on public.project_milestones for all using (true) with check (true);
create policy "Allow anon all" on public.project_action_items for all using (true) with check (true);
create policy "Allow anon all" on public.brain_dumps for all using (true) with check (true);
create policy "Allow anon all" on public.brain_dump_tasks for all using (true) with check (true);
create policy "Allow anon all" on public.content_reviews for all using (true) with check (true);
create policy "Allow anon all" on public.social_platforms for all using (true) with check (true);
create policy "Allow anon all" on public.podcast_tracker for all using (true) with check (true);
create policy "Allow anon all" on public.activity_log for all using (true) with check (true);
create policy "Allow anon all" on public.system_health for all using (true) with check (true);
create policy "Allow anon all" on public.settings for all using (true) with check (true);
create policy "Allow anon all" on public.next_session_prompts for all using (true) with check (true);
