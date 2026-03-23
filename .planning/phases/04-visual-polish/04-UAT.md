---
status: complete
phase: 04-visual-polish
source: [04-01-SUMMARY.md, 04-02-SUMMARY.md, 04-03-SUMMARY.md, 04-04-SUMMARY.md, 04-05-SUMMARY.md, 04-06-SUMMARY.md]
started: 2026-03-22T22:00:00Z
updated: 2026-03-22T22:30:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

[testing complete]

## Tests

### 1. Dashboard Priority Badges and Health Progress Bars
expected: On the Dashboard, the Project Quick Glance cards show colored priority badges (red for high, amber for medium, green for low). Progress bars are color-coded by project health (green for healthy, amber for at-risk, red for behind).
result: issue
reported: "FAIL -- Multiple issues: 1. STAT TILE RESPONSIVENESS: The 5 stat tiles do not maintain equal sizing. The CLARITY Launch tile is a different size than the other four. When resized on large display (55 inch monitor) or compressed narrower, tiles scramble to inconsistent sizes instead of scaling uniformly. Need CSS grid with equal fr columns, not flexbox. 2. BORDER RADIUS TOO AGGRESSIVE: All cards, tiles, badges, and containers have too much corner rounding. Reduce border-radius globally to approximately half current value. Clean and modern, not bubbly. 3. ACTION ITEMS NOT INTERACTIVE: Action item cards are static display only. Cannot click, expand, or take action. At minimum clicking should open detail view or modal. If full interactivity is Phase 5+, reformat as tighter list layout. 4. ACTION ITEMS VISUAL FORMAT: Card-style layout takes too much vertical space. Should be compact list format with subtle separators, not chunky card blocks."
severity: major

### 2. Dashboard Stat Tiles and CLARITY Countdown
expected: Stat tiles have colored left borders matching project recency. CLARITY countdown tile shows urgency treatment -- amber if 14-30 days away, pulsing red if under 14 days.
result: issue
reported: "FAIL -- Two issues: 1. RECENCY BORDER POSITION: Stat tile colored borders are on the top edge, not the left edge as specified. Left-side accent borders are the standard pattern for status indication -- top borders read as decorative. Move the colored recency border to the left side of each tile. 2. CLARITY COUNTDOWN NOT PULSING: The CLARITY Launch tile shows 25d with amber/orange treatment which is correct for the 14-30 day range, but there is no pulsing animation. The spec calls for pulsing red under 14 days and amber treatment at 14-30 days. Confirm amber static state is intentional at 25d, but verify pulsing animation is wired up and will activate when countdown drops below 14 days."
severity: major

### 3. Dashboard Action Items Inline Expand
expected: Action items card shows first 5 items. Clicking "Show All" expands the list inline with animation (does NOT navigate to another page).
result: pass

### 4. Dashboard Content Calendar Intelligence
expected: Content Calendar strip shows the next week that has content scheduled. If the current week is empty, it automatically jumps ahead (up to 8 weeks) to find content.
result: issue
reported: "PARTIAL PASS -- Calendar intelligence works correctly (jumped to Mar 23-29). Two minor improvements: 1. CONTENT CALENDAR CARDS TOO SHORT: Content preview cards truncate titles too aggressively. Add slightly more height so full titles display without ellipsis. Vertical space is available. 2. CONTENT CALENDAR CARD DETAIL: With extra height, show content type (carousel, text post, article, etc.) below the title so calendar strip gives enough context at a glance."
severity: minor

### 5. Dashboard Dynamic Greeting
expected: The Dashboard header shows a contextual greeting subtitle based on real data (mentions projects, deadlines, or status rather than a generic "Welcome back").
result: issue
reported: "PARTIAL PASS -- Greeting is time-aware ('Good evening') and shows real action item count, better than generic. But subtitle should rotate through higher-value contextual insights, not just a count. Examples: 'CLARITY launches in 25 days', 'Meridian has had no activity in 4 days', '3 content pieces need approval this week', 'You have 5 high-priority items across 3 projects.' Pick the most urgent or relevant data point dynamically. Action item count alone is not contextual enough for a command center dashboard."
severity: minor

