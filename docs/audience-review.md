# Highlander Robotics: public website review

Reviewed November 5, 2026 (America/Los_Angeles). This review describes the existing Webflow site, before the local Astro replica's additions. Evidence is preserved in `archive/2026-11-05/`; exact source URLs, page titles, form fields, missing descriptions, image counts, placeholder links, asset hashes, and crawl results are in `manifest.json`.

## High-level assessment

The site is a substantial public introduction and historical portfolio for FIRST Robotics Competition Team 8033, a student-led community team based in Piedmont. Its strongest material demonstrates real engineering, youth leadership, community service, and sponsor recognition. Its weakest area is helping a visitor take a reliable next step today, especially joining, volunteering, and finding current operational information.

The public site contains **24 discovered content pages**:

| Content area | Pages | What is there |
| --- | ---: | --- |
| Home | 1 | Mission, photo collage, practice-field and team sponsors, 2023 robot video, and 2026–27 registration invitation |
| Team and people | 4 | About/history/values/FIRST introduction; team directory gateway; three student leadership profiles; eleven named mentors and roles |
| FAQ | 1 | Sixteen answers covering meetings, eligibility, experience, roles, tools and supervision, sports conflicts, travel, $600 fee, and financial aid |
| Competitions and awards | 1 | Historical competition results and awards through 2026 |
| Sponsors | 1 | Five giving levels, recognition benefits, sponsor logos, charitable status claim, and donation instructions |
| Contact | 1 | Required name, email, and message form; shared email and lab address |
| Robots | 8 | Gallery plus Nessie (2020), Whirlpool (2021), Selkie (2022), Paddo (2023), Banshee (2024), Kelpie (2025), and Wisp (2026); technical specifications and photos |
| Outreach | 7 | Seasonal archives from 2019–20 through 2025–26: workshops, open houses, festivals, camps, mentoring, volunteering, and adaptive technology work |

The separate [route-by-route inventory](website-audit.md) lists all 24 original URLs. The new crawl confirms that count. The latest outreach page contains only a September 2025 Harvest Festival entry. The robot gallery stops at 2023 even though the individual robot pages and navigation reach 2026.

## Audience assessment

These are editorial judgments based on public evidence, not user interviews, analytics, or proof about private team communications. “Missing” means not found in the discovered public pages; the team may provide it elsewhere.

| Audience | What works | What gets in the way | Most useful improvement |
| --- | --- | --- | --- |
| Potential parents | The mission explains student leadership and access. FAQ covers Bay Area eligibility, no prior experience, substantial season hours, tools and mentor supervision, travel, fee, and confidential aid. The lab address and named mentors provide useful context. | Families must assemble the decision across several pages. Fee/travel details have no clear effective season; total likely cost, transport, minimum attendance, onboarding, and parent responsibilities are unclear. A homepage registration invitation points to a closed form. Safety information is limited to tool certification and supervision. | A dated “Joining as a family” page with eligibility, commitment, total cost/aid, onboarding dates, travel expectations, safeguarding resources, and a working next step. |
| Current parents | FAQ gives the general weekly rhythm, lab location, and contact. History and photos help explain what students are doing. | No public calendar, upcoming travel logistics, volunteer signup, parent handbook, or clear link to the current parent communication channel was found. FAQ dates are generic. | A parent resources page linking the actual team-managed schedule and communication system; keep sensitive travel/medical information private. |
| Potential sponsors | Giving levels and corresponding logo benefits are concrete. Robot engineering and outreach demonstrate activity. Donation instructions and the Piedmont Makers affiliation explain how support is directed. | The homepage uses FundRazr while Sponsors uses a separate Square destination. Visitors are not told why. Some impact claims lack source/date; financial mix is from 2022–23. There is no dated sponsor prospectus, current budget/need, named sponsor liaison, or clear in-kind route. | A current sponsorship brief with use of funds, evidence-backed impact, cash/in-kind options, one named contact, and an explanation of the two giving paths. |
| Current sponsors | Logos appear prominently on home and Sponsors; field sponsorship has a distinct group. Results and outreach offer evidence of work. | No explicit renewal workflow, season impact report, recognition checklist, logo submission process, or confirmation of who maintains sponsor details. Logos often have empty alternative text, making recognition inaccessible. | A dated annual impact/renewal page and a sponsor contact, with accessible names attached to all recognition logos. |
| Potential adult mentors | Named mentors cover technical, management, business, outreach, treasury, and strategy roles. Student-led framing helps establish the mentoring approach. | There is no dedicated mentor invitation, list of current skill needs, expected hours, onboarding process, training/screening explanation, or mentor inquiry route beyond generic contact. | A “Mentor with us” page showing technical and nontechnical opportunities, commitment, responsibilities, onboarding requirements, and an inquiry contact. |
| Current adult mentors | Public roster and roles, team history, technical robot records, and GitHub/scouting links are helpful reference material. | No mentor handbook, training/checklist links, duty schedule, escalation contact, or clear current internal resource entry point was found. About says 17 mentors while the public roster names eleven, without explaining coverage or season. | A maintained mentor resources entry point and dated roster, with private systems clearly linked where appropriate. |
| Potential students | Strong robot photography and specifications make the work tangible. Student biographies show leadership paths. FAQ explicitly welcomes beginners and describes business, marketing, outreach, and enrichment roles. Bay Area eligibility broadens access. | Joining is not a complete guided journey. The registration destination is closed; there is no current open-house date, first-meeting guidance, onboarding timeline, or sample beginner project. Old featured content can make a technically active team appear inactive. | A student join page with next opportunity, an accurate registration state, beginner expectations, subteam examples, and a contact if registration is closed. |
| Current students | Robot subsystem histories, leadership profiles, outreach archives, GitHub, and Lovat are relevant public resources. | There is no obvious current student start page, training library, calendar, role application process, or link to the current communication/work system. Leadership bios lack a season label. | A “Team resources” page linking maintained schedules, training, repositories, and role processes; label public leadership by season. |

