import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/settle-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const t0='2026-11-10T08:00:00Z';
describe('MOD-05 settlement rules',()=>{
 it('splits 80/20 and withholds 5% of the PSP share',()=>expect(r.splitSettlement(1000000)).toEqual({gross:1000000,lawma:200000,psp:800000,wht:40000,net:760000}));
 it('keeps a complaint open for 48 hours',()=>{expect(r.cureOpen({raised:t0},'2026-11-12T07:59:00Z')).toBe(true);expect(r.cureOpen({raised:t0},'2026-11-12T08:00:00Z')).toBe(false);expect(r.cureOpen({raised:t0,outcome:'Cured'},'2026-11-10T09:00:00Z')).toBe(false)});
 it('deducts ₦25,000 per uncured or expired item, nothing for cured',()=>expect(r.cureDeduction([{raised:t0,outcome:'Cured'},{raised:t0,outcome:'Not cured'},{raised:t0},{raised:'2026-11-12T00:00:00Z'}],'2026-11-12T09:00:00Z')).toBe(50000));
 it('moves tariff 35% of the diesel change, capped at ±15%',()=>{expect(r.indexedTariff(10000,1000,1000)).toBe(10000);expect(r.indexedTariff(10000,1000,1200)).toBe(10700);expect(r.indexedTariff(10000,1000,2000)).toBe(11500);expect(r.indexedTariff(10000,1000,200)).toBe(8500)});
 it('reconciles treasury lines',()=>{expect(r.reconStatus(100,{amount:100})).toBe('Matched');expect(r.reconStatus(100,{amount:90})).toBe('Short paid');expect(r.reconStatus(100,null)).toBe('Missing from treasury')});
 it('blocks release until every gate passes',()=>{expect(r.releaseBlocks({tin:'1'},{briefOk:true,openCures:0,dieselOk:true})).toEqual([]);expect(r.releaseBlocks({tin:''},{briefOk:false,openCures:1,dieselOk:false}).length).toBe(4)});
});
