# Hilya Khalil — Portfolio

Source for [hilya.me](https://www.hilya.me): Hilya Khalil's product design portfolio.
It's plain HTML, CSS and a little JavaScript, with no framework and no build step. Edit a file, push, and the site updates.

## What's where

```
index.html               Home: intro + Work grid
about.html               About me
sales-rules-v2.html      Case study: Sales Rules        → hilya.me/sales-rules-v2
mp-v2.html               Case study: Marketplace v2     → hilya.me/mp-v2
srx.html                 Case study: SRx Tracker        → hilya.me/srx
healthian.html           Case study: Healthian          → hilya.me/healthian
404.html                 "Page not found"
_template-case-study.html  Starting point for a new case study (not published)

assets/css/styles.css    All shared styles (colours, fonts, layout, components)
assets/css/pages/        Small extra styles for individual case studies
assets/js/main.js        Header hide/show, video autoplay, image zoom, carousels
assets/js/analytics.js   Google Analytics (only runs on hilya.me)
assets/img/<page>/       Images, grouped by page (WebP)
assets/img/shared/       Decorative shapes used on several pages
assets/video/            Videos + their poster images
assets/fonts/            Alcyone + Satoshi web fonts

tools/                   Preview server, screenshot + comparison scripts
reference/               Screenshots of the original Framer site (for comparison)
```

## Preview locally

```sh
python3 tools/serve.py        # then open http://localhost:8080
```

Use this server rather than opening the files directly: it maps `/about` to `about.html`, the same way the live site does.

## Common edits

**Change text.** Open the page's `.html` file, find the sentence, and edit it. Highlighted phrases are wrapped in `<mark>…</mark>`.

**Swap an image.** Put the new file in `assets/img/<page>/` and update the `src`, `width`, `height` and `alt` on the `<img>`.
To convert a PNG or JPEG to WebP at a sensible size:

```sh
python3 -c "from PIL import Image; im=Image.open('in.png'); im.thumbnail((2400, 9999)); im.save('out.webp', quality=84)"
```

**Add a case study.**
1. Copy `_template-case-study.html` to `<slug>.html` and fill in the `TODO`s. Look at `healthian.html` for a full example.
2. Add a card to the Work list in `index.html` (copy an existing `<li class="work-card">`).
3. Add the URL to `sitemap.xml`.

**Change colours or fonts.** These are defined once, at the top of `assets/css/styles.css` (section 2, "Tokens").

## Checking changes against the original

`reference/` holds full-page screenshots of the original Framer site at 1440px, 1100px and 390px widths.
To capture the local site and place it side by side with the reference:

```sh
python3 tools/serve.py &
python3 tools/compare.py about --width 1440      # or no arguments for every page at every width
# → tools/out/compare/about-1440.png
```

Once the Framer site is retired, the reference screenshots are just a historical record; delete them whenever you like.

## Publishing

`.github/workflows/deploy.yml` publishes the site to GitHub Pages on every push to `main`.

One-time setup:
1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
   GitHub Pages on a *private* repository requires a paid GitHub plan (Pro/Team). For a free option, make the repo public, or connect it to Cloudflare Pages or Netlify instead. Both are free, both work with private repos, and neither needs a build command (output directory: the repo root).
2. Merge to `main`. The site appears at `https://<user>.github.io/<repo>/`, which is useful for checking before switching the domain.

   Note: on that `github.io` address the site lives in a sub-folder, so the 404 page's styling won't load there. Everything else works because the pages use relative links. This goes away once the custom domain is set.

### Moving hilya.me from Framer

Do this only after checking the new site on its preview URL.

1. In the repo, add a file named `CNAME` containing the single line `www.hilya.me`, and push it.
2. **Settings → Pages → Custom domain:** `www.hilya.me`. Tick **Enforce HTTPS** once it's available.
3. At the domain registrar, change the DNS records (remove the Framer ones):
   - `www` → **CNAME** → `<github-username>.github.io`
   - apex `hilya.me` → **A** records `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
4. Wait for DNS to update (minutes to a few hours), check the site, then unpublish or cancel the Framer site.

The page URLs (`/about`, `/srx`, …) are unchanged, so existing links keep working.

## Notes

- **Fonts:** Alcyone is a commercial typeface that was uploaded to Framer. Check that its licence allows self-hosting it as a web font. If it doesn't, buy a web licence or switch `--font` in `styles.css` to another typeface. Satoshi is free (Fontshare licence).
- **Analytics:** uses the same Google Analytics property as the Framer site (`G-D527QLTT71`). It only loads on `hilya.me`, so local previews aren't counted.
