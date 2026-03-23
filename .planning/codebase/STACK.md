# Technology Stack

**Analysis Date:** 2026-03-22

## Languages

**Primary:**
- TypeScript 5.9.3 - All source files in `src/` with strict mode enabled
- TSX - React component files (`src/components/`, `src/pages/`)

**Secondary:**
- JavaScript - Configuration files only (`vite.config.ts` is TS, `postcss.config.js` is JS)
- CSS - Tailwind utility classes + CSS custom properties in `src/styles/globals.css`

## Runtime

**Environment:**
- Node.js v25.8.1 (development); browser SPA in production (no Node runtime needed)

**Package Manager:**
- npm 11.11.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.4 - UI library with StrictMode enabled (`src/main.tsx`)
- React Router DOM 7.13.1 - Client-side routing; 8 routes defined in `src/App.tsx`
- TanStack React Query 5.94.5 - All server state management; QueryClient config in `src/lib/queryClient.ts`
- Framer Motion 12.38.0 - All animations and page transitions; `AnimatePresence` wraps route changes

**UI Components:**
- shadcn/ui (new-york style) - Component library scaffolded via `components.json`; CSS variables pattern
- Radix UI primitives - Checkbox, Dialog, DropdownMenu, Label, Progress, ScrollArea, Select, Separator, Slot, Switch, Tabs, Tooltip
- Tailwind CSS 3.4.19 - Utility-first styling; custom theme in `tailwind.config.ts`
- tailwindcss-animate 1.0.7 - Animation utilities plugin
- @tailwindcss/forms 0.5.11 - Form element styling
- Lucide React 0.577.0 - Icon library
- sonner 2.0.7 - Toast notifications; `<Toaster>` mounted in `src/App.tsx`
- next-themes 0.4.6 - Theme management (installed, integration extent not yet confirmed)
- react-error-boundary 6.1.1 - `<ErrorBoundary>` wraps entire app in `src/App.tsx`

**Build/Dev:**
- Vite 8.0.1 - Build tool and dev server; config at `vite.config.ts`
- @vitejs/plugin-react 6.0.1 - React Fast Refresh and JSX transform
- TypeScript ESLint 8.57.0 - TypeScript-aware linting

## Key Dependencies

**Critical:**
- `@supabase/supabase-js` 2.99.3 - Primary database client; initialized in `src/lib/supabase.ts`
- `@tanstack/react-query` 5.94.5 - All data fetching and caching; single QueryClient instance
- `framer-motion` 12.38.0 - Required for all animations per CLAUDE.md convention

**Utilities:**
- `date-fns` 4.1.0 - Date parsing and formatting
- `class-variance-authority` 0.7.1 - Variant composition for UI components
- `clsx` 2.1.1 + `tailwind-merge` 3.5.0 - Combined in `cn()` utility at `src/lib/utils.ts`
- `@fontsource/inter` 5.2.8 - Self-hosted Inter font (400/500/600/700 weights loaded in `src/main.tsx`)

**Dev:**
- `@tanstack/react-query-devtools` 5.94.5 - Query debugging in development

## Configuration

**Environment:**
- `.env.local` - Present (not committed); all env vars require `VITE_` prefix for browser access
- Required vars: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_ANTHROPIC_API_KEY`
- Optional vars: `VITE_ACCESS_CODE` (access gate), `VITE_CF_ACCOUNT_ID`, `VITE_SLACK_WEBHOOK_URL`, `VITE_N8N_URL`, `VITE_N8N_API_KEY`
- App functions with mock data when `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` are absent

**TypeScript:**
- `tsconfig.json` - Root config referencing `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` - ES2023 target, strict mode, `noUnusedLocals`, `noUnusedParameters`, `erasableSyntaxOnly`
- Path alias: `@/*` maps to `./src/*`

**Build:**
- `vite.config.ts` - `@vitejs/plugin-react` plugin, `@` path alias pointing to `./src`
- `tailwind.config.ts` - Custom coral/navy brand colors, CSS variable-based color system, custom `forge-card` shadows
- `postcss.config.js` - Tailwind CSS + Autoprefixer
- `eslint.config.js` - Flat config; TypeScript ESLint + React Hooks + React Refresh plugins
- `components.json` - shadcn/ui config (new-york style, CSS variables, lucide icons)

## Build Commands

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build (TypeScript check + bundle)
npm run lint       # ESLint check
npm run preview    # Preview production build locally
```

## Platform Requirements

**Development:**
- Node.js 20+ (tested v25.8.1)
- npm 10+ (tested v11.11.0)
- `.env.local` with Supabase and Anthropic credentials

**Production:**
- Static hosting only (Vite outputs to `dist/`)
- Deployed to Cloudflare Pages via Wrangler
- No Node.js runtime required
- Browser with ES2023 support

---

*Stack analysis: 2026-03-22*
