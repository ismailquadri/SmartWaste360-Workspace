/* Bill feedback, arrears escalation and QR payment bridge rules. Placeholders pending LAWMA confirmation. */
const BC_GOOD=75;
const BC_WATCH=50;
const BC_PSP_SHARE=80;
const bcAnswers=['YES','NO','NOT SURE'];
const bcCsatError=(b,d,rows)=>!b||b.status==='Voided'?'Select an active issued bill.':!bcAnswers.includes(d.answer)?'Choose YES, NO or NOT SURE from the returned stub.':!['Bank branch','Field officer'].includes(d.source)?'Name where the stub was returned.':!d.stub?.trim()?'Enter the LAWMA-copy stub reference.':rows.some(x=>x.bill===b.id)?'This bill already has a logged LAWMA-copy stub.':'';
const bcScore=rows=>{const total=rows.length,yes=rows.filter(x=>x.answer==='YES').length,no=rows.filter(x=>x.answer==='NO').length,unsure=total-yes-no,pct=total?Math.round(yes*100/total):null;return {total,yes,no,unsure,pct,band:total<5?'Too few stubs':pct>=BC_GOOD?'Good standing':pct>=BC_WATCH?'Performance watch':'Cure review recommended'}};
const bcCycles=b=>{const cycle=b.lines.reduce((s,x)=>s+x.rate,0)*b.months;return cycle>0?Math.floor(Math.max(0,b.totals.arrears-b.totals.credit)/cycle):0};
const bcStage=b=>{const c=bcCycles(b);return c>=3?'Section 18 final notice & court summons draft':c>=2?'Pre-sealing warning':c>=1?'Final demand notice':'Current'};
const bcSplit=kobo=>{const psp=Math.floor(kobo*BC_PSP_SHARE/100);return {psp,lawma:kobo-psp}};
const bcCheck=text=>{let h=2166136261;for(const c of String(text)){h^=c.codePointAt(0);h=Math.imul(h,16777619)>>>0}return h.toString(16).padStart(8,'0').toUpperCase()};
const bcPayload=b=>{const base=['LAWMA-DUMMY',b.id,b.property,b.periods.join('/'),b.totals.due,b.partner].join('|');return base+'|'+bcCheck(base)};
const bcVerify=(payload,b)=>!!b&&payload===bcPayload(b);
const bcNoticeError=(maker,reviewer,b)=>!b||b.status==='Voided'?'Select an active bill.':bcStage(b)==='Current'?'No arrears stage applies to this bill.':billReviewError(maker,reviewer);
