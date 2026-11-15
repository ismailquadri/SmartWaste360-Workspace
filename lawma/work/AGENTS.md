# Module layers and safeguards

- Module layers (`cadastre-*`, `fleet-*`, `scale-*`, `landfill-*`, `settle-*`, `kai-*`, `eco-*`, `haz-*`, `market-*`, `drainage-*`, `infra-*` in `lawma/work`) inline after hub.js and wrap screens; rules are single-line consts tested in `src/test/*-rules.test.ts`; migrations keep records. Why: testable policy, layered prototype.
- Shared rehearsal safeguards live in readiness-rules.js and the final readiness-ops.js layer; browser saves three-way merge against their last snapshot and reject conflicting edits. Why: preserve independent tab changes without claiming live authentication or shared operational infrastructure.
- Fleet map oversight lives in fleet-map-rules.js and fleet-map-ops.js, loaded after readiness; manifest links use explicit mapVehicle references and snapshot freshness never refreshes coordinates. Why: join rehearsal records without inventing matches or live telemetry.
- Module 3 stakeholder safeguards live in scale-guard-rules.js and scale-guard-ops.js after readiness; provisional advances are separate liabilities offset against final PSP payments, and sensor packages are hashed dummy captures, not certified hardware signatures. Why: preserve held-ticket exclusion without double payment or claiming legal authority.
- Landfill stakeholder safeguards wrap final screens in landfill-guard rules/ops; diversion escrow uses explicit collected commercial-ticket receipts and capacity reservations, never domestic settlement balances. Why: prevent unfunded dummy vouchers and preserve the earlier safety gates.
- Two-tier plant billing lives in landfill-plant-ops with a preserved legacy-log copy and revisioned review snapshots; standby requires explicit machine/operator readiness. Why: avoid retroactive idle payments and stale invoice approvals.
- Landfill recovery and picker access wrap final screens in landfill-access rules/ops; dedicated recovery machines never create payable compaction logs and shift clearance is withdrawn by failed inspections. Why: keep safety oversight separate from contractor billing and retain dummy audit records.
- Detention layers retain arrest clocks. Why: reload cannot reset.

# Environmental safeguard layers

- Keep Module 07 extensions in eco-guard rules/ops, inlined after the existing environmental and readiness layers; retain prior records and use the shared three-way save. Why: preserve rehearsal state and existing module behavior.
- Environmental invoice liabilities are distinct from PSP settlement and resident balances; reviewed holds must reference an explicit invoice or existing settlement batch. Why: prevent accidental cross-liability payment freezes.
- Treat sensor estimates, scientific reviews and actuator outcomes as dummy evidence; certificate attestations bind the exact custody snapshot. Why: integrity checks cannot establish hardware authenticity or legal authority.
# Hazardous waste safeguard layer

- Module 08 safeguard 5 lives in haz-guard rules/ops after eco-guard; holds, fines and ash placement need a second official; valve locks and kiln diversion are simulated. Why: no automatic penalties or vehicle control from dummy evidence.
- Module 09 market safeguards live in market-guard rules/ops after haz-guard, adding Markets tabs and wrapping cordon (needs a finished de-stocking pass) and reopening (needs a tripartite accord and reviewed seal tamper reports). Why: keep the existing case workflow and add gates around it.
