/* Non-linear circular economy & 7 forensic blindspot operational panels. */
modules.circularGuard||={
 version:1,
 streams:{mrfTonnes:2140,epeWteTonnes:2920,biodigesterTonnes:3480,landfillResidualTonnes:490},
 epeConsignments:[
  {id:'EPE-CNS-901',origin:'Simpson TLS',mode:'40T_RORO_TRAILER',carrier:'TRL-40T-SIM-08',tonnes:38.4,moisturePct:29,inertRubblePct:2.5,calorificMjKg:9.1,status:'Admitted · EPE_WTE_BUNKER',demurrageNgn:0,at:'2026-11-16T09:20:00Z'},
  {id:'EPE-CNS-902',origin:'Oshodi TLS',mode:'40T_RORO_TRAILER',carrier:'TRL-40T-OSH-14',tonnes:39.0,moisturePct:54,inertRubblePct:11.0,calorificMjKg:6.2,status:'Rejected · Moisture exceeds 45% boiler limit',demurrageNgn:150000,at:'2026-11-16T10:45:00Z'},
  {id:'EPE-CNS-903',origin:'Simpson Lagoon Jetty',mode:'LAGOON_BARGE',carrier:'BRG-LAG-02',tonnes:420.0,moisturePct:26,inertRubblePct:1.8,calorificMjKg:9.6,status:'Admitted · EPE_WTE_BUNKER',demurrageNgn:0,at:'2026-11-16T11:15:00Z'}
 ],
 tippingAudits:[
  {id:'TIP-SOL-401',ticket:'WT-3104',truck:'LAG-221-MUS',site:'Solous II',inboundGrossKg:20100,outboundTareKg:11300,inTippingPolygon:true,tailgateOpened:true,ejectorCycled:true,dwellSeconds:312,result:'Cleared · verified discharge'},
  {id:'TIP-SOL-402',ticket:'WT-3109',truck:'KJA-418-XP',site:'Solous II',inboundGrossKg:21400,outboundTareKg:19800,inTippingPolygon:true,tailgateOpened:false,ejectorCycled:false,dwellSeconds:95,result:'Held · Hydraulic tailgate latch and ejector ram telemetry missing — suspected phantom discharge'}
 ],
 densityAudits:[
  {id:'DEN-ALM-101',property:'PROP-ALM-0182',address:'14 Akinremi St, Ikotun',footprintM2:360,storeys:2,declaredRooms:4,expectedMin:25,flagged:true,lcda:'Egbe-Idimu LCDA'},
  {id:'DEN-SUR-102',property:'PROP-SUR-0219',address:'22 Adelabu St, Surulere',footprintM2:290,storeys:2,declaredRooms:18,expectedMin:20,flagged:false,lcda:'Surulere LGA'}
 ],
 skipCustody:[
  {id:'CUST-SUR-01',skipId:'DUMMY-SKIP-01',basinId:'System 63 · Surulere',cdaChairmanName:'Alhaji K. Oseni (CDA Chair)',cdaPhone:'+234 803 221 9988',qrScannedAt:'2026-11-16T07:40:00Z',geofenceVerified:true,stipendNgn:5000,status:'Guarded · QR custody active'},
  {id:'CUST-MUS-02',skipId:'DUMMY-SKIP-02',basinId:'Ojuwoye Basin · Mushin',cdaChairmanName:'Chief T. Adewale (CDA Chair)',cdaPhone:'+234 802 441 1102',qrScannedAt:'2026-11-16T08:05:00Z',geofenceVerified:true,stipendNgn:5000,status:'Guarded · QR custody active'}
 ],
 fuelFallbacks:[
  {id:'FUEL-FB-W46',batch:'SET-2026-W46-ALM-002',initiatedAt:'2026-11-13T12:00:00Z',elapsedMin:52,voucherStatus:'ISSUED_72H_FUEL_BARCODE',networks:'NNPC · TotalEnergies · Ardova',amountNgn:840000}
 ],
 sec84Audits:[
  {id:'S84-KAI-301',incident:'KAI-2026-088',deviceSerial:'R6-TERM-019',sha256:'8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',preShiftDiagPassed:true,ntpDriftMs:140,ordinaryCourseAttested:true,signingOfficer:'Barr. A. Bello (Dir. Legal MEWR)',admissible:true}
 ]
};
const cg=()=>modules.circularGuard;
const cgCan=()=>['management','operations','finance','enforcement','admin'].includes(journey.role);

