# LAWMA 360 AUTHORITY WORKSPACE: EXHAUSTIVE SCREEN-BY-SCREEN, MODAL-BY-MODAL, DRAWER-BY-DRAWER & BLINDSPOT-FORTIFIED ENGINEERING SPECIFICATION
## Comprehensive Implementation & Verification Blueprint (Piece 1 of 4: The Authority Workspace)

**Document Identifier:** LAWMA-DEV-SPEC-WORKSPACE-PIECE-1-v5.0 (Blindspot-Fortified & Non-Linear Circular Edition)  
**Target Platform:** LAWMA 360 Authority Operations Workspace (`SmartWaste360-Workspace`)  
**Deployment Target:** [`https://lawma-360-v2.vercel.app/workspace`](https://lawma-360-v2.vercel.app/workspace)  
**Build Pipeline:** `python3 lawma/build_dashboard.py` $\to$ `public/dashboard.html`  
**Verification Suite:** `npx vitest run` (37 test files · 329 passing unit & integration assertions)  
**Target Decision-Makers & Regulators:** Dr. Kadri Obafemi Hamzat (Deputy Governor), Hon. Tokunbo Wahab (Commissioner MEWR), Dr. Muyiwa Gbadegesin (MD LAWMA)  
**Core Frameworks:** Lagos State EMPL 2017 (Sec 71, 88, 102), Evidence Act 2011 (Sec 84(2) & 84(4)), Fourth Schedule Constitution 1999, NDPA 2023, Oracle EBS Financials  

---

## Executive Summary & Engineering Mandate

This document is the **uncompromising, screen-by-screen, modal-by-modal, drawer-by-drawer, and blindspot-hardened engineering specification** for Piece 1 of the LAWMA 360 ecosystem: **The Authority Workspace**.

Every screen, modal, and rule engine is anchored in the **five non-negotiable operational realities** of Lagos State:
1. **The Non-Linear Circular Supply Chain (<= 4% Landfill Target):** Tracking daily mass-balance diversion across Jospong Material Recovery Facilities (MRFs), the €120M Harvest Waste thermal Waste-to-Energy (WTE) plant at Epe (2,500–3,000 t/day), and Ikosi/Ketu organic biodigesters, while strictly capping residual landfill intake at 100 compactor trucks/day at Solous.
2. **Transfer Loading Station (TLS) Multi-Modal Bulk Logistics:** Enforcing that small neighborhood compactor trucks never haul $>25\text{ km}$ directly to Epe; local compactors discharge at Simpson or Oshodi TLS, where waste is consolidated into **40-ton enclosed RoRo trailers and 1,000-ton lagoon barges** bound for Epe.
3. **Brazilian Tenement Spatial Sub-Units & Density Verification:** Managing 8-to-24-room *face-me-I-face-you* compounds with room-level DUIDs, dedicated wholesale NUBAN virtual accounts, Tenancy Clean-Slate Resets, and LiDAR roof-footprint anti-underdeclaration checks.
4. **Courtroom-Grade Section 84(2) & 84(4) Evidence Vault:** Bundling SHA-256 binary digests with pre-shift hardware diagnostic logs, Stratum-1 NTP clock drift attestations ($\le 5,000\text{ ms}$), and Director of Legal Services digital signatures.
5. **The Co-Treasury Escrow Clearinghouse & Fuel Fallback:** Automated 75/15/5/5 split (Bucket A 70% Friday payout / Bucket B 30% quality hold, 15% LAWMA, 5% Conference 57 LGAs split by street-centerline PostGIS geometry, 5% Host Community/LIRS WHT), backed by an automated 45-minute NIBSS NIP timeout fallback that issues 72-hour digital fleet fuel barcodes.

---

```
                                  AUTHORITY WORKSPACE NAVIGATION HIERARCHY
┌─────────────────────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│ GROUP 1: ORGANISATION           │ GROUP 2: OPERATIONS             │ GROUP 3: SERVICE & ASSURANCE    │
├─────────────────────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ 1. Overview (Statewide Command) │ 5. Fleet Map (GPS Corridors)    │ 13. Public Reports (Citizen Box)│
│ 2. Cadastre & DUID (Tenements)  │ 6. PSP Collections (Manifests)  │ 14. Drainage & Pre-Storm Surge  │
│ 3. PSP Operators (AWAMN Concess)│ 7. Service Records (Proof Logs) │ 15. Incidents & Detours         │
│ 4. Registry (People & Vehicles) │ 8. Field Shift (Crew Roster)    │ 16. Compliance & SLA Audits     │
│                                 │ 9. Dumpsites & TLS Hubs         │ 17. Finance & Escrow (Waterfall)│
│                                 │ 10. Dumpsite Capacity & Scales  │ 18. Demand Bills & Tariffs      │
│                                 │ 11. Cameras & Sensors (Telemetry│ 19. Commercial & Market Sealing │
│                                 │ 12. Partner Work Orders         │ 20. Citizen Care & Dual-Key Cure│
│                                 │                                 │ 21. Connected Services (APIs)   │
│                                 │                                 │ 22. Enforcement & KAI Taskforce │
│                                 │                                 │ 23. Resource Recovery & MRFs    │
│                                 │                                 │ 24. Water & Leachate Monitoring │
│                                 │                                 │ 25. Hazwaste & Epe Incinerator  │
│                                 │                                 │ 26. Systems & Sovereign Cloud   │
└─────────────────────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

---

# SECTION A: GROUP 1 — ORGANISATION

---

## 1. Screen: `Overview` (`tab === 'overview'`)
* **Source Files:** [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/overview-lgas.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/overview-lgas.test.ts), [`src/test/circular-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/circular-guard-rules.test.ts)
* **Primary Role:** Statewide Executive Command Wall for Commissioner MEWR, Deputy Governor, and LAWMA MD.
* **Live Panels & KPIs:**
  1. **20 LGAs & 37 LCDAs Statewide Grid:** Interactive council cards showing coverage, active vehicles, and open alarms.
  2. **Non-Linear Circular Mass-Balance & Diversion Panel (`cgOverviewPanel`):**
     * Tracks `Total Daily Mass (t)`, `Circular Diversion %`, `Landfill Residual %` (evaluated against `CG_LANDFILL_RESIDUAL_TARGET_PCT = 4%` via `cgNonLinearMassBalance`), and `Epe WTE Feedstock (t)` (target 2,500–3,000 t/day).
     * Stream Breakdown Table:
       * `Dry recyclables (PET / Aluminium / Paper)` $\to$ Jospong MRFs & Oshodi / Simpson Balers.
       * `High-calorific dry feedstock (>7.5 MJ/kg)` $\to$ Epe Waste-to-Energy Plant (via 40T TLS & Barge).
       * `Organic wet biomass (Markets & Food)` $\to$ Ikosi / Ketu Anaerobic Biodigesters & Compost.
       * `Inert landfill residual` $\to$ Solous II/III (100-truck cap) & Olushosun phase-down.
