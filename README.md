# Hills East Recording — rackmount revision

Static HTML/CSS/JavaScript; local fonts and assets; no build step. **Not deployed.** Original implementation backed up to `/data/pat/hills-east-rackmount-before-revision` before editing.

## Run locally

From `/data/pat`:

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `http://127.0.0.1:8768/hills-east-rackmount/`.

## Revision

- Broad centered ident above centered compact copy. Uncropped WebP/GIF; poster-based ident pause. Desktop image is 648px wide, formerly 350.84px at 1440px viewport. Mobile image is 298px, formerly 228px at 390px.
- Dedicated silver LA-2A-inspired studio leveling amplifier: single warm central VU, dark Gain and Peak Reduction knobs.
- Black Distressor-inspired dynamics faceplate: white screenprint frame, reduction LED strip, four silver Input/Attack/Release/Output knobs, selectable ratio bank.
- Both units are explicitly **visual meter demos**, not compressor emulation, audio processors, inventory statements, or manufacturer endorsements. Gain/Input/Output change demo amplitude; Peak Reduction attenuates it; Ratio changes a simple threshold-based display reduction. Attack/Release change the display envelope response, not sound. Knobs support vertical drag, focused wheel, arrows/Home/End and visible −/+ buttons.
- Lamp brightness and scan speed live in the power-conditioner utility controls. Scan speed affects only the CSS overlay, not animated-image playback.
- Patchbay selects or jack connections update the booking service, visible route summary, and hidden `session_route` field. **Use this route** scrolls to booking and focuses Your name. Clear/repatch/service changes never write into the message textarea. Tap/click/Enter/Space and optional drag are supported; cables are never required.
- Locally copied GSAP 3.13.0 and ScrollTrigger 3.13.0 add a paired native-scroll rack assembly and patchfield seating. No pinning, scroll replacement, or opacity-hidden content. License notices remain in vendored files.
- Pause all motion freezes meter loops, the ident, scan overlay and hidden-instrument visual chase, and removes scroll effects. Reduced-motion preference also applies dynamically. Audio transport remains a separate explicit PLAY/STOP action.
- Meter rAF runs only while a dynamics unit is onscreen and the document is visible. Hidden instrument visual chase runs only while playing, onscreen and motion-enabled; audio scheduling continues offscreen if explicitly played. Document hiding stops its transport.

## Hidden audio rack preserved

Press footer RESET three times within two seconds. The hidden rack still contains 64 drum steps, 25 piano keys, real Web Audio drums and monosynth, BPM/swing/master/voice controls, and POWER unmount. No autoplay audio. `HiddenRack.getLevels()` and `hiddenrack:audio` still expose live stereo levels; the public meter demo deliberately does not consume or pretend to process that audio.

## Files

- `index.html`, `styles.css`: rack/content/accessible controls and responsive hardware skin.
- `script.js`: meter demo, motion lifecycle, patch-to-booking state, form disclosure, secret mount gesture.
- `hidden-rack.js`: real instrument; amended visual-loop lifecycle only.
- `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`: locally vendored animation libraries, copied from `/data/pat/patpadgett-variants-2026-09/_shared/vendor`.
- `revision-qa.cjs`: current Playwright acceptance probes. `capture.js` is the older capture script.
- `.impeccable/review/revision-*`: both bounded QA rounds, screenshots and JSON results.
- `DESIGN.md`: actual revision design/behavior reference.
- `PRODUCT.md`: unchanged product truth; its old video and dummy-success references are known stale context, not implemented behavior.

## Verified

Commands executed successfully:

```sh
node --check hills-east-rackmount/script.js
node --check hills-east-rackmount/hidden-rack.js
node --check hills-east-rackmount/revision-qa.cjs
node hills-east-rackmount/revision-qa.cjs 2
```

Playwright Chromium at 1440×1000 and 390×844: all final assertions passed; zero console/page/resource errors; document widths exactly 1440/390; logo center error 0px; route service/summary/hidden field/focus verified; typed message preserved after reset; keyboard jacks produce two cables; knob values, level consequences, ratio/nudge and attack/release response coefficients verified; running/offscreen/paused/reduced states verified. Hidden rack generates nonzero stereo levels after PLAY and [0,0] after POWER. No-JS page exposes the hero, all three services, all three stages and booking.

