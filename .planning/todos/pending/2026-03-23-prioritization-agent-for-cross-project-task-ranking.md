---
created: 2026-03-23T00:41:00.000Z
title: Prioritization agent for cross-project task ranking
area: general
files:
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
  - .planning/feedback/PHASE-08-DASHBOARD-PROJECT-SPEC.md
---

## Problem

Lucas manages tasks across 5 projects with no automated prioritization. He manually scans action items, task boards, content queues, and brain dump backlogs to decide what to work on next. This mental overhead compounds with every project added. The Dashboard surfaces urgency (action items sorted by urgency) but not strategic priority -- it cannot weigh "this task is overdue but low-impact" against "this task is not urgent but blocks a critical milestone."

The Today's Focus section (DSUG-03) currently requires manual curation. The feedback spec envisions the agent suggesting focus items, but that requires a prioritization engine that understands deadlines, dependencies, impact, and Lucas's current bandwidth.

## Solution

1. **Prioritization agent role:** Part of the multi-agent system (see related todo). Runs as the Orchestrator's prioritization subsystem. Has read access to all projects, tasks, action items, content reviews, and brain dumps.

2. **Prioritization algorithm inputs:**
   - **Deadline proximity:** Tasks with approaching deadlines score higher. CLARITY launch tasks escalate as April 17 approaches.
   - **Dependency chains:** Tasks that block other tasks score higher. "Deploy auth proxy" blocks "smoke test" which blocks "launch."
   - **Impact tier:** Tasks tied to "must" requirements score higher than "should" or "nice."
   - **Staleness:** Tasks untouched for 3+ days get a nudge. Projects with no activity get flagged.
   - **Lucas's recent focus:** If 80% of activity has been on Forge Console, the agent nudges: "CLARITY needs attention -- 4 days since last activity."

3. **Output: Daily priority stack.**
   - Runs every morning at 3 AM (Lucas's typical start time) via n8n cron
   - Writes to a `daily_priorities` table: date, ranked list of top 5 tasks with rationale
   - Populates Today's Focus suggestions (DSUG-03) with "AI suggested" badge
   - Sends Slack digest: "Today's priorities: 1. [task] (CLARITY, deadline in 5d) 2. [task] (Ridgeline, blocking Phase 3)"

4. **On-demand mode:** "Reprioritize" button on Dashboard or in any project. Agent re-runs with current state and updates suggestions. Useful after a brain dump session or when plans change.

5. **Transparency:** Every prioritization decision shows rationale. "Ranked #1 because: deadline in 5 days, blocks 3 other tasks, no progress in 48 hours." Lucas can override any ranking and the agent learns from overrides.

6. **Scope:** Post-v1. But the `daily_priorities` table and Today's Focus agent integration point (DSUG-03) should be designed in Phase 8 to accept agent suggestions without schema changes later.
