# Phase 6: Content Pipeline Depth - Research

**Researched:** 2026-03-23
**Domain:** Content management UI (drag-drop, AI refinement, templates, analytics, revision history)
**Confidence:** HIGH

## Summary

Phase 6 transforms the existing Content Pipeline page from a view-and-review tool into a full content management workflow. The existing codebase already has 4 views (List, Week, Month, Kanban), a ContentReviewModal with approve/reject, an AddContentDialog, and click-to-move via dropdown menus. @dnd-kit/core v6.3.1 and @dnd-kit/sortable v10.0.0 are already installed but unwired.

The phase adds six major feature areas: (1) drag-and-drop in Kanban (between status columns) and Month view (between date cells), (2) caption editing with AI refinement via Claude Sonnet, (3) weekly content templates with one-click generation, (4) bulk actions with floating action bar, (5) analytics strip with cadence tracking, and (6) revision history with diff comparison. Additionally: n8n webhook integration for Slack notifications, content performance tracking (manual entry), and carousel slide preview placeholders.

**Primary recommendation:** Build incrementally -- wire dnd-kit into Kanban first (simpler: 4 fixed columns), then Month view (dynamic date containers). AI refinement reuses the existing Claude API pattern from useBrainDump.ts. Use the `diff` npm package for revision comparison rather than a heavy diff viewer component. New Supabase tables (content_templates, content_versions, content_performance) should be created before any UI work.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Kanban view: drag cards between status columns (Draft > Pending Review > Approved > Posted). On drop: update status in Supabase, show toast, spring animation.
- **D-02:** Keep existing click-to-move dropdown alongside drag as a fallback. Some users prefer clicking, and mobile drag is unreliable.
- **D-03:** Month view: drag cards between date cells to reschedule. On drop: update scheduled_date in Supabase, show toast.
- **D-04:** Week view: NO drag. Read-only view.
- **D-05:** List view: NO drag.
- **D-06:** Use @dnd-kit/core and @dnd-kit/sortable (already installed, v6.3.1 and v10.0.0).
- **D-07:** Incremental suggestions, NOT full rewrites. User writes the post (or agent writes it), then refines in the modal.
- **D-08:** "Refine" button in detail modal sends caption to Claude Sonnet. Returns 2-3 inline suggested edits (e.g., "tighten the opening," "remove redundant paragraph," "strengthen the CTA"). User picks which to accept individually.
- **D-09:** AI must follow Lucas's writing style: Build What Lasts voice -- direct, specific, proof over opinions, no fluff, no corporate speak. NEVER use em dashes.
- **D-10:** AI flags if post is outside optimal character range (1200-1600 for LinkedIn).
- **D-11:** Use Claude Sonnet for refinement. Not Opus, not Haiku.
- **D-12:** Hashtag suggestions (5-8) as a separate action, not bundled with refinement.
- **D-13:** One-way notifications only. No approving from Slack. Two-way is a future phase.
- **D-14:** On approve: fire webhook to n8n. n8n posts to #content-ready with: post title, scheduled date, platform, and link back to pipeline.
- **D-15:** On reject: fire webhook to n8n. n8n posts to #forge-alerts with: post title, rejection reason, and link back to pipeline.
- **D-16:** Forge Console fires a webhook to n8n on status change. n8n handles Slack formatting and channel routing. Console does NOT call Slack API directly.
- **D-17:** Store n8n webhook URL in environment variable (VITE_N8N_WEBHOOK_URL or similar).
- **D-18 through D-22:** Weekly arc template structure (Mon-Sat), template storage, "Generate from templates" button, editable templates, Templates tab.
- **D-23:** Checkbox on each card (hover-reveal in list/week, always visible in kanban).
- **D-24:** Floating action bar when items selected: count, "Approve all", "Move to Draft", "Reschedule" (date picker), "Delete" (confirm dialog), "Deselect all".
- **D-25 through D-27:** Analytics strip with monthly summary, cadence indicator (green/amber/red), gap alerts.
- **D-28 through D-30:** Editable textarea in ContentReviewModal, character count with ranges, auto-save on blur.
- **D-31 through D-33:** Content performance fields (manual entry), performance card in modal for posted items, "Top performer" badge.
- **D-34 through D-36:** content_versions table, revision history section, compare with diff, revert button.

