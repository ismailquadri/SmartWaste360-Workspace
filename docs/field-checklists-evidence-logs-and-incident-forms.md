# LAWMA-360 v2: Field Checklists, Evidence Logs & Incident Forms

**Document Status:** Operational Field Kit & Incident Management Standard  
**Target Roles:** Weighbridge Marshals, Route Supervisors, Fleet Telematics Marshals, Enforcement Officers (KAI/LAGESC), Quality Assurance Auditors, and Facility Engineers  
**Governing Documents:**
- `docs/field-validation-pilot-plan.md` (Pilot phases, RACI, and pass/fail criteria)
- `docs/acceptance-criteria-and-field-validation-scenarios.md` (Observable test scenarios)
- `docs/solutions-and-modules-traceability-matrix.md` (Traceability to modules and safeguards)
- `docs/executive-policy-and-operational-decisions.md` (Statutory & operational defaults)

---

## 1. Master Pre-Flight Readiness Checklist

*To be completed by the Lead QA Auditor and Zonal Field Engineer 24 hours prior to initiating any pilot phase.*

| Item # | Verification Item | Target Standard | Verification Method | Status (Pass/Fail) | Sign-off Initials |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **PFC-01** | Edge Weighbridge Digitizers | RS-232 bridge operational, baud rate 9600-8-N-1, zero drift on zero load | Serial terminal test loop & calibrated test weight (5.00t) | [ ] Pass [ ] Fail | ____________ |
| **PFC-02** | Solar Microgrid & UPS Backup | Battery bank >95% SoC, inverter transfers to battery in <12ms upon mains cut | Manual grid isolator trip; verify continuous edge uptime | [ ] Pass [ ] Fail | ____________ |
| **PFC-03** | Local Offline Database Cache | SQLite WAL mode active, local cryptographic private key loaded in TPM/secure store | `PRAGMA integrity_check;` and key signature validation probe | [ ] Pass [ ] Fail | ____________ |
| **PFC-04** | Telematics CANbus Harnesses | OBD-II / J1939 retrofits securely clamped; ignition, odometer & payload sensing verified | Live telemetry bench readout on test compactor | [ ] Pass [ ] Fail | ____________ |
| **PFC-05** | Mobile Enforcement Tablets | KAI officer tablets provisioned with offline app, GPS high-accuracy lock, laser bar-code scanners | Device device-health ping & mock RFID clamp read | [ ] Pass [ ] Fail | ____________ |
| **PFC-06** | Leachate Piezometers | Optical UV254 & conductivity probes cleaned, calibrated against standard solution | Standard buffer solution sensor immersion check | [ ] Pass [ ] Fail | ____________ |
| **PFC-07** | Synthetic Escrow Pre-Funding | Sandbox central clearing account funded with ₦50,000,000 synthetic test liquidity | Double-entry GL balance verification in Core Fintech sandbox | [ ] Pass [ ] Fail | ____________ |
| **PFC-08** | Manual Fallback Deployment | Dual physical paper manifests, manual receipt books, and physical tally clerks stationed on-site | Physical muster roll verification at facility gate | [ ] Pass [ ] Fail | ____________ |
| **PFC-09** | Inter-Agency Channel Setup | Dedicated VHF radio channel and secure encrypted WhatsApp/Signal emergency group online | Comm check across LAWMA Control Room, KAI Lead, and LASEPA rep | [ ] Pass [ ] Fail | ____________ |
| **PFC-10** | Synthetic Tenement Consent | 50 test tenements surveyed, landlords/tenants notified of non-production simulation status | Signed pilot participation acknowledgement roster | [ ] Pass [ ] Fail | ____________ |

---

## 2. Phase-by-Phase Field Operational Checklists

### Phase 0: Non-Production Sandbox & Hardware Rig Emulation (Days 1–7)
*Location: LAWMA Central Tech Staging Lab (Alausa, Ikeja)*