* **Modals & Drawers:**
  * **Modal `cg-streams` (`Update daily non-linear stream mass-balance`):**
    * Inputs: `mrfTonnes`, `epeWteTonnes`, `biodigesterTonnes`, `landfillResidualTonnes`.
    * Validation: Non-negative numeric bounds, recalculates circular diversion % and `<=4%` target badge in real time.
  * **Side Drawer `drawer-overview-lga`:** Displays council-specific DUID count, assigned AWAMN operators, and Section 102 5% revenue share.

---

## 2. Screen: `Cadastre & DUID` (`tab === 'cadastre'`)
* **Source Files:** [`lawma/work/cadastre.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/cadastre.js), [`lawma/work/cadastre-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/cadastre-rules.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/cadastre-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/cadastre-rules.test.ts), [`src/test/cadastre-gateways.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/cadastre-gateways.test.ts)
* **Primary Role:** Spatial Property Register, LAGIS 25m Polygon Snapping, Brazilian Tenement Room-Level Sub-Units, and Anti-Underdeclaration Auditing.
* **Live Panels & Safeguards:**
  1. **Property Register & Sub-Unit Room Ledger:**
     * Tracks `DUID`, `Category` (`MULTI_TENANT_TENEMENT`, `Commercial plaza`, `Market`, `Factory`), `LASRRA Tier` (Tier 1 phone = 30d grace, Tier 2 LASRRA = 45d grace), `LAGIS Match State` (`Matched`, `Awaiting match` within 25m edge tolerance, `Unmatched informal`), `Room Units`, `Owner Ring-Fenced Debt Ledger`.
  2. **Blindspot 3 & 6 Panel (`cgCadastrePanel` — LiDAR Tenement Density & Border-Street LCDA Attribution):**
     * Cross-references LAGIS roof footprint area ($m^2$) and building storeys against caretaker-declared room counts via `cgDensityUnderdeclared` ($\text{Expected Min Rooms} = \lfloor (\text{Footprint} \times \text{Storeys}) / 28\text{ m}^2 \rfloor$).
     * Automatically places a **Decal Hold & Wole-Wole Enumeration Audit Flag** on properties declaring $<50\%$ of expected room capacity.
     * Computes deterministic border-street LCDA attribution (e.g. Ikotun-Egbe Road between Egbe-Idimu LCDA and Ikotun-Igando LCDA) using PostGIS street-centerline cross-product geometry (`cgStreetSideAttribution`).
* **Modals & Drawers:**
  * **Modal `Register property`:** Captures address, LGA, category, room count, GPS coordinates, and LAGIS parcel vertices.
  * **Modal `Record room payment`:** Applies whole-Naira payment to an individual room DUID (`roomPayment`), clearing room arrears first and crediting excess to room wallet without penalizing compliant neighbors.
  * **Modal `Resolve former occupant balance` (Tenancy Clean-Slate Reset):** Decouples runaway tenant arrears from the room sub-unit and transfers liability to the landlord's ring-fenced owner debt ledger (`ownerDebtLedger`).
  * **Modal `cg-density-check` (`Run LiDAR roof-footprint vs declared room density check`):** Audits footprint $m^2$, storeys, and declared rooms; flags under-declared tenements.
  * **Modal `cg-border-split` (`Attribute border-street Section 102 LCDA by PostGIS centerline`):** Resolves cross-boundary LCDA revenue attribution from exact curb coordinates.

---

## 3. Screen: `PSP Operators` (`tab === 'partners'`)
* **Source Files:** [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js), [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js)
* **Primary Role:** AWAMN Private Concessionaire Registry, Franchise Zone Protection, Fleet Readiness & Bankable Revenue Statements.
* **Modals & Drawers:**
  * **Modal `Add partner` / `Edit partner`:** Captures concessionaire name, zone, active compactor count, contact person, and tax ID.
  * **Modal `Start a partner compliance review`:** Initiates 3-strike SLA review for missed residential pickups or telemetry tampering.
  * **Side Drawer `Partner Detail`:** Displays assigned ward polygons, active work orders, and historical settlement batches.

---

## 4. Screen: `People & Vehicles` (`tab === 'registry'`)
* **Source Files:** [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js), [`lawma/work/fleet-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-ops.js)
* **Primary Role:** Accredited Drivers, Field Crew Roster, Compactor Fleet Plates, and OBD-II Telematics Pairing.
* **Modals & Drawers:**
  * **Modal `Register a fleet vehicle`:** Validates Nigerian number plate normalization (`plateKey`), vehicle class (`Compactor`, `Tipper`, `RoRo`), unladen tare weight, and depot assignment.
  * **Modal `Check Section 71 pass`:** Verifies statutory right-of-way immunity pass under Section 71 EMPL to protect waste trucks from illegal street toll extortion.

