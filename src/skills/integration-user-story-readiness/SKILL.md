---
name: integration-user-story-readiness
description: evaluate platform-agnostic integration user stories and supporting integration specifications for developer handoff readiness across any application, product, system, api, data platform, middleware, or enterprise workflow. use when asked to review, score, assess, qa, refine, or determine whether integration stories, api specs, event schemas, payload mappings, middleware handoffs, inbound/outbound integration requirements, data sync requirements, or related jira/backlog items are ready for development. returns a conservative score out of 8 per story, deficient readiness areas with concrete fixes, integration-specific risks, and a portfolio summary of ready, needs refinement, and not ready stories.
---

# Platform-Agnostic Integration User Story Readiness

## Purpose

Evaluate integration user stories and their supporting specifications against a fixed 8-point readiness model that can be applied to any platform or system. Be conservative: a story is only ready when the receiving developer, integration engineer, platform engineer, or implementation team can estimate, build, configure, and unit test it without major clarification.

This skill applies to integrations involving CRM, ERP, billing, finance, HR, healthcare, data platforms, custom applications, middleware, APIs, event brokers, file transfers, SaaS products, internal services, external vendor systems, mobile apps, web apps, reporting platforms, and operational workflows.

## Inputs to Accept

Accept any of the following as source material:
- pasted user stories, epics, Jira tickets, backlog items, requirements, or acceptance criteria
- uploaded Word, PDF, spreadsheet, markdown, text, Jira export, API, mapping, or integration specification documents
- mixed notes containing multiple candidate integration stories
- supporting specs such as API contracts, payload schemas, source-to-target mappings, event definitions, file layouts, error handling notes, NFRs, environment details, security notes, or test plans

If story boundaries are unclear, identify the most likely stories by headings, IDs, Jira keys, user-story phrasing, integration names, process names, system names, or requirement clusters. State the assumption before scoring.

## Fixed 8-Point Integration Readiness Model

Score each story from 0 to 8. Award 1 point for each criterion that is materially satisfied. Do not award partial points.

1. **Clear integration user story format** — identifies the user, system, business process, desired integration capability, and business value, preferably in “As a / I want / So that” format or an equivalent requirement format.
2. **Acceptance criteria are complete and testable** — includes testable criteria for successful processing, failure handling, missing or invalid data, expected source/target system updates, and response or event behavior.
3. **Scope is clearly defined** — states what is included and excluded, such as inbound/outbound API, event publishing/subscription, middleware change, file transfer, data sync, mapping, logging, retry, UI display, reporting, or operational handoff.
4. **Systems, data entities, fields, and UI expectations are clear** — identifies impacted applications, modules, data entities, records, tables, fields, statuses, screens, forms, pages, logs, notifications, reports, dashboards, or user-facing behavior.
5. **Business rules and validations are documented** — captures required fields, transformations, defaults, enumerated value mappings, status transitions, duplicate handling, upsert or merge logic, validation failures, calculations, routing, and automation rules.
6. **Dependencies are identified** — names source and target systems, middleware or integration platform, API/event/file owners, credentials, environments, upstream/downstream teams, related stories, test data, approvals, vendor dependencies, or blockers.
7. **Security, data, and NFRs are considered** — covers authentication, authorization, service accounts, least-privilege access, data privacy, encryption, audit logging, compliance, data volume, performance, timeouts, retry, monitoring, alerting, resilience, and data retention where relevant.
8. **Testing notes include happy path and exception scenarios** — includes validation guidance for successful transactions plus negative, edge, error, timeout, unauthorized, duplicate, unavailable-system, schema-mismatch, partial-success, and retry scenarios.

## Readiness Verdicts

Assign the verdict from the score:
- **Ready for development**: 7-8 out of 8
- **Needs refinement**: 5-6 out of 8
- **Not ready**: 0-4 out of 8

### Override Rules

Apply these caps even if the numeric score appears higher:
- If there are no testable acceptance criteria, do not mark the story Ready. Cap the verdict at **Needs refinement**.
- If there is no clear business outcome or integration purpose, do not mark the story Ready. Cap the verdict at **Needs refinement**.
- If the story requires data movement but has no source-to-target mapping, payload definition, file layout, event schema, or equivalent data contract, do not mark it Ready. Cap the verdict at **Needs refinement**.
- If the story depends on an API, event, file, middleware process, or external service but has no contract, endpoint/reference, schema, file layout, owner, or interface specification, do not mark it Ready. Cap the verdict at **Needs refinement**.
- If error handling is absent for an integration that can fail asynchronously or across systems, do not mark it Ready. Cap the verdict at **Needs refinement**.
- If the story blends unrelated integration capabilities, mark scope clarity as failed and recommend splitting it.

## Evaluation Workflow

