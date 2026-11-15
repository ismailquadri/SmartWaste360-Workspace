/* Explicit rehearsal payment references; never infer a payable match from PSP alone. */
const trackerHoldActive=(v,now)=>!!v&&!v.yardCleared&&(!Number.isFinite(Date.parse(v.signalAt))||now-Date.parse(v.signalAt)>15*60000);
const trackerPaymentHolds=(batch,vehicles,now)=>(batch.trackerManifests||[]).filter(id=>{const v=vehicles.find(v=>v.manifest===id);return !v||trackerHoldActive(v,now)});