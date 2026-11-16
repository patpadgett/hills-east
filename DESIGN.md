---
name: Hills East Recording — The Rack
description: A 19-inch equipment rack with brushed-black faceplates, a champagne booking plate, a YouTube playback unit with a stereo meter bridge, and a hidden instrument.
colors:
  room: "#08080a"
  rail: "#2a2b2f"
  rail-hi: "#4a4c52"
  plate: "#16171a"
  plate-2: "#1d1e22"
  plate-hi: "#35373d"
  champ: "#c9bfa6"
  champ-2: "#a99f88"
  champ-ink: "#17130c"
  silk: "#e9e7e0"
  silk-2: "#a9a8a3"
  silk-3: "#8f8e8a"
  red: "#e8322a"
  red-glow: "rgba(232,50,42,.55)"
  amber: "#ffb43c"
  green: "#62e07a"
  champ-label: "#3f3828"
typography:
  display:
    fontFamily: "Big Shoulders, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 5.4vw, 4.6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: ".01em"
  headline:
    fontFamily: "Big Shoulders, Impact, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 3.6vw, 3rem)"
    fontWeight: 800
    lineHeight: 0.95
  title:
    fontFamily: "Big Shoulders, Impact, Arial Narrow, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 800
    lineHeight: 1
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Michroma, Archivo, sans-serif"
    fontSize: ".74rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: ".14em"
  control-label:
    fontFamily: "Michroma, Archivo, sans-serif"
    fontSize: ".72rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: ".14em"
  readout:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: ".82rem"
    fontWeight: 500
    lineHeight: 1.2
rounded:
  unit: "2px"
  control: "3px"
  well: "4px"
  glass: "6px"
  bezel: "10px"
  circle: "50%"
spacing:
  u: "clamp(64px, 6.2vw, 88px)"
  gutter: "clamp(1rem, 3vw, 2.5rem)"
  rack-gap: "4px"
  rack-gap-mobile: "5px"
components:
  pushbtn:
    textColor: "{colors.silk}"
    rounded: "{rounded.control}"
    padding: ".55rem .9rem"
  bigswitch:
    textColor: "#fff"
    rounded: "{rounded.well}"
    padding: ".95rem 1.4rem .9rem 1.1rem"
  field:
    backgroundColor: "#f3eee0"
    textColor: "{colors.champ-ink}"
    rounded: "{rounded.control}"
    padding: ".7rem .8rem"
  knob:
    rounded: "{rounded.circle}"
    width: "54px"
    height: "54px"
  jewel:
    rounded: "{rounded.circle}"
    width: "14px"
    height: "14px"
---

# Hills East Recording — rackmount edition

As-shipped reference for the rack: centered monitor, YouTube playback unit with a stereo meter bridge, room, stage selector, champagne booking, power conditioner, plus the hidden MPC-inspired pad sampler. Frontmatter tokens are the live `:root` values; the sections below record actual behaviour, not intent.

## Direction and invariants

Preserve the 19-inch rack: continuous perforated rails, bolted ears, black brushed metal, champagne booking plate, red jewels, and the original content. Add recognizable hardware-inspired visual studies without suggesting studio ownership or endorsement. No audio is processed by the page's public controls, and no simulated meter is described as a measurement.
Fonts remain local Big Shoulders (equipment/headlines), Michroma (silkscreen), Archivo (body). Existing root tokens remain: room `#08080a`, plate `#16171a`, plate-2 `#1d1e22`, silk `#e9e7e0`, secondary silk `#a9a8a3`, champagne `#c9bfa6`, dark champagne ink `#17130c`, red `#e8322a`, amber `#ffb43c`, green `#62e07a`. Upper-left sheen, inset wells, metal knob caps and shadows describe hardware. Rack width remains capped at 1240px; unit classes are minimum heights, not rigid real-world U dimensions.

## Composition

Order: header; centered monitor/hero; playback; room; stage selector; champagne booking; power conditioner; hidden instrument.

The hero is a two-column 4U unit above 900px: monitor left (`minmax(340px,50%)`, `.crt` at `min(100%, 62vh)` capped at 680px), copy right (`max-width: 34rem`, left-aligned, optically centred on the screen via `padding-bottom: 3.4rem`). Below 900px it stacks: centred monitor, then centred copy. The h1 keeps its `<br>` after "Plug in." Image fit is `contain`, never cropped.

The monitor is a muted, looping, `playsinline` H.264 `<video>` (`assets/hills-east-ident.mp4`, 560²) with a WebP poster and `preload="none"`. `script.js` owns playback: the loop is fetched only after `load` (or 1.5 s), only when motion is allowed, the tab is visible and the monitor intersects the viewport. Reduced-motion and no-JS visitors see the poster only.

