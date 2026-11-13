# WORKSPACE & ECOSYSTEM API CONTRACTS & EVENT SPECIFICATION
## LAWMA Authority Workspace, Regulatory Clearinghouse & Multi-App Event Bus

**Document Identifier:** LAWMA-SPEC-API-CONTRACTS  
**Document Version:** 4.0 (Post-Executive Audit Comprehensive Edition)  
**Target Systems:** 
- `LAWMA v2` (Authority Workspace & Regulatory Command Engine)
- `LAWMA-360-crew-app` (Operator & Compactor Crew Application)
- `LAWMA-360-customer-app` (Resident & Tenement Citizen Portal)
- `LAWMA-360-partner-app` (Private AWAMN PSP Franchise Portal)
- **External Interfaces:** LAGIS Cadastre, LASRRA Identity, LIRS / Oracle EBS, NiMet Weather, LASEPA Lab Hub, LASTMA Corridor Control

**Statutory & Security Baseline:**
- Transport Layer Security: TLS 1.3 Mandatory (AES-256-GCM cipher suite);
- Authentication: OAuth 2.0 / Mutual TLS (mTLS) with Ed25519 cryptographic signatures;
- Data Residency: Nigeria Data Protection Act (NDPA 2023) Section 39;
- Evidence Admissibility: Evidence Act (2011) Section 84 Compliance.

---

# 1. ARCHITECTURAL PROTOCOLS & INTEGRATION STANDARDS

```
                                      MULTI-SYSTEM EVENT BUS TOPOLOGY
┌─────────────────────────────────┐   mTLS / REST   ┌───────────────────────────────────┐   WebSocket / PUSH  ┌─────────────────────────────────┐
│     OPERATOR / CREW APP         │ ──────────────▶ │     LAWMA v2 AUTHORITY GATEWAY    │ ──────────────────▶ │       PARTNER / PSP PORTAL      │
│  (In-Cab Tablet / Mobile POS)   │                 │   (Lagos Central DC / Alausa)     │                     │    (AWAMN Fleet & Escrow View)  │
└─────────────────────────────────┘                 └─────────────────┬─────────────────┘                     └─────────────────────────────────┘
                 ▲                                                    │                                                         ▲
                 │                                                    │ Event Broadcast (Kafka / Webhooks)                      │
                 ▼                                                    ▼                                                         ▼
┌─────────────────────────────────┐                 ┌───────────────────────────────────┐                     ┌─────────────────────────────────┐
│     RESIDENT / CITIZEN APP      │ ◀────────────── │      CO-TREASURY ESCROW & LASG    │ ──────────────────▶ │    STATE ENFORCEMENT & TRAFFIC  │
│    (USSD, WhatsApp, Web PWA)    │                 │      ORACLE EBS CLEARINGHOUSE     │                     │     (LASTMA & KAI Command HQ)   │
└─────────────────────────────────┘                 └───────────────────────────────────┘                     └─────────────────────────────────┘
```

### 1.1 Standard HTTP Request Headers
All API requests traversing the LAWMA Authority Gateway must include the following immutable headers:

| Header Name | Type | Mandatory | Description / Validation Rule |
| :--- | :--- | :--- | :--- |
| `Authorization` | String | Yes | `Bearer [JWT]` containing signed claims (`sub`, `iss`, `role`, `depot_id`). |
| `X-App-Key` | String | Yes | Cryptographic application identifier (`LAWMA_WORKSPACE_SEC_KEY`). |
| `X-Idempotency-Key`| UUID v4 | Yes | Unique transaction nonce preventing duplicate billing or weight entries. |
| `X-Device-IMEI` | String | Yes | Hardware terminal identifier binding payloads to physical field devices. |
| `X-Signature-SHA256`| Hex(64)| Yes | HMAC-SHA256 digest of the request body using the device's hardware enclave key. |
| `X-Timestamp-UTC` | ISO 8601| Yes | Monotonic UTC timestamp. Requests with drift $>30	ext{ seconds}$ are rejected. |

---

# 2. INBOUND MESSAGE SCHEMAS (CREW / CUSTOMER / PARTNER -> WORKSPACE)

