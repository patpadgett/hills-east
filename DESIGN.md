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
    fontSize: ".66rem"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: ".14em"
  tape:
    fontFamily: "Caveat, Comic Sans MS, cursive"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1
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

# Design System: Hills East Recording

## Overview

**Creative North Star: "The Rack"**

The site is a single 19-inch equipment rack, not a studio brochure with gear ornaments. Content occupies bolted faceplates between continuous metal rails. Brushed black carries the reading and play controls; a champagne plate distinguishes booking. Upper-left reflections, top-edge highlights, recessed sockets, and grounded shadows describe assembled hardware. The studio ident lives inside a video-monitor bezel rather than behind the page.

The direction is established in `.impeccable/brief-rackmount.md`; this document records the actual implementation in `styles.css`, `index.html`, `script.js`, and `hidden-rack.js`. Later CSS declarations and selector specificity win over earlier rules. Product claims remain constrained by `PRODUCT.md`: no invented equipment, credits, rates, or contact details. Its older video/poster references do not describe the shipped monitor asset, which is an animated WebP with GIF fallback.

**Key Characteristics:**
- Continuous rack rails and individually bolted units, with rack-unit sizing as a minimum rather than a fixed content height.
- Four type voices: condensed equipment names, technical silkscreen, readable body text, and handwritten masking tape.
- Physical controls with visible state: rotary sliders, patch cables, jewel lamps, illuminated switches, and a hidden Web Audio instrument.
- A common red indicator family, with amber/green metering and colored cables—not a monochrome or red-only palette.

This is an as-shipped reference, not a certification that every intended behavior works. Implementation discrepancies are called out beside the affected component; they must not silently become promises.

## Colors

### Primary

**Jewel red** (`red`, `red-glow`) is the powered-control and action family. It appears in jewel lenses, illuminated switches, peak LEDs, selection, booking focus, and invalid-patch feedback. It is not restricted to lamps. The physical switch uses its own shaded red gradient rather than a flat token fill.

### Secondary

**Champagne** (`champ`, `champ-ink`) is the light metal and dark ink pairing for the booking plate. Champagne also picks out the brand and service/stage titles. `champ-2` is declared in the root but has no consumer in the shipped stylesheet; preserve it as a declared token, not an active second plate material.

### Tertiary

**Amber** marks keyboard focus, hot LEDs, armed jacks, encoder pointers, and the running sequencer step. **Green** marks normal LED levels. Patch-cable colors are literal routing colors: red (`#d33a30`), blue (`#3a7bd3`), yellow (`#e0b23a`), green (`#4fbf6a`), assigned by cable index modulo four. With one input and one output route, the shipped patch normally uses the first two.

### Neutral

- **Room** is the near-black background, with `radial-gradient(ellipse 70% 50% at 15% 0%, #1a1a1e 0%, transparent 60%)` behind the rack.
- **Plate / plate-2 / plate-hi** form the black faceplate's top bevel and body.
- **Silk / silk-2 / silk-3** are primary, reading-secondary, and subdued technical ink on dark material. General legends use the lighter literal `#c3c2bd` rather than `silk-3`.
- **Tape / tape-ink** apply only to handwritten labels; **field** is the booking input surface.
- `rail` and `rail-hi` are declared but not referenced by `var()` in the shipped CSS. The rail itself uses literal metal stops; do not mistake the declarations for its effective gradient.

**The Material Ink Rule.** Main text on black is light silk; main text on champagne is dark champagne ink. Booking labels use `#4a4331`, notes `#5a5240`, and field borders `#8a8069`.

### Runtime custom properties

| Variable | CSS initial value | Effective behavior |
|---|---|---|
| `--u` | Frontmatter `spacing.u` | Rack-unit size used in minimum heights, vertical padding, screw placement, and rail-hole rhythm. |
| `--gutter` | Frontmatter `spacing.gutter` | Shared horizontal inset. |
| `--lamp` | `.7` | Lamps knob writes `(0.15 + v / 100 * 0.85).toFixed(3)`; scales jewel opacity/glow, green ladder glow, and big-switch glow. |
| `--speed` | `1` | Speed knob writes `(0.4 + v / 100 * 1.6).toFixed(2)`; no CSS rule directly reads this variable. |
| `--crt-period` | Unset; consumer fallback `3.2s` | Speed knob writes `(3.2 / (0.4 + v / 100 * 1.6)).toFixed(2) + 's'` for the scan overlay. |
| `--a`, `--sweep` | Knob defaults `0deg`; sweep fallback `0deg` | JS paints pointer angle and 270-degree track fill. |
| `--accent-hue` | `4` | Declared only; there is no shipped hue control or consumer. |

