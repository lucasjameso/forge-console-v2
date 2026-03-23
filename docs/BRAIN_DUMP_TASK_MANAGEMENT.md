# BRAIN DUMP: Task Management & Project Management Evolution
# Captured: March 22, 2026
# Source: Lucas Oliver, verbal brain dump during Forge Console v2 build
# Status: Captured for future planning. NOT in current GSD scope.

---

## 1. SUBTASKS AND CHECKLISTS

Tasks need subtasks. A task like "Set up LinkedIn page" is not one action. It has 5-10 steps. The system needs:

- Ability to add subtasks (sub-items) to any task
- Each subtask is a checkbox that can be checked off individually
- Task completion percentage is calculated automatically from subtask completion (3 of 6 done = 50%)
- Project progress percentage rolls up from task percentages
- The UI needs to be dead simple: click a task, see its subtasks, check them off
- Subtasks should be addable inline (type and hit enter, like Notion or Todoist)

### Schema consideration:
- Either a `subtasks` table with FK to `tasks`, or a `parent_task_id` column on the tasks table itself (self-referential)
- Each subtask needs: id, parent_task_id, title, status (todo/done), order, created_at, completed_at

---

## 2. COMPLETION LOGGING AND AUDIT TRAIL

When anything gets completed (task, subtask, milestone, action item), it needs to be logged:

- WHO completed it (Lucas, Claude Code agent, n8n automation, specific project manager agent)
- WHEN it was completed (timestamp)
- WHAT was completed (task title, project, parent task if subtask)
- Unique IDs on everything for relational tracking

### Schema consideration:
- A `completion_log` table: id, entity_type (task/subtask/milestone/action_item), entity_id, completed_by, completed_at, project_id, metadata (jsonb for extra context)
- This becomes the backbone of the daily/weekly progress reports

---

## 3. DAILY AND WEEKLY PROGRESS LOGS

Need a view where Lucas can see:

- **Daily progress log:** Everything completed today, grouped by project. "Here's what got done today."
- **Weekly progress log:** Everything completed this week, with trends. "Here's how the week went."
- These should be generated views pulling from the completion_log table
- Should show: tasks completed, subtasks checked off, milestones hit, action items resolved
- Should calculate: tasks completed per day, velocity trends, which projects got attention and which didn't

### UI consideration:
- Could be a tab on the Dashboard, or its own page
- Daily view: timeline of completions with timestamps
- Weekly view: summary cards per project showing counts, percentage moved, velocity

---

## 4. PRIORITIZATION SYSTEM

Need a structured way to prioritize across all projects:

- Priority levels on tasks (high/medium/low already exists, but needs to be more actionable)
- A separate agent (future) that reviews all open tasks across all projects and suggests daily priorities
- AI-generated notes based on what the agent has seen: "You haven't touched Ridgeline in 3 days and it has 4 high-priority tasks. Suggest focusing here today."
- The prioritization agent should consider: due dates, project deadlines, task dependencies, how long since last activity

---

## 5. DUE DATES ON TASKS

Every task needs an optional due date:

- Simple date picker in the UI (pop up calendar, pick a date, done)
- Due date displayed on the task card
- Overdue tasks get visual treatment (red indicator, sorted to top)
- Due dates feed into the prioritization system
- Due dates feed into the orchestrator agent's daily briefing

### Schema consideration:
- Add `due_date` column (date, nullable) to the tasks table
- Add `due_date` to subtasks table as well

---

## 6. TIME ESTIMATES ON TASKS

Each task should have an estimated duration:

- Options: 30min, 1hr, 2hr, 4hr, 8hr, or custom
- Displayed on the task card
- Helps with daily planning: "I have 4 hours tonight. Show me what fits."
- Actual time tracking is a future feature, but estimates are the foundation
- Estimates feed into the prioritization agent: "This 2-hour task is due tomorrow and you haven't started it."

### Schema consideration:
- Add `estimated_hours` column (decimal, nullable) to the tasks table
- Future: `actual_hours` column for time tracking comparison

---

## 7. RELATIONAL DATABASE STRUCTURE

All of this needs to be properly relational:

- Tasks have subtasks (one-to-many)
- Tasks belong to projects (many-to-one)
- Completion logs reference tasks, subtasks, milestones, action items (polymorphic FK)
- Due dates on tasks and subtasks
- Time estimates on tasks
- Everything has unique UUIDs
- Everything has created_at, updated_at timestamps
- Audit trail on state changes (who changed status, when)

---

## 8. USER-FRIENDLY UI REQUIREMENTS

- Checking off a subtask should feel instant (optimistic UI update, then sync to Supabase)
- Adding a subtask should be inline (no modal, no new page, just type and enter)
- Date picker should be a clean pop-up calendar (shadcn DatePicker component)
- Time estimates should be a simple dropdown or button group
- Progress bars should update in real-time as subtasks are checked off
- The whole experience should feel like Notion or Linear, not like Jira

---

## 9. FUTURE AGENT INTEGRATION

When the agent architecture is built:
- The prioritization agent reads all tasks, due dates, estimates, and completion history
- It generates a daily suggested plan: "Here's what to focus on today based on deadlines and priorities"
- It generates weekly summaries: "This week you completed X tasks, moved Y% on Ridgeline, CLARITY is on track for April 17"
- It flags risks: "Atlas has 3 overdue tasks. Meridian hasn't been touched in 8 days."
- These feed into the orchestrator's daily briefing on the Dashboard

---

## PRIORITY FOR IMPLEMENTATION

1. Subtasks with checkboxes (schema + UI)
2. Due dates on tasks (schema + date picker)
3. Completion logging (schema)
4. Daily/weekly progress views (UI pulling from completion log)
5. Time estimates (schema + UI)
6. Prioritization agent (future, after agent architecture)

---

## ACTION FOR CLAUDE CODE

Save this as a planning reference for future Forge Console phases. When we resume building after the visual polish phase, this document defines the task management depth we need. Add it to the project knowledge base so GSD can reference it during future phase planning.

*Do NOT build any of this now. Capture only. Current priority is seed data, visual polish, and Cloudflare deployment.*