### 6. Brain Dump Project Selector and Submit UX
expected: Brain Dump page shows a row of project selector pills (Auto-Route, Ridgeline, CLARITY, Forge Console, etc.). Textarea auto-grows as you type. Submit button glows coral when text is present. Cmd+Enter submits.
result: issue
reported: "FAIL -- Multiple issues: 1. CLAUDE API PARSING BROKEN: Submitting 'Testing' returned 'Could not parse response from Claude.' Core brain dump function not working. Critical functional bug -- debug API call, check Anthropic SDK config, API key, response handling. 2. ADD TO PROJECT BUTTON NON-FUNCTIONAL: '+ Add to project' link on parsed task cards does nothing. Must open dropdown or modal to select project. 3. SUBMIT BUTTON STATE: Button should visually change when text present vs empty. Empty: muted/disabled. Text entered: glowing coral with subtle pulse or brightness. Currently static. 4. STATUS PROGRESSION REDESIGN: Replace pill-style status indicators with horizontal step progress indicator. Connected steps with arrows or progress line. Completed=filled color, active=pulsing/highlighted, future=grayed out. Should read as pipeline, not tag collection. 5. EXPANDED ENTRY ACTIONS: Parsed task cards need inline actions: assign to project dropdown, change priority dropdown, edit task text inline, accept/reject parsed task, re-parse button. Small clean controls, not big buttons. 6. BORDER RADIUS: Same as dashboard -- reduce corner rounding globally to half current value."
severity: blocker

### 7. Brain Dump History Grouping and Entry Formatting
expected: Brain dump history entries are grouped by day with sticky headers (Today, Yesterday, or date). Each entry has a project-colored left border and status progression pills (Captured, Parsed, Tasks Created, Actioned). Clicking an entry expands to show the original text and parsed output with task cards.
result: issue
reported: "PARTIAL PASS -- Day grouping works (Yesterday, March 20 headers present). Expand/collapse works correctly. Two issues: 1. PROJECT-COLORED LEFT BORDERS NOT DIFFERENTIATED: All entries show same coral/orange left border regardless of project. Should use project color system from Phase 4 Wave 1 -- Ridgeline entries get Ridgeline's color, Forge gets Forge's color, unassigned gets neutral gray. Left border is primary visual cue for scanning which project a brain dump relates to. 2. STICKY HEADERS NEED VERIFICATION: Confirm day group headers stick to top of viewport when scrolling through long list within that day. If not, add position sticky with background color."
severity: major

### 8. Content Pipeline Calendar and Month Navigation
expected: Content Pipeline month view shows a real 7-column calendar grid with content items on their scheduled dates. Prev/next arrows navigate months with slide animation. A "Today" button returns to current month.
result: issue
reported: "FAIL -- Calendar grid structure works (7-column, nav arrows, Today button, items on dates, detail modal opens). But modal is critically inadequate. 1. CONTENT REVIEW MODAL NEEDS FULL REDESIGN: Must match W4_Batch.html quality. Needs: full post body text scrollable/selectable, character count with optimal range indicator (green 1200-1600, amber outside), Copy Post Text button with LinkedIn-safe formatting, Copy Without Hashtags button, content type badge, carousel slide breakdown with titles/descriptions/source paths, thumbnail previews with slideshow navigation, platform metadata. 2. REJECT WORKFLOW: Open rejection reason input, log to Supabase, show reason when viewed later for audit trail. 3. APPROVE WORKFLOW: Mark approved, surface in Ready to Post queue, show Copy Post button immediately. 4. RESPONSIVE CALENDAR GRID: Must adapt fluidly to different screen widths (55-inch monitor to laptop) without overlapping or unreadable truncation. 5. BORDER RADIUS: Reduce to half current value."
severity: blocker

