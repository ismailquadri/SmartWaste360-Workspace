import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/scale-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const E=[.25,.25,.25,.25];
const base={gross:20000,tare:12000,month:1,rainMm:0,washed:false,valve:{opened:false},beams:[1,1,1,1],corners:[25,25,25,25],expected:E,jump:0,account:'Domestic',ticketClass:'Domestic'};
describe('MOD-03 weighbridge rules',()=>{
 it('needs all 4 optical beams clear',()=>{expect(r.beamsClear([1,1,1,1])).toBe(true);expect(r.beamsClear([1,1,1,0])).toBe(false);expect(r.ticketFindings({...base,beams:[1,0,1,1]},true)).toContain('Truck not fully on the scale')});
 it('flags corner imbalance over 18% or a 1,500 kg signal jump',()=>{expect(r.signalTamper([25,25,25,25],E,0)).toBe(false);expect(r.signalTamper([50,10,30,10],E,0)).toBe(true);expect(r.signalTamper([25,25,25,25],E,1500)).toBe(true);expect(r.signalTamper([25,25,25,25],E,1499)).toBe(false)});
 it('holds scales beyond ±1.5% error',()=>{expect(r.scaleInTolerance(20000,20300)).toBe(true);expect(r.scaleInTolerance(20000,20301)).toBe(false);expect(r.scaleInTolerance(20000,19699)).toBe(false)});
 it('gives mud allowance only May–October to unwashed trucks',()=>{expect(r.mudAllowance(4,50,false)).toBe(0);expect(r.mudAllowance(11,50,false)).toBe(0);expect(r.mudAllowance(5,5,false)).toBe(250);expect(r.mudAllowance(7,10,false)).toBe(400);expect(r.mudAllowance(10,30,false)).toBe(600);expect(r.mudAllowance(7,30,true)).toBe(0)});
 it('adds the mud allowance back to net weight',()=>expect(r.ticketNet({...base,month:7,rainMm:30})).toBe(8600));
 it('deducts 1,500 kg when leachate is drained outside the sump',()=>{expect(r.ticketNet({...base,valve:{opened:true,zone:'Yard'}})).toBe(6500);expect(r.ticketNet({...base,valve:{opened:true,zone:'Leachate sump'}})).toBe(8000)});
 it('blocks commercial loads booked as domestic',()=>{expect(r.tariffMismatch('Commercial','Domestic')).toBe(true);expect(r.tariffMismatch('Commercial','Commercial')).toBe(false);expect(r.tariffMismatch('Domestic','Domestic')).toBe(false)});
 it('charges ₦10,000 per tonne for commercial tipping',()=>{expect(r.tipFee(5400,'Commercial')).toBe(54000);expect(r.tipFee(5400,'Domestic')).toBe(0)});
 it('needs a different second official to change class',()=>{expect(r.classChangeAllowed({reason:'x',second:'B'},'A')).toBe(true);expect(r.classChangeAllowed({reason:'x',second:'A'},'A')).toBe(false);expect(r.classChangeAllowed({reason:'',second:'B'},'A')).toBe(false)});
 it('clears a clean ticket',()=>expect(r.ticketFindings(base,true)).toEqual([]));
});
