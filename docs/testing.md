# Testing and continuous integration

Run the commands in this guide from the repository root. Use Node 24 and install
locked dependencies with `npm ci`. The install runs Husky's prepare step and
enables the repository hooks. npm packages and Playwright browser binaries are
separate installations. The minimum setup for the normal commit/push workflow is:

```powershell
npm ci
npx playwright install chromium
```

Install the additional browsers for the extended suite once per machine, and
repeat browser installation after a Playwright update:

```sh
npx playwright install chromium firefox webkit
```

On Linux, add `--with-deps` to install browser system libraries. If hooks are
missing after an install that skipped lifecycle scripts, run `npm run prepare`.

## What runs automatically

| Event | Checks | Result |
| --- | --- | --- |
| Save watched source/test files while `test:dev` runs | Related unit tests and a browser smoke subset | Prints results and continues watching |
| Save while `test:watch:full` runs | Production build, validation, and the full Chromium browser suite | Prints results and queues edits made during the run |
| `git commit` | `npm run test:unit` through Husky | A failing check blocks the commit |
| `git push` | `npm run test:ci` through Husky | A failing check blocks the push |
| Push to GitHub, or a PR targeting main | Production validation plus desktop/mobile Chromium checks | A failure blocks that workflow's deployment |
| Weekly schedule or manual extended run | All browser engines, both deployment prefixes, visual comparisons, and mutation testing | Publishes results separately from the deployment gate |
| Relevant main push or manual AI run, when enabled | AI proposes new tests; separate jobs validate and open a PR | Human review is required before merging |

GitHub cannot see unpushed local commits. Watchers must be started for each
editing session; they are not installed as a Windows background service. The
ordinary test and Git-hook commands do not require an OpenAI API key.

## Local feedback

| Command | What runs |
| --- | --- |
| `npm run test:dev` | Unit tests in watch mode plus browser smoke tests after each saved edit |
| `npm run test:watch` | Only Vitest's fast unit-test watcher |
| `npm run test:watch:full` | Rebuild, validate, and run the complete Chromium browser suite after edits |
| `npm run test:unit` | Unit tests once |
| `npm test` | Alias for the same unit-test run |
| `npm run test:coverage` | Unit tests with enforced coverage thresholds and an HTML report |
| `npm run check` | Coverage, model validation, production build, and generated-site validation; no browser suite |
| `npm run test:ci` | Coverage, model validation, production build, link/asset checks, desktop/mobile browser tests |
| `npm run test:e2e` | Desktop/mobile Chromium browser tests against an existing production build |
| `npm run test:e2e:ui` | Playwright's interactive browser-test debugger; build the site first |
| `npm run test:e2e:all` | Also test Firefox and WebKit; build first |
| `npm run test:visual` | Compare reviewed desktop/mobile screenshots on Windows; build first |
| `npm run test:visual:update` | Intentionally regenerate Windows baselines for review; build first |
| `npm run test:mutation` | Stryker mutation testing of the path and render-loop modules |
| `npm run build` | Build Astro and generate the Pagefind index |
| `npm run verify` | Validate the existing `dist/` output; build first |

Start `test:dev` while editing. It starts Vitest and lets Playwright manage a
dedicated Astro development server on port 4325. Source/content/style/test edits
are debounced, and edits during a test run queue another run. The fast browser
subset covers menus, keyboard navigation, FAQ interaction, and horizontal
overflow. Production search, accessibility scans, and full model rendering are
included in `test:ci` and the slower production watcher. Stop with Ctrl+C.
The watcher must be running to test on saves; hooks do not run on edits.

The pre-commit hook runs unit tests. The pre-push hook runs `test:ci`. A failed
check blocks that operation. Hooks are local convenience checks; GitHub Actions
is the independent enforcement point. An intentional exception can use
`HUSKY=0`, but CI still runs. No staged-file-only filtering is used: a helper
change can affect tests outside the edited files. Hooks test the working tree;
CI tests the committed snapshot, so review partial staging carefully.

Playwright uses `http://localhost:4325` with the active deployment prefix from
`config/site.mjs`. Let it manage this port; keep normal interactive development
on 4321. Tests start a fresh foreground server and refuse to reuse an occupied
test port. This also prevents Astro's agent background mode from leaving test
servers behind. Stop a development test session before production tests. The
production build is required for Pagefind. Browser test artifacts are written to
`playwright-report/` and `test-results/`; coverage is in `coverage/`.

