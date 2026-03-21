# Forge Console v2 -- Setup Checklist

All integrations configured on March 21, 2026.

---

## 1. Supabase (Database + Auth) -- DONE
- [x] Project created: `awlrpjefdgfismzdweuc`
- [x] `VITE_SUPABASE_URL` set
- [x] `VITE_SUPABASE_ANON_KEY` set
- [x] All 14 tables created with RLS policies (supabase/schema.sql)

---

## 2. Claude API (Brain Dump Parsing) -- DONE
- [x] `VITE_ANTHROPIC_API_KEY` set

---

## 3. n8n (Workflow Automation) -- DONE
- [x] `VITE_N8N_URL` set (https://n8n.iac-solutions.io)
- [x] `VITE_N8N_API_KEY` set

---

## 4. Cloudflare (Pages Hosting + Deploy) -- DONE
- [x] `VITE_CF_ACCOUNT_ID` set
- [ ] (Phase 8) Install wrangler: `npm install -g wrangler`
- [ ] (Phase 8) Run `wrangler pages project create forge-console`
- [ ] (Phase 8) Deploy: `npm run build && wrangler pages deploy dist`

---

## 5. Slack (Content Approval Notifications) -- DONE
- [x] `VITE_SLACK_WEBHOOK_URL` set

---

## Remaining for morning

1. Restart dev server (`npm run dev`) and verify Settings page shows all green
2. (Optional) Seed the Supabase tables with real data
3. Phase 8: Deploy to Cloudflare Pages
