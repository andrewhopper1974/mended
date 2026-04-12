# Mended Shutdown Checklist

> Generated 2026-04-12. Complete these manual steps to fully shut down Mended.

## Before deploying

- [ ] Replace `PLACEHOLDER@example.com` in `app/page.tsx` with your real contact email
- [ ] Deploy to Vercel (the committed code replaces all pages and disables all endpoints)

## Stripe (dashboard.stripe.com)

- [ ] Confirm no active subscriptions exist (Mended used one-time payments, so there shouldn't be any)
- [ ] Archive or deactivate products: 30-day program, 90-day program
- [ ] Delete or disable the webhook endpoint for `mended.health`
- [ ] Deactivate the exit-intent promo code (`promo_1TJgyEPFMDEDuyb3ye8jPL2U`)
- [ ] If this is a test-mode-only account with no real charges, you can leave it or close it entirely

## Supabase (supabase.com/dashboard)

- [ ] Project: `yssrojfpqjvnxztcllit`
- [ ] Option A: **Pause project** (free, keeps data, can resume later)
- [ ] Option B: **Delete project** (permanent, destroys all data)
- [ ] If you want the data first: Table Editor → `leads` → Export CSV, then `purchases` → Export CSV

## MailerLite (dashboard.mailerlite.com)

- [ ] Archive or delete subscriber group `183833818516424158`
- [ ] Remove any active automations tied to Mended
- [ ] If MailerLite is only used for Mended: cancel paid plan or downgrade to free tier
- [ ] If shared with other projects: just clean up the Mended group

## Vercel (vercel.com/dashboard)

- [ ] After deploying the shutdown page, confirm both domains serve the shutdown message:
  - [ ] `mended.health`
  - [ ] `app.mended.health`
- [ ] Option A: **Keep on free tier** (shutdown page costs nothing to host)
- [ ] Option B: **Delete the project** (removes both domain bindings)
- [ ] If deleting: remove custom domains from the project first

## Meta / Facebook (business.facebook.com)

- [ ] Pixel `2020490228678499`: disconnect `mended.health` from Data Sources → Pixels
- [ ] Pause or delete any active ad campaigns using this pixel
- [ ] Pause any ad sets targeting Mended audiences
- [ ] If the Business Manager is only for Mended: consider deactivating the ad account

## Domain (your registrar)

- [ ] Do NOT delete `mended.health` registration yet — keep it pointing to Vercel so the shutdown page shows
- [ ] Set a calendar reminder for when the domain renewal comes up — decide then whether to let it expire

## Code / GitHub

- [ ] Archive the repo on GitHub when ready (Settings → Danger Zone → Archive)
- [ ] Do NOT delete the repo — keep it as a record

## Environment variables / secrets

- [ ] Rotate or revoke the Supabase service role key if you're not deleting the project
- [ ] Revoke the MailerLite API key if you're not using it elsewhere
- [ ] The Stripe test-mode key doesn't need rotation unless you're concerned about exposure
