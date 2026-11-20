# Highlander Robotics — Astro replica

Originally a replica of the 24 publicly discovered pages at [frc8033.com](https://www.frc8033.com/) as of November 5, 2026. 

### Uses Astro 7, Tailwind CSS 4, Sveltia headless CMS, and Pagefind search.

## Run locally

Requires Node 22.23.4+; developed with Node 24. Run `npm ci`, `npm run check`, then `npm run preview`. Open `http://localhost:4321/frc8033.com/`.

Search is at `/frc8033.com/search/`; CMS is at `/frc8033.com/admin/`. `npm run dev` uses the same project path, but Pagefind requires a production build/preview.

### The current live website remains on Webflow.

## Test, commit, and push

Install test browsers after `npm ci` with `npx playwright install chromium`.
Use `npm run test:dev` while editing for unit and browser checks after saves.
Stop the watcher with Ctrl+C before a full browser run or push.

Review and stage your changes, then commit and push from a terminal:

```powershell
git status --short --branch
git diff
git add -p
git diff --cached
git commit -m "Describe the change"
git push
```

Stage new untracked files explicitly with `git add --` and their paths;
`git add -p` selects changes in tracked files. The commit hook runs unit tests.
The push hook runs `npm run test:ci`: coverage, model checks, production build,
site validation, and desktop/mobile browser tests. A failure blocks the operation.
Use the terminal for live hook output; VS Code's Git Output panel also records
Git results. GitHub repeats the checks after pushing and gates deployment.

See the [complete testing and commit guide](docs/testing.md) for every test command,
extended and AI workflows, staging examples, VS Code logging settings, reports,
and repairs for missing Playwright browsers or failed pushes.

## GitHub Pages URLs

The default local/PR URL uses `/frc8033.com/`, matching `https://highlanderrobotics.github.io/frc8033.com/`. Production builds read the actual origin and base path from GitHub Pages before validation and building. Once Pages is configured for `www.frc8033.com`, the workflow automatically builds for `https://www.frc8033.com/` with no repository prefix. `config/site.mjs` is the shared deployment configuration. Astro routes, imported HTML, navigation, images, CSS, Pagefind, canonical URLs, sitemap, and CMS media URLs honor this base path.

To build for a custom domain at the domain root in PowerShell:

```powershell
$env:SITE_URL = 'https://www.frc8033.com'
$env:BASE_PATH = '/'
npm run check
```

Clear those session overrides before returning to the GitHub Pages defaults:

```powershell
Remove-Item Env:SITE_URL, Env:BASE_PATH -ErrorAction SilentlyContinue
npm run check
```

The workflow in `.github/workflows/pages.yml` installs locked dependencies with Node 24, runs `npm run check` (including the production build and Pagefind indexing), and publishes the **contents of `dist/`** as the Pages artifact after a push to `main`. Pull requests run the same checks without deploying. A manual run is available from the Actions tab. Do not add another `frc8033.com` directory inside `dist/`; GitHub mounts the artifact at the repository path.

## Future pushes to the `main` branch, including CMS content commits, rebuild and deploy automatically.

No personal access token, repository secret, `gh-pages` branch, or manually committed build folder is needed for this deployment workflow. Organization Actions policies and environment protection rules may require an administrator to allow the listed official GitHub actions or approve the deployment.

Publishing the static site does not configure browser-based CMS sign-in. The CMS is available at `/frc8033.com/admin/` on the project URL and `/admin/` on the custom domain; use its local-repository mode or separately configure its GitHub authentication. See [contact form deployment](docs/contact-form.md) to enable and operate online contact submissions. See [URL compatibility and domain cutover](docs/url-compatibility/README.md) before connecting the domain.

Content records keep logical site-root paths such as `/robots/paddo` and `/assets/...`; rendering adds the deployment prefix. New Astro components should use `withBase()` from `src/lib/urls.ts`. Preserve external links and fragment-only anchors. Downloaded CSS uses stylesheet-relative image/font URLs, so it also works under a subdirectory.

The CMS source is `src/data/admin-config.yml`; Astro generates `/frc8033.com/admin/config.yml` with the active deployment's site and upload URLs. Sitemap and robots text are generated too. A project-level `robots.txt` cannot control crawling for the entire shared `github.io` hostname; it includes the appropriate project sitemap URL.

## Documentation

- [Testing, local watch checks, CI, and AI test proposals](docs/testing.md): commands, Git hooks, workflow behavior, and GitHub setup.

- [Rendering review and fixes](docs/rendering-review/README.md): page-by-page findings, responsive results, and final control examples.

- [Audience review](docs/audience-review.md): content summary and strengths/gaps for all eight current/prospective audience groups.
- [Implementation and CMS handoff](docs/implementation.md): architecture, editing, deliberate differences, limitations, and launch requirements.
- [Archive manifest](archive/2026-11-05/manifest.json): pages, asset provenance/hashes, external destinations, and crawl exceptions.
- [Verification results](docs/verification.json): build-output checks.

- [Website feature and integration audit](docs/website-audit.md): 24 discovered public pages, external services, migration requirements, and known verification limits.
- [Website migration plan](docs/migration-plan.md): implementation steps, proposed content structure, editing workflow, and launch checks.
- [Original audit report in Word format](docs/website-audit.docx).

The audit and plan record research from November 5, 2026. Recheck service destinations and framework dependencies before implementation.

## Content and archive

Page records live in `src/content/pages/*.json`, validated by an Astro content collection. Header/footer are in `src/data/chrome.json`. Sveltia edits those same files; in Chrome/Edge, select the local repository folder to work without OAuth. The CMS exposes the preserved HTML as a text field, rather than a visual block editor.

Raw HTML/text snapshots are in `archive/2026-11-05/pages/`; original CSS is in its `styles/` folder. Downloaded assets in `public/assets/` are shared by the replica. External applications, private/unlinked content, and hosted video files are outside this public crawl.

`npm run import:archive` recreates content records from snapshots and **overwrites editorial changes**. `npm run archive` downloads and imports a fresh snapshot, also overwriting records. These are intentional maintenance commands, never build steps. Update the date in all archive scripts before taking a new dated snapshot. Preserve archive evidence in Git before refreshing it.
