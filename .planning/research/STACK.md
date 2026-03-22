# Technology Stack

**Project:** Forge Console v2 -- Quality Redesign
**Researched:** 2026-03-22

## Current State Assessment

The project already has 90% of the shadcn/ui foundation in place:
- `cn()` utility in `src/lib/utils.ts` (clsx + tailwind-merge)
- `@/` path alias configured in tsconfig.app.json and vite.config.ts
- 11 Radix UI primitives installed (dialog, checkbox, dropdown-menu, label, progress, select, separator, slot, switch, tabs, tooltip)
- class-variance-authority installed
- Tailwind CSS 3.4.19 with custom design tokens in CSS variables
- Custom component classes in globals.css (card, btn-primary, btn-ghost, badge, input, skeleton)

What's missing: `components.json` config file and shadcn-generated component files in `src/components/ui/`.

## Recommended Stack Additions

### shadcn/ui Adoption

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| shadcn CLI | v4 (latest) | Component scaffolding | March 2026 release. Auto-detects Tailwind v3, generates components compatible with existing setup. No migration to Tailwind v4 required. | HIGH |
| tailwindcss-animate | 1.0.7 | Animation utilities for shadcn components | Required dependency for shadcn/ui on Tailwind v3. On Tailwind v4 this becomes tw-animate-css, but stay on v3 for now. | HIGH |

**Installation approach:** Run `npx shadcn@latest init` in the existing project. The CLI v4 auto-detects Tailwind v3 and configures accordingly. Then add components incrementally with `npx shadcn@latest add [component]`.

**Critical detail:** Do NOT migrate to Tailwind CSS v4. shadcn/ui supports both v3 and v4. Tailwind v4 is a major rewrite (CSS-first config, Oxide engine, OKLCH colors) that would require reworking the entire design token system in globals.css. The project's CSS variable approach works perfectly with Tailwind v3. Migrate to v4 in a future milestone if desired.

#### shadcn Components to Add

| Component | Replaces | Why |
|-----------|----------|-----|
| Button | `.btn-primary`, `.btn-ghost` CSS classes | Typed variants via CVA, consistent API, accessible focus states |
| Card | `.card` CSS class | Composable Card/CardHeader/CardContent/CardFooter, typed props |
| Badge | Custom `Badge.tsx` | Multiple variants (default, secondary, destructive, outline) |
| Input | `.input` CSS class | Accessible label association, consistent styling |
| Textarea | None (new) | Needed for brain dump capture, mobile capture |
| Table | None (new) | Podcast guest tracker, activity log, content pipeline list view |
| Tabs | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-tabs |
| Dialog | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-dialog |
| Select | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-select |
| DropdownMenu | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-dropdown-menu |
| Tooltip | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-tooltip |
| Checkbox | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-checkbox |
| Switch | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-switch |
| Progress | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-progress |
| Separator | Direct Radix usage | Pre-styled wrapper around existing @radix-ui/react-separator |
| Skeleton | Custom `SkeletonBlock.tsx` | Standardized skeleton component |
| ScrollArea | New (adds @radix-ui/react-scroll-area) | Custom scrollbar for sidebar and content areas, replaces webkit scrollbar CSS |
| Sheet | New (uses @radix-ui/react-dialog) | Mobile slide-over panels for capture experience |
| Calendar | New (adds react-day-picker) | Content calendar view on Social Media page |
| Popover | New (adds @radix-ui/react-popover) | Date pickers, quick actions |
| Command | New (adds cmdk) | Command palette for quick navigation (differentiator) |
| Sonner | New (adds sonner) | Toast notifications for actions (approve/reject, save, etc.) |

### Mobile Capture (PWA)

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| vite-plugin-pwa | 0.21+ | PWA manifest + service worker generation | Zero-config PWA for Vite. Generates manifest.json and service worker using Workbox. Makes the app installable on iPhone home screen. | HIGH |
| workbox-precaching | (bundled) | Offline asset caching | Included via vite-plugin-pwa. Pre-caches static assets so the capture screen loads instantly even offline. | HIGH |

**Why PWA over native:** The mobile experience is a single-purpose capture tool (type a thought, close, process later). A PWA installed to the home screen with a custom icon gives native-app feel without App Store overhead. Service worker ensures instant load. No React Native, no Capacitor -- overkill for a text input and submit button.

