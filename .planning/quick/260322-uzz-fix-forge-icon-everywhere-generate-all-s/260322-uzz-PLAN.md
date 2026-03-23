---
phase: quick
plan: 260322-uzz
type: execute
wave: 1
depends_on: []
files_modified:
  - public/forge-icon.png
  - public/favicon-16x16.png
  - public/favicon-32x32.png
  - public/favicon-48x48.png
  - public/apple-touch-icon.png
  - public/forge-icon-192.png
  - public/forge-icon-512.png
  - public/favicon.ico
  - public/manifest.json
  - index.html
  - scripts/generate-icons.cjs
autonomous: true
requirements: []
must_haves:
  truths:
    - "Browser tab shows correct Forge icon at 16x16 and 32x32"
    - "PWA manifest references correct icon paths at 192 and 512"
    - "Apple touch icon exists at 180x180"
    - "No old naming convention icon files remain (forge-icon-16, forge-icon-32, forge-icon-48)"
    - "icons.svg removed (unused sprite sheet)"
    - "npm run build passes with zero errors"
  artifacts:
    - path: "public/favicon-16x16.png"
      provides: "16x16 favicon"
    - path: "public/favicon-32x32.png"
      provides: "32x32 favicon"
    - path: "public/favicon-48x48.png"
      provides: "48x48 favicon"
    - path: "public/apple-touch-icon.png"
      provides: "180x180 Apple touch icon"
    - path: "public/forge-icon-192.png"
      provides: "192x192 PWA icon"
    - path: "public/forge-icon-512.png"
      provides: "512x512 PWA icon"
    - path: "public/favicon.ico"
      provides: "ICO format favicon"
  key_links:
    - from: "index.html"
      to: "public/favicon-32x32.png"
      via: "link rel=icon tag"
      pattern: "favicon-32x32\\.png"
    - from: "public/manifest.json"
      to: "public/forge-icon-192.png"
      via: "icons array"
      pattern: "forge-icon-192\\.png"
---

<objective>
Regenerate all Forge icon sizes with standard favicon naming, update index.html and manifest.json references, clean up old icon files, and push to trigger Cloudflare Pages deploy.

Purpose: Previous icon task used non-standard naming (forge-icon-16.png etc). This standardizes to favicon-16x16.png convention, ensures all sizes are correctly generated from the new Gemini source image, and cleans up stale files.
Output: All icon sizes generated, HTML/manifest updated, old files removed, pushed to main.
</objective>

<execution_context>
@~/.claude/get-shit-done/workflows/execute-plan.md
@~/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

Current state of public/ icons:
- forge-icon.png (master, matches Gemini source -- keep)
- forge-icon-16.png, forge-icon-32.png, forge-icon-48.png (old naming -- delete)
- forge-icon-192.png, forge-icon-512.png (correct naming -- regenerate from source)
- apple-touch-icon.png (correct naming -- regenerate from source)
- favicon.ico (keep name -- regenerate from source)
- icons.svg (social media sprite -- NOT referenced in src/, delete)

index.html currently references forge-icon-32.png and forge-icon-16.png (old names).
manifest.json already references forge-icon-192.png and forge-icon-512.png (correct).
No React source files reference old icon paths or forge_alerts.
</context>

<tasks>

<task type="auto">
  <name>Task 1: Generate all icon sizes and clean up old files</name>
  <files>
    scripts/generate-icons.cjs
    public/favicon-16x16.png
    public/favicon-32x32.png
    public/favicon-48x48.png
    public/apple-touch-icon.png
    public/forge-icon-192.png
    public/forge-icon-512.png
    public/favicon.ico
  </files>
  <action>
1. Ensure sharp is installed: `npm install sharp --save-dev` (may already be present from previous task).

2. Create `scripts/generate-icons.cjs` that:
   - Reads `public/forge-icon.png` as source (already exists, matches Gemini source image)
   - Generates these files using sharp .resize().toFile():
     - public/favicon-16x16.png (16x16)
     - public/favicon-32x32.png (32x32)
     - public/favicon-48x48.png (48x48)
     - public/apple-touch-icon.png (180x180)
     - public/forge-icon-192.png (192x192)
     - public/forge-icon-512.png (512x512)
   - Generates public/favicon.ico by creating a 32x32 PNG buffer and writing it as .ico format. Since sharp cannot produce .ico natively, rename the 32x32 PNG to favicon.ico (browsers accept PNG-in-ICO).
   - Script should log each file generated.

3. Run the script: `node scripts/generate-icons.cjs`

4. Delete old-naming files that are now replaced:
   - `rm public/forge-icon-16.png`
   - `rm public/forge-icon-32.png`
   - `rm public/forge-icon-48.png`
   - `rm public/icons.svg` (unused social media sprite -- not referenced in any src/ file)

5. Delete the root-level source image since public/forge-icon.png is the canonical copy:
   - `rm Gemini_Generated_Image_kplbjikplbjikplb.png`
  </action>
  <verify>
    <automated>ls -la public/favicon-16x16.png public/favicon-32x32.png public/favicon-48x48.png public/apple-touch-icon.png public/forge-icon-192.png public/forge-icon-512.png public/favicon.ico && test ! -f public/forge-icon-16.png && test ! -f public/forge-icon-32.png && test ! -f public/forge-icon-48.png && test ! -f public/icons.svg && echo "ALL OK"</automated>
  </verify>
  <done>All icon sizes exist with correct naming, old files deleted, no stale references remain in public/</done>
</task>

<task type="auto">
  <name>Task 2: Update index.html, verify manifest, build, and push</name>
  <files>
    index.html
    public/manifest.json
  </files>
  <action>
1. Update index.html -- replace the existing favicon/icon link tags with these exact tags (the current ones reference old forge-icon-32.png and forge-icon-16.png names):
   ```html
   <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
   <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
   <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
   ```
   Keep the manifest link and favicon.ico link as-is (favicon.ico line can stay or be removed since the PNG icons take priority -- keep it for legacy browser compat).

2. Verify manifest.json -- it already references forge-icon-192.png and forge-icon-512.png which are correct names. No change needed unless the file was modified. Confirm the icons array is:
   ```json
   { "src": "/forge-icon-192.png", "sizes": "192x192", "type": "image/png" },
   { "src": "/forge-icon-512.png", "sizes": "512x512", "type": "image/png" }
   ```

3. Run `npm run build` -- must complete with zero errors.

4. Git add all changed files (new icons, deleted old icons, updated index.html, script), commit with descriptive message, then `git push origin main`. Do NOT run wrangler deploy -- the git push triggers Cloudflare Pages automatically.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -5</automated>
  </verify>
  <done>index.html references new icon filenames, build passes with zero errors, changes pushed to main triggering Cloudflare Pages deploy</done>
</task>

</tasks>

<verification>
- All 7 icon files exist in public/ with correct names and sizes
- No old forge-icon-16/32/48.png files remain
- No icons.svg remains
- index.html link tags point to favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png
- manifest.json icons array points to forge-icon-192.png, forge-icon-512.png
- npm run build passes
- Changes pushed to main
</verification>

<success_criteria>
- `npm run build` passes with zero errors
- `git log -1` shows the icon update commit
- `git status` is clean after push
- All icon files exist at correct paths with standard naming
</success_criteria>

<output>
After completion, create `.planning/quick/260322-uzz-fix-forge-icon-everywhere-generate-all-s/260322-uzz-SUMMARY.md`
</output>