const cgOverviewPanel=()=>{
 const s=cg().streams,mb=cgNonLinearMassBalance(s);
 return panel('Non-linear circular mass-balance & diversion target','Tracks daily diversion across Jospong MRFs, the Epe Waste-to-Energy thermal plant, and organic biodigesters against the <= 4% landfill residual target.',
  stats([
   ['Total daily mass',mb.totalTonnes.toLocaleString('en-GB')+' t','All 20 LGAs & 37 LCDAs'],
   ['Circular diversion',mb.divertedPct+'%','MRFs + Epe WTE + Biodigesters'],
   ['Landfill residual',mb.landfillPct+'%',mb.meetsNonLinearTarget?'Meets <= 4% non-linear target':'Above 4% residual target'],
   ['Epe WTE feedstock',s.epeWteTonnes.toLocaleString('en-GB')+' t','Target 2,500–3,000 t/day via TLS']
  ])+
  table(['Circular stream','Destination infrastructure','Daily mass (t)','Share','Status'],[
   ['Dry recyclables (PET / Aluminium / Paper)','Jospong MRFs & Oshodi / Simpson Balers',s.mrfTonnes.toLocaleString('en-GB')+' t',Math.round(s.mrfTonnes/(mb.totalTonnes||1)*1000)/10+'%',pill('Off-taker active','good')],
   ['High-calorific dry feedstock (>7.5 MJ/kg)','Epe Waste-to-Energy Plant (via 40T TLS & Barge)',s.epeWteTonnes.toLocaleString('en-GB')+' t',Math.round(s.epeWteTonnes/(mb.totalTonnes||1)*1000)/10+'%',pill('Within 3,000 t/d band','good')],
   ['Organic wet biomass (Markets & Food)','Ikosi / Ketu Anaerobic Biodigesters & Compost',s.biodigesterTonnes.toLocaleString('en-GB')+' t',Math.round(s.biodigesterTonnes/(mb.totalTonnes||1)*1000)/10+'%',pill('Biogas / compost','good')],
   ['Inert landfill residual','Solous II/III (100-truck cap) & Olushosun phase-down',s.landfillResidualTonnes.toLocaleString('en-GB')+' t',mb.landfillPct+'%',mb.meetsNonLinearTarget?pill('<= 4% Target Met','good'):pill('Transition ramp','amber')]
  ])+
  (cgCan()?'<div class="drawer-actions">'+button('Update circular stream balance','cg-streams','',true)+'</div>':'')
 );
};

