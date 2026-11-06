# Highlander Robotics website migration plan

Planning date: November 5, 2026.

## Objective and scope

Move the public website from Webflow to the framework used by Piedmont Makers. Make content and page templates easy to edit with AI.

Retain Highlander branding, the current domain, and all 24 existing content paths. Use a separate Highlander Robotics repository.

This is a proposed plan. The website implementation, service setup, and domain change have not started.

## Reference implementation

Reviewed repository: [piedmontmakers/piedmontmakers.org](https://github.com/piedmontmakers/piedmontmakers.org).

Reviewed commit: [`38840f15fe35dccc9930c31240b936b29ac1033a`](https://github.com/piedmontmakers/piedmontmakers.org/tree/38840f15fe35dccc9930c31240b936b29ac1033a).

| Layer | Reference implementation | Highlander treatment |
| --- | --- | --- |
| Framework | Astro 5 | Start from the reference's compatible locked versions |
| Styling | Tailwind CSS 4 | Use Highlander colors, typography, and branding |
| Language | TypeScript | Use typed shared data and validated content |
| Content | Astro Markdown collections | Add robot and outreach collections |
| Runtime | Node 24 | Match the reference's development and build runtime |
| Hosting | GitHub Pages | Configure independent deployment after review |
| Editing UI | Sveltia CMS | Extend the reference's blog-only configuration |
| Authentication | GitHub OAuth and a Cloudflare Worker proxy | Configure for the Highlander repository and domain |
| Verification | Astro checks, scripts, Playwright, and accessibility checks | Adapt to Highlander routes and requirements |
| Analytics | PostHog | Optional; configure Highlander-specific settings if enabled |

The reference documents a compatibility reason for remaining on Astro 5. Reassess that constraint before a deliberate framework upgrade.

## Implementation steps

### 1 Establish the project

Adapt the framework, dependency lockfile, shared layouts, URL helpers, verification scripts, and deployment workflow.

Retain the MIT notice for reused source code. Use Highlander assets; the reference's brand assets and photos are not covered by its code license.

Replace reference-specific metadata, organization facts, domains, authentication destinations, and analytics identifiers.

Completion check: a separate repository with a successful build and Highlander configuration throughout.

### 2 Structure the content

Create Markdown collections for robot details and outreach records. Use shared data files for people, sponsors, competitions, awards, FAQs, and site settings.

Map each of the 24 audited page paths to a page or generated template. Preserve existing paths, including the unusual robot slugs.

Store registration status and URL together. Generate the robot gallery and navigation from the same robot records.

Completion check: all audited pages map to content records without duplicated seasonal facts.

### 3 Rebuild the pages

Implement the header, footer, homepage, robot templates, outreach archives, profiles, sponsor sections, and FAQ controls.

Copy required images and background images from Webflow into the new asset directory. Preserve video IDs and accessible descriptions.

Completion check: a complete desktop and mobile preview with Highlander branding and media.

### 4 Connect external services

Preserve TeamSnap registration, FundRazr donations, Piedmont Makers donations through Square Online, Bonfire merchandise, Lovat, YouTube, social profiles, and email links.

Replace Webflow contact form handling. GitHub Pages serves a static website, so form submission needs an external service.

Inspect the current form recipients and retention requirements before selecting that service. Configure validation, spam protection, notification routing, and any required storage.

Completion check: correct external destinations and verified contact delivery to an approved test recipient.

### 5 Enable editing and verification

Add Highlander-specific agent instructions, content recipes, and preview instructions. Extend Sveltia to the content collections that editors need.

Configure GitHub authentication for the new CMS. Do not assume the reference's authentication service already accepts the Highlander domain.

Use one verification command for local checks and deployment checks. Cover builds, content validation, links, images, keyboard navigation, mobile layouts, and accessibility.

Demonstrate one AI content edit and one CMS edit. Review changes before production deployment.

Completion check: successful edits through both workflows and passing verification.

### 6 Review and launch

Review the complete preview. Verify the domain settings, existing email records, and production deployment configuration.

Obtain approval for publication before switching the domain. Deploy through GitHub Actions and verify the live site.

Keep a documented rollback path to the previous deployment or hosting configuration.

Completion check: working public pages and contact form, preserved email settings, and verified rollback instructions.

## Proposed content locations

These paths describe the future implementation; they do not exist yet.

| Proposed path | Purpose |
| --- | --- |
| `src/content/robots/` | Robot descriptions, specifications, photos, and video references |
| `src/content/outreach/` | Outreach records grouped by season |
| `src/data/people.ts` | Student leadership and mentors |
| `src/data/sponsors.ts` | Sponsor groups, logos, and recognition levels |
| `src/data/competitions.ts` | Competitions and awards |
| `src/data/faq.ts` | Questions and answers |
| `src/data/site.ts` | Contact details, registration status, and external destinations |
| `public/img/` | Locally stored website images |
| `public/admin/` | Sveltia editor configuration |

## Migration decisions

| Topic | Planned treatment |
| --- | --- |
| Contact form | Select an external submission service after checking recipients and retention requirements |
| Registration | Resolve the closed TeamSnap form and make homepage messaging match its status |
| Donations | Preserve FundRazr and Square separately until their intended roles are confirmed |
| Analytics | Treat PostHog as optional and use Highlander-specific settings if enabled |
| AI editing | Use plain-text content, validated fields, shared templates, reviewable changes, and version history |
| Publishing | Adapt the reference's direct-to-main workflow to review changes before deployment |
| Content corrections | Update the robot index, seasonal claims, placeholder links, descriptions, and sitemap |
| Domain | Preserve the current public paths and existing email records |
| Branding and accounts | Replace reference-specific assets, metadata, analytics, CMS destinations, and domain settings |

## Acceptance checklist

- [ ] All 24 audited content paths work.
- [ ] Robot gallery includes the current robots.
- [ ] Registration messaging matches the active registration destination.
- [ ] Both donation destinations have a confirmed purpose.
- [ ] Merchandise, scouting, media, social, and email links work.
- [ ] Contact validation and delivery work.
- [ ] Navigation and FAQ controls work with a keyboard.
- [ ] Desktop and mobile layouts pass review.
- [ ] Images have appropriate alternative text.
- [ ] Page descriptions, canonical URLs, sharing metadata, and sitemap use the correct domain.
- [ ] AI and CMS editing workflows pass a demonstration.
- [ ] Deployment checks pass before publication.
- [ ] Domain change preserves email records.
- [ ] Rollback instructions are documented.

## Next implementation step

Prepare a local preview with the shared layout and one robot page. Then use that implementation to establish the remaining page templates.

## Sources

- [Website audit](website-audit.md).
- [Reference package configuration](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/package.json).
- [Reference content collections](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/src/content.config.ts).
- [Reference CMS configuration](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/public/admin/config.yml).
- [Reference CMS setup](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/docs/admin-setup.md).
- [Reference deployment workflow](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/.github/workflows/deploy.yml).
- [Reference compatibility notes](https://github.com/piedmontmakers/piedmontmakers.org/blob/38840f15fe35dccc9930c31240b936b29ac1033a/docs/troubleshooting.md).
