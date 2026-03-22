# Domain Pitfalls

**Domain:** shadcn/ui adoption + visual polish + mobile capture in existing React SPA
**Researched:** 2026-03-22

## Critical Pitfalls

Mistakes that cause rewrites or major issues.

### Pitfall 1: shadcn Init Overwrites Existing CSS Variables
**What goes wrong:** Running `npx shadcn@latest init` generates a new globals.css with shadcn's default CSS variables (--background, --foreground, --primary, etc.) that can overwrite or conflict with the existing custom CSS variables in `src/styles/globals.css`.
**Why it happens:** shadcn init assumes it owns the CSS file. The project already has a mature design token system.
**Consequences:** Existing design tokens get wiped. All custom component classes disappear. Visual regression across the entire app.
**Prevention:** Before running `shadcn init`, back up globals.css. After init, manually merge shadcn's variables INTO the existing file. Map shadcn variables to existing Forge Console token values. Do not let shadcn overwrite the file.
**Detection:** If the app looks completely different after shadcn init (wrong colors, wrong spacing), the CSS was overwritten.

### Pitfall 2: Tailwind v4 Accidental Migration
**What goes wrong:** shadcn CLI v4 can scaffold for Tailwind v4 if it misdetects the version, or a developer runs `npx tailwindcss@latest` which installs v4.
**Why it happens:** Tailwind v4 is the latest version. Package managers default to latest. shadcn CLI v4 supports both v3 and v4.
**Consequences:** Tailwind v4 uses CSS-first config (no tailwind.config.ts), OKLCH colors, and different animation approach (tw-animate-css instead of tailwindcss-animate). The entire build breaks.
**Prevention:** Pin `tailwindcss` to `^3.4.19` in package.json. When running shadcn init, verify it detects Tailwind v3. Do not run any Tailwind upgrade commands.
**Detection:** Build failure mentioning `@theme` directive, missing tailwind.config.ts, or OKLCH color format errors.

### Pitfall 3: Component Migration Leaves Orphaned CSS
**What goes wrong:** After migrating pages to use shadcn components, the old CSS classes (.btn-primary, .card, .badge, etc.) remain in globals.css but no longer match the shadcn component styling exactly. Some pages use old CSS, some use shadcn, creating visual inconsistency.
**Why it happens:** Incremental migration is done page-by-page. Easy to forget which pages still use old classes.
**Consequences:** Two visual systems coexist. Buttons look different on different pages. Cards have inconsistent padding.
**Prevention:** Migrate ALL instances of each component type at once (all buttons, then all cards, etc.) rather than page-by-page. After each component type migration, remove the old CSS class from globals.css.
**Detection:** Search codebase for old CSS class names. If any remain after migration, they need to be converted.

## Moderate Pitfalls

### Pitfall 4: iOS Safari Virtual Keyboard Viewport Issues
**What goes wrong:** On iOS Safari, opening the virtual keyboard does not resize the layout viewport. Fixed-position elements (like a bottom submit bar) get hidden behind the keyboard.
**Prevention:** Use the `visualViewport` API to detect keyboard presence. On `visualViewport.resize`, adjust the position of the input area. Use `env(safe-area-inset-bottom)` for padding. Test on actual iPhone, not just Chrome DevTools mobile emulator.

### Pitfall 5: PWA Cache Stale After Deploy
**What goes wrong:** After deploying a new version to Cloudflare Pages, the service worker serves the old cached version. Users see stale UI.
**Prevention:** Use `registerType: 'autoUpdate'` in vite-plugin-pwa config. This automatically updates the service worker when new content is detected. For the /capture route specifically, use a network-first strategy for the API calls (Supabase writes) and cache-first for static assets.

### Pitfall 6: shadcn Components Don't Match Design Spec
**What goes wrong:** shadcn components come with default styling (8px radius, specific padding, Zinc-based neutral colors). The Forge Console design spec uses 10px radius, 24px card padding, coral/navy accents.
**Prevention:** The customization happens at the CSS variable level, not by editing component files. Set `--radius: 0.625rem` (10px). Set `--primary` to coral. For padding, use className overrides: `<CardContent className="p-6">` (24px). Document these overrides in a style guide.

### Pitfall 7: Font Loading Flash (FOIT/FOUT)
**What goes wrong:** When migrating from Google Fonts CDN to @fontsource, the font may flash from system font to Inter on load.
**Prevention:** Import @fontsource in the entry point (main.tsx) before any component renders. Use `font-display: swap` (default in @fontsource). Keep the system-ui fallback in the font stack so the flash is minimal.

### Pitfall 8: React 19 + shadcn Component Compatibility
**What goes wrong:** Some shadcn components may reference React 18 APIs that behave differently in React 19 (e.g., ref forwarding, useId, Suspense behavior).
**Prevention:** The project is on React 19.2.4. shadcn CLI v4 (March 2026) generates React 19 compatible components. Ensure `npx shadcn@latest` is used (not an older cached version). If a component has issues, check the shadcn GitHub discussions.

## Minor Pitfalls

### Pitfall 9: Framer Motion Layout Animations + shadcn Dialog
**What goes wrong:** Framer Motion `layoutId` animations can conflict with Radix Dialog portal rendering (dialog content renders in a portal outside the React tree).
**Prevention:** Do not apply `layoutId` to elements that open dialogs. Use `AnimatePresence` with `mode="wait"` for dialog enter/exit animations instead.

### Pitfall 10: cmdk Command Palette + React Router Navigation
**What goes wrong:** Selecting a command palette item needs to navigate via React Router, not a page reload. Default cmdk examples use `window.location`.
**Prevention:** Use `useNavigate()` from React Router in the command palette's onSelect handler. Close the palette after navigation.

### Pitfall 11: Sonner Toast Z-Index vs Radix Dialog
**What goes wrong:** Toast notifications appear behind Radix Dialog/Sheet overlays because of z-index stacking.
**Prevention:** Configure Sonner's `<Toaster>` with a high z-index or ensure it's rendered after all Radix portals in the component tree.

## Phase-Specific Warnings

| Phase Topic | Likely Pitfall | Mitigation |
|-------------|---------------|------------|
| shadcn/ui init | CSS variable overwrite (Pitfall 1) | Back up globals.css, merge manually |
| shadcn/ui init | Tailwind v4 misdetection (Pitfall 2) | Pin tailwindcss to ^3.4.19 |
| Component migration | Orphaned CSS inconsistency (Pitfall 3) | Migrate by component type, not by page |
| Mobile capture | iOS keyboard (Pitfall 4) | visualViewport API, test on real iPhone |
| Deployment | Stale PWA cache (Pitfall 5) | autoUpdate service worker strategy |
| Visual polish | Components don't match spec (Pitfall 6) | CSS variable customization, className overrides |
| Font migration | Flash of unstyled text (Pitfall 7) | Import in main.tsx, font-display: swap |

## Sources

- iOS Safari keyboard behavior: https://medium.com/@krutilin.sergey.ks/fixing-the-safari-mobile-resizing-bug-a-developers-guide-6568f933cde0
- shadcn/ui Tailwind v4 migration: https://ui.shadcn.com/docs/tailwind-v4
- vite-plugin-pwa caching strategies: https://vite-pwa-org.netlify.app/guide/
- Framer Motion + portals: Framer Motion documentation on layout animations
