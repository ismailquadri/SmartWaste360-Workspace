import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';
const src=['bill-rules','bill-care-rules'].map(f=>readFileSync(resolve(__dirname,'../../lawma/work/'+f+'.js'),'utf8')).join('\n');
const names=[...src.matchAll(/^const (\w+)=/gm)].map(m=>m[1]);
const r=new Function(src+`;return {${names.join(',')}}`)();
const bill=(arrears:number)=>({id:'B',property:'P',partner:'PSP',status:'Issued',months:2,periods:['2026-09','2026-10'],lines:[{rate:1000000}],totals:{arrears,credit:0,due:2000000+arrears}});
describe('Bill feedback, escalation and QR bridge',()=>{
 it('scores YES share with 75/50 bands and needs 5 stubs',()=>{const a=(x:string)=>({answer:x});expect(r.bcScore([a('YES'),a('YES')]).band).toBe('Too few stubs');expect(r.bcScore([a('YES'),a('YES'),a('YES'),a('YES'),a('NO')]).band).toBe('Good standing');expect(r.bcScore([a('YES'),a('YES'),a('YES'),a('NO'),a('NOT SURE')]).band).toBe('Performance watch');expect(r.bcScore([a('YES'),a('NO'),a('NO'),a('NO'),a('NOT SURE')]).band).toBe('Cure review recommended')});
 it('allows one returned stub per bill',()=>{expect(r.bcCsatError(bill(0),{answer:'YES',source:'Bank branch',stub:'S'},[{bill:'B'}])).toContain('already')});
 it('treats the ₦60,000 reference arrears on a ₦20,000 cycle as 3 cycles and Section 18 stage',()=>{expect(r.bcCycles(bill(6000000))).toBe(3);expect(r.bcStage(bill(6000000))).toContain('Section 18');expect(r.bcStage(bill(4000000))).toBe('Pre-sealing warning');expect(r.bcStage(bill(2000000))).toBe('Final demand notice');expect(r.bcStage(bill(0))).toBe('Current')});
 it('requires a second official to approve a notice',()=>{expect(r.bcNoticeError('Ada','ada',bill(6000000))).not.toBe('');expect(r.bcNoticeError('Ada','Bola',bill(6000000))).toBe('')});
 it('splits 80% PSP and 20% LAWMA without losing a kobo',()=>{expect(r.bcSplit(8000000)).toEqual({psp:6400000,lawma:1600000});const s=r.bcSplit(101);expect(s.psp+s.lawma).toBe(101)});
 it('rejects a QR whose amount was altered',()=>{const b=bill(6000000),p=r.bcPayload(b);expect(r.bcVerify(p,b)).toBe(true);expect(r.bcVerify(p.replace('8000000','1000000'),b)).toBe(false)});
});
