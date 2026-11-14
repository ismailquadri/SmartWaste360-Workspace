/* Practice compliance gates. No claim of NDPC/NITDA certification or actual hosting residency. */
const INFRA_HEARTBEAT_MAX_SEC=120;
const INFRA_ROLES=['management','admin'];
const infraResidencyGaps=r=>[r.primary!=='Nigeria'&&'Primary data outside Nigeria',r.replica!=='Nigeria'&&'Replica outside Nigeria',r.backup!=='Nigeria'&&'Backup outside Nigeria',!r.inventory&&'Data inventory evidence missing',!r.ndpc&&'NDPC review evidence missing',!r.nitda&&'NITDA review evidence missing'].filter(Boolean);
const infraSiteState=(s,now)=>s.status!=='Online'?'Unavailable':!Number.isFinite(Date.parse(s.last))||Date.parse(now)-Date.parse(s.last)<0||Date.parse(now)-Date.parse(s.last)>INFRA_HEARTBEAT_MAX_SEC*1000?'Stale':s.lag>30?'Replication delayed':'Healthy';
const infraPairState=(sites,now)=>sites.every(s=>infraSiteState(s,now)==='Healthy')?'Dual-site healthy':sites.some(s=>infraSiteState(s,now)==='Healthy')?'Degraded · single healthy site':'No healthy site';
const infraClockState=(sites,now)=>JSON.stringify(sites.map(s=>[s.id,infraSiteState(s,now)]));
const infraMonthlyProvision=cost=>Math.round(cost/60);
const infraBookValue=(cost,months)=>Math.max(0,Math.round(cost*(1-Math.min(60,Math.max(0,months))/60)));