### 9. Content Pipeline Views and Modals
expected: Content Pipeline has 4 view modes (list, week, month, kanban). Clicking a content item opens a detail modal (shadcn Dialog). Kanban view shows empty columns with dashed borders and icon. "Add Content" button in header opens a creation form modal.
result: issue
reported: "PARTIAL PASS -- 4 views render, kanban empty states work, detail modal opens. Issues: 1. ADD CONTENT MODAL REDESIGN: Rename Caption to Post Body, full-height textarea (min 300px) with auto-grow, live char count (green 1200-1600, amber outside, red >3000), Content Type selector (Text/Carousel/Visual Quote/Poll), fix platforms (replace Medium/Goodreads/Amazon with Facebook/X/Instagram/TikTok, multi-select), auto-calc Week Number from date, Series/Arc tag field, Notes field. 2. KANBAN NOT INTERACTIVE: Cards must be draggable between columns (Draft>Pending Review>Approved>Posted) with timestamp logging. 3. SINGLE PLATFORM: Need multi-platform support -- LinkedIn primary with variant generation for FB/X/IG/TikTok. Data model needs parent post + child variants. At minimum show platform selector and multi-platform tags. 4. DETAIL MODAL CONSISTENCY: Verify modal opens from all 4 views identically. 5. ADD CONTENT BUTTON: Must open functional creation form, not placeholder. 6. BORDER RADIUS: Half current value."
severity: major

### 10. Social Media Brand Icons and Layout
expected: Social Media page shows platform cards with brand icons (not generic icons). Active platforms display in a larger grid; setup/inactive platforms show as compact cards with amber left border. A hero stat row shows key metrics. LinkedIn card includes a follower goal progress bar toward 10,000.
result: issue
reported: "PARTIAL PASS -- Structure good, hero stats present, active/setup separation, LinkedIn goal bar at 65%, sort works. Issues: 1. BRAND ICONS MISSING: Most platforms show generic globe icons. All platforms need real brand icons from @icons-pack/react-simple-icons. Zero generic icons. 2. MEDIUM DATA WRONG: Shows active with @lucasoliver/240 followers -- verify or remove if inaccurate. 3. SETUP CARDS TOO SMALL: All platform cards same size regardless of status. Compact cards make setup platforms feel unimportant -- Amazon/Goodreads flagged 'Needed for launch' need equal visual weight. 4. SETUP NEEDED DEAD LABEL: Should be actionable button opening modal with setup steps, credentials, pre-launch checklist. 5. ACTIVE CARDS NEED MORE DATA: Show follower count, trend, last post date, posts this month, engagement rate placeholder. Every platform with follower goal shows progress bar. 6. HERO STAT ROW: Add 'Platforms ready for CLARITY launch: 2/13' progress indicator. 7. EXTERNAL LINKS ON ALL CARDS: Setup platforms should link to account creation page. 8. BORDER RADIUS: Half current value."
severity: major

### 11. Settings Tabbed Layout and Connection Health
expected: Settings page has 3 tabs: Integrations, Feedback, System. Integration cards show brand logos, connection status (green/amber/red borders and badges), and "Test Connection" buttons. Supabase test button actually pings Supabase. Feedback tab shows expandable entries with markdown rendering and page-colored badges.
result: issue
reported: "PARTIAL PASS -- Tabbed layout works (5 tabs). Supabase test works (Healthy, 253ms). Feedback has page-colored badges, expandable entries. Issues: 1. TEST BUTTONS BROKEN ON 4/5 INTEGRATIONS: n8n, Cloudflare, Slack, Claude API show 'Test not available'. Each must have working test (n8n: health endpoint, Claude: minimal completion, Slack: webhook ping, Cloudflare: Pages API). If not implementable, hide button and show muted 'Test coming soon'. 2. FEEDBACK FORMATTING: Expanded entries render as flat text walls. Need proper markdown rendering with visual hierarchy, separated numbered items, bold labels, indentation. 3. FEEDBACK ACTIONABILITY: No way to act on entries. Need: mark Done, assign to GSD phase, add note, mark Won't Fix with reason. 4. SYSTEM TAB TOO BARE: Add last deploy timestamp, Supabase table/row counts, API call usage, system uptime. 5. GRAYED TABS: Preferences/Data Management should show 'Coming soon' empty state or be hidden. 6. BRAND ICONS: Verify n8n, Slack, Claude API show actual brand icons. 7. BORDER RADIUS: Half current value."
severity: major

