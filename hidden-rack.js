/* Hidden Rack — standalone, dependency-free Web Audio instrument. */
(function () {
  'use strict';
  let rack = null;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const frequency = midi => 440 * Math.pow(2, (midi - 69) / 12);
  const names = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const keyMap = {};
  ['z','s','x','d','c','v','g','b','h','n','j','m',','].forEach((k,i) => { keyMap[k] = 48 + i; });
  ['q','2','w','3','e','r','5','t','6','y','7','u','i'].forEach((k,i) => { keyMap[k] = 60 + i; });

  /* stereo peak levels 0..1 for external meters; [0,0] when no audio */
  function getLevels() {
    const s = rack;
    if (!s || !s.analysers || !s.ctx || s.ctx.state !== 'running') return [0, 0];
    return s.analysers.map(a => { a.getFloatTimeDomainData(s.levelBuf); let p = 0; for (let i = 0; i < s.levelBuf.length; i++) { const v = Math.abs(s.levelBuf[i]); if (v > p) p = v; } return Math.min(1, Math.pow(p, 0.6) * 1.15); });
  }
  function unmount() {
    const s = rack;
    if (!s) return;
    window.dispatchEvent(new CustomEvent('hiddenrack:audio', { detail: { levels: null } }));
    rack = null;
    s.dead = true;
    clearInterval(s.timer);
    cancelAnimationFrame(s.frame);
    s.cleanup.forEach(fn => fn());
    s.held.clear();
    if (s.ctx) {
      try { s.master.gain.cancelScheduledValues(s.ctx.currentTime); s.master.gain.setValueAtTime(0, s.ctx.currentTime); } catch (_) {}
      s.sources.forEach(node => { try { node.stop(); } catch (_) {} });
      try { const close = s.ctx.close(); if (close && close.catch) close.catch(() => {}); } catch (_) { try { s.ctx.suspend(); } catch (_) {} }
    }
    s.container.replaceChildren();
  }

  function mount(container) {
    if (!container || container.nodeType !== 1) throw new TypeError('HiddenRack.mount requires a DOM element');
    unmount();
    const s = rack = {
      container, cleanup: [], sources: new Set(), held: new Map(), pointers: new Map(), ctx: null,
      dead: false, playing: false, timer: null, frame: 0, queue: [], step: 0, arp: 0,
      bpm: 120, swing: 0, volume: 0.65, levels: [0.85, 0.6, 0.4, 0.45], seq: false,
      cutoff: 2400, resonance: 1.2, attack: 0.012, decay: 0.2, release: 0.25, glide: 0.045,
      detune: 7, wave1: 'sawtooth', wave2: 'triangle', current: null,
      pattern: [ [0,4,8,12], [4,12], [0,2,4,6,8,10,12,14], [12] ].map(row => Array.from({length:16}, (_,i) => row.includes(i)))
    };
    function listen(target, type, fn, options) {
      target.addEventListener(type, fn, options);
      s.cleanup.push(() => target.removeEventListener(type, fn, options));
    }
    function el(tag, className, text, parent) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined) node.textContent = text;
      if (parent) parent.appendChild(node);
      return node;
    }
    function button(text, cls, parent, fn, pressed) {
      const b = el('button', cls, text, parent);
      b.type = 'button';
      if (pressed !== undefined) b.setAttribute('aria-pressed', String(pressed));
      listen(b, 'click', fn);
      return b;
    }
    function knob(parent, label, min, max, initial, change, opts) {
      opts = opts || {};
      const wrap = el('div', 'hr-control', undefined, parent);
      el('span', 'hr-legend', label, wrap);
      const k = el('div', 'hr-knob', undefined, wrap);
      k.tabIndex = 0;
      k.setAttribute('role', 'slider');
      k.setAttribute('aria-label', label);
      k.setAttribute('aria-valuemin', min);
      k.setAttribute('aria-valuemax', max);
      k.setAttribute('aria-orientation', 'vertical');
      k.style.touchAction = 'none';
      const cap = el('span', 'hr-knob-cap', undefined, k);
      const readout = el('span', 'hr-knob-value', '', wrap);
      let value = initial, drag = null;
      const normalized = v => opts.log ? Math.log(v / min) / Math.log(max / min) : (v - min) / (max - min);
      const fromNorm = n => opts.log ? min * Math.pow(max / min, n) : min + (max - min) * n;
      function set(v) {
        value = clamp(opts.integer ? Math.round(v) : v, min, max);
        const text = opts.format ? opts.format(value) : String(Math.round(value));
        k.setAttribute('aria-valuenow', String(Number(value.toFixed(4))));
        k.setAttribute('aria-valuetext', text);
        cap.style.transform = 'rotate(' + (-135 + 270 * normalized(value)) + 'deg)';
        readout.textContent = text;
        change(value);
      }
      listen(k, 'pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault(); k.focus();
        drag = { id: e.pointerId, y: e.clientY, value: normalized(value) };
        k.setPointerCapture(e.pointerId);
      });
      listen(k, 'pointermove', e => { if (drag && e.pointerId === drag.id) set(fromNorm(clamp(drag.value + (drag.y - e.clientY) / 160, 0, 1))); });
      ['pointerup','pointercancel','lostpointercapture'].forEach(type => listen(k, type, () => { drag = null; }));
      listen(k, 'wheel', e => { e.preventDefault(); set(fromNorm(clamp(normalized(value) - Math.sign(e.deltaY) * 0.02, 0, 1))); }, {passive:false});
      listen(k, 'keydown', e => {
        const dir = {ArrowUp:1, ArrowRight:1, ArrowDown:-1, ArrowLeft:-1}[e.key];
        if (dir) { e.preventDefault(); set(opts.integer ? value + dir * (e.shiftKey ? 10 : 1) : fromNorm(clamp(normalized(value) + dir * (e.shiftKey ? 0.1 : 0.01), 0, 1))); }
        else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); set(e.key === 'Home' ? min : max); }
      });
      set(initial);
      return k;
    }
    function track(node) {
      s.sources.add(node);
      node.onended = () => { s.sources.delete(node); try { node.disconnect(); } catch (_) {} };
      return node;
    }
    function ensureAudio() {
      if (s.dead) return false;
      try {
        if (!s.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (!AC) throw new Error('Web Audio is unavailable in this browser.');
          const ctx = s.ctx = new AC();
          const master = s.master = ctx.createGain(); master.gain.value = s.volume;
          const compressor = ctx.createDynamicsCompressor();
          compressor.threshold.value = -14; compressor.knee.value = 18; compressor.ratio.value = 5;
          compressor.attack.value = 0.003; compressor.release.value = 0.18;
          master.connect(compressor); compressor.connect(ctx.destination);
          // level taps for the page's VU meters: a stereo splitter feeding two analysers
          const splitter = ctx.createChannelSplitter(2);
          compressor.connect(splitter);
          s.analysers = [0, 1].map(ch => { const a = ctx.createAnalyser(); a.fftSize = 1024; a.smoothingTimeConstant = 0; splitter.connect(a, ch); return a; });
          s.levelBuf = new Float32Array(1024);
          window.dispatchEvent(new CustomEvent('hiddenrack:audio', { detail: { levels: getLevels } }));
          s.drums = ctx.createGain(); s.drums.connect(master);
          s.noise = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * 2), ctx.sampleRate);
          const data = s.noise.getChannelData(0);
          for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
          s.filter = ctx.createBiquadFilter(); s.filter.type = 'lowpass';
          s.filter.frequency.value = s.cutoff; s.filter.Q.value = s.resonance;
          s.amp = ctx.createGain(); s.amp.gain.value = 0;
          s.filter.connect(s.amp); s.amp.connect(master);
          s.oscs = [s.wave1, s.wave2].map((wave, i) => {
            const osc = track(ctx.createOscillator()); osc.type = wave;
            osc.frequency.value = frequency(48); osc.detune.value = i ? s.detune : 0;
            const gain = ctx.createGain(); gain.gain.value = 0.23;
            osc.connect(gain); gain.connect(s.filter); osc.start(); return osc;
          });
        }
        if (s.ctx.state === 'suspended') s.ctx.resume().catch(error => { if (!s.dead) hint.textContent = 'Audio could not start: ' + error.message; });
        return true;
      } catch (error) { hint.textContent = error.message; return false; }
    }
    function hold(param, t) {
      if (param.cancelAndHoldAtTime) param.cancelAndHoldAtTime(t);
      else { const v = param.value; param.cancelScheduledValues(t); param.setValueAtTime(v, t); }
    }
    function noteOn(midi, time, gate) {
      if (!s.ctx) return;
      const t = time === undefined ? s.ctx.currentTime : time;
      const hz = frequency(midi);
      s.oscs.forEach(osc => {
        hold(osc.frequency, t);
        if (s.glide > 0.001) osc.frequency.setTargetAtTime(hz, t, Math.max(0.001, s.glide / 3));
        else osc.frequency.setValueAtTime(hz, t);
      });
      const env = s.amp.gain;
      hold(env, t); env.linearRampToValueAtTime(1, t + s.attack);
      env.linearRampToValueAtTime(0.65, t + s.attack + s.decay);
      if (gate !== undefined) {
        const off = t + Math.max(gate, s.attack + s.decay);
        env.setValueAtTime(0.65, off); env.linearRampToValueAtTime(0, off + s.release);
      }
      s.current = midi;
    }
    function releaseNote() {
      if (!s.ctx) return;
      const t = s.ctx.currentTime;
      hold(s.amp.gain, t); s.amp.gain.linearRampToValueAtTime(0, t + s.release);
      s.current = null;
    }
    function updateKeys() {
      const active = new Set(s.held.values());
      keys.forEach((key, midi) => {
        key.classList.toggle('down', active.has(midi));
        key.setAttribute('aria-pressed', String(active.has(midi)));
      });
    }
    function press(id, midi) {
      if (s.held.get(id) === midi || !ensureAudio()) return;
      s.held.delete(id); s.held.set(id, midi);
      noteOn(midi); updateKeys();
    }
    function lift(id) {
      if (!s.held.has(id)) return;
      const last = Array.from(s.held.keys()).pop();
      s.held.delete(id);
      if (id === last) {
        const remaining = Array.from(s.held.values());
        if (remaining.length) noteOn(remaining[remaining.length - 1]); else releaseNote();
      }
      updateKeys();
    }
    function drum(row, t) {
      const ctx = s.ctx, level = s.levels[row];
      function tone(type, hz, endHz, duration, gainValue) {
        const osc = track(ctx.createOscillator()), gain = ctx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(hz, t);
        if (endHz) osc.frequency.exponentialRampToValueAtTime(endHz, t + duration * 0.65);
        gain.gain.setValueAtTime(0, t); gain.gain.linearRampToValueAtTime(gainValue * level, t + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
        osc.connect(gain); gain.connect(s.drums); osc.start(t); osc.stop(t + duration + 0.01);
      }
      function noise(start, duration, filterType, hz, gainValue) {
        const source = track(ctx.createBufferSource()), filter = ctx.createBiquadFilter(), gain = ctx.createGain();
        source.buffer = s.noise; filter.type = filterType; filter.frequency.value = hz;
        gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(gainValue * level, start + 0.001);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
        source.connect(filter); filter.connect(gain); gain.connect(s.drums);
        source.start(start, Math.random()); source.stop(start + duration + 0.01);
      }
      if (row === 0) tone('sine', 155, 43, 0.42, 1.2);
      if (row === 1) { noise(t, 0.19, 'highpass', 1100, 0.65); tone('triangle', 185, 95, 0.12, 0.35); }
      if (row === 2) noise(t, 0.055, 'highpass', 7500, 0.48);
      if (row === 3) [0, 0.014, 0.029].forEach((offset, i) => noise(t + offset, i === 2 ? 0.14 : 0.012, 'bandpass', 1500, 0.9));
    }
    function scheduler() {
      if (!s.playing || s.dead || !s.ctx || s.ctx.state !== 'running') return;
      const now = s.ctx.currentTime;
      if (s.next < now - 0.1) s.next = now + 0.01;
      while (s.next < now + 0.1) {
        const step = s.step, t = s.next;
        s.pattern.forEach((row, i) => { if (row[step]) drum(i, t); });
        if (s.seq && s.pattern[0][step] && !s.held.size) {
          const scale = [48,51,53,55,58,60,63,65,67,70];
          noteOn(scale[s.arp++ % scale.length], t, 60 / s.bpm * 0.32);
        }
        s.queue.push({step, time:t});
        const base = 60 / s.bpm / 4, swing = s.swing / 100 * 0.5;
        s.next += base * (step % 2 === 0 ? 1 + swing : 1 - swing);
        s.step = (step + 1) % 16;
      }
    }
    function stop() {
      s.playing = false; clearInterval(s.timer); s.timer = null; s.queue.length = 0;
      play.textContent = 'PLAY'; play.setAttribute('aria-pressed', 'false'); led.classList.remove('on');
      stepButtons.flat().forEach(b => b.classList.remove('cur'));
      if (s.ctx) {
        s.sources.forEach(node => { if (!s.oscs.includes(node)) { try { node.stop(); } catch (_) {} } });
        if (!s.held.size) releaseNote();
      }
    }
    function animate() {
      if (s.dead) return;
      if (s.ctx && s.playing) {
        let current = null;
        while (s.queue.length && s.queue[0].time <= s.ctx.currentTime) current = s.queue.shift().step;
        if (current !== null) stepButtons.forEach(row => row.forEach((b, i) => b.classList.toggle('cur', i === current)));
      }
      s.frame = requestAnimationFrame(animate);
    }

    const shell = el('div', 'hr-rack', undefined, container);
    shell.setAttribute('aria-label', 'Hidden Rack drum machine and monosynth');
    const a = el('section', 'hr-unit hr-drums', undefined, shell);
    a.setAttribute('aria-label', 'Drum machine'); a.dataset.rackUnits = '3';
    const af = el('div', 'hr-faceplate', undefined, a);
    const ah = el('header', 'hr-unit-header', undefined, af);
    el('h2', 'hr-legend', '01 / RHYTHM COMPUTER', ah);
    const led = el('span', 'hr-led', undefined, ah); led.setAttribute('aria-hidden', 'true');
    el('span', 'hr-run', 'RUN', ah);
    button('POWER', 'hr-power', ah, unmount, true);
    const transport = el('div', 'hr-transport', undefined, af);
    const play = button('PLAY', 'hr-btn', transport, () => {
      if (s.playing) { stop(); return; }
      if (!ensureAudio()) return;
      s.playing = true; s.step = 0; s.arp = 0; s.next = s.ctx.currentTime + 0.04;
      play.textContent = 'STOP'; play.setAttribute('aria-pressed', 'true'); led.classList.add('on');
      scheduler(); s.timer = setInterval(scheduler, 25);
    }, false);
    const display = el('div', 'hr-seg', undefined, transport);
    display.setAttribute('aria-label', 'Tempo in beats per minute');
    const digits = el('span', 'hr-seg-digits', '120', display);
    knob(transport, 'BPM', 60, 200, s.bpm, v => { s.bpm = v; digits.textContent = String(v).padStart(3, '0'); }, {integer:true});
    knob(transport, 'SWING', 0, 100, s.swing, v => { s.swing = v; }, {integer:true, format:v => v + '%'});
    knob(transport, 'MASTER', 0, 1, s.volume, v => { s.volume = v; if (s.ctx) s.master.gain.setTargetAtTime(v, s.ctx.currentTime, 0.015); }, {format:v => Math.round(v * 100) + '%'});
    const seq = button('SEQ', 'hr-switch', transport, () => {
      s.seq = !s.seq; seq.setAttribute('aria-pressed', String(s.seq)); seq.classList.toggle('on', s.seq);
      if (!s.seq && !s.held.size) releaseNote();
    }, false);
    seq.title = 'Kick-triggered C minor pentatonic arpeggio';
    const grid = el('div', 'hr-sequencer', undefined, af);
    const stepButtons = ['KICK','SNARE','HAT','CLAP'].map((name, row) => {
      const line = el('div', 'hr-drum-row', undefined, grid);
      el('span', 'hr-legend', name, line);
      const steps = el('div', 'hr-steps', undefined, line);
      const result = s.pattern[row].map((active, step) => {
        const b = button(String(step + 1).padStart(2, '0'), 'hr-step' + (active ? ' on' : ''), steps, () => {
          s.pattern[row][step] = !s.pattern[row][step];
          b.classList.toggle('on', s.pattern[row][step]); b.setAttribute('aria-pressed', String(s.pattern[row][step]));
        }, active);
        b.setAttribute('aria-label', name + ' step ' + (step + 1));
        b.dataset.step = String(step); b.dataset.row = String(row);
        return b;
      });
      knob(line, name + ' LEVEL', 0, 1, s.levels[row], v => { s.levels[row] = v; }, {format:v => Math.round(v * 100) + '%'});
      return result;
    });
    const b = el('section', 'hr-unit hr-synth', undefined, shell);
    b.setAttribute('aria-label', 'Monophonic synthesizer'); b.dataset.rackUnits = '3';
    const bf = el('div', 'hr-faceplate', undefined, b);
    el('h2', 'hr-legend', '02 / MONOPHONIC SYNTHESIZER', bf);
    const controls = el('div', 'hr-synth-controls', undefined, bf);
    [1,2].forEach(number => {
      const group = el('div', 'hr-oscillator', undefined, controls);
      el('span', 'hr-legend', 'OSC ' + number, group);
      const buttons = [];
      [['SAW','sawtooth'],['SQUARE','square'],['TRI','triangle']].forEach(([label, wave]) => {
        const btn = button(label, 'hr-switch', group, () => {
          s['wave' + number] = wave;
          if (s.oscs) s.oscs[number - 1].type = wave;
          buttons.forEach(item => { const active = item.wave === wave; item.btn.setAttribute('aria-pressed', String(active)); item.btn.classList.toggle('on', active); });
        }, s['wave' + number] === wave);
        btn.setAttribute('aria-label', 'Oscillator ' + number + ' ' + label);
        btn.classList.toggle('on', s['wave' + number] === wave); buttons.push({btn,wave});
      });
    });
    knob(controls, 'OSC2 DETUNE', -50, 50, s.detune, v => { s.detune = v; if (s.oscs) s.oscs[1].detune.setTargetAtTime(v, s.ctx.currentTime, 0.01); }, {integer:true, format:v => v + ' ct'});
    knob(controls, 'CUTOFF', 100, 12000, s.cutoff, v => { s.cutoff = v; if (s.filter) s.filter.frequency.setTargetAtTime(v, s.ctx.currentTime, 0.02); }, {log:true, format:v => Math.round(v) + ' Hz'});
    knob(controls, 'RESONANCE', 0.1, 18, s.resonance, v => { s.resonance = v; if (s.filter) s.filter.Q.setTargetAtTime(v, s.ctx.currentTime, 0.02); }, {format:v => v.toFixed(1)});
    [['ATTACK','attack',0.001,1.5],['DECAY','decay',0.01,2],['RELEASE','release',0.01,3],['GLIDE','glide',0,0.8]].forEach(([label, property, min, max]) => {
      knob(controls, label, min, max, s[property], v => { s[property] = v; }, {log:min > 0, format:v => Math.round(v * 1000) + ' ms'});
    });
    const keyboard = el('div', 'hr-keyboard', undefined, bf);
    keyboard.setAttribute('aria-label', 'Piano keyboard C3 through C5');
    keyboard.style.touchAction = 'none';
    const keys = new Map(); let whiteIndex = 0;
    for (let midi = 48; midi <= 72; midi++) {
      const black = [1,3,6,8,10].includes(midi % 12);
      const key = el('button', 'hr-key' + (black ? ' black' : ''), undefined, keyboard);
      key.type = 'button'; key.dataset.note = String(midi);
      key.setAttribute('aria-label', names[midi % 12] + (Math.floor(midi / 12) - 1));
      key.setAttribute('aria-pressed', 'false');
      key.style.setProperty('--key-index', String(whiteIndex));
      key.style.setProperty('--key-left', ((whiteIndex - (black ? 0.32 : 0)) / 15 * 100) + '%');
      if (!black) whiteIndex++;
      if (midi % 12 === 0) el('span', 'hr-key-label', 'C' + (Math.floor(midi / 12) - 1), key);
      keys.set(midi, key);
      listen(key, 'keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (!e.repeat) press('focus:' + midi, midi); } });
      listen(key, 'keyup', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); lift('focus:' + midi); } });
      listen(key, 'blur', () => lift('focus:' + midi));
      listen(key, 'click', e => {
        // Assistive-technology activation has no pointer/key-down sequence.
        if (e.detail === 0 && !s.held.has('focus:' + midi)) {
          press('assist:' + midi, midi);
          const timer = setTimeout(() => { if (!s.dead) lift('assist:' + midi); }, 180);
          s.cleanup.push(() => clearTimeout(timer));
        }
      });
    }
    listen(keyboard, 'pointerdown', e => {
      if (e.button !== 0) return;
      const key = e.target.closest('.hr-key'); if (!key || !keyboard.contains(key)) return;
      e.preventDefault(); key.focus(); s.pointers.set(e.pointerId, true);
      keyboard.setPointerCapture(e.pointerId); press('pointer:' + e.pointerId, Number(key.dataset.note));
    });
    listen(keyboard, 'pointermove', e => {
      if (!s.pointers.has(e.pointerId)) return;
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const key = target && target.closest('.hr-key');
      if (key && keyboard.contains(key)) press('pointer:' + e.pointerId, Number(key.dataset.note));
      else lift('pointer:' + e.pointerId);
    });
    ['pointerup','pointercancel','lostpointercapture'].forEach(type => listen(keyboard, type, e => { s.pointers.delete(e.pointerId); lift('pointer:' + e.pointerId); }));
    const hint = el('p', 'hr-hint', 'Click PLAY or play the keys. Sound is on.', bf);
    el('p', 'hr-key-hint', 'C3–C4: Z S X D C V G B H N J M ,  ·  C4–C5: Q 2 W 3 E R 5 T 6 Y 7 U I', bf);
    function editable(target) { return target && (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)); }
    listen(window, 'keydown', e => {
      if (e.repeat || e.ctrlKey || e.metaKey || e.altKey || editable(e.target)) return;
      const k = e.key.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(keyMap, k)) { e.preventDefault(); press('computer:' + k, keyMap[k]); }
    });
    listen(window, 'keyup', e => { const k = e.key.toLowerCase(); if (s.held.has('computer:' + k)) { e.preventDefault(); lift('computer:' + k); } });
    function releaseAll() { s.held.clear(); s.pointers.clear(); releaseNote(); updateKeys(); }
    listen(window, 'blur', releaseAll);
    listen(document, 'visibilitychange', () => { if (document.hidden) { releaseAll(); if (s.playing) stop(); } });
    animate();
    return window.HiddenRack;
  }
  window.HiddenRack = { mount, unmount, getLevels };
})();
