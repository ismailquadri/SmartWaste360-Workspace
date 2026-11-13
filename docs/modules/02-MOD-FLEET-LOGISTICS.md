# PRODUCT LEVEL DOCUMENT: MODULE 02 (`MOD-02-FLEET-LOGISTICS`)
## Split-Operational Fleet, Modular Retrofit Telematics & Corridor Pre-Dispatch Engine

**Document Identifier:** LAWMA-PLD-MOD-02-FLEET-LOGISTICS  
**Document Version:** 3.1 (Retrofit Telematics & Alimosho Beachhead Edition)  
**System Target:** LAWMA Fleet Control Room, Modular Retrofit Telematics, GPS Corridor Geofencing, Pre-Dispatch Lock Engine  
**Statutory Foundation:** 2017 Lagos State Environmental Management and Protection Law (EMPL) Sec. 68–74; Lagos State Road Traffic Law (2012); Lagos State Public Procurement Law (2021)  
**Executive Boardroom Sponsor:** **Hon. Tokunbo Wahab**, Hon. Commissioner, Ministry of the Environment and Water Resources & **Dr. Kadri Obafemi Hamzat (KOH)**, Executive Governor  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Directorate of Fleet Management & Logistics
- **Enforcement Partner:** Lagos State Traffic Management Authority (LASTMA)
- **Ministry Oversight:** Ministry of Transportation (MOT) / MEWR Enforcement Taskforce
- **Operator Body:** Association of Waste Managers of Nigeria (AWAMN - Alimosho Zonal Branch)

---

## 1. Executive Context & Statutory Authority

Solid waste collection in a megacity of over 22 million residents with severe traffic density cannot rely on reactive, uncoordinated truck movements. Heavy compactor trucks (15–30 metric tons gross weight) operating during peak commuter hours cause arterial gridlock, road surface deterioration, and dangerous leachate spillage.

Under **`MANDATE-WAH-01`**, Hon. Commissioner Tokunbo Wahab ordered:
> *"A waste compactor truck is a heavy industrial vehicle carrying rotting organic matter. It must not roam the streets of Lagos at midday like a private saloon car. Mid-transit rerouting is banned. Every truck must have its daily route locked by 5:00 AM. When dumpsites queue up, trucks must be staged in off-highway holding hubs—such as our LASU-Iba corridor holding facility—rather than blocking highways and tempting drivers to cut GPS wires and dump 20 tons of filth on expressway medians."*

Furthermore, under the **Frugal Systems Engineering Directive (`MANDATE-KOH-05`)**, Governor Dr. Kadri Obafemi Hamzat mandated:
> *"We will not entertain multi-billion Naira capital requests to procure brand-new 'smart' compactor fleets from overseas. Lagos State already purchased 102 brand-new compactor trucks and 100 Dino bins under our administration, while AWAMN operators run over 600 active trucks. We will leverage what exists. We will engineer and deploy a low-cost, universal, tamper-evident Modular Retrofit Telematics Kit installed directly on our existing fleets and active AWAMN vehicles at less than ₦450,000 per truck. We will prove this in Alimosho LGA before touching any other zone."*

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In the legacy system, dispatch occurred haphazardly between 7:00 AM and 11:00 AM. When primary disposal facilities (e.g., Solous II in Igando) experienced long queues, automated or manual dispatchers attempted to redirect loaded compactors mid-transit across the metropolis (e.g., rerouting a truck from Solous II to Agege TLS).
This resulted in:
1. **The 4-Hour Traffic Nightmare:** A 20-ton compactor caught in bumper-to-bumper traffic between Igando and Agege burns 35+ liters of expensive automotive gas oil (diesel).
2. **Environmental Nuisance & Leachate Spillage:** Compactor leachate tanks fill to capacity and overflow onto expressways, corroding asphalt and releasing nauseating stenches in front of commuters.
3. **Driver Sabotage & Median Verge Dumping:** Frustrated, exhausted drivers intentionally sever the truck's 12V GPS antenna wire, drive into dark road stretches, and discharge 20 tons of putrid waste directly onto median verges or drainage channels before fleeing.
4. **The Procurement White Elephant Trap:** Historically, proposals to buy hundreds of new imported trucks resulted in massive foreign exchange drain (billions of Naira), 18-month customs clearing delays, and instant hostility from existing AWAMN private operators who felt targeted for displacement.

