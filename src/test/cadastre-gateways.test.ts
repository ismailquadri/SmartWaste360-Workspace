import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const source=readFileSync(resolve(__dirname,'../../lawma/work/cadastre-rules.js'),'utf8');
const names=['CAD_SNAP_TOLERANCE_M','cadLocal','inParcel','parcelEdgeMetres','parcelSnap','parcelAreaM2','ninValid','vninValid','lasrraValid','nameScore','identityOutcome','smsNetwork','smsSegments','webhookSign','webhookRoute'];
const lines=names.map(n=>{const l=source.split('\n').find(x=>x.startsWith(`const ${n}=`));if(!l)throw new Error(n);return l});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(lines.join('\n')+`;return {${names.join(',')}}`)() as any;
const lat=6.5,lng=3.35,dx=20/(111320*Math.cos(lat*Math.PI/180)),dy=15/110574;
const sq=[[lng-dx,lat-dy],[lng+dx,lat-dy],[lng+dx,lat+dy],[lng-dx,lat+dy]];
describe('MOD-01 parcel, identity and gateway samples',()=>{
 it('matches a GPS point inside the parcel',()=>expect(r.parcelSnap([lng,lat],sq,false)).toBe('Matched'));
 it('offers a snap within 25 m of the boundary',()=>{const m=1/(111320*Math.cos(lat*Math.PI/180));expect(r.parcelSnap([lng+dx+15*m,lat],sq,false)).toBe('Awaiting match');expect(r.parcelSnap([lng+dx+40*m,lat],sq,false)).toBe('Unmatched informal')});
 it('never matches an informal property',()=>expect(r.parcelSnap([lng,lat],sq,true)).toBe('Unmatched informal'));
 it('computes a 40 m by 30 m parcel as 1,200 m²',()=>expect(Math.abs(r.parcelAreaM2(sq)-1200)).toBeLessThan(5));
 it('validates NIN, virtual NIN and LASRRA formats',()=>{expect(r.ninValid('12345678901')).toBe(true);expect(r.ninValid('1234')).toBe(false);expect(r.vninValid('AB123456789012CD')).toBe(true);expect(r.lasrraValid('LAS-12345678')).toBe(true)});
 it('needs 80% name match to verify',()=>{expect(r.identityOutcome(r.nameScore('Bisi Ade','bisi ade'))).toBe('Verified');expect(r.identityOutcome(r.nameScore('Bisi Ade','Bisi Okon'))).toBe('Officer review');expect(r.identityOutcome(0)).toBe('Mismatch')});
 it('detects the phone network',()=>{expect(r.smsNetwork('+234 803 123 4567')).toBe('MTN');expect(r.smsNetwork('+234 802 123 4567')).toBe('Airtel');expect(r.smsNetwork('')).toBe('')});
 it('counts long texts as multiple SMS',()=>{expect(r.smsSegments('a'.repeat(160))).toBe(1);expect(r.smsSegments('a'.repeat(161))).toBe(2)});
 it('rejects an altered bank alert signature',()=>{const b=JSON.stringify({amount:100});expect(r.webhookSign('k',b)).toBe(r.webhookSign('k',b));expect(r.webhookSign('k',JSON.stringify({amount:1100}))).not.toBe(r.webhookSign('k',b))});
 it('routes a bank alert to the room in the narration only',()=>{const props=[{wallet:{nuban:'9900000001'},units:[{duid:'D-U01'},{duid:'D-U04'}],webhooks:[]}];expect(r.webhookRoute(props,{accountNumber:'9900000001',narration:'LAWMA D-U04',sessionId:'S1'}).unit.duid).toBe('D-U04');expect(r.webhookRoute(props,{accountNumber:'9900000001',narration:'LAWMA',sessionId:'S2'}).error).toMatch(/manual/);expect(r.webhookRoute(props,{accountNumber:'1',narration:'',sessionId:'S3'}).error).toMatch(/NUBAN/)});
 it('ignores a duplicate bank session',()=>{const props=[{wallet:{nuban:'1'},units:[{duid:'D-U01'}],webhooks:[{sessionId:'S1',result:'Applied'}]}];expect(r.webhookRoute(props,{accountNumber:'1',narration:'D-U01',sessionId:'S1'}).error).toMatch(/Duplicate/)});
});
