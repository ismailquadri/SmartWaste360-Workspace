/* MOD-02 stakeholder corridor safeguards. Proposed sample rules only; LAWMA, LASTMA and MEWR approval required. */
const TIER1_CORRIDORS=['Third Mainland Bridge','Lekki-Epe Expressway','Eko Bridge','Ikorodu Road'];
const TOW_SLA_MINUTES=15;
const TELEMETRY_FREEZE_MINUTES=15;
const PANIC_GRACE_MINUTES=30;
const PASS_PREFIX='S71';
const minsSince=(from,now)=>((now-from)%1440+1440)%1440;
const valveBreach=v=>TIER1_CORRIDORS.includes(v.corridor)&&v.moving&&v.valve!=='Sealed';
const towState=(b,now)=>!b?'':b.arrived!=null?(minsSince(b.at,b.arrived)<=TOW_SLA_MINUTES?'Cleared within SLA':'Cleared late'):minsSince(b.at,now)>TOW_SLA_MINUTES?'Tow overdue':'Tow due in '+(TOW_SLA_MINUTES-minsSince(b.at,now))+' min';
const towNeeded=corridor=>TIER1_CORRIDORS.includes(corridor);
const telemetryFreeze=(v,now)=>!v.yardCleared&&(v.signalAt?Date.now()-Date.parse(v.signalAt)>TELEMETRY_FREEZE_MINUTES*60000:v.lastSignal!=null&&minsSince(v.lastSignal,now)>TELEMETRY_FREEZE_MINUTES);
const transshipError=(d,alertActive)=>!alertActive?'Transshipment is only allowed while a rainfall advisory is active.':!d.feeder?'Name the paved feeder point where the compactor waits.':!d.keke?'Pair at least one Keke Waste tricycle.':!d.unpaved?'Confirm the interior streets are unpaved and unsafe for the compactor.':'';
const panicState=(p,now)=>!p?'':p.verified?'Verified':minsSince(p.at,now)>PANIC_GRACE_MINUTES?'Penalty flag':'Grace · '+(PANIC_GRACE_MINUTES-minsSince(p.at,now))+' min left';
const panicVerifyError=d=>!/^LASTMA-\d{4,}$/.test(d.incident||'')&&!d.photo?'Add a LASTMA incident reference or a photo evidence reference.':'';
const passToken=(manifest,vehicle,date)=>{let h=7;for(const c of manifest+'|'+vehicle+'|'+date)h=(h*31+c.charCodeAt(0))>>>0;return PASS_PREFIX+'-'+h.toString(36).toUpperCase().padStart(7,'0').slice(-7)};
const passCheck=(token,pass,date)=>!pass?'No pass issued for this vehicle.':pass.revoked?'Pass revoked.':pass.date!==date?'Pass is not valid today.':token!==passToken(pass.manifest,pass.vehicle,pass.date)?'Code does not match. Treat as invalid.':'';
