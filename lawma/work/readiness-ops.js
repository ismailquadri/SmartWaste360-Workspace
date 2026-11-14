/* Final practice workflow layer. Preserves earlier records; never calls operational services. */
const practiceDate=()=>new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).split('/').reverse().join('-');
const stoppedForPractice=site=>practiceSiteStopped(site,lf().sensors,sensorLevel);
// Link sample settlement batches explicitly to sample tickets, not invented payable totals.
st().batches.forEach(b=>{if(!b.ticketIds)b.ticketIds=so().tickets.filter(t=>t.hauler===b.psp&&t.lga===b.lga&&t.account==='Domestic').map(t=>t.id)});
const practiceCalc=stCalc;
stCalc=b=>{
 if(b.status==='Released'&&b.split)return {...b.split,blocks:[],eligible:b.split.eligible??b.tonnes};
 const c=practiceCalc(b),w=eligibleBatchWeights(b,so().tickets,scaleTicket),gross=Math.max(0,Math.round(w.eligible*stTariff())-c.ded);
 return {...c,...splitSettlement(gross),eligible:w.eligible,excluded:w.excluded,ticketIds:w.ids,blocks:c.blocks.concat(!w.ids.length?'No weigh tickets linked to this batch':w.eligible<=0?'No eligible weigh-ticket tonnage':[])};
};
const practiceFinance=screens.finance;
screens.finance=()=>{let out=practiceFinance();if(ui.stTab==='Settlement run'){
 st().batches.forEach(b=>{const w=stCalc(b);out=out.replace(b.tonnes+' t</td>',w.eligible.toFixed(3)+' t<small class="cell-sub">Excluded '+(w.excluded||0).toFixed(3)+' t</small></td>')});
 out+=panel('Weigh tickets supporting settlement','Only linked, clear domestic tickets count. Superseded tickets are retained, never paid twice.',table(['Batch','Eligible tonnes','Excluded tonnes','Ticket references',''],st().batches.map(b=>{const w=stCalc(b);return [esc(b.id),w.eligible.toFixed(3)+' t',(w.excluded||0).toFixed(3)+' t',esc((b.ticketIds||[]).join(', ')||'None'),stCan()&&b.status!=='Released'?button('Review ticket links','ready-links',b.id):'']})))}return out};
