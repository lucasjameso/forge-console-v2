# Forge Console Data Collection: Atlas Intelligence

## What This Is

I have a project called **Forge Console** -- a personal command center that tracks all my active builds, content pipeline, and agent system. It has a Supabase database with 14 tables. I need you to fill in the Atlas Intelligence data based on everything you know from this project.

Atlas Intelligence is tracked in Forge Console alongside Lucas's other builds. It is a corporate platform for business development at Facade Access Solutions (FAS), focused on industrial and infrastructure markets.

**Output format:** Return a single JSON object matching the schema below. I will merge this into my seed.sql file. Be accurate -- use real data from the project, not made up values.

## What to Pull From

Look at these sources in this project:
- `CLAUDE.md` -- project description, tech stack, purpose
- `README.md` -- project overview
- `PROGRESS.md` or `.planning/ROADMAP.md` -- phase status
- `.planning/` -- planning artifacts
- `package.json` -- tech stack
- Recent git log (`git log --oneline -20`)
- Any database schema files
- Deployment config

## Context

Atlas Intelligence is the **BD Pipeline Platform for FAS** targeting industrial and infrastructure markets. This is a corporate tool for managing business development pipeline, tracking opportunities, and planning market entry for Facade Access Solutions' expansion into industrial and infrastructure verticals.

The repo is at github.com/lucasjameso/atlas-intelligence. The local project directory may be mostly empty or early-stage. Report what actually exists -- if the project is just getting started, that is fine. Return minimal data with accurate status.

## JSON Schema

Return exactly this structure. Every field is required unless marked `nullable`. Use real dates in ISO 8601 format. Strings must not contain em dashes.

```json
{
  "project": {
    "name": "Atlas Intelligence",
    "slug": "atlas",
    "description": "string -- 1-2 sentence description of what this platform does",
    "status": "active | paused | completed | archived",
    "priority": "high | medium | low",
    "progress_pct": "number 0-100 -- overall completion estimate",
    "current_phase": "string | null -- name of current phase or 'Not started' if early",
    "github_url": "https://github.com/lucasjameso/atlas-intelligence",
    "supabase_ref": "string | null",
    "cloudflare_url": "string | null"
  },

  "tasks": [
    {
      "title": "string -- task name",
      "description": "string | null -- brief description",
      "status": "todo | in_progress | done",
      "priority": "high | medium | low",
      "assignee": "string | null",
      "column_order": "number",
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

### If the project is early-stage or mostly empty:
- Set progress_pct to 0-5
- Include 2-3 "todo" tasks for initial setup (repo init, schema design, etc.)
- Include 1-2 milestones (MVP, first deployment)
- Include 1 action item (define scope or start building)
- Include 1-2 notes about what the platform will do
- This is totally fine -- just report the real state

### If the project has actual work:
- Follow the same guidance as the Ridgeline prompt (tasks, milestones, action items, notes)
- Aim for 5-15 tasks, 3-6 milestones, 1-4 action items, 2-5 notes

### Next Session Prompt
What should the next session focus on? If early-stage, this might be "Initialize the project, define the schema, and build the first page."

## Important

- Do NOT make up data. Report what actually exists
- If the project is nearly empty, say so -- short accurate JSON is better than fabricated data
- No em dashes in any string values
- This is a corporate tool for FAS -- descriptions should reflect BD/pipeline management context