### Test coverage by area

| Files/checks | What they cover |
| --- | --- |
| `tests/unit/paths.test.ts` | Root and nested deployment paths, external URLs, queries/fragments, responsive image URLs, and fast-check round-trip invariants |
| `tests/unit/viewer-render-loop.test.ts` | Input invalidation, idle/offscreen behavior, disposal, and the real OrbitControls pinch regression |
| `tests/unit/ai-test-proposal.test.ts` | Proposal file restrictions, batch validation, overwrite prevention, and rejection of disabled tests |
| `tests/unit/contact.test.mjs` | Contact origin/rate/challenge checks, fixed-recipient delivery, duplicate suppression, spam handling, and delivery retries with mocked services and an in-memory database |
| `scripts/verify-model.mjs` | The actual compressed robot assembly, geometry, indices, and dimensions |
| `scripts/verify.mjs` | Built HTML, navigation/content requirements, metadata, internal links, assets/CSS URLs, deployment prefixes, CMS configuration, sitemap, and search artifacts |
| `tests/e2e/navigation.spec.ts` | Mobile/desktop menus, changing menus, Escape/focus behavior, directory links, and the keyboard skip link |
| `tests/e2e/content.spec.ts` | FAQ keyboard access, built search results, horizontal overflow, and native contact-form behavior using mocked submissions |
| `tests/e2e/accessibility.spec.ts` | axe scans of the homepage, FAQ, robot overview, and search page |
| `tests/e2e/viewer.spec.ts` | On-demand loading of the real model, camera/rotation/reset controls, and a retry after download failure |
| `tests/e2e/generated/` | Additional reviewed regression tests, including sponsor-logo visibility across viewport sizes |
| `tests/e2e/visual.spec.ts` | Desktop/mobile FAQ viewport comparisons with reviewed Windows image baselines |

Unit and browser counts grow as tests are added; the runner output is the current
count. Coverage percentages apply only to the explicitly configured modules,
not every file listed in this table. Contact tests mock external delivery and
challenge services; they do not send real messages. Live contact-service setup
and deployment verification are documented in [contact-form.md](contact-form.md).

### Running a focused check

To debug a browser failure, build once and select a test by its title:

```powershell
npm run build
npm run test:e2e -- --project=mobile-chromium --grep "model download failure"
```

To run the extended browsers locally, or compare screenshots on Windows:

```powershell
npm run build
npm run test:e2e:all
npm run test:visual
```

These are separate checks; a screenshot failure must be reviewed before using
`npm run test:visual:update`. Use `npm run test:mutation` to identify logical
changes the unit tests do not detect. Mutation reports are in `reports/mutation/`.

## Editing, committing, and pushing

### Before editing

Check the branch and working tree. When the working tree is clean, update the
current branch without creating an automatic merge commit:

```powershell
git status --short --branch
git pull --ff-only
```

If pull reports diverged branches or local changes that would be overwritten,
resolve that situation before continuing. `--ff-only` stops instead of choosing
a merge/rebase strategy for you. Start `npm run test:dev` in a terminal while
editing, and stop it with Ctrl+C before a full check or push so browser commands
do not compete for port 4325.

### Review and commit

Review the diff and select the changes to include. `git add -p` interactively
stages changes in already tracked files:

```powershell
git status --short
git diff
git add -p
git diff --cached
git diff --cached --check
git commit -m "docs: document testing and commit workflow"
```

Replace the example commit message with a concise description of your change.
`git add -p` does not add new untracked files. Stage new files explicitly using
`git add --` followed by their paths. For example, to stage this guide and its
README entry together:

```powershell
git add -- README.md docs/testing.md
git diff --cached
```

Run staging commands before `git commit`. The pre-commit hook then runs all unit
tests automatically. If it fails, fix the issue, restage any fixes, and retry the
commit. Do not commit API keys, `.env`/`.dev.vars` secrets, generated test reports,
or build output. Avoid partial staging that leaves the tested working tree
different from the intended committed behavior.

### Push and verify CI

With the commit created, push the current branch to its configured upstream:

```powershell
git push
```

For the current main branch, the explicit equivalent is:

```powershell
git push origin main:main
```

The pre-push hook automatically runs `npm run test:ci` before Git uploads the
commit. Allow a few minutes for the build and real-model browser tests. A local
commit succeeding does not imply the broader pre-push suite will pass. A failed
push leaves the commit available locally for a retry.

