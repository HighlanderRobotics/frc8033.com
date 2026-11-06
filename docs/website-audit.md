# Highlander Robotics website audit

Features and external integrations for a platform migration

Reviewed November 5, 2026  |  frc8033.com

## Summary

### Main finding

The public website uses Webflow and contains 24 linked content pages. Most features present team information, photos, robot details, and outreach records.

Registration, donations, merchandise, and scouting use external websites. The main website links to these services without visible account sharing or data synchronization.

The contact form is the main functional dependency on Webflow. A replacement platform needs a working form service and access to the current delivery settings.

### Migration assessment

High confidence: the observed public features fit a content website with reusable page templates and one contact form. No public feature requires rebuilding a store, registration system, or scouting application.

For AI editing, use structured content, reusable templates, version history, and preview deployments. Keep external service URLs in one shared configuration.

### Coverage

| Area | Observed scope |
| --- | --- |
| Content | 24 successful public page routes, discovered by following internal links. |
| Interactions | Navigation dropdowns, mobile menu markup, 16 FAQ dropdowns, contact form states, video embeds, and external buttons. |
| Assets | 133 distinct image src URLs in the fetched HTML, including shared assets. CSS adds background images and fonts. |
| External workflows | TeamSnap, FundRazr, Square Online, Bonfire, Lovat, YouTube, Instagram, GitHub, and email links. |

### Evidence boundary

This audit checks public HTML, shared CSS, link destinations, and selected external pages. Browser automation failed, so interactive behavior remains unverified.

No forms, payments, or registrations were submitted. Private Webflow settings, unpublished pages, form recipients, and account connections require a separate administrative check.

The sitemap returns HTTP 404. This inventory therefore covers discovered public pages, not a verified export of every Webflow page.

