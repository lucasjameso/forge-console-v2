# Phase 9: Settings Overhaul + Feedback Page + Mobile Capture + Deployment

**Source:** Page feedback system (Supabase `page_feedback` table) + original roadmap
**Captured:** 2026-03-22
**Total Items:** 24 settings/feedback suggestions + 4 mobile capture requirements + 4 deployment requirements
**Phase Goal:** Complete the app with settings depth, dedicated feedback page, mobile capture, and production deployment

---

## Settings Suggestions (12 items)

### STSUG-01: Feedback Log as its own page
Move to /feedback route. Add to sidebar as secondary nav item or icon button in sidebar footer. Full-page width for content, filtering, expanded workflow. Alternative: first/default tab in Settings.

### STSUG-02: Feedback-to-action workflow with Claude Code integration
Feedback -> Open -> Claude Code reads entries -> creates plan -> "Proposed Plan" appears in log -> Lucas approves -> Claude executes -> status updates In Progress -> Done -> resolution auto-populated. Suggestions accumulate in backlog for GSD planning.

### STSUG-03: User preferences section
Default project, default pipeline view, notification toggles per event, date format, time zone, compact mode toggle, keyboard shortcuts toggle + reference. Store in Supabase settings table as key-value pairs.

### STSUG-04: Data management tools
Export all data (JSON/SQL). Export by project. Import JSON. Clear mock data (typed confirmation). Database stats (table names + row counts). Danger zone: "Reset all data" + "Delete account" with typed confirmation.

### STSUG-05: Integration configuration editing
Click env var value to edit inline. Save to Supabase settings table. Masked values for secrets. "Build-time" vs "Runtime" labels. Future: app reads runtime config from Supabase.

### STSUG-06: Webhook and notification testing panel
Slack: "Send test message" to webhook. n8n: "Trigger test workflow" with health check. Claude API: "Test parsing" with sample dump. Supabase: "Test query" with SELECT count(*). Show response time, status, error message. Last tested timestamp.

### STSUG-07: Agent configuration section (future-ready)
Collapsed/hidden by default. Agent registry (Orchestrator, PM agents). Model assignment dropdown. Token budget. Autonomy level slider. Agent health stats. "Coming Soon" with link to architecture docs.

### STSUG-08: Appearance and theme settings
Theme: Light/Dark/Auto. Accent color: coral/blue/green/purple/custom hex. Font size: Small/Default/Large. Sidebar position: Left/Right/Hidden. Card density: Comfortable/Compact/Spacious. Live preview. "Reset to defaults."

### STSUG-09: Keyboard shortcut reference panel
All shortcuts organized by page. Key + description. Toggle on/off. Print-friendly. "?" key opens modal overlay from any page.

### STSUG-10: API usage and cost tracking
Claude API: tokens today/week/month, estimated cost, 30-day chart, breakdown by feature. Supabase: database size, row counts, API calls. n8n: executions today/week. Cloudflare: deployments, bandwidth.

### STSUG-11: System health dashboard (expanded)
Each service as full card: status, uptime % (7 days), response time chart (24h), last 5 status changes. Alerting config per service. History timeline of changes.

### STSUG-12: Backup and restore settings
Export settings JSON (preferences, integration config, feedback). Import JSON to restore. Auto-backup toggle (weekly to Supabase). Multi-machine support.

---

## Activity Log Suggestions (filed under Settings in feedback, allocated here)

Covered in Phase 7 spec. See PHASE-07-SOCIAL-ACTIVITY-SPEC.md.

---

## Mobile Capture Requirements (from original roadmap)

### MOBL-01: Purpose-built /capture route
Mobile-optimized layout. No sidebar, no desktop navigation. Clean, focused capture screen.

### MOBL-02: Large text input and submit button
Large textarea optimized for iPhone. Big submit button easy to tap. Mic button prominent for voice capture.

### MOBL-03: Optimistic submit
Shows "Saved" immediately on tap. Data syncs to Supabase in background. Rollback on error with retry.

### MOBL-04: Captured text in brain_dumps table
Writes to same brain_dumps table. Visible on desktop Brain Dump page for processing. Project selector pills available.

---

## Deployment Requirements (from original roadmap)

### DEPL-01: Claude API proxy
Cloudflare Function proxy so API key never in client bundle. All Claude API calls route through proxy.

### DEPL-02: Production build to Cloudflare Pages
Deploy via Wrangler without errors. CI/CD pipeline.

### DEPL-03: Production environment variables
All env vars (Supabase, Claude, n8n, Slack) configured in Cloudflare Pages dashboard.

### DEPL-04: Smoke test on live URL
All pages load. Navigation works. Data displays. Brain dump capture works. Content pipeline renders.

---

## Data Requirements

### New Tables
- `user_preferences` (id, key, value, updated_at)
- `system_health_history` (id, service_name, status, response_time_ms, checked_at)
- `agent_config` (id, agent_name, model, token_budget, autonomy_level, is_active, updated_at)

### Infrastructure
- Cloudflare Pages project configured
- Cloudflare Function for Claude API proxy
- Wrangler deployment pipeline
- Production environment variables

## Traceability
Settings: STSUG-01 through STSUG-12 + STFIX-01 through STFIX-12 (fixes in Phase 4)
Mobile: MOBL-01 through MOBL-04
Deployment: DEPL-01 through DEPL-04
