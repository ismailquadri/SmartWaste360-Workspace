# PRODUCT LEVEL DOCUMENT: MODULE 03 (`MOD-03-TLS-SCALE`)
## 10-Module TLS Lifecycle & Weighbridge Automation

**Document Identifier:** LAWMA-PLD-MOD-03-TLS-SCALE  
**Document Version:** 3.0 (Post-Executive Audit Comprehensive Edition)  
**System Target:** LAWMA Transfer Loading Stations (Simpson, Oshodi, Agege), Landfill Weighbridges, Edge Scale Brokers  
**Statutory Foundation:** 2017 Lagos State Environmental Management and Protection Law (EMPL) Sec. 75–80; Weights and Measures Act (Cap W3 LFN 2004)  
**Executive Boardroom Sponsor:** **Dr. Muyiwa Gbadegesin**, Managing Director / CEO, LAWMA  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Facilities & Infrastructure Directorate
- **Technical Partner:** Ministry of Science and Technology (MIST)
- **Scale Inspectorate:** Federal Ministry of Industry, Trade & Investment (Weights & Measures Division)
- **Power & Utilities:** Lagos State Electricity Board (LSEB) / Renewable Energy Unit

---

## 1. Executive Context & Statutory Authority

Transfer Loading Stations (TLS) and Landfill Weighbridges are the physical accounting cash-registers of solid waste management. Every financial settlement—from tipping fees paid by commercial entities to subsidy disbursements paid to private PSP operators—depends entirely on the mathematical difference between a truck's loaded weight (`GROSS_MASS`) and empty weight (`TARE_MASS`).

Under **`MANDATE-GBD-02`**, Managing Director Dr. Muyiwa Gbadegesin ordered:
> *"The entire waste billing system collapses if the weighbridge terminal goes down. Dumpsites and TLS facilities operate in environments with unstable national grid power and frequent cellular data outages. We cannot tolerate scale closures because NEPA took power or fiber cable was cut. The weighbridge system must achieve 100% offline edge survivability using local SQLite brokers backed by 72-hour solar-inverter microgrids. Furthermore, phantom weighbridge tickets must be permanently eradicated through automated scale serialization and dual optical barrier tripwires."*

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In the historical operations of Lagos dumpsites (Olushosun, Solous, Abule Egba, Epe):
1. **Phantom Ticket Fraud:** Corrupt weighbridge clerks issued pre-printed physical paper tickets to unverified or empty trucks. Rogue PSP operators redeemed these tickets for government collection subsidies without collecting a single kilogram of waste.
2. **Double-Weighing & Partial Platform Deception:** Truck drivers parked with their rear wheels off the scale deck during tare weigh-in, artificially inflating the calculated net waste weight by 3 to 6 metric tons per trip.
3. **Power Outages & Queuing Chaos:** When the electrical grid failed, generators ran out of diesel, or cloud internet servers dropped, weighbridge gates ground to a total halt. Trucks backed up onto public highways for miles, forcing operators to dump waste outside the facility gates.
4. **The 10-Module TLS Physical Flow Failure:** At modern Transfer Loading Stations (such as Simpson TLS or Oshodi TLS), waste is compacted into heavy sealed containers. Failure to synchronize the 10 distinct physical stages (from in-gate to compaction hopper to prime-mover trailer transfer) created bottlenecks that reduced TLS throughput by over 60%.

### 2.2 Empirical Backing Data & Evidence
- **Estimated Annual Phantom Ticket Losses:** Historical audit estimates indicate LAWMA lost over ₦850 million annually to fraudulent tipping vouchers and collusive weight under-reporting.
- **Weighbridge Downtime:** Legacy web-only weighbridge terminals suffered an average of 4.2 hours per week in downtime due to power or telecommunications failures.
- **Scale Accuracy Variance:** Manual scale logging exhibited an uncalibrated error margin of up to 14.2%, compared to the statutory standard of $\pm 1.5\%$.

