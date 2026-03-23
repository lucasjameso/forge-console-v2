---
created: 2026-03-23T00:40:00.000Z
title: QC agent for automatic post-completion review
area: general
files:
  - .planning/todos/pending/2026-03-23-multi-agent-pm-system-with-specialist-roles.md
  - .planning/todos/pending/2026-03-23-honest-design-feedback-protocol-for-ui-reviews.md
---

## Problem

Work currently goes from "done" to "shipped" with no automated second pass. Lucas reviews manually, but manual review is inconsistent -- sometimes thorough, sometimes a quick glance when tired at 3 AM. A QC agent that automatically reviews completed work would catch issues that human fatigue misses: inconsistent styling, missing edge cases, specs that were partially implemented, accessibility gaps, and broken cross-page consistency.

This is the automated enforcement layer for the honest design feedback protocol (see related todo) and the million-dollar quality bar (see related todo). Without automated QC, those standards depend entirely on Lucas remembering to apply them.

## Solution

1. **Trigger:** When a task status changes to "Done" in Supabase, fire an n8n webhook that invokes the QC agent.
2. **QC agent scope per task type:**
   - **UI tasks:** Screenshot comparison against spec (if available). Check spacing, colors, typography against design system tokens. Verify hover states, animations, loading skeletons exist. Check responsive behavior at 3 breakpoints.
   - **Feature tasks:** Verify all success criteria from the phase spec are met. Check that edge cases listed in the spec are handled. Verify toast notifications fire on mutations.
   - **Fix tasks:** Verify the specific issue described in the feedback is resolved. Check that the fix didn't break adjacent functionality.
   - **Content tasks:** Check brand voice consistency, character limits, hashtag quality, platform-specific formatting.

3. **QC report:** Agent writes a structured review to a `task_reviews` table: task_id, verdict (pass/flag/block), findings (array of issues), reviewed_at. Verdicts:
   - **Pass:** All criteria met. Green badge on task card.
   - **Flag:** Minor issues found. Amber badge. Task stays "Done" but issues are logged for next pass.
   - **Block:** Critical issues found. Red badge. Task moves back to "In Progress" with QC findings as subtasks to fix.

4. **Forge Console UI:** Task cards show QC badge. Task modal shows "QC Review" section with findings. Activity log shows QC entries: "QC Agent reviewed 'Fix calendar navigation' -- Passed."

5. **Relationship to multi-agent system:** The QC agent is one of the specialist roles in the multi-agent PM system (see related todo). It uses the honest feedback protocol as its review standard. It can be configured per-project in the agent settings (STSUG-07): some projects may want strict QC (CLARITY launch), others may want lighter review (corporate platforms).

6. **Scope:** Post-v1. But the `task_reviews` table and QC badge UI should be designed during Phase 8 schema work so the agent can plug in later without schema changes.
