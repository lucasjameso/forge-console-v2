# Phase 4: Visual Polish -- All Fix Items

**Source:** Page feedback system (Supabase `page_feedback` table)
**Captured:** 2026-03-22
**Total Items:** 64 fix items across 6 pages
**Phase Goal:** Fix every visual, UX, and data issue identified across all pages

---

## Dashboard Fixes (8 items)

### DFIX-01: Project cards show all "high" priority as red badges creating false urgency
All five project cards display red "high" priority badges. Meridian and Atlas are corporate support platforms, not critical builds. Fix: update Supabase projects table to set Meridian and Atlas priority to "medium". Style priority badges with meaningful colors: "high" = red text on red-tinted background, "medium" = amber text on amber-tinted background, "low" = green text on green-tinted background.

### DFIX-02: Progress bars are all the same coral/red color with no health signal
Every project card has an identical coral/red progress bar regardless of health. Progress bar color should communicate project health: Green = on track, Amber = slightly behind (10-20% below expected), Red = critically behind (20%+ below expected or milestone overdue). Simple rule: if project has overdue high-urgency action items = red, any overdue items = amber, no overdue = green.

### DFIX-03: Content Calendar strip shows an empty week with no content scheduled
Dashboard Content Calendar shows current week which has no content, rendering empty day cells. Fix: intelligent week selection -- show current week if it has content, otherwise show next week with content. Label: "Next scheduled: Week 5 (Mar 23-29)". Never show completely empty strip -- show CTA: "No content scheduled. Plan your next week." Also show posted content from earlier in week with green checkmark.

### DFIX-04: "View all (20)" link on Action Items navigates to wrong destination
"View all (20)" navigates to Activity Log which is wrong. Action items need their own focused view. Preferred fix: expand inline -- card animates taller, all items appear with same row design, "Collapse" button at bottom. Alternative: dedicated /action-items page. The Activity Log is for history, Action Items are for NOW.

### DFIX-05: Stat tiles lack colored recency borders
Project stat tiles are plain white cards with no recency indicator while project cards show green/amber/red left borders. Fix: add same 4px left border recency color to each project stat tile. Creates visual consistency -- everywhere Lucas sees a project, recency color is present.

### DFIX-06: CLARITY countdown shows "26d" with no visual urgency treatment
26 days until biggest deadline needs urgency treatment. Thresholds: 30+ days = normal, 14-30 days = amber number + amber border + date shown below, under 14 days = red number + red glow + subtle pulse every 5s, Launch day = green "Today" + celebration, Post-launch = green checkmark "Launched".

### DFIX-07: Meridian and Atlas cards show incorrect recency colors
Atlas shows "Mar 12" (10+ days) but border appears green. Should be red (5+ days). Meridian "4d ago" should be amber. Fix: verify recency calculation uses activity_log most recent entry, not project updated_at. Thresholds: green < 48 hours, amber 48h to 5 days, red 5+ days.

### DFIX-08: Greeting and subtitle text feel robotic and static
Replace static subtitle with dynamic contextual line from real data: if action items exist show count, if none show "All clear", if deadline within 7 days show countdown, if early morning acknowledge schedule, if weekend note it. Subtitle should be 14px --text-secondary (not tertiary).

---

## Brain Dump Fixes (8 items)

### BFIX-01: No project selector on capture input
Add "Send to:" project selector pill row (Auto-Route, Ridgeline, CLARITY, Forge, Meridian, Atlas, General). Border tints to project color when selected. Selection persists between submissions.

### BFIX-02: Submit button placement and keyboard shortcut visibility
Button should be larger (full-width mobile, 120px+ desktop). "Cmd+Enter to submit" hint should be inside textarea as ghost text, bottom-right, 11px --text-tertiary. Add subtle coral glow pulse to Submit when textarea has content.

### BFIX-03: History section has no visual grouping or organization
Add colored left borders matching project colors (same pattern as action items). Status badges need more visual weight: "Pending" = amber with background tint, "Processed" = green. Currently small text labels.

