---
title: Deploy and roll back
description: Ship the child theme and site plugin without the deploy tool, from any device, and undo it.
status: review
owner: bjorn
updated: 2026-10-07
---

`npm run deploy` and `npm run rollback` are the normal route (see
[everyday commands](README.md#everyday-commands)). This page is for when they cannot run. Take the
first route that works:

1. [By hand over SSH](#deploy-by-hand-over-ssh): Node is missing or broken, SSH works.
2. [From GitHub, without SSH](#deploy-from-github-without-ssh): only a browser, a phone included.
3. [Over SFTP or the Hub file manager](#deploy-over-sftp-or-the-hub-file-manager): WP admin is down
   as well.

The styles never travel with a deploy: they live in WPCodeBox
([Styles with WPCodeBox](styles-with-wpcodebox.md)).

## Deploy by hand over SSH

The same steps as `npm run deploy`, one package at a time. Shell: **Git Bash**, in the project
folder, with the commit you want to deploy checked out. For the theme and the plugin together,
run steps 1 to 3 for both packages first, and step 4 for each only when both passed, the plugin
first. That keeps the deploy all or nothing.

**Step 1. Set the values** from `.deploy.env` and `wp-stack.json`:

```bash
HOST=acme-studio                             # DEPLOY_SSH in .deploy.env
ROOT=/home/acme-ssh/acmestudio/public_html   # DEPLOY_WP_ROOT in .deploy.env
SITE=https://acme-studio.tempurl.host        # siteUrl in wp-stack.json
KIND=themes                                  # themes or plugins
SLUG=acme-studio                             # the theme slug, or the plugin slug acme-studio-core
```

**Step 2. Upload into a hidden folder next to the live one.** Nothing live changes. `umask 022`
gives the files the usual 755/644 modes.

```bash
tar -czf - --exclude=node_modules --exclude=.DS_Store --exclude='*.map' -C "wp-content/$KIND" "$SLUG" |
  ssh -o BatchMode=yes "$HOST" "umask 022 && cd '$ROOT/wp-content/$KIND' && rm -rf '.$SLUG.incoming' && mkdir '.$SLUG.incoming' && tar -xzf - -C '.$SLUG.incoming' && echo 'Uploaded to $KIND/.$SLUG.incoming'"
```

**Step 3. The lint gate.** One `php -l` per file, counting the passes, because some PHP versions
lint only the first of several files and still exit 0:

```bash
ssh -o BatchMode=yes "$HOST" "ROOT='$ROOT' KIND='$KIND' SLUG='$SLUG' bash -s" <<'EOF'
cd "$ROOT/wp-content/$KIND/.$SLUG.incoming" || exit 1
total=$(find "$SLUG" -type f -name '*.php' | wc -l)
lint=$(find "$SLUG" -type f -name '*.php' -exec php -d display_errors=1 -d log_errors=0 -l {} \; 2>&1)
passed=$(printf '%s\n' "$lint" | grep -c '^No syntax errors detected in ')
printf '%s\n' "$lint" | grep -v '^No syntax errors detected in '
echo "PHP lint: $passed of $total files OK."
[ "$passed" -eq "$total" ]
EOF
```

When fewer files pass, it prints each error with its file and line. Remove the upload, fix the
code and start again at step 2; the live site never saw it.

```bash
ssh -o BatchMode=yes "$HOST" "rm -rf '$ROOT/wp-content/$KIND/.$SLUG.incoming'"
```

**Step 4. Swap it in and keep the replaced version.** Two renames inside the same folder, so the
switch takes an instant. The replaced version then moves to `~/deploy-backups`, off the live path,
where `npm run rollback` and the rollback below find it.

```bash
ssh -o BatchMode=yes "$HOST" "ROOT='$ROOT' KIND='$KIND' SLUG='$SLUG' bash -s" <<'EOF'
cd "$ROOT/wp-content/$KIND" || exit 1
[ -d ".$SLUG.incoming/$SLUG" ] || { echo "No upload in $KIND/.$SLUG.incoming; nothing changed." >&2; exit 1; }
rm -rf ".$SLUG.previous"
if [ -e "$SLUG" ]; then mv "$SLUG" ".$SLUG.previous" || exit 1; fi
if ! mv ".$SLUG.incoming/$SLUG" "$SLUG"; then
  if [ -e ".$SLUG.previous" ]; then mv ".$SLUG.previous" "$SLUG"; fi
  echo "The swap failed; the live folder is as it was." >&2
  exit 1
fi
rm -rf ".$SLUG.incoming"
if [ ! -e ".$SLUG.previous" ]; then
  echo "Deployed $KIND/$SLUG (first deploy, nothing replaced)."
elif mkdir -p "$HOME/deploy-backups/$KIND" && rm -rf "$HOME/deploy-backups/$KIND/$SLUG" && mv ".$SLUG.previous" "$HOME/deploy-backups/$KIND/$SLUG"; then
  echo "Deployed $KIND/$SLUG; the replaced version is in ~/deploy-backups/$KIND/$SLUG."
else
  echo "Deployed $KIND/$SLUG, but the replaced version stayed in $KIND/.$SLUG.previous." >&2
fi
EOF
```

**Step 5. Purge, read the PHP log, check the site.**

```bash
ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting clearcache all"
ssh -o BatchMode=yes "$HOST" "tail -n 20 '$ROOT/../logs/php_errors.log'"
curl -s -o /dev/null -D - "$SITE/" | grep -i -E '^(HTTP|x-cache)'
```

The purge prints "Success: The cache was flushed." twice. New log lines with today's time and
your theme or plugin in the path mean trouble; no log file means PHP has logged nothing yet.
Expect a 200 and `MISS`; a 500 means roll back. Then commit and push, so the repository holds what
the site runs.

## Deploy from GitHub, without SSH

Every push to `main` runs the GitHub Action **Build theme and plugin zips**: `npm run check`, then
the child theme and the site plugin as two artifacts. GitHub holds no server secrets; you install
the zip yourself. This works from a phone's browser.

1. Get the commit onto `main`, or start the Action by hand: the repository → **Actions** → Build
   theme and plugin zips → **Run workflow**, and pick the branch.
2. Open the latest successful run → **Artifacts** → `acme-studio-theme` or
   `acme-studio-core-plugin`. The download is a zip with the `acme-studio/` folder at its root:
   upload it as it is, unzipped. Artifacts expire after 90 days.
3. Back up first: a backup in the Hub (the site → Backups; check the exact label), or note the run
   you are replacing, whose artifact is your rollback.
4. Install it in WP admin (WordPress 7.1 labels; older versions say "Add New Plugin" and "Add New
   Theme"):
   - Plugin: **Plugins → Add Plugin → Upload Plugin** → the zip → **Install Now** → "This plugin
     is already installed." → **Replace current with uploaded**.
   - Theme: **Appearance → Themes → Add Theme → Upload Theme** → the zip → **Install Now** →
     "This theme is already installed." → **Replace installed with uploaded**.
5. Purge: the Hub → the site → Hosting → Tools (check the exact label), or `npm run purge` from a
   computer. Then check the site in a private window.

There is no server-side lint on this route; a green run passed `npm run check`, so its PHP parses.
"You are uploading an older version" only means the zip's `Version` header is lower. WordPress
keeps no copy of the replaced folder and `~/deploy-backups` does not change, so a later
`npm run rollback` restores what the last SSH deploy replaced, which may be older than you think.
`npm run package` builds the same zips on any computer with Node.

## Deploy over SFTP or the Hub file manager

When neither SSH commands nor the upload in WP admin work: SFTP (WinSCP, FileZilla, Cyberduck)
with the host and SSH user from the Hub's SFTP/SSH page, port 22 and the same key, or the file
manager in the Hub (the site → Hosting → File Manager; check the exact label). Show hidden files.
There is no lint gate here: run `npm run check` locally first.

The theme, as an example; the plugin works the same in `wp-content/plugins`:

1. In `public_html/wp-content/themes/`, create the folder `.acme-studio.incoming`.
2. Upload your local `wp-content/themes/acme-studio` into it, so the server has
   `.acme-studio.incoming/acme-studio/`. Uploading into the hidden folder means a slip can never
   land on the live theme. Wait until the upload has finished.
3. Rename the live `acme-studio` to `.acme-studio.previous`.
4. Move `.acme-studio.incoming/acme-studio` up one level to `themes/acme-studio`, then delete the
   empty `.acme-studio.incoming`.
5. Purge and check the site. To undo, swap the folders back the same way. Delete
   `.acme-studio.previous` once you are sure; `npm run rollback` does not see it.

Never upload into the live folder or edit files in place: visitors meet a half-updated theme, and a
PHP error is live the moment the file lands.

## Roll back

### With the tool

`npm run rollback` (PowerShell) swaps in what the last deploy replaced and purges.
`npm run rollback -- theme` or `-- plugin` rolls back one package; `-- --dry-run` prints the server
script. The version it takes out becomes the backup, so a second run rolls forward again. Only one
version back is kept.

### By hand over SSH

Git Bash, in any folder, with the values from step 1 above. The backup is copied next to the live
folder first, then swapped in with two renames, and the version it replaced becomes the new backup:

```bash
ssh -o BatchMode=yes "$HOST" "ROOT='$ROOT' KIND='$KIND' SLUG='$SLUG' bash -s" <<'EOF'
backup="$HOME/deploy-backups/$KIND/$SLUG"
[ -d "$backup" ] || { echo "No backup in ~/deploy-backups/$KIND/$SLUG; nothing changed." >&2; exit 1; }
cd "$ROOT/wp-content/$KIND" || exit 1
rm -rf ".$SLUG.restore" && cp -r "$backup" ".$SLUG.restore" || exit 1
rm -rf ".$SLUG.previous"
if [ -e "$SLUG" ]; then mv "$SLUG" ".$SLUG.previous" || exit 1; fi
if ! mv ".$SLUG.restore" "$SLUG"; then
  if [ -e ".$SLUG.previous" ]; then mv ".$SLUG.previous" "$SLUG"; fi
  echo "The rollback failed; the live folder is as it was." >&2
  exit 1
fi
if [ -d ".$SLUG.previous" ]; then rm -rf "$backup" && mv ".$SLUG.previous" "$backup"; fi
echo "Rolled back $KIND/$SLUG. Run this again to return to the version it replaced."
EOF
```

Then purge and check as in step 5. `ssh -o BatchMode=yes "$HOST" 'ls -d ~/deploy-backups/*/*'`
lists the backups that exist.

### With an older GitHub artifact

[Deploy from GitHub](#deploy-from-github-without-ssh) with an older successful run: its zip
replaces the current folder. Works from a phone.

### Styles

`git revert` the commit, then `npm run styles:check`, `npm run styles:push` and `npm run purge`.
Without a computer, use the snippet's revisions in WPCodeBox
([Styles with WPCodeBox](styles-with-wpcodebox.md#undo-with-revisions)).

### The whole site from a Hub backup

The last resort: it also takes back every post, order, form entry and setting since the backup.
In the Hub: the site → Backups (check the exact labels). Over SSH these need the WPMU DEV
Dashboard plugin logged in; never add `--debug`, which prints the API key:

```bash
ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting backup list"
ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting backup create"
ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting backup restore <id>"
ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting action <action-id> --field=status"
```

`create` and `restore` run in the background and print an action id. A restore takes a safety
snapshot first.

### Then fix the repository

After any rollback of code, `git revert` the bad commit and push. Otherwise the next deploy, or
the next Action run, brings the problem back.

## Related

- [WordPress stack manual](README.md)
- [Emergencies and troubleshooting](emergencies-and-troubleshooting.md)
- [Roll back a deploy](../../06-runbooks/rollback-a-deploy.md)
- [Restore from backup](../../06-runbooks/restore-from-backup.md)
