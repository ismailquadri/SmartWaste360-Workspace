/* Connected, deterministic presentation simulator. No operational network writes. */
const simNow=()=>new Date().toISOString();
const makeDemo=()=>({version:1,online:true,telemetry:0,camera:'CAM-01',cameraPaused:false,sensorGap:4.6,sensorThreshold:3,gateClosed:false,failover:false,
 orders:[],invoices:[],payments:[],notices:[],cases:[],batches:[],workOrders:[],signedIn:false,
 properties:Array.from({length:27},(_,i)=>({id:i===0?'PR-0182':'PR-'+String(182+i).padStart(4,'0'),area:ROUTES[Math.floor(i/3)%ROUTES.length].name,partner:i<3?'PAR-006':'PAR-'+String(1+Math.floor(i/3)).padStart(3,'0'),name:['Amina household','Market unit','Residential block'][i%3],tariff:[15000,24000,18000][i%3],matched:i!==26})),
 cameras:[{id:'CAM-01',name:'Entry lane',site:'FAC-001',online:true,night:false},{id:'CAM-02',name:'Tipping bay',site:'FAC-001',online:true,night:false},{id:'CAM-03',name:'Holding area',site:'FAC-002',online:true,night:false},{id:'CAM-04',name:'Black spot watch',site:'FAC-003',online:true,night:true}],
 policy:{target:90,penalty:10000,approved:false},
 tickets:[{id:'SUP-001',partner:'PAR-022',asset:'CAM-03',issue:'Intermittent camera signal',status:'Assigned',note:''},{id:'HAU-001',partner:'PAR-021',asset:'FAC-001 → FAC-003',issue:'Transfer compacted load',status:'Assigned',note:''}]
});
modules.demo ||= makeDemo();
const sim=modules.demo;
const cash=n=>'₦'+Number(n).toLocaleString('en-NG');
const ownedOrders=()=>sim.orders.filter(o=>!['partner','psp','crew'].includes(journey.role)||o.partner===modules.partnerContext);
const simOrder=id=>ownedOrders().find(o=>o.id===id);
const sampleFacility=id=>modules.facilities.find(f=>f.id===id);
const simNotice=(title,detail,target='scenarios',kind='Information')=>{
 sim.notices.unshift({id:moduleID('ALT',sim.notices),title,detail,target,kind,read:false,time:simNow()});
};
const simSave=(message)=>{recordModuleAction(message);renderJourney();toast(message)};
const simFlag=(title,detail,site)=>{
 if(!modules.incidents.some(i=>i.type===title&&i.subject===site&&i.status!=='Resolved'))modules.incidents.unshift({id:moduleID('INC',modules.incidents),type:title,subject:site,partner:'PAR-020',area:sampleFacility(site)?.area||'Ikeja',priority:'High',status:'Open',owner:'Operations supervisor',description:detail,resolution:'',notes:[],created:simNow()});
 simNotice(title,detail,'incidents','Warning');
};
const isPartnerRole=()=>['partner','psp','crew'].includes(journey.role);
const simulatedNote=()=>'';
const simBtn=(label,cmd,id='',primary=false)=>button(label,'sim-'+cmd,id,primary);
// Facility intake sub-state for a record (set by the TLS module); null when the site has no intake workflow.
let facilityProgress=o=>null;
const facilityNextLabel={'Checked in':'Call to weighbridge','At weighbridge':'Record weight & inspection',Weighed:'Start unloading',Unloading:'Complete unloading'};
const simNext=o=>(o.stage==='At facility'&&facilityNextLabel[facilityProgress(o)])||({Assigned:'Start route',Collecting:'Capture next collection','Evidence queued':'Sync collection evidence',Collected:'Record facility arrival','At facility':'Record weight & unload',Verified:'Create billing records'}[o.stage]||'View record');
// Tracker position: Assign → Collect → Facility → Receipt. Once the weight is recorded the facility step is done and the receipt is next.
const serviceTrackerStep=o=>o.stage==='At facility'&&['Weighed','Unloading'].includes(facilityProgress(o))?3:({Assigned:0,Collecting:1,'Evidence queued':1,Collected:2,'At facility':2,Verified:4}[o.stage]??0);
const serviceStageLabel=o=>{const p=o.stage==='At facility'?facilityProgress(o):null;return p&&p!=='Expected'?o.stage+' · '+p:o.stage};
const canOrderAction=o=>isAuthority()||journey.role==='finance'&&o.stage==='Verified'||journey.role==='facility'&&['Collected','At facility'].includes(o.stage)||['partner','psp','crew'].includes(journey.role)&&['Assigned','Collecting','Evidence queued'].includes(o.stage)&&o.partner===modules.partnerContext;
function simMoveVehicle(o){
 const v=fleet.find(v=>v.code===o.vehicle);if(!v)return;
 const r=ROUTES[o.ri],count=o.stops.filter(s=>s.captured).length;
 const fraction=o.stage==='Assigned'?.04:['At facility','Verified'].includes(o.stage)?1:Math.min(.94,.15+count*.24);
 const p=atRoute(r,fraction);Object.assign(v,{ri:o.ri,district:r.name,coord:p.coord,index:p.index,heading:p.heading,fraction,age:0,planned:3,reported:count,verified:sim.online?count:0,status:['At facility','Verified'].includes(o.stage)?'At facility':o.stage==='Collecting'?'Collecting':'On route'});
}
function seedOrder(partner,vehicle,area,crew){
 const ri=Math.max(0,ROUTES.findIndex(r=>r.name===area));
 let props=sim.properties.filter(p=>p.area===area&&p.partner===partner);
 if(!props.length){props=Array.from({length:3},(_,i)=>({id:moduleID('PR',sim.properties.concat(Array(i).fill({}))),area,partner,name:'Sample property '+(sim.properties.length+i+1),tariff:15000,matched:true}));sim.properties.push(...props)}
 const o={id:moduleID('SR',sim.orders),partner,vehicle,ri,crew,area,stage:'Assigned',created:simNow(),facility:'FAC-001',receipt:null,visit:null,billed:false,
 stops:props.slice(0,3).map((p,i)=>({property:p.id,tag:'BIN-'+p.id.slice(3),captured:false,synced:false,photo:null,position:atRoute(ROUTES[ri],.2+i*.27).coord})),events:[{text:'Assignment created',time:simNow()}]};
 sim.orders.unshift(o);simMoveVehicle(o);return o;
}
if(!sim.orders.length&&!sim.initialized){
 seedOrder('PAR-006','FLT-0042','Ikeja','Babatunde A.');
 sim.invoices.push({id:'BILL-001',property:'PR-0182',order:'Historical service period',amount:15000,status:'Outstanding',receipt:null,created:simNow()});
 sim.batches.push({id:'MAT-001',partner:'PAR-019',material:'Sorted PET',weight:1.2,accepted:null,status:'Awaiting receipt',receipt:''});
 sim.initialized=true;
 simNotice('Service ready for dispatch','SR-001 · Ikeja · FLT-0042','serviceLedger');
 simNotice('Holding area above capacity','FAC-002 · 26 vehicles against capacity 24','capacity','Warning');
}
// Add enough dummy resources for each partner to demonstrate its own responsibility.
modules.partners.filter(p=>p.service==='Collection').forEach(p=>{if(!modules.personnel.some(x=>x.partner===p.id))modules.personnel.push({id:moduleID('PER',modules.personnel),partner:p.id,name:'Crew lead '+p.id.slice(4),role:'Driver',status:'Available'})});
modules.vehicleRecords.length||modules.vehicleRecords.push({id:'VEH-001',vehicle:'FLT-0042',plate:'KJA-042-LA',partner:'PAR-006',kind:'Waste compactor'});
const originalContext=changePartnerContext;
changePartnerContext=function(id){originalContext(id);if(journey.role==='partner'){const p=currentPartner();personaPages.partner.push('alerts');if(p.service==='Collection')personaPages.partner.push('serviceLedger');if(['Transport','Technical support'].includes(p.service))personaPages.partner.push('partnerWork');} };
const addPages=(role,extras)=>{personaPages[role]=[...new Set([...personaPages[role],...extras])]};
['management','admin'].forEach(r=>addPages(r,['serviceLedger','cameras','alerts','scenarios','reports','partnerWork']));
addPages('operations',['serviceLedger','cameras','alerts','scenarios','reports']);addPages('facility',['serviceLedger','cameras','alerts']);addPages('psp',['serviceLedger','alerts']);addPages('crew',['serviceLedger','alerts']);addPages('finance',['serviceLedger','alerts','reports']);addPages('care',['alerts']);addPages('resident',['alerts']);addPages('enforcement',['cameras','alerts']);addPages('recovery',['alerts']);
journeyNav.splice(6,0,['serviceLedger','Service records','file']);journeyNav.push(['cameras','Cameras & sensors','camera'],['partnerWork','Partner work orders','truck'],['reports','Performance','layers'],['alerts','Notifications','alert'],['scenarios','Scenarios','play']);
defs.insertAdjacentHTML('beforeend','<symbol id="i-camera" viewBox="0 0 24 24"><path d="M3 6h12v12H3zM15 10l6-4v12l-6-4z"/></symbol><symbol id="i-play" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/></symbol>');
function simScopeInvoice(inv){return journey.role!=='resident'||inv.property===modules.resident.property}
function simOrderTable(list=ownedOrders()){
 return list.length?table(['Service / area','Partner / vehicle','Collection evidence','Stage',''],list.map(o=>[`${o.id}<small class="cell-sub">${esc(o.area)}</small>`,`${esc(partnerName(o.partner))}<small class="cell-sub">${esc(o.vehicle)}</small>`,o.stops.filter(s=>s.synced).length+' / '+o.stops.length+' synced',status(o.stage),link('Open service','sim-order',o.id)])):empty('No assigned services','Create an assignment from Collection operations.');
}
screens.serviceLedger=()=>pageHead('CONNECTED SERVICE RECORDS','Follow every handoff.','Assignment, collection evidence, intake, receipt and related billing share one reference.',simulatedNote())+stats([['Assigned',ownedOrders().filter(o=>o.stage==='Assigned').length,'Ready for a crew'],['In progress',ownedOrders().filter(o=>!['Assigned','Verified'].includes(o.stage)).length,'Collection and facility handoff'],['Verified receipts',ownedOrders().filter(o=>o.receipt).length,'Weight and unloading confirmed'],['Pending sync',ownedOrders().reduce((n,o)=>n+o.stops.filter(s=>s.captured&&!s.synced).length,0),'Original capture time retained']])+panel('Service register','Open any record to continue its journey.',simOrderTable());
screens.dispatch=()=>pageHead('COLLECTION OPERATIONS','Assign the route. Follow the result.','Every assignment opens a connected service record.',simBtn('Create assignment','assign','',true))+panel('Shift register','Sample crews and road-aligned routes are ready to use.',simOrderTable())+note('Route paths use the supplied road geometry.');
function scene(kind='camera',night=false){
 return `<svg class="sim-scene ${night?'night':''}" viewBox="0 0 900 450" role="img" aria-label="Generated ${kind==='evidence'?'collection evidence':'facility camera'} scene"><rect width="900" height="450" fill="${night?'#17242a':'#647175'}"/><path d="M0 340 900 180V450H0Z" fill="#424e51"/><path d="m120 450 240-290M510 450 100-320" stroke="#b7b298" stroke-width="3" stroke-dasharray="22 17"/><path d="M0 75 900 15v125L0 230Z" fill="${night?'#25363b':'#869388'}"/><path d="M40 70h255v108H40zM650 32h225v96H650" fill="#415650"/><path d="M55 80h220M55 100h220M55 120h220M55 140h220" stroke="#6e8279" stroke-width="4"/><g transform="translate(340 225) rotate(-12)"><rect width="170" height="77" rx="6" fill="#dc741d"/><rect x="125" y="5" width="59" height="69" rx="7" fill="#dadbd4"/><rect x="145" y="12" width="29" height="42" rx="3" fill="#31444c"/><circle cx="29" cy="80" r="14" fill="#1b2428"/><circle cx="149" cy="80" r="14" fill="#1b2428"/><text x="20" y="43" fill="#221a13" font-size="17" font-family="sans-serif" font-weight="700">LAWMA</text></g><g transform="translate(690 170) rotate(-12)"><rect width="100" height="44" rx="4" fill="#bd762a"/><rect x="72" width="34" height="44" rx="4" fill="#cbd1cb"/></g><rect x="330" y="195" width="214" height="147" rx="3" fill="none" stroke="#9addad" stroke-width="2"/><text x="337" y="189" fill="#c9f4d3" font-size="13" font-family="monospace">${kind==='evidence'?'COLLECTION CHECKPOINT':'KJA-042-LA · VEHICLE'}</text><path d="M0 25h900M0 425h900" stroke="#b8cac3" stroke-opacity=".15"/><text x="25" y="40" fill="#f1f3eb" font-size="14" font-family="monospace">${kind==='evidence'?'STAGED EVIDENCE':'SYNTHETIC CAMERA VIEW'} · NOT LIVE FOOTAGE</text><text x="25" y="422" fill="#dbe4df" font-size="12" font-family="monospace">SmartWaste360</text></svg>`;
}
let activeService=null;
function openService(id){const o=simOrder(id);if(!o)return;activeService=id;
 drawer(o.id+' · '+o.area,simulatedNote()+steps(['Assign','Collect','Facility','Receipt'],serviceTrackerStep(o))+
 rowKV('Operator',esc(partnerName(o.partner)))+rowKV('Vehicle / crew',esc(o.vehicle+' · '+o.crew))+rowKV('Current stage',esc(serviceStageLabel(o)))+
 `<div class="drawer-actions">${canOrderAction(o)&&(!o.billed||o.stage!=='Verified')?simBtn(simNext(o),'advance',o.id,true):''}${permitted('fleet')?simBtn('View route on map','map',o.id):''}${simBtn(sim.online?'Simulate offline':'Restore connection','connection')}${o.receipt?simBtn(o.receipt.kind==='TLS intake'?'View intake receipt':'View disposal receipt','receipt',o.id):''}</div>`+
 table(['Checkpoint','Capture','Sync'],o.stops.map(s=>[esc(s.property),s.captured?'Tag + staged image':'Pending',s.synced?'Synced':s.captured?'Queued':'—']))+
 (o.stops.some(s=>s.captured)?`<h3>Latest staged evidence</h3>${scene('evidence')}<p class="sim-caption">${esc(o.stops.filter(s=>s.captured).at(-1).photo)} · capture metadata retained</p>`:'')+
 (o.billed?rowKV('Related invoices',sim.invoices.filter(i=>i.order===o.id).map(i=>i.id).join(', ')):'')+
 '<h3>Event history</h3><ol class="module-timeline">'+o.events.map(e=>`<li>${esc(e.text)}<small>${stamp(e.time)}</small></li>`).join('')+'</ol>');
}
function orderEvent(o,text){o.events.push({text,time:simNow()});simMoveVehicle(o);recordModuleAction(o.id+': '+text)}
function advanceOrder(o){
 if(!canOrderAction(o)){toast('Switch to the responsible workspace to continue this handoff.');return}
 if(o.stage==='Assigned'){o.stage='Collecting';orderEvent(o,'Route acknowledged and started')}
 else if(o.stage==='Collecting'){
  const s=o.stops.find(s=>!s.captured);if(!s)return;
  Object.assign(s,{captured:true,synced:sim.online,photo:'IMG-'+o.id+'-'+s.property,time:simNow()});orderEvent(o,'Collection captured at '+s.property+(sim.online?' · synced':' · queued offline'));
  if(o.stops.every(s=>s.captured))o.stage=sim.online?'Collected':'Evidence queued';
 }
 else if(o.stage==='Evidence queued'){
  if(!sim.online){toast('Restore the simulated connection before syncing.');return}
  o.stops.forEach(s=>s.synced=true);o.stage='Collected';orderEvent(o,'Queued evidence synced once; original timestamps preserved');
 }
 else if(o.stage==='Collected'){
  const existing=modules.visits.find(v=>v.vehicle===o.vehicle&&!v.departed);
  if(existing&&existing.facility!==o.facility){toast('Record departure from the other site before this arrival.');return}
  const visit=existing||{id:moduleID('VIS',modules.visits),facility:o.facility,vehicle:o.vehicle,partner:o.partner,arrived:simNow(),departed:null,order:o.id};
  if(!existing)modules.visits.unshift(visit);o.visit=visit.id;o.stage='At facility';orderEvent(o,'Arrival recorded at '+sampleFacility(o.facility).name);
  if(occupancy(sampleFacility(o.facility))>sampleFacility(o.facility).capacity)simFlag('Capacity breach','Simulated arrivals exceed site capacity.',o.facility);
 }
 else if(o.stage==='At facility'){
  openForm('Weigh and confirm unloading',o.id+' · '+o.vehicle,[field('gross','Gross weight (kg)',{type:'number',min:1,value:18400}),field('tare','Tare weight (kg)',{type:'number',min:1,value:11200}),field('unloaded','Unloading confirmed in the designated area',{type:'checkbox'})],'Issue disposal receipt',d=>{
   if(+d.gross<=+d.tare)return'Gross weight must exceed tare weight.';
   o.receipt={id:'LOAD-'+o.id.slice(3),gross:+d.gross,tare:+d.tare,net:+d.gross-+d.tare,time:simNow()};o.stage='Verified';
   const visit=modules.visits.find(v=>v.id===o.visit);if(visit)visit.departed=simNow();orderEvent(o,'Disposal receipt issued; net '+o.receipt.net+' kg. Departure recorded.');simNotice('Collection verified',o.id+' has a disposal receipt. Related account records can be reviewed.','finance');
  });return;
 }
 else if(o.stage==='Verified'){
  if(o.billed){toast('Billing records already exist for this service.');return}
  for(const stop of o.stops){const p=sim.properties.find(p=>p.id===stop.property);sim.invoices.unshift({id:moduleID('BILL',sim.invoices),property:stop.property,order:o.id,amount:p?.tariff||15000,status:'Outstanding',created:simNow(),receipt:null})}
  o.billed=true;orderEvent(o,'Property invoices created using sample period tariffs, independent of disposal weight');simNotice('Invoices ready',o.id+' · '+o.stops.length+' property account records created','finance');
 }
 simMoveVehicle(o);saveModules();renderJourney();openService(o.id);
}
function cameraView(cam){return `<div class="camera-frame ${!cam.online?'camera-offline':''}">${scene('camera',cam.night)}<div class="camera-overlay"><span>${esc(cam.id)} / ${esc(cam.name)}</span><span>${cam.online?(sim.cameraPaused?'REPLAY PAUSED':'SIMULATED FEED'):'OFFLINE'}</span></div>${!cam.online?'<div class="camera-message"><b>Camera signal unavailable</b><span>Last staged frame retained · technical follow-up required</span></div>':''}</div>`}
screens.cameras=()=>{
 const cams=sim.cameras.filter(c=>journey.role!=='partner'||visibleFacilities().some(f=>f.id===c.site));
 const cam=cams.find(c=>c.id===sim.camera)||cams[0];if(!cam)return pageHead('SITE OBSERVATION','No cameras assigned','Assign a site to this partner before previewing camera views.')+empty('No assigned feeds','All feed previews use generated scenes.');
 return pageHead('SITE OBSERVATION','See the site. Investigate the signal.','Camera scenes and configurable sensor events.',simulatedNote())+
 `<div class="camera-layout"><section class="work-panel">${cameraView(cam)}<div class="camera-controls">${simBtn('Expand camera','expandCamera',cam.id)}${simBtn(sim.cameraPaused?'Play simulation':'Pause simulation','pauseCamera')}${simBtn(cam.night?'Day view':'Night view','nightCamera',cam.id)}${simBtn(cam.online?'Simulate outage':'Restore signal','cameraOutage',cam.id)}</div><div class="module-pad"><b>${esc(sampleFacility(cam.site)?.name||'')}</b><p>Staged plate match: KJA-042-LA · FLT-0042 · human review required.</p>${simBtn('Flag suspected dumping','dumping',cam.site)}</div></section><aside><section class="work-panel"><header><h2>Site cameras</h2><p>Choose a location and camera.</p></header><div class="camera-list">${cams.map(c=>`<button class="camera-choice ${c.id===cam.id?'selected':''}" data-module="sim-selectCamera" data-record="${c.id}">${icon('camera')}<span><b>${esc(c.name)}</b><small>${esc(sampleFacility(c.site)?.name||'')}</small></span>${status(c.online?'Online':'Offline')}</button>`).join('')}</div></section><section class="work-panel"><header><h2>Vehicle spacing</h2><p>Simulated bumper proximity sensor.</p></header><div class="module-pad"><div class="sensor-reading ${sim.sensorGap<sim.sensorThreshold?'breach':''}"><strong>${sim.sensorGap.toFixed(1)} <small>m</small></strong>${status(sim.sensorGap<sim.sensorThreshold?'Below threshold':'Safe spacing')}</div><p>Minimum gap: ${sim.sensorThreshold.toFixed(1)} m · FLT-0042 → FLT-0043</p>${simBtn('Simulate close spacing','proximity','',true)} ${simBtn('Configure threshold','threshold')} ${simBtn('Restore safe spacing','safeGap')}</div></section></aside></div>`;
};
const cameraTick=setInterval(()=>{
 if(document.hidden||sim.cameraPaused||journey.page!=='cameras')return;
 const el=document.querySelector('.camera-frame');if(el)el.dataset.frame=new Date().toLocaleTimeString('en-GB');
},1000);
function invoiceTable(invoices){return invoices.length?table(['Invoice / property','Related service','Amount','Status',''],invoices.map(i=>[`${i.id}<small class="cell-sub">${esc(i.property)}</small>`,esc(i.order),cash(i.amount),status(i.status),link('Open invoice','sim-invoice',i.id)])):empty('No invoices in this account','Billing records appear after a service receipt is created.');}
screens.finance=()=>pageHead('REVENUE & BILLING','Trace every account and receipt.','Dummy tariffs, property records and payment outcomes support the complete billing journey.',simBtn('Create invoice','newInvoice','',true))+
 stats([['Billed',cash(sim.invoices.reduce((n,i)=>n+i.amount,0)),'Sample account ledger'],['Reconciled',cash(sim.invoices.filter(i=>i.status==='Reconciled').reduce((n,i)=>n+i.amount,0)),'Bank match confirmed in simulation'],['Awaiting settlement',sim.invoices.filter(i=>i.status==='Payment received').length,'Gateway receipt is not settlement'],['Unmatched properties',sim.properties.filter(p=>!p.matched).length,'Revenue discovery candidates']])+
 panel('Invoice register','Payment attempts, receipts and reconciliation retain the invoice reference.',invoiceTable(sim.invoices))+
 panel('Revenue discovery','Resolve the unmatched account before creating a bill.',table(['Property','Area','Provider','State',''],sim.properties.filter(p=>!p.matched).map(p=>[esc(p.id),esc(p.area),esc(partnerName(p.partner)),status('Needs matching'),simBtn('Match account','matchProperty',p.id)])))+
 panel('Payment attempts','All transactions are simulated; no payment credentials are collected.',sim.payments.length?table(['Reference','Invoice','Outcome','Amount'],sim.payments.map(p=>[p.id,p.invoice,status(p.outcome),cash(p.amount)])):empty('No payment attempts','Open an invoice to try success, failure or retry.'));
