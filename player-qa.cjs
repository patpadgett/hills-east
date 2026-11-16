/* Playback-unit acceptance probes. Run: node player-qa.cjs [round] */
const { chromium } = require('/home/pat/projects/ydks/node_modules/playwright');
const fs = require('fs');
const dir = '/home/pat/impetus/2_PUBLISHED/hills-east.patpadgett.com/hills-east-rackmount/.impeccable/review';
fs.mkdirSync(dir, { recursive: true });
const round = process.argv[2] || '1';
const base = 'http://127.0.0.1:8768/hills-east-rackmount/';
(async () => {
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const results = [];
  for (const width of [1440, 390]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    const page = await context.newPage();
    const errors = [], yt = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error') { const t = m.text(); (t.includes('net::') || t.includes('Permissions policy violation') || t.includes('YouTube') || t.includes('youtube') || t.includes('iframe') ? yt : errors).push(t); } });
    page.on('response', r => { if (r.status() >= 400 && !r.url().includes('youtube')) errors.push(r.status() + ' ' + r.url()); });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);

    const r = { width };
    r.removed = await page.evaluate(() => ({
      optical: !!document.querySelector('#optical'), dynamics: !!document.querySelector('#dynamics'),
      patch: !!document.querySelector('#patch'), jack: !!document.querySelector('.jack'),
      route: !!document.querySelector('.booking-route'), service: !!document.querySelector('.service'),
      motionToggle: !!document.querySelector('#motion-toggle'),
      navVideos: document.querySelector('.id-nav a[href="#player"]')?.textContent || null,
      h2: document.querySelector('#player-title')?.textContent || null,
      units: [...document.querySelectorAll('.unit')].map(u => u.id || u.className)
    }));
    r.initial = await page.evaluate(() => ({
      playDisabled: document.querySelector('#player-play').disabled,
      stopDisabled: document.querySelector('#player-stop').disabled,
      status: document.querySelector('#player-status').textContent,
      now: document.querySelector('#now-source').textContent,
      idleVisible: !document.querySelector('#screen-idle').hidden,
      levelL: document.querySelector('#player').dataset.levelL,
      levelR: document.querySelector('#player').dataset.levelR,
      needleL: document.querySelector('.vu-needle').getAttribute('transform'),
      ticks: document.querySelectorAll('.vu-ticks line').length,
      sources: [...document.querySelectorAll('.source')].map(b => b.dataset.video),
      running: document.documentElement.dataset.meterRunning
    }));
    await page.locator('#player').scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    await page.screenshot({ path: `${dir}/player-${round}-${width}-idle.png` });

    // Select CH 1; the API loads on demand.
    const waitLevel = (ms = 20000) => page.waitForFunction(
      () => Number(document.querySelector('#player').dataset.levelL) > 0.03, null, { timeout: ms }
    ).catch(() => {});
    await page.locator('.source[data-video="RE-oPaanCas"]').click();
    await waitLevel();
    r.playing = await page.evaluate(() => ({
      status: document.querySelector('#player-status').textContent,
      now: document.querySelector('#now-source').textContent,
      pressed: document.querySelector('.source[data-video="RE-oPaanCas"]').getAttribute('aria-pressed'),
      playPressed: document.querySelector('#player-play').getAttribute('aria-pressed'),
      playLabel: document.querySelector('#player-play').textContent,
      playDisabled: document.querySelector('#player-play').disabled,
      stopDisabled: document.querySelector('#player-stop').disabled,
      signal: document.querySelector('#player-signal').className,
      idleHidden: document.querySelector('#screen-idle').hidden,
      frameHidden: document.querySelector('#screen-frame').hidden,
      iframes: document.querySelectorAll('#screen-frame iframe').length,
      levelL: document.querySelector('#player').dataset.levelL,
      levelR: document.querySelector('#player').dataset.levelR,
      ladderOn: document.querySelectorAll('.room .ladder-leds i.on').length,
      needleL: document.querySelector('.vu-needle').getAttribute('transform'),
      running: document.documentElement.dataset.meterRunning,
      apiScript: !!document.querySelector('script[src*="iframe_api"]')
    }));
    await page.waitForTimeout(1200);
    r.meterLater = await page.evaluate(() => ({
      levelL: document.querySelector('#player').dataset.levelL,
      needleL: document.querySelector('.vu-needle').getAttribute('transform')
    }));
    await page.screenshot({ path: `${dir}/player-${round}-${width}-playing.png` });

    // Pause via transport.
    await page.locator('#player-play').click();
    await page.waitForTimeout(900);
    r.paused = await page.evaluate(() => ({
      status: document.querySelector('#player-status').textContent,
      playPressed: document.querySelector('#player-play').getAttribute('aria-pressed'),
      signal: document.querySelector('#player-signal').className,
      levelL: document.querySelector('#player').dataset.levelL
    }));

    // Switch source while paused.
    await page.locator('.source[data-video="ZrAWnT-ecWM"]').click();
    await waitLevel(15000);
    r.switched = await page.evaluate(() => ({
      now: document.querySelector('#now-source').textContent,
      status: document.querySelector('#player-status').textContent,
      pressed2: document.querySelector('.source[data-video="ZrAWnT-ecWM"]').getAttribute('aria-pressed'),
      pressed1: document.querySelector('.source[data-video="RE-oPaanCas"]').getAttribute('aria-pressed'),
      levelL: document.querySelector('#player').dataset.levelL
    }));

    // Stop.
    await page.locator('#player-stop').click();
    await page.waitForTimeout(1000);
    r.stopped = await page.evaluate(() => ({
      status: document.querySelector('#player-status').textContent,
      idleVisible: !document.querySelector('#screen-idle').hidden,
      frameHidden: document.querySelector('#screen-frame').hidden,
      levelL: document.querySelector('#player').dataset.levelL,
      needleL: document.querySelector('.vu-needle').getAttribute('transform')
    }));

    // Reduced motion freezes the meter loop.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(300);
    r.motionPaused = await page.evaluate(() => ({ running: document.documentElement.dataset.meterRunning, levelL: document.querySelector('#player').dataset.levelL }));
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.waitForTimeout(200);

    // Reduced motion.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(300);
    r.reduced = await page.evaluate(() => ({ running: document.documentElement.dataset.meterRunning, levelL: document.querySelector('#player').dataset.levelL }));
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    // Easter egg regression.
    await page.locator('#reset').click({ clickCount: 3, delay: 60 });
    await page.waitForTimeout(200);
    r.egg = await page.evaluate(() => ({ visible: !document.querySelector('#hidden-rack').hidden, steps: document.querySelectorAll('.hr-step').length, keys: document.querySelectorAll('.hr-key').length }));
    await page.evaluate(() => window.HiddenRack.unmount());
    await page.waitForTimeout(150);

    // Form honesty regression.
    await page.locator('#name').fill('QA Test');
    await page.locator('#email').fill('qa@example.com');
    await page.locator('#msg').fill('Hello John');
    await page.locator('.book-form button[type=submit]').click();
    r.form = await page.locator('#form-note').textContent();

    r.overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth, offenders: [...document.querySelectorAll('body *')].filter(e => e.getBoundingClientRect().right > innerWidth + 1).map(e => e.className).slice(0, 8) }));
    r.errors = errors; r.youtube = yt;
    r.assertions = {
      removed: !r.removed.optical && !r.removed.dynamics && !r.removed.patch && !r.removed.jack && !r.removed.route && !r.removed.service && r.removed.navVideos === 'Videos' && r.removed.h2 === 'Playback' && r.removed.motionToggle === false,
      initial: r.initial.playDisabled && r.initial.stopDisabled && r.initial.ticks === 22 && r.initial.sources.length === 2 && r.initial.idleVisible && r.initial.status === '',
      noDemoNote: !(await page.locator('#player .demo-note').count()),
      loaded: r.playing.apiScript && r.playing.iframes === 1 && !r.playing.frameHidden && r.playing.playDisabled === false,
      meterMoved: Number(r.meterLater.levelL) > 0.05 && r.meterLater.needleL !== r.initial.needleL,
      ladder: r.playing.ladderOn > 0,
      paused: r.paused.playPressed === 'false',
      switched: r.switched.pressed2 === 'true' && r.switched.pressed1 === 'false',
      stopped: r.stopped.idleVisible === true && r.stopped.frameHidden === true && Number(r.stopped.levelL) < 0.15,
      motionPaused: r.motionPaused.running === 'false',
      reduced: r.reduced.running === 'false',
      egg: r.egg.visible && r.egg.steps === 64 && r.egg.keys === 25,
      form: r.form.indexOf('nothing is sent') !== -1,
      overflow: r.overflow.scroll === width,
      errors: r.errors.length === 0
    };
    results.push(r);
    await context.close();
  }
  // No-JS pass.
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await nojs.newPage();
  await p.goto(base);
  const noJS = {
    hero: await p.locator('h1').isVisible(),
    player: await p.locator('#player').isVisible(),
    sources: await p.locator('.source').count(),
    noScriptLinks: await p.locator('#player noscript a').count(),
    stages: await p.locator('.stage:visible').count(),
    booking: await p.locator('#book').isVisible(),
    unitIds: await p.evaluate(() => [...document.querySelectorAll('.unit')].map(u => u.id).filter(Boolean))
  };
  results.push({ noJS });
  await nojs.close();
  await browser.close();
  fs.writeFileSync(`${dir}/player-${round}-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.assertions && Object.values(r.assertions).includes(false))) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
