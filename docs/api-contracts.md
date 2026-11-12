# Workspace App API & Message Contract

**Target Application:** `LAWMA v2`  
**Endpoint:** `/api/public/messages`  
**Authentication Header:** `x-app-key: LAWMA_APP_KEY`

---

## Inbound Messages (Customer / Partner / Operator -> Workspace)

| Type | Source | Payload | Description |
| :--- | :--- | :--- | :--- |
| `issue.reported` | `customer` | `{ category, jurisdiction, gps, photoUri }` | Citizen complaint for dumping or blocked canal. |
| `pickup.rejected_biohazard` | `operator` | `{ tagId, reason, photoEvidenceUri }` | Emergency alert of medical/toxic waste contamination. |
| `tls.weighed` | `operator` | `{ scaleId, truckId, netKg, turnaroundMinutes }` | Inbound weighbridge intake confirmation. |
| `route.assigned` | `partner` | `{ partnerId, routeId, stopsCount }` | Daily PSP operational dispatch schedule. |

---

## Outbound Messages (Workspace -> Partner / Operator / Customer)

### 1. `corridor.broadcast`
Pushes live corridor alerts and dumpsite diversion orders:
```json
{
  "to": ["partner", "operator"],
  "type": "corridor.broadcast",
  "ref": "ADV-SOL-2026-11-13",
  "payload": {
    "corridorId": "COR-ALIMOSHO-WEST",
    "facilityId": "DS-SOL",
    "alertLevel": "HIGH_QUEUE_SATURATION",
    "queueMinutes": 52,
    "diversionAction": "REROUTE_TO_AGEGE_TLS",
    "effectiveUntil": "2026-11-13T14:00:00Z"
  }
}
```

### 2. `escrow.settled`
Confirms Friday 80% bank remittance release:
```json
{
  "to": ["partner"],
  "type": "escrow.settled",
  "ref": "SET-2026-W46-002",
  "payload": {
    "partnerId": "PAR-ALI-002",
    "batchGrossTonnage": 142.5,
    "grossBilled": 2400000,
    "clearinghouseDeduction20": 480000,
    "whtTaxDeduction5": 120000,
    "netDisbursed80": 1800000,
    "bankNipRef": "NIP-9982410294812",
    "settlementTimestamp": "2026-11-13T17:00:00Z"
  }
}
```
