# LAWMA SmartWaste360 Management Workspace & Public Portal

Public LAWMA website and regulatory management workspace, built with React, TanStack Start, Vite and Nitro. Production: https://lawma-360-v2.vercel.app.

## Development and Validation

Use Node.js 24 and npm.

```sh
npm ci
python3 lawma/build_dashboard.py
npm run dev
npm run build
npm test
```

The standalone dashboard sources are in `lawma/work/`; commit regenerated `public/dashboard.html`. The workspace lives at `/workspace`.

## Deployment

The `main` branch deploys to the existing Vercel project `lawma-360-v2`. Nitro generates `.vercel/output`; the build uses `NITRO_PRESET=vercel npm run build`.

## Data and Translations

This management export uses browser-local prototype data and has no configured remote database, database credentials, or database migration scripts. Publishing this app does not migrate any external database. A live-data migration requires access to the source database/export and a destination database plus its connection settings.

The checked-in translation dictionaries work without credentials. To regenerate them, install Python `requests`, run `python3 scripts/i18n/extract.py`, then set `TRANSLATION_API_URL` (an OpenAI-compatible chat completions endpoint), `TRANSLATION_API_KEY`, and `TRANSLATION_MODEL` before running `python3 scripts/i18n/translate.py`. These are optional development variables, never browser variables.

---

## 🏛️ Comprehensive Engineering & Product Documentation

Complete technical specifications, field research, street political economy, and the **11 Standalone Modular Product Level Documents (PLDs)** are located in [`docs/`](docs/):

- **[Master Product Requirements Document (PRD)](docs/PRD.md)**: Overarching regulatory command architecture, 6-stage mass-balance clearinghouse, multi-year transformation roadmap, and enterprise RBAC matrix.
- **[The 11 Standalone Modular PLDs](docs/modules/)**: Dedicated courtroom-grade v4.0 specifications for every system component (exceeding 500+ lines each, 6,520+ lines total):
  1. [`MOD-01-CADASTRE`](docs/modules/01-MOD-CADASTRE.md): Sovereign LAGIS cadastre (`LASG-CAD-ID`), SIM-NIN OTP verification, compound virtual wallets, and LUC title liens.
  2. [`MOD-02-FLEET-LOGISTICS`](docs/modules/02-MOD-FLEET-LOGISTICS.md): Universal retrofit telematics (~₦445k/truck), dual-shift routing, 5:00 AM depot lock, tailgate solenoids, leachate valve sensors, and Alimosho beachhead.
  3. [`MOD-03-TLS-SCALE`](docs/modules/03-MOD-TLS-SCALE.md): Zero-downtime $35 RS-232 edge bridge, corner-balance RF tamper detection, quad optical tripwires, dynamic dual-weigh tare, mud compensation ($C_{\text{mud}}$), and 87.2-hr solar microgrid.
  4. [`MOD-04-LANDFILL-GOV`](docs/modules/04-MOD-LANDFILL-GOV.md): Solous II 70/30 council quota, dynamic ₦35k Epe fuel voucher (`FIN-VOUCH-EPE`), context-aware turnaround SLA pause, 100% free D8 towing, and CANbus hydraulic compaction hours (>160 bar).
  5. [`MOD-05-FINTECH-ESCROW`](docs/modules/05-MOD-FINTECH-ESCROW.md): Sovereign Co-Treasury Escrow, real-time Oracle EBS GL double-entry sync, 70/30 working capital liquidity shield, 48-hr cure window, automated 5% LIRS WHT, and 5% Sec 102 LGA dividend.
  6. [`MOD-06-ENFORCEMENT-KAI`](docs/modules/06-MOD-ENFORCEMENT-KAI.md): 12 tactical sectors with sub-10 min motorcycle interceptors, J-TIP armed RRS gun-truck escorts, Section 84 WORM evidence vault, tri-factor provenance engine, and RFID tamper clamps.
  7. [`MOD-07-ECOTOX-LEACHATE`](docs/modules/07-MOD-ECOTOX-LEACHATE.md): Dual-nested piezometers (shallow 10m plume + deep 45m aquifer), hydrostatic level anti-tamper dilution detection ($\Delta h > 0.4\text{m}$), UV254 spectral proxies, and laterite mass-balance.
  8. [`MOD-08-HAZMAT-SPL`](docs/modules/08-MOD-HAZMAT-SPL.md): EMPL Part III (LASEPA) vs Part IV (LAWMA) statutory boundary, Ed25519 `LASEPA-LAB-TOKEN-*`, 4-hour biohazard evacuation SLA, needle-stick PEP protocol, and geofenced valve locks.
  9. [`MOD-09-MARKET-SEALING`](docs/modules/09-MOD-MARKET-SEALING.md): Non-compensatory 3-zone spatial gating ($\min(S_A, S_B, S_C)$), sub-stall virtual wallets (`MKT-STALL-*`), 12-hour controlled perishable de-stocking, and tri-factor multi-sig reopening.
  10. [`MOD-10-CITIZEN-CARE`](docs/modules/10-MOD-CITIZEN-CARE.md): NiMet radar pre-storm surge protocol (250 emergency skips), optical/radar canal trash traps, Section 102 EMPL 5% LGA automated clearing, anonymous whistle vault, and dual-key verification.
  11. [`MOD-11-SOVEREIGN-CLOUD-INFRA`](docs/modules/11-MOD-SOVEREIGN-CLOUD-INFRA.md): Onshore Active-Active Tier III fabric (Alausa + MDXi Lekki, RPO=0, RTO<15s), 2.5% hardware TCO sinking fund escrow, 15-minute depot hot swap, and TPM hardware component fusing.
- **[Executive Audit & Governance Mandates](docs/executive-audit-and-mandates.md)**: 15 non-negotiable statutory mandates (including MANDATE-KOH-05 for Retrofit-First Telematics & Alimosho Beachhead) from Gov. Hamzat, Comm. Wahab, Hon. Shabi, and MD Gbadegesin.
- **[Stakeholder Critiques & Defense Playbook](docs/stakeholder-critiques-and-defense.md)**: Unified Q&A pairing every critical objection with its verified technical mitigation and statutory defense.
- **[UX & Field Research](docs/research.md)**: Authority control room audit, mass-balance clearinghouse reconciliation, and public dispute triage.
- **[Political Economy of the Streets](docs/political-economy-of-the-streets.md)**: Inter-agency dynamics, Wole-Wole inspectors, Solous II laterite capping, and LIRS tax data alignment.
- **[API & Message Contract](docs/api-contracts.md)**: Exact JSON payload schemas and event definitions.