1. Identify each integration story or story candidate.
2. Identify supporting specs available for each story, such as API contracts, event schemas, file layouts, payload schemas, field mappings, error handling, NFRs, environments, and test notes.
3. Determine the integration pattern: inbound, outbound, bi-directional, batch, real-time, event-driven, file-based, middleware-led, ETL/ELT, stream processing, data sync, or manual/operational handoff.
4. Score all 8 criteria independently with pass/fail rationale.
5. Clearly call out deficient areas by criterion name.
6. Provide concrete BA/spec-owner remediation guidance for each failed criterion.
7. Highlight the primary developer handoff risk if the story is handed off as-is.
8. Summarize counts across all stories: ready for development, needs refinement, and not ready.
9. Provide top backlog-level improvement themes across the integration story set.

## Integration-Specific Review Guidance

When evaluating platform-agnostic integration readiness, look for these details and call them out when missing.

### Integration Pattern

Confirm whether the requirement is:
- inbound to a target application or platform
- outbound from a source application or platform
- bi-directional
- real-time synchronous API
- asynchronous API, message queue, event stream, or pub/sub integration
- batch or scheduled sync
- file-based transfer such as CSV, XML, JSON, EDI, SFTP, or flat file
- ETL/ELT, data pipeline, replication, or reporting feed
- middleware orchestration through an iPaaS, ESB, API gateway, or custom service
- manual or semi-automated operational handoff between systems

### Source, Target, and Ownership

Look for:
- source system and target system
- integration platform or middleware such as MuleSoft, Boomi, Informatica, Azure Integration Services, AWS services, Kafka, API gateway, custom microservice, ETL tool, or vendor interface
- owning team for each endpoint, event, file, data set, service, or specification
- environment details such as dev, QA, UAT, staging, pre-prod, production, sandbox, or vendor test environment
- API, event, file, or data contract owner
- related stories, release dependencies, vendor dependencies, or external team dependencies

### API, Event, File, or Payload Contract

A developer-ready story should include or reference the applicable contract details:
- endpoint, service name, topic name, queue name, file path, object/table, or named interface reference
- operation or method such as GET, POST, PATCH, PUT, DELETE, publish, subscribe, read, write, load, extract, transform, or sync
- trigger condition or schedule
- request payload, event payload, message body, file layout, or input data set
- response payload, event acknowledgement, output file, target update, or completion signal
- status codes, error codes, result statuses, or response outcomes
- authentication and authorization approach
- timeout, latency, batch window, or processing expectations
- retry, replay, reprocessing, and idempotency behavior
- success and failure logging

### Field Mapping and Data Rules

Look for:
- source-to-target field mappings
- data types, lengths, precision, scale, and formats
- required versus optional fields
- transformations, calculations, derivations, and default values
- enumerated value, picklist, code, or status mapping
- null, blank, and missing value handling
- date/time and timezone format
- currency, unit of measure, locale, and precision rules
- natural keys, external IDs, correlation IDs, or match keys
- duplicate handling
- upsert, merge, overwrite, append, conflict resolution, or survivorship logic

### Platform or Application Build Impact

Look for impacted:
- applications, modules, services, workflows, business processes, or products
- data entities such as records, objects, tables, resources, documents, messages, events, files, or master data domains
- fields, attributes, columns, statuses, integration status, error message, retry count, last sync timestamp, request ID, or correlation ID
- automation such as workflows, rules engines, jobs, schedulers, serverless functions, background workers, triggers, orchestrations, queue consumers, or notification processes
- UI such as page, screen, form, related list, work queue, dashboard, report, admin console, monitoring view, error log, or user notification

### Error Handling

Evaluate whether the story explains what happens for:
- missing required data
- invalid payload, invalid file, or schema mismatch
- authentication or authorization failure
- source or target system unavailable
- timeout or latency breach
- duplicate record or duplicate message
- failed upsert, failed merge, or conflict
- partial success
- middleware, queue, broker, or gateway error
- file not received, duplicate file, malformed file, or late file
- retry exhaustion
- replay or reprocessing
- manual remediation
- user, admin, operations, or support notification

### Security and NFRs

Evaluate whether the story considers:
- authentication method such as OAuth, JWT, certificate, token, API key, mTLS, SSO, service account, or managed identity
- authorization and least-privilege access for service users, integration users, roles, scopes, claims, groups, profiles, permission sets, or policies
- object/entity/record/table access and field/attribute/column-level security where relevant
- sensitive data handling, encryption, masking, tokenization, privacy, compliance, consent, or audit
- expected volume, payload size, file size, frequency, concurrency, and peak loads
- performance SLA, latency target, throughput, or batch processing window
- availability, resilience, retry, dead-letter queue, replay, backup, and recovery expectations
- monitoring, alerting, runbook, support ownership, and operational handoff
- data retention for request/response logs, events, files, audit history, and error records

## Output Format

Use markdown. Start with an executive summary, then provide a story-by-story assessment.

### Required Executive Summary

Include:
- total number of integration stories evaluated
- count of stories ready for development
- count of stories needing refinement
- count of stories not ready
- overall readiness observation in 2-3 sentences
- top 3 recurring integration gaps across the story set

