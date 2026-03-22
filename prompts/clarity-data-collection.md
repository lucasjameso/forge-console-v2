# Forge Console Data Collection: CLARITY Book Launch

## What This Is

I have a project called **Forge Console** -- a personal command center that tracks all my active builds, content pipeline, and agent system. It has a Supabase database with 14 tables. I need you to fill in the CLARITY Book Launch data based on everything you know from this project's CLAUDE.md, PROGRESS.md, .planning/, codebase state, content files, and our session history.

**Note:** Build What Lasts (the parent brand) is tracked as a separate project in Forge Console. BWL covers social profiles, API access, email marketing, and automation. CLARITY covers the book itself: manuscript, cover, KDP, pricing, and book-specific content. If a task clearly belongs to BWL ops (platform setup, n8n workflows, Beehiiv), skip it here -- it will come from the BWL session.

**Output format:** Return a single JSON object matching the schema below. I will merge this into my seed.sql file. Be accurate -- use real data from the project, not made up values.

## What to Pull From

Look at these sources in this project:
- `CLAUDE.md` -- project description, book details, launch timeline
- `PROGRESS.md` or `.planning/ROADMAP.md` -- phase status, what is done vs in progress
- `.planning/STATE.md` -- current position, blockers, decisions
- `.planning/phases/` -- all phase directories, PLAN.md and SUMMARY.md files
- Content files -- carousels, captions, posting schedule, export paths
- Marketing docs -- launch plan, platform strategy, email sequences
- Cover files -- paths, status, ISBNs
- Any task boards, kanban state, or TODO tracking
- Recent git log (`git log --oneline -20`) -- what was built recently

## Key Facts (verify and update if different)

- **Launch date:** April 17, 2026
- **Pricing:** Kindle $9.99, Paperback $19.99, Hardcover $27.99
- **Brand:** Build What Lasts
- **Content cadence:** Tuesday, Wednesday, Friday on LinkedIn
- **LinkedIn:** @lucasoliver (lucas-james-oliver), ~6,100 followers, target 10,000 by Dec 31 2026

If any of these are wrong based on your knowledge of this project, correct them in your output.

## JSON Schema

Return exactly this structure. Every field is required unless marked `nullable`. Use real dates in ISO 8601 format. Strings must not contain em dashes.

```json
{
  "project": {
    "name": "CLARITY Book Launch",
    "slug": "clarity",
    "description": "string -- 1-2 sentence description of what this project is and its current focus",
    "status": "active | paused | completed | archived",
    "priority": "high | medium | low",
    "progress_pct": "number 0-100 -- overall project completion estimate",
    "current_phase": "string -- name of current phase or focus area",
    "github_url": "string | null",
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

  "content_reviews": [
    {
      "post_title": "string -- title of the LinkedIn post or carousel",
      "caption": "string | null -- the post caption/body text",
      "week_number": "number -- content calendar week number",
      "day_label": "string -- 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'",
      "scheduled_date": "YYYY-MM-DD | null",
      "slide_count": "number -- 0 for text posts, N for carousels",
      "revision": "number -- starts at 1, increments on revision",
      "status": "draft | pending | approved | rejected | posted",
      "platforms": ["linkedin"],
      "feedback": "string | null -- only for rejected items, explains why",
      "posted_at": "ISO date | null -- when it was actually posted"
    }
  ],

  "next_session_prompt": "string -- what the next Claude Code session should focus on"
}
```

## Guidance

### Tasks
Include **real tasks** reflecting the current state of the book launch. Consider:
- Manuscript status (editing, formatting, final)
- Cover design status (files, spine width, barcode, KDP upload)
- Pre-order setup (Amazon, other platforms)
- Marketing platform setup (Goodreads, Amazon Author Central, BookBub)
- Email list and pre-order sequences
- Content calendar production (upcoming carousels, captions)
- Podcast outreach status
- Launch week preparation
- Aim for 10-18 tasks showing the full launch pipeline

### Milestones
Map to the actual book launch timeline:
- Manuscript milestones (draft, edit, final)
- Cover design milestones
- Pre-order launch
- Marketing ramp
- Launch day (April 17, 2026)
- Post-launch (90-day review)
- Aim for 5-8 milestones

### Action Items
Urgent blockers and decisions. Consider:
- Anything blocking the pre-order going live
- Platform setup deadlines
- Content approvals needed
- External dependencies (ISBN, KDP, etc.)
- Aim for 3-6 items

### Notes
Key decisions about the launch strategy:
- Pricing decisions and rationale
- Platform strategy (which platforms, why)
- Content strategy (cadence, style, brand voice)
- Timeline decisions
- Marketing approach
- Aim for 4-8 notes

### Content Reviews
This is critical -- Forge Console displays a content calendar. Include:
- Any **already posted** content with real titles, dates, and `posted_at` timestamps
- **Current week** content in various stages (draft, pending, approved)
- **Upcoming weeks** content that is planned or in draft
- Use the real Tue/Wed/Fri posting schedule
- Include at least one rejected item with feedback explaining the rejection
- Aim for 10-20 content entries spanning 4-6 weeks
- If you have real carousel titles and captions from this project, use those exact titles

### Next Session Prompt
What should the next CLARITY session focus on? Be specific about files, tasks, and deadlines.

## Important

- Do NOT make up data. Use what you actually know from this project
- Use real dates from git history or planning docs for completed work
- Descriptions should sound like project manager notes, not marketing copy
- No em dashes in any string values
- Content post titles should align with the Build What Lasts brand: leadership systems, operational clarity, structure over slogans, proof over opinions
- If you have real content (carousel files, captions, schedules), use the actual titles and text
