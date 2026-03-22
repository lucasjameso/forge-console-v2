# Feature Research

**Domain:** Personal productivity command center (single-user, desktop-primary, agent-augmented)
**Researched:** 2026-03-22
**Confidence:** HIGH (well-understood domain, existing codebase analyzed, clear user needs)

## Feature Landscape

### Table Stakes (Users Expect These)

Features that must work well for the console to feel like a real command center rather than a prototype. "Users" here means Lucas -- a single power user who will abandon any page that feels unfinished or clunky.

#### Dashboard -- Information Hierarchy

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Time-contextual greeting with today's priorities** | First thing seen every morning; sets the tone. Must surface what matters NOW, not just what exists. | LOW | Already exists but needs hierarchy refinement -- priorities should sort by urgency + deadline, not just list order |
| **At-a-glance project health cards** | With 3 active builds, knowing which project needs attention without clicking into each is non-negotiable | LOW | Existing ProjectQuickGlanceCard needs progress bars, next-action callouts, and "days since last touched" indicators |
| **Action items aggregated across all projects** | The dashboard must be the single "what do I need to do right now" view | MEDIUM | Existing ActionItemsCard pulls from mock data. Needs cross-project aggregation with urgency-based sorting and visual weight |
| **Upcoming content preview (next 7 days)** | Content pipeline is the daily driver; next posts should be visible without navigating away | LOW | Existing UpcomingContentCard works. Needs scheduled-date ordering and status color coding |
| **System health status strip** | Knowing PM2/n8n/Cloudflare are alive is table stakes for an agent command center | LOW | Already exists. Keep compact -- 3-dot strip or inline bar, not a full card |
| **Dense but scannable layout with clear visual hierarchy** | Premium dashboards use progressive disclosure: most critical info reads in 2 seconds, details on hover/click | MEDIUM | Current dashboard is 4 stacked cards with no density. Needs grid layout (2-3 columns), typographic hierarchy (stat numbers large, labels small), and whitespace that breathes without wasting space |
| **Skeleton loading states (no spinners)** | Already a project constraint -- shimmer skeletons during data fetch | LOW | Already implemented. Maintain. |
| **Consistent component styling** | Premium apps have zero visual inconsistency. Every button, card, badge must look like it belongs. | MEDIUM | shadcn/ui adoption solves this systematically |
| **Toast/feedback on actions** | Clicking "approve" or "save" with no feedback feels broken. Every action needs confirmation. | LOW | sonner or similar toast library, wire to mutation callbacks |
| **Error boundaries** | Crashed white screen destroys trust. Graceful error states per section. | LOW | React ErrorBoundary around each page and critical sections |

#### Project Detail -- Command Center Depth

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Progress bar with phase label** | Visual progress is the first thing you check on any project | LOW | Already exists and works well |
| **Milestone timeline** | Knowing what is done vs upcoming gives temporal context | LOW | Already exists. Could improve with relative date labels ("3 days away" vs raw dates) |
| **Task kanban (todo/in-progress/done)** | Drag-and-drop task boards are table stakes for any project management surface | LOW | Already exists with HTML5 drag-and-drop. Works. |
| **Action items section ("Needs Your Attention")** | Urgency-colored items that surface what blocks progress | LOW | Already exists. Good pattern. |
| **Notes and decisions log** | Project context accumulates; decisions need a home | LOW | Already exists with inline add form. |
| **Linked resources (GitHub, Cloudflare, Supabase)** | One-click access to external tools per project | LOW | Already exists. |
| **Next session prompt (copy to clipboard)** | Unique to agent-augmented workflow; tells Claude Code where to resume | LOW | Already exists. Key differentiator -- keep prominent. |

#### Content Pipeline

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Multiple view modes (list, week, month, kanban)** | Content needs to be seen in temporal and status contexts | LOW | Already implemented with all 4 views |
| **Approve/reject workflow with feedback** | Content review is the core pipeline action; must be fast and obvious | LOW | Already implemented in detail modal |
| **Status badges (draft/pending/approved/rejected/posted)** | Visual pipeline stage at a glance | LOW | Already implemented |
| **Caption display and editing** | Captions are the content -- must be readable and editable | MEDIUM | Caption display exists but editing does not. PROJECT.md lists "post caption editing" as active requirement. Needs inline edit with save/cancel. |
| **Scheduled date visibility** | Knowing when a post goes live drives urgency | LOW | Already shown in card and detail modal |