- [ ] **Step 0.1 (Serial Injection):** Connect analog load-cell signal emulator to Edge Weighbridge Bridge. Inject fluctuating voltages (0–5V) corresponding to 0.00t to 45.00t.
- [ ] **Step 0.2 (Cable Severance):** Disconnect physical RS-232 cable mid-stream; confirm terminal flags `SCALE_DISCONNECTED` within 1,500ms and does not emit zero-weight tickets.
- [ ] **Step 0.3 (Crypto Signing Speed):** Benchmark ECDSA SHA-256 ticket signing under continuous load; verify mean signing time is <120ms with 0 dropped transactions.
- [ ] **Step 0.4 (GPS Shadow Simulation):** Place vehicle telematics box in RF-attenuated Faraday chamber for 45 minutes; verify memory buffer stores 2,700 points (1 point/sec) and replays monotonically upon chamber exit.
- [ ] **Step 0.5 (Idempotency Audit):** Transmit 10 identical settlement batch outbox packets; verify Core Sandbox ledger accepts packet 1 and deduplicates packets 2 through 10 with `HTTP 200 (DUPLICATE_ACKNOWLEDGED)`.

---

### Phase 1: Isolated Facility & Single-Ward Ground Testing (Days 8–21)

#### Track A: Weighbridge & TLS Scale (Simpson TLS & Olusosun Gate 1)
*Operating Shift: 06:30 – 14:30 | Lead: Facility Scale Marshal*

- [ ] **Step 1A.1 (07:00 Uplink Cut):** Disconnect fiber router and disable 4G SIM fallback on the weighbridge edge computer. Confirm terminal switches to `STATUS: OFFLINE_EDGE_OPERATING`.
- [ ] **Step 1A.2 (Truck Gross Inbound):** Guide inbound compactor onto platform. Verify optical tripwires ensure full vehicle containment (all axles on deck, zero overhang).
- [ ] **Step 1A.3 (Weight Capture & Ticket Print):** Trigger gross capture. Confirm edge terminal prints offline ticket in <15 seconds containing:
  - Ticket Sequence ID (monotonic, non-repeating)
  - Vehicle Plate & RFID tag ID
  - Gross Weight (kg)
  - Offline ECDSA cryptographic signature QR code
- [ ] **Step 1A.4 (Tipping & Mud Adjustment):** Compactor discharges payload at tipping floor. Visual inspection for wet-season chassis mud. Marshal enters mud coefficient:
  - Dry / Clean: $\Delta_{	ext{mud}} = 0	ext{ kg}$
  - Moderate wheel spray: $\Delta_{	ext{mud}} = 50	ext{ kg}$
  - Severe axle packing: $\Delta_{	ext{mud}} = 150	ext{ kg}$
- [ ] **Step 1A.5 (Tare Outbound & Dynamic Net):** Weigh empty truck on Outbound Scale. Edge software calculates:
  $$	ext{Net Tonnage} = 	ext{Gross} - 	ext{Tare} - \Delta_{	ext{mud}}$$
  Confirm Net Tonnage is non-negative and matches expected compaction density ($0.35 - 0.55	ext{ t/m}^3$).
- [ ] **Step 1A.6 (11:00 Uplink Restoration):** Reconnect network uplinks. Observe automatic batch synchronization of offline tickets to central cloud. Verify zero missing sequence numbers.

#### Track B: Fleet Logistics & Telemetry (Alimosho Pilot Corridor)
*Operating Shift: 05:00 – 13:00 | Lead: Fleet Route Supervisor*

