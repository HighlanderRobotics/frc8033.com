# Replica implementation and handoff

## Architecture

Astro 7 builds static routes from validated JSON records. All 24 original paths, including the unusual robot slugs, are preserved. Shared layout renders header/footer once. Local Webflow CSS and fonts preserve the design; Tailwind 4's Vite plugin supplies theme/utilities without preflight resetting legacy styles.

Sveltia is installed from npm and bundled only for `/admin/`. Its approximately 1.5 MB editor bundle produces a Vite size warning but is not loaded on public content pages. Content is stored in Git rather than a separate database. No paid CMS account is required for local editing.

Pagefind runs after Astro in `npm run build`, writes `dist/pagefind`, and powers `/search`. Public pages define searchable body regions; shared navigation/footer are excluded. There is no search server. The default Pagefind UI remains supported in the installed release.

## CMS editing

1. Open `/admin/` in Chrome or Edge with the local server running.
2. Choose Sveltia's local repository option and select this project folder. This uses browser File System Access; no proxy server is required.
3. Update title/description or carefully edit the preserved HTML field and save.
4. Build, preview, verify, and review the Git diff before committing.

The body is a text/code field. Preserve class names, image paths, and layout wrappers. This is a headless editor for a fidelity replica, not a friendly block editor for nontechnical volunteers. A subsequent pass should extract robots, people, sponsors, FAQs, and outreach into structured records/templates. Do not rerun archive import after editorial changes unless overwriting them is intended.

Remote editing targets `HighlanderRobotics/frc8033.com`, branch `main`. The remote must contain these source files first. Sveltia supports user-provided GitHub access tokens; team-managed OAuth is preferable for ordinary editors. No credentials are stored in source and no OAuth service was provisioned. Authenticated remote saving and browser-folder saving have not been exercised. The editor does not automatically deploy this repository.

## Deliberate differences from the live site

The subsequent [rendering review](rendering-review/README.md) fixes inherited body offsets, oversized/overlapping titles, narrow buttons, overflow, and unsupported animation layouts. Shared navigation now renders from the same CMS source through `Header.astro` using native disclosures; build-time presentation cleanup is in `src/lib/presentation.ts`. Search is in the header rather than a floating overlay. Styling corrections live separately in `src/styles/refinements.css` so the original downloaded stylesheet and archive remain intact.

- Local media, styles, and fonts replace CDN requests. YouTube and business-service links remain external.
- Small native scripts replace the Webflow/jQuery runtime for navigation. FAQ uses keyboard-accessible native disclosures and works without JavaScript.
- Homepage Learn More now leads to Paddo's detail page.
- Added Pagefind search, skip link, focus outlines, document language, canonicals, fallback descriptions, sitemap, and 404 page.
- Contact is an explicitly labelled email-app fallback. Required fields are validated and composed into an email to the public team address. The visitor must send the message from a configured email app. This does not reproduce Webflow hosted delivery or claim successful receipt.
- Webflow animation/interaction identifiers are removed from rendered content. Original scripts and markup remain in the archive.
- Historical copy, older robot gallery, closed registration link, and both donation routes are retained for fidelity. Proposed corrections are documented in the audience review.

## Verification

`npm run build` generates pages and search. `npm run verify` checks all original routes, shared footers, searchable bodies, removal of Webflow runtime, local internal links and referenced assets, CSS fonts/background images, all sixteen FAQ disclosures, sitemap, and CMS entry point. Results are in `docs/verification.json`.

Browser checks cover representative pages and interactions, not every route or formal WCAG/pixel-perfect conformance. TeamSnap closure was confirmed in the downloaded response. No payment, registration, or contact message was submitted.

Observed in the local browser: homepage rendered with local media at desktop and mobile widths; searching “Wisp” returned its robot page; FAQ meeting answer expanded; mobile navigation exposed its links; `/admin/` displayed Sveltia's GitHub and local-repository choices. CMS saving remains untested. A homepage screenshot is saved as `docs/replica-preview.png`. The preview returned HTTP 200. The temporary preview server was stopped after verification; run `npm run preview` to reopen it.

## Before replacing production

- Configure a real contact form service; confirm recipients, spam controls, and delivery.
- Approve current registration messaging and verify the purpose of both donation routes.
- Correct dated copy and counts and review meaningful image descriptions, heading hierarchy, mobile layouts, and keyboard access.
- Configure remote CMS authentication, editor permissions, review previews, and a deployment target.
- Review the deployed preview before switching DNS; preserve mail records and retain Webflow for rollback.

No public deployment, domain cutover, or account access changes were performed.
