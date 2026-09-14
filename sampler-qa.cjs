const { chromium } = require('playwright');
const fs=require('fs'),assert=require('assert');
const root='/data/pat/hills-east-rackmount',out=root+'/.impeccable/review';
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']}); const results=[];
 for(const variant of [{width:1440,mobile:false,file:false},{width:390,mobile:true,file:false},{width:320,mobile:true,file:true}]){
  const context=await browser.newContext({viewport:{width:variant.width,height:variant.mobile?844:1000},isMobile:variant.mobile,hasTouch:variant.mobile});
  await context.addInitScript(()=>{
   window.audioQA={contexts:[],starts:[],buffers:[],gains:[],active:new Set()};
   const AC=window.AudioContext;window.AudioContext=class extends AC{constructor(...args){super(...args);audioQA.contexts.push(this);}createGain(){const g=super.createGain();audioQA.gains.push(g);return g;}createBuffer(...args){const b=super.createBuffer(...args);audioQA.buffers.push(b);return b;}createBufferSource(){const s=super.createBufferSource();const start=s.start.bind(s),stop=s.stop.bind(s);s.start=(...args)=>{audioQA.starts.push({buffer:audioQA.buffers.indexOf(s.buffer),time:args[0]??this.currentTime});audioQA.active.add(s);s.addEventListener('ended',()=>audioQA.active.delete(s));return start(...args);};s.stop=(...args)=>{audioQA.active.delete(s);return stop(...args);};return s;}};
  });
  const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  await page.goto(variant.file?'file://'+root+'/Hills-East-Recording.html':'http://127.0.0.1:8768/hills-east-rackmount/');await page.evaluate(()=>document.fonts.ready);
  await page.locator('#reset').click({clickCount:3,delay:55});await page.locator('.hr-sampler').waitFor();
  assert.equal(await page.locator('.hr-step').count(),64);assert.equal(await page.locator('.hr-key').count(),25);
  assert.equal(await page.locator('.mpc-pad').count(),16);assert.equal(await page.evaluate(()=>audioQA.contexts.length),0);
  const activate=async i=>{const pad=page.locator('.mpc-pad').nth(i);if(variant.mobile)await pad.tap();else await pad.click();};
  for(let i=0;i<16;i++)await activate(i);
  const samples=await page.evaluate(()=>audioQA.buffers.slice(1).map(b=>{const d=b.getChannelData(0);let energy=0,peak=0,hash=2166136261;for(let i=0;i<d.length;i++){energy+=d[i]*d[i];peak=Math.max(peak,Math.abs(d[i]));hash=Math.imul(hash^Math.round(d[i]*1e7),16777619)>>>0;}return {length:d.length,rms:Math.sqrt(energy/d.length),peak,hash};}));
  assert.equal(samples.length,16);assert(samples.every(b=>b.rms>.01&&b.peak>.7));assert.equal(new Set(samples.map(b=>b.hash)).size,16);
  assert.equal(await page.evaluate(()=>audioQA.starts.length),16,'single trigger per pointer/tap');
  await page.locator('.mpc-pad').nth(0).focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');assert.equal(await page.evaluate(()=>audioQA.starts.length),18);
  await page.locator('.mpc-select').selectOption('0');await page.getByRole('button',{name:'16 STEPS',exact:true}).click();await activate(0);await activate(4);
  await page.locator('.mpc-select').selectOption('1');assert.equal(await page.locator('.mpc-pad.programmed').count(),0);await activate(2);
  await page.locator('.mpc-select').selectOption('0');assert.equal(await page.locator('.mpc-pad.programmed').count(),2);
  await page.locator('.mpc-select').selectOption('1');await page.getByRole('button',{name:'CLEAR PATTERN',exact:true}).click();assert.equal(await page.locator('.mpc-pad.programmed').count(),0);await activate(2);
  await page.locator('.mpc-select').selectOption('0');assert.equal(await page.locator('.mpc-pad.programmed').count(),2);
  // Silence the pre-existing drum rows so meter evidence measures only the sampler.
  await page.evaluate(()=>document.querySelectorAll('.hr-step.on').forEach(b=>b.click()));
  const bpm=page.getByRole('slider',{name:'BPM',exact:true});await bpm.focus();await bpm.press('End');assert.equal(await page.locator('.mpc-tempo').textContent(),'200 BPM');
  await page.locator('.hr-sampler').scrollIntoViewIfNeeded();
  await page.evaluate(()=>{audioQA.starts.length=0;});await page.locator('.mpc-play').click();await page.waitForTimeout(1500);
  const sequencing=await page.evaluate(()=>({starts:audioQA.starts.map(s=>({...s})),state:audioQA.contexts[0].state,levels:HiddenRack.getLevels()}));
  assert.equal(sequencing.state,'running');assert(sequencing.starts.some(s=>s.buffer===1)&&sequencing.starts.some(s=>s.buffer===2));
  assert.equal(await page.locator('.mpc-pad.current').count(),1,'visible playhead');assert.equal(await page.locator('.mpc-status').textContent(),'PLAYING');assert.equal(await page.locator('.hr-transport .hr-btn').textContent(),'STOP');
  const kick=sequencing.starts.filter(s=>s.buffer===1).map(s=>s.time);assert(kick.length>=3);assert(Math.abs(kick[1]-kick[0]-.3)<.015,'quarter note at 200 BPM');
  const meter=[];for(let i=0;i<12;i++){meter.push(await page.evaluate(()=>HiddenRack.getLevels()[0]));await page.waitForTimeout(35);}assert(Math.max(...meter)>.01);
  if(process.env.CAPTURE==='1'&&!variant.file)await page.locator('.hr-sampler').screenshot({path:out+'/sampler-'+variant.width+'.png'});
  await page.locator('.mpc-play').click();assert.equal(await page.evaluate(()=>audioQA.active.size),0);
  const stopped=await page.evaluate(()=>audioQA.starts.length);await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>audioQA.starts.length),stopped);
  await page.locator('.mpc-level input').fill('0');await page.getByRole('button',{name:'PLAY PADS',exact:true}).click();await page.waitForTimeout(1500);await activate(12);await page.waitForTimeout(80);const muted=await page.evaluate(()=>HiddenRack.getLevels()[0]);assert(muted<.001,'muted meter '+muted+' level '+await page.locator('.mpc-level input').inputValue());
  await page.locator('.mpc-level input').fill('100');await activate(12);await page.waitForTimeout(70);const audible=await page.evaluate(()=>HiddenRack.getLevels()[0]);assert(audible>.01);
  await page.emulateMedia({reducedMotion:'reduce'});await page.getByRole('button',{name:'16 STEPS',exact:true}).click();await page.locator('.mpc-play').click();await page.waitForTimeout(150);assert.equal(await page.locator('.mpc-pad.current').count(),0);
  const overflow=await page.evaluate(()=>({document:document.documentElement.scrollWidth,viewport:innerWidth,pads:[...document.querySelectorAll('.mpc-pad')].map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})),sampler:document.querySelector('.hr-sampler').scrollWidth,client:document.querySelector('.hr-sampler').clientWidth}));assert.equal(overflow.document,variant.width);assert.equal(overflow.sampler,overflow.client);assert(overflow.pads.every(p=>p.w>=44&&p.h>=44));
  await page.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));});assert.equal(await page.locator('.mpc-status').textContent(),'STOPPED');assert.equal(await page.evaluate(()=>audioQA.active.size),0);await page.evaluate(()=>{delete document.hidden;document.dispatchEvent(new Event('visibilitychange'));});await page.locator('.mpc-play').click();
  await page.locator('.hr-power').click();await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>audioQA.contexts[0].state),'closed');assert.equal(await page.evaluate(()=>audioQA.active.size),0);assert.deepEqual(await page.evaluate(()=>HiddenRack.getLevels()),[0,0]);
  const after=await page.evaluate(()=>audioQA.starts.length);await page.waitForTimeout(200);assert.equal(await page.evaluate(()=>audioQA.starts.length),after);
  await page.locator('#reset').click({clickCount:3,delay:55});await page.locator('.hr-sampler').waitFor();assert.equal(await page.locator('.mpc-pad').count(),16);await activate(0);assert.equal(await page.evaluate(()=>audioQA.contexts.length),2);await page.locator('.hr-power').click();
  // Booking still routes without overwriting the visitor's draft.
  await page.locator('#msg').fill('Sampler regression draft');await page.locator('#route-input').selectOption('in-mixing');await page.locator('#route-output').selectOption('out-release');await page.locator('#use-route').click();assert.equal(await page.locator('#booking-route-field').inputValue(),'Mixing → John → Release');assert.equal(await page.locator('#msg').inputValue(),'Sampler regression draft');
  assert.deepEqual(errors,[]);results.push({...variant,samples,sequencing,meterPeak:Math.max(...meter),muted,audible,overflow,errors,assertions:'PASS: 16 unique non-silent buffers, touch/pointer/keyboard, separated patterns, clear, shared clock/tempo/transport, live signal/gain, reduced motion, teardown/remount, preserved booking, no overflow'});await context.close();
 }
 await browser.close();fs.writeFileSync(out+'/sampler-qa.json',JSON.stringify({passed:true,results},null,2));console.log(JSON.stringify({passed:true,variants:results.map(r=>({width:r.width,standalone:r.file,samples:r.samples.length,meterPeak:r.meterPeak,overflow:r.overflow.document}))},null,2));
})().catch(e=>{console.error(e);process.exit(1);});
