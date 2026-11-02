/* Hub additions: public reports (dump alarms), resident channels, service backlog, disposal-site queues, markets & businesses, partner remittances, customer pickups, facility weights. */
// ---- Rules (single-line constants; src/test/hub-rules.test.ts evaluates them in isolation) ----
const ALARM_ACK_LIMIT_MIN=30;
const ALARM_STEPS=['New','Acknowledged','Assigned','Crew on site','Cleared'];
const alarmFlow={New:['Acknowledged','Duplicate'],Acknowledged:['Assigned','Duplicate'],Assigned:['Crew on site'],'Crew on site':['Cleared'],Cleared:[],Duplicate:[]};
const alarmCanMove=(from,to)=>(alarmFlow[from]||[]).includes(to);
const alarmOverdue=(r,now)=>r.status==='New'&&(now-Date.parse(r.raised))/60000>ALARM_ACK_LIMIT_MIN;
const alarmChannelRoute=channel=>({App:'App notification',WhatsApp:'WhatsApp message',USSD:'SMS'}[channel]||'SMS');
const alarmMessage=(r,status)=>({New:'Thank you. Report '+r.id+' has been received. LAWMA will update you here.',Acknowledged:'LAWMA has reviewed report '+r.id+' and is arranging a crew.',Assigned:(r.operatorName||'A collection operator')+' has been assigned to clear the waste at '+r.place+'.','Crew on site':'A crew is now on site at '+r.place+'.',Cleared:'Report '+r.id+' was cleared'+(r.clearedTime?' at '+r.clearedTime:'')+'. A photo of the cleared spot is attached. Thank you for helping keep Lagos clean.',Duplicate:'This spot is already being handled under report '+(r.duplicateOf||'')+'. We will update you there.'}[status]||'');
const backlogLevel=days=>days>=7?'Critical':days>=3?'Overdue':'On schedule';
const QUEUE_WAIT_LIMIT_MIN=45;
const queueWarning=waits=>waits.some(w=>w>QUEUE_WAIT_LIMIT_MIN);
const SITE_REPORTS_KEY='lawma.site.reports.v1';
const siteReportToHub=s=>({id:s.ref,type:s.type,area:s.area,place:s.place,note:s.description,size:s.size,channel:'Website',lang:'English',reporter:s.reporter,raised:s.raised,photoUrl:typeof s.photo==='string'&&s.photo.startsWith('data:image/')?s.photo:null,...(Array.isArray(s.coord)?{coord:s.coord}:{})});
const monthlyInvoice=(account,period)=>({account:account.id,period,amount:account.monthly,basis:'Monthly service'});
const PARTNER_SHARE=0.8;
const REMITTANCE_DEADLINE='Friday 5 pm';
const settlementSplit=gross=>{const authorityShare=Math.round(gross*(1-PARTNER_SHARE));return {partnerShare:gross-authorityShare,authorityShare}};
const pickupFlow={Requested:['Scheduled','Declined'],Scheduled:['Collected','Cancelled'],Collected:['Completed','Cancelled'],Completed:[],Declined:[],Cancelled:[]};
const pickupCanMove=(from,to)=>(pickupFlow[from]||[]).includes(to);
const pickupEarnings=list=>list.filter(p=>p.status==='Completed').reduce((n,p)=>n+p.fee,0);
const pickupUnsettled=(pickups,setts,partnerId)=>pickups.filter(p=>p.partner===partnerId&&p.status==='Completed'&&!setts.some(s=>s.partner===partnerId&&(s.pickups||[]).includes(p.id)));

