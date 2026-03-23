---
created: 2026-03-23T00:31:00.000Z
title: Honest design feedback protocol for UI reviews
area: ui
files:
  - .planning/feedback/PHASE-04-FIXES-SPEC.md
  - .planning/ROADMAP.md
---

## Problem

AI-assisted UI reviews tend toward rubber-stamping: "looks good", "nice work", "the implementation matches the spec." This is useless. Lucas needs direct, honest feedback that identifies what works, what does not, and what would be more effective. Every review step in the GSD workflow (verify-work, ui-review, phase completion) must apply this protocol.

The 150 feedback items Lucas captured on 2026-03-22 are themselves an example of what honest feedback looks like: specific, opinionated, design-literate, and grounded in how the product actually feels to use. That standard must be matched in every review.

## Solution

Apply this protocol during all UI review and verify-work steps:

1. **What is good:** Name specific elements that work well and why (not generic praise)
2. **What is bad:** Name specific elements that fail the quality bar -- spacing, animation, interaction, visual weight, information density. Be direct.
3. **What would be more effective:** Propose concrete alternatives with design rationale. Reference the feedback specs and reference apps (Linear, Superhuman, Things 3, Stripe).
4. **What helps Lucas execute faster:** Identify friction in the interface that slows decision-making or adds unnecessary clicks/scrolling.
5. **No rubber-stamping:** If something passes review, state exactly which quality criteria it satisfies. "Looks good" is not a review.

This applies to: `/gsd:verify-work`, `/gsd:ui-review`, phase completion checks, and any ad-hoc UI feedback during execution.
