import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/market-guard-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
const r=new Function(src+`;return {${names.join(',')}}`)();
const H=3600000,D=86400000;
describe('Module 09 market sealing safeguards',()=>{
 it('scores the market as its weakest zone',()=>{expect(r.mgIndex([95,90,40])).toBe(40);expect(r.mgInspectionResult([95,90,40])).toBe('Failed');expect(r.mgInspectionResult([70,70,70])).toBe('Passed');expect(r.mgInspectionResult([90,NaN,90])).toBe('Incomplete')});
 it('blocks padlocking during the 12-hour window unless all crates exited',()=>{const t=Date.parse('2026-11-01T00:00:00Z'),p={opened:'2026-11-01T00:00:00Z',crates:10,exited:4};expect(r.mgPadlockErrors(p,t+12*H-1).length).toBe(1);expect(r.mgPadlockErrors(p,t+12*H)).toEqual([]);expect(r.mgPadlockErrors({...p,exited:10},t)).toEqual([]);expect(r.mgPadlockErrors(undefined,t).length).toBe(1);expect(r.mgExitError(p,7,t)).not.toBe('')});
 it('treats a mismatched or cut seal as tampering, reviewed by another official',()=>{const s={tag:'RFID-SEAL-1001'};expect(r.mgSealScanResult(s,{tag:'rfid-seal-1001',intact:true})).toBe('Intact');expect(r.mgSealScanResult(s,{tag:'RFID-SEAL-1001',intact:false})).toBe('Tampered');expect(r.mgSealScanResult(s,{tag:'RFID-SEAL-9',intact:true})).toBe('Tag mismatch');expect(r.mgTamperResolveError({by:'A'},'a')).not.toBe('')});
 it('accepts only USSD/NIP wallet payments and refuses cash to collectors',()=>{const st={wallet:'W'};expect(r.mgPaymentError(st,{channel:'USSD',amount:1})).toBe('');expect(r.mgPaymentError(st,{channel:'Cash to collector',amount:1})).toContain('extortion');expect(r.mgPaymentError({wallet:''},{channel:'USSD',amount:1})).not.toBe('')});
 it('grants a 5% rebate only after 90 days with every zone index ≥85',()=>{const now=Date.parse('2026-11-30T00:00:00Z'),i=(d:number,z:number[])=>({at:new Date(now-d*D).toISOString(),zones:z});expect(r.mgRebateEligible([i(90,[85,85,85]),i(10,[90,90,90])],now)).toBe(true);expect(r.mgRebateEligible([i(89,[90,90,90])],now)).toBe(false);expect(r.mgRebateEligible([i(100,[90,90,90]),i(10,[90,90,84])],now)).toBe(false);expect(r.mgRebateAmount(40000)).toBe(2000)});
 it('requires heavy prime mover and reinforced skip at 8,000 kg',()=>{const cal={kgPerBar:40};expect(r.mgMass(199.99,cal)).toBe(8000);expect(r.mgDispatchErrors(7999,{})).toEqual([]);expect(r.mgDispatchErrors(8000,{vehicle:'Heavy tandem-axle prime mover',skip:'Standard skip'}).length).toBe(1);expect(r.mgDispatchErrors(r.mgMass(100,null),{})).toEqual(['Calibrated strain-gauge reading required'])});
 it('needs three distinct signatories and shows a 5% council share',()=>{const a={ref:'R',lawma:'A',association:'B',council:'C',councilName:'Mushin LGA'};expect(r.mgAccordError(a)).toBe('');expect(r.mgAccordError({...a,council:'a'})).not.toBe('');expect(r.mgCouncilShare(500000)).toBe(25000)});
});