### 2.2 Financial & Hardware Economics: Retrofit vs. New Fleet Procurement

```
                       CAPITAL EXPENDITURE (CapEx) MODEL: 200 TRUCK FLEET
┌───────────────────────────────────────────────┬───────────────────────────────────────────────┐
│ OPTION A: PROCUREMENT OF NEW "SMART FLEETS"   │ OPTION B: MODULAR RETROFIT KITS ON FLEETS     │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ • Unit Cost: $135,000 – $170,000 per truck    │ • Heavy-Duty J1939 CAN-bus GPS Tracker: $85   │
│ • Naira Equivalent: ~₦216,000,000 per truck   │ • Hydraulic Blade / PTO Pressure Switch: $45  │
│ • Import Tariffs & Port Demurrage: +25%       │ • Rugged 8-inch Android Driver Tablet: $120   │
│ • 18–24 Month Import & Clearing Lead Time     │ • Cab Anti-Vibration Dock & 24V Power: $15    │
│ • Currency Risk: Billed in USD (FX drain)     │ • Local Auto-Electrician Installation: $30    │
├───────────────────────────────────────────────┼───────────────────────────────────────────────┤
│ TOTAL COST (200 TRUCKS):                      │ TOTAL COST (200 TRUCKS):                      │
│               ₦43.2 BILLION                   │                 ₦95.0 MILLION                 │
│               ($27,000,000 USD)               │                 ($59,000 USD)                 │
└───────────────────────────────────────────────┴───────────────────────────────────────────────┘
                SAVINGS TO LAGOS STATE: ₦43.1 BILLION (99.78% CapEx REDUCTION)
```

### 2.3 Empirical Backing Data & Evidence
- **Diesel Fuel Wastage:** Average of ₦45,000 in excess fuel burned per uncoordinated diversion.
- **Median Verge Discharges:** Over 140 documented midnight road-dumping events along the Oshodi-Apapa, Lagos-Badagry, and Ikorodu Road corridors in 2023 alone.
- **LASU-Igando Expressway Gridlock:** Uncontrolled queuing at Solous II dumpsite historically created truck queues of up to 2.4 km, halting traffic from LASU gate to Igando General Hospital for up to 6 hours.
- **Alimosho Beachhead Tonnage:** Alimosho LGA generates ~2,000 metric tons of waste daily (~15% of the state total); retrofitting 80 trucks servicing Alimosho captures 100% of this municipal flow.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 2.1: Modular Retrofit Telematics Kit Installation & CAN-Bus Ingestion
Equip existing state-owned LAWMA compactors and private AWAMN trucks with universal, plug-and-play telematics hardware capable of reading engine diagnostics and physical compaction cycles.

#### User Story 2.1.1: Physical Collection Verification via Hydraulic Blade PTO Transducer
- **As an** Anti-Fraud Waste Auditor,
- **I want** the system to record a collection event only when the compactor's hydraulic blade actually cycles,
- **So that** drivers cannot claim service completion by simply driving past houses without picking up waste.
- **Acceptance Criteria:**
  - **GIVEN** a retrofitted compactor on an assigned residential route,
  - **WHEN** the driver stops at a cadastral property point and activates the hydraulic packing lever,
  - **THEN** the PTO hydraulic pressure transducer pulses a `BLADE_CYCLE_CONFIRMED` event over the CAN-bus to the GPS tracker; the crew tablet matches the timestamp and coordinate within a 15-meter radius of the property and logs a verified physical pickup.

### Epic 2.2: 5:00 AM Depot Pre-Dispatch Locking Engine
Enforce a hard daily cutoff where all collection routes, assigned compactor IDs, crew manifests, and designated disposal facilities are locked into the system before dawn.