---

# SECTION B: GROUP 2 — OPERATIONS

---

## 5. Screen: `Fleet Map` (`tab === 'fleet'`)
* **Source Files:** [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js), [`lawma/work/fleet-map-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-map-rules.js), [`lawma/work/fleet-map-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-map-ops.js), [`src/test/fleet-map-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/fleet-map-rules.test.ts)
* **Primary Role:** Live MapLibre GL Corridor Tracking, PSP Filter, Signal Freshness Oversight, and Exception Escalation.
* **Modals & Drawers:**
  * **Toolbar Filters:** `fmPsp` (PSP operator filter), `fmFreshness` (`Live <=5m`, `Delayed 5–15m`, `Stale >15m`), `fmException` (Off-corridor / stationary alerts).
  * **Modal `Supervisor follow-up`:** Assigns stale-signal or off-route vehicle exception to District Operations Supervisor, PSP Service Liaison, or LAWMA Evidence Review Team.
  * **Side Drawer `Vehicle Map Inspector`:** Displays linked manifest ID, GPS coordinates, speed, and corridor clearance status.

---

## 6. Screen: `PSP Collections` (`tab === 'dispatch'`)
* **Source Files:** [`lawma/work/fleet-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-ops.js), [`lawma/work/fleet-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-rules.js), [`lawma/work/fleet-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-guard-ops.js), [`lawma/work/fleet-guard-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/fleet-guard-rules.js), [`src/test/fleet-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/fleet-rules.test.ts), [`src/test/fleet-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/fleet-guard-rules.test.ts)
* **Primary Role:** 05:00 AM Pre-Dispatch Lock (`MANDATE-WAH-01`), JIT Dumpsite Slot Booking, Hot-Swap Breakdown Handover, and Corridor Safeguards.
* **Modals & Drawers:**
  * **Modal `Book landing slot` (`fl-slot`):** Books 15-minute JIT arrival window; blocks booking if Solous 100-truck ceiling is reached.
  * **Modal `Emergency reroute` / `Emergency street detour`:** Logs verified LASTMA corridor obstruction and diverts truck to off-highway staging hub.
  * **Modal `Request hot-swap` & `Approve hot-swap`:** Transfers active route manifest from broken-down compactor to relief truck with two-official sign-off.
  * **Modal `Approve diesel price` & `Review fuel alert`:** Recalibrates Dynamic Fuel-Indexed Tariff Adjuster (DFITA) benchmarks and audits abnormal fuel siphon events.

---

## 7. Screen: `Service Records` (`tab === 'serviceLedger'`)
* **Source Files:** [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js), [`lawma/work/tracker-payment-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/tracker-payment-ops.js), [`src/test/service-tracker.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/service-tracker.test.ts), [`src/test/tracker-payment-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/tracker-payment-rules.test.ts)
* **Primary Role:** Verified Stop-by-Stop Collection Ledger, RFID/QR Scan Proof, and Linked Settlement Eligibility.
* **Modals & Drawers:**
  * **Dialog `Captured service event`:** Displays stop timestamp, GPS coordinates, bin tag scan, and photo proof.
  * **Modal `Link collection assignment`:** Connects verified service completion to property billing and operator payout batches.

