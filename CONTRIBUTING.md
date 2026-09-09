---
title: Contributing to the documentation
description: How to write, review, and land a change to this documentation.
status: draft
owner: bjorn
updated: 2026-09-09
permalink: /contributing/
---

## The rule that matters most

**This repo is public.** Before every commit, ask whether the line you just wrote would be
fine on a billboard. Never commit:

- passwords, API keys, tokens, connection strings
- client names tied to technical detail, staging URLs, server hostnames or IPs
- database dumps, exports, screenshots containing real customer data
- licence keys

Write the general technique here. The client-specific application goes in the private repo.

## Writing a new document

1. Copy [08-templates/doc-template.md](08-templates/doc-template.md).
2. Put it in the section where a colleague would look for it, not where it was easiest to add.
3. Add a link to it in that folder's `README.md`. A file nobody links to is a file nobody reads.
4. Open a pull request. Documentation gets reviewed like code.

## Frontmatter

Every document starts with this block:

```yaml
---
title: Flatsome custom elements
description: Registering UX Builder elements from the child theme.
status: draft
owner: bjorn
updated: 2026-08-07
---
```

| Field | Rules |
| --- | --- |
| `title` | Sentence case. The site layout renders it as the page `<h1>`, so do not repeat it as a heading in the body. |
| `description` | One sentence. Shows up in search results and folder indexes. |
| `status` | `draft`, `review`, `current`, or `deprecated`. |
| `owner` | The person who keeps it accurate. One name, not a team. |
| `updated` | ISO date, `YYYY-MM-DD`. Bump it whenever the content actually changes. |

## Style

- **Write for the colleague who is stuck at 16:45 on a Friday.** Get to the answer fast.
- Second person, present tense, active voice. "Purge the cache", not "the cache should then be purged".
- Lead with the outcome, then the detail. Do not build up to the point.
- Code blocks always get a language tag.
- Explain *why*, not just *what*. The why is the part that cannot be rediscovered from the codebase.
- Absolute dates, never relative ones. "Since March 2026", not "recently".
- Link to related documents liberally, using relative paths.
- If a document passes ~300 lines, split it and turn the original into an index.

## Runbooks are different

A runbook is read under pressure. It follows a fixed shape — Symptoms, Impact, Steps,
Verify, Prevent — and the steps are numbered imperatives with no narrative. Anyone on the
team should be able to follow one on a platform they have never touched.

## Keeping it honest

- Changing how something works? The doc change goes in the same pull request as the code change.
- Found something out of date? Fix it, or set `status: draft` and say what is wrong. Do not leave it looking authoritative.
- Made a decision that closes off alternatives? Write an ADR in [09-decisions](09-decisions/README.md).

## Review

One reviewer. They check that it is accurate, findable, linked from its folder index, and
free of anything that should not be public.
