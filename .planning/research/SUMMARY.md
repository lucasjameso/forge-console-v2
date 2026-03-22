# Project Research Summary

**Project:** Forge Console v2 -- Quality Redesign
**Domain:** Personal productivity command center (agent-augmented, single-user, desktop-primary)
**Researched:** 2026-03-22
**Confidence:** HIGH

## Executive Summary

Forge Console v2 is a quality redesign of an existing, mostly functional Vite SPA -- not a greenfield build. The product is a single-user command center aggregating project management, content pipeline, brain dump capture, social media tracking, and podcast guest CRM into one dense, fast interface augmented by n8n and Claude Code agents. The core insight from research is that 90% of the infrastructure is already correct: the right technologies are installed, the data layer works, and most features are built. This milestone is about replacing ad-hoc CSS classes with a proper shadcn/ui component system, resolving the known UX gaps listed in PROJECT.md (caption editing, brain dump task assignment, mobile capture, podcast tracker), and polishing every page to feel intentional rather than provisional.

The recommended approach is to adopt shadcn/ui first -- it is the prerequisite that unblocks all visual work. The existing design token system in globals.css maps cleanly to shadcn's CSS variable convention; integration is a manual merge operation, not a replacement. After the component foundation is stable, systematically polish each page using the new component system, then build the remaining features. The architecture needs no restructuring; the only new structural addition is a `/capture` route with its own layout for mobile.

The two most critical risks are CSS variable collision during shadcn init (back up globals.css and merge manually -- do not let the CLI overwrite) and accidental Tailwind v4 migration (pin `tailwindcss` to `^3.4.19`). Both are preventable with deliberate process. Secondary risks are iOS Safari keyboard behavior on the mobile capture page and stale PWA caches after Cloudflare deployment, both of which have well-documented solutions.

---

## Key Findings

### Recommended Stack

The project already has Tailwind CSS 3.4.19, 11 Radix UI primitives, Framer Motion 12, date-fns, Lucide React, and React Query. Meaningful additions needed are: shadcn/ui (via CLI v4 init + component generation), vite-plugin-pwa (installable mobile capture), and a small set of shadcn-ecosystem libraries -- sonner (toasts), cmdk (command palette), react-day-picker (calendar), react-textarea-autosize (brain dump input), and vaul (mobile bottom sheet). Self-hosting Inter via @fontsource replaces the Google Fonts CDN dependency and is required for PWA offline support.

The firm constraint: do NOT migrate to Tailwind v4. It requires a full CSS-first config rewrite with OKLCH color migration and a different animation package, with zero user-facing benefit for this milestone. The shadcn CLI v4 (March 2026) explicitly supports Tailwind v3 -- this is a tested, documented path.

**Core technologies:**
- shadcn/ui CLI v4: component scaffolding -- replaces all custom CSS component classes with typed, accessible, consistently styled primitives built on the existing Radix primitives
- vite-plugin-pwa 0.21+: PWA manifest + Workbox service worker -- makes the app installable on iPhone home screen for mobile capture, enables offline asset caching
- tailwindcss-animate 1.0.7: required animation dependency for shadcn on Tailwind v3 (not tw-animate-css, which is Tailwind v4 only)
- sonner 1.7+: toast notifications -- shadcn ecosystem default, pre-styled, tiny bundle, avoids z-index conflicts with correct placement
- @fontsource/inter: self-hosted font -- eliminates Google Fonts render-blocking request, works offline in PWA context

See `/STACK.md` for full component list, alternatives considered, and installation commands.

### Expected Features

Research confirms the project has a clear, well-bounded MVP scope. shadcn adoption is the prerequisite that unblocks everything else because visual inconsistency is the most visible quality problem. After the component foundation is in place, the outstanding feature work is well-defined: brain dump task assignment is the highest-complexity item (it wires two existing systems together and is the critical data flow connecting capture to action), while podcast tracker, Slack webhook, and caption editing are straightforward UI additions against existing schema.

