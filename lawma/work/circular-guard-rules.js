/* Non-linear circular economy & 7 forensic blindspot safeguard rules. */
const CG_TIPPING_DWELL_MIN_S=240;
const CG_TIPPING_LOCK_S=180;
const CG_EPE_MAX_MOISTURE_PCT=45;
const CG_EPE_MAX_INERT_PCT=8;
const CG_EPE_MIN_CALORIFIC_MJ=7.5;
const CG_EPE_DEMURRAGE_NGN=150000;
const CG_ROOM_FOOTPRINT_M2=28;
const CG_DENSITY_TOLERANCE_RATIO=0.5;
const CG_NIP_TIMEOUT_MIN=45;
const CG_SEC84_MAX_CLOCK_DRIFT_MS=5000;
const CG_CDA_STIPEND_DAILY_NGN=5000;
const CG_LANDFILL_RESIDUAL_TARGET_PCT=4;
const CG_MAX_COMPACTOR_HAUL_KM=25;

const cgPhantomTippingError=t=>!t||!(t.inboundGrossKg>0)||!(t.outboundTareKg>0)||t.inboundGrossKg<=t.outboundTareKg?'Valid inbound gross and outbound tare weights required':!t.inTippingPolygon?'Vehicle never entered the active tipping-face geofence':!t.tailgateOpened||!t.ejectorCycled?'Hydraulic tailgate latch and ejector ram telemetry missing — suspected phantom discharge':!(Number.isFinite(t.dwellSeconds)&&t.dwellSeconds>=CG_TIPPING_DWELL_MIN_S)?(t.dwellSeconds<CG_TIPPING_LOCK_S?'Dwell under 180s — outbound scale locked for phantom tipping audit':'Tipping dwell below 240s minimum'):'';

const cgDirectEpeCompactorError=m=>!m?'Manifest required':m.vehicleType==='Compactor'&&m.destination==='Epe WTE'&&Number.isFinite(m.distanceKm)&&m.distanceKm>CG_MAX_COMPACTOR_HAUL_KM?'Compactor trucks cannot haul >25km directly to Epe; route to Simpson or Oshodi TLS for 40T bulk trailer or barge transfer':'';

const cgEpeFeedstockRejection=c=>!c?'Consignment required':!['40T_RORO_TRAILER','LAGOON_BARGE'].includes(c.transportMode)?{rejected:true,reason:'Only bulk TLS trailers or lagoon barges admitted at Epe WTE pit',demurrageNgn:0,divertTo:'TLS_ORIGIN'}:c.moisturePct>CG_EPE_MAX_MOISTURE_PCT||c.inertRubblePct>CG_EPE_MAX_INERT_PCT||c.calorificMjKg<CG_EPE_MIN_CALORIFIC_MJ?{rejected:true,reason:c.moisturePct>CG_EPE_MAX_MOISTURE_PCT?'Moisture exceeds 45% boiler limit':c.inertRubblePct>CG_EPE_MAX_INERT_PCT?'Inert rubble/sand exceeds 8% grate limit':'Calorific value below 7.5 MJ/kg WTE threshold',demurrageNgn:CG_EPE_DEMURRAGE_NGN,divertTo:'EPE_SANITARY_CELL'}:{rejected:false,reason:'',demurrageNgn:0,divertTo:'EPE_WTE_BUNKER'};

const cgExpectedMinRooms=(footprintM2,storeys)=>!Number.isFinite(footprintM2)||!Number.isFinite(storeys)||footprintM2<=0||storeys<=0?0:Math.max(1,Math.floor((footprintM2*storeys)/CG_ROOM_FOOTPRINT_M2));

const cgDensityUnderdeclared=(p)=>{if(!p||p.category!=='MULTI_TENANT_TENEMENT')return {flagged:false,expectedMin:1,declared:p?.declaredRooms||1,reason:''};const expected=cgExpectedMinRooms(p.footprintM2,p.storeys||1),declared=Number(p.declaredRooms||0);const flagged=expected>=6&&declared<Math.ceil(expected*CG_DENSITY_TOLERANCE_RATIO);return {flagged,expectedMin:expected,declared,reason:flagged?`Declared ${declared} rooms on ${p.footprintM2}m² (${p.storeys||1}F) footprint; expected >=${expected} rooms — hold decal for Wole-Wole enumeration`:''}};

