# Hills East Recording — rackmount edition

The whole site is a 19" equipment rack. Every section is a rack unit (1U–6U) bolted between
two rails; the content lives on faceplates and every control does something. Flat HTML/CSS/JS,
self-hosted fonts, no build step, no external calls.

Sibling of ~/hills-east-recording/ (the tube-amp faceplate version); same content and PRODUCT.md.

## Files

    index.html        the rack (1U ID · 4U monitor/hero · 2U patchbay · 3U room · 2U selector · 4U booking · 1U power · hidden 6U)
    styles.css        the whole visual system; skin for the hidden rack (.hr-*)
    script.js         knobs, VU ballistics, LED ladders, patchbay cables, rotary selector, form, RESET easter egg
    hidden-rack.js    self-contained Web Audio module: 16-step drum machine + monosynth (window.HiddenRack.mount/unmount)
    DESIGN.md         visual system, written from the shipped code
    capture.js        Playwright QA (cwd /data/pat, NODE_PATH=/data/pat/node_modules)
    PRODUCT.md        product truth (copied from the sibling; the ident is now an animated WebP, not the mp4)
    assets/           ident WebP + GIF fallback, favicon, poster
    fonts/            Big Shoulders, Michroma, Archivo, Caveat (tape labels)

## What is interactive

- Knobs (INPUT, LAMPS, SPEED, and the 3-position session selector): drag vertically, scroll wheel, or
  arrow keys / Home / End; role=slider with live aria-valuenow. INPUT drives the two needle VU meters
  (attack/release ballistics in requestAnimationFrame) and the LED ladders; LAMPS dims every jewel and
  glow on the page (--lamp); SPEED changes the monitor's scanline period and the meters' programme pulse;
  the selector switches the How-it-works stage.
- Patchbay: drag a cable from an input jack to the room, then room to an output (SVG bezier cables,
  four colours). Click-to-click and keyboard (Enter on one jack, Enter on another) do the same.
  Routing an input shows that service; completing input→room→output lights the Signal lamp.
- Booking: real POST-ready form on the champagne plate; the Send button is an illuminated switch.
- Easter egg: the RESET button on the 1U power conditioner (bottom). Press it three times within
  two seconds and a 6U hidden rack slides in: a 4×16 step drum machine (kick/snare/hat/clap, BPM knob
  60–200 with 7-segment readout, swing, per-row level, master, SEQ toggle that arpeggiates the synth
  from kick steps) and a 2-osc monosynth (waveforms, detune, cutoff/resonance, A/D/R, glide) with a
  2-octave keyboard playable by pointer or computer keys. Real Web Audio, created on first gesture.
  POWER on the unit unmounts it. Nothing on the page hints at it.

## Design decisions

- Palette: brushed-black plates, champagne booking plate, screen-print silk white, one red jewel
  family (lamps, Book switch), amber for focus/knob pointers, green LED ladders. Warm key light from
  upper-left as a top-edge highlight on every plate.
- Type: Big Shoulders for unit names, Michroma for silkscreen legends, Archivo body, Caveat for the
  handwritten masking-tape labels on the patchbay.
- Rails carry three holes per U; unit heights snap to U multiples; rack ears carry the screws.
- No decorative gear: if it looks like a control, it is one.

## QA performed

- Playwright Chromium 1440×900 / 390×844 / 320: no horizontal overflow, one h1, alt on all images,
  zero console errors. Interactions exercised headlessly: knob keys change aria-valuenow, click-to-click
  patch lights the lamp, selector switches stage, RESET×3 mounts the hidden rack (64 steps, 25 keys,
  14 knobs, BPM 120, POWER present). Audio itself not testable headless — try it in a browser.
- Two in-thread inspection rounds with batched fixes; then Impeccable finish review + verdict by fresh
  gpt-6-astra subagents (disposition recorded in the session).

## Before this goes live

- John's phone/email/booking link (PRODUCT.md placeholders) and the form endpoint.
- Listen to the hidden rack on real speakers and tune levels; the kick is deliberately heavy.
- Decide which edition ships: this one or ~/hills-east-recording/.
