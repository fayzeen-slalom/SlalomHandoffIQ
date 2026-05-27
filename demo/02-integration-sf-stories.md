# Sprint 14 — Inbound Integration Backlog (Integration Team → Implementation Team)

The following stories describe inbound streams the Integration Team is publishing for the Salesforce Implementation Team to consume. Please review for Definition of Ready before sprint commitment.

---

## Story 1 — Inbound Account sync from SAP via MuleSoft platform event

**As** the Integration Team,
**We are** publishing Account master records from SAP to Salesforce via the `Account_Sync__e` platform event,
**So that** the Implementation Team can configure the subscribed Apex trigger, target object mappings, and conflict handling.

### Inbound Payload Schema (JSON, published as `Account_Sync__e`)

```json
{
  "external_id":        "string (SAP Customer Number, 10 chars, required, unique)",
  "company_name":       "string (max 80)",
  "industry_code":      "string (3 chars, maps to picklist Industry)",
  "billing_address": {
    "street":           "string (max 255)",
    "city":             "string (max 40)",
    "country_iso":      "string (2 chars)"
  },
  "annual_revenue_usd": "number (currency, optional)",
  "active":             "boolean",
  "last_modified_utc":  "datetime (ISO 8601)"
}
```

### Target Object & Field Mappings

- **Salesforce object**: `Account` (standard)
- `external_id` → `Account.External_ID__c` (External ID, Unique, Required)
- `company_name` → `Account.Name`
- `industry_code` → `Account.Industry` (lookup against custom metadata `Industry_Code_Map__mdt`)
- `billing_address.street` → `Account.BillingStreet`
- `billing_address.city` → `Account.BillingCity`
- `billing_address.country_iso` → `Account.BillingCountryCode` (ISO codes enabled)
- `annual_revenue_usd` → `Account.AnnualRevenue`
- `active` → `Account.Status__c` (`true` → 'Active', `false` → 'Inactive')
- `last_modified_utc` → `Account.External_LastModified__c` (Datetime)

### Upsert / Duplicate Logic

- **Upsert key**: `Account.External_ID__c`.
- If event arrives with `last_modified_utc` older than current `Account.External_LastModified__c`, the event is logged but **not applied** (last-write-wins by source timestamp).
- If `industry_code` has no entry in `Industry_Code_Map__mdt`, `Account.Industry` is left null and a record is created in `Integration_Error_Log__c` with severity = 'Warning'.

### Volume & Frequency

- Steady state: 1,200 events/hour. Peak: 8,000 events/hour during nightly batch (00:00–02:00 UTC).
- Estimated 250,000 Accounts in initial backfill.
- Platform event subscription must support replay for the last 72 hours.

### Error Handling

- Payload validation failures → published to `Integration_Error_Log__c` with raw payload, error reason, timestamp.
- Retry: MuleSoft retries up to 3 times with exponential backoff before publishing to error log.
- DLQ: `Account_Sync_DLQ__e` for events that exceed retry count.

### Security, Data, NFRs

- Integration User profile: Read/Create/Edit on `Account`, Create on `Integration_Error_Log__c`.
- **PII**: billing address fields subject to GDPR — `Account.PII_Marked__c` set to `true` if `billing_address.country_iso` is in EU list.
- **Performance**: subscribed Apex trigger must process events within 5s p95.
- **Audit**: every Account update from this integration logs to FieldHistory and includes `Source = 'MuleSoft-SAP'`.

### Testing Notes

- Happy: new `external_id` arrives → Account created, all fields populated, `External_LastModified__c` set.
- Upsert: existing `external_id` with newer timestamp → Account updated.
- Out-of-order: event with older timestamp than current `External_LastModified__c` → no update, log entry created.
- Unknown industry: Account created, `Industry` left null, warning logged.
- Volume: 8,000 events in 60 seconds → all processed within 90 seconds.

### Dependencies

- **Depends on**: `Account.External_ID__c` and `Account.External_LastModified__c` fields deployed (STRY-INT-088, complete).
- **Blocks**: Renewal program (Sprint 15) which expects accurate SAP-sourced Account data.

---

## Story 2 — Sync Contact email changes from Marketo

**As** the Integration Team,
**We are** streaming Contact email updates from Marketo to Salesforce,
**So that** Contact records stay current.

### Payload

```json
{
  "contact_external_id": "string",
  "new_email":           "string"
}
```

### Target

`Contact.Email`, matched via `Contact.Marketo_ID__c`.

### Volume

Low — a few hundred a day.

---

## Story 3 — Order status updates from logistics

**Title**: Order status webhook.

We need to receive order status updates from our logistics provider and update the Order record in Salesforce.
