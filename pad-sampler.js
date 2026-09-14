/* Hills East Pad Sampler. Original synthesized one-shots; no manufacturer affiliation. */
(function () {
  'use strict';
  const sounds = ['DEEP KICK','DUST SNARE','CLOSED HAT','OPEN HAT','HAND CLAP','RIM SHOT','LOW TOM','HIGH TOM','COWBELL','SHAKER','TAMBOURINE','CRASH','SUB BASS','CHORD Cm','MALLET','SPACE FX'];
  function render(ctx, index) {
    const durations = [.65,.3,.11,.65,.3,.16,.5,.35,.35,.17,.4,1.1,.85,1.25,.8,1.2];
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * durations[index]), ctx.sampleRate);
    const data = buffer.getChannelData(0); let seed = 1301 + index * 971, low = 0, phase = 0;
    const sin = (f,t) => Math.sin(2 * Math.PI * f * t);
    for (let n = 0; n < data.length; n++) {
      const t = n / ctx.sampleRate;
      seed = (Math.imul(seed,1664525) + 1013904223) >>> 0;
      const noise = seed / 2147483648 - 1; low += .12 * (noise - low);
      const hi = noise - low; let v = 0;
      switch (index) {
        case 0: phase += 2*Math.PI*(43+120*Math.exp(-t*35))/ctx.sampleRate; v = Math.sin(phase)*Math.exp(-t*8)+hi*.15*Math.exp(-t*160); break;
        case 1: v = .65*hi*Math.exp(-t*18)+.45*sin(180,t)*Math.exp(-t*24); break;
        case 2: v = hi*Math.exp(-t*65); break;
        case 3: v = hi*Math.exp(-t*8)*(.7+.3*sin(7100,t)); break;
        case 4: v = hi * ([0,.014,.03].reduce((a,o)=>a+(t>=o?Math.exp(-(t-o)*45):0),0)); break;
        case 5: v = (sin(1700,t)+.5*sin(830,t))*Math.exp(-t*55); break;
        case 6: phase += 2*Math.PI*(95+90*Math.exp(-t*30))/ctx.sampleRate; v = Math.sin(phase)*Math.exp(-t*10); break;
        case 7: phase += 2*Math.PI*(190+130*Math.exp(-t*40))/ctx.sampleRate; v = Math.sin(phase)*Math.exp(-t*14); break;
        case 8: v = (Math.sign(sin(540,t))+.7*Math.sign(sin(800,t)))*Math.exp(-t*15); break;
        case 9: v = hi*Math.sin(Math.PI*Math.min(1,t/.16))*Math.exp(-t*16); break;
        case 10: v = (hi*.6+sin(6200,t)*sin(4300,t)*.4)*Math.exp(-t*12); break;
        case 11: v = (hi*.65+sin(3700,t)*sin(5107,t)*.35)*Math.exp(-t*4); break;
        case 12: v = (sin(65.406,t)+.2*sin(130.812,t))*Math.exp(-t*5); break;
        case 13: v = [130.8128,155.5635,195.9977].reduce((a,f)=>a+sin(f,t)+.24*sin(f*2,t),0)/3*Math.exp(-t*3.5); break;
        case 14: v = (sin(523.25,t)+.5*sin(1443.3,t)*Math.exp(-t*14))*Math.exp(-t*7); break;
        case 15: phase += 2*Math.PI*(180+1800*Math.exp(-t*4))/ctx.sampleRate; v = (Math.sin(phase)+.25*hi)*Math.exp(-t*3.8)*(.7+.3*sin(17,t)); break;
      }
      const edge = Math.min(1,n/64,(data.length-1-n)/256);
      data[n] = v * edge;
    }
    let peak = 0; for (const v of data) peak = Math.max(peak,Math.abs(v));
    for (let n=0;n<data.length;n++) data[n] *= .78/peak;
    return buffer;
  }
  window.HillsPadSampler = function (host, api) {
    const patterns = sounds.map(()=>Array(16).fill(false));
    let selected=0, mode='pads', ctx=null, gain=null, buffers=[], volume=.7, playing=false, current=-1, dead=false;
    const active = new Set(), cleanup=[], flashes=new Map();
    function el(tag,cls,text,parent=host) { const e=document.createElement(tag);e.className=cls;if(text!==undefined)e.textContent=text;parent.append(e);return e; }
    function on(e,type,fn) {e.addEventListener(type,fn);cleanup.push(()=>e.removeEventListener(type,fn));}
    function button(text,cls,parent,fn) {const e=el('button',cls,text,parent);e.type='button';on(e,'click',fn);return e;}
    host.classList.add('hr-sampler');host.setAttribute('aria-label','Pad sampler');host.dataset.rackUnits='6';
    const top=el('header','mpc-top');
    el('h2','mpc-title','HILLS EAST',top);el('span','mpc-model','PAD SAMPLER / 16',top);
    const body=el('div','mpc-body');const panel=el('div','mpc-panel',undefined,body);
    const lcd=el('div','mpc-lcd',undefined,panel);
    const lcdTop=el('div','mpc-lcd-top',undefined,lcd);const status=el('span','mpc-status','STOPPED',lcdTop);const tempo=el('span','mpc-tempo',api.tempo()+' BPM',lcdTop);
    const name=el('strong','mpc-sound','01  DEEP KICK',lcd);
    const detail=el('span','mpc-detail','PADS · TAP TO PLAY',lcd);
    const modes=el('div','mpc-modes',undefined,panel);modes.setAttribute('role','group');modes.setAttribute('aria-label','Pad function');
    const padMode=button('PLAY PADS','mpc-button',modes,()=>{mode='pads';update();});
    const stepMode=button('16 STEPS','mpc-button',modes,()=>{mode='steps';update();});
    const label=el('label','mpc-select-label','SOUND / PATTERN',panel);
    const select=el('select','mpc-select',undefined,label);select.setAttribute('aria-label','Sampler sound and pattern');
    sounds.forEach((s,i)=>{const option=el('option','',String(i+1).padStart(2,'0')+' '+s,select);option.value=String(i);});
    on(select,'change',()=>{selected=Number(select.value);update();});
    const controls=el('div','mpc-controls',undefined,panel);
    const transport=button('PLAY RACK','mpc-button mpc-play',controls,()=>api.transport());transport.setAttribute('aria-pressed','false');
    const clear=button('CLEAR PATTERN','mpc-button',controls,()=>{patterns[selected].fill(false);update();announce.textContent=sounds[selected]+' pattern cleared.';});
    const levelLabel=el('label','mpc-level','SAMPLER LEVEL',panel);
    const level=el('input','',undefined,levelLabel);level.type='range';level.min='0';level.max='100';level.value='70';level.setAttribute('aria-label','Sampler level');
    const readout=el('output','','70%',levelLabel);
    on(level,'input',()=>{volume=Number(level.value)/100;readout.textContent=level.value+'%';if(gain){const now=ctx.currentTime;gain.gain.cancelScheduledValues(now);gain.gain.setValueAtTime(gain.gain.value,now);gain.gain.linearRampToValueAtTime(volume,now+.015);}});
    el('p','mpc-help','Choose a sound. Switch to 16 STEPS and tap a rhythm. PLAY RACK runs every pattern with the drum machine; BPM and swing follow its clock.',panel);
    const grid=el('div','mpc-pads',undefined,body);grid.setAttribute('role','group');grid.setAttribute('aria-label','Sixteen sampler pads');
    const pads=sounds.map((sound,i)=>{
      const p=button('','mpc-pad',grid,e=>{if(e.detail===0)activate(i);});p.dataset.pad=String(i);
      el('span','mpc-pad-number',String(i+1).padStart(2,'0'),p);el('span','mpc-pad-name',sound,p);
      on(p,'pointerdown',e=>{if(e.button!==0)return;e.preventDefault();p.focus();activate(i);});
      on(p,'keydown',e=>{if(e.repeat&&(e.key===' '||e.key==='Enter'))e.preventDefault();});
      return p;
    });
    const foot=el('footer','mpc-foot');el('span','','16 ORIGINAL ONE-SHOTS · SHARED RACK CLOCK',foot);
    el('span','','TAB TO A PAD · ENTER / SPACE TO PLAY',foot);
    const announce=el('p','mpc-announcement','');announce.setAttribute('role','status');announce.setAttribute('aria-live','polite');
    function init() {
      if(dead)return false;
      const audio=api.audio();if(!audio){announce.textContent='Audio unavailable. Try a browser with Web Audio support.';return false;}
      if(!ctx){ctx=audio.ctx;gain=ctx.createGain();gain.gain.value=volume;gain.connect(audio.master);buffers=sounds.map((_,i)=>render(ctx,i));}
      return true;
    }
    function trigger(i,t) {
      if(!init())return;
      const source=ctx.createBufferSource();source.buffer=buffers[i];source.connect(gain);active.add(source);
      source.onended=()=>{active.delete(source);source.disconnect();};source.start(t===undefined?ctx.currentTime:t);
    }
    function activate(i) {
      if(mode==='pads'){selected=i;trigger(i);clearTimeout(flashes.get(i));pads[i].classList.add('hit');flashes.set(i,setTimeout(()=>{pads[i].classList.remove('hit');flashes.delete(i);},110));}
      else patterns[selected][i]=!patterns[selected][i];
      update();
    }
    function update() {
      select.value=String(selected);name.textContent=String(selected+1).padStart(2,'0')+'  '+sounds[selected];
      detail.textContent=mode==='pads'?'PADS · TAP TO PLAY':'STEPS · '+patterns[selected].filter(Boolean).length+' / 16 ACTIVE';
      padMode.setAttribute('aria-pressed',String(mode==='pads'));stepMode.setAttribute('aria-pressed',String(mode==='steps'));
      clear.disabled=!patterns[selected].some(Boolean);host.dataset.mode=mode;
      grid.setAttribute('aria-label',mode==='pads'?'Sixteen sampler sounds':sounds[selected]+' sixteen-step pattern');
      pads.forEach((p,i)=>{const activePad=mode==='pads'?selected===i:patterns[selected][i];p.setAttribute('aria-pressed',String(activePad));p.setAttribute('aria-label',mode==='pads'?'Play '+sounds[i]:'Step '+(i+1)+' for '+sounds[selected]);p.classList.toggle('selected',mode==='pads'&&selected===i);p.classList.toggle('programmed',mode==='steps'&&patterns[selected][i]);p.classList.toggle('current',mode==='steps'&&i===current);p.querySelector('.mpc-pad-name').textContent=mode==='pads'?sounds[i]:(patterns[selected][i]?'ON':'—');});
    }
    function stopSources(){active.forEach(source=>{try{source.stop();}catch(_){}source.disconnect();});active.clear();}
    update();
    return {
      tick(step,t){if(dead)return;patterns.forEach((row,i)=>{if(row[step])trigger(i,t);});},
      position(step){current=step;if(mode==='steps')pads.forEach((p,i)=>p.classList.toggle('current',i===step));},
      sync(isPlaying,bpm){playing=isPlaying;status.textContent=playing?'PLAYING':'STOPPED';tempo.textContent=bpm+' BPM';transport.textContent=playing?'STOP RACK':'PLAY RACK';transport.setAttribute('aria-pressed',String(playing));host.classList.toggle('playing',playing);if(!playing){current=-1;stopSources();pads.forEach(p=>p.classList.remove('current'));}},
      destroy(){dead=true;stopSources();flashes.forEach(clearTimeout);flashes.clear();cleanup.forEach(fn=>fn());if(gain)gain.disconnect();buffers=[];ctx=null;}
    };
  };
})();
