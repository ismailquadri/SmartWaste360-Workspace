import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/landfill-guard-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
describe('MOD-04 first dummy overflow safeguard',()=>{
 it('caps Solous at 100 and identifies 65 overflow loads from 165',()=>{expect(r.LG_SOLOUS_CAP).toBe(100);expect(r.lgOverflow(165)).toBe(65);expect(r.lgOverflow(90)).toBe(0)});
 it('reserves exactly 35000 per Epe voucher from a 10000-per-tonne commercial pool',()=>{expect(r.LG_EPE_VOUCHER).toBe(35000);expect(r.LG_COMMERCIAL_RATE).toBe(10000);expect(r.lgFunds([{amount:70000}],[{amount:35000,status:'Reserved'}])).toBe(35000);expect(r.lgFunds([{amount:70000}],[{amount:35000,status:'Cancelled'}])).toBe(70000)});
 it('never creates unfunded Epe reservations',()=>{const c={manifest:{type:'Compactor'},to:'Epe landfill',used:100,room:1,funds:34999};expect(r.lgDiversionError(c)).toContain('insufficient');expect(r.lgDiversionError({...c,funds:35000})).toBe(null)});
 it('blocks duplicates, stopped destinations and receiving overbooking',()=>{const c={manifest:{type:'Compactor'},to:'Oshodi TLS',used:100,room:1,funds:0};expect(r.lgDiversionError({...c,duplicate:true})).toContain('already');expect(r.lgDiversionError({...c,destinationStopped:true})).toContain('stopped');expect(r.lgDestinationRoom(1,[{day:'2026-11-14',to:'Oshodi TLS',status:'Approved'}],'Oshodi TLS','2026-11-14')).toBe(0);expect(r.lgDiversionError({...c,room:0})).toContain('capacity')});
 it('does not draw voucher money from held or domestic tickets',()=>{expect(r.lgReceiptError({ticketClass:'Commercial'},{held:true,net:8000},'Commercial',false)).toContain('Held');expect(r.lgReceiptError({ticketClass:'Domestic'},{held:false,net:8000},'Domestic',false)).toContain('commercial');expect(r.lgReceiptError({ticketClass:'Commercial'},{held:false,net:8000},'Commercial',false)).toBe(null)});
});
describe('MOD-04 two-tier plant billing',()=>{
 it('pays exactly 100 percent at 25 percent engine load inside the fence',()=>{const l={hours:2,load:25,inFence:true,verified:true};expect(r.lgPlantTotals([l],120000).total).toBe(240000);expect(r.lgPlantTier({...l,load:24.9})).toBe('Unverified / excluded');expect(r.lgPlantTotals([{...l,inFence:false}],120000).total).toBe(0)});
 it('pays exactly 35 percent only for verified machine and operator ready standby',()=>{const l={hours:2,load:12,inFence:true,verified:true,ready:true,operatorReady:true};expect(r.lgPlantTotals([l],120000).standbyAmount).toBe(84000);expect(r.lgPlantTotals([{...l,ready:false}],120000).total).toBe(0);expect(r.lgPlantTotals([{...l,operatorReady:false}],120000).total).toBe(0);expect(r.lgPlantTotals([{...l,verified:false}],120000).total).toBe(0)});
 it('never bills a compaction interval again as standby',()=>{expect(r.lgPlantTotals([{hours:1,load:25,inFence:true,verified:true,ready:true,operatorReady:true}],120000)).toMatchObject({active:1,standby:0,total:120000})});
 it('blocks overlapping and reversed intervals but allows adjacent periods',()=>{const logs=[{start:'2026-11-14T06:00:00Z',end:'2026-11-14T08:00:00Z'}];expect(r.lgPlantIntervalError(logs,Date.parse('2026-11-14T07:00:00Z'),Date.parse('2026-11-14T09:00:00Z'))).toContain('overlaps');expect(r.lgPlantIntervalError(logs,Date.parse('2026-11-14T08:00:00Z'),Date.parse('2026-11-14T09:00:00Z'))).toBe(null);expect(r.lgPlantIntervalError([],2,1)).toContain('after')});
 it('retains the 5 percent invoice hold without allowing payment of the excess',()=>{expect(r.lgPlantInvoiceHeld(105000,100000)).toBe(false);expect(r.lgPlantInvoiceHeld(105001,100000)).toBe(true)});
});