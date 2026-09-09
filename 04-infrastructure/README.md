---
title: Infrastructure
description: Hosting, DNS, mail, backups, and monitoring.
status: draft
owner: bjorn
updated: 2026-08-07
permalink: /04-infrastructure/
---

Everything underneath the site. Written as general practice — specific hosts, zones, and
credentials for individual clients stay in the private repo.

| Document | What it covers |
| --- | --- |
| [Hosting providers](hosting-providers.md) | Which host for which project type, and who holds the contract. |
| [Domains and DNS](domains-and-dns.md) | Registrars, the standard record set, transfers. |
| [Cloudflare](cloudflare.md) | Zone config, cache rules, WAF, bot protection. |
| [SSL certificates](ssl.md) | Issuing, renewal, chain problems, mixed content. |
| [Email deliverability](email-deliverability.md) | SPF, DKIM, DMARC, transactional providers. |
| [Backups and restore](backups-and-restore.md) | Schedule, retention, and how to actually get data back. |
| [Staging environments](staging-environments.md) | Standing one up and keeping it in sync. |
| [Monitoring and uptime](monitoring-and-uptime.md) | Alerting, and who gets woken up. |
| [GDPR and AVG](gdpr-avg.md) | Consent, processor agreements, retention, breach procedure. |

> [!IMPORTANT]
> Two rules that are not negotiable: domains stay in the client's ownership, and a backup
> that has never been restore-tested is not a backup.

When something here is on fire, go to [Runbooks](../06-runbooks/) instead — these documents
explain the system, the runbooks tell you what to press.
