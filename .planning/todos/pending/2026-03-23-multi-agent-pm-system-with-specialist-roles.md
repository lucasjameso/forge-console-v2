---
created: 2026-03-23T00:39:00.000Z
title: Multi-agent PM system with specialist roles
area: general
files:
  - .planning/feedback/PHASE-09-SETTINGS-MOBILE-DEPLOY-SPEC.md
  - .planning/feedback/PHASE-05-BRAIN-DUMP-SPEC.md
---

## Problem

The current Forge Console treats AI as a single generic assistant. But Lucas does not need one assistant -- he needs a team. Different tasks require fundamentally different expertise: planning requires strategic thinking, QA requires adversarial rigor, content review requires editorial judgment, prioritization requires cross-project awareness, and execution support requires deep technical context.

A single-agent model forces Lucas to context-switch the AI constantly ("now be a planner", "now review this content", "now prioritize my backlog"). Distinct agents with persistent roles, memory, and expertise would let Lucas call on the right specialist for each situation -- like a PM managing a team of direct reports.

The feedback specs reference agents in multiple places: BSUG-10 (brain dump to agent dispatch), STSUG-07 (agent configuration section), ASUG-10 (agent audit trail), and PDSUG-01 (assign action items to agents). The architecture is already anticipated across the app.

## Solution

1. **Agent roles (minimum viable team):**
   - **Orchestrator:** Routes work, manages priorities, generates daily briefings. Sees all projects.
   - **Ridgeline PM:** Deep context on Ridgeline. Manages tasks, suggests priorities, tracks blockers.
   - **CLARITY PM:** Deep context on CLARITY launch. Manages content calendar, tracks launch readiness.
   - **Forge PM:** Deep context on Forge Console. Manages build phases, tracks quality bar.
   - **QA Agent:** Reviews completed work against specs. Runs the honest feedback protocol (see todo). Flags regressions.
   - **Content Agent:** Reviews content pipeline items. Suggests edits, checks brand voice, evaluates posting strategy.

2. **Agent configuration UI (STSUG-07):** Settings page section showing agent registry, model assignment (Haiku/Sonnet/Opus), token budget, autonomy level (propose only / execute with approval / fully autonomous).

3. **Agent dispatch from Forge Console:**
   - Brain Dump: "Dispatch to agent" button (BSUG-10) sends to relevant PM agent
   - Action Items: "Assign to" dropdown includes agents (PDSUG-01)
   - Content Pipeline: "Request review" sends to Content Agent
   - Dashboard: Orchestrator generates Today's Focus suggestions

4. **Agent audit trail (ASUG-10):** Every agent action logged to activity_log with agent identity, decision rationale, and approve/revert buttons.

5. **Infrastructure:** n8n workflows as agent backends. Each agent is a webhook endpoint that receives context, processes via Claude API (model per agent config), and writes results back to Supabase. Forge Console reads results and displays them.

6. **Scope:** This is post-v1 (beyond Phase 9). But the UI scaffolding in Phase 9 (STSUG-07) and the data model decisions in Phase 8 (action item assignment, completion logging) must be designed with multi-agent in mind. Do not build single-agent assumptions into the schema.
