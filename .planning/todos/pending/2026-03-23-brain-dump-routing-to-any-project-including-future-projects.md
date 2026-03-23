---
created: 2026-03-23T00:37:00.000Z
title: Brain dump routing to any project including future projects
area: ui
files:
  - .planning/feedback/PHASE-05-BRAIN-DUMP-SPEC.md
  - src/hooks/useBrainDump.ts
---

## Problem

The current brain dump project selector (BFIX-01, BSUG-01) assumes ideas map to existing projects: Ridgeline, CLARITY, Forge, Meridian, Atlas, or General. But Lucas regularly generates ideas that don't fit any current project -- new business concepts, product ideas, tool ideas, learning goals. These get dumped into "General" and lost in a generic inbox with no thematic grouping.

Over time, several "General" dumps about the same topic accumulate without anyone noticing they form a coherent idea cluster. The system should detect this and surface it.

## Solution

1. **"New Project" option in project selector:** Beyond the existing project pills and "General", add a "New..." pill. Clicking it prompts for a name or lets the AI suggest one based on the dump content.
2. **Temporary project creation:** "New..." creates a lightweight project entry in Supabase with status "idea" (not "active"). It appears in a separate "Ideas" section, not alongside active builds. Minimal fields: name, description (auto-generated from first brain dump), created_at.
3. **AI-suggested project names:** When a brain dump doesn't match any existing project with >70% confidence, the parser suggests: "This doesn't match any current project. Suggested new project: 'Personal Finance Automation' based on mentions of budget tracking and expense API." Lucas confirms or renames.
4. **Idea cluster detection:** Periodically (or on-demand), analyze all "General" brain dumps for thematic clusters. If 3+ dumps share common keywords/topics, surface a notification: "You have 5 brain dumps about 'podcast production workflow'. Create a project?"
5. **Promotion threshold:** When an idea project accumulates 5+ brain dumps or 3+ tasks, show a banner: "This idea has enough substance to become a build. Promote to active project?" Promoting sets status to "active" and adds it to the Dashboard.
6. **Phase 5 scope:** The project selector (BFIX-01) and smart detection (BSUG-05) are Phase 5 work. The temporary project and cluster detection extend beyond Phase 5 but the data model should support them from the start.