### BFIX-04: Expanded brain dump entry is too minimal
Separate raw text from AI-parsed output with visual divider. Parsed task card needs project badge, priority indicator, and "Add to project" action button. Should feel like a briefing, not debug output.

### BFIX-05: No way to see which brain dumps have been actioned
Add status progression: Captured -> Parsed -> Tasks Created -> Actioned. Show as subtle breadcrumb or status pills. Parsed but never actioned = visible gap.

### BFIX-06: Textarea is too small for real brain dumps
Start at 4-5 lines (120px), auto-grow up to 50% viewport. Shorten placeholder to "What's on your mind?" -- move instructional text to page subtitle.

### BFIX-07: No visual feedback during AI processing
Show skeleton shimmer on parsed output area with "Parsing..." label. When complete, shimmer resolves to content with fade-in.

### BFIX-08: History entries don't show timestamps clearly
Group entries by day with headers: "Today", "Yesterday", "March 20, 2026". Within each day, show actual time next to relative time. Creates journal feel.

---

## Content Pipeline Fixes (12 items)

### CFIX-01: Month view does not look like a real calendar
Each day cell needs fixed date header (day number, 14px weight 600, always visible top-left). Visible borders (1px --border-subtle) creating true grid. Consistent minimum heights (140-160px). Week labels outside grid as row headers. Sticky column headers (Mon-Sun). Grid fills available viewport height.

### CFIX-02: Month view day cells don't show dates on empty days
Every cell must show date number in top-left regardless of content. Empty cells show dashed border or subtle background indicating no content scheduled.

### CFIX-03: Month view has no navigation to other months
Add left/right navigation arrows in header. Left = previous 4-week block, right = next 4-week block. Month label updates. "Today" button snaps back to current week. Horizontal slide transition animation.

### CFIX-04: List view cards are too tall
Description should truncate to 1 line with ellipsis. Full description in detail modal. Target card height: 80-90px. Compact: week/day + date left, title bold, description truncated, metadata bottom row, status badge right.

### CFIX-05: Week view lacks visual differentiation between weeks
Each week group needs stronger visual container: subtle card wrapper or prominent header bar with week number, date range, and summary. 32px gap between week groups.

### CFIX-06: Kanban view columns unbalanced and "None" text wrong
Empty columns: dashed border container with "No items" in --text-tertiary or subtle empty state icon. Max-height with scroll on individual columns (max 6 visible, then scroll).

### CFIX-07: Kanban cards lack metadata and visual weight
Cards need: title (2 lines max), status badge, formatted date ("Mar 24"), slide count with icon, platform icon. White-on-cream with warm borders and shadow.

### CFIX-08: Content detail modal too small and missing actions
Modal 680px minimum width. Caption in editable textarea. "Re-submit"/"Request revision" button for rejected items. Approve/Reject buttons at bottom for pending items.

### CFIX-09: Status badges inconsistent across views
Standardize: 11px uppercase, 600 weight, 4px 10px padding, pill-shaped (border-radius 100px). Colors: Draft=gray, Pending=amber, Approved=green, Rejected=red, Posted=blue. Same everywhere.

### CFIX-10: No visual indicator for "today" in any view
List: subtle warm background or "Today" label. Week: highlighted background. Month: coral top border or warm background. Kanban: "Today" badge on items scheduled today.

### CFIX-11: "0 slides" on text posts
If text post: show "Text post" instead of "0 slides". If carousel with 0 slides: show "No slides yet" in amber.

### CFIX-12: No "Create Content" button
Add "Add Content" button (coral, Plus icon) in page header next to view toggle. Opens modal: title, caption, week/day, platform checkboxes, date picker, "Create as Draft" button.

---

## Social Media Fixes (12 items)