---

## 8. Screen: `Field Shift` (`tab === 'crew'`)
* **Source Files:** [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js), [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js)
* **Primary Role:** Frontline Shift Check-In, Offline Queue Synchronization, and Crew Safety Oversight.
* **Modals & Drawers:**
  * **Modal `Create service assignment`:** Assigns crew roster and handheld scanner to daily route sheet.

---

## 9. Screen: `Dumpsites & TLS Hubs` (`tab === 'facility'`)
* **Source Files:** [`lawma/work/tls.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/tls.js), [`lawma/work/tls-entry.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/tls-entry.js), [`lawma/work/tls-lifecycle.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/tls-lifecycle.js), [`lawma/work/scale-checks.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/scale-checks.js), [`lawma/work/scale-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/scale-guard-ops.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/scale-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/scale-rules.test.ts), [`src/test/scale-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/scale-guard-rules.test.ts)
* **Primary Role:** Weighbridge Intake, Transfer Loading Station (TLS) Mass Balance, Multi-Modal Bulk Transfer to Epe WTE, and Epe Feedstock Contamination Gate.
* **Live Panels & Safeguards:**
  1. **Weighbridge & TLS Lifecycle Tabs:** `Ticket checks`, `Scale calibration`, `Wet-season mud`, `Deck & backup lanes`, `Provisional advances`, `Enterprise classification`.
  2. **Brutal Reality 1 & Blindspot 2 Panel (`cgFacilityPanel` — TLS Bulk Multi-Modal Transfer & Epe WTE Feedstock Gate):**
     * Enforces `cgDirectEpeCompactorError`: Small compactors cannot haul $>25\text{ km}$ directly to Epe; they must discharge at Simpson or Oshodi TLS.
     * Enforces `cgEpeFeedstockRejection`: Only `40T_RORO_TRAILER` and `LAGOON_BARGE` consignments are admitted to the Epe WTE receiving pit. Any load with moisture $>45\%$, inert rubble/sand $>8\%$, or calorific value $<7.5\text{ MJ/kg}$ is **automatically rejected**, diverted to the sanitary cell, and assessed a **₦150,000 demurrage penalty**.
* **Modals & Drawers:**
  * **Modal `cg-epe-inspect` (`Inspect Epe WTE bulk consignment`):** Evaluates trailer/barge mass, moisture %, inert rubble %, and calorific MJ/kg; records admission or rejection + ₦150,000 demurrage.
  * **Modal `cg-haul-check` (`Verify compactor vs TLS bulk haul distance rule`):** Blocks direct long-haul compactor dispatches to Epe.
  * **Modal `Record scale deck occupancy` / `Review backup lane` / `Request provisional advance`:** Manages 180s deck timeout, 300s heavy tow interlock, calibrated backup lane diversion, and 60% provisional operator advance against 90-day route baselines.

---

## 10. Screen: `Dumpsite Capacity` (`tab === 'capacity'`)
* **Source Files:** [`lawma/work/landfill-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/landfill-ops.js), [`lawma/work/landfill-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/landfill-guard-ops.js), [`lawma/work/landfill-plant-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/landfill-plant-ops.js), [`lawma/work/landfill-access-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/landfill-access-ops.js), [`lawma/work/landfill-quota-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/landfill-quota-ops.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/landfill-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/landfill-rules.test.ts), [`src/test/landfill-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/landfill-guard-rules.test.ts), [`src/test/landfill-quota-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/landfill-quota-rules.test.ts), [`src/test/landfill-access-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/landfill-access-rules.test.ts)
* **Primary Role:** Solous II/III 100-Truck Daily Ceiling (`LG_SOLOUS_CAP = 100`), Alimosho 6-LCDA Quota Allocation, Two-Tier Bulldozer Plant Billing, Waste-Picker Cooperative Safety, and Anti-Phantom-Tipping Gate.
* **Live Panels & Safeguards:**
  1. **Landfill Tabs:** `Airspace & surveys`, `Heavy plant logs`, `Methane & fire`, `Picker cooperatives`, `Overflow diversions`, `Two-tier plant billing`, `Recovery & access`, `Daily quota plan`.
  2. **Blindspot 1 Panel (`cgCapacityPanel` — Dual-Scale Hydraulic Tailgate & Tipping-Dwell Anti-Phantom Gate):**
     * Enforces `cgPhantomTippingError`: Blocks outbound weighbill clearance unless OBD-II telemetry confirms `tailgateOpened = true`, `ejectorCycled = true`, active tipping-face polygon entry, and `dwellSeconds >= 240s` (locks scale immediately if dwell $<180\text{s}$).
