---
title: Assets
description: Images and diagrams used across the documentation.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Assets

| Folder | Contents |
| --- | --- |
| [images/](images/) | Screenshots and photographs. |
| [diagrams/](diagrams/) | Architecture and flow diagrams. |

## Rules

- Name files for what they show: `deployment-flow.svg`, not `diagram-2-final.png`.
- Prefer SVG for diagrams. It stays sharp and diffs meaningfully in git.
- Better still, draw diagrams in Mermaid inside the Markdown itself — GitHub renders it, and
  it needs no export step when the process changes.
- Compress screenshots before committing. This repo should not be carrying megabytes of PNG.
- **Check every screenshot for client data, real customer details, URLs, and credentials
  before committing.** This repository is public, and a screenshot leaks more than a
  paragraph does.