Caption row: `MONITOR · STUDIO IDENT` left, an icon-only Play/Pause button right (`.iconbtn`; the `aria-label` toggles between "Play ident" and "Pause ident"). The header carries the studio phone as a 44px chip (`tel:`) beside the brand; the location legend drops below 1120px and the chip wraps onto its own row below 600px. The manual motion toggle is gone.

## Playback unit

A 4U unit: brand row (italic Hills East wordmark, `PLAYBACK` title, `VIDEO · STEREO METER BRIDGE` legend), then a two-column face — 16:9 screen left, meter bridge right — then a source row.

Screen: a 16:9 well inside a 12px bezel with the same glass sheen and scanline overlay as the monitor (`--crt-period` is a fixed default). Two layers fill it: `.screen-idle` (radial dark field, 78px metal play glyph, `SELECT A SOURCE TO PLAY`) and `.screen-frame` > `.screen-target`, the YouTube IFrame API target. The API replaces the target with the iframe, so the wrapper — not the target — carries `hidden`.

Sources: two `.pushbtn` channel buttons, `CH 1 · INTERNAL` and `CH 2 · FADE AWAY`, each with `aria-pressed` and no sub-line. Video IDs `RE-oPaanCas` and `ZrAWnT-ecWM` are the only YouTube references; titles live in `data-title` and feed the now-playing readout.

Transport: Play/Pause and Stop pushbuttons in the caption row, plus a `NOW PLAYING · …` legend and a Signal jewel. Play/Pause and Stop are disabled until a source exists. Selecting a source injects `https://www.youtube.com/iframe_api` once, creates the player (or calls `loadVideoById` on the second and later selections) and plays. `onStateChange` owns the readout and the jewel; `onError` returns to the idle screen with a watch-on-YouTube link. Stop calls `stopVideo`, returns to idle and suppresses the CUED state that YouTube reports afterwards. End of video returns to idle.

Meter bridge: two `.vu` meters (L/R) reusing the shared SVG scale and tick generator. `script.js` runs a rAF loop only while the unit intersects the viewport, the document is visible and motion is allowed. While YouTube reports playing, a deterministic stereo programme envelope (slow phrase × pulse + fast detail, decorrelated per channel) drives the needles with ~110 ms rise / ~450 ms fall ballistics; otherwise the target is rest. The loop writes `#player[data-level-l]`/`[data-level-r]`, and the room and power ladders light from the same peak level. **The needles are a playback demo.** The iframe's audio is cross-origin and is never analysed. The unit carries no explanatory note; a hidden status line appears only to report a playback error.

Reduced motion stops the loop and drops the needles to rest; the video itself keeps playing because playback is an explicit user action. No-JS visitors get a `<noscript>` with both YouTube links.

## Booking form delivery

GitHub Pages serves static files only — no server-side code — so the form posts to a serverless form backend that emails John. `script.js` holds `BOOK_FORM = { endpoint, accessKey }`; both are empty in the shipped tree, so the submit handler falls through to the honest "nothing is sent" message and no request leaves the page. Setting the two values activates it: the handler POSTs `FormData` (with `access_key`, `_subject`, `_replyto` added), shows "Sending…", then either "Sent — John will reply directly…" plus a form reset, or the call/email fallback on a non-2xx response.

A `.hp-wrap` pair of honeypot inputs (`botcheck`, `_gotcha`) sits off-screen; if either is filled the handler drops the submission without posting. `action` stays `#` until the endpoint is configured, so the no-JS path never posts into the void. Web3Forms (250 free submissions/month) and Formspree (50) both accept this shape. The tradeoff is that message content passes through a third party.

## Parked: playlist unit

A 4U local-audio playlist with a live 10-band FFT spectrum (`<audio>` → `MediaElementSource` → `AnalyserNode` → gain → destination) was designed and verified, then removed until the MP3s arrive. Module, stylesheet, QA probes and the audio drop-folder instructions live in `../hills-east-playlist-unit/`; restoring is a copy-plus-markup job, and `script.js` already carries the generic knob hook it needs.

## Room, stage selector, booking, power

Room keeps its two-column 3U face and spec table, with the demo-level ladder now fed by the playback unit. The stage selector keeps the 3-position chicken-head knob (`Talk / Track / Finish`) driving the three How-it-works stages. Booking remains champagne with native fields and the disconnected-form honesty note; the patch-route field is gone. The power conditioner keeps the demo ladder and the RESET easter egg; its two unused sliders are gone.

## Motion and lifecycle

