# Phase 8: Dashboard + Project Detail Power Features

**Source:** Page feedback system (Supabase `page_feedback` table)
**Captured:** 2026-03-22
**Total Items:** 8 dashboard suggestions + 17 project detail suggestions (fixes in Phase 4)
**Phase Goal:** Build shared interactive components (task modals, action items, quick capture, subtask system) powering both the Dashboard command center and the Project Detail nerve center

---

## Design Philosophy

The Dashboard answers in 5 seconds: (1) Is anything on fire? (2) How are my projects doing? (3) What should I work on next?

The Project Detail answers in 2 seconds: (1) What needs me RIGHT NOW? (2) How is this project doing? (3) What should I work on next?

Reference apps: Superhuman, Linear, Things 3, Apple Watch complications, Stripe Dashboard.

---

## Dashboard Suggestions (8 items)

### DSUG-01: Quick Capture bar
Full-width below greeting. 48px at rest, expands to 120px on focus (spring). White card, warm border, inset shadow. Brain icon left, "Capture a thought..." placeholder. On focus: textarea (3 lines) + "Send to:" project pills + Send button. On submit: save to brain_dumps, Claude parses in background, collapse with green flash, toast "Captured." "/" to focus, Escape to close, Cmd+Enter to submit.

### DSUG-02: Project cards surface #1 blocker inline
If high-urgency open action items: show top one as red dot + truncated title (12px). If no high but has open items: "3 open items" in amber. If zero: nothing (card shorter). Clickable: navigates to project detail "Needs Your Attention".

### DSUG-03: Today's Focus section
Between Action Items and Projects. Only visible when set. 2-3 horizontal cards: project badge + task title + time estimate + checkbox. Coral left border. Completing: strikethrough animation + toast. Edit mode: search/select up to 3 tasks. New `daily_focus` table. Slate clean each day. Future: agent suggests focus items.

### DSUG-04: Project cards link directly to GitHub repos
Small GitHub octocat icon (react-icons) in top-right of card, 16px. stopPropagation. Tooltip: "Open on GitHub". Only shows if URL set.

### DSUG-05: Content Calendar empty days open "Schedule content" flow
Empty days: dashed border + "+" icon (16px, --text-tertiary). Click: navigate to /pipeline with create modal pre-opened, date pre-filled. Today empty: warm background tint + "Nothing today."

### DSUG-06: Keyboard shortcut "F" for feedback widget
"F" toggles feedback widget. Auto-focus textarea on open. Tab switches Fix/Suggestion. Cmd+Enter submits. Escape closes. Only when not in input field. Small "F" badge on floating button.

### DSUG-07: System health strip clickable with detail popups
Click service name: popover (240px) showing status, last checked, response time, uptime 24h, "Open dashboard" link. When degraded: popup auto-shows on page load with error message + time since issue.

### DSUG-08: Projects section split into "Core Builds" and "Corporate Platforms"
Top: "Core Builds" -- Ridgeline, CLARITY, Forge (3 equal cards). Bottom: "Corporate" -- Meridian, Atlas (2 cards at 50% width, space empty). Labels: 11px uppercase --text-tertiary. 24px between groups, 16px within.

---

## Project Detail Suggestions (17 items)

### PDSUG-01: Needs Your Attention -- interactive command center
Collapsed: urgency color bar + title + source badge + time + action buttons (resolve, snooze, expand). Expanded: full description, context, notes input, priority selector, schedule date picker, assign dropdown, resolve button. Resolve animation: slide-left + fade. Snooze: amber flash + clock badge. Keyboard: arrows navigate, Enter expands, R resolves, S snoozes. Empty: checkmark animation + "All clear." Logs to `action_item_log`.

### PDSUG-02: Progress section -- visual roadmap
Progress bar fills 0% to current over 600ms. "X tasks done / Y total" below. Milestone timeline: clickable dots with popover (title, target date, status, task count, "Set date" if missing). Done=green check, In progress=pulsing amber, Overdue=red + "X days overdue". Solid green line for done segments, dashed gray for upcoming.

### PDSUG-03: Recent Activity timeline
Left gutter vertical line + colored dots by tool. Day grouping with sticky headers. Entry: tool badge + summary + timestamp + impact indicator (green "completed", blue "built", amber "updated", gray "checked"). Max 5 default, "View all" links to Activity Log pre-filtered.

### PDSUG-04: Tasks/Kanban Board -- fully interactive
Three columns: To Do, In Progress, Done with counts. "Add task" inline input at top of To Do. Drag-and-drop between columns (@dnd-kit/core). Task card: title (2 lines), priority dot, assignee, due date, subtask progress "3/6". Click opens full modal.

### PDSUG-05: Task detail modal (Linear-quality)
640px centered, backdrop blur. Editable title (18px). Metadata pills: Status, Priority, Assignee, Due date, Time estimate dropdowns. Description area (auto-save on blur). Subtasks section: checkboxes + inline edit + add input + progress bar. Activity timeline on task. Actions: delete, duplicate, move to project.