// ---- Data ----
const HUB_PHOTOS=/*HUBPHOTOS*/;
defs.insertAdjacentHTML('beforeend','<symbol id="i-flag" viewBox="0 0 24 24"><path d="M5 21V4M5 4h12l-2.5 4L17 12H5"/></symbol><symbol id="i-market" viewBox="0 0 24 24"><path d="M3 9 4.5 4h15L21 9M4 9v11h16V9M3 9h18M9 20v-6h6v6"/></symbol>');
const hubMinutesAgo=m=>new Date(Date.now()-m*60000).toISOString();
const hubAreaCenter=name=>{const r=ROUTES.find(r=>r.name===name);return r?atRoute(r,.5).coord:({Mushin:[3.3506,6.5273]}[name]||[3.38,6.52])};
const hubPoint=(name,f)=>{const r=ROUTES.find(r=>r.name===name);if(r)return atRoute(r,f).coord;const c=hubAreaCenter(name);return [c[0]+(f-.5)*.012,c[1]+(f-.5)*.007]};
const hubOperator=area=>modules.partners.find(p=>p.service==='Collection'&&p.status==='Active'&&p.area===area)?.id||'PAR-009';
const hubClock=iso=>new Date(iso).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'});
function hubAge(iso){const m=Math.max(0,Math.round((Date.now()-Date.parse(iso))/60000));if(m<60)return m+' min';if(m<1440)return Math.floor(m/60)+' h '+(m%60)+' min';return Math.floor(m/1440)+' d'}
function hubReplay(r,target,times){
 // Build the record's history up to its seeded status so every report reads as a complete trail.
 r.events=[{text:'Report received via '+r.channel,time:r.raised}];r.messages=[{text:alarmMessage(r,'New'),time:r.raised,via:alarmChannelRoute(r.channel)}];
 const chain=ALARM_STEPS.slice(1,ALARM_STEPS.indexOf(target)+1);
 chain.forEach((s,i)=>{const time=times[i]||r.raised;if(s==='Acknowledged')r.ack=time;if(s==='Assigned'){r.operatorName=partnerName(r.partner)}if(s==='Cleared'){r.cleared=time;r.clearedTime=hubClock(time);r.volume=r.volume||2.4}
  r.events.push({text:{Acknowledged:'Acknowledged by Customer care',Assigned:'Assigned to '+partnerName(r.partner),'Crew on site':'Crew on site · '+(r.crew||'Crew lead'),Cleared:'Cleared · photo attached'}[s],time});r.messages.push({text:alarmMessage(r,s),time,via:alarmChannelRoute(r.channel)})});
 r.status=target;return r;
}
function hubSeed(){
 const opMain=hubOperator('Ikeja'),opCoastal=hubOperator('Lekki');
 const rep=(o,status='New',times=[])=>hubReplay({photo:null,size:'Medium',lang:'English',partner:null,crew:null,caseId:null,duplicateOf:null,...o,coord:hubPoint(o.area,o.f??.5)},status,times);
 const reports=[
  rep({id:'PUB-001',type:'Illegal dump',area:'Mushin',place:'Ojuwoye market road, by the bus stop',channel:'WhatsApp',lang:'Pidgin',reporter:'Resident · 0803 ••• 4412',size:'Large',photo:'dump',raised:hubMinutesAgo(42),f:.42}),
  rep({id:'PUB-002',type:'Blocked drain',area:'Surulere',place:'Bode Thomas Street drain',channel:'App',reporter:'Resident · 0816 ••• 2290',photo:'drain',raised:hubMinutesAgo(9),f:.35}),
  rep({id:'PUB-003',type:'Overflowing public bin',area:'Oshodi',place:'Oshodi market, gate 2 skip',channel:'USSD',lang:'Yoruba',reporter:'Resident · 0705 ••• 8831',size:'Large',raised:hubMinutesAgo(95),f:.55},'Acknowledged',[hubMinutesAgo(81)]),
  rep({id:'PUB-004',type:'Market waste',area:'Ikeja',place:'Computer Village, Otigba Street',channel:'App',reporter:'Trader · 0809 ••• 1174',photo:'bin',raised:hubMinutesAgo(180),partner:hubOperator('Ikeja'),f:.62},'Assigned',[hubMinutesAgo(171),hubMinutesAgo(150)]),
  rep({id:'PUB-005',type:'Illegal dump',area:'Alimosho',place:'Egbeda–Idimu road, under the bridge',channel:'WhatsApp',reporter:'Resident · 0812 ••• 6620',size:'Large',photo:'dump',raised:hubMinutesAgo(300),partner:hubOperator('Alimosho'),crew:'Crew lead 008',f:.3},'Crew on site',[hubMinutesAgo(286),hubMinutesAgo(250),hubMinutesAgo(40)]),
  rep({id:'PUB-006',type:'Overflowing public bin',area:'Yaba',place:'Sabo market junction',channel:'App',reporter:'Resident · 0902 ••• 3315',photo:'bin',raised:hubMinutesAgo(1440),partner:hubOperator('Yaba'),crew:'Crew lead 002',f:.5},'Cleared',[hubMinutesAgo(1420),hubMinutesAgo(1380),hubMinutesAgo(1320),hubMinutesAgo(1270)]),
  rep({id:'PUB-007',type:'Illegal dump',area:'Mushin',place:'Ojuwoye market road, opposite the mosque',channel:'USSD',lang:'Pidgin',reporter:'Resident · 0706 ••• 0954',size:'Large',raised:hubMinutesAgo(25),f:.47})
 ];
 const areaDays={Ikeja:1,Yaba:2,Surulere:4,'Lagos Island':1,Lekki:2,Agege:6,Oshodi:5,Alimosho:8,Apapa:3,Mushin:9};
 const areas=Object.entries(areaDays).map(([area,days],i)=>({area,days,overdue:days<3?0:days*6+(i%3)*4,partner:hubOperator(area),moved:null}));
 const fleetPick=i=>fleet[(i*37+11)%fleet.length];
 const truck=(site,i,mins,travel)=>{const v=fleetPick(i);return {id:'Q-'+String(i+1).padStart(3,'0'),site,truck:v.code,partner:v.partnerId,arrived:hubMinutesAgo(mins),travel}};
 return {version:2,reports,areas,moves:[],
  sites:[{id:'DS-OLU',name:'Olusosun',area:'Ojota',gateToExit:38,exits:6},{id:'DS-SOL',name:'Solous II',area:'Igando',gateToExit:31,exits:4},{id:'DS-EPE',name:'Epe',area:'Epe',gateToExit:24,exits:2}],
  queue:[truck('DS-OLU',0,38,55),truck('DS-OLU',1,31,48),truck('DS-OLU',2,22,61),truck('DS-OLU',3,12,44),truck('DS-SOL',4,15,47),truck('DS-SOL',5,8,39),truck('DS-EPE',6,5,96)],
  onsite:[{truck:fleetPick(7).code,partner:fleetPick(7).partnerId,site:'DS-OLU',gateIn:hubMinutesAgo(20)}],
  accounts:[
   {id:'MKT-001',name:'Ojuwoye market',kind:'Market',area:'Mushin',window:'06:00–08:30',days:'Daily',partner:hubOperator('Mushin'),monthly:180000},
   {id:'MKT-002',name:'Oshodi market',kind:'Market',area:'Oshodi',window:'06:00–08:30',days:'Daily',partner:hubOperator('Oshodi'),monthly:240000},
   {id:'MKT-003',name:'Computer Village',kind:'Market',area:'Ikeja',window:'06:00–08:30',days:'Daily',partner:hubOperator('Ikeja'),monthly:210000},
   {id:'BUS-001',name:'Admiralty Way shops',kind:'Business',area:'Lekki',window:'19:00–21:00',days:'Mon · Wed · Fri',partner:hubOperator('Lekki'),monthly:95000},
   {id:'BUS-002',name:'Apapa food court',kind:'Business',area:'Apapa',window:'21:00–22:30',days:'Daily',partner:hubOperator('Apapa'),monthly:60000}
  ],
  cleanups:{'MKT-001':{status:'Done',time:'08:12',crew:'Crew lead 009'},'MKT-002':{status:'Missed',time:null,crew:null},'MKT-003':{status:'Done',time:'07:55',crew:'Crew lead 001'},'BUS-001':{status:'Scheduled',time:null,crew:null},'BUS-002':{status:'Scheduled',time:null,crew:null}},
  invoices:[{id:'COM-001',...monthlyInvoice({id:'MKT-001',monthly:180000},'September 2026'),status:'Paid'},{id:'COM-002',...monthlyInvoice({id:'MKT-002',monthly:240000},'September 2026'),status:'Paid'},{id:'COM-003',...monthlyInvoice({id:'MKT-003',monthly:210000},'September 2026'),status:'Outstanding'}],
  pickups:[
   {id:'PU-710001',partner:opCoastal,customer:'Ada Okafor',address:'71 Ajah Gardens',area:'Ajah',window:'Friday, 9 am–noon',fee:1500,status:'Requested',crew:null,raised:hubMinutesAgo(40),evidence:null,issue:null,history:[]},
   {id:'PU-180002',partner:opMain,customer:'Tunde Bakare',address:'18 Olowu Street',area:'Ikeja',window:'Tomorrow, 8–11 am',fee:1450,status:'Requested',crew:null,raised:hubMinutesAgo(55),evidence:null,issue:null,history:[]},
   {id:'PU-104201',partner:opMain,customer:'Chioma Eze',address:'4 Mainland Court',area:'Ikeja',window:'Thursday, 1–4 pm',fee:1500,status:'Scheduled',crew:'Crew Beta',raised:hubMinutesAgo(300),evidence:null,issue:null,history:[{status:'Scheduled',note:'Accepted · Crew Beta · Thursday, 1–4 pm'}]},
   {id:'PU-088401',partner:opCoastal,customer:'Ibrahim Suleiman',address:'9 Freedom Way',area:'Lekki',window:'Wednesday, 10 am–1 pm',fee:1500,status:'Scheduled',crew:'Crew Alpha',raised:hubMinutesAgo(600),evidence:null,issue:'Missed collection reported last week',history:[{status:'Scheduled',note:'Accepted · Crew Alpha · Wednesday, 10 am–1 pm'}]},
   {id:'PU-200101',partner:opCoastal,customer:'Folasade Adigun',address:'12 Marwa Close',area:'Lekki',window:'Monday, 9 am–noon',fee:1500,status:'Completed',crew:'Crew Alpha',raised:hubMinutesAgo(2800),evidence:'Collection evidence recorded',issue:null,history:[{status:'Completed',note:'Stop completed · earnings captured'}]},
   {id:'PU-210301',partner:opCoastal,customer:'Kunle Oyelaran',address:'5B Chevron Drive',area:'Lekki',window:'Tuesday, 2–5 pm',fee:1450,status:'Completed',crew:'Crew Gamma',raised:hubMinutesAgo(4200),evidence:'Collection evidence recorded',issue:null,history:[{status:'Completed',note:'Stop completed · earnings captured'}]},
   {id:'PU-176204',partner:opCoastal,customer:'Bisi Adeleke',address:'7 Admiralty Road',area:'Lekki',window:'Wednesday, 9 am–noon',fee:1450,status:'Completed',crew:'Crew Gamma',raised:hubMinutesAgo(1500),evidence:'Collection evidence recorded',issue:null,history:[{status:'Completed',note:'Stop completed · earnings captured'}]}
  ],
  settlements:[
   {id:'SET-220001',partner:opMain,date:hubMinutesAgo(5000),gross:18500,partnerShare:14800,authorityShare:3700,status:'Reconciled',pickups:[]},
   {id:'SET-219954',partner:opMain,date:hubMinutesAgo(11500),gross:16200,partnerShare:12960,authorityShare:3240,status:'Reconciled',pickups:[]},
   {id:'SET-220002',partner:opCoastal,date:hubMinutesAgo(180),gross:2950,...settlementSplit(2950),status:'Awaiting confirmation',pickups:['PU-200101','PU-210301']}
  ]
 };
}
if(!modules.hub)modules.hub=hubSeed();else if(modules.hub.version!==2){const fresh=hubSeed();modules.hub.version=2;modules.hub.settlements=fresh.settlements;modules.hub.pickups=fresh.pickups}
const hub=modules.hub;
const hubUI={status:'Open',channel:'All channels',showReports:true,showBacklog:false};
const HUB_PERIOD='October 2026';

// ---- Access ----
for(const r of ['management','admin','operations','care'])if(personaPages[r]&&!personaPages[r].includes('publicReports'))personaPages[r].push('publicReports');
for(const r of ['management','admin','operations','care','finance'])if(personaPages[r]&&!personaPages[r].includes('commercial'))personaPages[r].push('commercial');
if(personaPages.enforcement&&!personaPages.enforcement.includes('publicReports'))personaPages.enforcement.push('publicReports');
journeyNav.push(['publicReports','Public reports','flag'],['commercial','Markets & businesses','market']);
const hubPartnerContext=changePartnerContext;changePartnerContext=function(id){hubPartnerContext(id);if(journey.role==='partner'&&currentPartner().service==='Collection'&&!personaPages.partner.includes('publicReports'))personaPages.partner.push('publicReports')};
const hubCanTriage=()=>isAuthority()||journey.role==='care';
const hubCanField=r=>hubCanTriage()||isPartnerRole()&&r.partner===modules.partnerContext;
const hubVisible=()=>hub.reports.filter(r=>!isPartnerRole()||r.partner===modules.partnerContext);
const hubOpenList=()=>hubVisible().filter(r=>!['Cleared','Duplicate'].includes(r.status));
const hubBtn=(label,cmd,id='',primary=false)=>button(label,'hub-'+cmd,id,primary);
const hubPill=r=>alarmOverdue(r,Date.now())?pill('Not acknowledged','red'):r.status==='Cleared'?pill('Cleared','good'):r.status==='Duplicate'?pill('Duplicate'):r.status==='New'?pill('New','amber'):pill(esc(r.status),'blue');
const hubChannel=r=>`<span class="hub-chip">${esc(r.channel)}</span>`;
const hubLevelPill=a=>a.moved?pill('Catch-up underway','blue'):pill(backlogLevel(a.days),{Critical:'red',Overdue:'amber','On schedule':'good'}[backlogLevel(a.days)]);

