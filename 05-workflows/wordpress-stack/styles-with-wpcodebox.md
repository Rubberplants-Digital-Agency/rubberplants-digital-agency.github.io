---
title: Styles with WPCodeBox
description: Change the site's CSS with the style tools or in WP admin without breaking WPCodeBox's compile, and keep git in step.
status: review
owner: bjorn
updated: 2026-10-07
---

Every line of a stack site's CSS lives in WPCodeBox 2, a paid snippet plugin that compiles SCSS
on the server and prints the result inline in the head of every page and in the block editor. The
child theme ships no CSS. The source of truth is the project's `wpcodebox/` folder in git; the
style tools copy it to the site and back.

## How it is organised

WP admin → **WPCodeBox 2** (a top-level menu, or under Tools when WPCodeBox is set to show there)
holds one folder per project, named in `wp-stack.json` under `wpcodebox.folder`, for example
**Acme Studio styles**:

| Snippet | Type | File in git | Holds |
| --- | --- | --- | --- |
| `_global_variables` | SCSS Partial | `_global_variables.scss` | Colours, fonts, spacing, breakpoint mixins. No CSS |
| `_base` | SCSS Partial | `_base.scss` | Custom properties `--acme-*`, fonts, element defaults |
| `_layout` | SCSS Partial | `_layout.scss` | The page class, sections, wrappers, grids |
| `_components` | SCSS Partial | `_components.scss` | Buttons, cards and other reusable classes |
| `_header`, `_footer` | SCSS Partial | `_header.scss`, `_footer.scss` | Astra's header (`#masthead`) and footer (`#colophon`) |
| Acme Studio site styles | SCSS, enabled | `site.scss` | Only the lines that pull in the partials |

Partials are never printed by themselves and stay disabled. A partial's snippet title is its file
name without `.scss`.

## With the tools

PowerShell, in the project folder:

| Command | What it does |
| --- | --- |
| `npm run styles:check` | Compiles `wpcodebox/` locally the way WPCodeBox will, the main file and each partial on its own, and stops on SCSS the site's compiler treats differently (rule 6). No network. Errors come as `file:line: problem`. `-- --server` also compiles with the site's own compiler over SSH, read-only |
| `npm run styles:status` | Read-only: per snippet `same`, `differs, the file has +N -M lines`, `not on the site; push creates it` or `only on the site`; for the main snippet whether it is enabled, and its hooks when they differ from `wp-stack.json`; then warnings |
| `npm run styles:push` | `styles:check`, the compile on the site (when `.deploy.env` exists), a check that the site's snippets match `wp-stack.json`, then saves every partial (`_global_variables` first), saves the main snippet when it changed, enables it. `-- --dry-run` lists the calls and sends none |
| `npm run styles:pull` | Writes the snippets' code into `wpcodebox/`. Read-only on the site. Refuses to overwrite a file with uncommitted changes unless `-- --force`, and leaves out partials the main snippet on the site does not use |
| `npm run purge` | After every push: visitors get cached pages, CSS included, until the cache is cleared |

The loop: edit `wpcodebox/*.scss`, `npm run styles:push`, `npm run purge`, look at the site as a
visitor, commit.

The push protects the live CSS. Before any write it compiles everything with the site's own
compiler (when `.deploy.env` exists) and checks that the snippets on the site match
`wp-stack.json`: no partial title elsewhere on the site, no second SCSS snippet in the folder.
Each partial save recompiles the main snippet, so partials saved earlier in a push are live at
once. When a partial fails, WPCodeBox stores its code anyway; the push then neither saves nor
enables the main snippet, which keeps the CSS of its last successful compile. Fix the SCSS and
push again; do not save the main snippet in WP admin meanwhile, because it would compile with
the broken partial and lose all CSS. The push stops at once on a firewall block, wrong
credentials or missing WPCodeBox rights. The first push on a site creates the folder, every
partial and the main snippet.

