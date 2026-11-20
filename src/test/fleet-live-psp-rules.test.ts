import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {describe,it,expect} from 'vitest';
const read=(f:string)=>readFileSync(resolve(__dirname,'../../lawma/work/'+f),'utf8');
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const f=new Function(read('fleet-live-rules.js')+';return {FL_COUNT,FL_BLOCK_RADIUS_M,FL_SITES,FL_CAUSES,flDist,flNearest,flAdvance,flApproach,flImpact,flBlockadeError}')() as any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const p=new Function(read('psp-profile-rules.js')+';return {PSP_STRONG,PSP_WATCH,PSP_NAMES,pspScore,pspBand,pspActions,pspRank,pspActionError,pspNoise}')() as any;
const routes=JSON.parse(read('alimosho-routes.json'));
describe('Alimosho live fleet simulation',()=>{
 it('runs more than 100 sample trucks on road-aligned Alimosho corridors',()=>{expect(f.FL_COUNT).toBeGreaterThan(100);expect(routes.length).toBeGreaterThanOrEqual(10);expect(routes.every((r:{name:string;coordinates:unknown[]})=>r.name==='Alimosho'&&r.coordinates.length>100)).toBe(true)});
 it('moves along a route and turns around at the ends',()=>{const a=f.flAdvance(.5,1,36,10,1000);expect(a.fraction).toBeCloseTo(.6);const b=f.flAdvance(.98,1,36,10,1000);expect(b.dir).toBe(-1);expect(b.fraction).toBeCloseTo(.92)});
 it('holds a truck only when the blockade is ahead within 250 m',()=>{expect(f.FL_BLOCK_RADIUS_M).toBe(250);expect(f.flApproach(.5,1,.52,10000,250)).toBe('held');expect(f.flApproach(.5,-1,.52,10000,250)).toBe('clear');expect(f.flApproach(.5,1,.6,10000,250)).toBe('clear')});
 it('finds blockade sites on at least one Alimosho corridor',()=>{for(const s of f.FL_SITES)expect(routes.some((r:{coordinates:number[][]})=>f.flNearest(r.coordinates,s.coord).dist<=250)).toBe(true)});
 it('validates blockade duration, cause and duplicates',()=>{expect(f.flBlockadeError({site:'BLK-IYANA',cause:'Flooding',minutes:10},[])).toMatch(/15 and 720/);expect(f.flBlockadeError({site:'BLK-IYANA',cause:'Flooding',minutes:90},[{site:'BLK-IYANA',status:'Active'}])).toMatch(/already active/);expect(f.flBlockadeError({site:'BLK-IYANA',cause:'Flooding',minutes:90},[])).toBe('')});
 it('summarises held trucks, PSPs and remaining stops',()=>{expect(f.flImpact([{partnerId:'A',planned:10,reported:4},{partnerId:'A',planned:5,reported:5},{partnerId:'B',planned:8,reported:0}])).toEqual({held:3,psps:2,stops:14,delayMin:23})});
});
describe('PSP performance profiles',()=>{
 it('weights the composite score and bands at 80 and 65',()=>{const m={completion:90,onTime:80,csat:70,remittance:100,fleetAvailability:60};expect(p.pspScore(m)).toBe(81);expect(p.pspBand(80)).toBe('Strong');expect(p.pspBand(65)).toBe('Watch');expect(p.pspBand(64)).toBe('Cure review')});
 it('suggests actions only for breached thresholds',()=>{const ok={completion:90,onTime:90,csat:80,remittance:95,fleetAvailability:90,openComplaints:3,turnaround:60};expect(p.pspActions(ok)).toEqual([]);expect(p.pspActions({...ok,csat:45,fleetAvailability:70}).map((a:{key:string})=>a.key)).toEqual(['csat','fleet'])});
 it('ranks PSPs by score and needs a second official to approve actions',()=>{expect(p.pspRank([{id:'B',score:70},{id:'A',score:90}]).map((r:{id:string;rank:number})=>r.id+r.rank)).toEqual(['A1','B2']);expect(p.pspActionError({status:'Proposed'},'Ada','Ada')).toMatch(/second/);expect(p.pspActionError({status:'Proposed'},'Ada','Bayo')).toBe('')});
 it('keeps sample metrics inside their ranges as they drift',()=>{for(let t=0;t<200;t+=7){const v=p.pspNoise('PAR-001','csat',38,90,t);expect(v).toBeGreaterThanOrEqual(38);expect(v).toBeLessThanOrEqual(90)}expect(p.PSP_NAMES).toHaveLength(18)});
});
