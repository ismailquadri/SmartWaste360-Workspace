/* MOD-05 proposed settlement rules. Sample figures only; LAWMA finance, LIRS and Treasury approval is required. */
const PSP_SPLIT=0.8;
const WHT_RATE=0.05;
const CURE_HOURS=48;
const MISSED_PICKUP_DEDUCTION=25000;
const DIESEL_WEIGHT=0.35;
const DIESEL_CAP=0.15;
const SETTLE_ROLES=['management','finance','admin'];
const cureEnds=raised=>new Date(new Date(raised).getTime()+CURE_HOURS*3600000);
const cureOpen=(c,now)=>!c.outcome&&new Date(now)<cureEnds(c.raised);
const cureExpired=(c,now)=>!c.outcome&&new Date(now)>=cureEnds(c.raised);
const cureDeduction=(items,now)=>items.filter(c=>c.outcome==='Not cured'||cureExpired(c,now)).length*MISSED_PICKUP_DEDUCTION;
const dieselFactor=(basePrice,pumpPrice)=>Math.min(1+DIESEL_CAP,Math.max(1-DIESEL_CAP,1+DIESEL_WEIGHT*(pumpPrice/basePrice-1)));
const indexedTariff=(base,basePrice,pumpPrice)=>Math.round(base*dieselFactor(basePrice,pumpPrice));
const splitSettlement=gross=>{const psp=Math.round(gross*PSP_SPLIT),wht=Math.round(psp*WHT_RATE);return {gross,lawma:gross-psp,psp,wht,net:psp-wht}};
const reconStatus=(expected,line)=>!line?'Missing from treasury':line.amount===expected?'Matched':line.amount<expected?'Short paid':'Over paid';
const releaseBlocks=(b,ctx)=>[!ctx.briefOk&&'Weekly LGA tonnage not confirmed',ctx.openCures>0&&'Cure window still open',!ctx.dieselOk&&'Diesel price for this week not approved',!b.tin&&'PSP tax ID (TIN) missing'].filter(Boolean);