// ---- Public reports workspace ----
function hubHotspots(){
 const groups={};for(const r of hubVisible().filter(r=>r.status!=='Duplicate')){const key=r.area+' · '+r.place.split(',')[0];(groups[key] ||= []).push(r)}
 return Object.entries(groups).filter(([,list])=>list.length>1);
}
screens.publicReports=()=>{
 const all=hubVisible(),now=Date.now();
 const shown=all.filter(r=>(hubUI.status==='All'||(hubUI.status==='Open'?!['Cleared','Duplicate'].includes(r.status):r.status===hubUI.status))&&(hubUI.channel==='All channels'||r.channel===hubUI.channel)).sort((a,b)=>Date.parse(b.raised)-Date.parse(a.raised));
 const hot=hubHotspots();
 return pageHead('PUBLIC REPORTS','Every alarm seen. Every spot cleared.','Dumps, overflowing public bins, blocked drains and market waste raised by Lagosians through the app, the LAWMA website, WhatsApp and USSD. The reporter is updated at every step.',hubCanTriage()?hubBtn('Log a report','log','',true):'')+
 stats([['Open alarms',hubOpenList().length,'Awaiting clearance'],['Not acknowledged',all.filter(r=>alarmOverdue(r,now)).length,'Older than '+ALARM_ACK_LIMIT_MIN+' minutes'],['Cleared',all.filter(r=>r.status==='Cleared').length,'With a photo of the cleared spot'],['Hotspots',hot.length,'Spots reported more than once']])+
 `<div class="module-toolbar hub-filters"><label for="hubStatus">Show</label><select id="hubStatus">${selectOptions(['Open','New','Acknowledged','Assigned','Crew on site','Cleared','Duplicate','All'],hubUI.status)}</select><label for="hubChannel">Channel</label><select id="hubChannel">${selectOptions(['All channels','App','Website','WhatsApp','USSD','Phone call','Field officer'],hubUI.channel)}</select>${permitted('fleet')?hubBtn('Show on map','mapAll'):''}</div>`+
 panel('Alarm inbox','Newest first. An alarm not acknowledged within '+ALARM_ACK_LIMIT_MIN+' minutes turns red and appears on the Overview.',shown.length?table(['Report / place','Type','Channel','Raised','Status','Operator',''],shown.map(r=>[`<b>${r.id}</b><small class="cell-sub">${esc(r.place)} · ${esc(r.area)}</small>`,esc(r.type),hubChannel(r),hubAge(r.raised)+' ago',hubPill(r),r.partner?esc(partnerName(r.partner)):'<span class="cell-sub">Not assigned</span>',link('Open','hub-report',r.id)])):empty('No reports match','Change the filters to see other reports.'))+
 panel('Hotspots','The same spot reported more than once. Repeat dumping can be referred to Enforcement.',hot.length?table(['Spot','Reports','Latest',''],hot.map(([spot,list])=>[esc(spot),list.length+' · '+list.map(r=>r.id).join(', '),hubAge(list.map(r=>r.raised).sort().at(-1))+' ago',link('Open latest','hub-report',list.sort((a,b)=>Date.parse(b.raised)-Date.parse(a.raised))[0].id)])):empty('No hotspots','Repeat reports for the same spot will be grouped here.'));
};
function hubPhotos(r){
 const src=r.photoUrl||(r.photo&&HUB_PHOTOS[r.photo]);
 const before=src?`<figure class="hub-photo"><img src="${esc(src)}" alt="${esc(r.type)} reported at ${esc(r.place)}"><figcaption>Reporter's photo · ${hubClock(r.raised)}</figcaption></figure>`:`<div class="hub-photo hub-photo-none"><span>${icon('flag')}</span><small>${r.channel==='USSD'?'Reported by USSD · no photo':'No photo attached'}</small></div>`;
 const after=r.status==='Cleared'?`<figure class="hub-photo"><img src="${HUB_PHOTOS.cleared}" alt="${esc(r.place)} after clearance"><figcaption>Cleared · ${esc(r.clearedTime||'')}</figcaption></figure>`:'';
 return `<div class="hub-photos ${after?'two':''}">${before}${after}</div>`;
}
function hubActions(r){
 const b=[];
 if(r.status==='New'&&hubCanTriage())b.push(hubBtn('Acknowledge','ack',r.id,true),hubBtn('Mark as duplicate','dup',r.id));
 if(r.status==='Acknowledged'&&hubCanTriage())b.push(hubBtn('Assign operator','assign',r.id,true),hubBtn('Mark as duplicate','dup',r.id));
 if(r.status==='Assigned'&&hubCanField(r))b.push(hubBtn('Crew on site','onsite',r.id,true));
 if(r.status==='Crew on site'&&hubCanField(r))b.push(hubBtn('Mark cleared','clear',r.id,true));
 if(r.type==='Illegal dump'&&!r.caseId&&r.status!=='Duplicate'&&(hubCanTriage()||journey.role==='enforcement'))b.push(hubBtn('Refer to Enforcement','refer',r.id));
 if(permitted('fleet'))b.push(hubBtn('View on map','map',r.id));
 return b.length?`<div class="drawer-actions">${b.join('')}</div>`:'';
}
function hubOpen(id){
 const r=hubVisible().find(r=>r.id===id);if(!r)return;
 drawer(r.id+' · '+r.type,(r.status==='Duplicate'?note('Duplicate of '+esc(r.duplicateOf)+'. The reporter follows that report.'):steps(['Received','Acknowledged','Assigned','Crew on site','Cleared'],ALARM_STEPS.indexOf(r.status)+1))+
  (alarmOverdue(r,Date.now())?`<p class="hub-warning">${icon('alert')}<span>Not acknowledged after ${hubAge(r.raised)}. Acknowledge it so the reporter knows it has been seen.</span></p>`:'')+
  hubPhotos(r)+rowKV('Place',esc(r.place))+rowKV('Area',esc(r.area))+(r.note?rowKV('Description',esc(r.note)):'')+rowKV('Size',esc(r.size))+rowKV('Channel · language',esc(r.channel)+' · '+esc(r.lang))+rowKV('Reporter',esc(r.reporter||'Anonymous'))+rowKV('Raised',stamp(r.raised)+' · '+hubAge(r.raised)+' ago')+rowKV('Operator',r.partner?esc(partnerName(r.partner)):'Not assigned')+(r.crew?rowKV('Crew',esc(r.crew)):'')+(r.volume&&r.status==='Cleared'?rowKV('Removed',r.volume+' t (estimate)'):'')+(r.caseId?rowKV('Enforcement case',esc(r.caseId)):'')+
  hubActions(r)+
  `<h3>Updates sent to the reporter</h3><ol class="hub-msgs">${r.messages.map(m=>`<li><p>${esc(m.text)}</p><small>${esc(m.via)} · ${hubClock(m.time)}</small></li>`).join('')}</ol>`+
  '<h3>Event history</h3><ol class="module-timeline">'+r.events.map(e=>`<li>${esc(e.text)}<small>${stamp(e.time)}</small></li>`).join('')+'</ol>');
}
function hubMove(r,to,text){
 if(!alarmCanMove(r.status,to))return 'This report has already moved to '+r.status+'.';
 const time=simNow();r.status=to;r.events.push({text,time});const msg=alarmMessage(r,to);if(msg)r.messages.push({text:msg,time,via:alarmChannelRoute(r.channel)});recordModuleAction(r.id+': '+text);return null;
}
const hubReopen=id=>setTimeout(()=>hubOpen(id),0);
function hubNewReport(o){
 const r={id:moduleID('PUB',hub.reports),photo:null,size:'Medium',lang:'English',partner:null,crew:null,caseId:null,duplicateOf:null,raised:simNow(),status:'New',...o};
 r.coord ||= hubPoint(r.area,.3+Math.random()*.4);r.events=[{text:'Report received via '+r.channel,time:r.raised}];r.messages=[{text:alarmMessage(r,'New'),time:r.raised,via:alarmChannelRoute(r.channel)}];
 hub.reports.unshift(r);simNotice('New public report',r.id+' · '+r.type+' · '+r.place,'publicReports','Warning');recordModuleAction(r.id+' received via '+r.channel);return r;
}

// Reports filed on the LAWMA website (same browser) join the inbox as Website alarms.
const HUB_LGA_ALIAS={'Eti-Osa':'Lekki','Ibeju-Lekki':'Lekki','Oshodi-Isolo':'Oshodi','Lagos Mainland':'Yaba'};
function hubImportSite(){
 let list;try{list=JSON.parse(localStorage.getItem(SITE_REPORTS_KEY)||'[]')}catch{return 0}
 if(!Array.isArray(list))return 0;let n=0;
 for(const s of list.slice().reverse()){if(!s||typeof s.ref!=='string'||hub.reports.some(r=>r.id===s.ref))continue;const o=siteReportToHub(s);o.coord ||= hubPoint(HUB_LGA_ALIAS[o.area]||o.area,.3+Math.random()*.4);hubNewReport(o);n++}
 return n;
}
if(hubImportSite())saveModules();
addEventListener('storage',e=>{if(e.key===SITE_REPORTS_KEY&&hubImportSite()){saveModules();try{renderJourney()}catch{}}});

