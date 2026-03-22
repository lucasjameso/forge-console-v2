---
phase: 2
slug: global-design-standards
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-22
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | None (no Jest/Vitest detected) |
| **Config file** | none -- visual requirements, build check only |
| **Quick run command** | `npm run build` |
| **Full suite command** | `npm run build` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run build`
- **After every plan wave:** Run `npm run build` + visual spot-check
- **Before `/gsd:verify-work`:** Full build must be green + visual audit of all 8 pages
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | VISL-01,02,03,04 | build + grep | `npm run build` | N/A | ⬜ pending |
| 02-01-02 | 01 | 1 | VISL-02 | build + grep | `npm run build && grep -rn "rounded-xl" src/components/ui/card.tsx` | N/A | ⬜ pending |
| 02-02-01 | 02 | 1 | VISL-03 | grep audit | `grep -rn "fontSize" src/pages/ src/components/ --include="*.tsx"` | N/A | ⬜ pending |
| 02-02-02 | 02 | 1 | VISL-04 | build | `npm run build` | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure covers build validation. No test framework needed for visual design requirements.

- [ ] Grep audit script for leftover inline fontSize: `grep -rn "fontSize" src/pages/ src/components/ --include="*.tsx" | grep -v node_modules`
- [ ] Grep audit script for leftover inline card classes: `grep -rn "rounded-lg border bg-card p-6 shadow-card" src/ --include="*.tsx"`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sidebar hover/active visual states | VISL-01 | Visual interaction, no automated visual regression tool | Hover each nav item: verify bg-elevated + text-primary shift. Click: verify coral left border + elevated bg. |
| Card padding/radius consistency | VISL-02 | Visual spacing cannot be verified by grep alone | Open each page, inspect cards: 24px padding, 14px radius, 1px border. Clickable cards show hover shadow. |
| Typography hierarchy visual check | VISL-03 | Font rendering requires browser | Spot-check each page: 28px titles, 18px headers, 15px card titles, 14px body, 13px body-sm, 12px caption, 11px overline |
| Section/card gap uniformity | VISL-04 | Spacing requires visual inspection | Check all 8 pages: section gaps 32-40px, card gaps 20-24px |
| Warm palette appearance | D-18/D-19 | Color perception requires visual check | Compare bg-root warm cream vs old cool gray. Sidebar should feel warm. |
| Mobile sidebar Sheet behavior | D-04 | Interaction testing | Resize to mobile, open sidebar: verify Sheet overlay, focus trap, ESC close |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
