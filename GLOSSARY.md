---
title: Glossary
description: Terms used across this documentation, including Dutch and English equivalents.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Glossary

Shared vocabulary. Add a term the moment you catch yourself explaining it for the second
time, and note the Dutch equivalent where client-facing conversations use it.

## Ways of working

| Term | Meaning |
| --- | --- |
| ADR | Architecture Decision Record. A one-page note explaining why a choice was made. See [09-decisions](09-decisions/). |
| Definition of done | The bar a task must clear before it counts as finished. See [the handbook](01-handbook/definition-of-done.md). |
| Runbook | Step-by-step instructions for fixing a specific broken thing. See [06-runbooks](06-runbooks/). |
| Aftercare | Ongoing maintenance and support after launch. Dutch: _onderhoud_. |
| Intake | The first phase, turning a request into a defined project. |

## Environments

| Term | Meaning |
| --- | --- |
| Local | Your own machine. Nothing here is ever authoritative. |
| Staging | A copy of production for testing and client review. Never indexed by search engines. |
| Production | The live site. Dutch: _live_ or _productieomgeving_. |
| Cutover | The moment traffic moves from the old site to the new one. |

## Technical

| Term | Meaning |
| --- | --- |
| Core Web Vitals | Google's page experience metrics: LCP, INP, CLS. See [performance budget](02-standards/performance-budget.md). |
| HPOS | High-Performance Order Storage. WooCommerce orders in dedicated tables rather than posts. |
| UX Builder | The Flatsome page builder. See [03-platforms/flatsome](03-platforms/flatsome/). |
| HubDB | HubSpot's structured data tables. |
| SPF / DKIM / DMARC | DNS records proving mail is legitimately sent on a domain's behalf. See [email deliverability](04-infrastructure/email-deliverability.md). |
| TTL | Time To Live. How long a DNS record may be cached — the reason DNS changes are not instant. |

## Legal and commercial

| Term | Meaning |
| --- | --- |
| AVG | _Algemene verordening gegevensbescherming_ — the Dutch name for the GDPR. |
| BTW | _Belasting toegevoegde waarde_ — Dutch VAT. |
| EU OSS | One Stop Shop. EU-wide VAT reporting scheme for cross-border sales. |
| Processor agreement | Contract governing personal data we process for a client. Dutch: _verwerkersovereenkomst_. |
| SLA | Service Level Agreement. Response and resolution times we commit to. |
| Scope change | Work outside the agreed brief. Dutch: _meerwerk_. |
