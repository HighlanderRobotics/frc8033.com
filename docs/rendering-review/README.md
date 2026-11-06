# Rendering and interaction review

Reviewed the local Astro implementation across all 24 original content routes, plus Search, 404, and the CMS entry screen. This work changes the replica; it does not deploy or alter the live Webflow site.

## Results

- **104 responsive checks passed:** 26 public pages at viewport widths 320, 768, 1024, and 1440 pixels. Each check measured horizontal overflow, content extending beyond the viewport, main heading count, and minimum sizes of navigation controls and content action buttons. See [responsive-results.json](responsive-results.json).
- All sixteen FAQ answers opened by keyboard and exposed their answer content. See [faq-results.json](faq-results.json).
- Confirmed native dropdown opening, Escape dismissal with focus returning to the summary, and mobile-menu opening/closing. Desktop panels remain anchored to their labels; mobile panels fill the navigation width.
- Confirmed Pagefind returns the Wisp robot page and Clear resets the query.
- Confirmed the empty contact form focuses Name and identifies all three required fields without composing or sending a message.
- Confirmed Sveltia's entry screen renders on desktop and at 320 pixels without horizontal overflow. Authenticated editing was not exercised.
- Production build, Pagefind generation, and output checks passed: 24 original pages, 679 local link references, and 1,140 local asset references.

These are local Chromium checks and a visual review of page layouts, not formal accessibility certification or exhaustive cross-browser testing. External video playback, registrations, payments, contact delivery, and authenticated CMS saving were not submitted or tested end to end.

## Shared issues fixed

The imported layout assumed a fixed Webflow header, leaving large body offsets after the migration. Titles had fixed heights and line heights smaller than their text, and several buttons had percentage widths or left margins that squeezed their labels. The old dropdown styling also exposed inconsistent focus/open behavior.

The shared header now uses an Astro component and native `details` disclosures, while continuing to read the CMS-managed navigation source. A single SVG chevron rotates with the disclosure state. Native button and summary controls work with keyboard input. The mobile menu has a labelled toggle and scrolls within the available screen height. Escape, outside clicks, and focus leaving a disclosure close it; opening another disclosure closes the first.

Action buttons share padding, borders, corner radius, font, hover/focus treatment, and a minimum 46-pixel height. Navigation controls have at least 44-pixel targets. Search moved into navigation, removing the floating control that covered content. Footer columns reflow correctly and social links have accessible names. Each content page has one main heading.

## Page-by-page findings and treatment

All routes in this table passed the final four-width checks.

| Page | Findings and corrections |
| --- | --- |
| `/` | Constrained and wrapped the hero title; normalized sponsor headings/logos, feature buttons, navigation, and footer. |
| `/about-the-team` | Added consistent text-cell padding and grid gaps; corrected shared heading flow and card spacing while preserving the photographic hero and values sections. |
| `/competitions-and-awards` | Replaced fixed title sizing; normalized dated entry headings, image sizes, alternating backgrounds, and mobile stacking. |
| `/contact` | Removed inherited body offset; improved labels, field spacing, input sizing, textarea height, and button alignment. “Open Email App” now accurately describes the existing fallback. Removed misleading Webflow receipt/error blocks. |
| `/faq` | Rebuilt the disclosure appearance with readable multiline questions, a consistent plus/minus indicator, padded answers, and no forced prose line breaks. All sixteen controls tested. |
| `/meet-the-team` | Fixed the overlapping 100-pixel title, excessive spacer sections, and buttons too narrow for their labels. Added meaningful action labels and corrected “Executives.” |
| `/mentors` | Fixed overflowing 250-pixel grid columns, negative/fixed body offsets, portrait dimensions, name/role hierarchy, and mobile stacking. |
| `/our-members` | Added a true page heading; normalized portrait/biography rows, spacing, and responsive stacking. |
| `/outreach/2019` | Standardized title, entry headings, date/text spacing, and image/text stacking. |
| `/outreach/2020` | Standardized title, entry headings, image bounds, and mobile stacking. |
| `/outreach/2021` | Standardized title, entry headings, date spacing, and portrait/landscape image containment. |
| `/outreach/2022` | Standardized the longer archive's repeating rows, images, heading sizing, and mobile gutters. |
| `/outreach/2023` | Standardized repeating event rows, dates, headings, and image sizing. |
| `/outreach/outreach-2024-2025` | Standardized archive entries and mobile reflow for the longer season page. |
| `/outreach/outreach-2025-2026` | Standardized seasonal title and the single event's image/text treatment. |
| `/robots/overview` | Made the invisible year headings visible; removed 400-pixel spacer margins and 20vw title sizing; normalized robot cards, images, and action buttons. |
| `/robots/nessie` | Fixed a control-panel row extending beyond 2,000 pixels and sentences broken into narrow columns. Normalized subsystem and recap layouts; connected the action to the known season video. |
| `/robots/whirlpool` | Fixed cramped/clipped subsystem prose and inconsistent card widths; normalized images, headings, statistics, and footer feature. Replaced the destinationless video button with a clear availability message. |
| `/robots/selkie` | Replaced the unsupported scroll-animation layout and 600vh spacer with normal-flow sections and an existing local robot photo. Removed the extra climber spacer. |
| `/robots/paddo` | Normalized title, introduction, subsystem cards, forced heading breaks, images, and video action. Removed a 280-pixel offset that pushed the closing title off-screen. |
| `/robots/banshee---2024` | Normalized title, introduction, subsystem cards, and image/text layout. Fixed the closing title's horizontal offset. |
| `/robots/kelpie---2025` | Removed the fixed 800-pixel introduction width; normalized cards, subsystem typography, images, and closing feature. |
| `/robots/wispp---2026` | Removed the fixed 800-pixel introduction width; normalized subsystem layout and fixed the displaced oversized closing title. |
| `/sponsors` | Fixed white title text disappearing against a partially sized fixed background; improved giving-section layout, image bounds, benefit columns, logo wrapping at tablet width, and Donate button treatment. |
| `/search` | Added shared navigation and consistent Search/Clear/button treatment; verified production results and query clearing. |
| `/404` | Checked readable fallback links and shared navigation/footer at all widths. |
| `/admin/` | Checked the Sveltia entry screen at desktop and small-phone sizes; kept authentication and editor functionality within the installed CMS. |

## Implementation and evidence

- `src/components/Header.astro`: native navigation rendered from the existing shared CMS source.
- `src/lib/presentation.ts`: build-time presentation cleanup, preserving raw snapshots and CMS records.
- `src/styles/refinements.css`: shared controls and scoped page-layout corrections.
- `src/scripts/interactions.ts`: navigation state/focus handling and existing contact fallback.
- `scripts/verify.mjs`: additional guards for main headings, navigation controls, destinationless action buttons, and unsupported animations.

Final control examples: [desktop dropdown](desktop-dropdown.png), [mobile dropdown](mobile-dropdown.png), [expanded mobile FAQ](mobile-faq.png). The `screenshots/` and `sheets/` directories contain working review captures taken during the repair passes; some precede subsequent corrections. Final geometric results and the three control examples are the final-state evidence.

The existing historical copy, closed registration destination, incomplete robot index content, and other editorial findings remain documented in the audience review. They were not replaced with invented current facts during this presentation pass.
