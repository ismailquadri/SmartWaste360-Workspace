/* Stakeholder proposal values for dummy rehearsals; no statutory authority asserted. */
const SG_DECK_SECONDS=180;
const SG_TOW_SECONDS=300;
const SG_OBSTRUCTION_NAIRA=150000;
const SG_DELIST_DAYS=30;
const SG_ADVANCE_RATE=0.6;
const sgDeckState=(d,now)=>d.cleared?'Cleared':d.authorized?'Authorized weigh cycle':now-new Date(d.at).getTime()>=SG_TOW_SECONDS*1000?'Heavy tow requested':now-new Date(d.at).getTime()>SG_DECK_SECONDS*1000?'Traffic controller alerted':'Deck occupied';
const sgLaneHealthy=l=>!!l&&l.available&&Number.isFinite(l.test)&&l.test>0&&Number.isFinite(l.reading)&&Math.abs(l.reading-l.test)/l.test<=0.015&&!!l.cert;
const sgDiversion=(site,lanes)=>lanes.find(l=>l.site===site&&sgLaneHealthy(l))||null;
const sgAdvanceAmount=baseline=>Math.round(baseline*SG_ADVANCE_RATE);
const sgTrueUp=(net,advance)=>({remaining:Math.max(0,net-advance),recoverable:Math.max(0,advance-net)});
const sgEnterpriseClass=t=>t.parcelZone==='Industrial'||t.parcelZone==='Commercial'||t.mixedLoad?'Commercial':t.residentialId&&t.residentialRoute&&!t.mixedLoad?'Domestic':t.account;
const sgWashAllowance=(month,rain,washed,bypass)=>bypass||washed||month<5||month>10?0:rain>=30?600:rain>=10?400:250;
const sgAdvanceError=(b,tickets,lanes,history,existing)=>!b||b.status==='Released'?'Batch is already released or missing':existing?'An advance already exists for this batch':!history||history.days!==90||!history.evidence||!(history.net>0)?'A reviewed 90-day route baseline is required':!tickets.length?'No linked tickets':tickets.some(t=>!t.calibrationHeld)?'All linked tickets must be held for calibration only':tickets.some(t=>sgDiversion(t.site,lanes))?'Use the available calibrated backup lane instead':null;