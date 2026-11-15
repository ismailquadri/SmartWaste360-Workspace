import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/scale-guard-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
describe('MOD-03 stakeholder dummy safeguards',()=>{
 it('alerts beyond 180 seconds and requests towing at 300 seconds',()=>{const d={at:new Date(0).toISOString()};expect(r.sgDeckState(d,180000)).toBe('Deck occupied');expect(r.sgDeckState(d,181000)).toBe('Traffic controller alerted');expect(r.sgDeckState(d,300000)).toBe('Heavy tow requested');expect(r.sgDeckState({...d,authorized:true},300000)).toBe('Authorized weigh cycle')});
 it('keeps the proposed surcharge at 150000 and exclusion at 30 days',()=>{expect(r.SG_OBSTRUCTION_NAIRA).toBe(150000);expect(r.SG_DELIST_DAYS).toBe(30)});
 it('diverts only to a certified available lane within 1.5 percent',()=>{const l={site:'Solous',available:true,test:20000,reading:20300,cert:'DUMMY'};expect(r.sgDiversion('Solous',[l])).toEqual(l);expect(r.sgDiversion('Solous',[{...l,reading:20301}])).toBe(null);expect(r.sgLaneHealthy({...l,cert:''})).toBe(false)});
 it('advances exactly 60 percent and offsets it without double payment',()=>{expect(r.sgAdvanceAmount(100000)).toBe(60000);expect(r.sgTrueUp(100000,60000)).toEqual({remaining:40000,recoverable:0});expect(r.sgTrueUp(50000,60000)).toEqual({remaining:0,recoverable:10000})});
 it('requires calibration-only holds, no backup and evidenced 90-day baseline',()=>{const b={status:'Draft'},ts=[{site:'Solous',calibrationHeld:true}],h={days:90,net:100000,evidence:'HISTORY'};expect(r.sgAdvanceError(b,ts,[],h,null)).toBe(null);expect(r.sgAdvanceError(b,ts,[],{...h,days:30},null)).toContain('90-day');expect(r.sgAdvanceError(b,[{...ts[0],calibrationHeld:false}],[],h,null)).toContain('calibration only');expect(r.sgAdvanceError(b,ts,[],h,{})).toContain('already exists')});
 it('classifies the entire enterprise or mixed load as commercial',()=>{expect(r.sgEnterpriseClass({parcelZone:'Industrial',account:'Domestic'})).toBe('Commercial');expect(r.sgEnterpriseClass({mixedLoad:true,account:'Domestic'})).toBe('Commercial');expect(r.sgEnterpriseClass({residentialId:'RES-CAD-1',residentialRoute:'R-1',account:'Domestic'})).toBe('Domestic')});
 it('uses local rainfall and gives no allowance for wash bypass',()=>{expect(r.sgWashAllowance(7,45,false,false)).toBe(600);expect(r.sgWashAllowance(7,6,false,false)).toBe(250);expect(r.sgWashAllowance(7,45,false,true)).toBe(0);expect(r.sgWashAllowance(7,45,true,false)).toBe(0)});
});