---
name: Hills East Recording — The Rack
description: A playable 19-inch equipment rack with brushed-black faceplates, champagne booking hardware, silkscreen legends, and handwritten patch labels.
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
  tape: "#e7dcbf"
  tape-ink: "#1a1710"
  field: "#f3eee0"
  champ-label: "#3f3828"
  silver-hi: "#f1f1eb"
  silver: "#c9cbc7"
  silver-2: "#b9bcb9"
  silver-lo: "#959c9c"
  silver-ink: "#202324"
  silver-rule: "#727876"
  silver-brand: "#94281f"
  black-hi: "#292b2d"
  black: "#111315"
  black-2: "#101214"
  black-lo: "#050606"
  screenprint: "#e2e1d7"
  led-amber: "#ffcb55"
  led-off: "#47251c"
  readout-amber: "#efcf83"
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
  tape:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1
    note: "static 700 instance, Basic Latin subset (fonts/caveat-700-latin.woff2, 41 KB)"
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
    backgroundColor: "{colors.field}"
    textColor: "{colors.champ-ink}"
    rounded: "{rounded.control}"
    padding: ".7rem .8rem"
  knob:
    rounded: "{rounded.circle}"
    width: "54px"
    height: "54px"
  jack:
    rounded: "{rounded.circle}"
    width: "44px"
    height: "44px"
  jewel:
    rounded: "{rounded.circle}"
    width: "14px"
    height: "14px"
---

# Hills East Recording — revised rack

As-shipped reference for the rackmount revision (centered monitor, silver leveling amplifier, black dynamics lab, patch-to-booking) plus the hidden MPC-inspired pad sampler. Frontmatter tokens are the live `:root` values; the sections below record actual behaviour, not intent.
## Direction and invariants

Preserve the 19-inch rack: continuous perforated rails, bolted ears, black brushed metal, champagne booking plate, red jewels, and the original content. Add recognizable hardware-inspired visual studies without suggesting studio ownership or endorsement. No actual compressor emulation is present.
Fonts remain local Big Shoulders (equipment/headlines), Michroma (silkscreen), Archivo (body), Caveat (patch tape). Existing root tokens remain: room `#08080a`, plate `#16171a`, plate-2 `#1d1e22`, silk `#e9e7e0`, secondary silk `#a9a8a3`, champagne `#c9bfa6`, dark champagne ink `#17130c`, red `#e8322a`, amber `#ffb43c`, green `#62e07a`. Upper-left sheen, inset wells, metal knob caps and shadows describe hardware. Rack width remains capped at 1240px; unit classes are minimum heights, not rigid real-world U dimensions.

## Composition

Order: header; centered monitor/hero; silver leveling amplifier; black dynamics lab; session patchbay; room; stage selector; champagne booking; power conditioner; hidden instrument.

The hero is a two-column 4U unit above 900px: monitor left (`minmax(340px,50%)`, `.crt` at `min(100%, 62vh)` capped at 680px), copy right (`max-width: 34rem`, left-aligned, optically centred on the screen rather than on screen + caption row via `padding-bottom: 3.4rem`). The unit's `min-height` fills the first viewport minus the header so the headline, lede and Book switch are always inside the fold on desktop (verified 1440×900, 1280×720, 1024×768). Below 900px it stacks: centred monitor, then centred copy. The h1 keeps its `<br>` after "Plug in." (two lines at every width). Image fit is `contain`, never cropped.

The monitor is a muted, looping, `playsinline` H.264 `<video>` (`assets/hills-east-ident.mp4`, 560², 328 KB) with a WebP poster (`assets/hills-east-poster.webp`, 36 KB) and `preload="none"`. `script.js` owns playback: the loop is fetched only after `load` (or 1.5 s), only when motion is allowed, the tab is visible and the monitor intersects the viewport. Reduced-motion and no-JS visitors see the poster only. The old 1.6 MB animated WebP and 6.8 MB GIF are gone.

