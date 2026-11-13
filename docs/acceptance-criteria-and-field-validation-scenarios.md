# LAWMA-360 v2: Acceptance Criteria & Field-Validation Scenarios

**Status:** Test plan for a realistic simulation and controlled pilot. Criteria below define observable behavior; they do not certify statutory compliance or production readiness.  
**Source basis:** The repository's six engineering safeguards and 11 operating modules. Thresholds that depend on policy (settlement percentages, timeout windows, penalties, tolerances, retention periods, service targets) must be configuration values approved by the relevant authority.

## How to use this plan

- **Pass** means all observable criteria for the scenario pass and the event/audit record is inspectable.
- **Field validation** means run the scenario with the responsible operator using synthetic or consented test data, approved safety controls, and a documented fallback. Never create real penalties, account holds, evidence filings or payments during simulation.
- Every generated event must include stable event ID, event type/version, occurred-at and recorded-at times, actor/source, entity references, correlation ID, idempotency key where applicable, and provenance. Corrections append a superseding event; they do not erase the original.
- Module numbering and titles below follow the actual `docs/modules/` filenames. MOD-07 is Ecotox/Leachate and MOD-08 is Hazmat/Special Projects; some earlier summary/event-flow documents use different labels. Reconcile those source documents before treating cross-document labels as canonical.

## Six safeguards: testable acceptance criteria

### S1. Offline weighbridge tickets and reconciliation
**Criteria**
- A network outage does not prevent authorized edge ticket creation when the scale and edge device are healthy.
- Each ticket has a unique monotonic device sequence, trip/vehicle/facility references, gross/tare/net values and units, capture time, operator identity, scale/device identity, calibration status, signed payload and integrity verification result.
- Retries and resynchronization are idempotent: the same ticket cannot create a second payable load.
- Duplicate sequence, invalid signature, stale calibration, impossible/negative net weight, time anomaly or hash-chain break is quarantined and surfaced for review, never silently accepted.
- Recovery sync preserves original capture time and records server receipt time; reconciliation reports missing, duplicate, rejected and pending tickets.
- If the scale itself is unavailable or untrusted, the flow records an exception and does not represent estimated weight as verified scale weight.

**Field scenario:** Disconnect facility WAN while keeping a calibrated test scale and edge unit powered; weigh a test vehicle, restart the edge service, restore the network, resend the same ticket twice, then submit a tampered copy and a ticket from a device with expired calibration. Verify one accepted record, transparent quarantines, no duplicate payable tonnage, and a complete reconciliation report.

### S2. Queue-triggered diversion with verified compensation
**Criteria**
- A diversion can be created only by an authorized role and references a current facility-status record, trigger/reason, destination, effective time and approving actor.
- The destination must be marked open and permitted for the waste stream; otherwise the dispatch flow blocks or requests an explicit authorized override.
- Driver acknowledgement, route start/arrival, actual route distance, destination intake and any exception are linked to the diversion ID.
- Compensation is computed from a versioned, approved rate card and verified incremental distance/cost inputs; unverified rates or missing evidence create a review item, not an automatic payment.
- Duplicate commands, stale facility data, GPS gaps and driver non-acknowledgement are visible and have an escalation path; no unapproved penalty is generated.

**Field scenario:** Simulate a facility closure and a queue threshold crossing. Issue a diversion to an approved destination, then test an unavailable destination, duplicate command, GPS loss and disagreement between planned and observed distance. Confirm safe routing, auditable approval, correct rate-card version, and manual review of unsupported cost.

### S3. Dwelling-unit billing isolation and tenancy transitions
**Criteria**
- Each bill and payment references a stable dwelling-unit identifier and billing period; the interface can show unit-level balance separately from property-level records.
- A prior occupant's arrears are never automatically added to a successor occupant's account.
- Move-in/move-out, occupancy verification, corrections and disputed transitions are timestamped, attributable and auditable.
- A service request for a paying unit is not blocked solely because another unit or an unverified property-level balance is overdue.
- Any property-level recovery action remains disabled unless an approved legal/policy configuration is present and required notice/review steps are complete.

**Field scenario:** Create a multi-unit property with two current tenants and one departing tenant with unpaid sample invoices. Close the old tenancy, register a successor, pay the successor's current invoice, and attempt a collection/service block based on the old debt. Confirm separate ledgers, no debt transfer, active service for the paid unit, and a reviewable transition record.

