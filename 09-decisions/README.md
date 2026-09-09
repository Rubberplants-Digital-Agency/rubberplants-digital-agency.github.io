---
title: Decisions
description: Architecture decision records — why we chose what we chose.
status: draft
owner: bjorn
updated: 2026-08-07
permalink: /09-decisions/
---

Short records of choices that closed off alternatives. The point is to stop the same debate
being reopened from scratch in two years, and to make it obvious when the reasoning behind a
decision has expired.

| ADR | Decision | Status |
| --- | --- | --- |
| [0001](0001-markdown-for-documentation.md) | Markdown in git for documentation | Accepted |

## When to write one

Write an ADR when a choice is **hard to reverse**, **affects more than one project**, or
**someone will ask "why on earth did we do it this way"**. Picking a page builder, a payment
provider, a hosting default, a CSS methodology — those are ADRs. Naming a variable is not.

## How

1. Copy [the ADR template](../08-templates/adr-template.md).
2. Number it sequentially, four digits, never reused.
3. Name it `NNNN-short-slug.md`.
4. Add a row to the table above.
5. Open a pull request — the discussion on it is part of the record.

## Statuses

`Proposed` → `Accepted` → `Superseded` or `Deprecated`.

**Never rewrite or delete an accepted ADR.** Changing your mind means writing a new one that
supersedes it, and editing the old one to point forward. The wrong turns are the useful part.