Caption row: `MONITOR · STUDIO IDENT` left, `Play/Pause ident` right, one line, flush with the bezel. The global motion toggle (`Pause motion / Resume motion / Reduced motion on`) sits on the 1U header beside the nav; the header is one row down to 1120px (below which the location legend is dropped, since the location repeats in the lede and footer).
Ident uses local animated WebP with GIF fallback. Pause replaces it with the existing poster, not a frozen animation frame. Offscreen/hidden document also swaps to the poster. Caption provides ident pause; the separate motion control governs all visual loops and scroll effects.
## Silver leveling amplifier

LA-2A-inspired, not a replica: cool brushed plate (`silver-hi → silver → silver-2 → silver-lo` tokens), `silver-ink` lettering, red italic Hills East upper-left wordmark, restrained Studio Leveling Amplifier title, central amber beveled VU, large black Gain left and Peak Reduction right. The double-rule base suggests a hardware seam. No decorative fake switches were added.

Desktop face grid is `1fr minmax(180px,280px) 1fr` (areas `gain meter peak`); knobs 94px. Mobile restacks to `meter meter / gain peak`: full-width VU on top, two 72px knobs below with their 44px −/+ pairs. Knob legends reserve a 2.6em two-line height so `Peak reduction` wrapping never misaligns the two columns. Readouts (`62%`, `110 ms`) use the body face at `.82rem` 500 with tabular numerals — Michroma's `%` glyph reads as `º/o`. One central VU keeps the recognizable composition; this is not stereo audio metering. SVG needle transform is owned by JS, not overridden in CSS.

## Black dynamics lab

Distressor-inspired black plate (`black-hi → black → black-2 → black-lo`, `screenprint` frame, `led-amber`/`led-off`, `readout-amber`), rounded 2px off-white screenprint border, top reduction LED scale 1/2/3/4/6/8/10/12, silver four-knob Input/Attack/Release/Output row, six ratio buttons (1:1 through 20:1), numerical readout, brief instructions. Silver knobs are 72px desktop, 62px mobile. Four-column desktop becomes an ordered 2×2 mobile grid; the ratio bank wraps. The optics and typography are retained without reproducing manufacturer branding.

All public processing names refer to the **meter demo only**. A normalized periodic pulse feeds a simple threshold/ratio display formula. Input scales its source; Ratio reduces the amount above 0.22; Output and Gain scale the remaining display level; Peak Reduction attenuates it. The reduction readout uses demo dB, not calibrated audio dB. Attack spans 10–410ms; Release 80–1280ms and controls exponential visual response. Static/reduced states still respond to settings, with settings text describing time values. Knob controls are vertical ARIA sliders with formatted values, visible readouts and −/+ alternatives. Wheel changes only focused knobs so ordinary wheel scrolling is not trapped.
The meter demo does not consume `hiddenrack:audio`; hidden audio is independently playable and its levels API remains available.
## Patch → booking

Two native selects always remain visible: service input and outcome output. Optional jacks accept input↔John and John↔output, by drag or two activations (tap/click/Enter/Space). Escape cancels an armed jack; pointercancel rolls back the cable preview. One connection per side. SVG cable curves draw behind socket labels.

No default route is silently chosen. A partial or full choice updates service copy, booking need when an input exists, the separate visible booking summary and hidden `session_route` value. Complete paths light the Signal jewel. Use this route always allows continuing, including partial/undecided paths, scrolls natively to booking and focuses Your name without a second scroll. Clear route removes the route and sets need to Not sure yet. Editing the booking need synchronizes its input route. None of these operations edits the user's message, name, email or project.

Booking remains champagne with native fields. A valid submit is intercepted and explicitly says Not sent because no endpoint is configured; text remains in memory. No fake success, queue or persistence. Original contact marketing copy is preserved with the existing disconnected-form warning.

