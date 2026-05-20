# Hero carousel images

This folder is where real MARTA station photos live once Session 1 (Saturday, May 23 at Arts Center) is in the can.

## Current state

The landing page (`../index.html`) currently uses **8 Unsplash placeholder URLs** — generic transit/urban photos. These were chosen because we don't have real station photos yet. They are clearly marked in the HTML with a comment block above the hero.

## Workflow to swap to real photos

### Step 1 — Capture
Take 8 high-quality photos at your sessions. Recommended:
* **Portrait orientation** (the cards are taller than wide — 168 × 220 px on desktop)
* **Tight crops** of the most visually striking moments — a clean floor, a polished escalator surround, volunteers mid-work, the multilingual welcome banner, etc.
* **Consistent lighting** if possible — all daytime or all morning-golden
* Originals at **at least 1200 px wide** for crispness on retina displays

### Step 2 — Prepare
Drop the 8 best photos into this folder, named by station:

```
website/images/
├── arts-center.jpg
├── midtown.jpg
├── five-points.jpg
├── peachtree-center.jpg
├── north-avenue.jpg
├── civic-center.jpg
├── gwcc-cnn-center.jpg
└── airport.jpg
```

Optionally resize/compress beforehand — most online compressors (e.g., squoosh.app, tinyjpg.com) get JPG file size below ~200 KB without visible quality loss.

### Step 3 — Update the HTML
In `../index.html`, find the `<!-- ============ HERO ============ -->` block and replace each Unsplash URL with the local path. Example, replacing the first card:

```html
<!-- Before -->
<img src="https://images.unsplash.com/photo-1502139214982-d0ad755818d8?auto=format&fit=crop&w=480&q=70" alt="Train interior" loading="eager" />

<!-- After -->
<img src="images/arts-center.jpg" alt="Arts Center Station after Kickoff Clean ATL cleanup" loading="eager" />
```

Do this for all 8 cards. Keep the `<span class="carousel-label">…</span>` and the `data-static-rotation` attribute on each card — those drive the layout.

### Step 4 — Update the alt text
While you're in there, update each `alt=""` attribute to describe the actual photo. Good alt text matters for accessibility and SEO.

### Step 5 — Re-deploy
If you're hosted on Netlify Drop, drag the whole `website/` folder back into your site's deploys page. If you're on GitHub Pages or Cloudflare Pages, commit and push.

## What about file size?

8 photos at ~200 KB each = ~1.6 MB total. Acceptable for a hero. If you go higher (1080p originals at >500 KB each), consider:
* Running them through **squoosh.app** (free, browser-based)
* Or generating WebP versions and using `<picture>` with WebP + JPG fallback

## What about the `alt` attribute when using stock images?

Until you swap to real photos, the placeholder alts (`"Train interior"`, `"Subway tunnel"`, etc.) are technically accurate but not project-specific. Don't worry about updating them on the stock URLs — focus on getting real photos in here.

## When you swap, also update

* The `<meta property="og:image">` tag if you add one (for social-share previews)
* Any photo references in `get-involved.html` (currently none — the carousel only lives on the landing page)