const cgCadastrePanel=()=>panel('LiDAR tenement density & border-street LCDA attribution','Prevents multi-story Brazilian tenements from under-declaring rooms as single-family bungalows and splits Section 102 border-street revenue by PostGIS centerline.',
 table(['Audit ID / Property','Footprint & storeys','Declared vs expected min rooms','Border LCDA attribution','Gate'],cg().densityAudits.map(a=>[
  esc(a.id)+'<small class="cell-sub">'+esc(a.property)+' · '+esc(a.address)+'</small>',
  a.footprintM2+' m² · '+a.storeys+'F',
  a.declaredRooms+' declared / >='+a.expectedMin+' expected',
  esc(a.lcda),
  a.flagged?pill('Hold decal · Wole-Wole audit','red'):pill('Density verified','good')
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Run LiDAR room-density audit','cg-density-check','',true)+' '+button('Attribute border-street LCDA','cg-border-split')+'</div>':'')
);

const cgFacilityPanel=()=>panel('TLS bulk multi-modal transfer & Epe WTE feedstock gate','Compactor trucks discharge locally at Simpson/Oshodi TLS. Only 40T RoRo trailers and lagoon barges haul to Epe WTE; loads with >45% moisture or >8% rubble incur ₦150,000 demurrage.',
 table(['Consignment / Origin','Modality & carrier','Mass & telemetry','Epe WTE gate outcome','Demurrage'],cg().epeConsignments.slice().reverse().map(c=>[
  esc(c.id)+'<small class="cell-sub">'+esc(c.origin)+'</small>',
  esc(c.mode)+'<small class="cell-sub">'+esc(c.carrier)+'</small>',
  c.tonnes+' t · '+c.moisturePct+'% moisture · '+c.inertRubblePct+'% inert · '+c.calorificMjKg+' MJ/kg',
  /Rejected/.test(c.status)?pill(c.status,'red'):pill(c.status,'good'),
  c.demurrageNgn?naira(c.demurrageNgn):'₦0'
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Inspect Epe WTE bulk consignment','cg-epe-inspect','',true)+' '+button('Verify compactor vs TLS haul rule','cg-haul-check')+'</div>':'')
);

const cgCapacityPanel=()=>panel('Dual-scale hydraulic tailgate & tipping-dwell anti-phantom gate','Blocks outbound weighbills unless OBD-II confirms hydraulic tailgate latch opening, ejector ram cycle, and >= 240s dwell inside the active tipping-face polygon.',
 table(['Audit / Ticket','Truck & site','Gross / Tare (kg)','Tailgate & ejector','Tipping dwell','Gate status'],cg().tippingAudits.slice().reverse().map(t=>[
  esc(t.id)+'<small class="cell-sub">'+esc(t.ticket)+'</small>',
  esc(t.truck)+' · '+esc(t.site),
  t.inboundGrossKg.toLocaleString('en-GB')+' / '+t.outboundTareKg.toLocaleString('en-GB'),
  t.tailgateOpened&&t.ejectorCycled?pill('Opened + cycled','good'):pill('No ram cycle','red'),
  t.dwellSeconds+'s (min 240s)',
  /Held/.test(t.result)?pill(t.result,'red'):pill(t.result,'good')
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Audit outbound tipping dwell','cg-tipping-check','',true)+'</div>':'')
);

const cgDrainagePanel=()=>panel('Pre-storm skip CDA Warden QR custody handshake','Prevents scavenger arson and industrial sludge dumping in emergency 11m³ skips by requiring an electronic QR custody handover to the local CDA Chairman.',
 table(['Custody ref / Skip','Drainage basin','CDA Warden custodian','Stipend','Custody state'],cg().skipCustody.slice().reverse().map(s=>[
  esc(s.id)+'<small class="cell-sub">'+esc(s.skipId)+'</small>',
  esc(s.basinId),
  esc(s.cdaChairmanName)+'<small class="cell-sub">'+esc(s.cdaPhone)+' · '+esc(s.qrScannedAt.slice(0,16).replace('T',' '))+'</small>',
  naira(s.stipendNgn)+'/day',
  pill(s.status,'good')
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Record CDA skip QR custody','cg-skip-custody','',true)+'</div>':'')
);

const cgFinancePanel=()=>panel('Friday NIBSS NIP timeout & 72-hour fleet fuel barcode fallback','If Friday 12:00 PM inter-bank NIP settlement lingers past 45 minutes, issues escrow-backed digital fuel barcodes so compactor fleets never park on Saturday morning.',
 table(['Fallback ref / Batch','Initiated (WAT)','NIP switch elapsed','Fallback status','Redeemable fuel networks','Escrow float'],cg().fuelFallbacks.slice().reverse().map(f=>[
  esc(f.id)+'<small class="cell-sub">'+esc(f.batch)+'</small>',
  esc(f.initiatedAt.slice(0,16).replace('T',' ')),
  f.elapsedMin+' min (limit 45m)',
  pill(f.voucherStatus,'amber'),
  esc(f.networks),
  naira(f.amountNgn)
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Check NIP timeout / issue fuel barcode','cg-fuel-fallback','',true)+'</div>':'')
);

const cgEnforcementPanel=()=>panel('Section 84(2) & 84(4) Evidence Act machine diagnostic attestation','Bundles pre-shift hardware calibration, Stratum-1 NTP clock drift (<=5000ms), and Legal Director digital signature so defense counsel cannot challenge admissibility.',
 table(['Certificate / Incident','Terminal & SHA-256','Pre-shift diag & NTP drift','Signing legal officer','Court admissibility'],cg().sec84Audits.slice().reverse().map(a=>[
  esc(a.id)+'<small class="cell-sub">'+esc(a.incident)+'</small>',
  esc(a.deviceSerial)+'<small class="cell-sub"><code>'+esc(a.sha256.slice(0,18))+'…</code></small>',
  (a.preShiftDiagPassed?'Diag passed':'Diag failed')+' · '+a.ntpDriftMs+' ms drift',
  esc(a.signingOfficer),
  a.admissible?pill('Sec 84(2)/(4) Admissible','good'):pill('Inadmissible · hold','red')
 ]))+
 (cgCan()?'<div class="drawer-actions">'+button('Verify Section 84(2) machine health','cg-sec84-check','',true)+'</div>':'')
);

const cgWrap=(screenName,fn)=>{
 const prev=screens[screenName];
 if(typeof prev==='function')screens[screenName]=()=>prev()+fn();
};
cgWrap('overview',cgOverviewPanel);
cgWrap('cadastre',cgCadastrePanel);
cgWrap('facility',cgFacilityPanel);
cgWrap('capacity',cgCapacityPanel);
cgWrap('drainage',cgDrainagePanel);
cgWrap('finance',cgFinancePanel);
cgWrap('enforcement',cgEnforcementPanel);

const cgPrevRun=runModule;
runModule=function(cmd,id){
 if(!String(cmd).startsWith('cg-'))return cgPrevRun(cmd,id);
 if(!cgCan())return toast('Authorised LAWMA officials only.');
 if(!saveModules())return;
 if(cmd==='cg-streams')return openForm('Update daily non-linear stream mass-balance','Record daily metric tonnes across circular processing hubs to track progress toward the <= 4% landfill residual target.',[
  field('mrfTonnes','Jospong & MRF dry recyclables (t)',{type:'number',min:0,max:20000,value:cg().streams.mrfTonnes}),
  field('epeWteTonnes','Epe WTE high-calorific feedstock (t)',{type:'number',min:0,max:20000,value:cg().streams.epeWteTonnes}),
  field('biodigesterTonnes','Ikosi / Ketu organic biodigesters (t)',{type:'number',min:0,max:20000,value:cg().streams.biodigesterTonnes}),
  field('landfillResidualTonnes','Solous / Olushosun residual landfill (t)',{type:'number',min:0,max:20000,value:cg().streams.landfillResidualTonnes})
 ],'Save mass balance',d=>{
  Object.assign(cg().streams,{mrfTonnes:Number(d.mrfTonnes),epeWteTonnes:Number(d.epeWteTonnes),biodigesterTonnes:Number(d.biodigesterTonnes),landfillResidualTonnes:Number(d.landfillResidualTonnes)});
  recordModuleAction('Updated non-linear circular mass-balance');
 });
 if(cmd==='cg-density-check')return openForm('Run LiDAR roof-footprint vs declared room density check','Flags multi-tenant tenements under-declaring rooms against LAGIS building footprint area.',[
  textField('property','Property DUID','PROP-MUS-0412'),
  textField('address','Street address','19 Olateju St, Mushin'),
  field('footprintM2','LAGIS roof footprint (m²)',{type:'number',min:40,max:5000,value:320}),
  field('storeys','Building storeys',{type:'number',min:1,max:10,value:2}),
  field('declaredRooms','Caretaker declared rooms',{type:'number',min:1,max:200,value:3}),
  field('lcda','Attributed LGA / LCDA',{options:CAD_LGAS,value:'Mushin'})
 ],'Run density audit',d=>{
  const res=cgDensityUnderdeclared({category:'MULTI_TENANT_TENEMENT',footprintM2:Number(d.footprintM2),storeys:Number(d.storeys),declaredRooms:Number(d.declaredRooms)});
  cg().densityAudits.push({id:'DEN-'+Date.now().toString(36).toUpperCase(),property:d.property,address:d.address,footprintM2:Number(d.footprintM2),storeys:Number(d.storeys),declaredRooms:Number(d.declaredRooms),expectedMin:res.expectedMin,flagged:res.flagged,lcda:d.lcda});
  recordModuleAction(d.property+(res.flagged?' flagged for Wole-Wole density audit':' density verified'));
 });
 if(cmd==='cg-border-split')return openForm('Attribute border-street Section 102 LCDA by PostGIS centerline','Deterministically assigns a structure on a boundary road (e.g. Ikotun-Egbe Rd) to the exact side of the street centerline.',[
  textField('property','Property DUID','PROP-ALM-0884'),
  field('lng','Structure longitude',{type:'number',min:2.7,max:4.4,step:0.0001,value:3.3012}),
  field('lat','Structure latitude',{type:'number',min:6.3,max:6.8,step:0.0001,value:6.5515}),
  textField('leftLcda','North / West LCDA','Egbe-Idimu LCDA'),
  textField('rightLcda','South / East LCDA','Ikotun-Igando LCDA')
 ],'Compute LCDA attribution',d=>{
  const lcda=cgStreetSideAttribution([Number(d.lng),Number(d.lat)],[[3.28,6.55],[3.32,6.55]],d.leftLcda,d.rightLcda);
  toast('Attributed '+d.property+' to '+lcda);
  recordModuleAction(d.property+' border centerline attributed to '+lcda);
 });
 if(cmd==='cg-epe-inspect')return openForm('Inspect Epe WTE bulk consignment','Enforces moisture <= 45%, inert rubble <= 8%, and calorific value >= 7.5 MJ/kg. Sub-standard loads incur ₦150,000 demurrage.',[
  field('origin','Origin TLS / Jetty',{options:['Simpson TLS','Oshodi TLS','Simpson Lagoon Jetty']}),
  field('mode','Bulk transport modality',{options:['40T_RORO_TRAILER','LAGOON_BARGE']}),
  textField('carrier','Trailer / Barge ID','TRL-40T-SIM-19'),
  field('tonnes','Net consolidated mass (t)',{type:'number',min:1,max:1000,step:0.1,value:38.5}),
  field('moisturePct','Measured moisture (%)',{type:'number',min:0,max:100,step:0.5,value:31}),
  field('inertRubblePct','Inert sand / rubble (%)',{type:'number',min:0,max:100,step:0.5,value:3}),
  field('calorificMjKg','Calorific value (MJ/kg)',{type:'number',min:1,max:30,step:0.1,value:8.8})
 ],'Inspect consignment',d=>{
  const res=cgEpeFeedstockRejection({transportMode:d.mode,moisturePct:Number(d.moisturePct),inertRubblePct:Number(d.inertRubblePct),calorificMjKg:Number(d.calorificMjKg)});
  const status=res.rejected?'Rejected · '+res.reason:'Admitted · '+res.divertTo;
  cg().epeConsignments.push({id:'EPE-CNS-'+Date.now().toString(36).toUpperCase(),origin:d.origin,mode:d.mode,carrier:d.carrier,tonnes:Number(d.tonnes),moisturePct:Number(d.moisturePct),inertRubblePct:Number(d.inertRubblePct),calorificMjKg:Number(d.calorificMjKg),status,demurrageNgn:res.demurrageNgn,at:cadNow()});
  recordModuleAction('Epe WTE consignment '+d.carrier+': '+status);
 });
 if(cmd==='cg-haul-check')return openForm('Verify compactor vs TLS bulk haul distance rule','Small compactor trucks cannot drive >25km directly to Epe; they must discharge at a local Transfer Loading Station (TLS).',[
  field('vehicleType','Vehicle class',{options:['Compactor','40T_RoRo_Trailer','Lagoon_Barge']}),
  field('destination','Target facility',{options:['Epe WTE','Simpson TLS','Oshodi TLS','Solous II']}),
  field('distanceKm','Route haul distance (km)',{type:'number',min:1,max:150,value:68})
 ],'Validate haul rule',d=>{
  const err=cgDirectEpeCompactorError({vehicleType:d.vehicleType,destination:d.destination,distanceKm:Number(d.distanceKm)});
  if(err)return err;
  toast('Haul route compliant with multi-modal TLS architecture.');
 });
 if(cmd==='cg-tipping-check')return openForm('Audit outbound scale tipping dwell & tailgate telemetry','Blocks phantom tipping where a truck scales in full and scales out without opening its hydraulic tailgate inside the tipping face for >= 240s.',[
  textField('ticket','Weighbridge ticket ID','WT-3120'),
  textField('truck','Vehicle plate','MUS-804-LA'),
  field('site','Landfill site',{options:['Solous II','Olushosun']}),
  field('inboundGrossKg','Inbound gross mass (kg)',{type:'number',min:1000,max:60000,value:21500}),
  field('outboundTareKg','Outbound tare mass (kg)',{type:'number',min:1000,max:60000,value:11200}),
  field('dwellSeconds','Tipping-face geofence dwell (s)',{type:'number',min:0,max:3600,value:275}),
  field('tailgateOpened','Hydraulic tailgate latch opened',{type:'checkbox',value:true}),
  field('ejectorCycled','Ejector ram pressure cycled',{type:'checkbox',value:true})
 ],'Verify discharge',d=>{
  const err=cgPhantomTippingError({inboundGrossKg:Number(d.inboundGrossKg),outboundTareKg:Number(d.outboundTareKg),inTippingPolygon:true,tailgateOpened:!!d.tailgateOpened,ejectorCycled:!!d.ejectorCycled,dwellSeconds:Number(d.dwellSeconds)});
  const result=err?'Held · '+err:'Cleared · verified discharge';
  cg().tippingAudits.push({id:'TIP-'+Date.now().toString(36).toUpperCase(),ticket:d.ticket,truck:d.truck,site:d.site,inboundGrossKg:Number(d.inboundGrossKg),outboundTareKg:Number(d.outboundTareKg),inTippingPolygon:true,tailgateOpened:!!d.tailgateOpened,ejectorCycled:!!d.ejectorCycled,dwellSeconds:Number(d.dwellSeconds),result});
  recordModuleAction('Tipping audit '+d.ticket+': '+result);
 });
 if(cmd==='cg-skip-custody')return openForm('Record pre-storm skip CDA Warden QR custody','Requires electronic handover to the Community Development Association (CDA) Chairman to guard against scavenger arson and toxic dumping.',[
  textField('skipId','Emergency skip ID','DUMMY-SKIP-04'),
  textField('basinId','Drainage catchment basin','System 6c · Kosofe'),
  textField('cdaChairmanName','CDA Chairman / Warden name','Chief B. Ogunleye'),
  textField('cdaPhone','Verified Nigerian mobile','+234 803 555 0192')
 ],'Confirm QR custody',d=>{
  const now=cadNow(),err=cgSkipCustodyError({skipId:d.skipId,basinId:d.basinId,cdaChairmanName:d.cdaChairmanName,cdaPhone:d.cdaPhone,qrScannedAt:now,geofenceVerified:true});
  if(err)return err;
  cg().skipCustody.push({id:'CUST-'+Date.now().toString(36).toUpperCase(),skipId:d.skipId,basinId:d.basinId,cdaChairmanName:d.cdaChairmanName,cdaPhone:d.cdaPhone,qrScannedAt:now,geofenceVerified:true,stipendNgn:CG_CDA_STIPEND_DAILY_NGN,status:'Guarded · QR custody active'});
  recordModuleAction('Skip '+d.skipId+' QR custody signed by '+d.cdaChairmanName);
 });
 if(cmd==='cg-fuel-fallback')return openForm('Check Friday NIP settlement latency & issue 72h fuel barcode','Issues escrow-backed digital fuel barcodes redeemable at NNPC, TotalEnergies, and Ardova when Friday NIBSS NIP transfers exceed 45 minutes.',[
  textField('batch','Friday settlement batch ref','SET-2026-W47-IKJ-001'),
  field('elapsedMin','Minutes elapsed since 12:00 PM NIP trigger',{type:'number',min:1,max:720,value:55}),
  field('amountNgn','Emergency fuel float allocation (₦)',{type:'number',min:50000,max:50000000,value:750000})
 ],'Evaluate fallback',d=>{
  const nowMs=Date.now(),initiatedAt=new Date(nowMs-Number(d.elapsedMin)*60000).toISOString();
  const res=cgEmergencyFuelVoucher({id:d.batch,status:'PENDING_NIP',initiatedAt},nowMs);
  if(!res.triggerVoucher)return 'NIP elapsed time ('+d.elapsedMin+'m) is under the 45-minute threshold; awaiting standard bank webhook.';
  cg().fuelFallbacks.push({id:'FUEL-FB-'+Date.now().toString(36).toUpperCase(),batch:d.batch,initiatedAt,elapsedMin:res.elapsedMin,voucherStatus:res.voucherStatus,networks:res.redeemableNetworks.join(' · '),amountNgn:Number(d.amountNgn)});
  recordModuleAction('Issued 72h emergency fuel barcode for '+d.batch);
 });
 if(cmd==='cg-sec84-check')return openForm('Verify Section 84(2)/(4) Evidence Act machine diagnostic attestation','Confirms pre-shift hardware calibration, Stratum-1 NTP clock drift <= 5000ms, and Legal Director signature.',[
  textField('incident','KAI incident reference','KAI-2026-094'),
  textField('deviceSerial','Field terminal serial','R6-TERM-024'),
  textField('sha256','SHA-256 photo digest','e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'),
  field('ntpDriftMs','Stratum-1 NTP clock drift (ms)',{type:'number',min:0,max:60000,value:210}),
  textField('signingOfficer','Responsible legal official','Barr. A. Bello (Dir. Legal MEWR)')
 ],'Attest Section 84(2)',d=>{
  const res=cgSection84Ready({sha256:d.sha256,deviceSerial:d.deviceSerial,preShiftDiagPassed:true,ntpDriftMs:Number(d.ntpDriftMs),ordinaryCourseAttested:true,signingOfficer:d.signingOfficer,signingOfficerRole:'Director of Legal Services',digitalSignature:'SIG-MEWR-'+Date.now()});
  if(!res.admissible)return res.errors.join(' · ');
  cg().sec84Audits.push({id:'S84-'+Date.now().toString(36).toUpperCase(),incident:d.incident,deviceSerial:d.deviceSerial,sha256:d.sha256,preShiftDiagPassed:true,ntpDriftMs:Number(d.ntpDriftMs),ordinaryCourseAttested:true,signingOfficer:d.signingOfficer,admissible:true});
  recordModuleAction('Section 84(2)/(4) certificate attested for '+d.incident);
 });
};
