---
title: WordPress stack manual
description: Set up, style, deploy, roll back and rescue a site built from the WordPress stack kit, without Claude.
status: review
owner: bjorn
updated: 2026-10-07
permalink: /05-workflows/wordpress-stack/
---

Our WordPress sites on WPMU DEV hosting start from one kit: an Astra child theme, a site plugin,
Spectra Blocks for page content, WPCodeBox for every line of CSS, and Node tools that check,
deploy and roll back over SSH. Claude Code normally drives it. These pages are for the day it
does not: Claude is out of usage, you are on another computer, or you only have a phone.

You know WordPress and a terminal; this covers the kit's own parts. Examples use the made-up
project **Acme Studio**. Take the real values from the project's `wp-stack.json` and
`.deploy.env`.

| Page | Open it when |
| --- | --- |
| [Deploy and roll back](deploy-and-roll-back.md) | You must ship PHP without the deploy tool: by hand over SSH, from a phone through GitHub, or over SFTP. And to undo any of it |
| [Styles with WPCodeBox](styles-with-wpcodebox.md) | You change the CSS, with the style tools or in WP admin |
| [Set up without Claude](set-up-without-claude.md) | A new computer, a new project, or the first activation of a site |
| [Emergencies and troubleshooting](emergencies-and-troubleshooting.md) | The site is broken, or a command fails with a message you do not know |

## What you need

| For | You need |
| --- | --- |
| Everything | Access to the project's private GitHub repository |
| The npm tools | Git, Node.js 20.19 or newer, and `npm install` once per clone |
| Anything over SSH | A key on the site's WPMU DEV SSH user (the Hub → the site → Hosting → SFTP/SSH), a `Host` alias in `~/.ssh/config`, and the project's `.deploy.env` |
| Style pushes | WPCodeBox 2 on the site, licensed, with its MCP write tools allowed, and `.mcp.json` from `npm run setup:mcp` |
| Deploys without SSH | A browser, GitHub access and a WordPress administrator login |
| A new project | The GitHub CLI `gh`, signed in with `gh auth login`. Without it: create the private repository on github.com, then `git remote add origin https://github.com/<owner>/acme-studio.git` and `git push -u origin main` |
| Windows | Git for Windows, which brings Git Bash. Windows 10 and 11 ship the OpenSSH client and `tar.exe` the tools call |

## How the stack fits together

| Part | Where | What it is |
| --- | --- | --- |
| Parent theme | Astra, installed on the site | Header, footer and layouts |
| Child theme | `wp-content/themes/acme-studio/` | PHP only, plus a `theme.json` that gives the block editor and Spectra Astra's breakpoints. No CSS |
| Site plugin | `wp-content/plugins/acme-studio-core/` | Rules that must survive a theme change |
| Styles | `wpcodebox/`: partials `_*.scss` and the main file `site.scss` | All site CSS, pushed into WPCodeBox, which compiles it on the server and prints it inline in every page |
| Project settings | `wp-stack.json`, committed | Site URL, slugs, prefixes, and the WPCodeBox folder, main snippet title and hooks |
| Server settings | `.deploy.env`, one per computer, never committed | `DEPLOY_SSH`, the `Host` alias, and `DEPLOY_WP_ROOT`, the WordPress root |
| Site connection | `.mcp.json`, never committed | An administrator's Application Password, used by Claude and by the style tools |
| Tools | `tools/*.mjs`, run as `npm run …` | Checks, style sync, deploy, rollback, activation, cache, WP-CLI |
| Zips | A GitHub Action | Installable theme and plugin zips on every push to `main` |

### On the server

- **WordPress root**: `~/<site-folder>/public_html`. `ssh acme-studio 'ls -d ~/*/public_html'`
  prints it.
- **Logs**: `~/<site-folder>/logs/`, read-only. `php_errors.log` appears with the first logged PHP
  message.
- **Deploy backups**: `~/deploy-backups/themes/<theme>` and `~/deploy-backups/plugins/<plugin>`
  hold the version the last deploy replaced, one per package.
- **Hidden folders** such as `wp-content/themes/.acme-studio.incoming` exist during a deploy.
  WordPress ignores folders whose name starts with a dot, and nginx refuses to serve them, which
  makes them safe staging areas.
- **WP-CLI** always needs `--path=<root>`. A root-owned `~/.wp-cli/config.yml` pins a path of its
  own, so the folder you are in does not choose the site.
- **The shell is limitedshell**: bash that refuses to start some programs (`mktemp`, `md5sum`,
  `df`, `ps`) with "Permission denied". Every command in these pages avoids them.
