/* MOD-09 practice workflow gates, not legal advice or authenticated executive authorisation. */
const MARKET_NOTICE_HOURS=48;
const MARKET_WORK_ROLES=['management','admin','operations','enforcement'];
const MARKET_ORDER_ROLES=['management','admin'];
const marketDeadline=served=>new Date(Date.parse(served)+MARKET_NOTICE_HOURS*3600000).toISOString();
const marketNoticeExpired=(c,now)=>!!c.notice?.served&&Number.isFinite(Date.parse(c.notice.served))&&Date.parse(now)>=Date.parse(c.notice.served)+MARKET_NOTICE_HOURS*3600000;
const marketOrderGaps=(c,now)=>[!marketNoticeExpired(c,now)&&'The served 48-hour notice has not expired',c.inspection?.result!=='Failed'&&'Record a failed reinspection',(!c.inspection?.at||Date.parse(c.inspection.at)<Date.parse(c.notice?.served)+MARKET_NOTICE_HOURS*3600000)&&'Reinspect after the notice deadline',!c.notice?.proof&&'Notice service evidence is missing'].filter(Boolean);
const marketCordonGaps=c=>[!c.order?.ref&&'A reviewed signed Commissioner order is required',c.stage!=='Order recorded'&&'The market is not awaiting a cordon'].filter(Boolean);
const marketReopenGaps=c=>[c.stage!=='Sealed'&&'The market is not sealed',!c.accord?.ref&&'A market association accord is required',c.inspection?.result!=='Passed'&&'A passed reopening inspection is required',(!c.inspection?.at||Date.parse(c.inspection.at)<=Date.parse(c.cordon?.at))&&'Inspect after sealing',!c.reopenOrder?.ref&&'A reviewed reopening order is required'].filter(Boolean);
const marketDistinctReviewer=(actor,reviewer)=>!!reviewer?.trim()&&reviewer.trim().toLowerCase()!==actor.trim().toLowerCase();