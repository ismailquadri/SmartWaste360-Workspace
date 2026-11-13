# PRODUCT LEVEL DOCUMENT: MODULE 02 (`MOD-02-FLEET-LOGISTICS`)
## Split-Operational Fleet & Corridor Pre-Dispatch Engine

**Document Identifier:** LAWMA-PLD-MOD-02-FLEET-LOGISTICS  
**Document Version:** 3.0 (Post-Executive Audit Comprehensive Edition)  
**System Target:** LAWMA Fleet Control Room, GPS Corridor Geofencing, Pre-Dispatch Lock Engine  
**Statutory Foundation:** 2017 Lagos State Environmental Management and Protection Law (EMPL) Sec. 68–74; Lagos State Road Traffic Law (2012)  
**Executive Boardroom Sponsor:** **Hon. Tokunbo Wahab**, Hon. Commissioner, Ministry of the Environment and Water Resources  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Directorate of Fleet Management & Logistics
- **Enforcement Partner:** Lagos State Traffic Management Authority (LASTMA)
- **Ministry Oversight:** Ministry of Transportation (MOT) / MEWR Enforcement Taskforce
- **Operator Body:** Association of Waste Managers of Nigeria (AWAMN)

---

## 1. Executive Context & Statutory Authority

Solid waste collection in a megacity of over 22 million residents with severe traffic density cannot rely on reactive, uncoordinated truck movements. Heavy compactor trucks (15–30 metric tons gross weight) operating during peak commuter hours cause arterial gridlock, road surface deterioration, and dangerous leachate spillage.

Under **`MANDATE-WAH-01`**, Hon. Commissioner Tokunbo Wahab ordered:
> *"A waste compactor truck is a heavy industrial vehicle carrying rotting organic matter. It must not roam the streets of Lagos at midday like a private saloon car. Mid-transit rerouting is banned. Every truck must have its daily route locked by 5:00 AM. When dumpsites queue up, trucks must be staged in off-highway holding hubs—such as our LASU-Iba corridor holding facility—rather than blocking highways and tempting drivers to cut GPS wires and dump 20 tons of filth on expressway medians."*

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In the legacy system, dispatch occurred haphazardly between 7:00 AM and 11:00 AM. When primary disposal facilities (e.g., Solous II in Igando or Olushosun in Ojota) experienced long queues, automated or manual dispatchers attempted to redirect loaded compactors mid-transit across the metropolis (e.g., rerouting a truck from Solous II to Agege TLS).
This resulted in:
1. **The 4-Hour Traffic Nightmare:** A 20-ton compactor caught in bumper-to-bumper traffic between Igando and Agege burns 35+ liters of expensive automotive gas oil (diesel).
2. **Environmental Nuisance & Leachate Spillage:** Compactor leachate tanks fill to capacity and overflow onto expressways, corroding asphalt and releasing nauseating stenches in front of commuters.
3. **Driver Sabotage & Median Verge Dumping:** Frustrated, exhausted drivers intentionally sever the truck's 12V GPS antenna wire, drive into dark road stretches, and discharge 20 tons of putrid waste directly onto median verges or drainage channels before fleeing.
4. **LASTMA Extortion & Impoundment:** Compactors operating without verified digital corridor passes are routinely impounded by overzealous local traffic officers, triggering operator strikes.

### 2.2 Empirical Backing Data & Evidence
- **Diesel Fuel Wastage:** Average of ₦45,000 in excess fuel burned per uncoordinated diversion.
- **Median Verge Discharges:** Over 140 documented midnight road-dumping events along the Oshodi-Apapa, Lagos-Badagry, and Ikorodu Road corridors in 2023 alone.
- **LASU-Igando Expressway Gridlock:** Uncontrolled queuing at Solous II dumpsite historically created truck queues of up to 2.4 km, halting traffic from LASU gate to Igando General Hospital for up to 6 hours.

### 2.3 Fraud Vectors & Attack Models
- **The "Bribe-and-Dump" Vector:** Commercial factories pay private PSP drivers cash to collect unmanifested industrial waste and dump it illegally during unauthorized transit deviations.
- **Fuel Siphoning & Fake Breakdown:** Drivers stop in unauthorized dark zones, siphon diesel into jerrycans for black-market sale, and report a fake "engine breakdown" on the radio.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 2.1: 5:00 AM Depot Pre-Dispatch Locking Engine
Enforce a hard daily cutoff where all collection routes, assigned compactor IDs, crew manifests, and designated disposal facilities are locked into the system before dawn.