#### User Story 2.2.1: Automated Depot Pre-Dispatch Freeze
- **As a** LAWMA Operations Controller,
- **I want** all daily vehicle manifests frozen at 5:00 AM WAT,
- **So that** no driver can depart a depot without a verified, geofenced route and pre-assigned disposal slot.
- **Acceptance Criteria:**
  - **GIVEN** active compactor trucks in municipal or PSP depots,
  - **WHEN** the system clock reaches 05:00:00 WAT,
  - **THEN** all unassigned trucks are locked to `DEPOT_GROUNDED` status; trucks with verified manifests receive a cryptographically signed `DISPATCH_TOKEN`; departure without this token triggers an immediate unauthorized movement alert to LASTMA and LAWMA monitoring patrol.

### Epic 2.3: Fixed Geofenced Arterial Corridors & Reroute Invalidation
Abolish dynamic mid-transit diversions; trucks must follow fixed, pre-cleared transport corridors with zero mid-route changes allowed once loaded.

#### User Story 2.3.1: Corridor Violation Detection
- **As an** Environmental Enforcement Officer,
- **I want to** be automatically alerted if a loaded compactor leaves its pre-approved arterial corridor by more than 100 meters,
- **So that** illegal diversions or black-market dumping are interdicted within 15 minutes.
- **Acceptance Criteria:**
  - **GIVEN** a compactor in `CORRIDOR_EN_ROUTE` status,
  - **WHEN** its GPS position strays >100m outside its geofenced corridor polygon or stops for >15 minutes in an unauthorized zone,
  - **THEN** the system trips a `CORRIDOR_BREACH_ALERT`, pings the nearest KAI patrol unit, and flags the driver's electronic manifest.

### Epic 2.4: Off-Highway Holding Hub Management (LASU-Iba Corridor Hub)
Implement physical holding hub staging buffers to absorb disposal facility congestion without blocking public roadways.

#### User Story 2.4.1: Staging Buffer Routing
- **As a** Weighbridge Marshall at Solous II,
- **I want** arriving compactors to stage at the LASU-Iba Off-Highway Hub when landfill capacity is at active limit,
- **So that** trucks queue on government-controlled tarmac rather than blocking public expressways.
- **Acceptance Criteria:**
  - **GIVEN** Solous II active queue reaches 15 trucks,
  - **WHEN** incoming compactors cross the LASU-Iba corridor geofence,
  - **THEN** their in-cab navigation displays mandatory entry to `HUB-LASU-IBA`; gates admit trucks via automated ANPR cameras; trucks are called forward to the landfill in strictly sequenced batches of 5.

---

## 4. Technical Architecture, Schemas & Hardware Specifications