The tools sign in with the Application Password in `.mcp.json`
([Set up without Claude](set-up-without-claude.md#another-computer)), and WPCodeBox must allow its
MCP write tools: WP admin → WPCodeBox 2 → the toolbar button **MCP / AI**, which opens the
dialog "MCP / AI Access" → "Tools the agent may call" → `wpcodebox_create_snippet`,
`wpcodebox_update_snippet`, `wpcodebox_enable_snippet` and `wpcodebox_create_folder`, next to
the read tools. Leave `wpcodebox_delete_snippet` and `wpcodebox_run_snippet` off;
`wpcodebox_disable_snippet` is optional, as the style tools never use it.

## The rules WPCodeBox imposes

WPCodeBox has no real Sass modules. It pastes partials into place as text, then compiles with
scssphp. That gives rules that hold in WP admin and in git alike:

1. **The order rule.** Every partial starts with `@use '_global_variables';`. The main snippet
   lists the other partials first and `@use '_global_variables';` last. WPCodeBox replaces each
   such line with the partial of that title, top to bottom; with the variables last, their
   replacement also fills the copy at the top of every partial pasted before.
2. **Write the line exactly** `@use '_name';`: single quotes, the underscore, the semicolon
   straight after the quote. Anything else stays unresolved and fails to compile.
3. **The comment trap.** Never write the word `@use` in a `//` comment, in any snippet. WPCodeBox
   deletes from the `//` to the next `;` on that line, and the rest of the line turns into code:
   `// we @use partials; color: red;` leaves ` color: red;`.
4. **`_global_variables` outputs nothing.** It is pasted into every partial, so a CSS rule in it
   would print once per partial.
5. **Partial titles are unique on the whole site.** WPCodeBox finds a partial by title in any
   folder, so a second `_base` elsewhere may be the one it uses.
6. **scssphp is not Dart Sass.** No `@use 'sass:math'` or `math.div()`: use global functions such
   as `percentage()` and `rgba($c, .5)`. Interpolate variables in `calc()`, `min()`, `max()` and
   custom properties: `calc(100% - #{$gutter})`, `min(100%, #{$width})`,
   `--acme-brand: #{$brand}`. Wrap arithmetic inside `clamp()` in `calc()`:
   `clamp(1rem, calc(2vw + 1rem), 3rem)`. Keep slashes with `#{1} / #{3}`: scssphp divides
   `grid-area: 1 / 3` into `0.3333333333` (only `font`, `grid-row`, `grid-column` and
   `border-radius` keep their slash). `styles:check` compiles with Dart Sass but stops on all of
   these; `npm run styles:check -- --server` compiles with the site's own scssphp.
7. **Never break the main snippet.** A save of the main snippet that does not compile leaves it
   with no CSS at all: the site loses every style. A partial whose save breaks the main snippet's
   recompile leaves the old CSS in place instead. So edit partials, and touch the main snippet only
   to add or remove a partial's line.
8. **Delete an old partial last.** Saving a partial recompiles the main snippet as it is on the
   site. Take the partial's line out of the main snippet first (a push of `site.scss` without
   it), and delete the partial's snippet only after that.

## Editing in WP admin

For when you only have a browser, or the push does not work:

1. WP admin → WPCodeBox 2 → the project's folder → the partial that holds the rule.
2. Edit and save. WPCodeBox compiles on save and shows the compiler's error when it fails; fix it
   before you leave the snippet.
3. Look at the site while logged in: you bypass the cache and see the new CSS at once.
4. Purge, so visitors get it.
5. Sync the change back to git as soon as you can (below), or the next `npm run styles:push`
   overwrites it.

A new partial is a snippet of the type SCSS Partial, in the same folder, titled `_name`, starting
with `@use '_global_variables';`. Add `@use '_name';` to the main snippet above the variables line
and save the main snippet.

## Undo with revisions

Each save that changes a snippet's code keeps the previous code as a revision; WPCodeBox keeps the
newest 10 per snippet. In WPCodeBox 2 1.4.1:

1. Open the snippet and click **Revisions** by its title: the saved versions appear, newest first.
2. Click a version. The editor shows its code with the buttons **Revert**, **Close** and
   **Delete**.
3. **Revert** puts that code back into the editor. Save the snippet: it compiles and stores a new
   revision. **Delete** removes the revision itself; leave it alone.
4. Purge, then sync back to git.

## Sync WP admin edits back to git

At a computer with the project, in PowerShell:

```powershell
git pull
npm run styles:status
npm run styles:pull
git diff
npm run styles:check
git add wpcodebox
git commit -m "Pull style changes made in WPCodeBox"
git push
```

`styles:status` shows `differs` for edited snippets and `only on the site` for a new partial;
`styles:pull` writes them into `wpcodebox/`. Commit or stash your own uncommitted changes in
`wpcodebox/` first, because the pull refuses to overwrite them.

## When a push broke the layout

1. **Undo it in git**: `git revert` the commit, `npm run styles:check`, `npm run styles:push`,
   `npm run purge`.
2. **Undo it in WP admin**: the snippet → Revisions → the previous version → Revert → save →
   purge. Pull and commit later.
3. **The site lost all its styles**: the push reports that WPCodeBox saved the main snippet
   without CSS, because it did not compile on the server. Fix the SCSS and push again, or revert
   the main snippet to its previous revision.
4. **No time**: disable the main snippet in WPCodeBox's snippet list (check the exact label) and
   purge. The site shows Astra's and Spectra's own styling until you enable it again;
   `npm run styles:push` enables it too.

## Gotchas

- **WPCodeBox's list of errored snippets says nothing about SCSS.** It only flags PHP snippets.
  SCSS errors come back from each save: read the push output, or the error WPCodeBox shows.
- **A passing `styles:check` is not a passing server compile.** It uses Dart Sass and stops on
  the known differences of rule 6; the site uses scssphp. `-- --server`, and every push with
  `.deploy.env`, compiles with the site's own scssphp.
- **Logged in, you always see the new CSS.** Visitors see it only after a purge.
- **The push never deletes.** After renaming or removing a partial, delete its old snippet in
  WPCodeBox once a push has taken it out of the main snippet (rule 8), or its title keeps
  clashing. `styles:pull` leaves such leftovers out.
- **A site whose styles are already in WPCodeBox.** The push refuses while the folder holds
  another SCSS snippet or a partial title exists elsewhere on the site. If those are the
  project's own snippets, set `wpcodebox.folder`, `mainTitle` and `main` in `wp-stack.json` to
  the names on the site, then `npm run styles:pull` and commit before the first push.

## Related

- [WordPress stack manual](README.md)
- [Deploy and roll back](deploy-and-roll-back.md)
- [SCSS architecture](../../03-platforms/frontend/scss-architecture.md)
- [SCSS code style](../../02-standards/code-style-scss.md)
