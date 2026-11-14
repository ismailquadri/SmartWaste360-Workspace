/* LAWMA officials' fleet oversight. All positions, incidents and map boundaries are dummy records. */
if(!modules.fleetMap){
 modules.fleetMap={version:1,snapshot:new Date().toISOString(),followups:[],fixtures:[
  {vehicle:'FLT-0018',kind:'Breakdown',note:'Sample mechanical fault; supervisor review required'},
  {vehicle:'FLT-0063',kind:'Route departure',note:'Sample report of departure from the assigned corridor'},
  {vehicle:'FLT-0042',kind:'Missed collection',note:'Sample missed collection; service evidence must be reviewed'}
 ],closures:[{id:'ROAD-01',name:'Sample road closure · Oshodi corridor',coord:[3.33,6.555],note:'Illustrative obstruction; no live traffic feed'}]};
 // Explicit crosswalk for existing practice manifest vehicle plates, not inferred district matches.
 fo().manifests.forEach((m,i)=>{m.mapVehicle=fleet[i===0?41:i===1?17:i===2?62:100+i]?.code});
 saveModules();
}
const fm=()=>modules.fleetMap;
// Continuous legacy animation resets GPS age on every tick; use explicit dummy snapshots instead.
fleetMotion=false;motionButton.hidden=true;motionLabel.textContent='Dummy GPS positions · no live telemetry';
const fmUI={psp:'all',freshness:'all',exception:'all',onlyExceptions:true,mode:'map',layers:{routes:false,sites:false,queues:false,closures:false,drainage:false}};
const fmStamp=at=>new Intl.DateTimeFormat('en-GB',{timeZone:'Africa/Lagos',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(at))+' WAT';
const fmLinks=v=>fleetLinkedRecords(v.code,[...(modules.demo?.orders||[]),...(modules.assignments||[])],fo().manifests,fo().bookings,fleetRecords());
const fmEnrich=()=>{
 const now=Date.now();fleet.forEach(v=>{
  v.positionState=fleetPositionState(v,fm().snapshot,now);
  v.exceptions=fm().fixtures.filter(e=>e.vehicle===v.code).map(e=>({...e}));
  const waits=hub.queue.filter(q=>q.truck===v.code&&hubWait(q)>QUEUE_WAIT_LIMIT_MIN);
  waits.forEach(q=>v.exceptions.push({kind:'Long queue',note:(hub.sites.find(s=>s.id===q.site)?.name||q.site)+' · '+hubWait(q)+' min waiting'}));
  if(v.positionState!=='Recent position')v.exceptions.push({kind:v.positionState,note:'Last received '+age(fleetPositionAge(v,fm().snapshot,now))+' · current position unconfirmed'});
  if(v.pending)v.exceptions.push({kind:'Evidence review',note:v.pending+' collection records awaiting evidence review'});
  v.review=v.exceptions.length>0;
 });
};
fmEnrich();
const fmMatchBase=matches;
matches=v=>fmMatchBase(v)&&fleetMapMatches(v,fmUI);
filtered=()=>{fmEnrich();let data=allFiltered();if(state.viewport&&ready)data=data.filter(v=>map.getBounds().contains(v.coord));return data.sort((a,b)=>fleetExceptionRank(a)-fleetExceptionRank(b)||a.id-b.id)};
const fmControls=document.createElement('div');fmControls.className='fm-controls';
fmControls.innerHTML='<label for="fmPsp">PSP operator</label><select id="fmPsp"><option value="all">All PSP operators</option>'+modules.partners.filter(p=>fleet.some(v=>v.partnerId===p.id)).map(p=>'<option value="'+esc(p.id)+'">'+esc(p.name)+'</option>').join('')+'</select><label for="fmFreshness">Position update</label><select id="fmFreshness"><option value="all">All update states</option>'+['Recent position','Stale position','Missing update','Stale / missing'].map(s=>'<option>'+s+'</option>').join('')+'</select><label for="fmException">Needs attention</label><select id="fmException"><option value="all">All exception types</option>'+['Breakdown','Missed collection','Route departure','Long queue','Missing update','Stale position','Evidence review'].map(s=>'<option>'+s+'</option>').join('')+'</select><label class="fm-check"><input id="fmOnlyExceptions" type="checkbox" checked> Exceptions only</label>';
document.querySelector('.list-tools').append(fmControls);
const fmDistrictSearch=document.createElement('input');fmDistrictSearch.type='search';fmDistrictSearch.id='fmDistrictSearch';fmDistrictSearch.placeholder='Find LGA / sample district';fmDistrictSearch.setAttribute('aria-label','Find LGA or sample district');document.querySelector('.select-row').before(fmDistrictSearch);
fmDistrictSearch.oninput=()=>{const q=fmDistrictSearch.value.trim().toLowerCase();[...$('district').options].forEach(o=>{o.hidden=o.value!=='all'&&o.value!==state.district&&!o.textContent.toLowerCase().includes(q)})};
$('search').placeholder='Vehicle, PSP or district';$('search').setAttribute('aria-label','Search vehicle, PSP or district');
$('district').setAttribute('aria-label','LGA or sample district');
const fmModes=document.createElement('div');fmModes.className='fm-modes';fmModes.setAttribute('role','group');fmModes.setAttribute('aria-label','Fleet view');fmModes.innerHTML='<button class="btn" id="fmMapMode" aria-pressed="true">'+icon('map')+'Map</button><button class="btn" id="fmListMode" aria-pressed="false">'+icon('truck')+'List</button>';
document.querySelector('#fleetMain .workspace').before(fmModes);
const fmMode=mode=>{fmUI.mode=mode;document.querySelector('#fleetMain .workspace').dataset.fleetMode=mode;$('fmMapMode').setAttribute('aria-pressed',String(mode==='map'));$('fmListMode').setAttribute('aria-pressed',String(mode==='list'));requestAnimationFrame(()=>map?.resize())};
$('fmMapMode').onclick=()=>fmMode('map');$('fmListMode').onclick=()=>fmMode('list');fmMode('map');
const fmSync=()=>{$('fmPsp').value=fmUI.psp;$('fmFreshness').value=fmUI.freshness;$('fmException').value=fmUI.exception;$('fmOnlyExceptions').checked=fmUI.onlyExceptions;$('exceptionToggle').textContent=fmUI.onlyExceptions?'Show all vehicles':'Review exceptions';$('exceptionToggle').setAttribute('aria-pressed',String(fmUI.onlyExceptions))};
['psp','freshness','exception'].forEach((key,i)=>{const id=['fmPsp','fmFreshness','fmException'][i];$(id).onchange=e=>{fmUI[key]=e.target.value;fmEnrich();changeFilter(true)}});
$('fmOnlyExceptions').onchange=e=>{fmUI.onlyExceptions=e.target.checked;state.view='fleet';fmSync();changeFilter(true)};
$('exceptionToggle').onclick=()=>{$('fmOnlyExceptions').checked=!fmUI.onlyExceptions;$('fmOnlyExceptions').onchange({target:$('fmOnlyExceptions')})};
const fmReset=$('resetFilters').onclick;
$('resetFilters').onclick=()=>{Object.assign(fmUI,{psp:'all',freshness:'all',exception:'all',onlyExceptions:false});fmDistrictSearch.value='';fmDistrictSearch.oninput();state.view='fleet';fmSync();fmReset()};
const fmDistrictBase=openFleetDistrict;
openFleetDistrict=d=>{Object.assign(fmUI,{psp:'all',freshness:'all',exception:'all',onlyExceptions:false});fmSync();fmDistrictBase(d)};
metrics=()=>{
 fmEnrich();const scope=fleet.filter(v=>(state.district==='all'||v.district===state.district)&&(fmUI.psp==='all'||v.partnerId===fmUI.psp)&&(!state.query||(v.code+' '+v.district+' '+v.psp).toLowerCase().includes(state.query)));
 const rows=[['all','Vehicles in district',scope.length],['attention','Need attention',scope.filter(v=>v.exceptions.length).length],['recent','Recent positions',scope.filter(v=>v.positionState==='Recent position').length],['missing','Stale / missing',scope.filter(v=>v.positionState!=='Recent position').length]];
 $('metrics').innerHTML=rows.map(([key,label,count])=>'<button class="metric" data-fm-metric="'+key+'"><label>'+label+'</label><b>'+fmt(count)+'<small>sample vehicles</small></b></button>').join('');
 $('metrics').querySelectorAll('button').forEach(b=>b.onclick=()=>{Object.assign(fmUI,{freshness:'all',exception:'all',onlyExceptions:b.dataset.fmMetric==='attention'});if(b.dataset.fmMetric==='recent')fmUI.freshness='Recent position';if(b.dataset.fmMetric==='missing')fmUI.freshness='Stale / missing';state.status='all';$('status').value='all';state.view='fleet';fmSync();changeFilter(true)});
 $('reviewCount').textContent=scope.filter(v=>v.exceptions.length).length;
};
list=()=>{
 const data=filtered();state.page=Math.max(0,Math.min(state.page,Math.ceil(data.length/PAGE_SIZE)-1));const start=state.page*PAGE_SIZE;
 $('listCount').textContent=fmt(data.length);$('listTitle').firstChild.textContent=fmUI.onlyExceptions?'Exceptions ':'Vehicles ';$('scopeCount').textContent=(state.viewport?'Map area':'Matching')+' · dummy data';
 $('records').innerHTML=data.slice(start,start+PAGE_SIZE).map(v=>'<button class="vehicle-row '+(v.id===state.selected?'selected':'')+'" data-id="'+v.id+'" aria-pressed="'+(v.id===state.selected)+'"><span class="vehicle-symbol">'+icon(v.exceptions.length?'alert':'truck')+'</span><span><span class="row-top"><strong>'+v.code+'</strong>'+statusHTML(v)+'</span><span class="row-sub">'+esc(v.district)+' · '+esc(v.psp)+'</span><span class="row-bottom"><b class="'+(v.exceptions.length?'flag-text':'')+'">'+esc(v.exceptions[0]?.kind||'No flagged exception')+'</b><span>'+age(fleetPositionAge(v,fm().snapshot,Date.now()))+'</span></span><small class="fm-position '+(v.positionState==='Recent position'?'':'fm-warning')+'">'+v.positionState+' · '+v.verified+'/'+v.planned+' stops verified</small></span></button>').join('')||'<div class="empty"><b>No matching vehicles</b><p>No sample vehicles meet these filters.</p><button class="btn" id="fmEmptyReset">Clear filters</button></div>';
 $('records').querySelectorAll('[data-id]').forEach(b=>b.onclick=()=>selectVehicle(Number(b.dataset.id)));if($('fmEmptyReset'))$('fmEmptyReset').onclick=()=>$('resetFilters').click();
 $('paginationText').textContent=data.length?(start+1)+'–'+Math.min(start+PAGE_SIZE,data.length)+' of '+fmt(data.length):'0 vehicles';$('prevPage').disabled=state.page===0;$('nextPage').disabled=start+PAGE_SIZE>=data.length;
};
const fmTruckSummary=(v,links,reviews,followups)=>'<section class="detail-section"><h3>Truck summary · dummy data</h3>'+rowKV('PSP operator',esc(v.psp))+rowKV('Assignment',links.assignments.length?links.assignments.map(a=>esc(a.id)+' · '+esc(a.area||a.route||'')+' · '+esc(a.stage||a.status||'Assigned')).join('<br>'):links.manifests.length?links.manifests.map(m=>esc(m.id)+' · '+esc(m.district)+'<br>'+esc(m.zone)+' · '+esc(m.start)+' · '+esc(m.status)).join('<br>'):'No assignment linked')+rowKV('Last reported position',v.coord[1].toFixed(5)+'° N, '+v.coord[0].toFixed(5)+'° E<br>'+fmStamp(new Date(Date.parse(fm().snapshot)-v.age*1000))+'<br>'+esc(v.positionState))+rowKV('Collection progress',v.verified+' / '+v.planned+' stops verified<br>'+v.reported+' reported · '+v.pending+' awaiting review')+'<progress class="fm-progress" value="'+v.verified+'" max="'+v.planned+'" aria-label="Verified stops"></progress>'+rowKV('Dumpsite booking',links.bookings.length?links.bookings.map(b=>esc(b.site)+'<br>Arrive '+clockText(b.slot)+' · leave collection point '+clockText(b.release)).join('<br>'):'No slot booked')+rowKV('Supervisor reviews',reviews.length?reviews.map(r=>esc(r.ref)+' · '+(r.decision?esc(r.decision.outcome)+' · '+esc(r.decision.by):'Awaiting review')).join('<br>'):'No linked dispatch reviews')+(followups.length?rowKV('Latest supervisor follow-up',esc(followups[0].owner)+'<br>'+esc(followups[0].note)+'<br>'+esc(followups[0].by)+' · '+fmStamp(followups[0].at)):'')+'</section>';
detailContent=v=>{
 const links=fmLinks(v),reviews=links.reviews.map(r=>({...r,decision:fo().reviews[r.key]})),followups=fm().followups.filter(f=>f.vehicle===v.code);
 const navigation='<div class="fm-detail-actions">'+(permitted('dispatch')?'<button class="btn" data-fm-go="dispatch">PSP collections '+icon('arrow')+'</button>':'')+(permitted('facility')?'<button class="btn" data-fm-go="facility">Dumpsites & TLS '+icon('arrow')+'</button>':'')+'</div>';
 if(state.tab==='activity')return '<section class="detail-section"><h3>Supervisor reviews</h3>'+(reviews.length?reviews.map(r=>rowKV(esc(r.kind)+' · '+esc(r.ref),r.decision?esc(r.decision.outcome)+' · '+esc(r.decision.by):'Awaiting review')).join(''):'<p>No linked dispatch reviews.</p>')+'</section><section class="detail-section"><h3>Saved follow-ups</h3>'+(followups.length?followups.map(f=>'<div class="fm-followup"><b>'+esc(f.owner)+'</b><p>'+esc(f.note)+'</p><small>'+esc(f.by)+' · '+fmStamp(f.at)+'</small></div>').join(''):'<p>No follow-up recorded.</p>')+'</section>'+navigation;
 if(state.tab==='service')return '<section class="detail-section"><h3>Collection progress</h3>'+rowKV('Assigned stops',v.planned)+rowKV('Reported collections',v.reported)+rowKV('Verified collections',v.verified)+rowKV('Evidence awaiting review',v.pending)+'<p class="note">Sample evidence only; GPS proximity does not confirm collection.</p></section><section class="detail-section"><h3>Route assignments</h3>'+(links.assignments.length?links.assignments.map(a=>rowKV(esc(a.id),esc(a.area||a.route||'')+' · '+esc(a.stage||a.status||'Assigned')+'<br>'+esc(a.by||'Earlier practice record'))).join(''):'<p>No saved assignment linked to this vehicle.</p>')+links.manifests.map(m=>rowKV(esc(m.id),esc(m.district)+' · '+esc(m.zone)+' '+esc(m.start)+'<br>Practice plate '+esc(m.vehicle)+(m.pendingSwap?'<br>Hot-swap awaiting approval':''))).join('')+'</section><section class="detail-section"><h3>Dumpsite bookings</h3>'+(links.bookings.length?links.bookings.map(b=>rowKV(esc(b.site),clockText(b.slot)+' · leave '+clockText(b.release))).join(''):'<p>No dumpsite slot booked for the linked manifests.</p>')+'</section>'+navigation;
 return '<section class="detail-section"><h3>Needs attention</h3>'+(v.exceptions.length?v.exceptions.map(e=>'<div class="fm-exception"><b>'+esc(e.kind)+'</b><p>'+esc(e.note)+'</p></div>').join(''):'<p>No flagged exception in this sample snapshot.</p>')+(fleetCan()?'<button class="btn" id="assignReview">Record supervisor follow-up '+icon('arrow')+'</button>':'')+'</section><section class="detail-section"><h3>Position reliability</h3>'+rowKV('Update state',v.positionState)+rowKV('Recorded at',fmStamp(new Date(Date.parse(fm().snapshot)-v.age*1000)))+rowKV('Last received',age(fleetPositionAge(v,fm().snapshot,Date.now())))+rowKV('Reported speed',v.positionState==='Recent position'?v.speed+' km/h':'Not current')+'<p class="note">'+(v.positionState==='Recent position'?'Recent sample position; a zero speed is not a breakdown.':'Last known sample position, not confirmation that the truck is parked.')+'</p></section><section class="detail-section"><h3>Vehicle & assignment</h3>'+rowKV('PSP operator',esc(v.psp))+rowKV('Sample district',esc(v.district))+rowKV('Vehicle class',esc(links.manifests[0]?.type||'Compactor'))+rowKV('Verified stops',v.verified+' / '+v.planned)+'<progress class="fm-progress" value="'+v.verified+'" max="'+v.planned+'" aria-label="Verified collection progress"></progress><div class="detail-actions"><button class="btn" id="fitRoute">'+icon('fit')+'Show route</button><button class="btn" id="serviceTab">Assignments & bookings</button></div></section>'+navigation;
};
const fmDetailBase=renderDetail;
renderDetail=()=>{if(!state.selected)return;fmEnrich();fmDetailBase();const v=fleet.find(x=>x.id===state.selected);if(!v)return;
 $('detail').querySelector('.detail-head p').textContent=v.district+' · '+v.psp+' · Dummy snapshot '+fmStamp(fm().snapshot);
 if(state.tab==='overview'){const links=fmLinks(v);$('detail').querySelector('.detail-content').insertAdjacentHTML('afterbegin',fmTruckSummary(v,links,links.reviews.map(r=>({...r,decision:fo().reviews[r.key]})),fm().followups.filter(f=>f.vehicle===v.code)))}
 $('detail').querySelector('[data-tab="service"]').textContent='Service & dispatch';$('detail').querySelector('[data-tab="activity"]').textContent='Reviews';
 $('detail').querySelectorAll('[data-fm-go]').forEach(b=>b.onclick=()=>{if(b.dataset.fmGo==='dispatch')ui.fleetTab='Supervisor review';goJourney(b.dataset.fmGo)});
 // Legacy telemetry must not contradict the snapshot's stale-position warning.
 const legacyTelemetry=[...$('detail').querySelectorAll('.detail-section')].find(s=>s.querySelector('h3')?.textContent==='Vehicle telemetry');
 if(legacyTelemetry){legacyTelemetry.remove();const t=v.telemetry;if(t)$('detail').querySelector('.detail-content').insertAdjacentHTML('beforeend','<section class="detail-section"><h3>Sample vehicle readings</h3>'+rowKV('Fuel remaining',t.fuel+'%')+rowKV('Load estimate',t.load+'%')+rowKV('Reading status',v.positionState==='Recent position'?'Dummy snapshot':'Historical sample · not current')+(t.lastWeight?rowKV('Latest linked TLS ticket',esc(t.lastWeight.ticket)+' · '+fmt(t.lastWeight.net)+' kg'):'')+'</section>')}
 polishPractice($('detail'));
};
assignmentDialog=v=>{if(!fleetCan())return toast('A responsible LAWMA official must record this follow-up.');openForm('Supervisor follow-up · '+v.code,'Practice record only; does not clear an exception or authorise payment.',[field('owner','Responsible LAWMA team',{options:['District operations supervisor','PSP service liaison','LAWMA evidence review team']}),field('note','Action and evidence required',{type:'textarea'})],'Save follow-up',d=>{fm().followups.unshift({id:moduleID('FF',fm().followups),vehicle:v.code,...d,by:cadOfficer(),at:new Date().toISOString()});recordModuleAction(v.code+' fleet follow-up recorded')});const submit=$('moduleForm').onsubmit;$('moduleForm').onsubmit=e=>{submit(e);if($('modalBack').hidden)renderDetail()}};
const fmSelectBase=selectVehicle;
selectVehicle=id=>{if(!fleet.some(v=>v.id===id))return;fmSelectBase(id);$('mapSubtitle').textContent='Dummy position · '+fleet[id-1].positionState;document.querySelector('.map-region').classList.add('fm-has-detail');fmMode('map')};
const fmCloseBase=closeDetail;
closeDetail=()=>{fmCloseBase();document.querySelector('.map-region').classList.remove('fm-has-detail')};
const fmLayerInputs={routes:'Collection routes',sites:'Dumpsites & TLS',queues:'Gate queues',closures:'Road closures',drainage:'Drainage warnings'};
Object.entries(fmLayerInputs).forEach(([key,label])=>$('layersPop').insertAdjacentHTML('beforeend','<label><input type="checkbox" data-fm-layer="'+key+'">'+label+'</label>'));
$('layersBtn').setAttribute('aria-label','Map layers');
// Move existing report/backlog switches into the same layer menu.
if(hubMapBar){hubMapBar.querySelectorAll('button').forEach(b=>{$('layersPop').append(b)});hubMapBar.remove()}
$('layersPop').querySelectorAll('[data-fm-layer]').forEach(input=>input.onchange=()=>{fmUI.layers[input.dataset.fmLayer]=input.checked;updateMap()});
const fmColor=token=>getComputedStyle(document.documentElement).getPropertyValue(token).trim();
const fmFeature=(geometry,properties)=>({type:'Feature',geometry,properties});
const fmSiteCoord=s=>s.coord||({'DS-OLU':[3.376,6.598],'DS-SOL':[3.257,6.559],'DS-EPE':[3.975,6.596]}[s.id]);
const fmOverlay=()=>{
 if(!ready||!map)return;
 const colors={routes:fmColor('--sc-forest'),sites:fmColor('--sc-fg'),queues:fmColor('--sc-honey'),closures:fmColor('--sc-crimson'),drainage:fmColor('--sc-blue')};
 const sources={
  routes:ROUTES.filter(r=>allFiltered().some(v=>v.district===r.name)).map(r=>fmFeature({type:'LineString',coordinates:r.coordinates},{name:r.name+' · sample collection route'})),
  sites:[...hub.sites.filter(s=>fmSiteCoord(s)).map(s=>fmFeature({type:'Point',coordinates:fmSiteCoord(s)},{name:s.name+' · sample site location',ref:s.id})),...modules.facilities.map(s=>fmFeature({type:'Point',coordinates:hubAreaCenter(s.area)},{name:s.name+' · illustrative '+s.kind+' location',ref:s.id}))],
  queues:hub.sites.filter(s=>fmSiteCoord(s)).map(s=>{const q=hub.queue.filter(x=>x.site===s.id);return fmFeature({type:'Point',coordinates:fmSiteCoord(s)},{name:s.name+' · '+q.length+' waiting',ref:s.id,wait:q.length?Math.max(...q.map(hubWait)):0})}).filter(f=>f.properties.wait>0),
  closures:fm().closures.map(c=>fmFeature({type:'Point',coordinates:c.coord},{name:c.name,ref:c.id})),
  drainage:drain().channels.map(c=>fmFeature({type:'Polygon',coordinates:[c.ring]},{name:c.id+' · '+c.lga+' · illustrative boundary',ref:c.id}))
 };
 Object.keys(sources).forEach(key=>{
  const id='fm-'+key;
  if(!map.getSource(id)){
   map.addSource(id,{type:'geojson',data:fc([])});
   const type=key==='routes'?'line':key==='drainage'?'fill':'circle';
   const paint=type==='line'?{'line-color':colors[key],'line-width':2,'line-opacity':.65}:type==='fill'?{'fill-color':colors[key],'fill-opacity':.12,'fill-outline-color':colors[key]}:{'circle-color':colors[key],'circle-radius':key==='queues'?13:9,'circle-stroke-color':fmColor('--sc-surface'),'circle-stroke-width':2};
   map.addLayer({id,type,source:id,paint,layout:{visibility:'none'}},map.getLayer('clusters')?'clusters':undefined);
   if(type!=='line')map.on('click',id,e=>{const p=e.features?.[0]?.properties;if(!p)return;const severe=drain().alerts.filter(a=>a.level==='Severe'&&drainAlertActive(a,new Date().toISOString()));dialog(esc(p.name),rowKV('Record type','Dummy map layer')+(key==='queues'?rowKV('Longest recorded wait',p.wait+' min'):key==='drainage'?rowKV('Active severe outlooks',String(severe.length))+rowKV('Boundary status','Illustrative, not surveyed'):key==='closures'?'<p>No live road closure or traffic authority connection.</p>':'')+'<div class="fm-detail-actions">'+(permitted(key==='drainage'?'drainage':'facility')&&key!=='closures'?'<button class="btn" data-module="app-go" data-record="'+(key==='drainage'?'drainage':'facility')+'">Open records '+icon('arrow')+'</button>':'')+'</div>')});
  }
  map.getSource(id).setData(fc(sources[key]));map.setLayoutProperty(id,'visibility',fmUI.layers[key]?'visible':'none');
 });
 // Old positions remain selectable through the existing clustered source, not an obstructing overlay.
 const positionColor=['match',['get','positionState'],'Missing update',fmColor('--stale'),'Stale position',fmColor('--sc-honey'),['match',['get','status'],...Object.entries(COLORS).flat(),fmColor('--stale')]];
 if(map.getLayer('vehicles'))map.setPaintProperty('vehicles','circle-color',positionColor);
 if(map.getLayer('selected-halo')){map.setPaintProperty('selected-halo','circle-opacity',0);map.setPaintProperty('selected-halo','circle-stroke-color',fmColor('--sc-heat'));map.setPaintProperty('selected-halo','circle-stroke-width',3)}
};
const fmUpdateBase=updateMap;
const fmFeatureBase=feature;
feature=v=>{const f=fmFeatureBase(v);f.properties.positionState=v.positionState;return f};
updateMap=()=>{fmEnrich();fmUpdateBase();fmOverlay()};
const fmRenderBase=renderJourney;
renderJourney=()=>{fmRenderBase();document.querySelector('.snapshot').textContent='Dummy snapshot · '+fmStamp(fm().snapshot);if($('simSnapshot')){$('simSnapshot').textContent='Advance dummy positions';$('simSnapshot').title='Generate the next sample GPS snapshot, not a live refresh'}if(journey.page==='fleet'){fmEnrich();metrics();list();fmSync();updateMap();if(state.selected)renderDetail()}};
const fmRunBase=runModule;
runModule=(cmd,id)=>{if(cmd!=='sim-telemetry')return fmRunBase(cmd,id);if(!fleetCan())return toast('A responsible LAWMA official must advance the practice snapshot.');fmRunBase(cmd,id);fm().snapshot=new Date().toISOString();recordModuleAction('Dummy fleet snapshot advanced; no live telemetry');saveModules();renderJourney()};
summary=()=>dialog('Dummy fleet snapshot · '+fmStamp(fm().snapshot),Object.keys(COLORS).map(s=>rowKV(s,fmt(fleet.filter(v=>v.status===s).length))).join('')+rowKV('Vehicles needing attention',reviewTotal())+'<p>Practice positions only; no live LAWMA connection.</p>');
const fmSnapshot=document.querySelector('.snapshot');fmSnapshot.textContent='Dummy snapshot · '+fmStamp(fm().snapshot);
$('pageTitle').textContent='Fleet oversight';$('pageDescription').textContent='Dummy fleet positions and operational exceptions';
document.querySelector('#fleetMain .page-foot').innerHTML='<span>Dummy data only · no live GPS or traffic feed</span><span>Freshness limits are illustrative: stale at 5 minutes, missing at 15 minutes.</span>';
let fmClock='';const fmRefresh=()=>{if(journey.page!=='fleet'||document.hidden||!$('modalBack').hidden)return;fmEnrich();const next=fleet.map(v=>v.positionState).join('|')+'|'+Math.floor(Date.now()/60000);if(next!==fmClock){fmClock=next;metrics();list();updateMap();if(state.selected)renderDetail()}};
setInterval(fmRefresh,1000);document.addEventListener('visibilitychange',fmRefresh);
fmSync();metrics();list();