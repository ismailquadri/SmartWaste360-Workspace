# Module 04 — recovery, sharps and off-face access

## Safeguard 4, completed and browser-tested first

- Dedicated dummy recovery D8 register, separate from contractor billing. Two ready machines with ready operators required per landfill.
- Dispatch blocks unavailable machines and simultaneous truck/machine reuse. Recovery remains possible during face safety stops; it never reopens tipping.
- Completion permits exactly ₦0. A ₦15,000 charge was rejected in the browser; free completion persisted after reload.
- Cash-demand allegations retain evidence and require a different named practice official for review. No automatic deduction or penalty.
- Current-date/current-shift magnetic-bar checks AND manual glass/non-ferrous inspection required before landfill admission. A new failed inspection withdraws clearance; TLS-only sites do not acquire landfill-only requirements.
- Daily shift boundaries are illustrative: day before 18:00 WAT, night thereafter. New shifts need new clearance.

## Safeguard 5, completed and browser-tested second

- Off-face covered bays require daily independent shelter, separation, gas/fire/slope and dry-material safety inspection. A stopped face does not certify a bay safe.
- Only pre-sorted PET bottles, aluminium cans and cardboard deliveries; uncleared bays and duplicate references rejected.
- Dummy perimeter mist status/product references, faults and hospital/community follow-up logs, not automated dispensing.
- All new admission is off-face only. Existing legacy face gate records remain for audit; new registration no longer offers active-face access.
- Fingerprint enrolment, wristband issue/replacement/revocation and verification history. Fingerprint refresh required at 30 elapsed days for wristband entry.
- Both modes retain adult age ≥18, current unsuspended pass, PPE, 07:00–18:00 Lagos time, bay clearance, capacity and already-on-site gates.
- A failed admission still records its refusal; refused results are read from the saved gate history, not a temporary banner.
- Successful identity fingerprint checks may refresh verification even if environmental/PPE entry is refused; they never grant admission without the remaining checks.

## Browser evidence

Tested the actual `/workspace` iframe and direct dashboard: first-time management sign-in, closed Solous face with safe off-face admission, expiry/renewal, wrong fingerprint, under-18 refusal, missing PPE, duplicate admission, exit, wristband revocation, 30-day refresh, unsafe bay withdrawal, Lagos night refusal, dry-material and mist records. Reloads showed the saved verification, refusal, free recovery and evidence references. Desktop and 390px phone layouts checked. Browser clock advanced only for expiry and 30-day tests; no operational records were backdated by the application.

Automated rules cover two D8s, exactly zero cash, all four sweep checks, duplicate dispatch, exact 30-day boundary, independent daily bay safety, both identity modes, adult/PPE/hours/capacity and present-until-exit counting. Full suite: 215 tests passed.

## Limitations and remaining scope

All trucks, machines, bays, quantities, product references and wristbands are dummy data saved on this device. Default bay capacity (20), shift division and product protocols are illustrative, pending LAWMA review. Named officials are rehearsal identities, not authentication. No NFC encryption, biometric hardware, chemical treatment, gate interlock, towing, communications or bank connection is claimed.

The separately queued 70/30 morning quota and 13:00 surge-pooling safeguard is not part of this request and remains on the roadmap. Broader legal, scientific, staff and real-device acceptance remains pending.