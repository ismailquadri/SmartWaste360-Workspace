/* MOD-01 sample register: one compound per LGA, reseeded when CAD_VERSION changes (officer-registered properties are kept). */
// ---- Sample register: one compound per LGA ----
const CAD_VERSION=6;
const CAD_WEBHOOK_SECRET='sample-bank-secret';
// Sample LAGIS parcel: a surveyed quadrilateral around the premises, sized by property type.
const cadParcel=(p,i)=>{if(p.informal||!p.cadastreId)return null;const [lng,lat]=p.coord,w=(p.category==='Market'?90:CAD_COMMERCIAL.includes(p.category)?45:p.units.length>1?30:22)/2,h=w*.7,a=(i*17%30)*Math.PI/180,k=1/(111320*Math.cos(lat*Math.PI/180)),m=1/110574;return [[-w,-h],[w,-h],[w*.95,h],[-w,h*1.05]].map(([x,y])=>[+(lng+(x*Math.cos(a)-y*Math.sin(a))*k).toFixed(7),+(lat+(x*Math.sin(a)+y*Math.cos(a))*m).toFixed(7)])};
const cadGps=(p,i)=>p.parcel&&p.lagis==='Awaiting match'?[+(p.coord[0]+(Math.max(...p.parcel.map(x=>x[0]))-p.coord[0])+12/(111320*Math.cos(p.coord[1]*Math.PI/180))).toFixed(7),p.coord[1]]:p.coord;
const CAD_SEED=[
 ['AGE','Agege','Orile Agege','Pen Cinema','Multi-tenant tenement',10,'14 Ajayi Street, Pen Cinema',false,0],
 ['AJE','Ajeromi-Ifelodun','Ifelodun','Ajegunle','Multi-tenant tenement',14,'6 Boundary Road, Ajegunle',true,74],
 ['ALI','Alimosho','Igando-Ikotun','Egbeda','Multi-tenant tenement',8,'28 Akowonjo Road, Egbeda',false,45],
 ['AMU','Amuwo-Odofin','Oriade','Festac','Single-family home',1,'House 12, 4th Avenue, Festac Town',false,0],
 ['APA','Apapa','Apapa-Iganmu','Ijora','Commercial plaza',6,'Ijora Causeway Plaza',false,96],
 ['BAD','Badagry','Badagry West','Ajara','Multi-tenant tenement',6,'9 Marina Road, Badagry',false,12],
 ['EPE','Epe','Eredo','Epe Town','Single-family home',1,'3 Oke-Oyinbo Street, Epe',false,0],
 ['ETI','Eti-Osa','Ikoyi-Obalende','Obalende','Multi-tenant tenement',12,'21 Ajele Street, Obalende',true,102],
 ['IBE','Ibeju-Lekki','Lekki','Awoyaya','Roadside kiosk',1,'Awoyaya Junction, Lekki-Epe Expressway',true,38],
 ['IFA','Ifako-Ijaiye','Ojokoro','Ijaiye','Multi-tenant tenement',9,'5 Oyemekun Street, Ijaiye',false,0],
 ['IKJ','Ikeja','Onigbongbo','Ikeja GRA','Single-family home',1,'7 Oduduwa Crescent, Ikeja GRA',false,0],
 ['IKO','Ikorodu','Ikorodu North','Agric','Multi-tenant tenement',11,'40 Ijede Road, Agric',false,67],
 ['KOS','Kosofe','Agboyi-Ketu','Mile 12','Market',16,'Mile 12 International Market, Block C',false,94],
 ['LIS','Lagos Island','Lagos Island East','Isale Eko','Multi-tenant tenement',13,'18 Idumagbo Avenue, Isale Eko',false,24],
 ['LMA','Lagos Mainland','Yaba','Ebute Metta','Multi-tenant tenement',10,'11 Borno Way, Ebute Metta',false,0],
 ['MUS','Mushin','Odi-Olowo','Idi-Araba','Multi-tenant tenement',15,'33 Olorunlogbon Street, Idi-Araba',true,58],
 ['OJO','Ojo','Oto-Awori','Alaba','Commercial plaza',8,'Alaba International Market, Line 4',false,33],
 ['OSH','Oshodi-Isolo','Ejigbo','Ejigbo','Multi-tenant tenement',9,'2 Ifoshi Road, Ejigbo',false,0],
 ['SHO','Shomolu','Bariga','Bariga','Multi-tenant tenement',12,'17 Ilaje Road, Bariga',true,91],
 ['SUR','Surulere','Itire-Ikate','Aguda','Multi-tenant tenement',6,'14 Akinremi Street, Aguda',false,8]
];
const cadSeed=()=>{const day=86400000,now=Date.now();return CAD_SEED.map(([code,lga,lcda,ward,category,count,address,informal,days],i)=>{
 const commercial=CAD_COMMERCIAL.includes(category),kiosk=category==='Roadside kiosk';
 const tariff=commercial?6000:category==='Single-family home'?12000:kiosk?4000:3500;
 const owing=days>0?Math.min(count,Math.max(1,Math.round(count*(days>60?.5:.25)))):0;
 const months=Math.max(1,Math.ceil(days/30));
 const units=Array.from({length:count},(_,u)=>({duid:'DUID-'+code+'-'+String(101+i*7)+'-U'+String(u+1).padStart(2,'0'),flat:commercial?'Shop '+(u+1):count===1?'Main house':'Room '+(u+1),tenant:(commercial?'Trader ':'Occupant ')+String.fromCharCode(65+(u%26)),phone:'+234 803 '+String(400+i).padStart(3,'0')+' '+String(1000+u*37).slice(-4),tier:u%3===0?2:1,credit:0,lasrraId:u%3===0?'LAS-'+String(30000000+i*1000+u):'',tariff,arrears:u<owing?tariff*months:0}));
 return {sampleSeed:true,id:'PROP-'+code+'-'+String(101+i*7),name:(commercial?'':ward+' ')+(category==='Multi-tenant tenement'?'compound':category.toLowerCase()),address,lga,lcda,ward,category,cadastreId:informal?'':'LASG-CAD-2024-'+String(98000+i*131),lagis:informal?'Unmatched informal':i%5===2?'Awaiting match':'Matched',lagisAttempts:informal||i%5===2?0:1,informal,
  geohash:'8a65'+(0x1a2b3c+i*4099).toString(16)+'fff',coord:[3.2+((i*37)%40)/100,6.43+((i*53)%25)/100],
  landlord:{name:'Landlord, '+address.split(',')[0],phone:'+234 802 '+String(500+i)+' 0'+String(100+i),tier:i%2?1:2},
  wallet:{id:'MTR-PROP-'+code+'-'+String(101+i*7),balance:0,bank:i%2?'Wema Bank':'Providus Bank',nuban:'99'+String(10000000+i*7919).slice(-8),ussd:'*384*22*'+code+String(101+i*7)+'#'},
  arrearsSince:days?new Date(now-days*day).toISOString():null,
  decal:{id:'DECAL-LASG-'+code+'-'+String(101+i*7),officer:'EHO '+lcda+' '+String(10+i),badge:'EHOAN-'+code+'-'+String(200+i),affixedAt:new Date(now-(120+i*9)*day).toISOString(),gpsLocked:i%3!==0,gatePhoto:i%3!==0?'SAMPLE-GATE-'+code:'',mobilisationPaid:i%4===0,performancePaid:false},
  units,certificates:[],broadcasts:[],ownerDebtLedger:days>60&&!commercial?[{id:'DEBT-'+code+'-01',duid:units[units.length-1].duid,formerTenant:'Former occupant',amount:tariff*4,isolatedAt:new Date(now-40*day).toISOString(),status:'Liability review pending'}]:[],walletPayments:[],bags:[],court:null,collectionPlan:null,serviceTier:'',serviceStatus:''};
 })};