Two inspection rounds only. Screenshot vision review confirmed centered logo, silver VU/dark knobs, black four-knob layout and contained mobile patchbay. Impeccable detector was not run because this installation has known missing detector modules.

## MPC-inspired pad sampler addition

Backup before this addition: `/data/pat/hills-east-rackmount-before-sampler`. Latest source remains this directory. Nothing deployed.

- Reveal with footer RESET three times within two seconds; the new cream/graphite/red Hills East pad sampler sits below the preserved drums and monosynth. MPC-inspired hardware study, not an Akai product or endorsement.
- Sixteen original synthesized PCM one-shots: deep kick, dust snare, closed/open hats, clap, rim, low/high tom, cowbell, shaker, tambourine, crash, sub bass, C-minor chord, mallet, space FX. Buffers render locally on first interaction; no audio downloads, microphone permissions, or autoplay.
- PLAY PADS triggers and selects a sound. 16 STEPS repurposes the same 4×4 buttons for its independent pattern. Sound/pattern select changes the edited sound without triggering. CLEAR PATTERN affects only that sound. All patterns initially empty; edits live only until POWER/reload.
- PLAY RACK / STOP RACK shares the existing rhythm computer's sample-accurate scheduling timestamps, BPM and swing; all programmed sounds run together. LCD shows selected sound, mode, count, tempo and playing state. White pad outline is the moving playhead; reduced motion suppresses the chase, not sound.
- Sampler level affects only the new instrument; original MASTER remains overall gain. A bounded 15ms gain ramp reaches actual zero, including after silent graph periods. STOP stops sample tails; POWER releases sources, closes context, cancels timers and removes listeners. Hiding the document stops transport.
- Native buttons/select/range support touch, pointer, Tab, Enter/Space, and range arrow keys. Pad activation is pointer-down for latency, without duplicate click firing; screen-reader activation uses native click. Existing synth letter shortcuts do not intercept sampler controls.

### Export and verification

`pad-sampler.js` and `sampler.css` are loaded by `index.html` and inlined by the updated `build-single.py`. Fresh standalone: `Hills-East-Recording.html`. Full archive: `/data/pat/Hills-East-Recording-MPC-Sampler.zip`.

```sh
python3 build-single.py
NODE_PATH=/data/pat/node_modules node sampler-qa.cjs
NODE_PATH=/data/pat/node_modules node revision-qa.cjs sampler-regression
```

Sampler Playwright Chromium (`--no-sandbox`) tests cover 1440px desktop, 390px touch/mobile, and 320px touch/mobile standalone opened via `file://`. Real AudioContext instrumentation checks sixteen non-silent, distinct PCM buffers; one trigger per tap; keyboard; independent patterns and selected clear; 200 BPM timing; live audio meters; exact zero at mute; stop, visibility teardown and remount; reduced-motion playhead; 44px minimum pads; zero horizontal overflow; zero console/page errors; booking preservation. JSON: `.impeccable/review/sampler-qa.json`. Existing full-site regression passes desktop/mobile plus no-JS; JSON: `.impeccable/review/revision-sampler-regression-results.json`.

Desktop/mobile rendered sampler screenshots received bounded visual review: no material clipping or layout issues. Screenshots: `.impeccable/review/sampler-1440.png` and `sampler-390.png`. No detector ran because installed Impeccable detector modules are unavailable. No separate reviewer-agent tool was available in this delegated session; visual image review substituted. PRODUCT.md remains known stale (video/dummy-success language), intentionally not migrated; existing DESIGN.md and site design remain unchanged. Actual iPhone/Safari testing and human listening remain unverified.

## Before publishing

**The booking endpoint and John's direct contact details are still missing. Nothing is sent.** Submitting a valid form displays “Not sent” and preserves text/route. There is no storage or delivery queue; reloading loses the draft. Retained “goes straight to John” copy describes the intended finished contact flow, not live delivery.

Listen on actual speakers before shipping: automated probes verified Web Audio signal values, not perceived sound quality. Real-device touch and non-Chromium coverage remain for final review. Parent handles final review and publication decision.
