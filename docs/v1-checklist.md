# v1 Checklist — Cloudflare-only migration + SEO/security/a11y hardening

Snapshot of the work that moved the site from dual-hosting (GitHub Pages
`resume.jkdev.app` + Cloudflare `jordankowal.com`) to **Cloudflare only**, and
brought it up to the standard set by the sibling `camcam` project.

Canonical domain: **`https://www.jordankowal.com`** (apex 301 → www at Cloudflare).

---

## 1. Decommission GitHub Pages (in repo)

- [x] Deleted `.github/workflows/deploy.yml` (GitHub Pages deploy job)
- [x] Deleted `CNAME` (`resume.jkdev.app` custom-domain marker)
- [x] Kept `.github/workflows/qa.yml` (Biome + tsc on PRs)
- [x] Removed `jordan-kowal.github.io` references in source
  - `src/assets/externalAssets.ts` → `/logo.png`
  - `src/features/projects/constants.ts` → personal-website website now `https://www.jordankowal.com`
  - `README.md` logo `<img>` → `https://www.jordankowal.com/logo.png`
  - Left `discord-dice-roller` on github.io (separate, deprecated project)

> The original `jordan-kowal.github.io/assets/jkdev/` favicon + logo URLs were
> already dead (404). They are now self-hosted (see §3).

## 2. SEO (in repo)

- [x] `<title>`, `<meta description>`, `<meta theme-color>`
- [x] Canonical URL (`index.html`)
- [x] Open Graph tags (type, site_name, url, title, description, image 1200×630, locale)
- [x] Twitter Card (`summary_large_image`)
- [x] JSON-LD `Person` schema — `src/config/structuredData.ts`, injected via
      `src/components/meta/StructuredData.tsx` (`@solidjs/meta`, CSP-safe, no inline script)
- [x] `public/robots.txt` — allow indexing + AI search assistants; deny LLM-training crawlers & archivers
- [x] `public/sitemap.xml` — single homepage URL (expand if routes are added)

## 3. Branding assets (self-hosted in `public/`)

- [x] `favicon.ico` (16/32/48 multi-res), `favicon-16.png`, `favicon-32.png`
- [x] `apple-touch-icon.png` (180×180)
- [x] `icon-512.png` (JSON-LD logo), `logo.png`
- [x] `og-image.jpg` (1200×630, placeholder — swap for a real design later)

> "JK" monogram in the bumblebee palette (amber `#e0a82e` on navy `#181830`).

## 4. Security headers (in repo, applied by Cloudflare Pages)

`public/_headers`:

- [x] `X-Content-Type-Options`, `X-Frame-Options: DENY`, `Referrer-Policy`, `Permissions-Policy`
- [x] CSP with explicit allowlist:
  - `script-src 'self' https://cloud.umami.is`
  - `connect-src` Umami gateways + `https://github-contributions-api.jogruber.de` (GitHub Activity section)
  - `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`
  - `font-src 'self' https://fonts.gstatic.com`
  - `object-src 'none'`, `base-uri 'self'`, `form-action 'none'`, `frame-ancestors 'none'`
- [x] `public/_redirects` — SPA catch-all `/* /index.html 200`

## 5. Caching (`public/_headers`)

- [x] HTML: `max-age=300, must-revalidate`
- [x] `/assets/*`, `/images/*`, `/screenshots/*`, `/files/*`, icons, `og-image.jpg`, `logo.png`: `max-age=31536000, immutable`

> To update an immutable asset, **rename** it (e.g. `-v2`) rather than overwrite — see camcam `docs/caching.md`.

## 6. Accessibility (in repo)

- [x] Skip-to-content link (`App.tsx` → `#home`)
- [x] aria-labels on icon-only social links (Navbar `SocialLink`) and project links (`ProjectCard`)
- [x] Footer social links / Contact CTA already labelled

## 7. Analytics

- [x] Umami script in `index.html` (cookieless, GDPR-friendly), live `data-website-id`, domains `jordankowal.com,www.jordankowal.com`

---

## Out-of-repo follow-ups (dashboards)

- [x] GitHub → repo Settings → **Pages → source: None** (disable GitHub Pages)
- [x] Registrar/Cloudflare DNS: remove the `resume.jkdev.app` record after Pages is off
- [x] Cloudflare Pages build command `bun install && bun run build`, output `dist/`
- [x] Cloudflare: apex `jordankowal.com` → `www` 301 redirect (canonical matches)
- [x] Cloudflare hardening: SSL/TLS Full (strict), HSTS, Always Use HTTPS, min TLS, Bot Fight Mode, WAF, DNSSEC
- [ ] Replace placeholder `public/og-image.jpg` with a real design

## Verification (post-deploy)

- `curl -I https://www.jordankowal.com` → CSP + cache headers present
- [securityheaders.com](https://securityheaders.com) / [Mozilla Observatory](https://observatory.mozilla.org) → score check
- OG/Twitter card debuggers + Google Rich Results test (JSON-LD)
- Lighthouse: SEO / a11y / best-practices pass
