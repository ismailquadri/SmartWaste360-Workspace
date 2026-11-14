/* Browser-only rehearsal safeguards; no operational services are contacted. */
const officialKey=value=>String(value||'').trim().toLowerCase().replace(/\s+/g,' ');
const distinctOfficials=(a,b)=>!!officialKey(a)&&!!officialKey(b)&&officialKey(a)!==officialKey(b);
const recordKey=value=>value&&typeof value==='object'?(value.id||value.sessionId||value.ref||value.duid||null):null;
const sameRecord=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const mergePracticeState=(base,local,remote)=>{
 if(sameRecord(local,base))return remote;
 if(sameRecord(remote,base)||sameRecord(local,remote))return local;
 if(Array.isArray(local)&&Array.isArray(remote)&&Array.isArray(base)){
  if([...base,...local,...remote].every(x=>recordKey(x))){
   const keys=[...new Set([...local,...remote].map(recordKey))];
   return keys.map(k=>mergePracticeState(base.find(x=>recordKey(x)===k),local.find(x=>recordKey(x)===k),remote.find(x=>recordKey(x)===k))).filter(x=>x!==undefined);
  }
  // Append-only histories keep both additions; conflicting edits to old entries fail closed.
  if(local.length>=base.length&&remote.length>=base.length&&base.every((x,i)=>sameRecord(x,local[i])&&sameRecord(x,remote[i])))return [...base,...remote.slice(base.length),...local.slice(base.length).filter(x=>!remote.slice(base.length).some(y=>sameRecord(x,y)))];
 }
 if(local&&remote&&typeof local==='object'&&typeof remote==='object'&&!Array.isArray(local)&&!Array.isArray(remote)){
  const result={};for(const k of new Set([...Object.keys(base||{}),...Object.keys(local),...Object.keys(remote)])){const v=mergePracticeState(base?.[k],local[k],remote[k]);if(v!==undefined)result[k]=v}return result;
 }
 throw new Error('Another tab changed the same record. Reload before trying again; its saved work has been kept.');
};
const practiceGpsValid=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180;
const forceReportMissing=(patrols,caseId)=>patrols.some(p=>p.case===caseId&&(p.force!=='None'||p.injury)&&!String(p.report||'').trim());
const stopSiteKey=s=>/solous/i.test(s)?'Solous II':/olusosun/i.test(s)?'Olusosun':/epe/i.test(s)?'Epe':/simpson/i.test(s)?'Simpson':s;
const practiceSiteStopped=(s,sensors,level)=>sensors.some(x=>stopSiteKey(x.site)===stopSiteKey(s)&&level(x)==='Stop');
const eligibleBatchWeights=(batch,tickets,evaluate)=>{
 const rows=tickets.filter(t=>(batch.ticketIds||[]).includes(t.id)&&!t.supersededBy);
 return rows.reduce((r,t)=>{const v=evaluate(t),tonnes=Math.max(0,v.net)/1000;r.total+=tonnes;if(v.held||t.voided)r.excluded+=tonnes;else r.eligible+=tonnes;r.ids.push(t.id);return r},{eligible:0,excluded:0,total:0,ids:[]});
};
const burnReservationError=(manifest,plant,bookings,date)=>manifest?.stage!=='Received'?'Receive this manifest at Epe first.':plant.status!=='Running'?'Incinerator is unavailable.':Number.isFinite(plant.capacityKg)&&bookings.filter(b=>b.date===date&&b.status!=='Cancelled').reduce((n,b)=>n+b.kg,0)>plant.capacityKg?'Daily capacity exceeded; review outstanding reservations first.':!bookings.some(b=>b.manifest===manifest.id&&b.date===date&&b.status==='Reserved'&&b.kg>=(manifest.received??manifest.kg))?'Reserve sufficient burn capacity for today first.':'';
const accountAllocationError=(alert,duid,units)=>!alert?.signatureOk?'Only a valid signed alert can be allocated.':alert.result==='Applied'?'This bank alert was already applied.':!units.some(u=>u.duid===duid)?'Choose a room in this property.':'';