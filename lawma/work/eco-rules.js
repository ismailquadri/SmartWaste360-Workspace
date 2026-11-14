/* MOD-07 proposed water-quality rules. Sample limits only; LASEPA, Lagos State Water Regulatory Commission and Ministry of Health must confirm. */
const WATER_LIMITS={Lead:0.01,Arsenic:0.01,Cadmium:0.003,BOD:10,COD:40};
const DO_MIN=2;
const PUMP_UPTIME_MIN=0.9;
const PLUME_RATIO=2;
const ECO_ROLES=['management','operations','auditor','admin'];
const exceedances=s=>Object.keys(WATER_LIMITS).filter(k=>s[k]!=null&&s[k]>WATER_LIMITS[k]);
const exceedFactor=(k,v)=>Math.round(v/WATER_LIMITS[k]*10)/10;
const lagoonAlerts=l=>[l.do<DO_MIN&&'Dissolved oxygen below '+DO_MIN+' mg/L',l.uptime<PUMP_UPTIME_MIN&&'Aerator pump uptime below '+(PUMP_UPTIME_MIN*100)+'%'].filter(Boolean);
const wellAlertConfirmed=samples=>{if(samples.length<2)return false;const a=samples.at(-2),b=samples.at(-1),shared=exceedances(a).some(k=>exceedances(b).includes(k)),at=a.at||a.date,bt=b.at||b.date;return shared&&(!at||!bt||Date.parse(bt)-Date.parse(at)>=24*3600000)};
const landfillAttributable=(down,up,k)=>up?.[k]>0&&down[k]/up[k]>=PLUME_RATIO;
const ECO_RETEST_HOURS=24;
const ecoRetestDue=at=>new Date(new Date(at).getTime()+ECO_RETEST_HOURS*3600000).toISOString();
const ecoReferralBlocks=(referrals,batch)=>referrals.filter(r=>r.batch===batch&&r.paymentHold&&!r.closed).map(r=>'Water investigation '+r.id+' · payment held for review');