- [ ] **Step 1B.1 (05:00 Depot Lock Verification):** Check fleet telematics dashboard. Verify compactor ignition remains disabled until 05:00 AM route clearance schedule.
- [ ] **Step 1B.2 (Street Breadcrumb Tracking):** Compactor covers Egbeda/Akowonjo ward. Verify route coverage map records street-level breadcrumbs every 10 meters with timestamp, speed, and hydraulic bin-lift events.
- [ ] **Step 1B.3 (Queue Diversion Trigger):** At 10:15 AM, inject simulated gridlock at Solous II landfill gate (queue wait time >120 minutes).
- [ ] **Step 1B.4 (In-Cab Reroute & Fuel Voucher):** Verify route supervisor tablet and in-cab driver terminal display dynamic diversion alert to Epe Landfill or Simpson TLS. Verify generation of electronic fuel compensation voucher (`FIN-VOUCH-EPE`) with approved allowance (e.g. ₦35,000 / 30 Liters diesel).
- [ ] **Step 1B.5 (Turnaround SLA Pause):** Confirm system flags route SLA as paused with code `EXC-QUEUE-DIVERT-01`, preventing unfair turnaround penalty deductions.

#### Track C: Cadastre & Tenement Billing (Surulere Multi-Flat Pilot)
*Lead: Cadastre Property Marshal*

- [ ] **Step 1C.1 (DUID Doorstep Inspection):** Inspect 50 residential compounds in Surulere Ward B. Confirm each flat bears an individual weatherproof QR code tag carrying unique Dwelling Unit ID (`DUID-SUR-001` through `DUID-SUR-300`).
- [ ] **Step 1C.2 (Tenancy Ledger Split):** Check billing portal. Verify monthly utility bill generates individual invoice per flat (Flat 1–6) rather than a single lump sum to compound owner.
- [ ] **Step 1C.3 (Tenant Vacancy & Debt Isolation):** Execute mock tenancy change on Flat 4 with ₦15,000 legacy arrears. Register new occupant.
  - Verify Flat 4 current account resets to ₦0.00 current balance for new occupant.
  - Verify historical debt moves to Landlord Arrears Review Ledger (`DEBT-OWNER-PENDING`).
  - Verify compactor crew terminal shows green pickup clearance for Flat 4 with zero service denial.

---

### Phase 2: Inter-Agency Operational & Field Exception Workflows (Days 22–35)

#### Track D: Enforcement & Mobile Court S.84 Mock Trial Docket (KAI / LAGESC)
*Lead: Legal Officer & KAI Sector Commander*

- [ ] **Step 2D.1 (Violation Detection & Seal):** Roving KAI patrol identifies simulated commercial fly-dumping at unauthorized roadside drop.
- [ ] **Step 2D.2 (Digital Evidence Seizure):** Officer captures 4 geo-tagged, time-stamped evidentiary photos via mobile enforcement terminal.
- [ ] **Step 2D.3 (RFID Tamper Clamp Affixing):** Officer affixes physical electronic tamper clamp to compactor tailgate/violator premises, scanning barcode into case dossier.
- [ ] **Step 2D.4 (Section 84 Certificate Generation):** Terminal compiles evidence package, computes SHA-256 hash, and generates statutory Certificate of Electronic Evidence under Section 84 of the Nigerian Evidence Act 2011.
- [ ] **Step 2D.5 (Mock Court Docket Challenge):** Present evidence package to Mock Trial Magistrate. Defense injects corrupted replica photo (1 byte altered). Verify court viewer flags: `EVIDENCE_TAMPER_DETECTED: HASH_MISMATCH`, validating cryptographic chain-of-custody.

#### Track E: Ecotox Leachate Monitoring & Hazmat Quarantine (LASEPA / MOD-07 / MOD-08)
*Lead: Environmental Inspector & Landfill Hazmat Safety Officer*

- [ ] **Step 2E.1 (Piezometer Telemetry Injection):** At Olusosun Leachate Monitoring Station, inject test chemical signal into shallow piezometer stream ($COD > 1,200	ext{ mg/L}$, Conductivity $> 3,500	ext{ }\mu	ext{S/cm}$).
- [ ] **Step 2E.2 (Automated LASEPA Alert):** Verify central monitoring engine fires high-priority environmental alert and synchronizes incident docket to LASEPA emergency portal in <120 seconds.
- [ ] **Step 2E.3 (Biohazard Interdiction Truck):** Dispatch test truck carrying simulated industrial clinical waste with an expired electronic manifest token (`LASEPA-LAB-TOKEN-EXPIRED`).
- [ ] **Step 2E.4 (Boom Gate Lockout & Isolation Bay):** Facility access boom gate locks in down position with red alarm. Scale terminal directs vehicle to isolated Hazmat Quarantine Bay under CCTV monitoring.
- [ ] **Step 2E.5 (Chain of Custody Handover):** Marshal and LASEPA inspector sign digital chain-of-custody transfer form with two-factor biometric/PIN authentication.

