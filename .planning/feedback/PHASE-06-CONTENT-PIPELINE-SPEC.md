# Phase 6: Content Pipeline Depth -- All Suggestions

**Source:** Page feedback system (Supabase `page_feedback` table)
**Captured:** 2026-03-22
**Total Items:** 12 suggestions + 12 fixes (fixes in Phase 4)
**Phase Goal:** Transform Content Pipeline from a view-only calendar into a full content management and publishing workflow

---

## Suggestions (12 items)

### CSUG-01: Full calendar navigation with month/year browsing
Header: left arrow, "March 2026" label, right arrow, "Today" button. Month view shows full calendar month with grayed adjacent-month days. Week view arrows move by week. List view month selector with infinite scroll. Kanban view time period filter. Support 3-6 month forward planning. Slide animation (200ms spring).

### CSUG-02: Drag and drop content rescheduling in month view
Drag content card between day cells. On drop: spring animation, scheduled_date updates in Supabase, toast confirms. If target day has 2+ items, show warning. Also support in week view (between day groups) and kanban view (between dates within columns). Use @dnd-kit/core.

### CSUG-03: Carousel slide preview with image thumbnails
Detail modal shows horizontal scroll of 120px-height thumbnails. Click for larger preview overlay. No images: numbered placeholder boxes with "Upload"/"Export pending". "Export from Excalidraw" button for future pipeline.

### CSUG-04: Inline caption editing with AI assistance
Editable textarea in detail modal. Character count (LinkedIn 3,000 max): amber at 2,500, red at 2,900. "Refine with AI" button: sends to Claude Sonnet, side-by-side before/after, accept/reject/edit. Hashtag suggestions (5-8). Auto-save on blur.

### CSUG-05: Bulk actions across multiple content items
Checkbox on each card (hover in list/week, always in kanban). Floating action bar when selected: count, "Approve all", "Move to Draft", "Reschedule" (date picker), "Delete" (confirm), "Deselect all".

### CSUG-06: Content performance tracking (post-publish)
New fields on content_reviews: impressions, likes, comments, shares, click_through_rate, engagement_rate. Performance card in detail modal for "Posted" items. Manual entry for now. "Top performer" badge in month view.

### CSUG-07: Content templates and recurring series
Templates tab: title prefix, default caption, platform, slide count, recurring day. "Create from template". Series tags ("CLARITY Framework Deep Dives"). Series filter in views. Future series analytics.

### CSUG-08: Multi-platform content management
Multiple platform assignments per item. Platform-specific tabs in detail modal (LinkedIn caption, Medium article, TikTok script). Platform icons on cards. Per-platform status tracking. Kanban filter by platform.

### CSUG-09: Content approval workflow with Slack integration
Auto-notify #content-ready on "Pending Review". Direct link to pipeline. Approve/reject updates Slack (reactions + replies). Two-way: approve from Slack via n8n webhook updates Supabase. Realtime sync.

### CSUG-10: Publishing scheduler with optimal time suggestions
Schedule section in detail modal: date + time picker. Default posting time pre-populated. "Optimal time" suggestion from historical data. Clock icon + time on cards. n8n trigger on schedule or Slack reminder.

### CSUG-11: Revision history and version comparison
"Revision History" in detail modal. Each version: number, date, summary. "Compare" button for side-by-side diff (green additions, red deletions). "Revert to v1" button.

### CSUG-12: Content calendar analytics dashboard strip
Compact strip below header: "This month: 21 planned, 6 posted, 5 pending, 10 draft". Posting cadence indicator (green/amber/red vs target). Gap alerts. Collapsible weekly breakdown chart.

---

## Data Requirements

### New Tables
- `content_templates` (id, title_prefix, default_caption, platform, slide_count, recurring_day, created_at)
- `content_versions` (id, content_id, revision, caption, changed_by, created_at)
- `content_performance` (id, content_id, impressions, likes, comments, shares, ctr, engagement_rate, recorded_at)

### Modified Tables
- `content_reviews`: add `platforms` (array), `scheduled_time`, `template_id`

## Traceability
All items map to Phase 6 in REQUIREMENTS.md as CONT-01 through CONT-12 (suggestions) plus CFIX-01 through CFIX-12 (fixes in Phase 4).