### 2.1 `cadastre.property_provisioned_spatial`
Dispatched when an enumerator or field agent onboards a structure using spatial geohashing.
* **Topic:** `lawma.cadastre.property.provision`
* **Transport:** HTTPS POST `/api/v2/cadastre/properties/provision`
* **Payload Schema:**
```json
{
  "eventId": "EVT-CAD-20261113-009142",
  "timestamp": "2026-11-13T09:15:30.142Z",
  "idempotencyKey": "d3b07384-d113-496e-a342-9982410a8812",
  "source": "crew_tablet",
  "deviceImei": "864902049182049",
  "enumeratorLasrraId": "LASRRA-EHO-881920",
  "payload": {
    "h3SpatialIndex": "8a2a1072b34ffff",
    "coordinates": {
      "latitude": 6.5921402,
      "longitude": 3.2818291,
      "horizontalAccuracyMeters": 2.4
    },
    "lgaCode": "ALIMOSHO",
    "lcdaCode": "IKOTUN_IGANDO",
    "wardCode": "WARD_04",
    "streetAddress": "14 Akinremi Street, Off College Road, Ikotun",
    "buildingCategory": "MULTI_TENANT_TENEMENT",
    "estimatedRoomsCount": 12,
    "monthlyTargetTariffNgn": 7200.00,
    "billingModality": "MASTER_COMPOUND_WALLET",
    "primaryContact": {
      "fullName": "Alhaji Raimi Okanlawon",
      "phoneNumber": "+2348023456789",
      "contactRole": "CARETAKER",
      "lasrraId": null,
      "nin": null
    },
    "qrDecalSerial": "LASG-QR-ALM-2026-009142",
    "photoEvidenceUri": "sec-vault://media/cadastre/2026/11/13/photo_009142.jpg"
  }
}
```

### 2.2 `fleet.jit_slot_requested`
Dispatched by an in-cab compactor tablet when payload volume reaches $\ge 80\%$ on a collection route.
* **Topic:** `lawma.fleet.logistics.slot_request`
* **Transport:** HTTPS POST `/api/v2/fleet/logistics/jit-slot-request`
* **Payload Schema:**
```json
{
  "eventId": "EVT-FLT-20261113-882194",
  "timestamp": "2026-11-13T10:42:15.891Z",
  "idempotencyKey": "a9840291-8812-4210-bca1-009148210941",
  "source": "fleet_telematics_unit",
  "vehicleId": "TRK-ALM-0042",
  "manifestId": "MNF-20261113-TRK-ALM-0042",
  "payload": {
    "currentCoordinates": {
      "latitude": 6.582104,
      "longitude": 3.271920
    },
    "estimatedGrossWeightKg": 14200.0,
    "capacityUtilizationPercent": 88.5,
    "targetDisposalFacility": "DS-SOL-02",
    "fuelLevelLiters": 142.0,
    "engineStatus": "IDLING_COLLECTION_COMPLETE",
    "currentOdometerKm": 114290.4
  }
}
```

### 2.3 `telemetry.fuel_theft_detected`
Dispatched immediately by the `FUEL-GUARD-*` ultrasonic sensor when an unauthorized fuel drop occurs.
* **Topic:** `lawma.telemetry.security.fuel_alert`
* **Transport:** HTTPS POST `/api/v2/telemetry/security/fuel-siphon`
* **Payload Schema:**
```json
{
  "eventId": "EVT-SEC-20261113-004128",
  "timestamp": "2026-11-13T12:04:18.002Z",
  "source": "ultrasonic_fuel_guard",
  "vehicleId": "TRK-ALM-0042",
  "payload": {
    "severity": "CRITICAL_THEFT",
    "startingFuelLiters": 165.0,
    "endingFuelLiters": 125.0,
    "fuelDropLiters": 40.0,
    "durationSeconds": 380,
    "engineRpm": 0,
    "ignitionStatus": "OFF",
    "coordinates": {
      "latitude": 6.574102,
      "longitude": 3.268912
    },
    "closestLandmark": "Beside Uncompleted Building, Off Iba Road",
    "batteryVoltage": 24.2,
    "smsNotificationDispatched": true
  }
}
```

