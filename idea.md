# Forge Console — Product Requirements Document
# For: /gsd:new-project --auto @idea.md
# Owner: Lucas Oliver | IAC Solutions
# Date: March 21, 2026
# Timeline: 2-3 days with QC gates between phases
# Priority: High — core productivity infrastructure

---

## Product Vision

Forge Console is a personal command center that gives Lucas Oliver full visibility and control over his three active builds (Ridgeline Intelligence, CLARITY Book Launch, Forge Console), his content pipeline, and his agent system, from a single light-mode web app that runs locally and deploys to Cloudflare Pages.

This is NOT a monitoring dashboard. It is a productivity hub where Lucas takes action: reviews content, dispatches agent tasks, tracks project progress, captures ideas, and manages his entire Build What Lasts ecosystem from one place.

**Single user. No auth. No multi-tenant. One person's command center.**

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Frontend | Vite + React 18 + TypeScript | NOT Next.js. Vite for zero-friction Cloudflare Pages deployment. |
| Styling | Tailwind CSS v3 | Light mode primary. Apple-inspired, clean and airy. |
| UI Components | shadcn/ui (slate base) | Heavily customized to match design system. |
| Animations | Framer Motion | Spring physics, layout animations, page transitions. |
| Data Fetching | @tanstack/react-query | All data through React Query hooks. |
| Database | Supabase (Postgres + Realtime) | ALL persistent data lives in Supabase. |
| AI | Anthropic API (Claude Sonnet) | Brain dump parsing. Called directly from frontend. |
| Icons | Lucide React | Only icon library. |
| Deployment | Cloudflare Pages via Wrangler | Local dev on localhost:5173. |
| Runtime | Node 24.14.0 | Forge Mac Mini (M4 2024). |

### Environment Details (Forge Mac Mini)
- Node 24.14.0 / npm 11.9.0
- Bun 1.3.10 (available, use npm for this project)
- Wrangler 4.71.0
- Claude Code 2.1.77 (dangerous mode enabled)
- n8n running via PM2 at https://n8n.iac-solutions.io
- Cloudflare tunnel active
- Slack app "Forge Alerts" with 5 channels
- GSD plugin installed

---

## Design System

### Visual Direction
**Clean and airy. Apple-inspired. Lots of whitespace. Subtle shadows.**

Think: Apple's developer documentation meets Linear's clarity meets Notion's breathing room. This should feel like a premium product, not a hackathon demo.

### Light Mode Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --bg-root | #f8f9fb | Page background |
| --bg-surface | #ffffff | Cards, panels |
| --bg-elevated | #f1f3f7 | Hover states, secondary surfaces |
| --bg-active | #e8ebf0 | Active/pressed states |
| --border-subtle | rgba(0, 0, 0, 0.06) | Card borders, dividers |
| --border-default | rgba(0, 0, 0, 0.10) | Input borders, stronger dividers |
| --border-strong | rgba(0, 0, 0, 0.15) | Focus rings, hover borders |
| --text-primary | #111318 | Headlines, primary content |
| --text-secondary | #5f6878 | Body text, descriptions |
| --text-tertiary | #9aa1ad | Captions, timestamps, meta |
| --accent-coral | #C75B3F | Primary accent, CTAs, active indicators |
| --accent-navy | #1B3A52 | Secondary accent, badges, tags |
| --status-success | #16a34a | Approved, healthy, done |
| --status-warning | #d97706 | Pending, degraded |
| --status-error | #dc2626 | Rejected, down, blocker |
| --status-info | #2563eb | Informational, in-progress |

### Typography
- **Font:** Inter (Google Fonts import)
- **Page titles:** 28px, weight 600, --text-primary, letter-spacing -0.02em
- **Section headers:** 18px, weight 600, --text-primary
- **Card titles:** 15px, weight 500, --text-primary
- **Body text:** 14px, weight 400, --text-secondary
- **Captions/meta:** 12px, weight 400, --text-tertiary
- **Stat numbers:** 36px, weight 700

### Component Patterns
- **Cards:** White background, 1px subtle border, 14px radius, 24px padding. Subtle shadow on hover (0 2px 8px rgba(0,0,0,0.06)). No heavy drop shadows.
- **Buttons:** Coral fill for primary actions. Ghost/outline for secondary. Scale 0.97 on press with spring-back (Framer Motion whileTap).
- **Badges:** Pill-shaped, uppercase 11px, 600 weight. Background tint + text color per status.
- **Inputs:** White background, 1px default border, 10px radius. Coral border on focus with subtle glow.
- **Loading:** Skeleton shimmer states. Never spinners. Never blank screens.
- **Transitions:** Page transitions via AnimatePresence (fade + slide). Card stagger on mount. Ease: cubic-bezier(0.16, 1, 0.3, 1).

