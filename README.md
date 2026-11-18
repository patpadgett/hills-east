# Hills East Recording — rackmount edition

Static HTML/CSS/JavaScript; local fonts and assets; no build step. **Deployed** to https://hills-east.patpadgett.com via GitHub Pages (github.com/patpadgett/hills-east, branch `main`, `CNAME`). Snapshots beside this directory: `../hills-east-rackmount-before-player` (the compressor/patchbay edition), `../hills-east-rackmount-before-sampler`, `../hills-east-rackmount-before-revision`.

## Run locally

From this directory:

```sh
python3 -m http.server 8768 --bind 127.0.0.1
```

Open `http://127.0.0.1:8768/`.

## The rack

1U ID · 4U monitor/hero · 4U playback (video + meter bridge) · 3U room · 2U stage selector · 4U champagne booking · 1U power conditioner · hidden 6U instrument.

## Playback unit

Two YouTube sources, both by Beneath The Skin:

| CH | Video | ID |
| --- | --- | --- |
| 1 | “Internal” official video | `RE-oPaanCas` |
| 2 | “Fade Away” lyric video | `ZrAWnT-ecWM` |

- The IFrame API script is fetched on demand the first time a source is chosen. Nothing contacts YouTube on page load and there is no autoplay.
- Selecting a source loads and plays it (the click is the user gesture). Play/Pause and Stop are real transport; switching channels keeps the transport; the end of a video returns to the idle screen; Stop returns to idle and Play restarts the selected channel.
- Now-playing readout, source `aria-pressed`, transport `aria-pressed`, and a Signal jewel that follows playback state.
- Meter bridge: two VU needles (L/R) with a simulated programme envelope and VU-style ballistics. **This is a playback demo, not a measurement** — the iframe’s audio is cross-origin and is never analysed. Needles rest when paused, stopped, offscreen, tab-hidden or motion-disabled. The room and power ladders follow the same level.
- If YouTube is unreachable the status says so and offers a watch-on-YouTube link. With JavaScript off, the unit shows both videos as plain links.

## Parked: playlist unit

A 4U local-audio playlist with a live 10-band FFT spectrum was built and verified, then removed from this page until the MP3s arrive. The module, its stylesheet, its QA probes and the `assets/audio` instructions are parked in `../hills-east-playlist-unit/` with a restore checklist. Nothing here references them, and no audio files are needed for this version.

## Removed in this revision

The LA-2A-inspired leveling amplifier, the Distressor-inspired dynamics lab and the session patchbay are gone, along with their CSS, their JS and the patch-to-booking route. Booking keeps its own “What do you need?” select; the nav item “Sessions” became “Videos” and points at the playback unit. The monitor/hero, room, stage selector and hidden instrument are unchanged; the power conditioner lost its two unused sliders, and the booking unit gained John's phone and email.

## Hidden audio rack preserved

Press footer RESET three times within two seconds. The hidden rack still contains 64 drum steps, 25 piano keys, real Web Audio drums and monosynth, BPM/swing/master/voice controls, and POWER unmount. No autoplay audio. `HiddenRack.getLevels()` and `hiddenrack:audio` still expose live stereo levels; the public meter demo deliberately does not consume or pretend to process that audio.

## Files

- `index.html`, `styles.css`: rack/content/accessible controls and responsive hardware skin.
- `script.js`: playback transport + meter demo, motion lifecycle, secret mount gesture, serverless booking delivery (dormant until configured).
- `hidden-rack.js`, `pad-sampler.js`, `sampler.css`: unchanged hidden instrument.
- `vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`: locally vendored animation libraries, copied from `/data/pat/patpadgett-variants-2026-09/_shared/vendor`.
- `player-qa.cjs`: playback-unit Playwright acceptance probes.
- `revision-qa.cjs`: full-site regression probes (everything except the playback unit).
- `single-qa.cjs`: offline standalone probe. `touch-qa.cjs`: synthesised-touch gesture probes (taps, knob drag axis, cancel recovery, page scroll). `sampler-qa.cjs`: sampler suite. `capture.js`: older capture script.
- `.impeccable/review/`: QA screenshots and JSON results.
- `DESIGN.md`: actual design/behavior reference.
- `PRODUCT.md`: product truth (platform, users, purpose, positioning, capabilities, brand commitments, evidence, principles, open decisions). Refreshed after the audit; contact details, videos and the parked playlist are recorded there.

## Verified

Commands executed successfully:

```sh
node --check hills-east-rackmount/script.js
node hills-east-rackmount/player-qa.cjs 55
node hills-east-rackmount/revision-qa.cjs 56
node hills-east-rackmount/touch-qa.cjs
node hills-east-rackmount/single-qa.cjs
```

Playwright Chromium at 1440×1000 and 390×844: all assertions passed; zero console/page errors; document widths exactly 1440/390; both videos load and play; transport, source switching, stop, pause, signal jewel and meter movement verified; needles fall at rest; motion pause and reduced motion freeze both display loops; easter egg mounts 64 steps / 25 keys / 16 pads; booking draft preserved and the “Not sent” honesty note intact; the standalone opens offline with zero external requests and no overflow.