### 12. Activity Log Timeline and Density Chart
expected: Activity Log shows entries grouped by day with sticky date headers. A timeline with color-coded dots by tool (coral for Claude, green for n8n, etc.). Major events have bordered cards with shadow; background events are inline with reduced opacity. A 14-day density bar chart at the top shows stacked project colors. Filter chips and debounced search are available. "Load More" button for pagination.
result: issue
reported: "FAIL -- Structure exists but visual quality and interactivity not at standard. 10 issues: 1. DENSITY CHART TOO SMALL: 3-4x taller (min 120px), hover tooltips with breakdown, color legend below. 2. TIMELINE HIERARCHY BROKEN: Three tiers needed -- MAJOR (bordered card, shadow, bold), STANDARD (compact row), BACKGROUND (single line, gray, reduced opacity). 3. ENTRIES NOT CLICKABLE: Should link to source (project detail, content item, etc). 4. TIMELINE DOT LEGEND MISSING: Add legend mapping dot colors to tools. 5. DATE RANGE FILTER MISSING: Today, Yesterday, Last 7d, Last 30d, Custom range presets. 6. ENTRY ALIGNMENT: Tool badges, project badges, descriptions, timestamps must snap to consistent grid. Left edge jumps between card/inline styles. 7. MANUAL ENTRY FORM: Add tool dropdown, event type dropdown, optional link URL. 8. STICKY DATE HEADERS: Verify position sticky with background color. 9. BORDER RADIUS: Half current value. 10. LOAD MORE: Verify actually loads entries."
severity: major

## Summary

total: 12
passed: 0
passed: 1
issues: 11
pending: 0
skipped: 0
blocked: 0

## Gaps

