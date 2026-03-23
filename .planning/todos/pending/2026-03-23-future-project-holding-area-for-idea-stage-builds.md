---
created: 2026-03-23T00:38:00.000Z
title: Future project holding area for idea stage builds
area: ui
files:
  - src/pages/Projects.tsx
  - src/pages/Dashboard.tsx
  - .planning/todos/pending/2026-03-23-brain-dump-routing-to-any-project-including-future-projects.md
---

## Problem

Active projects (Ridgeline, CLARITY, Forge, Meridian, Atlas) and half-formed ideas live in the same space. There is no dedicated holding area for concepts that are not yet projects but are more than a single brain dump. Examples: "Personal Finance Automation", "Podcast Production System", "Agent Training Framework" -- each might have 3-8 brain dumps and some rough notes but no milestones, no tasks, no timeline.

These idea-stage concepts need a home that is visible but not competing with active builds for attention on the Dashboard. The brain dump routing todo handles creating temporary projects from dumps. This todo is about the UI and organizational system for those idea-stage projects.

## Solution

1. **Projects page: "Ideas" section below active projects.** Separate section with its own header: "Ideas" or "Incubating". Cards are compact (smaller than active project cards) showing: name, brain dump count, creation date, one-line description. No progress bars, no milestones, no task counts -- these are pre-project.
2. **Dashboard: exclude from project cards.** Idea-stage projects do not appear in the Dashboard's Core Builds or Corporate sections. They live only on the Projects page. This keeps the Dashboard focused on active work.
3. **Idea project card actions:** "Promote to active" button (sets status to active, appears on Dashboard, prompts for milestones and initial tasks). "Archive" button (hides without deleting). "View brain dumps" link (filters Brain Dump page to this project).
4. **Data model:** Use the existing `projects` table with a new `status` enum value: "idea" alongside "active", "paused", "completed". The Projects page queries filter by status. Dashboard queries filter to "active" only.
5. **Promotion flow:** When promoting, show a mini-wizard: confirm name, add description, set priority, optionally create first milestone. The project then appears on the Dashboard with a "New" badge for 48 hours.
6. **Cross-reference:** Related to brain dump routing todo (which handles creating idea projects from dumps). This todo is the UI destination for those created projects.
