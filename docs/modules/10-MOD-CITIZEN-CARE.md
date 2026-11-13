# PRODUCT LEVEL DOCUMENT: MODULE 10 (`MOD-10-CITIZEN-CARE`)
## Multi-Channel Citizen Care, Pre-Storm Drainage & LGA Co-Regulation

**Document Identifier:** LAWMA-PLD-MOD-10-CITIZEN-CARE  
**Document Version:** 3.0 (Post-Executive Audit Comprehensive Edition)  
**System Target:** Citizen Care Multi-Channel Gateway (USSD/IVR/WhatsApp), Drainage Network Telemetry, LGA Section 102 Allocation Clearinghouse  
**Statutory Foundation:** 2017 Lagos State EMPL Sec. 102; 1999 Constitution of the Federal Republic of Nigeria (Fourth Schedule); Lagos State Local Government Administration Law  
**Executive Boardroom Sponsor:** **Hon. Rasheed Shabi**, House Committee Chair & **Hon. Tokunbo Wahab**, Hon. Commissioner  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Customer Care Directorate & Public Advocacy Division
- **Drainage Lead:** MEWR Emergency Flood Abatement Gang (EFAG) / Drainage Directorate
- **Local Govt Body:** Conference 57 (Chairmen of 20 Local Governments & 37 LCDAs)
- **Meteorological Partner:** Nigerian Meteorological Agency (NiMet)

---

## 1. Executive Context & Statutory Authority

The battle for a clean, flood-free Lagos cannot be won without active citizen co-production and seamless constitutional harmony with the 57 Local Governments and Local Council Development Areas (LGAs/LCDAs). Under the **Fourth Schedule of the 1999 Constitution of Nigeria**, the collection and disposal of domestic refuse is primarily a function of Local Government Councils. However, the 2017 Lagos State Environmental Management and Protection Law (EMPL) centralized regulatory and operational standards within LAWMA, providing in **Section 102** that 5% of total municipal waste collections must be allocated directly back to Local Government Councils to fund local sanitation, sweepers, and primary drain clearing.

Under **`MANDATE-SHB-03`**, Hon. Rasheed Shabi mandated:
> *"We cannot continue to treat Local Governments as hostile competitors or ignore their constitutional role. The persistent friction where LGA revenue collectors harass shopkeepers with parallel tickets must end. The platform must automate the Section 102 EMPL 5% statutory revenue sharing ledger. Every LGA Chairman must see real-time tariff settlements generated within their jurisdiction and receive automated monthly transfers. In exchange, LGAs must co-sign local cleanliness audits and deploy their environmental health officers (Wole-Wole) under unified standards."*

Complementing this, under **`MANDATE-WAH-04`**, Hon. Commissioner Tokunbo Wahab ordered:
> *"Flooding in Lagos is waste-induced. When it rains, residents dump plastic bags into gutters to let stormwaters carry them away, choking canal bridges and drowning entire neighborhoods. We must deploy the Pre-Storm Surge Protocol linked to NiMet weather radar feeds: 48 hours before major torrential storms, dedicated emergency skips must drop across flood-prone coastal basins. Primary canal trash traps must monitor waste blockages via optical sensors before water backs up into homes."*

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In historical municipal management:
1. **The Drainage Dumping Phenomenon:** Tens of thousands of residents use rainstorms as a free waste disposal service. Bags of garbage dumped into street gutters flow into major drainage canals (e.g., System 63 in Surulere, System 4 in Victoria Island, System 1 in Maryland), forming massive debris dams at cross-culverts and causing catastrophic flash flooding.
2. **Constitutional Turf Wars & Harassment:** LGA Chairmen feeling alienated from LAWMA's centralized collections dispatched informal "sanitation taskforces" who raided small businesses, impounded goods, and demanded arbitrary cash fines, sparking public outcry.
3. **The Digital Exclusion of the Urban Poor:** Low-income citizens living in informal settlements (Bariga, Amukoko, Ajegunle, Makoko) do not possess smartphones or mobile data to use fancy web applications. Legacy reporting mechanisms completely ignored over 60% of the city's population.
4. **Opaque LGA Revenue Accounting:** The statutory 5% LGA allocation mandated by Section 102 EMPL was historically embroiled in disputes, opaque accounting, and delayed disbursements, fueling permanent political hostility from Conference 57.

