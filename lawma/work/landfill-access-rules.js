/* Dummy recovery and access policy; no physical dispatch or gate control. */
const LA_TOW_FEE=0;
const LA_D8_MIN=2;
const laRecoveryReady=machines=>machines.filter(m=>m.ready&&m.operatorReady&&m.type==='D8').length>=LA_D8_MIN;
const laTowError=(machines,machine,open,truck)=>!laRecoveryReady(machines)?'Two ready D8 recovery machines and operators are required':!machines.some(m=>m.id===machine&&m.ready&&m.operatorReady)?'Selected recovery machine is unavailable':open.some(t=>t.status!=='Completed'&&(t.truck===truck||t.machine===machine))?'Truck or recovery machine already has an open recovery':null;
const laSweepClear=s=>!!s&&s.magnet&&s.manual&&s.bar&&s.clear;
const laTowCompleteError=(t,fee,ref)=>t?.status!=='Dispatched'?'Recovery is not dispatched':Number(fee)!==LA_TOW_FEE?'Recovery must be zero cash: no charge or reimbursement':!String(ref||'').trim()?'Recovery confirmation evidence is required':null;
const LA_REVERIFY_DAYS=30;
const laVerificationDue=(at,now)=>!at||!Number.isFinite(Date.parse(at))||Date.parse(at)>new Date(now).getTime()||new Date(now).getTime()-Date.parse(at)>=LA_REVERIFY_DAYS*86400000;
const laBayClear=(b,day)=>!!b&&b.inspection?.day===day&&b.inspection.covered&&b.inspection.separated&&b.inspection.safe&&b.inspection.dry;
const laBayRoom=(bay,gate)=>Math.max(0,bay.capacity-gate.filter(g=>g.admitted&&!g.out&&g.bay===bay.id).length);
const laAccessRefusals=(p,c)=>[!c.identity&&'Pass identity does not match',c.mode==='Wristband'&&laVerificationDue(p.lastVerified,c.now)&&'30-day fingerprint re-verification required',!c.valid&&'Pass expired or suspended',c.age<18&&'Under 18: entry prohibited',!c.ppe&&'No boots, gloves and reflective vest',(c.hour<7||c.hour>=18)&&'Outside picking hours (07:00–18:00)',!c.baySafe&&'Off-face bay is not cleared for today',c.room<=0&&'Sorting bay capacity reached',c.onSite&&'Pass is already admitted; record exit first'].filter(Boolean);