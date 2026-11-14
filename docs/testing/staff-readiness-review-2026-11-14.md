# LAWMA 360 staff-readiness review

## Fix verification update — 14 November 2026

The original audit below is retained as historical evidence. The five confirmed defects have now been repaired in the dummy-data app: independent tab saves are merged (same-record conflicts stop), stopped sites refuse admission/booking, invalid GPS cannot certify, force reports gate charges, and settlements derive payable tonnes from explicitly linked eligible tickets. A corrected reweigh keeps the original excluded and updates unreleased batch links.

Added and browser-verified bank-alert allocation, former-balance resolution, separate named-practice-official hot-swap/class approvals, manifest-hold correction, required/consumed burn capacity, advisory delivery acknowledgements and replacement inventory reviews. Structured market inspection history is retained. Auditor mutations are blocked and hidden. Weekly briefs are prepared locally, without calling an AI or operational service.

Phone tables now show labelled fields including net payment/status/actions instead of hiding them offscreen; navigation uses a grouped workspace menu. Keyboard section tabs and the Lagos date were corrected. All eleven module phone views had no page-width overflow or runtime errors in the final pass.

**179 automated tests passed.** Browser verification completed payment release through Treasury matching, replacement-ticket tonnage, safety refusal, court-report/evidence gates, burn reservation consumption, same-device two-tab preservation, added review workflows and reload persistence. Existing MOD-01/04/06/09/10/11 regressions passed; MOD-02/03 browser checks were replaced by the new separate-approval checks; MOD-07/08 regression was updated to book capacity before failed burn/reburn and passed.

**Still outside the dummy-data acceptance scope:** real authentication and independently authenticated signatures, shared multi-device records, operational integrations, legal/scientific approval of limits/fees, real surveyed geography and hosting certification. Physical-device/assistive-technology testing and LAWMA staff acceptance remain required. The new same-contaminant/24-hour well-confirmation practice rule is explicitly provisional, not agency-approved. This update is not a claim of operational readiness.

**Review date:** 14 November 2026  
**Verdict:** Do not present this as ready for operational use. It is a substantial dummy-data rehearsal app, but several safeguards fail even within the rehearsal. Fix the confirmed issues before broad staff testing; a small, explicitly supervised demonstration can proceed with these limitations disclosed.

No real services or operational data were connected. This review changed no app behavior.

## What was actually tested

- Fresh Chromium sessions, first-time Management sign-in, incorrect-code rejection, tour dismissal, all eleven module destinations and their section tabs.
- Desktop at 1280 × 1800; phone-sized browser at 390 × 844. All eleven module screens inspected at phone width, plus a phone payment submission, property details and a 390 × 500 short-screen check.
- Fresh re-runs of account payment/collection/court evidence, fleet assignment/hot-swap/slot/review, weigh-ticket review/class correction/calibration, picker refusal/survey correction, diesel approval/cure outcome, enforcement actions, water referrals, hazardous custody/burns, market reopening, drainage boundaries/expiry and infrastructure checks.
- Reload checks throughout the existing flow scripts, plus a two-tab overwrite reproduction.
- **162 automated tests passed across 17 test files.** No uncaught browser errors or failed HTTP responses occurred in the final eleven-module navigation pass. The latest available app check reported “build OK.” Passing these tests does not establish end-to-end safety.
- Read-only source review of policy gates, roles, saved state and workflow completion paths.

## Confirmed problems: fix before broad staff testing

### 1. Two tabs can silently erase each other’s saved work — all modules

**Browser reproduced.** Open two signed-in tabs. Record a rainfall alert in the first, then save hosting evidence in the second. The rainfall alert disappears from the shared saved snapshot. Each tab saves its own entire copy rather than reconciling changes.

The first tab can still show its stale copy, making the loss hard to notice. Single-tab reload persistence is not sufficient. Before even dummy-data staff testing, prevent stale saves or explicitly lock editing to one tab. Do not enter personal or operational information in this prototype.

Reference: `lawma/work/module-data.js:28–37`.

### 2. A stopped landfill still admits trucks — MOD-04 with MOD-03

**Browser reproduced.** Solous II shows “Stop work” and says tipping is suspended. TLS operations still allows FLT-0160 to be admitted at Solous II; the truck moves into the onsite list without a safety blocker.

The picker gate checks safety, but truck admission does not. Source review also found no landfill safety check in the fleet-slot booking path; that booking bypass was not separately reproduced.

