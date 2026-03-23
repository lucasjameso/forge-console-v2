---
created: 2026-03-23T00:46:00.000Z
title: Local Llama autonomous task execution on Mac Mini
area: general
files:
  - .planning/todos/pending/2026-03-23-multi-model-architecture-cost-optimized-routing.md
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
---

## Problem

Lucas sleeps, drives, does family time, and has a VP of Sales job. The Mac Mini sits idle for 12-16 hours per day. That is wasted compute. A local Llama model running on the M4 Mac Mini could execute planned, pre-approved work autonomously while Lucas is away -- processing brain dump backlogs, running content reviews, organizing notes, generating summaries, and executing routine tasks that do not require human judgment.

The key constraint: autonomous execution must be safe. The system should only execute work that Lucas has pre-approved or that falls within defined autonomy boundaries. It should never make irreversible decisions (delete data, publish content, send messages) without human approval.

## Solution

1. **Infrastructure:** Ollama + Llama 3 (or latest) running as a persistent service on Mac Mini via PM2. n8n cron jobs trigger autonomous workflows on a schedule.

2. **Autonomous task categories (safe to execute unattended):**
   - **Brain dump backlog processing:** Parse all unprocessed brain dumps. Extract tasks. Route to projects. Flag items needing human decision.
   - **Activity log summarization:** Generate daily summary from yesterday's entries. Write to activity_log as a "System" entry.
   - **Content review preparation:** For pending content items, generate review notes (grammar check, character count, hashtag suggestions). Stage as draft reviews for Lucas to approve.
   - **Stale task detection:** Scan all "In Progress" tasks older than 5 days. Generate a report: "3 tasks may be stuck." Write as action items.
   - **Data hygiene:** Archive resolved action items older than 30 days. Clean up orphaned brain dump entries. Generate database stats.
   - **Follower count recording:** If platform APIs are connected, record daily follower counts to follower_history table.

3. **Autonomy levels (per task type):**
   - **Execute freely:** Summarization, data hygiene, metric recording. No human impact.
   - **Execute and log:** Brain dump parsing, stale task detection. Creates items for human review but does not modify existing work.
   - **Propose only:** Content review notes, prioritization suggestions. Writes proposals that Lucas approves before they take effect.
   - **Never autonomous:** Publishing, deleting, sending messages, modifying task status. Always requires human approval.

4. **Execution log:** Every autonomous action logged to activity_log with tool="Llama-Auto", full details of what was done and why. Lucas reviews the overnight log each morning as part of the Dashboard briefing.

5. **Schedule:**
   - 3:00 AM: Brain dump backlog processing
   - 4:00 AM: Activity log daily summary
   - 5:00 AM: Stale task detection
   - 6:00 AM: Content review preparation
   - Midnight: Data hygiene, metric recording

6. **Safety guardrails:**
   - Kill switch in Settings (STSUG-07): "Pause all autonomous execution" toggle
   - Token budget per day (prevent runaway loops)
   - Error threshold: if 3+ consecutive failures, pause and alert via Slack
   - All writes go through the same Supabase mutations as the UI -- no direct SQL

7. **Scope:** Post-v1. Depends on multi-model architecture and agent system. But the activity_log schema should support "Llama-Auto" as a tool type from Phase 4, and the agent config UI (STSUG-07) should have the autonomy level controls from Phase 9.