Use this table:

| Readiness category | Count | Meaning |
|---|---:|---|
| Ready for development | n | Can be handed to developers with minimal clarification |
| Needs refinement | n | Mostly usable but requires targeted BA/spec updates |
| Not ready | n | Too ambiguous or incomplete for developer handoff |

### Required Per-Story Format

For each story, use this structure:

```markdown
## Story <number or ID>: <title>

**Integration pattern:** <Inbound | Outbound | Bi-directional | Batch | Real-time API | Event-driven | File-based | Data sync | Middleware-led | Unknown>  
**Verdict:** <Ready for development | Needs refinement | Not ready>  
**Score:** <n>/8  
**Primary reason:** <one sentence explaining the main readiness blocker or why it is ready>

| # | Criterion | Pass? | Rationale |
|---:|---|:---:|---|
| 1 | Clear integration user story format | ✅/❌ | <specific evidence or gap> |
| 2 | Acceptance criteria are complete and testable | ✅/❌ | <specific evidence or gap> |
| 3 | Scope is clearly defined | ✅/❌ | <specific evidence or gap> |
| 4 | Systems, data entities, fields, and UI expectations are clear | ✅/❌ | <specific evidence or gap> |
| 5 | Business rules and validations are documented | ✅/❌ | <specific evidence or gap> |
| 6 | Dependencies are identified | ✅/❌ | <specific evidence or gap> |
| 7 | Security, data, and NFRs are considered | ✅/❌ | <specific evidence or gap> |
| 8 | Testing notes include happy path and exception scenarios | ✅/❌ | <specific evidence or gap> |

### Deficient areas to fix
- **<criterion name>:** <why it is deficient and what clarification is needed>

### Recommended BA/spec updates before developer handoff
- <specific update the BA or spec owner should add to the story or supporting spec>
- <specific update the BA or spec owner should add to the story or supporting spec>

### Integration spec gaps
- **Pattern/trigger:** <clear if present; otherwise missing item>
- **Interface contract:** <API/event/file/payload contract clear if present; otherwise missing item>
- **Data mapping:** <clear if present; otherwise missing item>
- **Error handling/retry/reprocessing:** <clear if present; otherwise missing item>
- **Security/NFRs/operations:** <clear if present; otherwise missing item>

### Developer handoff risk
<one sentence describing the risk if the story is handed off as-is.>
```

If the story is Ready and has no deficiencies, replace “Deficient areas to fix” with:

```markdown
### Ready rationale
- <why the story is ready for development>
```

## BA-Ready Remediation Guidance

When recommending fixes, provide wording the BA or spec owner can paste into the story. Use platform-neutral examples like:

- **Trigger wording:** “This integration is triggered when <business event> occurs in <source system> and all required data fields are populated.”
- **Payload wording:** “The source system sends <entity id>, <customer/account id>, <amount/value>, <effective date>, <contact/email>, and <status/code> to the target interface.”
- **Field mapping wording:** “Use <source external id> as the match key. If no target match is found, create a new record; if multiple matches are found, fail the transaction and create an integration error record.”
- **Error handling wording:** “When the target system returns a validation, authentication, timeout, or server error, store the response code, message, timestamp, correlation id, and retry count in the integration log.”
- **Retry wording:** “Retry transient failures up to three times at 15-minute intervals. After final failure, mark the transaction Failed and notify the integration support queue.”
- **Security wording:** “The integration will use <approved authentication method> and a least-privilege service account with access only to required interfaces and data fields.”
- **Testing wording:** “Test successful sync, missing required field, invalid payload, duplicate match key, unauthorized response, timeout, target unavailable, partial success, and retry exhaustion.”

## Quality Rules

- Be direct and evidence-based. Do not inflate scores to be encouraging.
- Do not invent missing details as if they were present.
- Do not require every integration detail for every story; judge relevance based on the integration pattern and stated scope.
- Mark acceptance criteria as failed if they only repeat the requirement and cannot be independently tested.
- Mark testing notes as failed if they cover only happy path and omit exception scenarios.
- Mark dependencies as failed if source/target systems, middleware or integration platform, interface owner, or environment readiness are unclear.
- Mark security/data/NFRs as failed when authentication, service account access, sensitive data, volume, monitoring, resilience, or performance concerns are relevant but missing.
- Keep rationales concise but specific.
- Provide concrete, actionable fixes for every failed criterion.
- Avoid platform-specific assumptions unless the user's story or artifacts identify a specific platform.

## Optional Improved Story

If the user asks to rewrite or improve the integration stories, add an **Improved integration story draft** section after each assessment. Include:
- title
- user story statement
- in scope
- out of scope
- integration pattern and trigger
- source and target systems
- impacted applications, data entities, fields, UI, and operational views
- interface contract or payload/field mapping summary
- business rules and error handling
- security and NFRs
- acceptance criteria in Given/When/Then format
- testing notes covering happy path and exception scenarios