function openInvoice(id){const i=sim.invoices.find(i=>i.id===id&&simScopeInvoice(i));if(!i)return;
 drawer(i.id,simulatedNote()+rowKV('Property',esc(i.property))+rowKV('Related service',esc(i.order))+rowKV('Tariff amount',cash(i.amount))+rowKV('Status',esc(i.status))+
 `<div class="drawer-actions">${['Outstanding','Payment failed','Reversed'].includes(i.status)?simBtn('Simulate checkout','checkout',id,true):''}${i.status==='Payment received'&&permitted('finance')?simBtn('Match bank settlement','reconcile',id,true):''}${i.status==='Reconciled'&&permitted('finance')?simBtn('Simulate reversal','reverse',id):''}${i.receipt?simBtn('View payment receipt','paymentReceipt',id):''}</div>`+
 note('Sample billing relates to the property and service period. Customer payment does not authorise partner payout.'));
}
const residentBase=screens.resident;
screens.resident=()=>{
 const r=modules.resident;
 return pageHead('RESIDENT SERVICES',`Hello, ${esc(r.name)}.`,'Your collection provider, schedule, account and service requests.',simBtn('Report a service issue','residentReport','',true))+
 `<div class="module-toolbar"><label for="demoHousehold">Household</label><select id="demoHousehold">${selectOptions(sim.properties.filter(p=>p.matched).map(p=>({value:p.id,label:p.id+' · '+p.name+' · '+p.area})),r.property)}</select></div>`+
 '<div class="journey-grid">'+panel('Your collection',esc(r.property)+' · '+esc(r.area),`<div class="module-pad"><h2>${esc(partnerName(r.partner))}</h2><p>Next scheduled collection: Monday · 07:00–12:00<br>Weekly service window.</p>${button('Find or change provider','residentSetup')}</div>`)+panel('Account summary','Sample charges and receipt status.',`<div class="module-pad"><div class="balance">${cash(sim.invoices.filter(i=>i.property===r.property&&!['Reconciled','Payment received'].includes(i.status)).reduce((n,i)=>n+i.amount,0))}</div><p>Outstanding balance</p>${simBtn('View notifications','goAlerts')}</div>`)+ '</div>'+
 panel('Your bills','Try successful payment or a failed attempt and retry.',invoiceTable(sim.invoices.filter(i=>i.property===r.property)))+
 panel('Your service requests','Reports retain their property and partner links.',modules.serviceRequests.filter(r=>r.property===modules.resident.property).length?table(['Reference','Issue','Status',''],modules.serviceRequests.filter(r=>r.property===modules.resident.property).map(r=>[r.id,esc(r.type),status(r.status),link('View request','residentRequest',r.id)])):empty('No open service requests','Report a missed collection or other issue to start a traceable case.'));
};
const originalCompliance=screens.compliance;
screens.compliance=()=>originalCompliance()+panel('Policy simulation','',`<div class="module-pad"><div class="capacity-line"><span>Service completion target</span><b>${sim.policy.target}%</b></div><div class="capacity-line"><span>Notice amount</span><b>${cash(sim.policy.penalty)}</b></div><p>${sim.policy.approved?'Approved for this scenario.':'Draft policy — review before a penalty decision.'}</p>${simBtn('Configure policy','policy')}</div>`);
screens.enforcement=()=>pageHead('ENFORCEMENT REVIEW','Review the evidence. Record a fair decision.','Progress a staged camera flag through verification, a notice and appeal.',simBtn('Create sample flag','dumping','FAC-003',true))+
 panel('Incident and appeal register','Flags never issue notices automatically.',sim.cases.length?table(['Case / source','Finding','Stage',''],sim.cases.map(c=>[`${c.id}<small class="cell-sub">${esc(c.site)}</small>`,esc(c.finding),status(c.stage),link('Open case','sim-enforcement',c.id)])):empty('No flagged incidents','Create a sample flag here or from Cameras & sensors.'));
