# Forge Console v2 — GSD Build Launch

## What's in this folder

- **idea.md** — Complete product requirements document. 7 pages, Supabase schema, design system, quality gates. This is the input file for GSD.

## How to start the build

### Step 1: Create the project directory
```bash
mkdir -p ~/Forge/Projects/forge-console-v2
cp idea.md ~/Forge/Projects/forge-console-v2/
cd ~/Forge/Projects/forge-console-v2
```

### Step 2: Open Claude Code
```bash
code .
```

Start a Claude Code session in this directory.

### Step 3: Run GSD new-project
```
/gsd:new-project --auto @idea.md
```

GSD will:
1. Read the entire idea.md
2. Research the stack and dependencies
3. Write requirements
4. Create a full phase-by-phase roadmap
5. Begin execution

### Step 4: Let GSD work

GSD in yolo mode will execute phases autonomously. Between phases, it will:
- Run npm run build to verify zero errors
- Update progress tracking
- Compact context if needed

### Step 5: Review at each phase gate

If you want to review between phases instead of full auto:
```
/gsd:discuss-phase [N]
```
to talk through the next phase before it executes.

To check progress at any time:
```
/gsd:progress
```

### Step 6: If the session stops or context gets heavy
```
/gsd:resume-work
```
Picks up exactly where it left off.

## Timeline

- **Day 1:** Phases 1-3 (Foundation, Dashboard, Projects)
- **Day 2:** Phases 4-6 (Brain Dump, Content Pipeline, Social/Activity/Settings)
- **Day 3:** Phases 7-8 (Polish + Deploy)

Each day is roughly 8-12 hours of Claude Code build time.

## Key decisions already made

- Vite + React + TypeScript (NOT Next.js)
- Light mode primary, Apple-inspired design
- Supabase for ALL data
- Claude API (Sonnet) for brain dump parsing
- 7 nav items: Dashboard, Projects, Brain Dump, Pipeline, Social, Activity, Settings
- 3 projects: Ridgeline, CLARITY, Forge (no Atlas)
- Full project sub-pages with shared template
- Content pipeline with 4 view modes
- No em dashes anywhere
