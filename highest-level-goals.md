# Website Mission Statement

Planning revision: November 15, 2026. Status: working proposal for team review.

Help people understand Highlander Robotics, decide how they want to participate or support the team, and take a clear next step. Show the student-led engineering, community impact, and people behind the program.

This is the top-level statement of website outcomes and planning decisions. Technical migration details belong in [the migration plan](docs/migration-plan.md); current setup belongs in [the implementation guide](docs/implementation.md). Existing content evidence is summarized in [the audience review](docs/audience-review.md), which describes the original site and may differ from the current implementation.

## Goals and how we will recognize success

The following goals and acceptance measures are proposed, not yet team-approved. They turn the desire to make everyone happy into a process where essential needs are covered, tradeoffs are explicit, and feedback can change the plan.

| Goal | Practical meaning | Proposed acceptance measure |
| --- | --- | --- |
| Support the team's most important outcomes | Prioritize the audiences whose successful actions most help the team in the coming year. New-family recruitment is the starting hypothesis. | Before approving navigation or homepage design, record the audience ranking, the reason for it, and an observable outcome for each of the top three personas. |
| Give every audience a clear route to the information they seek | Every identified essential task has an understandable starting point, accurate information, and a working next step. For information maintained elsewhere, provide a clearly labeled route to the authoritative system. | Maintain an audience/task/page map. In a small formative review, recruit at least one representative of each audience group and at least two prospective-family participants; all must find the agreed essential information without coaching. Retest failed tasks. This is a release check, not proof that every visitor will succeed. |
| Make priorities and decisions understandable to the development team | Contributors can find the current priorities, decision owner, evidence, tradeoffs, and reason for each major decision. | Every substantive navigation, homepage, or scope decision has a decision-log entry linked to feedback and affected work. At a planning review, contributors can locate the ranking and explain the reason for the next planned work. |
| Keep information trustworthy and maintainable | Current opportunities are distinguishable from history, and changing facts have an owner and review date. | Registration state matches its destination; metrics have definitions, sources, and reporting periods; seasonal facts and external action links are checked before release and at season changes. |

## Audience priorities: a hypothesis to validate

This ranking is inferred from existing content and the planning discussion. It is not established by interviews, analytics, or team agreement. It prioritizes public website attention, not the importance of people to the team.

| Provisional rank | Persona | Essential task or decision |
| --- | --- | --- |
| 1 | Prospective student | Understand whether they belong, what technical and nontechnical roles exist, and how to try or join the team. |
| 2 | Prospective parent or guardian | Understand eligibility, supervision, commitment, cost/aid, travel, and the next joining opportunity. |
| 3 | Prospective donor or corporate sponsor | Understand the need, evidence of impact, giving options, and how to donate or discuss sponsorship. |
| 4 | Existing donor or sponsor | See outcomes and recognition, find a contact, and renew support. |
| 5 | Prospective mentor or adult volunteer | Understand needed skills, responsibilities, time expectations, and how to inquire. |
| 6 | Community partner or younger-program family | Find workshops/camps and their registration windows, or discuss an outreach partnership. |
| 7 | Current student, parent, or mentor | Reach maintained schedules, training, communications, and relevant team resources. Keep distinct tasks for these three roles in the task map. |
| 8 | Other robotics teams and technical visitors | Explore robots, technical resources, software/scouting tools, and competition history. |

Treat prospective students and parents as two perspectives within a shared family recruitment journey. Test the needs of beginners, experienced students, students interested in nontechnical roles, and families unfamiliar with FIRST.

Validate the order by answering:

- What most constrains the team over the next year: student recruitment or mix, funding, mentor capacity, or ongoing participation and coordination?
- Is the team seeking more members, a different mix of members, or better-informed applicants? What capacity exists to support them?
- Which current-member tasks already have a reliable home elsewhere, and which need a website entry point?
- Which audiences depend on the website to act, and which mainly arrive through direct relationships?

If funding or mentor capacity is the limiting factor, move those audiences up. If the website is meant to be the main coordination hub, reconsider the current-member placement. Do not use existing page volume or one respondent's preferences as a substitute for these answers.