if(modules.cadastreVersion!==CAD_VERSION){
 // Upgrade existing records without losing team test activity or duplicating seed properties.
 const fresh=cadSeed(),existing=modules.properties||[],byId=new Map(existing.map(p=>[p.id,p]));
 if(existing.length)modules.properties=[...existing,...fresh.filter(p=>!byId.has(p.id))];else modules.properties=fresh;
 modules.properties.forEach(p=>{
  p.units||=[];p.units.forEach(u=>{u.credit||=0;delete u.rebateCycles});p.bags||=[];p.court||=null;p.collectionPlan||=null;p.certificates||=[];p.broadcasts||=[];p.walletPayments||=[];p.ownerDebtLedger||=[];
  if(p.lien){p.legacyLien={...p.lien,status:'Withdrawn sample policy · legal review required'};delete p.lien}
  p.ownerDebtLedger.forEach(d=>{if(d.status==='Ring-fenced to landlord')d.status='Liability review pending'});
  p.decal||={id:'DECAL-'+p.id,officer:'Not assigned',badge:'Not assigned'};
  if(p.decal.paid===true){p.decal.mobilisationPaid=true;p.decal.performancePaid=true;p.decal.legacyPaid=true}
  const i=modules.properties.indexOf(p);if(p.parcel===undefined){p.parcel=cadParcel(p,i);p.beacons=p.parcel?p.parcel.map((_,b)=>'SC/'+(p.lga.slice(0,3).toUpperCase())+'/'+String(4100+i*4+b)):[];p.surveyPlan=p.parcel?'LS/D/'+p.lga.slice(0,3).toUpperCase()+'/'+String(2200+i*13):''}p.gps||=cadGps(p,i);p.webhooks||=[];p.identityChecks||=[];p.broadcasts.forEach(b=>{b.status=b.status==='Draft · not sent'?'Not sent · legacy draft':b.status});
  p.decal.mobilisationPaid||=false;p.decal.performancePaid||=false;p.decal.gpsLocked||=false;p.decal.gatePhoto||='';
 });
 modules.cadastreVersion=CAD_VERSION;saveModules();
}
Object.assign(ui,{cadastreLga:CAD_LGAS.includes(ui.cadastreLga)?ui.cadastreLga:'All LGAs',cadastreStage:'All stages',cadastreLagis:'All LAGIS states'});

