/* MOD-04 overflow proposals; dummy rehearsals only, not approved tariffs or operating authority. */
const LG_SOLOUS_CAP=100;
const LG_ALIMOSHO_LOADS=165;
const LG_EPE_VOUCHER=35000;
const LG_COMMERCIAL_RATE=10000;
const LG_PLANT_ACTIVE_RATE=1;
const LG_PLANT_STANDBY_RATE=0.35;
const LG_PLANT_LOAD=25;
const lgPlantTier=l=>!l.verified||!l.inFence||!Number.isFinite(l.load)||l.load<0||l.load>100?'Unverified / excluded':l.load>=LG_PLANT_LOAD?'Active compaction':l.ready&&l.operatorReady?'Ready standby':'Unverified / excluded';
const lgPlantTotals=(logs,rate)=>{const hours=t=>logs.filter(l=>lgPlantTier(l)===t).reduce((n,l)=>n+l.hours,0),active=hours('Active compaction'),standby=hours('Ready standby'),excluded=hours('Unverified / excluded');return {active,standby,excluded,activeAmount:Math.round(active*rate*LG_PLANT_ACTIVE_RATE),standbyAmount:Math.round(standby*rate*LG_PLANT_STANDBY_RATE),total:Math.round((active*LG_PLANT_ACTIVE_RATE+standby*LG_PLANT_STANDBY_RATE)*rate)}};
const lgPlantIntervalError=(logs,start,end)=>!Number.isFinite(start)||!Number.isFinite(end)||end<=start?'End must be after start':(end-start)>86400000?'One record cannot exceed 24 hours':logs.some(l=>start<new Date(l.end).getTime()&&end>new Date(l.start).getTime())?'This period overlaps an existing plant record':null;
const lgPlantInvoiceHeld=(invoice,total)=>invoice>total*1.05;
const lgOverflow=loads=>Math.max(0,loads-LG_SOLOUS_CAP);
const lgFunds=(receipts,diversions)=>receipts.reduce((n,r)=>n+r.amount,0)-diversions.filter(d=>d.status!=='Cancelled').reduce((n,d)=>n+d.amount,0);
const lgDestinationRoom=(capacity,diversions,site,day)=>Math.max(0,capacity-diversions.filter(d=>d.day===day&&d.to===site&&d.status!=='Cancelled').length);
const lgDiversionError=c=>!c.manifest||c.manifest.type!=='Compactor'?'Select an existing compactor manifest':c.duplicate?'This manifest already has a diversion today':!c.sourceStopped&&c.used<LG_SOLOUS_CAP?'Solous still has daily capacity':c.destinationStopped?'Receiving site is stopped for safety':c.room<=0?'No receiving capacity remains':c.to==='Epe landfill'&&c.funds<LG_EPE_VOUCHER?'Commercial escrow has insufficient funds':null;
const lgReceiptError=(ticket,result,classification,duplicate)=>!ticket?'Ticket not found':duplicate?'This ticket already funded the escrow pool':result.held?'Held tickets cannot fund vouchers':classification!=='Commercial'||ticket.ticketClass!=='Commercial'?'A clear, confirmed commercial ticket is required':!(result.net>0)?'Ticket has no payable weight':null;