---
title: Change DNS safely
description: Editing DNS without taking a site or its mail offline.
status: draft
owner: bjorn
updated: 2026-08-07
---

# Change DNS safely

> **Draft** — not authoritative yet.

## Symptoms

_How you know this is the problem you have._

## Impact

_Who is affected and how urgently._

## Steps

1. Record the current zone before touching it
2. Lower TTLs well ahead of the change
3. Confirm the destination is ready and serving
4. Change records and verify propagation
5. Watch mail flow specifically
6. Restore TTLs afterwards

## Verify

_How to confirm it is actually fixed._

## Prevent

_What stops this happening again._