Initialization matters: the main knob listeners are registered **after** their initial `set()` calls. The page therefore starts with the CSS lamp/speed defaults and the scan fallback, not the values those formulas would produce from the visible initial knob readings. The animated WebP/GIF playback speed is not changed by the Speed knob; the VU programme uses `state.speed` directly.

## Typography

All families are self-hosted with `font-display: swap`.

- **Display:** `--display`, Big Shoulders (`fonts/bigshoulders-var.woff2`, weight range 100–900), followed by Impact, Arial Narrow, sans-serif.
- **Silkscreen:** `--silkfont`, Michroma (`fonts/michroma-400.woff2`, 400), followed by Archivo, sans-serif.
- **Body:** `--body`, Archivo (`fonts/archivo-var.woff2`, 100–900; `fonts/archivo-400-italic.woff2`, 400 italic), followed by system-ui, sans-serif.
- **Tape:** `--tape`, Caveat (`fonts/caveat-8246.woff2`, 500–700), followed by Comic Sans MS, cursive. The shipped face is Caveat, not Caveat Brush.

### Hierarchy

Frontmatter defines the h1, h2, service/stage title, body, general legend, and tape roles. Display and equipment titles are uppercase; h1 has `.01em` tracking. Its emphasized word is solid `#e2d6b8`, nonitalic—not outlined.

- Brand: Big Shoulders 700, `1.05rem/1`, `.1em` tracking; ` .95rem` at ≤600px.
- Service/stage h3: title role, champagne ink on black.
- Pushbuttons: Michroma 400, `.62rem/1`, `.14em`, uppercase. Form labels: `.62rem/1.3`; spec terms: `.62rem/1.6`; stage labels: `.62rem/1`.
- Body stays `1.0625rem/1.55` on mobile. Lede is capped at `52ch`, room paragraphs `58ch`, service/stage paragraphs `62ch`.
- Patch hint and idle text: `.95rem`; booking facts `.95rem`; form note `.82rem`, max `40ch`; power copy `.85rem`.
- Tape labels are bold and tilted; jack tape is `.95rem`.
- Hidden-rack labels: Michroma `.62rem/1.3`, `.16em`. Readouts: declared Michroma 500, `.78rem/1`, tabular numerals (only the 400 Michroma face is supplied). Tempo: Michroma/monospace 700, `2rem/1`, `.1em`.

**The Control Voice Rule.** Use Michroma for mechanical legends, Big Shoulders for equipment identity, Archivo for explanations, and Caveat for the patchbay's handwritten labels. Do not import the retired site's font stacks or type limits.

## Layout

The rack is a centered grid capped at `1240px`, with `align-content: start`, `4px` gaps, and block padding `calc(var(--u)/3)`. Rails are absolute from top to bottom. Desktop rail width and unit side margins are `clamp(1.3rem, 2.6vw, 1.9rem)`.

A unit has block padding `calc(var(--u)*.28)` and inline padding `calc(var(--gutter) + 22px)`. Classes `u1`, `u2`, `u3`, `u4`, and `u6` set minimum heights to `calc(var(--u)*N - 4px)` (the 1U expression is `calc(var(--u) - 4px)`). Content may grow beyond the nominal hardware height.

Shipped order: 1U identity/navigation; 4U monitor/hero; 2U patchbay; 3U room; 2U session flow; 4U booking; 1U power conditioner; initially hidden 6U instrument. The header is not sticky.

### Internal composition

