# Forge Console v2 - UI/UX Improvement Planning Session

**Date**: March 23, 2026
**Owner**: Lucas Oliver, IAC Solutions
**Codebase**: ~3,343 lines | 16 components | 8 pages | React + TypeScript + Tailwind + Radix UI + Framer Motion

---

## How to Use This File

Work through each section in order. For each issue, decide: **Do Now**, **Do Later**, or **Skip**. Then prioritize the "Do Now" items into a numbered execution order. Hand this file to Claude with your decisions and say: "Implement the items I marked Do Now, in the order I numbered them."

---

## Section 1: Quick Wins (< 30 min each)

These are small, high-impact changes that can be knocked out fast.

### 1.1 Add ARIA labels to icon-only buttons
- **Where**: Sidebar hamburger, modal close buttons, resource link icons (ProjectDetail)
- **Why**: Screen readers announce these as unlabeled buttons
- **Effort**: ~15 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.2 Add `prefers-reduced-motion` support
- **Where**: `globals.css` + Framer Motion config
- **Why**: Motion-sensitive users get no relief; all animations play regardless
- **Effort**: ~20 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.3 Add skip-to-main-content link
- **Where**: `App.tsx` or layout
- **Why**: Keyboard users must tab through entire sidebar to reach content
- **Effort**: ~10 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.4 Fix heading hierarchy (h1 -> h3 skips)
- **Where**: ProjectDetail, Dashboard card sections
- **Why**: Screen readers and SEO rely on proper heading nesting
- **Effort**: ~15 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.5 Add `aria-live` regions for dynamic content
- **Where**: Brain dump parse results, content status updates, system health
- **Why**: Screen readers don't announce when content changes dynamically
- **Effort**: ~20 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.6 Add semantic roles to filter chips
- **Where**: ActivityLog filter bar, ContentPipeline view toggle
- **Why**: Filter chips are plain buttons with no role context
- **Effort**: ~15 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 1.7 Add `aria-label` to action item count badges
- **Where**: ActionItemsCard, Sidebar nav badges
- **Why**: Count circles are visual-only; screen readers miss them
- **Effort**: ~10 min
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

---

## Section 2: Medium Effort (1-3 hours each)

Meaningful UX improvements that require focused implementation time.

### 2.1 Toast/notification system
- **Where**: New shared component, used across all mutation flows
- **Why**: Only copy-to-clipboard has user feedback. Approve/reject, note creation, brain dump submission all silently succeed or fail
- **Approach**: Lightweight toast component (or use Radix Toast primitive) with success/error/info variants
- **Effort**: ~1.5 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.2 Error boundary implementation
- **Where**: New ErrorBoundary component wrapping routes in App.tsx
- **Why**: Any unhandled error currently crashes the entire app with a white screen
- **Approach**: Global boundary + per-page boundaries with "retry" button
- **Effort**: ~1 hour
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.3 Modal focus trapping and keyboard dismiss
- **Where**: ContentPipeline detail modal, any future modals
- **Why**: Tab key escapes modal, Escape doesn't close it, focus doesn't return on close
- **Approach**: Replace custom modal with Radix Dialog (already a dependency)
- **Effort**: ~1.5 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.4 Keyboard-accessible kanban board
- **Where**: ProjectDetail task board
- **Why**: Drag-drop is mouse-only; keyboard users cannot move tasks between columns
- **Approach**: Add arrow key navigation + Enter/Space to pick up and drop tasks
- **Effort**: ~2 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.5 Mobile-friendly content pipeline month view
- **Where**: ContentPipeline month view
- **Why**: 7-column grid is unusable on phones; cells are too narrow to read
- **Approach**: Switch to vertical day-list layout on mobile, or horizontal scroll with snap
- **Effort**: ~1.5 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.6 Responsive filter bar for Activity Log
- **Where**: ActivityLog filter section
- **Why**: Chips wrap unpredictably on narrow screens
- **Approach**: Horizontal scroll with fade edges, or collapsible filter drawer on mobile
- **Effort**: ~1 hour
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.7 Confirmation dialogs for destructive actions
- **Where**: Content rejection, task deletion (future), note deletion (future)
- **Why**: No "are you sure?" before irreversible actions
- **Approach**: Radix AlertDialog with consistent styling
- **Effort**: ~1 hour
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.8 Global search / command palette
- **Where**: New component, accessible via Cmd+K
- **Why**: No way to quickly find a project, task, content item, or navigate between pages without clicking sidebar
- **Approach**: Radix Dialog-based command palette with fuzzy search across entities
- **Effort**: ~3 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.9 Keyboard shortcut system with help overlay
- **Where**: New hook + help modal (press `?` to open)
- **Why**: Only Cmd+Enter exists; power user has no way to discover or use shortcuts
- **Approach**: Register shortcuts globally, display in `?` overlay
- **Effort**: ~2 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 2.10 Inline style cleanup -> Tailwind/CSS classes
- **Where**: All page and component files
- **Why**: Heavy inline `style={{}}` props hurt maintainability and override consistency
- **Approach**: Migrate inline styles to Tailwind utilities or CSS custom classes in globals.css
- **Effort**: ~2-3 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

