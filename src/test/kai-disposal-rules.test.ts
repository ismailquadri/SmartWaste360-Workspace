import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
const src=readFileSync(resolve(__dirname,'../../lawma/work/kai-disposal-rules.js'),'utf8');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
const r=new Function('distinctOfficials',src+`;return {${names.join(',')}}`)((a:string,b:string)=>a.trim().toLowerCase()!==b.trim().toLowerCase());
describe('MOD-06 dummy judicial property safeguards',()=>{
 it('requires CRUSH-ORD references and an available custody cart',()=>{expect(r.KC_ORDER_PREFIX).toBe('CRUSH-ORD-');expect(r.kcOrderError({status:'In custody'},'CRUSH-ORD-001')).toBe('');expect(r.kcOrderError({status:'In custody'},'OFFICER-1')).toContain('CRUSH-ORD');expect(r.kcOrderError({status:'Diversion reserved'},'CRUSH-ORD-1')).not.toBe('')});
 it('blocks destruction without verified order, safe readiness, tag match and independent witness',()=>{const a={tag:'CART-A',status:'Queued for crusher',order:{verified:true}};expect(r.kcCrushError(a,true,'CART-A','Witness','Official')).toBe('');expect(r.kcCrushError({...a,order:null},true,'CART-A','Witness','Official')).not.toBe('');expect(r.kcCrushError(a,false,'CART-A','Witness','Official')).not.toBe('');expect(r.kcCrushError(a,true,'OTHER','Witness','Official')).not.toBe('');expect(r.kcCrushError(a,true,'CART-A','Official','Official')).not.toBe('')});
 it('preservation holds stop queued destruction',()=>expect(r.kcCrushError({status:'Queued for crusher',order:{verified:true},appealHold:true},true,'A','B','C')).toContain('hold'));
 it('requires reviewed first-offender history and voluntary consent for the matching cart-pusher case',()=>{const c={id:'MC-A',offence:'Illegal cart-pusher dumping'},a={case:'MC-A',status:'In custody'};expect(r.kcDiversionError(c,a,true,true)).toBe('');expect(r.kcDiversionError(c,a,false,true)).not.toBe('');expect(r.kcDiversionError(c,a,true,false)).not.toBe('');expect(r.kcDiversionError(c,{...a,case:'MC-B'},true,true)).not.toBe('');expect(r.kcDiversionError(c,{...a,order:{}},true,true)).not.toBe('')});
 it('rejects duplicate court subpoena references',()=>{expect(r.kcSubpoenaError('SUB-1',[{ref:'SUB-1'}])).toContain('already');expect(r.kcSubpoenaError('SUB-2',[{ref:'SUB-1'}])).toBe('')});
});