- truth: "Stat tiles maintain equal sizing across all viewports with CSS grid equal fr columns"
  status: failed
  reason: "User reported: The 5 stat tiles do not maintain equal sizing. CLARITY Launch tile is different size. On resize (55 inch monitor or compressed narrower), tiles scramble to inconsistent sizes. Need CSS grid with equal fr columns, not flexbox."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Border radius on cards, tiles, badges, and containers is clean and modern, not bubbly"
  status: failed
  reason: "User reported: All cards, tiles, badges, and containers have too much corner rounding. Reduce border-radius globally to approximately half current value. Clean and modern, not bubbly, not squared off -- just tighter."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Action items are interactive -- clicking opens detail view or modal for taking action"
  status: failed
  reason: "User reported: Action item cards are static display only. Cannot click, expand, or take action. At minimum clicking should open detail view or modal where item can be acted on (mark complete, reassign, add notes, snooze). If full interactivity is Phase 5+, reformat as tighter list layout."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Action items use compact scannable list format, not chunky card blocks"
  status: failed
  reason: "User reported: Card-style layout takes too much vertical space. Should be cleaner, more compact list format with subtle separators. Not a table, but a tight list that lets you scan 20 items quickly without excessive padding and card chrome."
  severity: major
  test: 1
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Stat tile recency borders are on the left edge, not top edge"
  status: failed
  reason: "User reported: Stat tile colored borders are on the top edge, not the left edge as specified. Left-side accent borders are the standard pattern for status indication -- top borders read as decorative. Move colored recency border to left side."
  severity: major
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "CLARITY countdown pulsing animation activates below 14 days"
  status: failed
  reason: "User reported: CLARITY Launch tile shows 25d with amber/orange treatment (correct for 14-30 day range), but no pulsing animation exists. Verify pulsing animation is wired up and will activate when countdown drops below 14 days."
  severity: minor
  test: 2
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content calendar cards show full titles without truncation"
  status: failed
  reason: "User reported: Content preview cards truncate titles too aggressively. Add slightly more height so full titles display without ellipsis. Vertical space is available on the dashboard."
  severity: minor
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content calendar cards show content type below the title"
  status: failed
  reason: "User reported: With extra height, show content type (carousel, text post, article, etc.) below the title so calendar strip gives enough context at a glance without needing to click into pipeline."
  severity: minor
  test: 4
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Dashboard greeting subtitle rotates through high-value contextual insights dynamically"
  status: failed
  reason: "User reported: Subtitle should rotate through contextual insights like 'CLARITY launches in 25 days', 'Meridian has had no activity in 4 days', '3 content pieces need approval this week'. Pick most urgent data point dynamically. Action item count alone is not contextual enough for a command center dashboard."
  severity: minor
  test: 5
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Brain dump Claude API parsing works reliably"
  status: failed
  reason: "User reported: Submitting 'Testing' returned 'Could not parse response from Claude.' Core brain dump function broken. Debug API call -- check Anthropic SDK config, API key availability, response handling."
  severity: blocker
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Add to project button on parsed task cards opens project selection"
  status: failed
  reason: "User reported: '+ Add to project' link on parsed task cards does nothing when clicked. Must open dropdown or modal to select which project the task routes to."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Submit button visually changes when text is present vs empty"
  status: failed
  reason: "User reported: Button should visually change -- empty: muted/disabled appearance. Text entered: glowing coral with subtle pulse or brightness increase. Currently static."
  severity: minor
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Status progression uses horizontal step indicator with connected steps, not pills"
  status: failed
  reason: "User reported: Replace pill-style status indicators with horizontal step progress indicator. Connected steps with arrows or progress line. Completed=filled color, active=pulsing/highlighted, future=grayed out. Should read as pipeline, not tag collection."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Expanded brain dump entries have inline action controls on parsed task cards"
  status: failed
  reason: "User reported: Parsed task cards need: assign to project dropdown, change priority dropdown, edit task text inline, accept/reject parsed task, re-parse button. Small clean controls -- icon buttons and small dropdowns, not big buttons."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Border radius across all pages reduced to half current value"
  status: failed
  reason: "User reported: Same as dashboard feedback -- reduce corner rounding globally to half current value across all cards, input areas, pills, and containers. Confirmed on Brain Dump page as well."
  severity: major
  test: 6
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Brain dump history entries use project-specific left border colors, not uniform coral"
  status: failed
  reason: "User reported: All entries show same coral/orange left border regardless of project. Should use project color system from Phase 4 Wave 1 -- Ridgeline gets Ridgeline's color, Forge gets Forge's color, unassigned gets neutral gray. Left border is primary visual cue for project scanning."
  severity: major
  test: 7
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Brain dump day group headers are position:sticky when scrolling"
  status: failed
  reason: "User reported: Confirm day group headers (Yesterday, March 20) stick to top of viewport when scrolling through long list within that day. If not implemented, add position sticky with background color."
  severity: minor
  test: 7
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content review modal matches W4_Batch.html quality with full post body, char count, copy buttons, carousel slideshow, and platform metadata"
  status: failed
  reason: "User reported: Modal must show full post body text (scrollable/selectable), character count with optimal range indicator (green 1200-1600, amber outside), Copy Post Text with LinkedIn-safe formatting, Copy Without Hashtags, content type badge, carousel slide breakdown with titles/descriptions/source paths, thumbnail previews with slideshow nav, platform metadata."
  severity: blocker
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Reject workflow opens rejection reason input and logs to Supabase"
  status: failed
  reason: "User reported: Reject must open rejection reason text input, log reason to Supabase for audit trail, show rejection reason when item viewed later. Eventually triggers agent rework."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Approve workflow marks approved and surfaces in Ready to Post queue with Copy Post button"
  status: failed
  reason: "User reported: Approving should mark as approved and surface in Ready to Post queue. Approved content shows Copy Post button immediately so user can copy and go straight to LinkedIn."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content Pipeline calendar grid adapts fluidly to different screen widths"
  status: failed
  reason: "User reported: Same as dashboard stat tiles -- calendar grid should adapt fluidly from 55-inch monitor to laptop without cells overlapping or content truncating to unreadable lengths."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content Pipeline border radius reduced to half current value"
  status: failed
  reason: "User reported: Same global note -- reduce corner rounding to half current value across all cards, cells, and modals on Content Pipeline page."
  severity: major
  test: 8
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Add Content modal is full-featured with Post Body textarea, char count, content type selector, correct platforms, auto week number, series tag, and notes field"
  status: failed
  reason: "User reported: Rename Caption to Post Body (min 300px textarea with auto-grow), live char count (green 1200-1600, amber outside, red >3000), Content Type selector (Text/Carousel/Visual Quote/Poll with Slide Count), fix platforms (replace Medium/Goodreads/Amazon with Facebook/X/Instagram/TikTok, multi-select), auto-calc Week Number from date, Series/Arc tag field, Notes field for internal context."
  severity: major
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Kanban cards are draggable between status columns with timestamp logging"
  status: failed
  reason: "User reported: Cards in Kanban view should be draggable between columns (Draft to Pending Review to Approved to Posted). Each status transition should log timestamp. Static display is not sufficient for core content workflow."
  severity: major
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Content Pipeline supports multi-platform with LinkedIn primary and variant generation"
  status: failed
  reason: "User reported: Pipeline only shows LinkedIn. Architecture needs LinkedIn as primary authoring platform with variant generation for Facebook, X/Twitter, Instagram, TikTok. Data model should support parent post with child variant records per platform. At minimum show platform selector and multi-platform tags."
  severity: major
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Detail modal opens identically from all 4 Content Pipeline views"
  status: failed
  reason: "User reported: Verify detail modal opens from all 4 views (List, Week, Month, Kanban) with identical content and actions regardless of which view launched it."
  severity: minor
  test: 9
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "All Social Media platforms show real brand icons from react-simple-icons, zero generic globe icons"
  status: failed
  reason: "User reported: Most platforms show generic globe icons. LinkedIn, Facebook, X/Twitter, Beehiiv, Gumroad, Amazon Author Central all need real brand icons from @icons-pack/react-simple-icons which is already installed."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Medium account seed data is verified accurate"
  status: failed
  reason: "User reported: Medium shows active with @lucasoliver and 240 followers. May not be Lucas's account. Verify seed data and correct or remove if inaccurate."
  severity: minor
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "All platform cards are same size regardless of active/setup status"
  status: failed
  reason: "User reported: Compact setup cards make setup-needed platforms feel unimportant. Amazon/Goodreads flagged 'Needed for launch' should have equal visual weight to active platforms, just different status indicator."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Setup Needed is an actionable button opening modal with setup steps and checklist"
  status: failed
  reason: "User reported: 'Setup Needed' should be actionable button opening modal with: account to create, handle to reserve, credentials to connect, pre-launch checklist. Currently a dead label."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Active platform cards show follower count, trend, last post date, posts this month, engagement rate"
  status: failed
  reason: "User reported: Each active platform should show follower count, follower trend (up/down from last period), last post date, posts this month, engagement rate placeholder. Every platform with follower goal shows progress bar treatment like LinkedIn."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Hero stat row includes CLARITY launch platform readiness progress indicator"
  status: failed
  reason: "User reported: Add 'Platforms ready for CLARITY launch: 2/13' as progress indicator in hero stat row. Ties page to April 17 deadline and makes setup urgency visible."
  severity: minor
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "All platform cards (active and setup) have external link to platform profile or account creation"
  status: failed
  reason: "User reported: Every platform card should have direct link icon opening profile URL in new tab. Active platforms link to profile, setup platforms link to account creation page."
  severity: minor
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Social Media page border radius reduced to half current value"
  status: failed
  reason: "User reported: Reduce corner rounding to half current value on all cards and stat tiles on Social Media page."
  severity: major
  test: 10
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "All 5 integration Test buttons work or are hidden with 'Test coming soon' text"
  status: failed
  reason: "User reported: n8n, Cloudflare, Slack, Claude API show 'Test not available'. Each must work: n8n ping health endpoint, Claude send minimal completion, Slack ping webhook, Cloudflare hit Pages API. If not implementable yet, hide button and show muted 'Test coming soon'."
  severity: major
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Feedback expanded entries render with proper markdown hierarchy, not flat text walls"
  status: failed
  reason: "User reported: Expanded entries render as flat text walls. Need proper markdown rendering with visual hierarchy, visually separated numbered items, bold labels that stand out, indentation and spacing. Consider collapsible sub-sections per numbered item."
  severity: major
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Feedback entries have action controls: Done, assign to phase, add note, Won't Fix"
  status: failed
  reason: "User reported: No way to act on feedback entries. Need: mark as Done, assign to GSD phase, add response/note, mark as Won't Fix with reason. Feedback system must close the loop."
  severity: major
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "System tab shows last deploy, Supabase stats, API usage, uptime"
  status: failed
  reason: "User reported: System tab too bare. Add: last deploy timestamp, Supabase table/row counts, API call usage this month (Claude API, Supabase), system uptime."
  severity: minor
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Grayed tabs show Coming Soon empty state or are hidden until implemented"
  status: failed
  reason: "User reported: Preferences and Data Management tabs appear inactive. Should show 'Coming soon' empty state when clicked or be hidden. Grayed but clickable tabs that do nothing feel broken."
  severity: minor
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Integration cards show actual brand icons for n8n, Slack, Claude API"
  status: failed
  reason: "User reported: Verify n8n, Slack, and Claude API show actual brand icons from @icons-pack/react-simple-icons, not generic placeholders."
  severity: minor
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Settings page border radius reduced to half current value"
  status: failed
  reason: "User reported: Reduce corner rounding to half current value on all integration cards and feedback entries."
  severity: major
  test: 11
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Density chart is 120-160px tall with hover tooltips and project color legend"
  status: failed
  reason: "User reported: Chart needs to be 3-4x taller (min 120px, ideally 160px). Each day bar needs hover tooltip: 'March 20: 7 activities -- Forge (3), CLARITY (2), Ridgeline (1), System (1)'. Add color legend below mapping bar colors to projects."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Activity log entries have three distinct visual tiers: major, standard, background"
  status: failed
  reason: "User reported: Major/background have nearly same weight. Fix: MAJOR = bordered card with shadow, bold title, project badge. STANDARD = compact row with tool/project badges. BACKGROUND = single line, gray text, reduced opacity, no card."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Activity entries are clickable and link to source (project detail, content item, etc)"
  status: failed
  reason: "User reported: Entries should be clickable. Phase completion links to project detail, content approval links to pipeline item, Ridgeline v2.0 links to Ridgeline project page. Every entry connects to where work lives."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Timeline dot color legend present mapping colors to tools"
  status: failed
  reason: "User reported: Colored dots (coral, green, amber, gray) are not explained. Add small legend near density chart or filter section mapping dot colors to tools."
  severity: minor
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Date range filter with presets (Today, Yesterday, Last 7d, Last 30d, Custom)"
  status: failed
  reason: "User reported: Add date range filter in addition to project and tool filters. Quick presets: Today, Yesterday, Last 7 days, Last 30 days, Custom range. Essential for reviewing specific time periods."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Activity entries consistently aligned on a grid (badges, descriptions, timestamps)"
  status: failed
  reason: "User reported: Entries not cleanly aligned. Tool badges, project badges, descriptions, timestamps must snap to consistent grid. Left edge jumps between card and inline styles."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Manual entry form has tool dropdown, event type dropdown, and optional link URL"
  status: failed
  reason: "User reported: Form too basic. Add: tool used dropdown (Claude Code, n8n, Slack, Manual, System), event type dropdown (milestone, commit, approval, note, health check), optional link URL for metadata parity."
  severity: minor
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Activity log day group headers are position:sticky when scrolling"
  status: failed
  reason: "User reported: Verify day group headers stick to viewport top when scrolling. If not, add position sticky with background color."
  severity: minor
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Activity log border radius reduced to half current value"
  status: failed
  reason: "User reported: Reduce corner rounding to half current value on all cards, filter chips, and density chart container."
  severity: major
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""

- truth: "Load More button loads additional entries when clicked"
  status: failed
  reason: "User reported: Verify Load More actually loads additional entries and does not just sit there."
  severity: minor
  test: 12
  root_cause: ""
  artifacts: []
  missing: []
  debug_session: ""