// ---- Fleet map layers ----
const hubColor=r=>r.status==='Cleared'?'#2f9e57':alarmOverdue(r,Date.now())||r.status==='New'?'#eb3424':'#ecb730';
const hubBacklogColor=a=>a.moved?'#2a6dfb':{Critical:'#eb3424',Overdue:'#ecb730','On schedule':'#42c366'}[backlogLevel(a.days)];
function hubMapLayers(){
 if(!ready||!map)return;
 try{
  if(!map.getSource('hub-backlog')){
   map.addSource('hub-backlog',{type:'geojson',data:fc([])});
   map.addLayer({id:'hub-backlog',type:'circle',source:'hub-backlog',layout:{visibility:'none'},paint:{'circle-radius':['interpolate',['linear'],['zoom'],9,22,12,60,14,120],'circle-color':['get','color'],'circle-opacity':.2,'circle-stroke-width':1.5,'circle-stroke-color':['get','color'],'circle-stroke-opacity':.6}},map.getLayer('clusters')?'clusters':undefined);
   map.addLayer({id:'hub-backlog-label',type:'symbol',source:'hub-backlog',layout:{visibility:'none','text-field':['get','label'],'text-size':12,'text-font':['Noto Sans Regular'],'text-anchor':'top','text-offset':[0,2.6],'text-allow-overlap':false},paint:{'text-color':'#262626','text-halo-color':'#ffffff','text-halo-width':1.5}});
  }
  if(!map.getSource('hub-reports')){
   map.addSource('hub-reports',{type:'geojson',data:fc([])});
   map.addLayer({id:'hub-reports-halo',type:'circle',source:'hub-reports',paint:{'circle-radius':15,'circle-color':['get','color'],'circle-opacity':.18}});
   map.addLayer({id:'hub-reports',type:'circle',source:'hub-reports',paint:{'circle-radius':7,'circle-color':['get','color'],'circle-stroke-width':2,'circle-stroke-color':'#ffffff'}});
   map.on('click','hub-reports',e=>{const id=e.features?.[0]?.properties?.id;if(id)hubOpen(id)});
   map.on('mouseenter','hub-reports',()=>{map.getCanvas().style.cursor='pointer'});map.on('mouseleave','hub-reports',()=>{map.getCanvas().style.cursor=''});
  }
  const show=permitted('publicReports')&&hubUI.showReports;
  map.getSource('hub-reports').setData(fc(show?hubVisible().filter(r=>r.status!=='Duplicate'&&r.coord).map(r=>({type:'Feature',geometry:{type:'Point',coordinates:r.coord},properties:{id:r.id,color:hubColor(r)}})):[]));
  map.getSource('hub-backlog').setData(fc(hub.areas.map(a=>({type:'Feature',geometry:{type:'Point',coordinates:hubAreaCenter(a.area)},properties:{color:hubBacklogColor(a),label:a.area+' · '+a.days+' d'}}))));
  const vis=hubUI.showBacklog&&isAuthority()?'visible':'none';map.setLayoutProperty('hub-backlog','visibility',vis);map.setLayoutProperty('hub-backlog-label','visibility',vis);
 }catch(e){/* Map style still loading; the next update adds the layers. */}
}
const hubBaseUpdateMap=updateMap;updateMap=function(){hubBaseUpdateMap();hubMapLayers()};
const hubMapRegion=document.querySelector('.map-region');let hubMapBar=null;
if(hubMapRegion){hubMapBar=document.createElement('div');hubMapBar.className='hub-map-layers';hubMapBar.setAttribute('role','group');hubMapBar.setAttribute('aria-label','Map layers');hubMapRegion.append(hubMapBar);
 const mk=(label,key)=>{const b=document.createElement('button');b.type='button';b.className='mapbtn hub-map-toggle';b.textContent=label;b.setAttribute('aria-pressed',String(hubUI[key]));b.onclick=()=>{hubUI[key]=!hubUI[key];b.setAttribute('aria-pressed',String(hubUI[key]));hubMapLayers()};hubMapBar.append(b);return b};
 mk('Public reports','showReports');mk('Backlog areas','showBacklog');
}
function hubFly(coord,zoom=15){
 closeModal();goJourney('fleet');let tries=0;
 const go=()=>{if(ready&&map){hubMapLayers();map.flyTo({center:coord,zoom,duration:reducedMotion()?0:900});return}if(++tries<40)setTimeout(go,200)};setTimeout(go,60);
}

// ---- Overview: service backlog ----
function hubOperatorRows(){
 const ops={};for(const a of hub.areas){(ops[a.partner] ||= {areas:[],overdue:0,days:0}).areas.push(a.area);ops[a.partner].overdue+=a.overdue;ops[a.partner].days+=a.days}
 return Object.entries(ops).map(([id,o])=>{const open=hub.reports.filter(r=>r.partner===id&&!['Cleared','Duplicate'].includes(r.status)).length;const score=Math.max(40,Math.min(99,Math.round(100-o.days/o.areas.length*6-open*3)));return {id,...o,open,score}}).sort((a,b)=>a.score-b.score);
}
function hubBacklogPanel(){
 const now=Date.now(),overdue=hub.reports.filter(r=>alarmOverdue(r,now)).length,open=hub.reports.filter(r=>!['Cleared','Duplicate'].includes(r.status)).length;
 const areas=[...hub.areas].sort((a,b)=>b.days-a.days);
 return panel('Service backlog','Days since the last confirmed pickup in each area. Three days is overdue; seven is critical.',
  `<div class="hub-backlog">${areas.map(a=>`<button class="hub-area level-${a.moved?'moved':backlogLevel(a.days).toLowerCase().replace(/ /g,'-')}" data-module="hub-area" data-record="${esc(a.area)}"><span class="hub-area-top"><b>${esc(a.area)}</b>${hubLevelPill(a)}</span><strong>${a.days} <small>${a.days===1?'day':'days'}</small></strong><small>${esc(partnerName(a.partner))} · ${a.overdue} overdue stops · ${hub.reports.filter(r=>r.area===a.area&&!['Cleared','Duplicate'].includes(r.status)).length} open alarms</small></button>`).join('')}</div>`+
  `<div class="module-pad hub-backlog-actions">${hubBtn('Move work','moveWork','',true)}${routeButton('Public reports · '+open+' open'+(overdue?' · '+overdue+' not acknowledged':''),'publicReports')}${permitted('fleet')?hubBtn('Show backlog on map','backlogMap'):''}</div>`+
  table(['Collection operator','Areas','Overdue stops','Open alarms','On-time score'],hubOperatorRows().map(o=>[esc(partnerName(o.id)),esc(o.areas.join(', ')),o.overdue,o.open,pill(o.score+'%',o.score<70?'red':o.score<85?'amber':'good')])));
}
const hubOverview=screens.overview;
screens.overview=()=>{const html=hubOverview();if(!isAuthority())return html;const i=html.indexOf('<section class="work-panel">');return i<0?html+hubBacklogPanel():html.slice(0,i)+hubBacklogPanel()+html.slice(i)};

// ---- Facilities: disposal-site queues ----
const hubWait=q=>Math.max(0,Math.round((Date.now()-Date.parse(q.arrived))/60000));
const hubCanGate=()=>isAuthority()||journey.role==='facility';
function hubQueuePanel(){
 return panel('Disposal site queues','Trucks waiting at each gate, travel time from the last pickup, and time from gate to exit. A wait above '+QUEUE_WAIT_LIMIT_MIN+' minutes raises a warning.',`<div class="hub-sites">${hub.sites.map(s=>{
  const q=hub.queue.filter(x=>x.site===s.id).sort((a,b)=>Date.parse(a.arrived)-Date.parse(b.arrived)),waits=q.map(hubWait),on=hub.onsite.filter(x=>x.site===s.id);
  const avg=waits.length?Math.round(waits.reduce((n,w)=>n+w,0)/waits.length):0,longest=waits.length?Math.max(...waits):0,travel=q.length?Math.round(q.reduce((n,x)=>n+x.travel,0)/q.length):0,warn=queueWarning(waits);
  return `<article class="hub-site ${warn?'warn':''}"><header><div><h3>${esc(s.name)}</h3><small>${esc(s.area)}</small></div>${warn?pill('Queue above '+QUEUE_WAIT_LIMIT_MIN+' min','red'):pill('Flowing','good')}</header><div class="hub-metrics"><div><span>Waiting</span><b>${q.length}</b></div><div><span>Average wait</span><b>${avg} min</b></div><div><span>Longest wait</span><b>${longest} min</b></div><div><span>Travel to gate</span><b>${travel} min</b></div><div><span>Gate to exit</span><b>${s.gateToExit} min</b></div><div><span>On site</span><b>${on.length}</b></div></div>`+
  `<h4 class="hub-list-title">In the queue</h4>`+(q.length?`<ul class="hub-queue">${q.map((x,i)=>`<li class="${hubWait(x)>QUEUE_WAIT_LIMIT_MIN?'late':''}"><span><b>${esc(x.truck)}</b><small>${esc(partnerName(x.partner))} · ${x.travel} min from last pickup</small></span><em>${hubWait(x)} min</em>${i===0&&hubCanGate()?hubBtn('Admit','admit',x.id):''}</li>`).join('')}</ul>`:'<p class="hub-empty">No trucks waiting.</p>')+
  (on.length?`<h4 class="hub-list-title">On site</h4><ul class="hub-queue">${on.map(x=>`<li><span><b>${esc(x.truck)}</b><small>Through the gate at ${hubClock(x.gateIn)}</small></span>${hubCanGate()?hubBtn('Record exit','exit',x.truck):''}</li>`).join('')}</ul>`:'')+`</article>`}).join('')}</div>`);
}
const hubFacility=screens.facility;
screens.facility=()=>hubFacility()+hubQueuePanel();

