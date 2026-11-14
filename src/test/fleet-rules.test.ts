import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/fleet-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const m={type:'Compactor',swaps:[]},sb={type:'Compactor',status:'Standby'},ok={reason:'Flat tyre',evidence:'DEP-1',supervisor:true};
describe('MOD-02 fleet rules',()=>{
 it('runs commercial 22:00–05:00 and residential 08:30–15:30',()=>{expect(r.shiftFits('Commercial','23:00')).toBe(true);expect(r.shiftFits('Commercial','04:59')).toBe(true);expect(r.shiftFits('Commercial','05:00')).toBe(false);expect(r.shiftFits('Residential','08:30')).toBe(true);expect(r.shiftFits('Residential','08:29')).toBe(false);expect(r.shiftFits('Residential','15:30')).toBe(false)});
 it('locks manifests from 05:00 until 22:00',()=>{expect(r.manifestLocked(r.hhmm('04:59'))).toBe(false);expect(r.manifestLocked(r.hhmm('05:00'))).toBe(true);expect(r.manifestLocked(r.hhmm('21:59'))).toBe(true);expect(r.manifestLocked(r.hhmm('22:00'))).toBe(false)});
 it('allows a hot-swap only 05:00–06:00',()=>{expect(r.hotSwapCheck(m,sb,r.hhmm('05:30'),ok)).toBe('');expect(r.hotSwapCheck(m,sb,r.hhmm('06:00'),ok)).toMatch(/closed/);expect(r.hotSwapCheck(m,sb,r.hhmm('04:50'),ok)).toMatch(/closed/)});
 it('needs same type, reason, evidence, supervisor and only one swap',()=>{const t=r.hhmm('05:10');expect(r.hotSwapCheck(m,{...sb,type:'Keke'},t,ok)).toMatch(/same/);expect(r.hotSwapCheck(m,sb,t,{...ok,supervisor:false})).toMatch(/supervisor/);expect(r.hotSwapCheck(m,sb,t,{...ok,evidence:''})).toMatch(/evidence/);expect(r.hotSwapCheck({...m,swaps:[1]},sb,t,ok)).toMatch(/already/)});
 it('reroutes only with a LASTMA incident',()=>{expect(r.rerouteCheck({incident:'LASTMA-2041',confirmed:true})).toBe('');expect(r.rerouteCheck({incident:'traffic',confirmed:true})).not.toBe('')});
 it('flags fuel drops over 15 L while parked away from a pump',()=>{const a=[{minute:0,litres:100,speed:20},{minute:5,litres:58,speed:0,atPump:false}];expect(r.fuelAlerts(a)).toHaveLength(1);expect(r.fuelAlerts([a[0],{...a[1],litres:86}])).toHaveLength(0);expect(r.fuelAlerts([a[0],{...a[1],atPump:true}])).toHaveLength(0);expect(r.fuelAlerts([a[0],{...a[1],speed:30}])).toHaveLength(0)});
 it('verifies compaction at 120 bar',()=>{expect(r.compactionVerified([60,120])).toBe(true);expect(r.compactionVerified([60,119])).toBe(false)});
 it('counts Keke and skip pickups only with a matching scan within 30 m',()=>{const b={token:'BIN-1'};expect(r.proximityVerified({token:'BIN-1',metres:30},b)).toBe(true);expect(r.proximityVerified({token:'BIN-1',metres:31},b)).toBe(false);expect(r.proximityVerified({token:'BIN-2',metres:5},b)).toBe(false)});
 it('fills 4 trucks per 15-minute slot then moves to the next',()=>{const full=Array.from({length:4},()=>({site:'A',slot:600}));expect(r.nextSlot([],'A',593)).toBe(600);expect(r.nextSlot(full,'A',593)).toBe(615);expect(r.nextSlot(full,'B',593)).toBe(600)});
 it('holds trucks at source until release time',()=>{expect(r.releaseAt(600,55)).toBe(545);expect(r.corridorHold(500,545)).toBe(45);expect(r.corridorHold(560,545)).toBe(0)});
});