* **Modals & Drawers:**
  * **Modal `cg-tipping-check` (`Audit outbound scale tipping dwell & tailgate telemetry`):** Verifies gross/tare delta against hydraulic tailgate latch, ejector ram cycle, and tipping-face dwell seconds.
  * **Modal `Reserve overflow diversion` (`lg-divert`):** Diverts overflow trucks once Solous reaches 100 trucks; reserves ₦35,000 Epe voucher funded strictly from verified commercial receipts.
  * **Modal `Review two-tier invoice`:** Separates active compaction hours ($\ge 25\%$ engine load at 100% rate) from ready standby hours (35% rate) and excludes unverified idle hours.

---

## 11. Screen: `Cameras & Sensors` (`tab === 'cameras'`)
* **Source Files:** [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js), [`lawma/work/drainage-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-guard-ops.js)
* **Primary Role:** Canal Culvert Optical/77 GHz Radar Telemetry, Weighbridge Zero-Drift Sensors, and Methane Piezometers.
* **Modals & Drawers:**
  * **Dialog `Dummy sensor package`:** Inspects optical cross-section occlusion and radar fallback status.

---

## 12. Screen: `Partner Work Orders` (`tab === 'partnerWork'`)
* **Source Files:** [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js)
* **Primary Role:** Commercial Skip Assignments, Bulky Evacuation Orders, and SLA Tracking.
* **Modals & Drawers:**
  * **Modal `Create partner work order`:** Dispatches heavy RoRo skip order to accredited PSP operator.

---

# SECTION C: GROUP 3 — SERVICE & ASSURANCE

---

## 13. Screen: `Public Reports` (`tab === 'publicReports'`)
* **Source Files:** [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js), [`src/lib/site/report.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/lib/site/report.ts), [`src/test/report-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/report-rules.test.ts), [`src/test/hub-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/hub-rules.test.ts)
* **Primary Role:** Citizen Website & USSD Reporting Inbox (`LAW-YYMMDD-XXXX`), Masked Reporter Phone Numbers (`0803 ••• 4412`), and Field Verification Dispatch.
* **Modals & Drawers:**
  * **Modal `Log a public report`:** Captures LGA, landmark, issue category, and masked reporter contact.

---