### S4. Tamper-evident evidence and legal review workflow
**Criteria**
- Original image/document/sensor records are preserved with cryptographic digest, capture time, source/device identity, location provenance where available, uploader, case reference and custody events.
- Any edit, annotation, export, reprocessing or correction creates a new version linked to the original; the original remains retrievable and integrity-checkable.
- Evidence export includes a manifest of included records, hashes, timestamps and chain-of-custody history; a changed file fails verification.
- Certificate generation is a draft requiring authorized human review and sign-off; the platform does not label evidence admissible or submit a prosecution automatically.
- Role-based access, access logging, retention/deletion rules and privacy review are testable and enforced.

**Field scenario:** Capture a test dumping incident, transfer it between two authorized officers, add a correction note, export an evidence package, alter one exported image and attempt a certificate sign-off with an unauthorized role. Confirm original integrity, version history, altered-file detection, rejected sign-off and a complete access log.

### S5. Onshore / edge continuity and recovery
**Criteria**
- A documented service inventory identifies data classes, approved storage/processing locations, backup owner, recovery objective and dependencies; residency claims remain unasserted until verified.
- Loss of WAN or a designated cloud endpoint leaves only the explicitly approved edge workflows available; users see stale/offline status and data age.
- Local writes are encrypted, access-controlled, sequenced and queued; recovery sync detects conflicts and does not overwrite an already committed event silently.
- Backup restore is tested against stated recovery objectives; restored data includes audit history and integrity checks.
- Failover and recovery actions are logged, alert the responsible operator, and have a tested rollback/escalation path.

**Field scenario:** In a non-production environment, disable the primary network route, create a field event, restart the edge device, restore connectivity, and restore a backup into an isolated test environment. Confirm offline banner, durable queued event, conflict report, audit continuity, measured recovery times and no duplicate downstream payment.

### S6. Escrow liquidity and complaint cure safeguards
**Criteria**
- A settlement run uses only approved, versioned allocation rules and a reconciled available-cash balance; every amount traces to verified events and a rule version.
- If funds are insufficient, the system produces a shortfall statement and pauses affected disbursements unless an approved waterfall explicitly governs them; it never silently changes priority or invents a reserve.
- Complaint cases identify the service event, disputed invoice component, evidence, current case state, response deadline from approved policy, reviewer and appeal path.
- The system does not freeze an entire account or create a deduction solely because a report was filed; any hold is bounded by an approved contract/policy and shown to affected parties.
- Cure, verification, appeal and release decisions are separately logged; reopening a case does not erase earlier decisions.

**Field scenario:** Run a settlement with sufficient funds, then inject a bank settlement delay and a verified complaint for one service period. Compare normal and shortfall runs; attempt an unapproved allocation override and a full-account freeze. Confirm transparent pause/shortfall, only policy-authorized hold, no silent reordering, and auditable resolution after cure/appeal.

## Module-by-module acceptance and field-validation map