### 2.4 `telemetry.leachate_dump_violation`
Dispatched when the magnetic sensor detects an open leachate dump valve on a public road corridor.
* **Topic:** `lawma.telemetry.environmental.leachate_violation`
* **Transport:** HTTPS POST `/api/v2/telemetry/environmental/leachate-valve`
* **Payload Schema:**
```json
{
  "eventId": "EVT-ENV-20261113-001942",
  "timestamp": "2026-11-13T11:42:18.412Z",
  "source": "leachate_valve_sensor",
  "vehicleId": "TRK-ALM-0042",
  "manifestId": "MNF-20261113-TRK-ALM-0042",
  "payload": {
    "violationType": "EXPRESSWAY_LEACHATE_DISCHARGE",
    "valveState": "OPEN",
    "vehicleSpeedKmh": 44.2,
    "coordinates": {
      "latitude": 6.574102,
      "longitude": 3.268912
    },
    "corridorId": "CORRIDOR-LASU-IBA-EXPRESS",
    "isAuthorizedDischargeZone": false,
    "statutorySurchargeNgn": 50000.00,
    "escrowClawbackReference": "CLAW-ENV-20261113-0042"
  }
}
```

### 2.5 `scale.offline_ticket_ingested`
Dispatched by the SQLite edge scale broker when connectivity restores after an offline weighing session.
* **Topic:** `lawma.scale.weighbridge.offline_sync`
* **Transport:** HTTPS POST `/api/v2/facility/weighbridge/sync-offline-ticket`
* **Payload Schema:**
```json
{
  "eventId": "EVT-SCL-20261113-008129",
  "timestamp": "2026-11-13T13:00:15.912Z",
  "source": "edge_scale_broker_solous",
  "payload": {
    "offlineTicketId": "TCK-OFFLINE-SOL-20261113-0082",
    "facilityId": "DS-SOL-02",
    "terminalId": "TERM-SOL-INBOUND-01",
    "vehicleId": "TRK-ALM-0042",
    "driverLasrraId": "LASRRA-441029-94",
    "grossWeightKg": 21450.0,
    "tareWeightKg": 11200.0,
    "netWeightKg": 10250.0,
    "scaleInTimestamp": "2026-11-13T11:22:10Z",
    "scaleOutTimestamp": "2026-11-13T11:48:30Z",
    "turnaroundDurationMinutes": 26,
    "opticalTripwireVerified": true,
    "hashChainPrev": "8f4a10bc39e120...",
    "signatureSha256": "4b921049281a94bcad821e9b4d81f20ac882194bca0194821a049d821e998214"
  }
}
```

### 2.6 `pickup.rejected_biohazard`
Dispatched when residential crew encounters untreated infectious medical waste, triggering the 4-hour hazmat SLA.
* **Topic:** `lawma.operations.emergency.biohazard`
* **Transport:** HTTPS POST `/api/v2/operations/incidents/biohazard-rejection`
* **Payload Schema:**
```json
{
  "eventId": "EVT-HAZ-20261113-000412",
  "timestamp": "2026-11-13T09:44:10.120Z",
  "source": "crew_tablet",
  "payload": {
    "propertyId": "PROP-ALM-8A2A1072B34FFFF",
    "coordinates": {
      "latitude": 6.5921402,
      "longitude": 3.2818291
    },
    "biohazardCategory": "INFECTIOUS_SHARPS_AND_CLINICAL_TISSUE",
    "estimatedVolumeKg": 35.0,
    "suspectedFacilityName": "St. Jude Maternity & Diagnostic Centre",
    "suspectedHefamaaId": "HEFAMAA-ALM-0412",
    "photoEvidenceUri": "sec-vault://media/hazmat/2026/11/13/biohazard_000412.jpg",
    "emergencyHazmatFleetDispatched": true,
    "hazmatSlaDeadline": "2026-11-13T13:44:10Z"
  }
}
```

---

# 3. OUTBOUND MESSAGE SCHEMAS (WORKSPACE -> OPERATOR / PARTNER / CITIZEN)

