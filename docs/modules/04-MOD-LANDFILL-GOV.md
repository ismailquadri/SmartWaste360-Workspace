# PRODUCT LEVEL DOCUMENT: MODULE 04 (`MOD-04-LANDFILL-GOV`)
## Landfill Capacity, Turnaround SLA & Active Face Governance

**Document Identifier:** LAWMA-PLD-MOD-04-LANDFILL-GOV  
**Document Version:** 3.0 (Post-Executive Audit Comprehensive Edition)  
**System Target:** LAWMA Landfill Control Room (Olushosun, Solous II, Epe, Badagry), Quota Allocator, Tipping Marshall Engine  
**Statutory Foundation:** 2017 Lagos State Environmental Management and Protection Law (EMPL) Sec. 75–83; National Environmental Standards and Regulations Enforcement Agency (NESREA) Act Sec. 7  
**Executive Boardroom Sponsor:** **Hon. Tokunbo Wahab**, Hon. Commissioner, Ministry of the Environment and Water Resources & **Dr. Muyiwa Gbadegesin**, MD LAWMA  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Directorate of Landfill & Waste Disposal Facilities
- **Regulatory Partner:** Lagos State Environmental Protection Agency (LASEPA)
- **Aviation Safety:** Federal Airports Authority of Nigeria (FAAN - Bird Hazard Mitigation Unit)
- **Local Host Communities:** Alimosho LGA (Solous), Ikeja / Kosofe LGA (Olushosun), Epe LGA

---

## 1. Executive Context & Statutory Authority

Dumpsites in Lagos State operate at the fragile intersection of urban carrying capacity, public health, and environmental safety. Solous II (located along the densely populated LASU-Igando road in Alimosho LGA) is severely overextended, operating years beyond its original design lifespan and encroaching upon residential settlements, hospitals, and university campuses.

Under **`MANDATE-WAH-01`**, Hon. Commissioner Tokunbo Wahab mandated:
> *"Solous II cannot absorb infinite waste. An unmanaged dumpsite becomes a public hazard and an expressway bottleneck. Solous II is placed on a non-negotiable daily cap of 100 compactor trucks per day. Furthermore, trucks cannot spend half their working day stuck in dumpsite mud; turnaround time from in-gate to out-gate must not exceed 45 minutes. Any facility marshall or compactor exceeding these limits directly disrupts municipal logistics and will face disciplinary action."*

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In the historical operations of Lagos disposal sites:
1. **Solous II Overcapacity & Traffic Paralysis:** Solous II regularly accepted 180 to 220 compactors per day. Trucks queued for over 2 kilometers down the LASU-Igando expressway, paralyzing traffic for commuters, emergency ambulances heading to Igando General Hospital, and LASU students.
2. **Turnaround SLA Paralysis & Stuck Trucks:** Inside the facility, lack of compacted access roads meant trucks sank to their axles in mud during the rainy season. Average turnaround time ballooned to 3 to 6 hours per compactor, slashing daily collection frequencies across Alimosho and Ikeja by more than 50%.
3. **The Plant Wet-Lease Cartel:** Heavy earthmoving machinery (bulldozers, excavators, compactors) at dumpsites were frequently procured via opaque private wet-leases. Corrupt operators signed off on hourly fuel and rental invoices for machines that were parked broken-down, leaving active tipping faces uncompacted.
4. **Secondary Residue Reject Dumping (`MAT-RES-*`):** Private recycling facilities and Materials Recovery Facilities (MRFs) dumped hazardous secondary sorting residues and toxic non-recyclable process dross onto municipal domestic active faces without paying specialized tipping surcharges.

### 2.2 Empirical Backing Data & Evidence
- **Peak Unmanaged Volume at Solous II:** Up to 220 trucks/day (approx. 2,600 metric tons/day), causing slope instability and high leachate head pressure.
- **Enforced Target Cap:** 100 trucks/day maximum (approx. 1,200 metric tons/day), redirecting excess volume to Epe landfill or regional Transfer Loading Stations.
- **Turnaround Degradation:** Historical average of 185 minutes inside dumpsites during rainy months; target SLA under this specification is $\le 45	ext{ minutes}$.
- **Aviation Bird Strikes:** Solous and Olushosun proximity to aviation approach paths (Muritala Muhammed International Airport) historically created serious bird-strike risks due to uncompacted open organic waste faces attracting vultures and scavenging birds.

### 2.3 Fraud Vectors & Attack Models
- **Quota Token Scalping:** Corrupt gate marshalls issue off-the-record paper tokens to private commercial haulers for cash, bumping legitimate municipal PSP trucks from the daily 100-slot quota.
- **The "Tipping and Run" Mud Violation:** Compactor drivers dump waste directly on access access ramps rather than proceeding to the designated active tipping face, blocking subsequent trucks from entering.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 4.1: Solous II 100 Trucks/Day Hard Cap Quota Allocation Engine
Implement a deterministic token-bucket reservation and gating engine that allocates exactly 100 disposal slots across authorized municipal wards and rejects unreserved arrivals.

