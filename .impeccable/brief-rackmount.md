# Surface brief — Hills East Recording, rackmount edition (single page)

Scope: Persuade. Visitor understands this is a real one-engineer studio in Lenexa and sends John an inquiry.

## Direction contract

THESIS: The whole page is a 19" equipment rack. Every section is a rack unit (1U–4U) bolted in with rack ears and screws; the content lives on faceplates. Refuses the "dark studio brochure" default: no hero image + three cards, and no decorative gear that does nothing — every knob, meter, switch and patch point does something.

OWN-WORLD (pinned by Patrick): a rack full of gear. Brushed-black and champagne-silver faceplates, screen-printed legends, a mix of knob styles (chicken-head, skirted aluminum, rubber Moog-style, soft-touch encoder), needle VU meters with real ballistics, LED ladders, jewel lamps, toggle and rocker switches, a patchbay with handwritten masking-tape labels (Caveat Brush-style hand face), rack rails with alternating hole pattern, ventilation slots, a power conditioner. Fonts: Big Shoulders (unit names), Michroma (screen-print legends), Archivo (body), plus a handwriting face for tape labels. Lighting: one warm key from upper left, faceplates catch a soft top-edge highlight; dark room behind the rack.

STORY: Visitor lands on the rack. The top unit is the ident (animated WebP) in a video-monitor unit; the hero copy is silkscreened on a 2U faceplate whose VU meters twitch with the ident. They twist knobs (they turn, and the meters respond), flip the Tracking/Mixing/Finishing selector, drag patch cables between jacks on the patchbay to route "input → room → output" (which reveals the three service descriptions), and reach the booking unit — a form on a faceplate whose Send button is a big illuminated momentary switch.

INTERACTIONS (all keyboard-accessible, mobile-touch-safe, reduced-motion aware):
- Knobs: pointer drag (vertical) or wheel or arrow keys; role=slider with aria-valuenow. Each knob drives something visible (a meter, a lamp brightness, the ident's speed via CSS var, the page's accent hue).
- Toggle/rocker switches: click/Space; visible state; drive real content (services selector, units/rails theme).
- Patchbay: drag-and-drop cables (pointer events + keyboard alternative: focus a jack, press Enter, focus target, Enter). Correct routing lights a lamp and reveals content; cables render as SVG beziers.
- VU meters: needle with attack/release ballistics driven by requestAnimationFrame; source is the knob/section state, not fake random.

EASTER EGG: the power conditioner unit at the bottom of the rack has a small recessed RESET button. Pressing it three times within 2 s (click or keyboard) slides in an extra 6U "hidden rack": a 16-step drum machine (kick/snare/hat/clap rows, step buttons with LEDs, running chase, BPM knob with 7-segment digital display 60–200, play/stop, swing) and an analog-style monosynth (2 oscillators with waveform switches, filter cutoff/resonance/envelope knobs, small 2-octave keyboard playable by mouse/touch and the computer keyboard, drum machine can trigger a synth arpeggio when a step's "SEQ" is enabled). Real Web Audio API sound; muted until the visitor interacts (autoplay policy); a master volume knob; a POWER switch to close it. Nothing on the visible page hints at it except that the reset button exists.

FIRST VIEWPORT: The top of the rack, edge to edge: rack rails left/right with screw holes; unit 1 (1U) a power/ID strip: "HILLS EAST RECORDING · LENEXA, KANSAS", a jewel power lamp, nav as five labeled push-buttons; unit 2 (4U) the monitor unit: the ident WebP in a bezel on the left ~40%, on the right the silkscreened h1 "Plug in. Sound like you." with two needle VU meters (L/R) and an INPUT gain knob that drives them, and the primary CTA as an illuminated square switch "BOOK A SESSION"; unit 3 begins (the patchbay) so the visitor sees the rack continues.

FORM: pinned world (Patrick's brief), no roll. Craft raise: interactions must be real (state → visible consequence), never decorative.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.
