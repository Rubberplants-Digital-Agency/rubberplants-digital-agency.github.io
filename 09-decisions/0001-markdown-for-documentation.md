---
title: 0001 — Markdown in git for documentation
description: Documentation lives as Markdown files in this repository rather than in a hosted wiki tool.
status: current
owner: bjorn
updated: 2026-09-09
---

- **Status:** Accepted
- **Date:** 2026-08-07
- **Amended:** 2026-09-09 — published as a site with GitHub Pages. See *Publishing* below.
- **Deciders:** Bjorn

## Context

Agency knowledge was scattered across memory, chat history, and individual project notes.
The same questions were being answered repeatedly, and platform-specific traps kept being
rediscovered the expensive way. We needed one place for it, chosen before anything was
written rather than after.

The constraints: a small team, no appetite for another subscription, and documentation that
has to be editable by the same people in the same tools they already use for code. The
biggest risk with any documentation effort is not the format — it is abandonment.

## Decision

Documentation is Markdown files in this git repository. One topic per file, folder
`README.md` files as indexes, YAML frontmatter carrying `status` and `updated`, and changes
reviewed through pull requests like code.

The Markdown files are the source of truth. Anything that reads them — GitHub, a site
generator, an editor — is a view onto them and must stay replaceable.

## Publishing

*Amended 2026-09-09.* The original decision added "no site generator for now, files are
browsable directly on GitHub with no build step". That held for a month and then stopped
being enough: this is the org GitHub Pages repository, and leaving it unpublished meant the
documentation was only readable by people already inside GitHub, navigating a folder tree.

The repository is now published at <https://rubberplants-digital-agency.github.io> by
GitHub Pages, built with Jekyll from `main` / root ("Deploy from a branch"). Specifically:

- **No GitHub Actions workflow and no bundled theme.** The whole site is a `_config.yml`,
  one layout in `_layouts/`, one stylesheet, one small script, and a `_data/nav.yml` naming
  the nine sections.
- **Sidebar navigation and search.** The layout renders the full tree in a left sidebar and
  a search box in the header. The index at `/search.json` is generated from the pages
  themselves at build time, fetched by the browser on first use, and matched client-side —
  no plugin, no external search service, nothing to keep in sync.
- **No build step for a contributor.** Writing a document is still writing a Markdown file
  and opening a pull request. Push to `main` and the site rebuilds itself.
- **The folder structure is untouched.** One file moved: the root `README.md` became
  `index.md` so the homepage is a real page rather than a readme fallback, and a shorter
  `README.md` took its place as the repository landing page. Every folder `README.md` stayed
  where it was and carries a `permalink` so it publishes at its folder's URL.
- **One convention changed.** The site layout renders `title` as the page `<h1>`, so
  documents no longer repeat it as a heading in the body. `08-templates/` and
  `CONTRIBUTING.md` were updated to match.
- **Links still work in both places.** `jekyll-relative-links` rewrites the repository's
  relative `folder/file.md` links to their published URLs, so the same link resolves on
  GitHub and on the site.
- **The menu builds itself.** The layout collects each section's pages from the file tree,
  so a new document appears in the navigation with no separate index to update.

This is a view onto the Markdown, not a commitment to a platform. Deleting `_config.yml`,
`_layouts/`, `_data/` and `assets/css/` would leave the repository exactly as it was.

## Alternatives considered

### A hosted wiki (Notion, Confluence)

Better editing experience and search out of the box. Rejected because documentation would
live away from the code it describes, so it could not be updated in the same pull request as
the change that made it stale — the single most reliable mechanism for keeping docs true.
Also another subscription, another export problem, and no meaningful diff or review.

### A static site generator from day one

MkDocs Material or Astro Starlight would give search and navigation immediately. Rejected as
premature: it adds a build step and a deployment to debug before there is any content worth
searching. The structure chosen here is compatible with all of them, so this is deferred, not
foreclosed.

*2026-09-09:* half-adopted, in the cheapest form available. Jekyll on GitHub Pages was
already there — no Action to maintain, no dependency to install, no build to run locally
before committing — so it costs approximately nothing and answers the navigation half of the
problem. It does not answer the search half. A generator with real search remains the option
under *Revisit when* below.

### GitHub wiki

Free and attached to the repository, but a separate git repository behind the scenes, with no
pull request review and no folder hierarchy. Loses the main advantage of keeping docs in
version control with the rest of the work.

## Consequences

**Good:** Documentation changes ship in the same pull request as the code change. Full
history and blame. No subscription. Editable in the same editor as everything else. Portable
to any generator later without moving a file.

**Bad:** Search is shallow. The generated index covers every page's title, description and
roughly its first 1,400 characters — enough to find the right document, not enough to find a
phrase buried deep in a long one. No WYSIWYG, so non-technical colleagues are
effectively excluded from contributing. Images and diagrams are more effort than in a hosted
tool. The repository is public, which means a permanent discipline around what may be
committed — and now doubly so, because it is also a published website rather than a folder
someone has to go looking for.

**Revisit when:** the shallow index stops being good enough — someone searching for a phrase
they know is in the docs and not finding it — or when someone outside the development team
needs to edit regularly. The first case means full-text search, either by indexing whole
pages or by moving to a generator that ships it (MkDocs Material, Astro Starlight); either
would replace the Jekyll layer described above without moving a single Markdown file. The
second means reconsidering the format entirely.
