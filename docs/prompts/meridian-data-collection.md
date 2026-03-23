# Forge Console Data Collection: Meridian Intelligence

## What This Is

I have a project called **Forge Console** -- a personal command center that tracks all my active builds, content pipeline, and agent system. It has a Supabase database with 14 tables. I need you to fill in the Meridian Intelligence data based on everything you know from this project.

Meridian Intelligence is tracked in Forge Console alongside Lucas's other builds. It is a corporate platform for his VP of Sales role at Facade Access Solutions (FAS).

**Output format:** Return a single JSON object matching the schema below. I will merge this into my seed.sql file. Be accurate -- use real data from the project, not made up values.

## What to Pull From

Look at these sources in this project:
- `CLAUDE.md` -- project description, tech stack, purpose
- `README.md` -- project overview
- `PROGRESS.md` or `.planning/ROADMAP.md` -- phase status, what is done vs in progress
- `.planning/STATE.md` -- current position, blockers, decisions
- `.planning/phases/` -- all phase directories
- `package.json` -- tech stack details
- Recent git log (`git log --oneline -20`) -- what was built recently
- Any database schema files
- Deployment config

## Context

Meridian Intelligence is the **FAS NAM Pipeline Intelligence Platform** -- sales analytics and pipeline reporting for Facade Access Solutions. This is Lucas's corporate VP of Sales tool. It should help him track pipeline, forecast, and make data-driven sales decisions for the North American market.

## JSON Schema

Return exactly this structure. Every field is required unless marked `nullable`. Use real dates in ISO 8601 format. Strings must not contain em dashes.

```json
{
  "project": {
    "name": "Meridian Intelligence",
    "slug": "meridian",
    "description": "string -- 1-2 sentence description of what this platform does",
    "status": "active | paused | completed | archived",
    "priority": "high | medium | low",
    "progress_pct": "number 0-100 -- overall completion estimate",
    "current_phase": "string -- name of current phase or focus area",
    "github_url": "https://github.com/lucasjameso/meridian-intelligence",
    "supabase_ref": "string | null",
    "cloudflare_url": "string | null"
  },

  "tasks": [
    {
      "title": "string -- task name",
      "description": "string | null -- brief description",
      "status": "todo | in_progress | done",
      "priority": "high | medium | low",
      "assignee": "string | null -- 'Claude Code', 'n8n', 'manual', or null",
      "column_order": "number -- 0 for primary, 1 for secondary",
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
      "phase_number": "number"
    }
  ],

  "action_items": [
    {
      "description": "string -- what needs to happen",
      "urgency": "high | medium | low",
      "source": "string | null",
      "status": "open | resolved | snoozed",
      "created_at": "ISO date",
      "resolved_at": "ISO date | null"
    }
  ],

  "notes": [
    {
      "content": "string -- decision, context, or observation",
      "tag": "decision | context | blocker | idea",
      "created_at": "ISO date"
    }
  ],

  "next_session_prompt": "string -- what the next session should focus on"
}
```

## Guidance

### Tasks
Include real tasks from the current state of the project:
- What has been built so far (schema, UI, data pipelines)
- What is in progress
- What is planned next
- Aim for 5-15 tasks

### Milestones
Map to the project's actual phases or roadmap. If no formal roadmap exists, create milestones based on logical build stages (schema, UI, data integration, reporting, deployment). Aim for 3-6 milestones.

### Action Items
Current blockers, decisions needed, or urgent items. Aim for 1-4 items.

### Notes
Architecture decisions, data source decisions, technology choices. Aim for 2-5 notes.

### Next Session Prompt
What should the next coding session focus on? Be specific about files, components, and next steps.

## Important

- Do NOT make up data. If you do not know a value, use `null` or your best estimate
- Use real dates from git history for completed work
- No em dashes in any string values
- This is a corporate tool for FAS -- descriptions should reflect B2B sales analytics context