### Spacing and Layout
- **Generous whitespace.** Cards should breathe. No cramming.
- **Max content width:** 1280px centered on large screens
- **Card gaps:** 20-24px between cards
- **Section gaps:** 32-40px between major sections
- **Sidebar width:** 220px (desktop), collapsed to icons on tablet, hamburger on mobile

### Absolute Rules
- NO em dashes anywhere in the app (code, comments, UI text). Use "---" or rewrite.
- NO spinners. Skeletons only.
- NO `any` type in TypeScript. Strict mode.
- NO hardcoded colors in components. CSS variables only.
- NO generic AI aesthetics. Every screen should feel intentionally designed.

---

## Navigation Structure

Seven top-level items in the sidebar:

| # | Label | Icon (Lucide) | Route | Purpose |
|---|-------|--------------|-------|---------|
| 1 | Dashboard | LayoutDashboard | / | Home. What needs attention today. |
| 2 | Projects | FolderKanban | /projects | Hub for Ridgeline, CLARITY, Forge. Click into sub-pages. |
| 3 | Brain Dump | Brain | /brain-dump | Quick capture. Agent dispatch. Parsed task inbox. |
| 4 | Content Pipeline | Layers | /pipeline | Carousel management, approvals, scheduling. |
| 5 | Social Media | Share2 | /social | Platform tracking, handles, calendar, posting status. |
| 6 | Activity Log | Activity | /activity | Timeline of all agent and system activity. |
| 7 | Settings | Settings | /settings | Configuration for all integrations. |

Active state: Coral left border accent, slightly bolder text, subtle background tint.

---

## Page Specifications

### PAGE 1: Dashboard (/)

The landing page. Shows what needs attention right now.

**Header area:**
- "Good morning/afternoon/evening, Lucas" greeting (time-based)
- Current date and time (updating every minute)
- System status badge (green dot + "All Systems Go" or yellow/red if issues)

**Section 1: Action Items (most prominent)**
- Cards or rows showing things that need Lucas's attention NOW
- Sources: pending content approvals, unresolved brain dump tasks, project blockers
- Each item: title, source project badge, time since created, action button
- If zero items: clean empty state "Nothing needs your attention right now"

**Section 2: System Health**
- Three cards in a row: PM2, n8n, Disk/Cloudflare
- Each: service name, status indicator (colored dot), one-line detail, last checked time
- Data source: Supabase system_health table (n8n writes snapshots every 5 min)

**Section 3: Project Quick Glance**
- Three project cards side by side (Ridgeline, CLARITY, Forge)
- Each: project name, progress bar with percentage, next milestone, last activity timestamp
- Clicking a card navigates to /projects/:slug

**Section 4: Upcoming Content**
- Horizontal scroll of upcoming scheduled posts (next 2 weeks)
- Each card: day label, post title, slide count, status badge, platform icon
- "View pipeline" link to /pipeline

**Layout notes:**
- Two-column layout for sections 1+2 (action items takes 2/3, system health takes 1/3) OR full-width stacked if that reads cleaner. Let the designer (Claude Code) judge based on content density.
- Generous spacing between sections. This page should NOT feel packed.

---

### PAGE 2: Projects (/projects)

**Overview page (/projects):**
- Three large project cards, one for each active build
- Each card: project name, status badge, priority dot, progress bar, one-line description, last activity, "Open" button
- Cards should be substantial (not tiny) with room to breathe

**Project sub-page (/projects/:slug):**

Each project gets a full dedicated page with this shared template:

**Top bar:** Project name, status badge, priority, back arrow to /projects

**Row 1: Attention Required (most prominent)**
- Action items, blockers, decisions needed
- Each item: description, urgency badge, created date, action button (resolve, snooze, dispatch)
- If none: "No blockers. All clear." with subtle checkmark

**Row 2: System Health for This Project**
- Relevant service statuses (e.g., for Ridgeline: Supabase project status, Cloudflare Pages deployment, last Claude Code session)
- Compact row of status indicators