## 14. Screen: `Drainage & Pre-Storm Defense` (`tab === 'drainage'`)
* **Source Files:** [`lawma/work/drainage-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-ops.js), [`lawma/work/drainage-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-rules.js), [`lawma/work/drainage-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-guard-ops.js), [`lawma/work/drainage-guard-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-guard-rules.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/drainage-infra-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/drainage-infra-rules.test.ts), [`src/test/drainage-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/drainage-guard-rules.test.ts)
* **Primary Role:** NiMet 48-Hour Basin Forecast, Automated 11m³ Skip Surge Mobilization, Canal Trash-Trap Telemetry, 60-Min EFAG Amphibious Response, Watertight Silt Haulage, and CDA Warden Skip Custody.
* **Live Panels & Safeguards:**
  1. **Drainage Guard Tabs:** `Pre-storm skip surge`, `Canal trash-trap radar`, `Closed-loop silt haulage`, `Section 102 LGA split`, `Merchant QR decals`, `Dual-key citizen cure`, `Anonymous whistleblower vault`.
  2. **Blindspot 7 Panel (`cgDrainagePanel` — Pre-Storm Skip CDA Warden QR Custody Handshake):**
     * Enforces `cgSkipCustodyError`: An emergency 11m³ pre-storm skip cannot be marked deployed unless the local **Community Development Association (CDA) Chairman / Warden** completes an electronic QR custody handshake inside the street junction geofence, unlocking a ₦5,000/day custody stipend to prevent scavenger arson and toxic dumping.
* **Modals & Drawers:**
  * **Modal `cg-skip-custody` (`Record pre-storm skip CDA Warden QR custody`):** Validates skip ID, drainage basin, CDA Chairman name, verified Nigerian phone, and QR scan timestamp.
  * **Modal `48-hour basin forecast` / `Mobilize skips` / `EFAG amphibious response` / `HAUL-CANAL closed-loop pairing`:** Executes pre-storm surge calculations and blocks canal-verge silt dumping.

---

## 15. Screen: `Complaints & Incidents` (`tab === 'incidents'`)
* **Source Files:** [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js), [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js)
* **Primary Role:** Operational Escalations, Missed Collection Follow-Ups, and Field Incident Resolution.
* **Modals & Drawers:**
  * **Dialog `Assign service follow-up`:** Routes open case to recovery crew and tracks resident confirmation.

---

## 16. Screen: `Compliance` (`tab === 'compliance'`)
* **Source Files:** [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js)
* **Primary Role:** Concessionaire SLA Audits, Regulatory Inspections, and Corrective Action Plans.

---

## 17. Screen: `Revenue & Co-Treasury Escrow` (`tab === 'finance'`)
* **Source Files:** [`lawma/work/settle-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/settle-ops.js), [`lawma/work/settle-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/settle-rules.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/settle-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/settle-rules.test.ts)
* **Primary Role:** The 75/15/5/5 Multi-Split Escrow Waterfall, 70/30 Working Capital vs Quality Escrow Buckets, 48-Hour Cure Window, Oracle EBS GL Sync, LIRS 5% WHT Deduction, and Weekend NIBSS Timeout Fuel Fallback.
* **Live Panels & Safeguards:**
  1. **Settlement Waterfall & Cure Arbitration Ledger:** Computes switching fee cap, 75% PSP entitlement (net of 5% LIRS WHT, split 70% Bucket A / 30% Bucket B), 15% LAWMA regulatory share, 5% LGA Section 102 share, and 5% Host Community fund.
  2. **Blindspot 4 Panel (`cgFinancePanel` — Friday NIBSS NIP Timeout & 72-Hour Fleet Fuel Barcode Fallback):**
     * Enforces `cgEmergencyFuelVoucher`: When Friday 12:00 PM NIBSS NIP bank transfers linger in `PENDING_NIP` past **45 minutes**, the clearinghouse automatically generates **72-Hour Digital Fleet Fuel Barcodes** redeemable at partnered retail networks (`NNPC`, `TotalEnergies`, `Ardova`) backed by the escrow batch float so compactor trucks never park over the weekend for lack of diesel.
* **Modals & Drawers:**
  * **Modal `cg-fuel-fallback` (`Check Friday NIP settlement latency & issue 72h fuel barcode`):** Evaluates elapsed minutes since NIP trigger and issues emergency fleet fuel barcodes when $\ge 45\text{ minutes}$.
  * **Modal `Release payment` / `Allocate bank alert` / `Simulate payment reversal`:** Manages escrow batch release and NIBSS webhook reconciliation.

---

## 18. Screen: `Demand Bills & Tariffs` (`tab === 'bills'`)
* **Source Files:** [`lawma/work/bill-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/bill-ops.js), [`lawma/work/bill-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/bill-rules.js), [`lawma/work/bill-care-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/bill-care-ops.js), [`lawma/work/bill-care-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/bill-care-rules.js), [`src/test/bill-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/bill-rules.test.ts), [`src/test/bill-care-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/bill-care-rules.test.ts)
* **Primary Role:** Serialized Demand Bill Register, Live Bill Composer Canvas, Bank vs. PSP Declaration Audit, Stub-03 CSAT Scorecard, and Two-Official Section 18 Arrears Notices.
* **Modals & Drawers:**
  * **Modal `Issue bill` / `Issue LGA batch` (with Live Preview Canvas `bcLive`):** Renders live printable LAWMA bill sheet with QR payment bridge (`bcQr`).
  * **Modal `Simulated QR payment bridge`:** Verifies bill QR payload integrity and simulates split between PSP and LAWMA.
  * **Modal `Log returned LAWMA-copy stub` / `Draft Section 18 notice` / `Approve notice draft`:** Tracks resident satisfaction stubs and enforces two-official approval on arrears notices.

---

## 19. Screen: `Commercial & Market Sealing` (`tab === 'commercial'`)
* **Source Files:** [`lawma/work/market-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/market-ops.js), [`lawma/work/market-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/market-rules.js), [`lawma/work/market-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/market-guard-ops.js), [`lawma/work/market-guard-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/market-guard-rules.js), [`src/test/market-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/market-rules.test.ts), [`src/test/market-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/market-guard-rules.test.ts)
* **Primary Role:** Mile 12, Ladipo, Alaba & Oyingbo Market Skip Telemetry, 3-Zone Inspection, 48-Hour Statutory Notice, 12-Hour Perishable Produce Evacuation (`DESTOCK-PASS`), and Tripartite Reopening Accord.
* **Modals & Drawers:**
  * **Modal `Serve 48-hour remediation notice`:** Issues statutory warning to registered Iyaloja/Babaloja contacts.
  * **Modal `Issue DESTOCK-PASS` & `Crate exit scan`:** Enforces the 12-hour perishable food evacuation window before KAI perimeter cordon (`KAI perimeter cordon` blocked until destocking completes).
  * **Modal `Tripartite accord` & `Lift cordon & reopen`:** Requires joint sign-off from Market Association, PSP Operator, and LAWMA before unsealing gates.

---

## 20. Screen: `Citizen Care & Dual-Key Cure` (`tab === 'care'`)
* **Source Files:** [`lawma/work/drainage-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/drainage-guard-ops.js), [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js)
* **Primary Role:** Dual-Key Citizen Remediation Verification (`dgOpsReady`, `dgCureState`), Independent QA Anti-Ghosting Inspection, and Anonymous Whistleblower Vault (`dgBountyError`).
* **Modals & Drawers:**
  * **Modal `Operational proof` / `Citizen response` / `Independent physical QA`:** Verifies truck distance $\le 50\text{m}$, dwell $\ge 180\text{s}$, and photo within 15 minutes; if citizen rejects, freezes operator payout and dispatches independent QA inspector.
  * **Modal `Blind dummy bounty`:** Disburses ₦10,000 airtime/mobile-money voucher only after independently reviewed court conviction or forfeiture.

