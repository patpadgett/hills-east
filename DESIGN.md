# Hills East Recording — revised rack

## Direction and invariants

Preserve the 19-inch rack: continuous perforated rails, bolted ears, black brushed metal, champagne booking plate, red jewels, and the original content. Add recognizable hardware-inspired visual studies without suggesting studio ownership or endorsement. No actual compressor emulation is present.

Fonts remain local Big Shoulders (equipment/headlines), Michroma (silkscreen), Archivo (body), Caveat (patch tape). Existing root tokens remain: room `#08080a`, plate `#16171a`, plate-2 `#1d1e22`, silk `#e9e7e0`, secondary silk `#a9a8a3`, champagne `#c9bfa6`, dark champagne ink `#17130c`, red `#e8322a`, amber `#ffb43c`, green `#62e07a`. Upper-left sheen, inset wells, metal knob caps and shadows describe hardware. Rack width remains capped at 1240px; unit classes are minimum heights, not rigid real-world U dimensions.

## Composition

Order: header; centered monitor/hero; silver leveling amplifier; black dynamics lab; session patchbay; room; stage selector; champagne booking; power conditioner; hidden instrument.

The hero is single-column. `.monitor .crt` is `min(100%,680px)` with a square uncropped image and desktop 16px bezel. At 1440px the image is 648px wide and exactly centered; at 390px, mobile 10px bezel yields 298px. Image fit is `contain`, never cropped. Centered hero copy is capped at 660px; h1 is `clamp(2.5rem,4.2vw,3.6rem)`, line-height 1, with its old forced linebreak hidden. This deliberately prioritizes the large ident over fitting all copy above the fold.

Ident uses local animated WebP with GIF fallback. Pause replaces it with the existing poster, not a frozen animation frame. Offscreen/hidden document also swaps to the poster. Caption provides ident pause; the separate motion control governs all visual loops and scroll effects.

## Silver leveling amplifier

LA-2A-inspired, not a replica: cool brushed plate `#c9cbc7`/`#b9bcb9`, dark ink, red italic Hills East upper-left wordmark, restrained Studio Leveling Amplifier title, central amber beveled VU, large black Gain left and Peak Reduction right. The double-rule base suggests a hardware seam. No decorative fake switches were added.

Desktop face grid is `1fr minmax(180px,280px) 1fr`; knobs 94px. Mobile retains left/meter/right arrangement using `1fr minmax(106px,1.25fr) 1fr`, 56px knobs and 5px meter bevel. Mobile −/+ controls stack under each knob with 44px targets. One central VU keeps the recognizable composition; this is not stereo audio metering. SVG needle transform is owned by JS, not overridden in CSS.

## Black dynamics lab

Distressor-inspired black plate, rounded 2px off-white screenprint border, top reduction LED scale 1/2/3/4/6/8/10/12, silver four-knob Input/Attack/Release/Output row, six ratio buttons (1:1 through 20:1), numerical readout, brief instructions. Silver knobs are 72px desktop, 62px mobile. Four-column desktop becomes an ordered 2×2 mobile grid; the ratio bank wraps. The optics and typography are retained without reproducing manufacturer branding.

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
