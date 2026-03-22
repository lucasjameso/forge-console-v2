# Forge Console Data Collection: Ridgeline Intelligence

## What This Is

I have a project called **Forge Console** -- a personal command center that tracks all my active builds, content pipeline, and agent system. It has a Supabase database with 14 tables. I need you to fill in the Ridgeline Intelligence data based on everything you know from this project's CLAUDE.md, PROGRESS.md, .planning/, codebase state, git history, and our session history.

**Output format:** Return a single JSON object matching the schema below. I will merge this into my seed.sql file. Be accurate -- use real data from the codebase, not made up values.

## What to Pull From

Look at these sources in this project:
- `CLAUDE.md` -- project description, tech stack, constraints
- `PROGRESS.md` or `.planning/ROADMAP.md` -- phase status, what is done vs in progress
- `.planning/STATE.md` -- current position, blockers, decisions
- `.planning/phases/` -- all phase directories, PLAN.md and SUMMARY.md files
- `package.json` -- tech stack details
- Recent git log (`git log --oneline -20`) -- what was built recently
- Any task boards, kanban state, or TODO tracking in the codebase
- Supabase schema if present -- current database state
- Deployment config (wrangler.toml, vercel.json, etc.)

## JSON Schema

Return exactly this structure. Every field is required unless marked `nullable`. Use real dates in ISO 8601 format (e.g., `"2026-03-22T05:00:00Z"`). Strings must not contain em dashes.

```json
{
  "project": {
    "name": "Ridgeline Intelligence",
    "slug": "ridgeline",
    "description": "string -- 1-2 sentence description of what this project actually is and does",
    "status": "active | paused | completed | archived",
    "priority": "high | medium | low",
    "progress_pct": "number 0-100 -- overall project completion estimate",
    "current_phase": "string -- name of current phase, e.g. 'Phase 3: Demo Data'",
    "github_url": "string | null -- GitHub repo URL",
    "supabase_ref": "string | null -- Supabase project reference ID",
    "cloudflare_url": "string | null -- deployed URL"
  },

  "tasks": [
    {
      "title": "string -- task name",
      "description": "string | null -- brief description",
      "status": "todo | in_progress | done",
      "priority": "high | medium | low",
      "assignee": "string | null -- 'Claude Code', 'n8n', 'manual', or null",
      "column_order": "number -- 0 for first column, 1 for second",
      "created_at": "ISO date",
      "updated_at": "ISO date",
      "resolved_at": "ISO date | null"
    }
  ],

  "milestones": [
    {
      "title": "string -- milestone name",
      "target_date": "YYYY-MM-DD | null",
      "status": "upcoming | in_progress | done",
      "phase_number": "number -- sequential phase number"
    }
  ],

  "action_items": [
    {
      "description": "string -- what needs to happen",
      "urgency": "high | medium | low",
      "source": "string | null -- where this came from (e.g., 'Claude Code session', 'Planning', 'Email')",
      "status": "open | resolved | snoozed",
      "created_at": "ISO date",
      "resolved_at": "ISO date | null"
    }
  ],

  "notes": [
    {
      "content": "string -- decision, context, or observation worth tracking",
      "tag": "decision | context | blocker | idea",
      "created_at": "ISO date"
    }
  ],

  "next_session_prompt": "string -- what the next Claude Code session should work on, based on current state"
}
```

## Guidance

### Tasks
Include **real tasks** from the current state of the project. Look at:
- What phases/plans exist and their completion status
- Open PRs or in-progress work
- Known upcoming work items
- Completed recent work (mark as done with resolved_at dates)
- Aim for 8-15 tasks showing a mix of done, in_progress, and todo

### Milestones
Map to the project's actual phase structure or roadmap. Include:
- Completed phases with real completion dates (from git history)
- Current phase as in_progress
- Future phases as upcoming with estimated dates
- Aim for 4-8 milestones

### Action Items
These are blockers, decisions needed, or urgent items. Look for:
- Unresolved questions in planning docs
- Blockers mentioned in STATE.md or session notes
- Things that require human input (approvals, decisions, external dependencies)
- Aim for 2-5 items

### Notes
Key decisions and context a project manager AI would need. Look at:
- Architecture decisions in CLAUDE.md or planning docs
- Technology choices and why they were made
- Constraints or scope decisions
- Important context about the project's direction
- Aim for 3-6 notes

### Next Session Prompt
Write what the next coding session should focus on based on current state. Be specific: mention file paths, phase numbers, and concrete next steps.

## Important

- Do NOT make up data. If you do not know a value, use `null` or your best estimate based on the codebase
- Use real dates from git history for completed work
- Descriptions should sound like a project manager's notes, not marketing copy
- No em dashes in any string values
- Progress percentage should reflect actual completion based on phases/milestones done vs remaining
