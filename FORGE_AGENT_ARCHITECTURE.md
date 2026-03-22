# Forge Agent Architecture -- Vision Document
# Owner: Lucas Oliver | IAC Solutions
# Date: March 22, 2026
# Status: Vision capture. Not yet in build.

---

## The Vision in One Paragraph

Forge is not a dashboard. It is an autonomous multi-agent orchestration platform with a human command interface. Every project Lucas manages gets its own dedicated AI project manager agent with isolated context, memory, and decision-making capability. An orchestrator agent sits above all project managers, routing work, surfacing blockers, and ensuring nothing falls behind. Sub-agents (Haiku-class) handle lightweight tasks delegated by project managers. Lucas interacts with this system through two surfaces: a desktop command center (full management) and a mobile capture tool (dictation, brain dumps, quick task assignment). The system is built so Lucas manages a virtual team the same way he would manage a human team of 10, 20, or 30 people.

---

## Agent Hierarchy

```
LUCAS (CEO / Decision Maker)
  |
  |-- Forge Console (UI Layer -- desktop + mobile)
  |
  |-- ORCHESTRATOR AGENT (Chief of Staff)
  |     |
  |     |-- Monitors all project managers
  |     |-- Routes brain dumps to the right agent
  |     |-- Surfaces cross-project blockers and conflicts
  |     |-- Prevents anything from falling behind
  |     |-- Generates daily/weekly briefings
  |     |
  |     |-- PROJECT MANAGER: Ridgeline Intelligence
  |     |     |-- Own knowledge base, memory, context
  |     |     |-- Spawns Haiku sub-agents for tasks
  |     |     |-- Maintains its own task board, milestones, notes
  |     |     |-- Reports status to orchestrator
  |     |
  |     |-- PROJECT MANAGER: CLARITY Book Launch
  |     |     |-- Own knowledge base, memory, context
  |     |     |-- Spawns Haiku sub-agents for tasks
  |     |     |-- Manages content pipeline, launch timeline
  |     |     |-- Reports status to orchestrator
  |     |
  |     |-- PROJECT MANAGER: Forge Console
  |     |     |-- Own knowledge base, memory, context
  |     |     |-- Spawns Haiku sub-agents for tasks
  |     |     |-- Reports status to orchestrator
  |     |
  |     |-- PROJECT MANAGER: [Future Project N]
  |     |     |-- Auto-scaffolded by Office Manager
  |     |
  |     |-- OFFICE MANAGER AGENT
  |           |-- Creates new projects on demand
  |           |-- Scaffolds file system, knowledge base, agent config
  |           |-- Onboards new project manager agents
  |           |-- Handles administrative tasks across all projects
```

---

## Agent Types

### 1. Orchestrator (Chief of Staff)
**Role:** Cross-project oversight, routing, prioritization, and briefings.

