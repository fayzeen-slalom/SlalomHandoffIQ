---
name: user-story-readiness-evaluator
description: evaluate salesforce and enterprise software user stories against an 8-point definition of ready scoring model. use when the user asks to review, score, assess, qa, refine, or determine whether user stories are ready for development, sprint commitment, developer handoff, ba-to-developer handoff, backlog refinement, or story quality review. applies to pasted stories, uploaded story documents, jira exports, requirements notes, or story backlogs. returns a score out of 8 per story, deficient readiness areas with reasons and fixes, and a portfolio summary of ready, needs refinement, and not ready stories.
---

# User Story Readiness Evaluator

## Purpose

Evaluate every provided user story against a fixed 8-point readiness model and determine whether each story can be handed to developers. Be conservative: a story is only ready when a developer can estimate, build, and unit test it without major requirement clarification.

## Inputs to Accept

Accept any of the following as story source material:
- pasted user stories, backlog items, epics, requirements, or acceptance criteria
- uploaded text, spreadsheet, Word, PDF, markdown, Jira export, or requirements documents
- mixed notes that contain multiple candidate stories

If the user provides a document package rather than clearly separated stories, identify each discrete story by headings, story IDs, Jira keys, bullet clusters, or repeated user-story phrasing. If no complete story boundaries are obvious, evaluate the most likely story candidates and explicitly note the assumption.

## Fixed 8-Point Scoring Model

Score each story from 0 to 8. Award 1 point for each criterion that is materially satisfied. Do not award partial points.

1. **Clear user story format** — uses or clearly implies role/persona, desired capability, and business value, preferably in “As a / I want / So that” format.
2. **Acceptance criteria are complete and testable** — includes clear acceptance criteria that can be directly validated, preferably Given/When/Then or equivalent.
3. **Scope is clearly defined** — states what is included and, when useful, what is excluded; avoids open-ended or blended scope.
4. **Salesforce objects, fields, and UI expectations are clear** — identifies relevant objects, fields, pages, flows, components, layouts, reports, permissions screens, or UI behavior needed by the developer.
5. **Business rules and validations are documented** — captures decision logic, required validations, statuses, error handling, calculations, defaults, or automation rules.
6. **Dependencies are identified** — names upstream/downstream stories, integrations, data dependencies, teams, environments, approvals, or blockers.
7. **Security, data, and NFRs are considered** — covers permissions, sharing, profiles/permission sets, data migration/quality, reporting, performance, compliance, audit, scalability, or other non-functional requirements where relevant.
8. **Testing notes include happy path and exception scenarios** — includes guidance for validating success paths and negative/edge/error scenarios.

## Readiness Verdicts

Assign the verdict from the score:
- **Ready for development**: 7-8 out of 8
- **Needs refinement**: 5-6 out of 8
- **Not ready**: 0-4 out of 8

Override rule: if a story has no testable acceptance criteria or no clear user/business outcome, do not mark it Ready even if other supporting details are present. Cap the verdict at **Needs refinement** unless the missing information is minor and clearly inferable.

## Evaluation Workflow

1. Identify every story to evaluate.
2. For each story, assess all 8 criteria independently.
3. Record pass/fail for each criterion with a concise evidence-based reason.
4. Calculate the score out of 8 and assign the verdict.
5. Clearly call out deficient areas by criterion name.
6. Provide concrete remediation guidance for each failed criterion.
7. Summarize total counts across all stories:
   - ready for development
   - needs refinement
   - not ready
8. Provide the top backlog-level improvement themes after all stories are reviewed.

## Output Format

Use markdown. Start with an executive summary, then a story-by-story assessment.

### Required Executive Summary

Include:
- total number of stories evaluated
- count of stories ready for development
- count of stories needing refinement
- count of stories not ready
- overall readiness observation in 2-3 sentences
- top 3 recurring gaps across the story set

Use this table:

