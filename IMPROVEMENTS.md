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

## Next Steps
- Add real content to `organic-agriculture.html`, `photography.html`, `travel.html` (currently placeholder grids)
- Optimize IMG_4759.JPG (currently large) → WebP + responsive `srcset`
- Push: `git add . && git commit -m "feat: improve Org site a11y, SEO, responsive, theme toggle" && git push`
- GitHub Pages: enable via Settings → Pages (sitemap will be at /sitemap.xml)
