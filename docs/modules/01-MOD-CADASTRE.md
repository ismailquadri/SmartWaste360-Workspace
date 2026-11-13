# PRODUCT LEVEL DOCUMENT: MODULE 01 (`MOD-01-CADASTRE`)
## Sovereign Cadastral Asset, Property & Resident Identity Registry

**Document Identifier:** LAWMA-PLD-MOD-01-CADASTRE  
**Document Version:** 3.0 (Post-Executive Audit Comprehensive Edition)  
**System Target:** LAWMA Authority Workspace (`LAWMA v2`), Cadastre Ingestion Engine, Citizen Registry  
**Statutory Foundation:** 2017 Lagos State Environmental Management and Protection Law (EMPL) Sec. 62–82; Nigeria Data Protection Act (NDPA 2023) Sec. 39; Lagos State Land Registration Law (2015)  
**Executive Boardroom Sponsor:** **Dr. Kadri Obafemi Hamzat (KOH)**, Executive Governor of Lagos State  
**Lead & Inter-Agency Matrix:**
- **Lead Agency:** LAWMA Commercial Directorate & Billing Clearinghouse
- **Co-Regulator:** Lands Bureau / Lagos State Geographic Information System (LAGIS)
- **Identity Partner:** Lagos State Residents Registration Agency (LASRRA)
- **Tax & Revenue Partner:** Lagos Internal Revenue Service (LIRS - Land Use Charge Unit)
- **Physical Planning:** Lagos State Physical Planning Permit Authority (LASPPPA)

---

## 1. Executive Context & Statutory Authority

Under the 2017 Lagos State Environmental Management and Protection Law (EMPL), every occupier of a tenement, commercial premises, or industrial facility in Lagos State is legally obligated to register with LAWMA and pay the prescribed domestic or commercial waste management tariffs. However, digital systems that operate on unverified, floating customer addresses fail in court, create ghost billings, and encourage massive revenue leakage.

Under **`MANDATE-KOH-02`**, Governor Dr. Kadri Obafemi Hamzat mandated:
> *"A waste billing registry that operates on unverified user-typed addresses is a legal nullity. Every property (`PROP-*`) must possess an immutable, foreign-key link to the Lagos State Geographic Information System (`LASG-CAD-ID`). Furthermore, billing cannot float on anonymous residents; every primary billing contact must be authenticated against the Lagos State Residents Registration Agency (LASRRA ID). If a tenant defaults or moves, the property cadastre preserves liability against the physical land parcel."*

This module establishes the sovereign cadastral and identity backbone of the entire LAWMA SmartWaste360 ecosystem.

---

## 2. Problem Space, Political Economy & Empirical Ground Truth

### 2.1 The Legacy Failure Mode
In the legacy operations of LAWMA and private PSP operators, property registers were maintained in paper ledger notebooks or disconnected Excel spreadsheets. Addresses were recorded ambiguously (e.g., *"Beside the Transformer, Opposite Baba Alata Shop, Bariga"*). 
This resulted in:
1. **Ghost Properties:** PSP operators generating hundreds of fake addresses to inflate theoretical coverage zones and claim government subsidies.
2. **Duplicate Billings:** Simultaneous billing of the same compound by both LAWMA and the local LCDA sanitation department under different names.
3. **The Multi-Tenant Tenement Dilemma:** In traditional multitenant Brazilian "face-me-I-face-you" tenements (common in Mushin, Somolu, Ajegunle, Agege, and Orile), one physical parcel houses 8 to 24 distinct families. When a single flat bill is served to the building, individual tenants argue over payment shares, the absentee landlord abdicates responsibility, and zero revenue is collected.
4. **The "Ambode Ghost" & Concessionaire Friction:** Private PSP operators fear that state-managed digital registration will strip them of their client ownership and allow the state to reallocate profitable commercial routes to favored political elites.

### 2.2 Empirical Backing Data & Evidence
- **Total Real Property Structures in Lagos State:** Estimated at 4.2 million structures (LAGIS 2023 LiDAR baseline).
- **Structures Formally Billed by Legacy Waste System:** Only 1.1 million structures (~26.1% formal capture).
- **Estimated Annual Tariff Leakage:** Over ₦22.4 billion in uncollected or grey-market waste fees across unmapped residential and commercial corridors.
- **Tribunal Billing Disputes:** 63% of billing disputes brought before the LAWMA Public Complaints Tribunal arise from shared tenement disputes, vacant plot billing, and unverified customer name mismatches.