#### Brain Dump / Quick Capture

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Free-text input area** | Brain dumps are unstructured by definition | LOW | Already exists with cmd+enter submit |
| **AI parsing into structured tasks** | The entire value proposition -- type chaos, get structure | LOW | Already implemented with Claude API + local fallback |
| **Parsed result display with project + priority tags** | Must see what the AI extracted before acting on it | LOW | Already implemented with animated task cards |
| **History of past brain dumps** | Need to review what was dumped and whether it was processed | LOW | Already implemented with expandable history |

#### Social Media

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| **Platform cards with status** | Know which platforms are active vs need setup | LOW | Already exists |
| **Follower counts with goal progress** | Seeing progress toward 10K is motivational and accountability-driving | LOW | Already exists with animated progress bars |
| **Last post date per platform** | "How long since I posted?" drives urgency | LOW | Already exists |
| **Profile links** | One-click to open the actual platform | LOW | Already exists |

### Differentiators (Competitive Advantage)

Features that make this feel like a premium personal command center rather than a generic dashboard. These justify building custom rather than using Notion.

#### Dashboard -- Premium Information Design

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **"Focus block" -- single most important thing** | Every morning should start with ONE thing. A prominent card that says "Your one priority today: [X]". Derived from highest-urgency action item with nearest deadline. | MEDIUM | New feature. Requires cross-project priority algorithm. Display as a visually distinct top-of-dashboard element with coral accent. |
| **Stat counters with sparkline trends** | Static numbers feel dead. "12 tasks completed this week" with a 7-day mini chart makes the dashboard feel alive. Apply to: tasks completed, content posts, brain dumps processed. | MEDIUM | Requires storing historical counts or computing from activity log timestamps. Simple SVG sparkline component (no charting library). |
| **"Days since" indicators on project cards** | "Last touched 6 hours ago" vs "Last touched 12 days ago" instantly shows which project is neglected. Color code: green (<24h), amber (1-3 days), red (>3 days). | LOW | Compute from activity_log or project.updated_at. Pure display logic. |
| **Content calendar strip (next 7 days inline)** | A horizontal strip showing next 7 days with content slots filled/empty. Denser than navigating to Content Pipeline for a quick look. | MEDIUM | New component. Pull from content_reviews with scheduled_date in next 7 days. Render as horizontal day strip with post dots. |
| **Command palette (Cmd+K)** | Instant navigation anywhere. Type "brain dump" or "ridgeline tasks" and jump. Power-user delight for keyboard-first workflow. | MEDIUM | cmdk library, index all pages + projects + recent items. |

#### Project Detail -- Real Command Center

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Quick action buttons ("Dispatch agent", "New task", "Brain dump to project")** | One-click agent dispatch via n8n is what makes this a command center, not just a dashboard. "Brain dump to project" pre-fills context. | MEDIUM | n8n webhook integration (endpoint in .env). Task inline creation needs form. Brain dump routing needs project_hint param. |
| **Project health score (computed)** | Single number combining: tasks overdue, days since last activity, milestone slippage, open action items. A "build health" badge (green/amber/red). | MEDIUM | Computed client-side from existing data. No new schema needed. Display as colored badge on project card. |
| **Brain dump tasks flowing into project task board** | Parsed brain dump tasks tagged with a project should appear as assignable items in that project's kanban. "Assign to project" action on each parsed task. | HIGH | PROJECT.md lists this as active requirement. Needs: brain_dump_tasks wiring, mutation to create real task from brain dump task, UI for assign action. Critical data flow connecting brain dump to project management. |

#### Content Pipeline -- Workflow Depth

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Inline caption editing** | Edit captions without opening a modal. Click text, edit in place, save. Reduces friction for daily content review. | MEDIUM | PROJECT.md lists this. Needs contentEditable or textarea swap with optimistic update via React Query mutation. |
| **Slack webhook on approve/reject** | Approval fires Slack notification to #content-queue. Closes integration loop. | LOW | PROJECT.md lists this. Simple fetch POST to Slack webhook URL from .env on status mutation. |
| **Content performance annotations** | After posting, annotate with impressions/engagement. Manual input for v1 -- no API scraping. | MEDIUM | New fields on content_reviews: impressions, engagement_rate. Entered manually post-posting. |
| **Drag-and-drop status changes in kanban** | Move content between status columns by dragging. More natural than modal-only status changes for batch processing. | MEDIUM | Kanban exists but status changes are modal-only. Add drag handlers similar to project task kanban. |

