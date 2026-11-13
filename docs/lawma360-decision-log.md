# LAWMA-360 Operator — Open Decision Log

**Status:** Draft for product, operations, finance, legal, and integration review  
**Purpose:** Make unresolved policy and contract choices explicit before implementation. No option below is an approved LAWMA policy. Recommendations are starting points for discussion, not decisions.

## Decision summary

| ID | Decision | Suggested direction for review | Needed from |
|---|---|---|---|
| DEC-01 | Multi-flat arrears formula | Calculate at dwelling/unit level using verified count and approved tariff; hold disputed counts for review | Finance / billing policy |
| DEC-02 | Hazard and flood exceptions | Separate hazard rejection from flood grace; bounded, auditable, no automatic adverse billing outcome while unresolved | Operations / finance / legal |
| DEC-03 | Shared event contract | Versioned event envelope, durable outbox, idempotent IDs, explicit verification and sync states | Operator + ecosystem app owners |
| DEC-04 | Cashless citations | Issue citation without collecting cash; payment to an authorized channel, with dispute/appeal and evidence controls | Legal / enforcement / finance |
| DEC-05 | Weighbridge policy | Close shifts only with verified intake or a controlled, auditable exception; distinguish pending from verified | Operations / facility owners |

---

## DEC-01 — Multi-flat arrears formula

**Question:** How should arrears for a compound or multi-flat property be determined and presented?

### Options

**A. Unit-level calculation using verified occupied/serviceable units**  
Compute each unit's arrears from the approved tariff, applicable service period, and documented eligibility; sum the units for the property.
- **Benefits:** Makes the calculation explainable at unit level; can accommodate different eligibility or service status.
- **Tradeoffs:** Needs reliable unit counts and unit-level records; more complex to correct and audit; may expose household-level information to roles that do not need it.

**B. Flat-count ratio against a property-level charge**  
Allocate the property-level arrears using the approved count of flats, applying one consistent ratio per flat.
- **Benefits:** Easier to explain and implement if the tariff is property-based; supports a consistent compound calculation.
- **Tradeoffs:** A wrong flat count propagates across all shares; does not naturally handle different occupancy, service eligibility, or tariff classes.

**C. Property-level arrears only, with no per-flat allocation in the Operator app**  
Keep the liability attached to the property record; leave any internal allocation to an authorized billing process outside the field app.
- **Benefits:** Minimizes field-level discretion and sensitive unit data; simpler operational record.
- **Tradeoffs:** Does not directly answer resident questions about each flat's share; can obscure disputes and collection responsibility.

### Decision criteria and proposed direction

Favor **A** if the policy owner can provide a defensible tariff and verified unit data. Otherwise, use **B** only with a clearly defined source of truth for flat count and a correction process. **C** is a safer interim choice than inventing a ratio in the app, but does not fulfill per-flat transparency.

### Acceptance / implementation guardrails

- Show tariff, service period, unit count/source, formula, and result before a final arrears outcome.
- Missing or disputed counts must produce **needs review**, not an assumed count or final charge.
- Preserve prior calculations and correction history; changes record who, when, and why.
- The app should not infer occupancy or create a liability rule not approved by the policy owner.

**Decision owner:** Finance/billing policy. **Consult:** Operations, resident support, legal/privacy.  
**Open question:** Is the policy based on registered flats, occupied flats, serviceable units, or another defined unit?

---

## DEC-02 — Hazard rejection and flood grace

**Question:** Which events qualify for an operational exception, who approves them, and what happens to service and billing while they are unresolved?

### Options

**A. Two separate, bounded exception workflows (suggested)**  
Record a **hazard rejection** when a crew cannot safely complete collection, and a distinct **flood grace** when an authorized area/period is covered by a declared or approved flood exception. Each has its own eligibility and approval rule.
- **Benefits:** Separates crew-safety evidence from area-wide service/billing relief; easier audit and reporting; avoids treating every missed pickup as the same event.
- **Tradeoffs:** More policy and workflow setup; requires clear eligible hazards, flood boundaries, time windows, and approvers.

**B. One general exception workflow**  
Use one exception record with reason codes for hazard, flooding, access, and other causes.
- **Benefits:** Simpler interface and fewer workflows.
- **Tradeoffs:** Risks conflating safety incidents with billing relief; generic approval rules may not fit distinct cases; harder to analyze cause and accountability.

**C. Defer billing effect; record operational facts only**  
Capture the hazard/flood event and evidence, but apply no automated billing or arrears change until a separate policy process decides.
- **Benefits:** Avoids encoding unapproved financial policy; suitable as an initial controlled release.
- **Tradeoffs:** Requires a timely manual process; residents may face inconsistent outcomes if adjudication is delayed.

