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
- **[The 11 Standalone Modular PLDs](docs/modules/)**: Dedicated courtroom-grade specifications for every system component:
  1. [`MOD-01-CADASTRE`](docs/modules/01-MOD-CADASTRE.md): Sovereign LAGIS cadastre (`LASG-CAD-ID`), LASRRA identity linking, and multi-tenant sub-unit bill splitting.
  2. [`MOD-02-FLEET-LOGISTICS`](docs/modules/02-MOD-FLEET-LOGISTICS.md): 5:00 AM depot pre-dispatch locking, fixed geofenced arterial corridors, and LASU-Iba holding hub.
  3. [`MOD-03-TLS-SCALE`](docs/modules/03-MOD-TLS-SCALE.md): Zero-downtime weighbridge automation, SQLite edge broker, and 72-hr solar-inverter backup.
  4. [`MOD-04-LANDFILL-GOV`](docs/modules/04-MOD-LANDFILL-GOV.md): Solous II 100 compactor/day hard cap, 45-min turnaround SLA, and secondary residue (`MAT-RES-*`) tipping governance.
  5. [`MOD-05-FINTECH-ESCROW`](docs/modules/05-MOD-FINTECH-ESCROW.md): Lagos Co-Treasury Escrow, 48-hour operational cure window, LIRS 5% WHT automated receipts, and Oracle EBS GL sync.
  6. [`MOD-06-ENFORCEMENT-KAI`](docs/modules/06-MOD-ENFORCEMENT-KAI.md): KAI Oshodi armed rapid interception rail (sub-15 min SLA), Section 84 Evidence Act crypto vault, and digital impoundment.
  7. [`MOD-07-ECOTOX-LEACHATE`](docs/modules/07-MOD-ECOTOX-LEACHATE.md): Down-gradient borehole telemetry (BOD/COD/metals), methane LEL sensors, and daily 15cm laterite capping (`MAT-CAP-*`) drone audits.
  8. [`MOD-08-HAZMAT-SPL`](docs/modules/08-MOD-HAZMAT-SPL.md): Joint LASEPA-LAWMA Digital Lab Token handshake (`LASEPA-LAB-TOKEN-*`), 4-hour medical biohazard evacuation fleet, HEFAMAA surcharge.
  9. [`MOD-09-MARKET-SEALING`](docs/modules/09-MOD-MARKET-SEALING.md): Executive commercial market sealing engine, dedicated skip telemetry (`MKT-SKIP-*`), and Ministerial Cryptographic Key override.
  10. [`MOD-10-CITIZEN-CARE`](docs/modules/10-MOD-CITIZEN-CARE.md): NiMet pre-storm surge protocol (48-hr skip drop), primary canal optical trash traps, Section 102 EMPL 5% LGA allocation ledger.
  11. [`MOD-11-SOVEREIGN-CLOUD-INFRA`](docs/modules/11-MOD-SOVEREIGN-CLOUD-INFRA.md): Onshore sovereign cloud (Alausa Central DC + MDXi Lekki), NDPA 2023 compliance, 2.5% hardware TCO sinking fund, 24-hr hot swap.
- **[Executive Audit & Governance Mandates](docs/executive-audit-and-mandates.md)**: 14 non-negotiable statutory mandates from Gov. Hamzat, Comm. Wahab, Hon. Shabi, and MD Gbadegesin.
- **[Stakeholder Critiques & Defense Playbook](docs/stakeholder-critiques-and-defense.md)**: Unified Q&A pairing every critical objection with its verified technical mitigation and statutory defense.
- **[UX & Field Research](docs/research.md)**: Authority control room audit, mass-balance clearinghouse reconciliation, and public dispute triage.
- **[Political Economy of the Streets](docs/political-economy-of-the-streets.md)**: Inter-agency dynamics, Wole-Wole inspectors, Solous II laterite capping, and LIRS tax data alignment.
- **[API & Message Contract](docs/api-contracts.md)**: Exact JSON payload schemas and event definitions.