**Must have -- table stakes for this milestone (P1):**
- shadcn/ui adoption with CSS variable token mapping -- foundation; everything else builds on it
- Dashboard information redesign (dense grid, typographic hierarchy, "days since" indicators on project cards)
- Visual polish pass on all pages (24px card padding, 10px border radius, consistent hover states)
- Brain dump task assignment to project boards -- PROJECT.md active requirement; wires parsed tasks to project kanban
- Caption editing in content pipeline -- PROJECT.md active requirement; missing from daily workflow
- Mobile capture page (/capture) -- PROJECT.md explicit requirement; purpose-built for iPhone
- Podcast guest tracker table (outreach/scheduled/recorded/published pipeline) -- schema exists, pure UI
- Cross-platform content calendar on Social Media page -- PROJECT.md requirement
- Toast notifications on all mutating actions -- low effort, high perceived quality
- Error boundaries around each page -- prevents white screen failures
- Slack webhook on content approve/reject -- one fetch POST, closes integration loop
- Cloudflare Pages deployment -- must be live and accessible

**Should have -- competitive differentiators, add in v1.x after launch:**
- Command palette (Cmd+K) -- add once page routes are stable
- Focus block on dashboard (single most important thing) -- add after daily usage reveals priority signal accuracy
- Stat sparklines -- add after ~2 weeks of real historical data exists
- Agent dispatch quick action buttons -- add once n8n workflows are tested and reliable

**Defer to v2+:**
- Offline mobile capture with sync queue -- prove the capture pattern is used first
- Project health score -- needs real project data to calibrate thresholds
- Social media API integrations, dark mode, complex charting -- explicitly out of scope per PROJECT.md

See `/FEATURES.md` for full prioritization matrix, competitor analysis, and feature dependency graph.

### Architecture Approach

The existing architecture is a Vite SPA with React Router, React Query for all server state, and Supabase as the backend. The structure is sound and needs no reorganization -- this milestone is quality, not restructuring. The one architectural addition is a `/capture` route with its own CaptureLayout (no sidebar, full-screen input) that writes to the existing `brain_dump_entries` table. The component layer gets a new sublayer: shadcn-generated files in `src/components/ui/` that replace custom CSS classes, customized purely via CSS variable mapping in `:root`, never by editing component source files.

**Major components:**
1. MainLayout (Sidebar + content area) -- existing; visual polish only
2. CaptureLayout (new) -- minimal layout for `/capture` route, no sidebar, full-screen textarea
3. shadcn/ui component layer (`src/components/ui/`) -- new; typed primitives replacing CSS classes
4. Design token layer (globals.css `:root` CSS variables) -- existing; extended with shadcn variable mappings
5. React Query hooks -- existing; extended with toast callbacks on every mutation

Key patterns: composable Card sections for every data region, mutation + toast on every user action, per-region skeleton loading (never full-page spinners), CSS variables for all theming (never hardcoded hex or Tailwind color classes). Anti-patterns to avoid: editing shadcn component source for styling, mixed CSS class approaches across pages, responsive breakpoints for desktop pages (the `/capture` route handles mobile; desktop is fixed at 1440px).

See `/ARCHITECTURE.md` for component boundary table, data flow diagram, and pattern code examples.

### Critical Pitfalls

1. **shadcn init overwrites globals.css** -- Back up `src/styles/globals.css` before running `npx shadcn@latest init`. After init, manually merge shadcn's CSS variable declarations (--background, --foreground, --primary, --card, --border, --ring, --radius, etc.) into the existing file, mapping each to the corresponding Forge Console token value. Detection: app looks completely different after init (wrong colors, wrong spacing).

2. **Accidental Tailwind v4 upgrade** -- Pin `tailwindcss` to `^3.4.19` in package.json before any work begins. Do not run `npx tailwindcss@latest`. Verify shadcn init selects Tailwind v3. Detection: build failure referencing `@theme` directive, missing `tailwind.config.ts`, or OKLCH color format errors.

