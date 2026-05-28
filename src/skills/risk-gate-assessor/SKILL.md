---
name: risk-gate-assessor
description: assess uploaded project documents for risk gate readiness by checking whether eleven required launch, discovery, governance, staffing, handoff, licensing, vendor, and client-readiness elements have evidence. use when asked to perform a risk gate assessment, delivery readiness gate, project kickoff readiness review, sales-to-delivery handoff validation, discovery readiness check, or document evidence gap analysis across attached files. output a concise evidence matrix, missing-items summary, targeted follow-up questions, and percentage of risk gate elements found.
---

# Risk Gate Assessor

## Objective
Evaluate the provided project documents for evidence that the 11 risk gate elements are covered. Be conservative: mark an element as found only when the documents contain explicit or strongly implied evidence. Do not give credit for generic statements that do not show the required artifact, activity, decision, or completion status.

## Inputs
Use any documents, screenshots, pasted notes, file search results, or connector results the user provides. If multiple files are available, inspect all relevant files before concluding an element is missing. Prefer cited evidence when the active environment supports citations.

## Assessment workflow
1. Inventory the documents reviewed.
2. Search for each required risk gate element and its acceptable evidence signals from `references/risk_gate_checklist.md`.
3. For each element, assign one status:
   - `Found` when there is clear evidence that the element is covered.
   - `Partial` when related evidence exists but at least one critical requirement is incomplete, vague, planned but not completed, or missing detail.
   - `No evidence` when the documents do not contain relevant evidence.
4. Capture the strongest evidence in one short phrase, including document name or section when available.
5. Identify targeted questions the receiving team should ask for partial or missing elements.
6. Calculate readiness percentage using only fully `Found` elements:
   `readiness percentage = (number of found elements / 11) * 100`, rounded to the nearest whole percent.

## Required output format
Use this structure unless the user requests another format:

### Risk gate assessment summary
- **Elements found:** X / 11
- **Readiness percentage:** Y%
- **No-evidence items:** concise comma-separated list of element numbers and names. If none, write `None`.
- **Overall gate view:** one sentence, such as `Proceed`, `Proceed with conditions`, or `Do not proceed until gaps are resolved`.

### Evidence matrix
| # | Risk gate element | Status | Evidence found | Gap / follow-up question |
|---|---|---|---|---|
| 1 | Project scope clear and validated; SOW shared | Found / Partial / No evidence | Short evidence | Short gap or question |

Keep the matrix concise. Do not paste long excerpts. Quote only short snippets when needed.

### Priority follow-up questions
List only the highest-priority questions needed before gate approval. Group related items together and keep the list short.

## Scoring rules
- Count only `Found` statuses in the numerator.
- Do not count `Partial` as found.
- If evidence is present in one document but contradicted by another, mark `Partial` and describe the conflict.
- If an item is marked “not applicable,” count it as `Found` only when the documents explain why it is not applicable and identify the approving owner or decision context.
- For element 2, the Client Readiness Checklist is `Found` only when the checklist itself or equivalent evidence covers all eight sub-actions. If some sub-actions are present and others are missing, mark `Partial`.
- For element 3, Sales-to-delivery handoff is `Found` only when there is evidence of a handoff meeting or structured handoff and multiple required topics are covered. If the handoff is mentioned without topics, mark `Partial`.
- For element 7, Kickoff materials are `Found` only when a kickoff deck or equivalent materials cover the required kickoff sections. Missing a few sections may be `Partial`; missing the deck/materials is `No evidence`.
- For element 8, workshop prep is `Found` only when planned workshops include both dates and topics.
- Licensing is `Found` when needed licenses are secured or the documents explicitly state licensing is not needed or not applicable.

## Evidence discipline
- Avoid assuming completion from future-tense plans unless the risk gate only requires planning.
- Distinguish evidence of a meeting being planned from evidence that it occurred.
- Distinguish role names from named/assigned staff.
- If documents use alternate terminology, map it thoughtfully: for example, kickoff may appear as mobilization, initiate, launch meeting, or discovery kickoff.
