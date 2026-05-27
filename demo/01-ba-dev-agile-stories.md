# Sprint 14 — Renewal Acceleration Program

The following 4 user stories are proposed for the next sprint. Please review for Definition of Ready.

---

## Story 1 — Auto-create renewal Opportunity 90 days before contract expiry

**As a** Renewal Sales Rep,
**I want** renewal Opportunities to be auto-created 90 days before the current Contract end date,
**So that** I have enough lead time to engage the customer before lapse and reduce churn.

### Acceptance Criteria

1. **GIVEN** an active Contract with `Status = 'Activated'` and `End_Date__c` within 90 days
   **WHEN** the daily scheduled flow runs
   **THEN** a new Opportunity is created with `RecordType = 'Renewal'`, `StageName = 'Renewal Identified'`, `AccountId = Contract.AccountId`, `Amount = Contract.ContractValue__c`, `CloseDate = Contract.End_Date__c`.
2. **GIVEN** a Contract already has a related Opportunity with `RecordType = 'Renewal'` and `StageName` not in `('Closed Won', 'Closed Lost')`
   **WHEN** the daily scheduled flow runs
   **THEN** no duplicate renewal Opportunity is created (idempotent).
3. **GIVEN** a Contract's `End_Date__c` is updated
   **WHEN** the renewal Opportunity has not yet been created
   **THEN** the auto-creation re-evaluates on the next scheduled run.

### Salesforce Objects & Fields

- **Contract** (standard): `Status`, `End_Date__c`, `ContractValue__c`, `AccountId`, `OwnerId`
- **Opportunity** (standard): `RecordType`, `StageName`, `AccountId`, `Amount`, `CloseDate`, `OwnerId`, `OriginatingContract__c` (Lookup → Contract)
- **New field**: `Opportunity.OriginatingContract__c` (Lookup to Contract)

### Implementation

- Scheduled Flow `Auto_Create_Renewal_Opportunities` runs daily at 02:00 ET.
- Real-time record-triggered flow for Contract date changes is deferred to phase 2.

### Business Rules

- Only Accounts where `Account.Status__c = 'Customer'` are eligible.
- `OwnerId` on the new Opportunity is copied from `Contract.OwnerId`.
- `Opportunity.Description` includes "Auto-generated from Contract [Contract Number]".

### Dependencies

- **Depends on**: STRY-1041 (Contract `End_Date__c` field added in previous sprint — confirmed deployed to UAT).
- **Blocks**: STRY-1058 (Renewal Dashboard) — needs renewal Opportunities to exist for reporting.

### Security, Data, NFRs

- Profile "Renewal Sales User" needs Read/Edit on Opportunity, Read on Contract.
- **Performance**: flow must complete for up to 5,000 eligible Contracts within the nightly window (verified via large-data org test).
- **Audit**: `Opportunity.Description` must reference originating Contract number for traceability.

### Testing Notes

- Happy: 1 Contract expiring in 60 days → 1 Opportunity created with correct field values.
- Idempotency: re-run scheduled flow on same day → no duplicates.
- Exception: Contract `End_Date__c` moved to > 90 days out → existing renewal Opportunity untouched.
- Edge: `Account.Status__c = 'Former Customer'` → no Opportunity created.

---

## Story 2 — Show renewal health score on Opportunity record page

**As a** Renewal Sales Rep,
**I want** to see a renewal health score on each renewal Opportunity,
**So that** I can prioritize at-risk accounts.

### Acceptance Criteria

- The Opportunity record page shows a health score badge: Green, Amber, or Red.
- The score is based on the customer's product usage and recent support cases.
- Updates automatically.

### Salesforce Objects

- Opportunity
- Case (for support volume)

The component should be on the Renewal record page layout, not the standard Opportunity page.

---

## Story 3 — Self-service renewal

**As a customer**, I want to renew my contract online so I don't have to talk to sales.

---

## Story 4 — Send renewal reminder emails to customers

**As a** Renewal Marketing Manager,
**I want** automated reminder emails sent to customers 60, 30, and 14 days before contract expiry,
**So that** customers don't miss the renewal window.

### Acceptance Criteria

1. **GIVEN** a Contract with `End_Date__c` within 60, 30, or 14 days
   **WHEN** the daily reminder process runs
   **THEN** an email is sent to the primary contact on the Account.
2. Emails use the "Renewal Reminder" email template.
3. Email send is logged on the Account timeline.

### Salesforce Objects

- Account (with `PrimaryContactId__c`)
- Contract
- EmailMessage (for activity logging)

### Implementation

No new UI components needed.
