# Field Service Cloud Discovery Handoff — Acme Manufacturing

**Document prepared by**: Acme Manufacturing Discovery Team
**Handed to**: Slalom Implementation Team
**Date**: April 2026
**Status**: Final for design phase

---

## 1. Business Context

Acme Manufacturing operates a fleet of 240 field service technicians across the US and Canada servicing industrial HVAC equipment. The current dispatch process uses a combination of Outlook calendars, an aging custom .NET dispatching application built in 2008, and Excel route sheets faxed to regional offices.

Over the past 18 months, average mean-time-to-repair (MTTR) has increased by 34%, and customer satisfaction (CSAT) on the post-service survey has dropped from 4.2 to 3.6 (out of 5). Leadership has approved a Salesforce Field Service implementation to replace the legacy dispatching application and provide a unified mobile experience for technicians.

Target go-live is Q3 2026. Executive sponsor: **Karen Liu, COO**. Approved budget envelope: **$1.8M** for implementation services plus licenses.

## 2. In Scope

- Replace the legacy .NET dispatching application with Salesforce Field Service.
- Mobile experience for 240 technicians (iOS + Android).
- Work Order lifecycle from creation through completion to invoicing.
- Customer self-scheduling portal (Experience Cloud).
- Skill-based routing and territory assignment.
- Inventory tracking at the van/truck level.
- Knowledge base accessible to technicians in the field.

## 3. Out of Scope

- Parts procurement remains in SAP.
- Payroll and time tracking remain in Workday.
- Email marketing to customers remains in Mailchimp.

## 4. Key Stakeholders

| Name | Role | Engagement |
|---|---|---|
| Karen Liu | COO | Executive Sponsor |
| Dan Park | VP Field Operations | Business Owner |
| Maria Cortez | Director of IT | Technical Owner |
| Greg Hall | Field Service Manager (East) | Key SME |
| Tasha Williams | Field Service Manager (West) | Key SME |
| Lin Tran | Customer Experience Lead | Portal owner |

## 5. Current State

When a customer calls in for service, the call-center agent logs the request in the legacy .NET application. The application generates a service ticket which is emailed to the regional dispatcher. The dispatcher reviews technician calendars in Outlook, picks someone available, and faxes a route sheet to the technician's regional office. Technicians pick up route sheets in the morning, drive to jobs, complete service, write notes on the route sheet, and turn them in at end of day. Office staff manually re-enter completion data into the .NET application each evening.

Customers occasionally call back asking when the technician will arrive — there is no automated notification today.

## 6. Future State Vision

In the future state, customers will be able to schedule appointments online through a portal or via inbound calls handled by the call center. Service Appointments will be automatically assigned to the best-matched technician based on skill, location, and availability. Technicians will receive their daily schedule via mobile, complete work in the app, and capture signatures, photos, and parts used in real time. Customers will receive automated notifications when the technician is en route and again when service is complete.

## 7. Initial User Stories

### Story 1
As a customer, I want to schedule a service appointment online so I don't have to call.

### Story 2
As a technician, I want to see my schedule on my phone so I know where to go.

### Story 3
As a dispatcher, I want the system to suggest the best technician for each job based on skills, location, and availability.

### Story 4
As a customer, I want to know when my technician is on the way.

## 8. Data Considerations

We will need to migrate technician records, customer records, and the last 24 months of completed work orders from the legacy .NET system. Acme can provide CSV exports of these on request. Customer records currently live in three places (the legacy .NET application, the billing system, and the call-center CRM) and reconciliation has not been done.

## 9. Salesforce Capability Expectations

We understand that Salesforce Field Service supports:

- A mobile app for technicians.
- Scheduling and dispatch.
- Knowledge articles.
- A customer portal via Experience Cloud.
- Reporting dashboards for managers.

We assume these are all out-of-the-box capabilities.

## 10. Timeline

| Phase | Window |
|---|---|
| Discovery handoff | April 2026 |
| Design | May–June 2026 |
| Build | July–August 2026 |
| UAT | September 2026 |
| Go-live | October 2026 |

---

*End of document.*
