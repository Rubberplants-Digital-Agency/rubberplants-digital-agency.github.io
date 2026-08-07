---
title: Platforms
description: Per-stack technical knowledge.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Platforms

The deepest section of the repo, and the one that grows fastest. Each subfolder covers one
stack: how we set it up, the conventions we follow, and the traps that generic knowledge of
that platform gets wrong.

| Platform | Covers |
| --- | --- |
| [WordPress](wordpress/) | Local setup, theme structure, plugins, fields, blocks, WP-CLI, maintenance. |
| [Flatsome](flatsome/) | UX Builder, custom elements, template overrides, version-specific traps. |
| [WooCommerce](woocommerce/) | Products, checkout and payments, tax, emails, performance. |
| [HubSpot](hubspot/) | CMS projects, modules, HubDB, forms, serverless functions. |
| [Front end](frontend/) | SCSS architecture, animation, build tooling, API integrations. |

## Where does this belong?

- A rule everyone follows regardless of platform → [Standards](../02-standards/).
- Something about servers, DNS, or mail → [Infrastructure](../04-infrastructure/).
- A fix for a broken production site → [Runbooks](../06-runbooks/).
- Platform knowledge, conventions, and gotchas → here.
