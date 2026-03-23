---
created: 2026-03-23T00:32:00.000Z
title: Task subtask hierarchy as default pattern
area: ui
files:
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
  - src/hooks/useProjects.ts
  - src/types/database.ts
---

## Problem

Lucas works by breaking a parent task into clear sequential subtasks. The current data model (tasks table) is flat -- no parent/child relationship, no subtask support. The kanban board shows tasks as atomic units with no decomposition. GSD plans also tend toward monolithic task descriptions instead of hierarchical breakdowns.

This affects three layers:
1. **Data model:** The `tasks` table has no `parent_id` or subtask relationship. The feedback spec (PDSUG-06) calls for a `task_subtasks` table with checkboxes, progress bars, and completion logging.
2. **UI:** The kanban board and task modal need subtask lists with inline add/edit/complete. Parent cards show "3/6" progress. The task detail modal (PDSUG-05) needs a full subtasks section.
3. **GSD workflow:** Phase plans should break work into parent tasks with subtasks, not flat task lists. This matches how Lucas actually thinks about work.

## Solution

1. **Data model:** Add `task_subtasks` table (id, task_id, title, is_complete, sort_order, created_at). Add `subtask_count` and `subtasks_done` computed fields to tasks.
2. **Kanban cards:** Show "3/6" subtask progress with tiny progress bar when subtasks exist.
3. **Task detail modal:** Full subtask section with checkboxes, inline edit, add input, delete, progress bar. Completing subtasks logs to completion_log and updates parent progress.
4. **GSD plans:** When breaking phase work into tasks, default to parent + subtask structure. Each plan task should have 2-5 subtasks that can be checked off sequentially.
5. **This is Phase 8 work** (PDSUG-05, PDSUG-06) but the principle should inform how Phase 4-7 plans are structured too.