References: `lawma/work/landfill-ops.js:46,58`, `lawma/work/hub.js:316`, `lawma/work/fleet-ops.js:63`.

### 3. Invalid coordinates can receive an evidence certificate — MOD-06

**Browser reproduced.** Enter nonnumeric latitude/longitude for EV-902. The evidence screen displays “NaN m from scene,” yet offers “Sign certificate.” A custodian and confirmation checkbox allow certification.

Reject nonnumeric and out-of-range coordinates before saving and before certification. Certificates must not treat an invalid distance as a successful location check.

References: `lawma/work/kai-rules.js:8–10`, `lawma/work/kai-ops.js:46–47`.

### 4. A charge sheet can proceed without the required force report — MOD-06

**Browser reproduced.** PT-502 has recorded force and “Incident report missing.” After certifying its evidence, MC-202 accepts a charge sheet and moves to Plea without that report.

This contradicts the patrol screen’s stated requirement. The charge gate checks evidence and offence but not the linked mandatory incident report.

References: `lawma/work/kai-rules.js:11–12`, `lawma/work/kai-ops.js:31,48`.

### 5. Held weights are not linked to the payable batch calculation — MOD-03 → MOD-05

**Browser observation plus confirmed source trace; no payment was released.** Held tickets and excluded tonnage are visible, but Settlement run continues to calculate from seeded batch tonnes: 412, 288, 356 and 520 t. Its calculation multiplies `b.tonnes` by the tariff and subtracts complaint deductions; it never derives eligible tonnes from weigh tickets.

The weekly brief excludes held weight, but that does not prove exclusion from money owed. This is an unconnected calculation path, not evidence that an actual overpayment occurred. Batch-to-ticket mapping and payable eligible tonnage must be explicit before settlement approval can be considered verified.

References: `lawma/work/scale-checks.js:47–51`, `lawma/work/hub.js:463–467`, `lawma/work/settle-ops.js:14`.

## Missing or incomplete paths: source-confirmed, not all browser-reproduced

| Module | What is incomplete | Consequence |
|---|---|---|
| 01 — Property & DUID | Bank alerts without a room DUID can be held for manual allocation, but there is no allocation action; isolated occupancy liability/refund records have no resolution action. | Officials can create financial exceptions but cannot finish their review. |
| 02 — Fleet | Hot-swap supervisor confirmation is a checkbox in the initiating form, not a separate official’s approval. Site-stop booking check is missing. | Useful practice, not independently approved dispatch. |
| 03 — Scale | Hard tamper tickets such as WT-3103 say “fix the cause” but have no corrected reweigh/void-and-reissue journey. | Held tickets can become permanent dead ends. |
| 04 — Landfill | Recorded stop status is not shared consistently with truck admission and slot booking. | Safety checks differ by entry point. |
| 05 — Settlement | Payable batches are not derived from eligible tickets; auditor permissions include payment-changing actions. | Financial integrity and authority matrix need review. |
| 06 — Enforcement | Invalid GPS and missing-report gates fail; auditor permissions include court/yard-changing actions. | Evidence and authority controls are incomplete. |
| 07 — Water | Advisories record alternative-water/notification declarations rather than delivery outcomes. The two-adverse-sample rule does not require the same contaminant or a minimum interval. | Response completion and sampling policy need approval. |
| 08 — Hazardous waste | Burn recording does not require or consume a capacity booking. Some custody two-officer checks compare exact text, allowing case/spacing variants. Collection/receipt/burn handlers lack explicit predecessor-stage guards. | Capacity and custody enforcement need strengthening; sequence bypass was source-reviewed, not exercised by hidden-command injection. |
| 09 — Markets | Reviewer names and signed-order references are typed declarations; repeat reinspection replaces the current structured inspection, although event text remains. | Approval authenticity and full inspection history are incomplete. |
| 10 — Drainage | NiMet alerts, surveyed channels, dispatch and council acknowledgements remain simulated. Section 102 and 48-hour wording await legal approval. | Suitable for rehearsal only; no new blocker found in the tested alert/geofence paths. |
| 11 — Infrastructure | Residency is declared, heartbeats manually simulated and provisions illustrative; no actual failover, independent residency verification or full asset-maintenance lifecycle. | A successful practice check is not hosting certification. |

Financial rates, fine schedules, sensor limits, legal deadlines, fees and sample geography require LAWMA approval. This review does not validate their legal or scientific correctness.

