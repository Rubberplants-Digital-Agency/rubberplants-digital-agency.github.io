---
title: Set up without Claude
description: Connect another computer to a WordPress stack project, start a new project from the kit, and activate a new site by hand.
status: review
owner: bjorn
updated: 2026-10-07
---

The kit is a private repository; clone it as `default-install` next to your project folders.
Its `scaffold.mjs` renders a new project, and its `PLAYBOOK-HUMAN.md` carries this manual in one
file. Examples use the made-up project Acme Studio.

## Another computer

1. Install Git for Windows (it brings Git Bash) and Node.js 20.19 or newer.
2. Clone and install, in PowerShell, in the folder that holds your projects:

   ```powershell
   git clone https://github.com/<owner>/acme-studio.git
   cd acme-studio
   git config user.name "<project author name>"
   git config user.email "<project author e-mail>"
   npm install
   npm run check
   ```

   The author belongs to the project: set it in the repository, never with `--global`.

3. Make an SSH key for this computer, in Git Bash. One key per computer, so you can revoke one
   without the other. A new computer may have no `.ssh` folder yet, and ssh-keygen does not
   create it:

   ```bash
   mkdir -p ~/.ssh
   ssh-keygen -t ed25519 -f ~/.ssh/acme-studio_deploy -N "" -C "acme-studio-deploy"
   cat ~/.ssh/acme-studio_deploy.pub
   ```

   In PowerShell, Windows PowerShell 5.1 drops the empty argument and does not expand `~` for
   ssh-keygen, so write:

   ```powershell
   New-Item -ItemType Directory -Force "$HOME\.ssh" | Out-Null
   ssh-keygen -t ed25519 -f "$HOME\.ssh\acme-studio_deploy" -N '""' -C "acme-studio-deploy"
   Get-Content "$HOME\.ssh\acme-studio_deploy.pub"
   ```

   Without a passphrase nothing prompts during deploys, but anyone with your Windows account can
   reach the server. Add the public key in the Hub: the site → Hosting → SFTP/SSH → your SSH
   user, or a new one.

4. Add the alias to `~/.ssh/config` (`%USERPROFILE%\.ssh\config`; in Notepad choose "All files",
   or it saves `config.txt`), with the host and user the Hub shows:

   ```text
   Host acme-studio
     HostName acme-studio.tempurl.host
     User acme-ssh
     IdentityFile ~/.ssh/acme-studio_deploy
     IdentitiesOnly yes
     StrictHostKeyChecking accept-new
   ```

   `accept-new` records the server's key on the first connection, which batch mode cannot ask
   about. Windows' ssh and Git Bash's ssh read the same file.

5. Test it and find the WordPress root, in Git Bash:

   ```bash
   ssh -o BatchMode=yes acme-studio 'ls -d ~/*/public_html; wp cli version'
   ```

6. Copy `.deploy.env.example` to `.deploy.env` and fill in the alias and the root:

   ```text
   DEPLOY_SSH=acme-studio
   DEPLOY_WP_ROOT=/home/acme-ssh/acmestudio/public_html
   ```

7. Connect the site, for the style tools and for Claude. As an administrator in WP admin:
   **Users → Profile → Application Passwords**, name it after the project and this computer, add
   it and copy the password. Create `.wp-credentials` in the project folder with an editor (in
   Notepad, choose "All files", or it saves `.txt`):

   ```text
   WP_USER=<your WordPress username>
   WP_APP_PASSWORD=<the application password, spaces allowed>
   ```

   Then run `npm run setup:mcp` in PowerShell. It writes `.mcp.json`, tests the connection and,
   when the test passes, deletes `.wp-credentials`. When the test fails, the file stays (git
   ignores it): fix the problem and run the command again, or delete the file. Never paste the
   password into a chat or a command line.

8. If you use Claude Code on this computer too, run this in the project folder:

   ```powershell
   node ../default-install/scaffold.mjs --target . --local-only
   ```

   It writes only the files git does not carry and adds missing skills; it never overwrites
   committed files.

9. Test, in PowerShell: `npm run wp -- option get home` proves SSH, WP-CLI and
   `DEPLOY_WP_ROOT` (it prints the site URL), and `npm run styles:status` proves the Application
   Password and WPCodeBox.

## A new project

### Decide first

Per project: the git author name and e-mail, the GitHub owner (an organisation or a user), the
theme slug, the plugin slug (`<slug>-core`), the PHP prefix and the CSS prefix. The repository is
named after the folder and is private.

### On the site

- WordPress 6.9 or newer over HTTPS, and an administrator account.
- Astra installed; Spectra Blocks and the MCP Adapter plugin (`mcp-adapter`) active; WooCommerce
  for a shop.