// ---- Markets & businesses ----
const hubCanBill=()=>isAuthority()||journey.role==='finance';
const hubCleanPill=s=>pill(s,{Done:'good',Missed:'red',Scheduled:'amber'}[s]);
screens.commercial=()=>{
 const acc=hub.accounts,c=hub.cleanups,billed=hub.invoices.filter(i=>i.period===HUB_PERIOD);
 return pageHead('MARKETS & BUSINESSES','Scheduled clean-ups. Monthly accounts.','Markets clean between 6:00 and 8:30 AM; businesses have their own windows. Every account is billed monthly.',hubCanBill()?hubBtn('Issue '+HUB_PERIOD+' invoices','invoiceAll','',true):'')+
 stats([['Accounts',acc.length,acc.filter(a=>a.kind==='Market').length+' markets · '+acc.filter(a=>a.kind==='Business').length+' businesses'],['Clean-ups done',acc.filter(a=>c[a.id]?.status==='Done').length,'Today'],['Missed',acc.filter(a=>c[a.id]?.status==='Missed').length,'Window closed without a crew record'],['Monthly billing',cash(acc.reduce((n,a)=>n+a.monthly,0)),HUB_PERIOD]])+
 panel('Today’s clean-ups','A clean-up needs a crew record before its window closes; a missed one opens a public report.',table(['Account','Window','Operator','Status',''],acc.map(a=>{const s=c[a.id]||{status:'Scheduled'};return [`<b>${esc(a.name)}</b><small class="cell-sub">${esc(a.kind)} · ${esc(a.area)}</small>`,esc(a.window)+'<small class="cell-sub">'+esc(a.days)+'</small>',esc(partnerName(a.partner)),hubCleanPill(s.status)+(s.time?'<small class="cell-sub">'+esc(s.time)+' · '+esc(s.crew||'')+'</small>':''),s.status!=='Done'&&(isAuthority()||journey.role==='care')?hubBtn(s.status==='Missed'?'Record late clean-up':'Record clean-up','cleanDone',a.id)+(s.status==='Scheduled'?hubBtn('Mark missed','cleanMissed',a.id):''):'']})))+
 panel('Monthly accounts','One invoice per account per month, sent to the market association or business.',table(['Account','Monthly fee',HUB_PERIOD,''],acc.map(a=>{const inv=billed.find(i=>i.account===a.id);return [`<b>${esc(a.name)}</b><small class="cell-sub">${esc(a.id)}</small>`,cash(a.monthly),inv?pill(esc(inv.status),inv.status==='Paid'?'good':'amber'):'<span class="cell-sub">Not issued</span>',inv&&inv.status!=='Paid'&&hubCanBill()?hubBtn('Record payment','paid',inv.id):'']})));
};
function hubCommercialInvoices(){
 return panel('Market and business accounts','Monthly invoices, kept separate from household bills.',hub.invoices.length?table(['Invoice','Account','Period','Amount','Status'],hub.invoices.map(i=>[esc(i.id),esc(hub.accounts.find(a=>a.id===i.account)?.name||i.account),esc(i.period),cash(i.amount),pill(esc(i.status),i.status==='Paid'?'good':'amber')])):empty('No commercial invoices','Issue the month’s invoices from Markets & businesses.'))+`<div class="module-pad">${routeButton('Open Markets & businesses','commercial')}</div>`;
}
const hubFinance=screens.finance;screens.finance=()=>hubFinance()+hubCommercialInvoices();

// ---- Administration: resident channels ----
function hubChannelsPanel(){
 return panel('Resident channels','How Lagosians without a smartphone reach LAWMA. Every report lands in Public reports.',`<div class="hub-channels"><article class="hub-ussd" aria-label="USSD menu"><span class="hub-tag">USSD</span><pre>LAWMA SmartWaste
1. Report waste or a blocked drain
2. Check my next pickup
3. Pay my monthly bill
4. Speak to an agent
0. Èdè Yorùbá / Pidgin</pre><small>Works on any phone. Short code assigned at launch.</small></article>`+
 `<article class="hub-wa" aria-label="WhatsApp conversation"><span class="hub-tag">WhatsApp</span><div class="hub-bubble in">Refuse don block the gutter for Ladipo, near the bus stop. 📍 Location shared · 📷 Photo</div><div class="hub-bubble out">Thank you. Report PUB-008 don land. LAWMA go update you here.</div><div class="hub-bubble out">A crew don reach the place now.</div><small>LAWMA WhatsApp Business number confirmed at launch.</small></article>`+
 `<article class="hub-langs"><span class="hub-tag">Languages</span>${['English','Yorùbá','Nigerian Pidgin'].map(l=>`<p><b>${l}</b><span>Menus, replies and status updates</span></p>`).join('')}<div class="hub-channel-counts">${['App','WhatsApp','USSD'].map(ch=>`<p><b>${ch}</b><span>${hub.reports.filter(r=>r.channel===ch).length} reports · replies by ${alarmChannelRoute(ch).replace(' message','').replace(' notification',' notification')}</span></p>`).join('')}</div></article></div>`);
}
const hubSystems=screens.systems;screens.systems=()=>hubSystems()+hubChannelsPanel();
function hubCarePanel(){
 const rows=['App','WhatsApp','USSD','Phone call','Field officer'].map(ch=>{const list=hub.reports.filter(r=>r.channel===ch),acked=list.filter(r=>r.ack),mins=acked.map(r=>(Date.parse(r.ack)-Date.parse(r.raised))/60000);return [ch,list.length,list.filter(r=>!['Cleared','Duplicate'].includes(r.status)).length,mins.length?Math.round(mins.reduce((n,m)=>n+m,0)/mins.length)+' min':'—']}).filter(r=>r[1]);
 return panel('Public reports by channel','Volume and average time to acknowledge.',table(['Channel','Reports','Open','Time to acknowledge'],rows))+`<div class="module-pad">${routeButton('Open public reports','publicReports')}</div>`;
}

// ---- Scenarios ----
const hubScenarios=screens.scenarios;
screens.scenarios=()=>hubScenarios().replace('<div class="scenario-grid">','<div class="scenario-grid">'+[
 ['Public dump alarm','A resident reports a blocked drain on WhatsApp. Acknowledge, assign, clear and update the reporter.','Receive the report','receive'],
 ['Disposal site queue','Trucks pile up at the Olusosun gate until the wait passes '+QUEUE_WAIT_LIMIT_MIN+' minutes.','Build the queue','queueBuild'],
 ['Service backlog','See days since the last pickup by area, then move overdue work to another operator.','Open the backlog','goBacklog']
].map(([t,d,l,c])=>`<section class="work-panel"><header><h2>${t}</h2><p>${d}</p></header><div class="module-pad">${hubBtn(l,c,'',true)}</div></section>`).join(''));

// ---- Rendering hooks ----
const hubRender=renderJourney;
renderJourney=function(){
 hubRender();
 if($('hubStatus'))$('hubStatus').onchange=e=>{hubUI.status=e.target.value;renderJourney();$('hubStatus').focus()};
 if($('hubChannel'))$('hubChannel').onchange=e=>{hubUI.channel=e.target.value;renderJourney();$('hubChannel').focus()};
 if(journey.page==='care'&&!journeyMain.querySelector('.hub-care')){const s=document.createElement('div');s.className='hub-care';s.innerHTML=hubCarePanel();const foot=journeyMain.querySelector('.journey-footer');foot?foot.before(s):journeyMain.append(s);s.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>goJourney(b.dataset.go))}
 hubMapLayers();
};

