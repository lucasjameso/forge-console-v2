# Forge Console v2 -- Quality Redesign

## What This Is

Forge Console is Lucas Oliver's personal command center for managing his three active builds (Ridgeline Intelligence, CLARITY Book Launch, Forge Console), his LinkedIn content pipeline, his social media presence, and his autonomous agent system. It runs locally on a Mac Mini (M4 2024) and deploys to Cloudflare Pages. Single user, no auth, no multi-tenant.

Phases 1-7 were completed in a fast overnight build. All 7 pages render, the build compiles with zero errors, and Supabase schema is deployed. This milestone is about taking the working prototype and elevating it to premium quality -- fixing visual polish, adding functional depth, wiring real integrations, and deploying.

## Core Value

Every page should feel like a premium, Apple-quality product that Lucas wants to open every morning -- dense with useful information but visually clean and organized, never cramped or cluttered.

## Requirements

### Validated

- [x] Vite + React 18 + TypeScript project with zero build errors -- existing
- [x] 7 pages render with routing (Dashboard, Projects, ProjectDetail, BrainDump, ContentPipeline, SocialMedia, ActivityLog, Settings) -- existing
- [x] Supabase schema deployed (14 tables + RLS) -- existing
- [x] React Query hooks for all data domains with mock data fallback -- existing
- [x] Sidebar navigation with 7 items -- existing
- [x] Framer Motion page transitions and card animations -- existing
- [x] Content pipeline with 4 view modes (list/week/month/kanban) -- existing
- [x] Brain dump with Claude API parsing and local fallback -- existing
- [x] Code splitting with React.lazy + Suspense -- existing

### Active

- [x] Adopt shadcn/ui as component base, customized to design system -- Validated in Phase 01
- [ ] Visual quality pass on every page: spacing, padding, typography hierarchy, whitespace
- [ ] Dashboard redesign: dense but clear, proper information hierarchy
- [ ] Sidebar polish: proper spacing, visual refinement, premium feel
- [ ] Card system overhaul: 24px padding, 14px radius, subtle hover shadows, breathing room
- [ ] Project dashboards with real command-center depth
- [ ] Brain dump parsed tasks flow into project task boards (assign + create)
- [ ] Content pipeline Slack webhook on approve/reject
- [ ] Content pipeline post caption editing
- [ ] Podcast guest tracker table (outreach/scheduled/recorded/published status)
- [ ] Cross-platform content calendar view on Social Media
- [ ] Mobile capture experience: purpose-built quick-capture for iPhone (type and go, auto-parsed later)
- [ ] Agent dispatch from project quick actions (n8n integration)
- [ ] Settings persistence to Supabase
- [ ] Activity log export capability
- [x] Error boundaries around the entire app -- Validated in Phase 01
- [x] Favicon (coral F on navy background) -- Validated in Phase 01
- [ ] Seed Supabase with real data
- [ ] Cloudflare Pages deployment with production env vars

### Out of Scope

- Authentication / multi-user -- single user app, no auth needed
- Dark mode -- light mode primary, design system built for light
- Mobile-responsive version of full desktop app -- mobile is a separate capture-only experience
- Real-time collaboration -- single user
- Video/media hosting -- links to external platforms only
- OAuth / SSO -- no auth at all

## Context

- The existing code was built overnight for speed, not quality. Every page needs a visual polish pass.
- The design system spec in idea.md defines the target: Apple-inspired, clean and airy, generous whitespace, Inter font, specific color tokens.
- shadcn/ui was specified in the original idea.md but not adopted in the fast build. This redesign adopts it properly.
- The app uses mock data with Supabase fallback. Redesign continues against mock data; Supabase seeding happens later.
- Dashboard is the worst visual offender and sets the tone for the entire app.
- Mobile experience is NOT responsive desktop -- it is a purpose-built capture tool for on-the-go brain dumps and quick task allocation. Type a thought, close the app, process it later at the desk.
- Desktop targets: 1440px (MacBook Pro) and 1920px (external monitor).
- All 5 integrations are configured in .env.local (Supabase, Claude API, n8n, Cloudflare, Slack).

## Constraints

- **Tech stack**: Vite + React 18 + TypeScript + Tailwind + shadcn/ui + Framer Motion + React Query + Supabase. No Next.js.
- **Code rules**: No em dashes anywhere. No spinners (skeleton shimmer only). No `any` in TypeScript. No hardcoded colors (CSS variables only). Framer Motion for all animations. React Query for all data fetching. `npm run build` must pass after every change.
- **Deployment**: Cloudflare Pages via Wrangler.
- **Single user**: No auth, no multi-tenant, no user management.
- **Design system**: Must follow idea.md spec (colors, typography, spacing, component patterns).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Visuals before integrations | Premium feel is the top priority; wiring can happen on a solid visual foundation | -- Pending |
| Mock data during redesign | Supabase seeding is a separate step; mock data mirrors real structure | -- Pending |
| shadcn/ui adoption | Original spec called for it; provides consistent, accessible base components | Phase 01 complete |
| Desktop-first, mobile capture-only | Full app is desktop; mobile is purpose-built quick-capture, not responsive desktop | -- Pending |
| Dense but clear visual direction | Lucas wants information density with beautiful organization, not minimal/sparse | -- Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? -> Move to Out of Scope with reason
2. Requirements validated? -> Move to Validated with phase reference
3. New requirements emerged? -> Add to Active
4. Decisions to log? -> Add to Key Decisions
5. "What This Is" still accurate? -> Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check -- still the right priority?
3. Audit Out of Scope -- reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-22 after Phase 01 completion*
