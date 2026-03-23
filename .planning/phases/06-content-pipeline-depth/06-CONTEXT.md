# Phase 6: Content Pipeline Depth - Context

**Gathered:** 2026-03-23
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the content pipeline into a full content management and publishing workflow with calendar navigation, drag-drop rescheduling, AI editing, templates, and analytics. The 4 views (List, Week, Month, Kanban), ContentReviewModal, Add Content dialog, and click-to-move Kanban already exist from Phases 4 and 4.1. This phase adds depth: real drag-drop, caption editing with AI refinement, weekly template generation, Slack notifications via n8n webhooks, bulk actions, and an analytics strip.

</domain>

<decisions>
## Implementation Decisions

### Drag-and-Drop Behavior
- **D-01:** Kanban view: drag cards between status columns (Draft > Pending Review > Approved > Posted). On drop: update status in Supabase, show toast, spring animation.
- **D-02:** Keep existing click-to-move dropdown alongside drag as a fallback. Some users prefer clicking, and mobile drag is unreliable.
- **D-03:** Month view: drag cards between date cells to reschedule. On drop: update scheduled_date in Supabase, show toast.
- **D-04:** Week view: NO drag. Read-only view.
- **D-05:** List view: NO drag.
- **D-06:** Use @dnd-kit/core and @dnd-kit/sortable (already installed, v6.3.1 and v10.0.0).

### AI Caption Editing
- **D-07:** Incremental suggestions, NOT full rewrites. User writes the post (or agent writes it), then refines in the modal.
- **D-08:** "Refine" button in detail modal sends caption to Claude Sonnet. Returns 2-3 inline suggested edits (e.g., "tighten the opening," "remove redundant paragraph," "strengthen the CTA"). User picks which to accept individually.
- **D-09:** AI must follow Lucas's writing style: Build What Lasts voice -- direct, specific, proof over opinions, no fluff, no corporate speak. NEVER use em dashes.
- **D-10:** AI flags if post is outside optimal character range (1200-1600 for LinkedIn).
- **D-11:** Use Claude Sonnet for refinement. Not Opus, not Haiku.
- **D-12:** Hashtag suggestions (5-8) as a separate action, not bundled with refinement.

### Slack Integration (Light Touch)
- **D-13:** One-way notifications only. No approving from Slack. Two-way is a future phase.
- **D-14:** On approve: fire webhook to n8n. n8n posts to #content-ready with: post title, scheduled date, platform, and link back to pipeline.
- **D-15:** On reject: fire webhook to n8n. n8n posts to #forge-alerts with: post title, rejection reason, and link back to pipeline.
- **D-16:** Forge Console fires a webhook to n8n on status change. n8n handles Slack formatting and channel routing. Console does NOT call Slack API directly.
- **D-17:** Store n8n webhook URL in environment variable (VITE_N8N_WEBHOOK_URL or similar).

### Templates and Weekly Content Generation
- **D-18:** Weekly arc structure saved as templates:
  - Monday: Bridge/precursor post (text post, LinkedIn)
  - Tuesday: Carousel -- framework teaching (carousel, 4-5 slides, LinkedIn)
  - Wednesday: Deep dive text post on one concept (text post, LinkedIn)
  - Thursday: Carousel -- proof/data/process (carousel, 4-5 slides, LinkedIn)
  - Friday: Personal story or builder's journey (text post, LinkedIn)
  - Saturday: Reflection, teaser, or engagement (poll or text, LinkedIn)
  - Sunday: Rest, no post
- **D-19:** Each template stores: default title pattern, content_type, default platform, default character range target, suggested slide_count (if carousel).
- **D-20:** "Generate from templates" button: select a week number, one click pre-populates 6 content items (Mon-Sat) with correct types, placeholder titles, and default metadata. User fills in actual content afterward.
- **D-21:** Templates are editable -- user can modify the weekly arc over time.
- **D-22:** Templates tab in the Content Pipeline page for managing the template set.

### Bulk Actions
- **D-23:** Checkbox on each card (hover-reveal in list/week, always visible in kanban).
- **D-24:** Floating action bar when items selected: count, "Approve all", "Move to Draft", "Reschedule" (date picker), "Delete" (confirm dialog), "Deselect all".

### Analytics Strip
- **D-25:** Compact strip below page header: "This month: X planned, Y posted, Z pending, W draft".
- **D-26:** Posting cadence indicator: green (on track vs. 6/week target), amber (falling behind), red (significant gaps).
- **D-27:** Gap alerts when 2+ consecutive days have no scheduled content.

### Caption Editing in Detail Modal
- **D-28:** Editable textarea in ContentReviewModal (currently read-only). Toggle between view/edit mode.
- **D-29:** Character count with ranges: green 1200-1600, amber outside that, red >3000. Already partially implemented -- extend to edit mode.
- **D-30:** Auto-save caption on blur. Mutation updates caption in Supabase.

### Content Performance Tracking
- **D-31:** New fields for posted content: impressions, likes, comments, shares, engagement_rate. Manual entry for now (no API).
- **D-32:** Performance card visible in detail modal only for items with status "posted".
- **D-33:** "Top performer" badge on month view for highest-engagement posted item.