- `~` and `public_html` are different filesystems, so a move between them copies file by file.
  Swaps happen with renames inside one folder.

Never commit `.mcp.json`, `.deploy.env`, `.wp-credentials`, SSH keys or Application Passwords.

## Which shell

- **PowerShell** for `npm run …`. The tools start Windows' own `ssh.exe` and `tar.exe`
  themselves.
- **Git Bash** for raw `ssh`, `tar` and `curl` commands. Windows PowerShell 5.1 corrupts binary
  pipes (`tar | ssh` arrives as "gzip: stdin: not in gzip format") and mangles quotes inside
  arguments.
- **macOS and Linux**: run every block in Terminal as written; leave out `MSYS_NO_PATHCONV=1`,
  which only matters in Git Bash.

Git Bash's ssh may warn that the connection "is not using a post-quantum key exchange
algorithm". It is harmless: the server runs an older OpenSSH.

## Everyday commands

PowerShell, in the project folder. Arguments go after `--`, as in `npm run deploy -- theme`;
without it, npm keeps flags such as `--dry-run` for itself.

| Command | What it does |
| --- | --- |
| `npm run check` | PHP syntax check of the theme and the plugin, then `styles:check` |
| `npm run styles:check` | Compiles `wpcodebox/` locally the way WPCodeBox will; no network. `-- --server` also compiles with the site's own compiler, read-only |
| `npm run styles:status` | Read-only: which snippets on the site differ from `wpcodebox/` |
| `npm run styles:pull` | Writes the snippets' code into `wpcodebox/`; refuses to overwrite uncommitted edits |
| `npm run styles:push` | Check, then save the snippets and enable the main one; `-- --dry-run` lists the calls |
| `npm run deploy` | Check, upload, `php -l` on the server, swap in, purge, PHP log, site check |
| `npm run rollback` | Puts back the version the last deploy replaced; again rolls forward |
| `npm run activate` | Once per site: plugin on, theme mods copied, child theme on, purge |
| `npm run purge` | Clears the hosting cache, then shows what a visitor gets |
| `npm run wp -- <args>` | WP-CLI on the server with the right `--path` |
| `npm run package` | Check, then installable zips in `dist/` |

The daily loop: `git pull`, edit, `npm run check`, then `npm run styles:push` and
`npm run purge` for SCSS or `npm run deploy` for PHP, look at the site as a visitor, commit and
push.

A deploy is all or nothing. It uploads every package into a hidden folder and lints it on the
server first; if one fails, every upload is removed and nothing goes live. Then it swaps all
packages in with renames in one SSH call, and puts back what it already swapped if a rename
fails.

`npm run deploy` runs `npm run check` first, styles included: an SCSS error blocks a PHP deploy
too. In an emergency, `node tools/deploy.mjs theme` skips the local checks; the server's `php -l`
still runs.

## The static cache

Visitors who are not logged in get pages from nginx's static cache. Your logged-in cookie
bypasses it, so you see fresh pages while visitors may not. Nothing clears the cache when content,
settings or styles change, and the CSS sits inline in every cached page.

Purge after every deploy, rollback and style push, and after any content or settings change that
visitors must see. `deploy`, `rollback` and `activate` purge by themselves.

```powershell
npm run purge
npm run purge -- /about/ /contact/
```

The first clears everything; the second only the static cache of those paths (`/` is the home
page alone). In Git Bash, prefix `MSYS_NO_PATHCONV=1`, or Git Bash turns `/about/` into a Windows
path. Without the tools, in Git Bash:

```bash
ssh -o BatchMode=yes acme-studio "wp --path='/home/acme-ssh/acmestudio/public_html' hosting clearcache all"
curl -s -o /dev/null -D - https://acme-studio.tempurl.host/ | grep -i -E '^(HTTP|x-cache)'
```

| `X-Cache` | Means |
| --- | --- |
| `MISS` | Built fresh just now; the next visitor gets `HIT` |
| `HIT` | Served from the cache |
| `STALE`, `UPDATING` | The old copy, served while nginx fetches a new one |
| `BYPASS` | Not cached: a logged-in cookie, a query string (`?nocache=1` bypasses on purpose), `/wp-json/` or a feed |

"Error: Could not flush cache" means nginx did not confirm the purge. Try again and check
`X-Cache`. If pages stay stale, clear the static server cache in the Hub: the site → Hosting →
Tools (check the exact label).

## Related

- [Deployment](../deployment.md)
- [Roll back a deploy](../../06-runbooks/rollback-a-deploy.md)
- [WP-CLI](../../03-platforms/wordpress/wp-cli.md)
- [Child themes](../../03-platforms/wordpress/child-themes.md)
