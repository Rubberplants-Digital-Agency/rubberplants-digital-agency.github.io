---
title: Standards
description: The opinionated rules every project follows.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Standards

This section is deliberately prescriptive. These are not suggestions — they are the bar
every project clears, and code review checks against them. Where a rule has a real
exception, the document says so explicitly rather than leaving it to judgement.

## Process

| Document | What it covers |
| --- | --- |
| [Git workflow](git-workflow.md) | Branching, commit format, pull requests, releases. |
| [Naming conventions](naming-conventions.md) | Files, classes, prefixes, database keys, media. |

## Code style

| Document | What it covers |
| --- | --- |
| [PHP code style](code-style-php.md) | Themes, plugins, snippets. |
| [JavaScript code style](code-style-js.md) | Modules, bundling, third-party scripts. |
| [SCSS code style](code-style-scss.md) | Partials, nesting depth, token usage. |

## Quality bars

| Document | What it covers |
| --- | --- |
| [Accessibility baseline](accessibility.md) | The conformance level we guarantee. |
| [Performance budget](performance-budget.md) | Core Web Vitals targets and page weight limits. |
| [SEO baseline](seo-baseline.md) | The technical SEO every site ships with. |
| [Security baseline](security-baseline.md) | Minimum posture for anything we build or host. |
| [Browser support](browser-support.md) | What we test and what we guarantee. |

If you disagree with a rule here, that is a legitimate conversation — open an
[ADR](../09-decisions/) rather than quietly doing it differently on one project.