### 2.3 Fraud Vectors & Attack Models
- **The "Vacant Plot" Siphon:** Corrupt field collectors classify inhabited residential apartment buildings as "undeveloped land" in exchange for cash bribes, pocketing monthly cash settlements while reporting zero waste generation to the central clearinghouse.
- **Sub-Unit Fragmentation Fraud:** Landlords subdivide single residential houses into commercial warehouses or multi-family flatlets without updating municipal records, paying low single-family domestic rates while generating industrial-scale waste volumes.

---

## 3. Epics, User Stories & Feature Specifications

### Epic 1.1: Sovereign LAGIS Cadastral Ingestion & Polygon Harmonization
Automate continuous ingestion and geometric synchronization of land parcel records from the Lagos State Geographic Information System (LAGIS), binding every waste collection point to an immutable geofenced polygon.

#### User Story 1.1.1: Mandatory Cadastral Binding
- **As a** LAWMA Cadastral Registry Officer,
- **I want to** validate every newly registered property against the LAGIS API,
- **So that** no waste billing account can be generated without a verified `LASG-CAD-ID` and spatial polygon.
- **Acceptance Criteria:**
  - **GIVEN** a new property registration request with street name, number, and coordinates,
  - **WHEN** the record is submitted for creation,
  - **THEN** the system must query LAGIS Spatial API; if no parcel polygon matches within a 15-meter buffer, the property status is flagged as `PROVISIONAL_UNMATCHED` and requires physical ward officer GIS survey within 48 hours; no final billing account is provisioned without `LASG-CAD-ID`.

### Epic 1.2: Multi-Tenant Sub-Unit Metering & Bill Splitting
Support granular sub-unit decomposition for multi-family tenements, self-contained apartments, and commercial shops within a single cadastral parcel.

#### User Story 1.2.1: Granular Tenancy Decomposition
- **As a** Tenement Resident or PSP Field Agent,
- **I want to** register individual sub-units (`PROP-RES-001/FLAT-01` to `FLAT-12`),
- **So that** each tenant receives a direct digital invoice with an individual payment reference, eliminating collective deadlock.
- **Acceptance Criteria:**
  - **GIVEN** a multi-unit property with a verified `LASG-CAD-ID`,
  - **WHEN** the property owner or ward officer registers sub-units,
  - **THEN** the system generates unique virtual accounts for each sub-unit; if an individual tenant defaults, enforcement notices target the specific sub-unit, while preserving an overarching encumbrance warning on the master cadastral parcel.

### Epic 1.3: LASRRA Citizen Identity Binding & Verification
Integrate with the Lagos State Residents Registration Agency (LASRRA) database to bind primary billing contacts to verifiable biometric citizen records.

#### User Story 1.3.1: Resident Verification
- **As a** Waste Clearinghouse Auditor,
- **I want** billing accounts to be tied to a verified LASRRA ID (`LASRRA-ID-XXXXXXXX`),
- **So that** billing liabilities are legally enforceable in Lagos State Courts and cannot be evaded by altering contact phone numbers.
- **Acceptance Criteria:**
  - **GIVEN** an onboarding resident,
  - **WHEN** they input their LASRRA ID,
  - **THEN** the system validates name and phone match via LASRRA API; upon verification, account receives `IDENTITY_VERIFIED` badge; if invalid, account is restricted to prepaid cash-on-delivery mode.

---

## 4. Technical Architecture, Schemas & State Machines

### 4.1 Cadastral Entity-Relationship Schema (PostgreSQL / PostGIS)