#### Brain Dump -- Intelligence Layer

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Task assignment flow (parsed task to project board)** | The killer feature: brain dump produces tasks, each one-click assignable to a project kanban. Eliminates manual re-entry. | HIGH | Critical differentiator. "Assign to [Project]" button on each parsed task, mutation to create task, status update on brain_dump_task. |
| **Smart project detection** | AI detects which project a task belongs to based on context ("finish the demo data" -> Ridgeline). | LOW | Claude API prompt already hints at project detection. Verify prompt includes project names for accuracy. |
| **Batch processing of pending items** | Queue view showing all unprocessed brain dump tasks with bulk assign/dismiss actions. | MEDIUM | New view mode: "Pending" tab showing brain_dump_tasks with status "pending", grouped by source dump. |

#### Social Media -- Cross-Platform Intelligence

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Cross-platform content calendar** | Unified calendar showing what is posted where and when across all platforms. Prevents double-booking posting windows. | MEDIUM | PROJECT.md lists this. New component pulling from content_reviews with platform grouping and color coding. |
| **Posting cadence tracking** | "LinkedIn: 3x this week (target: 5x)" -- shows whether frequency meets goals. Motivational. | LOW | Compute from content_reviews with status "posted" in current week. Display as progress indicators on platform cards. |

#### Podcast Guest Tracker

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Pipeline table (outreach/scheduled/recorded/published)** | CRM-style pipeline for podcast appearances. Track from cold outreach through published episode. | MEDIUM | PROJECT.md lists this. Schema exists (PodcastEntry with status pipeline). Needs table UI with status column, color badges, inline date/notes editing. |
| **Outreach follow-up tracking** | "Pitched 5 days ago, no response" signals. Know which podcasts need follow-up and when. | LOW | Compute from created_at + status. Display "days since outreach" on entries with outreach status. |

#### Mobile Capture Experience

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| **Purpose-built mobile capture page** | Not responsive desktop. Single-purpose: text input + submit. Opens on iPhone, type a thought, close. Parsed later at desk. | MEDIUM | PROJECT.md specifies this explicitly. Separate route (/capture) with mobile-optimized layout: large text input, big submit button, no sidebar, no navigation. Writes to brain_dumps table. |
| **Instant submit with confirmation** | On mobile, capture must feel instant. Optimistic UI: show "Saved" immediately, sync in background. | LOW | React Query optimistic mutation + simple success state. |
| **Auto-tag with timestamp context** | Captured thoughts tagged with when (automatic) and optionally where (geolocation if permitted). Helps later processing. | LOW | Timestamp automatic. Geolocation optional metadata field. |

### Anti-Features (Commonly Requested, Often Problematic)

Features to deliberately NOT build.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| **Real-time collaboration / multi-user** | Standard in project tools | Single user app. Auth, permissions, conflict resolution, real-time sync add massive complexity for zero value. | Keep single-user. No auth. |
| **Dark mode** | Common preference | PROJECT.md scopes to light mode. Design system built for light. Both themes doubles CSS maintenance. | Light mode only. CSS variables enable future dark mode by swapping tokens, but not now. |
| **Full responsive mobile layout** | "Should work on mobile" | Desktop app is information-dense by design. Cramming into mobile creates bad experience on both. | Purpose-built mobile capture page (/capture) -- one job, done well. |
| **Social media API integrations** | "Post from the dashboard" | OAuth complexity, API rate limits, platform policy changes, token management for 4+ platforms is a maintenance burden. | Manual posting + manual performance annotation. Links to profiles for one-click navigation. |
| **Real-time data streaming / WebSockets** | "Live updates" | WebSocket server, connection management, reconnection logic. For single-user with 2-min stale time, polling is sufficient. | React Query with 2-minute stale time + manual refresh button. |
| **Drag-and-drop everywhere** | "Make everything draggable" | DnD on lists, calendars, and all cards creates interaction confusion and accessibility issues. | Drag-and-drop on kanban columns only. Click actions elsewhere. |
| **Email integration** | "Send emails from dashboard" | SMTP config, template management, deliverability monitoring. Out of scope. | Link to email client. Brain dump captures email-related tasks. |
| **AI-generated content drafts** | "Write posts for me" | Content quality requires human voice. AI-generated LinkedIn drafts feel generic and hurt brand. | AI for parsing and structuring only (brain dump). Content creation stays manual. |
| **Complex charting / analytics** | "Show me graphs" | Full analytics requires data collection, aggregation pipelines, chart libraries. Overkill for personal tracking. | Simple sparkline trends (SVG) and stat counters. No chart libraries. |
| **Push notification system** | "Alert me when things happen" | Push notification infrastructure, service workers for web push. Heavyweight for single user with app open. | Visual indicators on dashboard (badges, color states). Slack webhook covers critical path. |