- Monitor: `minmax(240px, 38%) 1fr`, gap `clamp(1.5rem, 4vw, 3.5rem)`, block padding `calc(var(--u)*.45)`.
- Hero face: grid gap `1.2rem`. Meter/knob cluster: flex, end-aligned, gap `1.6rem`, padding `.9rem 1.1rem .7rem`. CTA row is separate.
- Patchbay: grid gap `1.2rem`, top padding `calc(var(--u)*.35)`. Head capped at `70ch`. Jackfield gap `2.6rem`, padding `2.4rem var(--gutter) 1.6rem`; rows `7rem repeat(3, 1fr) auto`, gap `1rem`.
- Room: `minmax(0, 1.2fr) minmax(240px, .8fr)`, gap `clamp(1.5rem, 4vw, 3rem)`. Room-tone ladder spans both columns.
- Service rows: `12rem minmax(0, 1fr)`; stage rows: `14rem minmax(0, 1fr)`; both gap `1rem`. Service area minimum `5.5rem`, stage area `6rem`.
- Booking: `minmax(240px, .8fr) minmax(0, 1.2fr)`, gap `clamp(1.5rem, 4vw, 3rem)`. Form: two equal columns, gap `.9rem 1.1rem`, wide fields spanning both.

### Responsive contracts — effective cascade

**≤900px:** monitor, room, booking, and patch head are single-column; header navigation retains the red Book link while hiding the other links, with no replacement menu. Monitor figure is capped at `260px`; monitor top padding becomes `calc(var(--u)*.3)`. Service/stage rows stack. Hero CTA is full-width. Hero cluster wraps with `1rem 1.2rem` gaps; meters take full width. Each VU becomes `width: calc(50% - .6rem); max-width: 150px`.

**≤600px:** rack inline padding is **0**, not the earlier `1.7rem`; gaps become `5px`. Units have `margin: 0 1rem`, inline padding **1.4rem**, and `min-width: 0`—not the earlier `.9rem` padding. Rails are `1rem`, ears narrow to `12px` with a 1px seam, screws move to 2px from the sides. Brand wraps with `.4rem .7rem` gaps. Hero cluster padding is `.7rem .8rem`; knob wrappers have `flex: 1 1 30%`; hero control gap `1rem 1.2rem`. Meter gap is `.8rem`, but the later ≤900px VU width rule overrides the earlier `120px` width. Form stacks. Jack rows become three equal columns with `1.4rem .6rem` gaps and `2.4rem` top padding; row tape spans all columns with `.2rem` bottom margin, room jack occupies column 2, signal lamp column 3. Jackfield gap becomes `1.2rem` and top padding `.6rem`; jack tape shrinks to `.85rem` above the sockets. Service/stage gap becomes `.5rem`. Power footer wraps; its copy moves last and takes full width.

**Hidden rack ≤720px:** the final hidden-rack responsive block follows the desktop layout overrides, so drum rows are effectively single-column and their level controls align to start. Steps use eight columns with `max-height: none`. Keyboard height is `100px` instead of `130px`; white keys fill its height and black keys stay at `58%`. The earlier fixed `120px` white-key and `60px` mobile black-key heights do not win the cascade.

## Elevation & Depth

Depth describes assembly: bevels raise plates, inset shadows recess fields and sockets, and rounded radial gradients describe knobs and lenses. The warm upper-left key is suggested through fixed highlights rather than a moving lighting system.

### Shadow vocabulary

- **Black unit:** `0 1px 0 #55585f inset, 0 2px 0 #2a2b30 inset, 0 -2px 0 #000 inset, 0 -3px 0 #26272c inset, 0 10px 24px -12px #000, 0 2px 0 #050506`.
- **Champagne unit:** `0 1px 0 #efe8d6 inset, 0 8px 22px -10px #000`.
- **Raised pushbutton:** `0 2px 0 #0a0a0b, 0 0 0 1px #3f4147 inset`.
- **Knob body:** `filter: drop-shadow(0 4px 3px #000c)`; each cap adds its own edge shading.
- **Field recess:** `inset 0 2px 3px #0002`.
- **Cable weight:** `filter: drop-shadow(0 3px 2px #0009)`.
- **Jewel:** black/metal rings plus `0 0 calc(14px * var(--lamp)) calc(2px * var(--lamp)) var(--red-glow)`.

