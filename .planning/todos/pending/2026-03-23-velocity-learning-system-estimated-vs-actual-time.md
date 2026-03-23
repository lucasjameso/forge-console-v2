---
created: 2026-03-23T00:35:00.000Z
title: Velocity learning system estimated vs actual time
area: ui
files:
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
  - .planning/todos/pending/2026-03-23-time-estimation-on-every-task-and-subtask.md
  - .planning/todos/pending/2026-03-23-task-start-stop-time-logging-for-velocity-tracking.md
---

## Problem

Time estimates are guesses until calibrated against reality. Without a feedback loop comparing estimated vs actual duration, estimates stay inaccurate forever. Lucas works faster than typical estimates assume, so uncalibrated estimates waste his planning time and undervalue his throughput.

This is the third piece of a three-part system:
1. Time estimation (todo: estimates on every task)
2. Start/stop logging (todo: timestamps on task transitions)
3. **Velocity learning** (this todo: compare estimates to actuals, improve over time)

## Solution

1. **Velocity ratio tracking:** For every completed task with both an estimate and actual duration, compute `velocity_ratio = estimated / actual`. Store in a `task_velocity` table or as fields on the completion_log.
2. **Rolling averages:** Track velocity ratio by task type (UI fix, feature, bug, refactor) and by project. "Lucas completes UI fixes in 72% of estimated time on average."
3. **Estimate suggestions:** When setting a time estimate on a new task, suggest an adjusted estimate: "You estimated 2h. Based on 14 similar tasks, you typically finish in 1h 25m."
4. **Dashboard surfacing:** Project detail page shows velocity trend: "Last 7 days: 12 tasks completed, avg 68% of estimated time." Activity log analytics (ASUG-06) show velocity charts.
5. **Anomaly detection:** If a task takes 2x+ the estimate, flag it in the activity log as a potential blocker or scope creep indicator. "Task X took 4h (estimated 1.5h) -- review for scope issues."
6. **Scope:** This is future work beyond Phase 8, but the data model from the time estimation and logging todos must be designed to support it. The velocity table should be planned during Phase 8 schema work even if the analytics UI comes later.
