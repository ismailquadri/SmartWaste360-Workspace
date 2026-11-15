import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/tracker-payment-rules.js'),'utf8');
const r=new Function(src+';return {trackerHoldActive,trackerPaymentHolds}')();
describe('matching dummy tracker payment gates',()=>{
 const now=Date.parse('2026-11-14T12:00:00Z');
 it('holds after 15 minutes but not at exactly 15',()=>{expect(r.trackerHoldActive({signalAt:new Date(now-15*60000).toISOString()},now)).toBe(false);expect(r.trackerHoldActive({signalAt:new Date(now-15*60000-1).toISOString()},now)).toBe(true)});
 it('blocks only explicit matching payment references',()=>{const vehicles=[{manifest:'MAN-201',signalAt:new Date(now-16*60000).toISOString()},{manifest:'MAN-202',signalAt:new Date(now).toISOString()}];expect(r.trackerPaymentHolds({trackerManifests:['MAN-201']},vehicles,now)).toEqual(['MAN-201']);expect(r.trackerPaymentHolds({trackerManifests:['MAN-202']},vehicles,now)).toEqual([]);expect(r.trackerPaymentHolds({},vehicles,now)).toEqual([])});
 it('retains loss across midnight and clears only inspected vehicle',()=>{const v={manifest:'MAN-201',signalAt:'2026-11-13T22:40:00Z'};expect(r.trackerHoldActive(v,now)).toBe(true);expect(r.trackerHoldActive({...v,yardCleared:true},now)).toBe(false)});
 it('fails closed for missing linked trackers or invalid timestamps',()=>{expect(r.trackerPaymentHolds({trackerManifests:['MISSING']},[],now)).toEqual(['MISSING']);expect(r.trackerHoldActive({signalAt:'invalid'},now)).toBe(true)});
});