Black plate grain is a `115deg` white reflection at `.05` alpha fading by 35%, plus a repeating 90-degree white hairline at `.012` alpha (1px line in a 3px period). Champagne substitutes `.18` alpha reflection and `.02` alpha black grain. These overlays are pointer-transparent.

**The Bolted Surface Rule.** New content belongs on the rack's physical plates. Do not replace them with floating cards or a generic image-led hero.

## Shapes

Small machined corners, round sockets, and torn tape define the silhouette. Unit base radius is `2px`; its ear and grain overlays use `3px` and `4px`. Controls/fields/spec use `3px`; jackfield, VU glass, hero cluster, and big switch use `4px`; monitor glass/image uses `6px` inside a `10px` bezel. Knobs, jacks, screws, jewels, and LED dots are circles. Ladder elements are short rectangles with `1px` rounding.

Tape has `clip-path: polygon(1% 8%, 99% 0, 100% 92%, 2% 100%)`. Chicken-head pointers use `polygon(50% 0, 100% 100%, 0 100%)`; do not substitute a generic rotary icon.

## Components

### Rail, unit, ears, screws

The rail gradient is `linear-gradient(90deg, #5a5d65, #3a3c42 30%, #2b2c31 70%, #1a1b1e)`, with left border `#6a6d75`, right border `#0d0d0f`, and `4px 0 10px -4px #000` shadow. Its centered 9px perforation strip repeats every `calc(var(--u)/3)` using a dark 8px hole and 1px highlight. This is the shipped repeating hole treatment, not an alternating real-world EIA-hole pattern.

Black units grade from `plate-hi` at the top to `plate-2` at 2px, `plate` at 10px through `calc(100% - 4px)`, then `#0b0b0d`. Ears are **22px** strips (despite the earlier comment saying 14px), with 1px black seams, `mix-blend-mode: lighten`, opacity `.95`. Use the mobile ear override described in Layout.

Screws are 10px circles: `radial-gradient(circle at 35% 30%, #8b8e96, #3a3c42 60%, #16171a)`, ring shadows `0 0 0 2px #0a0a0b, 0 1px 0 3px #2c2d31`. Two perpendicular dark slots both rotate `35deg`. Vertical offsets are `calc(var(--u)/6 - 5px)`; desktop horizontal offsets 6px. Header/footer have two top screws; larger main units have four. Hidden module markup currently adds no screws, despite the skin's `.hidden-rack .screw { display: block; }` rule.

### Jewel lamp and LED ladder

Jewel size comes from frontmatter, with a 9px small variant. Lit lens: `radial-gradient(circle at 40% 35%, #ff9a94, var(--red) 45%, #5a0d0a 100%)`. Opacity is `calc(.35 + var(--lamp) * .65)`; opacity and shadow transition `.3s`. Without `.jewel--on`, use `#6a2a27 → #3a0f0d` glass, plain bezel rings, and opacity `.8`.

Each ladder is generated with twelve `7px × 12px` elements, 4px gaps. Off fill is `#1f2a22`. `.on` is green, indices 8–10 are amber `.hot`, index 11 red `.peak`. Green glow follows `--lamp`; amber/red glow stays at 6px. Both room-tone and power ladders use the same programme signal, not real electrical measurements.

### Pushbutton and big illuminated switch

Pushbuttons are compact uppercase silkscreen links and buttons with `linear-gradient(180deg, #34363c, #202227)`. Hover turns text white; active translates 2px down and removes the raised shadow. Travel/shadow transition is `.08s`. Red navigation variant uses `#ff8c85` text and inset `#8a2a25` border. Navigation has four links: Room, Sessions, How it works, Book.

The big switch is a two-column inline grid, gap `.3rem .9rem`, with `linear-gradient(180deg, #c33a31, #8a221c 60%, #6a1712)`. Raised shadow: `0 4px 0 #3b0b09, 0 0 0 1px #d85b53 inset, 0 0 calc(24px * var(--lamp)) var(--red-glow)`. Main label is Big Shoulders 700, `1.05rem/1`, `.06em`; sublabel is Michroma `.6rem/1`, `.12em`, opacity `.85`. The 12px white/red lamp spans both rows. Active state translates 3px and reduces the base shadow to 1px. No dedicated hover animation is defined. Hero variant uses padding `1.15rem 1.7rem 1.1rem 1.3rem` and `1.25rem` main label. Hero action links to booking; form action is a native submit button.