Local GSAP/ScrollTrigger 3.13.0 with original license headers. One restrained seating moment: the playback unit settles from y26/scale .982 to its natural geometry, scrubbed against native viewport scroll with ease none. No pinning, snapping, scroller proxy or scroll hijack. All content starts visible; missing GSAP disables the enhancement. Context reversion restores natural geometry before pausing or preference changes.

Reduced motion reverts scroll contexts, cancels the meter rAF loop, pauses CSS animations and signals the hidden instrument. Reduced-motion is honored on initial load and dynamically; the live state is read with a fresh `matchMedia(...)` rather than a cached `MediaQueryList`, which can go stale under emulation. The meter loop runs only while the playback unit is onscreen, the document is visible and motion is allowed; room and power ladders retain the last level rather than keeping a loop alive for their lights. Hidden sequencer frames run only during transport, onscreen, document-visible and motion-enabled. Audio stays a separate explicit PLAY/STOP interaction.

## Progressive behavior and accessibility

Original room/stage copy remains in HTML. Without JS every stage displays, the hero and booking remain visible, and the playback unit exposes both videos as plain links. With JS the stage selection and playback transport work as before. Touch-friendly visible alternatives accompany rotary controls. Focus uses the existing amber outline, red on champagne. Tiny silkscreen is reserved for hardware labels; body explanations remain Archivo. All nudge targets are 44px square, and the contact links (header phone chip, booking phone/email, footer phone) are 32–44px. The viewport declares `viewport-fit=cover` and the body carries `env(safe-area-inset-*)` padding, so notched phones keep the rails clear. Below 340px the spec table stacks and the unit ears tighten; below 300px unit headings, the phone chip and the LED ladder step down and the footer power strip wraps. The page has no horizontal overflow from 1440 down to 195 CSS px, including the 320px WCAG 1.4.10 reflow width. The stage knob is a vertical drag with `touch-action: none`, so dragging it moves the control rather than the page; `touch-qa.cjs` verifies that, both drag axes, `touchCancel` recovery, taps on the ident and source controls, and that ordinary copy still scrolls.

## Verification and references

Canonical evidence: `.impeccable/review/player-55-results.json` and the matching 1440/390 screenshots, plus `revision-56-results.json` for the full-site regression and `touch-qa.cjs` for the synthesised-touch suite. Both suites passed every assertion. The offline standalone probe reported zero external requests, no overflow and no errors. Node syntax checks passed. An `$impeccable audit` scored 15/20, then 18/20 after its fixes landed: 44px contact targets in header, booking and footer; a narrow-viewport fallback for the spec table; widow control on body copy; the dead Caveat face removed. `$impeccable adapt` then closed the remaining sub-320px overflow and added the synthesised-touch suite. A `$impeccable polish` pass then removed the dead CSS and token, themed the WebKit scrollbar and autofill, added tabular numerals to the spec values, corrected the drift above, and re-measured every text/background pair from the rendered pixels (weakest 5.25:1). Visual review found balanced layouts, deliberate idle states, a clear keyboard focus ring and no clipping at 390px.

Contact details are on the page (816-694-6288 in header, booking and footer; hillseastrecording@gmail.com in the booking unit). Outstanding: the form's server side, human listening, real-device touch, YouTube playback on a phone, and cross-browser review. No deployment occurred from this session.

## Do's and Don'ts

### Do:
- **Do** use The Rack's continuous rails, unit minimum heights, ears, screws, and material-specific ink when extending the page.
- **Do** keep the three font roles distinct and preserve local self-hosted assets.
- **Do** retain keyboard-accessible slider semantics, visible focus, and 44px minimum targets.
- **Do** give each interactive control an observable consequence and distinguish simulated display data from actual audio.
- **Do** apply the final responsive cascade: mobile unit inset and VU sizing are not what the first media block alone suggests.
- **Do** keep the hidden instrument undisclosed until the RESET gesture and stop audio/listeners when it closes.
- **Do** label the disconnected form honestly until a real booking destination exists.

### Don't:
- **Don't** restore the retired amp-head/tolex system, old aluminum palette, beat timings, sticky drawer navigation, rotary tabs, knob-shaped booking CTA, or the removed compressor/patchbay faceplates.
- **Don't** claim the CSS speed control changes animated-image playback, that the VU needles measure the video's audio, or that reduced motion stops all animation.
- **Don't** mistake declared-but-unused variables, absent ventilation/toggle hardware, or brief aspirations for shipped components.
- **Don't** impose a red-only rule: amber meters, champagne, and red form focus are established parts of this world.
- **Don't** add generic cards, pill actions, or a stock studio-photo background in place of the rack.
- **Don't** invent studio proof, backend delivery, or successful message queuing.
