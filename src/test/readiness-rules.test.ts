import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const source=readFileSync(resolve(__dirname,'../../lawma/work/readiness-rules.js'),'utf8');
const names=[...source.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(source+`;return {${names.join(',')}}`)() as any;
describe('staff-readiness rehearsal safeguards',()=>{
 it('preserves rainfall and hosting edits from two tabs',()=>{const b={alerts:[],hosting:{ref:''}},a={alerts:[{id:'A1',ref:'RAIN'}],hosting:{ref:''}},c={alerts:[],hosting:{ref:'NDPC'}};expect(r.mergePracticeState(b,a,c)).toEqual({alerts:[{id:'A1',ref:'RAIN'}],hosting:{ref:'NDPC'}})});
 it('rejects two conflicting edits to the same record',()=>expect(()=>r.mergePracticeState({x:1},{x:2},{x:3})).toThrow('Another tab'));
 it('rejects invalid coordinates',()=>{expect(r.practiceGpsValid([NaN,3.35])).toBe(false);expect(r.practiceGpsValid([91,3.35])).toBe(false);expect(r.practiceGpsValid([6.55,3.35])).toBe(true)});
 it('blocks court progression until the linked force report exists',()=>{expect(r.forceReportMissing([{case:'MC-202',force:'Minimal',report:''}],'MC-202')).toBe(true);expect(r.forceReportMissing([{case:'MC-202',force:'Minimal',report:'Reviewed incident'}],'MC-202')).toBe(false)});
 it('blocks Solous aliases when methane reaches stop',()=>{expect(r.practiceSiteStopped('Solous dumpsite',[{site:'Solous II',value:2.8}],(s:{value:number})=>s.value>=2.5?'Stop':'Normal')).toBe(true)});
 it('pays only eligible linked tickets and never the superseded original',()=>{const ts=[{id:'A',net:8800,held:false},{id:'B',net:13700,held:true},{id:'C',net:9000,held:false,supersededBy:'D'}];expect(r.eligibleBatchWeights({ticketIds:['A','B','C']},ts,(t:unknown)=>t)).toEqual({eligible:8.8,excluded:13.7,total:22.5,ids:['A','B']})});
 it('requires today’s unconsumed burn reservation',()=>{const m={id:'CM-7001',stage:'Received',received:180},p={status:'Running'},b={manifest:'CM-7001',date:'2026-11-14',status:'Reserved',kg:180};expect(r.burnReservationError(m,p,[],'2026-11-14')).toContain('Reserve');expect(r.burnReservationError(m,p,[b],'2026-11-14')).toBe('');expect(r.burnReservationError(m,p,[{...b,status:'Consumed'}],'2026-11-14')).toContain('Reserve')});
 it('requires a distinct normalized official identity',()=>{expect(r.distinctOfficials('Officer A',' officer  a ')).toBe(false);expect(r.distinctOfficials('Officer A','Officer B')).toBe(true)});
 it('prevents double allocation of a bank alert',()=>{expect(r.accountAllocationError({signatureOk:true,result:'Applied'},'D1',[{duid:'D1'}])).toContain('already applied');expect(r.accountAllocationError({signatureOk:true,result:'Held'},'D1',[{duid:'D1'}])).toBe('')});
 it('rejects deletion conflicting with another tab’s update',()=>{expect(()=>r.mergePracticeState([{id:'A',value:1}],[],[{id:'A',value:2}])).toThrow('Another tab')});
 it('blocks burn after a daily capacity reduction',()=>expect(r.burnReservationError({id:'M1',stage:'Received',received:180},{status:'Running',capacityKg:100},[{manifest:'M1',date:'2026-11-14',kg:180,status:'Reserved'}],'2026-11-14')).toContain('Daily capacity exceeded'));
 it('blocks burning before the manifest is received',()=>expect(r.burnReservationError({id:'M1',stage:'Collected'},{status:'Running'},[],'2026-11-14')).toContain('Receive'));
});