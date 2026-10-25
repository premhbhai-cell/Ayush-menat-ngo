const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const DB={get(k){try{return JSON.parse(localStorage.getItem('amf_'+k))||[]}catch(e){return window['_m'+k]||[]}},
set(k,v){try{localStorage.setItem('amf_'+k,JSON.stringify(v))}catch(e){window['_m'+k]=v}}};
document.addEventListener('DOMContentLoaded',()=>{
$('.burger')?.addEventListener('click',()=>$('.menu').classList.toggle('open'));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
$$('.rv').forEach(e=>io.observe(e));
$$('[data-count]').forEach(el=>{const t=+el.dataset.count;const o=new IntersectionObserver(([e])=>{if(!e.isIntersecting)return;o.disconnect();let n=0;const st=Math.max(1,t/60);const id=setInterval(()=>{n+=st;if(n>=t){n=t;clearInterval(id)}el.textContent=Math.floor(n).toLocaleString('en-IN')+(el.dataset.suf||'')},25)});o.observe(el)});
$$('.tabs').forEach(t=>t.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',t).forEach(x=>x.classList.remove('on'));b.classList.add('on');const p=t.parentElement;$$('.pane',p).forEach(x=>x.classList.toggle('on',x.id===b.dataset.t));if(b.dataset.t==='p-cert')drawCert();refreshAdmin()}));
// donation
const amts=$('.amts');if(amts){amts.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',amts).forEach(x=>x.classList.remove('on'));b.classList.add('on');$('#d-amt').value=b.dataset.a})}
const df=$('#donForm');if(df)df.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(df));
const id='AMF-D'+Date.now().toString().slice(-6);const rec={id,...f,date:new Date().toLocaleDateString('en-IN'),status:'Received'};const a=DB.get('don');a.push(rec);DB.set('don',a);
const m=$('#donMsg');m.style.display='block';m.innerHTML=`🙏 धन्यवाद <b>${f.name}</b>! Receipt No: <b>${id}</b> — ₹${f.amount} (${f.mode}). <br><small>Demo mode: real payment ke liye Razorpay/UPI gateway jodi jayegi.</small>`;df.reset();refreshAdmin()});
// member
const mf=$('#memForm');if(mf)mf.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(mf));const a=DB.get('mem');const id='AMF-M'+String(a.length+101).padStart(4,'0');a.push({id,...f,date:new Date().toLocaleDateString('en-IN'),status:'Active'});DB.set('mem',a);
const m=$('#memMsg');m.style.display='block';m.innerHTML=`✅ Welcome <b>${f.name}</b>! Your Member ID: <b>${id}</b>`;mf.reset();refreshAdmin()});
// contact
const cf=$('#conForm');if(cf)cf.addEventListener('submit',e=>{e.preventDefault();const f=Object.fromEntries(new FormData(cf));const a=DB.get('msg');a.push({...f,date:new Date().toLocaleDateString('en-IN')});DB.set('msg',a);$('#conMsg').style.display='block';$('#conMsg').textContent='✅ Thank you! Hum jald hi aapse sampark karenge.';cf.reset()});
// certificate
const logo=new Image();logo.src='img/emblem.png';logo.onload=()=>drawCert();
window.drawCert=function(){const c=$('#cert');if(!c)return;const x=c.getContext('2d'),W=c.width,H=c.height;
const name=$('#c-name').value||'Recipient Name',type=$('#c-type').value,reason=$('#c-reason').value||'for outstanding contribution to society',date=$('#c-date').value||new Date().toLocaleDateString('en-IN');
x.fillStyle='#fffdf6';x.fillRect(0,0,W,H);x.lineWidth=16;x.strokeStyle='#0b2a6b';x.strokeRect(24,24,W-48,H-48);x.lineWidth=4;x.strokeStyle='#c9941a';x.strokeRect(46,46,W-92,H-92);
x.lineWidth=2;x.strokeStyle='#2e7d32';x.strokeRect(58,58,W-116,H-116);
x.globalAlpha=.07;if(logo.complete&&logo.naturalWidth)x.drawImage(logo,W/2-260,H/2-220,520,440);x.globalAlpha=1;
if(logo.complete&&logo.naturalWidth)x.drawImage(logo,W/2-70,76,140,115);
x.textAlign='center';x.fillStyle='#0b2a6b';x.font='bold 44px Georgia,serif';x.fillText('AYUSH MENAT FOUNDATION',W/2,235);
x.fillStyle='#c9941a';x.font='20px Georgia';x.fillText('INFORMATION  |  EDUCATION  |  AWARENESS  |  SOCIAL WELFARE',W/2,268);
x.fillStyle='#2e7d32';x.font='bold 62px Georgia,serif';x.fillText('Certificate of '+type,W/2,350);
x.fillStyle='#444';x.font='italic 24px Georgia';x.fillText('This certificate is proudly presented to',W/2,404);
x.fillStyle='#0b2a6b';x.font='bold italic 66px Georgia,serif';x.fillText(name,W/2,486);x.fillRect(W/2-300,500,600,3);
x.fillStyle='#444';x.font='24px Georgia';const L=reason.match(/.{1,62}(\s|$)/g)||[reason];L.slice(0,2).forEach((t,i)=>x.fillText(t.trim(),W/2,552+i*34));
x.font='20px Georgia';x.textAlign='left';x.fillText('Date: '+date,110,H-120);x.textAlign='right';x.fillText('Authorized Signatory',W-110,H-120);x.fillRect(W-330,H-148,220,2);
x.textAlign='center';x.fillStyle='#888';x.font='16px Georgia';x.fillText('Cert. No: AMF-C'+(name.length*137+date.length*11).toString().padStart(4,'0')+'   |   42, Rajgol-1, Kunol, Meghraj, Aravalli, Gujarat - 383350',W/2,H-80)};
['c-name','c-type','c-reason','c-date'].forEach(i=>$('#'+i)?.addEventListener('input',drawCert));
$('#c-dl')?.addEventListener('click',()=>{drawCert();const a=document.createElement('a');a.download='AMF-Certificate.png';a.href=$('#cert').toDataURL('image/png');a.click();const l=DB.get('cert');l.push({name:$('#c-name').value||'-',type:$('#c-type').value,date:new Date().toLocaleDateString('en-IN')});DB.set('cert',l);refreshAdmin()});
$('#c-print')?.addEventListener('click',()=>{drawCert();const w=open('');w.document.write('<img src="'+$('#cert').toDataURL()+'" style="width:100%" onload="print()">')});
// admin
$('#admLogin')?.addEventListener('submit',e=>{e.preventDefault();if($('#a-u').value==='admin'&&$('#a-p').value==='admin123'){$('#admLoginBox').style.display='none';$('#admDash').style.display='block';refreshAdmin()}else alert('Demo login: admin / admin123')});
$('#admOut')?.addEventListener('click',()=>{$('#admLoginBox').style.display='block';$('#admDash').style.display='none'});
$('#admCsv')?.addEventListener('click',()=>{const rows=[['ID','Name','Amount','Mode','Date']].concat(DB.get('don').map(d=>[d.id,d.name,d.amount,d.mode,d.date]));const csv=rows.map(r=>r.join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='donations.csv';a.click()});
$('#admClr')?.addEventListener('click',()=>{if(confirm('Clear demo data?')){['don','mem','cert','msg'].forEach(k=>DB.set(k,[]));refreshAdmin()}});
window.refreshAdmin=function(){if(!$('#admDash'))return;const d=DB.get('don'),m=DB.get('mem');$('#k-don').textContent='₹'+d.reduce((s,x)=>s+(+x.amount||0),0).toLocaleString('en-IN');$('#k-cnt').textContent=d.length;$('#k-mem').textContent=m.length;$('#k-cert').textContent=DB.get('cert').length;
$('#t-don').innerHTML=d.slice().reverse().map(x=>`<tr><td>${x.id}</td><td>${esc(x.name)}</td><td>₹${x.amount}</td><td>${x.mode}</td><td>${x.date}</td></tr>`).join('')||'<tr><td colspan=5>No donations yet — pehle Donate tab se try karein.</td></tr>';
$('#t-mem').innerHTML=m.slice().reverse().map(x=>`<tr><td>${x.id}</td><td>${esc(x.name)}</td><td>${esc(x.phone)}</td><td>${x.type}</td><td>${x.status}</td></tr>`).join('')||'<tr><td colspan=5>No members yet.</td></tr>'};
function esc(s){return String(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]))}
});
