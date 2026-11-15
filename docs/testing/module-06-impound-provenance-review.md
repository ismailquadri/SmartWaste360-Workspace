# Module 06 safeguard 5 — dummy impound and provenance review

## Implemented
- Module 02 **Breakdown orders** records licensed-compactor `MNT-TOW-` references, original breakdown times and workshop completion evidence. Only an exact truck match active at yard admission qualifies for the 72-hour grace. It replaces, rather than stacks with, the normal 24 hours. Closing maintenance later does not erase earned eligibility.
- **Impound yard** retains clamp fitting/replacement, engine/battery identifiers, revision-bound scans, tamper findings, independent clearance and witnessed release. A new clamp cannot erase a tamper hold. Component mismatch is saved as a refusal/hold rather than silently discarded.
- **Fine receipts** retains exact case/yard liabilities and independently checked dummy TSA references. Cash, unverified, wrong-amount, self-checked and void receipts do not qualify. Court closure alone cannot authorise vehicle release. All checks run again when release is submitted, including fee ageing.
- **Cash-demand reviews** retains allegations and independent review evidence. An unresolved report holds only its named vehicle; no cash is required to resolve it.
- **Planted-mail review** retains document origin, independent scene linkage and collection/billing evidence references. The selected cadastre property, room billing figures and any saved collection plan are snapshotted. An existing collection-plan operator must match. Old letterhead alone never establishes attribution; a missed collection triggers contractor enquiry without presuming contractor guilt. Revisions preserve prior factors in history and withdraw independent review. Unreviewed or uncorroborated reviews stop linked case progression, including forms already open.

## Browser verification
Fresh management entry using the practice sign-in; desktop 1280×1800 and phone 390×844. No page errors or phone overflow.

1. Invalid maintenance prefix refused; valid licensed `MNT-TOW` saved in dispatch and automatically displayed as a waiver for the matching newly admitted truck.
2. Wrong engine scan saved as a tamper hold. Release refused. Reporter could not clear their own hold; different named reviewer cleared it, followed by a fresh matched scan.
3. Cash allegation saved; self-review refused; release remained held. Independent review recorded safe release arrangements. Wrong gate RFID refused; correct witnessed zero-fee release saved.
4. Letterhead-only provenance stayed unestablished and blocked the matching court plea. Independent review could not turn absent corroboration into attribution. Revision with missed collection displayed contractor enquiry; a later corroborated revision required a new independent reviewer before positive plea and fine sentencing.
5. A second vehicle was booked through the actual yard form against the sentenced case; the court fine was recorded closed through the actual court form. Only its admission time was aged in the test browser's dummy storage to exercise demurrage. No court-clearance or case-link bypass was used.
6. Legacy court close-reference failed to unlock release. Cash receipt check refused; self-check refused. Exact court fine and demurrage receipts checked by another official allowed witnessed release.
7. Reload retained both releases, maintenance eligibility, receipts, complaint review and revised provenance. Phone layouts of all four tabs checked.

Rule suite: **257 tests passing**, including exact 72-hour/72-hour-plus-one-second boundaries, vehicle/licence/type/order eligibility, receipts, component integrity and named-case provenance holds.

## Limits
All records, officials and receipts remain dummy and device-local. There is no live Treasury verification, physical RFID scan/barrier control, licence lookup, forensic source validation or legal authority. Timetable and Module 05 payment references are manually reviewed dummy evidence, not automatic matching to external accounts. A provenance review is not proof of guilt. LAWMA legal and operational reviewers must approve these proposed controls before real use.