// ---- Actions ----
const hubRun=runModule;
runModule=function(cmd,id){
 if(!cmd.startsWith('hub-')){hubRun(cmd,id);return}
 const a=cmd.slice(4),r=hub.reports.find(x=>x.id===id);
 if(a==='report'){hubOpen(id);return}
 if(a==='ack'&&r){const err=hubMove(r,'Acknowledged','Acknowledged by '+journeyRoles[journey.role][0]);if(err){toast(err);return}r.ack=simNow();saveModules();renderJourney();hubOpen(id);toast(r.id+' acknowledged. The reporter has been told.');return}
 if(a==='dup'&&r){const others=hub.reports.filter(x=>x.id!==r.id&&!['Duplicate'].includes(x.status));openForm('Mark '+r.id+' as duplicate','The reporter will follow the original report instead.',[field('of','Original report',{options:others.map(x=>({value:x.id,label:x.id+' · '+x.place})),value:others.find(x=>x.area===r.area)?.id})],'Mark as duplicate',d=>{r.duplicateOf=d.of;return hubMove(r,'Duplicate','Marked as duplicate of '+d.of)});return}
 if(a==='assign'&&r){openForm('Assign '+r.id,r.type+' · '+r.place,[field('partner','Collection operator',{options:partnerOptions(p=>p.service==='Collection'&&p.status==='Active'),value:hubOperator(r.area)}),field('priority','Clear within',{options:['Same shift','4 hours','24 hours'],value:r.size==='Large'?'4 hours':'24 hours'})],'Assign operator',d=>{r.partner=d.partner;r.operatorName=partnerName(d.partner);r.priority=d.priority;const err=hubMove(r,'Assigned','Assigned to '+r.operatorName+' · clear within '+d.priority);if(err)return err;simNotice('Public report assigned',r.id+' · '+r.place+' · clear within '+d.priority,'publicReports');sim.notices[0].partner=d.partner;hubReopen(r.id)});return}
 if(a==='onsite'&&r){if(!hubCanField(r)){toast('Switch to the assigned operator to update this report.');return}openForm('Crew on site · '+r.id,r.place,[textField('crew','Crew lead',modules.personnel.find(p=>p.partner===r.partner)?.name||'Crew lead')],'Confirm crew on site',d=>{r.crew=d.crew;const err=hubMove(r,'Crew on site','Crew on site · '+d.crew);if(err)return err;hubReopen(r.id)});return}
 if(a==='clear'&&r){if(!hubCanField(r)){toast('Switch to the assigned operator to update this report.');return}openForm('Mark '+r.id+' cleared','The reporter receives the photo of the cleared spot.',[field('photo','Photo of the cleared spot attached',{type:'checkbox'}),field('volume','Estimated waste removed (tonnes)',{type:'number',min:.1,max:50,step:.1,value:r.size==='Large'?3.5:1.2})],'Mark cleared',d=>{if(!d.photo)return'Attach a photo of the cleared spot first.';r.cleared=simNow();r.clearedTime=hubClock(r.cleared);r.volume=+d.volume;const err=hubMove(r,'Cleared','Cleared · '+d.volume+' t removed · photo attached');if(err)return err;simNotice('Public report cleared',r.id+' · '+r.place,'publicReports');hubReopen(r.id)});return}
 if(a==='refer'&&r){const c={id:moduleID('ENF',sim.cases),site:r.area+' · '+r.place,stage:'Unverified flag',finding:'Public report '+r.id+': '+r.type.toLowerCase()+' at '+r.place+'. Offender not yet identified.',amount:null,notes:[]};sim.cases.unshift(c);r.caseId=c.id;r.events.push({text:'Referred to Enforcement as '+c.id,time:simNow()});simNotice('Public report referred',c.id+' · '+r.place,'enforcement','Warning');recordModuleAction(r.id+' referred to Enforcement as '+c.id);saveModules();renderJourney();hubOpen(r.id);toast(r.id+' referred to Enforcement as '+c.id+'.');return}
 if(a==='map'&&r){hubUI.showReports=true;hubFly(r.coord);return}
 if(a==='mapAll'){hubUI.showReports=true;hubFly([3.36,6.53],11);return}
 if(a==='backlogMap'){hubUI.showBacklog=true;document.querySelectorAll('.hub-map-toggle').forEach(b=>{if(b.textContent==='Backlog areas')b.setAttribute('aria-pressed','true')});hubFly([3.33,6.53],10.6);return}
 if(a==='log'){openForm('Log a public report','For reports received by phone or from a field officer.',[field('type','Type',{options:['Illegal dump','Overflowing public bin','Blocked drain','Market waste']}),field('area','Area',{options:hub.areas.map(a=>a.area)}),textField('place','Street or landmark'),field('channel','Received by',{options:['Phone call','Field officer','WhatsApp','USSD','App']}),field('lang','Language',{options:['English','Yoruba','Pidgin']}),field('size','Size',{options:['Small','Medium','Large'],value:'Medium'})],'Log report',d=>{if(d.place.length<4)return'Describe the street or landmark.';const n=hubNewReport({...d,reporter:d.channel==='Field officer'?'LAWMA field officer':'Caller'});hubReopen(n.id)});return}
 if(a==='receive'){const n=hubNewReport({type:'Blocked drain',area:'Mushin',place:'Ladipo Street drain, near the bus stop',channel:'WhatsApp',lang:'Pidgin',reporter:'Resident · 0814 ••• 7701',size:'Medium',photo:'drain'});saveModules();goJourney('publicReports');hubOpen(n.id);toast(n.id+' arrived on WhatsApp.');return}
 if(a==='goBacklog'){goJourney('overview');setTimeout(()=>journeyMain.querySelector('.hub-backlog')?.scrollIntoView({block:'start',behavior:reducedMotion()?'auto':'smooth'}),80);return}
 if(a==='area'){const ar=hub.areas.find(x=>x.area===id);if(!ar)return;const list=hub.reports.filter(r=>r.area===ar.area&&!['Cleared','Duplicate'].includes(r.status));drawer(ar.area+' backlog',rowKV('Days since last pickup',ar.days)+rowKV('Level',backlogLevel(ar.days))+rowKV('Overdue stops',ar.overdue)+rowKV('Collection operator',esc(partnerName(ar.partner)))+(ar.moved?rowKV('Moved from',esc(partnerName(ar.moved.from))+' · '+stamp(ar.moved.time)):'')+`<div class="drawer-actions">${isAuthority()&&ar.overdue?hubBtn('Move work','moveWork',ar.area,true):''}${permitted('fleet')?hubBtn('View on map','areaMap',ar.area):''}</div>`+'<h3>Open alarms</h3>'+(list.length?table(['Report','Status',''],list.map(r=>[`${r.id}<small class="cell-sub">${esc(r.place)}</small>`,hubPill(r),link('Open','hub-report',r.id)])):'<p>No open alarms in this area.</p>'));return}
 if(a==='areaMap'){hubUI.showBacklog=true;hubFly(hubAreaCenter(id),12.5);return}
 if(a==='moveWork'){
  if(!isAuthority())return;const late=hub.areas.filter(x=>x.overdue>0);if(!late.length){toast('No area has overdue work.');return}
  const pick=late.find(x=>x.area===id)||[...late].sort((x,y)=>y.days-x.days)[0];
  openForm('Move overdue work','Reassign an area’s overdue stops and open alarms to another collection operator.',[field('area','Area',{options:late.map(x=>({value:x.area,label:x.area+' · '+x.days+' days · '+x.overdue+' stops'})),value:pick.area}),field('to','New operator',{options:partnerOptions(p=>p.service==='Collection'&&p.status==='Active'&&p.id!==pick.partner)}),field('window','Catch-up window',{options:['24 hours','48 hours','72 hours'],value:'48 hours'})],'Move work',d=>{
   const ar=hub.areas.find(x=>x.area===d.area);if(!ar)return'Choose an area.';if(ar.partner===d.to)return'Choose a different operator from the current one.';
   const from=ar.partner;ar.moved={from,time:simNow(),window:d.window};ar.partner=d.to;
   hub.reports.filter(r=>r.area===ar.area&&r.partner===from&&['Assigned','Crew on site'].includes(r.status)).forEach(r=>{r.partner=d.to;r.operatorName=partnerName(d.to);r.events.push({text:'Moved to '+r.operatorName,time:simNow()})});
   hub.moves.unshift({area:ar.area,from,to:d.to,time:simNow(),stops:ar.overdue});
   simNotice('Area work moved to you',ar.area+' · '+ar.overdue+' overdue stops · catch-up within '+d.window,'publicReports');sim.notices[0].partner=d.to;
   recordModuleAction(ar.area+' overdue work moved from '+partnerName(from)+' to '+partnerName(d.to));
  });
  const sel=$('mf-area');if(sel)sel.onchange=e=>{const ar=hub.areas.find(x=>x.area===e.target.value);$('mf-to').innerHTML=selectOptions(partnerOptions(p=>p.service==='Collection'&&p.status==='Active'&&p.id!==ar.partner))};return;
 }
 if(a==='admit'){if(!hubCanGate())return;const q=hub.queue.find(x=>x.id===id);if(!q)return;hub.queue=hub.queue.filter(x=>x!==q);hub.onsite.push({truck:q.truck,partner:q.partner,site:q.site,gateIn:simNow()});saveAndRender(q.truck+' admitted after '+hubWait(q)+' min in the queue.');recordModuleAction(q.truck+' admitted at '+hub.sites.find(s=>s.id===q.site).name);return}
 if(a==='exit'){if(!hubCanGate())return;const o=hub.onsite.find(x=>x.truck===id);if(!o)return;const s=hub.sites.find(x=>x.id===o.site),mins=Math.max(1,Math.round((Date.now()-Date.parse(o.gateIn))/60000));s.gateToExit=Math.round((s.gateToExit*s.exits+mins)/(s.exits+1));s.exits++;hub.onsite=hub.onsite.filter(x=>x!==o);saveAndRender(o.truck+' left '+s.name+' after '+mins+' min on site.');recordModuleAction(o.truck+' exited '+s.name);return}
 if(a==='queueBuild'){
  const base=hub.queue.length+hub.onsite.length+20;
  [58,51,47].forEach((m,i)=>{const v=fleet[(base*13+i*29)%fleet.length];hub.queue.unshift({id:moduleID('Q',hub.queue),site:'DS-OLU',truck:v.code,partner:v.partnerId,arrived:hubMinutesAgo(m),travel:50+i*6})});
  simNotice('Olusosun queue above '+QUEUE_WAIT_LIMIT_MIN+' minutes','Longest wait '+Math.max(...hub.queue.filter(q=>q.site==='DS-OLU').map(hubWait))+' min · '+hub.queue.filter(q=>q.site==='DS-OLU').length+' trucks waiting','facility','Warning');
  recordModuleAction('Olusosun queue warning raised');saveModules();goJourney('facility');setTimeout(()=>journeyMain.querySelector('.hub-sites')?.scrollIntoView({block:'start',behavior:reducedMotion()?'auto':'smooth'}),80);toast('Olusosun wait is above '+QUEUE_WAIT_LIMIT_MIN+' minutes.');return;
 }
 if(a==='cleanDone'){const acc=hub.accounts.find(x=>x.id===id);if(!acc)return;openForm('Record clean-up · '+acc.name,acc.window+' · '+partnerName(acc.partner),[textField('crew','Crew lead',modules.personnel.find(p=>p.partner===acc.partner)?.name||'Crew lead'),field('evidence','Photo of the cleaned area attached',{type:'checkbox'})],'Record clean-up',d=>{if(!d.evidence)return'Attach a photo of the cleaned area first.';hub.cleanups[acc.id]={status:'Done',time:hubClock(simNow()),crew:d.crew};recordModuleAction(acc.name+' clean-up recorded')});return}
 if(a==='cleanMissed'){const acc=hub.accounts.find(x=>x.id===id);if(!acc)return;hub.cleanups[acc.id]={status:'Missed',time:null,crew:null};const n=hubNewReport({type:'Market waste',area:acc.area,place:acc.name,channel:'Field officer',reporter:'LAWMA field officer',size:'Large'});saveAndRender(acc.name+' marked missed. '+n.id+' opened in Public reports.');return}
 if(a==='invoiceAll'){if(!hubCanBill())return;const todo=hub.accounts.filter(acc=>!hub.invoices.some(i=>i.account===acc.id&&i.period===HUB_PERIOD));if(!todo.length){toast(HUB_PERIOD+' invoices are already issued.');return}todo.forEach(acc=>hub.invoices.push({id:moduleID('COM',hub.invoices),...monthlyInvoice(acc,HUB_PERIOD),status:'Outstanding'}));recordModuleAction(todo.length+' monthly commercial invoices issued for '+HUB_PERIOD);saveAndRender(todo.length+' monthly invoices issued for '+HUB_PERIOD+'.');return}
 if(a==='paid'){if(!hubCanBill())return;const inv=hub.invoices.find(i=>i.id===id);if(!inv)return;inv.status='Paid';recordModuleAction(inv.id+' payment recorded');saveAndRender(inv.id+' marked paid.');return}
};

