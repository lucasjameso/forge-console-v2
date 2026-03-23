---
created: 2026-03-23T00:33:00.000Z
title: Time estimation on every task and subtask
area: ui
files:
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
  - src/types/database.ts
---

## Problem

Tasks and subtasks currently have no time estimates. Lucas needs to know how long something will take before deciding to start it. Without estimates, the Today's Focus section (DSUG-03) and the task modal (PDSUG-05) lack a critical piece of decision-making context: "Can I finish this in my current work window?"

GSD plans also lack duration estimates. When Claude Code proposes a phase plan with 8 tasks, Lucas has no sense of whether that is a 2-hour session or a 12-hour marathon. This affects session planning and focus allocation.

Lucas works faster than average -- estimates should be calibrated accordingly, not padded with defensive margins.

## Solution

1. **Data model:** Add `time_estimate` field to tasks table (options: 15m, 30m, 1h, 2h, 4h, 8h). Add same to task_subtasks.
2. **Task detail modal (PDSUG-05):** Time estimate dropdown in metadata pills row. Shows "Est: 2h" on the task card in kanban.
3. **Today's Focus (DSUG-03):** Each focus card shows time estimate. Sum displayed: "Today's Focus: ~4.5h estimated."
4. **GSD plans:** Every task in a PLAN.md should include an estimated duration. Plan summary shows total estimated time. This helps Lucas decide whether to execute in one session or split across sessions.
5. **Calibration:** Track actual completion times (start of task to status change to Done). Over time, compare estimates to actuals and adjust. Display ratio: "You typically finish 2h estimates in 1.5h."
6. **Kanban cards:** Show estimate as small text below title when set. Overdue tasks (estimate exceeded) get subtle amber indicator.