### Claude's Discretion
- Drag-and-drop collision detection and visual feedback during drag
- Analytics strip collapse/expand behavior
- Template form layout and editing UX
- Revision diff rendering approach
- Bulk action floating bar positioning and animation
- How "Refine with AI" displays inline suggestions (card list, inline annotations, etc.)
- Schema design for content_templates, content_versions, content_performance tables
- Carousel slide preview thumbnail approach (CSUG-03)

### Deferred Ideas (OUT OF SCOPE)
- Two-way Slack integration (approve from Slack) -- future phase, per D-13
- AI-powered variant generation for cross-platform (LinkedIn > FB/X/IG) -- data model supports it, AI pipeline is future
- Content performance API integration (LinkedIn Analytics API) -- manual entry for now per D-31
- Optimal posting time suggestions from historical data (CSUG-10) -- no historical data yet, scaffold the UI but suggestions come later
- Offline content creation with service worker sync -- out of scope
- Carousel image upload/preview with real thumbnails -- placeholder boxes for now per CSUG-03 spec
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CSUG-01 | Full calendar navigation with month/year browsing and slide animations | Already partially implemented in MonthView. Extend to all views. |
| CSUG-02 | Drag-and-drop content rescheduling in month and week views | @dnd-kit installed, patterns documented. Per D-04, week view is NO drag -- only Month and Kanban. |
| CSUG-03 | Carousel slide preview with image thumbnails in detail modal | Placeholder boxes approach (deferred real thumbnails). Existing carousel slide viewer in ContentReviewModal can be extended. |
| CSUG-04 | Inline caption editing with character count and AI refinement | Existing Claude API pattern in useBrainDump.ts. CharCountIndicator already exists. |
| CSUG-05 | Bulk actions via floating action bar (approve all, reschedule, delete) | Selection state management + fixed-position floating bar. |
| CSUG-06 | Content performance tracking post-publish (impressions, engagement) | New content_performance table + manual entry form in modal. |
| CSUG-07 | Content templates and recurring series with tags | New content_templates table + Templates tab + batch creation mutation. |
| CSUG-08 | Multi-platform content management with per-platform tabs | Existing platforms array on ContentReview already supports this. Extend modal with platform tabs. |
| CSUG-09 | Content approval workflow with Slack integration | One-way n8n webhook only (D-13 through D-17). Fire-and-forget POST to VITE_N8N_WEBHOOK_URL. |
| CSUG-10 | Publishing scheduler with optimal time suggestions | Scaffold time picker UI. Optimal time suggestions deferred (no historical data). |
| CSUG-11 | Revision history with side-by-side diff and revert | New content_versions table + `diff` npm package for text comparison. |
| CSUG-12 | Content calendar analytics strip (monthly summary, cadence, gap alerts) | Computed from existing content_reviews data. No new tables needed. |
</phase_requirements>

## Standard Stack

### Core (Already Installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @dnd-kit/core | 6.3.1 | Drag-and-drop framework | Already installed. Lightweight, accessible, React-native. |
| @dnd-kit/sortable | 10.0.0 | Sortable presets for dnd-kit | Already installed. Provides useSortable, SortableContext for list reordering. |
| @dnd-kit/utilities | 3.2.2 | CSS utility transforms | Already installed (transitive dep). Provides CSS.Transform.toString(). |
| framer-motion | 12.38.0 | Animations | Already installed. Spring animations on drag, stagger on lists. |
| date-fns | 4.1.0 | Date manipulation | Already installed. Calendar grid computation, date formatting. |
| sonner | 2.0.7 | Toast notifications | Already installed. All mutations show toast feedback. |
| @supabase/supabase-js | 2.99.3 | Database client | Already installed. All data persistence. |

### New (To Install)
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| diff | 8.0.4 | Text diff computation | Revision history comparison (D-36). Lightweight (no UI). Compute diff, render with custom React components. |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| diff (npm) | react-diff-viewer-continued (4.2.0) | Full component library with syntax highlighting. Overkill for plain text caption diffs. diff (8.0.4) is 15KB vs 150KB+, and we control the rendering. |
| Custom drag | react-beautiful-dnd | Deprecated/unmaintained. @dnd-kit is the modern standard. Already installed. |
| Custom AI UI | Vercel AI SDK | Would add streaming UI components. Overkill for 2-3 suggestion cards from a single API call. Direct fetch is simpler, matches existing pattern. |