### 2.2 Empirical Backing Data & Evidence
- **Waste-Induced Urban Flooding:** Over 70% of flash flooding events in Lagos are directly caused by solid waste clogging drainage culverts and canal bridges.
- **USSD / Low-Tech Dependency:** 58.4% of adult Lagos residents rely on USSD codes (`*384*...#`) and voice telephony for utility and financial transactions.
- **Section 102 Allocation Value:** At ₦48 billion annual collection target, the 5% LGA statutory share represents **₦2.4 billion annually** distributed across the 57 councils (approx. ₦42 million/year per council) for localized drainage clearing and Wole-Wole sanitation inspections.

### 2.3 Fraud Vectors & Attack Models
- **Parallel LGA Ticket Fraud:** Corrupt local government revenue contractors print fake "Local Government Sanitation Levy" tickets to extort businesses already paying LAWMA domestic tariffs.
- **Vandalism of Canal Optical Sensors:** Scrap scavengers and illegal sand-diggers attempt to disable or steal canal camera equipment monitoring hydraulic trash racks.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 10.1: NiMet-Linked Pre-Storm Surge Protocol & 48-Hour Skip Deployment
Integrate with the Nigerian Meteorological Agency (NiMet) weather forecasting API to trigger proactive waste skip deployment across 34 high-risk flood basins prior to heavy downpours.

#### User Story 10.1.1: Automated Pre-Storm Skip Mobilization
- **As the** Director of Emergency Flood Abatement (EFAG),
- **I want** the system to alert operations 48 hours before predicted heavy rainfall ($>50	ext{ mm}$),
- **So that** emergency RoRo skips are dropped at flood-prone canal intersections before residents dump trash into storm gutters.
- **Acceptance Criteria:**
  - **GIVEN** NiMet weather radar predicts precipitation $\ge 50	ext{ mm}$ or storm surge probability $>75\%$ within a 48-hour window,
  - **WHEN** the weather webhook fires,
  - **THEN** the platform automatically activates the `PRE_STORM_SURGE_PROTOCOL`, issues dispatch orders for 150 emergency $11	ext{ m}^3$ skips across designated high-risk coordinates, and broadcasts automated voice/SMS warnings in Yoruba, Pidgin, and English urging residents not to dump waste into rainwater gutters.

### Epic 10.2: Primary Drainage Canal Optical Trash-Trap Camera Telemetry
Deploy AI computer-vision cameras over critical drainage canal culvert screens to detect and quantify hydraulic trash dam formation in real time.

#### User Story 10.2.1: Hydraulic Trash Dam Detection
- **As a** Drainage Network Engineer,
- **I want** optical trash-trap cameras to stream debris accumulation levels,
- **So that** mechanical excavator clearing crews are dispatched before water overflows canal banks.
- **Acceptance Criteria:**
  - **GIVEN** optical sensors positioned above System 63 Surulere canal bridge,
  - **WHEN** computer vision detects trash accumulation covering $>60\%$ of the hydraulic cross-sectional area,
  - **THEN** the system elevates the incident to `CRITICAL_DRAINAGE_BLOCKAGE` and dispatches the EFAG amphibious excavator squad to clear the culvert within 60 minutes.

### Epic 10.3: Section 102 EMPL Automated 5% LGA Revenue Allocation Ledger
Automate the transparent calculation and disbursement of the statutory 5% local government share directly to verified LGA Treasury Single Accounts.

#### User Story 10.3.1: LGA Revenue Transparency Dashboard
- **As an** Executive Chairman of a Local Government Area,
- **I want** a dedicated dashboard showing total waste tariffs collected within my LGA boundaries and my real-time 5% allocation,
- **So that** our council receives its statutory funds without political delay or manual lobbying.
- **Acceptance Criteria:**
  - **GIVEN** settled waste collection batches within an LGA boundary,
  - **WHEN** the monthly settlement clears,
  - **THEN** exactly 5.0% of gross receipts are credited to the LGA's verified Co-Treasury sub-account; the dashboard displays a breakdown by ward; the Chairman receives a formal monthly statutory statement under Section 102 EMPL.

