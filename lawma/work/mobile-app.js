/* Phone-width layout for staff using the hub on a phone. The customer app is a separate product. */
const standaloneMobile=location.pathname.replace(/\/+$/,'')==='/mobile';document.body.classList.toggle('ios-app',standaloneMobile);document.body.classList.toggle('desktop-app',!standaloneMobile);
defs.insertAdjacentHTML('beforeend','<symbol id="i-home" viewBox="0 0 24 24"><path d="m3 10 9-7 9 7v11h-6v-7H9v7H3Z"/></symbol><symbol id="i-bell" viewBox="0 0 24 24"><path d="M5 17h14l-2-3V9a5 5 0 0 0-10 0v5ZM10 21h4M12 2v2"/></symbol><symbol id="i-more" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/></symbol>');
document.querySelector('meta[name=viewport]').content='width=device-width, initial-scale=1, viewport-fit=cover';
document.title='SmartWaste360';
const appTabs=document.createElement('nav');appTabs.className='app-tabs';appTabs.setAttribute('aria-label','App navigation');document.body.append(appTabs);
const appMenu=()=>{
 drawer('Workspaces',`<div class="app-menu">${journeyNav.filter(([p])=>permitted(p)).map(([p,label,ic])=>`<button data-module="app-go" data-record="${p}">${icon(ic)}<span>${esc(label)}</span>${icon('arrow')}</button>`).join('')}</div>`);
};
function mobileTabs(){
 const home=journeyRoles[journey.role][1];
 const work=permitted('serviceLedger')?'serviceLedger':permitted('care')?'care':permitted('recovery')?'recovery':home;
 const nav=[[home,'Home','home'],[work,'Work','file'],[permitted('fleet')?'fleet':permitted('cameras')?'cameras':'resident',permitted('fleet')?'Map':permitted('cameras')?'Cameras':'Service','map'],['alerts','Inbox','bell'],['more','More','more']];
 const seen=new Set();
 appTabs.innerHTML=nav.filter(([p])=>{if(seen.has(p)||p!=='more'&&!permitted(p))return false;seen.add(p);return true}).map(([p,label,ic])=>`<button data-module="${p==='more'?'app-menu':'app-go'}" data-record="${p}" ${journey.page===p?'aria-current="page"':''}>${icon(ic)}<span>${label}</span>${p==='alerts'&&visibleNotices().some(n=>!n.read)?'<i class="app-unread" aria-label="Unread notifications"></i>':''}</button>`).join('');
}
const mobileRender=renderJourney;
renderJourney=function(){mobileRender();mobileTabs()};
const mobileAction=runModule;
runModule=function(cmd,id){
 if(cmd==='app-menu'){appMenu();return}
 if(cmd==='app-go'){closeModal();goJourney(id);return}
 mobileAction(cmd,id);
};
const demoCode=document.createElement('div');demoCode.className='app-access';demoCode.innerHTML='<label for="demoAccess">Access code</label><div><input id="demoAccess" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="246810" autocomplete="off" aria-describedby="demoAccessHint"><button class="btn" type="button" id="useDemoCode">Use access code</button></div><small id="demoAccessHint">Use access code 246810.</small><p id="accessError" role="alert" hidden>Enter the access code 246810.</p>';
$('entryForm').querySelector('button[type=submit]').before(demoCode);
$('useDemoCode').onclick=()=>{$('demoAccess').value='246810';$('accessError').hidden=true};
const enterWorkspace=$('entryForm').onsubmit;
$('entryForm').onsubmit=e=>{if($('demoAccess').value!=='246810'){e.preventDefault();$('accessError').hidden=false;$('demoAccess').focus();return}sim.signedIn=true;enterWorkspace(e);recordModuleAction('Signed in: '+journeyRoles[journey.role][0])};
document.querySelector('.entry-note').textContent='Choose your role and enter the access code to open your workspace.';
document.querySelector('.entry-form h2').textContent='Welcome to SmartWaste360';
document.querySelector('.entry-form>p').textContent='Choose your role to begin.';
// Offline shell caching applies only to the local app. External map assets are not cached here.
if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('./sw.js').catch(()=>{});
mobileTabs();
function mobileRecordLists(root){
 root.querySelectorAll('.table-scroll table').forEach(t=>{
  const labels=[...t.querySelectorAll('thead th')].map(x=>x.textContent.trim());t.classList.add('mobile-records');t.setAttribute('role','table');
  t.querySelectorAll('tr').forEach(r=>r.setAttribute('role','row'));
  t.querySelectorAll('th').forEach(th=>th.setAttribute('role','columnheader'));
  t.querySelectorAll('tbody tr').forEach(r=>{[...r.children].forEach((c,i)=>{c.dataset.label=labels[i]||'';c.setAttribute('role','cell');if(c.querySelector('button'))c.classList.add('record-action')})});
 });
}
const listRender=renderJourney;
renderJourney=function(){listRender();mobileRecordLists(journeyMain)};
const sheetDialog=dialog;
dialog=function(...args){sheetDialog(...args);mobileRecordLists($('modal'))};
