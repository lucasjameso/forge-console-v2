# SEED DATA GENERATION BRIEF
# Paste this into the Forge Console v2 Claude Code session

Before we continue with Phase 4 (Visual Polish), we need to seed Supabase with comprehensive real data across all 14 tables. This is not just about making pages render. This is about building the complete data foundation that this platform will use long-term for statistics, analytics, agent orchestration, and decision-making.

## WHAT YOU NEED TO DO

### Step 1: Generate a complete data requirements document

For EVERY table in supabase/schema.sql, produce:

1. **Table name and purpose** -- what this table tracks and why it matters
2. **Every column** with its type, constraints, and a plain-English description of what goes in it
3. **What this data powers** -- which pages, components, statistics, and future features depend on it
4. **Sample row** -- one fully filled example row showing the exact format
5. **Data collection template** -- a structured prompt I can paste into other Claude Code sessions (Ridgeline, CLARITY) to collect their project-specific data
6. **Mock data needs** -- what should be generated as realistic mock data (past brain dumps, agent conversations, historical activity) vs. what must come from the real projects
7. **Statistics and analytics considerations** -- what fields exist specifically to support future dashboards, trend tracking, agent performance measurement, and reporting. If any fields are MISSING for future analytics, flag them and suggest schema additions.

### Step 2: Think through these data categories comprehensively

**Projects table:**
- Real data for 3 projects: Ridgeline Intelligence, CLARITY Book Launch, Forge Console
- Current phase, progress percentage, priority, status
- GitHub URLs, Supabase project refs, Cloudflare URLs
- Description that captures what each project actually is

**Tasks table:**
- Real tasks for each project based on what we are actually working on right now
- Mix of todo, in_progress, and done statuses
- Realistic priorities and descriptions
- Think about what tasks Ridgeline has (Phase 3 demo data, design system), what CLARITY has (cover files, marketing platforms, pre-launch list), what Forge Console has (remaining phases)

**Project milestones:**
- Real milestones with real target dates
- Ridgeline: POC launch, first paying client
- CLARITY: April 17 launch, pre-orders, marketing ramp, 90-day post-launch
- Forge Console: MVP complete, Cloudflare deployment, agent architecture

**Project action items:**
- Real blockers and decisions needed right now
- Things Lucas is actually waiting on or needs to decide

**Project notes:**
- Key decisions made during these builds
- Context that a project manager agent would need to understand the project history
- Think about what would be in a human PM's notebook

**Brain dumps:**
- Generate 8-10 realistic historical brain dumps based on the kinds of things Lucas thinks about
- Mix of project-specific and cross-project dumps
- Each should have realistic parsed_output JSON showing how the AI would extract tasks
- Include some that are assigned and done, some pending, some that span multiple projects
- These should feel like real stream-of-consciousness captures, not clean task lists

**Brain dump tasks:**
- Extracted from the brain dumps above
- Show the full lifecycle: some pending, some assigned to projects, some completed
- Demonstrate the routing system working (tasks assigned to correct projects)

**Content reviews:**
- Real content from the CLARITY launch content calendar
- Week 5, 6, 7, 8 content with real post titles based on the Build What Lasts brand
- Mix of statuses: draft, pending, approved, rejected, posted
- Include revision numbers (some content has been revised)
- Scheduled dates that align with the real posting calendar (Tuesday, Wednesday, Friday posting cadence)
- Platform assignments (LinkedIn primary)
- At least one rejected item with feedback text showing the approval loop

**Social platforms:**
- Real platform data:
  - LinkedIn: handle @lucasoliver, 6,100 followers, target 10,000
  - Goodreads: setup needed for CLARITY launch
  - Amazon Author Central: setup needed
  - BookBub: setup needed
  - Medium/Substack: current status
  - TikTok: current status
- Each should have accurate status (active vs. setup_needed)
- Last post dates where applicable

**Podcast tracker:**
- Generate 5-8 realistic podcast outreach entries
- Mix of statuses: outreach sent, scheduled, recorded, published
- Podcast names should be realistic for the construction/leadership/B2B space
- Include some with notes about the conversation or episode topic

**Activity log:**
- Generate 30-50 historical activity entries spanning the last 2 weeks
- Mix of session_types: claude_code, n8n, slack, cowork, system, manual
- Spread across all 3 projects plus system-level entries
- Realistic summaries that reflect actual work (building components, running workflows, reviewing content, deploying, debugging)
- Chronological, with realistic timestamps (cluster work during morning and evening hours, gaps during business hours when Lucas is at his corporate job)

**System health:**
- Current snapshot for PM2, n8n, and Cloudflare tunnel
- All healthy (or set one to degraded for visual testing)

**Settings:**
- Real configuration values for n8n URL, Cloudflare tunnel endpoint
- Placeholder entries for Slack channel mappings

**Next session prompts:**
- One per project describing what the next Claude Code session should work on
- Based on real current state of each project

### Step 3: Flag any schema gaps

As you build this out, if you realize the schema is missing columns or tables needed for:
- Agent orchestration (agent state, agent messages, sub-agent tasks)
- Long-term trend tracking (weekly progress snapshots, velocity metrics)
- Content performance (post-publishing engagement data, impressions, clicks)
- Time tracking (how long tasks take, session durations)
- Cost tracking (API token usage per project, per agent)
- Goal tracking (follower targets, revenue targets, launch metrics)

...flag them explicitly with a recommended schema addition. Do NOT silently skip them. We want to build the data model right the first time.

### Step 4: Produce two outputs

**Output 1: Data Collection Templates**
For each of the 3 projects, produce a structured prompt I can paste into that project's Claude Code session. The prompt should say:

"Forge Console needs the following data about this project. Based on everything you know about [Project Name] from our sessions, CLAUDE.md, PROGRESS.md, and the current state of the codebase, fill in these fields with accurate current data:"

Then list exactly what fields to fill in with descriptions of what each one means.

**Output 2: seed.sql**
A complete SQL file with INSERT statements for:
- All mock/generated data (brain dumps, activity log, podcast tracker, historical content)
- Placeholder rows for real project data (marked with comments showing where the collected data will be inserted)
- Settings and system health entries

The seed.sql should be runnable in Supabase SQL Editor in one shot. Include comments explaining each section.

### Step 5: Schema migration if needed
If Step 3 identified missing columns or tables, produce a separate migration.sql file that adds them. This runs BEFORE seed.sql.

## RULES
- NO em dashes anywhere in generated text content
- Use realistic dates (March 2026 timeframe)
- Activity log timestamps should reflect Lucas's actual schedule: early morning (3-6 AM), evening (5-10 PM), weekends. Minimal activity during 8 AM - 5 PM weekdays (corporate job)
- Brain dump text should sound like Lucas talking (direct, action-oriented, no fluff)
- Content post titles should align with Build What Lasts brand themes: leadership systems, operational clarity, structure over slogans, proof over opinions
- LinkedIn follower count is 6,100 with a target of 10,000 by December 31, 2026
- CLARITY launches April 17, 2026. Pricing: Kindle $9.99, Paperback $19.99, Hardcover $27.99

## AFTER COMPLETION
Once you produce the templates and seed.sql:
1. Save the data collection templates as individual files I can send to each project session
2. Save seed.sql to supabase/seed.sql
3. Save migration.sql to supabase/migration.sql (if needed)
4. Tell me which templates to take to which Claude Code sessions and in what order