### 2.3 Fraud Vectors & Attack Models
- **The "Tare Weight Inflation" Cartel:** Drivers carry concealed water tanks or concrete scrap metal during morning tare calibration, dumping the dead weight off-site before arriving at the dumpsite with a lighter truck, thus exaggerating the net waste payload.
- **Offline Nonce Tampering:** Corrupt facility clerks manipulate offline clocks on standalone computers to inject back-dated tickets during power outages.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 3.1: Zero-Downtime SQLite Edge Broker & 72-Hour Solar Inverter Orchestration
Deploy localized edge computers running hardened SQLite brokers at all weighbridge facilities, operating fully independently of internet connectivity with automatic cloud synchronization upon link restoration.

#### User Story 3.1.1: Autonomous Offline Ticketing
- **As a** Weighbridge Scale Operator at Epe Landfill,
- **I want to** weigh trucks and issue cryptographically signed digital tickets during complete internet and grid power outages,
- **So that** facility operations never halt and queues never back up onto the expressway.
- **Acceptance Criteria:**
  - **GIVEN** a total network failure and grid power blackout,
  - **WHEN** a loaded truck drives onto the weighbridge deck,
  - **THEN** the local scale terminal operates on its 72-hour solar-inverter battery; the local SQLite broker reads the scale indicator stream directly via RS-232/TCP; the ticket is generated with a cryptographic nonce (`TCK-OFFLINE-*`) and stored in an append-only local journal; tickets synchronize automatically to the Alausa sovereign cloud within 60 seconds of network reconnection.

### Epic 3.2: Automated Gross-Tare Mass Reconciliation & Anti-Fraud Tripwire
Automate mass calculation using optical vehicle positioning tripwires and verified vehicle tare registries.

#### User Story 3.2.1: Optical Tripwire Validation
- **As an** Anti-Fraud Auditor,
- **I want** the weighbridge scale to refuse weight capture if a vehicle is improperly positioned on the scale deck,
- **So that** partial-platform weight fraud is physically impossible.
- **Acceptance Criteria:**
  - **GIVEN** a compactor on the scale platform,
  - **WHEN** dual infrared barrier tripwires detect wheels breaking the front or rear perimeter beams,
  - **THEN** the weighbridge software locks the capture button, displays a visual repositioning warning, and refuses to emit a weight record until optical clearance is confirmed.

### Epic 3.3: 10-Module TLS Physical Stage Tracking
Track compactor trucks and sealed municipal containers through the mandatory 10-stage TLS physical lifecycle.

#### User Story 3.3.1: 10-Stage TLS Flow Orchestration
- **As a** TLS Operations Marshall at Simpson TLS,
- **I want to** monitor each container through all 10 operational modules in real time,
- **So that** compaction hopper jams and prime-mover dispatch delays are resolved immediately.
- **Acceptance Criteria:**
  - **GIVEN** a collection truck entering the TLS,
  - **WHEN** it progresses from Gate In (M1) to Scale Gross (M2), Traffic Marshall Deck (M3), Unloading Bay (M4), Compactor Hopper (M5), Container Tipping (M6), Scale Tare (M7), Washing Bay (M8), Gate Out (M9), and Prime-Mover Evacuation (M10),
  - **THEN** each milestone is recorded via RFID / ANPR scanners with exact timestamps, flagging any dwell time exceeding 6 minutes per stage.

---

## 4. Technical Architecture, Schemas & State Machines

### 4.1 10-Module TLS Physical State Transition Diagram

```
[M1: Gate-In Entry ANPR]
          │
          ▼
[M2: Inbound Weighbridge Gross Scale]
          │
          ▼
[M3: Traffic Marshall Deck Assignment]
          │
          ▼
[M4: Active Unloading Bay Spotting]
          │
          ▼
[M5: Hydraulic Compactor Hopper Charge]
          │
          ▼
[M6: Heavy Sealed Container Packing]
          │
          ▼
[M7: Outbound Weighbridge Tare Scale] ──▶ NET WEIGHT COMPUTED: Gross - Tare
          │
          ▼
[M8: Undercarriage & Leachate Disinfection Wash]
          │
          ▼
[M9: Gate-Out Digital Exit Manifest Clearance]
          │
          ▼
[M10: Prime-Mover Long-Haul Transfer to Remote Landfill (Epe/Badagry)]
```

### 4.2 SQLite Edge Broker Local Schema (Weighbridge Node)

