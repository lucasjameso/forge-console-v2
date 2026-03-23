---
phase: 6
slug: content-pipeline-depth
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-23
---

# Phase 6 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected -- no test framework installed |
| **Config file** | none -- see Wave 0 |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + manual visual verification
- **Before `/gsd:verify-work`:** Full build must be green + visual QA
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 06-01-01 | 01 | 1 | CSUG-01 | manual-only | `npm run build` | N/A | pending |
| 06-01-02 | 01 | 1 | CSUG-02 | manual-only | `npm run build` | N/A | pending |
| 06-01-03 | 01 | 1 | CSUG-03 | manual-only | `npm run build` | N/A | pending |
| 06-01-04 | 01 | 1 | CSUG-04 | manual-only | `npm run build` | N/A | pending |
| 06-01-05 | 01 | 1 | CSUG-05 | manual-only | `npm run build` | N/A | pending |
| 06-01-06 | 01 | 1 | CSUG-06 | manual-only | `npm run build` | N/A | pending |
| 06-01-07 | 01 | 2 | CSUG-07 | manual-only | `npm run build` | N/A | pending |
| 06-01-08 | 01 | 2 | CSUG-08 | manual-only | `npm run build` | N/A | pending |
| 06-01-09 | 01 | 2 | CSUG-09 | manual-only | `npm run build` | N/A | pending |
| 06-01-10 | 01 | 2 | CSUG-10 | manual-only | `npm run build` | N/A | pending |
| 06-01-11 | 01 | 2 | CSUG-11 | manual-only | `npm run build` | N/A | pending |
| 06-01-12 | 01 | 2 | CSUG-12 | manual-only | `npm run build` | N/A | pending |

*Status: pending / green / red / flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework needed -- all Phase 6 behaviors are visual/interactive and verified via `npm run build` (TypeScript compilation) + manual browser QA.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Calendar nav forward/back/today | CSUG-01 | Visual interaction with slide animations | Click arrows, verify month changes with animation, click Today button |
| Drag card between days | CSUG-02 | Drag-drop requires browser DOM events | Drag content item to different day, verify Supabase update + toast |
| Carousel slide thumbnails | CSUG-03 | Visual rendering | Open carousel view, verify thumbnail grid renders |
| Caption edit + AI refinement | CSUG-04 | Requires Claude API + visual | Edit caption, verify char count, click Refine with AI |
| Bulk select + action bar | CSUG-05 | UI interaction pattern | Select multiple items, verify floating action bar appears |
| Performance metrics display | CSUG-06 | Visual + Supabase data | Check analytics strip renders with mock/real data |
| Template CRUD + generation | CSUG-07 | Supabase mutations + visual | Create/edit/delete template, verify persistence |
| Multi-platform tabs | CSUG-08 | Visual component | Switch between platform tabs |
| Webhook fires on approve/reject | CSUG-09 | Requires n8n endpoint | Approve/reject item, check network tab for webhook POST |
| Time picker scaffold | CSUG-10 | Visual component | Open time picker, verify UI renders |
| Revision diff + revert | CSUG-11 | Supabase + diff display | Edit content, view revision history, revert |
| Analytics strip renders | CSUG-12 | Computed visual display | Verify monthly summary, cadence indicator, gap alerts |

---

## Validation Sign-Off

- [ ] All tasks have automated verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