**Capabilities:**
- Receives all brain dumps first, determines which project agent should handle them
- Monitors all project managers for status, blockers, missed deadlines
- Generates daily briefing: "Here's what needs your attention across all projects"
- Detects conflicts (e.g., two projects competing for Lucas's time on the same day)
- Escalates when a project manager is stuck or a deadline is at risk
- Can reassign tasks between project managers if priorities shift

**Context:** Has read access to all project manager states. Does not hold project-specific deep context. Thinks at the portfolio level.

**Model:** Sonnet or Opus (needs reasoning for prioritization and cross-project analysis)

### 2. Project Manager (Per-Project Agent)
**Role:** Owns one project end-to-end. Manages tasks, tracks progress, maintains context, and executes work.

**Capabilities:**
- Maintains its own isolated knowledge base (project-specific docs, decisions, history)
- Manages task board (to-do, in-progress, done)
- Tracks milestones and deadlines
- Receives brain dumps routed from orchestrator (project-specific captures)
- Receives direct brain dumps when Lucas is in that project's context
- Spawns Haiku sub-agents for lightweight tasks (reading files, researching, simple analysis)
- Reports status to orchestrator on a schedule
- Maintains RESUME_HERE.md equivalent so context can be restored after any interruption
- Can request help from orchestrator when stuck

**Each project manager has its own isolated file system / data store:**
```
project_agent_context/
  KNOWLEDGE_BASE.md      -- Project-specific knowledge, decisions, domain context
  MEMORY.md              -- Running log of what this agent has done and learned
  RESUME_HERE.md         -- Current state, next action, context for resuming
  CHECKLIST.md           -- Active task list with priorities
  README.md              -- Project purpose, scope, stakeholders, constraints
  DECISIONS_LOG.md       -- Key decisions made and rationale
  SESSION_HISTORY/       -- Log of all agent sessions on this project
    session_001.md
    session_002.md
    ...
```

**Model:** Sonnet (capable enough for project management, cost-effective for always-on agents)

### 3. Sub-Agent (Task Worker)
**Role:** Executes specific lightweight tasks delegated by a project manager.

**Capabilities:**
- Read files and report findings
- Research a topic and summarize
- Draft content based on instructions
- Run simple analysis or data checks
- Execute one-off tasks that don't require deep project context

**Context:** Receives only the specific context needed for the task. Does not have access to the full project knowledge base. Reports results back to the project manager.

**Model:** Haiku (cheapest, fastest, sufficient for bounded tasks)

### 4. Office Manager
**Role:** Administrative agent that handles project creation and system maintenance.

**Capabilities:**
- Creates new project scaffolding when Lucas says "start a new project"
- Sets up the file system / database entries for the new project
- Initializes the knowledge base, README, and checklist templates
- Spins up a new project manager agent with the right configuration
- Handles cross-project administrative tasks (archiving completed projects, generating reports)
- Manages the agent registry (which agents exist, their status, their config)

**Model:** Sonnet (needs to create structured output but not deep reasoning)

---

## Data Architecture

### Option A: Supabase Relational Database (Recommended)

Every agent's state lives in Supabase. Relational structure allows:
- Querying across all projects ("show me all overdue tasks across all agents")
- The orchestrator to read all project states without loading files
- The UI (Forge Console) to display agent data directly
- Structured task routing and assignment
- History and audit trails

**Schema additions for agent system:**

```sql
-- Agent registry
create table agents (
  id uuid primary key default gen_random_uuid(),
  name text not null,                    -- "Ridgeline PM", "Orchestrator"
  agent_type text not null,              -- orchestrator, project_manager, office_manager, sub_agent
  project_id uuid references projects,   -- null for orchestrator and office manager
  model text default 'sonnet',           -- haiku, sonnet, opus
  status text default 'active',          -- active, paused, archived
  config jsonb default '{}',             -- agent-specific configuration
  last_active_at timestamptz,
  created_at timestamptz default now()
);

-- Agent knowledge base (per agent, structured)
create table agent_knowledge (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents not null,
  doc_type text not null,                -- knowledge_base, memory, resume_here, checklist, readme, decisions
  content text not null,
  version int default 1,
  updated_at timestamptz default now(),
  created_at timestamptz default now()
);

-- Agent sessions (history of what each agent has done)
create table agent_sessions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents not null,
  session_type text,                     -- execution, research, review, sub_agent_dispatch
  input_summary text,                    -- what was the agent asked to do
  output_summary text,                   -- what did the agent produce
  tokens_used int,
  model_used text,
  duration_seconds int,
  metadata jsonb default '{}',
  created_at timestamptz default now()
);

-- Agent messages (communication between agents)
create table agent_messages (
  id uuid primary key default gen_random_uuid(),
  from_agent_id uuid references agents,  -- null if from Lucas
  to_agent_id uuid references agents not null,
  message_type text not null,            -- brain_dump, task_assignment, status_report, escalation, question
  content text not null,
  parsed_output jsonb,                   -- structured data extracted from content
  status text default 'pending',         -- pending, received, processed, archived
  created_at timestamptz default now(),
  processed_at timestamptz
);

-- Sub-agent tasks (delegated by project managers)
create table sub_agent_tasks (
  id uuid primary key default gen_random_uuid(),
  parent_agent_id uuid references agents not null,  -- the PM that delegated
  sub_agent_id uuid references agents,               -- the haiku agent that ran it
  task_description text not null,
  task_type text,                        -- read_file, research, draft, analyze, check
  input_context text,                    -- what context was given to the sub-agent
  output text,                           -- what the sub-agent returned
  status text default 'pending',         -- pending, running, complete, failed
  created_at timestamptz default now(),
  completed_at timestamptz
);
```

### Option B: Hybrid (Supabase + File System)

Agent state in Supabase for querying and UI display. But each agent also maintains a local file system at a known path for Claude Code sessions that need filesystem access:

```
~/Forge/Agents/
  orchestrator/
    KNOWLEDGE_BASE.md
    MEMORY.md
    ...
  ridgeline-pm/
    KNOWLEDGE_BASE.md
    MEMORY.md
    RESUME_HERE.md
    CHECKLIST.md
    README.md
    DECISIONS_LOG.md
    sessions/
  clarity-pm/
    ...
  forge-pm/
    ...
```

Supabase is the source of truth. File system is a working copy that agents use during Claude Code sessions. n8n syncs between them.

**Recommendation:** Start with Option A (Supabase only). Add file system working copies in Option B only if Claude Code sessions need them. Keep it simple until we prove the architecture works.

---

## Brain Dump Routing

When Lucas captures a brain dump (desktop or mobile):

```
Lucas speaks or types brain dump
  |
  v
Text saved to Supabase (brain_dumps table)
  |
  v
Orchestrator agent receives the dump
  |
  v
Orchestrator parses with Claude API:
  - Extracts action items
  - Identifies which project(s) each item relates to
  - Determines if any items are cross-project or new-project
  |
  v
Orchestrator routes:
  - Project-specific items --> sent as agent_message to that project's PM
  - Cross-project items --> orchestrator handles directly
  - New project ideas --> sent to office manager for evaluation
  - Unassignable items --> stay in orchestrator inbox for Lucas to triage
  |
  v
Each PM receives their items:
  - Creates tasks on their task board
  - Updates their knowledge base if new context
  - Spawns sub-agents if immediate action is needed
  - Reports back to orchestrator that items were received
```

**Special case: Direct brain dump to a project agent.**
When Lucas is on a specific project's page in Forge Console and uses the brain dump input, the text routes directly to that project's PM agent (bypassing the orchestrator). This is faster for project-specific captures.

---

## Mobile Experience Architecture

### Desktop (Full Command Center)
- All 7 pages as designed in idea.md
- Full project dashboards with task boards, kanban, milestones
- Content pipeline management with 4 view modes
- Social media tracking
- Settings and configuration
- Agent status monitoring (which agents are active, last session, health)

### Mobile (Focused Capture Tool)
Not a responsive version of the desktop. A purpose-built mobile experience.

**Mobile screens:**

1. **Capture** (default landing on mobile)
   - Large text input (supports dictation via native speech-to-text)
   - Big microphone button for dictation (primary action)
   - **"Send to:" project picker above the input** (defaults to "Orchestrator" which means auto-route)
     - Tap to select: Orchestrator (auto-route), Ridgeline, CLARITY, Forge, or any active project
     - If a project is selected, the brain dump goes directly to that project's PM agent
     - If Orchestrator is selected, it parses and routes automatically
   - Send button (or tap mic to stop dictation and auto-send)
   - Most recent captures below (last 5, collapsible, shows routing status)
   - **The capture screen should feel as fast as opening Apple Notes and typing. Zero friction.**

2. **Inbox**
   - Items needing Lucas's attention (from orchestrator)
   - Quick actions: approve, reject, snooze, assign
   - Triage mode: swipe left to dismiss, swipe right to approve

3. **Projects** (simplified)
   - Card per project: name, progress bar, top blocker, agent status
   - Tap to see: action items, recent activity, quick brain dump for this project
   - No full kanban or milestone timeline on mobile

4. **Status**
   - System health at a glance
   - Agent statuses (all green? anyone stuck?)
   - Upcoming deadlines across all projects

**Mobile design principles:**
- Feels like a native iOS app (large touch targets, swipe gestures, haptic-style animations)
- Dictation-first for capture (big microphone button, text appears as you speak)
- Maximum 2 taps to capture an idea
- Maximum 3 taps to triage an inbox item
- No complex management on mobile (that's desktop work)

---

## Agent Communication Patterns

### Design Principle: Talk to Agents Like People

Agents are not tools. They are team members. Lucas communicates with them the same way he would communicate with a human project manager. No command syntax, no special formatting, no JSON. Plain English. Dictation. Quick text. The way you'd message a team member on Slack.

**Examples of how Lucas talks to agents:**

To the Orchestrator:
- "What's the most important thing I need to handle today?"
- "I'm feeling behind on CLARITY. What's the status?"
- "Move the Ridgeline demo to next week. Tell the PM."
- "I had an idea about the book launch. We should do a LinkedIn Live the week before."

To a Project Manager (Ridgeline):
- "The demo data is done. What's next?"
- "Clint called. He wants the estimating module prioritized over scheduling."
- "I need the competitive analysis updated before Thursday."

To a Project Manager (CLARITY):
- "Week 7 content is approved. Schedule it."
- "Add a task to reach out to 5 more podcasts this week."
- "The hardcover proof came back wrong. We need to resubmit to IngramSpark."

**How agents respond:**

Agents respond like a competent team member would. Brief, clear, action-oriented. No filler, no sycophancy, no "Great question!" They acknowledge, confirm understanding, state what they'll do, and flag anything that needs Lucas's decision.

Example orchestrator morning briefing:
```
Morning, Lucas. Here's your day:

3 things need you:
1. CLARITY: Week 7 Wednesday carousel is pending approval (submitted 14 hours ago)
2. Ridgeline: Clint's team reported a bug in the job tracking module. PM has a fix plan ready for your review.
3. Forge: Cloudflare Pages deployment failed overnight. Error log attached.

Everything else is on track. CLARITY launch is 26 days out, all milestones green. Ridgeline Phase 3 execution is at 67%. No cross-project conflicts today.

Want me to expand on any of these?
```

### 1. Lucas --> Agent (via Forge Console)
- Brain dump (text or dictation, routed by orchestrator or direct to project PM)
- Task creation (plain English "do this" to a specific agent)
- Approval/rejection (content pipeline, task completion)
- Configuration change (update knowledge base, change priorities)
- Conversational (ask a question, get a briefing, discuss a decision)

### 2. Agent --> Lucas (via Forge Console UI + Slack notifications)
- Status reports (daily briefing from orchestrator, weekly from PMs)
- Blockers (agent is stuck, needs a decision)
- Completion notifications (task done, content ready for review)
- Questions (agent needs clarification before proceeding)
- Proactive alerts ("You have a deadline in 3 days and 2 tasks are still open")

### 3. Agent --> Agent (via Supabase agent_messages table)
- Orchestrator --> PM: routed brain dump tasks, priority changes, deadline warnings
- PM --> Orchestrator: status reports, escalations, completion notices
- PM --> Sub-agent: task delegation with bounded context
- Sub-agent --> PM: task results
- Office Manager --> PM: new project onboarding, configuration updates

### 4. Scheduled Communication (via n8n)
- Every morning: orchestrator generates daily briefing
- Every hour: PMs report status to orchestrator
- Every 5 minutes: system health check written to Supabase
- On event: content approval triggers Slack notification

---

## How a New Project Gets Created

Lucas says: "I'm starting a new project called Vantage. It's a competitive intelligence dashboard for FAS."

```
Input captured as brain dump or direct command
  |
  v
Orchestrator recognizes "new project" intent
  |
  v
Routes to Office Manager agent
  |
  v
Office Manager:
  1. Creates entry in projects table (name, slug, description)
  2. Creates entry in agents table (new PM agent, linked to project)
  3. Creates agent_knowledge entries:
     - KNOWLEDGE_BASE: seeded with project description
     - README: project purpose, scope, constraints
     - CHECKLIST: empty, ready for tasks
     - RESUME_HERE: "Project just created. Awaiting first tasks."
     - MEMORY: "Project created on [date] by Lucas."
  4. Sends agent_message to orchestrator: "New project Vantage created. PM agent active."
  5. Sends notification to Lucas: "Vantage project created. PM agent is ready."
  |
  v
Lucas can now brain dump to Vantage PM directly
Orchestrator adds Vantage to its monitoring list
Forge Console shows Vantage in the Projects page
```

---

## Technology Stack for Agent System

| Component | Technology | Why |
|-----------|-----------|-----|
| Agent state | Supabase Postgres | Relational, queryable, real-time subscriptions |
| Agent execution | Claude API (Sonnet/Haiku) | Direct API calls from n8n or from Forge Console |
| Task routing | n8n workflows | Conditional logic, scheduling, webhook triggers |
| Agent communication | Supabase tables + n8n | Messages stored in DB, n8n processes the queue |
| Notifications | Slack webhooks | Push notifications for important events |
| Mobile capture | Forge Console PWA | Same Vite app, mobile-optimized routes, speech-to-text API |
| Dictation | Web Speech API (browser native) | Free, works on iOS Safari, no external dependency |
| File system sync | n8n (optional, Phase 2) | Syncs Supabase agent state to ~/Forge/Agents/ for Claude Code |

---

## Build Phases (Separate from Forge Console UI rebuild)

This is a separate project/milestone. Do not mix with the current GSD UI rebuild.

| Phase | Name | Scope |
|-------|------|-------|
| 1 | Schema + Agent Registry | Supabase tables for agents, knowledge, sessions, messages. Seed with 3 PM agents + orchestrator + office manager. |
| 2 | Orchestrator MVP | Brain dump routing. Daily briefing generation. Cross-project status monitoring. |
| 3 | Project Manager MVP | One PM agent (Ridgeline) with full lifecycle: receive tasks, manage board, report status, spawn sub-agents. |
| 4 | Sub-Agent Delegation | PM can spawn Haiku agents for bounded tasks. Results flow back. |
| 5 | Office Manager | New project creation flow. Scaffolding automation. |
| 6 | Mobile Capture | PWA mobile routes. Dictation. Type and go. Direct-to-agent routing. |
| 7 | Full Agent Fleet | Roll out PM agents for CLARITY and Forge. Full orchestrator monitoring. |
| 8 | n8n Integration | Scheduled briefings, hourly status checks, health monitoring, Slack notifications. |

---

## Confirmed Decisions (March 22, 2026)

1. **Where do agents run?** n8n workflows calling the Claude API. Stateless execution, all state in Supabase. n8n runs locally on the Mac Mini via PM2, accessible anywhere at https://n8n.iac-solutions.io through Cloudflare tunnel. n8n's native node library gives access to services that would otherwise require custom API integrations. **CONFIRMED.**

2. **Agent autonomy.** Start with "agents propose, Lucas approves." PMs can create draft tasks and spawn read-only sub-agents. Anything that changes state (marks done, creates external resources) requires approval. **CONFIRMED.**

3. **Cost management.** Haiku for all sub-agents. Sonnet for PMs and orchestrator. Opus only for Lucas's direct Claude Code sessions. n8n + webhooks keeps the execution layer cheap since n8n is self-hosted (no per-execution costs). Daily token budget per agent. **CONFIRMED.**

4. **Claude Code integration.** Separate but synced. Claude Code reads the PM's RESUME_HERE and KNOWLEDGE_BASE from Supabase at session start. After the session, results sync back. They are not the same process. **CONFIRMED.**

5. **Dictation.** Start with Web Speech API (browser-native, free, works on iOS Safari). Upgrade to Deepgram if accuracy is a problem. **CONFIRMED.**

6. **Potential collaborator.** Lucas has a friend who is an AI agent specialist currently getting his masters in Spain. He may assist with the agent architecture build, particularly the parts that could be built outside of n8n. Keep the architecture documented clearly enough for a second developer to onboard.

---

## What Success Looks Like

Lucas opens Forge Console on his phone while walking his dog. An idea hits him. He taps the microphone, dictates for 30 seconds, and hits send. By the time he gets back to his desk, the orchestrator has parsed it into three tasks, routed two to the Ridgeline PM and one to the CLARITY PM, and both PMs have added them to their task boards. Lucas opens the desktop console, sees the tasks in place, and moves on to his next decision. He never had to manually create a task, assign it to a project, or remember which project it belonged to. The system handled it.

---

*This document captures the full vision. All architectural decisions confirmed by Lucas on March 22, 2026. It is NOT part of the current GSD UI rebuild. It will become a separate GSD project once the Forge Console UI is at quality. Document is written to be clear enough for a second developer to onboard.*
