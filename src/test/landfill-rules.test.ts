import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/landfill-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const adult={dob:'1990-01-01',expires:'2026-12-31',zone:'Active face'};
const ok={biometric:true,ppe:true,hour:9,faceStatus:'Normal',now:'2026-11-14'};
describe('MOD-04 landfill rules',()=>{
 it('accepts drone surveys only within 5 cm error',()=>{expect(r.surveyAccepted({rmseCm:5})).toBe(true);expect(r.surveyAccepted({rmseCm:5.1})).toBe(false)});
 it('computes airspace, fill rate and days left',()=>{expect(r.airspaceLeft(1000,400)).toBe(600);expect(r.fillRate({date:'2026-01-01',usedM3:100},{date:'2026-01-11',usedM3:200})).toBe(10);expect(r.daysLeft(600,10)).toBe(60)});
 it('triggers capping at 10% airspace left',()=>{expect(r.cappingDue(1000,900)).toBe(true);expect(r.cappingDue(1000,899)).toBe(false)});
 it('flags survey volume more than 15% off weighbridge tonnes',()=>{expect(r.volumeVariance(1000,900)).toBe(0);expect(r.volumeVariance(1200,900)>0.15).toBe(true)});
 it('bills plant only for loaded hours inside the site fence',()=>expect(r.billableHours([{hours:4,load:60,inFence:true},{hours:2,load:10,inFence:true},{hours:3,load:70,inFence:false}])).toBe(4));
 it('holds invoices over 5% above verified hours',()=>{expect(r.invoiceHeld(10.5,10)).toBe(false);expect(r.invoiceHeld(10.6,10)).toBe(true)});
 it('sets methane, fire and slope levels',()=>{expect(r.methaneLevel(0.9)).toBe('Normal');expect(r.methaneLevel(1)).toBe('Warning');expect(r.methaneLevel(2.5)).toBe('Stop');expect(r.fireLevel(80)).toBe('Stop');expect(r.slopeLevel(10)).toBe('Warning');expect(r.worstLevel(['Normal','Stop'])).toBe('Stop')});
 it('admits a valid adult picker with PPE in hours',()=>expect(r.gateRefusals(adult,ok)).toEqual([]));
 it('refuses under-18s, missing PPE, out of hours and closed face',()=>{expect(r.gateRefusals({...adult,dob:'2010-01-01'},ok)).toContain('Under 18: entry prohibited');expect(r.gateRefusals(adult,{...ok,ppe:false}).length).toBe(1);expect(r.gateRefusals(adult,{...ok,hour:18}).length).toBe(1);expect(r.gateRefusals(adult,{...ok,faceStatus:'Stop'})).toContain('Active face closed for safety');expect(r.gateRefusals({...adult,zone:'Sorting bay'},{...ok,faceStatus:'Stop'})).toEqual([])});
 it('refuses expired passes and failed fingerprints',()=>{expect(r.gateRefusals({...adult,expires:'2026-01-01'},ok)).toContain('Pass expired or suspended');expect(r.gateRefusals(adult,{...ok,biometric:false})).toContain('Fingerprint does not match the pass')});
});