Global keyboard focus is `2px solid var(--amber)` with 3px offset; booking switches use red outline color. The skip-to-booking link becomes visible on focus. Inputs and textareas use `caret-color: var(--red)`; the page uses `scrollbar-color: #3a3c42 var(--room)`. Links declare `.2em` underline offset and `1px` decoration thickness; button/brand links retain their explicit `text-decoration: none`.

### Knobs: skirt, chicken-head, soft-touch

Main knobs are frontmatter-sized circles, `cursor: ns-resize`, `touch-action: none`, `user-select: none`. An outer masked conic arc starts at 225 degrees and fills up to 270 degrees using `silk-3`, with unfilled `#2a2b2f`. Cap rotation is `var(--a)` with `.05s linear` transition.

- **Skirt:** cap gradient `#6d7079 → #2a2b30 55% → #14151a`; 6px-inset aluminum/champagne center (`#cfc7b4 → #8f876f 70%`); dark pointer at top 8px, height 30%. Input gain uses this style.
- **Chicken-head:** cap gradient `#3b3c41 → #121215 70%`; triangular 12px-wide pointer begins at top −6px and reaches 58% height, with a 2px silk stripe. Lamps and stage selector use it.
- **Soft-touch:** cap gradient `#2c2d32 → #0f0f12 75%`, inset 2px dark ring; amber pointer and 6px amber glow. Speed uses it.
- **Big:** 92px circle for the stage selector. Knob focus outline offset is 12px.

**Interaction contract:** focusable `role="slider"`, accessible label, min/max/current values. Gain/Lamps/Speed ranges are 0–100, initially 62/70/50. Drag upward increases value over a full 160px travel; wheel changes by `max / 25`, arrows by `max / 20`; Up/Right increase, Down/Left decrease. Home/End select extremes. Nonstepped double-click toggles between midpoint and zero according to the rounded current ARIA value. Pointer angle is `-135 + (v / max) * 270` degrees. JS rounds `aria-valuenow` while keeping continuous internal state. These main sliders do not declare `aria-orientation`; hidden sliders do.

### Monitor and VU meters

Monitor image uses `width: 100%; height: auto; aspect-ratio: 1`, `object-fit: cover`, `filter: contrast(1.05)`, and HTML dimensions 480 × 480. The source is `assets/hills-east-ident.webp`, falling back to `assets/hills-east-ident.gif`. The bezel has 16px padding, nested inset shading, and a reflection/scan overlay inset 14px. Scan animation advances the second background position by 6px over `var(--crt-period, 3.2s)`, linear, infinite.

The `.crt-cap` caption is a center-aligned, space-between flex row with `.8rem` gap. Its native `#ident-toggle.pushbtn--sm` button uses `.35rem .6rem` padding and `.56rem` type. `setIdent(playing)` owns the picture state: playing restores/creates the WebP source and GIF image fallback; paused removes the source and switches the image to `assets/hills-east-poster.jpg`. `aria-pressed` reflects playing, and the label is Pause while playing / Play while paused. Reduced-motion initialization calls `setIdent(false)`. This swaps assets rather than freezing the animated image at its current frame; the button does not pause the separate CSS scan or VU programme.

Each VU is 150px wide before responsive overrides, with `.3rem` label gap. SVG `viewBox="0 0 200 110"` uses cream gradient `#f2ead2 → #d9cfae`, a black/metal frame, reflection overlay, arc `M20 95 A85 85 0 0 1 180 95`, red zone `M150 45 A85 85 0 0 1 180 95`, eleven generated ticks from −80 to +80 degrees in 16-degree intervals, and a 6px hub at (100,100). Needle line runs (100,100) to (100,20), stroke `#111`, width 2. Decorative meters are `aria-hidden`.

