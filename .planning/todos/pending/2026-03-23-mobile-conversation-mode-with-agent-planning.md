---
created: 2026-03-23T00:43:00.000Z
title: Mobile conversation mode with agent planning
area: general
files:
  - .planning/todos/pending/2026-03-23-premium-iphone-app-purpose-built-for-mobile-capture.md
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
---

## Problem

The mobile capture experience (Phase 9 /capture route and the future iPhone app) is one-directional: Lucas types, the system saves. There is no back-and-forth. But some of Lucas's most productive thinking happens in conversation -- walking, driving, lying in bed at 3 AM. He needs to be able to ramble at an agent and have it organize his thoughts into actionable structure.

Current brain dump flow: Lucas types raw text -> Claude parses into tasks -> done. But real planning sessions involve iteration: "What about the timeline for this?" "Actually move that to CLARITY instead." "Break that into three subtasks." "What's blocking the Ridgeline demo?" This requires a conversational interface, not a form.

Voice-to-text is critical here. Lucas will dictate while walking or driving. The agent must handle messy, rambling voice input and extract structure from it.

## Solution

1. **Conversation screen on mobile app:** Fourth tab (or accessible from capture screen via "Chat" toggle). Chat bubble UI with Lucas's messages on the right, agent responses on the left. Messages persist in Supabase.

2. **Conversation modes:**
   - **Planning mode:** "Let's plan the next week for CLARITY." Agent pulls project context, suggests priorities, Lucas refines. Output: tasks created, focus items set, decisions logged.
   - **Brain dump mode:** Lucas rambles. Agent listens, asks clarifying questions, groups thoughts by project, extracts tasks. "You mentioned 4 things about Ridgeline and 2 about Forge. Want me to create tasks?" Output: structured brain dumps.
   - **Review mode:** "What happened on Ridgeline this week?" Agent summarizes activity log, highlights completed work, flags gaps. Output: verbal status report.

3. **Voice-first design:**
   - Persistent mic button (large, bottom-center). Tap to start, tap to stop.
   - Real-time transcription displayed as Lucas speaks.
   - Agent responds with text (not voice -- reading is faster than listening).
   - Automatic sentence detection and paragraph grouping from voice stream.
   - Handle "um", "uh", repeated words, and mid-sentence corrections gracefully.

4. **Context persistence:**
   - Conversations stored in a `conversations` table: id, project_id (optional), messages_json, created_at, updated_at.
   - Agent has full conversation history within a session.
   - Sessions auto-close after 30 minutes of inactivity.
   - Previous sessions visible in a "History" section.
   - Desktop Brain Dump page shows conversation-originated dumps with a "From conversation" badge.

5. **Agent routing:**
   - If conversation mentions a specific project, route to that project's PM agent.
   - If cross-project, route to the Orchestrator.
   - Agent identifies itself: "I'm your Ridgeline PM. Let's look at where things stand."

6. **Scope:** Post-v1, depends on both the iPhone app and the multi-agent system. But the `conversations` table and the agent message protocol should be designed early so brain dump and agent dispatch features (BSUG-02, BSUG-10) can evolve into this naturally.