Screenshots: `.impeccable/review/player-55-1440-idle.png`, `player-55-1440-playing.png`, plus the 390px set. JSON: `player-55-results.json`, `revision-56-results.json`.

Visual review of the rendered unit confirmed a balanced screen/meter-bridge layout, a deliberate idle state (parked needles, dark Signal jewel, disabled transport), and no clipping at 390px.

## Polish (`$impeccable polish`)

- Removed dead CSS: `.knob-wrap`, `.knob--skirt`, `.knob--soft`, `.hero-cluster`, `.hr-knob-wrap` (11 class rules, none present in the DOM) and the unused `--accent-hue` token. A runtime scan of the rendered DOM at 1440 and 390 now finds no unused class rule.
- Themed the remaining browser surfaces: `::-webkit-scrollbar` (Chromium/Safari default to a light bar on a near-black page; Firefox was already covered by `scrollbar-color`), and `-webkit-autofill` so a saved name/email keeps the champagne field instead of Chrome's yellow.
- `font-variant-numeric: tabular-nums` on the spec values.
- DESIGN.md drift corrected: frontmatter field colour, the header phone chip's real breakpoints, the removed source sub-lines, the audit score.
- Re-measured every text/background pair by sampling the rendered pixels rather than the computed colour: all pass (weakest is `.stage-labels` at 5.25:1). The primary CTAs are white on the `#c33a31`→`#6a1712` switch gradient, 5.29:1 or better.
- States verified in the render: idle (disabled transport, parked needles, "no source"), source selected (amber ring + white text vs flat unselected), keyboard focus ring on the source row.

## Adaptation (`$impeccable adapt`)

- `viewport-fit=cover` plus `env(safe-area-inset-*)` padding on `body`, so the page extends into notches without the rails sitting under them.
- Stacked grids (`.room`, `.booking`, `.player-face`) use `minmax(0, 1fr)` with `min-width: 0` on their children, so long values such as the booking email can wrap instead of forcing a scrollbar.
- A `max-width: 300px` fallback shrinks unit headings, the header phone chip and the demo LED ladder, and lets the footer power strip wrap.
- Result: **no horizontal overflow at any tested width**, from 1440 down to 195 CSS px (a 390px phone at 200% browser zoom), plus the WCAG 1.4.10 reflow width of 320px.
- Touch: `touch-qa.cjs` drives real CDP touch events — ident and source taps, the stage knob's vertical drag (control moves, page does not), both drag axes, `touchCancel` recovery, and page scrolling from ordinary copy. All nine assertions pass with zero page errors.

## MPC-inspired pad sampler addition

Backup before that addition: `../hills-east-rackmount-before-sampler`. Latest source remains this directory.

- Reveal with footer RESET three times within two seconds; the cream/graphite/red Hills East pad sampler sits below the preserved drums and monosynth. MPC-inspired hardware study, not an Akai product or endorsement.
- Sixteen original synthesized PCM one-shots: deep kick, dust snare, closed/open hats, clap, rim, low/high tom, cowbell, shaker, tambourine, crash, sub bass, C-minor chord, mallet, space FX. Buffers render locally on first interaction; no audio downloads, microphone permissions, or autoplay.
- PLAY PADS triggers and selects a sound. 16 STEPS repurposes the same 4×4 buttons for its independent pattern. Sound/pattern select changes the edited sound without triggering. CLEAR PATTERN affects only that sound. All patterns initially empty; edits live only until POWER/reload.
- PLAY RACK / STOP RACK shares the existing rhythm computer's sample-accurate scheduling timestamps, BPM and swing; all programmed sounds run together. LCD shows selected sound, mode, count, tempo and playing state. White pad outline is the moving playhead; reduced motion suppresses the chase, not sound.
- Sampler level affects only the new instrument; original MASTER remains overall gain. A bounded 15ms gain ramp reaches actual zero, including after silent graph periods. STOP stops sample tails; POWER releases sources, closes context, cancels timers and removes listeners. Hiding the document stops transport.
- Native buttons/select/range support touch, pointer, Tab, Enter/Space, and range arrow keys. Pad activation is pointer-down for latency, without duplicate click firing; screen-reader activation uses native click. Existing synth letter shortcuts do not intercept sampler controls.

### Export and verification

`pad-sampler.js` and `sampler.css` are loaded by `index.html` and inlined by `build-single.py`. Fresh standalone: `Hills-East-Recording.html`.

```sh
python3 build-single.py
node single-qa.cjs
```

The sampler suite (`sampler-qa.cjs`) still references `/data/pat/node_modules` and the older build host; its booking step was updated to the post-patchbay form (submit preserves the draft). Run it on a host that has that path before trusting its output.

## Booking form delivery

