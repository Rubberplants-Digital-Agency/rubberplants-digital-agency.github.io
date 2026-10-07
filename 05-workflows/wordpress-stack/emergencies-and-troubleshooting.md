---
title: Emergencies and troubleshooting
description: What to do when a WordPress stack site breaks, and what the common error messages mean.
status: review
owner: bjorn
updated: 2026-10-07
---

Fix first, understand later. Each emergency below starts with the fastest safe action. Examples
use the made-up project Acme Studio: alias `acme-studio`, WordPress root
`/home/acme-ssh/acmestudio/public_html`.

## Critical error after a deploy

"There has been a critical error on this website" right after a deploy.

1. **Roll back what you deployed**: `npm run rollback -- plugin`, `-- theme`, or both with
   `npm run rollback`. Without Node, use the
   [rollback by hand](deploy-and-roll-back.md#by-hand-over-ssh).
2. **Read why**, in Git Bash: the fatal error names the file and the line.

   ```bash
   ssh -o BatchMode=yes acme-studio 'tail -n 50 ~/*/logs/php_errors.log'
   ```

3. **No rollback possible? Take the code out of the way.**
   - The site plugin: rename `wp-content/plugins/acme-studio-core` to `.acme-studio-core.off`
     over SFTP, in the Hub's file manager, or in Git Bash:

     ```bash
     ssh -o BatchMode=yes acme-studio "cd '/home/acme-ssh/acmestudio/public_html/wp-content/plugins' && mv acme-studio-core .acme-studio-core.off"
     ```

     WordPress skips a plugin whose file is missing, and deactivates it when someone next opens the
     Plugins screen. After the fix, rename it back and activate it again.
   - The child theme, with SSH: switch to the parent. The child's settings stay stored for when
     you switch back.

     ```bash
     ssh -o BatchMode=yes acme-studio "wp --path='/home/acme-ssh/acmestudio/public_html' theme activate astra"
     ```

   - The child theme, without SSH: rename its folder to `.acme-studio.off`. The front end then
     runs on Astra's templates without the child's PHP. Do not open **Appearance → Themes** or the
     Customizer until the folder is back: WordPress then finds the active theme missing and
     switches the site to a default theme.
4. **Recovery mode**: WordPress e-mails the site's admin address a login link when a fatal error
   happens. It logs you in with the failing plugin or theme paused for your session, so you can
   deactivate it in WP admin. Visitors still get the error until you do.
5. Purge and check the site as a visitor.

## A style push broke the layout

1. **Undo it in git**: `git revert` the commit, `npm run styles:check`, `npm run styles:push`,
   `npm run purge`.
2. **Undo it in WP admin**: WPCodeBox 2 → the snippet → **Revisions** → the previous version →
   **Revert** → save → purge. Pull and commit later.
3. **No time**: disable the main snippet in WPCodeBox's snippet list (check the exact label) and
   purge. The site shows Astra's and Spectra's own styling until you enable it again.

Details in [Styles with WPCodeBox](styles-with-wpcodebox.md#when-a-push-broke-the-layout).

## The site is down

1. **What does a visitor get?**

   ```bash
   curl -s -o /dev/null -D - https://acme-studio.tempurl.host/ | grep -i -E '^(HTTP|x-cache|location)'
   ```

   - 500 to 599: PHP (step 2) or the server (step 5).
   - 403 with an HTML page titled "Forbidden Access": the WPMU DEV firewall, or nginx refusing a
     path. Check the WAF in the Hub.
   - 200 with old content: the cache. Purge.
   - A redirect to a coming-soon page, or a loop: a coming-soon or maintenance mode in Spectra,
     WooCommerce or a plugin.
2. **The PHP error log**, as above.
3. **What changed?** `git log -5` in the project, and
   `npm run wp -- plugin list --fields=name,status,version` for plugins that updated themselves.
4. **Undo the last change**: a rollback, a style revert, or
   `npm run wp -- plugin deactivate <slug>` for a plugin that updated.
5. **The server or the platform**: does `ssh -o BatchMode=yes acme-studio true` still work? Look
   at the site's hosting page in the Hub and at WPMU DEV's status page.
6. **Last resort**: restore a Hub backup
   ([deploy and roll back](deploy-and-roll-back.md#the-whole-site-from-a-hub-backup)).

## Troubleshooting

| You see | Cause | Fix |
| --- | --- | --- |
| `Permission denied (publickey)` | The key is not on that SSH user, the alias names another user or host, or ssh offers another key | Check the key in the Hub (Hosting → SFTP/SSH); keep `IdentitiesOnly yes` in the alias; `ssh -v acme-studio` shows the key it offers |
| `Host key verification failed` | The alias lacks `StrictHostKeyChecking accept-new`, or the server's key changed | Add the line; if the key changed, confirm in the Hub before `ssh-keygen -R <host>` |
| A tool stops with exit 255 | Windows' `ssh.exe` could not connect | `C:\Windows\System32\OpenSSH\ssh.exe -o BatchMode=yes acme-studio true` shows why |
| HTML 403 "Forbidden Access" from `setup:mcp` or `styles:*` | The WPMU DEV firewall blocked the request before WordPress saw it | Check the site's WAF in the Hub; never reshape a request to slip past it |
| 401 from `setup:mcp` or `styles:*` | Wrong username, or the login password instead of an Application Password | New Application Password, `.wp-credentials`, `npm run setup:mcp` |
| `wpcb_mcp_tool_not_enabled` or `wpcb_mcp_live_update_forbidden` | WPCodeBox's MCP rights are off | WPCodeBox 2 → MCP / AI Access: allow create, update and enable snippet, and create folder |
| `rest_ability_cannot_execute` or a JSON 403 | The Application Password's user is not an administrator | Use an administrator's Application Password |
| `rest_ability_not_found` | WPCodeBox 2 is missing or older than 1.4 | Install or update and activate it |
| `.mcp.json not found` | This computer has no site connection yet | `.wp-credentials`, then `npm run setup:mcp` |
| `Repository not found` on `git push` or clone | Git used another GitHub account's credentials | `gh auth status`, `gh auth switch --user <account>`, try again |
| `bash` misbehaves inside an npm script | On Windows, npm runs scripts in `cmd.exe`, where `bash` is WSL's, not Git Bash | Use the Node tools through `npm run` as they are; run raw bash in Git Bash yourself |
| `/about/` arrives as `C:/Program Files/Git/about/` | Git Bash rewrites arguments that start with `/` for Windows programs | Prefix `MSYS_NO_PATHCONV=1` |
| `gzip: stdin: not in gzip format` | `tar` piped into `ssh` in Windows PowerShell 5.1 | Use Git Bash for raw pipes, or the npm tools |
| `wp` acts on another install than you meant | Without `--path`, WP-CLI uses the path pinned in the hosting's `~/.wp-cli/config.yml` | Always `wp --path=<root>`; `npm run wp` adds it |
| `PHP lint failed for N of M files`, or `PHP lint: 2 of 3 files OK.` by hand | A syntax error in the upload; nothing went live | Fix the file and line it names, `npm run check`, deploy again |
| Visitors see old pages or old CSS; you see the new ones | The static cache | `npm run purge`, then check `X-Cache` |
| `Error: Could not flush cache` | nginx did not confirm the purge | Try again; clear the static cache in the Hub |
| `wpcodebox/ will not compile on the site:` | An SCSS error, listed per `file:line` | Fix it; nothing was sent to the site |
| `create_failed` or `update_failed` from `styles:push` | The server's scssphp rejected SCSS that Dart Sass accepted | Rewrite it as in [the rules](styles-with-wpcodebox.md#the-rules-wpcodebox-imposes), push again |
| WPCodeBox's errored list is empty, yet the styles broke | That list only shows PHP snippet errors | Read the push output, or the error WPCodeBox shows on save |
| `styles:pull` refuses: files "have changes that are not committed" | Your own edits in `wpcodebox/` would be overwritten | Commit or stash them, or `npm run styles:pull -- --force` |
| sass or `npm run check` complains about the Node version | Node is older than 20.19 | Install a current Node LTS |

## Related

- [WordPress stack manual](README.md)
- [Site is down](../../06-runbooks/site-down.md)
- [A WordPress update broke the site](../../06-runbooks/wp-update-broke-the-site.md)
- [Restore from backup](../../06-runbooks/restore-from-backup.md)