3. **Component migration leaves orphaned CSS causing visual inconsistency** -- Migrate by component type across the entire codebase, not page by page. Convert all `<Button>` instances app-wide before moving to `<Card>`, etc. Delete the old CSS class from globals.css after each type is fully migrated. Detection: search for old class names (`.btn-primary`, `.card`, `.badge`) -- any remaining hits need conversion.

4. **iOS Safari virtual keyboard hides the mobile capture submit button** -- Use the `visualViewport` API to detect keyboard height on the `/capture` route. Apply `env(safe-area-inset-bottom)` for bottom padding. Test on a real iPhone -- Chrome DevTools mobile emulator does not reproduce this bug.

5. **PWA cache serves stale UI after Cloudflare Pages deploy** -- Configure vite-plugin-pwa with `registerType: 'autoUpdate'`. Use network-first strategy for Supabase API calls and cache-first for static assets. The autoUpdate strategy triggers cache invalidation when new content is detected at the service worker level.

See `/PITFALLS.md` for the full list including minor pitfalls (Framer Motion + Dialog, cmdk + React Router, Sonner z-index) and phase-specific warning matrix.

---

## Implications for Roadmap

The dependency graph from research is clear: shadcn/ui adoption must happen before any visual polish work -- doing it after creates rework. Mobile capture is structurally independent and can be isolated to a single phase. Feature additions (brain dump wiring, podcast tracker, calendar) depend on the component foundation being stable. All features can be built against the existing Supabase schema with no new backend work except possibly minor field additions for content performance annotations (deferred to v1.x).

### Phase 1: shadcn/ui Foundation
**Rationale:** Every other phase depends on a consistent component system. Visual polish done before shadcn adoption is rework -- you'd polish CSS classes that will be deleted. This must come first with no exceptions.
**Delivers:** `components.json`, all shadcn components generated in `src/components/ui/`, CSS variables in globals.css merged and mapped to Forge Console design tokens (--primary = coral, --accent = navy, --radius = 0.625rem, etc.), tailwindcss-animate installed, @fontsource/inter replacing Google Fonts CDN.
**Addresses:** shadcn adoption (P1), consistent component styling (table stakes), design token integration
**Avoids:** CSS variable overwrite pitfall (manual backup + merge step), Tailwind v4 accidental upgrade (version pinning before init)

### Phase 2: Visual Polish Pass -- All Pages
**Rationale:** With shadcn components in place, migrate all pages systematically by component type. This is the highest-visibility change and establishes the quality bar for all subsequent work. Doing it as one phase prevents the orphaned CSS inconsistency pitfall.
**Delivers:** All pages using shadcn Button, Card, Badge, Input, Textarea, Tabs, Dialog, Select, DropdownMenu, Tooltip, Checkbox, Switch, Progress, Separator, Skeleton, ScrollArea instead of custom CSS classes. 24px card padding via `<CardContent className="p-6">`. 10px border radius via `--radius: 0.625rem`. Consistent hover states, focus rings. Toast feedback on all mutations. Error boundaries on all pages. Orphaned CSS classes deleted from globals.css.
**Addresses:** Visual polish pass (P1 table stakes), toast notifications (P1), error boundaries (P1)
**Avoids:** Orphaned CSS inconsistency (migrate by component type, then delete old CSS), mixed styling approaches (anti-pattern)

### Phase 3: Dashboard Information Redesign
**Rationale:** The dashboard is the first thing seen every morning. With the component system stable, the redesign is a layout + data wiring problem. Separated from the broad visual polish pass because it involves new layout decisions, not just component substitution.
**Delivers:** Dense grid layout (2-3 columns, no 4-stacked-cards), typographic hierarchy (large stat numbers, small muted labels), ProjectQuickGlanceCard with progress bars + "days since last touched" color-coded indicators, ActionItemsCard with urgency-based sorting and visual weight, system health status strip (compact 3-dot or inline bar), UpcomingContentCard with scheduled-date ordering and status color coding.
**Addresses:** Dashboard information redesign (P1), at-a-glance project health (table stakes), information density
**Avoids:** Per-region skeleton loading (not full-page spinners), no responsive breakpoints (desktop-only layout)

