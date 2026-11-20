/* Alimosho live-fleet simulation: 120 sample trucks on road-aligned Alimosho corridors, simulated movement and highway blockades. No live telemetry. */
if(!modules.fleetLive)modules.fleetLive={version:1,live:true,speed:5,blockades:[]};
const fl=()=>modules.fleetLive;
COLORS['Breakdown']='#b8322a';COLORS['Held at blockade']='#6d1f1f';
['Breakdown','Held at blockade'].forEach(s=>{if(![...$('status').options].some(o=>o.value===s))$('status').add(new Option(s,s))});
const flRouteStart=ROUTES.length;
FL_ROUTES.forEach(r=>{r.cumulative=[0];for(let i=1;i<r.coordinates.length;i++){const a=r.coordinates[i-1],b=r.coordinates[i];r.cumulative.push(r.cumulative[i-1]+Math.hypot((b[0]-a[0])*.993,b[1]-a[1]))}r.total=r.cumulative.at(-1);ROUTES.push(r)});
let flSeed=9071;const flRand=()=>{flSeed=(flSeed*1664525+1013904223)>>>0;return flSeed/4294967296};
const flCrew=['Kehinde O.','Ifeanyi M.','Rasheed B.','Funmi A.','Yusuf T.','Ngozi P.','Segun L.','Halima D.','Emeka J.','Bolaji S.'];
const flScenario={'On route':['Normal collection','Proceed to next scheduled stop'],'Collecting':['Street collection','Bins being lifted on this street'],'At facility':['Weighbridge queue','Await the site operator’s call'],'No signal':['GPS offline','Last known position retained'],'Breakdown':['Mechanical fault','Recovery truck requested · supervisor review'],'Held at blockade':['Highway blockade','Holding short of the closure']};
const flStart=fleet.length;
for(let i=0;i<FL_COUNT;i++){
 const n=flStart+i+1,u=flRand(),status=u<.52?'On route':u<.74?'Collecting':u<.84?'At facility':u<.91?'No signal':'Breakdown',ri=flRouteStart+i%FL_ROUTES.length,r=ROUTES[ri],fraction=status==='At facility'?(i%2?1:0):.03+flRand()*.94,p=atRoute(r,fraction),planned=40+Math.floor(flRand()*40),reported=Math.min(planned,Math.floor(planned*(.3+flRand()*.55))),pid=FL_PSPS[i%FL_PSPS.length];
 const v={id:n,code:'FLT-'+String(n).padStart(4,'0'),status,ri,district:'Alimosho',corridor:r.corridor,coord:p.coord,heading:p.heading,fraction,index:p.index,dir:flRand()<.5?1:-1,planned,reported,verified:reported,pending:0,review:false,reason:'',age:status==='No signal'?960+Math.floor(flRand()*900):2+Math.floor(flRand()*20),speed:status==='On route'?18+Math.floor(flRand()*22):status==='Collecting'?4:0,crew:flCrew[i%flCrew.length],partnerId:pid,psp:modules.partners.find(x=>x.id===pid)?.name||pid,notes:[],live:true};
 v.telemetry={fuel:15+i*7%80,load:10+i*13%85,battery:60+i%40,odometer:31200+i*97,scenario:flScenario[status][0],next:flScenario[status][1],lastSeen:new Date(Date.now()-v.age*1000).toISOString(),tareKg:10400+i%6*240};
 fleet.push(v);
}
fleet.filter(v=>v.live&&v.status==='Breakdown').forEach(v=>{if(!fm().fixtures.some(e=>e.vehicle===v.code))fm().fixtures.push({vehicle:v.code,kind:'Breakdown',note:'Sample mechanical fault on '+v.corridor+' · recovery and supervisor review required',sim:true})});
// Restore the live clock: legacy trucks keep their computed age; the simulated ping clock becomes the snapshot.
const flRebase=()=>{const now=Date.now();fleet.forEach(v=>{if(!v.live||v.status==='No signal'||v.status==='Breakdown')v.age=fleetPositionAge(v,fm().snapshot,now)});fm().snapshot=new Date(now).toISOString()};
flRebase();
const flBlocked=()=>fl().blockades.filter(b=>b.status==='Active');
const flSite=b=>b.site==='CENTRE'?{name:b.name,coord:b.coord}:FL_SITES.find(s=>s.id===b.site);
const flGeom={};
const flBlockFraction=(v,b)=>{const key=v.ri+'|'+b.id;if(!(key in flGeom)){const r=ROUTES[v.ri],s=flSite(b),hit=flNearest(r.coordinates,s.coord);flGeom[key]=hit.dist<=FL_BLOCK_RADIUS_M?flRouteFraction(r.coordinates,hit.index):null}return flGeom[key]};
const flHolding=v=>flBlocked().some(b=>{const bf=flBlockFraction(v,b);return bf!==null&&flApproach(v.fraction,v.dir,bf,ROUTES[v.ri].distance,FL_BLOCK_RADIUS_M)==='held'});
const flSetStatus=(v,s)=>{v.status=s;v.telemetry.scenario=flScenario[s][0];v.telemetry.next=flScenario[s][1]};
const flSyncBlockFlags=()=>{fm().fixtures=fm().fixtures.filter(e=>e.kind!=='Highway blockade');fleet.filter(v=>v.status==='Held at blockade').forEach(v=>{const b=flBlocked().find(b=>flBlockFraction(v,b)!==null);fm().fixtures.push({vehicle:v.code,kind:'Highway blockade',note:(b?flSite(b).name+' · '+b.cause:'Simulated blockade')+' · holding short of closure',sim:true})})};
let flLast=performance.now(),flTicks=0;
const flTick=()=>{
 const now=performance.now(),dt=Math.min(2,(now-flLast)/1000);flLast=now;
 if(!fl().live||document.hidden||journey.page!=='fleet'||!ready||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const sim=dt*fl().speed;flTicks++;
 fleet.forEach(v=>{
  if(!v.live){v.age+=dt;return}
  if(['No signal','Breakdown'].includes(v.status)){v.age+=dt;return}
  if(v.status==='Held at blockade'){if(!flHolding(v)){flSetStatus(v,'On route');v.speed=18+Math.floor(flRand()*20)}v.age=0;return}
  if(v.status==='At facility'){if(flRand()<.004*sim){flSetStatus(v,'On route');v.speed=20+Math.floor(flRand()*15)}v.age=0;return}
  if(flHolding(v)){const b=flBlocked().find(b=>flBlockFraction(v,b)!==null);if(b?.response==='Divert'){v.dir*=-1;v.telemetry.scenario='Diverted';v.telemetry.next='Re-routed away from '+flSite(b).name;b.diverted=(b.diverted||0)+1}else{flSetStatus(v,'Held at blockade');v.speed=0;flSyncBlockFlags()}v.age=0;return}
  if(v.status==='On route'&&flRand()<.01*sim){flSetStatus(v,'Collecting');v.speed=3+Math.floor(flRand()*4)}
  else if(v.status==='Collecting'&&flRand()<.02*sim){flSetStatus(v,'On route');v.speed=16+Math.floor(flRand()*24);v.reported=Math.min(v.planned,v.reported+1);v.verified=v.reported}
  const r=ROUTES[v.ri],next=flAdvance(v.fraction,v.dir,v.speed,sim,r.distance);v.fraction=next.fraction;v.dir=next.dir;const p=atRoute(r,v.fraction);v.coord=p.coord;v.index=p.index;v.heading=v.dir<0?(p.heading+180)%360:p.heading;v.age=0;v.telemetry.lastSeen=new Date().toISOString();
 });
 fm().snapshot=new Date().toISOString();
 updateMap();
 if(state.selected){const v=fleet[state.selected-1];if(v?.live&&followTruck)map.easeTo({center:v.coord,duration:900,easing:t=>t});if($('vehicleSpeed')&&v)$('vehicleSpeed').textContent=v.speed+' km/h'}
 if(flTicks%5===0){list();metrics();flPanel()}
};
setInterval(flTick,1000);
// Map overlay for blockades, re-attached whenever the map is rebuilt.
const flBlockFC=()=>({type:'FeatureCollection',features:flBlocked().map(b=>({type:'Feature',geometry:{type:'Point',coordinates:flSite(b).coord},properties:{label:'BLOCKADE · '+flSite(b).name.split(' · ').pop()}}))});
const flLayers=()=>{if(!map||map.getSource('fl-blockades'))return;map.addSource('fl-blockades',{type:'geojson',data:flBlockFC()});map.addLayer({id:'fl-block-zone',type:'circle',source:'fl-blockades',paint:{'circle-color':'#d0312d','circle-opacity':.18,'circle-stroke-color':'#d0312d','circle-stroke-width':2,'circle-radius':['interpolate',['exponential',2],['zoom'],10,2,14,26,17,210,20,1680]}});map.addLayer({id:'fl-block-core',type:'circle',source:'fl-blockades',paint:{'circle-color':'#d0312d','circle-radius':7,'circle-stroke-color':'#ffffff','circle-stroke-width':2}});map.addLayer({id:'fl-block-label',type:'symbol',source:'fl-blockades',layout:{'text-field':['get','label'],'text-font':['Noto Sans Regular'],'text-size':11,'text-offset':[0,1.6],'text-anchor':'top'},paint:{'text-color':'#8f1d1d','text-halo-color':'#ffffff','text-halo-width':2}})};
const flRefreshMap=()=>{if(ready&&map?.getSource('fl-blockades'))map.getSource('fl-blockades').setData(flBlockFC());updateMap()};
const flInitBase=initMap;initMap=function(){flInitBase();map.on('load',()=>{flLayers();if(!flFocused){flFocused=true;flFocusAlimosho()}})};
if(map&&ready)flLayers();
// Map toolbar: live toggle, speed, street level, Alimosho focus and blockade simulation.
let flFocused=false;
const flBar=document.createElement('div');flBar.className='fl-bar';flBar.setAttribute('role','group');flBar.setAttribute('aria-label','Live simulation controls');
flBar.innerHTML='<span class="fl-live-dot" aria-hidden="true"></span><button class="btn" id="flLive"></button><label class="sr" for="flSpeed">Simulation speed</label><select id="flSpeed" aria-label="Simulation speed">'+[1,5,20].map(s=>'<option value="'+s+'">'+s+'× speed</option>').join('')+'</select><button class="btn" id="flAlimosho">Alimosho</button><button class="btn" id="flStreet">Street level</button><button class="btn fl-block-btn" id="flBlock">Simulate highway blockade</button>';
document.querySelector('#fleetMain .workspace').before(flBar);
const flPanelBox=document.createElement('div');flPanelBox.className='fl-panel';flPanelBox.setAttribute('aria-live','polite');document.querySelector('#fleetMain .workspace').before(flPanelBox);
const flSyncBar=()=>{$('flLive').textContent=fl().live?'Pause live simulation':'Resume live simulation';$('flLive').setAttribute('aria-pressed',String(fl().live));flBar.classList.toggle('paused',!fl().live);$('flSpeed').value=String(fl().speed);motionLabel.textContent=fl().live?'Simulated live movement · Alimosho sample fleet · not real telemetry':'Simulation paused · dummy positions'};
$('flLive').onclick=()=>{fl().live=!fl().live;if(fl().live){flLast=performance.now();flRebase()}saveModules();flSyncBar()};
$('flSpeed').onchange=e=>{fl().speed=Number(e.target.value);saveModules()};
const flFocusAlimosho=()=>{Object.assign(fmUI,{psp:'all',freshness:'all',exception:'all',onlyExceptions:false});fmSync();Object.assign(state,{district:'Alimosho',status:'all',query:'',page:0,view:'fleet'});$('district').value='Alimosho';$('status').value='all';changeFilter(false);if(!state.selected){$('mapTitle').textContent='Alimosho · simulated live fleet';$('mapSubtitle').textContent='Zoom in to street level · select a truck to follow it'}if(ready)map.fitBounds([[3.222,6.518],[3.318,6.652]],{padding:40,duration:600})};
$('flAlimosho').onclick=flFocusAlimosho;
$('flStreet').onclick=()=>{if(!ready)return;const v=state.selected?fleet[state.selected-1]:fleet.find(x=>x.live&&x.status==='On route');map.easeTo({center:v?.coord||[3.2869,6.5917],zoom:17.6,duration:900})};
$('flBlock').onclick=()=>openForm('Simulate highway blockade','Rehearsal only: trucks on affected corridors hold short or divert. No real traffic, police or road data is used.',[field('site','Blockade location',{options:[...FL_SITES.map(s=>({value:s.id,label:s.name})),{value:'CENTRE',label:'Current map centre'}]}),field('cause','Cause',{options:FL_CAUSES}),field('minutes','Expected duration (minutes)',{type:'number',min:15,max:720,value:90}),field('response','Fleet response',{options:['Hold','Divert']})],'Start simulation',d=>{const e=flBlockadeError(d,fl().blockades);if(e)return e;const c=map?.getCenter(),b={id:'BLK-'+String(fl().blockades.length+1).padStart(3,'0'),site:d.site,cause:d.cause,minutes:Number(d.minutes),response:d.response,by:cadOfficer(),at:new Date().toISOString(),status:'Active',diverted:0};if(d.site==='CENTRE'){b.coord=[+c.lng.toFixed(5),+c.lat.toFixed(5)];b.name='Map centre '+b.coord[1]+'°N, '+b.coord[0]+'°E'}fl().blockades.unshift(b);saveModules();flRefreshMap();flPanel();if(ready)map.easeTo({center:flSite(b).coord,zoom:15,duration:800});toast('Blockade simulation recorded · '+flSite(b).name)});
const flClear=id=>{const b=fl().blockades.find(x=>x.id===id);if(!b)return;b.status='Cleared';b.clearedAt=new Date().toISOString();b.clearedBy=cadOfficer();fleet.filter(v=>v.status==='Held at blockade'&&!flHolding(v)).forEach(v=>{flSetStatus(v,'On route');v.speed=20});flSyncBlockFlags();saveModules();flRefreshMap();flPanel();list();metrics();toast('Blockade simulation cleared · trucks resume')};
const flPanel=()=>{const act=flBlocked();if(!act.length){flPanelBox.hidden=true;flPanelBox.innerHTML='';return}flPanelBox.hidden=false;flPanelBox.innerHTML=act.map(b=>{const held=fleet.filter(v=>v.status==='Held at blockade'&&flBlockFraction(v,b)!==null),exposed=fleet.filter(v=>v.live&&flBlockFraction(v,b)!==null),imp=flImpact(held),left=Math.max(0,b.minutes-Math.round((Date.now()-Date.parse(b.at))/60000));return '<article class="fl-block-card"><div><span class="fl-tag">'+esc(b.id)+' · '+esc(b.response)+'</span><h3>'+esc(flSite(b).name)+'</h3><p>'+esc(b.cause)+' · started '+fmStamp(b.at)+' by '+esc(b.by)+' · ~'+left+' min remaining</p></div><dl><div><dt>Trucks held</dt><dd>'+imp.held+'</dd></div><div><dt>Diverted</dt><dd>'+(b.diverted||0)+'</dd></div><div><dt>On affected corridors</dt><dd>'+exposed.length+'</dd></div><div><dt>PSPs affected</dt><dd>'+imp.psps+'</dd></div><div><dt>Stops at risk</dt><dd>'+imp.stops+'</dd></div><div><dt>Est. delay</dt><dd>'+imp.delayMin+' min</dd></div></dl><div class="fl-block-actions"><button class="btn" data-fl-held="'+esc(b.id)+'">Show held trucks</button><button class="btn" data-fl-clear="'+esc(b.id)+'">Clear blockade</button></div></article>'}).join('');flPanelBox.querySelectorAll('[data-fl-clear]').forEach(x=>x.onclick=()=>flClear(x.dataset.flClear));flPanelBox.querySelectorAll('[data-fl-held]').forEach(x=>x.onclick=()=>{state.status='Held at blockade';$('status').value='Held at blockade';Object.assign(fmUI,{onlyExceptions:false});fmSync();changeFilter(true)})};
flSyncBar();flPanel();
// Alimosho opens as the default fleet focus; legend gains the new states.
document.querySelector('.map-bottom .legend')?.insertAdjacentHTML('beforeend','<span><i style="background:#b8322a"></i>Breakdown</span><span><i style="background:#6d1f1f"></i>Held at blockade</span>');
Object.assign(state,{district:'Alimosho'});$('district').value='Alimosho';fmUI.onlyExceptions=false;fmSync();
flSyncBlockFlags();
