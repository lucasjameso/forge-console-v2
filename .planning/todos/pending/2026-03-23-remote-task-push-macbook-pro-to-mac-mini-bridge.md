---
created: 2026-03-23T00:47:00.000Z
title: Remote task push MacBook Pro to Mac Mini bridge
area: general
files:
  - .planning/todos/pending/2026-03-23-local-llama-autonomous-task-execution-on-mac-mini.md
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
---

## Problem

Lucas has two machines: a Mac Mini (M4, always-on, runs n8n/PM2/Supabase/Llama) and a MacBook Pro (travel, deep work sessions). When traveling, he needs to push work to the Mac Mini so execution begins before he gets home. Currently there is no bridge between the two machines beyond Supabase as a shared database.

The workflow gap: Lucas plans a task on the MacBook Pro, but the Mac Mini agents and Llama do not know about it until it appears in Supabase. There is no way to push a plan, trigger a specific agent, or queue work for the Mac Mini's local compute from a remote location.

## Solution

1. **n8n webhook bridge:** The Mac Mini already runs n8n via PM2 with a Cloudflare Tunnel for external access. Create dedicated webhook endpoints for remote task dispatch:
   - `POST /webhook/task-push` -- Queue a task for autonomous execution
   - `POST /webhook/brain-dump` -- Submit a brain dump for local Llama processing
   - `POST /webhook/agent-dispatch` -- Trigger a specific agent with context
   - `GET /webhook/status` -- Check Mac Mini health and queue depth

2. **Push from MacBook Pro:**
   - CLI tool: `forge push --task "Process Ridgeline brain dumps" --agent orchestrator`
   - Forge Console UI: "Push to Mac Mini" button on tasks and brain dumps (when detected on non-Mini machine)
   - Mobile app: "Send to home base" action that queues for Mac Mini processing

3. **Task queue on Mac Mini:**
   - n8n receives webhook, writes to a `task_queue` table in Supabase: id, task_type, payload_json, status (queued/processing/done/failed), submitted_from, created_at, completed_at
   - Llama worker polls the queue every 5 minutes (or n8n cron triggers processing)
   - Results write back to Supabase (brain_dumps parsed, tasks created, summaries generated)
   - Push notification to Lucas via Slack: "Mac Mini completed 3 queued tasks while you were away"

4. **Security:**
   - Webhook endpoints require an API key (stored in both machines' .env)
   - Cloudflare Tunnel provides HTTPS without exposing ports
   - Rate limiting on webhook endpoints (prevent accidental loops)
   - All webhook calls logged to activity_log with tool="Remote-Push"

5. **Sync protocol:**
   - Supabase is the shared state -- both machines read/write to the same database
   - Git repos sync via GitHub (push from MacBook, pull on Mac Mini via n8n cron or webhook)
   - File system changes on Mac Mini (GSD plans, codebase changes) commit and push automatically
   - Conflict resolution: Mac Mini work always commits to a branch, Lucas merges on return

6. **Dashboard integration:**
   - "Remote Queue" indicator on Dashboard: "3 tasks queued on Mac Mini" with status
   - Click: shows queue detail with task descriptions, status, and estimated completion
   - When Lucas returns to Mac Mini: "Welcome back. 7 tasks completed while you were away. Review?"

7. **Scope:** Post-v1. Depends on local Llama setup and agent system. But the Cloudflare Tunnel and n8n infrastructure already exist. The webhook endpoints could be built as n8n workflows in a single session. The `task_queue` table is the key schema addition.
