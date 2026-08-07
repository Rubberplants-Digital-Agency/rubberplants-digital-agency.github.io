---
title: Flatsome
description: UX Builder, custom elements, and the traps generic WordPress knowledge misses.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Flatsome

Our default WooCommerce theme. Flatsome has version-specific behaviour — load order,
builder registration timing, template resolution — that general WordPress knowledge gets
wrong, which is why this folder exists separately.

| Document | What it covers |
| --- | --- |
| [UX Builder](ux-builder.md) | How builder content is stored and what breaks when it moves. |
| [Custom UX Builder elements](custom-elements.md) | Registering our own elements. |
| [Template overrides](template-overrides.md) | Overriding parent templates from the child theme. |
| [Flatsome gotchas](gotchas.md) | The traps. Read this before your first Flatsome build. |
| [Version notes](version-notes.md) | What changed per version and what it broke. |

> [!TIP]
> Before debugging anything unexpected in a Flatsome build, check
> [gotchas](gotchas.md) — it is usually already in there.

Related: [WordPress theme structure](../wordpress/theme-structure.md),
[child themes](../wordpress/child-themes.md), and
[SCSS architecture](../frontend/scss-architecture.md) for styling that has to fight theme
defaults.
