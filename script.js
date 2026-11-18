/* Hills East: native-scroll rack, playback unit with meter demo, booking, hidden instrument. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // matchMedia() returns a fresh list each call in some engines and a cached list can go
  // stale under emulation, so read the live state instead of trusting the cached object.
  const reducedOn = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  root.classList.add('has-js');
  $('[data-year]')?.replaceChildren(String(new Date().getFullYear()));
  const motionAllowed = () => !reducedOn();
  const state = { stage: 0 };
  const setters = {};
  $$('.knob').forEach(el => {
    const key = el.dataset.knob, max = +el.getAttribute('aria-valuemax'), stepped = !!el.dataset.steps;
    if (!(key in state)) state[key] = +el.getAttribute('aria-valuenow') || 0;
    const set = setters[key] = v => {
      state[key] = clamp(stepped ? Math.round(v) : v,0,max);
      const n = state[key];
      el.style.setProperty('--a', (-135+n/max*270)+'deg');
      el.style.setProperty('--sweep', n/max*270+'deg');
      el.setAttribute('aria-valuenow',Math.round(n));
      el.setAttribute('aria-valuetext', stepped ? ['Talk','Track','Finish'][n] : Math.round(n)+'%');
      const out = $(`[data-value="${key}"]`); if (out) out.textContent = Math.round(n)+'%';
      if (key === 'stage') $$('.stage').forEach(s => s.classList.toggle('is-on',+s.dataset.stage===n));
      else window.RackKnobs?.actions?.[key]?.(n);
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

  /* Every VU on the page shares the same scale. */
  $$('.vu-ticks').forEach(g=>{for(let i=0;i<=10;i++){
    const a=(-80+i*16)*Math.PI/180,l=document.createElementNS('http://www.w3.org/2000/svg','line');
    l.setAttribute('x1',100+85*Math.sin(a));l.setAttribute('y1',100-85*Math.cos(a));
    l.setAttribute('x2',100+(i%5?78:72)*Math.sin(a));l.setAttribute('y2',100-(i%5?78:72)*Math.cos(a));g.append(l);
  }});
  /* Room and power ladders follow the same level as the meter bridge. */
  const ladders=$$('.ladder-leds');
  ladders.forEach(l=>{for(let i=0;i<12;i++){const b=document.createElement('i');if(i>=8)b.classList.add(i>=11?'peak':'hot');l.append(b);}});

  /* ---------- 4U playback: two YouTube sources, transport, stereo meter demo ----------
     The iframe's audio is cross-origin and is never measured. The needles follow the
     transport state with a simulated programme level — a visual demo, not a meter of
     the video's audio. */
  const playerEl=$('#player'), screenHolder=$('#screen-holder'), screenFrame=$('#screen-frame'), screenIdle=$('#screen-idle');
  const statusEl=$('#player-status');
  const sourceBtns=$$('.source');
  const titles=new Map(sourceBtns.map(b=>[b.dataset.video,b.dataset.title]));
  const needles=$$('.vu-needle');
  const yt={status:'idle',video:null,player:null,api:false,loading:null};
  let levels=[0,0], phase=0, last=0, frameId=0, playerVisible=false;
  const playerAllowed=()=>motionAllowed()&&!document.hidden&&playerVisible;
  function programmeLevel(t,ch){
    const beat=Math.pow(Math.max(0,Math.sin(t*4.4+ch*.5)),6);
    const phrase=.5+.5*Math.sin(t*.55+ch*.9);
    const chop=.5+.5*Math.sin(t*11.3+ch*2.2);
    return clamp(.16+.5*phrase*beat+.12*chop,.02,1);
  }
  function paintMeters(){
    needles.forEach((n,i)=>n.setAttribute('transform',`rotate(${-48+levels[i]*(i?94:100)} 100 100)`));
    playerEl.dataset.levelL=levels[0].toFixed(4);
    playerEl.dataset.levelR=levels[1].toFixed(4);
    const peak=Math.max(levels[0],levels[1]);
    ladders.forEach(l=>[...l.children].forEach((b,i)=>b.classList.toggle('on',i<Math.round(peak*12))));
  }
  function meterFrame(t){
    frameId=0;
    if(!playerAllowed())return;
    const dt=Math.min(.05,(t-last)/1000||.016);last=t;phase+=dt;
    const playing=yt.status==='playing';
    [0,1].forEach(i=>{
      const want=playing?programmeLevel(phase,i):0;
      const tau=want>levels[i]?.11:.45;
      levels[i]+=(want-levels[i])*(1-Math.exp(-dt/tau));
    });
    paintMeters();
    frameId=requestAnimationFrame(meterFrame);
  }
  function syncMeter(){
    cancelAnimationFrame(frameId);frameId=0;last=performance.now();
    if(playerAllowed())frameId=requestAnimationFrame(meterFrame);
    else { levels=[0,0]; paintMeters(); }
    root.dataset.meterRunning=String(!!frameId);
  }
  function setStatus(text){ statusEl.textContent=text; }
  function showIdle(){ screenIdle.hidden=false; screenFrame.hidden=true; }
  function showScreen(){ screenIdle.hidden=true; screenFrame.hidden=false; }
  function syncTransport(){
    // transport UI removed; playback state is reflected by the YouTube iframe itself
  }
  function onState(e){
    const s=e.data;
    if(yt.stopping&&s===5){ yt.stopping=false; yt.status='idle'; showIdle(); syncTransport(); syncMeter(); return; }
    yt.status=s===1?'playing':s===2?'paused':s===3?'buffering':s===0?'ended':s===5?'cued':'idle';
    const title=titles.get(yt.video)||'source';
    if(yt.status==='ended')showIdle();
    syncTransport();syncMeter();
  }
  function onPlayerError(){
    yt.status='error';
    const id=yt.video||'RE-oPaanCas';
    statusEl.innerHTML=`This video couldn’t play here — <a href="https://www.youtube.com/watch?v=${id}">watch it on YouTube</a>.`;
    showIdle();syncTransport();syncMeter();
  }
  function loadApi(){
    if(yt.api)return Promise.resolve();
    if(yt.loading)return yt.loading;
    yt.loading=new Promise(resolve=>{
      window.onYouTubeIframeAPIReady=()=>{yt.api=true;resolve();};
      const s=document.createElement('script');
      s.src='https://www.youtube.com/iframe_api';
      s.onerror=()=>resolve();
      document.head.append(s);
      setTimeout(resolve,8000);
    });
    return yt.loading;
  }
  async function playVideo(id){
    yt.video=id;yt.status='loading';yt.stopping=false;
    sourceBtns.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.video===id)));
    showScreen();syncTransport();syncMeter();
    await loadApi();
    if(!window.YT||!YT.Player){ yt.status='error'; setStatus('Couldn’t reach YouTube — check your connection and try again.'); syncTransport(); return; }
    try{
      if(!yt.player){
        yt.player=new YT.Player(screenHolder,{
          width:'100%',height:'100%',videoId:id,
          playerVars:Object.assign({autoplay:1,rel:0,modestbranding:1,playsinline:1},location.protocol.startsWith('http')?{origin:location.origin}:{}),
          events:{onStateChange:onState,onError:onPlayerError,onReady:()=>{yt.player.playVideo();}}
        });
      } else yt.player.loadVideoById(id);
    }catch(err){ yt.status='error'; setStatus('Playback failed to start.'); syncTransport(); }
    syncTransport();
  }
  sourceBtns.forEach(b=>b.addEventListener('click',()=>playVideo(b.dataset.video)));
  new IntersectionObserver(entries=>{playerVisible=entries[0].isIntersecting;syncMeter();}).observe(playerEl);
  syncTransport();paintMeters();

  /* One owner for ident state. The poster paints first; the loop (a 330 KB H.264 file, not the old 1.6 MB
     animated WebP) is fetched only after the page has loaded and only if motion is allowed. Pause shows the
     current frame; the poster stays for reduced-motion and no-JS visitors. */
  const identVideo=$('#ident'), identBtn=$('#ident-toggle'), identGlass=$('.crt-glass');
  let identWanted=!reducedOn(), identVisible=true, identPlaying=null, identReady=false;
  function loadIdent(){ if(identReady) return; identReady=true; identVideo.preload='auto'; identVideo.load(); }
  function syncIdent(){
    const playing=identWanted&&motionAllowed()&&!document.hidden&&identVisible;
    if(playing!==identPlaying){
      if(playing){ loadIdent(); identVideo.play().catch(()=>{ identWanted=false; syncIdent(); }); }
      else identVideo.pause();
      identPlaying=playing;
    }
    identBtn.setAttribute('aria-pressed',String(playing));identBtn.setAttribute('aria-label',playing?'Pause ident':'Play ident');
    identGlass.classList.toggle('is-paused',!playing);
  }
  identBtn.addEventListener('click',()=>{identWanted=!identPlaying;syncIdent();});
  new IntersectionObserver(entries=>{identVisible=entries[0].isIntersecting;syncIdent();}).observe($('.crt'));
  // Never compete with fonts, CSS and the first paint: the loop waits for the load event (or 1.5 s, whichever is first).
  { let kicked=false; const kick=()=>{ if(kicked) return; kicked=true; syncIdent(); }; if(identWanted&&motionAllowed()){ addEventListener('load',kick,{once:true}); setTimeout(kick,1500); } else kick(); }

  /* Native scrolling: a paired assembly moment, then restrained plate seating. */
  let scrollContext=null;
  if(window.gsap&&window.ScrollTrigger)gsap.registerPlugin(ScrollTrigger);
  function syncScroll(){
    scrollContext?.revert();scrollContext=null;
    if(!motionAllowed()||!window.gsap||!window.ScrollTrigger)return;
    scrollContext=gsap.context(()=>{
      gsap.fromTo('#player',{y:26,scale:.982},{y:0,scale:1,ease:'none',scrollTrigger:{trigger:'#player',start:'top bottom',end:'top 55%',scrub:true}});
    });
    ScrollTrigger.refresh();
  }
  function syncMotion({deferIdent=false}={}){
    root.classList.toggle('motion-paused',!motionAllowed());
    syncMeter();if(!deferIdent)syncIdent();syncScroll();
    dispatchEvent(new CustomEvent('rack:motion',{detail:{paused:!motionAllowed()}}));
  }
  reduced.addEventListener('change',()=>{if(reducedOn())identWanted=false;syncMotion();});
  document.addEventListener('visibilitychange',()=>{syncMeter();syncIdent();});

  const hidden=$('#hidden-rack');let presses=[];
  $('#reset').addEventListener('click',()=>{
    const now=performance.now();presses=presses.filter(t=>now-t<2000).concat(now);
    if(presses.length>=3){presses=[];hidden.hidden=false;hidden.classList.add('is-in');if(!hidden.childElementCount)window.HiddenRack?.mount(hidden);hidden.scrollIntoView({behavior:motionAllowed()?'smooth':'instant',block:'start'});window.ScrollTrigger?.refresh();}
  });
  new MutationObserver(()=>{if(!hidden.hidden&&!hidden.childElementCount){hidden.hidden=true;hidden.classList.remove('is-in');window.ScrollTrigger?.refresh();}}).observe(hidden,{childList:true});
  syncMotion({deferIdent:true});
  document.fonts.ready.then(()=>{window.ScrollTrigger?.refresh();});
})();