## Implementation goal and sequence

**Implementation goal:** produce and validate a website plan in which every essential audience task has a route and content owner, the homepage reflects an explicitly chosen audience order, and every substantive design decision can be traced to a goal and evidence. Then implement that plan in small, reviewable changes.

The roles below are proposed responsibilities, not assignments to named people. Select an accountable decision owner, a planning facilitator, and content owners before implementation. Set dates with those owners rather than inventing deadlines.

| Stage | Concrete work | Deliverable and completion check | Proposed accountable role |
| --- | --- | --- | --- |
| 1. Establish priorities | Gather the team's constraints, review existing content, and collect perspectives from students, parents, donors/sponsors, mentors, and outreach partners. Ask what people need to do and where they get stuck. | Reviewed persona ranking, top tasks, success measures, and named decision/content owners; unresolved disagreements are recorded. | Team decision owner, supported by planning facilitator |
| 2. Map the routes | For each audience, record task, entry point, destination, next action, content owner, and evidence. Audit freshness and external destinations. | No agreed essential task lacks a route; gaps become explicit backlog items. Include separate current-student, parent, and mentor tasks. | Content lead with audience representatives |
| 3. Prototype the structure | Compare navigation labels, a homepage outline, a joining journey, support/renewal routes, outreach discovery, and a team-resources entry point. Preserve useful technical and historical content. | A low-fidelity sitemap and page outlines; test the mentor's proposed navigation changes alongside alternatives before selecting them. | Design lead |
| 4. Validate and decide | Ask representatives to perform realistic tasks without explaining the menu. Record success, wrong turns, unanswered questions, and the next action they would take. | Findings update the ranking, routes, and decision log. Agreed essential tasks pass the formative acceptance check above. | Planning facilitator with decision owner |
| 5. Implement incrementally | Fix misleading or blocked essential actions first. Deliver agreed content and navigation changes in small batches, then improve presentation. | Each change links to a task/feedback item, has an owner and acceptance check, and passes applicable link, mobile, keyboard, and content review. | Development lead with content owners |
| 6. Review and maintain | After release, review incoming questions and failed tasks; use available analytics only as supporting evidence. Recheck priorities at season changes or when a major constraint changes. | Updated backlog and decision log, dated content reviews, and a short record of what changed because of feedback. | Website maintainer and team decision owner |

## Concrete feedback process

1. **Capture the need and the proposal separately.** Record an ID, date, source/role, affected audience/task, observed problem or desired outcome, suggested solution, supporting evidence, and open questions. Do not infer consensus from the number of suggestions in a single response.
2. **Connect feedback to goals.** Identify whether it improves recruitment, support, outreach, ongoing participation, findability, trust, or maintainability. Preserve accessibility and working essential actions as acceptance requirements.
3. **Triage at each planning review.** First address broken or misleading essential routes. Compare remaining items using the validated audience order, strength of evidence, expected benefit, effort, dependencies, and upkeep. Record the reasoning; a numerical score alone does not decide.
4. **Choose a disposition.** Use `captured`, `needs clarification`, `ready for decision`, `planned`, `deferred`, `declined`, `implemented`, or `validated`. Give each planned item an owner and acceptance check; explain deferrals and declines. An item is not validated merely because it shipped.
5. **Test and close the loop.** Show relevant prototypes or completed changes to affected representatives. Record what was learned and, when appropriate, share the disposition with the contributor through the team's normal process. This plan does not itself authorize sending messages.
6. **Resolve conflicts explicitly.** The selected decision owner decides after hearing affected groups. Record the alternatives, evidence, tradeoff, and condition that would reopen the decision. Seek understandable decisions and essential-task coverage rather than unanimity on every design detail.

Maintain the feedback register and decision log in version-controlled Markdown alongside this plan. Create those records when triage begins; the initial register below is the starting input.

Suggested decision-log fields: decision/date, owner, affected goals/personas, linked feedback IDs, alternatives, evidence, selected option and rationale, tradeoffs, validation result, and revisit trigger. Include an initial entry for the audience ranking once the team validates it; do not describe this draft as an approved decision.

