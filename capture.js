const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({args:['--no-sandbox']});
  const out = '/data/pat/hills-east-rackmount/.impeccable/review/';
  require('fs').mkdirSync(out, {recursive:true});
  for (const [name,w,h] of [['desktop',1440,900],['mobile',390,844],['narrow',320,700]]) {
    const p = await b.newPage({viewport:{width:w,height:h}});
    const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
    await p.goto('http://127.0.0.1:8771/index.html',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
    const m = await p.evaluate(()=>({sw:document.documentElement.scrollWidth,h1:document.querySelectorAll('h1').length,noalt:[...document.images].filter(i=>!i.hasAttribute('alt')).length,cables:document.querySelectorAll('.cables path').length,knobs:document.querySelectorAll('.knob').length}));
    // interactions: knob keyboard, patch click-to-click, reset x3
    if (name==='desktop') {
      await p.focus('[data-knob="gain"]'); for (let i=0;i<5;i++) await p.keyboard.press('ArrowUp');
      m.gainAfter = await p.getAttribute('[data-knob="gain"]','aria-valuenow');
      await p.click('[data-jack="room"]'); await p.click('[data-jack="out-release"]');
      m.lampOn = await p.evaluate(()=>document.getElementById('route-lamp').classList.contains('jewel--on'));
      await p.focus('[data-knob="stage"]'); await p.keyboard.press('ArrowRight');
      m.stageOn = await p.evaluate(()=>document.querySelector('.stage.is-on').dataset.stage);
      for (let i=0;i<3;i++) await p.click('#reset');
      await p.waitForTimeout(800);
      m.hiddenShown = await p.evaluate(()=>!document.getElementById('hidden-rack').hidden);
      m.hiddenChildren = await p.evaluate(()=>document.getElementById('hidden-rack').childElementCount);
      m.hasModule = await p.evaluate(()=>!!window.HiddenRack);
      await p.screenshot({path: out+'hidden.png', fullPage:true});
      await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(300);
    }
    await p.evaluate(()=>window.scrollTo(0,0)); await p.waitForTimeout(400);
    await p.screenshot({path: out+name+'-fold.png'});
    await p.screenshot({path: out+name+'.png', fullPage:true});
    console.log(name, JSON.stringify(m), 'errors', JSON.stringify(errs));
    await p.close();
  }
  await b.close();
})();
