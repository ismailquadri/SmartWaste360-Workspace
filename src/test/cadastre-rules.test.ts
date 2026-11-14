import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const source=readFileSync(resolve(__dirname,'../../lawma/work/cadastre-rules.js'),'utf8');
const names=['CAD_LGAS','LASRRA_GRACE_DAYS','WOLE_WOLE_MOBILISATION','WOLE_WOLE_PERFORMANCE','CAD_MANAGE_ROLES','CAD_REVIEW_ROLES','arrearsStage','unitMonthly','applyPayment','roomPayment','lagisMatch','bagEligible','collectionReady','commissionDue','courtOrderReady'];
const lines=names.map(n=>{const line=source.split('\n').find(l=>l.startsWith(`const ${n}=`));if(!line)throw new Error(n+' missing');return line});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const r=new Function(lines.join('\n')+`;return {${names.join(',')}}`)() as any;
describe('MOD-01 proposed sample policies',()=>{
 it('covers all 20 Lagos LGAs',()=>expect(r.CAD_LGAS).toHaveLength(20));
 it('keeps the full PSP tariff for LASRRA Tier 2',()=>expect(r.unitMonthly({tier:2,tariff:3500})).toBe(3500));
 it('gives Tier 2 45-day grace without delaying 60-day review',()=>{expect(r.LASRRA_GRACE_DAYS).toBe(45);expect(r.arrearsStage(45,'Multi-tenant tenement',2)).toBe('Billing grace');expect(r.arrearsStage(46,'Multi-tenant tenement',2)).toBe('Payment overdue');expect(r.arrearsStage(61,'Multi-tenant tenement',2)).toBe('Separate collection review')});
 it('uses review stages, never title liens or automatic sealing',()=>{expect(r.arrearsStage(30,'Multi-tenant tenement')).toBe('Billing grace');expect(r.arrearsStage(31,'Multi-tenant tenement')).toBe('Payment overdue');expect(r.arrearsStage(60,'Market')).toBe('Payment overdue');expect(r.arrearsStage(90,'Market')).toBe('Separate collection review');expect(r.arrearsStage(91,'Market')).toBe('Court review');expect(r.arrearsStage(120,'Multi-tenant tenement')).toBe('Court review')});
 it('credits Room 4 only and keeps its excess, leaving Room 1 debt intact',()=>{const units=[{duid:'Room1',arrears:7500,credit:0},{duid:'Room4',arrears:2500,credit:0}];const after=r.roomPayment(units,'Room4',3500);expect(after).toEqual([{duid:'Room1',arrears:7500,credit:0},{duid:'Room4',arrears:0,credit:1000}]);expect(units[1]?.arrears).toBe(2500)});
 it('rejects unallocated and invalid room payments',()=>{expect(()=>r.roomPayment([{duid:'Room4',arrears:2500}],'landlord',1000)).toThrow();for(const n of [0,-1,1.5,NaN])expect(()=>r.roomPayment([{duid:'Room4',arrears:2500}],'Room4',n)).toThrow()});
 it('gives QR bag eligibility only to paid-up rooms',()=>{expect(r.bagEligible({arrears:0})).toBe(true);expect(r.bagEligible({arrears:1})).toBe(false)});
 it('does not hold shared bins without stock, pickup and safety review',()=>{const plan={approved:true,bagStock:10,pickupDate:'2026-11-15',safetyChecked:true};expect(r.collectionReady({collectionPlan:plan})).toBe(true);for(const key of Object.keys(plan))expect(r.collectionReady({collectionPlan:{...plan,[key]:false}})).toBe(false)});
 it('requires GPS and gate photo for the ₦50 mobilisation payment',()=>{expect(r.commissionDue({gpsLocked:true,gatePhoto:'PHOTO'},'mobilisation',false)).toBe(50);expect(r.commissionDue({gpsLocked:false,gatePhoto:'PHOTO'},'mobilisation',false)).toBe(0);expect(r.commissionDue({gpsLocked:true},'mobilisation',false)).toBe(0)});
 it('requires the first verified payment for the ₦150 performance stage',()=>{const d={gpsLocked:true,gatePhoto:'PHOTO'};expect(r.commissionDue(d,'performance',false)).toBe(0);expect(r.commissionDue(d,'performance',true)).toBe(150)});
 it('prevents paying either commission twice',()=>{const d={gpsLocked:true,gatePhoto:'PHOTO',mobilisationPaid:true,performancePaid:true};expect(r.commissionDue(d,'mobilisation',true)).toBe(0);expect(r.commissionDue(d,'performance',true)).toBe(0)});
 it('requires service, docket, order evidence and legal review for court orders',()=>{const c={status:'Summons served',serviceProof:'SERVICE',courtRef:'COURT',orderRef:'ORDER',orderEvidence:'SIGNED',legalChecked:true};expect(r.courtOrderReady(c)).toBe(true);for(const key of Object.keys(c))expect(r.courtOrderReady({...c,[key]:false})).toBe(false)});
 it('keeps writes and financial reviews with official roles',()=>{expect(r.CAD_MANAGE_ROLES).toEqual(['management','operations','finance','admin']);expect(r.CAD_REVIEW_ROLES).toEqual(['management','finance','admin'])});
 it('does not invent a formal match for an informal property',()=>{expect(r.lagisMatch(true,5)).toBe('Unmatched informal');expect(r.lagisMatch(false,0)).toBe('Awaiting match')});
});