- WPCodeBox 2, installed from the zip in the WPCodeBox account, with the licence key in its
  settings. Allow its MCP tools: WP admin → WPCodeBox 2 → the toolbar button **MCP / AI**, which
  opens the dialog "MCP / AI Access" → "Tools the agent may call" → the read tools plus
  `wpcodebox_create_snippet`, `wpcodebox_update_snippet`, `wpcodebox_enable_snippet` and
  `wpcodebox_create_folder`, then save. Leave `wpcodebox_delete_snippet` and
  `wpcodebox_run_snippet` off; `wpcodebox_disable_snippet` is optional, as the style tools never
  use it.

### On your computer

1. Create an empty folder named like the repository, next to `default-install`.
2. Scaffold, in that folder, in PowerShell:

   ```powershell
   node ../default-install/scaffold.mjs --target . --name "Acme Studio" --theme acme-studio --plugin acme-studio-core --php acme --css acme --author "Acme Agency" --site https://acme-studio.tempurl.host --dry-run
   ```

   Read the plan, then run it again without `--dry-run`. Add `--woocommerce` for a shop. The
   scaffold checks every value and stops with the reason. `--name` also names the WPCodeBox folder
   (`Acme Studio styles`) and the main snippet (`Acme Studio site styles`).

3. `npm install`, then `npm run check`.
4. SSH key, Hub user, alias, test and `.deploy.env`: steps 3 to 6 of
   [another computer](#another-computer).
5. `.wp-credentials` and `npm run setup:mcp`: step 7 of [another computer](#another-computer).
6. Git, with the project's author:

   ```powershell
   git init -b main
   git config user.name "<project author name>"
   git config user.email "<project author e-mail>"
   git add -A
   git status
   git commit -m "Set up Acme Studio from the WordPress stack kit"
   ```

   Check that `git status` lists no `.mcp.json`, `.deploy.env`, `.wp-credentials` or key file
   before you commit. `package-lock.json` must be in it: the GitHub Action installs from it.

7. Create the repository. `gh auth status` shows the active account, and
   `gh auth switch --user <account>` changes it:

   ```powershell
   gh repo create <owner>/acme-studio --private --source . --push
   ```

8. Deploy and activate: `npm run deploy`, then `npm run activate`.
9. Styles: `npm run styles:push`. The first push creates the folder, every partial and the main
   snippet, and enables it. Then `npm run purge`.
10. Check as a visitor: the site answers 200, `npm run wp -- theme list --status=active` shows the
    child theme, and the page source contains `wpcb2-inline-style` (WPCodeBox writes
    `<style  class='wpcb2-inline-style'>` with two spaces, so search for the class name). In Git
    Bash, `curl -s https://acme-studio.tempurl.host/ | grep -c wpcb2-inline-style` prints 1 or
    more.

When nobody needs the Application Password any more, revoke it in **Users → Profile → Application
Passwords**. `npm run setup:mcp` with a new one reconnects.

## First activation by hand

`npm run activate` does this once per site, after the first deploy. By hand, in Git Bash:

1. Set the values and activate the site plugin:

   ```bash
   HOST=acme-studio
   ROOT=/home/acme-ssh/acmestudio/public_html
   ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' plugin activate acme-studio-core"
   ```

2. Copy the parent's theme mods to the child theme, only when the child has none yet. Theme mods
   are stored per theme: the logo, menu locations, header image and the Additional CSS pointer.
   The widget snapshot stays behind, as in the tool:

   ```bash
   PHP='if ( null !== get_option( "theme_mods_acme-studio", null ) ) { echo "acme-studio already has theme mods; left unchanged.\n"; return; } $mods = get_option( "theme_mods_astra" ); if ( ! is_array( $mods ) || ! $mods ) { echo "astra has no theme mods to copy.\n"; return; } unset( $mods["sidebars_widgets"] ); add_option( "theme_mods_acme-studio", $mods ); echo "Copied " . count( $mods ) . " theme mods from astra to acme-studio.\n";'
   ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' eval '$PHP'"
   ```

   Replace every `acme-studio` with the child theme's slug and every `astra` with the parent's.
   The PHP sits in single quotes for Git Bash and uses only double quotes inside, so nothing needs
   escaping.

3. Activate the child theme, purge and check:

   ```bash
   ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' theme activate acme-studio"
   ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' hosting clearcache all"
   ssh -o BatchMode=yes "$HOST" "wp --path='$ROOT' theme list --status=active"
   ```

Without SSH: activate the plugin under **Plugins**, then the child theme under **Appearance →
Themes**. WordPress moves the menu locations to the new theme, but not the logo or the header
image: set those again in the Customizer.

## Related

- [WordPress stack manual](README.md)
- [Deploy and roll back](deploy-and-roll-back.md)
- [Onboarding a new developer](../../01-handbook/onboarding-new-developer.md)
- [Git workflow](../../02-standards/git-workflow.md)