GitHub Pages serves static files only, so the form cannot send mail itself. `script.js` carries a serverless delivery path that is **dormant until configured** — set `BOOK_FORM.endpoint` and `BOOK_FORM.accessKey` near the bottom of `script.js` and submissions POST there and email John.

- **Web3Forms** (recommended): free 250 submissions/month, unlimited forms, honeypot + hCaptcha + spam filter, custom redirect. Endpoint `https://api.web3forms.com/submit`; the access key is the only thing to paste.
- **Formspree**: free 50 submissions/month, unlimited forms. Endpoint `https://formspree.io/f/<your-form-id>`, leave `accessKey` empty because the id is in the URL.
- The form ships with a honeypot (`botcheck` / `_gotcha`); a filled honeypot silently drops the submission.
- Until a key is set the form keeps its honest "nothing is sent" message, and nothing leaves the page.
- The message content passes through the chosen third party, which is what actually sends the mail.

Verified against a local mock endpoint: `name, email, project, need, message, access_key, _subject, _replyto` arrive intact, a successful post shows "Sent — John will reply directly…", a failed post shows the call/email fallback, and a filled honeypot sends nothing.

## Before publishing

**The booking form has serverless delivery plumbing but no key set yet — nothing is sent until a form backend is configured.** John's direct details are on the page now: **913-735-9287** (header, booking unit, footer) and **hillseastrecording@gmail.com** (booking unit). Submitting a valid form says so and preserves the text; there is no storage or delivery queue, and reloading loses the draft.

Listen on actual speakers before shipping: automated probes verified Web Audio signal values, not perceived sound quality. Real-device touch, YouTube playback on a phone, and non-Chromium coverage remain for final review. Parent handles final review and publication decision.

## Background: the rack (original edition notes)

The whole site is a 19" equipment rack. Every section is a rack unit (1U–6U) bolted between two rails; the content lives on faceplates and every control does something. Flat HTML/CSS/JS, self-hosted fonts, no build step, no external calls on load.

Sibling of ~/hills-east-recording/ (the tube-amp faceplate version); same content and PRODUCT.md.

## What is interactive

- Monitor ident: a muted looping H.264 with a WebP poster and an icon-only Play/Pause button in the caption row.
- Playback: two YouTube channels, Play/Pause and Stop transport, a now-playing readout, a Signal jewel and the stereo VU meter bridge.
- Stage selector: the 3-position chicken-head knob switches the How-it-works stage (drag, wheel, arrows/Home/End; role=slider with live aria-valuenow).
- Booking: real POST-ready form on the champagne plate; the Send button is an illuminated switch. It has no server behind it — John’s phone and email sit beside it.
- Contact: **913-735-9287** in the header, the booking unit and the footer; **hillseastrecording@gmail.com** in the booking unit. Both are `tel:` / `mailto:` links.
- Easter egg: the RESET button on the 1U power conditioner. Press it three times within two seconds and the hidden 6U rack slides in.

## Design decisions

- Palette: brushed-black plates, champagne booking plate, screen-print silk white, one red jewel family (lamps, Book switch), amber for focus/knob pointers, green LED ladders. Warm key light from upper-left as a top-edge highlight on every plate.
- Type: Big Shoulders for unit names, Michroma for silkscreen legends, Archivo body. All three faces are local and subsetted.
- Rails carry three holes per U; unit heights snap to U multiples; rack ears carry the screws.
- No decorative gear: if it looks like a control, it is one.

## Audit (`$impeccable audit`) and what it changed

Scored 15/20 (Good). Fixes applied:

- **Contact targets**: the header phone is now a 44px chip; the booking phone/email are 44px; the footer phone is 32px. No interactive element under 24px remains at 1440/1100/900/700/390/360/320.
- **Narrow-viewport fallback**: `.spec` columns can shrink and wrap, and below 340px the spec table stacks. Measured with a faithful 200%-zoom emulation (640 CSS px at DPR 2): no overflow. The earlier "200% zoom" figure came from CSS `zoom`, which does not reproduce real browser zoom; the page also passes the WCAG 1.4.10 reflow width of 320px.
- **Widows**: `text-wrap: pretty` on the room, stage, booking and footer copy; the footer phone sits on a deliberate second line.
- **Dead asset**: `fonts/caveat-700-latin.woff2` removed (41 KB, no remaining reference).
- **Context**: `PRODUCT.md` refreshed.

Detector findings left as documented exceptions: the red glow on the illuminated switches, the hard offset button shadows, the bezel/spec "nested cards", the brushed-stripe texture and the selector legend are all deliberate rack-hardware choices recorded in `DESIGN.md`.

## QA performed

- Playwright Chromium 1440×1000 / 390×844: no horizontal overflow, one h1, zero console errors. Interactions exercised headlessly: playback transport and meters stage selector keys, motion pause, RESET×3 mounts the hidden rack (64 steps, 25 keys, 16 pads).
- No-JS page exposes the hero, all three stages, the playback unit with both video links, and booking.
