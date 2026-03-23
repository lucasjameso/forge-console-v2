# Forge Console Data Collection: Build What Lasts

## What This Is

I have a project called **Forge Console** -- a personal command center that tracks all my active builds, content pipeline, and agent system. It has a Supabase database with 14 tables. I need you to fill in the Build What Lasts data based on everything you know from this project.

Build What Lasts is tracked as its own project in Forge Console, separate from CLARITY (the book). BWL covers the brand infrastructure: social media profiles, developer API access, email marketing (Beehiiv), n8n automation workflows, and the content calendar. CLARITY covers the book manuscript, cover design, pricing, KDP upload, and launch day logistics.

**Output format:** Return a single JSON object matching the schema below. I will merge this into my seed.sql file. Be accurate -- use real data from the project, not made up values.

## What to Pull From

Look at these sources in this project:
- `README.md` -- master brief, project structure, launch countdown
- `PROGRESS.md` -- running tracker with done/in-progress/to-do/deferred sections
- `credentials/STATUS.md` -- which env vars are filled vs blank
- `social-setup/` -- per-platform profile checklists, API setup guides
- `content/calendar.md` -- April 1-30 content calendar
- `email-marketing/` -- Beehiiv setup, 5-email pre-launch sequence
- `automation/` -- n8n workflow plans and cross-posting setup
- `~/.master.env` -- credential status (which keys exist)

## Key Facts (verify and update if different)

- **Book:** Clarity Kills the Hero, launches April 17, 2026
- **Brand:** Build What Lasts
- **Social handles:** @buildwhatlasts everywhere, @lucasjamesoliver fallback
- **Email:** Beehiiv, publication ID pub_78465b13-adda-4f6b-a51c-d39c2717ab3f
- **n8n:** Self-hosted at https://n8n.iac-solutions.io
- **Primary email:** lucasjamesoliver1@gmail.com (lucas@buildwhatlasts.app for Reddit/Beehiiv)

If any of these are wrong, correct them in your output.

## JSON Schema

Return exactly this structure. Every field is required unless marked `nullable`. Use real dates in ISO 8601 format. Strings must not contain em dashes.

```json
{
  "project": {
    "name": "Build What Lasts",
    "slug": "bwl",
    "description": "string -- 1-2 sentence description of this ops project",
    "status": "active | paused | completed | archived",
    "priority": "high | medium | low",
    "progress_pct": "number 0-100 -- overall completion based on PROGRESS.md percentages",
    "current_phase": "string -- current focus area, e.g. 'Profile Completion & Email Setup'",
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

  "social_platforms": [
    {
      "platform_name": "string -- e.g. 'LinkedIn Company Page', 'Facebook', 'YouTube', etc.",
      "handle": "string | null -- @handle or username",
      "profile_url": "string | null -- full profile URL",
      "icon_name": "string -- lucide-react icon name: 'Linkedin', 'Facebook', 'Youtube', 'BookOpen', 'FileText', 'Video', 'MessageCircle', 'Camera', 'Hash'",
      "follower_count": "number | null",
      "last_post_date": "YYYY-MM-DD | null",
      "status": "active | setup_needed | inactive",
      "metadata": "object | null -- any extra data like page IDs, channel IDs, reasons for status"
    }
  ],

  "content_reviews": [
    {
      "post_title": "string -- title of the post",
      "caption": "string | null -- post body text",
      "week_number": "number -- content calendar week number",
      "day_label": "string -- day of week",
      "scheduled_date": "YYYY-MM-DD | null",
      "slide_count": "number -- 0 for text posts",
      "revision": "number -- starts at 1",
      "status": "draft | pending | approved | rejected | posted",
      "platforms": ["string -- platform names"],
      "feedback": "string | null -- only for rejected items",
      "posted_at": "ISO date | null"
    }
  ],

  "next_session_prompt": "string -- what the next session should focus on"
}
```

## Guidance

### Tasks
Pull directly from PROGRESS.md. Every checkbox item should become a task:
- [x] items = status: "done" with resolved_at dates from session log
- In-progress items = status: "in_progress"
- To-do items = status: "todo"
- Group by area: credentials, social profiles, API access, email marketing, content, automation
- Aim for 15-30 tasks (this project has many small operational tasks)

### Milestones
Use the launch countdown table from README.md:
- Project setup complete (Mar 22)
- All profiles completed (Mar 28)
- All API keys live (Mar 31)
- n8n automation running (Apr 5)
- Email sequence live (Apr 7)
- Content calendar locked (Apr 10)
- Launch Day (Apr 17)

### Social Platforms
This is critical -- BWL tracks all platform presence. Include every platform mentioned in PROGRESS.md and social-setup/:
- LinkedIn company page (Build What Lasts)
- Facebook page
- YouTube channel
- Reddit account
- X/Twitter (if set up)
- Instagram (if set up)
- TikTok (if set up)
- Threads (if set up)
- Substack (if planned)
- Pinterest (if planned)

For each, report actual status: is the profile created? Is it complete with bio/banner/content? Is the developer API set up?

### Content Reviews
If content/calendar.md has the April content calendar, extract every planned post as a content_review entry. Include platform assignments, scheduled dates, and current status.

### Notes
Key decisions about brand strategy, platform priorities, automation approach.

## Important

- Do NOT make up data. Use what exists in the project files
- Use real dates from PROGRESS.md session log for completed work
- No em dashes in any string values
- This project overlaps with CLARITY but is distinct: BWL = brand ops infrastructure, CLARITY = the book itself
