/* Proposed detention rehearsal thresholds, not legal authority or real custody control. */
const KD_ESCALATE_HOURS=18;
const KD_ALARM_HOURS=20;
const KD_REQUIRE_HOURS=24;
const kdHours=(d,now)=>(now-Date.parse(d.arrestAt))/3600000;
const kdTimeValid=(d,now)=>Number.isFinite(kdHours(d,now))&&kdHours(d,now)>=0;
const kdState=(d,now)=>!d.detention?'Custody not confirmed':d.detention.outcome?d.detention.outcome.kind:!kdTimeValid(d,now)?'Arrest time requires review':kdHours(d,now)>=KD_REQUIRE_HOURS?'Release or video arraignment required':kdHours(d,now)>=KD_ALARM_HOURS?'20-hour detention alarm':kdHours(d,now)>=KD_ESCALATE_HOURS?'Sev-1 · detention escalation':'Detention review pending';
const kdMilestones=(d,now)=>!d.detention||!kdTimeValid(d,now)?[]:[{hour:KD_ESCALATE_HOURS,label:'Sev-1 · detention escalation'},{hour:KD_ALARM_HOURS,label:'20-hour detention alarm'},{hour:KD_REQUIRE_HOURS,label:'Release or video arraignment required'}].filter(m=>kdHours(d,d.detention.outcome?Date.parse(d.detention.outcome.at):now)>=m.hour);
const kdOutcomeError=(d,kind,ref,official,now)=>!d?.detention?'Confirm the dummy custody record first':d.detention.outcome?'An outcome is already recorded':!kdTimeValid(d,now)?'Review the original arrest time before recording an outcome':!['Released on recognizance','Video arraignment recorded'].includes(kind)?'Choose release or video arraignment':!String(ref||'').trim()||!String(official||'').trim()?'Add the evidence reference and responsible official':'';
const kdCaseBlocked=(dockets,id,now)=>dockets.some(d=>d.case===id&&d.detention&&!d.detention.outcome&&(!kdTimeValid(d,now)||kdHours(d,now)>=KD_REQUIRE_HOURS));