### Epic 10.4: Multi-Channel Low-Tech Citizen Care (USSD, Voice IVR, WhatsApp)
Provide zero-data, low-tech reporting and billing channels accessible to every resident regardless of device type or literacy level.

#### User Story 10.4.1: USSD Blackspot Reporting
- **As a** Resident without a smartphone in Ajegunle,
- **I want** to dial a dedicated USSD short-code (`*384*22#`) to report an overflowing garbage skip,
- **So that** municipal authorities clear the waste without requiring mobile internet access.
- **Acceptance Criteria:**
  - **GIVEN** a resident dialing the short-code,
  - **WHEN** they select their LGA, ward, and issue type,
  - **THEN** a citizen service ticket is created with an SMS confirmation reference; the ticket is routed to the local PSP and ward officer with an automated 24-hour resolution SLA.

---

### Epic 10.5: Alimosho 6-LCDA Section 102 Revenue Allocation Pilot
Execute the inaugural statutory 5% revenue sharing formula across the 6 Local Council Development Areas of Alimosho prior to statewide rollout.

#### User Story 10.5.1: Alimosho LCDA Revenue Distribution
- **As an** Executive Chairman of Mosan-Okunola or Ikotun-Igando LCDA,
- **I want** our council to receive verified monthly 5% transfers from all domestic waste collections in our wards,
- **So that** our local environmental health officers (Wole-Wole) and street sweepers are funded directly by statute.
- **Acceptance Criteria:**
  - **GIVEN** monthly settled waste revenues in Alimosho LGA,
  - **WHEN** the Section 102 clearing runs on the 28th of each month,
  - **THEN** the system splits the 5% statutory allocation across the 6 LCDAs (Alimosho Central, Agbado/Oke-Odo, Ayobo-Ipaja, Egbe-Idimu, Ikotun-Igando, Mosan-Okunola) strictly based on verified cadastral collections within their spatial polygons, posting transparent ledger summaries to each Council Chairman's portal.

---

## 4. Technical Architecture, Schemas & Multi-Channel Pipeline

### 4.1 Multi-Channel Citizen Care & Drainage Telemetry Pipeline

```
[ Citizen Touchpoints ]
  ├── [ USSD Gateway (*384*22#) ] ──▶ Low-Tech / Feature Phone
  ├── [ Voice IVR (Yoruba / Pidgin / English / Hausa / Igbo) ]
  ├── [ WhatsApp Enterprise Bot ]
  └── [ Progressive Web App (PWA) ]
         │
         ▼
[ LAWMA Citizen Care Unified Message Bus ]
         │
         ├─────────────────────────────────────────────┐
         │ Missed Pickup / Billing Dispute             │ Drainage Trash Dam / Canal Overflow
         ▼                                             ▼
[ Automated 48-Hour Cure Ticket ]              [ EFAG Rapid Evacuation Dispatch ]
         │                                             ▲
         │                                             │
         │                               [ NiMet Weather Radar Telemetry ]
         │                                             │
         ▼                                             ▼
[ 5% Section 102 LGA Ledger Post ]             [ Pre-Storm Surge Protocol Skip Drop ]
```

### 4.2 Database Table Schema (PostgreSQL)