### SFIX-01: Generic icons instead of real platform brand icons
Install react-icons or @icons-pack/react-simple-icons. Replace all generic Lucide icons with actual brand icons: LinkedIn "in" logo (#0A66C2), Facebook F (#1877F2), Instagram camera (pink/purple), TikTok note (black/teal/red), YouTube play button (red), X logo (black), Medium M (black), Reddit Snoo (#FF4500), Goodreads G (brown), Amazon smile (orange), Beehiiv hexagon, Gumroad G (pink).

### SFIX-02: Platform cards all same size regardless of importance
Active platforms (LinkedIn, Medium): larger cards, full-width or 2/3 width, more detail. Setup needed: smaller compact cards in tighter grid (3 per row). Group: "Active Platforms" top, "Needs Setup" below with section headers.

### SFIX-03: "This platform needs to be set up" warning banner too prominent
Remove full-width amber banner. "Setup Needed" badge in top-right is sufficient. Add subtle amber left border (4px) for setup-needed cards.

### SFIX-04: "No followers yet" and "Needs profile link" text is low-value
For unset platforms show only: icon + name + handle + "Setup Needed" badge. No follower count of 0, no "needs profile link". Details show on click/expand.

### SFIX-05: Overview stats section buried at bottom
Move to TOP below page header as hero stat row: Active Platforms (green), Total Followers (large), Need Setup (amber if > 0). Same pattern as Dashboard stat tiles.

### SFIX-06: LinkedIn Personal card doesn't show follower goal progress visually
Show percentage (65.5%), use green progress bar color, add projected date "On track to reach 10K by [date]". If growth stalled, bar turns amber.

### SFIX-07: Cards have inconsistent content density
Standardize: Active cards = icon + name + handle + follower count + last post + profile link + goal. Setup cards = icon + name + handle + badge. Nothing else.

### SFIX-08: No visual indication of priority platforms for CLARITY launch
Goodreads, Amazon Author Central, BookBub need "CLARITY Launch" tag or "Needed for launch" coral badge. Distinguishes from optional platforms.

### SFIX-09: "View profile" links inconsistent
Every card with known URL: small external link icon button in top-right. No URL: show nothing. Remove "View profile" text.

### SFIX-10: Page subtitle generic and uninformative
Replace "All your platforms in one place" with contextual: "2 active, 11 need setup. 6,789 total followers." Updates dynamically.

### SFIX-11: Card grid layout doesn't adapt to number of cards
Active platforms: 2-column grid with larger cards. Setup needed: 3-column grid with compact cards (~60% height). Reduces scroll significantly.

### SFIX-12: No way to reorder or prioritize platforms
Add sort dropdown: "Sort by: Priority, Alphabetical, Followers, Last active". Priority = active first, then launch-critical, then rest. Or drag-and-drop reorder.

---

## Settings Fixes (12 items)

### STFIX-01: Integration cards use generic icons
Replace with brand logos: Supabase green lightning bolt, n8n orange logo, Cloudflare orange/white shield, Slack multi-color hashtag, Claude/Anthropic spark icon.

### STFIX-02: Feedback Log entries display raw markdown
Render markdown as formatted HTML (react-markdown) or strip and display as plain text. Truncate to 3-4 lines with "Read more" expand toggle.

### STFIX-03: Feedback Log entries too large vertically
Compact by default: type icon + page badge + first line as title (truncated) + status badge + timestamp. Click to expand full content. Target 8-10 entries per screen.

### STFIX-04: Integration cards show env var names (developer-facing)
Show human-readable labels: "Database URL: Connected", "API Key: Set". Env var names in tooltip on hover for debugging.

### STFIX-05: No visual distinction between connected and disconnected
Connected: green badge + green left border + green checks. Disconnected: red badge + red border + red X + "Reconnect" button. Partial: amber badge.

### STFIX-06: "Open dashboard" links inconsistent
Every integration needs direct link: Supabase dashboard, n8n dashboard, Cloudflare Pages, Slack workspace, Anthropic Console. Consistent placement: bottom-left, coral text + external link icon.

### STFIX-07: About section buried and too minimal
Move to collapsible section or "System Info" tab. Enhance with: build date, last deploy, GitHub repo link, commit hash, database name, table count, total rows.

### STFIX-08: No organizational sections beyond Integrations and Feedback
Add: Integrations, Feedback Log, Preferences (NEW), Data Management (NEW), System Info (moved). Use tab navigation or collapsible accordion.

### STFIX-09: No way to test integrations
Add "Test connection" per card: Supabase SELECT 1, n8n /healthz, Cloudflare API check, Slack test message, Claude trivial API call. Show: "Healthy, 120ms" or "Failed: timeout". Last tested timestamp.

### STFIX-10: Feedback filter tabs lack count badges
Add counts: "All (10)", "Open (8)", "Done (2)". "Open" should be default view. If 0 open, show "All feedback has been addressed."

### STFIX-11: No fix vs suggestion distinction at a glance
Fix entries: wrench icon + amber/red left border. Suggestion: lightbulb icon + blue/navy left border. Clear as urgency indicators.

### STFIX-12: Feedback page badges are plain text
Color-coded pills matching sidebar: Dashboard=coral, Projects=navy, Brain Dump=purple, Content Pipeline=green, Social Media=blue, Activity Log=amber, Settings=gray.

---

## Activity Log Fixes (12 items)

### AFIX-01: No day grouping makes timeline impossible to scan
Group by day with sticky headers: "Today -- Sunday, March 22", "Yesterday -- Saturday, March 21". Headers 15px weight 600 with background tint. Count per day: "Today (6 entries)". 32px spacing + horizontal rule between groups.

### AFIX-02: Timeline dots and connecting line lack visual hierarchy
Color-code dots by tool: Claude Code=coral, n8n=green, Slack=amber, System=gray, Manual=navy, Cowork=blue. Lighter connecting line (--border-subtle). Significant entries (phase completions, deployments) get larger dots (10px vs 8px).

### AFIX-03: All entries have same visual weight
Three tiers: Major (phase completions, deployments) = full card, warm border, shadow, 15px title. Standard (code sessions, workflow runs) = current but compact, 14px. Background (health checks, pings) = minimal, no card, inline text, 60% opacity.

### AFIX-04: Filter chips don't indicate active state clearly
Active: coral fill + white text (project) or filled + count badge (tool: "Claude Code (24)"). Inactive: outline-only + --text-tertiary.

### AFIX-05: Search input has no feedback
Real-time search (debounced 300ms) with loading indicator, result count ("12 results for 'carousel'"), highlighted matching text. Clean empty state for no results.

### AFIX-06: Timestamps switch between relative and absolute inconsistently
Within 24 hours: relative ("3h ago"). Older: time only within day group header context ("2:34 PM"). Exact time in tooltip on hover.

### AFIX-07: No pagination or load-more
Infinite scroll loading 20 entries per batch with skeleton shimmer. Or "Load more" button. Total count in header: "247 activities across all projects."

### AFIX-08: Project badges use inconsistent colors
Each project gets own color: Ridgeline=green-tint, CLARITY=coral-tint, Forge=navy-tint, Meridian=blue-tint, Atlas=gray-tint. Consistent across entire app.

### AFIX-09: No way to see activity density at a glance
Add 14-day activity heatmap/bar chart at top (below filters). Bars stacked by project color. Hover tooltip: "March 20: 8 entries (5 forge, 2 clarity, 1 system)". 60px height.

### AFIX-10: Tool badges need better visual distinction from project badges
Tool badges: rounded rectangle with subtle icon (code brackets for Claude Code, lightning for n8n, chat for Slack, gear for System). Project badges keep current pill style.

### AFIX-11: Entry text too long and not scannable
Truncate to 1 line with ellipsis. Click to expand. Bold first phrase pattern: "**Phase 2 complete.** Card/Button migration across 14 files..."

### AFIX-12: No way to add manual activity entries
"Log activity" button near search bar. Inline form: project selector, summary text, tool type (default Manual), timestamp (default now, adjustable).

---

## Traceability

| ID | Page | Phase |
|----|------|-------|
| DFIX-01 through DFIX-08 | Dashboard | 4 |
| BFIX-01 through BFIX-08 | Brain Dump | 4 |
| CFIX-01 through CFIX-12 | Content Pipeline | 4 |
| SFIX-01 through SFIX-12 | Social Media | 4 |
| STFIX-01 through STFIX-12 | Settings | 4 |
| AFIX-01 through AFIX-12 | Activity Log | 4 |