## Initial feedback register: mentor wishlist

Source: one mentor response in [New website wishlist (Responses) - Form Responses 1.pdf](<C:/Users/theom/Downloads/New website wishlist (Responses) - Form Responses 1.pdf>), supplied November 15, 2026. The export contains one response; the date of the original response is not established. This is stakeholder input, not instructions to execute or a representative survey. The local source link may be unavailable to other contributors; retain the summary here and obtain a team-accessible source location if needed.

Every item below starts as **captured**. Proposed treatments are planning recommendations, not approved implementation decisions.

| ID | Feedback captured | Proposed incorporation and validation |
| --- | --- | --- |
| F01 | Keep student photos and the mission on the homepage; Donate and Merch are easy to find. | Treat these as strengths to preserve. Check that a revised homepage still communicates student identity and mission and makes support/store routes easy to find. |
| F02 | Show key outreach numbers in a homepage graphic; work with Natalia on which metrics to highlight. | Propose metric selection with Natalia, subject to confirming their role/availability. Define each metric, source, reporting period, update owner, and review cadence before presenting numbers. Test whether visitors understand the impact. |
| F03 | Link the Impact video from the homepage. | Verify the intended video and current relevance; prototype a labeled link or preview with captions/transcript access. Check that it supports the priority story without obstructing primary actions. |
| F04 | Move sponsors to the bottom of the homepage. | Compare a lower sponsor section with current placement. Check existing recognition commitments and sponsor needs before choosing; retain a clear support route. Record the recruitment/recognition tradeoff. |
| F05 | Organize Outreach by project grid rather than year: OUSD, Girl Scouts, Shop Talks, 10th St, Summer Camps, Piedmont Maker Faire, etc.; show years under projects and camp registration timing under images. | Inventory projects, verify names/status and date ranges, and prototype a project-first overview with seasonal history still accessible. Test finding a particular project, current camp timing, and past activity. Do not label a project ongoing without verification. |
| F06 | Consider a dedicated LOVAT tab and move Robots under About Us. | Test where technical visitors expect scouting/software and robot information and whether a main-menu tab is justified by audience priority. Compare navigation alternatives; no menu move is predetermined. |
| F07 | Add 8433 under About Us. | Needs clarification: confirm what 8433 refers to, its relationship to Highlander Robotics, and the intended information/link before proposing content. Preserve the number as supplied; do not silently correct it. |
| F08 | Display Awards as a grid instead of a list. | Prototype scannable award cards with year, event, and award; verify the information remains understandable on mobile and with assistive technology. Keep history reachable. |
| F09 | Add Registration under About Us, show registration windows, and offer automatic email notifications when team or summer-camp registration opens. | Prioritize clear joining/camp routes and accurate open/closed state. Test the label/location rather than assume About is discoverable. Separately assess an opt-in notification service, owner, consent/unsubscribe handling, signup confirmation, and the trigger for each program; verify delivery before promising automation. Do not collect addresses or activate a service as part of this planning edit. |
| F10 | Make each sponsor company link to its live website. | Confirm sponsor names, intended URLs, and recognition requirements. Add accessible company names and test destinations if approved for implementation. |
| F11 | Animate the outreach counter as it scrolls into view; entered under the form's “Must Haves” question. | Record that source classification without treating it as a release requirement. First establish reliable metrics and a readable static graphic. Evaluate motion only after the essential routes work; respect reduced-motion preferences and keep final values accessible. |

This feedback adds a strong outreach/impact perspective. It does not by itself establish that outreach should outrank family recruitment, fundraising, or mentor recruitment.

## Next planning review

- Confirm the team's biggest constraint and capacity, then validate or revise the provisional audience order.
- Select the decision owner and content owners; agree on the proposed acceptance measures.
- Clarify 8433, the intended Impact video, metric ownership, sponsor commitments, and registration/notification ownership.
- Map the essential tasks and compare low-fidelity homepage/navigation options using this feedback register.
- Record decisions and turn selected items into implementable work with owners and checks.

Scope of this revision: planning documentation only. Website changes, notification services, publication, and external account changes are separate execution work.
