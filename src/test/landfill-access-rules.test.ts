import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/landfill-access-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
describe('MOD-04 zero-cash recovery and sharps',()=>{
 it('requires at least two dedicated ready D8s and operators',()=>{const m={id:'1',type:'D8',ready:true,operatorReady:true};expect(r.laRecoveryReady([m])).toBe(false);expect(r.laRecoveryReady([m,{...m,id:'2'}])).toBe(true);expect(r.laRecoveryReady([m,{...m,id:'2',operatorReady:false}])).toBe(false)});
 it('permits only zero-cash completion, never a 15000 cash charge',()=>{expect(r.LA_TOW_FEE).toBe(0);expect(r.laTowCompleteError({status:'Dispatched'},15000,'R')).toContain('zero cash');expect(r.laTowCompleteError({status:'Dispatched'},0,'R')).toBe(null);expect(r.laTowCompleteError({status:'Completed'},0,'R')).not.toBe(null)});
 it('requires magnetic metal and manual glass clearance, not magnets alone',()=>{const s={bar:true,magnet:true,manual:true,clear:true};expect(r.laSweepClear(s)).toBe(true);for(const key of Object.keys(s))expect(r.laSweepClear({...s,[key]:false})).toBe(false)});
 it('does not dispatch a recovery machine or truck twice',()=>{const m=[{id:'1',type:'D8',ready:true,operatorReady:true},{id:'2',type:'D8',ready:true,operatorReady:true}];expect(r.laTowError(m,'1',[{machine:'1',truck:'AAA',status:'Dispatched'}],'BBB')).toContain('already');expect(r.laTowError(m,'1',[{machine:'1',truck:'AAA',status:'Completed'}],'BBB')).toBe(null)});
});
describe('MOD-04 off-face and dual-modal passes',()=>{
 it('requires fingerprint re-verification at exactly 30 days',()=>{const now='2026-11-14T07:00:00Z';expect(r.LA_REVERIFY_DAYS).toBe(30);expect(r.laVerificationDue('2026-10-15T07:00:00Z',now)).toBe(true);expect(r.laVerificationDue('2026-10-15T07:00:01Z',now)).toBe(false);expect(r.laVerificationDue(null,now)).toBe(true)});
 it('admits only with an independently cleared bay on the same date',()=>{const b={inspection:{day:'2026-11-14',covered:true,separated:true,safe:true,dry:true}};expect(r.laBayClear(b,'2026-11-14')).toBe(true);expect(r.laBayClear(b,'2026-11-15')).toBe(false);expect(r.laBayClear({...b,inspection:{...b.inspection,safe:false}},'2026-11-14')).toBe(false)});
 it('denies wristband entry after 30 days but allows valid fingerprint checks',()=>{const c={identity:true,valid:true,age:30,ppe:true,hour:7,baySafe:true,room:1,now:'2026-11-14T07:00:00Z'};expect(r.laAccessRefusals({lastVerified:'2026-10-15T07:00:00Z'},{...c,mode:'Wristband'})).toContain('30-day fingerprint re-verification required');expect(r.laAccessRefusals({}, {...c,mode:'Fingerprint'})).toEqual([])});
 it('retains age 18, PPE, identity, valid pass and 07–18 Lagos gates for both modes',()=>{const c={identity:true,valid:true,age:18,ppe:true,hour:7,baySafe:true,room:1,mode:'Fingerprint',now:'2026-11-14T07:00:00Z'};expect(r.laAccessRefusals({},c)).toEqual([]);for(const bad of [{age:17},{ppe:false},{identity:false},{valid:false},{hour:6},{hour:18},{baySafe:false},{room:0},{onSite:true}])expect(r.laAccessRefusals({}, {...c,...bad}).length).toBeGreaterThan(0)});
 it('counts actual admissions until exit, not mere gate attempts',()=>{const gate=[{bay:'B',admitted:true},{bay:'B',admitted:false},{bay:'B',admitted:true,out:'done'}];expect(r.laBayRoom({id:'B',capacity:1},gate)).toBe(0);expect(r.laBayRoom({id:'B',capacity:2},gate)).toBe(1)});
});