#### Track F: Night Market Waste Evacuation (Mile 12 International Market)
*Lead: Commercial Concession Supervisor*

- [ ] **Step 2F.1 (Market Pre-Clearance Wallet Check):** Verify Market Traders Association bulk virtual escrow account holds minimum credit threshold before nighttime dispatch.
- [ ] **Step 2F.2 (Night Shift Evacuation):** Heavy compactors and roll-on/roll-off trucks operate between 23:30 and 04:15 along designated market alleys.
- [ ] **Step 2F.3 (Street Cleanliness Optical Verification):** At 04:30, fixed perimeter CCTV cameras and roving supervisor tablet execute visual cleanliness inspection across 3 designated market zones.
- [ ] **Step 2F.4 (05:00 AM Street Opening Sign-off):** Concessionaire logs street clearance verification at 04:48. System checks time condition ($t < 05:00	ext{ AM}$) and triggers automated release of concessionaire daily operational credit.

---

### Phase 3: Fintech Clearing, Settlement Rehearsal & DR Failover (Days 36–45)

#### Track G: Friday Automated Settlement Rehearsal & Dispute Cure (MOD-05 / MOD-10)
*Lead: Financial Controller & Core Banking Integration Lead*

- [ ] **Step 3G.1 (14:00 Friday Ingestion Cutoff):** Automated settlement batch triggers at 14:00 UTC. System aggregates all verified weighbridge tonnage tickets for the 7-day billing cycle.
- [ ] **Step 3G.2 (Split-Ratio Execution):** Rehearse clearing engine execution:
  - 70% (or 80% per policy default) base operational disbursement calculated for compliant PSPs.
  - 5% statutory LIRS Withholding Tax (WHT) deducted and routed to Lagos Internal Revenue Service settlement account.
  - 5% Section 102 Local Government Environment Fund calculated and credited to LGA escrow sub-ledger.
- [ ] **Step 3G.3 (Citizen Dispute 48-Hour Cure Hold):** Ingest 25 test citizen missed-collection complaints from Lekki Phase 1 corridor.
  - Verify settlement engine isolates dispute hold strictly to the 20% performance buffer for affected routes.
  - Verify automated remedial dispatch alert transmitted to assigned PSP compactor.
  - Conduct verified catch-up pickup within 48 hours; verify automatic release of escrow hold upon supervisor digital signature.
- [ ] **Step 3G.4 (Zero-Variance Reconciliation):** Compare total synthetic funds debited against sum of credits:
  $$\sum 	ext{Debits} - \sum 	ext{Credits} = ₦0.0000$$
  Confirm zero-kobo rounding discrepancy across all sub-ledgers.

#### Track H: Sovereign Infrastructure Disaster Recovery & Failover (MOD-11)
*Lead: Infrastructure Architect & Lead DevOps Engineer*

- [ ] **Step 3H.1 (Peak Traffic WAN Blackout):** While simulated traffic of 500 edge requests/second is active, simulate total routing failure at Primary Datacenter (MainOne MDXi Lekki).
- [ ] **Step 3H.2 (Automated DNS/BGP Failover):** Confirm edge gateway health-check detects drop within 5 seconds and reroutes traffic to Secondary Datacenter (Lagos State Central Data Centre, Alausa).
- [ ] **Step 3H.3 (Failover Timing Verification):** Measure Recovery Time Objective (RTO < 30 seconds) and Recovery Point Objective (RPO = 0 transactions lost).
- [ ] **Step 3H.4 (Post-Failover Data Consistency):** Execute cryptographic checksum comparison across primary and secondary PostgreSQL replication clusters. Confirm 100% hash parity.

