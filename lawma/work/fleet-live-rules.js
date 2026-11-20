/* Alimosho live-fleet simulation rules. Rehearsal figures only; not LAWMA telemetry, traffic data or dispatch policy. */
const FL_COUNT=120;
const FL_BLOCK_RADIUS_M=250;
const FL_STATES=['On route','Collecting','At facility','No signal','Breakdown','Held at blockade'];
const FL_PSPS=['PAR-008','PAR-017','PAR-003','PAR-012','PAR-005'];
const FL_SITES=[{id:'BLK-IYANA',name:'Lagos–Abeokuta Expressway · Iyana Ipaja',coord:[3.29162,6.61303]},{id:'BLK-EGBEDA',name:'Egbeda–Idimu Road · Egbeda junction',coord:[3.28771,6.59021]},{id:'BLK-IKOTUN',name:'Ikotun–Igando Road · Ikotun roundabout',coord:[3.2647,6.55036]},{id:'BLK-ABULE',name:'Lagos–Abeokuta Expressway · Abule Egba',coord:[3.29733,6.64496]},{id:'BLK-IPAJA',name:'Ipaja Road · Ipaja town',coord:[3.2617,6.61918]}];
const FL_CAUSES=['Road traffic crash','Flooding','Protest or gathering','Emergency road works','Security operation'];
const flDist=(a,b)=>{const R=6371000,t=Math.PI/180,dl=(b[1]-a[1])*t,dn=(b[0]-a[0])*t,h=Math.sin(dl/2)**2+Math.cos(a[1]*t)*Math.cos(b[1]*t)*Math.sin(dn/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const flNearest=(coords,p)=>coords.reduce((best,c,i)=>{const d=flDist(c,p);return d<best.dist?{index:i,dist:d}:best},{index:-1,dist:Infinity});
const flRouteFraction=(coords,index)=>{let total=0,upto=0;for(let i=1;i<coords.length;i++){const d=flDist(coords[i-1],coords[i]);total+=d;if(i<=index)upto+=d}return total?upto/total:0};
const flAdvance=(fraction,dir,speedKmh,seconds,distanceM)=>{let f=fraction+dir*(speedKmh*1000/3600)*seconds/Math.max(1,distanceM),d=dir;if(f>=1){f=2-f;d=-1}if(f<=0){f=-f;d=1}return {fraction:Math.min(1,Math.max(0,f)),dir:d}};
const flApproach=(fraction,dir,blockFraction,distanceM,radiusM)=>{const gap=(blockFraction-fraction)*dir*distanceM;return gap>0&&gap<=radiusM?'held':'clear'};
const flImpact=(vehicles)=>({held:vehicles.length,psps:[...new Set(vehicles.map(v=>v.partnerId))].length,stops:vehicles.reduce((n,v)=>n+Math.max(0,(v.planned||0)-(v.reported||0)),0),delayMin:vehicles.length?Math.round(15+vehicles.length*2.5):0});
const flBlockadeError=(b,active)=>!b.site?'Choose a blockade location.':!FL_CAUSES.includes(b.cause)?'Choose a recorded cause.':!(Number(b.minutes)>=15&&Number(b.minutes)<=720)?'Expected duration must be between 15 and 720 minutes.':active.some(x=>x.site===b.site&&x.status==='Active')?'A simulated blockade is already active at this location.':'';