#### User Story 4.1.1: Dynamic Daily Slot Allocation
- **As a** LAWMA Disposal Planning Director,
- **I want** the system to distribute the 100 daily Solous II slots proportionally across high-density Alimosho collection zones,
- **So that** daily landfill arrivals never exceed 100 trucks and local expressways remain completely clear.
- **Acceptance Criteria:**
  - **GIVEN** the start of a calendar dispatch day (00:00:00 WAT),
  - **WHEN** the allocation algorithm runs,
  - **THEN** it provisions exactly 100 cryptographically signed `LANDFILL_SLOT_TOKEN` items across approved compactor IDs; when slot #100 is checked in at the weighbridge, the facility gate system locks automatically, displaying `CAPACITY_REACHED` on public LED signage, and rejecting any further trucks without ministerial override.

### Epic 4.2: 45-Minute In-Gate to Out-Gate Turnaround SLA Clock
Track compactor dwell time from initial gross weighbridge scale-in to final tare weighbridge scale-out, triggering real-time marshaling interventions when dwell time exceeds 30 minutes.

#### User Story 4.2.1: Turnaround SLA Monitoring
- **As a** Dumpsite Traffic Marshall,
- **I want** a real-time countdown timer for every vehicle inside the landfill perimeter,
- **So that** stuck or delayed trucks are towed or repositioned before exceeding the 45-minute threshold.
- **Acceptance Criteria:**
  - **GIVEN** a compactor completing gross weigh-in,
  - **WHEN** dwell time inside the active tipping zone reaches 30 minutes,
  - **THEN** an amber warning pings the marshall's ruggedized tablet; if dwell time hits 45 minutes, a red SLA breach incident is recorded, notifying the MD LAWMA and dispatching the on-site recovery bulldozer.

### Epic 4.3: Secondary Residue Reject Tracking (`MAT-RES-*`)
Enforce distinct classification, weighbridge surcharges, and dedicated disposal zones for industrial rejects and MRF sorting residues.

#### User Story 4.3.1: Reject Manifest Verification
- **As a** Landfill Environmental Inspector,
- **I want** all non-domestic sorting residues flagged with material code `MAT-RES-*`,
- **So that** recycling plants cannot dump industrial residues under domestic municipal waste rates.
- **Acceptance Criteria:**
  - **GIVEN** a hauler arriving from a private recycling or sorting plant,
  - **WHEN** the scale operator selects material code `MAT-RES-*`,
  - **THEN** the system applies a 2.5x industrial tipping surcharge and directs the vehicle to the engineered secondary residue cell rather than the municipal active face.

---

## 4. Technical Architecture, Schemas & State Machines

### 4.1 Landfill Tipping & Turnaround State Machine

```
┌─────────────────────────────────┐
│   ARRIVAL AT FACILITY GATES     │
└────────────────┬────────────────┘
                 │ Verify Pre-Allocated Daily Slot Token (1 of 100)
                 ▼
┌─────────────────────────────────┐
│   WEIGHBRIDGE GROSS SCALE-IN    │ ──▶ [ SLA CLOCK STARTS: T = 00:00 ]
└────────────────┬────────────────┘
                 │ Assigned to Active Face Marshall
                 ▼
┌─────────────────────────────────┐
│     ACTIVE FACE TIPPING BAY     │
└────────────────┬────────────────┘
                 │ Hydraulic Ejection Complete; Visual Inspection
                 ▼
┌─────────────────────────────────┐
│   UNDERCARRIAGE TIRE WASH BAY   │ ──▶ Neutralize Odor; Disinfect Tires
└────────────────┬────────────────┘
                 │ Proceed to Exit Scale
                 ▼
┌─────────────────────────────────┐
│   WEIGHBRIDGE TARE SCALE-OUT    │ ──▶ [ SLA CLOCK STOPS: Check T ≤ 45:00 ]
└────────────────┬────────────────┘
                 │
                 ├──────────────────────────┐
                 │ SLA Met (T ≤ 45 min)     │ SLA Breached (T > 45 min)
                 ▼                          ▼
┌─────────────────────────────────┐ ┌─────────────────────────────────┐
│   GATE-OUT MANIFEST CLEARED     │ │ INCIDENT LOGGED: Marshall Alert │
└─────────────────────────────────┘ └─────────────────────────────────┘
```

### 4.2 Database Table Schema (PostgreSQL)