---

## Section 3: Larger Initiatives (Half day+ each)

Strategic improvements that significantly change the user experience.

### 3.1 Dark mode
- **Where**: globals.css (CSS variables), new toggle in Sidebar or Settings
- **Why**: Light-only can cause eye strain during evening sessions
- **Approach**: Duplicate CSS variable block under `[data-theme="dark"]`, add toggle with localStorage persistence
- **Effort**: ~4-6 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.2 Real-time updates via Supabase Realtime
- **Where**: All query hooks
- **Why**: Data only refreshes on navigation; changes from n8n automations or other sessions go unnoticed
- **Approach**: Subscribe to Supabase Realtime channels, invalidate React Query cache on changes
- **Effort**: ~4 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.3 Data visualizations (charts/graphs)
- **Where**: Dashboard, ProjectDetail, ContentPipeline
- **Why**: No trend data visible; progress is a single number, not a trajectory
- **Approach**: Add lightweight chart library (e.g., Recharts or custom SVG) for progress over time, content throughput, activity frequency
- **Effort**: ~6-8 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.4 Dashboard widget customization
- **Where**: Dashboard page
- **Why**: Fixed layout; can't reorder or hide cards based on daily priorities
- **Approach**: Drag-to-reorder grid with localStorage persistence
- **Effort**: ~6 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.5 Offline support / PWA
- **Where**: Service worker, cache strategy
- **Why**: App is unusable without network; blank screen if Supabase unreachable
- **Approach**: Vite PWA plugin, cache-first for static assets, network-first for API
- **Effort**: ~4-6 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.6 Move Claude API calls server-side
- **Where**: Brain dump hook -> new Supabase Edge Function or Cloudflare Worker
- **Why**: API key exposed in browser via `anthropic-dangerous-direct-browser-access`
- **Approach**: Create edge function that proxies Claude calls, remove client-side API key
- **Effort**: ~3-4 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.7 Content pipeline drag-drop between stages
- **Where**: ContentPipeline kanban view
- **Why**: Must open modal and click approve/reject; no direct drag between columns
- **Approach**: HTML5 drag API (like ProjectDetail tasks) or library like dnd-kit
- **Effort**: ~4 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

### 3.8 Bulk actions for content pipeline
- **Where**: ContentPipeline list/kanban views
- **Why**: Approving 5 items requires opening 5 modals
- **Approach**: Checkbox selection + floating action bar (Approve Selected, Reject Selected)
- **Effort**: ~3-4 hours
- **Decision**: [ ] Do Now  [ ] Do Later  [ ] Skip
- **Priority**: ___

---

## Section 4: Nice-to-Haves

Lower priority but worth considering for future sessions.

- [ ] "Today's Focus" section on Dashboard with top 3 priorities
- [ ] Touch/swipe gestures for mobile sidebar
- [ ] Onboarding walkthrough for first visit
- [ ] Global entity search (not just command palette navigation)
- [ ] Undo/redo for mutations
- [ ] Dashboard clock update interval (60s -> real-time or 10s)
- [ ] Kanban column item count indicators
- [ ] Card padding consistency audit
- [ ] Activity log pagination or virtual scrolling for large datasets
- [ ] Content pipeline calendar day click-to-create

---

## Execution Template

Once you've marked your decisions above, fill in this execution order:

### Morning Block
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________
4. _______________________________________________
5. _______________________________________________

### Afternoon Block
6. _______________________________________________
7. _______________________________________________
8. _______________________________________________
9. _______________________________________________
10. ______________________________________________

---

## Prompt to Give Claude

Copy and paste this after filling in your decisions:

> Here is my UI/UX improvement plan with decisions marked. Implement all items I marked "Do Now" in the priority order I numbered them. For each item, make the change, verify it builds cleanly, and commit before moving to the next. Start with item #1.

---