```sql
CREATE TABLE lga_section_102_ledgers (
    ledger_id VARCHAR(64) PRIMARY KEY, -- E.g., 'LEDG-LGA-SUR-202611'
    lga_id VARCHAR(32) NOT NULL,
    lcda_id VARCHAR(32) NOT NULL,
    settlement_month DATE NOT NULL,
    total_gross_collections_naira NUMERIC(14, 2) NOT NULL,
    statutory_lga_share_naira NUMERIC(14, 2) GENERATED ALWAYS AS (total_gross_collections_naira * 0.05) STORED,
    disbursement_status VARCHAR(32) NOT NULL DEFAULT 'ACCRUED' CHECK (disbursement_status IN ('ACCRUED', 'DISBURSED_TO_TSA', 'HELD_AUDIT')),
    disbursement_reference VARCHAR(64),
    disbursed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE (lga_id, lcda_id, settlement_month)
);

CREATE TABLE drainage_canals (
    canal_id VARCHAR(32) PRIMARY KEY, -- E.g., 'CNL-SYS-63-SUR'
    system_name VARCHAR(64) NOT NULL,
    primary_catchment_lga VARCHAR(32) NOT NULL,
    hydraulic_width_meters NUMERIC(5, 2) NOT NULL,
    culvert_cross_sectional_area_sqm NUMERIC(6, 2) NOT NULL,
    camera_sensor_id VARCHAR(32),
    current_debris_blockage_percent NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(32) NOT NULL DEFAULT 'FLOW_CLEAR' CHECK (status IN ('FLOW_CLEAR', 'MODERATE_ACCUMULATION', 'CRITICAL_DAM_RISK', 'OVERFLOWING'))
);

CREATE TABLE citizen_care_tickets (
    ticket_id VARCHAR(64) PRIMARY KEY, -- E.g., 'CIT-20261113-0941'
    channel VARCHAR(16) NOT NULL CHECK (channel IN ('USSD', 'VOICE_IVR', 'WHATSAPP', 'MOBILE_APP', 'WEB_PORTAL')),
    reporter_phone VARCHAR(16) NOT NULL,
    reporter_lasrra_id VARCHAR(32),
    lga_id VARCHAR(32) NOT NULL,
    ward_id VARCHAR(32) NOT NULL,
    issue_category VARCHAR(32) NOT NULL CHECK (issue_category IN ('MISSED_PICKUP', 'OVERFLOWING_SKIP', 'DRAINAGE_TRASH_DUMP', 'ILLEGAL_CART_PUSHER', 'BILLING_DISPUTE')),
    assigned_psp_id VARCHAR(32),
    sla_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    ticket_status VARCHAR(32) NOT NULL DEFAULT 'OPEN' CHECK (ticket_status IN ('OPEN', 'ASSIGNED', 'REMEDIATED', 'CLOSED', 'ESCALATED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_citizen_tickets_status ON citizen_care_tickets(ticket_status, sla_deadline);
CREATE INDEX idx_canal_debris ON drainage_canals(current_debris_blockage_percent);
```

---

## 5. Operational Realities & Field Defense Playbook

### 5.1 LGA Sanitation Clashes & Extortion Rings
- **Field Reality:** Aggressive local youth posing as LGA sanitation agents demand cash levies from shops and beat up PSP collectors.
- **Engineering Mitigation:** **Unified Digital Sanitation Certificate (QR Code).** Every compliant business receives a digital window decal QR code linked to the central cadastre. When scanned by any smartphone, it displays real-time compliance authenticated by both LAWMA and the relevant LGA Chairman. LGA officials are legally barred from issuing paper invoices; collections outside the system constitute extortion punishable under state criminal law.

### 5.2 Torrential Flash Floods Submerging Optical Trash Cameras
- **Field Reality:** Severe storms raise water levels above canal bridges, threatening to submerge or destroy optical sensors.
- **Engineering Mitigation:** Sensors are mounted on telescoping 6-meter galvanized steel pylons positioned well above maximum 100-year flood levels ($+2.5	ext{ m}$ freeboard), equipped with IP68 marine-grade optical lenses and hydrophobic rain-deflection coatings.

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Constitutional Harmony** | EMPL 2017 Sec. 102 / 1999 Constitution | 100% of 5% LGA allocations settled monthly to verified TSAs | Conference 57 / Auditor-General |
| **Flood Response** | Lagos Disaster Management SLA | Pre-storm skips deployed $\ge 36	ext{ hrs}$ prior to rain onset | EFAG / Lagos State Emergency (LASEMA) |
| **Citizen Inclusion** | Public Service Delivery Standard | Zero-data USSD/IVR uptime $\ge 99.8\%$ across all telco networks | Ministry of Science and Technology |
| **Executive Quorum** | Joint Inter-Governmental Mandate | Signed off by Hon. Rasheed Shabi, Comm. Wahab & Conf. 57 Chairman | Lagos State House of Assembly |
