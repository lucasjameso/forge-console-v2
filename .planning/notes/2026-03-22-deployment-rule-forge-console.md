---
date: "2026-03-22 22:20"
promoted: false
---

DEPLOYMENT RULE: Forge Console v2 deploys to production via GitHub auto-deploy to Cloudflare Pages. The pipeline is: git push origin main -> GitHub triggers Cloudflare Pages build -> deploys to https://forge-console-v2.pages.dev automatically. NEVER use wrangler pages deploy manually. That creates preview URLs, not production deploys. If a deploy is needed, just push to main. The .env file at the project root has Cloudflare tokens if any wrangler commands are ever needed for non-deploy tasks.
