---
phase: 1
slug: component-foundation
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None -- no test framework installed (out of scope per project constraints) |
| **Config file** | none |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + visual spot check
- **Before `/gsd:verify-work`:** Full build must be green + all 5 success criteria manually verified
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | FOUN-01 | build + manual | `npm run build` + inspect CSS variables in DevTools | N/A | ⬜ pending |
| 01-01-02 | 01 | 1 | FOUN-01 | build | `npm run build` (shadcn components compile with tokens) | N/A | ⬜ pending |
| 01-02-01 | 02 | 1 | FOUN-02 | build + grep | `npm run build` + `grep -r 'btn-primary\|\.card\b\|\.badge-\|\.input-' src/` returns 0 | N/A | ⬜ pending |
| 01-03-01 | 03 | 2 | FOUN-03 | manual | Click each mutation action, verify toast appears | N/A | ⬜ pending |
| 01-04-01 | 04 | 2 | FOUN-04 | manual | Temporarily throw error in component, verify fallback UI renders | N/A | ⬜ pending |
| 01-05-01 | 05 | 1 | FOUN-05 | manual | Open app in browser, verify tab shows coral F on navy | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers all phase requirements. No test framework installation needed for Phase 1.

- `npm run build` serves as the automated validation gate (TypeScript strict mode catches type errors, unused variables, import issues)
- Visual validation is manual by design for this UI-focused foundation phase

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| shadcn CSS variables resolve to Forge Console token values | FOUN-01 | Visual fidelity requires human judgment (colors, spacing) | Open app, inspect elements in DevTools, verify CSS variables map correctly |
| Toast fires on every mutation action | FOUN-03 | Requires UI interaction (click buttons) | Trigger each mutation (save, create, delete, approve, reject), verify toast appears bottom-right, dismisses after 3s |
| Error boundary shows fallback UI | FOUN-04 | Requires simulated error injection | Temporarily add `throw new Error('test')` in a component, verify fallback renders with retry button |
| Favicon shows coral F on navy | FOUN-05 | Visual verification in browser tab | Open app, check browser tab icon at multiple sizes |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