const practiceFacility=screens.facility;
screens.facility=()=>{
 let out=practiceFacility();if(ui.scaleTab==='Ticket checks')out+=panel('Corrected reweigh records','The original ticket stays excluded. New readings must pass every check before their weight counts.',table(['Original ticket','State','Replacement',''],so().tickets.filter(t=>scaleTicket(t).held||t.supersededBy).map(t=>[esc(t.id),t.supersededBy?'Superseded':esc(t.review?.outcome||'Held'),esc(t.supersededBy||'—'),scaleCan()&&!t.supersededBy?button('Record corrected reweigh','ready-reweigh',t.id):''])));
 if(ui.scaleTab==='Commercial tipping')out+=panel('Class corrections awaiting approval','The original class stays unchanged until another named official reviews the evidence.',table(['Ticket','Requested by','Evidence',''],so().tickets.filter(t=>t.pendingClass).map(t=>[esc(t.id),esc(t.pendingClass.by),esc(t.pendingClass.reason),scaleCan()?button('Approve class correction','ready-class-approve',t.id):''])));
 return out;
};
const practiceHaz=screens.hazwaste;
screens.hazwaste=()=>{let out=practiceHaz();if(!ui.hazTab||ui.hazTab==='Clinical manifests')out+=panel('Held manifest review','A correction requires inspection evidence and a licensed receiving hauler; original readings remain in history.',table(['Manifest','Reason',''],hz().manifests.filter(m=>m.stage!=='Destroyed'&&hazHolds(m).some(x=>!/48 hours/.test(x))).map(m=>[esc(m.id),hazHolds(m).map(esc).join(' · '),hazCan()?button('Review manifest hold','ready-manifest',m.id):''])));return out};
const practiceWater=screens.environment;
screens.environment=()=>practiceWater()+(ui.ecoTab==='Community wells'?panel('Advisory response delivery','Practice confirmation requires the same contaminant in two samples at least 24 hours apart; limits and timing await agency approval.',table(['Well','Alternative water','Notifications',''],eco().wells.filter(w=>w.advisory).map(w=>[esc(w.id),esc(w.advisory.response?.water||'Delivery not yet recorded'),esc(w.advisory.response?.notifications||'Acknowledgements not yet recorded'),ecoCan()?button('Record advisory response','ready-water',w.id):'']))):'');
// Keep older structured inspection records, not only the most recent entry.
marketStore().cases.forEach(c=>{c.inspections||=c.inspection?[{...c.inspection}]:[]});
const practiceMarket=screens.commercial;
screens.commercial=()=>practiceMarket()+(ui.marketTab==='Case history'?panel('Inspection evidence history','Every recorded inspection remains available.',table(['Case','When','Result','Evidence','Finding'],marketStore().cases.flatMap(c=>(c.inspections||[]).map(i=>[esc(c.id),stamp(i.at),esc(i.result),esc(i.evidence),esc(i.finding)])))):'');
const practiceDrawer=cadDrawer;
cadDrawer=(p,tab)=>{
 practiceDrawer(p,tab);
 if((tab||ui.cadastreTab)==='History'&&cadCanReview()){
  $('modal').insertAdjacentHTML('beforeend',panel('Account exceptions','Room balances remain separate; corrections need evidence.',table(['Record','Amount','State',''],[...(p.webhooks||[]).filter(w=>w.signatureOk&&w.result!=='Applied').map(w=>[esc(w.sessionId),naira(w.amount),esc(w.result),button('Allocate bank alert','ready-allocate',p.id+'|'+w.sessionId)]),...(p.ownerDebtLedger||[]).filter(d=>!d.resolution).map(d=>[esc(d.id)+' · '+esc(d.formerTenant),naira(d.amount)+' · credit '+naira(d.credit),esc(d.status),button('Resolve former balance','ready-liability',p.id+'|'+d.id)])])));
 }
};
const approvalActor=()=>journey.role+':'+officialKey(cadOfficer());
const hotSwapApply=(m,s,d)=>{
 m.swaps.push({from:m.vehicle,to:s.vehicle,reason:d.reason,evidence:d.evidence,by:d.by,approvedBy:cadOfficer(),approvedActor:approvalActor(),at:new Date().toISOString()});s.status='Assigned to '+m.id;fo().standby.push({vehicle:m.vehicle,type:m.type,status:'Broken down'});[fo().kits,fo().bins].forEach(xs=>xs.forEach(k=>{if(k.vehicle===m.vehicle)k.vehicle=s.vehicle}));m.vehicle=s.vehicle;m.status='Hot-swapped';m.pendingSwap=null;
};
const practiceDispatch=screens.dispatch;
screens.dispatch=()=>practiceDispatch()+((ui.fleetTab==='Supervisor review'||!ui.fleetTab)?panel('Hot-swap approvals','A different official must review the request before a vehicle is changed.',table(['Manifest','Requested change','Requested by',''],fo().manifests.filter(m=>m.pendingSwap).map(m=>[esc(m.id),esc(m.vehicle)+' → '+esc(m.pendingSwap.vehicle),esc(m.pendingSwap.by),['management','admin','operations'].includes(journey.role)?button('Approve hot-swap','ready-swap-approve',m.id):'']))):'');
const practiceRun=runModule;
runModule=function(cmd,id){
 // Reconcile before any mutation; keep object references used by earlier layers.
 if(!/tab$|^app-|^inspectProperty$|^cad-qr$/.test(cmd)&&cmd!=='cancel'&&!saveModules())return;
 if(cmd==='lga-brief-draft'){
  const rows=briefRows();modules.lgaBrief={week:briefWeek(),rows,heldKg:scaleHeldKg(),text:'Practice brief: '+rows.length+' LGAs reviewed. '+(scaleHeldKg()/1000).toFixed(1)+' tonnes held pending ticket checks. Figures require official confirmation.',status:'Unconfirmed',drafted:new Date().toISOString()};recordModuleAction('Weekly dummy-data briefing prepared locally');renderJourney();return;
 }
 if(cmd==='hub-admit'){const q=hub.queue.find(x=>x.id===id),site=hub.sites.find(s=>s.id===q?.site);if(site&&stoppedForPractice(site.name))return toast(site.name+' is stopped for safety. Record safe readings before admitting trucks.')}
 if(cmd==='fl-slot'||cmd==='fl-reroute'){const m=fo().manifests.find(x=>x.id===id);if(cmd==='fl-slot'&&m&&stoppedForPractice(m.site))return toast(m.site+' is stopped for safety. No slot may be booked.')}
 if(cmd==='sc-class'){
  const t=so().tickets.find(x=>x.id===id);if(!scaleCan()||!t)return;openForm('Request class correction · '+id,'A separate official must approve before the ticket class changes.',[textField('reason','Reason and supporting evidence')],'Request correction',d=>{t.pendingClass={reason:d.reason,by:cadOfficer(),actor:approvalActor(),at:cadNow()};recordModuleAction(id+' commercial correction requested')});return;
 }
 if(cmd==='ready-class-approve'){
  const t=so().tickets.find(x=>x.id===id),r=t?.pendingClass;if(!scaleCan()||!r)return;openForm('Approve class correction · '+id,r.reason,[field('checked','Source account and evidence checked',{type:'checkbox'})],'Approve correction',()=>{if(!distinctOfficials(r.by,cadOfficer()))return 'A different named practice official must approve.';t.ticketClass='Commercial';t.classChange={...r,second:cadOfficer(),approvedAt:cadNow()};t.pendingClass=null;modules.lgaBrief=null;recordModuleAction(id+' class correction independently approved')});return;
 }
 if(cmd==='fl-swap'){
  if(!fleetCan())return toast('Your role cannot request a hot-swap.');const m=fo().manifests.find(x=>x.id===id);if(!m||m.pendingSwap)return toast('A request is already awaiting another official.');
  openForm('Request hot-swap · '+m.id,'The vehicle stays unchanged until another official approves within the 60-minute window.',[field('vehicle','Standby vehicle',{options:fo().standby.filter(s=>s.type===m.type&&s.status==='Standby').map(s=>s.vehicle)}),textField('reason','Breakdown reason'),textField('evidence','Depot evidence reference')],'Request approval',d=>{const s=fo().standby.find(x=>x.vehicle===d.vehicle),e=hotSwapCheck(m,s,fleetNow(),{...d,supervisor:true});if(e)return e;m.pendingSwap={...d,by:cadOfficer(),actor:approvalActor(),at:new Date().toISOString()};recordModuleAction(m.id+' hot-swap requested; vehicle unchanged')});return;
 }
 if(cmd==='ready-swap-approve'){
  const m=fo().manifests.find(x=>x.id===id),d=m?.pendingSwap;if(!fleetCan()||!d)return;
  openForm('Approve hot-swap · '+id,'Review the recorded depot evidence.',[field('checked','Breakdown and replacement checked',{type:'checkbox'})],'Approve swap',()=>{if(d.actor===approvalActor()||!distinctOfficials(d.by,cadOfficer()))return 'Switch to a different named practice official to approve.';const s=fo().standby.find(x=>x.vehicle===d.vehicle),e=hotSwapCheck(m,s,fleetNow(),{...d,supervisor:true});if(e)return e;hotSwapApply(m,s,d);recordModuleAction(id+' hot-swap independently approved')});return;
 }
 if(cmd==='haz-collect'||cmd==='haz-receive'||cmd==='haz-burn'){
  const m=hz().manifests.find(x=>x.id===id),expected={'haz-collect':'Generated','haz-receive':'Collected','haz-burn':'Received'}[cmd];if(!m||m.stage!==expected)return toast('This action is not available at the current manifest stage.');
  if(cmd==='haz-burn'){const error=burnReservationError(m,ef().plant,ef().bookings,practiceDate());if(error)return toast(error)}
 }
 if(cmd==='haz-hand'){const s=hz().sludge.find(x=>x.id===id);if(!s||s.hold||s.steps.length>=SLUDGE_STAGES.length)return toast('Resolve the custody hold or review the completed chain first.')}
 if(cmd==='st-release'){
  const b=st().batches.find(x=>x.id===id);if(!stCan()||!b||b.status==='Released')return;const c=stCalc(b);if(c.blocks.length)return toast(c.blocks.join(' · '));
  openForm('Release practice payment · '+id,'Net '+cash(c.net)+' from '+c.eligible.toFixed(3)+' eligible tonnes; excluded '+(c.excluded||0).toFixed(3)+' tonnes.',[field('ok','Eligible tickets and deductions checked',{type:'checkbox'})],'Release',()=>{const fresh=stCalc(b);if(fresh.blocks.length)return fresh.blocks.join(' · ');Object.assign(b,{status:'Released',paid:fresh.net,split:fresh,by:cadOfficer(),at:new Date().toISOString()});recordModuleAction(id+' practice payment released from linked eligible weigh tickets')});return;
 }
 if(cmd==='ready-links'){
  const b=st().batches.find(x=>x.id===id);if(!stCan()||!b||b.status==='Released')return;
  const ts=so().tickets.filter(t=>t.hauler===b.psp&&t.lga===b.lga&&t.account==='Domestic'&&!t.supersededBy);
  if(!ts.length)return toast('No domestic tickets match this PSP and LGA.');openForm('Review ticket links · '+id,'Only matching PSP/LGA domestic tickets can be selected.',[...ts.map(t=>field(t.id,t.id+' · '+(ticketNet(t)/1000).toFixed(3)+' t',{type:'checkbox',optional:true,value:b.ticketIds.includes(t.id)})),textField('evidence','Review evidence reference')],'Save links',d=>{b.ticketIds=ts.filter(t=>d[t.id]).map(t=>t.id);modules.lgaBrief=null;recordModuleAction(id+' ticket mapping reviewed · '+d.evidence)});return;
 }
 if(cmd==='ready-reweigh'){
  const t=so().tickets.find(x=>x.id===id);if(!scaleCan()||!t||t.supersededBy)return;
  openForm('Corrected reweigh · '+id,'Original readings stay unchanged and excluded. Correct the scale calibration separately first.',[field('gross','New gross (kg)',{type:'number',min:1,max:80000,value:t.gross}),field('tare','New tare (kg)',{type:'number',min:1,max:80000,value:t.tare}),field('class','Verified account class',{options:['Domestic','Commercial'],value:t.account}),textField('ref','New reweigh evidence reference'),field('checked','Axles, signal, seal and drainage inspected',{type:'checkbox'})],'Save reweigh',d=>{if(Number(d.gross)<=Number(d.tare))return 'Gross must exceed tare.';if(!scaleOk(t.site))return 'Record a passing scale calibration first.';if(d.class!==t.account)return 'Class must match the registered source account.';const n={...t,id:moduleID('WT-R',so().tickets),gross:Number(d.gross),tare:Number(d.tare),ticketClass:d.class,beams:[1,1,1,1],corners:[25,25,25,25],jump:0,valve:{opened:false},review:null,at:new Date().toISOString(),replaces:t.id,reweighEvidence:d.ref};delete n.supersededBy;if(scaleTicket(n).held)return 'New readings still fail checks.';t.supersededBy=n.id;t.voided=true;so().tickets.push(n);st().batches.filter(b=>b.status!=='Released'&&b.ticketIds?.includes(t.id)).forEach(b=>b.ticketIds=b.ticketIds.map(x=>x===t.id?n.id:x));modules.lgaBrief=null;recordModuleAction(id+' superseded by '+n.id+' · '+d.ref)});return;
 }
 if(cmd==='ready-allocate'){
  const [pid,ref]=id.split('|'),p=propertyByID(pid),w=p?.webhooks.find(x=>x.sessionId===ref);if(!cadCanReview()||!w)return;
  openForm('Allocate bank alert · '+ref,'Allocate the entire verified receipt to one room. No other room balance changes.',[field('duid','Room',{options:p.units.map(u=>({value:u.duid,label:u.flat+' · '+u.tenant}))}),textField('evidence','Allocation evidence reference')],'Allocate',d=>{const e=accountAllocationError(w,d.duid,p.units);if(e)return e;p.units=roomPayment(p.units,d.duid,w.amount);Object.assign(w,{result:'Applied',duid:d.duid,allocation:{by:cadOfficer(),at:cadNow(),evidence:d.evidence}});p.walletPayments.unshift({id:cadRef('PAY',p.walletPayments),reference:w.sessionId,duid:d.duid,amount:w.amount,verified:true,by:cadOfficer(),method:'Reviewed bank allocation',date:cadNow()});recordModuleAction(pid+' bank alert '+ref+' allocated to '+d.duid)});return;
 }
 if(cmd==='ready-liability'){
  const [pid,ref]=id.split('|'),p=propertyByID(pid),r=p?.ownerDebtLedger.find(x=>x.id===ref);if(!cadCanReview()||!r||r.resolution)return;
  openForm('Resolve former occupant balance','The incoming room account is never charged. A refund is a practice record only.',[field('decision','Liability decision',{options:['Former occupant liable','Landlord liable after evidence review','Written off after review']}),textField('responsible','Responsible person / reviewed beneficiary'),field('credit','Advance credit decision',{options:['No refund due','Refund recorded · sample']}),textField('evidence','Liability and refund evidence reference')],'Record resolution',d=>{if(r.credit>0&&d.credit!=='Refund recorded · sample')return 'Record the former occupant credit refund evidence.';r.resolution={...d,by:cadOfficer(),at:cadNow()};r.status='Resolved · '+d.decision;recordModuleAction(pid+' former balance '+ref+' resolved; new occupant ledger unchanged')});return;
 }
 if(cmd==='ready-manifest'){
  const m=hz().manifests.find(x=>x.id===id);if(!hazCan()||!m)return;openForm('Review manifest hold · '+id,'Keep the original weight and hauler in inspection history.',[field('hauler','Verified licensed hauler',{options:SPL_HAULERS}),field('kg','Corrected received weight (kg)',{type:'number',min:0.1,max:100000,step:0.1,value:m.kg}),textField('evidence','Inspection and correction evidence reference')],'Save correction',d=>{if(!weightMatch(m.kg,Number(d.kg)))return 'Corrected weight must reconcile within 5%.';m.corrections=(m.corrections||[]).concat({hauler:m.hauler,received:m.received,evidence:d.evidence,by:cadOfficer(),at:cadNow()});m.hauler=d.hauler;if(m.stage==='Received')m.received=Number(d.kg);recordModuleAction(id+' manifest hold correction recorded')});return;
 }
 if(cmd==='ready-water'){
  const w=eco().wells.find(x=>x.id===id);if(!ecoCan()||!w?.advisory)return;openForm('Record advisory response · '+id,'Record sample evidence of deliveries and agency acknowledgements.',[textField('water','Water delivery receipt and location'),textField('notifications','Community, LGA, LASEPA and Health acknowledgement references')],'Save response',d=>{const r={...d,by:cadOfficer(),at:cadNow()};w.advisory.responses=(w.advisory.responses||[]).concat(r);w.advisory.response=r;recordModuleAction(id+' advisory delivery and acknowledgements recorded')});return;
 }
 if(cmd==='ready-asset'){
  const asset=infra().assets.find(a=>a.id===id);if(!infraCan()||!asset)return;openForm('Review replacement asset · '+asset.name,'Sample inventory review; earlier contribution records remain.',[textField('name','Asset description',asset.name),field('cost','Replacement cost (₦)',{type:'number',min:1,max:1000000000,value:asset.cost}),field('months','Months in service',{type:'number',min:0,max:240,value:asset.months}),field('status','Asset condition',{options:['In service','Maintenance due','Replacement approved','Retired'],value:asset.status||'In service'}),textField('evidence','Inventory / inspection reference')],'Save asset review',d=>{asset.reviews=(asset.reviews||[]).concat({name:asset.name,cost:asset.cost,months:asset.months,status:asset.status||'In service',at:cadNow(),by:cadOfficer(),evidence:d.evidence});Object.assign(asset,{name:d.name,cost:Number(d.cost),months:Number(d.months),status:d.status});infraEvent(asset.id+' inventory reviewed · '+d.evidence)});return;
 }
 practiceRun(cmd,id);
 if(cmd==='fl-reroute'){
  const form=$('moduleForm'),submit=form?.onsubmit;if(submit)form.onsubmit=e=>{if(stoppedForPractice($('mf-site').value)){e.preventDefault();$('moduleErrorText').textContent='That destination is stopped for safety.';$('moduleError').hidden=false;return}submit(e)};
 }
 if(cmd==='haz-burn'){
  const form=$('moduleForm'),submit=form?.onsubmit;if(submit)form.onsubmit=e=>{const m=hz().manifests.find(x=>x.id===id),error=burnReservationError(m,ef().plant,ef().bookings,practiceDate());if(error){e.preventDefault();$('moduleErrorText').textContent=error;$('moduleError').hidden=false;return}const before=(m.failedBurns||[]).length;submit(e);if(m.stage==='Destroyed'||(m.failedBurns||[]).length>before){const booking=ef().bookings.find(b=>b.manifest===id&&b.date===practiceDate()&&b.status==='Reserved');if(booking){booking.status='Consumed';booking.consumedAt=cadNow();booking.result=m.stage==='Destroyed'?'Destroyed':'Failed burn';saveModules()}}};
 }
 if(cmd==='market-inspect'){
  const form=$('moduleForm'),submit=form?.onsubmit;if(submit)form.onsubmit=e=>{const c=marketStore().cases.find(x=>x.id===id),old=c.inspection;submit(e);if(c.inspection!==old){c.inspections||=[];c.inspections.push({...c.inspection});saveModules()}};
 }
};
// Named practice officials, not authenticated accounts; each role keeps its chosen reviewer name.
modules.practiceOfficials||={};
if(personaPages.finance){for(const p of ['overview','cadastre'])if(!personaPages.finance.includes(p))personaPages.finance.push(p)}
// Auditor is read-only across all practice mutation paths, including older module handlers.
const namedOfficial=document.createElement('button');namedOfficial.className='btn';namedOfficial.textContent='Practice official';namedOfficial.dataset.module='ready-official';document.querySelector('.journey-switch').append(namedOfficial);
const namedRun=runModule;
runModule=function(cmd,id){if(journey.role==='auditor'&&!/tab$|^app-|^inspectProperty$|^cad-(qr|download)$|^ready-official$|^cancel$/.test(cmd))return toast('TLS auditor is read-only. A responsible LAWMA official must record this action.');if(cmd!=='ready-official')return namedRun(cmd,id);openForm('Named practice official','Dummy identity only. Do not enter a real staff identity.',[textField('name','Practice name',modules.practiceOfficials[journey.role]||journeyRoles[journey.role][0])],'Save name',d=>{modules.practiceOfficials[journey.role]=d.name;recordModuleAction('Practice reviewer selected')})};
cadOfficer=()=>modules.practiceOfficials?.[journey.role]||journeyRoles[journey.role]?.[0]||'LAWMA official';
const polishPractice=root=>{
 mobileRecordLists(root);
 root.querySelectorAll('[role=tablist]').forEach((list,i)=>{const tabs=[...list.querySelectorAll('[role=tab]')],selected=tabs.find(t=>t.getAttribute('aria-selected')==='true');const prefix=root.id+'-tabs-'+i;let region=list.nextElementSibling;if(region){region.id=prefix+'-panel';region.setAttribute('role','tabpanel');region.setAttribute('aria-labelledby',selected?.id||prefix+'-active')}tabs.forEach((t,j)=>{t.id=prefix+'-'+j;t.tabIndex=t===selected?0:-1;t.setAttribute('aria-controls',prefix+'-panel')});if(region&&selected)region.setAttribute('aria-labelledby',selected.id)});
};
document.addEventListener('keydown',e=>{const tab=e.target.closest?.('[role=tab]');if(!tab||!['ArrowRight','ArrowLeft','Home','End'].includes(e.key))return;const tabs=[...tab.parentElement.querySelectorAll('[role=tab]')],i=tabs.indexOf(tab),n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length,target=tabs[n],label=target.textContent;e.preventDefault();target.click();requestAnimationFrame(()=>[...document.querySelectorAll('[role=tab]')].find(t=>t.textContent===label)?.focus())});
const groupedMenu=()=>drawer('LAWMA workspaces','<div class="app-menu">'+['Organisation','Operations','Service & assurance','Governance'].map((g,i)=>'<h3>'+g+'</h3>'+journeyNav.filter(([p])=>permitted(p)&&([['overview','cadastre','partners','registry'],['fleet','dispatch','serviceLedger','facility','capacity','environment','hazwaste','cameras'],['publicReports','drainage','incidents','compliance','finance','commercial','care','enforcement','recovery'],['systems','reports']][i]).includes(p)).map(([p,l,ic])=>'<button data-module="app-go" data-record="'+p+'">'+icon(ic)+'<span>'+esc(l)+'</span>'+icon('arrow')+'</button>').join('')).join('')+'</div>');
const menuButton=document.createElement('button');menuButton.className='btn practice-menu';menuButton.innerHTML=icon('more')+' Workspaces';menuButton.onclick=groupedMenu;journeyBar.after(menuButton);
const practiceRender=renderJourney;
renderJourney=function(){practiceRender();polishPractice(journeyMain);if(journey.role==='auditor')journeyMain.querySelectorAll('[data-module]').forEach(b=>{if(!/tab$|^app-|^inspectProperty$|^cad-(qr|download)$/.test(b.dataset.module||''))b.hidden=true});document.querySelector('.journey-context span').textContent=new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',day:'2-digit',month:'long',year:'numeric'}).format(new Date())+' · Lagos';namedOfficial.textContent='Official: '+cadOfficer()};
const practiceDialog=dialog;
dialog=function(...args){practiceDialog(...args);polishPractice($('modal'))};
saveModules();
const assetScreen=screens.systems;
screens.systems=()=>assetScreen()+(ui.infraTab==='Replacement fund'?panel('Replacement inventory reviews','',table(['Asset','Condition','Review history',''],infra().assets.map(a=>[esc(a.name),esc(a.status||'In service'),String((a.reviews||[]).length)+' retained reviews',infraCan()?button('Review asset','ready-asset',a.id):'']))):'');
$('journeyGuide').onclick=()=>dialog('LAWMA officials’ practice review',table(['Official role','Responsibility'],[['Management','Review operational exceptions and proposed decisions'],['Operations supervisor','Dispatch, fleet, scale and environmental oversight'],['Revenue officer','Room accounts, eligible weigh-ticket settlements and reconciliation'],['Customer care','Reports and resident follow-up'],['Enforcement reviewer','Evidence, patrol reports and court records'],['TLS auditor','Read-only records and activity review'],['Platform administrator','Access records and infrastructure practice reviews']])+note('Dummy records only. Named reviewers and role switching are practice controls, not authentication. Outside personnel appear only in records.'));