## Feature Dependencies

```
[shadcn/ui Adoption]
    └──enables──> [Visual Polish Pass]
                       └──enables──> [Dashboard Redesign]
                       └──enables──> [All Page Polish]

[Brain Dump AI Parsing] (exists)
    └──enables──> [Task Assignment to Projects]
                       └──requires──> [Project Task Kanban] (exists)

[Content Pipeline Detail Modal] (exists)
    └──enables──> [Caption Editing]
    └──enables──> [Slack Webhook on Approve/Reject]

[Brain Dump Submission Hook] (exists)
    └──enables──> [Mobile Capture Page]

[Content Pipeline Data] (exists)
    └──enables──> [Cross-Platform Calendar]
    └──enables──> [Dashboard Content Calendar Strip]

[n8n Webhook Endpoint] (configured)
    └──enables──> [Agent Dispatch Quick Actions]

[Activity Log Data] (exists)
    └──enables──> [Stat Sparklines]
    └──enables──> ["Days Since" Indicators]
    └──enables──> [Focus Block Priority Algorithm]

[Podcast Schema] (exists)
    └──enables──> [Podcast Tracker Table UI]
```

### Dependency Notes

- **Brain dump task assignment requires both parsing AND project kanban.** Data flow: brain dump -> parse -> assign -> create task. All upstream pieces exist; the connection between parsed result and project task creation is the missing link.
- **Mobile capture is isolated.** Only requires brain dump submission hook (already exists). Can be built independently.
- **Dashboard improvements are mostly display-only.** Focus block, sparklines, and "days since" indicators compute from existing data. No new API endpoints needed.
- **Podcast tracker is fully independent.** Schema exists, no dependencies on other features. Pure UI work.
- **shadcn/ui adoption unblocks all visual work.** Must happen first or visual polish becomes rework.
- **Slack webhook is trivial once approve/reject exists.** Just a fetch POST in the mutation handler.

## MVP Definition

### Launch With (v1 -- This Milestone)

The redesign milestone should deliver all table stakes at premium quality plus the highest-impact differentiators.

- [ ] **shadcn/ui adoption + design token mapping** -- Foundation. Everything else builds on consistent components.
- [ ] **Dashboard information redesign** -- Dense grid layout, typographic hierarchy, visual breathing room. Sets the tone.
- [ ] **Visual polish pass on every page** -- Spacing, padding, typography, card system overhaul (24px padding, 14px radius, subtle hover shadows).
- [ ] **Caption editing in content pipeline** -- Daily workflow feature currently missing.
- [ ] **Slack webhook on approve/reject** -- Closes the integration loop with one fetch call.
- [ ] **Podcast guest tracker table** -- New page section, schema already exists, pure UI.
- [ ] **Brain dump task assignment to project boards** -- Critical data flow connecting capture to action.
- [ ] **Mobile capture page (/capture)** -- Purpose-built route for iPhone quick capture.
- [ ] **Cross-platform content calendar on Social Media** -- Unified posting schedule view.
- [ ] **Toast notifications on all actions** -- Low effort, high perceived quality.
- [ ] **Error boundaries** -- Graceful degradation around every page.
- [ ] **Cloudflare Pages deployment** -- Must be live and accessible.

### Add After Validation (v1.x)

Features to add once redesign is live and used daily.

- [ ] **Command palette (Cmd+K)** -- Once page structure is stable and routes are final
- [ ] **Focus block on dashboard** -- Once daily usage reveals whether priority algorithm is accurate
- [ ] **Stat sparklines** -- Once enough historical data exists (~2 weeks of real usage)
- [ ] **Content performance annotations** -- Once content is actually being posted and tracked
- [ ] **Agent dispatch quick actions** -- Once n8n workflows are tested and reliable
- [ ] **Batch brain dump processing** -- Once volume of brain dumps justifies batch UI
- [ ] **Posting cadence tracking** -- Once posting is regular enough to track cadence

### Future Consideration (v2+)

