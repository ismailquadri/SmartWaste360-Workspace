/* Proposed command rules for local rehearsal only; no police dispatch or biometric verification. */
const KG_THREATS=['GREEN','AMBER','RED_GANG_CONTROLLED'];
const KG_BIKES_MIN=2;
const KG_RESPONSE_MIN=10;
const KG_BOOKING_MIN=60;
const kgElapsed=(at,now)=>Number.isFinite(Date.parse(at))&&Number.isFinite(now)?Math.max(0,(now-Date.parse(at))/60000):Infinity;
const kgBookingState=(d,now)=>d.booking?'Booked':kgElapsed(d.arrestAt,now)>=KG_BOOKING_MIN?'Booking overdue':'Booking pending';
const kgBookingRemaining=(d,now)=>Math.max(0,Math.ceil(KG_BOOKING_MIN-kgElapsed(d.arrestAt,now)));
const kgResponseState=(r,now)=>r.arrivedAt?(kgElapsed(r.at,Date.parse(r.arrivedAt))<=KG_RESPONSE_MIN?'Arrived within target':'Arrived late'):kgElapsed(r.at,now)>=KG_RESPONSE_MIN?'Response overdue':'Awaiting arrival';
const kgDispatchError=(t,d)=>!t?'Sector not found':!KG_THREATS.includes(t.threat)?'Record the sector threat level first':t.status==='Off duty'?'Sector is off duty':!Number.isInteger(t.bikes)||t.bikes<KG_BIKES_MIN?'At least two ready Tier-1 motorbikes are required':t.threat==='RED_GANG_CONTROLLED'&&(!(Number(d.escorts)>=1)||!String(d.rrsRef||'').trim())?'Red threat requires an armed RRS escort and a dummy escort confirmation reference':'';
const kgBookingError=(d,ref)=>!d?'Arrest docket not found':d.booking?'This arrest is already booked':!String(ref||'').trim()?'Add a dummy biometric capture reference':'';