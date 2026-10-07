# CLAUDE.md — The Weekend Engineering Digest

Static Astro site for **digest.pradnya.dev**, deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`. The site's RSS feed (`/rss.xml`) is read
by pradnya.dev, which lists every issue automatically — so **publishing an issue means pushing
one markdown file to `main`**. Nothing else needs editing week to week.

The "One-time setup" section of `README.md` is historical; the repo is initialised and deployed.

## The weekly issue

One file per issue: `src/content/issues/YYYY-MM-DD.md`, dated the Saturday it publishes.
Schema is enforced by `src/content.config.ts`:

```yaml
---
title: "One sentence that states the week's through-line, not a list"
date: 2026-10-03
dek: "One sentence naming each item with its single most concrete fact. Shown on the archive and in RSS."
readingTime: "5 min"
---
```

Body structure (see `2026-10-03.md` as the reference):

1. **Opening paragraph** (2–4 sentences) that names the pattern connecting the items. No greeting.
2. `---` separator, then **four to six items**, each:
   - `## ` headline that makes a claim ("Git 2.56 learns when to stop searching for merge bases"),
     not a product name.
   - Two paragraphs, ~150–200 words total. First: what they built and the numbers they published.
     Second: the tradeoff, the stated limits, and what is worth copying or studying.
   - A final line `[source →](https://…)` linking the primary post.
   - `---` between items.
3. `## Sources` — numbered list: `[Post title](url) — Outlet, Mon D, YYYY`.

Target ~1,000 words total. `wc -w` on the file should land between 900 and 1,150.

## Voice and selection

- **Primary sources only**: engineering blogs (Cloudflare, GitHub, Uber, Netflix, Stripe, Meta,
  Discord, Figma, Anthropic, OpenAI, Google, …), papers, release notes. No aggregators, no
  listicles, no vendor launch copy without a measured claim.
- Every item needs **a number someone had to defend or a constraint they chose**: latency, a
  quota, a speedup, a default that is off. If a post gives no figures, say so explicitly.
- Prefer posts published in the seven days before the issue date. Older is allowed if it is the
  best thing that surfaced that week, but say when it was published.
- Plain declarative sentences. No em-dashes in body prose (they are fine in the `dek`).
  No "in this issue", no hype adjectives, no exclamation marks. Commentary is allowed and
  expected: say which part is worth copying and which claim is thin.
- Across the issue, mix topics: distributed systems, architecture, AI infrastructure / agents,
  platform and reliability. Avoid two items from the same company unless both are strong.

## Publish checklist (every issue, in this order)

```bash
cd ~/code/eng-digest
git checkout main && git pull --ff-only
# write src/content/issues/YYYY-MM-DD.md
npm run build                                  # fails on bad frontmatter — fix before committing
git add src/content/issues/YYYY-MM-DD.md       # stage only the issue file
git commit -m "Add weekend digest issue for YYYY-MM-DD"
git push
gh run watch --exit-status $(gh run list --workflow deploy.yml --limit 1 --json databaseId --jq '.[0].databaseId')
curl -s https://digest.pradnya.dev/rss.xml | grep -c "issues/YYYY-MM-DD"   # must print 1
```

The run is not done until the last two commands succeed. A green build with no push, or a push
with a failed deploy, is a failed week — report it rather than calling it done. `dist/` and
`node_modules/` are build outputs; never commit them.
