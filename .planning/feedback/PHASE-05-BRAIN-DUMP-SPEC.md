# Phase 5: Brain Dump Depth -- All Suggestions

**Source:** Page feedback system (Supabase `page_feedback` table)
**Captured:** 2026-03-22
**Total Items:** 12 suggestions + 8 fixes (fixes in Phase 4)
**Phase Goal:** Transform Brain Dump from a simple capture tool into a full thought-to-action pipeline

---

## Suggestions (12 items)

### BSUG-01: Project-organized brain dump sections with tabs or filters
Filter tabs above history: "All", "Ridgeline", "CLARITY", "Forge", "Meridian", "Atlas", "General". Count badges: "Ridgeline (4)". Foundation for cross-referencing brain dumps from project detail pages.

### BSUG-02: Agent refinement workflow (Capture -> Parse -> Refine -> Approve -> Action)
5-stage pipeline visible on expanded brain dump card:
- Stage 1 Capture: raw text saved to Supabase
- Stage 2 Parse: Claude extracts tasks, assigns projects, estimates priority
- Stage 3 Refine: agent adds context, suggests improvements, asks clarifying questions. "Agent Notes" section with refined descriptions and suggested subtasks. Lucas edits inline.
- Stage 4 Approve: Lucas reviews refined tasks, checks/unchecks each. "Approve plan" button.
- Stage 5 Action: approved tasks created in target project boards automatically. Entry shows "3 tasks created in Ridgeline" with links. Marked "Actioned".

### BSUG-03: Brain dump sessions (grouped captures)
Multiple dumps within 10-minute window group into a session. Single expandable card: "Morning session -- 7 captures, 3:42 AM". Expands to show all dumps with individual parsed outputs. Prevents overwhelming flat list.

### BSUG-04: Voice capture with dictation indicator
Microphone button next to Submit. Web Speech API for voice-to-text. While dictating: pulsing coral border, "Listening..." waveform animation, real-time text. Stop on button click or 3s pause. On mobile, mic button is PRIMARY input. Auto-detect sentence breaks.

### BSUG-05: Smart project detection with confidence indicator
Auto-Route shows confidence: "Ridgeline (92% confident)" or "Unsure -- could be CLARITY or General". Below 70%: amber highlight, click project badge to cycle. Agent learns from corrections over time.

### BSUG-06: Inline task creation from parsed output
Each parsed task: "Create task" button opening compact inline form (not modal). Pre-fills title, project, priority from AI. Shows due date picker, time estimate, assignee. "Create all" button at top for batch creation. Toast: "4 tasks created across 2 projects."

### BSUG-07: Brain dump analytics and patterns
Collapsible analytics at top: "This week: 12 captures, 8 actioned, 4 pending", "Most active project: Ridgeline (5)", "Avg time capture to action: 4.2h". Small 7-day bar chart (Recharts).

### BSUG-08: Cross-project brain dump linking
Single dump producing tasks for multiple projects. Parser splits by project context. History entry shows multiple project badges. Expanding shows tasks grouped by project.

### BSUG-09: Recurring brain dump templates
Save templates: "Weekly Planning", "Project Check-in", "Idea Capture". Templates appear as pills below textarea. Click to load. Pre-fills structured prompts.

### BSUG-10: Brain dump to agent dispatch
"Dispatch to agent" button on parsed dumps. Sends to project PM agent via n8n webhook. Agent responds with plan in "Agent Response" card. Lucas approves/edits/rejects. Approved plans execute.

### BSUG-11: Searchable brain dump archive
Full-text search across raw text + parsed output. Instant via Supabase full-text search. Highlighted matching text in results.

### BSUG-12: Export brain dump session as document
Export button for markdown document from selected time range. Date-grouped entries with raw text, parsed tasks, action status. Download .md or copy to clipboard.

---

## Data Requirements

### New Tables
- `brain_dump_tasks` (id, brain_dump_id, title, project_id, priority, status, confidence, created_at)
- `brain_dump_templates` (id, name, template_text, created_at)

### Modified Tables
- `brain_dumps`: add `session_id`, `project_id`, `stage` (captured/parsed/refined/approved/actioned)

## Traceability
All items map to Phase 5 in REQUIREMENTS.md as BRAIN-01 through BRAIN-12 (suggestions) plus BFIX-01 through BFIX-08 (fixes in Phase 4).