**Installation:**
```bash
npm install diff
npm install -D @types/diff
```

## Architecture Patterns

### Recommended Project Structure
```
src/
  components/
    pipeline/
      ContentReviewModal.tsx    # Extend: edit mode, AI refinement, performance, revisions
      ContentCard.tsx            # Extend: drag handle, checkbox, performance badge
      DraggableContentCard.tsx   # NEW: wraps ContentCard with useDraggable
      DroppableColumn.tsx        # NEW: Kanban droppable status column
      DroppableDateCell.tsx      # NEW: Month view droppable date cell
      DragOverlayCard.tsx        # NEW: Ghost card shown during drag
      BulkActionBar.tsx          # NEW: Floating bar for bulk operations
      AnalyticsStrip.tsx         # NEW: Monthly stats strip below header
      TemplatesTab.tsx           # NEW: Template management tab
      RevisionHistory.tsx        # NEW: Version list + diff viewer
      PerformanceCard.tsx        # NEW: Manual metrics entry for posted items
      AiRefinementPanel.tsx      # NEW: Suggestion cards from Claude
  hooks/
    useContentReviews.ts         # Extend: updateCaption, updateScheduledDate, batchCreate
    useContentTemplates.ts       # NEW: CRUD for content_templates
    useContentVersions.ts        # NEW: list versions, revert
    useContentPerformance.ts     # NEW: CRUD for content_performance
    useAiRefinement.ts           # NEW: Claude Sonnet API call for caption refinement
    useN8nWebhook.ts             # NEW: Fire webhook on status changes
    useBulkSelection.ts          # NEW: Selection state management (Set of IDs)
  types/
    database.ts                  # Extend: ContentTemplate, ContentVersion, ContentPerformance interfaces
```

### Pattern 1: dnd-kit Multiple Containers (Kanban)
**What:** DndContext wraps the entire Kanban view. Each status column is a DroppableContainer. Cards inside are SortableItems. DragOverlay renders a ghost card.
**When to use:** Kanban view drag between status columns (D-01).
**Example:**
```typescript
// Kanban drag-drop pattern
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core'

function KanbanView({ items, onSelect, onMoveStatus }: KanbanViewProps) {
  const [activeItem, setActiveItem] = useState<ContentReview | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  function handleDragStart(event: DragStartEvent) {
    const item = items.find(i => i.id === event.active.id)
    setActiveItem(item ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveItem(null)
    if (!over) return
    // over.id is the column status string
    const newStatus = over.id as ContentStatus
    const itemId = active.id as string
    if (items.find(i => i.id === itemId)?.status !== newStatus) {
      onMoveStatus(itemId, newStatus)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-4 gap-4">
        {kanbanColumns.map(col => (
          <DroppableColumn key={col.status} id={col.status} label={col.label}>
            <SortableContext
              items={items.filter(i => i.status === col.status).map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.filter(i => i.status === col.status).map(item => (
                <DraggableContentCard key={item.id} item={item} onSelect={onSelect} />
              ))}
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>
      <DragOverlay>
        {activeItem && <DragOverlayCard item={activeItem} />}
      </DragOverlay>
    </DndContext>
  )
}
```

### Pattern 2: dnd-kit Month View (Date Cell Drop Targets)
**What:** DndContext wraps the month grid. Each date cell is a useDroppable target. Content items are useDraggable. On drop, update scheduled_date.
**When to use:** Month view reschedule (D-03).
**Example:**
```typescript
// Month view: items are draggable, date cells are droppable
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import type { DragEndEvent } from '@dnd-kit/core'

function DroppableDateCell({ dateKey, children }: { dateKey: string; children: React.ReactNode }) {
  const { setNodeRef, isOver } = useDroppable({ id: dateKey })
  return (
    <div ref={setNodeRef} className={cn('min-h-[100px]', isOver && 'bg-[hsl(var(--accent-coral)/0.08)]')}>
      {children}
    </div>
  )
}

function DraggableItem({ item }: { item: ContentReview }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: item.id })
  const style = transform ? { transform: `translate(${transform.x}px, ${transform.y}px)` } : undefined
  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {/* card content */}
    </div>
  )
}
```