**Row 3: Recent Activity**
- Last 48 hours of activity on this project
- Each entry: timestamp, tool icon, summary text
- "View all" links to /activity filtered by this project

**Row 4: Progress**
- Visual progress bar with percentage
- Phase labels along the bar (e.g., Phase 1: DB Schema [done], Phase 2: Design System [done], Phase 3: Demo Data [in progress])
- Milestone timeline below: upcoming milestones with target dates

**Row 5: Task Board (mini kanban)**
- Three columns: To Do, In Progress, Done
- Cards within columns: task title, priority dot, assignee (agent or manual)
- Drag and drop between columns (or click to change status)
- "Add task" button at top of To Do column

**Row 6: Notes and Decisions Log**
- Running journal of decisions, context, and notes
- Each entry: date, text, optional tag
- "Add note" text input at top
- Chronological, newest first

**Row 7: Quick Actions Bar**
- "Dispatch agent task" button (opens modal: describe task, select agent type)
- "Add note" button
- "Create task" button
- "Open in Claude Code" (copies the /gsd:resume-work command or next session prompt)

**Row 8: Linked Resources**
- Links to: GitHub repo, Supabase project dashboard, Cloudflare Pages, relevant docs
- Each as a compact linked card with icon + label + URL

**Row 9: Next Session Prompt**
- A text block showing what the next Claude Code session should work on
- Editable. Saved to Supabase. Copied with one click.

**Active projects:**

| Project | Slug | Description |
|---------|------|-------------|
| Ridgeline Intelligence | ridgeline | Full web application platform for specialty trade contractors. CRM, project management, job tracking, scheduling, estimating. BI analytics as bolt-on module. |
| CLARITY Book Launch | clarity | First book in Build What Lasts series. Launching April 17, 2026. Content pipeline, social media, marketing automation, pre-launch sales. |
| Forge Console | forge | This project. Unified command center for the autonomous agent system. |

---

### PAGE 3: Brain Dump (/brain-dump)

**Top: Capture Area**
- Large text input at top of page, always visible
- Placeholder: "What's on your mind? Dump it here..."
- Submit on Enter (Shift+Enter for newlines) or click Send button
- Optional: project tag selector next to the input (auto-assign to a project)

**Processing:**
- On submit, text is saved to Supabase `brain_dumps` table
- Simultaneously, a Claude API call (Sonnet) parses the text:
  - Extracts action items
  - Assigns each to a project (Ridgeline, CLARITY, Forge, or Unassigned)
  - Estimates priority (high, medium, low)
  - Identifies any deadlines mentioned
- Parsed results appear below the input in real-time (streaming if possible)

