# Phase 7: Social Media + Activity Log -- All Suggestions

**Source:** Page feedback system (Supabase `page_feedback` table)
**Captured:** 2026-03-22
**Total Items:** 24 social media suggestions + 24 activity log suggestions (fixes in Phase 4)
**Phase Goal:** Transform both pages from static directories into dynamic dashboards with analytics, workflows, and real-time updates

---

## Social Media Suggestions (12 items)

### SSUG-01: Platform setup wizard with step-by-step checklists
Click "Setup Needed" card opens wizard with platform-specific steps (e.g., Amazon Author Central: create account, claim profile, add bio, link book, upload photo, add reviews, mark complete). Progress stored in Supabase. Resumes where left off.

### SSUG-02: Follower growth tracking with historical chart
New table: `follower_history` (id, platform_id, follower_count, recorded_at). Daily recording via n8n cron or manual entry. Platform card: tiny sparkline (30 days) next to count. Click for full Recharts graph. Show 7-day/30-day change, growth rate. LinkedIn: projected 10K date.

### SSUG-03: Cross-platform content calendar integration
Mini weekly strip (Dashboard style) showing content across all platforms. Color-coded by platform. Summary: "LinkedIn: 3 posts. Medium: 0. TikTok: 0." Click navigates to Content Pipeline filtered by platform.

### SSUG-04: Podcast guest tracker as dedicated section
Section header: "Podcast Outreach" + count. Table: Podcast Name, Host, Status, Recording Date, Episode URL, Notes. Status badges: Outreach Sent=blue, Scheduled=amber, Recorded=green, Published=coral, Declined=gray. "Add Podcast" button. Clickable rows expand. Sort by status/date.

### SSUG-05: Platform health scoring system
Score per platform based on posting frequency, growth rate, engagement, recency. Circular progress ring on each card (green/amber/red). Overall "Social Health: 42%" in overview stats.

### SSUG-06: Quick-post composer per platform
"Quick Post" on active cards. Platform-specific: LinkedIn (3000 char, hashtags, image), Medium (title+body+tags), TikTok (script, hook, duration). Saves to content_reviews. Copies to clipboard + "Open [Platform]" button.

### SSUG-07: Handle availability checker
"Check availability" in setup wizard. Checks public profile URL pattern. Green "Available" or red "Taken". Suggests alternatives. Critical for CLARITY launch handle audit.

### SSUG-08: Platform grouping by purpose
Collapsible sections: Primary Content (LinkedIn, Medium, Substack -- always expanded), CLARITY Launch (Amazon, Goodreads, BookBub, Gumroad -- expanded near launch), Brand Presence (Facebook, Instagram, LinkedIn Company, YouTube -- collapsed), Exploration (TikTok, Reddit, X -- collapsed). Headers with group name + count + toggle.

### SSUG-09: Social media analytics dashboard
Aggregated analytics tab/section: total reach + weekly change, posting frequency chart (4 weeks), platform comparison (growth rate, engagement), top 5 posts, goal tracking (LinkedIn 10K, launch readiness), auto-generated weekly summary.

### SSUG-10: Competitor/inspiration tracking
"Inspiration" section. Add by platform + handle. Shows: name, platform, follower count, notes. Optional posting frequency benchmark. Feeds content strategy comparison.

### SSUG-11: Platform connection status monitoring
"Connected" badge with green dot for API-configured platforms. Hourly n8n health check. Token expiry: red "Disconnected" + "Reconnect". Connection history log.

### SSUG-12: Social media playbook integration
"Content Strategy" link in header. Per-platform strategy notes stored in Supabase, editable. Visible on each card as collapsed "Strategy" section. Agent system uses for content suggestions.

---

## Activity Log Suggestions (12 items)

### ASUG-01: Daily and weekly progress summaries (auto-generated)
Daily summary at top of each day group: "Today: 6 activities across 3 projects. 2 phases completed (Forge). 1 content approved (CLARITY)." Collapsible. Weekly summary on Mondays: key metrics, tasks completed, phases advanced, hours tracked.

### ASUG-02: Activity timeline with visual branches per project
"Branch view" toggle: parallel vertical lanes per project, color-coded. Cross-project events span all lanes. Shows at a glance which projects got attention.

### ASUG-03: Session grouping and duration tracking
Consecutive Claude Code entries within 2h window grouped into "Session" card: "Claude Code session: Forge Console, 2.5h, 6 actions". Expand for details. Weekly totals: "8.5h Forge, 3h Ridgeline, 1.5h CLARITY".

### ASUG-04: Filtering by date range with calendar picker
DateRangePicker alongside filters. Quick presets: Today, Yesterday, This week, Last week, This month, Last 30 days. Active range as chip with X to clear. Heatmap highlights selection.

### ASUG-05: Activity entry detail expansion with related context
Click entry to expand: full text, related items (links to phases, content), files changed, duration, "View in project" button, "Add note" button for audit trail.

### ASUG-06: Activity-based productivity analytics
Collapsible analytics: activity by hour (heatmap), by project (chart), by tool, streaks, velocity (tasks/week trending), focus score (% on priority project).

### ASUG-07: Real-time activity feed with live updates
Supabase Realtime subscriptions. New entries slide in with highlight animation. "New activity" notification when scrolled down: "3 new entries" -- click to scroll top.

### ASUG-08: Export activity log as report
"Export" button: Today/This week/This month/Custom range. Formats: Markdown, PDF, clipboard. Grouped by project then day with summary stats.

### ASUG-09: Saved filter presets
Save filter combinations as named presets. Quick-access pills above filter bar. Stored in Supabase settings. One-click load.

### ASUG-10: Activity log as agent audit trail
New tool types: Orchestrator, PM agents, Sub-agents. Agent entries show: which agent, what decided, what changed, why. Decision trail entries. "Approve"/"Revert" buttons.

### ASUG-11: Pinned/starred important entries
Star icon on entries. Gold left border + star icon when starred. "Starred" filter tab. Persist across views. Highlight reel of project journey.

### ASUG-12: Activity notifications and digest
Daily digest via Slack/email. Configurable: time, projects, channel. In-app notification badge on Activity Log nav. "Mark all as read".

---

## Data Requirements

### New Tables
- `follower_history` (id, platform_id, follower_count, recorded_at)
- `platform_setup_progress` (id, platform_id, steps_json, completed_steps, updated_at)
- `podcast_guests` (id, podcast_name, host, status, recording_date, episode_url, notes, created_at)
- `platform_strategy_notes` (id, platform_id, strategy_text, updated_at)
- `saved_filter_presets` (id, name, filters_json, page, created_at)

### Modified Tables
- `social_platforms`: add `group` (primary/launch/brand/exploration), `sort_order`, `health_score`
- `activity_log`: add `is_starred`, `session_id`, `entry_tier` (major/standard/background)

## Traceability
Social: SSUG-01 through SSUG-12 + SFIX-01 through SFIX-12 (fixes in Phase 4)
Activity: ASUG-01 through ASUG-12 + AFIX-01 through AFIX-12 (fixes in Phase 4)