### PDSUG-06: Subtask system
Each task can have subtasks. Checkbox + title. Click to edit inline. Delete X on hover. "Add subtask" input. Progress bar. Feeds back to parent card in kanban. Logs to completion_log.

### PDSUG-07: Notes & Decisions -- living project journal
Cards auto-size to content. Left edge colored by type: Decision=navy, Context=gray, Blocker=red, Idea=coral, Question=amber, Update=green. Basic markdown rendering. Metadata: tag + timestamp + author. Hover: edit icon. Add note at TOP (not bottom): textarea + tag pills + Save.

### PDSUG-08: Linked Resources -- living resource cards
Horizontal row. Each: service icon + name + live status (GitHub "Last commit 2h ago", Cloudflare "Last deployed 4h ago", Supabase "Connected"). Click opens URL. No URL: "Configure in Settings".

### PDSUG-09: Next Session Prompt -- prominent handoff document
Full-width card, distinct visual (coral left border). Min 120px, auto-grow. Editable: click to edit, save on blur. "Click to copy" button. "Last updated" timestamp. Critical for Claude Code session handoffs.

### PDSUG-10: Greeting and time header (Dashboard)
Context subtitle from real data. Right side: time (18px) updating every minute, date (14px full format), system pulse dot (green/amber/red). Pulse dot click opens health strip.

### PDSUG-11: Stat tiles row (Dashboard)
5 hero tiles: 3 project progress (color-coded green/amber/red by health, 4px left recency border, thin progress bar), Pending Approvals (amber if 1-3, red if 4+, subtle pulse), CLARITY Countdown (urgency escalation). All clickable. Hover: lift 2px + shadow.

### PDSUG-12: System health strip (Dashboard)
Healthy: compact 32px row, green dots, 12px --text-tertiary, subtle. Degraded: 48px, amber/red tint, affected service pulses, summary text. Click to Settings. Toast on status change.

### PDSUG-13: Action items section (Dashboard)
Full-width card + count badge. Item rows: urgency bar + project badge + title + source + time + action buttons (resolve, snooze, navigate). Sort by urgency then age. Show 4 default, expand inline for all. Resolved: slide-left + count decrement.

### PDSUG-14: Projects quick glance (Dashboard)
Core Builds (top, 3 cards) + Corporate (bottom, 2 cards). Enhanced cards: recency border, priority badge colors, health-coded progress bar, phase label, #1 blocker inline, recency timestamp, resource icons.

### PDSUG-15: Content calendar strip (Dashboard)
7 columns Mon-Sun. Today: warm tint + coral label. Intelligent week: show current if has content, else next. Content card: title 2 lines, status badge, platform icon, slide count. Empty day: dashed + "+" icon. Max 2 items per day + "+1 more".

### PDSUG-16: Page-level design rules (Dashboard)
Visual hierarchy: Greeting -> Capture -> Stats -> Health -> Actions -> Focus -> Projects -> Calendar. Section gaps: 40px major, 16px within. Everything above fold on 900px viewport. Parallel loading with stagger reveal. Keyboard shortcuts: /, 1-5, A, P, C.

### PDSUG-17: Page-level design rules (Project Detail)
Sections: Attention -> Progress -> Activity -> Tasks -> Notes -> Resources -> Next Session. 40px section gaps. Independent section loading with priority stagger. Floating "jump to section" mini-nav. Lazy-load below-fold sections. Optimistic updates on all mutations.

---

## Shared Components (built once, used in both pages)

| Component | Dashboard Use | Project Detail Use |
|-----------|-------------|-------------------|
| ActionItemRow | Action Items section | Needs Your Attention |
| TaskModal | (via project cards) | Kanban task click |
| SubtaskList | (inside TaskModal) | (inside TaskModal) |
| QuickCapture | Dashboard capture bar | (future: inline on PD) |
| ProjectBadge | Action items, calendar | Notes, activity |
| UrgencyBar | Action item rows | Attention item rows |
| RecencyBorder | Stat tiles, project cards | (header indicator) |
| HealthDot | System health strip | Linked resources |

---

## Data Requirements

### New Tables
- `daily_focus` (id, task_id, date, status, created_at)
- `action_item_log` (id, action_item_id, action, performed_by, timestamp, metadata_json)
- `task_subtasks` (id, task_id, title, is_complete, sort_order, created_at)
- `project_notes` (id, project_id, content, tag, author, created_at, updated_at)

### Modified Tables
- `action_items`: add `resolution_note`, `snoozed_until`, `scheduled_date`
- `tasks`: add `description`, `assignee`, `due_date`, `time_estimate`, `subtask_count`, `subtasks_done`

## Traceability
Dashboard: DSUG-01 through DSUG-08 + DFIX-01 through DFIX-08 (fixes in Phase 4)
Project Detail: PDSUG-01 through PDSUG-17
