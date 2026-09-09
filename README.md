# Rubberplants — Web Development Documentation

The shared knowledge base for how Rubberplants builds, ships, and maintains websites.
Everything here is Markdown, versioned in git, and reviewed through pull requests.

**Published at <https://rubberplants-digital-agency.github.io>** — the homepage lives in
[index.md](index.md), not in this file.

> [!WARNING]
> **This repository is public.** It is the org GitHub Pages repo, so anything committed here
> is world-readable. No credentials, no client-specific configuration, no staging URLs,
> no server addresses. Client material belongs in the private documentation repo.
> See [Accounts and access](01-handbook/accounts-and-access.md).

## Reading the documentation

Start at [index.md](index.md), or browse the sections directly:
[01-handbook](01-handbook/) ·
[02-standards](02-standards/) ·
[03-platforms](03-platforms/) ·
[04-infrastructure](04-infrastructure/) ·
[05-workflows](05-workflows/) ·
[06-runbooks](06-runbooks/) ·
[07-snippets](07-snippets/) ·
[08-templates](08-templates/) ·
[09-decisions](09-decisions/)

Also: [Glossary](GLOSSARY.md) · [Contributing](CONTRIBUTING.md)

## Writing documentation

Read [CONTRIBUTING.md](CONTRIBUTING.md) first. In short: one topic per file, `kebab-case.md`,
YAML front matter with `title`, `description`, `status`, `owner` and `updated`, and a link
from the folder's `README.md`.

The site layout renders `title` as the page `<h1>`, so documents do not repeat it as a
heading in the body.

## How the site is published

GitHub Pages builds this repository with Jekyll straight from `main` / root
(Settings → Pages → *Deploy from a branch*). There is no GitHub Actions workflow and no
build step to run before committing — push to `main` and the site rebuilds.

| File | Purpose |
| --- | --- |
| `_config.yml` | Site settings, pretty permalinks, the layout default applied to every page. |
| `_data/nav.yml` | The header navigation: Home plus the nine numbered sections. Each section's dropdown is built from the file tree, so a new document appears in the menu on its own. |
| `_layouts/default.html` | The only layout: header, sidebar, content. There is no bundled theme. |
| `assets/css/style.css` | All site styling. Plain CSS, no framework. |
| `search.json` | The search index, generated from the pages at build time. Nothing to maintain. |
| `assets/js/search.js` | Header search and the mobile menu. The only JavaScript on the site. |

This file is listed under `exclude` in `_config.yml`, so it is the repository landing page
only — it is not published as a site page.

## Previewing locally

Requires Ruby and Bundler.

```bash
bundle install
bundle exec jekyll serve
```

Then open <http://localhost:4000>. The `github-pages` gem in the [Gemfile](Gemfile) pins the
same Jekyll and plugin versions GitHub Pages uses, so a local preview matches production.

Add `--livereload` to reload the browser on save, or `--incremental` for faster rebuilds
while editing a single page.
