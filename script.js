/* Hills East: native-scroll rack, visual meter demo, booking routes, hidden instrument. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  root.classList.add('has-js');
  $('[data-year]')?.replaceChildren(String(new Date().getFullYear()));
  let paused = false;
  const motionAllowed = () => !paused && !reduced.matches;
  const state = { gain:62, peak:35, input:62, attack:25, release:45, output:65, stage:0, ratio:4 };
  const setters = {};
  let updateDemo = () => {};
  function format(key,v) {
    if (key === 'attack') return Math.round(10 + v * 4) + ' ms';
    if (key === 'release') return Math.round(80 + v * 12) + ' ms';
    return Math.round(v) + '%';
  }
  $$('.knob').forEach(el => {
    const key = el.dataset.knob, max = +el.getAttribute('aria-valuemax'), stepped = !!el.dataset.steps;
    const set = setters[key] = v => {
      state[key] = clamp(stepped ? Math.round(v) : v,0,max);
      const n = state[key];
      el.style.setProperty('--a', (-135+n/max*270)+'deg');
      el.style.setProperty('--sweep', n/max*270+'deg');
      el.setAttribute('aria-valuenow',Math.round(n));
      el.setAttribute('aria-valuetext', stepped ? ['Talk','Track','Finish'][n] : format(key,n));
      const out = $(`[data-value="${key}"]`); if (out) out.textContent = format(key,n);
      if (key === 'stage') $$('.stage').forEach(s => s.classList.toggle('is-on',+s.dataset.stage===n));
      else updateDemo();
    };
    set(state[key]);
    let drag = null;
    el.addEventListener('pointerdown',e => { if(e.button!==0)return; el.focus(); drag={id:e.pointerId,y:e.clientY,v:state[key]}; el.setPointerCapture(e.pointerId); });
    el.addEventListener('pointermove',e => { if(drag && drag.id===e.pointerId) set(drag.v+(drag.y-e.clientY)*max/(stepped?120:160)); });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type=>el.addEventListener(type,()=>{drag=null;}));
    el.addEventListener('keydown',e => {
      const dir={ArrowUp:1,ArrowRight:1,ArrowDown:-1,ArrowLeft:-1}[e.key];
      if(dir){e.preventDefault();set(state[key]+dir*(stepped?1:5));}
      else if(e.key==='Home'||e.key==='End'){e.preventDefault();set(e.key==='Home'?0:max);}
    });
    // Wheel adjusts only a focused control, leaving normal page scrolling alone.
    el.addEventListener('wheel',e=>{if(document.activeElement!==el)return;e.preventDefault();set(state[key]-Math.sign(e.deltaY)*(stepped?1:4));},{passive:false});
  });
  $$('[data-adjust]').forEach(b=>b.addEventListener('click',()=>setters[b.dataset.adjust](state[b.dataset.adjust]+Number(b.dataset.direction)*5)));
  $$('[data-ratio]').forEach(b=>b.addEventListener('click',()=>{
    state.ratio=+b.dataset.ratio;
    $$('[data-ratio]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
    updateDemo();
  }));

  /* Visual mathematics only. No audio nodes or hidden-rack audio are processed here. */
  const needles=$$('.vu-needle'), leds=$$('.reduction-leds i'), ladders=$$('.ladder-leds');
  $$('.vu-ticks').forEach(g=>{for(let i=0;i<=10;i++){
    const a=(-80+i*16)*Math.PI/180,l=document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1',100+85*Math.sin(a));l.setAttribute('y1',100-85*Math.cos(a));
    l.setAttribute('x2',100+(i%5?78:72)*Math.sin(a));l.setAttribute('y2',100-(i%5?78:72)*Math.cos(a));g.append(l);
  }});
  ladders.forEach(l=>{for(let i=0;i<12;i++){const b=document.createElement('i');if(i>=8)b.classList.add(i>=11?'peak':'hot');l.append(b);}});
  let level=.3, reduction=0, phase=0, last=0, frameId=0;
  const visibleUnits=new Set();
  function responseSeconds(rising) { return rising ? (10+state.attack*4)/1000 : (80+state.release*12)/1000; }
  const demo = pulse => {
    const input=state.input/100*pulse;
    const gr=Math.max(0,input-.22)*(1-1/state.ratio);
    return {level:clamp((input-gr)*(state.output/65)*(state.gain/62)*(1-state.peak/150),0,1),gr:gr*24};
  };
  function paint(){
    needles.forEach((n,i)=>n.setAttribute('transform',`rotate(${-48+level*(i?94:100)} 100 100)`));
    [1,2,3,4,6,8,10,12].forEach((v,i)=>leds[i].classList.toggle('on',reduction>=v));
    $('#demo-reduction').textContent=reduction.toFixed(1)+' demo dB';
    $('#dynamics').dataset.demoLevel=level.toFixed(4);
    $('#dynamics').dataset.demoReduction=reduction.toFixed(4);
    $('#dynamics').dataset.attackResponse=(1-Math.exp(-.1/responseSeconds(true))).toFixed(4);
    $('#dynamics').dataset.releaseResponse=(1-Math.exp(-.1/responseSeconds(false))).toFixed(4);
    ladders.forEach(l=>[...l.children].forEach((b,i)=>b.classList.toggle('on',i<Math.round(level*12))));
  }
  updateDemo=()=>{
    const d=demo(.82);level=d.level;reduction=d.gr;paint();
    $('#demo-settings').textContent=`Input ${Math.round(state.input)}% · Attack ${format('attack',state.attack)} · Release ${format('release',state.release)} · Output ${Math.round(state.output)}% · Ratio ${state.ratio}:1`;
  };
  updateDemo();
  function frame(t){
    frameId=0;
    if(!motionAllowed()||document.hidden||!visibleUnits.size)return;
    const dt=Math.min(.05,(t-last)/1000||.016);last=t;phase+=dt;
    const d=demo(.45+.5*Math.pow(Math.max(0,Math.sin(phase*4.4)),4));
    const tau=responseSeconds(d.level>level);
    const alpha=1-Math.exp(-dt/tau);level+=(d.level-level)*alpha;reduction+=(d.gr-reduction)*alpha;paint();
    frameId=requestAnimationFrame(frame);
  }
  function syncFrames(){cancelAnimationFrame(frameId);frameId=0;last=performance.now();if(motionAllowed()&&!document.hidden&&visibleUnits.size)frameId=requestAnimationFrame(frame);root.dataset.demoRunning=String(!!frameId);}
  const meterObserver=new IntersectionObserver(entries=>{entries.forEach(e=>e.isIntersecting?visibleUnits.add(e.target):visibleUnits.delete(e.target));syncFrames();});
  $$('#optical, #dynamics').forEach(e=>meterObserver.observe(e));

  /* One owner for ident state; pause substitutes the poster rather than cropping a frame. */
  const identImg=$('.crt-img'), identPic=identImg.closest('picture'), identBtn=$('#ident-toggle');
  let identWanted=!reduced.matches, identVisible=true, identPlaying=null;
  function syncIdent(){
    const playing=identWanted&&motionAllowed()&&!document.hidden&&identVisible;
    if(playing!==identPlaying){
      let source=$('source',identPic);
      if(playing){if(!source){source=document.createElement('source');source.type='image/webp';identPic.prepend(source);}source.srcset='assets/hills-east-ident.webp';identImg.src='assets/hills-east-ident.gif';}
      else {source?.remove();identImg.src='assets/hills-east-poster.jpg';}
      identPlaying=playing;
    }
    identBtn.setAttribute('aria-pressed',String(playing));identBtn.textContent=playing?'Pause ident':'Play ident';
    $('.crt-glass').style.animationPlayState=playing?'running':'paused';
  }
  identBtn.addEventListener('click',()=>{identWanted=!identPlaying;if(identWanted&&!reduced.matches&&paused){paused=false;syncMotion();}syncIdent();});
  new IntersectionObserver(entries=>{identVisible=entries[0].isIntersecting;syncIdent();}).observe($('.crt'));
  $('#lamp-level').addEventListener('input',e=>root.style.setProperty('--lamp',(0.15+e.target.value/100*.85).toFixed(3)));
  $('#scan-speed').addEventListener('input',e=>root.style.setProperty('--crt-period',(3.2/(.4+e.target.value/100*1.6)).toFixed(2)+'s'));
  root.style.setProperty('--lamp',(.15+.7*.85).toFixed(3));
  root.style.setProperty('--crt-period',(3.2/(.4+.5*1.6)).toFixed(2)+'s');

  /* Native scrolling: a paired assembly moment, then restrained plate seating. */
  let scrollContext=null;
  if(window.gsap&&window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  function syncScroll(){
    scrollContext?.revert();scrollContext=null;
    if(!motionAllowed()||!window.gsap||!window.ScrollTrigger)return;
    scrollContext=gsap.context(()=>{
      gsap.fromTo('#optical',{y:32,scale:.975},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:'#optical',start:'top bottom',end:'top 55%',scrub:true}});
      gsap.fromTo('#dynamics',{y:22,scale:.985},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:'#dynamics',start:'top bottom',end:'top 65%',scrub:true}});
      gsap.fromTo('#patch .jackfield',{y:14},{y:0,ease:'none',scrollTrigger:{trigger:'#patch',start:'top bottom',end:'top 40%',scrub:true,onUpdate:()=>draw()}});
    });
    ScrollTrigger.refresh();
  }
  function syncMotion(){
    root.classList.toggle('motion-paused',!motionAllowed());
    $('#motion-toggle').setAttribute('aria-pressed',String(paused||reduced.matches));
    $('#motion-toggle').textContent=reduced.matches?'Reduced motion on':paused?'Resume motion':'Pause all motion';
    $('#motion-toggle').disabled=reduced.matches;
    syncFrames();syncIdent();syncScroll();
    dispatchEvent(new CustomEvent('rack:motion',{detail:{paused:!motionAllowed()}}));
  }
  $('#motion-toggle').addEventListener('click',()=>{paused=!paused;syncMotion();});
  reduced.addEventListener('change',()=>{if(reduced.matches)identWanted=false;syncMotion();});
  document.addEventListener('visibilitychange',()=>{syncFrames();syncIdent();});

  /* A patch is a booking brief, not a decorative signal path. */
  const field=$('.jackfield'), svg=$('.cables'), jacks=$$('.jack');
  const input=$('#route-input'), output=$('#route-output'), need=$('#need');
  const room=$('[data-jack="room"]');
  let armed=null, dragged=false;
  const routeLabels={'in-tracking':'Tracking','in-mixing':'Mixing','in-finishing':'Finishing','out-record':'A record','out-release':'Release','out-video':'Vinyl / video'};
  const center=el=>{const r=el.getBoundingClientRect(),f=field.getBoundingClientRect();return{x:r.left-f.left+r.width/2,y:r.top-f.top+r.height/2};};
  const bez=(a,b)=>{const sag=38+Math.hypot(b.x-a.x,b.y-a.y)*.18;return`M${a.x} ${a.y} C${a.x} ${a.y+sag}, ${b.x} ${b.y+sag}, ${b.x} ${b.y}`;};
  function draw(){
    $$('.cables path:not(.preview)').forEach(p=>p.remove());
    [input.value,output.value].filter(Boolean).forEach((key,i)=>{const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',bez(center($(`[data-jack="${key}"]`)),center(room)));p.setAttribute('class','c'+i);svg.append(p);});
  }
  function updateRoute(){
    const i=input.value,o=output.value;
    const summary=i||o?`${routeLabels[i]||'Service undecided'} → John → ${routeLabels[o]||'Outcome undecided'}`:'';
    if(i)need.value=routeLabels[i];
    $('#booking-route').textContent=summary||'No patch route selected.';
    $('#booking-route-field').value=summary;
    $('#route-status').textContent=summary?(summary+(i&&o?' · Ready for your brief.':' · You can fill in the rest with John.')):'Choose a service and an outcome, or go straight to booking.';
    $('#route-lamp').classList.toggle('jewel--on',!!(i&&o));
    jacks.forEach(j=>{const selected=[i,o,...(i||o?['room']:[])].includes(j.dataset.jack);j.classList.toggle('patched',selected);j.setAttribute('aria-pressed',String(selected));});
    $$('.service').forEach(s=>s.classList.toggle('is-on',s.dataset.service===i));
    $('#services').classList.toggle('has-route',!!i);
    draw();window.ScrollTrigger?.refresh();
  }
  [input,output].forEach(s=>s.addEventListener('change',updateRoute));
  $('#clear-route').addEventListener('click',()=>{input.value='';output.value='';need.value='Not sure yet';armed?.classList.remove('armed');armed=null;updateRoute();});
  $('#use-route').addEventListener('click',()=>{updateRoute();$('#book').scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'start'});$('#name').focus({preventScroll:true});});
  // Editing service in the form stays authoritative and keeps its route summary consistent.
  need.addEventListener('change',()=>{input.value=Object.keys(routeLabels).find(k=>k.startsWith('in-')&&routeLabels[k]===need.value)||'';updateRoute();});
  function connect(a,b){
    const keys=[a.dataset.jack,b.dataset.jack];
    const key=keys.find(k=>k!=='room');
    if(!keys.includes('room')||a===b){$('#route-status').textContent='Connect an input to John, or John to an output. The selectors also work.';return;}
    (key.startsWith('in-')?input:output).value=key;updateRoute();
  }
  jacks.forEach(j=>{
    j.addEventListener('pointerdown',e=>{
      if(e.button!==0)return;dragged=false;const start={x:e.clientX,y:e.clientY};
      const preview=document.createElementNS('http://www.w3.org/2000/svg','path');preview.setAttribute('class','preview');svg.append(preview);
      const move=ev=>{if(Math.hypot(ev.clientX-start.x,ev.clientY-start.y)>6)dragged=true;const f=field.getBoundingClientRect();preview.setAttribute('d',bez(center(j),{x:ev.clientX-f.left,y:ev.clientY-f.top}));};
      const finish=ev=>{window.removeEventListener('pointermove',move);window.removeEventListener('pointerup',finish);window.removeEventListener('pointercancel',finish);preview.remove();if(ev.type==='pointercancel'){dragged=false;return;}if(!dragged)return;const target=document.elementFromPoint(ev.clientX,ev.clientY)?.closest('.jack');if(target)connect(j,target);armed?.classList.remove('armed');armed=null;};
      window.addEventListener('pointermove',move);window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish);
    });
    j.addEventListener('click',()=>{if(dragged){dragged=false;return;}if(armed&&armed!==j){connect(armed,j);armed.classList.remove('armed');armed=null;}else if(armed===j){j.classList.remove('armed');armed=null;}else{armed=j;j.classList.add('armed');$('#route-status').textContent='Jack selected. Now choose John or the other end of the route.';}});
    j.addEventListener('keydown',e=>{if(e.key==='Escape'){armed?.classList.remove('armed');armed=null;updateRoute();}});
  });
  addEventListener('resize',draw);
  updateRoute();

  const form=$('.book-form');
  form.addEventListener('submit',e=>{e.preventDefault();if(!form.reportValidity())return;$('#form-note').textContent='Not sent — this form isn’t connected yet. Your text and route are still here; John’s direct contact details will replace this note once he supplies them.';$('#form-note').setAttribute('role','status');});
  const hidden=$('#hidden-rack');let presses=[];
  $('#reset').addEventListener('click',()=>{
    const now=performance.now();presses=presses.filter(t=>now-t<2000).concat(now);
    if(presses.length>=3){presses=[];if(!hidden.hidden)return;hidden.hidden=false;hidden.classList.add('is-in');window.HiddenRack?.mount(hidden);hidden.scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'start'});window.ScrollTrigger?.refresh();}
  });
  new MutationObserver(()=>{if(!hidden.hidden&&!hidden.childElementCount){hidden.hidden=true;hidden.classList.remove('is-in');window.ScrollTrigger?.refresh();}}).observe(hidden,{childList:true});
  syncMotion();
  document.fonts.ready.then(()=>{draw();window.ScrollTrigger?.refresh();});
})();