screens.recovery=()=>{
 const batches=sim.batches.filter(b=>journey.role!=='partner'||b.partner===modules.partnerContext);
 return pageHead('RESOURCE RECOVERY','Account for what is recovered.','Follow a material batch from declared weight to processor acceptance.',simBtn('Register material batch','batch','',true))+panel('Material batches','Accepted weight and receipt stay linked to the batch.',batches.length?table(['Batch','Organisation','Material','Declared / accepted','Status',''],batches.map(b=>[b.id,esc(partnerName(b.partner)),esc(b.material),b.weight+' t / '+(b.accepted??'—')+' t',status(b.status),link('Open batch','sim-batchDetail',b.id)])):empty('No batches for this partner','Register a material batch to begin its recovery journey.'));
};
screens.partnerWork=()=>{
 const rows=sim.tickets.filter(t=>journey.role!=='partner'||t.partner===modules.partnerContext);
 return pageHead('PARTNER SERVICES','Work assigned to the right organisation.','Haulage transfers and technical support have their own work orders.',simBtn('Create work order','workOrder','',true))+
 panel('Work order register','Organisation, asset, owner and completion evidence.',table(['Order','Partner','Asset / route','Task','Status',''],rows.map(t=>[t.id,esc(partnerName(t.partner)),esc(t.asset),esc(t.issue),status(t.status),link('Update','sim-workDetail',t.id)])));
};
function visibleNotices(){
 return sim.notices.filter(n=>journey.role==='resident'?(n.property===modules.resident.property):isPartnerRole()?(n.partner===modules.partnerContext):true);
}
screens.alerts=()=>pageHead('NOTIFICATIONS','Keep the next action in view.','Operational exceptions and customer receipts from the same records.',simBtn('Mark all as read','readAll'))+
 panel('Notification centre','Events created by workflows appear here immediately.',visibleNotices().length?'<div class="notification-list">'+visibleNotices().map(n=>`<article class="notification-item"><div>${status(n.kind)}<h3>${esc(n.title)}</h3><p>${esc(n.detail)}</p><small>${stamp(n.time)} · ${n.read?'Read':'Unread'}</small></div>${simBtn(n.read?'View':'Read notification','notice',n.id)}</article>`).join('')+'</div>':empty('You’re up to date','Relevant workflow events will appear here.'));
