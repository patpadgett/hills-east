/* Touch-gesture acceptance probes (synthesised touch over CDP). Run: node touch-qa.cjs */
/* Verifies taps on the ident/source controls, the stage knob's vertical drag axis,
   touchCancel recovery, and that ordinary copy still scrolls the page. */
const { chromium } = require('/home/pat/projects/ydks/node_modules/playwright');
const base = 'http://127.0.0.1:8768/hills-east-rackmount/';

(async () => {
  const b = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', e => errors.push(String(e)));
  await p.goto(base);
  await p.waitForTimeout(500);
  const cdp = await ctx.newCDPSession(p);
  const touch = (type, pts) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: pts.map(([x, y]) => ({ x, y, id: 1 })) });
  const tapAt = async (x, y) => { await touch('touchStart', [[x, y]]); await touch('touchEnd', [[x, y]]); };
  const box = async (sel) => { const r = await p.locator(sel).first().boundingBox(); return { x: Math.round(r.x + r.width / 2), y: Math.round(r.y + r.height / 2) }; };
  const drag = async (c, dy) => {
    await touch('touchStart', [[c.x, c.y]]);
    for (let i = 1; i <= 8; i++) await touch('touchMove', [[c.x, c.y + (dy * i) / 8]]);
    await touch('touchEnd', [[c.x, c.y + dy]]);
  };
  const val = () => p.evaluate(() => document.querySelector('.knob').getAttribute('aria-valuenow'));
  const out = {};

  await p.waitForTimeout(1500);
  out.identAutoplays = (await p.getAttribute('#ident-toggle', 'aria-pressed')) === 'true';
  let c = await box('#ident-toggle');
  await tapAt(c.x, c.y); await p.waitForTimeout(700);
  out.tapPausesIdent = (await p.getAttribute('#ident-toggle', 'aria-pressed')) === 'false';
  await tapAt(c.x, c.y); await p.waitForTimeout(700);
  out.tapResumesIdent = (await p.getAttribute('#ident-toggle', 'aria-pressed')) === 'true';

  await p.locator('.source[data-video]').first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(600);
  const src = await box('.source[data-video]');
  await tapAt(src.x, src.y); await p.waitForTimeout(1200);
  out.tapSelectsSource = await p.evaluate(() =>
    document.querySelector('.source[data-video]').getAttribute('aria-pressed') === 'true' &&
    document.querySelector('#now-source').textContent.trim().length > 0 &&
    !document.querySelector('#screen-frame').hidden);

  await p.locator('.knob').first().scrollIntoViewIfNeeded();
  await p.waitForTimeout(700);
  const before = await val(), yBefore = await p.evaluate(() => window.scrollY);
  const kb = await box('.knob');
  await drag(kb, -70); await p.waitForTimeout(600);
  const afterUp = await val(), yAfter = await p.evaluate(() => window.scrollY);
  out.dragMovesKnob = afterUp !== before;
  out.dragDoesNotScrollPage = yAfter === yBefore;
  await drag(kb, 70); await p.waitForTimeout(600);
  out.dragBothAxes = (await val()) !== afterUp;

  const kb3 = await box('.knob');
  await touch('touchStart', [[kb3.x, kb3.y]]);
  await touch('touchMove', [[kb3.x, kb3.y - 25]]);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchCancel', touchPoints: [] });
  await p.waitForTimeout(300);
  const v1 = await val();
  await drag(await box('.knob'), -50); await p.waitForTimeout(500);
  out.cancelRecovers = (await val()) !== v1;

  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(400);
  const para = await box('.room-face p');
  await drag(para, -140); await p.waitForTimeout(500);
  out.copyScrollsPage = (await p.evaluate(() => window.scrollY)) > 0;

  out.errors = errors;
  const pass = out.identAutoplays && out.tapPausesIdent && out.tapResumesIdent && out.tapSelectsSource &&
    out.dragMovesKnob && out.dragDoesNotScrollPage && out.dragBothAxes && out.cancelRecovers &&
    out.copyScrollsPage && errors.length === 0;
  console.log(JSON.stringify(out));
  await b.close();
  process.exit(pass ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