### Pattern 3: AI Refinement via Claude Sonnet
**What:** Send caption to Claude Sonnet, get back structured JSON with 2-3 suggestions. Each suggestion has a type, description, and revised text snippet. User accepts/rejects individually.
**When to use:** "Refine with AI" button in ContentReviewModal (D-07, D-08).
**Example:**
```typescript
// AI refinement hook
async function refineCaption(caption: string): Promise<AiSuggestion[]> {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) return []

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: `You are a LinkedIn content editor for the "Build What Lasts" brand.
Voice: direct, specific, proof over opinions, no fluff, no corporate speak. NEVER use em dashes.

Review this LinkedIn post and suggest 2-3 specific, incremental improvements. Do NOT rewrite the entire post.

For each suggestion:
- type: "tighten" | "strengthen" | "cut" | "restructure" | "cta"
- description: What to change and why (1 sentence)
- original: The exact text to replace
- revised: The improved text

Also flag if the post is outside the optimal 1200-1600 character range.

Return JSON only:
{"suggestions": [...], "char_count": N, "in_range": true/false, "range_note": "..."}

Post:
${caption}`,
      }],
    }),
  })

  // Parse response (same pattern as useBrainDump.ts)
}
```

### Pattern 4: n8n Webhook Fire-and-Forget
**What:** On status change to approved/rejected, POST to VITE_N8N_WEBHOOK_URL with content metadata. No response handling needed beyond error logging.
**When to use:** Content approval/rejection notifications (D-14 through D-17).
**Example:**
```typescript
async function fireN8nWebhook(payload: {
  action: 'approved' | 'rejected'
  post_title: string
  scheduled_date: string | null
  platform: string
  rejection_reason?: string
  content_url: string
}) {
  const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL
  if (!webhookUrl) return // Graceful skip if not configured

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    // Fire-and-forget: log but don't block UI
    console.warn('n8n webhook failed')
  }
}
```

### Pattern 5: Bulk Selection State
**What:** A React state Set of selected item IDs, managed via a custom hook. Floating action bar appears when count > 0.
**When to use:** Bulk actions (D-23, D-24).
**Example:**
```typescript
function useBulkSelection() {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = (ids: string[]) => setSelectedIds(new Set(ids))
  const deselectAll = () => setSelectedIds(new Set())

  return { selectedIds, toggle, selectAll, deselectAll, count: selectedIds.size }
}
```

### Pattern 6: Revision History with diff
**What:** On each caption save, insert a row into content_versions. Display version list in modal. "Compare" uses the `diff` package to compute word-level changes, rendered as green/red spans.
**When to use:** Revision history (D-34 through D-36).
**Example:**
```typescript
import { diffWords } from 'diff'

function DiffView({ oldText, newText }: { oldText: string; newText: string }) {
  const changes = diffWords(oldText, newText)
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {changes.map((part, i) => (
        <span
          key={i}
          className={cn(
            part.added && 'bg-[hsl(var(--status-success)/0.15)] text-[hsl(var(--status-success))]',
            part.removed && 'bg-[hsl(var(--status-error)/0.15)] text-[hsl(var(--status-error))] line-through',
          )}
        >
          {part.value}
        </span>
      ))}
    </div>
  )
}
```

### Anti-Patterns to Avoid
- **Drag on all views:** D-04 and D-05 explicitly exclude Week and List views from drag. Do NOT wrap them in DndContext.
- **Full AI rewrite:** D-07 says incremental suggestions only. The AI prompt must NOT return a full rewrite.
- **Calling Slack directly:** D-16 says Console fires webhook to n8n only. Never import a Slack SDK.
- **Heavy diff library:** For plain text caption diffs, `diff` (8KB) is sufficient. Do not install react-diff-viewer (150KB+) for this use case.
- **Bundling hashtag suggestions with refinement:** D-12 says hashtags are a separate action button.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Drag-and-drop | Custom mouse event tracking | @dnd-kit/core + @dnd-kit/sortable | Touch support, accessibility (keyboard drag), collision detection, sensors all handled. Already installed. |
| Text diffing | Character-by-character comparison | `diff` npm package (diffWords) | Handles edge cases (whitespace, Unicode, moved blocks). Battle-tested. |
| Toast notifications | Custom notification system | sonner (already installed) | Already wired throughout the app. Consistent UX. |
| Date grid computation | Manual calendar math | date-fns (startOfMonth, eachDayOfInterval, etc.) | Already used in MonthView. Handles DST, leap years, week boundaries. |
| Drag overlay ghost | CSS clone tricks | @dnd-kit DragOverlay component | Handles portal rendering, z-index, cursor tracking automatically. |

