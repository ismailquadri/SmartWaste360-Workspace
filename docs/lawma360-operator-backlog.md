# LAWMA-360 Operator: ticket-ready prioritized backlog

**Basis:** The backlog translates the prior review of the Operator app against its PRD, research, stakeholder critiques/defense, political-economy document, and eight ecosystem specs. These are proposed implementation tickets, not verified current Jira issues.

**Sizing:** Relative effort in story points (SP), using Fibonacci sizing. Estimates cover implementation and focused tests, not external integration approvals, field rollout, or unknown data migration. Re-estimate after confirming the current schema and shared event contract.

## Recommended sequence

1. **OP-01 Shift setup** and **OP-02 Trusted scan validation** establish clean operational context and trustworthy scan evidence.
2. **OP-03 Arrears and exceptions** and **OP-04 Override guardrail** improve billing and supervisor controls; they can proceed in parallel after the relevant domain rules are agreed.
3. **OP-05 Shared event pipeline** defines and emits durable operational events; start contract work early, but finish producer wiring before downstream integrations rely on it.
4. **OP-06 Waste Police citations** and **OP-07 Weighbridge closure** depend on event persistence and can then feed ecosystem consumers.

---

## OP-01 — Capture operational mode and tip-off destination at shift start

**Priority:** P0 · **Estimate:** 5 SP · **Type:** Feature

**User story:** As a crew member starting a shift, I want to select the operational mode and assigned tip-off destination so that route, disposal, and end-of-shift records reflect the actual assignment.

**Acceptance criteria**
- Shift start requires exactly one supported operational mode from the agreed four-mode list; the available labels and meaning match the PRD.
- Shift start requires an assigned tip-off destination selected from the current allowed destinations; no silent default is recorded.
- The saved shift record includes crew/vehicle, mode, destination, start time, and a stable shift ID.
- A crew member can review the selected mode and destination before confirming; validation errors identify the missing field.
- The setup flow remains usable offline and queues the shift record for sync; retrying does not create duplicate shifts.
- Existing in-progress shifts retain their recorded values and are not silently rewritten.

**Dependencies:** Confirm the canonical four modes, destination list/source, and shift data fields with the PRD/domain owner.

---

## OP-02 — Validate property identity and scan proximity; flag possible tag cloning

**Priority:** P0 · **Estimate:** 5 SP · **Type:** Feature / data integrity

**User story:** As an operator, I want scans checked against the canonical property and location so that invalid, out-of-area, or suspicious scans do not count as verified collection evidence.

**Acceptance criteria**
- Route/property records use the canonical property-type values from the PRD, and unsupported or missing types are rejected with a clear actionable message.
- A scan records the property/tag ID, route/shift ID, timestamp, and device location when available.
- When location is available, the app applies the agreed 75 m proximity threshold; an out-of-range scan is marked unverified and does not count as a completed collection until resolved by an authorized workflow.
- A tag scanned at a location within 75 m of another distinct tag/location event is flagged as a possible cloning case for supervisor review; the app does not automatically accuse or penalize a resident.
- Missing GPS, poor accuracy, or permission denial is represented explicitly and does not masquerade as a passing proximity check.
- The same scan retried offline/after sync is idempotent and does not double-count service or billing.
- The app shows crew-facing guidance and preserves an auditable reason/status for each rejected or flagged scan.

**Dependencies:** Canonical property types; agreed GPS accuracy policy and interpretation of the 75 m anti-cloning rule; shared event contract in OP-05 for final event publication.

---

## OP-03 — Apply compound arrears ratios, hazard rejection, and flood grace

**Priority:** P0 · **Estimate:** 8 SP · **Type:** Feature / billing rules

**User story:** As an operator handling a multi-flat property, I want arrears and service exceptions calculated consistently so that residents are not incorrectly billed or denied collection during documented hazards or flood disruption.

