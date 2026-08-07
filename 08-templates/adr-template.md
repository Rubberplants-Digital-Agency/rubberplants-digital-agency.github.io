---
title: "Template: architecture decision record"
description: Starting point for a new ADR in 09-decisions.
status: current
owner: bjorn
updated: 2026-08-07
---

# Template: architecture decision record

Copy everything below the line into `09-decisions/NNNN-short-slug.md`, then add a row to the
[decisions index](../09-decisions/README.md).

Keep it to one page. An ADR that takes an hour to write does not get written.

---

```markdown
---
title: NNNN — <The decision, stated as a decision>
description: <One sentence.>
status: current
owner: <one name>
updated: <YYYY-MM-DD>
---

# NNNN — <The decision>

- **Status:** Proposed | Accepted | Superseded by [NNNN](NNNN-slug.md) | Deprecated
- **Date:** <YYYY-MM-DD>
- **Deciders:** <names>

## Context

<What situation forced a choice? Constraints, budget, team size, existing commitments.
Write this so it still makes sense to someone who was not there.>

## Decision

<What we are doing. One paragraph, stated plainly and in the present tense.>

## Alternatives considered

### <Alternative A>

<What it was, and the specific reason it lost. "Too complex" is not a reason — say what
about it was too complex and for whom.>

### <Alternative B>

<Same.>

## Consequences

**Good:** <What this buys us.>

**Bad:** <What this costs us. Be honest — an ADR with no downsides was not a real decision.>

**Revisit when:** <The concrete trigger that would make us reconsider. Team size, client
count, a version release, a price change.>
```
