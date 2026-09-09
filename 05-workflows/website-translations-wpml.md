---
title: Website translations with WPML
description: The order to translate a WordPress site in, and why that order is not negotiable.
status: review
owner: bjorn
updated: 2026-09-09
---

Translating a site with WPML is mostly about sequence. Each step below depends on the ones
above it, so working out of order means redoing work: terms come back untranslated, pages
pull in the original-language block, or permalinks change after the links pointing at them
were already fixed. Follow the order.

## Prerequisites

- WPML Multilingual CMS, String Translation and Translation Management active. Media
  Translation as well if the site has its own image library.
- Target languages added and the URL format decided in **WPML → Languages**. Changing this
  later rewrites every translated permalink.
- Enough translation credits if you are using automatic translation.
- A fresh backup. Translation touches posts, terms, menus and permalinks in one pass.

## The order

### 1. Add a glossary

**WPML → Translation Management → Glossary.** Set the terms that must be translated a
specific way, and the ones that must be left alone — brand names, product names, jargon the
client is particular about.

Do this first because the glossary is applied at translation time, not afterwards. Add it
later and everything already translated has to be sent through again.

Skip only if there is genuinely nothing to pin down.

### 2. Translate taxonomies

**WPML → Taxonomy Translation.** Categories, tags, product categories, attributes, and any
custom taxonomy.

Content translation assigns the translated term to the translated post. If the term does not
exist yet, the translation comes out with the term missing or still in the source language,
and fixing it afterwards is a manual pass over every post.

### 3. Translate ACF and CPT slugs

**WPML → Settings → Post Types Translation**, and the slug translation option beneath each
post type. Applies when the site has custom post types, whether registered by ACF or in code.

Slugs are part of the permalink. Change them after the content is translated and every
translated URL moves, which means redirects for anything already shared or indexed. Get them
right while nothing points at them yet.

### 4. Run media translation manually, then re-enable automatic

**WPML → Settings → Media Translation.** For a site with existing content, turn automatic
media translation off, run the batch once for what is already there, and only then switch
automatic back on.

The one-off batch handles the whole existing library in a single controlled pass. Leaving
automatic on while the backlog is being processed makes it slow and unpredictable on any
library of real size. With automatic re-enabled afterwards, everything uploaded from that
point is handled as it arrives.

### 5. Translate UX Blocks

**WPML → Translation Management**, filtered to the UX Blocks post type. Flatsome sites only.

Pages reference blocks by ID. If the block has no translation, the translated page renders
the original-language block and the page looks half-finished — so blocks go before pages,
not after. See [Flatsome gotchas](../03-platforms/flatsome/gotchas.md).

### 6. Translate the content

Pages, posts, products, custom post types, forms. This is the bulk of the work and the part
that consumes credits, which is exactly why it comes after the glossary, the taxonomies and
the slugs are settled.

### 7. Translate strings

**WPML → String Translation.** Everything not stored in a post: theme and plugin strings,
widget text, form labels and validation messages, cookie notices, button and checkout copy.

This is the step that gets skipped and then noticed by the client. Anything a template
prints rather than pulls from a post lives here.

### 8. Create the menu translations

**WPML → WP Menus Sync**, or build the translated menus by hand.

Menus point at specific post IDs. Sync them after the content exists and the items resolve
to the translations; sync them before and they point back at the source language.

### 9. Resave permalinks, fix internal links, check the front end

1. **Settings → Permalinks → Save.** Flushes the rewrite rules for the translated slugs.
2. Update internal links so links inside translated content point at translated targets.
   Anything typed into a page rather than inserted as a post reference still points at the
   source language.
3. Walk the front end in every language. Header, footer, menu, a page, a post, a product, a
   form submission, the language switcher itself.
4. Purge the cache before you judge any of it.

## Gotchas

- **Hardcoded links in builder content stay hardcoded.** A link typed into a UX Builder
  button or a rich text field is a plain URL. WPML has no reason to touch it, so it quietly
  sends visitors back to the source language. Step 9 exists for this.
- **Duplicated is not translated.** Duplicating a page gives you a linked copy in the source
  language. It looks done in the dashboard and is not done on the front end.
- **Anything added after the translation pass needs the pass repeating.** A new taxonomy
  term, a new UX Block, a new theme string. Handing the site over does not stop this — say
  so in the [handover](client-handover.md).
- **Caching hides the result both ways.** A page can look untranslated because it is cached,
  or look fine because the translated version is cached and the source is broken. Purge
  first, then judge.
- **Check the language switcher in the real header**, not just in preview. It is a common
  casualty of a child theme header override.

## Related

- [Multilingual sites](../03-platforms/wordpress/multilingual.md)
- [Flatsome gotchas](../03-platforms/flatsome/gotchas.md)
- [Launch](launch.md) · [Client handover](client-handover.md)
- [WPML documentation](https://wpml.org/documentation/)