**Below: Parsed Results Feed**
- Most recent dump at top, showing:
  - Raw text (collapsible, shown by default)
  - Parsed tasks as cards: task description, assigned project badge, priority dot, status (pending/assigned/done)
  - Each task card has: "Add to project" button (creates a task on the project's task board), "Dismiss" button
  - Timestamp of when the dump was captured

**History:**
- Scrollable list of all past brain dumps
- Each entry: timestamp, first line preview, number of parsed tasks, status summary
- Click to expand and see full dump + parsed output

**Data model:**
```
brain_dumps table:
  id, raw_text, parsed_output (jsonb), project_hint, status, created_at

brain_dump_tasks table:
  id, brain_dump_id, description, project, priority, status (pending/assigned/done), created_at, resolved_at
```

---

### PAGE 4: Content Pipeline (/pipeline)

**View Toggle (top bar):**
Four view modes, switchable via pill tabs:
1. **Week view** (default): Week-by-week with day rows
2. **Month view**: Full calendar grid
3. **List view**: Flat list grouped by week
4. **Kanban**: Columns for Draft > Pending Review > Approved > Posted

**Content cards show:**
- Post title
- Day and date
- Week number
- Slide count (e.g., "8 slides")
- Status badge (draft, pending, approved, rejected, posted)
- Platform icons (LinkedIn, etc.)
- Revision number if > 1

**Expanded content detail (click a card):**
- PNG slide previews in a grid (2x4 or scrollable row)
  - Source: Supabase storage or local filesystem path
  - If not available: gray placeholder with "Slide N" label
- Post caption/copy (editable textarea)
- Approve button (green)
- Reject button (red, opens feedback modal)
- Schedule picker (date + time)
- Platform checklist (which platforms to post to)
- Link to source Excalidraw file
- Revision history (if multiple revisions)

**Approval modal (on reject):**
- Overlay with backdrop blur
- Textarea for feedback
- "Submit Feedback" button
- Feedback saved to Supabase, triggers re-export pipeline via n8n

**Data model:**
```
content_reviews table:
  id, post_title, caption, week_number, day_label, scheduled_date,
  slide_count, revision, status (draft/pending/approved/rejected/posted),
  export_paths (text[]), excalidraw_paths (text[]),
  platforms (text[]), feedback, slack_ts, slack_channel,
  created_at, resolved_at, posted_at
```

---

### PAGE 5: Social Media (/social)

**Platform Registry**
- Card for each platform Lucas tracks
- Each card: platform name, icon, handle/username, profile URL, status (active/setup needed)
- Cards are configurable in Settings

**Platforms to track (MVP):**

| Platform | Type | Key Metrics |
|----------|------|-------------|
| LinkedIn | Primary content | Follower count (current: 6,100, target: 10,000), post frequency, engagement rate |
| Goodreads | CLARITY launch | Author profile status, book listing status |
| Amazon Author Central | CLARITY launch | Author page status, book listing, reviews |
| BookBub | CLARITY launch | Author profile, follower count |
| Medium / Substack | Long-form | Subscriber count, post count |
| TikTok | Video | Follower count, video count |
| Podcast Guest Tracker | Outreach | Outreach sent, scheduled, completed, published |

**For each platform card:**
- Handle/username (linked to profile)
- Key metric (follower count or equivalent)
- Last post date
- Content scheduled count
- Quick link to open the platform

**Podcast Guest Tracker (special section):**
- Table/list view: show name, podcast name, status (outreach/scheduled/recorded/published), date, link
- "Add podcast" button

**Content Calendar (cross-platform view):**
- Calendar or timeline showing all scheduled content across all platforms
- Color-coded by platform
- Links back to Content Pipeline for carousel-specific items

**Data model:**
```
social_platforms table:
  id, platform_name, handle, profile_url, icon_name,
  follower_count, last_post_date, status, metadata (jsonb),
  created_at, updated_at

podcast_tracker table:
  id, podcast_name, host_name, status (outreach/scheduled/recorded/published),
  recording_date, publish_date, episode_url, notes,
  created_at, updated_at
```

---

### PAGE 6: Activity Log (/activity)

**Filter Bar (top):**
- Project filter chips: All, Ridgeline, CLARITY, Forge, BWL (multi-select, toggle on/off)
- Tool filter chips: All, Claude Code, n8n, Slack, Cowork (multi-select)
- Date range picker
- Search input (keyword search across summaries)

**Timeline:**
- Vertical timeline with left gutter line connecting entries
- Each entry: timestamp (monospace), tool icon, project badge (colored pill), summary text
- Entries are chronological (newest first)
- Infinite scroll or "Load more" button

**Data model:**
```
activity_log table:
  id, session_type (claude_code/n8n/slack/cowork/system/manual),
  project, tool, summary, metadata (jsonb),
  created_at
```

---

### PAGE 7: Settings (/settings)

**Organized in sections:**

**Section 1: Integrations**
- Supabase: URL and anon key fields (per project if needed, or global)
- n8n: Instance URL field
- Cloudflare: Tunnel status endpoint field
- Slack: Webhook URLs and channel mapping (channel name + webhook URL pairs)
- Claude API: API key field (for brain dump parsing)

**Section 2: Social Media Handles**
- Table of platform + handle pairs
- Add/edit/remove rows
- This feeds the Social Media page

**Section 3: About**
- App version
- Build date
- Link to GitHub repo

**Data model:**
```
settings table:
  id, key (text unique), value (jsonb), updated_at

Examples:
  key: "supabase_url", value: "https://..."
  key: "supabase_anon_key", value: "..."
  key: "n8n_url", value: "https://n8n.iac-solutions.io"
  key: "claude_api_key", value: "sk-ant-..."
  key: "slack_channels", value: [{"name": "#forge-alerts", "webhook": "..."}]
```

Note: For MVP, settings can be stored in Supabase. API keys should be stored in .env.local for the Claude API key specifically (never in the database). Other non-secret config can go in Supabase.

---

## Supabase Schema Summary

Tables to create:

1. **projects** — id, name, slug, description, status, priority, progress_pct, current_phase, metadata, github_url, supabase_ref, cloudflare_url, created_at, updated_at
2. **tasks** — id, project_id (FK), title, description, status (todo/in_progress/done), priority, assignee, column_order, created_at, updated_at, resolved_at
3. **project_notes** — id, project_id (FK), content, tag, created_at
4. **project_milestones** — id, project_id (FK), title, target_date, status (upcoming/in_progress/done), phase_number, created_at
5. **project_action_items** — id, project_id (FK), description, urgency, source, status (open/resolved/snoozed), created_at, resolved_at
6. **brain_dumps** — id, raw_text, parsed_output (jsonb), project_hint, status, created_at
7. **brain_dump_tasks** — id, brain_dump_id (FK), description, project, priority, status (pending/assigned/done), created_at, resolved_at
8. **content_reviews** — id, post_title, caption, week_number, day_label, scheduled_date, slide_count, revision, status, export_paths, excalidraw_paths, platforms, feedback, slack_ts, slack_channel, created_at, resolved_at, posted_at
9. **social_platforms** — id, platform_name, handle, profile_url, icon_name, follower_count, last_post_date, status, metadata, created_at, updated_at
10. **podcast_tracker** — id, podcast_name, host_name, status, recording_date, publish_date, episode_url, notes, created_at, updated_at
11. **activity_log** — id, session_type, project, tool, summary, metadata, created_at
12. **system_health** — id, service, status (healthy/degraded/down), metadata, checked_at
13. **settings** — id, key (unique), value (jsonb), updated_at
14. **next_session_prompts** — id, project_id (FK), prompt_text, created_at, updated_at

---

## Quality Requirements

### Performance
- First contentful paint under 1 second on localhost
- All page transitions under 300ms
- React Query caching so repeat navigations feel instant
- Skeleton states appear within 100ms of navigation

### Visual Quality
- Every screen should look like it was designed by a professional
- Consistent spacing, consistent type hierarchy, consistent color usage
- No orphaned content, no cramped layouts, no misaligned elements
- Test at 1440px (MacBook Pro), 1920px (external monitor), 768px (tablet), 375px (phone)

### Code Quality
- TypeScript strict mode, zero `any` types
- All components have proper TypeScript interfaces
- React Query for ALL data fetching (no raw useEffect + fetch)
- Framer Motion for ALL animations (no raw CSS transitions for interactive elements)
- CSS variables for ALL colors (no hardcoded hex in components)
- npm run build must pass with zero errors after every phase

### UX Quality
- Every page must render with data or graceful empty states (never blank)
- Mock data as fallback when Supabase is not connected
- Error states show helpful messages, not stack traces
- Loading states use skeleton shimmer, never spinners
- All interactive elements have hover and active states

---

## GSD Build Phases (Suggested)

This is a suggestion for GSD. Let GSD research and adjust as needed.

| Phase | Name | Scope | Est. Hours |
|-------|------|-------|-----------|
| 1 | Foundation | Project init, Supabase schema, design system CSS, layout shell, routing | 3-4 |
| 2 | Dashboard | Dashboard page with all 4 sections, system health hooks, action items | 3-4 |
| 3 | Projects | Projects overview + sub-page template with all 9 rows. Seed 3 projects. | 4-5 |
| 4 | Brain Dump | Capture input, Claude API integration, parsed results feed, history | 3-4 |
| 5 | Content Pipeline | 4 view modes, content cards, expanded detail, approval modal | 4-5 |
| 6 | Social + Activity + Settings | Social media platform registry, activity timeline, settings page | 3-4 |
| 7 | Polish + QC | Responsive pass, empty states, error states, animation polish, visual audit | 3-4 |
| 8 | Deploy | Cloudflare Pages deployment via Wrangler, production .env, final smoke test | 1-2 |

Total estimate: 24-32 hours of build time across 2-3 days.

---

## What Success Looks Like

Lucas opens http://localhost:5173 and:

1. Sees a clean, Apple-quality light-mode interface with his name in a greeting
2. Immediately knows what needs his attention (action items front and center)
3. Can click into any of his three projects and see full dashboards with tasks, progress, and context
4. Can brain dump a wall of text and watch it get parsed into organized tasks in real-time
5. Can review his content pipeline, approve/reject carousels, and schedule posts
6. Can see all his social media handles and their status in one place
7. Can search and filter his activity history across all tools and projects
8. Can configure all integrations from a clean settings page
9. Every page feels spacious, polished, and intentionally designed
10. Nothing is broken, nothing is blank, nothing looks rushed