const completion=o=>o.stops.filter(s=>s.synced).length/o.stops.length;
screens.reports=()=>pageHead('PERFORMANCE & GOVERNANCE','Make the operational picture explainable.','Figures below are calculated from service records.',simBtn('Export performance report','reportExport'))+
 stats([['Collection evidence',Math.round((sim.orders.reduce((n,o)=>n+completion(o),0)/Math.max(1,sim.orders.length))*100)+'%','Synced checkpoints across assignments'],['Verified disposal',sim.orders.filter(o=>o.receipt).length,'Linked weight and unloading records'],['Open exceptions',modules.incidents.filter(i=>i.status!=='Resolved').length,'Awaiting operational closure'],['Accepted recovery',sim.batches.reduce((n,b)=>n+(b.accepted||0),0).toFixed(2)+' t','Processor-confirmed sample receipts']])+
 panel('Partner performance','Service responsibilities determine which evidence applies.',table(['Organisation','Responsibility','Evidence / workload'],modules.partners.map(p=>[esc(p.name),esc(p.service),p.service==='Collection'?sim.orders.filter(o=>o.partner===p.id).length+' service assignments':p.service==='Recovery'?sim.batches.filter(b=>b.partner===p.id&&b.status==='Accepted').length+' accepted batches':p.service==='Facility operations'?modules.visits.filter(v=>modules.facilities.some(f=>f.id===v.facility&&f.partner===p.id)).length+' recorded visits':sim.tickets.filter(t=>t.partner===p.id&&t.status==='Completed').length+' completed work orders'])))+
 panel('Route planning comparison','',table(['Plan','Distance','Estimated duration','Action'],[['Current sample plan','18.6 km','96 min',simBtn('Preview proposed plan','plan')],['Proposed sample plan','16.2 km','83 min','Subject to road access and service-area validation']]));
screens.scenarios=()=>pageHead('SCENARIO CONTROL','Present the entire operating story.','Choose a scenario, then show its effect in the responsible workspace.',simulatedNote())+
 '<div class="scenario-grid">'+[
 ['Collection to disposal','Assign → collect → offline sync → intake → receipt → property billing.','Open connected services','goServices'],
 ['Facility congestion','Add simulated arrivals until the site limit is exceeded.','Simulate congestion','congestion'],
 ['Camera and vehicle sensor','Inspect a staged feed, lose a signal or trigger a spacing alert.','Open cameras','goCameras'],
 ['Resident payment','Pay a dummy invoice, try a failed attempt and retry.','Open billing','goFinance'],
 ['Enforcement and appeal','Review a staged flag, verify a finding and record an appeal outcome.','Open enforcement','goEnforcement'],
 ['Platform continuity','Simulate the primary service becoming unavailable and activate standby.','Preview continuity','continuity'],
 ['Route planning','Compare two plans and inspect a road-aligned path.','Preview route plans','plan'],
 ['Partner work orders','Manage haulage or technical work beyond PSP collection.','Open work orders','goWork']
 ].map(([title,desc,label,cmd])=>`<section class="work-panel"><header><h2>${title}</h2><p>${desc}</p></header><div class="module-pad">${simBtn(label,cmd,'',true)}</div></section>`).join('')+'</div>';