**Acceptance criteria**
- For multi-flat properties, the app calculates arrears using the approved unit/flat ratio rule and shows the inputs, calculation, and resulting amount/status.
- The calculation handles missing or inconsistent flat counts by blocking a final arrears decision and presenting a correction path; it does not silently assume one flat.
- A hazard-rejected collection attempt can be recorded with a required reason and optional evidence; it is not recorded as a successful collection or as resident refusal.
- An authorized flood-grace condition can be recorded for the applicable area/property and period; qualifying service/billing actions follow the approved grace rule.
- The app displays whether an exception is pending, approved, expired, or rejected, with actor and timestamp in the audit trail.
- Rules and decisions work offline using the latest available configuration; stale configuration is surfaced and queued records reconcile without duplicate charges or service completions.
- Unit tests cover single-flat, multi-flat, missing-data, hazard-rejection, flood-grace, expiry, and offline retry cases.

**Dependencies:** Product/finance sign-off on the exact ratio formula, hazard taxonomy, flood-grace eligibility and duration, and which roles may approve exceptions; canonical property data from OP-02.

---

## OP-04 — Warn supervisors when overrides exceed 15%

**Priority:** P1 · **Estimate:** 3 SP · **Type:** Feature / controls

**User story:** As a supervisor, I want a visible warning when overrides exceed the approved 15% threshold so that abnormal patterns are reviewed before they normalize.

**Acceptance criteria**
- The dashboard calculates the override rate using the approved numerator, denominator, and reporting window.
- When the rate is greater than 15%, a prominent warning appears with the rate, time range, and underlying count; at 15% or below, the warning is absent.
- The dashboard can show the affected route/crew/period and provide a path to review the underlying override records.
- The calculation excludes test/demo data and handles zero denominators without displaying misleading percentages.
- Offline or incomplete data is labeled as such; the UI does not present a partial rate as complete.
- Tests cover 0%, exactly 15%, above 15%, zero denominator, and incomplete data.

**Dependencies:** Confirm the definition of an override, denominator, and reporting window; access to override records.

---

## OP-05 — Define and emit durable shared operational events

**Priority:** P0 · **Estimate:** 8 SP · **Type:** Platform / integration

**User story:** As an ecosystem application, I want verified Operator actions published as consistent, replay-safe events so that partner settlement, resident activity, and workspace telemetry can use the same source of truth.

**Acceptance criteria**
- Implement the shared `HubMessage` contract in `hub-contract.ts` (or its agreed successor) for at minimum verified scan, handoff/consolidation, citation, and weighbridge intake/closure events.
- Each event has a stable event ID, event type/version, occurred-at time, actor/device, shift/route/property or vehicle references as applicable, and an offline/source status.
- Events are persisted to an outbox/queue before sync; retries are idempotent and preserve original occurrence time and event ID.
- Invalid events are rejected with a diagnosable validation error and are not silently dropped.
- Sync status and failure reason are observable to an authorized operator/supervisor; replay does not create duplicate resident activity, settlement input, or telemetry.
- Add contract tests for valid payloads, missing required fields, unknown versions, duplicate delivery, and offline replay.
- Document event ownership, versioning, and compatibility expectations for consumer apps.

**Dependencies:** Agree the shared event schema and consumer expectations with Operator, Partner, Resident, and Workspace owners. Start schema review in parallel with OP-01/02.

---

## OP-06 — Record cashless Waste Police citations with photo evidence

**Priority:** P1 · **Estimate:** 8 SP · **Type:** Feature / enforcement

**User story:** As an authorized Waste Police officer, I want to issue an auditable cashless citation with evidence so that enforcement is traceable and does not depend on on-the-spot cash collection.

**Acceptance criteria**
- Only an authorized enforcement role can create, amend, or void a citation; permissions are enforced in the UI and persisted record.
- A citation requires the approved violation type, location, timestamp, officer identity, and evidence/photo or an explicit policy-approved evidence exception.
- The workflow displays the citation amount and payment instructions from an approved configuration; the app never accepts or records cash as settlement.
- Citation status is explicit (for example, draft, issued, paid, disputed, void) and each transition records actor, time, and reason where required.
- Offline issuance is visibly marked pending sync; retries are idempotent and a citation ID remains stable across sync.
- Citation creation emits the OP-05 event; invalid or unsynced events are not presented to downstream systems as settled enforcement.
- Tests cover role denial, required evidence, offline issuance/retry, status transitions, and audit history.