---

## 21. Screen: `Connected Services` (`tab === 'connectedService'`)
* **Source Files:** [`lawma/work/hub.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/hub.js)
* **Primary Role:** Resident Service Setup Requests, Bulky Pickup Bookings, and Cross-App Event Synchronization.

---

## 22. Screen: `Enforcement & KAI Taskforce` (`tab === 'enforcement'`)
* **Source Files:** [`lawma/work/kai-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-ops.js), [`lawma/work/kai-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-rules.js), [`lawma/work/kai-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-guard-ops.js), [`lawma/work/kai-detention-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-detention-ops.js), [`lawma/work/kai-vault-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-vault-ops.js), [`lawma/work/kai-disposal-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-disposal-ops.js), [`lawma/work/kai-yard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/kai-yard-ops.js), [`lawma/work/circular-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/circular-guard-ops.js), [`src/test/kai-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-rules.test.ts), [`src/test/kai-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-guard-rules.test.ts), [`src/test/kai-detention-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-detention-rules.test.ts), [`src/test/kai-vault-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-vault-rules.test.ts), [`src/test/kai-disposal-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-disposal-rules.test.ts), [`src/test/kai-yard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/kai-yard-rules.test.ts)
* **Primary Role:** LAGESC/KAI 10-Minute Tactical Dispatch, 24-Hour Constitutional Detention Clock, Confiscated Cart Crusher & Eco-Runner Trike Diversion, Impound Yard Clamp Tamper Controls, and Section 84(2)/(4) Courtroom Evidence Vault.
* **Live Panels & Safeguards:**
  1. **KAI Tabs:** `Sector teams`, `Rapid response`, `Arrest bookings`, `Mobile court`, `Evidence vault`, `Cart custody & crusher`, `Owner subpoenas`, `Cart-to-trike`, `Impound yard`, `Provenance review`.
  2. **Blindspot 5 Panel (`cgEnforcementPanel` — Section 84(2) & 84(4) Evidence Act Machine Diagnostic Attestation):**
     * Enforces `cgSection84Ready`: Validates 64-hex SHA-256 photo digest, terminal hardware serial, pre-shift hardware diagnostic pass (Sec 84(2)(a/c)), Stratum-1 NTP clock drift $\le 5,000\text{ ms}$ (Sec 84(2)(c)), ordinary-course supply attestation (Sec 84(2)(b/d)), and Director of Legal Services digital signature (Sec 84(4)).
* **Modals & Drawers:**
  * **Modal `cg-sec84-check` (`Verify Section 84(2)/(4) Evidence Act machine diagnostic attestation`):** Runs full statutory admissibility check and logs signed courtroom certificate.
  * **Modal `Sign Section 84 certificate` / `Verify court destruction order` / `Record witnessed dummy destruction` / `Scan RFID & components`:** Enforces judicial destruction orders, first-offender cart-to-trike diversion, and impound yard release gates.

---

## 23. Screen: `Resource Recovery & MRFs` (`tab === 'recovery'`)
* **Source Files:** [`lawma/work/journeys.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/journeys.js), [`lawma/work/modules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/modules.js)
* **Primary Role:** Material Recovery Facilities (Jospong MRFs, Oshodi, Simpson), PET/Aluminium/Cardboard Baling, and Off-Taker Processor Receipts.
* **Modals & Drawers:**
  * **Modal `Register recovery batch`:** Logs material stream (`PET bottles`, `Aluminium cans`, `Cardboard`), net baled weight, processor off-taker receipt, and circular revenue allocation.

---

## 24. Screen: `Water & Leachate Monitoring` (`tab === 'environment'`)
* **Source Files:** [`lawma/work/eco-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/eco-ops.js), [`lawma/work/eco-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/eco-rules.js), [`lawma/work/eco-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/eco-guard-ops.js), [`lawma/work/eco-guard-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/eco-guard-rules.js), [`lawma/work/environment-followup.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/environment-followup.js), [`src/test/eco-haz-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/eco-haz-rules.test.ts), [`src/test/eco-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/eco-guard-rules.test.ts)
* **Primary Role:** Upgradient/Downgradient Borehole Piezometers, Leachate Lagoon DO/BOD/COD Telemetry, Storm Discharge Hold, Potable Water Tanker Relief, and 15cm Laterite Capping Verification.
* **Modals & Drawers:**
  * **Modal `Record cell capping evidence`:** Enforces laterite mass within 5% of required volume, bulldozer blade pressure $>160\text{ bar}$, spreading $\ge 4.5\text{ hours}$, LiDAR coverage $\ge 95\%$, compacted thickness $\ge 15\text{ cm}$, and density $\ge 1.95\text{ t/m}^3$.
  * **Modal `Collect sealed dummy sample` / `Record three-stage inspection` / `Approve relief supply`:** Enforces $4 \pm 1^\circ\text{C}$ cold chain and two-official custody.

