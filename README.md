# Kickoff Clean ATL

A citizen-led, sponsor-supported initiative restoring Atlanta's MARTA stations
before the FIFA World Cup 2026. Independent of MARTA and the City of Atlanta;
operating in coordination with both.

## What's in here

Static HTML / CSS / JavaScript for the public website. No build step required.

```
├── index.html              Landing page
├── convener.html           About the Convener (Ernest Timothy)
├── get-involved.html       Volunteer · Donate · Sponsor · FAQ
├── styles.css              Site-wide styles (Atlanta royal blue + gold palette)
├── convener.css            Editorial styles for the Convener profile
├── carousel.js             3D rotating station-card carousel
├── images/                 Logo variants, station photos, the Convener portrait
├── DEPLOY.md               Hosting walkthroughs (Netlify, Cloudflare, GitHub Pages)
└── images/README.md        Workflow for swapping placeholder photos
```

## Local preview

```bash
cd website
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy

### GitHub Pages (this repo)
Repo → Settings → Pages → Source: "Deploy from a branch" → Branch: `main` → Folder: `/ (root)` → Save.
Site goes live at `https://ernesttimo.github.io/KickoffCleanATL/` within a minute.
Add a custom domain (e.g. `kickoffcleanatl.com`) in the same panel when you have the domain.

### Netlify Drop (fastest)
Drag this folder into https://app.netlify.com/drop.

### Cloudflare Pages
https://pages.cloudflare.com → Direct Upload → drop the folder.

See `DEPLOY.md` for full step-by-step.

## Contact
hello@kickoffcleanatl.com