**iOS Safari considerations:**
- Add `<meta name="apple-mobile-web-app-capable" content="yes">` for fullscreen mode
- Add `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">` for edge-to-edge
- Handle virtual keyboard with `visualViewport` API (Safari does not resize layout on keyboard open)
- Use `env(safe-area-inset-bottom)` for bottom padding on notched devices

### Visual Polish Libraries

| Technology | Version | Purpose | Why | Confidence |
|------------|---------|---------|-----|------------|
| @fontsource/inter | 5.x | Self-hosted Inter font | Eliminates Google Fonts render-blocking request. Faster LCP. Tree-shakeable -- import only weights 400, 500, 600, 700. | MEDIUM |

**Why NOT additional animation libraries:** The project already has Framer Motion 12.38.0 which handles all animation needs (page transitions, card animations, hover effects, layout animations). Adding Magic UI, Aceternity UI, or similar libraries would create dependency bloat for effects achievable with Framer Motion's `motion.div`, `AnimatePresence`, and `layoutId`.

### Supporting Libraries

| Library | Version | Purpose | When to Use | Confidence |
|---------|---------|---------|-------------|------------|
| sonner | 1.7+ | Toast notifications | Action feedback (approve, reject, save, dispatch agent) | HIGH |
| cmdk | 1.0+ | Command palette | Quick navigation, brain dump from anywhere (Cmd+K) | MEDIUM |
| react-day-picker | 9.x | Date picker / calendar | Content calendar, scheduling dates | HIGH |
| react-textarea-autosize | 8.5+ | Auto-growing textarea | Brain dump input, mobile capture textarea | MEDIUM |
| vaul | 1.1+ | Drawer/bottom sheet | Mobile capture slide-up panel, mobile navigation | MEDIUM |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Component library | shadcn/ui (copy-paste) | Radix Themes, Mantine, Chakra | shadcn/ui is specified in project requirements. Copy-paste model means full control over styling. Already have Radix primitives installed. |
| Tailwind version | Stay on v3 (3.4.19) | Migrate to v4 | v4 requires full config rewrite (CSS-first), OKLCH color migration, new animate package. Zero benefit for this milestone. Do it later. |
| Mobile approach | PWA (vite-plugin-pwa) | Capacitor, React Native, Expo | Single text input + submit. PWA is installable, works offline, no app store. Native frameworks are massive overkill. |
| Toast library | sonner | react-hot-toast, react-toastify | sonner is the shadcn/ui default toast. Pre-styled, accessible, tiny bundle. |
| Animation | Framer Motion (existing) | Motion One, GSAP, CSS animations | Already installed and used throughout. Best React animation DX. No reason to change. |
| Icons | Lucide React (existing) | Heroicons, Phosphor | Already installed. shadcn/ui defaults to Lucide. Consistent ecosystem. |
| Date library | date-fns (existing) | dayjs, luxon, Temporal | Already installed. Tree-shakeable. No reason to change. |
| CSS approach | Tailwind + CSS variables (existing) | CSS Modules, Styled Components, Emotion | Tailwind is the shadcn/ui requirement. CSS variables already provide the design token layer. |
| Font loading | @fontsource/inter | Google Fonts CDN (current) | Self-hosted eliminates external dependency, faster load, works offline for PWA |
| Command palette | cmdk | kbar, ninja-keys | cmdk is the shadcn/ui default. Maintained by Rauno (ex-Vercel). Tiny, composable. |
| Bottom sheet (mobile) | vaul | react-spring-bottom-sheet | vaul is from the shadcn ecosystem (same author ecosystem), works with Radix Dialog primitives, mobile-optimized gesture handling |

## What NOT to Add

| Technology | Why Not |
|------------|---------|
| Tailwind CSS v4 | Major migration with zero value for this milestone. CSS-first config requires rewriting entire design token system. |
| Next.js | Project constraint: Vite SPA. No SSR needed for single-user local app. |
| Zustand / Jotai / Redux | React Query handles server state. Remaining client state (sidebar open, active filters) is simple enough for React context or local state. |
| React Hook Form + Zod | Only forms are Settings and Brain Dump input. Not enough form complexity to justify the dependency. Use controlled components. |
| Storybook | Single developer, single user app. Component documentation overhead is not justified. |
| Testing libraries (Vitest, Playwright) | Not in scope for this milestone. Add when the app stabilizes. |
| Capacitor / React Native | Mobile capture is a single textarea. PWA handles this perfectly. |
| tw-animate-css | This is the Tailwind v4 replacement for tailwindcss-animate. Only needed if migrating to Tailwind v4. |
| @tailwindcss/forms | Already installed but shadcn/ui provides its own form styling. Can be removed after shadcn adoption. |

