/* EXDIO — corporate presentation. No forms, bookings, payments or tracking. */
(() => {
 'use strict';
 const $ = selector => document.querySelector(selector);
 const $$ = selector => [...document.querySelectorAll(selector)];
 const en = document.documentElement.lang === 'en';
 const words = en ? {open:'Open menu',close:'Close menu',pause:'Pause motion',play:'Enable motion',count:'properties shown'} : {open:'Menüyü aç',close:'Menüyü kapat',pause:'Hareketi durdur',play:'Hareketi aç',count:'tesis gösteriliyor'};
 document.documentElement.classList.add('js');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let paused=false;
 try {paused=localStorage.getItem('exdio-motion')==='off';}catch(_){}
 const motion=$('.motion-toggle');
 function applyMotion(){document.documentElement.classList.toggle('no-motion',paused||reduced.matches);motion.textContent=paused?words.play:words.pause;motion.setAttribute('aria-pressed',String(paused));}
 motion.addEventListener('click',()=>{paused=!paused;try{localStorage.setItem('exdio-motion',paused?'off':'on');}catch(_){}applyMotion();});
 reduced.addEventListener('change',applyMotion);applyMotion();
 const menu=$('#mobile-menu'),toggle=$('.menu-toggle');
 function closeMenu(focus=false){menu.hidden=true;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label',words.open);if(focus)toggle.focus();}
 toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')!=='true';menu.hidden=!open;toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?words.close:words.open);});
 $$('#mobile-menu a').forEach(a=>a.addEventListener('click',()=>closeMenu()));
 document.addEventListener('click',e=>{if(!menu.hidden&&!menu.contains(e.target)&&!toggle.contains(e.target))closeMenu();});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!menu.hidden)closeMenu(true);});
 matchMedia('(min-width:801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});
 const header=$('.header');addEventListener('scroll',()=>header.classList.toggle('scrolled',scrollY>20),{passive:true});
 const filters=$$('.filter'),cards=$$('.hotel-card');
 filters.forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));let count=0;cards.forEach(card=>{card.hidden=filter!=='all'&&card.dataset.location!==filter;if(!card.hidden){count++;card.classList.remove('waiting');}});$('.hotel-grid').classList.toggle('filtered',filter!=='all');$('#filter-status').textContent=`${count} ${words.count}`;}));
 const hotelData=JSON.parse($('#hotel-data').textContent),dialog=$('.hotel-dialog');let opener=null;
 $$('.hotel-open').forEach(button=>button.addEventListener('click',()=>{const data=hotelData[button.dataset.hotel];if(!data)return;if(typeof dialog.showModal!=='function'){window.open(data.url,'_blank','noopener');return;}opener=button;$('#dialog-name').textContent=data.name;$('#dialog-place').textContent=data.location+' · '+data.category;$('#dialog-title').textContent=data.title;$('#dialog-description').textContent=data.description;$('#dialog-image').src=data.image;$('#dialog-image').alt=data.alt;$('#dialog-detail').src=data.detail;$('#dialog-detail').alt=data.detailAlt;$('#dialog-link').href=data.url;dialog.showModal();dialog.scrollTop=0;document.body.classList.add('locked');}));
 $('.dialog-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();});
 dialog.addEventListener('close',()=>{document.body.classList.remove('locked');if(opener)opener.focus({preventScroll:true});});
 $('.privacy-button').addEventListener('click',()=>{const note=$('#privacy-note');note.hidden=!note.hidden;$('.privacy-button').setAttribute('aria-expanded',String(!note.hidden));});
 if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('waiting');observer.unobserve(entry.target);}}),{threshold:.05,rootMargin:'0px 0px -15px 0px'});$$('.reveal').forEach(el=>{if(el.getBoundingClientRect().top>innerHeight)el.classList.add('waiting');observer.observe(el);});const sections=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;$$('.desktop-nav a').forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});}),{rootMargin:'-15% 0px -65% 0px'});$$('main section[id]').forEach(el=>sections.observe(el));}
 $('#year').textContent=new Date().getFullYear();
})();
