# Tracker payment holds and Module 04 quota pooling

Dummy-only browser rehearsal, 14 November 2026. No live systems connected.

## Matching payment hold

- Literal batch-to-manifest references preserve earlier saved records. No broad PSP-only matching.
- Tracker signals have dated timestamps; midnight/reload cannot make old signals current.
- More than 15 minutes without depot clearance blocks matching unpaid Revenue release and provisional advances. Missing referenced trackers fail closed.
- Browser: cured CW-301, approved sample diesel price, drafted/confirmed weekly figures, inspected MAN-201 at depot, confirmed SB-2611-01 was ready. Simulated loss, observed hold on Module 03 and Revenue, confirmed release disappeared, reloaded, inspected depot, released positive dummy payment and read back Released after reload.
- Weight evidence, other payment checks and historical released splits are not altered by clearance.
- Fixed the practice control so an inspected truck can simulate another loss even when its prior signal is old.

## Quota pooling

- 70% LCDA / 30% TLS, with illustrative equal subdivision among six Alimosho LCDAs and deterministic integer remainders. Default daily ceiling 100; plans allow multiples of ten up to 100.
- Automatic release at 13:00 Africa/Lagos (12:00 UTC), on load, clock tick and submission. Claimed slots remain; unclaimed morning reservations expire; unused capacity enters shared surge pool. Release is idempotent and saved.
- Browser used 10-slot plan to verify 7/3 partition, owner overbooking rejection, cancellation, duplicate truck rejection, 12:59:59 boundary, exactly 13:00 release, claim form crossing cutoff without losing input and rejection on submission, nine pooled slots with one claimed, surge rebooking and reload persistence.
- Desktop and 390px phone screenshots inspected; no page overflow or browser errors.
- Daily plans, references, claims, cancellation and expired rows survive reload. No physical admission or extra receiving capacity is created by quota records; existing gate and safety checks remain separate.

## Validation

224 tests across 25 files passed. Latest preview check: build OK. Nine new rule tests cover exact requested thresholds, matching references, stale/missing trackers, cutoff, claims, capacity and cancellation.

Quotas, within-LCDA distribution and sample authority still require LAWMA acceptance before operational use. Records are stored in this browser only, not shared staff infrastructure.

## Module 04 completion review

- Re-ran the official sign-in and quota workflow in Chromium using dummy records at desktop 1280×1800 and phone 390×844.
- Fixed historical review: saved daily plans now open their original reservations read-only, including claim references, cancellations, expiry and release evidence. Archived reservations cannot be claimed, cancelled or booked into; today's plan remains separate.
- Fixed ambiguous time display: quota evidence explicitly shows Africa/Lagos timestamps with WAT, including the original 13:00 cutoff and the later reconciliation time when the browser was closed.
- Browser verified morning owner-limit rejection, cancellation, duplicate trucks, claimed preservation, exact 12:59:59/13:00 WAT cutoff, open-form late-claim rejection, surge rebooking, reload, next-day archived review and a new 100-slot plan displaying 70/30.
- A separate browser rehearsal left the dashboard before cutoff and returned the next morning: the unclaimed reservation expired, 100 slots pooled at the original 13:00 WAT timestamp, and another reload did not repeat release.
- Full suite: 231 tests across 26 files passed; preview build OK; no browser page errors or phone document overflow. Full surge-capacity rejection remains covered by the rule test; the supplied manifest register has no additional unused heavy truck after filling the 10-slot rehearsal plan, so no extra truck was invented for that browser check.
- No real operational systems connected. The six-LCDA equal subdivision remains illustrative and quotas are planning records, not physical gate permission.