---

## 3. Chain-of-Custody Evidence Logs

### Form ECL-01: Scale & Load-Cell Calibration Log
*Location:* ________________________ *Scale Unit ID:* ________________________  
*Digitizer Serial:* __________________ *Last Verified Date:* ___________________

| Test Run # | Target Test Mass (kg) | Raw Digitizer Reading (kg) | Variance (kg) | Permissible Error ($\pm 20	ext{ kg}$) | Pass / Fail | Technician Signature |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **01** | Zero Load (0 kg) | | | $\pm 5	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **02** | 5,000 kg (Test Block 1) | | | $\pm 10	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **03** | 10,000 kg (Test Block 1+2) | | | $\pm 20	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **04** | 20,000 kg (Full Test Rig) | | | $\pm 20	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **05** | Corner 1 (North-West) | | | $\pm 15	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **06** | Corner 2 (North-East) | | | $\pm 15	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **07** | Corner 3 (South-West) | | | $\pm 15	ext{ kg}$ | [ ] Pass [ ] Fail | |
| **08** | Corner 4 (South-East) | | | $\pm 15	ext{ kg}$ | [ ] Pass [ ] Fail | |

---

### Form ECL-02: Section 84 Evidence & Tamper Clamp Manifest
*Case Reference:* `ENF-2026-______` *Officer ID / Name:* ___________________________  
*Violation Address / LGA:* ____________________________________________________  
*Accused Vehicle Plate / Entity:* ______________________________________________

| Evidence Item ID | File Name / Media Type | Timestamp (UTC+1) | Device Serial & Model | SHA-256 Cryptographic Hash Digest | Section 84 Compliance Seal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **EVD-01** | Photo: Vehicle In-Flagrante | | | `e3b0c44298fc1c149afbf4c8996fb92427ae...` | [x] Certified by System |
| **EVD-02** | Photo: Hazardous Sludge Spill | | | `4a5f6e8d2c1b9a8e7f6d5c4b3a210fedcba...` | [x] Certified by System |
| **EVD-03** | Telematics GPS Track File | | | `8c1a9f3e4b2d5a7c8e9f0a1b2c3d4e5f6a7...` | [x] Certified by System |
| **EVD-04** | Electronic Tamper Clamp ID | | | Clamp Barcode / RFID: `CLAMP-LAG-________` | [x] Physical Clamp Locked |

*Officer Affirmation:* "I hereby certify under Section 84 of the Evidence Act 2011 that the electronic devices utilized were in normal operating condition and that the cryptographic digests above have remained uncompromised."  
**Officer Signature:** ___________________________ **Date/Time:** ___________________________

---

### Form ECL-03: Telematics & GPS Blackout Exception Log
*Vehicle Plate:* __________________ *Operator (PSP/LAWMA):* ____________________  
*Assigned Route Code:* ____________ *Corridor:* _______________________________

| Event ID | Blackout Start (Time) | Blackout End (Time) | Duration (min) | Last Known Lat/Long | Resumption Lat/Long | Stored Packets Replayed | Integrity Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **GEO-01** | | | | | | | [ ] Reconciled [ ] Suspicious |
| **GEO-02** | | | | | | | [ ] Reconciled [ ] Suspicious |
| **GEO-03** | | | | | | | [ ] Reconciled [ ] Suspicious |

*Auditor Verification Notes:* __________________________________________________________________

---

### Form ECL-04: Leachate & Hazmat Custody Transfer Log
*Manifest ID:* `HAZ-2026-______` *Waste Classification:* [ ] Clinical [ ] Industrial Chemical [ ] Electronic  
*Generating Facility:* ______________________________ *Permit Ref:* ___________________________  
*Disposal/Treatment Bay:* ____________________________ *Lead Inspector:* _______________________