const cgEmergencyFuelVoucher=(batch,nowMs)=>{if(!batch||batch.status==='DISBURSED')return {triggerVoucher:false,voucherStatus:'SETTLED',elapsedMin:0};const triggeredAt=Date.parse(batch.initiatedAt);if(!Number.isFinite(triggeredAt)||nowMs<triggeredAt)return {triggerVoucher:false,voucherStatus:'INVALID_CLOCK',elapsedMin:0};const elapsedMin=Math.floor((nowMs-triggeredAt)/60000);return elapsedMin>=CG_NIP_TIMEOUT_MIN?{triggerVoucher:true,voucherStatus:'ISSUED_72H_FUEL_BARCODE',elapsedMin,redeemableNetworks:['NNPC','TotalEnergies','Ardova'],backedByEscrowBatch:batch.id}:{triggerVoucher:false,voucherStatus:'AWAITING_NIP_WEBHOOK',elapsedMin}};

const cgSection84Ready=ev=>{if(!ev)return {admissible:false,errors:['Missing evidence record']};const errs=[!ev.sha256||!/^[a-f0-9]{64}$/i.test(ev.sha256)?'Invalid SHA-256 binary digest':'',!ev.deviceSerial?'Missing terminal hardware serial':'',!ev.preShiftDiagPassed?'Sec 84(2)(a/c): Pre-shift hardware diagnostic log missing or failed':'',!Number.isFinite(ev.ntpDriftMs)||Math.abs(ev.ntpDriftMs)>CG_SEC84_MAX_CLOCK_DRIFT_MS?'Sec 84(2)(c): Stratum-1 NTP clock drift exceeds 5000ms':'',!ev.ordinaryCourseAttested?'Sec 84(2)(b/d): Ordinary-course supply attestation missing':'',!ev.signingOfficer||!ev.signingOfficerRole||!ev.digitalSignature?'Sec 84(4): Responsible official certificate signature missing':''].filter(Boolean);return {admissible:errs.length===0,errors:errs}};

const cgStreetSideAttribution=(duidPoint,streetCenterline,leftLcda,rightLcda)=>{if(!Array.isArray(duidPoint)||duidPoint.length!==2||!Array.isArray(streetCenterline)||streetCenterline.length!==2)return null;const [a,b]=streetCenterline;if(!Array.isArray(a)||!Array.isArray(b)||a.length!==2||b.length!==2)return null;const cross=(b[0]-a[0])*(duidPoint[1]-a[1])-(b[1]-a[1])*(duidPoint[0]-a[0]);return Math.abs(cross)<1e-11?'SHARED_BOUNDARY_SPLIT_50_50':cross>0?leftLcda:rightLcda};

const cgSkipCustodyError=drop=>!drop?'Skip drop record required':!drop.skipId||!drop.basinId?'Skip ID and drainage basin required':!drop.cdaChairmanName||!drop.cdaPhone||!drop.qrScannedAt?'Pre-storm skip cannot be marked deployed without CDA Warden QR custody handshake':!drop.geofenceVerified?'Skip drop coordinates outside designated street junction geofence':'';

const cgNonLinearMassBalance=streams=>{const mrf=Math.max(0,Number(streams?.mrfTonnes||0)),wte=Math.max(0,Number(streams?.epeWteTonnes||0)),bio=Math.max(0,Number(streams?.biodigesterTonnes||0)),landfill=Math.max(0,Number(streams?.landfillResidualTonnes||0));const total=mrf+wte+bio+landfill;if(total<=0)return {totalTonnes:0,divertedPct:0,landfillPct:0,meetsNonLinearTarget:false};const divertedPct=Math.round(((mrf+wte+bio)/total)*1000)/10,landfillPct=Math.round((landfill/total)*1000)/10;return {totalTonnes:total,divertedPct,landfillPct,meetsNonLinearTarget:landfillPct<=CG_LANDFILL_RESIDUAL_TARGET_PCT}};
