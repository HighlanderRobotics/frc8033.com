# Testing and continuous integration

Use Node 24 and install locked dependencies with `npm ci`. The install runs
Husky's prepare step and enables the repository hooks. Install browser binaries
once per machine (and again after a Playwright update):

```sh
npx playwright install chromium firefox webkit
```

On Linux, add `--with-deps` to install browser system libraries. These steps have
already been completed in the Windows checkout used to add this infrastructure.

## Local feedback

| Command | What runs |
| --- | --- |
| `npm run test:dev` | Unit tests in watch mode plus browser smoke tests after each saved edit |
| `npm run test:watch` | Only Vitest's fast unit-test watcher |
| `npm run test:watch:full` | Rebuild, validate, and run the complete Chromium browser suite after edits |
| `npm run test:unit` | Unit tests once |
| `npm run test:coverage` | Unit tests with enforced coverage thresholds and an HTML report |
| `npm run test:ci` | Coverage, model validation, production build, link/asset checks, desktop/mobile browser tests |
| `npm run test:e2e:ui` | Playwright's interactive browser-test debugger; build the site first |
| `npm run test:e2e:all` | Also test Firefox and WebKit; build first |
| `npm run test:visual` | Compare reviewed desktop/mobile screenshots on Windows; build first |
| `npm run test:visual:update` | Intentionally regenerate Windows baselines for review; build first |
| `npm run test:mutation` | Stryker mutation testing of the path and render-loop modules |

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
servers behind. Stop a development test session before production tests. The production
build is required for Pagefind. Browser test artifacts are written to
`playwright-report/` and `test-results/`; coverage is in `coverage/`.

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
and testing-case notes. It may
propose at most three new test files plus brief notes. Only new files in
`tests/unit/generated/`, `tests/e2e/generated/`, and `docs/testing-cases/` are
eligible for collection. Existing test changes, application changes, dependency
changes, screenshot changes, and file overwrites are excluded.

A fresh job checks the artifact paths, refuses overwrites, and runs `test:ci`
without API credentials or a repository write token, then reruns mutation testing.
A final clean job opens a
`codex/tests-*` branch and PR containing the validated new files. The generated
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
