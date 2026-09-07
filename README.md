# The Weekend Engineering Digest

Static Astro site for **digest.pradnya.dev**. One markdown file per weekly issue, an archive
index, and an RSS feed. Deployed to GitHub Pages by GitHub Actions on every push to `main`.

```
src/content/issues/YYYY-MM-DD.md   one file per issue — this is the only thing you edit weekly
src/pages/index.astro              archive listing
src/pages/issues/[...id].astro     issue page template
src/pages/rss.xml.js               RSS feed
src/pages/about.astro              about page
src/styles/global.css              all styling (light + dark)
public/CNAME                       custom domain for GitHub Pages
.github/workflows/deploy.yml       build + deploy
```

## Local development

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs to dist/
```

---

## One-time setup

The repo is scaffolded but **not yet committed** — the sandbox couldn't finish the commit
(it can't delete files on the mounted folder, which git needs). Start clean:

### 1. Initialize git and commit

```bash
cd ~/code/eng-digest
rm -rf .git                       # clears a stuck index.lock and temp objects
git init -b main
git add -A
git commit -m "Weekend Engineering Digest: Astro site, RSS feed, first issue"
```

### 2. Create the GitHub repo and push

```bash
gh repo create eng-digest --public --source=. --remote=origin --push
```

Or create it in the web UI and:

```bash
git remote add origin git@github.com:pradnyaw25/eng-digest.git
git push -u origin main
```

### 3. Point GitHub Pages at Actions

Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.

This is required. The default ("Deploy from a branch") runs Jekyll and will not build Astro.

### 4. Add the DNS record

At your DNS provider, on the `pradnya.dev` zone:

| Type  | Name     | Value                    |
| ----- | -------- | ------------------------ |
| CNAME | `digest` | `pradnyaw25.github.io.`  |

Then Settings → Pages → **Custom domain** → `digest.pradnya.dev` → Save, and tick
**Enforce HTTPS** once the certificate is issued (usually minutes, occasionally up to an hour).

`public/CNAME` already contains the domain so the setting survives each deploy.

### 5. Link it from your main site

`pradnya.dev` currently says "Blog — Coming soon." Point it at `https://digest.pradnya.dev`.
That's a separate repo, so it's a manual edit there.

---

## Publishing an issue

Each Saturday the scheduled Claude task writes a new
`src/content/issues/YYYY-MM-DD.md`. To publish:

```bash
cd ~/code/eng-digest
git add -A && git commit -m "Issue: <date>" && git push
```

Actions builds and deploys in about a minute. Nothing else is required — the archive page and
RSS feed pick up the new file automatically.

Set `draft: true` in an issue's frontmatter to keep it out of the archive and feed while you
edit it.

### Frontmatter

```yaml
---
title: "Everyone is doing efficiency work again"
date: 2026-09-05
dek: "One or two sentences. Used on the archive page and as the RSS description."
readingTime: "5 min"
draft: false
---
```

---

## Adding email later

The RSS feed at `/rss.xml` is the integration point. [Buttondown](https://buttondown.com) can
watch it and send each new issue as an email, with the archive staying on this site. If you go
that route, two things to handle before the first send: a physical mailing address in the footer
and a working unsubscribe link — both are required by CAN-SPAM for commercial email, and a PO box
is fine.

## A note on sourcing

Each item summarizes and links to someone else's engineering writing. Keep summaries original and
substantially shorter than the source, always attribute and link, and don't reproduce long
excerpts — that's the line between commentary and republication.
