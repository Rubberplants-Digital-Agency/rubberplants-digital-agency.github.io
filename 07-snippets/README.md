---
title: Snippets
description: Reusable code with the context needed to use it safely.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Snippets

Code we keep reaching for. The value is not the code — it is the header comment explaining
why it exists and where it has already been proven.

| Folder | Contents |
| --- | --- |
| [php/](php/) | Hooks, filters, template functions, WordPress and WooCommerce snippets. |
| [js/](js/) | Front-end utilities and integrations. |
| [scss/](scss/) | Mixins, tokens, component partials. |
| [wp-cli/](wp-cli/) | Maintenance and migration commands. |
| [server-config/](server-config/) | nginx, Apache, and redirect fragments. |

## Rules

**Every snippet gets a header comment.** No exceptions — an undocumented snippet is a
liability, because the next person cannot tell whether it is safe to paste in.

```php
<?php
/**
 * Hide the shipping address fields for local pickup orders.
 *
 * Why:    Customers were filling in an address for pickup and then querying the
 *         shipping cost line on the invoice.
 * Where:  Proven on two WooCommerce shops since March 2026.
 * Needs:  WooCommerce 8.0+, a shipping method with the ID local_pickup.
 * Watch:  Runs on the classic checkout only. The checkout block needs a different hook.
 */
```

The four lines that matter: **Why** it exists, **Where** it is already running, what it
**Needs**, and what to **Watch** out for.

Beyond that: one snippet per file, named for what it does rather than where it came from,
and never a client name, key, or hostname in the code. If a snippet gets used on every
project, it has outgrown this folder — promote it into the base theme or a shared plugin
and delete it here.