// ---- Partner remittances, customer pickups, facility weights ----
// Mirrors the partner workspace: weekly remittances split 80/20, the customer pickups behind them, and weighbridge intake for partner loads.
const hubCanRemit=()=>isAuthority()||journey.role==='finance';
const hubRemVisible=()=>hub.settlements.filter(s=>!isPartnerRole()||s.partner===modules.partnerContext);
const hubPUVisible=()=>hub.pickups.filter(p=>!isPartnerRole()||p.partner===modules.partnerContext);
const hubPickupPill=p=>pill(p.status,p.status==='Completed'?'good':['Declined','Cancelled'].includes(p.status)?'red':'amber');
const hubDueRows=()=>{const out=[];for(const p of hubPUVisible()){if(p.status!=='Completed')continue;let r=out.find(x=>x.partner===p.partner);if(!r){r={partner:p.partner,earnings:0,unremitted:[]};out.push(r)}r.earnings+=p.fee;if(!hub.settlements.some(s=>s.partner===p.partner&&(s.pickups||[]).includes(p.id)))r.unremitted.push(p)}return out};
const hubWeightTrips=()=>Object.entries(modules.tlsStores||{}).flatMap(([fac,st])=>st.trips.map(t=>({...t,facility:fac}))).filter(t=>!isPartnerRole()||t.partner===modules.partnerContext);
const hubFacilityName=fac=>modules.facilities.find(f=>f.id===fac)?.name||fac;
const hubRemAccess=['management','finance','admin'];
for(const r of hubRemAccess)if(personaPages[r]){if(!personaPages[r].includes('remittances'))personaPages[r].push('remittances');if(!personaPages[r].includes('partners'))personaPages[r].push('partners')}
defs.insertAdjacentHTML('beforeend','<symbol id="i-naira" viewBox="0 0 24 24"><path d="M7 18V8l10 10V8M5 11h14M5 14h14"/></symbol>');
const hubRemContext=changePartnerContext;changePartnerContext=function(id){hubRemContext(id);if(journey.role==='partner'&&currentPartner().service==='Collection'&&!personaPages.partner.includes('remittances'))personaPages.partner.push('remittances')};

// Weighbridge records live with the TLS; seed two cleared loads and one awaiting unload so the weights panel opens on real records.
function hubSeedWeights(){
 if(!modules.tlsStores||!modules.tlsStores['FAC-001']||modules.hub.weightsSeeded||tls.trips.length)return;
 modules.hub.weightsSeeded=true;
 const load=(truck,driver,partner,route,state,net,mins)=>{
  const t={id:tlsID('TRP'),order:null,truck,driver,partner,route,state,events:[],arrived:hubMinutesAgo(mins)};
  tlsEvents(t).push({text:state==='Weighed'?'Gross and tare recorded · awaiting unload confirmation':'Load received · unload confirmed',time:hubMinutesAgo(Math.max(1,mins-6)),actor:'Facility supervisor'});
  if(net){t.net=net;tlsPost(t.id,net,'Received','Trip '+t.id)}
  tls.trips.push(t);
 };
 load('LND 221 KJA','Bashir A.',hubOperator('Ikeja'),'Ikeja · PSP route 06','Unloaded',4200,95);
 load('LND 017 YB','Grace I.',hubOperator('Lekki'),'Lekki · PSP route 11','Unloaded',2650,70);
 load('LND 884 XQ','Rasheed T.',hubOperator('Ikeja'),'Ikeja · Olowu street run','Weighed',3100,25);
 saveModules();
}
hubSeedWeights();

