/* MOD-08 proposed hazardous waste rules. Sample only; LASEPA, Ministry of Health and the Epe incinerator operator must confirm. */
const CLINICAL_STREAMS=['Sharps (red box)','Infectious (red bag)','Anatomical','Pharmaceutical'];
const WEIGHT_TOLERANCE=0.05;
const INCINERATE_WITHIN_H=48;
const PRIMARY_MIN_C=850;
const SECONDARY_MIN_C=1100;
const RESIDENCE_MIN_S=2;
const HAZ_ROLES=['management','operations','auditor','admin'];
const weightMatch=(sent,recv)=>Math.abs(recv-sent)/sent<=WEIGHT_TOLERANCE;
const overdue=(collected,destroyed)=>(new Date(destroyed||Date.now())-new Date(collected))/3600000>INCINERATE_WITHIN_H;
const burnValid=b=>b.primary>=PRIMARY_MIN_C&&b.secondary>=SECONDARY_MIN_C&&b.residence>=RESIDENCE_MIN_S;
const manifestHolds=(m,licensed)=>[!licensed.includes(m.hauler)&&'Hauler not SPL-licensed',m.received!=null&&!weightMatch(m.kg,m.received)&&'Weight at Epe differs by more than 5%',m.collected&&overdue(m.collected,m.destroyedAt)&&'Not incinerated within 48 hours',m.burn&&!burnValid(m.burn)&&'Burn below temperature or time'].filter(Boolean);
const handoverOfficerKey=s=>String(s||'').trim().toLowerCase().replace(/\s+/g,' ');
const handoverValid=(h,expectedSeal)=>!!handoverOfficerKey(h.lasepa)&&!!handoverOfficerKey(h.lawma)&&handoverOfficerKey(h.lasepa)!==handoverOfficerKey(h.lawma)&&h.seal===expectedSeal;
const NONCLINICAL_STREAMS=['E-waste','Batteries','Asbestos'];
const HAZ_CUSTODY_STAGES=['Generator','Transport','Treatment facility','Final disposal'];
const incineratorAvailable=(plant,bookings,date)=>Math.max(0,plant.capacityKg-bookings.filter(b=>b.date===date&&b.status!=='Cancelled').reduce((n,b)=>n+b.kg,0));
const incineratorBookingError=(plant,bookings,date,kg)=>plant.status!=='Running'?'Incinerator is unavailable':!Number.isFinite(kg)||kg<=0?'Enter a positive weight':kg>incineratorAvailable(plant,bookings,date)?'Daily capacity exceeded':'';
const custodyAdvanceAllowed=s=>!s.hold&&s.steps.length<HAZ_CUSTODY_STAGES.length;
