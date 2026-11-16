/* Full-site regression probes. The playback unit has its own suite (player-qa.cjs);
   this covers everything else that survived the compressor/patchbay removal. */
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
    const errors = [];
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    page.on('console', m => { if (m.type() === 'error' && !m.text().includes('net::')) errors.push(m.text()); });
    await page.goto(base);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(250);
    const r = { width };
    const logo = await page.locator('.crt-img').boundingBox();
    const rack = await page.locator('.rack').boundingBox();
    r.hero = { centerError: Math.abs(logo.x + logo.width / 2 - rack.x - rack.width / 2), fit: await page.locator('.crt-img').evaluate(e => getComputedStyle(e).objectFit), imgWidth: logo.width };
    await page.locator('#ident-toggle').click();
    r.ident = await page.evaluate(() => { const v = document.querySelector('#ident'); const b = document.querySelector('#ident-toggle'); return { paused: v.paused, label: b.getAttribute('aria-label'), text: b.textContent.trim(), src: v.currentSrc }; });
    await page.locator('#flow').scrollIntoViewIfNeeded();
    const stage = page.locator('[data-knob="stage"]');
    await stage.focus(); await stage.press('End');
    r.stage = { value: await stage.getAttribute('aria-valuenow'), text: await stage.getAttribute('aria-valuetext'), on: await page.locator('.stage.is-on').getAttribute('data-stage') };
    await stage.press('Home');
    await page.locator('#room').scrollIntoViewIfNeeded();
    r.room = { spec: await page.locator('.spec div').count(), ladder: await page.locator('.room .ladder-leds i').count() };
    await page.emulateMedia({ reducedMotion: 'reduce' }); await page.waitForTimeout(250);
    r.motion = { triggers: await page.evaluate(() => window.ScrollTrigger ? ScrollTrigger.getAll().length : -1), meter: await page.locator('html').getAttribute('data-meter-running') };
    await page.emulateMedia({ reducedMotion: 'no-preference' }); await page.waitForTimeout(200);
    await page.locator('#reset').click({ clickCount: 3, delay: 60 }); await page.waitForTimeout(200);
    r.egg = { visible: await page.locator('#hidden-rack').isVisible(), steps: await page.locator('.hr-step').count(), keys: await page.locator('.hr-key').count(), pads: await page.locator('.mpc-pad').count() };
    await page.evaluate(() => window.HiddenRack.unmount()); await page.waitForTimeout(150);
    await page.locator('#name').fill('QA Test'); await page.locator('#email').fill('qa@example.com'); await page.locator('#msg').fill('Hello');
    await page.locator('.book-form button[type=submit]').click();
    r.form = await page.locator('#form-note').textContent();
    r.overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
    r.errors = errors;
    r.assertions = {
      hero: r.hero.fit === 'contain' && r.hero.imgWidth > (width === 390 ? 180 : 300),
      ident: r.ident.paused === true && r.ident.label === 'Play ident' && r.ident.text === '',
      stage: r.stage.value === '2' && r.stage.text === 'Finish' && r.stage.on === '2',
      room: r.room.spec === 4 && r.room.ladder === 12,
      motion: r.motion.triggers === 0 && r.motion.meter === 'false',
      egg: r.egg.visible && r.egg.steps === 64 && r.egg.keys === 25 && r.egg.pads === 16,
      form: r.form.indexOf('nothing is sent') !== -1,
      overflow: r.overflow.scroll === width,
      errors: r.errors.length === 0
    };
    results.push(r);
    await context.close();
  }
  const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const p = await nojs.newPage();
  await p.goto(base);
  results.push({ noJS: { hero: await p.locator('h1').isVisible(), stages: await p.locator('.stage:visible').count(), booking: await p.locator('#book').isVisible(), player: await p.locator('#player').isVisible(), noScriptLinks: await p.locator('#player noscript a').count() } });
  await nojs.close();
  await browser.close();
  fs.writeFileSync(`${dir}/revision-${round}-results.json`, JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.assertions && Object.values(r.assertions).includes(false))) process.exitCode = 1;
})().catch(e => { console.error(e); process.exit(1); });
