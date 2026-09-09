---
title: Rubberplants — Web Development Documentation
description: The shared knowledge base for how Rubberplants builds, ships, and maintains websites.
status: draft
owner: bjorn
updated: 2026-09-09
---

The shared knowledge base for how Rubberplants builds, ships, and maintains websites.
Everything here is Markdown, versioned in git, and reviewed through pull requests.

> [!WARNING]
> **This repository is public.** It is the org GitHub Pages repo, so anything committed here
> is world-readable. No credentials, no client-specific configuration, no staging URLs,
> no server addresses. Client material belongs in the private documentation repo.
> See [Accounts and access](01-handbook/accounts-and-access.md).

## Start here

New to the team? Read in this order:

1. [Ways of working](01-handbook/ways-of-working.md)
2. [Onboarding a new developer](01-handbook/onboarding-new-developer.md)
3. [Git workflow](02-standards/git-workflow.md)
4. [Development workflow](05-workflows/development-workflow.md)
5. The platform section for whatever you are building — [WordPress](03-platforms/wordpress/), [WooCommerce](03-platforms/woocommerce/), [HubSpot](03-platforms/hubspot/)

[Start with Ways of working](01-handbook/ways-of-working.md){: .btn .btn-primary}
[How to contribute](CONTRIBUTING.md){: .btn .btn-secondary}

## Sections

| Section | What is in it |
| --- | --- |
| [01-handbook](01-handbook/) | How the agency works. People, tools, process. |
| [02-standards](02-standards/) | How we write code. The opinionated rules. |
| [03-platforms](03-platforms/) | Per-stack knowledge: WordPress, Flatsome, WooCommerce, HubSpot, front end. |
| [04-infrastructure](04-infrastructure/) | Hosting, DNS, Cloudflare, mail, backups, monitoring. |
| [05-workflows](05-workflows/) | The project lifecycle, from intake to aftercare. |
| [06-runbooks](06-runbooks/) | Something is broken. Do exactly this. |
| [07-snippets](07-snippets/) | Reusable code with the context needed to use it. |
| [08-templates](08-templates/) | Copyable documents and checklists. |
| [09-decisions](09-decisions/) | Architecture decision records. Why we chose what we chose. |

Also: [Glossary](GLOSSARY.md) · [Contributing](CONTRIBUTING.md)

## Conventions in one paragraph

One topic per file, `kebab-case.md`, under roughly 300 lines — split rather than let a file
sprawl. Every folder has a `README.md` acting as its index. Every document starts with YAML
frontmatter carrying a `status` and an `updated` date, because a docs repo without those
rots quietly. Links between documents are relative so they work both on GitHub and in a
generated site. Full rules in [CONTRIBUTING.md](CONTRIBUTING.md).

## Document status

| Status | Meaning |
| --- | --- |
| `draft` | Being written. Do not rely on it. |
| `review` | Complete but awaiting a second pair of eyes. |
| `current` | Accurate and authoritative. |
| `deprecated` | Kept for history. Says at the top what replaced it. |

Most of this repo is currently `draft` — it was scaffolded on 2026-08-07 and is being
filled in.

## Publishing

This is plain Markdown with no build step of its own. GitHub Pages publishes it with
Jekyll straight from `main`, using a small custom layout in `_layouts/`. The files are still
browsable on GitHub exactly as before. Search is still GitHub's — see
[ADR 0001](09-decisions/0001-markdown-for-documentation.md) for when that becomes worth
revisiting.
