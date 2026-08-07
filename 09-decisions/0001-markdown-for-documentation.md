---
title: 0001 — Markdown in git for documentation
description: Documentation lives as Markdown files in this repository rather than in a hosted wiki tool.
status: current
owner: bjorn
updated: 2026-08-07
---

# 0001 — Markdown in git for documentation

- **Status:** Accepted
- **Date:** 2026-08-07
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

No site generator for now. Files are browsable directly on GitHub with no build step.

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

### GitHub wiki

Free and attached to the repository, but a separate git repository behind the scenes, with no
pull request review and no folder hierarchy. Loses the main advantage of keeping docs in
version control with the rest of the work.

## Consequences

**Good:** Documentation changes ship in the same pull request as the code change. Full
history and blame. No subscription. Editable in the same editor as everything else. Portable
to any generator later without moving a file.

**Bad:** No search beyond GitHub's, which is mediocre across a repository. No WYSIWYG, so
non-technical colleagues are effectively excluded from contributing. Images and diagrams are
more effort than in a hosted tool. The repository is public, which means a permanent
discipline around what may be committed.

**Revisit when:** the repo passes roughly 100 documents and finding things becomes the
complaint, or when someone outside the development team needs to edit regularly. The first
case means adding MkDocs Material; the second means reconsidering the format entirely.
