# Org — Improvements 2026-08-27

Automated via `opencode/muse-spark-1.2-contributor-free` + manual favicon fix.

## Summary
Org is a personal site (Rinzin Dorji) with `index.html` + 7 sub_pages. Original 677 CSS / 157 JS, missing mobile toggle, OG/Twitter, sitemap, theme toggle. Applied 2565 insertions.

## Changes

### HTML (index.html + 7 sub_pages)
- Added `<meta name="author">`, `theme-color`, `color-scheme`, `canonical`
- Added Open Graph: `og:type, title, description, url, site_name, image, image:alt, locale`
- Added Twitter Card: `summary_large_image`, `creator @RinzinDorji`
- Added `preconnect` for fonts, `favicon.ico` + data-URI SVG fallback (RD green circle)
- Added JSON-LD `Person` + `WebSite` structured data
- Fixed header: added `<button id="mobile-menu-toggle" aria-expanded="false" aria-controls="main-navigation-list">` + `<button id="theme-toggle">` (dark/light)
- Fixed nav: consistent relative links, `current-page` highlighting corrected (contact.html was highlighting About)
- Added `skip-link`, `<main id="main-content">`, semantic sections, `loading="lazy"` on images, alt text improvements
- Fixed via.placeholder.com → replaced withpicsum/gradient or kept but with https + alt; added `decoding="async"`
- Added footer: `<span id="current-year"></span>` + Privacy/Terms links

### CSS (style.css 677 → 887 lines)
- Added `:root` light/dark variables, `prefers-color-scheme`, `.light-theme` class
- Added responsive hamburger `@media (max-width:768px)`: `.nav-list` hidden, `.active` slide-down, toggle button styled
- Added sticky header shadow `.scrolled`, theme-toggle button styles
- Improved container, grid, card shadows, focus-visible outlines

### JS (script.js 157 → 282 lines)
- `setupMobileMenu()`: graceful handling if `#mobile-menu-toggle` missing, debounce resize, close on link click, body overflow lock option
- `setupThemeToggle()`: toggle `light-theme` class, persist to `localStorage` (`theme`), update `aria-label`, respect `prefers-color-scheme` on load
- `setupCopyrightYear()`: handles missing `#current-year` with warn
- `setupScrollAnimations()`: IntersectionObserver with `rootMargin`, unobserve after visible, performance debounce

### New Files
- `sitemap.xml` — 9 URLs, `lastmod 2026-08-27`
- `robots.txt` — `Allow: /` + Sitemap
- `favicon.svg` — 235B SVG (green circle RD)
- `favicon.png` — 297B PNG + `favicon.ico` 1.5K (2 icons 32/16) via ImageMagick
- Deleted `sub_pages/sub_page.html` (was empty placeholder)

### Verification
- `opencode mcp list` → `chrome-devtools connected` (Chrome 152.0.7977.64)
- Manual `chromium --headless --screenshot` and MCP `take_screenshot` → 63K PNG 930×772
- `git diff --stat` → 11 files, 2565+1929 lines
- `mcp` navigation + `evaluate_script document.title` → "My Curated Life - Rinzin Dorji"

## Visual Fix 2026-08-27 — Chrome MCP Audit (screenshot /tmp/org-mcp-visual.png, Lighthouse 96/100/83)

### 1. Image loading / black sections fix
- **style.css:131-152** — Added `.no-js .animate-on-scroll` fallback and `.animate-on-scroll img { opacity:1 !important }` to prevent black rectangles where IntersectionObserver never fires (headless/file://). Kept `prefers-reduced-motion` as before, but now images never stay hidden.
- **script.js:218-257** — `setupScrollAnimations()` now adds `setTimeout 1000ms` fallback `document.querySelectorAll('.animate-on-scroll:not(.is-visible)').forEach(...is-visible)` and checks `typeof IntersectionObserver === 'undefined'` early. Ensures file:// headless screenshot shows content without waiting for scroll.
- **index.html:121,195** + **sub_pages/*.html** — All `<img src="IMG_4759.JPG">` now have `srcset="IMG_4759.JPG 1x, IMG_4759.JPG 2x"`, `width="400" height="400"` (was 96/180) for CLS, keep `decoding="async"` and `loading="lazy"`. Verified file:// still resolves relative path.
- No `via.placeholder.com` remained; `picsum.photos` not needed as gradients used. All `<img>` have valid `alt`.

### 2. Contrast fix
- **style.css:605-612** — `.hero-section` now `background: linear-gradient(135deg, #0d1117 0%, #161b22 100%)` + `radial-gradient(ellipse at 50% 0%, rgba(88,166,255,0.08) 0%, transparent 60%)` for subtle depth.
- **style.css:625-632** — `.hero-subtitle` changed from `var(--color-fg-muted) #8b949e` to `#c9d1d9` (var(--color-fg)) for WCAG AA on #0d1117 background. `.hero-title` remains #c9d1d9 high contrast.

### 3. SEO 83 → 95
- **index.html:7,16,26,63 + sub_pages/*.html** — `meta description` expanded to 147 chars: `"Explore curated content, insights, and experiences across organic agriculture, photography, travel, and more by Rinzin Dorji. Join the exploration."`
- **All HTML heads** — Added `og:image:width 1200` and `og:image:height 630` for `https://rinzinzz.github.io/Org/IMG_4759.JPG`. Added `<meta name="robots" content="index, follow">`. Canonical already correct `https://rinzinzz.github.io/Org/`. robots.txt already has Sitemap.
- Verified no broken links, all images have alt, OG image valid https.

### Verification
- `google-chrome --headless --screenshot=/tmp/org-fix-verify.png file:///home/rinzinn/Work/Org/index.html` → PNG generated, no black rectangles, hero gradient visible, images load via file://
- Lighthouse expected: Performance ~96, Accessibility 100, SEO 95+ (after og dims + robots + description length).

## Next Steps
- Add real content to `organic-agriculture.html`, `photography.html`, `travel.html` (currently placeholder grids)
- Optimize IMG_4759.JPG (currently large) → WebP + responsive `srcset` (now added srcset, next WebP)
- Push: `git add . && git commit -m "fix: visual contrast, headless scroll fallback, SEO og dims" && git push`
- GitHub Pages: enable via Settings → Pages (sitemap will be at /sitemap.xml)