function hubRemittancePanel(){
 const due=hubDueRows().filter(x=>x.unremitted.length);
 return panel('Remittances','Money each partner remits from its workspace. Confirming a remittance posts the authority share to revenue.',table(['Remittance','Partner','Sent','Gross','Partner 80%','Authority 20%','Status',''],hubRemVisible().map(s=>[`<b>${esc(s.id)}</b><small class="cell-sub">${s.pickups&&s.pickups.length?esc(s.pickups.join(' · ')):'Weekly remittance'}</small>`,esc(partnerName(s.partner)),hubAge(s.date)+' ago',cash(s.gross),cash(s.partnerShare),cash(s.authorityShare),pill(s.status,s.status==='Reconciled'?'good':'amber'),s.status==='Awaiting confirmation'&&hubCanRemit()?hubBtn('Confirm','rem-confirm',s.id,true):'']))+
 (due.length?`<h4 class="hub-list-title">Not yet remitted</h4>`+table(['Partner','Completed pickups','Earnings','Deadline'],due.map(x=>[esc(partnerName(x.partner)),x.unremitted.length,cash(x.unremitted.reduce((n,p)=>n+p.fee,0)),`<small class="cell-sub">Due by ${REMITTANCE_DEADLINE}</small>`])):''));
}
function hubPickupPanel(){
 const rows=hubPUVisible().slice().sort((a,b)=>Date.parse(b.raised)-Date.parse(a.raised));
 return panel('Customer pickups','Booked in the customer workspace and carried out by partner crews. A completed pickup with evidence adds to the partner’s remittable earnings.',table(['Pickup','Customer','Window','Crew','Fee','Status',''],rows.map(p=>[`<b>${esc(p.id)}</b><small class="cell-sub">${esc(p.address)} · ${esc(p.area)}</small>`,esc(p.customer),esc(p.window),p.crew?esc(p.crew):'<span class="cell-sub">Not assigned</span>',cash(p.fee),hubPickupPill(p),hubBtn('Open','pu-open',p.id)])));
}
function hubWeightPanel(){
 const trips=hubWeightTrips().sort((a,b)=>Date.parse(b.arrived)-Date.parse(a.arrived));
 return panel('Facility weights','Weighbridge intake for partner loads at the transfer loading station. A load is only complete with a weight and an unload confirmation.',(trips.length?table(['Weight ticket','Truck','Partner','Facility','Net intake','Stage',''],trips.map(t=>[`<b>${esc(t.id)}</b><small class="cell-sub">${esc(t.order||'Manual arrival')}</small>`,esc(t.truck),esc(partnerName(t.partner)),esc(hubFacilityName(t.facility)),t.net?tonnes(t.net):'<span class="cell-sub">Awaiting scale</span>',status(t.state),hubBtn('Open','wgt-open',t.id)])):empty('No loads at the facility yet','Partner trucks appear here when the facility registers their arrival.'))+`<div class="module-pad">${routeButton('Open TLS operations','facility')}</div>`);
}
screens.remittances=()=>{
 const rows=hubRemVisible(),awaiting=rows.filter(s=>s.status==='Awaiting confirmation'),reconciled=rows.filter(s=>s.status==='Reconciled');
 const dueRows=hubDueRows().filter(x=>x.unremitted.length),due=dueRows.reduce((n,x)=>n+x.unremitted.reduce((m,p)=>m+p.fee,0),0);
 const kg=hubWeightTrips().filter(t=>t.net).reduce((n,t)=>n+t.net,0);
 return pageHead('PARTNER REMITTANCES','Money, pickups and weights from partner workspaces.','Remittances arrive weekly with an 80/20 split, backed by completed customer pickups and weighbridge intake at the facility.','')+
 stats([['Remitted',cash(reconciled.reduce((n,s)=>n+s.gross,0)),reconciled.length+' remittance'+(reconciled.length===1?'':'s')+' · authority share '+cash(reconciled.reduce((n,s)=>n+s.authorityShare,0))],
 ['Awaiting confirmation',cash(awaiting.reduce((n,s)=>n+s.gross,0)),awaiting.length?'Confirm to post the authority share to revenue':'Nothing waiting'],
 ['Due by '+REMITTANCE_DEADLINE,cash(due),dueRows.length?dueRows.length+' partner'+(dueRows.length===1?'':'s')+' with completed pickups not yet remitted':'Every completed pickup is covered by a remittance'],
 ['Facility intake today',kg?tonnes(kg):'0 t','Weighbridge records at the transfer loading station']])+
 hubRemittancePanel()+hubPickupPanel()+hubWeightPanel()+note('Records arrive from each partner workspace. Batches are shared until the live connection is switched on.');
};
// Partner operations share one menu; legacy remittance links still reach the same records.
ui.partnerTab='directory';
const hubWorkNavAt=journeyNav.findIndex(([id])=>id==='partnerWork');if(hubWorkNavAt>=0)journeyNav.splice(hubWorkNavAt,1);
const hubPartnerTabs=()=>[['directory','Directory'],...(permitted('partnerWork')?[['partnerWork','Work orders']]:[]),...(permitted('remittances')?[['remittances','Remittances']]:[]),['pickups','Customer pickups'],['weights','Facility weights']];
const hubPartnerDirectory=screens.partners,hubPartnerOrganisation=screens.partner;
function hubPartnerWorkspace(base){
 const tabs=hubPartnerTabs();
 if(!tabs.some(([id])=>id===ui.partnerTab))ui.partnerTab='directory';
 const controls='<div class="module-toolbar" role="tablist" aria-label="Partner operations">'+tabs.map(([id,label])=>'<button type="button" class="btn '+(ui.partnerTab===id?'primary':'')+'" role="tab" aria-selected="'+(ui.partnerTab===id)+'" data-module="hub-partner-tab" data-record="'+id+'">'+label+'</button>').join('')+'</div>';
 const content=ui.partnerTab==='directory'?base():ui.partnerTab==='partnerWork'?screens.partnerWork():pageHead('PARTNER OPERATIONS',tabs.find(([id])=>id===ui.partnerTab)?.[1]||'Partners','', '')+(ui.partnerTab==='remittances'?hubRemittancePanel():ui.partnerTab==='pickups'?hubPickupPanel():hubWeightPanel());
 return controls+content;
}
screens.partners=()=>hubPartnerWorkspace(hubPartnerDirectory);
screens.partner=()=>hubPartnerWorkspace(hubPartnerOrganisation);
const hubPartnerGo=goJourney;
goJourney=function(page){if(['remittances','partnerWork'].includes(page)){if(!permitted(page))return;ui.partnerTab=page;page=isPartnerRole()?'partner':'partners'}hubPartnerGo(page)};
if(['remittances','partnerWork'].includes(journey.page)){ui.partnerTab=journey.page;journey.page=isPartnerRole()?'partner':'partners'}
const hubRemScenarios=screens.scenarios;
screens.scenarios=()=>hubRemScenarios().replace('<div class="scenario-grid">','<div class="scenario-grid">'+[
 ['Partner remittance','A partner remits the week’s earnings. Confirm the remittance and post the authority share to revenue.','Open remittances','rem-goto']
].map(([t,d,l,c])=>`<section class="work-panel"><header><h2>${t}</h2><p>${d}</p></header><div class="module-pad">${hubBtn(l,c,'',true)}</div></section>`).join(''));

const hubRemRun=runModule;
runModule=function(cmd,id){
 if(cmd==='hub-partner-tab'){if(!hubPartnerTabs().some(([tab])=>tab===id))return;ui.partnerTab=id;goJourney(isPartnerRole()?'partner':'partners');return}
 if(cmd.startsWith('hub-rem-'))cmd='rem-'+cmd.slice(8);
 if(!cmd.startsWith('rem-')&&!cmd.startsWith('pu-')&&!cmd.startsWith('wgt-')){hubRemRun(cmd,id);return}
 if(cmd.startsWith('pu-')){
  const p=hub.pickups.find(x=>x.id===id);if(!p)return;
  drawer(p.id+' · '+esc(p.customer),rowKV('Partner',esc(partnerName(p.partner)))+rowKV('Customer',esc(p.customer))+rowKV('Address',esc(p.address+' · '+p.area))+rowKV('Window',esc(p.window))+(p.crew?rowKV('Crew',esc(p.crew)):'')+rowKV('Fee',cash(p.fee))+rowKV('Status',status(p.status))+(p.evidence?rowKV('Evidence',esc(p.evidence)):'')+(p.issue?rowKV('Customer issue',esc(p.issue)):'')+(p.history&&p.history.length?'<h3>Pickup history</h3><ol class="module-timeline">'+p.history.map(h=>`<li>${esc(h.note||h.status)}<small>${esc(h.status)}</small></li>`).join('')+'</ol>':''));
  return;
 }
 if(cmd.startsWith('wgt-')){
  const t=hubWeightTrips().find(x=>x.id===id);if(!t)return;
  drawer(t.id+' · '+esc(t.truck),rowKV('Partner',esc(partnerName(t.partner)))+rowKV('Facility',esc(hubFacilityName(t.facility)))+(t.driver?rowKV('Driver',esc(t.driver)):'')+(t.route?rowKV('Route',esc(t.route)):'')+rowKV('Stage',status(t.state))+(t.net?rowKV('Net intake',tonnes(t.net)):'')+rowKV('Linked service',t.order?esc(t.order):'Manual arrival')+`<div class="drawer-actions">${routeButton('Open TLS operations','facility')}</div>`+(t.events&&t.events.length?'<h3>Weight history</h3><ol class="module-timeline">'+t.events.map(e=>`<li>${esc(e.text)}<small>${stamp(e.time)}</small></li>`).join('')+'</ol>':''));
  return;
 }
 const a=cmd.slice(4);
 if(a==='goto'){goJourney('remittances');return}
 if(a==='confirm'){
  if(!hubCanRemit()){toast('Only the finance team or an authority supervisor can confirm a remittance.');return}
  const s=hub.settlements.find(x=>x.id===id);if(!s||s.status!=='Awaiting confirmation'){toast('This remittance is already confirmed.');return}
  s.status='Reconciled';simNotice('Remittance confirmed',s.id+' · '+cash(s.authorityShare)+' authority share posted to revenue','remittances');recordModuleAction(s.id+' confirmed · '+cash(s.authorityShare)+' posted to revenue');
  saveAndRender(s.id+' confirmed. '+cash(s.authorityShare)+' posted to revenue.');return;
 }
 if(a==='confirmAll'){
  if(!hubCanRemit()){toast('Only the finance team or an authority supervisor can confirm a remittance.');return}
  const todo=hubRemVisible().filter(s=>s.status==='Awaiting confirmation');
  if(!todo.length){toast('Every remittance is already confirmed.');return}
  todo.forEach(s=>s.status='Reconciled');simNotice('Remittances confirmed',todo.length+' remittance'+(todo.length===1?'':'s')+' · '+cash(todo.reduce((n,s)=>n+s.authorityShare,0))+' posted to revenue','remittances');recordModuleAction(todo.length+' partner remittance'+(todo.length===1?'':'s')+' confirmed');
  saveAndRender(todo.length+' remittance'+(todo.length===1?'':'s')+' confirmed.');return;
 }
 hubRemRun(cmd,id);
};