| Checkpoint | Parameter | Measured Value | Statutory Threshold | Compliance Status | Verifier Signature |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Gate Inbound** | Radiation Level ($\mu	ext{Sv/h}$) | | $<0.20	ext{ }\mu	ext{Sv/h}$ | [ ] Normal [ ] Elevated | |
| **Gate Inbound** | Manifest Token Ed25519 | | Must be Valid & Unexpired | [ ] Valid [ ] Expired/Invalid | |
| **Sampling Bay** | Volatile Organics (VOC ppm) | | $<50	ext{ ppm}$ | [ ] Acceptable [ ] Dangerous | |
| **Treatment Bay**| Piezometer COD ($	ext{mg/L}$) | | $<500	ext{ mg/L}$ | [ ] Baseline [ ] Breach Alert | |

---

### Form ECL-05: Fintech Settlement Reconciliation & GL Balance Log
*Rehearsal Cycle Date:* _______________ *Settlement Batch Ref:* `SETTL-2026-W__-___`  
*Ingestion Engine Version:* ___________ *Escrow Account Ref:* `ESCROW-LASG-CORE-01`

| Accounting Category | Total Debits (₦) | Total Credits (₦) | Variance (₦) | Root Cause / Note | Lead Auditor Sign-off |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Verified Compactor Tonnage** | ₦ | ₦ | ₦ 0.00 | Measured Scale Tickets | |
| **Operational Payout (70%/80%)**| ₦ | ₦ | ₦ 0.00 | Net to PSP Escrow Wallets | |
| **LIRS Withholding Tax (5%)** | ₦ | ₦ | ₦ 0.00 | Dedicated Tax Outbox | |
| **Sec 102 LGA Fund (5%)** | ₦ | ₦ | ₦ 0.00 | Local Council Escrow Ledger | |
| **Performance Dispute Buffer** | ₦ | ₦ | ₦ 0.00 | 48-Hour Cure Escrow Bucket | |
| **Batch Gross Total** | **₦** | **₦** | **₦ 0.00** | **Exact Match Required** | |

---

## 4. Field Defect & Severity Logging Form

### Defect Severity Classification Matrix

| Severity Level | Definition | Field Operational Impact | Resolution SLA | Escalation Target |
| :--- | :--- | :--- | :--- | :--- |
| **Sev 1: Critical Blocker** | System crash, data loss, scale freezing, invalid crypto signature, ledger imbalance ($>₦0.00$), or security compromise. | Total test halt. Facility or route operations revert to manual fallback. Pilot gate blocked. | **<2 Hours** | Technical Lead, Operations Director & Core Eng Lead |
| **Sev 2: Operational Degradation** | High latency ($>30	ext{s}$ ticket print), single telematics unit dropout, UI error in non-critical flow, transient reroute lag. | Testing continues under heightened supervision with secondary monitoring. | **<8 Hours** | Lead Systems Architect & Senior Field Engineer |
| **Sev 3: Minor Procedural** | Edge display truncation, non-blocking telemetry warning, delayed email receipt, minor report formatting error. | No operational disruption. Managed within active test shift. | **<24 Hours** | QA Lead & Module Software Engineer |
| **Sev 4: Cosmetic / Config** | Spelling typo, label misalignment, minor dashboard color mismatch, help text ambiguity. | Documented for next release sprint. Zero pilot impact. | **<72 Hours** | UI/UX Developer |

---

### Field Defect Logging Template

