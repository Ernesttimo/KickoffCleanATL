# Kickoff Clean ATL — Deployment Guide

Three free hosting options, ranked from fastest to most flexible. All three give you HTTPS for free and can connect a custom domain when you're ready.

---

## Recommended: Netlify Drop (90 seconds, no account needed)

The fastest path. Live URL in under two minutes.

1. Open **https://app.netlify.com/drop** in a browser
2. In Finder, open the `ATL-FIFA PROJECT/website/` folder
3. Drag the *contents* of the folder (the three files: `index.html`, `get-involved.html`, `styles.css`) into the Netlify Drop browser window
4. Wait ~20 seconds. Your site is live at something like `https://radiant-pixie-a1b2c3.netlify.app`
5. **Claim the site** (button appears after drop) by signing up with email or GitHub. This lets you redeploy, rename, and connect a domain later.
6. **Rename the URL** in Site Settings → Change site name → pick something like `kickoff-clean-atl`. New URL: `https://kickoff-clean-atl.netlify.app`

To redeploy after edits: drag the updated folder back into the same site's deploys page, or set up Git deploys (below).

**Why this is the recommendation:** zero configuration, no command line, no GitHub required, and you can claim and customize later when you have time.

---

## Option 2: GitHub Pages (10 minutes, needs GitHub account)

Good if you'll be editing files frequently and want version control.

1. Create a free GitHub account at **github.com** if you don't have one
2. Create a new repository named `kickoff-clean-atl` (Public)
3. Either:
   - **Easy:** Click "Upload files" on the repo page, drag the three website files in, commit
   - **CLI:** From the `website/` folder run:
     ```
     git init
     git add .
     git commit -m "Initial deploy"
     git branch -M main
     git remote add origin https://github.com/<your-username>/kickoff-clean-atl.git
     git push -u origin main
     ```
4. Repo Settings → Pages → Source: "Deploy from a branch" → Branch: `main` → Folder: `/ (root)` → Save
5. Wait 1–2 minutes. Site is live at `https://<your-username>.github.io/kickoff-clean-atl/`

To update: edit files in the repo, commit. GitHub Pages redeploys automatically.

---

## Option 3: Cloudflare Pages (10 minutes, fastest performance globally)

Same drag-and-drop simplicity as Netlify, with Cloudflare's CDN performance.

1. Sign up at **pages.cloudflare.com**
2. Create a project → "Direct Upload" → name it `kickoff-clean-atl`
3. Drag the three files into the upload box
4. Site is live at `https://kickoff-clean-atl.pages.dev`

---

## After deploy — the three things to update

Open the live URL on your phone and a desktop. Then:

### 1. Volunteer sign-up form
Replace the placeholder `href="#"` on the **"Sign up for Saturday"** button in `get-involved.html` with a real form URL.

**Fastest option — Google Forms:**
* Go to forms.google.com → blank form
* Title: "Kickoff Clean ATL — Volunteer Sign-Up"
* Fields:
  - Full name (short answer, required)
  - Email (short answer, required)
  - Phone (short answer, required)
  - Which session? (multiple choice — list upcoming dates)
  - T-shirt size (multiple choice — for future)
  - Emergency contact name + phone (short answer)
  - Anything we should know? (paragraph)
  - Checkbox: "I have read and agree to the volunteer waiver" (required)
* Click Send → copy link → paste into the button's `href`

### 2. GoFundMe link
Once Session 1 is documented and you have before/after photos:
* Create a GoFundMe at gofundme.com
* Title: "Kickoff Clean ATL — Volunteer Cleanups of MARTA Stations Ahead of FIFA 2026"
* Goal: $5,000
* Cover photo: the strongest before/after pair from Arts Center
* Story: pull from Section 9 of the execution plan
* Copy the campaign URL → replace `href="#"` on the "Give via GoFundMe" button

### 3. Email address
Currently `hello@kickoffcleanatl.com`. Two paths:

**Quickest:** Replace with your real email everywhere (search-and-replace `hello@kickoffcleanatl.com` in both HTML files). Less branded but works today.

**Better:** Register `kickoffcleanatl.com` for ~$12/year at Namecheap, Cloudflare, or Google Domains. Set up email forwarding (free with most registrars) — incoming mail to `hello@kickoffcleanatl.com` forwards to your real Gmail. **Verify USPTO TESS for trademark conflicts before paying for the domain.**

---

## Custom domain (optional, $12/year)

When ready, connect `kickoffcleanatl.com` to your hosting:

* **Netlify:** Site Settings → Domain management → Add custom domain. Netlify gives you DNS records to add at your registrar. Propagation: ~1 hour.
* **GitHub Pages:** Settings → Pages → Custom domain field. Add a CNAME record at your registrar pointing to `<username>.github.io`.
* **Cloudflare Pages:** Custom domain → enter the domain. If you registered through Cloudflare, it's automatic. Otherwise, add a CNAME.

HTTPS is automatic on all three within a few minutes of domain connection.

---

## Social handles (footer links)

Currently `href="#"` placeholders. Reserve handles first, then update the footer:

* Instagram: `https://instagram.com/kickoffcleanatl` (or your chosen handle)
* LinkedIn: create a Page (not a personal profile) at `linkedin.com/company/kickoff-clean-atl`
* TikTok: `https://tiktok.com/@kickoffcleanatl`
* X (optional): `https://x.com/kickoffcleanatl`

Replace the four `href="#"` lines in the footer of both pages.

---

## What you do *not* need

* A backend server
* A database
* A CMS
* A build step
* Node.js or Python installed
* Any paid tools to ship the first version

This site is intentionally static HTML/CSS so you can ship it in ten minutes and a non-technical volunteer can edit it later.
