---
title: Roll back a deploy
description: Undoing a release that broke production.
status: draft
owner: bjorn
updated: 2026-10-07
---

> **Draft** — not authoritative yet.

Sites built from the WordPress stack kit: follow [Roll back](../05-workflows/wordpress-stack/deploy-and-roll-back.md#roll-back).

## Symptoms

_How you know this is the problem you have._

## Impact

_Who is affected and how urgently._

## Steps

1. Confirm the deploy is the cause
2. Revert to the previous release
3. Purge all caching layers
4. Verify the site is healthy again
5. Reproduce the failure in staging before retrying

## Verify

_How to confirm it is actually fixed._

## Prevent

_What stops this happening again._