## Mobile and first-time-official experience

**What works:** all eleven pages fit the phone viewport without whole-page horizontal overflow; section tabs wrap; property details fit a full-screen panel; a room payment was successfully saved on a phone-sized screen. The incorrect access code produces an understandable error. No outside-personnel roles appear in the sign-in picker.

**What needs improvement:**

- **Important table columns are offscreen.** The settlement table is about 1,121 px wide inside a 360 px scrolling area. The first view does not show PSP net payment, status or actions. Property-room ledgers also require side scrolling. Scrolling is possible, so this is not missing data, but officials must hunt for decision-critical information.
- **The phone menu is one long horizontal strip.** Twenty-plus destinations sit beyond the screen; it lacks the desktop grouping. A first-time official must repeatedly swipe to discover the right page.
- **Keyboard tabs are incomplete.** Pressing ArrowRight after focusing “Flag review” leaves focus there instead of moving to the next section. The tabs have tab roles but no standard arrow-key behavior or linked tab panels.
- **The overview date is misleading:** the visible header says “04 October 2026 · Lagos” while new activity uses 14 November. A fixed sample date should be clearly distinguished from the current working date.
- The short-screen payment form remains scrollable, but its submit button initially sits below the visible area. Native phone keyboard behavior still needs real-device testing.

The earlier transient loading-panel screenshot was not treated as a defect: the stable screen was recaptured after transitions completed.

## Working journeys observed

| Module | Browser result |
|---|---|
| 01 | Room-isolated payment, commission, collection plan, QR bag, collection receipt, court-record sequence and evidence download control passed; collection survived reload. Phone payment also passed. |
| 02 | Assignment, hot-swap, slot and supervisor review saved; approved review read back after reload. |
| 03 | Ticket review, same-official correction rejection, valid class correction and calibration save/reload passed. |
| 04 | Refused picker result stayed visible; corrected Solous survey showed 724 m³/day and retained the volume mismatch warning. |
| 05 | Diesel approval and cure outcome worked; unreleased batches displayed confirmation/cure/TIN blockers. Full release→Treasury match was not completed. |
| 06 | Sector change, patrol, incident report with self-supervision rejection, valid certificate and charge passed; adversarial checks exposed the two defects above. |
| 07 | Practice readings, lab entry, referral to Enforcement and named payment hold, closure and hold removal passed. |
| 08 | Clinical receipt, failed burn retained, reburn, custody, broken seal/reseal, downtime blocker and capacity reservation passed. Capacity-to-burn linkage remains missing. |
| 09 | Notice service, early-action rejection, accord, reviewed order, cordon, reopening and history/reload passed. |
| 10 | System 4/5/6 interior/shared-edge/outside points, duplicate alert rejection, moderate-alert exclusion, expiry and preserved-form rejection passed. |
| 11 | Primary/replica/backup gaps, outages, lag, restored readings, automatic stale state, open-form preservation and saved review history passed. |

## Deliberate dummy-data limitations — not newly broken integrations

There are no real identity lookups, bank/SMS connections, live sensors, court systems, NiMet feed, verified datacentre heartbeats or Treasury transfers. Keeping them disconnected is correct at this stage.

Sign-in is an openly displayed shared practice code with self-selected roles, not individual staff authentication. Approvals and audit actors often identify a role or typed name, not a verified person. Records live on one browser/device; staff do not share a durable central register. These must be disclosed before sharing, not described as secure operational capabilities.

## Coverage boundaries

This was desktop Chromium with phone emulation, not Safari/iPhone/Android hardware, a native keyboard, screen-reader certification, a load test or a security penetration test. Management was the primary first-time persona; the full eight-role permission matrix was source-reviewed but not exhaustively browser-tested. Not every action in every tab was submitted. Full payment release and Treasury reconciliation, all refund/exception recovery paths, and a complete LGA case/deployment acceptance matrix remain unverified.

Only the local `/workspace` app was exercised; a published deployment was not verified. The public website was not fully audited here.

## Recommended order before sharing

1. Fix the five confirmed failures and add regression coverage for each.
2. Finish exception-resolution and burn-capacity paths; approve the staff permission matrix.
3. Put decision-critical phone data and actions in view; correct the date and keyboard navigation.
4. Run a supervised staff acceptance exercise with dummy data, named module owners and explicit limitations.
5. Consider real connections only after module completion, policy approval and acceptance testing, as already required.