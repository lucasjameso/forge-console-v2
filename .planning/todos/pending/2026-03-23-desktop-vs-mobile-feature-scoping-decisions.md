---
created: 2026-03-23T00:44:00.000Z
title: Desktop vs mobile feature scoping decisions
area: general
files:
  - .planning/todos/pending/2026-03-23-premium-iphone-app-purpose-built-for-mobile-capture.md
  - .planning/todos/pending/2026-03-23-mobile-conversation-mode-with-agent-planning.md
  - .planning/ROADMAP.md
---

## Problem

Without a deliberate desktop/mobile split, the natural tendency is either (a) trying to make everything responsive (which dilutes the desktop's information density) or (b) building mobile as an afterthought (which makes it feel like a shrunken desktop). Neither produces a great experience on either platform.

Lucas uses desktop and mobile in fundamentally different contexts. Desktop: sitting at the Mac Mini, deep work sessions, 2-3 hour blocks. Mobile: walking, driving, between meetings, lying in bed, on a flight. The features needed in each context are different.

## Solution

**Desktop-only features (information-dense, requires focus):**
- Full Dashboard with all sections (stat tiles, action items, projects, content calendar)
- Project Detail with kanban board, notes, milestones, linked resources
- Content Pipeline with 4 view modes, drag-drop, bulk actions
- Social Media page with platform management and analytics
- Activity Log with full timeline, analytics, branch view
- Settings with all configuration sections
- Feedback Log with full editing

**Mobile features (capture, review, quick decisions):**
- Brain dump capture with project routing and voice dictation
- Action items list with swipe-to-resolve and swipe-to-snooze
- Quick activity logging (one-tap presets)
- Today's Focus view (what am I working on right now)
- Agent conversation mode (planning, brain dump, review)
- Push notifications for urgent action items and deadline alerts
- Offline queue with sync

**Shared but adapted:**
- Project status overview: desktop shows full cards, mobile shows compact list with health dots
- Content approval: desktop shows modal with full context, mobile shows card with approve/reject swipe
- Brain dump history: desktop shows full timeline with parsing, mobile shows titles with expand

**Design principle:** Mobile is not a subset of desktop. It is a different product that shares the same data. The mobile experience should be designed from scratch for mobile contexts, not by removing desktop features until it fits a small screen.

**Scope:** This scoping decision should be made before the iPhone app work begins. Document it as a design brief that guides both the Phase 9 /capture route and the future native app.
