import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/market-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const c={stage:'Remediation failed',notice:{served:'2026-11-14T10:00:00Z',proof:'DUMMY-SERVICE'},inspection:{result:'Failed',at:'2026-11-16T10:00:00Z'}};
describe('MOD-09 market governance practice gates',()=>{
 it('starts exactly 48 hours at recorded service',()=>{expect(r.marketDeadline(c.notice.served)).toBe('2026-11-16T10:00:00.000Z');expect(r.marketNoticeExpired(c,'2026-11-16T09:59:59Z')).toBe(false);expect(r.marketNoticeExpired(c,'2026-11-16T10:00:00Z')).toBe(true);expect(r.marketNoticeExpired({},'2026-11-16T10:00:00Z')).toBe(false)});
 it('requires service proof and a failed reinspection after the deadline',()=>{expect(r.marketOrderGaps(c,'2026-11-16T10:00:00Z')).toEqual([]);expect(r.marketOrderGaps({...c,inspection:{result:'Failed',at:'2026-11-15T10:00:00Z'}},'2026-11-16T10:00:00Z')).toContain('Reinspect after the notice deadline');expect(r.marketOrderGaps({...c,notice:{...c.notice,proof:''}},'2026-11-16T10:00:00Z')).toContain('Notice service evidence is missing');expect(r.marketOrderGaps({...c,inspection:{...c.inspection,result:'Passed'}},'2026-11-16T10:00:00Z')).toContain('Record a failed reinspection')});
 it('requires a reviewed Commissioner order before KAI locks out a market',()=>{expect(r.marketCordonGaps({stage:'Order recorded',order:{ref:'DUMMY-ORDER'}})).toEqual([]);expect(r.marketCordonGaps({stage:'Remediation failed'})).toHaveLength(2)});
 it('requires an accord, passed post-sealing inspection and reopening order',()=>{const sealed={stage:'Sealed',cordon:{at:'2026-11-16T12:00:00Z'},accord:{ref:'DUMMY-ACCORD'},inspection:{result:'Passed',at:'2026-11-17T12:00:00Z'},reopenOrder:{ref:'DUMMY-REOPEN'}};expect(r.marketReopenGaps(sealed)).toEqual([]);expect(r.marketReopenGaps({...sealed,accord:null})).toContain('A market association accord is required');expect(r.marketReopenGaps({...sealed,reopenOrder:null})).toContain('A reviewed reopening order is required');expect(r.marketReopenGaps({...sealed,inspection:{result:'Passed',at:'2026-11-15T12:00:00Z'}})).toContain('Inspect after sealing')});
 it('does not let the recording officer act as their own legal reviewer',()=>{expect(r.marketDistinctReviewer('Officer A',' officer a ')).toBe(false);expect(r.marketDistinctReviewer('Officer A','Officer B')).toBe(true)});
 it('allows LAWMA operations to record field outcomes but not executive orders',()=>{expect(r.MARKET_WORK_ROLES).toContain('enforcement');expect(r.MARKET_ORDER_ROLES).toEqual(['management','admin']);expect(r.MARKET_WORK_ROLES).not.toContain('partner')});
});