#### User Story 2.1.1: Automated Depot Pre-Dispatch Freeze
- **As a** LAWMA Operations Controller,
- **I want** all daily vehicle manifests frozen at 5:00 AM WAT,
- **So that** no driver can depart a depot without a verified, geofenced route and pre-assigned disposal slot.
- **Acceptance Criteria:**
  - **GIVEN** active compactor trucks in municipal or PSP depots,
  - **WHEN** the system clock reaches 05:00:00 WAT,
  - **THEN** all unassigned trucks are locked to `DEPOT_GROUNDED` status; trucks with verified manifests receive a cryptographically signed `DISPATCH_TOKEN`; departure without this token triggers an immediate unauthorized movement alert to LASTMA and LAWMA monitoring patrol.

### Epic 2.2: Fixed Geofenced Arterial Corridors & Reroute Invalidation
Abolish dynamic mid-transit diversions; trucks must follow fixed, pre-cleared transport corridors with zero mid-route changes allowed once loaded.

#### User Story 2.2.1: Corridor Violation Detection
- **As an** Environmental Enforcement Officer,
- **I want to** be automatically alerted if a loaded compactor leaves its pre-approved arterial corridor by more than 100 meters,
- **So that** illegal diversions or black-market dumping are interdicted within 15 minutes.
- **Acceptance Criteria:**
  - **GIVEN** a compactor in `CORRIDOR_EN_ROUTE` status,
  - **WHEN** its GPS position strays >100m outside its geofenced corridor polygon or stops for >15 minutes in an unauthorized zone,
  - **THEN** the system trips a `CORRIDOR_BREACH_ALERT`, pings the nearest KAI patrol unit, and flags the driver's electronic manifest.

### Epic 2.3: Off-Highway Holding Hub Management (LASU-Iba Corridor Hub)
Implement physical holding hub staging buffers to absorb disposal facility congestion without blocking public roadways.

#### User Story 2.3.1: Staging Buffer Routing
- **As a** Weighbridge Marshall at Solous II,
- **I want** arriving compactors to stage at the LASU-Iba Off-Highway Hub when landfill capacity is at active limit,
- **So that** trucks queue on government-controlled tarmac rather than blocking public expressways.
- **Acceptance Criteria:**
  - **GIVEN** Solous II active queue reaches 15 trucks,
  - **WHEN** incoming compactors cross the LASU-Iba corridor geofence,
  - **THEN** their in-cab navigation displays mandatory entry to `HUB-LASU-IBA`; gates admit trucks via automated ANPR cameras; trucks are called forward to the landfill in strictly sequenced batches of 5.

---

## 4. Technical Architecture, Schemas & State Machines

### 4.1 Fleet Dispatch & Corridor State Machine

```
┌───────────────────────┐
│   DEPOT_STATIONARY    │
└───────────┬───────────┘
            │ 05:00 AM Manifest Lock & Verification
            ▼
┌───────────────────────┐
│   DISPATCH_LOCKED     │
└───────────┬───────────┘
            │ In-Cab Driver Login & Vehicle Gate-Out
            ▼
┌───────────────────────┐
│  ON_COLLECTION_ROUTE  │ ──▶ [ Geofence Breach > 100m ] ──▶ ALERT: KAI Rapid Response
└───────────┬───────────┘
            │ Collection Finished; Leachate Valve Sealed
            ▼
┌───────────────────────┐
│   CORRIDOR_EN_ROUTE   │
└───────────┬───────────┘
            ├─────────────────────────────────────────┐
            │ Dumpsite Normal (<15 trucks)             │ Dumpsite Congested (≥15 trucks)
            ▼                                         ▼
┌───────────────────────┐                 ┌───────────────────────┐
│   WEIGHBRIDGE_SCALE   │                 │   HOLDING_HUB_QUEUED  │ (LASU-Iba Hub)
└───────────┬───────────┘                 └───────────┬───────────┘
            │ Active Face Tipped                      │ Sequenced Batch Release
            ▼                                         │
┌───────────────────────┐                             │
│   DISCHARGE_COMPLETE  │ ◀───────────────────────────┘
└───────────────────────┘
```

