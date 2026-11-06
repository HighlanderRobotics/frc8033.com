# Highlander Robotics — Astro replica

Replica of the 24 publicly discovered pages at [frc8033.com](https://www.frc8033.com/), reviewed November 5, 2026. Uses Astro 7, Tailwind CSS 4, Sveltia headless CMS, and Pagefind search.

## Run locally

Requires Node 22.23.4+; developed with Node 24. Run `npm ci`, `npm run build`, `npm run verify`, then `npm run preview`. Open `http://localhost:4321/`. Search is at `/search`; CMS is at `/admin/`. `npm run dev` supports source development, but Pagefind requires a production build/preview.

The current live website remains on Webflow. No deployment, Git push, or domain change was performed.

## Documentation

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
