---
phase: 4
slug: visual-polish
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 4 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None detected -- zero test infrastructure |
| **Config file** | none -- Wave 0 installs |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + visual inspection of affected pages
- **Before `/gsd:verify-work`:** Full build must be green + visual review of all 7 pages
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 04-01-01 | 01 | 1 | VISL-05 | build | `npm run build` | Yes | ⬜ pending |
| 04-01-02 | 01 | 1 | VISL-06 | build | `npm run build` | Yes | ⬜ pending |
| 04-02-01 | 02 | 1 | DFIX-01 | manual-only | Visual inspection | N/A | ⬜ pending |
| 04-02-02 | 02 | 1 | DFIX-07 | unit-candidate | Could test threshold logic | No | ⬜ pending |
| 04-03-01 | 03 | 2 | BFIX-08 | unit-candidate | Could test `groupByDay` | No | ⬜ pending |
| 04-04-01 | 04 | 2 | CFIX-09 | manual-only | Visual inspection | N/A | ⬜ pending |
| 04-05-01 | 05 | 3 | AFIX-05 | unit-candidate | Could test `useDebounce` | No | ⬜ pending |
| All | All | All | All | build | `npm run build` | Yes | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements. No test framework installation needed for Phase 4 (visual polish). `npm run build` is the primary automated gate. Utility function tests (groupByDay, getProjectColor, useDebounce) deferred to future phase when test framework is established.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Priority badges use correct colors | DFIX-01 | Visual CSS output | Inspect Dashboard -- high=red, medium=amber, low=green |
| Progress bars reflect health | DFIX-02 | Visual CSS output | Check overdue items trigger amber/red bars |
| Brand icons render correctly | SFIX-01, STFIX-01 | Visual rendering | All 12 Social Media + 5 Settings icons visible |
| Calendar shows dates on every cell | CFIX-01 | Layout structure | Content Pipeline month view has 28-31 date cells |
| Activity log grouped by day | AFIX-01 | DOM structure | Sticky day headers with grouped entries |
| Feedback log renders markdown | STFIX-08 | Content rendering | Bold/italic/links render, raw markdown hidden |
| Inline styles removed | D-12 | Code inspection | No `style={{}}` in touched files |
| Status badges consistent | CFIX-09, VISL-07 | Visual consistency | Same pill style across all pages |

*Visual polish phases are inherently manual-verification-heavy.*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