### Revision History
- **D-34:** New content_versions table tracking caption changes. Each save creates a new revision.
- **D-35:** "Revision History" section in detail modal: version number, date, summary of change.
- **D-36:** "Compare" button for side-by-side diff (green additions, red deletions). "Revert" button to restore previous version.

### Claude's Discretion
- Drag-and-drop collision detection and visual feedback during drag
- Analytics strip collapse/expand behavior
- Template form layout and editing UX
- Revision diff rendering approach
- Bulk action floating bar positioning and animation
- How "Refine with AI" displays inline suggestions (card list, inline annotations, etc.)
- Schema design for content_templates, content_versions, content_performance tables
- Carousel slide preview thumbnail approach (CSUG-03)

</decisions>

<specifics>
## Specific Ideas

- AI refinement voice: "Build What Lasts" -- direct, specific, proof over opinions, no fluff, no corporate speak. Never em dashes.
- Weekly arc is the core content planning unit. Monday-Saturday rhythm with Sunday rest.
- Tuesday and Thursday are carousel days (4-5 slides). Monday, Wednesday, Friday are text posts. Saturday is flexible (poll or text).
- Slack channels: #content-ready for approvals, #forge-alerts for rejections.
- n8n is the integration layer -- Console fires webhooks, n8n routes to Slack. Console never calls Slack directly.
- Character sweet spot for LinkedIn: 1200-1600 characters.
- "Generate from templates" is the killer feature -- one click to scaffold a week of content.

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Content Pipeline Spec (all 12 suggestions)
- `.planning/feedback/PHASE-06-CONTENT-PIPELINE-SPEC.md` -- All 12 CSUG items with detailed specs, data requirements, and new table definitions

### Requirements
- `.planning/REQUIREMENTS.md` -- CSUG-01 through CSUG-12

### Prior Phase Decisions (Content Pipeline)
- `.planning/phases/04-visual-polish/04-CONTEXT.md` -- D-06 (shadcn Dialog for modals), D-14 (content status badges), inline style cleanup rules
- `.planning/phases/04.1-phase-4-uat-remediation-51-gaps-2-blockers-30-major-19-minor-across-all-7-pages/04.1-CONTEXT.md` -- Content review modal spec, Add Content modal redesign, Kanban click-to-move decision, multi-platform data model

### Existing Implementation
- `src/pages/ContentPipeline.tsx` -- Main page with 4 views (~806 lines)
- `src/components/pipeline/ContentReviewModal.tsx` -- Detail modal with approve/reject (~390 lines)
- `src/components/pipeline/ContentCard.tsx` -- Reusable card component
- `src/hooks/useContentReviews.ts` -- Queries (useContentReviews) and mutations (useUpdateContentStatus, useCreateContent)
- `src/types/database.ts` -- ContentReview interface, ContentStatus and ContentType unions

### Design System
- `src/index.css` -- CSS variables, design tokens
- `tailwind.config.ts` -- Theme configuration

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `ContentReviewModal`: Already has character counter, copy buttons, carousel viewer, approve/reject flow. Extend with edit mode, AI refinement, performance card, revision history.
- `useUpdateContentStatus`: Mutation for status changes. Extend to fire n8n webhook on approve/reject.
- `useCreateContent`: Mutation for new content. Reuse for template-generated batch creation.
- `@dnd-kit/core` + `@dnd-kit/sortable`: Installed (v6.3.1, v10.0.0), not yet wired. Ready for Kanban and Month view drag.
- `ContentCard`: Used in dashboard widgets and pipeline views. Extend for drag handle, checkbox, performance badge.
- Kanban dropdown menu: Keep as fallback alongside new drag-drop.

### Established Patterns
- shadcn Dialog for modals (Phase 04 decision)
- React Query for all data with `invalidateQueries` on mutations
- `isSupabaseConfigured` guard with mock data fallback
- Framer Motion for animations (spring for drag, stagger for lists)
- Static class mapping for dynamic Tailwind variants (Phase 04 decision)
- Toast notifications on all mutations via sonner

### Integration Points
- `src/types/database.ts`: Add ContentTemplate, ContentVersion, ContentPerformance interfaces
- `src/hooks/useContentReviews.ts`: Add mutations for caption update, batch create from templates, performance entry
- New hook: `useContentTemplates.ts` for template CRUD
- New Supabase tables: content_templates, content_versions, content_performance
- Environment: VITE_N8N_WEBHOOK_URL for Slack notification webhooks
- ContentReviewModal: Major extension point (edit mode, AI, performance, revisions)

</code_context>

<deferred>
## Deferred Ideas

- Two-way Slack integration (approve from Slack) -- future phase, per D-13
- AI-powered variant generation for cross-platform (LinkedIn > FB/X/IG) -- data model supports it, AI pipeline is future
- Content performance API integration (LinkedIn Analytics API) -- manual entry for now per D-31
- Optimal posting time suggestions from historical data (CSUG-10) -- no historical data yet, scaffold the UI but suggestions come later
- Offline content creation with service worker sync -- out of scope
- Carousel image upload/preview with real thumbnails -- placeholder boxes for now per CSUG-03 spec

</deferred>

---

*Phase: 06-content-pipeline-depth*
*Context gathered: 2026-03-23*
