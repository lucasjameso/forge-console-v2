---
created: 2026-03-23T00:36:00.000Z
title: Context switch safety net across projects
area: ui
files:
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
  - src/pages/ProjectDetail.tsx
---

## Problem

Lucas manages 5 projects simultaneously (Ridgeline, CLARITY, Forge Console, Meridian, Atlas) and jumps between them constantly. When he returns to a project after days away, he has no quick way to see: what happened while he was gone, what changed, what new action items appeared, and what the current state is. He has to mentally reconstruct context every time he switches, which is expensive and error-prone.

The Dashboard surfaces project recency (green/amber/red borders), but clicking into a stale project drops Lucas into the same static view with no "since you were last here" summary. The Project Detail page (PDSUG-01 through PDSUG-09) addresses individual sections but doesn't solve the meta-problem of context recovery after absence.

## Solution

1. **"Since you were here" banner on Project Detail:** When Lucas opens a project he hasn't viewed in 24+ hours, show a compact summary banner at the top: "Since your last visit (3 days ago): 4 new activity entries, 2 action items added, 1 task completed." Click to expand into a timeline of changes.
2. **Track last-visited timestamp:** Store `last_visited_at` per project in a `project_visits` table (or user_preferences). Update on every Project Detail page load.
3. **Change detection:** On page load, query activity_log for entries since `last_visited_at`. Count by type: new action items, completed tasks, new notes, status changes.
4. **Dashboard integration:** The project cards already show recency. Add a small "unread" indicator (blue dot or count badge) on cards where activity has occurred since last visit. This tells Lucas at a glance which projects have new information.
5. **Next Session Prompt (PDSUG-09):** The handoff document becomes even more critical as the context-switch recovery tool. When Lucas leaves a project, the prompt should auto-update with a summary of what was done in this session.
6. **Agent integration (future):** The orchestrator agent generates a "project briefing" when Lucas returns to a stale project: "Here's what happened on Ridgeline while you were working on CLARITY for 3 days."