**Ballistics:** rAF caps elapsed time at `.05s`. Attack coefficient is `1 - exp(-dt / .06)` and release `1 - exp(-dt / .3)`. Programme is gain-scaled slow sine motion plus a speed-controlled beat, with no random term; it is not measured studio audio or ident-synchronized audio. Targets are `g * (.38 + .25*sin(t/900) + .45*beat)` left and `g * (.36 + .25*sin(t/1130 + 1) + .45*beat)` right, where `g = state.gain / 100`. Beat is `pow(max(0, sin(t/1000 * PI * state.speed/50 * 1.4)), 6)`. Needle angle is `-40 + level * 80`, with SVG rotation around (100,100); ladder lit count is the rounded mean level times twelve.

**Transform ownership:** `.vu-needle` CSS declares only stroke and stroke width—no CSS transform or transform origin. The JS-written SVG `transform` attribute is authoritative, rotating the needle around (100,100); the former CSS precedence conflict is removed. The LED ladder follows the same programme.

### Patchbay jacks, cables, tape

Jackfield is a recessed `#0f0f11 → #0a0a0c` well. Native button jacks use concentric radial stops: black center through 28%, then `#2a2b2f` at 30%, `#55585f` 48%, `#2e3035` 52%, `#8d9099` 55%, `#3a3c42` 62%, transparent 64%. Room jack is 56px. Armed state adds a 2px amber ring and 12px glow. Patched state adds a plug cap inset 7px, with dark metal radial shading and rings at z-index 3.

Tape uses padding `.12em .5em .05em`, −1.5-degree rotation, and `0 1px 1px #0008` shadow. Row tape has minimum width `6.5rem`. Input/output jack labels are absolutely positioned 8px above the socket, horizontally centered with −2-degree rotation and nowrap text. The later `.jackrow--room .tape--jack` rule changes the room label to `position: relative` while retaining its offsets and transform.

SVG cables cover the well at z-index 1 without pointer events. Jacks, jack tape, direct row tape, and the room/signal hardware use z-index 3 above cables; direct row tape and the room/signal selectors explicitly establish relative positioning. Jacks use `touch-action: none`. Paths have 7px round-capped strokes; preview is 4px, `silk-3`, dash `6 6`. Curves run from socket centers with both control points lowered by `46 + distance * .22` pixels. Resize redraws them; dragging redraws immediately, with no spring or tween.

**Interaction contract:** drag from jack to jack, or activate one then another by click/Enter/Space. Non-primary mouse presses are ignored. `pointercancel` uses the same handler as pointerup to remove the preview and window move/up listeners; it is not a separate rollback path and may still connect a target after a drag. Its once-only cancel listener is not explicitly removed on ordinary pointerup. Movement beyond 6px marks a drag; a second activation of the same armed jack disarms it. Only input↔room and room↔output connections are valid. Invalid target flashes red for 400ms. There is one input route and one output route; connecting another on the same side replaces it. Input connection reveals its corresponding service in a polite live region; the jewel lights only when both input and output exist. Tracking→room is preset on load, so Tracking starts visible and Signal starts unlit. Do not describe the default as an empty patchbay or require a complete route before service copy appears.

### Rotary selector and spec table

Session flow is a three-position big chicken-head slider, range 0–2, with `aria-valuetext` Talk / Track / Finish and `data-steps="3"`. Full drag travel is 120px, display/listener values round during drag, and release snaps state to an integer. Wheel/arrows move one stage; Home/End select first/last. Only `.stage.is-on` displays; stage changes are immediate, not animated. Visible stage labels are an `aria-hidden` list, not clickable tabs; there is no autoplay.

The room spec is a semantic `<dl>` in a `#0f0f11` well, `1px solid #2a2b2f`, 3px corners. Rows are `7rem 1fr`, padding `.7rem 1rem`, with `#1e1f23` dividers except after the last row. Terms are subdued technical legends; values use silk, Archivo weight 500. Its content is studio, engineer, location, and contact relationship—not a gear inventory.

### Champagne booking plate and form

Booking overrides the unit gradient with `linear-gradient(180deg, #ddd4bd 0, var(--champ) 3px, var(--champ) calc(100% - 3px), #8e8570 100%)`. It retains the common ears, with its lighter grain overlay and champagne screw-ring colors (`#7d7460`, `#b5ab93`). Main copy and heading are champagne ink. Small red jewels accompany the facts.

