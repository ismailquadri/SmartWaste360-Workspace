# Module 06 detention rehearsal review

14 November 2026. Dummy records only; proposed thresholds require LAWMA legal acceptance, not a statement of applicable constitutional detention authority.

## Implemented

- Detention review tab linked to original arrest dockets. New dummy arrests get custody review; earlier patrols require explicit custody confirmation, without resetting their original timestamps.
- Sev-1 escalation at 18 hours, detention alarm at 20 hours, release or completed video arraignment requirement at 24 hours.
- Persisted threshold events include original due time and actual recorded time, with WAT display and optional official acknowledgement. Acknowledgement, booking, charge sheet and reload do not extend the clock.
- Release and video arraignment outcomes require a reference, responsible official, conditions/judicial directions and completion confirmation. No cash prerequisite. A scheduled hearing is not an outcome. Late outcomes retain missed thresholds.
- Resolving detention review does not close prosecution or release impounded property. This app cannot effect real release, bail, custody or a court hearing; no live notifications or external systems connected.

## Verification

- Chromium official sign-in: created two dummy arrests, observed hour-18 escalation, acknowledged and reloaded, observed hour-20 alarm, kept release form open across hour 24, and saved release.
- Second detainee remained unresolved at hour 24. Acknowledging that requirement did not clear it. Recorded completed dummy video arraignment and read back both outcomes after reload.
- Confirmed older rehearsal custody after the deadlines: all three events reconciled once with original arrest time; reload retained them without duplicate events.
- Desktop 1280×1800 and phone 390×844 screenshots inspected; no document overflow or browser page errors.
- Eight new rule tests cover concrete 18/20/24 thresholds, arrest-clock persistence, acknowledgement, required evidence, resolved history and invalid/unknown custody. Full suite: 239 tests across 27 files passed; preview build OK.

Records persist only in this browser. Clock accuracy, legal interpretation and real custody/court authority remain outside this rehearsal.