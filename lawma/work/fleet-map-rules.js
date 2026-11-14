/* Rehearsal thresholds only; not LAWMA telemetry or service policy. */
const FM_STALE_SECONDS=300;
const FM_MISSING_SECONDS=900;
const fleetPositionAge=(v,snapshot,now)=>Math.max(0,Number(v.age)||0)+Math.max(0,Math.floor((now-Date.parse(snapshot))/1000));
const fleetPositionState=(v,snapshot,now)=>v.status==='No signal'||fleetPositionAge(v,snapshot,now)>=FM_MISSING_SECONDS?'Missing update':fleetPositionAge(v,snapshot,now)>=FM_STALE_SECONDS?'Stale position':'Recent position';
const fleetLinkedRecords=(code,orders,manifests,bookings,reviews)=>{const assignments=orders.filter(o=>o.vehicle===code),linked=manifests.filter(m=>m.mapVehicle===code),refs=new Set([...assignments.map(o=>o.id),...linked.map(m=>m.id)]);return {assignments,manifests:linked,bookings:bookings.filter(b=>linked.some(m=>m.id===b.manifest)),reviews:reviews.filter(r=>refs.has(r.ref))}};
const fleetMapMatches=(v,f)=> (f.psp==='all'||v.partnerId===f.psp)&&(f.freshness==='all'||(f.freshness==='Stale / missing'?v.positionState!=='Recent position':v.positionState===f.freshness))&&(f.exception==='all'||v.exceptions.some(e=>e.kind===f.exception))&&(!f.onlyExceptions||v.exceptions.length>0);
const fleetExceptionRank=v=>v.exceptions.reduce((n,e)=>Math.min(n,{Breakdown:0,'Route departure':1,'Long queue':2,'Missed collection':3,'Missing update':4,'Stale position':5,'Evidence review':6}[e.kind]??7),8);