**Dependencies:** Legal/operations approval of violation catalog, fee schedule, appeal process, roles, evidence-retention policy, and cashless payment/settlement destination; OP-05 event contract. Payment collection itself is out of scope unless separately approved and specified.

---

## OP-07 — Verify weighbridge intake before shift closure

**Priority:** P1 · **Estimate:** 8 SP · **Type:** Feature / operational control

**User story:** As a crew member closing a shift, I want to capture and verify weighbridge intake so that collected waste has a traceable disposal record and supervisors can detect discrepancies.

**Acceptance criteria**
- Shift closure requires a weighbridge/intake record or an approved exception reason; the app cannot silently mark disposal complete without either.
- The record captures the agreed minimum fields: vehicle, shift, facility, ticket/reference, intake time, and weight values when available.
- The app validates gross/tare/net consistency using the approved rule and flags missing, negative, or out-of-tolerance values for review rather than silently accepting them.
- A supervisor can review, accept, or reject a flagged record with an auditable reason; a crew member cannot approve their own exception unless policy explicitly permits it.
- Offline closure is saved as pending verification, not falsely shown as facility-verified; later retries update the same record.
- A verified intake/closure emits the OP-05 event; downstream consumers can distinguish pending, verified, rejected, and exception outcomes.
- Tests cover valid ticket, missing ticket, inconsistent weights, offline queue/retry, exception approval, and duplicate event delivery.

**Dependencies:** Confirm participating facilities, ticket/weight fields, tolerances, exception policy, supervisor roles, and any external weighbridge verification interface; OP-05 event contract.

---

## OP-08 — Capture feeder handoff and consolidation evidence

**Priority:** P1 · **Estimate:** 5 SP · **Type:** Feature / ecosystem integration

**User story:** As a crew member transferring waste to a feeder or consolidating loads, I want to record the handoff so that route completion and downstream settlement reflect the physical transfer rather than an unverified claim.

**Acceptance criteria**
- A handoff records source shift/vehicle, receiving vehicle or facility, time, location when available, and quantities/units according to the approved operating procedure.
- Both sides of a handoff can be reconciled; an unmatched or quantity-mismatched handoff is visible as pending review, not counted as verified completion.
- Offline handoffs retain stable IDs and reconcile idempotently when connectivity returns.
- Handoff events use the OP-05 schema and can be consumed by Partner settlement without requiring manual re-entry.
- Tests cover matched, unmatched, mismatched, offline/retried, and corrected handoffs.

**Dependencies:** Approve feeder workflow, quantity units/tolerances, confirmation responsibilities, and settlement evidence requirements; OP-05 event contract.

---

## Definition of done for all tickets

- Acceptance criteria have automated tests for normal, error, and offline/retry paths where relevant.
- User-visible states distinguish verified, pending sync, failed, and exception outcomes.
- Sensitive actions have authorization and an auditable history; no unresolved or ambiguous exception silently becomes a successful service/billing/enforcement outcome.
- Existing demo behavior is preserved or deliberately migrated; no production data is deleted or rewritten without an approved migration plan.
- The changed flow is checked on a small mobile viewport and with keyboard/accessibility basics.

## Open decisions to resolve before implementation

1. The exact four operational modes and the authoritative tip-off destination list.
2. Formula and policy owners for compound arrears, flood grace, hazard rejection, 15% override rate, citation fees, and weighbridge tolerances.
3. The shared event schema/version and whether the current `HubMessage` contract is authoritative across all ecosystem apps.
4. Which service/payment systems are in scope for live cashless settlement and facility/weighbridge verification; this backlog does not assume those integrations already exist.