**Key insight:** The project already has the core libraries installed. The main work is wiring them together, not selecting or installing new tools.

## Common Pitfalls

### Pitfall 1: dnd-kit Collision Detection in Kanban
**What goes wrong:** Default collision detection (rectIntersection) doesn't work well when dragging between columns with different numbers of items. Cards "snap" to wrong columns.
**Why it happens:** rectIntersection checks overlap area. With uneven column heights, the active item can overlap with an adjacent column's bounds.
**How to avoid:** Use `closestCorners` collision detection for Kanban. For Month view, use `closestCenter` since date cells are uniform.
**Warning signs:** Items jumping between columns unexpectedly during drag.

### Pitfall 2: Optimistic Updates vs. Server State with Drag
**What goes wrong:** User drags a card to a new column, sees it snap back, then jump to the correct position after the server responds.
**Why it happens:** React Query refetch overrides the local state before the mutation completes.
**How to avoid:** Use optimistic updates in the mutation. Update the query cache immediately via `queryClient.setQueryData`, then let `invalidateQueries` in onSettled resync.
**Warning signs:** Visual "bounce" after dropping a card.

### Pitfall 3: DragOverlay Without Portal
**What goes wrong:** The ghost card during drag renders inside the scrollable container and gets clipped.
**Why it happens:** DragOverlay renders in-place by default. If the parent has overflow:hidden or overflow:auto, the ghost is clipped.
**How to avoid:** DragOverlay renders in a portal by default in dnd-kit v6. Verify it's not accidentally nested inside a container with position:relative that breaks the portal.
**Warning signs:** Ghost card disappears or gets cut off during drag.

### Pitfall 4: PointerSensor vs. Click Handlers
**What goes wrong:** Cards become unclickable after adding drag. Every click starts a drag operation.
**Why it happens:** PointerSensor captures pointer events before onClick fires.
**How to avoid:** Set `activationConstraint: { distance: 8 }` on PointerSensor. This requires 8px of movement before drag activates, allowing normal clicks to pass through.
**Warning signs:** Cards that should open the detail modal start dragging instead.