### 3.1 `fleet.jit_slot_allocated`
Broadcast to the in-cab tablet metering its arrival at the landfill without blocking the highway.
* **Topic:** `lawma.fleet.logistics.slot_allocated`
* **Transport:** WebSocket / Push Notification to Crew Tablet
* **Payload Schema:**
```json
{
  "to": "TRK-ALM-0042",
  "type": "fleet.jit_slot_allocated",
  "ref": "SLOT-SOL-20261113-084",
  "payload": {
    "jitSlotId": "SLOT-SOL-20261113-084",
    "facilityId": "DS-SOL-02",
    "allocatedArrivalWindow": {
      "start": "2026-11-13T11:15:00Z",
      "end": "2026-11-13T11:30:00Z"
    },
    "meteringAction": "HOLD_AT_SOURCE",
    "holdDurationMinutes": 15,
    "authorizedDepartureTime": "2026-11-13T10:55:00Z",
    "clearedCorridor": "CORRIDOR-LASU-IBA-EXPRESS",
    "tailgateUnlockToken": "TOKEN-GEOFENCE-SOL-998214"
  }
}
```

### 3.2 `corridor.emergency_bypass_active` (Replaces Outdated Agege Reroute!)
Broadcast when an emergency highway blockade occurs, clearing a safe secondary route with LASTMA.
* **Topic:** `lawma.fleet.corridor.bypass`
* **Transport:** WebSocket Broadcast to All Active Vehicles on Corridor
* **Payload Schema:**
```json
{
  "to": ["partner", "operator"],
  "type": "corridor.emergency_bypass_active",
  "ref": "BYPASS-LASU-20261113-01",
  "payload": {
    "blockedCorridorId": "CORRIDOR-LASU-IBA-EXPRESS",
    "cause": "TANKER_FIRE_EXPLOSION_AT_IYANA_IBA",
    "authorizedBypassCorridorId": "CORRIDOR-BADAGRY-EXPRESS-EAST",
    "alternativeStagingHub": "HUB-LASU-IBA-OFF-HIGHWAY",
    "lastmaClearanceRef": "LASTMA-CLEAR-2026-8812",
    "speedLimitKmh": 45,
    "effectiveUntil": "2026-11-13T18:00:00Z"
  }
}
```

### 3.3 `escrow.cure_window_opened`
Broadcast when a service failure complaint is registered, opening the 48-hour operational cure window.
* **Topic:** `lawma.escrow.arbitration.cure_open`
* **Transport:** Webhook to Partner App (`LAWMA-360-partner-app`)
* **Payload Schema:**
```json
{
  "to": "PAR-ALI-002",
  "type": "escrow.cure_window_opened",
  "ref": "CURE-20261113-0941",
  "payload": {
    "ticketId": "CURE-20261113-0941",
    "propertyId": "PROP-ALM-8A2A1072B34FFFF",
    "streetAddress": "14 Akinremi Street, Ikotun",
    "reportedFailure": "MISSED_RESIDENTIAL_PICKUP",
    "cureDeadlineUtc": "2026-11-15T09:41:00Z",
    "remediationActionRequired": "DISPATCH_RECOVERY_VEHICLE",
    "potentialPenaltyNgn": 15000.00,
    "assignedWardOfficer": "WO-ALM-IKOTUN-04"
  }
}
```

### 3.4 `escrow.split_settled`
Confirms the weekly Friday clearinghouse split disbursement integrated with Oracle EBS and LIRS.
* **Topic:** `lawma.fintech.escrow.settlement_closed`
* **Transport:** Webhook to Partner App & Oracle EBS Financials
* **Payload Schema:**
```json
{
  "to": ["partner", "oracle_ebs", "lirs"],
  "type": "escrow.split_settled",
  "ref": "SET-2026-W46-ALM-002",
  "payload": {
    "batchId": "SETTLE-20261113-BATCH-004",
    "partnerId": "PAR-ALI-002",
    "billingPeriod": {
      "start": "2026-11-06",
      "end": "2026-11-12"
    },
    "grossTariffsCollectedNgn": 4200000.00,
    "splitAllocations": {
      "operatorNetShareNgn": 3192000.00,     -- 80% Less 5% WHT
      "lirsWithholdingTax5Ngn": 168000.00,    -- 5% WHT to LIRS TSA
      "lawmaRegulatorySurchargeNgn": 630000.00, -- 15% to LAWMA Sinking Fund
      "lgaSection102ShareNgn": 210000.00      -- 5% Statutory to Alimosho LGA
    },
    "oracleGlBatchId": "ORACLE-GL-LASG-20261113-889142",
    "lirsTaxReceiptNumber": "LIRS-WHT-2026-0041289",
    "settlementStatus": "DISBURSED_TO_CBN_NIP",
    "bankNipRef": "NIP-9982410294812",
    "settledAt": "2026-11-13T17:00:00Z"
  }
}
```