### Phase 4: Brain Dump Task Assignment Flow
**Rationale:** The highest-complexity missing feature -- the critical data flow linking capture to action. Doing it after visual polish means the UI components exist to build it properly. Isolated from content/podcast work to give it focused attention.
**Delivers:** "Assign to [Project]" button on each parsed brain dump task card, React Query mutation that creates a real task from a brain dump task in the target project, status update on the `brain_dump_task` record after successful assignment, invalidated queries so the task appears immediately in the target project's kanban board.
**Addresses:** Brain dump task assignment (P1 critical differentiator), PROJECT.md active requirement
**Key dependency:** Verify `brain_dump_tasks` schema supports the assignment mutation (status field, foreign key to `project_tasks`) before designing the UI.

### Phase 5: Content Pipeline + Social Media Depth
**Rationale:** Caption editing, Slack webhook, and cross-platform calendar are independent from brain dump work and can follow directly. The content pipeline is a daily driver; these three items are all listed as active PROJECT.md requirements.
**Delivers:** Inline caption editing (textarea swap with optimistic React Query mutation + rollback on error), Slack webhook POST in the approve/reject mutation's `onSuccess` handler, cross-platform content calendar component with platform grouping and color coding by platform.
**Addresses:** Caption editing (P1, PROJECT.md requirement), Slack webhook (P1), content calendar (P1, PROJECT.md requirement)
**Implementation note:** Caption editing must use optimistic updates -- the edit should feel instant with rollback on network failure.

### Phase 6: Podcast Tracker + Mobile Capture PWA
**Rationale:** Podcast tracker is fully independent pure UI work. Mobile capture adds a new route and PWA infrastructure. Grouped together as isolated deliverables that don't touch the existing page structure.
**Delivers:** Podcast guest tracker table with status pipeline (outreach/scheduled/recorded/published), color-coded status badges, "days since outreach" indicators for follow-up signals. `/capture` route with CaptureLayout (no sidebar, full-screen), auto-growing textarea (react-textarea-autosize), optimistic submit, success toast, PWA manifest + service worker via vite-plugin-pwa (192x192 and 512x512 icons required), home screen installable on iPhone.
**Addresses:** Podcast tracker (P1, PROJECT.md requirement), mobile capture (P1, PROJECT.md requirement)
**Avoids:** iOS keyboard viewport bug (visualViewport API implementation), PWA stale cache (autoUpdate strategy), must test on real iPhone hardware before marking complete

### Phase 7: Deployment + Hardening
**Rationale:** Cloudflare Pages deployment is a P1 requirement. After all features are built, a hardening pass ensures error boundaries are comprehensive, loading states are correct, and the PWA registers correctly on Cloudflare's CDN.
**Delivers:** Production deployment to Cloudflare Pages, environment variables confirmed, PWA tested and installable from Cloudflare URL, error boundaries verified on all pages, final visual QA pass against design spec.
**Addresses:** Cloudflare deployment (P1), production readiness

### Phase Ordering Rationale

- Phase 1 is unconditional: shadcn adoption is the component foundation. No visual work is correct until it exists.
- Phase 2 before Phase 3: the visual polish pass establishes the component patterns before applying them to a new layout design.
- Phase 4 isolated: brain dump task assignment is the highest-complexity feature. Ordering it explicitly prevents it from being deprioritized or rushed.
- Phase 5 groups naturally: the three content/social features share the content pipeline data layer and none depend on the brain dump wiring.
- Phase 6 batches independent work: podcast tracker and mobile capture share no dependencies and are cleanest as a combined deliverable.
- Phase 7 last: deploy a polished, feature-complete product.

### Research Flags

