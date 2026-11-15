/* Proposed dummy Solous quota allocation; no live booking or gate authority. */
const LQ_LCDA_SHARE=0.7;
const LQ_TLS_SHARE=0.3;
const LQ_RELEASE_MINUTE=13*60;
const LQ_LCDAS=['Alimosho','Agbado/Oke-Odo','Ayobo/Ipaja','Egbe/Idimu','Igando/Ikotun','Mosan/Okunola'];
const lqSplit=capacity=>({lcda:Math.floor(capacity*LQ_LCDA_SHARE),tls:capacity-Math.floor(capacity*LQ_LCDA_SHARE)});
const lqAllocations=capacity=>{const s=lqSplit(capacity);return Object.fromEntries([...LQ_LCDAS.map((n,i)=>[n,Math.floor(s.lcda/LQ_LCDAS.length)+(i<s.lcda%LQ_LCDAS.length?1:0)]),['TLS',s.tls]])};
const lqReleaseAt=day=>Date.parse(day+'T13:00:00+01:00');
const lqAfterRelease=(day,now)=>now>=lqReleaseAt(day);
const lqActive=bookings=>bookings.filter(b=>!['Cancelled','Expired'].includes(b.status));
const lqUsage=(plan,owner)=>lqActive(plan.bookings).filter(b=>b.pool==='Morning'&&b.owner===owner).length;
const lqMorningRoom=(plan,owner)=>Math.max(0,(lqAllocations(plan.capacity)[owner]||0)-lqUsage(plan,owner));
const lqSurgeRoom=plan=>Math.max(0,plan.capacity-lqActive(plan.bookings).length);
const lqRelease= (plan,now)=>{if(!lqAfterRelease(plan.day,now)||plan.release)return false;const unclaimed=lqActive(plan.bookings).filter(b=>b.pool==='Morning'&&b.status==='Reserved');unclaimed.forEach(b=>{b.status='Expired';b.expiredAt=new Date(lqReleaseAt(plan.day)).toISOString()});plan.release={at:new Date(lqReleaseAt(plan.day)).toISOString(),recordedAt:new Date(now).toISOString(),released:plan.capacity-lqActive(plan.bookings).length,expired:unclaimed.map(b=>b.id)};return true};
const lqBookingError=(plan,owner,truck,now)=>!Object.hasOwn(lqAllocations(plan.capacity),owner)?'Choose a quota owner':!String(truck||'').trim()?'Select a truck':lqActive(plan.bookings).some(b=>b.truck===truck)?'This truck already has an active slot':lqAfterRelease(plan.day,now)?lqSurgeRoom(plan)<=0?'Surge pool is full':null:lqMorningRoom(plan,owner)<=0?'Morning allocation is full for this owner':null;
const lqClaimError=(plan,booking,now)=>!booking||booking.status!=='Reserved'?'This reservation is not available':booking.pool==='Morning'&&lqAfterRelease(plan.day,now)?'Morning reservation expired at 13:00 WAT; book from the surge pool':null;