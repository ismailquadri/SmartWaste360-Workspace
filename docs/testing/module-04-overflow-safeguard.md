# MOD-04 — first stakeholder safeguard

Implemented individually, keeping the other four safeguards queued.

## Dummy workflow

- Dumpsite capacity → Overflow diversions: daily register starts at an explicitly illustrative 100 arrivals and 165 forecast loads, showing 65 overflow loads. Officers can review the daily snapshot and receiving capacities with evidence references.
- Gate admission, manual visit creation and simulated collected-order arrival consult the daily Solous ceiling and safety state. Departures do not restore consumed daily quota. Fleet slot booking also checks the remaining daily ceiling.
- Existing compactor manifests can reserve Oshodi TLS or Epe capacity. This is not an automatic creation of 65 new truck identities.
- Only officer-recorded collected fees on clear, confirmed commercial weigh tickets fund the separate voucher ledger. Duplicate receipts and ticket reuse are rejected. Held and domestic tickets are excluded.
- Epe reserves ₦35,000; Oshodi requires no Epe voucher. Insufficient funds, repeated manifests and exhausted receiving slots prevent reservations. A different named management practice official approves before departure. Cancellation releases capacity/funds without deleting history; completion keeps expenditure charged.
- The manifest receives an SLA_DIVERT_PAUSE flag while its Epe diversion is active. PSP collections shows the same record. Completion requires arrival and deferred-route coverage evidence. This flag does not calculate a legal penalty exemption or alter the settlement cure engine.

## Verified

Browser: fresh Management practice sign-in, insufficient funds rejection, commercial receipt, duplicate receipt rejection, funded Epe reservation, duplicate manifest rejection, self-approval rejection, second-official approval, departure, PSP collections pause display, reload persistence, completion, further unfunded reservation rejection, Oshodi reservation/cancellation and phone width check. No browser errors; no phone page overflow. Automated suite: 201 passing tests.

## Boundaries

No real escrow, fuel redemption, cryptographic corridor permit, traffic clearance, truck telemetry or operational identity is connected. Proposed amounts/capacities need LAWMA approval. Daily opening counts are officer-entered dummy snapshots, not a live site counter. Receiving capacities are illustrative. Epe night haul is a planning label, not a timing enforcement or LASTMA approval. Midday quota pooling, standby plant billing, recovery/sweep records and picker-welfare safeguards are deliberately reserved for the next individual steps. Operational end-to-end acceptance remains pending.