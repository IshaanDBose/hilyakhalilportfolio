# CLAUDE.md

This is Hilya Khalil's design portfolio (hilya.me), migrated from Framer to hand-written static HTML/CSS/JS.
It is maintained by two non-specialists, so keep it simple. Read README.md for the layout of the repo.

## Rules
- No frameworks, bundlers, package.json, or build step. Every file is served as-is.
- One shared stylesheet: `assets/css/styles.css`. Reuse its tokens (`--ink`, `--accent`, …) and its case-study components (section 7) before writing new CSS. Page-only tweaks go in `assets/css/pages/<page>.css`.
- Header, footer and `<head>` are duplicated in every page on purpose (no templating). When changing them, change **all** `.html` files plus `_template-case-study.html`.
- Use relative links (`about`, `assets/...`) so the site works both on hilya.me and on a github.io preview. `404.html` is the exception: it uses absolute paths.
- Keep URLs stable: page filenames are the URLs (`srx.html` → `/srx`). Don't rename them.
- Images: WebP, max 2400px wide, in `assets/img/<page>/`. Always set `width`, `height`, and meaningful `alt`. Add `loading="lazy" decoding="async"` below the first screen.
- Videos: H.264 MP4 without audio, plus a `-poster.webp`, with the `data-autoplay muted loop playsinline preload="none"` attributes (main.js plays them when visible).
- Keep the author's copy verbatim unless asked to edit it.
- Semantic HTML: one `<h1>` per page, sections with headings, real lists.

## Workflow
- Preview: `python3 tools/serve.py` (port 8080; mimics GitHub Pages' extensionless URLs).
- Check visuals: `python3 tools/compare.py <page> --width 1440 --width 390`, then look at `tools/out/compare/`.
- Check at 1440px and 390px; there must be no horizontal scrolling on phones.
- When adding a page, also update the Work grid in `index.html` and `sitemap.xml`.
- If the homepage changes noticeably, regenerate the share image with `node tools/og-image.js`.
- Deploy is automatic on push to `main` (`.github/workflows/deploy.yml`).
