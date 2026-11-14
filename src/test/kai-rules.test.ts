import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/kai-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const ev={cctv:'CAM-1',timestamp:'2026-11-14T10:00:00Z',gps:[6.55,3.35],scene:[6.5505,3.35],hash:'abc',custodian:'Officer A'};
describe('MOD-06 enforcement rules',()=>{
 it('has 12 sectors',()=>expect(r.KAI_SECTORS.length).toBe(12));
 it('does not authorize auditors to change court records',()=>expect(r.KAI_ROLES).not.toContain('auditor'));
 it('rejects NaN GPS for certification',()=>expect(r.sec84Ready({...ev,gps:[NaN,3.35]})).toBe(false));
 it('blocks charge while a required report is missing',()=>{expect(r.chargeReady({offence:'Dumping',evidenceCertified:true,reportMissing:true})).toBe(false);expect(r.chargeReady({offence:'Dumping',evidenceCertified:true,reportMissing:false})).toBe(true)});
 it('needs footage, timestamp, GPS within 200 m, hash and custodian for Sec. 84',()=>{expect(r.sec84Ready(ev)).toBe(true);expect(r.sec84Ready({...ev,custodian:''})).toBe(false);expect(r.evidenceGaps({...ev,cctv:''})).toContain('No CCTV or bodycam footage');expect(r.evidenceGaps({...ev,scene:[6.56,3.35]})).toContain('Officer GPS more than 200 m from the scene')});
 it('needs an incident report when force is used',()=>{expect(r.interceptionNeedsReport({force:'None'})).toBe(false);expect(r.interceptionNeedsReport({force:'Minimal'})).toBe(true)});
 it('routes pleas',()=>{expect(r.pleaNext('Guilty')).toBe('Sentence');expect(r.pleaNext('Not guilty')).toBe('Hearing')});
 it('keeps sentences inside the schedule',()=>{expect(r.sentenceValid({kind:'Fine',amount:50000},[20000,100000])).toBe(true);expect(r.sentenceValid({kind:'Fine',amount:150000},[20000,100000])).toBe(false);expect(r.sentenceValid({kind:'Community service',hours:73},[0,0])).toBe(false)});
 it('charges demurrage per day after the first 24 hours',()=>{expect(r.demurrageFee('Truck','2026-11-10T00:00:00Z','2026-11-11T00:00:00Z')).toBe(0);expect(r.demurrageFee('Truck','2026-11-10T00:00:00Z','2026-11-11T01:00:00Z')).toBe(20000);expect(r.demurrageFee('Car','2026-11-10T00:00:00Z','2026-11-13T12:00:00Z')).toBe(15000)});
 it('releases only with matching chassis, closed case and paid demurrage',()=>{const v={chassis:'ABC123',courtCleared:true};expect(r.releaseRefusals(v,{chassis:'abc123',paid:true})).toEqual([]);expect(r.releaseRefusals({...v,courtCleared:false},{chassis:'X',paid:false}).length).toBe(3)});
});
