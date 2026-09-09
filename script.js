/* Hills East Recording — rackmount edition.
   Knobs (drag / wheel / keys), VU ballistics, LED ladders, patchbay cables, rotary selector,
   form state, and the 3-press RESET easter egg that mounts the hidden rack. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  $('[data-year]')?.replaceChildren(String(new Date().getFullYear()));

  /* ---------- knobs: value 0..max, 270° sweep ---------- */
  const state = { gain: 62, lamps: 70, speed: 50, stage: 0 };
  const listeners = {};
  const on = (k, fn) => (listeners[k] ||= []).push(fn);
  function paintKnob(el, v, max) {
    const a = -135 + (v / max) * 270;
    el.style.setProperty('--a', a + 'deg');
    el.style.setProperty('--sweep', ((v / max) * 270) + 'deg');
    el.setAttribute('aria-valuenow', Math.round(v));
    if (el.dataset.knob === 'stage') el.setAttribute('aria-valuetext', ['Talk', 'Track', 'Finish'][Math.round(v)]);
  }
  $$('.knob').forEach(el => {
    const key = el.dataset.knob;
    const max = +el.getAttribute('aria-valuemax');
    const steps = +el.dataset.steps || 0;
    const set = (v, fromDrag) => {
      v = clamp(v, 0, max);
      if (steps && !fromDrag) v = Math.round(v);
      state[key] = v;
      paintKnob(el, steps ? Math.round(v) : v, max);
      (listeners[key] || []).forEach(fn => fn(steps ? Math.round(v) : v));
    };
    set(state[key]);
    let y0 = 0, v0 = 0;
    el.addEventListener('pointerdown', e => { y0 = e.clientY; v0 = state[key]; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); });
    el.addEventListener('pointermove', e => { if (!el.hasPointerCapture(e.pointerId)) return; set(v0 + (y0 - e.clientY) * (max / (steps ? 120 : 160)), true); });
    el.addEventListener('pointerup', e => { el.releasePointerCapture(e.pointerId); el.classList.remove('is-drag'); if (steps) set(Math.round(state[key])); });
    el.addEventListener('wheel', e => { e.preventDefault(); set(state[key] + (e.deltaY < 0 ? 1 : -1) * (steps ? 1 : max / 25)); }, { passive: false });
    el.addEventListener('keydown', e => {
      const step = steps ? 1 : max / 20;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); set(state[key] + step); }
      if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); set(state[key] - step); }
      if (e.key === 'Home') set(0); if (e.key === 'End') set(max);
    });
    if (!steps) el.addEventListener('dblclick', () => set(+el.getAttribute('aria-valuenow') === max / 2 ? 0 : max / 2));
  });

  /* what the knobs drive */
  on('lamps', v => root.style.setProperty('--lamp', (0.15 + v / 100 * 0.85).toFixed(3)));
  on('speed', v => {
    // animated WebP can't change speed; approximate with a CSS filter/scale pulse rate
    root.style.setProperty('--speed', (0.4 + v / 100 * 1.6).toFixed(2));
    root.style.setProperty('--crt-period', (3.2 / (0.4 + v / 100 * 1.6)).toFixed(2) + 's');
  });

  /* ---------- VU meters: needle ballistics from gain + programme noise ---------- */
  const needles = $$('.vu-needle');
  $$('.vu-ticks').forEach(g => {
    for (let i = 0; i <= 10; i++) {
      const a = (-80 + i * 16) * Math.PI / 180, r1 = 85, r2 = i % 5 ? 78 : 72;
      const l = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      l.setAttribute('x1', 100 + r1 * Math.sin(a)); l.setAttribute('y1', 100 - r1 * Math.cos(a));
      l.setAttribute('x2', 100 + r2 * Math.sin(a)); l.setAttribute('y2', 100 - r2 * Math.cos(a));
      g.appendChild(l);
    }
  });
  let vuL = 0, vuR = 0, t0 = performance.now();
  // when the hidden rack is making sound, the meters read its real stereo peaks
  let liveLevels = null, liveHot = 0;
  addEventListener('hiddenrack:audio', e => { liveLevels = e.detail.levels; });
  const ladders = $$('.ladder-leds');
  ladders.forEach(l => { for (let i = 0; i < 12; i++) { const b = document.createElement('i'); if (i >= 8) b.classList.add(i >= 11 ? 'peak' : 'hot'); l.appendChild(b); } });
  function frame(t) {
    const dt = Math.min(0.05, (t - t0) / 1000); t0 = t;
    const g = state.gain / 100;
    // programme: two slow LFOs + a "beat" pulse at Speed
    const beat = Math.pow(Math.max(0, Math.sin(t / 1000 * Math.PI * state.speed / 50 * 1.4)), 6);
    let srcL, srcR;
    const live = liveLevels ? liveLevels() : null;
    if (live && (live[0] > 0.002 || live[1] > 0.002 || liveHot > 0)) {
      liveHot = live[0] + live[1] > 0.004 ? 1.5 : Math.max(0, liveHot - dt); // hold onto live mode through short gaps
      srcL = Math.min(1, live[0] * (0.6 + g * 0.8)); srcR = Math.min(1, live[1] * (0.6 + g * 0.8));
    } else {
      srcL = g * (0.38 + 0.25 * Math.sin(t / 900) + 0.45 * beat);
      srcR = g * (0.36 + 0.25 * Math.sin(t / 1130 + 1) + 0.45 * beat);
    }
    const attack = 1 - Math.exp(-dt / (live ? 0.03 : 0.06)), release = 1 - Math.exp(-dt / 0.3);
    vuL += (srcL - vuL) * (srcL > vuL ? attack : release);
    vuR += (srcR - vuR) * (srcR > vuR ? attack : release);
    if (!reduced.matches) {
      needles[0]?.setAttribute('transform', `rotate(${-40 + vuL * 80} 100 100)`);
      needles[1]?.setAttribute('transform', `rotate(${-40 + vuR * 80} 100 100)`);
      const lit = Math.round(((vuL + vuR) / 2) * 12);
      ladders.forEach(l => [...l.children].forEach((b, i) => b.classList.toggle('on', i < lit)));
    }
    requestAnimationFrame(frame);
  }
  const paintStatic = () => { const g = state.gain / 100; needles.forEach(n => n.setAttribute('transform', `rotate(${-40 + g * 60} 100 100)`)); ladders.forEach(l => [...l.children].forEach((b, i) => b.classList.toggle('on', i < Math.round(g * 11)))); };
  if (reduced.matches) { paintStatic(); on('gain', paintStatic); }
  else requestAnimationFrame(frame);

  /* ident pause / play: one function owns the picture state */
  const identBtn = $('#ident-toggle'), identImg = $('.crt-img'), identPic = identImg?.closest('picture');
  const identSrc = { webp: 'assets/hills-east-ident.webp', gif: 'assets/hills-east-ident.gif', poster: 'assets/hills-east-poster.jpg' };
  function setIdent(playing) {
    if (!identImg) return;
    let srcEl = identPic?.querySelector('source');
    if (playing) { if (!srcEl && identPic) { srcEl = document.createElement('source'); srcEl.type = 'image/webp'; identPic.prepend(srcEl); } if (srcEl) srcEl.srcset = identSrc.webp; identImg.src = identSrc.gif; }
    else { srcEl?.remove(); identImg.src = identSrc.poster; }
    identBtn?.setAttribute('aria-pressed', String(playing));
    if (identBtn) identBtn.textContent = playing ? 'Pause' : 'Play';
  }
  identBtn?.addEventListener('click', () => setIdent(identBtn.getAttribute('aria-pressed') !== 'true'));
  if (reduced.matches) setIdent(false);

  /* ---------- patchbay: drag cables between jacks ---------- */
  const field = $('.jackfield'), svg = $('.cables'), lamp = $('#route-lamp'), services = $('#services');
  const jacks = $$('.jack');
  const cables = []; // {from, to, path}
  let armed = null, preview = null;
  const center = el => { const r = el.getBoundingClientRect(), f = field.getBoundingClientRect(); return { x: r.left - f.left + r.width / 2, y: r.top - f.top + r.height / 2 }; };
  const bez = (a, b) => { const sag = 46 + Math.hypot(b.x - a.x, b.y - a.y) * 0.22; return `M${a.x} ${a.y} C${a.x} ${a.y + sag}, ${b.x} ${b.y + sag}, ${b.x} ${b.y}`; };
  function draw() {
    cables.forEach((c, i) => { c.path.setAttribute('d', bez(center(c.from), center(c.to))); c.path.setAttribute('class', 'c' + (i % 4)); });
  }
  function kind(j) { return j.dataset.jack.split('-')[0]; }
  function connect(a, b) {
    if (a === b) return;
    const ka = kind(a), kb = kind(b);
    const ok = (ka === 'in' && kb === 'room') || (ka === 'room' && kb === 'in') || (ka === 'room' && kb === 'out') || (ka === 'out' && kb === 'room');
    if (!ok) { flash(b); return; }
    // one cable per jack: replace existing on either end
    // one cable per INPUT/OUTPUT jack; the room accepts one input and one output
    const side = j => kind(j) === 'in' ? 'in' : kind(j) === 'out' ? 'out' : null;
    const newSide = side(a) || side(b);
    for (let i = cables.length - 1; i >= 0; i--) if ([cables[i].from, cables[i].to].some(j => (j === a || j === b) && kind(j) !== 'room') || (side(cables[i].from) || side(cables[i].to)) === newSide) { cables[i].path.remove(); [cables[i].from, cables[i].to].forEach(j => j.classList.remove('patched')); cables.splice(i, 1); }
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    svg.appendChild(path);
    cables.push({ from: a, to: b, path }); a.classList.add('patched'); b.classList.add('patched');
    draw(); route();
  }
  function flash(el) { el.animate([{ boxShadow: '0 0 0 3px var(--red)' }, { boxShadow: '0 0 0 1px #0a0a0b' }], { duration: 400 }); }
  function route() {
    const ins = cables.filter(c => kind(c.from) === 'in' || kind(c.to) === 'in').map(c => (kind(c.from) === 'in' ? c.from : c.to).dataset.jack);
    const hasOut = cables.some(c => kind(c.from) === 'out' || kind(c.to) === 'out');
    $$('.service').forEach(s => s.classList.toggle('is-on', ins.includes(s.dataset.service)));
    services.classList.toggle('has-route', ins.length > 0);
    lamp.classList.toggle('jewel--on', ins.length > 0 && hasOut);
  }
  let dragged = false;
  jacks.forEach(j => {
    j.addEventListener('pointerdown', e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      dragged = false;
      const start = { x: e.clientX, y: e.clientY };
      preview = document.createElementNS('http://www.w3.org/2000/svg', 'path'); preview.setAttribute('class', 'preview'); svg.appendChild(preview);
      const move = ev => { if (Math.hypot(ev.clientX - start.x, ev.clientY - start.y) > 6) dragged = true; const f = field.getBoundingClientRect(); preview.setAttribute('d', bez(center(j), { x: ev.clientX - f.left, y: ev.clientY - f.top })); };
      const up = ev => {
        window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up);
        preview?.remove(); preview = null;
        if (!dragged) return; // a plain click: handled by the click listener below
        const target = document.elementFromPoint(ev.clientX, ev.clientY)?.closest('.jack');
        if (target && target !== j) connect(j, target);
        if (armed) { armed.classList.remove('armed'); armed = null; }
      };
      window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up, { once: true });
    });
    j.addEventListener('click', () => {
      if (dragged) { dragged = false; return; }
      // click-to-click (also keyboard Enter/Space): first click arms, second connects
      if (armed && armed !== j) { connect(armed, j); armed.classList.remove('armed'); armed = null; }
      else if (armed === j) { j.classList.remove('armed'); armed = null; }
      else { armed = j; j.classList.add('armed'); }
    });
  });
  addEventListener('resize', draw);
  // preset: tracking -> room so the section isn't empty on arrival
  connect($('[data-jack="in-tracking"]'), $('[data-jack="room"]'));

  /* ---------- rotary selector -> stages ---------- */
  on('stage', v => $$('.stage').forEach(s => s.classList.toggle('is-on', +s.dataset.stage === v)));

  /* ---------- form ---------- */
  const form = $('.book-form');
  form?.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const note = $('#form-note');
    note.textContent = 'Not sent — this form isn’t connected yet. Your text is still here; John’s direct contact details will replace this note once he supplies them.';
    note.setAttribute('role', 'status');
    const btn = form.querySelector('.bigswitch'); btn.disabled = true; btn.setAttribute('aria-disabled', 'true');
  });

  /* ---------- easter egg: RESET x3 within 2s ---------- */
  const reset = $('#reset'), hidden = $('#hidden-rack');
  let presses = [];
  reset?.addEventListener('click', () => {
    const now = performance.now();
    presses = presses.filter(t => now - t < 2000).concat(now);
    reset.animate([{ transform: 'translateY(1px)' }, { transform: 'none' }], { duration: 120 });
    if (presses.length >= 3) {
      presses = [];
      if (!hidden.hidden) return;
      hidden.hidden = false; hidden.classList.add('is-in');
      if (window.HiddenRack) window.HiddenRack.mount(hidden, () => { hidden.hidden = true; hidden.classList.remove('is-in'); });
      hidden.scrollIntoView({ behavior: reduced.matches ? 'instant' : 'smooth', block: 'start' });
    }
  });
  // the module's POWER switch calls unmount; also hide the unit if it empties itself
  new MutationObserver(() => { if (!hidden.hidden && hidden.childElementCount === 0) { hidden.hidden = true; hidden.classList.remove('is-in'); } }).observe(hidden, { childList: true });
})();
