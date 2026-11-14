
const defaultProperties = () => [
  {
    id: 'PROP-SUR-041',
    name: 'Sample Surulere Compound 041',
    address: 'Illustrative address 14, Surulere',
    lga: 'Surulere',
    ward: 'Ward B',
    cadastreId: 'SAMPLE-CAD-SUR-041',
    geohash: 'SAMPLE-GEO-e06180a7fff',
    plusCode: 'Illustrative map code, Surulere',
    type: 'Multi-Family Tenement (6 Flats)',
    unitsCount: 6,
    landlord: { name: 'Sample owner A', phone: '+234 800 000 0041', nin: 'SAMPLE-ONLY', lasrraId: 'SAMPLE-LASRRA-041' },
    wallet: { id: 'SAMPLE-WALLET-041', balance: 12000, targetMonthly: 18000, lastPaid: '2026-10-04T10:15:00.000Z', smsAlertsCount: 14 },
    decal: { id: 'SAMPLE-DECAL-SUR-041', affixedAt: '2026-01-12', verifiedBy: 'Illustrative field officer (not verified)' },
    serviceTier: 'Illustrative doorstep collection option',
    serviceStatus: 'Sample state · not verified',
    lucLien: { attached: false, ref: 'SAMPLE-REVIEW-SUR-041', amount: 0, statutoryRef: 'Unverified policy concept; no legal effect' },
    units: [
      { duid: 'DUID-SUR-W02-P041-U01', flat: 'Flat 1 (Ground Left)', tenant: 'Sample resident 1', phone: '+234 800 000 0001', lasrraId: 'SAMPLE-LASRRA-001', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-SUR-W02-P041-U02', flat: 'Flat 2 (Ground Right)', tenant: 'Sample resident 2', phone: '+234 800 000 0002', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-SUR-W02-P041-U03', flat: 'Flat 3 (First Floor Left)', tenant: 'Sample resident 3', phone: '+234 800 000 0003', lasrraId: 'SAMPLE-LASRRA-003', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-SUR-W02-P041-U04', flat: 'Flat 4 (First Floor Right)', tenant: 'Sample resident 4', phone: '+234 800 000 0004', lasrraId: '', tariff: 3000, arrears: 15000, clearance: 'Sample clear' , status: 'Arrears Flag' },
      { duid: 'DUID-SUR-W02-P041-U05', flat: 'Flat 5 (Penthouse)', tenant: 'Sample resident 5', phone: '+234 800 000 0005', lasrraId: 'SAMPLE-LASRRA-005', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-SUR-W02-P041-U06', flat: 'Flat 6 (Boys Quarters)', tenant: 'Sample resident 6', phone: '+234 800 000 0006', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' }
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-041-1', amount: 6000, payer: 'DUID-SUR-W02-P041-U02 (sample resident 2)', date: '2026-10-01T09:30:00.000Z', method: 'Illustrative USSD transfer', note: 'Fictional payment entry only; no funds moved and no SMS sent.' }
    ]
  },
  {
    id: 'PROP-ALI-118',
    name: 'Sample Egbeda Mixed-Use Property 118',
    address: 'Illustrative address 28, Egbeda',
    lga: 'Alimosho',
    ward: 'Egbeda/Akowonjo',
    cadastreId: 'SAMPLE-CAD-ALI-118',
    geohash: 'SAMPLE-GEO-e02241b7fff',
    plusCode: 'Illustrative map code, Egbeda',
    type: 'Mixed Commercial & Tenement (8 Units)',
    unitsCount: 8,
    landlord: { name: 'Sample owner B', phone: '+234 800 000 0118', nin: 'SAMPLE-ONLY', lasrraId: 'SAMPLE-LASRRA-118' },
    wallet: { id: 'SAMPLE-WALLET-118', balance: 4500, targetMonthly: 32000, lastPaid: '2026-09-28T14:10:00.000Z', smsAlertsCount: 22 },
    decal: { id: 'SAMPLE-DECAL-ALI-118', affixedAt: '2026-02-14', verifiedBy: 'Illustrative field officer (not verified)' },
    serviceTier: 'Hypothetical prepaid-bag option',
    serviceStatus: 'Hypothetical state · not connected',
    lucLien: { attached: false, ref: 'SAMPLE-REVIEW-ALI-118', amount: 0, statutoryRef: 'Unverified policy concept; no legal effect' },
    units: [
      { duid: 'DUID-ALI-EG-P118-U01', flat: 'Shop 1 (Electronics)', tenant: 'Sample resident A', phone: '+234 800 000 0101', lasrraId: 'SAMPLE-LASRRA-A', tariff: 5000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U02', flat: 'Shop 2 (Pharmacy)', tenant: 'Sample resident B', phone: '+234 800 000 0102', lasrraId: 'SAMPLE-LASRRA-B', tariff: 5000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U03', flat: 'Flat 1 (First Floor Front)', tenant: 'Sample resident C', phone: '+234 800 000 0103', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U04', flat: 'Flat 2 (First Floor Rear)', tenant: 'Sample resident D', phone: '+234 800 000 0104', lasrraId: 'SAMPLE-LASRRA-D', tariff: 4000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U05', flat: 'Flat 3 (Second Floor Front)', tenant: 'Sample resident E', phone: '+234 800 000 0105', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U06', flat: 'Flat 4 (Second Floor Rear)', tenant: 'Sample resident F', phone: '+234 800 000 0106', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U07', flat: 'Flat 5 (Third Floor Front)', tenant: 'Sample resident G', phone: '+234 800 000 0107', lasrraId: 'SAMPLE-LASRRA-G', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' },
      { duid: 'DUID-ALI-EG-P118-U08', flat: 'Flat 6 (Third Floor Rear)', tenant: 'Sample resident H', phone: '+234 800 000 0108', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Sample clear' , status: 'Sample active' }
    ],
    ownerDebtLedger: [
      { id: 'DEBT-ALI-01', duid: 'DUID-ALI-EG-P118-U03', formerTenant: 'Sample former occupant', amount: 18000, isolatedAt: '2026-08-10T11:00:00.000Z', status: 'Illustrative review only', note: 'Illustrative arrears scenario only; no debt assignment or service rule is enacted.' }
    ],
    walletPayments: [
      { id: 'PAY-118-1', amount: 4500, payer: 'DUID-ALI-EG-P118-U01 (sample resident 1)', date: '2026-09-28T14:10:00.000Z', method: 'Illustrative POS channel', note: 'Fictional payment entry only; no funds moved and no SMS sent.' }
    ]
  },
  {
    id: 'PROP-IKJ-015',
    name: 'Sample Ikeja Residence 015',
    address: 'Illustrative address 7, Ikeja GRA',
    lga: 'Ikeja',
    ward: 'GRA / Onigbongbo',
    cadastreId: 'SAMPLE-CAD-IKJ-015',
    geohash: 'SAMPLE-GEO-e02b2927fff',
    plusCode: 'Illustrative map code, Ikeja',
    type: 'Single-Family Detached Villa (1 Unit)',
    unitsCount: 1,
    landlord: { name: 'Sample owner C', phone: '+234 800 000 0015', nin: 'SAMPLE-ONLY', lasrraId: 'SAMPLE-LASRRA-015' },
    wallet: { id: 'SAMPLE-WALLET-015', balance: 25000, targetMonthly: 12000, lastPaid: '2026-10-02T16:00:00.000Z', smsAlertsCount: 6 },
    decal: { id: 'SAMPLE-DECAL-IKJ-015', affixedAt: '2025-11-20', verifiedBy: 'Illustrative field officer (not verified)' },
    serviceTier: 'Illustrative doorstep collection option',
    serviceStatus: 'Sample state · hypothetical incentive not approved',
    lucLien: { attached: false, ref: 'SAMPLE-REVIEW-IKJ-015', amount: 0, statutoryRef: 'Unverified policy concept; no legal effect' },
    units: [
      { duid: 'DUID-IKJ-W01-P015-U01', flat: 'Main Villa Residence', tenant: 'Sample resident 15', phone: '+234 800 000 0015', lasrraId: 'SAMPLE-LASRRA-015', tariff: 10800, arrears: 0, clearance: 'Sample clear' , status: 'Sample active · no rebate applied' }
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-015-1', amount: 25000, payer: 'Sample occupant', date: '2026-10-02T16:00:00.000Z', method: 'Illustrative bank debit', note: 'Illustrative balance entry only; no identity check, rebate or payment occurred.' }
    ]
  },
  {
    id: 'PROP-LEK-204',
    name: 'Sample Lekki Office Plaza 204',
    address: 'Illustrative address 12, Lekki Phase 1',
    lga: 'Eti-Osa',
    ward: 'Lekki 1',
    cadastreId: 'SAMPLE-CAD-LEK-204',
    geohash: 'SAMPLE-GEO-e03314c7fff',
    plusCode: 'Illustrative map code, Lekki',
    type: 'Commercial Office Plaza (10 Suites)',
    unitsCount: 10,
    landlord: { name: 'Sample holding company', phone: '+234 800 000 0204', nin: 'SAMPLE-ONLY', lasrraId: 'SAMPLE-LASRRA-204' },
    wallet: { id: 'SAMPLE-WALLET-204', balance: 0, targetMonthly: 85000, lastPaid: '2026-06-15T11:00:00.000Z', smsAlertsCount: 30 },
    decal: { id: 'SAMPLE-DECAL-LEK-204', affixedAt: '2025-08-11', verifiedBy: 'Illustrative field officer (not verified)' },
    serviceTier: 'Hypothetical policy review state',
    serviceStatus: 'Hypothetical state · no lien registered',
    lucLien: { attached: true, ref: 'SAMPLE-REVIEW-LEK-204', amount: 255000, statutoryRef: 'Unverified policy concept; no legal effect', attachedDate: '2026-09-01' },
    units: [
      ...Array.from({length: 10}, (_, i) => ({
        duid: `DUID-LEK-W03-P204-U${String(i+1).padStart(2,'0')}`,
        flat: `Suite ${101 + i} (Floor ${Math.floor(i/3)+1})`,
        tenant: `Sample commercial occupant ${i+1}`,
        phone: `SAMPLE-CONTACT-${i+1}`,
        lasrraId: '',
        tariff: 8500,
        arrears: 25500,
        clearance: 'Hypothetical review' ,
        status: 'Hypothetical review only'
      }))
    ],
    ownerDebtLedger: [
      { id: 'DEBT-LEK-01', duid: 'PLAZA-MASTER-ARREARS', formerTenant: 'Sample prior property account', amount: 255000, isolatedAt: '2026-09-01T00:00:00.000Z', status: 'Simulated review state; not a registered lien', note: 'Illustrative arrears scenario only. No lien or title action is created.' }
    ],
    walletPayments: []
  },
  {
    id: 'PROP-M12-088',
    name: 'Sample Ketu Market Cluster 088',
    address: 'Illustrative market-perimeter location, Ketu',
    lga: 'Kosofe',
    ward: 'Ketu/Mile 12',
    cadastreId: 'SAMPLE-CAD-KOS-088',
    geohash: 'SAMPLE-GEO-e01b4467fff',
    plusCode: 'Illustrative map code, Ketu',
    type: 'Perimeter Market Cluster (12 Units)',
    unitsCount: 12,
    landlord: { name: 'Sample traders association', phone: '+234 800 000 0088', nin: 'SAMPLE-ONLY', lasrraId: 'SAMPLE-LASRRA-088' },
    wallet: { id: 'SAMPLE-WALLET-088', balance: 48000, targetMonthly: 60000, lastPaid: '2026-10-03T18:00:00.000Z', smsAlertsCount: 45 },
    decal: { id: 'SAMPLE-DECAL-KOS-088', affixedAt: '2026-03-01', verifiedBy: 'Illustrative field officer (not verified)' },
    serviceTier: 'Illustrative market collection option',
    serviceStatus: 'Sample state · not verified',
    lucLien: { attached: false, ref: 'SAMPLE-REVIEW-KOS-088', amount: 0, statutoryRef: 'Unverified policy concept; no legal effect' },
    units: [
      ...Array.from({length: 12}, (_, i) => ({
        duid: `DUID-KOS-M12-P088-U${String(i+1).padStart(2,'0')}`,
        flat: `Stall / Living Bay ${i+1}`,
        tenant: `Sample trader ${i+1}`,
        phone: `SAMPLE-CONTACT-M12-${i+1}`,
        lasrraId: '',
        tariff: 5000,
        arrears: 0,
        clearance: 'Sample clear' ,
        status: 'Sample active'
      }))
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-088-1', amount: 48000, payer: 'Sample market contribution group', date: '2026-10-03T18:00:00.000Z', method: 'Illustrative pooled contribution', note: 'Illustrative entry only; no funds moved.' }
    ]
  }
];

/* SIMULATION ONLY: all property/person/identity/payment data below is invented, not verified, and has no legal or financial effect. */
const moduleSeed = () => ({
  version: 1,
  categories: ['PSP', 'Recycling & recovery', 'Facility operations', 'Transport & haulage', 'Technical services'],
  partners: [
    ...Array.from({length:18}, (_,i) => ({id:'PAR-'+String(i+1).padStart(3,'0'), name:'PSP partner '+String(i+1).padStart(2,'0'), type:'PSP', service:'Collection', area:i===5?'Ikeja':ROUTES[i%ROUTES.length].name, status:'Sample active', contact:'Service coordinator', reference:'PSP-'+String(i+1).padStart(3,'0')})),
    {id:'PAR-019',name:'Recovery partner 01',type:'Recycling & recovery',service:'Recovery',area:'Ikeja',status:'Sample active',contact:'Recovery coordinator',reference:'REC-019'},
    {id:'PAR-020',name:'Facility partner 01',type:'Facility operations',service:'Facility operations',area:'Oshodi',status:'Sample active',contact:'Facility coordinator',reference:'FAC-020'},
    {id:'PAR-021',name:'Haulage partner 01',type:'Transport & haulage',service:'Transport',area:'Apapa',status:'Pending review',contact:'Transport coordinator',reference:'TRN-021'},
    {id:'PAR-022',name:'Technical partner 01',type:'Technical services',service:'Technical support',area:'Lagos',status:'Sample active',contact:'Support coordinator',reference:'TEC-022'}
  ],
  personnel:[{id:'PER-001',partner:'PAR-006',name:'Babatunde A.',role:'Driver',status:'Available'},{id:'PER-002',partner:'PAR-019',name:'Recovery coordinator',role:'Coordinator',status:'Available'}],
  vehicleRecords:[],
  facilities:[
    {id:'FAC-001',partner:'PAR-020',name:'Ikeja transfer station',area:'Ikeja',capacity:30,expected:26,baseline:27,kind:'Transfer station'},
    {id:'FAC-002',partner:'PAR-020',name:'Oshodi holding area',area:'Oshodi',capacity:24,expected:21,baseline:26,kind:'Holding area'},
    {id:'FAC-003',partner:'PAR-020',name:'Disposal site A',area:'Lagos',capacity:45,expected:34,baseline:32,kind:'Disposal facility'}
  ],
  visits:[],
  incidents:[{id:'INC-001',type:'Capacity breach',subject:'FAC-002',partner:'PAR-020',area:'Oshodi',priority:'High',status:'Open',owner:'Unassigned',description:'Manual sample count exceeds the configured holding capacity.',resolution:'',notes:[],created:'2026-10-05T07:20:00.000Z'}],
  reviews:[],
  policies:[{id:'POL-001',name:'Facility capacity review',trigger:'Vehicles present exceed the site capacity',response:'Supervisor reviews occupancy and records an action',status:'Draft: not approved'},{id:'POL-002',name:'Missing collection evidence',trigger:'A service event has incomplete supporting evidence',response:'Request evidence and record a human decision',status:'Draft: not approved'}],
  resident:{name:'Amina',area:'Ikeja',property:'PR-0182',partner:'PAR-006',address:'Household, Ikeja'},
  serviceRequests:[],
  users:[{id:'USR-001',name:'Operations supervisor',role:'operations',status:'Sample active'},{id:'USR-002',name:'Partner coordinator',role:'partner',status:'Sample active'}],
  partnerContext:'PAR-006',audit:[],properties:defaultProperties()
});
let modules=moduleSeed();
try {
  const saved=JSON.parse(sessionStorage.getItem('lawma-modules-v1')||localStorage.getItem('lawma-demo-saved-v1')||'null');
  if(saved && Array.isArray(saved.partners) && Array.isArray(saved.incidents)) {
    modules={...modules,...saved};
    if(!Array.isArray(modules.properties) || modules.properties.length===0) {
      modules.properties=defaultProperties();
    }
  }
} catch { /* Start with the demonstration dataset if browser storage is unavailable. */ }
function saveModules(){
  try { sessionStorage.setItem('lawma-modules-v1',JSON.stringify(modules)); localStorage.setItem('lawma-demo-saved-v1',JSON.stringify(modules)); return true; }
  catch { toast('Browser storage is unavailable. Changes last until this page is reloaded.'); return false; }
}
function recordModuleAction(text){
  modules.audit.unshift({time:new Date().toISOString(),actor:journeyRoles[journey.role]?.[0]||'Workspace user',text});
  saveModules();
}
function moduleID(prefix,records){let n=records.length+1;while(records.some(r=>r.id===prefix+'-'+String(n).padStart(3,'0')))n++;return prefix+'-'+String(n).padStart(3,'0')}
const partnerByID=id=>modules.partners.find(p=>p.id===id);
const partnerName=id=>partnerByID(id)?.name||'No partner assigned';
const partnerFleet=id=>fleet.filter(v=>v.partnerId===id);
const occupancy=f=>f.baseline+modules.visits.filter(v=>v.facility===f.id&&!v.departed).length;
const isAuthority=()=>['management','operations','admin'].includes(journey.role);
const canMaintain=()=>['management','admin'].includes(journey.role);
const currentPartner=()=>partnerByID(modules.partnerContext)||modules.partners[0];

// Existing session fixtures predate explicit facility ownership.
modules.facilities.forEach(f=>{f.partner ||= 'PAR-020'});

const propertyByID = id => modules.properties.find(p => p.id === id);
const findDUID = duid => {
  for(const p of modules.properties){
    const u = p.units.find(x => x.duid === duid);
    if(u) return { property: p, unit: u };
  }
  return null;
};
