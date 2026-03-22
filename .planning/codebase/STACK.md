# Technology Stack

**Analysis Date:** 2026-03-22

## Languages

**Primary:**
- TypeScript 5.9.3 - Full codebase with strict mode enabled
- TSX/JSX - React component files with strict null checks

**Secondary:**
- JavaScript - Configuration files (vite, eslint, postcss)
- CSS - Tailwind CSS utility-first styling

## Runtime

**Environment:**
- Node.js v25.8.1 (development)
- Browser-based execution (React SPA)

**Package Manager:**
- npm 11.11.0
- Lockfile: `package-lock.json` present

## Frameworks

**Core:**
- React 19.2.4 - UI library and component framework
- React Router DOM 7.13.1 - Client-side routing (8 routes)
- Vite 8.0.1 - Build tool and dev server

**State Management & Data:**
- TanStack React Query 5.94.5 - Server state management with query caching
- TanStack React Query DevTools 5.94.5 - Development debugging

**UI Components:**
- Radix UI (multiple packages) - Accessible component primitives
  - @radix-ui/react-dialog, checkbox, dropdown-menu, label, progress, select, separator, slot, switch, tabs, tooltip
- Tailwind CSS 3.4.19 - Utility-first CSS framework
- Tailwind Forms 0.5.11 - Form component styling utilities
- Framer Motion 12.38.0 - Animation library for transitions

**Utilities:**
- Lucide React 0.577.0 - Icon library
- Date-fns 4.1.0 - Date parsing and formatting
- Class Variance Authority 0.7.1 - CSS-in-JS variant composition
- clsx 2.1.1 - Conditional CSS class names
- Tailwind Merge 3.5.0 - Tailwind class conflict resolution

**Testing:**
- No test framework detected (no Jest, Vitest, etc.)

**Build/Dev:**
- @vitejs/plugin-react 6.0.1 - React optimization for Vite
- TypeScript 5.9.3 - Type checking
- ESLint 9.39.4 - Code linting
- TypeScript ESLint 8.57.0 - TypeScript linting rules
- ESLint Plugin React Hooks 7.0.1 - React hooks best practices
- ESLint Plugin React Refresh 0.5.2 - React Fast Refresh support
- Autoprefixer 10.4.27 - CSS vendor prefix generation
- PostCSS 8.5.8 - CSS processing pipeline

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.99.3 - Database and backend-as-a-service client
- @anthropic-ai/sdk 0.80.0 - Anthropic Claude API client (installed but used via direct HTTP)

**Infrastructure:**
- @tanstack/react-query 5.94.5 - Query caching, state synchronization, automatic refetching
- framer-motion 12.38.0 - Page transitions and UI animations
- lucide-react 0.577.0 - 577 SVG icons

## Configuration

**Environment:**
- `.env.local` - Local environment configuration (present, not committed)
- Vite environment variables with `VITE_` prefix used for browser access:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
  - `VITE_ANTHROPIC_API_KEY`

**Build:**
- `vite.config.ts` - Vite configuration with React plugin and `@` path alias
- `tsconfig.json` - References `tsconfig.app.json` and `tsconfig.node.json`
- `tsconfig.app.json` - Strict TypeScript settings (ES2023 target, strict mode enabled)
- `tailwind.config.ts` - Custom theme with coral/navy colors, custom radius, shadows
- `postcss.config.js` - Tailwind CSS and Autoprefixer plugins
- `eslint.config.js` - Flat config with recommended rules, TypeScript ESLint, React Hooks

**Package Scripts:**
```
npm run dev      # Start Vite dev server (hot reload)
npm run build    # TypeScript build check + Vite production build
npm run lint     # Run ESLint on all files
npm run preview  # Preview production build locally
```

## Platform Requirements

**Development:**
- Node.js 20+ (tested with v25.8.1)
- npm 10+ (tested with v11.11.0)
- Browser with ES2023 support
- `.env.local` file with Supabase and Anthropic API credentials

**Production:**
- Static hosting (Vite outputs to `dist/`)
- Cloudflare, GitHub Pages, Vercel, or similar (no Node runtime needed)
- Browser with ES2023 support
- Access to external APIs: Supabase (database), Anthropic Claude API (brain dump parsing)

---

*Stack analysis: 2026-03-22*