- [ ] **Offline-capable mobile capture** -- Service worker with sync queue; prove mobile capture is useful first
- [ ] **Project health score** -- Needs tuning with real project data to calibrate thresholds
- [ ] **Activity log export** -- Listed in PROJECT.md but low urgency; defer until actual need

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| shadcn/ui adoption | HIGH | MEDIUM | P1 |
| Dashboard information redesign | HIGH | MEDIUM | P1 |
| Visual polish pass (all pages) | HIGH | MEDIUM | P1 |
| Brain dump task assignment | HIGH | HIGH | P1 |
| Caption editing | HIGH | LOW | P1 |
| Mobile capture page | HIGH | MEDIUM | P1 |
| Slack webhook | MEDIUM | LOW | P1 |
| Podcast tracker table | MEDIUM | MEDIUM | P1 |
| Cross-platform content calendar | MEDIUM | MEDIUM | P1 |
| Toast notifications | MEDIUM | LOW | P1 |
| Error boundaries | MEDIUM | LOW | P1 |
| Cloudflare deployment | HIGH | LOW | P1 |
| Command palette (Cmd+K) | MEDIUM | MEDIUM | P2 |
| Focus block (dashboard) | MEDIUM | MEDIUM | P2 |
| Stat sparklines | MEDIUM | MEDIUM | P2 |
| Agent dispatch buttons | MEDIUM | MEDIUM | P2 |
| Content drag-and-drop kanban | LOW | MEDIUM | P2 |
| Content performance annotations | LOW | MEDIUM | P2 |
| Batch brain dump processing | LOW | MEDIUM | P3 |
| Posting cadence tracking | LOW | LOW | P3 |
| Offline mobile capture | MEDIUM | HIGH | P3 |
| Project health score | LOW | MEDIUM | P3 |
| Activity log export | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for this milestone (redesign launch)
- P2: Should have, add in v1.x iterations
- P3: Nice to have, future consideration

## Competitor Feature Analysis

| Feature Area | Notion Dashboards | Linear | Taplio (LinkedIn) | This Console |
|---------|--------------|--------------|--------------|--------------|
| Information density | High, user-configured widgets | Focused and minimal | Single-domain | Dense but curated -- fixed layout optimized for one user, not configurable widgets |
| Project tracking | Database views, highly flexible | Cycles, issues, roadmaps | N/A | Purpose-built per project with agent integration (session prompts, dispatch) |
| Content pipeline | Manual database + calendar | N/A | Carousel maker, scheduling, analytics | Review/approve with Slack webhook, 4 view modes |
| Brain dump / capture | Quick Note, no AI parsing | N/A | N/A | AI-parsed brain dumps flowing into project task boards -- unique differentiator |
| Mobile | Full responsive app | Full mobile app | Mobile app | Purpose-built capture-only (/capture) -- deliberately limited for speed |
| Agent integration | None native | API-driven workflows | AI content generation | n8n dispatch, Claude Code session prompts, Slack webhooks -- agent IS the workflow |
| Podcast tracking | Custom database table | N/A | N/A | Built-in pipeline (outreach -> scheduled -> recorded -> published) |

## Sources

- Dashboard design patterns: [DesignRush 2026 Dashboard Principles](https://www.designrush.com/agency/ui-ux-design/dashboard/trends/dashboard-design-principles), [Pencil & Paper Dashboard UX Patterns](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- Brain dump / capture apps: [ClickUp Brain Dump Apps](https://clickup.com/blog/brain-dump-apps/), [Asana Brain Dump Template](https://asana.com/templates/brain-dump)
- Content pipeline patterns: [Liseller LinkedIn Dashboards](https://www.liseller.com/linkedin-growth-blog/top-9-linkedin-content-dashboards-for-2025), [Taplio LinkedIn Tools](https://taplio.com/blog/linkedin-tools)
- Podcast CRM: [Podseeker Booking Tools](https://www.podseeker.co/blog/podcast-booking-tools), [The Podcast Host Outreach Management](https://www.thepodcasthost.com/planning/manage-podcast-guest-outreach/)
- Project command center: [Notion Project Management Command Center](https://www.notion.com/templates/project-management-command-center), [NotionEverything Dashboard Templates](https://www.notioneverything.com/blog/notion-dashboard-templates)
- Second brain / productivity systems: [TinkeringProd Best Second Brain Apps 2026](https://tinkeringprod.com/best-second-brain-apps-in-2026/)

---
*Feature research for: Forge Console v2 -- Quality Redesign*
*Researched: 2026-03-22*
