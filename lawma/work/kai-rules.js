/* MOD-06 proposed enforcement rules. Sample only; LAWMA legal, KAI command and the Mobile Court registry must approve. */
const KAI_SECTORS=['Oshodi','Alausa','Alaba','Ikeja','Lagos Island','Apapa','Surulere','Mushin','Ikorodu','Lekki','Agege','Badagry'];
const GPS_MATCH_M=200;
const DEMURRAGE_PER_DAY={Car:5000,Tricycle:2000,Truck:20000,Bus:10000};
const FREE_HOURS=24;
const COMMUNITY_SERVICE_MAX_HOURS=72;
const KAI_ROLES=['management','enforcement','admin'];
const gpsDistanceM=(a,b)=>{const R=6371000,r=x=>x*Math.PI/180,dLat=r(b[0]-a[0]),dLng=r(b[1]-a[1]),h=Math.sin(dLat/2)**2+Math.cos(r(a[0]))*Math.cos(r(b[0]))*Math.sin(dLng/2)**2;return Math.round(2*R*Math.asin(Math.sqrt(h)))};
const validEvidenceGps=p=>Array.isArray(p)&&p.length===2&&p.every(Number.isFinite)&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180;
const evidenceGaps=e=>[!(e.cctv||e.bodycam)&&'No CCTV or bodycam footage',!Number.isFinite(Date.parse(e.timestamp))&&'No valid device timestamp',!validEvidenceGps(e.gps)&&'Invalid officer GPS',!validEvidenceGps(e.scene)&&'Invalid scene GPS',validEvidenceGps(e.gps)&&validEvidenceGps(e.scene)&&gpsDistanceM(e.gps,e.scene)>GPS_MATCH_M&&'Officer GPS more than 200 m from the scene',!e.hash&&'No file fingerprint (hash)'].filter(Boolean);
const sec84Ready=e=>evidenceGaps(e).length===0&&!!e.custodian;
const interceptionNeedsReport=i=>i.force!=='None'||!!i.injury;
const chargeReady=c=>!!c.offence&&!!c.evidenceCertified&&!c.reportMissing;
const pleaNext=plea=>plea==='Guilty'?'Sentence':plea==='Not guilty'?'Hearing':'Plea';
const sentenceValid=(s,fineRange)=>s.kind==='Fine'?s.amount>=fineRange[0]&&s.amount<=fineRange[1]:s.kind==='Community service'?s.hours>0&&s.hours<=COMMUNITY_SERVICE_MAX_HOURS:s.kind==='Discharged';
const demurrageDays=(inAt,outAt)=>{const h=(new Date(outAt)-new Date(inAt))/3600000;return h<=FREE_HOURS?0:Math.ceil((h-FREE_HOURS)/24)};
const demurrageFee=(cls,inAt,outAt)=>demurrageDays(inAt,outAt)*(DEMURRAGE_PER_DAY[cls]||DEMURRAGE_PER_DAY.Car);
const releaseRefusals=(v,d)=>[d.chassis.trim().toUpperCase()!==v.chassis&&'Chassis number does not match the towing slip',!v.courtCleared&&'Court case not closed',!d.paid&&'Demurrage not paid'].filter(Boolean);