## What is working across audiences

- A recognizable purple Highlander identity, real team photography, local address, named people, and detailed robot work establish a specific team rather than a generic robotics pitch.
- The FAQ addresses several real decision barriers, including beginners, school eligibility, time, money, and tools. Preserve it and make it easier to find.
- Robot and outreach archives preserve institutional knowledge and can support recruiting and sponsor conversations.
- External providers already handle registration, giving, merchandise, and scouting. The replacement public site can link to these without rebuilding their applications.
- Responsive CSS, image variants, lazy-loading markup, shared navigation, and footer links exist. Their presence alone does not establish mobile usability or accessibility.

## Problems, evidence, and priority

| Priority | Finding | Evidence and consequence |
| --- | --- | --- |
| Immediate | Registration promise and destination disagree | Home says accepting 2026–27 members. The linked TeamSnap form states registration closed November 2, 2026. This blocks the primary recruiting action. |
| Immediate | Contact delivery depends on Webflow | The contact form has Webflow identifiers and no independent action endpoint. Copying markup alone would leave a broken form; recipients and delivery settings are private and unverified. |
| High | Current and historical content are mixed | Home calls 2023 Paddo “this year's robot”; robot index ends in 2023; About claims five robots while seven detail pages exist. Date and consolidate repeated facts. |
| High | Important next steps are absent | No dedicated mentor recruitment path; no current parent/student resources hub; no obvious current schedule. These gaps affect ongoing participation as well as recruitment. |
| High | Donation choices lack explanation | Global Donate goes to FundRazr; Sponsors directs users to Piedmont Makers/Square. Neither path should be discarded without understanding their intended purposes. Checkout validity and fund routing are not confirmed. |
| Medium | Placeholder controls | Homepage Learn More and Whirlpool video control use `href="#"`. FAQ answer anchors also use `#`, but serve as text containers rather than intended destinations. |
| Medium | Accessibility needs attention | Numerous images, including recognition logos, have empty alt text. FAQ depends on scripted dropdown behavior; custom navigation and multiple H1 headings merit keyboard/structure review. Blank alt is appropriate for decorative images, but not meaningful sponsor recognition. No formal WCAG conformance claim is made. |
| Medium | Findability and metadata gaps | No public search was found; sitemap returned 404; only two discovered pages have explicit meta descriptions. Deep archive content is harder to locate and share. |
| Medium | Impact content lacks editorial dates and substantiation | The sponsor page's comparative STEM claims and About's local superlatives have no visible supporting references. Present them as site claims until verified, and add current financial/impact reporting. |

## External workflows and verification limits

TeamSnap owns signup. FundRazr and Piedmont Makers/Square own giving. Bonfire owns merchandise; Lovat owns scouting. YouTube hosts video; Instagram and GitHub are external profiles. These are links/embeds, not evidence of synchronized accounts. The primary site cannot establish whether a payment, registration, or contact submission is actually received.

No payments, registrations, or contact messages were submitted during this work. Private Webflow settings, member-only material, unpublished/unlinked pages, analytics, donor records, and provider accounts were not available. No public member login, calendar embed, newsletter form, download library, shopping cart, or API integration was found. A missing public resource is not proof that the team lacks the process internally.

## Recommended order of work

1. Correct the registration state and confirm the contact delivery owner/service.
2. Date and reconcile homepage, robot index, leadership/mentor counts, FAQ fees, and season schedules.
3. Create clear student/family joining and adult mentor inquiry journeys.
4. Explain donation routes and publish a current sponsor brief and impact/renewal report.
5. Add maintained parent/student/mentor resource entry points and a current calendar link.
6. Improve meaningful image descriptions, heading hierarchy, keyboard controls, metadata, and search.

## Sources and archive

Primary pages: [Home](https://www.frc8033.com/), [About](https://www.frc8033.com/about-the-team), [FAQ](https://www.frc8033.com/faq), [Sponsors](https://www.frc8033.com/sponsors), [Mentors](https://www.frc8033.com/mentors), [Student leaders](https://www.frc8033.com/our-members), [Robot index](https://www.frc8033.com/robots/overview), [Wisp](https://www.frc8033.com/robots/wispp---2026), [Latest outreach](https://www.frc8033.com/outreach/outreach-2025-2026), [Contact](https://www.frc8033.com/contact), [Registration](https://go.teamsnap.com/forms/523636/signups/new).

The local archive contains raw HTML and extracted text for every discovered page, original CSS, a downloaded registration status page, robots/sitemap responses, and a provenance manifest. Downloaded site assets are in `public/assets/` and shared by the replica. It covers publicly discoverable content, not a private Webflow project export. YouTube video files and external stores, applications, and their private data are outside this archive; their URLs and embeds are retained.