## Installation

```bash
# shadcn/ui initialization (run interactively, select defaults)
npx shadcn@latest init

# Add core shadcn components
npx shadcn@latest add button card badge input textarea table tabs dialog select dropdown-menu tooltip checkbox switch progress separator skeleton scroll-area sheet calendar popover command sonner

# PWA support
npm install -D vite-plugin-pwa

# Supporting libraries
npm install sonner cmdk react-day-picker react-textarea-autosize vaul

# Self-hosted font (replace Google Fonts CDN)
npm install @fontsource/inter
```

### Post-Install Configuration

**vite.config.ts** -- Add PWA plugin:
```typescript
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Forge Console',
        short_name: 'Forge',
        theme_color: '#1B3A52',
        background_color: '#f8f9fb',
        display: 'standalone',
        icons: [/* 192x192 and 512x512 PNG icons */]
      }
    })
  ],
  // ...existing config
})
```

**globals.css** -- After shadcn init, merge shadcn's CSS variables with existing custom variables. The existing `:root` block already defines the design tokens; shadcn will add its own (--background, --foreground, --primary, etc.). Map shadcn's variables to the existing design token values so shadcn components use the Forge Console palette.

**Font migration** -- Replace Google Fonts `@import` in globals.css with:
```typescript
// In main.tsx or App.tsx
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
```

## Key Integration Notes

### shadcn/ui + Existing Design System

The biggest integration task is mapping shadcn's default CSS variables to the existing Forge Console design tokens. shadcn uses variables like `--primary`, `--secondary`, `--accent`, `--card`, `--border`, etc. These must be set to match:

| shadcn Variable | Forge Console Value |
|----------------|---------------------|
| `--background` | `--bg-root` (#f8f9fb) |
| `--foreground` | `--text-primary` (#111318) |
| `--card` | `--bg-surface` (#ffffff) |
| `--primary` | `--accent-coral` (#C75B3F) |
| `--primary-foreground` | white |
| `--secondary` | `--bg-elevated` (#f1f3f7) |
| `--muted` | `--bg-elevated` (#f1f3f7) |
| `--muted-foreground` | `--text-secondary` (#5f6878) |
| `--accent` | `--accent-navy` (#1B3A52) |
| `--border` | `--border-subtle` (rgba(0,0,0,0.06)) |
| `--ring` | `--accent-coral` (#C75B3F) |
| `--radius` | 0.625rem (10px, matching --radius-md) |

### Migration Strategy

Replace custom CSS component classes with shadcn components incrementally:
1. Add shadcn components (they coexist with existing CSS classes)
2. Migrate one page at a time, replacing `.card` with `<Card>`, `.btn-primary` with `<Button>`, etc.
3. After all pages are migrated, remove unused CSS classes from globals.css
4. Keep custom typography classes (.text-page-title, .text-section-header, etc.) -- shadcn does not provide these

### Mobile Capture Route

Add a `/capture` route that:
- Detects mobile viewport and renders a purpose-built capture UI
- Uses `<Sheet>` or `<vaul.Drawer>` for the input panel
- Auto-focuses textarea on mount
- Submits to the same brain_dump_entries Supabase table
- Shows success toast via sonner
- Minimal UI: just the textarea, a submit button, and a close/back action

## Sources

- [shadcn/ui Vite Installation](https://ui.shadcn.com/docs/installation/vite) -- Official installation docs
- [shadcn CLI v4 Changelog](https://ui.shadcn.com/docs/changelog/2026-03-cli-v4) -- March 2026 release, confirmed Tailwind v3 support
- [shadcn/ui Tailwind v4 docs](https://ui.shadcn.com/docs/tailwind-v4) -- Confirms v3 and v4 both supported
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/guide/) -- Official PWA plugin docs
- [MDN: Making PWAs Installable](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable) -- PWA manifest requirements