To check the complete local push path without publishing the commit:

```powershell
git push --dry-run origin main:main
```

This still runs the pre-push hook; it is not a shortcut around the tests. It also
does not prove that every server-side GitHub protection rule will accept a real
push. To reproduce the hook's checks without contacting GitHub, run
`npm run test:ci` instead. Do not run both repeatedly unless diagnosing a failure.

After a successful push, inspect the repository's GitHub Actions run. main
deploys only after the build job succeeds; pull-request runs do not deploy.

### Seeing progress in VS Code

The built-in **Synchronize Changes** action runs Git in the background and has
no built-in setting to route that operation into the integrated terminal. To
view its logs, open the Command Palette with Ctrl+Shift+P and run **Git: Show Git
Output**. Leave the Output panel on the Git channel when synchronizing. Merge
this setting into your existing user settings JSON to retain standard output
for successful pull/push commands as well:

```json
{
  "git.commandsToLog": ["pull", "push"]
}
```

Hook output in that panel may appear after a command finishes. For live test
progress, use **Terminal → New Terminal** and run `git push` there. The same hooks
run for terminal and UI commits/pushes. VS Code's Synchronize operation can also
pull remote changes; a plain push only uploads the local branch. See the
[official Git Output instructions](https://code.visualstudio.com/docs/sourcecontrol/troubleshooting#_open-the-git-output-window).

## Troubleshooting blocked commits and pushes

`error: failed to push some refs` is a final summary, not the cause. Read the
first specific error above it. `husky - pre-push script failed (code 1)` means
the local hook returned a failure and Git stopped the push.

### Every browser test fails: missing executable

If the report says `browserType.launch: Executable doesn't exist` and names
`chrome-headless-shell.exe`, the browser tests could not start. This is a browser
installation problem, not a separate defect in every page. Repair the browser
cache from the same terminal/user account you use to push:

```powershell
npx playwright install --force chromium
npm run test:ci
```

Wait for the installation to finish successfully, then retry `git push` after the
checks pass. This downloads both Chromium and its headless shell. A dependency
or browser-cache repair alone does not require a new source commit. Reinstall
the additional browser engines too if a future extended run reports one missing.

### Inspecting an actual test failure

The test output names the failing assertion and its diagnostic files. Open the
latest browser report:

```powershell
npx playwright show-report
```

For a specific failure, use the trace path printed by Playwright. For example:

```powershell
npx playwright show-trace "test-results/viewer-model-download-failure-offers-a-retry-mobile-chromium/trace.zip"
```

The trace exists only when that test failed and a trace was saved. Its directory
name changes with the test/project; use the actual reported path. Review the
corresponding `error-context.md`, screenshot, and video where available. Later
runs replace local reports, so copy diagnostics elsewhere if you need to retain
them before rerunning. Prefer a focused test while fixing an assertion, then run
the full suite before pushing an application change.

### Port, Git, and environment failures

- If port 4325 is occupied, stop the other test watcher, Playwright UI, or test
  preview you started, then retry. Keep ordinary site preview/dev on 4321.
- If Git reports a rejected/non-fast-forward update, inspect `git status` and
  fetch/review the remote changes before deciding how to integrate them. A test
  repair does not solve a branch conflict.
- If Git reports authentication or permission errors, resolve GitHub credentials
  or repository access. Read the actual remote message; an OpenAI API key does
  not authenticate a Git push.
- If the terminal works but the VS Code UI does not, inspect Git Output for its
  Node/npm/path or hook error. Restart VS Code after changing Node installation
  or environment variables, and retry from the terminal to capture the full log.

## GitHub Actions

`pages.yml` now tests every pushed branch and PR targeting main. It installs
Chromium, runs `npm run check` and desktop/mobile browser tests, and uploads
failure traces, screenshots, videos, and coverage for 14 days. Only main can
deploy, and deployment waits for the entire build job to pass. Local commits
are checked by hooks; Actions starts after pushing.

`extended-tests.yml` runs Sundays at 12:00 UTC and can also be started manually.
It checks Chromium, Firefox, and WebKit under both root and project deployment
prefixes, runs mutation testing, and checks Windows screenshots. Windows visual
baselines are intentionally compared on Windows runners to avoid Linux font
rendering differences. Review baseline images and diffs before committing any
updates. Extended tests are separate from the normal deployment gate.

Make `build` from the Pages workflow a required status check in the main branch
ruleset if merges must be blocked on failures. An administrator must configure
that GitHub setting; a workflow cannot establish branch protection by itself.

## AI-generated test improvements

The optional `ai-tests.yml` workflow uses the official Codex GitHub Action.
It runs after main changes and supports manual dispatch on main. It skips
test/documentation-only pushes to avoid generating a proposal for its own tests.
No AI calls occur until this repository configuration is supplied:

1. Add the `OPENAI_API_KEY` Actions secret in repository Settings → Secrets and
   variables → Actions. Use a key with API billing/access; never commit it.
2. Add repository Actions variable `AI_TESTS_ENABLED` with value `true`.
3. In Settings → Actions → General, enable **Allow GitHub Actions to create and
   approve pull requests** if organization policy permits it. This workflow only
   creates PRs; it never approves or merges them.

An optional `AI_TEST_MODEL` repository variable selects the model; otherwise the
Codex action uses its default. AI runs use API billing independently of local
test execution. Start with a manual run and review its output and usage.

The generation job gets read-only repository permissions and the API connection.
It reads the diff, recent history, coverage, surviving mutations, accepted tests,
and testing-case notes. It may propose at most three new test files plus brief
notes. Only new files in
`tests/unit/generated/`, `tests/e2e/generated/`, and `docs/testing-cases/` are
eligible for collection. Existing test changes, application changes, dependency
changes, screenshot changes, and file overwrites are excluded.

A fresh job checks the artifact paths, refuses overwrites, and runs `test:ci`
without API credentials or a repository write token, then reruns mutation testing.
A final clean job opens a `codex/tests-*` branch and PR containing the validated
new files. The generated
tests are not executed in the write-permission job. Because PRs created using
`GITHUB_TOKEN` do not trigger ordinary push/PR workflows, the final job explicitly
dispatches the normal Pages workflow on that branch to produce a build check.
The PR stays open for review; nothing auto-merges.

If no worthwhile test is found, no PR is created. Failures remain visible in
Actions. If PR creation is blocked by repository policy, the proposed-tests
artifact is still available for seven days. Repository context supplies durable
knowledge across runs; the workflow does not retrain a model. After accepting a
useful regression test, preserve the lesson in `docs/testing-cases/`.

Before merging an AI proposal, confirm its expectations describe intended
behavior. Passing tests and high coverage alone do not prove that. For bug fixes,
prefer evidence that the regression test fails before the fix and passes after.

## Scope and maintenance

Unit coverage thresholds currently apply to `paths.mjs` and
`viewer-render-loop.mjs`: 95% lines/statements/functions and 90% branches. Expand
the explicit scope as other logic gains meaningful tests. These percentages do
not describe whole-site coverage. Stryker intentionally mutates those same two
modules and requires a 70% score; surviving mutations are candidates for review,
not a reason to invent assertions for equivalent behavior.

TypeScript is held on the 5.9 compiler line because Stryker's config processing
uses compiler APIs not exposed by TypeScript 7. Upgrade after checking support.
Keep Playwright and its browser binaries aligned through the lockfile. Do not
silently update screenshot baselines or suppress accessibility rules to pass CI.

Browser fixtures block external HTTP requests. They test your site's behavior
without relying on YouTube/Google Forms availability or submitting data. Model
tests still load the real local assembly. Automated accessibility checks cover
common defects and should be supplemented with manual assistive-technology use.

Production dependency auditing is clean at setup. npm reports moderate advisories
in development-only transitive dependencies of Stryker (minimatch and the REST
client); available nonbreaking audit fixes did not clear them. These packages are
not shipped in the static site. Recheck with `npm audit` when updating tooling.

The setup machine could not launch Playwright Firefox on Windows (`spawn
UNKNOWN`), including after reinstalling it. Chromium and WebKit launch normally.
Firefox remains enabled in the Linux extended CI job; verify that run after the
workflow is pushed. No browser check is silently disabled for this local issue.

Official references: [Astro testing](https://docs.astro.build/en/guides/testing/),
[Vitest](https://vitest.dev/guide/),
[Playwright](https://playwright.dev/docs/intro),
[Codex GitHub Action](https://learn.chatgpt.com/docs/github-action), and
[Stryker](https://stryker-mutator.io/docs/stryker-js/).
