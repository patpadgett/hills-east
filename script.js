/* Hills East Recording — panel behavior
   Record-arm lamp, rotary selector, menu drawer, video toggle, form. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const BEAT = 375;

  /* ---- jewel lamp: STANDBY / ARMED / RECORDING ---- */
  const power = $('.strip-power');
  const lampLabel = $('[data-lamp-label]');
  let recording = false;
  const setLamp = (state) => {
    if (recording && state !== 'recording') return;
    const arms = [power, ...$$('[data-arm]')];
    if (state === 'standby') { arms.forEach((a) => a.removeAttribute('data-armed')); lampLabel.textContent = 'Ready'; }
    else if (state === 'armed') { power.setAttribute('data-armed', ''); lampLabel.textContent = 'Armed'; }
    else if (state === 'recording') { arms.forEach((a) => a.setAttribute('data-armed', '')); lampLabel.textContent = 'Recording'; }
  };
  $$('[data-arm]').forEach((el) => {
    el.addEventListener('pointerenter', () => setLamp('armed'));
    el.addEventListener('focus', () => setLamp('armed'));
    el.addEventListener('pointerleave', () => setLamp('standby'));
    el.addEventListener('blur', () => setLamp('standby'));
  });

  document.querySelector('[data-year]')?.replaceChildren(String(new Date().getFullYear()));

  /* ---- video loop toggle ---- */
  const video = $('.meter-video');
  const vt = $('[data-video-toggle]');
  if (video && vt) {
    const paint = () => {
      const playing = !video.paused;
      vt.setAttribute('aria-pressed', String(playing));
      vt.querySelector('span').textContent = playing ? 'Pause loop' : 'Play loop';
      vt.querySelector('svg').innerHTML = playing
        ? '<rect x="3" y="3" width="3.5" height="10" fill="currentColor"/><rect x="9.5" y="3" width="3.5" height="10" fill="currentColor"/>'
        : '<path d="M4 3l9 5-9 5z" fill="currentColor"/>';
    };
    vt.addEventListener('click', () => { video.paused ? video.play() : video.pause(); });
    video.addEventListener('play', paint); video.addEventListener('pause', paint);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) video.pause();
    paint();
  }

  /* ---- menu drawer ---- */
  const menu = $('.strip-menu'); const drawer = $('#drawer');
  if (menu && drawer) {
    const open = (v) => { drawer.hidden = !v; menu.setAttribute('aria-expanded', String(v)); menu.setAttribute('aria-label', v ? 'Close sections menu' : 'Open sections menu'); };
    menu.addEventListener('click', () => open(drawer.hidden));
    $$('a', drawer).forEach((a) => a.addEventListener('click', () => open(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !drawer.hidden) { open(false); menu.focus(); } });
  }

  /* ---- current section in nav ---- */
  const links = $$('.strip-nav a');
  if ('IntersectionObserver' in window && links.length) {
    const byId = Object.fromEntries(links.map((a) => [a.getAttribute('href').slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        byId[en.target.id]?.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(byId).forEach((id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* ---- rotary selector (tabs) ---- */
  const rotary = $('[data-rotary]');
  if (rotary) {
    const tabs = $$('[role="tab"]', rotary);
    const panels = $$('[role="tabpanel"]', rotary);
    const select = (i, focus = false) => {
      tabs.forEach((t, k) => { const on = k === i; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      panels.forEach((p, k) => { p.hidden = k !== i; });
      rotary.dataset.step = String(i);
      if (focus) tabs[i].focus();
    };
    tabs.forEach((t, i) => {
      t.addEventListener('click', () => select(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') select((i + 1) % tabs.length, true);
        if (e.key === 'ArrowLeft') select((i - 1 + tabs.length) % tabs.length, true);
        if (e.key === 'Home') select(0, true);
        if (e.key === 'End') select(tabs.length - 1, true);
      });
    });
    // Idle demo: step the dial once every few beats until the visitor touches it.
    let auto = null, touched = false;
    const autoBtn = $('[data-auto]', rotary);
    const stop = () => { touched = true; clearInterval(auto); auto = null; if (autoBtn) autoBtn.hidden = true; };
    $$('[role="tab"]', rotary).forEach((t) => t.addEventListener('pointerdown', stop, { once: true }));
    $('.rotary-steps', rotary).addEventListener('focusin', stop, { once: true });
    autoBtn?.addEventListener('click', stop);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
      let i = 0;
      const io = new IntersectionObserver((en) => {
        if (touched) return;
        if (en[0].isIntersecting && !auto) { auto = setInterval(() => { i = (i + 1) % tabs.length; select(i); }, BEAT * 12); if (autoBtn) autoBtn.hidden = false; }
        else if (!en[0].isIntersecting) { clearInterval(auto); auto = null; }
      }, { threshold: .5 });
      io.observe(rotary);
    }
  }

  /* ---- inquiry form (POST-ready, dummy success) ---- */
  const form = $('[data-form]');
  if (form) {
    const status = $('[data-status]');
    const done = $('[data-done]');
    const book = form.closest('.book');
    const submit = $('.knob-submit', form);
    const fields = {
      name: { el: $('#f-name'), err: $('#e-name'), msg: 'Add your name so John knows who to reply to.' },
      email: { el: $('#f-email'), err: $('#e-email'), msg: 'Enter a working email — it is the only way John can reach you.' },
      notes: { el: $('#f-notes'), err: $('#e-notes'), msg: 'Give John a line or two about the project.' },
    };
    const validate = () => {
      let ok = true, first = null;
      Object.values(fields).forEach(({ el, err, msg }) => {
        const bad = !el.value.trim() || (el.type === 'email' && !el.validity.valid);
        el.closest('.field').classList.toggle('is-invalid', bad);
        el.setAttribute('aria-invalid', String(bad));
        err.textContent = bad ? msg : '';
        if (bad) { ok = false; first ??= el; }
      });
      return { ok, first };
    };
    Object.values(fields).forEach(({ el }) => el.addEventListener('input', () => { if (el.closest('.field').classList.contains('is-invalid')) validate(); }));

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      status.className = 'form-status';
      const { ok, first } = validate();
      if (!ok) { status.textContent = 'A couple of fields need attention before this can send.'; status.classList.add('is-error'); first.focus(); return; }
      submit.disabled = true; status.textContent = 'Sending to John…';
      setLamp('armed');
      // Replace the fake delay with a real POST to action="/inquiry" (Formspree, Netlify, etc.).
      await new Promise((r) => setTimeout(r, BEAT * 2));
      recording = true; setLamp('recording');
      book.classList.add('is-done');
      done.hidden = false;
      done.querySelector('h3').focus?.();
      status.textContent = '';
    });

    $('[data-reset]')?.addEventListener('click', () => {
      form.reset(); submit.disabled = false; recording = false; setLamp('standby');
      book.classList.remove('is-done'); done.hidden = true;
      Object.values(fields).forEach(({ el, err }) => { el.closest('.field').classList.remove('is-invalid'); err.textContent = ''; el.removeAttribute('aria-invalid'); });
      $('#f-name').focus();
    });
  }
})();