Fields use frontmatter fill/ink/padding/radius, `1px solid #8a8069`, Archivo `1rem/1.4`, and inset shading. Focus removes the field outline, changes the border to red, and adds `0 0 0 3px rgba(232,50,42,.25)`. Textarea resizes vertically. The form has name/email/project inputs, a native need select, and a required message textarea; name and email are also required. Labels remain explicit above fields.

**Shipped submission state:** the form is not connected. JS prevents submission and calls `reportValidity()` despite HTML `novalidate`. After valid submission, the note reads “Not sent — this form isn’t connected yet. Your text is still here; John’s direct contact details will replace this note once he supplies them.” JS sets `role="status"` on the note and both native `disabled = true` and `aria-disabled="true"` on the submit switch. Entered text remains in the fields; nothing is sent, queued, or persisted, and there is no backend or success state. No custom invalid-field or disabled visual recipe is defined. The surrounding “goes straight to John” copy remains aspirational, not evidence of delivery.

### Power conditioner and RESET

Footer is a 1U flex faceplate: power legend and shared ladder left, copyright copy center, recessed RESET and Top pushbutton right. RESET has transparent button chrome, padding `.2rem .4rem`, and a 10px radial dark plunger with 3px black/4px metal rings. Active plunger travel is 1px; each activation also triggers a 120ms button animation.

**Secret contract:** three click/keyboard activations within a rolling interval strictly less than 2000ms reveal the extra rack. Existing timestamps older than that are discarded; reaching three clears the timestamp list. Repeated triples do not remount an already open rack. RESET is the only visible-page hint; it does not reset main knobs or patch cables.

### Hidden rack (`.hr-*`) skin and behavior

The hidden 6U container uses a `#2a2b30 → #1a1b1f → #0b0b0d` plate with padding `1rem var(--gutter) 1.4rem`; ≤600px `.unit` overrides its inline padding to `1.4rem`. `[hidden]` forces `display: none !important`. Reveal applies `slidein .6s cubic-bezier(.2,.8,.2,1) both`, from opacity 0 and `translateY(24px)`, followed by scroll into view.

- Shell grid gap 1rem; inner units gap `.9rem`, padding `1rem 0`, top divider `#2a2b2f` except the first; faceplates gap `.9rem`. These are internal sections, not independently styled outer `.unit` plates.
- Header and transport flex/wrap with 1rem gaps. Effective drum header legend is Big Shoulders 800, `1.5rem/1`, `.04em`, champagne, via `!important` overrides—not the earlier 1.6rem rule. Synth heading is outside `.hr-unit-header` and stays Michroma `.62rem/1.3`, `.16em`, silk-secondary. Do not document both headings as matching.
- Hidden knob is 46px, with effective gradient `radial-gradient(circle at 40% 35%, #46484f, #15161a 70%)` and shadow `0 4px 5px #000b, inset 0 1px 0 #61646c, inset 0 -2px 3px #000`. A masked `#3a3c42` 270-degree arc sits 8px outside; cap has a 3px amber pointer and 5px glow. Controls have minimum width 76px and `.35rem` label/readout gaps.
- Hidden knobs use vertical `role="slider"`, numeric and formatted ARIA values, drag capture with cancel/lost-capture cleanup, 160px full travel, wheel normalized step `.02`, and Home/End. Arrows use `.01` normalized steps or integer ±1; Shift uses `.1` or integer ±10. Cutoff/envelope controls can be logarithmic. They are not governed by the main knob step sizes.
- Tempo readout is orange `#ff5a3c` on `#1a0705`, padding `.3rem .7rem`, radius 3px, minimum width 5ch, right-aligned; shadow `inset 0 0 0 2px #000, 0 0 12px #ff5a3c33`.
- Desktop drum rows are effectively `5.5rem minmax(0, 1fr) 96px` (single-column at ≤720px), gap `.8rem`; sixteen steps per row in a 4px-gap grid. Step buttons have aspect ratio 1, **min-width 0**, max-height 40px, 3px corners, dark pushbutton shading. Active steps use `#c33a31 → #8a221c`; running `.cur` outline is 2px amber, offset 1px. Every fourth-group start (`4n+1`) has an additional inset lower marker; that later shadow also overrides the active-step shadow on those buttons.
- `.hr-switch`, `.hr-btn`, `.hr-power` share compact silkscreen button shape/padding. `[aria-pressed="true"]` switches/buttons turn red and white; POWER uses `#b7332c → #7e1d18`. LED dots are 8px, red when on; the drum-header RUN lamp is 12px with `margin-left: auto` and `.5rem` right margin. Its old `::after` label is disabled with `content: none`; a sibling `.hr-run` span supplies RUN in Michroma `.6rem`, `.12em` tracking, `silk-3`, and `1rem` right margin.
- Synth controls wrap with `1.2rem 1.6rem` gaps. Oscillator groups use `.6rem .8rem` padding, 1px `#2c2e33` border, 4px corners. Keyboard is a positioned 15-column grid (`repeat(15, 1fr)`) with 2px gaps, 130px height (100px at ≤720px), padding `0 2px`, black recessed background, 4px corners, and overflow hidden. White keys use `height: 100%; width: auto; flex: none; margin: 0`, `#f4f1e8 → #d9d4c6`, 1px dark borders, and bottom corners 4px. Black keys are absolutely positioned at `top: 0; left: var(--key-left)`, height `58%`, width `calc(100% / 15 * .62)`, margin 0, z-index 2, bottom corners 3px, and `#2a2b30 → #0d0d10`. JS writes `--key-left` as `((whiteIndex - (black ? 0.32 : 0)) / 15 * 100) + '%'` and advances `whiteIndex` only for white keys. The earlier flex layout, negative margins, and fixed key heights are superseded. Held keys turn amber; black held keys use `#c78a2a`. Effective labels are `.6rem`, `#6a6660` on white and `#b5b0a6` on black.

