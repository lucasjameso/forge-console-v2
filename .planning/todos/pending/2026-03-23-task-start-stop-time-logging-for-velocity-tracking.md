---
created: 2026-03-23T00:34:00.000Z
title: Task start stop time logging for velocity tracking
area: database
files:
  - src/types/database.ts
  - src/hooks/useProjects.ts
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
---

## Problem

There is no way to know how long tasks actually take. Without start/stop timestamps, time estimates (see related todo) cannot be calibrated, velocity cannot be tracked, and productivity analytics (ASUG-06) have no data source. The feedback specs call for session duration tracking (ASUG-03) and productivity analytics, but neither is possible without the underlying timing data.

This is foundational infrastructure for the learning system: once there are hundreds of task completions with actual durations, the system can predict how long similar tasks will take and identify where Lucas spends disproportionate time.

## Solution

1. **Data model:** Add `started_at` and `completed_at` timestamp fields to `tasks` table. When a task moves to "In Progress", set `started_at` if null. When moved to "Done", set `completed_at`. Compute `duration_minutes` as the difference.
2. **Completion log:** The `completion_log` table (referenced in PDSUG-04) should store `started_at`, `completed_at`, and `duration_minutes` for every status transition.
3. **Kanban interaction:** When dragging a task to "In Progress", automatically set `started_at`. When dragging to "Done", set `completed_at` and show duration in toast: "Completed in 1h 45m (estimated 2h)."
4. **Task modal:** Show "Started: 3:42 AM" and "Duration: 1h 45m" in the activity section at the bottom of the task detail modal.
5. **Analytics feed:** This data powers ASUG-06 (productivity analytics) -- velocity trending, time-per-task-type breakdowns, and the estimate calibration system from the time estimation todo.
6. **Phase 8 scope:** This belongs in Phase 8 alongside the kanban board and task modal work (PDSUG-04, PDSUG-05).
