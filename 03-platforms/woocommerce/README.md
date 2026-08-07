---
title: WooCommerce
description: Products, checkout, tax, emails, and shop performance.
status: draft
owner: bjorn
updated: 2026-08-07
---

# WooCommerce

Everything shop-specific. WordPress conventions still apply — see
[WordPress](../wordpress/) — this folder covers what changes once there is money involved.

| Document | What it covers |
| --- | --- |
| [Product data model](product-data-model.md) | Product types, variations, attributes, stock. |
| [Checkout and payments](checkout-and-payments.md) | Providers, iDEAL, checkout fields, refunds. |
| [Shipping and tax](shipping-and-tax.md) | Zones, carriers, BTW, EU OSS. |
| [Transactional emails](emails.md) | Which mail fires when, templating, deliverability. |
| [WooCommerce performance](performance.md) | Caching rules, query pitfalls, HPOS, load testing. |
| [Store API and blocks](store-api-and-blocks.md) | Cart and checkout blocks, extending the API. |

> [!CAUTION]
> Two things that cause real damage: caching the cart or checkout, and testing payment flows
> against live credentials. Both are covered in the documents above — read them before you
> touch a live shop.

Related: [Email deliverability](../../04-infrastructure/email-deliverability.md) and
[GDPR and AVG](../../04-infrastructure/gdpr-avg.md) for order data retention.