```
================================================================================
LAWMA-360 v2 FIELD DEFECT REPORT FORM
================================================================================
Defect Reference ID:   DEF-2026-[PHASE]-[NUMBER]  (e.g., DEF-2026-P1-004)
Report Date & Time:    ________________________ (UTC+1)
Reporting Officer:     ________________________ (Role / Agency: ____________)
Pilot Phase / Track:   [ ] Phase 0  [ ] Phase 1  [ ] Phase 2  [ ] Phase 3
Target Module(s):      [ ] MOD-01  [ ] MOD-02  [ ] MOD-03  [ ] MOD-04  [ ] MOD-05
                       [ ] MOD-06  [ ] MOD-07  [ ] MOD-08  [ ] MOD-09  [ ] MOD-10  [ ] MOD-11
Location / Site:       _________________________________________________________
Hardware / Device ID:  _________________________________________________________

--------------------------------------------------------------------------------
1. DEFECT SEVERITY LEVEL
--------------------------------------------------------------------------------
[ ] SEV 1: CRITICAL BLOCKER      [ ] SEV 2: OPERATIONAL DEGRADATION
[ ] SEV 3: MINOR PROCEDURAL      [ ] SEV 4: COSMETIC / CONFIG

--------------------------------------------------------------------------------
2. DEFECT SUMMARY & REPRODUCTION
--------------------------------------------------------------------------------
Brief Title: ___________________________________________________________________

Preconditions:
1. _____________________________________________________________________________
2. _____________________________________________________________________________

Step-by-Step Reproduction Instructions:
1. _____________________________________________________________________________
2. _____________________________________________________________________________
3. _____________________________________________________________________________

Expected Behavior:
________________________________________________________________________________

Actual Observed Behavior:
________________________________________________________________________________

Error Code / Terminal Message (if applicable):
________________________________________________________________________________

--------------------------------------------------------------------------------
3. FORENSIC EVIDENCE ATTACHMENTS
--------------------------------------------------------------------------------
Log File / Trace ID:    ________________________________________________________
Screenshot / Photo ID:  ________________________________________________________
Hardware Serial / MAC:  ________________________________________________________
SHA-256 of Error Dump:  ________________________________________________________

--------------------------------------------------------------------------------
4. IMMEDIATE CONTAINMENT & ACTION TAKEN
--------------------------------------------------------------------------------
Fallback Activated:     [ ] YES  [ ] NO   (Fallback Type: _____________________)
Stop-Work Initiated:    [ ] YES  [ ] NO
Assigned Developer:     ________________________  Target Fix Time: _____________

Sign-Offs:
Reporting Marshal: ______________________ QA Lead: _____________________________
================================================================================
```

---

## 5. Incident Reporting & Emergency Stop-Work Protocol

### Stop-Work Immediate Trigger Conditions
A mandatory Emergency Stop-Work Order is triggered immediately upon:
1. **Ledger Discrepancy:** Any financial imbalance where synthetic credits and debits diverge by even ₦1.00 during settlement tests.
2. **Physical Facility Gridlock:** Dumpsite inbound truck queue exceeds 1.5 km or extends beyond the arterial road access corridor (e.g. LASU-Igando road blockage).
3. **Hardware / Microgrid Fire or Electrical Hazard:** Load cell arcing, solar battery thermal runaway, or structural platform deformation.
4. **Evidentiary Hash Corruption:** Rejection of digital evidence in court testing due to key management compromise or unrecorded data alteration.
5. **Physical Inter-Agency Conflict:** Physical dispute between enforcement marshals, operators, or market unions.

---

### Emergency Incident & Stop-Work Protocol Form