Phases requiring careful execution (elevated risk):
- **Phase 1 (shadcn init):** The CSS variable merge step is manual and error-prone. Plan explicit backup step as the first action. Verify the merged file renders correctly before proceeding to Phase 2.
- **Phase 4 (brain dump assignment):** Cross-domain React Query cache invalidation touches `brain_dump_entries`, `brain_dump_tasks`, and `project_tasks`. Verify the mutation + invalidation chain works end-to-end before building the UI layer.
- **Phase 6 (mobile capture):** iOS Safari keyboard behavior requires testing on real device hardware. Do not ship without physical iPhone test.

Phases with standard patterns (low research risk):
- **Phase 2 (visual polish):** Mechanical shadcn component substitution against well-documented patterns.
- **Phase 5 (Slack webhook):** Simple fetch POST in mutation's `onSuccess` handler -- straightforward implementation.
- **Phase 7 (Cloudflare deployment):** Extension of existing deploy process.

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Existing codebase analyzed directly. shadcn CLI v4 Tailwind v3 compatibility confirmed from official docs and March 2026 changelog. All recommended libraries are from the shadcn/Radix ecosystem. |
| Features | HIGH | Feature list sourced directly from PROJECT.md requirements and codebase analysis. Single-user app -- no ambiguity about user needs. Prioritization based on explicit dependency analysis. |
| Architecture | HIGH | No architectural changes to existing structure. New patterns (shadcn component layer, capture route) are well-documented with clear implementation paths. |
| Pitfalls | HIGH | CSS variable collision and Tailwind v4 accidental upgrade are verified community issues with specific prevention steps. iOS Safari keyboard is a known, well-documented Safari behavior with an established API solution. |

**Overall confidence:** HIGH

### Gaps to Address

- **shadcn CSS variable merge specifics:** The exact mapping of shadcn's generated variables to Forge Console tokens should be written out and verified before any feature work begins. A mistake here creates a visible regression across the entire app. The mapping table in STACK.md is the starting point.
- **brain_dump_tasks schema:** The assignment flow assumes `brain_dump_tasks` has a `status` field and a path to create a corresponding record in `project_tasks`. Verify this schema constraint before designing the Phase 4 mutation.
- **PWA icon assets:** vite-plugin-pwa requires 192x192 and 512x512 PNG icons. These need to be created or sourced before Phase 6 implementation.
- **Cloudflare Pages + service worker interaction:** CDN edge caching and service worker caching can interact in unexpected ways. Test the PWA cache invalidation flow specifically on the Cloudflare deployment, not just local dev.

---

## Sources

### Primary (HIGH confidence)
- [shadcn/ui Vite Installation](https://ui.shadcn.com/docs/installation/vite) -- official CLI v4 install path, Tailwind v3 support confirmation
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) -- explicit v3/v4 compatibility matrix and migration separation
- [shadcn CLI v4 Changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- March 2026 release, Tailwind v3 auto-detection confirmed
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/) -- PWA manifest, Workbox caching strategies, autoUpdate pattern
- Existing codebase: `src/styles/globals.css`, `tailwind.config.ts`, `package.json`, `src/components/` -- direct source of current state analysis

### Secondary (MEDIUM confidence)
- [MDN: Making PWAs Installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) -- PWA manifest requirements, iOS Safari meta tags
- iOS Safari keyboard: https://medium.com/@krutilin.sergey.ks/fixing-the-safari-mobile-resizing-bug-a-developers-guide-6568f933cde0 -- visualViewport API pattern and safe-area-inset usage
- Dashboard UX: DesignRush 2026 Dashboard Principles, Pencil & Paper Dashboard UX Patterns -- information hierarchy and density patterns
- Content pipeline: Taplio LinkedIn Tools, Liseller LinkedIn Dashboards -- review workflow conventions
- Podcast CRM: Podseeker, The Podcast Host -- pipeline stage conventions (outreach/scheduled/recorded/published)

### Tertiary (informational only)
- Competitor analysis (Notion, Linear, Taplio) -- used to validate feature scope and differentiation framing, not implementation decisions

---
*Research completed: 2026-03-22*
*Ready for roadmap: yes*
