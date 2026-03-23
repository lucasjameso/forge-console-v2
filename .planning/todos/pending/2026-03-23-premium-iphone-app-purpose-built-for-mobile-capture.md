---
created: 2026-03-23T00:42:00.000Z
title: Premium iPhone app purpose-built for mobile capture
area: general
files:
  - .planning/feedback/PHASE-09-SETTINGS-MOBILE-DEPLOY-SPEC.md
  - .planning/ROADMAP.md
---

## Problem

Phase 9 includes a /capture route as a mobile-optimized web page. That is the minimum viable mobile experience -- a single textarea with a submit button. But a responsive web page on an iPhone is fundamentally limited: no offline support, no push notifications, no haptic feedback, no native gestures, no app icon on the home screen that feels like a real app, and browser chrome eats precious screen space.

Lucas captures thoughts while walking, driving, in meetings, and on flights. The mobile experience must be as fast as opening Apple Notes -- one tap to open, type, submit, done. A web page loaded through Safari with a URL bar cannot match that speed. And on a flight with no connectivity, the web capture route is useless.

This is not about making the desktop app responsive. It is about building a separate, purpose-built iPhone experience that does 3 things extremely well: capture text, log activity, and show what needs attention.

## Solution

1. **Technology:** React Native or Swift/SwiftUI native app. React Native preferred for code sharing with the web codebase (shared types, shared Supabase client, shared API patterns). Alternative: Progressive Web App (PWA) with service worker for offline -- lower effort but worse native feel.

2. **Core screens (3 total):**
   - **Capture:** Large textarea, project selector pills, voice dictation button, submit. Optimistic save. Offline queue with sync indicator.
   - **Quick Log:** One-tap activity logging. Pre-set buttons: "Started work on [project]", "Finished [task]", "Brain dump session", custom note. Each tap creates an activity_log entry.
   - **Attention:** Scrollable list of open action items across all projects. Swipe right to resolve, swipe left to snooze. Badge count on app icon for unresolved items.

3. **Design principles:**
   - No navigation bars, no hamburger menus, no settings screens. Three tabs at the bottom, that is it.
   - Large touch targets (minimum 48px). Thumb-friendly layout.
   - Haptic feedback on submit (success vibration), on resolve (gentle tap), on error (double tap).
   - Dark mode native (follows iOS system preference).
   - Launch to capture screen by default. Zero taps from app open to typing.

4. **Offline capability:**
   - Service worker (PWA) or native SQLite queue (React Native/Swift).
   - All captures, logs, and resolves queue locally when offline.
   - Sync indicator: green dot when connected, amber when queued, red when sync failed.
   - On reconnect: sync all queued items, show count: "Synced 4 items."

5. **Million-dollar feel:**
   - Custom app icon: coral F on navy background (matching favicon).
   - Smooth spring animations on every interaction (matching Framer Motion feel from desktop).
   - Typography: SF Pro (iOS native) matching the Inter hierarchy from desktop.
   - No loading spinners -- skeleton shimmer matching desktop pattern.

6. **Scope:** Post-v1 milestone. Phase 9 delivers the /capture web route as the bridge. The native app is a separate build that replaces /capture when ready. The Supabase backend and data model are shared -- no API changes needed.