| Readiness category | Count | Meaning |
|---|---:|---|
| Ready for development | n | Can be handed to developers with minimal clarification |
| Needs refinement | n | Mostly usable but requires targeted BA updates |
| Not ready | n | Too ambiguous or incomplete for developer handoff |

### Required Per-Story Format

For each story, use this structure:

```markdown
## Story <number or ID>: <title>

**Verdict:** <Ready for development | Needs refinement | Not ready>  
**Score:** <n>/8  
**Primary reason:** <one sentence explaining the main readiness blocker or why it is ready>

| # | Criterion | Pass? | Rationale |
|---:|---|:---:|---|
| 1 | Clear user story format | ✅/❌ | <specific evidence or gap> |
| 2 | Acceptance criteria are complete and testable | ✅/❌ | <specific evidence or gap> |
| 3 | Scope is clearly defined | ✅/❌ | <specific evidence or gap> |
| 4 | Salesforce objects, fields, and UI expectations are clear | ✅/❌ | <specific evidence or gap> |
| 5 | Business rules and validations are documented | ✅/❌ | <specific evidence or gap> |
| 6 | Dependencies are identified | ✅/❌ | <specific evidence or gap> |
| 7 | Security, data, and NFRs are considered | ✅/❌ | <specific evidence or gap> |
| 8 | Testing notes include happy path and exception scenarios | ✅/❌ | <specific evidence or gap> |

### Deficient areas to fix
- **<criterion name>:** <why it is deficient and what clarification is needed>

### Recommended BA updates before developer handoff
- <specific update the BA should add to the story>
- <specific update the BA should add to the story>

### Developer handoff risk
<one sentence describing the risk if the story is handed off as-is.>
```

If the story is Ready and has no deficiencies, replace “Deficient areas to fix” with:

```markdown
### Ready rationale
- <why the story is ready for development>
```

## Salesforce-Specific Review Guidance

When evaluating Salesforce readiness, look for these details and call them out when missing:
- Objects: standard or custom objects affected, such as Account, Contact, Opportunity, Case, Lead, Campaign, Contract, custom objects, junction objects, or external objects.
- Fields: field names, data types, picklist values, required fields, formulas, default values, and field-level security expectations.
- UI: Lightning record page, related list, screen flow, quick action, dynamic form, LWC, report, dashboard, console, mobile page, or Experience Cloud page.
- Automation: flow, validation rule, approval process, assignment rule, duplicate rule, email alert, scheduled job, Apex, platform event, or integration event.
- Security: profile, permission set, sharing rule, role hierarchy, restriction rule, record visibility, audit/compliance needs, or data retention.
- Data and integration: migration, data mapping, source system, API payload, middleware, duplicate/upsert logic, error handling, retry behavior, and data volume.

Do not require every story to include every Salesforce detail. Judge relevance based on the story type. For example, a UI story should define UI behavior, while an integration story should define payloads, mappings, errors, and dependencies.

## Quality Rules

- Be direct and evidence-based. Do not inflate scores to be encouraging.
- Do not invent missing details as if they were present.
- When suggesting fixes, provide BA-ready wording that could be pasted into the story.
- Keep rationales concise but specific.
- If a story blends multiple unrelated capabilities, flag scope clarity as deficient and recommend splitting it.
- If acceptance criteria only restate the requirement, mark criterion 2 as failed because the criteria are not independently testable.
- If testing notes cover only happy path, mark criterion 8 as failed because exception scenarios are missing.
- If security/data/NFRs are not relevant, award the point only when the story is simple enough that no meaningful security, data, or NFR consideration is needed; otherwise require explicit treatment.

## Optional Improved Story

If the user asks to rewrite or improve the stories, add an **Improved story draft** section after each assessment. Include:
- title
- user story statement
- in scope
- out of scope
- Salesforce details
- acceptance criteria in Given/When/Then format
- testing notes covering happy path and exception scenarios