### Pitfall 5: Claude API Rate Limits in Browser
**What goes wrong:** Rapid "Refine" clicks send multiple concurrent requests, hitting rate limits or creating race conditions.
**Why it happens:** No debouncing or request deduplication.
**How to avoid:** Disable the "Refine" button while a refinement is pending (use mutation's isPending state). Show skeleton shimmer while waiting.
**Warning signs:** Multiple toast errors, stale suggestions appearing.

### Pitfall 6: Auto-Save on Blur Creating Excessive Versions
**What goes wrong:** Every blur of the textarea creates a new revision, even if nothing changed.
**Why it happens:** onBlur fires even when user just clicks away without editing.
**How to avoid:** Compare current caption to last-saved caption before creating a version. Only save + version if text actually changed.
**Warning signs:** Dozens of identical revisions in history.

### Pitfall 7: Stale Content After Drag Reorder
**What goes wrong:** After dragging a card in Month view, the calendar doesn't reflect the new date.
**Why it happens:** MonthView has its own `itemsByDate` memo that depends on the `items` prop. If the parent doesn't re-render with updated data, the memo is stale.
**How to avoid:** Optimistic cache update must change the `scheduled_date` field so the memo recomputes. Alternatively, maintain local state for drag moves.
**Warning signs:** Card appears in old position after drop, then jumps to new position on refetch.

## Code Examples

### Supabase Schema: New Tables

```sql
-- content_templates
CREATE TABLE content_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Monday, 6=Sunday
  title_pattern text NOT NULL,
  default_caption text,
  content_type text NOT NULL DEFAULT 'text',
  platform text NOT NULL DEFAULT 'linkedin',
  target_char_min int DEFAULT 1200,
  target_char_max int DEFAULT 1600,
  suggested_slide_count int DEFAULT 0,
  series text,
  sort_order smallint DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- content_versions (revision history)
CREATE TABLE content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_reviews(id) ON DELETE CASCADE,
  revision int NOT NULL,
  caption text,
  change_summary text,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_content_versions_content ON content_versions(content_id, revision);

-- content_performance (manual metrics)
CREATE TABLE content_performance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_reviews(id) ON DELETE CASCADE,
  impressions int DEFAULT 0,
  likes int DEFAULT 0,
  comments int DEFAULT 0,
  shares int DEFAULT 0,
  click_through_rate numeric(5,2) DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0,
  recorded_at timestamptz DEFAULT now()
);
CREATE UNIQUE INDEX idx_content_performance_content ON content_performance(content_id);
```

### TypeScript Interfaces: New Types

```typescript
// Add to src/types/database.ts

export interface ContentTemplate {
  id: string
  day_of_week: number // 0=Monday, 6=Sunday
  title_pattern: string
  default_caption: string | null
  content_type: ContentType
  platform: string
  target_char_min: number
  target_char_max: number
  suggested_slide_count: number
  series: string | null
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ContentVersion {
  id: string
  content_id: string
  revision: number
  caption: string | null
  change_summary: string | null
  created_at: string
}

export interface ContentPerformance {
  id: string
  content_id: string
  impressions: number
  likes: number
  comments: number
  shares: number
  click_through_rate: number
  engagement_rate: number
  recorded_at: string
}
```

### Batch Template Generation

```typescript
// Generate a week of content from templates
async function generateWeekFromTemplates(
  templates: ContentTemplate[],
  weekStartDate: Date
) {
  const items = templates
    .filter(t => t.is_active && t.day_of_week < 6) // Mon-Sat only
    .map(t => {
      const itemDate = addDays(weekStartDate, t.day_of_week)
      return {
        post_title: t.title_pattern,
        caption: t.default_caption,
        content_type: t.content_type as ContentType,
        scheduled_date: format(itemDate, 'yyyy-MM-dd'),
        day_label: format(itemDate, 'EEEE'),
        week_number: getWeek(itemDate, { weekStartsOn: 1 }),
        platforms: [t.platform],
        series: t.series,
        notes: null,
        slide_count: t.suggested_slide_count,
      }
    })

  // Batch insert into content_reviews
  const { error } = await supabase
    .from('content_reviews')
    .insert(items.map(item => ({
      ...item,
      status: 'draft',
      revision: 1,
      export_paths: [],
      excalidraw_paths: [],
    })))
  if (error) throw error
}
```

### Floating Bulk Action Bar

```typescript
// Fixed position bar at bottom of viewport
function BulkActionBar({
  count,
  onApproveAll,
  onMoveToDraft,
  onReschedule,
  onDelete,
  onDeselectAll,
}: BulkActionBarProps) {
  if (count === 0) return null

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50
        flex items-center gap-3 px-5 py-3 rounded-xl
        bg-[hsl(var(--bg-surface))] border border-[hsl(var(--border-default))]
        shadow-xl"
    >
      <span className="text-sm font-medium">{count} selected</span>
      <Button size="sm" onClick={onApproveAll}>Approve All</Button>
      <Button size="sm" variant="outline" onClick={onMoveToDraft}>Move to Draft</Button>
      <Button size="sm" variant="outline" onClick={onReschedule}>Reschedule</Button>
      <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
      <Button size="sm" variant="ghost" onClick={onDeselectAll}>Deselect</Button>
    </motion.div>
  )
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| react-beautiful-dnd | @dnd-kit | 2022+ | react-beautiful-dnd deprecated. @dnd-kit is the standard for React drag-drop. |
| Claude 3.5 Sonnet | Claude Sonnet 4 (claude-sonnet-4-20250514) | May 2025 | Better instruction following. Currently used in useBrainDump.ts. |
| Manual JSON diff | diff npm package | Stable | diffWords/diffLines for lightweight text comparison. |

**Deprecated/outdated:**
- react-beautiful-dnd: Officially unmaintained since 2022. Do not use.
- @hello-pangea/dnd: Fork of rbd, works but @dnd-kit has better accessibility and touch support.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | None detected -- no test framework installed |
| Config file | none -- see Wave 0 |
| Quick run command | N/A |
| Full suite command | N/A |

### Phase Requirements -> Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CSUG-01 | Calendar nav forward/back/today | manual-only | Visual interaction testing | N/A |
| CSUG-02 | Drag card between columns/dates | manual-only | Drag-drop requires browser | N/A |
| CSUG-03 | Carousel slide thumbnails render | manual-only | Visual component | N/A |
| CSUG-04 | Caption edit + AI refinement | manual-only | Requires Claude API | N/A |
| CSUG-05 | Bulk select + action bar | manual-only | UI interaction | N/A |
| CSUG-06 | Performance metrics display | manual-only | Visual + Supabase | N/A |
| CSUG-07 | Template CRUD + generation | manual-only | Supabase mutations | N/A |
| CSUG-08 | Multi-platform tabs | manual-only | Visual component | N/A |
| CSUG-09 | Webhook fires on approve/reject | manual-only | Requires n8n endpoint | N/A |
| CSUG-10 | Time picker scaffold | manual-only | Visual component | N/A |
| CSUG-11 | Revision diff + revert | manual-only | Supabase + diff logic | N/A |
| CSUG-12 | Analytics strip renders | manual-only | Computed from data | N/A |

### Sampling Rate
- **Per task commit:** `npm run build` (TypeScript + Vite build must pass)
- **Per wave merge:** Manual visual verification in browser
- **Phase gate:** Full build green + visual QA of all 4 views + modal features

### Wave 0 Gaps
- No test framework exists in this project. All validation is via `npm run build` + manual visual QA.
- This is consistent with the project's existing pattern -- no tests were added in Phases 1-4.1.

## Open Questions

1. **Supabase table creation method**
   - What we know: New tables (content_templates, content_versions, content_performance) need to be created
   - What's unclear: Whether to use Supabase Dashboard UI, a migration file, or raw SQL
   - Recommendation: Use Supabase Dashboard for table creation (consistent with project's existing approach), document the SQL in the plan for reproducibility

2. **Claude model identifier for Sonnet**
   - What we know: useBrainDump.ts uses `claude-sonnet-4-20250514`. D-11 says "use Claude Sonnet."
   - What's unclear: Whether a newer Sonnet model is available
   - Recommendation: Use the same model ID as useBrainDump.ts (`claude-sonnet-4-20250514`) for consistency. Update later if needed.

3. **Content Pipeline page size after all features**
   - What we know: ContentPipeline.tsx is already 806 lines. This phase adds significant features.
   - What's unclear: Final file size could exceed 1500+ lines
   - Recommendation: Extract views into separate files (KanbanView.tsx, MonthView.tsx, etc.) as part of the first plan wave. This makes drag-drop wiring cleaner.

## Sources

### Primary (HIGH confidence)
- Existing codebase: ContentPipeline.tsx, ContentReviewModal.tsx, useContentReviews.ts, useBrainDump.ts, database.ts -- direct file reads
- @dnd-kit installed versions: npm ls confirmed v6.3.1/v10.0.0 installed
- package.json: all dependency versions verified

### Secondary (MEDIUM confidence)
- [dnd-kit official docs](https://dndkit.com/) -- DndContext, useDraggable, useDroppable, DragOverlay patterns
- [dnd-kit Kanban example](https://radzion.com/blog/kanban/) -- Multiple container pattern
- [LogRocket dnd-kit Kanban guide](https://blog.logrocket.com/build-kanban-board-dnd-kit-react/) -- Collision detection recommendations
- [diff npm package](https://www.npmjs.com/package/diff) -- v8.0.4 confirmed via npm view

### Tertiary (LOW confidence)
- Claude Sonnet model ID stability: using same ID as existing code, but Anthropic may have newer models. LOW risk since existing pattern works.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all core libraries already installed and verified
- Architecture: HIGH - extends existing patterns (React Query mutations, Claude API calls, shadcn modals)
- Pitfalls: HIGH - based on documented dnd-kit issues and direct codebase analysis
- AI refinement: MEDIUM - prompt engineering approach is sound but untested with this specific content domain
- Schema design: MEDIUM - discretion area, proposed schema follows existing patterns

**Research date:** 2026-03-23
**Valid until:** 2026-04-23 (stable -- all core libraries are mature)