```sql
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE cadastral_properties (
    property_id VARCHAR(64) PRIMARY KEY, -- E.g., 'PROP-IKJ-GRA-00291'
    lagis_cadastral_id VARCHAR(64) NOT NULL UNIQUE, -- Foreign key to LAGIS
    lga_id VARCHAR(32) NOT NULL,
    lcda_id VARCHAR(32) NOT NULL,
    ward_id VARCHAR(32) NOT NULL,
    street_address TEXT NOT NULL,
    building_type VARCHAR(32) NOT NULL CHECK (building_type IN ('SINGLE_FAMILY', 'MULTI_TENANT', 'COMMERCIAL_MALL', 'INDUSTRIAL_PLANT', 'INSTITUTIONAL')),
    sub_units_count INTEGER NOT NULL DEFAULT 1,
    spatial_polygon GEOMETRY(Polygon, 4326) NOT NULL,
    spatial_centroid GEOMETRY(Point, 4326) NOT NULL,
    primary_owner_lasrra_id VARCHAR(32),
    lirs_tax_payer_id VARCHAR(32),
    registration_status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (registration_status IN ('PROVISIONAL', 'ACTIVE', 'ENCUMBERED', 'DEMOLISHED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE property_sub_units (
    sub_unit_id VARCHAR(64) PRIMARY KEY, -- E.g., 'PROP-IKJ-GRA-00291/U-04'
    property_id VARCHAR(64) NOT NULL REFERENCES cadastral_properties(property_id) ON DELETE CASCADE,
    sub_unit_name VARCHAR(64) NOT NULL, -- E.g., 'Flat 4B' or 'Shop 12'
    unit_category VARCHAR(32) NOT NULL CHECK (unit_category IN ('RESIDENTIAL', 'COMMERCIAL_RETAIL', 'STORAGE', 'OFFICE')),
    primary_tenant_lasrra_id VARCHAR(32) NOT NULL,
    tenant_full_name VARCHAR(128) NOT NULL,
    tenant_phone VARCHAR(16) NOT NULL,
    monthly_tariff_naira NUMERIC(12, 2) NOT NULL,
    billing_status VARCHAR(32) NOT NULL DEFAULT 'CURRENT' CHECK (billing_status IN ('CURRENT', 'OVERDUE', 'ENFORCEMENT_PENDING', 'SEALED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_cadastral_spatial ON cadastral_properties USING GIST (spatial_polygon);
CREATE INDEX idx_cadastral_lga ON cadastral_properties(lga_id, lcda_id);
CREATE INDEX idx_sub_unit_tenant ON property_sub_units(primary_tenant_lasrra_id);
```

### 4.2 API Contract: Cadastral Validation & Property Sub-Unit Ingestion
- **Endpoint:** `POST /api/v2/cadastre/properties/bind-lagis`
- **Request Payload:**
```json
{
  "property_id": "PROP-SUR-004812",
  "lagis_cadastral_id": "LASG-CAD-SUR-2018-09142",
  "lga_code": "SUR",
  "lcda_code": "COKER-AGUDA",
  "ward_code": "WARD-04",
  "coordinates": {
    "latitude": 6.49214,
    "longitude": 3.35182
  },
  "building_type": "MULTI_TENANT",
  "sub_units": [
    {
      "sub_unit_name": "Flat 1 (Ground Left)",
      "unit_category": "RESIDENTIAL",
      "tenant_lasrra_id": "LASRRA-882190-21",
      "tenant_phone": "+2348031234567",
      "monthly_tariff_naira": 3500.00
    },
    {
      "sub_unit_name": "Flat 2 (Ground Right)",
      "unit_category": "RESIDENTIAL",
      "tenant_lasrra_id": "LASRRA-441029-94",
      "tenant_phone": "+2348029876543",
      "monthly_tariff_naira": 3500.00
    }
  ]
}
```

---

## 5. Operational Realities & Field Defense Playbook

### 5.1 Informal Settlements & Slum Enclaves (Makoko, Ilaje, Amukoko)
- **Field Reality:** Over 18% of urban poor households reside in waterfront or unformalized settlements lacking formal survey plans or LAGIS parcel numbers.
- **Engineering Mitigation:** The system generates **Virtual Cadastral Grid Cells (`GEO-VIRT-*`)** based on 25m x 25m satellite bounding boxes. Each virtual cell is assigned a collective waste skip point, and resident billings are bundled through local community development associations (CDAs) with USSD micro-payments.

### 5.2 Landlord-Tenant Evasion & Lockouts
- **Field Reality:** Landlords lock gates to prevent PSP collectors or Wole-Wole sanitation inspectors from serving physical notices.
- **Engineering Mitigation:** Digital service of process under the Lagos State Magistrates Court (Special Offences) Rules. Notices are transmitted via verified SMS and WhatsApp to the registered LASRRA phone number; proof of digital delivery constitutes valid legal service under Section 84 of the Evidence Act.

---

## 6. Statutory Verification & Executive Sign-off Matrix

| Verification Pillar | Legal / Regulatory Benchmark | Acceptance Threshold | Auditing Authority |
| :--- | :--- | :--- | :--- |
| **Cadastral Integrity** | Lagos State Land Registration Law (2015) | 100% of billed properties mapped to LAGIS parcel ID or `GEO-VIRT-*` | Lands Bureau / LAGIS |
| **Identity Authenticity** | NDPA 2023 / LASRRA Edict | Primary contacts verified against biometric LASRRA records | LASRRA / MIST |
| **Evidence Admissibility** | Evidence Act (2011) Section 84 | SHA-256 certificate attached to all spatial parcel updates | Ministry of Justice |
| **Executive Quorum** | Boardroom Executive Authorization | Signed off by Gov. Hamzat & MD LAWMA | State Executive Council |