| Module | Acceptance criteria (observable) | Field-validation scenario | Safeguards |
|---|---|---|---|
| **MOD-01 Cadastre & Tenement Master** | Stable property/unit/ward IDs; deduplicated records; source/provenance and confidence visible; tenancy changes append history; arrears remain attributable to the billed unit and are not inherited by successor. | Import a small synthetic block register with duplicate unit, incomplete address, move-out and successor occupancy; reconcile against an authorized sample register and record corrections. | S3, S5 |
| **MOD-02 Fleet & Telemetry** | Vehicle/crew identity and authorization are checked; route, dispatch, hazard, diversion and arrival events correlate to trip; GPS gaps are explicit, not fabricated; low-connectivity events queue safely. | Run a test route with WAN and GPS interruptions, then a diversion; compare dispatch, driver device and destination logs. | S2, S5 |
| **MOD-03 Weighbridge & TLS** | Signed unique tickets capture gross/tare/net, calibration and operator; offline sync is idempotent; invalid/tampered/stale-calibration tickets quarantine; estimates remain clearly unverified. | Execute S1 field scenario on a calibrated test scale and a simulator; reconcile edge and server ledgers. | S1, S5 |
| **MOD-04 Landfill & Disposal** | Intake verifies facility status and permitted waste stream; arrival, acceptance/rejection, destination and disposal proof link to trip/ticket; closure or capacity exceptions cannot be bypassed silently. | Simulate gate closure, restricted waste stream, diversion arrival and rejected load; verify chain of custody and operational escalation. | S1, S2, S6 |
| **MOD-05 Escrow, Tariffs & Settlements** | Charges, holds, adjustments and payouts are reproducible from approved tariff/rule versions; shortfall pauses or follows explicitly approved waterfall; complaints do not trigger unbounded freeze; no duplicate payout on retry. | Run standard, duplicate-retry, insufficient-cash and disputed-invoice cases using synthetic ledger entries; reconcile totals independently. | S1, S2, S3, S6 |
| **MOD-06 Enforcement & Prosecution** | Case creation references verifiable source events; evidence package preserves original, digest and custody; role/authority checks precede enforcement; certificate is a reviewed draft and appeal/correction is recorded. | Create a test case from simulated illegal-dumping evidence, alter an export, attempt unauthorized sign-off and record a correction/appeal. | S4, S5 |
| **MOD-07 Ecotox & Leachate** | Environmental/leachate observations retain source, timestamp, location and calibration/provenance; threshold alerts link to facility and related load; uncertain or stale readings require review before operational or enforcement action. | Replay a synthetic monitoring trace with a threshold crossing, stale sensor and missing packets; verify alert provenance, escalation and human disposition. | S4, S5 |
| **MOD-08 Hazmat / Special Projects** | Manifest and custody identifiers follow the load from generator through transporter to approved destination; credible hazard flag stops normal processing, notifies approved responders and records disposition; no automatic unapproved penalty. | Use a labeled non-hazardous training load and simulated alert; test missing manifest, route mismatch, quarantine capacity unavailable and authorized release. | S2, S4, S5 |
| **MOD-09 Markets & Concessions** | Each concession has explicit scope, schedule, service evidence, approved tariff and responsible authority; market bulk charges reconcile to source units/contracts; route/toll permissions are time-bounded and auditable. | Simulate a market close-out collection with missed deadline, disputed service evidence and expired route authorization; verify configurable SLA and exception path. | S2, S6 |
| **MOD-10 Citizen Portal** | Reports have case ID, time/location, category, consent/privacy controls, evidence provenance and status; residents receive an understandable acknowledgement/update; complaint opens review and does not itself impose a penalty or total account freeze. | Submit duplicate and conflicting missed-pickup reports, then upload supporting evidence; test status updates, privacy access and appeal. | S3, S4, S6 |
| **MOD-11 Platform Core, Events & Sovereign Continuity** | Event envelope/version, stable IDs, provenance, idempotency, retries, dead-letter visibility and audit trail are enforced; offline recovery and backup restore preserve history; access and data-location controls are demonstrable, not merely claimed. | Run duplicate/out-of-order events, endpoint outage, restore and unauthorized access tests in a non-production environment; reconcile source and consumer ledgers. | S1, S2, S4, S5, S6 |

## Cross-module end-to-end acceptance tests

1. **Service-to-settlement:** MOD-01 unit → MOD-02 authorized trip → MOD-03 signed weight → MOD-04 accepted disposal → MOD-05 reproducible settlement. A missing or rejected upstream proof blocks only the affected item and surfaces a reason; retry never duplicates payment.
2. **Complaint-to-cure:** MOD-10 complaint → MOD-02 route/visit evidence → MOD-05 bounded, policy-governed dispute → resolution/appeal. The full decision trail is visible to authorized reviewers.
3. **Hazard-to-disposition:** MOD-08 manifest/alert → MOD-03/MOD-04 intake exception → MOD-07 environmental/leachate alert as relevant → MOD-06 reviewed case if authorized. A normal-load process cannot consume a quarantined load silently.
4. **Offline-to-reconciled:** MOD-03/MOD-11 edge ticket → delayed delivery → duplicate retry → integrity review → MOD-05 eligibility only after verified reconciliation.
5. **Diversion-to-compensation:** MOD-04 facility constraint → authorized MOD-02 dispatch → destination acceptance → MOD-05 rate-card calculation. Unsupported distance or destination evidence requires review.

## Field-validation record template

For each run capture: scenario ID; date/site; participating roles; whether data are synthetic; equipment and calibration status; starting conditions; steps; expected/observed result; event IDs; exceptions; safety/privacy controls; evidence links; defects; severity; owner; retest date; and sign-off. A failed test is not waived by narrative explanation: record a defect, mitigation and retest decision.

## Release gates

- **Prototype:** Synthetic data, visible assumptions, reversible actions, no real financial, legal or enforcement effect.
- **Controlled field pilot:** Written policy/contract approvals, trained users, safety and privacy review, tested offline recovery, reconciliation and rollback, named incident owner.
- **Production:** Independent security and financial controls, legal review, authorized data-sharing/residency confirmation, operational service levels, audited settlement rules and signed executive decisions.