### Decision criteria and proposed direction

Use **A** as the target model if responsible owners can define distinct rules. Until approved, **C** is the lowest-risk interim behavior: record the incident, show it as pending review, and do not automatically treat it as successful service, resident refusal, or a finalized adverse billing event.

### Decisions required

- **Hazard taxonomy:** Which site conditions qualify, what evidence is required, and when may a crew stop without supervisor pre-approval?
- **Flood rule:** Who declares an affected area, how boundaries and validity dates are represented, and whether grace affects a fee, an arrears period, or both.
- **Authority:** Who can approve, reject, extend, or reverse an exception? Can the person who records it also approve it?
- **Duration and reconciliation:** Expiry, offline configuration freshness, and handling of queued events from before/after a grace period.
- **Resident-facing treatment:** What reason/status can be communicated, and through which channel?

### Guardrails

- Keep **attempted**, **hazard-rejected**, **flood-exempt**, and **collected** as distinct outcomes.
- Never convert a pending exception into a completed collection or final bill adjustment silently.
- Retain timestamp, actor, location/evidence when available, decision maker, and reason; record edits as new audit entries.

**Decision owner:** Operations for safety; finance for billing effect; legal for authority and notice. **Consult:** Resident support and data governance.

---

## DEC-03 — Shared event contract (`HubMessage`)

**Question:** What contract should connect Operator activity to Partner settlement, Resident activity, Workspace telemetry, and other ecosystem consumers?

### Options

**A. Versioned event envelope with domain-specific payloads (suggested)**  
Use a common envelope with stable event ID, type and schema version, occurrence time, actor/device, source, references, and explicit verification/sync state. Keep scan, handoff, citation, and weighbridge payloads typed and distinct.
- **Benefits:** Supports multiple consumers without flattening domain meaning; can evolve through explicit versions; makes offline provenance and deduplication visible.
- **Tradeoffs:** Requires contract governance, compatibility testing, and clear ownership of event types.

**B. One generic event payload with flexible key/value data**  
Publish a common record with a generic event name and loosely structured fields.
- **Benefits:** Quick to start; producers can add data without frequent schema changes.
- **Tradeoffs:** Consumers must guess field meaning and validation; weak guarantees can undermine settlement, billing, and audit; changes are hard to detect.

**C. Consumer-specific integrations**  
Create separate payloads and delivery logic for each app or service.
- **Benefits:** Each consumer receives exactly the data it needs; useful where legal boundaries require strict minimization.
- **Tradeoffs:** Duplicates producer logic; increases drift and maintenance; replay and identity reconciliation become harder.

### Delivery and trust options

- **Durable outbox + idempotent delivery (recommended):** Save the event with the business action, then retry delivery with the same event ID. Consumers deduplicate. Stronger offline reliability, but needs storage and operational monitoring.
- **Best-effort direct publish:** Send immediately and record success/failure. Simpler, but risks lost events during poor connectivity and can create mismatched app state.

### Suggested contract rules

- Distinguish **occurred**, **queued**, **delivered**, and **verified**. Delivery is not proof that the underlying service or payment was verified.
- Use immutable event IDs, explicit schema versions, and documented compatibility/deprecation rules.
- Include only minimum necessary data; avoid resident personal details in broad telemetry events.
- Keep correction/cancellation as a linked follow-up event rather than mutating an already-consumed event invisibly.
- Define who owns each event type and what evidence makes it eligible for settlement or resident-facing activity.

### Open questions

- Is `HubMessage` already the authoritative cross-app contract, or a prototype local type?
- Which system is the source of truth for event identity, property/vehicle IDs, and timestamps?
- Which consumers require real-time delivery versus eventual sync?
- What retention, replay, privacy, and access policies apply to location and photo references?

**Decision owner:** Cross-app technical/product owners. **Consult:** Security/privacy, Partner settlement, Resident product, Workspace telemetry.

---

## DEC-04 — Cashless Waste Police citation policy

**Question:** How should an officer issue a citation while preventing on-the-spot cash handling and preserving due process?

### Options

**A. Issue a digital citation; payment occurs through an authorized channel (suggested)**  
Officer records the violation and evidence; the app issues a traceable citation and directs the recipient to an approved payment channel. Disputes and appeals have defined states and deadlines.
- **Benefits:** Separates enforcement from payment collection; creates an audit trail; lowers cash-handling and reconciliation risk.
- **Tradeoffs:** Requires an authorized payment/receipting process and support for people without convenient digital access; payment status integration may be a separate dependency.

**B. Record citation in the app; payment and dispute handled by an existing back office**  
The field app issues a reference only; an existing authorized office handles payment, receipt, and adjudication.
- **Benefits:** Can avoid a new payment integration; keeps officers out of payment processing.
- **Tradeoffs:** Depends on a functioning back-office workflow and timely status updates; a citation reference alone may be hard for a recipient to resolve.

