import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const load=(f:string)=>{const src=readFileSync(resolve(__dirname,'../../lawma/work/'+f),'utf8');const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
return new Function(src+`;return {${names.join(',')}}`)() as any};
const e=load('eco-rules.js'),h=load('haz-rules.js');
describe('MOD-07 water quality rules',()=>{
 it('flags metals above limits',()=>{expect(e.exceedances({Lead:0.011,Arsenic:0.01,Cadmium:0.004})).toEqual(['Lead','Cadmium']);expect(e.exceedFactor('Lead',0.05)).toBe(5)});
 it('alerts on low oxygen and pump uptime',()=>{expect(e.lagoonAlerts({do:2,uptime:0.9})).toEqual([]);expect(e.lagoonAlerts({do:1.9,uptime:0.89}).length).toBe(2)});
 it('needs two exceeding samples before a well alert',()=>{expect(e.wellAlertConfirmed([{Lead:0.02}])).toBe(false);expect(e.wellAlertConfirmed([{Lead:0.02},{Lead:0.03}])).toBe(true);expect(e.wellAlertConfirmed([{Lead:0.02},{Lead:0.005}])).toBe(false)});
 it('requires the same contaminant in spaced samples',()=>{expect(e.wellAlertConfirmed([{Lead:0.02},{Arsenic:0.02}])).toBe(false);expect(e.wellAlertConfirmed([{Lead:0.02,at:'2026-11-14T00:00:00Z'},{Lead:0.03,at:'2026-11-14T01:00:00Z'}])).toBe(false);expect(e.wellAlertConfirmed([{Lead:0.02,at:'2026-11-14T00:00:00Z'},{Lead:0.03,at:'2026-11-15T00:00:00Z'}])).toBe(true)});
 it('attributes to the landfill at 2× upgradient',()=>{expect(e.landfillAttributable({COD:80},{COD:40},'COD')).toBe(true);expect(e.landfillAttributable({COD:70},{COD:40},'COD')).toBe(false)});
 it('does not invent a landfill link without an upstream sample',()=>{expect(e.landfillAttributable({COD:80},undefined,'COD')).toBeFalsy()});
 it('schedules a practice retest after 24 hours',()=>{expect(e.ecoRetestDue('2026-11-14T12:00:00Z')).toBe('2026-11-15T12:00:00.000Z')});
 it('holds only the explicitly linked batch until the referral closes',()=>{const r={id:'WR1',batch:'SB1',paymentHold:true};expect(e.ecoReferralBlocks([r],'SB1')).toEqual(['Water investigation WR1 · payment held for review']);expect(e.ecoReferralBlocks([r],'SB2')).toEqual([]);expect(e.ecoReferralBlocks([{...r,closed:{finding:'Cleared'}}],'SB1')).toEqual([])});
});
describe('MOD-08 hazardous waste rules',()=>{
 it('matches weights within 5%',()=>{expect(h.weightMatch(100,105)).toBe(true);expect(h.weightMatch(100,94)).toBe(false)});
 it('needs 850 °C, 1,100 °C and 2 seconds',()=>{expect(h.burnValid({primary:850,secondary:1100,residence:2})).toBe(true);expect(h.burnValid({primary:849,secondary:1100,residence:2})).toBe(false);expect(h.burnValid({primary:900,secondary:1200,residence:1.5})).toBe(false)});
 it('holds unlicensed haulers and late burns',()=>{const m={hauler:'X',kg:100,collected:'2026-11-10T00:00:00Z',destroyedAt:'2026-11-12T01:00:00Z'};expect(h.manifestHolds(m,['Y'])).toEqual(['Hauler not SPL-licensed','Not incinerated within 48 hours'])});
 it('needs two different officials and the same seal at every handover',()=>{expect(h.handoverValid({lasepa:'A',lawma:'B',seal:'S1'},'S1')).toBe(true);expect(h.handoverValid({lasepa:'A',lawma:'A',seal:'S1'},'S1')).toBe(false);expect(h.handoverValid({lasepa:'A',lawma:'B',seal:'S2'},'S1')).toBe(false)});
 it('rejects case or spacing variants of the same officer',()=>expect(h.handoverValid({lasepa:'Officer A',lawma:' officer  a ',seal:'S1'},'S1')).toBe(false));
 it('registers e-waste, batteries and asbestos',()=>{expect(h.NONCLINICAL_STREAMS).toEqual(['E-waste','Batteries','Asbestos'])});
 it('stops custody advances on a hold or after final disposal',()=>{expect(h.custodyAdvanceAllowed({hold:true,steps:[{}]})).toBe(false);expect(h.custodyAdvanceAllowed({hold:false,steps:[{},{},{},{}]})).toBe(false);expect(h.custodyAdvanceAllowed({hold:false,steps:[{}]})).toBe(true)});
 it('blocks burn reservations during downtime',()=>{expect(h.incineratorBookingError({status:'Breakdown',capacityKg:1000},[],'2026-11-14',100)).toBe('Incinerator is unavailable')});
 it('reserves only remaining daily capacity and excludes cancellations',()=>{const p={status:'Running',capacityKg:1000},b=[{date:'2026-11-14',kg:800,status:'Reserved'},{date:'2026-11-14',kg:150,status:'Cancelled'}];expect(h.incineratorAvailable(p,b,'2026-11-14')).toBe(200);expect(h.incineratorBookingError(p,b,'2026-11-14',201)).toBe('Daily capacity exceeded');expect(h.incineratorBookingError(p,b,'2026-11-14',200)).toBe('');expect(h.incineratorAvailable(p,b,'2026-11-15')).toBe(1000)});
});