### 3.5 `enforcement.market_sealing_decreed`
Broadcast when the Hon. Commissioner executes an executive market closure order using their ministerial key.
* **Topic:** `lawma.enforcement.market.sealing`
* **Transport:** Push Broadcast to KAI Oshodi, Police Command & Public Transparency Portal
* **Payload Schema:**
```json
{
  "to": ["kai_oshodi", "police_command", "public_portal"],
  "type": "enforcement.market_sealing_decreed",
  "ref": "SEAL-20261113-M12",
  "payload": {
    "marketId": "MKT-MILE-12",
    "marketName": "Mile 12 International Foodstuff Market",
    "ministerialOrderNumber": "MIN-ENV-SEAL-2026-004",
    "signedBy": "Hon. Tokunbo Wahab (Hon. Commissioner, MEWR)",
    "ministerialKeySignatureSha256": "3a4b91f0ac882194bca0194821a049d821e9982147e2b9c3f810a944d82b49c0",
    "groundsForClosure": "CHRONIC_DRAINAGE_BLOCKAGE_AND_UNPAID_ARREARS_GT_60D",
    "totalDebtAccumulatedNgn": 4200000.00,
    "perishableProduceGraceWindowHours": 12,
    "perishableEvacuationDeadlineUtc": "2026-11-14T04:00:00Z",
    "physicalSealingEffectiveUtc": "2026-11-14T04:00:00Z"
  }
}
```

---

# 4. ERROR CODES, RESILIENCE & WEBHOOK POLICIES

### 4.1 Standardized Error Response Structure
```json
{
  "status": "ERROR",
  "errorCode": "ERR_CORRIDOR_GEOFENCE_BREACH",
  "message": "Vehicle TRK-ALM-0042 deviated >100m outside authorized corridor without an active bypass token.",
  "timestamp": "2026-11-13T11:42:19Z",
  "incidentId": "INC-KAI-20261113-091",
  "retryable": false
}
```

### 4.2 Error Code Registry
| Error Code | HTTP Status | Description / Resolution |
| :--- | :--- | :--- |
| `ERR_INVALID_IDEMPOTENCY_KEY` | 400 Bad Request | Nonce already consumed. Re-fetch transaction state. |
| `ERR_PRE_DISPATCH_LOCKED` | 403 Forbidden | Vehicle attempted departure after 06:00 WAT cutoff without ministerial override. |
| `ERR_TAILGATE_SOLENOID_LOCKED` | 409 Conflict | Tailgate ejection attempted outside authorized dumpsite polygon. |
| `ERR_LEACHATE_DUMP_DETECTED` | 422 Unprocessable | Unauthorized opening of leachate valve on public highway. |
| `ERR_WEIGHBRIDGE_SCALE_DRIFT` | 422 Unprocessable | Measured scale weight differs by $>15\%$ from onboard strain-gauge estimate. |
| `ERR_CURE_WINDOW_EXPIRED` | 410 Gone | 48-hour cure window elapsed without verified remediation. Penalties applied. |

### 4.3 Webhook Exponential Backoff & Dead Letter Queue (DLQ)
- Delivery attempts: Maximum 5 retries over 24 hours.
- Retry Intervals: $T_1 = 30	ext{s}$, $T_2 = 5	ext{m}$, $T_3 = 30	ext{m}$, $T_4 = 2	ext{h}$, $T_5 = 6	ext{h}$.
- Failure Fallback: Unacknowledged webhooks are routed to the **Sovereign Dead Letter Queue (DLQ)** in the Lagos Central Data Center, alerting system administrators.