## Motion and lifecycle
Local GSAP/ScrollTrigger 3.13.0 with original license headers. One paired assembly moment: silver unit settles from y32/scale .975 to its natural geometry; black settles from y22/scale .985. Both scrub native viewport scroll with ease none. Patchfield seats from y14, redrawing cables during its scroll transform. Three triggers, no pinning, snapping, scroller proxy or scroll hijack. All content starts visible; missing GSAP simply disables these enhancements. Context reversion restores natural geometry before pausing or preference changes. Fonts-ready and route/layout changes refresh measurements.
Pause all motion reverts scroll contexts, cancels meter rAF, pauses CSS animations, swaps ident poster and signals the hidden instrument's visual chase. Reduced-motion is honored on initial load and dynamically, disabling transitions/animations and native smooth-scroll as well. Reduced preference disables the main motion button rather than overriding the preference. The ident cannot be forced to animate while reduced preference is active.

Meter frames run only with either dynamics unit intersecting the viewport, document visible and motion allowed. Decorative room/footer ladders retain the last demo value, rather than keeping a loop alive solely for their lights. Hidden sequencer visual frames run only during transport, onscreen, document-visible and motion-enabled; its offscreen visual queue is discarded. Audio stays a separate explicit PLAY/STOP interaction; document hiding stops transport and releases notes. POWER closes audio, cancels timers/frames and removes listeners.

## Progressive behavior and accessibility

Original service/stage copy remains in HTML. Without JS every service and stage displays, hero and booking remain visible, and a noscript notice directs users to the booking fields. With JS the rotary stage selection and current service disclosure work as before. Touch-friendly visible alternatives accompany rotary controls and cables. Focus uses the existing amber outline, red on champagne. Tiny silkscreen is reserved for hardware labels; body explanations remain Archivo. Main nudge targets are 44px square after final QA.
## Verification and references
Canonical evidence: `.impeccable/review/revision-2-results.json` and matching 390/1440 hero, optical, dynamics, patch, booking and full-page screenshots. Both viewport suites passed all assertions. Node syntax checks passed. Two bounded rounds; no detector because the local Impeccable detector modules are known missing. PRODUCT.md was intentionally not repaired; its historical video/dummy-success wording does not describe this implementation.

Visual references (not shipped assets):
- https://help.uaudio.com/hc/article_attachments/20381267951252
- https://help.uaudio.com/hc/article_attachments/24802645501332

Outstanding: booking destination/contact details, human listening, real-device touch and cross-browser review, publication decision. No deployment occurred.

## Do's and Don'ts

### Do:
- **Do** use The Rack's continuous rails, unit minimum heights, ears, screws, and material-specific ink when extending the page.
- **Do** keep the four font roles distinct and preserve local self-hosted assets.
- **Do** retain native jack buttons, keyboard-accessible slider semantics, visible focus, and the click-to-click alternative to cable dragging.
- **Do** give each interactive control an observable consequence and distinguish simulated display data from actual audio.
- **Do** apply the final responsive cascade: mobile unit inset, VU sizing, and hidden-rack overrides are not what the first media block alone suggests.
- **Do** keep the hidden instrument undisclosed until the RESET gesture and stop audio/listeners when it closes.
- **Do** label the disconnected form honestly until a real booking destination exists.

### Don't:
- **Don't** restore the retired amp-head/tolex system, old aluminum palette, beat timings, sticky drawer navigation, rotary tabs, or knob-shaped booking CTA.
- **Don't** claim the CSS speed control changes animated-image playback, that simulated VU motion measures studio audio, or that reduced motion stops all animation.
- **Don't** mistake declared-but-unused variables, absent ventilation/toggle hardware, or brief aspirations for shipped components.
- **Don't** impose a red-only rule: green/amber meters, colored cables, champagne, and red form focus are established parts of this world.
- **Don't** add generic cards, pill actions, or a stock studio-photo background in place of the rack.
- **Don't** invent studio proof, contact details, backend delivery, or successful message queuing.
