/* Final MOD-03 / Revenue link. Dates survive midnight and reload; historical payments stay frozen. */
fg().vehicles.forEach(v=>{if(!v.signalAt)v.signalAt=new Date(Date.now()-minsSince(v.lastSignal,fleetNow())*60000).toISOString()});
// Backfill only literal sample references, without replacing earlier financial records.
const trackerSampleLinks={'SB-2611-01':['MAN-201'],'SB-2611-02':['MAN-202'],'SB-2611-03':['MAN-212'],'SB-2611-04':['MAN-204']};
st().batches.forEach(b=>{if(!b.trackerManifests)b.trackerManifests=trackerSampleLinks[b.id]||[]});
const trackerHolds=b=>trackerPaymentHolds(b,fg().vehicles,Date.now());
const trackerOldCalc=stCalc;
stCalc=b=>{const c=trackerOldCalc(b);if(b.status==='Released')return c;return {...c,blocks:c.blocks.concat(trackerHolds(b).map(id=>'Tracker hold · '+id+' · depot clearance required'))}};
const trackerOldAdvance=sgAdvError;
sgAdvError=b=>trackerHolds(b).length?'Tracker hold: provisional payment cannot bypass depot clearance':trackerOldAdvance(b);
const trackerOldRun=runModule;
runModule=function(cmd,id){
 if(['sg-approve','sg-advance'].includes(cmd)){const b=st().batches.find(b=>b.id===id);if(b&&trackerHolds(b).length)return toast('Tracker hold: depot clearance required before any payment.');}
 if(cmd==='fg-drop'){if(!fleetCan())return trackerOldRun(cmd,id);const v=fgVeh(id);if(v){v.signalAt=new Date(Date.now()-16*60000).toISOString();v.yardCleared=false;v.checkIn=null;}}
 if(cmd==='fg-yard'){if(!fleetCan())return trackerOldRun(cmd,id);const v=fgVeh(id);if(!v)return;return openForm('Yard clearance · '+v.vehicle,'Inspection lifts this tracker hold only. Other ticket and payment checks remain in place.',[textField('ref','Depot check-in reference'),field('inspected','Tracker and seals inspected at the yard',{type:'checkbox'})],'Lift hold',d=>{v.yardCleared=true;v.checkIn=d.ref;v.clearance={at:cadNow(),by:cadOfficer(),ref:d.ref};fgLog(v.vehicle+' tracker payment hold lifted after yard inspection '+d.ref)});}
 return trackerOldRun(cmd,id);
};
const trackerPanel=()=>panel('Tracker holds · matching payments','Dummy explicit manifest-to-batch references. A missing tracker record also holds a linked payment. Yard clearance never clears scale findings or releases money automatically.',table(['Payment batch','Manifest / truck','Last tracker report','Payment check'],st().batches.flatMap(b=>(b.trackerManifests||[]).map(id=>{const v=fgVeh(id);return [esc(b.id)+' · '+esc(b.psp),esc(id)+' · '+esc(v?.vehicle||'Record missing'),v?stamp(v.signalAt):'No tracker report',b.status==='Released'?'Historical payment unchanged':trackerHolds(b).includes(id)?pill('Payment stopped','red'):pill('Tracker cleared / current','good')]}))));
const trackerFinance=screens.finance;
screens.finance=()=>trackerFinance()+(ui.stTab==='Settlement run'?trackerPanel():'');
const trackerFacility=screens.facility;
screens.facility=()=>trackerFacility()+(ui.scaleTab==='Ticket checks'?trackerPanel():'');
saveModules();
let trackerClock='';setInterval(()=>{const key=st().batches.map(b=>trackerHolds(b).join(',')).join('|');if(key!==trackerClock){trackerClock=key;if(['finance','facility','dispatch'].includes(journey.page)&&$('modalBack').hidden)renderJourney()}},1000);