Module provides four 16-step drum rows (kick/snare/hat/clap), BPM 60–200 initially 120, swing, master volume, per-row levels, PLAY/STOP, SEQ, and a two-oscillator monosynth with waveform switches, detune, cutoff/resonance/envelope/glide controls and C3–C5 keyboard. Audio context is created only on PLAY or a note interaction. SEQ enables a kick-triggered C-minor-pentatonic arpeggio; it is a transport switch, not an individual per-step option. Step and key states expose `aria-pressed`.

Keys support pointer glissando, focused Enter/Space, and the printed computer-key mappings. Editable fields are excluded from global note shortcuts. Blur releases notes; document hiding releases notes and stops transport. POWER calls `HiddenRack.unmount()`, stopping sources/timers/rAF, closing the audio context, removing listeners and children. The host MutationObserver hides the emptied section; the callback passed by the host is not consumed by `mount(container)`.

### Motion and reduced-motion contract

Mechanical motion is local, not tied to a global beat token: pushbutton `.08s`, knob `.05s linear`, jewel `.3s`, scan variable-period linear, hidden reveal `.6s` with its specified easing, invalid patch 400ms, RESET 120ms. Cable preview follows pointer coordinates directly. Stages and route copy switch display immediately. Main VU programme and hidden sequencer chase each use rAF; the latter follows scheduled Web Audio events.

Under `prefers-reduced-motion: reduce`, CSS disables smooth scrolling, hidden reveal animation, main knob-cap transition, and scan animation. Hidden reveal explicitly scrolls with `instant` instead of `smooth`. On initial reduced-motion load JS does not start the main meter rAF loop: `paintStatic()` sets both SVG needle angles to `-40 + g * 60` and lights `Math.round(g * 11)` ladder cells, with `g = state.gain / 100`. It also registers `paintStatic` on gain input so meters remain responsive without continuous animation, and pauses the ident on its poster. There is no media-query change listener: a loop started under normal motion checks the live preference and skips visual updates while reduced motion matches, but a reduced-motion initial load does not later start that loop automatically; ident state is not automatically resynchronized on preference changes.

Reduced-motion is **partial**: the ident starts paused but can be explicitly played; jewel/pushbutton transitions remain, invalid-patch and RESET Web Animations remain, and hidden sequencer chase remains. There is no global animation shutdown or reduced-motion audio mute. Preserve the implemented exceptions honestly rather than borrowing the retired site's motion guarantees.

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