### 4.2 Database Table Schema (PostgreSQL / PostGIS)

```sql
CREATE TABLE fleet_vehicles (
    vehicle_id VARCHAR(32) PRIMARY KEY, -- E.g., 'TRK-LAWMA-0412'
    plate_number VARCHAR(16) NOT NULL UNIQUE,
    operator_id VARCHAR(32) NOT NULL, -- LAWMA Direct or AWAMN PSP ID
    chassis_number VARCHAR(64) NOT NULL,
    tare_weight_kg NUMERIC(8, 2) NOT NULL,
    max_payload_kg NUMERIC(8, 2) NOT NULL,
    has_leachate_tank BOOLEAN NOT NULL DEFAULT TRUE,
    gps_imei VARCHAR(32) NOT NULL UNIQUE,
    operational_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (operational_status IN ('ACTIVE', 'MAINTENANCE', 'IMPOUNDED', 'DECOMMISSIONED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE daily_dispatch_manifests (
    manifest_id VARCHAR(64) PRIMARY KEY, -- E.g., 'MNF-20261113-TRK-0412'
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    dispatch_date DATE NOT NULL,
    driver_lasrra_id VARCHAR(32) NOT NULL,
    assigned_ward_id VARCHAR(32) NOT NULL,
    designated_disposal_facility_id VARCHAR(32) NOT NULL,
    authorized_corridor_id VARCHAR(32) NOT NULL,
    lock_timestamp TIMESTAMP WITH TIME ZONE,
    is_locked BOOLEAN NOT NULL DEFAULT FALSE,
    manifest_state VARCHAR(32) NOT NULL DEFAULT 'DRAFT' CHECK (manifest_state IN ('DRAFT', 'LOCKED', 'EN_ROUTE', 'STAGED', 'DISCHARGED', 'ABORTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE gps_telemetry_heartbeats (
    heartbeat_id BIGSERIAL PRIMARY KEY,
    vehicle_id VARCHAR(32) NOT NULL REFERENCES fleet_vehicles(vehicle_id),
    recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
    coordinates GEOMETRY(Point, 4326) NOT NULL,
    speed_kmh NUMERIC(5, 2) NOT NULL,
    heading_deg NUMERIC(5, 2) NOT NULL,
    is_corridor_compliant BOOLEAN NOT NULL DEFAULT TRUE,
    battery_voltage NUMERIC(4, 2) NOT NULL,
    tamper_sensor_active BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE INDEX idx_gps_vehicle_time ON gps_telemetry_heartbeats(vehicle_id, recorded_at DESC);
```

---

## 5. Operational Realities & Field Defense Playbook

### 5.1 Street "Agbero" & Illegal Extortion Checkpoints
- **Field Reality:** Local youth and illegal toll collectors attempt to stop compactor trucks along commercial transport corridors demanding informal "environmental passing dues."
- **Engineering Mitigation:** Every dispatched vehicle receives a digital LASTMA/LAWMA Corridor Clearance QR code displayed on in-cab ruggedized screens. Trucks carry a direct panic button connected to KAI Oshodi Taskforce; illegal interception triggers a high-priority law enforcement response under Section 88 of the EMPL.

### 5.2 Heavy Vehicle Breakdown on Major Arterial Bridges (Third Mainland / Eko Bridge)
- **Field Reality:** Engine failure on high-speed bridges causes immediate catastrophic gridlock.
- **Engineering Mitigation:** Automatic detection via telemetry (zero speed for >5 minutes on bridge polygon). System automatically dispatches heavy-duty recovery tow trucks from LAWMA Rapid Intervention Base within 15 minutes, clearing the roadway before rush-hour congestion peaks.

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Pre-Dispatch Lock** | MEWR Operational Directive | 100% of vehicles locked by 05:00:00 WAT | LAWMA Directorate of Ops |
| **Corridor Compliance** | Lagos State Road Traffic Law (2012) | >99.0% geofenced corridor fidelity | LASTMA / MEWR Enforcement |
| **Holding Hub Staging** | Environmental Sanitation Regulations | Zero compactor queuing on public expressway lanes | Lagos State Safety Commission |
| **Executive Quorum** | Ministerial Order | Signed off by Comm. Wahab & MD Gbadegesin | MEWR / LAWMA Board |