```
================================================================================
LAWMA-360 v2 EMERGENCY STOP-WORK / INCIDENT ORDER
================================================================================
Incident Order ID:     INC-2026-SWO-[NUMBER]
Trigger Date & Time:   ________________________ (UTC+1)
Authorizing Authority: ________________________ (Title: Operations Director / QA Lead)
Incident Location:     _________________________________________________________

--------------------------------------------------------------------------------
1. PRIMARY TRIGGER CATEGORY
--------------------------------------------------------------------------------
[ ] Physical Safety or Roadway Gridlock Threat
[ ] Financial Ledger Reconciliation Failure
[ ] Evidentiary Inadmissibility / Cryptographic Key Breach
[ ] Unrecoverable Hardware / Microgrid Outage
[ ] Uncontrolled Biohazard / Hazardous Waste Spillover

--------------------------------------------------------------------------------
2. INCIDENT DESCRIPTION & ROOT CAUSE ANALYSIS (INITIAL)
--------------------------------------------------------------------------------
What Happened:
________________________________________________________________________________
________________________________________________________________________________

Immediate Risk Assessment:
________________________________________________________________________________

--------------------------------------------------------------------------------
3. CONTAINMENT & ROLLBACK ACTIONS INITIATED
--------------------------------------------------------------------------------
[ ] Manual Fallback Tally Clerks Deployed to Scale
[ ] Compactor Fleet Rerouted to Secondary Dumpsite (Epe / Solous)
[ ] Settlement Ingestion Gateway Halted & Database Transactions Rolled Back
[ ] Piezometer Outflow Containment Sump Locked Down
[ ] Enforcement Dockets Reverted to Manual Stamped Books

Rollback Execution Lead: _______________________________________________________
Time Rollback Completed: _______________________ (UTC+1)

--------------------------------------------------------------------------------
4. RESUMPTION CRITERIA (WHAT MUST BE RESOLVED BEFORE WORK RESTART)
--------------------------------------------------------------------------------
1. _____________________________________________________________________________
2. _____________________________________________________________________________
3. _____________________________________________________________________________

--------------------------------------------------------------------------------
5. EXECUTIVE AUTHORIZATION TO RESUME OPERATIONS
--------------------------------------------------------------------------------
I certify that the root cause of Incident INC-2026-SWO-[NUMBER] has been fully 
remediated, verified through automated unit/integration tests, and that resumption 
poses zero operational, financial, or legal risk.

Operations Director: ________________________ Signature: ___________ Date: _____
Technical Lead:      ________________________ Signature: ___________ Date: _____
AWAMN Observer:      ________________________ Signature: ___________ Date: _____
================================================================================
```

---

## 6. Phase Gate Transition & Exit Sign-Off Certificate

```
================================================================================
LAWMA-360 v2: FORMAL PHASE EXIT CERTIFICATE
================================================================================
Phase Under Review:   [ ] Phase 0  [ ] Phase 1  [ ] Phase 2  [ ] Phase 3
Phase Description:    _________________________________________________________
Review Date:          ________________________ (UTC+1)

--------------------------------------------------------------------------------
1. GATE VERIFICATION CHECKLIST
--------------------------------------------------------------------------------
[ ] 100% of Scheduled Field Test Scenarios Executed and Documented
[ ] Zero Open Sev 1 (Critical) or Sev 2 (High) Defects on Issue Tracker
[ ] All Chain-of-Custody Evidence Logs Fully Signed and Cryptographically Verified
[ ] Zero Unreconciled Financial Discrepancies in Test Ledger
[ ] All Manual Fallback Systems Benchmarked and Proven Functional
[ ] Comprehensive Test Summary Report Reviewed by All Stakeholder Representatives

--------------------------------------------------------------------------------
2. REMAINING OBSERVATIONS & CONDITIONAL WAIVERS (SEV 3 / SEV 4 ONLY)
--------------------------------------------------------------------------------
1. _____________________________________________________________________________
2. _____________________________________________________________________________

--------------------------------------------------------------------------------
3. FORMAL ADVANCEMENT DETERMINATION
--------------------------------------------------------------------------------
[ ] APPROVED: Advance to Next Operational Phase
[ ] REJECTED: Phase Extended for Remediation and Retesting

--------------------------------------------------------------------------------
4. STATUTORY & EXECUTIVE SIGN-OFF
--------------------------------------------------------------------------------
Role                              Name                          Signature         Date
--------------------------------------------------------------------------------
Director of Operations (LAWMA):   ___________________________   _______________   ______
Technical Implementation Lead:    ___________________________   _______________   ______
AWAMN Executive Representative:   ___________________________   _______________   ______
LASEPA Monitoring Observer:       ___________________________   _______________   ______
Zonal Operations Coordinator:     ___________________________   _______________   ______
================================================================================
```
