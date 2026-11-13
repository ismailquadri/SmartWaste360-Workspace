
const defaultProperties = () => [
  {
    id: 'PROP-SUR-041',
    name: 'Bode Thomas Compound',
    address: '14 Bode Thomas Street, Surulere',
    lga: 'Surulere',
    ward: 'Ward B',
    cadastreId: 'LASG-CAD-SUR-2026-041',
    geohash: '8a62e06180a7fff',
    plusCode: '6FR3+4M Surulere, Lagos',
    type: 'Multi-Family Tenement (6 Flats)',
    unitsCount: 6,
    landlord: { name: 'Chief Adeleke O.', phone: '+234 803 301 9842', nin: '2341***890', lasrraId: 'LA-SUR-8841-92' },
    wallet: { id: 'LASG-WAL-COMP-041', balance: 12000, targetMonthly: 18000, lastPaid: '2026-10-04T10:15:00.000Z', smsAlertsCount: 14 },
    decal: { id: 'QR-SUR-B-041', affixedAt: '2026-01-12', verifiedBy: 'EHOAN Officer Bello T. (Wole-Wole)' },
    serviceTier: 'Compactor Doorstep',
    serviceStatus: 'Active',
    lucLien: { attached: false, ref: 'LUC-LIEN-SUR-041', amount: 0, statutoryRef: 'Section 14 Land Use Charge Law 2020' },
    units: [
      { duid: 'DUID-SUR-W02-P041-U01', flat: 'Flat 1 (Ground Left)', tenant: 'Oluwaseun Bakare', phone: '+234 802 311 4411', lasrraId: 'LA-SUR-1042-88', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-SUR-W02-P041-U02', flat: 'Flat 2 (Ground Right)', tenant: 'Chinedu Eze', phone: '+234 803 422 5522', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-SUR-W02-P041-U03', flat: 'Flat 3 (First Floor Left)', tenant: 'Fatima Mohammed', phone: '+234 818 533 6633', lasrraId: 'LA-SUR-3391-22', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-SUR-W02-P041-U04', flat: 'Flat 4 (First Floor Right)', tenant: 'Amina Danjuma', phone: '+234 809 644 7744', lasrraId: '', tariff: 3000, arrears: 15000, clearance: 'Clear', status: 'Arrears Flag' },
      { duid: 'DUID-SUR-W02-P041-U05', flat: 'Flat 5 (Penthouse)', tenant: 'Emeka Nwosu', phone: '+234 805 755 8855', lasrraId: 'LA-SUR-7711-55', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-SUR-W02-P041-U06', flat: 'Flat 6 (Boys Quarters)', tenant: 'Kazeem Taiwo', phone: '+234 812 866 9966', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' }
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-041-1', amount: 6000, payer: 'DUID-SUR-W02-P041-U02 (Chinedu Eze)', date: '2026-10-01T09:30:00.000Z', method: 'USSD *723# Bank Transfer', note: 'Social SMS broadcast delivered to 6 compound residents.' }
    ]
  },
  {
    id: 'PROP-ALI-118',
    name: 'Akowonjo Commercial/Residential Complex',
    address: '28 Akowonjo Road, Egbeda',
    lga: 'Alimosho',
    ward: 'Egbeda/Akowonjo',
    cadastreId: 'LASG-CAD-ALI-2026-118',
    geohash: '8a62e02241b7fff',
    plusCode: '7F62+8P Egbeda, Lagos',
    type: 'Mixed Commercial & Tenement (8 Units)',
    unitsCount: 8,
    landlord: { name: 'Alhaji Rasheed Balogun', phone: '+234 802 221 1100', nin: '1102***334', lasrraId: 'LA-ALI-4112-09' },
    wallet: { id: 'LASG-WAL-COMP-118', balance: 4500, targetMonthly: 32000, lastPaid: '2026-09-28T14:10:00.000Z', smsAlertsCount: 22 },
    decal: { id: 'QR-ALI-EG-118', affixedAt: '2026-02-14', verifiedBy: 'EHOAN Officer Ajayi K. (Wole-Wole)' },
    serviceTier: 'Prepaid Branded Bags',
    serviceStatus: 'Degraded',
    lucLien: { attached: false, ref: 'LUC-LIEN-ALI-118', amount: 0, statutoryRef: 'Section 14 Land Use Charge Law 2020' },
    units: [
      { duid: 'DUID-ALI-EG-P118-U01', flat: 'Shop 1 (Electronics)', tenant: 'Godwin Obi', phone: '+234 803 211 0011', lasrraId: 'LA-ALI-1199-01', tariff: 5000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U02', flat: 'Shop 2 (Pharmacy)', tenant: 'Pharm. Bisi Adele', phone: '+234 802 332 1122', lasrraId: 'LA-ALI-2288-02', tariff: 5000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U03', flat: 'Flat 1 (First Floor Front)', tenant: 'Ibrahim Sani', phone: '+234 818 443 2233', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U04', flat: 'Flat 2 (First Floor Rear)', tenant: 'Ngozi Okafor', phone: '+234 809 554 3344', lasrraId: 'LA-ALI-3377-04', tariff: 4000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U05', flat: 'Flat 3 (Second Floor Front)', tenant: 'Sunday Adeyemi', phone: '+234 805 665 4455', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U06', flat: 'Flat 4 (Second Floor Rear)', tenant: 'Grace Ekanem', phone: '+234 812 776 5566', lasrraId: '', tariff: 4000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U07', flat: 'Flat 5 (Third Floor Front)', tenant: 'Tunde Lawal', phone: '+234 803 887 6677', lasrraId: 'LA-ALI-4466-07', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' },
      { duid: 'DUID-ALI-EG-P118-U08', flat: 'Flat 6 (Third Floor Rear)', tenant: 'Hauwa Aliyu', phone: '+234 818 998 7788', lasrraId: '', tariff: 3000, arrears: 0, clearance: 'Clear', status: 'Active' }
    ],
    ownerDebtLedger: [
      { id: 'DEBT-ALI-01', duid: 'DUID-ALI-EG-P118-U03', formerTenant: 'Bayo Salami', amount: 18000, isolatedAt: '2026-08-10T11:00:00.000Z', status: 'Pending Landlord Settlement', note: 'Ring-fenced historical arrears upon tenancy transition. Service not denied to new occupant Ibrahim Sani.' }
    ],
    walletPayments: [
      { id: 'PAY-118-1', amount: 4500, payer: 'DUID-ALI-EG-P118-U01 (Godwin Obi)', date: '2026-09-28T14:10:00.000Z', method: 'POS Agent Terminal', note: 'Social SMS broadcast delivered to 8 occupants.' }
    ]
  },
  {
    id: 'PROP-IKJ-015',
    name: 'Ikeja GRA Executive Villa',
    address: '7 Isaac John Street, GRA',
    lga: 'Ikeja',
    ward: 'GRA / Onigbongbo',
    cadastreId: 'LASG-CAD-IKJ-2026-015',
    geohash: '8a62e02b2927fff',
    plusCode: '6FV7+3J Ikeja, Lagos',
    type: 'Single-Family Detached Villa (1 Unit)',
    unitsCount: 1,
    landlord: { name: 'Barrister (Mrs.) Folashade Coker', phone: '+234 803 555 7788', nin: '7788***112', lasrraId: 'LA-IKJ-9011-34' },
    wallet: { id: 'LASG-WAL-COMP-015', balance: 25000, targetMonthly: 12000, lastPaid: '2026-10-02T16:00:00.000Z', smsAlertsCount: 6 },
    decal: { id: 'QR-IKJ-GRA-015', affixedAt: '2025-11-20', verifiedBy: 'EHOAN Lead Sanusi M. (Wole-Wole)' },
    serviceTier: 'Compactor Doorstep',
    serviceStatus: 'Active (10% LASRRA Rebate Applied)',
    lucLien: { attached: false, ref: 'LUC-LIEN-IKJ-015', amount: 0, statutoryRef: 'Section 14 Land Use Charge Law 2020' },
    units: [
      { duid: 'DUID-IKJ-W01-P015-U01', flat: 'Main Villa Residence', tenant: 'Barrister (Mrs.) Folashade Coker', phone: '+234 803 555 7788', lasrraId: 'LA-IKJ-9011-34', tariff: 10800, arrears: 0, clearance: 'Clear', status: 'Active (10% LASRRA Discount)' }
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-015-1', amount: 25000, payer: 'Main Villa Residence', date: '2026-10-02T16:00:00.000Z', method: 'Direct Bank Debit', note: 'Pre-funded quarterly balance with active biometric LASRRA rebate.' }
    ]
  },
  {
    id: 'PROP-LEK-204',
    name: 'Admiralty Commercial Plaza',
    address: 'Plot 12 Admiralty Way, Lekki Phase 1',
    lga: 'Eti-Osa',
    ward: 'Lekki 1',
    cadastreId: 'LASG-CAD-LEK-2026-204',
    geohash: '8a62e03314c7fff',
    plusCode: '5HM2+7C Lekki, Lagos',
    type: 'Commercial Office Plaza (10 Suites)',
    unitsCount: 10,
    landlord: { name: 'Admiralty Holdings Ltd (Trustee T. Alakija)', phone: '+234 809 111 4455', nin: '9921***443', lasrraId: 'LA-ETI-0021-88' },
    wallet: { id: 'LASG-WAL-COMP-204', balance: 0, targetMonthly: 85000, lastPaid: '2026-06-15T11:00:00.000Z', smsAlertsCount: 30 },
    decal: { id: 'QR-LEK-ADM-204', affixedAt: '2025-08-11', verifiedBy: 'EHOAN Officer Henshaw P. (Wole-Wole)' },
    serviceTier: 'LUC Statutory Lien Attached',
    serviceStatus: 'Encumbered',
    lucLien: { attached: true, ref: 'LUC-LIEN-2026-ETI-204', amount: 255000, statutoryRef: 'Section 14 Land Use Charge Law 2020 (Lien Attached to Title)', attachedDate: '2026-09-01' },
    units: [
      ...Array.from({length: 10}, (_, i) => ({
        duid: `DUID-LEK-W03-P204-U${String(i+1).padStart(2,'0')}`,
        flat: `Suite ${101 + i} (Floor ${Math.floor(i/3)+1})`,
        tenant: `Commercial Enterprise ${i+1}`,
        phone: `+234 802 00${i+1} 2233`,
        lasrraId: '',
        tariff: 8500,
        arrears: 25500,
        clearance: 'Lien Encumbered',
        status: 'LUC Lien Notice'
      }))
    ],
    ownerDebtLedger: [
      { id: 'DEBT-LEK-01', duid: 'PLAZA-MASTER-ARREARS', formerTenant: 'Admiralty Holdings Corporate Account', amount: 255000, isolatedAt: '2026-09-01T00:00:00.000Z', status: 'LUC Title Lien Registered with Lands Bureau', note: 'Compound defaulted >120 days. Statutory lien attached to Land Use Charge assessment roll.' }
    ],
    walletPayments: []
  },
  {
    id: 'PROP-M12-088',
    name: 'Mile 12 Perimeter Transit Tenement & Stalls',
    address: 'Mile 12 International Market Perimeter, Ketu',
    lga: 'Kosofe',
    ward: 'Ketu/Mile 12',
    cadastreId: 'LASG-CAD-KOS-2026-088',
    geohash: '8a62e01b4467fff',
    plusCode: '7FRM+2R Ketu, Lagos',
    type: 'Perimeter Market Cluster (12 Units)',
    unitsCount: 12,
    landlord: { name: 'Market Traders Association (Trustee Lawal)', phone: '+234 802 888 2211', nin: '4412***889', lasrraId: 'LA-KOS-1144-55' },
    wallet: { id: 'LASG-WAL-COMP-088', balance: 48000, targetMonthly: 60000, lastPaid: '2026-10-03T18:00:00.000Z', smsAlertsCount: 45 },
    decal: { id: 'QR-KOS-M12-088', affixedAt: '2026-03-01', verifiedBy: 'EHOAN Officer Danladi H. (Wole-Wole)' },
    serviceTier: 'Night Market Bulk Compactor',
    serviceStatus: 'Active',
    lucLien: { attached: false, ref: 'LUC-LIEN-KOS-088', amount: 0, statutoryRef: 'Section 14 Land Use Charge Law 2020' },
    units: [
      ...Array.from({length: 12}, (_, i) => ({
        duid: `DUID-KOS-M12-P088-U${String(i+1).padStart(2,'0')}`,
        flat: `Stall / Living Bay ${i+1}`,
        tenant: `Trader Sector Lead ${i+1}`,
        phone: `+234 818 10${i+1} 3344`,
        lasrraId: '',
        tariff: 5000,
        arrears: 0,
        clearance: 'Clear',
        status: 'Active'
      }))
    ],
    ownerDebtLedger: [],
    walletPayments: [
      { id: 'PAY-088-1', amount: 48000, payer: 'Market Traders Union Bulk Escrow', date: '2026-10-03T18:00:00.000Z', method: 'Union Co-Treasury Direct Clearing', note: 'Bulk clearing for 12 perimeter stalls.' }
    ]
  }
];

/* Fictional, browser-session records. Categories are proposals, not a LAWMA taxonomy. */
const moduleSeed = () => ({
  version: 1,
  categories: ['PSP', 'Recycling & recovery', 'Facility operations', 'Transport & haulage', 'Technical services'],
  partners: [
    ...Array.from({length:18}, (_,i) => ({id:'PAR-'+String(i+1).padStart(3,'0'), name:'PSP partner '+String(i+1).padStart(2,'0'), type:'PSP', service:'Collection', area:i===5?'Ikeja':ROUTES[i%ROUTES.length].name, status:'Active', contact:'Service coordinator', reference:'PSP-'+String(i+1).padStart(3,'0')})),
    {id:'PAR-019',name:'Recovery partner 01',type:'Recycling & recovery',service:'Recovery',area:'Ikeja',status:'Active',contact:'Recovery coordinator',reference:'REC-019'},
    {id:'PAR-020',name:'Facility partner 01',type:'Facility operations',service:'Facility operations',area:'Oshodi',status:'Active',contact:'Facility coordinator',reference:'FAC-020'},
    {id:'PAR-021',name:'Haulage partner 01',type:'Transport & haulage',service:'Transport',area:'Apapa',status:'Pending review',contact:'Transport coordinator',reference:'TRN-021'},
    {id:'PAR-022',name:'Technical partner 01',type:'Technical services',service:'Technical support',area:'Lagos',status:'Active',contact:'Support coordinator',reference:'TEC-022'}
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
  policies:[{id:'POL-001',name:'Facility capacity review',trigger:'Vehicles present exceed the site capacity',response:'Supervisor reviews occupancy and records an action',status:'Draft — not approved'},{id:'POL-002',name:'Missing collection evidence',trigger:'A service event has incomplete supporting evidence',response:'Request evidence and record a human decision',status:'Draft — not approved'}],
  resident:{name:'Amina',area:'Ikeja',property:'PR-0182',partner:'PAR-006',address:'Household, Ikeja'},
  serviceRequests:[],
  users:[{id:'USR-001',name:'Operations supervisor',role:'operations',status:'Active'},{id:'USR-002',name:'Partner coordinator',role:'partner',status:'Active'}],
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
function recordCompoundWalletPayment(propertyId, amount, payerUnit, method){
  const prop = propertyByID(propertyId);
  if(!prop) return 'Property not found.';
  const amt = Number(amount);
  if(!Number.isFinite(amt) || amt <= 0) return 'Enter a valid payment amount.';
  prop.wallet.balance += amt;
  prop.wallet.lastPaid = new Date().toISOString();
  prop.wallet.smsAlertsCount += prop.units.length;
  const payRecord = {
    id: moduleID('PAY', prop.walletPayments),
    amount: amt,
    payer: payerUnit || 'Compound Resident / Landlord',
    date: new Date().toISOString(),
    method: method || 'Bank Transfer',
    note: 'Social SMS broadcast delivered to ' + prop.units.length + ' registered occupant mobile numbers.'
  };
  prop.walletPayments.unshift(payRecord);
  recordModuleAction('₦' + amt.toLocaleString() + ' credited to ' + prop.wallet.id + ' (' + prop.name + '). SMS broadcast sent to ' + prop.units.length + ' residents.');
  return null;
}
function ringFenceTenantDebtAndOnboard(propertyId, duid, newTenantName, newTenantPhone, newTenantLasrra){
  const prop = propertyByID(propertyId);
  if(!prop) return 'Property not found.';
  const unit = prop.units.find(u => u.duid === duid);
  if(!unit) return 'Dwelling unit not found.';
  if(!newTenantName || !newTenantPhone) return 'New tenant name and phone are required.';
  
  const arrears = unit.arrears;
  if(arrears > 0){
    const debtRecord = {
      id: moduleID('DEBT', prop.ownerDebtLedger),
      duid: duid,
      formerTenant: unit.tenant,
      amount: arrears,
      isolatedAt: new Date().toISOString(),
      status: 'Pending Landlord Settlement',
      note: 'Ring-fenced historical arrears upon tenancy transition. Service not denied to incoming occupant ' + newTenantName + '.'
    };
    prop.ownerDebtLedger.unshift(debtRecord);
  }
  
  const former = unit.tenant;
  unit.tenant = newTenantName;
  unit.phone = newTenantPhone;
  unit.lasrraId = newTenantLasrra || '';
  unit.arrears = 0;
  unit.clearance = 'Clear';
  unit.status = newTenantLasrra ? 'Active (10% LASRRA Rebate)' : 'Active';
  
  recordModuleAction('Tenancy transition on ' + duid + ' (' + prop.name + '): ' + former + ' vacated. ' + (arrears > 0 ? '₦' + arrears.toLocaleString() + ' ring-fenced to owner debt ledger. ' : '') + 'New tenant ' + newTenantName + ' onboarded with ₦0.00 current balance. Compactor service cleared.');
  return null;
}
function escalatePropertyInterlock(propertyId, targetTier){
  const prop = propertyByID(propertyId);
  if(!prop) return 'Property not found.';
  prop.serviceTier = targetTier;
  if(targetTier === 'LUC Statutory Lien Attached'){
    prop.serviceStatus = 'Encumbered';
    prop.lucLien.attached = true;
    prop.lucLien.amount = prop.units.reduce((s, u) => s + u.arrears, 0) || 50000;
    prop.lucLien.attachedDate = new Date().toISOString().split('T')[0];
    recordModuleAction('Statutory Title Lien attached to ' + prop.cadastreId + ' under Section 14 Land Use Charge Law 2020. Outstanding: ₦' + prop.lucLien.amount.toLocaleString());
  } else if(targetTier === 'Prepaid Branded Bags'){
    prop.serviceStatus = 'Degraded';
    prop.lucLien.attached = false;
    recordModuleAction(prop.name + ' service downgraded to Prepaid Branded Bags (BAG-LAWMA-*). Doorstep compactor service suspended.');
  } else {
    prop.serviceStatus = 'Active';
    prop.lucLien.attached = false;
    recordModuleAction(prop.name + ' restored to Compactor Doorstep service tier.');
  }
  return null;
}