**C. Defer digital issuance; record incident for later review**  
Use a non-final incident record pending supervisor/legal confirmation.
- **Benefits:** Appropriate while fee authority, evidence rules, or appeals are unconfirmed.
- **Tradeoffs:** Not a complete enforcement workflow; delay can reduce operational usefulness and create inconsistent follow-up.

### Decisions required before issuing final citations

- Approved violation categories, legal authority, fee schedule, issuing roles, and geographic scope.
- Evidence requirements: photo, location, timestamp, witness/other evidence, and privacy/retention rules.
- Citation states and permitted transitions, including service/notice, payment confirmation, dispute, appeal, cancellation, and correction.
- Official payment destination and authoritative receipt/status source; no officer-held cash or unofficial wallet.
- Accessible non-digital payment/appeal alternatives, notices, language, and support route.
- Separation of duties: who may issue, void, adjudicate disputes, confirm payment, and audit.

### Guardrails

- A field-issued citation is **issued**, not **paid** or **adjudicated**.
- Never display payment success based only on a crew/officer action or unverified screenshot.
- Record an immutable citation ID and an audit trail; correction or voiding requires reason and authorized actor.
- If policy is not approved, support a clearly labeled draft/incident flow only, not an enforceable charge.

**Decision owner:** Legal/enforcement authority. **Consult:** Finance, operations, resident/customer support, privacy/security.

---

## DEC-05 — Weighbridge intake and shift-closure policy

**Question:** What evidence is required to close a shift, and how should incomplete or inconsistent facility records be treated?

### Options

**A. Verified facility ticket required, with controlled exception path (suggested)**  
A shift closes as verified only after a valid weighbridge ticket/record is matched to the shift and vehicle. Authorized exceptions permit closure with a clearly pending or exception status and reason.
- **Benefits:** Strong mass-balance evidence; clean separation between verified disposal and an exception; supports audit and settlement.
- **Tradeoffs:** May block closure during facility outages, queues, ticket delays, or offline periods; requires an exception approver and eventual reconciliation.

**B. Crew-entered intake accepted provisionally; facility verification later**  
Allow closure using crew-entered ticket/weight details, visibly marked provisional until matched to facility evidence.
- **Benefits:** Keeps field operations moving and works during connectivity/facility delays.
- **Tradeoffs:** Depends on later reconciliation; provisional entries could be mistaken for verified unless status is unmistakable; needs a discrepancy workflow.

**C. Shift can close without intake evidence; reconcile separately**  
Capture intake when available but do not gate shift closure.
- **Benefits:** Fewest operational blockers and simplest field flow.
- **Tradeoffs:** Weakens the link between collection and disposal; missing evidence can persist; less useful for mass-balance and settlement controls.

### Validation and exception choices

- **Weight validation:** Define whether net weight is facility-provided or calculated from gross minus tare; set allowed variance, rounding, units, and treatment of repeated/adjusted weighings.
- **Ticket verification:** Choose manual supervisor review, facility system integration, or both. A photo of a ticket is evidence, not necessarily authoritative verification.
- **Exceptions:** Define reasons such as facility outage, no ticket, vehicle substitution, or emergency diversion; require authority, expiry/reconciliation deadline, and audit trail.
- **Closure semantics:** Distinguish shift complete, intake pending, intake verified, discrepancy under review, and exception-approved.

### Suggested direction

Choose **A** as the control target, with **B** as an explicitly provisional offline/queue fallback if operations confirms crews must be able to close a shift before facility confirmation. Do not label provisional data “verified.” Avoid **C** where disposal evidence is needed for settlement or mass-balance oversight.

**Decision owner:** Operations/facility owners. **Consult:** Finance, Partner settlement, supervisors, fleet teams, security/privacy.

---

## Cross-cutting rollout recommendation

1. Decide the policy owners and definitions first, especially liability, exception authority, citation legal status, and facility verification.
2. Agree the `HubMessage` event envelope and status semantics before connecting downstream consumers; producers can implement against a versioned contract in parallel with policy work.
3. Launch each workflow with pending/review states and audit history before enabling automated billing, settlement, penalty, or resident-facing conclusions.
4. Pilot with representative offline, flood/hazard, multi-flat, and facility-delay scenarios; use pilot findings to adjust thresholds and operational procedures, not to silently change policy.

## Decision record template

For each item, record: **Chosen option**, **decision owner**, **approvers**, **date**, **rationale**, **scope/effective date**, **exceptions**, **review date**, and **related ticket IDs**. Keep unresolved items marked **Open**; do not infer approval from implementation.
