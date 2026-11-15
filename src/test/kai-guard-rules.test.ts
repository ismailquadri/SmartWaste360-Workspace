import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/kai-guard-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(src+`;return {${names.join(',')}}`)() as any;
const at='2026-11-14T10:00:00Z';
const t={threat:'GREEN',bikes:2,status:'On patrol'};
describe('MOD-06 dummy command safeguards',()=>{
 it('requires at least two ready Tier-1 bikes',()=>{expect(r.kgDispatchError({...t,bikes:1},{})).toContain('two');expect(r.kgDispatchError(t,{})).toBe('')});
 it('requires an armed RRS escort and reference for red threat',()=>{const red={...t,threat:'RED_GANG_CONTROLLED'};expect(r.kgDispatchError(red,{escorts:0,rrsRef:'RRS-1'})).not.toBe('');expect(r.kgDispatchError(red,{escorts:1,rrsRef:''})).not.toBe('');expect(r.kgDispatchError(red,{escorts:1,rrsRef:'RRS-1'})).toBe('')});
 it('blocks an off-duty deployment',()=>expect(r.kgDispatchError({...t,status:'Off duty'},{})).toContain('off duty'));
 it('flags the exact 60-minute booking deadline without moving the arrest time',()=>{const d={arrestAt:at};expect(r.kgBookingState(d,Date.parse(at)+59*60000)).toBe('Booking pending');expect(r.kgBookingRemaining(d,Date.parse(at)+59*60000)).toBe(1);expect(r.kgBookingState(d,Date.parse(at)+60*60000)).toBe('Booking overdue');expect(r.kgBookingState(d,Date.parse(at)+61*60000)).toBe('Booking overdue')});
 it('flags unanswered responses at 10 minutes and retains late arrivals',()=>{expect(r.kgResponseState({at},Date.parse(at)+10*60000)).toBe('Response overdue');expect(r.kgResponseState({at,arrivedAt:'2026-11-14T10:10:00Z'},0)).toBe('Arrived within target');expect(r.kgResponseState({at,arrivedAt:'2026-11-14T10:11:00Z'},0)).toBe('Arrived late')});
 it('requires a dummy capture reference and prevents duplicate bookings',()=>{expect(r.kgBookingError({arrestAt:at},'')).not.toBe('');expect(r.kgBookingError({arrestAt:at},'CAP-1')).toBe('');expect(r.kgBookingError({booking:{ref:'CAP-1'}},'CAP-2')).toContain('already')});
});