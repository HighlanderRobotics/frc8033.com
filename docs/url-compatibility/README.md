# Existing URLs and custom-domain cutover

The November 19, 2026 read-only crawl found 23 linked public pages on
https://www.frc8033.com. Their exact paths are recorded in [live-site.json](live-site.json).
The earlier 24-page archive also includes `/contact`. All of these paths are
preserved; the new outreach overview is additive. `npm run verify` fails if a
page from either inventory is removed. Browser regression tests request every
original page and check a bookmark with a query string and fragment.
Local preview accepts both slashless and trailing-slash page URLs; static builds
retain directory indexes and trailing-slash canonicals.

Existing slugs are intentionally unchanged, including `/robots/wispp---2026`,
`/robots/banshee---2024`, and `/outreach/outreach-2025-2026`. Published navigation
and canonical URLs use a trailing slash. GitHub Pages serves the corresponding
directory for old slashless bookmarks, redirecting to the trailing-slash URL.
No Webflow redirect service or `_redirects` file is required for these paths.
Unlinked/private pages and redirects configured only inside Webflow are outside
the public crawl; export any such redirects before retiring that service.

## Connecting the domain

1. In the repository's **Settings → Pages**, keep **GitHub Actions** as the source
   and set the custom domain to `www.frc8033.com`. Verify ownership and configure
   DNS using GitHub's [custom-domain instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
   Configure both apex and www DNS if both should work; GitHub can redirect the
   apex to the selected www domain. Enable HTTPS when the certificate is ready.
2. Run **Build and deploy GitHub Pages** on `main` after saving the Pages domain.
   The build reads `origin` and `base_path` from `actions/configure-pages` before
   building and testing. Project hosting produces `/frc8033.com/`; the custom
   domain produces `/`. No committed `CNAME` file is needed for Actions publishing.
   Do not add a `frc8033.com` folder to the artifact.
3. Check the homepage, an old robot bookmark, `/contact/`, `/search/`,
   `/sitemap.xml`, and `/admin/config.yml` at the domain. Canonicals, search
   results, assets, model URLs, and CMS uploads must use the custom domain/root.
4. Confirm the CMS authentication service allows `www.frc8033.com` and the contact
   service/Turnstile allow the production hostname; see [contact setup](../contact-form.md).
   These external services are configured separately from static hosting.

The workflow retains project-path defaults for pull requests and other branches.
Local custom-domain verification uses `SITE_URL=https://www.frc8033.com` and
`BASE_PATH=/` (PowerShell examples are in the main README). Run `npm run test:ci`
with those variables to test the root build. Clear them before testing the
default project build. The Astro preview checks route content; GitHub's own
slash redirect, domain redirects, DNS, and certificate issuance require a
post-deployment check on GitHub Pages itself.

Refresh the read-only inventory deliberately with `node scripts/check-live-urls.mjs`
while the original site is still live. Review the changes before committing.

## Validation on November 19, 2026

- Default project path: `npm run test:ci` passed (56 unit tests, model validation,
  production build, site verification with zero errors, 34 desktop/mobile tests).
- Custom domain/root: production build and verification passed; all legacy URL,
  canonical, query/fragment, search, navigation, and mobile tests passed. One
  existing desktop Wisp viewer test timed out in the full run (33/34 passed);
  both desktop viewer tests passed on an isolated rerun with one worker.
- The legacy bookmark test reproduced a preview 404 before the route-handling
  fix and passed afterward at both deployment paths.
- DNS, HTTPS issuance, live GitHub redirect behavior, and external authentication
  remain cutover checks; this work did not deploy or change domain settings.
