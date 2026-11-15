# Module 06 safeguard 3 — dummy evidence vault

14 November 2026. No camera, bodycam, court service or live identity connected.

## Checks and retention

- Bodycam capture-to-scene distance must not exceed 50 m; overhead CCTV must not exceed 250 m and needs overhead confirmation, a numeric zoom factor and a dummy zoom telemetry reference. Distances use unrounded coordinates, not rounded map labels.
- Capture records include source, device reference, timezone-bearing timestamp, capture/scene coordinates and dummy text content. SHA-256 is computed over that text with browser cryptography, not an asserted camera signature.
- Explicit hash comparison retains matches and failures. Missing or failed integrity prevents certification and charge filing. Saved content is rehashed on reload before restored attestations qualify.
- Two different named practice officials attest the same revision, content and hash. A single signature or self-review does not qualify. These names are rehearsal identities, not live authenticated signatures.
- Revising any capture withdraws certification and both attestations; earlier captures, signatures, checks and revisions remain in saved history. Legacy sample certification is retained as history but not grandfathered into readiness.
- Existing incident-report and arrest-booking requirements remain in the charge-sheet gate. Historical charge records are not retroactively deleted.

## Browser verification

Signed in as management and tested:

1. Overhead CCTV at about 222 m with 3× logged zoom; over-250 m and missing zoom blocked attestation.
2. Claimed-hash mismatch held evidence; correct comparison cleared integrity.
3. First attestation saved; the same practice official's second attestation was refused.
4. Switched to another named practice official, completed attestation, filed the linked MC-203 charge sheet and read it back after reload.
5. Revised to bodycam at about 51 m: signatures withdrawn and sightline blocked; corrected to about 49 m, rehashed and dual-attested the new revision.
6. Saved a new dummy capture and reviewed its content after reload.
7. Changed only the synthetic content in the test browser's saved record: reload rehash detected mismatch and held previously attested evidence.
8. Desktop 1280×1800 and phone 390×844 inspected; no browser page errors or document overflow.

Five new rule tests cover concrete sightline limits, logged zoom, revision-bound hash checks and independent attestation. Updated the legacy test to reject grandfathered one-signature evidence. All 244 tests across 28 files passed; preview build OK.

Records remain on this device. This prototype checks dummy text integrity, not uploaded binary footage, actual optical calibration, secure hardware signatures or statutory admissibility; LAWMA legal and device acceptance remain required.