```sql
CREATE TABLE landfills (
    landfill_id VARCHAR(32) PRIMARY KEY, -- E.g., 'DS-SOL-02' (Solous II)
    facility_name VARCHAR(128) NOT NULL,
    lga_id VARCHAR(32) NOT NULL,
    daily_compactor_cap INTEGER NOT NULL DEFAULT 100,
    turnaround_target_minutes INTEGER NOT NULL DEFAULT 45,
    active_face_count INTEGER NOT NULL DEFAULT 2,
    has_tire_wash_facility BOOLEAN NOT NULL DEFAULT TRUE,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'CAPACITY_REACHED', 'WEATHER_SUSPENDED', 'DECOMMISSIONED'))
);

CREATE TABLE landfill_daily_quotas (
    quota_id VARCHAR(64) PRIMARY KEY, -- E.g., 'QTA-SOL-20261113'
    landfill_id VARCHAR(32) NOT NULL REFERENCES landfills(landfill_id),
    quota_date DATE NOT NULL,
    max_slots INTEGER NOT NULL DEFAULT 100,
    slots_allocated INTEGER NOT NULL DEFAULT 0,
    slots_consumed INTEGER NOT NULL DEFAULT 0,
    is_cap_locked BOOLEAN NOT NULL DEFAULT FALSE,
    ministerial_override_reason TEXT,
    UNIQUE (landfill_id, quota_date)
);

CREATE TABLE turnaround_sla_records (
    sla_record_id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL UNIQUE,
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    landfill_id VARCHAR(32) NOT NULL REFERENCES landfills(landfill_id),
    scale_in_time TIMESTAMP WITH TIME ZONE NOT NULL,
    scale_out_time TIMESTAMP WITH TIME ZONE NOT NULL,
    dwell_duration_seconds INTEGER GENERATED ALWAYS AS (EXTRACT(EPOCH FROM (scale_out_time - scale_in_time))::INTEGER) STORED,
    sla_status VARCHAR(32) NOT NULL CHECK (sla_status IN ('COMPLIANT', 'BREACHED')),
    marshall_officer_lasrra_id VARCHAR(32) NOT NULL,
    delay_cause_category VARCHAR(64) CHECK (delay_cause_category IN ('NONE', 'BULLDOZER_JAM', 'ROAD_SLUDGE', 'TIRE_PUNCTURE', 'DRIVER_DELAY')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_turnaround_landfill_date ON turnaround_sla_records(landfill_id, scale_in_time);
```

---

## 5. Operational Realities & Field Defense Playbook

### 5.1 Tropical Torrential Downpour & Road Sludge Paralysis
- **Field Reality:** Heavy downpours turn dumpsite roads into impassable clay soup, causing 30-ton compactor trucks to become bogged down, snapping axles, and trapping all following trucks.
- **Engineering Mitigation:** Automated Weather Gating. Upon NiMet rain alerts ($>25	ext{ mm/hr}$), the system automatically triggers delivery of pre-crushed construction and demolition rubble (`MAT-RD-STONE`) to active access haul tracks. Standby heavy-tracked D8 bulldozers are required to log automated operational heartbeats every 15 minutes.

### 5.2 Host Community Road Blockades
- **Field Reality:** Local resident youth in Igando threaten to block landfill gates due to odor or road traffic congestion.
- **Engineering Mitigation:** Real-time public transparency dashboard displayed at the community palace and CDA office showing live queue counts, compliance with the 100-truck hard cap, and daily laterite capping delivery volumes (`MAT-CAP-*`).

---

### 5.3 Alimosho Beachhead Corridor Gating (Solous II Pilot)
- **Field Reality:** 80% of trucks entering Solous II originate from within Alimosho LGA's 6 LCDAs.
- **Engineering Mitigation:** The Solous II weighbridge system is linked in real-time to the 80 retrofitted Alimosho compactor trucks. The 100 daily quota slots are partitioned: 70 slots reserved exclusively for Alimosho LCDA compactors (10–12 slots per LCDA), and 30 slots for inter-zonal transfer trailers. Trucks arriving from Alimosho without a verified pre-dispatch token are held at the LASU-Iba staging hub before reaching the landfill access road.

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Cap Enforcement** | Ministerial Directives / EMPL 2017 | Exactly $\le 100$ compactor trucks admitted per calendar day | MEWR Enforcement Taskforce |
| **Turnaround SLA** | LAWMA Operational Regulations | Average turnaround $\le 45	ext{ minutes}$; compliance $\ge 90\%$ | LAWMA Internal Audit |
| **Aviation Hazard** | FAAN Bird Strike Safety Manual | Zero open uncompacted organic faces overnight | FAAN Safety Directorate |
| **Executive Quorum** | Joint Environmental Order | Signed off by Comm. Wahab & MD Gbadegesin | MEWR / LAWMA Board |
