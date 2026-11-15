import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/kai-detention-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
const r=new Function(src+`;return {${names.join(',')}}`)();
const at='2026-11-14T10:00:00Z',base=Date.parse(at),hour=(h:number)=>base+h*3600000;
const docket=()=>({arrestAt:at,detention:{events:[],outcome:null}});
describe('MOD-06 dummy detention review',()=>{
 it('blocks only the matching unresolved case at hour 24 and clears after a completed outcome',()=>{const d={...docket(),case:'MC-A'};expect(r.kdCaseBlocked([d],'MC-A',hour(24)-1)).toBe(false);expect(r.kdCaseBlocked([d],'MC-A',hour(24))).toBe(true);expect(r.kdCaseBlocked([d],'MC-B',hour(24))).toBe(false);expect(r.kdCaseBlocked([{...d,detention:{outcome:{kind:'Video arraignment recorded'}}}],'MC-A',hour(24))).toBe(false)});
 it('raises Sev-1 at exactly hour 18',()=>{expect(r.KD_ESCALATE_HOURS).toBe(18);expect(r.kdState(docket(),hour(18)-1)).toBe('Detention review pending');expect(r.kdState(docket(),hour(18))).toBe('Sev-1 · detention escalation')});
 it('raises the detention alarm at exactly hour 20',()=>{expect(r.KD_ALARM_HOURS).toBe(20);expect(r.kdState(docket(),hour(20)-1)).toBe('Sev-1 · detention escalation');expect(r.kdState(docket(),hour(20))).toBe('20-hour detention alarm')});
 it('requires release or video arraignment at exactly hour 24',()=>{expect(r.KD_REQUIRE_HOURS).toBe(24);expect(r.kdState(docket(),hour(24)-1)).toBe('20-hour detention alarm');expect(r.kdState(docket(),hour(24))).toBe('Release or video arraignment required')});
 it('keeps original arrest timing after booking and reload',()=>{const d={...docket(),booking:{at:new Date(hour(2)).toISOString()}};expect(r.kdMilestones(JSON.parse(JSON.stringify(d)),hour(25)).map((m:{hour:number})=>m.hour)).toEqual([18,20,24])});
 it('acknowledgement cannot clear the 24-hour requirement',()=>{const d={...docket(),detention:{events:[{hour:18,ack:{ref:'REVIEW'}}],outcome:null}};expect(r.kdState(d,hour(24))).toBe('Release or video arraignment required')});
 it('requires confirmed custody and evidence for either outcome',()=>{expect(r.kdOutcomeError({arrestAt:at},'Released on recognizance','REF','Official',hour(24))).toContain('Confirm');expect(r.kdOutcomeError(docket(),'Video arraignment recorded','','Magistrate',hour(24))).toContain('evidence');expect(r.kdOutcomeError(docket(),'Scheduled call','REF','Magistrate',hour(24))).toContain('Choose');expect(r.kdOutcomeError(docket(),'Released on recognizance','REF','Official',hour(24))).toBe('')});
 it('resolved records retain the outcome and stop accumulating later milestones',()=>{const d={arrestAt:at,detention:{outcome:{kind:'Released on recognizance',at:new Date(hour(19)).toISOString()}}};expect(r.kdState(d,hour(30))).toBe('Released on recognizance');expect(r.kdMilestones(d,hour(30)).map((m:{hour:number})=>m.hour)).toEqual([18]);expect(r.kdOutcomeError(d,'Video arraignment recorded','REF','Magistrate',hour(30))).toContain('already')});
 it('does not invent custody for legacy records and flags invalid arrest times',()=>{expect(r.kdState({arrestAt:at},hour(24))).toBe('Custody not confirmed');expect(r.kdState({...docket(),arrestAt:'invalid'},hour(24))).toBe('Arrest time requires review');expect(r.kdOutcomeError({...docket(),arrestAt:new Date(hour(25)).toISOString()},'Released on recognizance','REF','Official',hour(24))).toContain('original arrest time')});
});