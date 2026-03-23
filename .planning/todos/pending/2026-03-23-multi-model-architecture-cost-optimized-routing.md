---
created: 2026-03-23T00:45:00.000Z
title: Multi-model architecture cost-optimized routing
area: general
files:
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
  - .planning/feedback/PHASE-09-SETTINGS-MOBILE-DEPLOY-SPEC.md
---

## Problem

Running everything through Claude Opus is expensive and unnecessary. Brain dump parsing does not need Opus. System health checks do not need Opus. Content proofreading does not need Opus. But deep planning, complex code review, and nuanced prioritization do. The system must route tasks to the right model based on capability requirements and cost.

Lucas has a Mac Mini (M4) that can run local models, a MacBook Pro for heavy work, and cloud API access to multiple providers. The architecture should exploit all of these based on context: local models for background processing, cheap cloud models for routine tasks, Opus for the work that matters.

The feedback spec already references model assignment per agent (STSUG-07). But this needs to be a first-class architecture decision, not an afterthought in settings.

## Solution

1. **Model routing table (initial design):**

   | Task Type | Model | Rationale |
   |-----------|-------|-----------|
   | Brain dump parsing | Claude Haiku or DeepSeek | Fast, cheap, sufficient for extraction |
   | Content caption proofreading | Claude Sonnet | Good writing quality, moderate cost |
   | Action item summarization | Llama (local) | Free, private, fast on M4 |
   | System health checks | No model needed | Direct API calls |
   | Task prioritization | Claude Sonnet | Needs cross-project reasoning |
   | Deep planning sessions | Claude Opus | Strategic thinking, complex context |
   | QC review | Claude Sonnet | Needs spec comparison, not creativity |
   | Agent conversations (mobile) | Claude Sonnet | Good conversational quality |
   | Content strategy suggestions | Claude Opus | Creative + strategic |
   | Batch task creation | Claude Haiku | Structured output, low complexity |
   | Code review / execution | Claude Opus (MacBook Pro) | Full codebase context needed |

2. **Cost tracking integration (STSUG-10):** Every API call logs: model used, tokens consumed, estimated cost, task type. Dashboard shows daily/weekly/monthly spend by model and task type. Alert when approaching budget thresholds.

3. **Agent config UI (STSUG-07):** Each agent's model assignment is configurable. Defaults from the routing table above. Lucas can override: "Use Opus for CLARITY PM during launch week" (when quality matters most).

4. **Local model infrastructure:**
   - Llama 3 running on Mac Mini via Ollama for background tasks
   - No API cost, no latency, no rate limits
   - Use for: summarization, simple extraction, classification, embedding generation
   - Fallback to cloud when local model is insufficient (confidence < threshold)

5. **Dynamic routing (future):** The system learns which model produces acceptable results for each task type. If Haiku handles brain dump parsing with 95% acceptance rate, keep using it. If acceptance drops, auto-escalate to Sonnet. Track acceptance = "Lucas did not override the model's output."

6. **Scope:** Architecture decision needed before the multi-agent system is built. The n8n workflows should accept a `model` parameter from the start. The Forge Console API proxy (DEPL-01) should support routing to multiple providers, not just Claude.