const preSimRun=runModule;
runModule=function(cmd,id){
 if(!cmd.startsWith('sim-')){preSimRun(cmd,id);return}
 const a=cmd.slice(4),o=simOrder(id);
 const dest={goServices:'serviceLedger',goCameras:'cameras',goFinance:'finance',goEnforcement:'enforcement',goWork:'partnerWork',goAlerts:'alerts'};
 if(dest[a]){goJourney(dest[a]);return}
 if(a==='order'){openService(id);return}
 if(a==='advance'){if(o)advanceOrder(o);return}
 if(a==='connection'){sim.online=!sim.online;simSave(sim.online?'Simulated connection restored. Queued records can sync.':'Offline simulation enabled. Captures remain queued.');if(!$('modalBack').hidden&&activeService)openService(activeService);return}
 if(a==='assign'){
  if(!permitted('dispatch'))return;
  const partners=modules.partners.filter(p=>p.status==='Active'&&p.service==='Collection'&&(!isPartnerRole()||p.id===modules.partnerContext));
  if(!partners.length){toast('An active collection partner is needed.');return}
  const preferred=partners.find(p=>p.id==='PAR-006')||partners[0];
  const options=pid=>partnerFleet(pid).filter(v=>!sim.orders.some(o=>o.vehicle===v.code&&o.stage!=='Verified')).map(v=>({value:v.code,label:v.code+' · '+v.district}));
  openForm('Create service assignment','Dummy crews, property checkpoints and a sample road route will be linked automatically.',[field('partner','Collection partner',{options:partners.map(p=>({value:p.id,label:p.name})),value:preferred.id}),field('vehicle','Available vehicle',{options:options(preferred.id)}),field('area','Route area',{options:ROUTES.map(r=>r.name)}),field('facility','Disposal destination',{options:modules.facilities.map(f=>({value:f.id,label:f.name}))})],'Create assignment',d=>{
   const v=fleet.find(v=>v.code===d.vehicle);if(!v||v.partnerId!==d.partner)return'Choose a vehicle belonging to this partner.';
   if(sim.orders.some(o=>o.vehicle===d.vehicle&&o.stage!=='Verified'))return'This vehicle is already assigned.';
   const crew=modules.personnel.find(p=>p.partner===d.partner&&p.status==='Available');if(!crew)return'Add an available crew member to this organisation first.';
   const job=seedOrder(d.partner,d.vehicle,d.area,crew.name);job.facility=d.facility;simNotice('Route assigned',job.id+' · '+job.vehicle,'serviceLedger');sim.notices[0].partner=d.partner;recordModuleAction(job.id+' created with route and property checkpoints');
  });$('mf-partner').onchange=e=>$('mf-vehicle').innerHTML=selectOptions(options(e.target.value));return;
 }
 if(a==='map'){
  if(!o||!permitted('fleet'))return;closeModal();simMoveVehicle(o);state.query=o.vehicle.toLowerCase();state.status='all';state.district='all';state.viewport=false;$('search').value=o.vehicle;$('status').value='all';$('district').value='all';$('viewportOnly').checked=false;goJourney('fleet');selectVehicle(fleet.find(v=>v.code===o.vehicle).id);return;
 }
 if(a==='receipt'&&o?.receipt){drawer(o.receipt.id,simulatedNote()+rowKV('Service',o.id)+rowKV('Vehicle',o.vehicle)+rowKV('Gross',o.receipt.gross+' kg')+rowKV('Tare',o.receipt.tare+' kg')+rowKV('Net',o.receipt.net+' kg')+rowKV('Unloading','Confirmed')+rowKV('Issued',stamp(o.receipt.time)));return}
 if(a==='selectCamera'){sim.camera=id;saveModules();renderJourney();return}
 if(a==='expandCamera'){const c=sim.cameras.find(c=>c.id===id);if(c)drawer(c.name,cameraView(c));return}
 if(a==='pauseCamera'){sim.cameraPaused=!sim.cameraPaused;saveAndRender(sim.cameraPaused?'Camera simulation paused.':'Camera simulation playing.');return}
 if(a==='nightCamera'){const c=sim.cameras.find(c=>c.id===id);if(c)c.night=!c.night;saveModules();renderJourney();return}
 if(a==='cameraOutage'){
  const c=sim.cameras.find(c=>c.id===id);if(!c)return;c.online=!c.online;
  if(!c.online){simFlag('Camera offline',c.id+' lost its simulated feed.',c.site);if(!sim.tickets.some(t=>t.asset===c.id&&t.status!=='Completed'))sim.tickets.unshift({id:moduleID('SUP',sim.tickets),partner:'PAR-022',asset:c.id,issue:'Restore camera signal',status:'Assigned',note:''})}
  simSave(c.id+(c.online?' signal restored.':' outage created a technical follow-up.'));return;
 }
 if(a==='proximity'){sim.sensorGap=Math.max(.1,sim.sensorThreshold*.4);simFlag('Unsafe vehicle spacing','FLT-0042 proximity gap '+sim.sensorGap.toFixed(1)+' m; threshold '+sim.sensorThreshold+' m.','FAC-001');simSave('Sensor alert recorded for supervisor review.');return}
 if(a==='safeGap'){sim.sensorGap=sim.sensorThreshold+1.6;simSave('Safe spacing restored. Incident remains for supervisor closure.');return}
 if(a==='threshold'){openForm('Configure spacing alert','This sample threshold is not an approved LAWMA safety standard.',[field('threshold','Minimum gap (metres)',{type:'number',min:.1,max:20,step:.1,value:sim.sensorThreshold})],'Save threshold',d=>{sim.sensorThreshold=+d.threshold;if(sim.sensorGap<sim.sensorThreshold)simFlag('Unsafe vehicle spacing','Current simulated gap falls below the new threshold.','FAC-001');recordModuleAction('Sensor threshold set to '+d.threshold+' m')});return}
 if(a==='congestion'){
  const f=sampleFacility('FAC-001');const needed=Math.max(0,f.capacity+2-occupancy(f));
  for(const v of fleet.filter(v=>!modules.visits.some(x=>x.vehicle===v.code&&!x.departed)).slice(0,needed))modules.visits.unshift({id:moduleID('VIS',modules.visits),facility:f.id,vehicle:v.code,partner:v.partnerId,arrived:simNow(),departed:null});
  simFlag('Capacity breach',f.name+' has '+occupancy(f)+' vehicles against capacity '+f.capacity+'.',f.id);simSave('Congestion scenario ready. Review the site and its incident.');goJourney('capacity');return;
 }
 if(a==='invoice'){openInvoice(id);return}
 if(a==='newInvoice'){
  openForm('Create sample invoice','Select a matched property. The amount uses a standard tariff.',[field('property','Property account',{options:sim.properties.filter(p=>p.matched).map(p=>({value:p.id,label:p.id+' · '+p.area}))}),field('amount','Amount (NGN)',{type:'number',min:1,value:15000})],'Create invoice',d=>{const inv={id:moduleID('BILL',sim.invoices),property:d.property,order:'Manual service-period invoice',amount:+d.amount,status:'Outstanding',created:simNow(),receipt:null};sim.invoices.unshift(inv);recordModuleAction(inv.id+' sample invoice created')});return;
 }
 if(a==='matchProperty'){const p=sim.properties.find(p=>p.id===id);if(!p)return;openForm('Match property account',p.id+' · '+p.area,[field('partner','Collection partner',{options:partnerOptions(p=>p.service==='Collection'&&p.status==='Active'),value:p.partner}),field('confirmed','Property and service area checked',{type:'checkbox'})],'Confirm match',d=>{p.partner=d.partner;p.matched=true;recordModuleAction(p.id+' linked to a collection account')});return}
 if(a==='checkout'){
  const inv=sim.invoices.find(i=>i.id===id&&simScopeInvoice(i));if(!inv||['Payment received','Reconciled'].includes(inv.status))return;
  openForm('Checkout',inv.id+' · '+cash(inv.amount)+' · no money moves and no card details are needed.',[field('provider','Simulated provider',{options:['Paystack','Flutterwave']}),field('outcome','Payment outcome',{options:['Successful','Failed']})],'Run simulated payment',d=>{
   const payment={id:moduleID('PAY',sim.payments),invoice:id,amount:inv.amount,outcome:d.outcome,provider:d.provider,time:simNow()};sim.payments.unshift(payment);inv.status=d.outcome==='Successful'?'Payment received':'Payment failed';inv.receipt=d.outcome==='Successful'?payment.id:null;
   simNotice(d.outcome==='Successful'?'Payment receipt ready':'Payment failed — retry available',id+' · '+cash(inv.amount),'resident');sim.notices[0].property=inv.property;recordModuleAction(payment.id+' '+d.outcome+' simulated payment');
  });return;
 }
 if(a==='reconcile'){
  const inv=sim.invoices.find(i=>i.id===id);if(!inv||inv.status!=='Payment received'||!permitted('finance'))return;
  openForm('Match settlement',id+' · expected '+cash(inv.amount),[textField('ref','Dummy bank reference','BANK-'+id),field('amount','Bank amount (NGN)',{type:'number',min:1,value:inv.amount})],'Confirm bank match',d=>{if(+d.amount!==inv.amount)return'Amount does not match the invoice. Investigate before reconciliation.';inv.status='Reconciled';inv.bank=d.ref;simNotice('Payment reconciled',id+' matched to the sample bank record.','resident');sim.notices[0].property=inv.property;recordModuleAction(id+' bank match confirmed')});return;
 }
 if(a==='reverse'){
  const inv=sim.invoices.find(i=>i.id===id);if(!inv||inv.status!=='Reconciled')return;
  openForm('Simulate payment reversal',id+' will return to an outstanding balance.',[textField('reason','Reason')],'Record reversal',d=>{inv.status='Reversed';sim.payments.unshift({id:moduleID('PAY',sim.payments),invoice:id,amount:inv.amount,outcome:'Reversed',provider:'Bank simulation',time:simNow()});simNotice('Payment reversed',id+' · '+d.reason,'resident','Warning');sim.notices[0].property=inv.property;recordModuleAction(id+' sample reversal: '+d.reason)});return;
 }
 if(a==='paymentReceipt'){const i=sim.invoices.find(i=>i.id===id&&simScopeInvoice(i));if(i)drawer('Simulated receipt',rowKV('Reference',esc(i.receipt||'Pending'))+rowKV('Invoice',i.id)+rowKV('Amount',cash(i.amount))+rowKV('State',esc(i.status)));return}
 if(a==='residentReport'){preSimRun('residentReport',id);return}
 if(a==='policy'){openForm('Configure policy','Approve only for this simulated scenario. Real rules require LAWMA validation.',[field('target','Completion target (%)',{type:'number',min:1,max:100,value:sim.policy.target}),field('penalty','Notice amount (NGN)',{type:'number',min:0,value:sim.policy.penalty}),field('approved','Approved for this scenario',{type:'checkbox'})],'Save policy',d=>{sim.policy={target:+d.target,penalty:+d.penalty,approved:true};recordModuleAction('Policy configured')});return}
 if(a==='dumping'){
  const c={id:moduleID('ENF',sim.cases),site:id||'FAC-003',stage:'Unverified flag',finding:'Staged low-light vehicle detection. Identity and offence unconfirmed.',amount:null,notes:[]};sim.cases.unshift(c);simNotice('Camera flag requires review',c.id+' · no automatic enforcement action','enforcement','Warning');simSave(c.id+' created for human review.');return;
 }
 if(a==='enforcement'){
  const c=sim.cases.find(c=>c.id===id);if(!c)return;
  const labels={'Unverified flag':'Review evidence','Field verification':'Record field finding','Verified finding':'Prepare notice','Notice issued':'Submit appeal','Appeal received':'Review appeal'};
  drawer(c.id,simulatedNote()+scene('camera',true)+rowKV('Stage',esc(c.stage))+`<p>${esc(c.finding)}</p>`+(c.amount!==null?rowKV('Amount',cash(c.amount)):'')+(labels[c.stage]?simBtn(labels[c.stage],'enforceNext',c.id,true):'')+'<ol class="module-timeline">'+c.notes.map(n=>`<li>${esc(n)}</li>`).join('')+'</ol>');return;
 }
 if(a==='enforceNext'){
  const c=sim.cases.find(c=>c.id===id);if(!c)return;
  if(c.stage==='Verified finding'&&!sim.policy.approved){toast('Approve a policy in Compliance before preparing a notice.');return}
  const options={'Unverified flag':['Request field verification','Dismiss false positive'],'Field verification':['Verify finding','Insufficient evidence'],'Verified finding':['Issue notice'],'Notice issued':['Submit appeal'],'Appeal received':['Allow appeal — withdraw notice','Uphold notice']}[c.stage];if(!options)return;
  openForm('Review '+id,'A human decision is required at each stage. No legal notice is sent.',[field('decision','Decision',{options}),field('note','Evidence / decision reason',{type:'textarea'})],'Record decision',d=>{
   const states={'Request field verification':'Field verification','Dismiss false positive':'Dismissed','Verify finding':'Verified finding','Insufficient evidence':'Dismissed','Issue notice':'Notice issued','Submit appeal':'Appeal received','Allow appeal — withdraw notice':'Notice withdrawn','Uphold notice':'Notice upheld'};
   c.stage=states[d.decision];if(['Verified finding','Dismissed'].includes(c.stage))c.finding=d.note;c.notes.push(d.decision+': '+d.note);if(c.stage==='Notice issued')c.amount=sim.policy.penalty;recordModuleAction(id+' '+c.stage);
  });return;
 }
 if(a==='batch'){
  openForm('Register recovery batch','Link material to its recovery partner.',[field('partner','Recovery partner',{options:partnerOptions(p=>p.service==='Recovery'&&(!isPartnerRole()||p.id===modules.partnerContext))}),field('material','Material',{options:['Sorted PET','Paper','Metal','Mixed recyclables']}),field('weight','Declared weight (tonnes)',{type:'number',min:.01,step:.01,value:1.2})],'Register batch',d=>{sim.batches.unshift({id:moduleID('MAT',sim.batches),partner:d.partner,material:d.material,weight:+d.weight,accepted:null,status:'Awaiting receipt',receipt:''});recordModuleAction('Recovery batch registered')});return;
 }
 if(a==='batchDetail'){
  const b=sim.batches.find(b=>b.id===id&&(!isPartnerRole()||b.partner===modules.partnerContext));if(!b)return;
  drawer(b.id,rowKV('Material',esc(b.material))+rowKV('Declared weight',b.weight+' t')+rowKV('Accepted weight',(b.accepted??'—')+' t')+rowKV('Status',esc(b.status))+rowKV('Receipt',esc(b.receipt||'Pending'))+(b.status==='Accepted'?'':simBtn('Record processor outcome','batchAccept',id,true)));return;
 }
 if(a==='batchAccept'){
  const b=sim.batches.find(b=>b.id===id);if(!b)return;
  openForm('Processor outcome',id+' · '+b.weight+' tonnes declared.',[field('outcome','Outcome',{options:['Accepted','Rejected — contamination']}),field('weight','Accepted weight (tonnes)',{type:'number',min:0,max:b.weight,step:.01,value:b.weight}),textField('receipt','Dummy receipt reference','PROC-'+id)],'Save outcome',d=>{if(+d.weight>b.weight)return'Accepted weight cannot exceed declared weight.';b.status=d.outcome;b.accepted=d.outcome==='Accepted'?+d.weight:0;b.receipt=d.receipt;simNotice('Material outcome recorded',id+' · '+d.outcome,'recovery');sim.notices[0].partner=b.partner;recordModuleAction(id+' '+d.outcome)});return;
 }
 if(a==='workOrder'){
  if(!modules.partners.some(p=>p.status==='Active'&&['Transport','Technical support'].includes(p.service)&&(!isPartnerRole()||p.id===modules.partnerContext))){toast('Activate a transport or technical support partner before assigning work.');return}
  openForm('Create partner work order','Assign a non-collection task to an appropriate organisation.',[field('partner','Organisation',{options:partnerOptions(p=>p.status==='Active'&&['Transport','Technical support'].includes(p.service)&&(!isPartnerRole()||p.id===modules.partnerContext))}),textField('asset','Asset or transfer route'),textField('issue','Task description')],'Create work order',d=>{sim.tickets.unshift({id:moduleID('WO',sim.tickets),...d,status:'Assigned',note:''});recordModuleAction('Partner work order created')});return;
 }
 if(a==='workDetail'){
  if(isPartnerRole()&&currentPartner().status!=='Active'){toast('Ask LAWMA to review and activate this partner registration first.');return}
  const t=sim.tickets.find(t=>t.id===id&&(!isPartnerRole()||t.partner===modules.partnerContext));if(!t)return;
  if(t.status==='Completed'){drawer(id,rowKV('Outcome',esc(t.note))+rowKV('Status','Completed'));return}
  openForm('Update '+id,t.issue+' · '+t.asset,[field('status','Progress',{options:t.status==='Assigned'?['In progress']:['Completed','Blocked']}),field('note','Progress / completion evidence',{type:'textarea'})],'Save progress',d=>{t.status=d.status;t.note=d.note;if(t.status==='Completed'&&t.asset.startsWith('CAM-')){const cam=sim.cameras.find(c=>c.id===t.asset);if(cam)cam.online=true}recordModuleAction(id+' '+d.status)});return;
 }
 if(a==='readAll'){visibleNotices().forEach(n=>n.read=true);simSave('Notifications marked as read.');return}
 if(a==='notice'){const n=visibleNotices().find(n=>n.id===id);if(!n)return;n.read=true;saveModules();drawer(n.title,`<p>${esc(n.detail)}</p><small>${stamp(n.time)}</small>`+(permitted(n.target)?simBtn('Open workspace','noticeGo',n.id,true):''));return}
 if(a==='noticeGo'){const n=visibleNotices().find(n=>n.id===id);if(n){closeModal();goJourney(n.target)}return}
 if(a==='continuity'){drawer('Continuity simulation',simulatedNote()+rowKV('Primary service',sim.failover?'Unavailable':'Available')+rowKV('Standby',sim.failover?'Serving simulated traffic':'Ready')+rowKV('Data state','Shared local records')+simBtn(sim.failover?'Restore primary service':'Simulate primary failure','failover','',true));return}
 if(a==='failover'){sim.failover=!sim.failover;simNotice('Platform continuity',sim.failover?'Standby activated.':'Primary restored.','systems','Warning');simSave('Continuity state updated.');runModule('sim-continuity','');return}
 if(a==='plan'){drawer('Route comparison',table(['Plan','Distance','Time'],[['Current sample','18.6 km','96 min'],['Proposed sample','16.2 km','83 min']])+note('Scenario assumptions, not calculated savings. Heavy-vehicle access and actual service boundaries require validation.')+simBtn('Show sample road route','map',sim.orders[0]?.id||'',true));return}
 if(a==='reportExport'){
  const rows=[['Service records',sim.orders.length],['Verified receipts',sim.orders.filter(o=>o.receipt).length],['Collected sample revenue',sim.invoices.filter(i=>i.status==='Reconciled').reduce((n,i)=>n+i.amount,0)],['Accepted recovery tonnes',sim.batches.reduce((n,b)=>n+(b.accepted||0),0)]];
  const url=URL.createObjectURL(new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'}));const a=document.createElement('a');a.href=url;a.download='LAWMA-performance.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('Performance report exported.');return;
 }
};
screens.crew=()=>pageHead('FIELD SHIFT','Your assigned collections','Capture staged evidence, work through an offline period and hand over each load.',simBtn(sim.online?'Go offline':'Restore connection','connection'))+panel('Collection work','Open a service to capture each checkpoint.',simOrderTable());
const priorFacility=screens.facility;
screens.facility=()=>pageHead('FACILITY INTAKE','Receive and verify each load.','Gate arrival, weighing, unloading and a traceable receipt.',routeButton('View site capacity','capacity'))+panel('Connected arrivals','Collected services can arrive here. Confirm gross and tare before issuing a receipt.',simOrderTable(ownedOrders().filter(o=>['Collected','At facility','Verified'].includes(o.stage))))+
 panel('Occupancy','Open arrivals contribute to the site count; receipt completion records departure.',`<div class="module-pad">${visibleFacilities().map(f=>`<div class="capacity-line"><span>${esc(f.name)}</span><b>${occupancy(f)} / ${f.capacity}</b></div>`).join('')}</div>`);
function scIcon(name, size = 16) {
  const icons = {
    truck: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M14 18h4l3-4v-4h-7"/><path d="M14 18H9"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/></svg>`,
    scale: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h18"/></svg>`,
    home: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z"/><path d="M9 21V12h6v9"/></svg>`,
    shield: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
    alert: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
    refresh: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>`,
    arrowRight: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
    route: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="19" r="3"/><circle cx="18" cy="5" r="3"/><path d="M12 19h4.5a3.5 3.5 0 0 0 0-7h-9a3.5 3.5 0 0 1 0-7H12"/></svg>`,
    scan: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 12h10"/></svg>`,
    receipt: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z"/><path d="M16 8h-8"/><path d="M16 12h-8"/><path d="M11 16h-3"/></svg>`,
    banknote: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="2"/><circle cx="12" cy="12" r="2"/><path d="M6 12h.01M18 12h.01"/></svg>`,
    layers: `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`
  };
  return icons[name] || icons.arrowRight;
}

function renderOverviewHero() {
  const onRouteCount = fleet.filter(v => v.status === 'On route').length;
  const onRoutePct = Math.round((onRouteCount / (fleet.length || 1)) * 100);
  return `
  <section class="overview-hero-banner">
    <div class="overview-hero-top">
      <div class="overview-hero-kicker">
        <span class="pulse-dot"></span>
        <span>LAGOS STATE WASTE MANAGEMENT AUTHORITY · SOVEREIGN OPERATIONS COMMAND</span>
      </div>
      <div class="overview-hero-meta">
        <span class="overview-hero-coord">6.5244° N · 3.3792° E · 20 LGAs</span>
        <span class="overview-hero-status-pill"><i class="status-dot-green"></i> ONSHORE TIER III</span>
      </div>
    </div>
    <div class="overview-hero-main">
      <div class="overview-hero-headline">
        <h1>Statewide Waste & Concession Assurance Console</h1>
        <p>Real-time compactor GPS telemetry, weighbridge scale ingestion, compound tenement cadastre billing, and concessionaire SLA settlement across 20 Local Government Areas.</p>
      </div>
      <div class="overview-hero-actions">
        <button class="btn primary" data-go="cadastre">${scIcon('home', 14)} Tenement Cadastre (MOD-01)</button>
        <button class="btn" data-go="fleet">${scIcon('truck', 14)} Live Fleet Map</button>
        <button class="btn" data-go="capacity">${scIcon('scale', 14)} Weighbridge Queues</button>
        <button class="btn-ghost" data-module="sim-telemetry">${scIcon('refresh', 13)} Refresh Telemetry</button>
      </div>
    </div>
    <div class="overview-hero-strip">
      <div class="overview-hero-chip">
        <span class="chip-label">Data Residency</span>
        <span class="chip-val">Verified Onshore Sovereign Cloud</span>
      </div>
      <div class="overview-hero-chip">
        <span class="chip-label">Active Grid Fleet</span>
        <span class="chip-val">${onRouteCount} / ${fleet.length} Compactors (${onRoutePct}%)</span>
      </div>
      <div class="overview-hero-chip">
        <span class="chip-label">Today's Certified Intake</span>
        <span class="chip-val">3,842 Tonnes · 5 Primary Sites</span>
      </div>
      <div class="overview-hero-chip">
        <span class="chip-label">Weather Protocol</span>
        <span class="chip-val">Dry Conditions · No Flood Grace Active</span>
      </div>
    </div>
  </section>`;
}

function renderOverviewKpis() {
  const onRoute = fleet.filter(v => v.status === 'On route').length;
  const onRoutePct = Math.round((onRoute / (fleet.length || 1)) * 100);
  const openIncidents = modules.incidents.filter(i => i.status !== 'Resolved').length;
  const propCount = modules.properties ? modules.properties.length : 5;
  const unitCount = modules.properties ? modules.properties.reduce((n, p) => n + (p.units ? p.units.length : 0), 0) : 37;

  return `
  <div class="kpi-cards-grid">
    <div class="kpi-card">
      <div class="kpi-card-head">
        <div class="kpi-card-title-group">
          <span class="kpi-card-tag">FLEET TELEMETRY</span>
          <span class="kpi-card-title">Active Compactors</span>
        </div>
        <span class="sc-pill sc-pill-forest">${onRoutePct}% ON GRID</span>
      </div>
      <div class="kpi-card-metric">
        <span class="kpi-card-num">${onRoute}</span>
        <span class="kpi-card-denom">/ ${fleet.length} TRUCKS</span>
      </div>
      <div class="kpi-card-breakdown">
        <span>598 en route</span> · <span>86 at scale</span> · <span>316 depot</span>
      </div>
      <div class="kpi-card-progress">
        <div class="progress-fill" style="width:${onRoutePct}%"></div>
      </div>
      <div class="kpi-card-foot">
        ${scIcon('truck', 13)}
        <span>GPS breadcrumbs active across Lagos</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card-head">
        <div class="kpi-card-title-group">
          <span class="kpi-card-tag">SCALE INGESTION</span>
          <span class="kpi-card-title">Daily Net Tonnage</span>
        </div>
        <span class="sc-pill sc-pill-honey">76.8% TARGET</span>
      </div>
      <div class="kpi-card-metric">
        <span class="kpi-card-num">3,842</span>
        <span class="kpi-card-denom">TONNES RECONCILED</span>
      </div>
      <div class="kpi-card-breakdown">
        <span>Target: 5,000 T</span> · <span>312 loads</span> · <span>12.4 T avg</span>
      </div>
      <div class="kpi-card-progress">
        <div class="progress-fill progress-honey" style="width:76.8%"></div>
      </div>
      <div class="kpi-card-foot">
        ${scIcon('scale', 13)}
        <span>Olusosun, Solous, Simpson, Oshodi, Epe</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card-head">
        <div class="kpi-card-title-group">
          <span class="kpi-card-tag">MOD-01 CADASTRE</span>
          <span class="kpi-card-title">Dwelling Unit IDs</span>
        </div>
        <span class="sc-pill sc-pill-forest">RING-FENCED</span>
      </div>
      <div class="kpi-card-metric">
        <span class="kpi-card-num">${propCount}</span>
        <span class="kpi-card-denom">PROPERTIES (${unitCount} DUIDs)</span>
      </div>
      <div class="kpi-card-breakdown">
        <span>37 Wallets</span> · <span>₦1.84M balance</span> · <span>0 suspended</span>
      </div>
      <div class="kpi-card-progress">
        <div class="progress-fill progress-forest" style="width:100%"></div>
      </div>
      <div class="kpi-card-foot">
        ${scIcon('home', 13)}
        <span>Unit-level billing isolated from landlord debt</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card-head">
        <div class="kpi-card-title-group">
          <span class="kpi-card-tag">CONCESSIONS</span>
          <span class="kpi-card-title">Accredited PSPs</span>
        </div>
        <span class="sc-pill sc-pill-blue">100% SLA LOCK</span>
      </div>
      <div class="kpi-card-metric">
        <span class="kpi-card-num">${modules.partners.length}</span>
        <span class="kpi-card-denom">OPERATORS ASSURED</span>
      </div>
      <div class="kpi-card-breakdown">
        <span>24 Active routes</span> · <span>99.1% telemetry</span> · <span>₦32.4M escrow</span>
      </div>
      <div class="kpi-card-progress">
        <div class="progress-fill progress-blue" style="width:100%"></div>
      </div>
      <div class="kpi-card-foot">
        ${scIcon('shield', 13)}
        <span>Covering 5 major Lagos concession zones</span>
      </div>
    </div>

    <div class="kpi-card">
      <div class="kpi-card-head">
        <div class="kpi-card-title-group">
          <span class="kpi-card-tag">SUPERVISOR QUEUE</span>
          <span class="kpi-card-title">Active Exceptions</span>
        </div>
        <span class="sc-pill ${openIncidents > 0 ? 'sc-pill-honey' : 'sc-pill-forest'}">${openIncidents > 0 ? openIncidents + ' PENDING' : 'ALL CLEAR'}</span>
      </div>
      <div class="kpi-card-metric">
        <span class="kpi-card-num">${openIncidents}</span>
        <span class="kpi-card-denom">TRIAGE CASES</span>
      </div>
      <div class="kpi-card-breakdown">
        <span>1 Illegal dumping</span> · <span>18m avg dispatch time</span>
      </div>
      <div class="kpi-card-progress">
        <div class="progress-fill ${openIncidents > 0 ? 'progress-honey' : 'progress-forest'}" style="width:${Math.max(10, openIncidents * 20)}%"></div>
      </div>
      <div class="kpi-card-foot">
        ${scIcon('alert', 13)}
        <span>Section 84 evidence certificate ready</span>
      </div>
    </div>
  </div>`;
}

function renderOverviewCharts() {
  const facilities = [
    { name: 'Olusosun Landfill (Ojota)', queue: '4 in queue · 14m turnaround', actual: 1420, cap: 1600, pct: 88.8, status: 'near' },
    { name: 'Solous Landfill (Igando)', queue: '2 in queue · 11m turnaround', actual: 980, cap: 1300, pct: 75.4, status: 'ok' },
    { name: 'Simpson TLS (Lagos Island)', queue: '1 in queue · 8m turnaround', actual: 620, cap: 900, pct: 68.9, status: 'ok' },
    { name: 'Oshodi TLS (Oshodi-Isolo)', queue: '2 in queue · 9m turnaround', actual: 510, cap: 850, pct: 60.0, status: 'ok' },
    { name: 'Epe Landfill (Diversion Reserve)', queue: 'Open intake · Rain diversion', actual: 312, cap: 800, pct: 39.0, status: 'reserve' }
  ];

  const maxCap = 1600;
  const barSvg = `
    <svg class="sc-tremor-chart" viewBox="0 0 600 230" role="img" aria-label="Facility Intake vs Daily Capacity">
      <!-- Grid guidelines -->
      <line x1="195" y1="10" x2="195" y2="195" stroke="var(--sc-border-faint)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="265" y1="10" x2="265" y2="195" stroke="var(--sc-border-faint)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="335" y1="10" x2="335" y2="195" stroke="var(--sc-border-faint)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="405" y1="10" x2="405" y2="195" stroke="var(--sc-border-faint)" stroke-width="1" stroke-dasharray="3 3" />
      <line x1="475" y1="10" x2="475" y2="195" stroke="var(--sc-border-faint)" stroke-width="1" />

      ${facilities.map((f, i) => {
        const y = 14 + i * 36;
        const capWidth = Math.round((f.cap / maxCap) * 280);
        const actualWidth = Math.round((f.actual / maxCap) * 280);
        const barColor = f.status === 'near' ? 'var(--sc-heat, #f47707)' : f.status === 'reserve' ? 'var(--sc-blue, #2a6dfb)' : 'var(--sc-forest, #42c366)';
        return `
          <text x="185" y="${y + 11}" text-anchor="end" font-size="11" font-weight="500" fill="var(--sc-fg)">${f.name}</text>
          <text x="185" y="${y + 22}" text-anchor="end" font-size="9" font-family="var(--sc-mono)" fill="var(--sc-fg-muted)">${f.queue}</text>

          <!-- Capacity Track -->
          <rect x="195" y="${y + 2}" width="${capWidth}" height="16" rx="4" fill="var(--sc-a4)" stroke="var(--sc-border-faint)" stroke-width="1" />

          <!-- Actual Ingestion Bar -->
          <rect x="195" y="${y + 2}" width="${actualWidth}" height="16" rx="4" fill="${barColor}" />

          <!-- Ingestion Metric readout in right column -->
          <text x="488" y="${y + 14}" font-size="11" font-family="var(--sc-mono)" font-weight="500" fill="var(--sc-fg)">${f.actual} T <tspan font-size="9.5" fill="var(--sc-fg-muted)">(${f.pct}%)</tspan></text>
        `;
      }).join('')}

      <!-- Bottom Axis Scale -->
      <line x1="195" y1="198" x2="475" y2="198" stroke="var(--sc-border)" stroke-width="1" />
      <text x="195" y="214" font-size="10" font-family="var(--sc-mono)" fill="var(--sc-fg-muted)">0 T</text>
      <text x="335" y="214" text-anchor="middle" font-size="10" font-family="var(--sc-mono)" fill="var(--sc-fg-muted)">800 T (50%)</text>
      <text x="475" y="214" text-anchor="end" font-size="10" font-family="var(--sc-mono)" fill="var(--sc-fg)">1,600 T Cap</text>
    </svg>
  `;

  return `
  <div class="overview-charts-grid">
    <div class="sc-data-card">
      <div class="sc-card-header">
        <div>
          <div class="sc-card-tag">INFRASTRUCTURE INTAKE</div>
          <h2 class="sc-card-title">Facility Tonnage Ingestion vs Daily Capacity</h2>
          <div class="sc-card-sub">Net weighed gross-tare receipts recorded at certified scales today</div>
        </div>
        <div class="sc-chart-legend">
          <span><i style="background:var(--sc-forest, #42c366)"></i> Normal Flow</span>
          <span><i style="background:var(--sc-heat, #f47707)"></i> >85% Near Cap</span>
          <span><i style="background:var(--sc-a4);border:1px solid var(--sc-border-faint)"></i> Design Headroom</span>
        </div>
      </div>
      ${barSvg}
    </div>

    <div class="sc-data-card">
      <div class="sc-card-header">
        <div>
          <div class="sc-card-tag">SETTLEMENT PIPELINE</div>
          <h2 class="sc-card-title">End-to-End Service Assurance Pipeline</h2>
          <div class="sc-card-sub">Physical doorstep scan to audited Friday escrow settlement chain</div>
        </div>
        <span class="sc-pill sc-pill-forest">ESCROW CHAIN ACTIVE</span>
      </div>

      <div class="sc-pipeline-container">
        <div class="sc-pipeline-item">
          <div class="sc-pipeline-row">
            <div class="sc-pipeline-title">
              ${scIcon('route', 15)}
              <span>01. Dispatched Stops on Route</span>
            </div>
            <span class="sc-pipeline-metric">1,840 stops <small>(100%)</small></span>
          </div>
          <div class="sc-pipeline-bar"><div class="sc-pipeline-fill" style="width:100%"></div></div>
          <div class="sc-pipeline-meta">
            <span>24 Compactor routes active across 20 LGAs</span>
            <span>Dry conditions · Level 0</span>
          </div>
        </div>

        <div class="sc-pipeline-item">
          <div class="sc-pipeline-row">
            <div class="sc-pipeline-title">
              ${scIcon('scan', 15)}
              <span>02. Doorstep Tag Scans & Pickups</span>
            </div>
            <span class="sc-pipeline-metric">1,612 pickups <small>(87.6%)</small></span>
          </div>
          <div class="sc-pipeline-bar"><div class="sc-pipeline-fill" style="width:87.6%"></div></div>
          <div class="sc-pipeline-meta">
            <span>GPS proximity & timestamp cryptographic log</span>
            <span>228 stops remaining</span>
          </div>
        </div>

        <div class="sc-pipeline-item">
          <div class="sc-pipeline-row">
            <div class="sc-pipeline-title">
              ${scIcon('receipt', 15)}
              <span>03. Weighbridge Receipts Certified</span>
            </div>
            <span class="sc-pipeline-metric">1,390 loads <small>(75.5%)</small></span>
          </div>
          <div class="sc-pipeline-bar"><div class="sc-pipeline-fill" style="width:75.5%"></div></div>
          <div class="sc-pipeline-meta">
            <span>Gross / tare delta matched to digital manifest</span>
            <span>11 in scale queue</span>
          </div>
        </div>

        <div class="sc-pipeline-item">
          <div class="sc-pipeline-row">
            <div class="sc-pipeline-title">
              ${scIcon('banknote', 15)}
              <span>04. Reconciled Friday Escrow Payouts</span>
            </div>
            <span class="sc-pipeline-metric">1,240 verified <small>(67.4%)</small></span>
          </div>
          <div class="sc-pipeline-bar"><div class="sc-pipeline-fill" style="width:67.4%"></div></div>
          <div class="sc-pipeline-meta">
            <span>5% LIRS statutory WHT withheld · Tonnage audited</span>
            <span>₦32.41M accrued value</span>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderOverviewLaunchpad() {
  return `
  <div class="module-launchpad">
    <div class="launch-tile" data-go="cadastre">
      <div class="launch-tile-top">
        <div class="launch-tile-tag">MODULE 01 · IDENTITY</div>
        <h3>Tenement Cadastre & DUIDs</h3>
        <p>Tenement property registry, doorstep dwelling unit IDs (DUIDs), ring-fenced tenant billing, and virtual compound wallets.</p>
      </div>
      <div class="launch-tile-stats">
        <span>5 Properties</span> · <span>37 DUIDs</span> · <span>₦1.84M Balance</span>
      </div>
      <div class="launch-tile-foot">
        <span>Open Tenement Register</span>
        ${scIcon('arrowRight', 14)}
      </div>
    </div>

    <div class="launch-tile" data-go="fleet">
      <div class="launch-tile-top">
        <div class="launch-tile-tag">MODULE 02 · LOGISTICS</div>
        <h3>Fleet Telemetry & Routes</h3>
        <p>Live compactor GPS tracking, geofenced route breadcrumbs, speed threshold alerts, and automated missed-stop alarms.</p>
      </div>
      <div class="launch-tile-stats">
        <span>24 Active Routes</span> · <span>684 Trucks</span> · <span>99.1% Signal</span>
      </div>
      <div class="launch-tile-foot">
        <span>View Live Fleet Map</span>
        ${scIcon('arrowRight', 14)}
      </div>
    </div>

    <div class="launch-tile" data-go="capacity">
      <div class="launch-tile-top">
        <div class="launch-tile-tag">MODULE 03 · WEIGHBRIDGE</div>
        <h3>Scale Queues & Receipts</h3>
        <p>Automated gross/tare weighing, queue turnaround times, anti-tailgating scale interlocks, and traceable receipts.</p>
      </div>
      <div class="launch-tile-stats">
        <span>4 Scale Lanes</span> · <span>14m Turnaround</span> · <span>3,842 T Net</span>
      </div>
      <div class="launch-tile-foot">
        <span>Inspect Site Queues</span>
        ${scIcon('arrowRight', 14)}
      </div>
    </div>

    <div class="launch-tile" data-go="finance">
      <div class="launch-tile-top">
        <div class="launch-tile-tag">MODULE 05 · SETTLEMENT</div>
        <h3>Escrow & Friday Payouts</h3>
        <p>Verified tonnage payments, LIRS statutory deductions, 48-hour dispute cure windows, and automated PSP statements.</p>
      </div>
      <div class="launch-tile-stats">
        <span>25 Operators</span> · <span>₦32.4M Accrued</span> · <span>5% WHT Withheld</span>
      </div>
      <div class="launch-tile-foot">
        <span>View Finance Ledger</span>
        ${scIcon('arrowRight', 14)}
      </div>
    </div>
  </div>`;
}

screens.overview = () => {
  return renderOverviewHero() +
    renderOverviewKpis() +
    renderOverviewCharts() +
    renderOverviewLaunchpad() +
    panel('Operational attention', 'Open a record or facility to take immediate action.', `<div class="module-pad">${routeButton('Service records · ' + sim.orders.filter(o => o.stage !== 'Verified').length + ' in progress', 'serviceLedger')}${routeButton('Site capacity · ' + modules.facilities.filter(f => occupancy(f) > f.capacity).length + ' above limit', 'capacity')}${routeButton('Partner registration · ' + modules.partners.filter(p => p.status === 'Pending review').length + ' pending', 'partners')}${routeButton('Review incidents · ' + modules.incidents.filter(i => i.status !== 'Resolved').length + ' active', 'incidents')}</div>`) +
    panel('Follow a complete collection', 'From dispatch to a verified disposal receipt.', simOrderTable(sim.orders.slice(0, 3))) +
    panel('Scenarios & controls', 'Simulate field handoffs, camera detections, and offline edge recovery.', `<div class="module-pad">${routeButton('Open scenarios', 'scenarios')}${routeButton('Camera and sensor observations', 'cameras')}${routeButton('Performance report', 'reports')}</div>`);
};
// Preserve the existing citizen-care journey while generating matching resident notifications.
const simRenderBase=renderJourney;
renderJourney=function(){
 for(const r of modules.serviceRequests){if(r.simNotified!==r.status){simNotice('Service request '+r.status.toLowerCase(),r.id+' · '+r.type,'resident');sim.notices[0].property=r.property;r.simNotified=r.status}}
 simRenderBase();
 if($('demoHousehold'))$('demoHousehold').onchange=e=>{const p=sim.properties.find(p=>p.id===e.target.value);if(p){Object.assign(modules.resident,{property:p.id,area:p.area,partner:p.partner,name:p.name,address:'Property, '+p.area});saveModules();renderJourney()}};
 const fresh=document.querySelector('.snapshot');if(fresh)fresh.innerHTML=icon('clock')+'GPS snapshot · '+new Date().toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
 if(journey.page==='fleet'&&!$('simSnapshot')){const b=document.createElement('button');b.id='simSnapshot';b.className='btn';b.dataset.module='sim-telemetry';b.textContent='Refresh positions';document.querySelector('#fleetMain .page-actions').prepend(b)}
 saveModules();
};
const simActionBase=runModule;
runModule=function(cmd,id){
 if(cmd==='sim-telemetry'){
  sim.telemetry++;
  fleet.filter(v=>v.status==='On route'&&!sim.orders.some(o=>o.vehicle===v.code)).forEach(v=>{v.fraction=Math.min(.97,v.fraction+.008);Object.assign(v,atRoute(ROUTES[v.ri],v.fraction));v.age=0});
  sim.orders.slice().reverse().forEach(simMoveVehicle);metrics();list();updateMap();if(state.selected)renderDetail();recordModuleAction('GPS snapshot refreshed');toast('Sample positions updated along the mapped roads.');return;
 }
 simActionBase(cmd,id);
};
$('journeyGuide').onclick=()=>{if(permitted('scenarios'))goJourney('scenarios');else drawer('Your workspace','<p>Open a service or work order and follow its next action. Use Switch workspace to show the receiving team’s view.</p>'+note('All operational records, camera scenes, payments and policy outcomes are simulated.'))};
sim.orders.slice().reverse().forEach(simMoveVehicle);
// Facility identity and partner settlement are separate, reviewable handoffs.
sim.settlements ||= [];
const simFacility=screens.facility;
screens.facility=()=>simFacility()+panel('Gate identity check','Simulated plate recognition checks the linked collection manifest.',`<div class="module-pad">${simBtn('Simulate gate scan','gateScan','',true)}<p>Recognised, unknown and mismatched-vehicle outcomes can be reviewed.</p></div>`);
const simFinance=screens.finance;
screens.finance=()=>simFinance()+panel('Partner settlement review','Service fee; independent of customer invoice payments.',`<div class="module-pad">${simBtn('Prepare partner statement','settlement')}</div>`+(sim.settlements.length?table(['Statement','Verified service','Amount','Status',''],sim.settlements.map(s=>[s.id,s.order,cash(s.amount),status(s.status),link('Review','sim-settlementReview',s.id)])):empty('No partner statements','A verified disposal receipt is required before preparing a statement.')));
const exceptionActions=runModule;
runModule=function(cmd,id){
 if(cmd==='sim-gateScan'){
  openForm('Simulated gate scan','Choose a recognition outcome. An unknown identity must be reviewed before admission.',[field('result','Recognition result',{options:['Recognised plate and manifest','Unknown plate','Manifest mismatch']})],'Run scan',d=>{
   if(d.result!=='Recognised plate and manifest'){simFlag('Gate identity exception',d.result+' at the sample entry lane. Admission held for review.','FAC-001');recordModuleAction('Gate admission held: '+d.result);return}
   const o=ownedOrders().find(o=>o.stage==='Collected');
   if(!o)return'No collected service is awaiting arrival. Complete and sync collection evidence first.';
   advanceOrder(o);recordModuleAction('Simulated plate and manifest matched for '+o.id);
  });return;
 }
 if(cmd==='sim-settlement'){
  const jobs=sim.orders.filter(o=>o.receipt&&o.receipt.kind!=='TLS intake'&&!sim.settlements.some(s=>s.order===o.id));if(!jobs.length){toast('A verified service without a statement is required.');return}
  openForm('Prepare partner statement','',[field('order','Verified service',{options:jobs.map(o=>({value:o.id,label:o.id+' · '+partnerName(o.partner)}))}),field('amount','Sample service fee (NGN)',{type:'number',min:1,value:80000})],'Prepare statement',d=>{const o=sim.orders.find(o=>o.id===d.order);sim.settlements.push({id:moduleID('SET',sim.settlements),order:o.id,partner:o.partner,amount:+d.amount,status:'Awaiting approval'});recordModuleAction('Partner statement prepared for '+o.id)});return;
 }
 if(cmd==='sim-settlementReview'){
  const s=sim.settlements.find(s=>s.id===id);if(!s)return;
  if(s.status==='Disbursed'){drawer(id,rowKV('Status',s.status)+rowKV('Amount',cash(s.amount))+note('Simulated payout record only. No money has moved.'));return}
  const next=s.status==='Awaiting approval'?'Approved':'Disbursed';
  openForm(id+' · '+cash(s.amount),next==='Approved'?'Review the service evidence and receipt.':'Simulate disbursement of the approved statement.',[field('confirmed',next==='Approved'?'Evidence and statement amount reviewed':'Confirm simulated disbursement only',{type:'checkbox'})],next==='Approved'?'Approve statement':'Simulate disbursement',()=>{s.status=next;simNotice('Partner statement '+next.toLowerCase(),id+' · '+cash(s.amount),'partner');sim.notices[0].partner=s.partner;recordModuleAction(id+' '+next)});return;
 }
 exceptionActions(cmd,id);
};
