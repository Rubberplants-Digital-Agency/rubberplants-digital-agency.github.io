---
title: Runbooks
description: Something is broken. Do exactly this.
status: draft
owner: bjorn
updated: 2026-08-07
permalink: /06-runbooks/
---

Written to be followed under pressure, by someone who may never have touched this platform
before. Numbered imperative steps, no theory, no build-up. If you need to understand *why*
the system works the way it does, read [Infrastructure](../04-infrastructure/) — but not
while the site is down.

| Runbook | When to open it |
| --- | --- |
| [Site is down](site-down.md) | Site unreachable or throwing a server error. |
| [Hacked site recovery](hacked-site-recovery.md) | Defacement, injected content, malware warning. |
| [Restore from backup](restore-from-backup.md) | You need a previous state back. |
| [Roll back a deploy](rollback-a-deploy.md) | A release broke production. |
| [Change DNS safely](dns-change-safely.md) | Before touching a zone, not after. |
| [A WordPress update broke the site](wp-update-broke-the-site.md) | Fatal error after core, theme, or plugin update. |
| [Site email is not arriving](email-not-sending.md) | Form or order mail missing. |
| [SSL certificate expired](ssl-expired.md) | Browser warning, HTTPS failing. |

## The shape of a runbook

Every one follows the same five headings: **Symptoms**, **Impact**, **Steps**, **Verify**,
**Prevent**. Keep it that way — familiarity of shape is the point when you are stressed.

## After an incident

Two things, both while it is fresh:

1. Update the runbook you just used with whatever it failed to tell you.
2. Fill in the **Prevent** section honestly. A runbook you need twice is a system problem,
   not a documentation problem.
