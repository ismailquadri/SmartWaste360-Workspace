/* Illustrative polygons and operating limits; not surveyed channels or statutory deadlines. */
const DRAIN_NOTICE_HOURS=48;
const DRAIN_ALERT_HOURS=24;
const DRAIN_ROLES=['management','admin','operations','care','enforcement'];
const drainInside=(p,ring)=>{if(!Array.isArray(p)||p.length!==2||!p.every(Number.isFinite))return false;let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];const cross=(p[0]-a[0])*(b[1]-a[1])-(p[1]-a[1])*(b[0]-a[0]);if(Math.abs(cross)<1e-10&&p[0]>=Math.min(a[0],b[0])&&p[0]<=Math.max(a[0],b[0])&&p[1]>=Math.min(a[1],b[1])&&p[1]<=Math.max(a[1],b[1]))return true;if((a[1]>p[1])!==(b[1]>p[1])&&p[0]<(b[0]-a[0])*(p[1]-a[1])/(b[1]-a[1])+a[0])inside=!inside}return inside};
const drainAlertActive=(a,now)=>Date.parse(a.issued)<=Date.parse(now)&&Date.parse(now)<Date.parse(a.expires);
const drainClockState=(alerts,cases,now)=>JSON.stringify([alerts.map(a=>[a.id,drainAlertActive(a,now)]),cases.map(c=>[c.id,drainOverdue(c,now)])]);
const drainNoticeDue=served=>new Date(Date.parse(served)+DRAIN_NOTICE_HOURS*3600000).toISOString();
const drainOverdue=(c,now)=>!!c.notice&&!c.closed&&Date.parse(now)>=Date.parse(drainNoticeDue(c.notice.served));
const drainCloseGaps=c=>[!c.councilAck&&'Council acknowledgement is missing',!c.lawmaEvidence&&'LAWMA completion evidence is missing',!c.councilEvidence&&'Council completion evidence is missing',!c.verified&&'Joint completion review is missing'].filter(Boolean);
const drainResourceFree=(resource,jobs)=>!jobs.some(j=>j.status!=='Completed'&&(j.skip===resource||j.team===resource));