```sql
-- SQLite Local Schema (Edge Scale Terminal)
CREATE TABLE offline_scale_tickets (
    ticket_id TEXT PRIMARY KEY, -- E.g., 'TCK-OFFLINE-SOL-20261113-0082'
    facility_id TEXT NOT NULL,
    vehicle_plate TEXT NOT NULL,
    gross_weight_kg REAL NOT NULL,
    tare_weight_kg REAL,
    net_weight_kg REAL,
    scale_in_timestamp TEXT NOT NULL,
    scale_out_timestamp TEXT,
    optical_tripwire_verified INTEGER NOT NULL DEFAULT 1,
    hash_chain_prev TEXT NOT NULL,
    signature_sha256 TEXT NOT NULL,
    is_synced INTEGER NOT NULL DEFAULT 0,
    synced_at TEXT
);

CREATE TABLE scale_hardware_calibrations (
    calibration_id TEXT PRIMARY KEY,
    terminal_id TEXT NOT NULL,
    calibrated_by TEXT NOT NULL,
    reference_mass_kg REAL NOT NULL,
    measured_mass_kg REAL NOT NULL,
    variance_percentage REAL NOT NULL,
    certified_timestamp TEXT NOT NULL
);
```

### 4.3 Central PostgreSQL Central Schema

```sql
CREATE TABLE weighbridge_tickets (
    ticket_id VARCHAR(64) PRIMARY KEY,
    facility_id VARCHAR(32) NOT NULL,
    terminal_id VARCHAR(32) NOT NULL,
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    driver_lasrra_id VARCHAR(32) NOT NULL,
    gross_weight_kg NUMERIC(8, 2) NOT NULL,
    tare_weight_kg NUMERIC(8, 2) NOT NULL,
    net_weight_kg NUMERIC(8, 2) GENERATED ALWAYS AS (gross_weight_kg - tare_weight_kg) STORED,
    scale_in_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    scale_out_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    is_offline_generated BOOLEAN NOT NULL DEFAULT FALSE,
    offline_nonce VARCHAR(64),
    cryptographic_seal_sha256 VARCHAR(64) NOT NULL,
    weighbridge_operator_id VARCHAR(32) NOT NULL,
    reconciliation_status VARCHAR(32) NOT NULL DEFAULT 'RECONCILED' CHECK (reconciliation_status IN ('RECONCILED', 'VARIANCE_FLAGGED', 'AUDIT_HOLD')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tickets_facility_time ON weighbridge_tickets(facility_id, scale_in_timestamp DESC);
CREATE INDEX idx_tickets_vehicle ON weighbridge_tickets(vehicle_id);
```

---

## 5. Operational Realities & Field Defense Playbook

### 5.1 Extended 5-Day Tropical Grid Outage & Diesel Fuel Rationing
- **Field Reality:** Severe grid power cuts coupled with fuel shortages ground municipal facility generators to a halt.
- **Engineering Mitigation:** Dual 10kVA solar-inverter systems equipped with 48V 400Ah deep-cycle lithium-iron-phosphate ($LiFePO_4$) battery arrays provide 72 hours of continuous power dedicated strictly to scale load cells, barrier gates, and low-power edge compute terminals.

### 5.2 Physical Assault on Facility Weighbridge Clerks by Disgruntled Haulers
- **Field Reality:** Commercial drivers whose trucks are rejected or assessed heavy tipping fees verbally or physically threaten scale operators.
- **Engineering Mitigation:** Zero-clerk automated weighing option. Drivers scan a pre-assigned RFID / QR card through an armored kiosk window. Dual ANPR cameras capture plate numbers and scale indicators automatically without human operator discretion.

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Metrological Accuracy** | Weights and Measures Act (Cap W3 LFN 2004) | Scale variance $\le \pm 1.5\%$ across 20-ton calibration check | Federal Weights & Measures Inspectorate |
| **Edge Survivability** | LAWMA Disaster Recovery SLA | 100% ticket capture across 72-hour simulated grid blackout | LAWMA Infrastructure Dept |
| **Fraud Prevention** | Evidence Act (2011) Section 84 | SHA-256 digital seals on 100% of offline and online tickets | Ministry of Justice / Auditor-General |
| **Executive Quorum** | Executive Boardroom Approval | Signed off by MD Gbadegesin & Gov. Hamzat | LAWMA Executive Council |
