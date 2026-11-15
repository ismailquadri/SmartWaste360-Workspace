import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/fleet-guard-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
describe('MOD-02 corridor safeguards',()=>{
 it('flags an unsealed valve only while moving on a Tier-1 corridor',()=>{expect(r.valveBreach({corridor:'Third Mainland Bridge',moving:true,valve:'Unsealed'})).toBe(true);expect(r.valveBreach({corridor:'Third Mainland Bridge',moving:false,valve:'Unsealed'})).toBe(false);expect(r.valveBreach({corridor:'Agege Motor Road',moving:true,valve:'Unsealed'})).toBe(false)});
 it('requires a heavy tow within 15 minutes',()=>{expect(r.towState({at:600,arrived:null},615)).toBe('Tow due in 0 min');expect(r.towState({at:600,arrived:null},616)).toBe('Tow overdue');expect(r.towState({at:600,arrived:615},620)).toBe('Cleared within SLA');expect(r.towState({at:600,arrived:616},620)).toBe('Cleared late')});
 it('holds settlement after more than 15 minutes of signal loss until yard clearance',()=>{expect(r.telemetryFreeze({lastSignal:600},615)).toBe(false);expect(r.telemetryFreeze({lastSignal:600},616)).toBe(true);expect(r.telemetryFreeze({lastSignal:600,yardCleared:true},700)).toBe(false);expect(r.telemetryFreeze({lastSignal:1430},5)).toBe(false)});
 it('allows transshipment only during a rainfall advisory',()=>{const d={feeder:'Ikotun Rd',keke:'KEKE-031',unpaved:true};expect(r.transshipError(d,false)).toMatch(/rainfall/);expect(r.transshipError(d,true)).toBe('')});
 it('gives an emergency detour 30 minutes before a penalty flag',()=>{expect(r.panicState({at:600},630)).toBe('Grace · 0 min left');expect(r.panicState({at:600},631)).toBe('Penalty flag');expect(r.panicState({at:600,verified:true},700)).toBe('Verified');expect(r.panicVerifyError({incident:'LASTMA-1234'})).toBe('');expect(r.panicVerifyError({incident:'X'})).not.toBe('')});
 it('accepts a Section 71 pass only for its vehicle, manifest and date',()=>{const p:{manifest:string;vehicle:string;date:string;token?:string}={manifest:'MAN-201',vehicle:'LAG-512-KJA',date:'2026-11-14'};p.token=r.passToken(p.manifest,p.vehicle,p.date);expect(r.passCheck(p.token,p,'2026-11-14')).toBe('');expect(r.passCheck(p.token,p,'2026-11-15')).not.toBe('');expect(r.passCheck(r.passToken('MAN-202',p.vehicle,p.date),p,'2026-11-14')).not.toBe('');expect(r.passCheck(p.token,{...p,revoked:true},'2026-11-14')).toBe('Pass revoked.')});
});