---

## 25. Screen: `Hazardous Waste & Epe Incinerator` (`tab === 'hazwaste'`)
* **Source Files:** [`lawma/work/haz-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/haz-ops.js), [`lawma/work/haz-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/haz-rules.js), [`lawma/work/haz-guard-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/haz-guard-ops.js), [`lawma/work/haz-guard-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/haz-guard-rules.js), [`src/test/haz-guard-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/haz-guard-rules.test.ts)
* **Primary Role:** Clinical Medical Waste Manifests (4-Hour Emergency SLA), Industrial Chemical Sludge, Epe Incinerator Burn Validation ($>850^\circ\text{C} / 1,100^\circ\text{C}$), TCLP Ash Stabilization, and Backup Cement Kiln Diversion.
* **Modals & Drawers:**
  * **Modal `Reserve Epe capacity` & `Weigh and confirm unloading`:** Enforces unconsumed daily burn reservation and primary/secondary chamber temperature thresholds before issuing destruction certificates.
  * **Modal `Divert to cement kiln`:** Permitted only when Epe is offline, LASEPA assay is cleared, and halogen content is below limit.

---

## 26. Screen: `Systems Administration & Sovereign Cloud` (`tab === 'systems'`)
* **Source Files:** [`lawma/work/infra-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/infra-ops.js), [`lawma/work/infra-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/infra-rules.js), [`lawma/work/readiness-ops.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/readiness-ops.js), [`lawma/work/readiness-rules.js`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/lawma/work/readiness-rules.js), [`src/test/readiness-rules.test.ts`](file:///Users/quadri/Downloads/SmartWaste360-Workspace/src/test/readiness-rules.test.ts)
* **Primary Role:** Onshore Tier-III Dual-Site Continuity (Alausa $\leftrightarrow$ MainOne MDXi Lekki), NDPA Hosting Attestation, Three-Way Conflict-Free State Merge, and Named Practice Official Accountability.
* **Modals & Drawers:**
  * **Modal `Named practice official` / `Set practice time` / `Review dummy hosting evidence`:** Tracks official identity across all audit logs and verifies onshore data residency.

---

## Summary Verification Matrix (All 7 Blindspots Closed & Unit-Tested)

| # | Blindspot / Operational Objection | Rule Function (`circular-guard-rules.js`) | Workspace UI Surface | Automated Test Coverage |
| :-: | :--- | :--- | :--- | :---: |
| **1** | **Weighbridge Phantom Tipping** (Truck scales in and scales out without dumping) | `cgPhantomTippingError` | Screen 10 (`Dumpsite capacity`) $\to$ `cg-tipping-check` | `PASS` |
| **2** | **Epe WTE Contaminated / Wet Consignment** (Rubble/moisture ruins €120M boilers) | `cgEpeFeedstockRejection` & `cgDirectEpeCompactorError` | Screen 9 (`Dumpsites & TLS`) $\to$ `cg-epe-inspect` & `cg-haul-check` | `PASS` |
| **3** | **Tenement Room Density Under-Declaration** (24-room house declared as 3-room bungalow) | `cgDensityUnderdeclared` & `cgExpectedMinRooms` | Screen 2 (`Cadastre & DUID`) $\to$ `cg-density-check` | `PASS` |
| **4** | **Weekend NIBSS NIP Switch Outage** (Drivers lack Friday diesel money) | `cgEmergencyFuelVoucher` | Screen 17 (`Revenue`) $\to$ `cg-fuel-fallback` | `PASS` |
| **5** | **Section 84(2)/(4) Evidence Act Challenge** (Defense lawyer challenges device health/clock) | `cgSection84Ready` | Screen 22 (`Enforcement`) $\to$ `cg-sec84-check` | `PASS` |
| **6** | **Alimosho 6-LCDA Border Street Revenue Clash** (Ambiguous Section 102 5% split) | `cgStreetSideAttribution` | Screen 2 (`Cadastre & DUID`) $\to$ `cg-border-split` | `PASS` |
| **7** | **Pre-Storm Skip Vandalism & Scavenger Arson** (Unattended 11m³ skips burned/polluted) | `cgSkipCustodyError` | Screen 14 (`Drainage`) $\to$ `cg-skip-custody` | `PASS` |
| **8** | **Non-Linear Circular Transition Tracking** (<= 4% landfill residual target) | `cgNonLinearMassBalance` | Screen 1 (`Overview`) $\to$ `cg-streams` | `PASS` |