### 4.1 Modular Retrofit Telematics Kit Specification

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    UNIVERSAL MODULAR RETROFIT TELEMATICS PACK                   │
│                                (Cost: ~$280 / ₦445,000)                         │
└────────────────────────────────────────┬────────────────────────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────────┐
│ HEAVY-DUTY J1939 CAN  │ │ HYDRAULIC PTO SENSOR  │ │ RUGGED CREW TABLET (AER)  │
│ OBD-II TELEMATICS UNIT│ │ PRESSURE TRANSDUCER   │ │ 8-inch Android Kiosk Mode │
├───────────────────────┤ ├───────────────────────┤ ├───────────────────────────┤
│ • Ignition On/Off     │ │ • Clamped to hydraulic│ │ • Single-App Crew Manifest│
│ • Engine RPM & Fuel   │ │   packing arm lines   │ │ • Offline Route Guidance  │
│ • GPS Lat/Long (5Hz)  │ │ • Emits 12V pulse on  │ │ • Bluetooth Pair to CAN   │
│ • Internal Battery 24h│ │   each blade cycle    │ │ • In-Cab Anti-Vibe Cradle │
│ • Tamper Sensor Wire  │ │ • Verifies collection │ │ • ₦45k Local Swap Screen  │
└───────────────────────┘ └───────────────────────┘ └───────────────────────────┘
```

### 4.2 Database Table Schema (PostgreSQL / PostGIS)

```sql
CREATE TABLE fleet_vehicles (
    vehicle_id VARCHAR(32) PRIMARY KEY, -- E.g., 'TRK-ALM-0042'
    plate_number VARCHAR(16) NOT NULL UNIQUE,
    operator_id VARCHAR(32) NOT NULL, -- LAWMA Direct or AWAMN PSP ID
    chassis_number VARCHAR(64) NOT NULL,
    vehicle_ownership VARCHAR(32) NOT NULL CHECK (vehicle_ownership IN ('STATE_OWNED_NEW', 'STATE_OWNED_LEGACY', 'AWAMN_PRIVATE')),
    tare_weight_kg NUMERIC(8, 2) NOT NULL,
    max_payload_kg NUMERIC(8, 2) NOT NULL,
    has_retrofit_kit BOOLEAN NOT NULL DEFAULT TRUE,
    retrofit_kit_serial_number VARCHAR(64) UNIQUE,
    retrofit_installation_date DATE,
    has_hydraulic_blade_sensor BOOLEAN NOT NULL DEFAULT TRUE,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'MAINTENANCE', 'IMPOUNDED', 'DECOMMISSIONED')),
    assigned_beachhead_zone VARCHAR(32) DEFAULT 'ALIMOSHO_PILOT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_dispatch_manifests (
    manifest_id VARCHAR(64) PRIMARY KEY, -- E.g., 'MNF-20261113-TRK-0042'
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    dispatch_date DATE NOT NULL,
    driver_lasrra_id VARCHAR(32) NOT NULL,
    assigned_ward_id VARCHAR(32) NOT NULL,
    designated_disposal_facility_id VARCHAR(32) NOT NULL, -- E.g., 'DS-SOL-02'
    authorized_corridor_id VARCHAR(32) NOT NULL,
    lock_timestamp TIMESTAMP WITH TIME ZONE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    manifest_state VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (manifest_state IN ('DRAFT', 'LOCKED', 'EN_ROUTE', 'STAGED', 'DISCHARGED', 'ABORTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE compactor_blade_cycles (
    cycle_id BIGSERIAL PRIMARY KEY,
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    cycle_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    matched_cadastral_property_id VARCHAR(64) REFERENCES cadastral_properties(property_id),
    hydraulic_pressure_bar NUMERIC(5, 2) NOT NULL,
    is_valid_collection BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_blade_property ON compactor_blade_cycles(matched_cadastral_property_id, cycle_timestamp);
CREATE INDEX idx_vehicle_ownership ON fleet_vehicles(vehicle_ownership, assigned_beachhead_zone);
```

---

## 5. Phase 1: The Alimosho Fleet Roster (Beachhead Deployment)

### 5.1 Roster Composition (80 Retrofitted Trucks)
For the 90-day beachhead pilot across Alimosho LGA's 6 LCDAs, the fleet roster is composed exclusively of existing road-worthy assets retrofitted at the LAWMA Central Depot (Ijora):
- **40 State-Owned Newly Purchased Compactors:** Allocated from the 102 state-owned compactor fleet directly to high-density arterial routes (Ikotun-Igando, Mosan-Okunola, Agbado/Oke-Odo).
- **40 Verified AWAMN Private Compactors:** Selected from top-performing private operators licensed in Alimosho, retrofitted at zero upfront cost to the operator (funded via state pilot tech budget).
- **Total Initial Telematics Hardware Investment:** $80 	imes ₦445,000 = \mathbf{₦35.6	ext{ Million}}$ (less than 20% of the cost of buying a single new truck!).

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Pre-Dispatch Lock** | MEWR Operational Directive | 100% of Alimosho pilot vehicles locked by 05:00:00 WAT | LAWMA Directorate of Ops |
| **Collection Fidelity** | Physical Service Proof | Hydraulic blade cycle confirmed on $\ge 95\%$ of logged pickups | LAWMA Internal Audit |
| **Corridor Compliance** | Lagos State Road Traffic Law (2012) | >99.0% geofenced corridor fidelity on LASU-Igando axis | LASTMA / MEWR Enforcement |
| **CapEx Prudence** | Lagos State Public Procurement Law | 100% retrofit execution within ₦450,000/truck ceiling | Ministry of Finance / STO |
| **Executive Quorum** | Ministerial Order | Signed off by Comm. Wahab & MD Gbadegesin | MEWR / LAWMA Board |