[Primary source: Highlander Robotics homepage](https://www.frc8033.com/)

## Public page inventory

Each linked path below opens its source page. All 24 content routes returned HTTP 200 during the audit.

| Page | Features to preserve |
| --- | --- |
| [/](https://www.frc8033.com/) | Team introduction; sponsor groups; featured robot; YouTube player; seasonal registration button; shared navigation and footer. |
| [/about-the-team](https://www.frc8033.com/about-the-team) | Team history, mission, statistics, values, FIRST introduction, photos, and an embedded FIRST video. |
| [/meet-the-team](https://www.frc8033.com/meet-the-team) | Landing page with links to the mentors and student executives pages. |
| [/our-members](https://www.frc8033.com/our-members) | Three student executive profiles with roles, biographies, and portraits. |
| [/mentors](https://www.frc8033.com/mentors) | Eleven mentor names and role descriptions, with profile imagery. |
| [/faq](https://www.frc8033.com/faq) | Sixteen expandable questions about membership, meetings, experience, roles, tools, travel, fees, and financial aid. |
| [/competitions-and-awards](https://www.frc8033.com/competitions-and-awards) | Dated competition and award lists through 2026, with supporting images. No live results feed appears in the source. |
| [/sponsors](https://www.frc8033.com/sponsors) | Sponsor logos in two groups; five sponsorship levels; benefits; giving instructions; a separate sponsor donation destination. |
| [/contact](https://www.frc8033.com/contact) | Required name, email, and message fields; Submit button; waiting, success, and error text. |
| [/robots/overview](https://www.frc8033.com/robots/overview) | Robot gallery with images, summaries, years, and detail links. The gallery currently stops at 2023. |

### Shared site features

The header groups About, Outreach, and Robots into dropdown navigation. It also exposes competitions, Lovat, merchandise, contact, and donation links.

The footer contains the lab address, team links, donation and merchandise links, a contact email, and social icons.

The CSS defines layouts for widths below 991, 767, and 479 pixels. The HTML includes responsive image sizes and lazy loading.

## Robot and outreach pages

| Robot page | Features to preserve |
| --- | --- |
| [/robots/nessie](https://www.frc8033.com/robots/nessie) | 2020 robot story, imagery, game context, and an embedded YouTube video. |
| [/robots/whirlpool](https://www.frc8033.com/robots/whirlpool) | 2021 game introduction, shooter, climber, routing, dimensions, weight, and photos. Video button uses a placeholder link. |
| [/robots/selkie](https://www.frc8033.com/robots/selkie) | 2022 drivetrain, shooter, intake, climber, performance statistics, and a YouTube watch link. |
| [/robots/paddo](https://www.frc8033.com/robots/paddo) | 2023 game introduction, subsystem specifications, photos, and a YouTube watch link. |
| [/robots/banshee---2024](https://www.frc8033.com/robots/banshee---2024) | 2024 results summary, drivetrain, structure, elevator, climber, shooter, and photos. |
| [/robots/kelpie---2025](https://www.frc8033.com/robots/kelpie---2025) | 2025 results summary, drivetrain, structure, elevator, carriage, climber, end effector, and photos. |
| [/robots/wispp---2026](https://www.frc8033.com/robots/wispp---2026) | 2026 results summary, drivetrain, electronics, intake, climber, spindexer, turret, shooter, and photos. |

| Outreach page | Content and structure |
| --- | --- |
| [/outreach/2019](https://www.frc8033.com/outreach/2019) | 2019–2020 fundraiser, open house, field trips, and ongoing activities. |
| [/outreach/2020](https://www.frc8033.com/outreach/2020) | 2020–2021 Maker Faire, school board meeting, and virtual open house. |
| [/outreach/2021](https://www.frc8033.com/outreach/2021) | 2021–2022 recognition day, lab open house, and field trips. |
| [/outreach/2022](https://www.frc8033.com/outreach/2022) | 2022–2023 community events, workshops, mentoring, and adaptive technology work. |
| [/outreach/2023](https://www.frc8033.com/outreach/2023) | 2023–2024 talks, workshops, camp, mentoring, and volunteering. |
| [/outreach/outreach-2024-2025](https://www.frc8033.com/outreach/outreach-2024-2025) | 2024–2025 camp, fundraiser, workshops, festivals, and ongoing service. |
| [/outreach/outreach-2025-2026](https://www.frc8033.com/outreach/outreach-2025-2026) | 2025–2026 page currently contains one Harvest Festival entry. |

Outreach pages use event headings, dates, descriptions, and images. Preserve the season archive and each existing URL.

## External business integrations

These services are external destinations. Their accounts and records can remain separate when the main website moves.

### TeamSnap registration

The homepage Register button opens TeamSnap form 523636 in a new tab. The destination reports that registration closed on November 2, 2026.

Preserve the registration service, but confirm the next active form before updating the homepage. Registration fields and payment settings were unavailable.

[TeamSnap registration form](https://go.teamsnap.com/forms/523636/signups/new)

### FundRazr donations

The shared Donate buttons and footer open the 8033Highlanders campaign. This is a link, not an embedded payment form.

The destination returned HTTP 403 to the audit request. Its current campaign and checkout state remain unverified.

[FundRazr campaign](https://fundrazr.com/8033Highlanders)

### Piedmont Makers donations through Square Online

The Sponsors page sends its Donate Now button to donate.piedmontmakers.org. That destination identifies its platform as Square Online.

The Sponsors page describes selecting an amount and the Highlanders FRC program before checkout. The checkout itself remains unverified.

Preserve this destination until the team decides whether both donation paths serve different purposes.

[Sponsor donation destination](https://donate.piedmontmakers.org/)

### Bonfire merchandise

The header and footer link to the Highlander Robotics Bonfire store. The store remains responsible for its catalog and checkout.

The source link includes campaign tracking parameters. Preserve the destination and deliberate tracking choices during migration.

[Highlander Robotics merchandise](https://www.bonfire.com/store/highlander-robotics-frc-8033/?utm_source=copy_link&utm_medium=store_page_share&utm_campaign=highlander-robotics-frc-8033&utm_content=default)

### Lovat scouting

The About menu links to lovat.app. The destination describes scouting and strategy tools, but the team website does not embed those tools.

Preserve the external link. No Lovat application migration or API connection appears necessary for the observed website.

[Lovat website](https://lovat.app/)

## Media contact and platform dependencies

| Dependency | Observed use and migration requirement |
| --- | --- |
| YouTube | Three embedded players: homepage Paddo reveal, About FIRST introduction, and Nessie video. Paddo and Selkie also have watch links. Preserve video IDs and accessible player titles. |
| Social links | Footer links open the team YouTube channel, Instagram profile, and GitHub organization. No embedded social feed appears in the fetched pages. |
| Email | Footer mailto link opens frc8033@piedmontmakers.org. The FAQ separately lists robotics@piedmontmakers.org for financial aid. These do not establish the contact form recipient. |
| Webflow form | One Contact Form with required name, email, and Body fields. Name and email allow 256 characters; Body allows 5,000. Webflow markup provides submission states. |
| Webflow assets | Images, CSS, and JavaScript load from cdn.prod.website-files.com. CloudFront serves jQuery 3.5.1 and platform assets. Copy needed assets before retiring hosting. |
| Fonts | WebFont Loader requests Heebo and Russo One through Google Fonts. Shared CSS also declares Copperplate and a Material Symbols subset on the Webflow CDN. |
| Navigation and effects | Webflow supplies dropdown and mobile navigation behavior. Source markup contains interaction identifiers. Recreate required behavior in the new platform. |
| Search metadata | Page titles, Open Graph and Twitter title fields, viewport settings, favicon, and Apple touch icon exist. Only two fetched content pages declare meta descriptions. |

### Contact form migration

The form has Webflow identifiers and no explicit external action URL. The source indicates Webflow handling, but delivery and stored submissions remain unverified.

Replace the submission handler, validation, spam protection, notification routing, and storage as needed. Confirm recipients and retention settings before switching the domain.

### Exact media and social destinations

[Homepage and Paddo video hk5MFO64Qcs](https://www.youtube.com/watch?v=hk5MFO64Qcs)

[About FIRST video K_PuWjr7qcM](https://www.youtube.com/watch?v=K_PuWjr7qcM)

[Nessie video crw8_wNS1BM](https://www.youtube.com/watch?v=crw8_wNS1BM)

[Selkie video 6aCMSIiznuQ](https://www.youtube.com/watch?v=6aCMSIiznuQ)

[YouTube channel](https://www.youtube.com/@frc8033)

[Instagram profile](https://instagram.com/frc8033)

[GitHub organization](https://github.com/HighlanderRobotics)

## Migration requirements and acceptance checks

### Recommended content structure

High confidence: structured content reduces duplicated edits and makes AI changes easier to review. Use the following records with shared templates.

| Record | Fields |
| --- | --- |
| Site settings | Navigation, contact addresses, lab address, social URLs, registration status, registration URL, and both donation URLs. |
| Robot | Name, year, game, introduction, subsystem sections, images, video URL, and legacy path. |
| Outreach event | Season, title, date or ongoing status, description, images, and display order. |
| Person | Name, role, biography, portrait, group, season, and display order. |
| Sponsor | Name, logo, recognition group, sponsorship level, and display order. |
| Award or competition | Name, date, season, type, supporting image, and display order. |
| FAQ and page | Question and answer records; page titles, descriptions, body content, and sharing images. |

### Platform requirements

Require AI access to content and templates, a preview before publication, version history, and rollback. Provide asset upload and stable content identifiers.

Require custom domain support, HTTPS, redirects, responsive layouts, YouTube embeds, a form handler, and editable metadata. Separate draft editing from publication.

### Acceptance checks

1. Preserve all 24 paths, or create permanent redirects before launch.

1. Check navigation, FAQ controls, and layouts on desktop and mobile screens.

1. Check every registration, donation, merchandise, scouting, email, and social destination.

1. Check videos, image sizes, background images, fonts, and image alternative text.

1. Test contact validation and delivery with an approved test recipient before launch.

1. Create a working sitemap, useful page descriptions, and a complete robot gallery.

1. Check domain settings and preserve existing email records during the hosting change.

## Findings that affect the move

| Finding | Evidence and action |
| --- | --- |
| Registration mismatch | The homepage invites 2026–27 registrations. TeamSnap reports closure on November 2, 2026. Make the invitation match the active registration state. |
| Two donation destinations | Shared Donate links use FundRazr. Sponsors uses Piedmont Makers on Square Online. Confirm the intended distinction before changing either link. |
| Outdated robot index | The index ends at Paddo in 2023, while navigation includes robots through Wisp in 2026. Generate the index from robot records. |
| Placeholder buttons | Homepage Learn More and Whirlpool Watch it in Action use href="#". No destination appears in those anchors. Confirm intended behavior before rebuilding them. |
| Inconsistent seasonal content | The homepage calls Paddo this year’s robot. About lists five robots while navigation lists seven. Use shared records for facts that repeat. |
| Missing sitemap | /sitemap.xml returns HTTP 404. /robots.txt responds successfully with no visible directives. Generate a sitemap in the new platform. |
| Limited descriptions | Only the homepage and About page declare meta descriptions in the fetched content pages. Add descriptions to the new page records. |
| Unknown private configuration | Public pages do not expose form recipients, submission history, account permissions, domain ownership, or private integrations. Inspect these before decommissioning Webflow. |

### Features not found in the public source

No site search, member login, member portal, newsletter signup, calendar embed, map embed, local cart, file upload, or download library appears.

No Google Analytics, Google Tag Manager, Meta Pixel, CRM script, or custom data API appears in the fetched page markup.

No Webflow collection-list markers appear in the fetched HTML. This does not prove that the Webflow account contains no CMS collections or private automations.

### Next implementation step

Inspect the Webflow account configuration and export the content and assets. Use this inventory as the checklist for a preview implementation.

### Audit method

Followed all discovered same-domain page links, inspected forms and script references, checked shared CSS, and read selected external destinations.

External account features remain outside the main website inventory. Provider scripts on Bonfire or Square do not imply direct integrations on frc8033.com.

[Contact form source](https://www.frc8033.com/contact)

[Sponsor source](https://www.frc8033.com/sponsors)

[Robot index source](https://www.frc8033.com/robots/overview)
