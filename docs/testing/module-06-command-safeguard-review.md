# Module 06 — first command safeguard

Dummy rehearsal only; proposed rules require LAWMA/KAI/legal review. No police, radio, CCTV, biometric or court endpoint is connected.

## Implemented

- Sector threat review: GREEN, AMBER and RED_GANG_CONTROLLED; readiness review records and duty controls.
- At least two ready Tier-1 motorbikes before a response or patrol can be recorded. Red threat additionally requires an armed RRS escort count and dummy confirmation reference. No automated armed deployment occurs.
- Sweeper SOS, CCTV and radio dummy trigger records; ten-minute arrival target with retained late arrivals and immutable dispatch readiness snapshots.
- An Arrested patrol outcome creates a linked practice case and arrest booking docket. The 60-minute Oshodi countdown uses the original arrest timestamp; existing arrested patrols are imported without inventing biometric bookings.
- Booking records retain dummy capture reference, registrar, recording official, timestamp and lateness after reload. No fingerprint or identity is actually verified.
- Linked unbooked arrests cannot file new charge sheets; valid certified evidence and force reports remain required. Earlier court history is preserved, not retroactively undone.

## Verified in browser

Management entry, welcome dismissal, sector readiness save, one-bike refusal, missing red escort refusal, valid red response, response overdue after eleven minutes, late arrival, arrest-to-case/docket creation, one-minute remaining at minute 59, overdue at minute 60, late booking, local storage read-back and reload. Desktop 1280 × 1800 and phone 390 × 844; no page errors or phone page overflow. Screenshot inspection confirmed booked/overdue rows and phone tab wrapping.

Fixed a shared declaration name collision found by the first browser run. Countdown verification uses a controlled browser clock; it does not alter app rules or saved arrest timestamps.

Automated suite: 26 files, 230 tests passing, including six new rule tests.

## Not in this increment

Detention/arraignment alarms, optical evidence safeguards, judicial destruction/diversion, impound/provenance and commercial abatement remain subsequent increments. No real detention decisions, bail release, police dispatch, biometric device checks or court filing are performed.