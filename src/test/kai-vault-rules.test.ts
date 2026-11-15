import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/kai-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
const r=new Function(src+`;return {${names.join(',')}}`)();
const e={case:'MC-1',revision:1,source:'Bodycam',bodycam:'DUMMY-BC',cctv:'',timestamp:'2026-11-14T10:00:00Z',gps:[0,0],scene:[0,0],payload:'dummy',hash:'a'.repeat(64),custodian:'Officer A'};
const distance=(m:number)=>[m/6371000*180/Math.PI,0];
describe('MOD-06 tiered vault rules',()=>{
 it('allows bodycam through 50 m, rejects above 50 m without rounding',()=>{expect(r.KAI_BODYCAM_M).toBe(50);expect(r.evidenceGaps({...e,scene:distance(49.999)})).toEqual([]);expect(r.evidenceGaps({...e,scene:distance(50.001)})).toContain('Bodycam sightline exceeds 50 m')});
 it('allows logged overhead CCTV through 250 m, rejects above 250 m',()=>{expect(r.KAI_CCTV_M).toBe(250);const c={...e,source:'Overhead CCTV',cctv:'DUMMY-CAM',overhead:true,zoom:2,zoomRef:'DUMMY-ZOOM'};expect(r.evidenceGaps({...c,scene:distance(249.999)})).toEqual([]);expect(r.evidenceGaps({...c,scene:distance(250.001)})).toContain('Overhead CCTV sightline exceeds 250 m')});
 it('requires overhead confirmation and a logged zoom factor/reference',()=>{const c={...e,source:'Overhead CCTV',cctv:'DUMMY'};expect(r.evidenceGaps(c)).toContain('Overhead CCTV requires logged zoom');expect(r.evidenceGaps({...c,overhead:true,zoom:2,zoomRef:''})).toContain('Overhead CCTV requires logged zoom')});
 it('requires a matched SHA-256 check bound to the exact revision',()=>{const snapshot=r.kaiEvidenceSnapshot(e),check={matched:true,digest:e.hash,snapshot};expect(r.kaiHashReady({...e,hashCheck:check})).toBe(true);expect(r.kaiHashReady({...e,payload:'changed',hashCheck:check})).toBe(false);expect(r.kaiHashReady({...e,hashCheck:{...check,matched:false}})).toBe(false)});
 it('requires two different officials attesting the same verified content',()=>{const snapshot=r.kaiEvidenceSnapshot(e),a={by:'Officer A',hash:e.hash,snapshot},b={...a,by:'Officer B'},ready={...e,hashCheck:{matched:true,digest:e.hash,snapshot},attestations:[a,b]};expect(r.sec84Ready(ready)).toBe(true);expect(r.sec84Ready({...ready,attestations:[a]})).toBe(false);expect(r.sec84Ready({...ready,attestations:[a,{...b,by:' officer a '}]})).toBe(false);expect(r.sec84Ready({...ready,zoomRef:'changed'})).toBe(false)});
});