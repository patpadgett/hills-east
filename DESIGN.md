---
name: Hills East Recording
description: A tube-amp head you can play — black tolex cabinet, brushed-aluminum faceplates, one red jewel lamp.
colors:
  tolex: "#0c0c0d"
  tolex-2: "#151517"
  tolex-ink: "#f3f2ee"
  tolex-ink-2: "#bdbcb7"
  alu: "#cfd2d5"
  alu-hi: "#e6e8ea"
  alu-lo: "#a9adb2"
  alu-shadow: "#6d7177"
  silk: "#14151a"
  silk-2: "#33363d"
  jewel: "#e5261b"
  jewel-glow: "rgba(229, 38, 27, .75)"
  jewel-off: "#3a0f0d"
typography:
  display:
    fontFamily: "Big Shoulders, Archivo Narrow, Impact, sans-serif"
    fontSize: "clamp(3rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 0.92
    letterSpacing: "-0.005em"
  headline:
    fontFamily: "Big Shoulders, Archivo Narrow, Impact, sans-serif"
    fontSize: "clamp(2.4rem, 4vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 0.9
  title:
    fontFamily: "Michroma, Eurostile, Bank Gothic, sans-serif"
    fontSize: "clamp(.85rem, 1.2vw, 1rem)"
    fontWeight: 400
    letterSpacing: "0.28em"
  body:
    fontFamily: "Archivo, Helvetica Neue, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "Michroma, Eurostile, Bank Gothic, sans-serif"
    fontSize: "0.62rem"
    fontWeight: 400
    letterSpacing: "0.2em"
rounded:
  none: "0"
  hairline: "3px"
  plate: "4px"
  panel: "6px"
  window: "10px"
  bezel: "18px"
  pill: "999px"
spacing:
  gutter: "clamp(1.25rem, 4vw, 4rem)"
  cab-block: "clamp(5rem, 10vw, 9rem)"
  panel-block: "clamp(2.5rem, 5vw, 4rem)"
  panel-inline: "clamp(1.5rem, 5vw, 4.5rem)"
  max: "1280px"
components:
  knob-btn:
    textColor: "{colors.silk}"
    rounded: "{rounded.pill}"
    padding: ".4rem .5rem .4rem .4rem"
  etched-link:
    textColor: "{colors.silk}"
    typography: "{typography.label}"
    rounded: "{rounded.none}"
  rotary-tab:
    backgroundColor: "#101113"
    textColor: "{colors.tolex-ink-2}"
    padding: "1rem 1.4rem"
  rotary-tab-selected:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.silk}"
  field-input:
    backgroundColor: "{colors.tolex}"
    textColor: "{colors.tolex-ink}"
    rounded: "{rounded.hairline}"
    padding: ".9rem 1rem"
  panel:
    backgroundColor: "{colors.alu}"
    textColor: "{colors.silk}"
    rounded: "{rounded.panel}"
  plate:
    backgroundColor: "{colors.tolex-2}"
    textColor: "{colors.tolex-ink}"
    rounded: "{rounded.plate}"
    padding: ".5rem 1.5rem"
---

# Design System: Hills East Recording

## Overview

**Creative North Star: "The Amp Head"**

The whole page is one piece of gear. The body is a black tolex cabinet (pebble-grain vinyl, rendered with SVG turbulence + dot gradients). Bolted onto it are brushed-aluminum faceplates with four Phillips screws in the corners; that's where the controls live (hero, services, booking form). Between plates, the cabinet shows through and carries long-form copy on a riveted spec plate. The footer is the backplate: a screen vent slot and a legal line.

Every UI element is a physical control: the primary CTA is a chicken-head knob, the "how it works" tabs are a three-position rotary selector, services are ¼" input jacks, status is a jewel lamp. Nothing is a pill, a card with a drop shadow, or a gradient hero. The site refuses the dark-room-plus-amber-gear-photo studio template.

**Key Characteristics:**
- Two materials only: tolex (black, matte, grainy) and aluminum (light, brushed, chamfered). Text color flips with the material.
- Three voices of type: Michroma silkscreen caps for labels, Big Shoulders for the wide display shout, Archivo for reading.
- Strict color law: black / aluminum / white, plus ONE red jewel lamp that lights only for record-arm and submit.
- Beat-locked motion: everything moves on a 375ms beat with an exponential ease-out, or snaps in 2–3 steps like a switch.

## Colors

Monochrome hardware with a single red indicator.

### Primary
- **Jewel Red** (`--jewel`, with `--jewel-glow` and `--jewel-off`): the lamp lens only. Off state is the dark unlit lens `--jewel-off`; on state mixes to full `--jewel` and casts `--jewel-glow`. It appears in exactly two places: the `.lamp` in the header strip and the big `.lamp-big` in the form's done state. Nothing else on the page is red — not errors, not links, not hovers.

### Neutral — tolex (dark material)
- **Tolex** (`--tolex`): page background, `.cab` sections, input wells.
- **Tolex 2** (`--tolex-2`): spec plate / drawer surface.
- **Tolex Ink** (`--tolex-ink`): white silkscreen — primary text on black.
- **Tolex Ink 2** (`--tolex-ink-2`): secondary text on black (nav idle, body copy in cabinet sections).

### Neutral — aluminum (light material)
- **Alu / Alu Hi / Alu Lo** (`--alu`, `--alu-hi`, `--alu-lo`): the brushed panel gradient (hi → alu → lo, top to bottom), also the selected rotary tab, focus ring on tolex, caret color, scrollbar thumb.
- **Alu Shadow** (`--alu-shadow`): reserved for deep panel shading.
- **Silk** (`--silk`): black silkscreen — primary text on aluminum, focus ring on aluminum, error borders.
- **Silk 2** (`--silk-2`): secondary text on aluminum. (Several panel paragraphs use the literal `#232529`, one notch darker; treat it as the "reading copy on aluminum" tone.)

### Named Rules
**The One Lamp Rule.** Red exists only inside a `.lamp`. Errors are black silkscreen (`--silk`) with a bold weight; success is the lamp turning on. If you need a new accent, you don't — use material contrast.

**The Material Flip Rule.** Text color is decided by the surface, never by the component. On `.panel` the ink is `--silk`; on `.cab`/body it is `--tolex-ink`. `::selection` and `:focus-visible` invert the same way (see `.panel ::selection`, `.panel :focus-visible`).

## Typography

**Display Font:** Big Shoulders (variable, `fonts/bigshoulders-var.woff2`; fallbacks Archivo Narrow, Impact)
**Body Font:** Archivo (variable + 400 italic; fallbacks Helvetica Neue, Arial)
**Label Font:** Michroma 400 (`fonts/michroma-400.woff2`; fallbacks Eurostile, Bank Gothic)

**Character:** Michroma is the silkscreen on the faceplate — wide, mechanical, always uppercase, always tracked. Big Shoulders is the brand shout in huge condensed caps set tight and leading-less. Archivo is the manual: neutral, tabular numerals, 1.55 leading.

### Hierarchy
- **Display** (`.display`, `.legend h1`: Big Shoulders 800–900, `clamp(3rem, 7.5vw, 6rem)`, lh .9–.92, uppercase, `text-wrap: balance`): section H2s and the hero H1. Hero `<em>` is outlined: transparent fill, `-webkit-text-stroke: 3.5px var(--silk)`. Variants: `.book-display` `clamp(3rem, 5.5vw, 4.6rem)`; `.book-done h3` `clamp(3rem, 7vw, 5.5rem)`.
- **Headline** (`.channel h3`: Big Shoulders 800, `clamp(2.4rem, 4vw, 3.4rem)`, lh .9; `.rotary-panels h3`: 700, `clamp(2rem, 3.5vw, 2.8rem)`, lh .95): card and tab-panel titles, uppercase.
- **Title** (`.silk-title`: Michroma, `clamp(.85rem, 1.2vw, 1rem)`, tracking .28em, uppercase, flanked by hairline rules via `::before/::after`): the panel's silkscreen header line.
- **Body** (Archivo 400, 1.0625rem / 1.55; drops to 1rem below 760px): lede `1.1rem` max 42ch; cabinet copy `1.125rem` max 58ch with a `1.3rem` first paragraph; tab copy `1.2rem` max 60ch.
- **Label** (`.silk`, `.ch-label`, `.field label`, `.plate dt`, `.lamp-label`, nav: Michroma 400, .56–.72rem, tracking .12–.2em, uppercase): every control legend, nav item, form label, dt, caption.

### Named Rules
**The Silkscreen Rule.** Anything that names a control or a field is Michroma, uppercase, tracked ≥ .12em, ≤ .72rem. Never set Michroma in mixed case or above 1rem (the only exception is `.knob-text b` at .95rem).

**The Shout Rule.** Big Shoulders is uppercase, weight ≥ 700, line-height < 1. It never appears below ~2rem; small headings use Michroma labels instead.

## Layout

Single column of stacked hardware, `--max: 1280px` content width, `--gutter: clamp(1.25rem, 4vw, 4rem)` side margins. Two section types alternate:

- **`.panel` sections** (`.hero`, `.channels`, `.book`): inset from the cabinet by the gutter (`width: calc(100% - 2 * var(--gutter))`, `margin-inline: auto`), 6px radius, padding `clamp(2.5rem, 5vw, 4rem)` block / `clamp(1.5rem, 5vw, 4.5rem)` inline, four `.screws` in the corners at 14px inset.
- **`.cab` sections** (`.room`, `.selector`): full-bleed tolex, padding `clamp(5rem, 10vw, 9rem) var(--gutter)`, inner `.cab-inner` capped at `--max`.

Internal grids: hero `minmax(0, 1.05fr) minmax(0, 1fr)` (meter left, legend right); room `1.1fr .9fr` with the H2 spanning both; channels `repeat(3, 1fr)` separated by 1px black hairlines, not gaps; rotary `minmax(260px, .8fr) minmax(0, 1.2fr)`; book `.8fr 1.4fr` with a two-column form (`.wide` spans). Header `.strip` is sticky, 4-column grid `auto 1fr auto auto`.

**Breakpoints** (max-width): **1024px** — nav collapses to `.strip-menu` + `.drawer`; hero, book go single column; rotary dial shrinks to 220px. **760px** — body 1rem; channels stack with top hairlines; rotary, form, footer go single column; meter capped at 250px; lamp label hidden. **420px** — knob shrinks to 56px.

## Elevation & Depth

Depth is physical, not floating. There are no ambient card shadows; every shadow describes a machined edge, an inset well, or a lens.

### Shadow Vocabulary
- **Panel chamfer** (`.panel`): stacked inset 1px highlights/shadows + three hard 0-spread rings (`#3a3c41` 1px, `#17181b` 4px, `#2c2d32` 5px) + one deep drop `0 24px 50px -18px rgba(0,0,0,.95)`. The rings are the bezel gap between plate and cabinet. Plus a `::after` sheen sweep.
- **Inset well** (`.field input`, `.meter-glass`, `.backplate-vent::before`): `inset 0 2px 4px rgba(0,0,0,.7)` and kin. Anything you type into or look through is recessed.
- **Plate lift** (`.plate`, `.rotary-steps`, `.backplate-vent`): `inset 0 1px 0 rgba(255,255,255,.06–.1)` top catch-light + `0 20px 40px -24px rgba(0,0,0,.9)` grounded drop.
- **Lamp glow** (`.lamp`): `0 0 calc(var(--on)*16px) calc(var(--on)*4px) var(--jewel-glow)` — the only colored shadow on the site, scaled by the `--on` custom property.

### Named Rules
**The Machined Edge Rule.** Every raised surface has a 1px top highlight and a 1px bottom shadow. If a new surface lacks them, it reads as a flat web card and breaks the world.

## Shapes

Hardware radii, small and specific: 0 on hairline rules and the `.strip`; 3px on input wells and `.meter-play`; 4px on plates, drawer, tabs, vent; 6px on panels; 10px on the meter window; 18px on the meter bezel; full circles for screws (14px), rivets (12px), lamps (14/28px), jacks, knobs; `999px` only on the knob-button hit area. Jacks use a hex `clip-path` nut. Screws carry a `+` slot via `::before/::after` rotated ±45°. Dividers are 1px `rgba(0,0,0,.28)` on aluminum, `#2c2d33`-family on tolex — never 2px, never dashed.

## Components

### Knob button (`.knob-btn`, `.knob-submit`) — primary control
- Chicken-head knob (inline SVG: `.knob-rim`, `.knob-base`, `.knob-rot` group with `.knob-head` + `.knob-line`) at 76px (84px on submit, 56px ≤420px) beside `.knob-text` (Michroma `<b>` .95rem + Archivo `<small>`).
- **Rest:** pointer rotated −40°. **Hover / focus-visible / `[data-armed]`:** rotates to +10° over one beat; faint `rgba(0,0,0,.06)` pill behind. **Active:** +26°. **Disabled** (`.knob-submit[disabled]`): opacity .6, `cursor: progress`.
- Every `.knob-btn` carries `data-arm` so it arms the lamp (see Jewel lamp).

### Etched link (`.etched-link`) — secondary
- Michroma .62rem label with a 1px `currentColor` underline as border and a 14px inline SVG arrow. Hover widens the gap .5→.8rem and nudges the arrow 2px. Ink follows the material.

### Jewel lamp (`.lamp`, `.lamp-big`, `.lamp-label`) — signature
- 14px lens with a bezel ring (`#2c2e33` 3px, `#7b7f86` 4px). Driven by `--on: 0|1`; `.lamp-on` or an ancestor `[data-armed]` sets `--on: 1`. Glow eases over a beat; lens color switches in `steps(3, end)`.
- States from `script.js`: **Ready** (standby) → **Armed** (any `[data-arm]` hovered/focused, or submit in flight) → **Recording** (successful submit; latched until reset). Label text lives in `[data-lamp-label]` inside `.strip-power[aria-live=polite]`.

### Rotary selector (`.rotary`, `.rotary-dial`, `.rotary-steps`) — signature
- SVG dial with three ticks and Michroma labels; `.dial-knob` rotates −60° / 0° / 60° from `.rotary[data-step]` over 1.6 beats.
- Segmented tabs (`role=tablist`): dark strip `#101113`, 1px `#3a3c42` borders, Michroma .7rem. Selected tab fills with the aluminum gradient, black ink, and a 8px diamond pointer below. Panels enter with `dial-in` (8px slide + fade, 1.2 beats). Arrow/Home/End keys move selection; idle auto-step every 12 beats until touched, with a `.rotary-auto` stop control.

### Input jack (`.jack`) — service icon
- 52px hex nut (`clip-path`, aluminum gradient) with a 26px black socket ringed `#d8dadd`/`#5a5e65`. Decorative, `aria-hidden`.

### Panel (`.panel` + `.screws`) and Cabinet (`.cab`, `.cab-inner`)
- Panel: brushed gradient + two repeating 1px hairline grains + chamfer shadows; four `.screws i` at 14px inset. Cabinet: tolex dot texture over the body's fixed turbulence layer. See Layout for padding.

### Spec plate (`.plate` + `.rivets`)
- Dark `<dl>` on the cabinet, 4px radius, 1px `#2c2d32` border, four 12px rivets at 9px inset. Rows `8.5rem 1fr` (6.5rem ≤760px) with 1px dividers; `dt` Michroma .62rem in `#cfcec9`, `dd` Archivo 1rem white.

### Header strip (`.strip`, `.strip-nav`, `.strip-menu`, `.drawer`)
- Sticky, translucent tolex (`rgba(12,12,13,.92→.78)` + `blur(10px)`), 1px `#26272b` bottom rule. Nav links Michroma .64rem in `--tolex-ink-2`; hover/`[aria-current]` turn white and draw a 1px underline left→right over one beat (`::after` `right: 100%→0`). ≤1024px: hamburger (`.strip-menu`, 40px, two bars that cross when `aria-expanded=true`) opens `.drawer` (absolute under the strip, `#101012`, row links with hairlines; Esc closes).

### Fields (`.field`, `.field-error`, `.form-status`)
- Label above (Michroma .62rem black). Input: recessed well (`#0c0c0e→#14151a`), 1px `#4a4d55` border, 3px radius, white text, `#8b8d94` placeholder, aluminum caret. Select uses a white SVG chevron, native arrow removed.
- **Focus:** border `--alu-hi`, ring `0 0 0 3px rgba(20,21,26,.35)`, no outline. **Invalid** (`.field.is-invalid`, `aria-invalid`): border + 2px ring in `--silk`; `.field-error` (`role=alert`) .85rem bold black. **Status:** `.form-status` `role=status`; `.is-error` bold black. Done state: `.book.is-done` collapses to one column and shows `.book-done` with a lit `.lamp-big`.

### Meter window (`.meter`, `.meter-bezel`, `.meter-glass`, `.meter-play`)
- Square video in an 18px-radius dark bezel with a 10px-radius glass overlay (diagonal reflection + vignette). `.meter-play` is a small dark Michroma toggle (`aria-pressed`) that pauses the loop; reduced-motion pauses it on load.

### Backplate vent (`.backplate-vent`)
- 34px slot with a `repeating-linear-gradient(90deg …)` grille and deep inset shadow. Pure ornament, `aria-hidden`.

## Motion

Grammar lives in two tokens: `--beat: 375ms` (6 frames at the video's 16fps) and `--ease-out: cubic-bezier(.16, 1, .3, 1)`. Two kinds of movement:
- **Mechanical travel** (knob rotation, lamp glow, nav underline, drawer bars, link arrow, tab panel entry): `var(--beat) var(--ease-out)`; longer travel uses multiples (`calc(var(--beat) * 1.2)`, `* 1.6`).
- **Switch snaps** (color, background, border-color, lamp lens): `steps(2, end)` or `steps(3, end)` — they click, they don't fade.
- Timers in JS use `BEAT = 375` (submit delay 2 beats, idle auto-step 12 beats).
- `prefers-reduced-motion`: all transitions/animations forced to 1ms, smooth scroll off, video paused, auto-step disabled.

## Do's and Don'ts

### Do:
- **Do** put new controls on a `.panel` with `.screws`, or on the `.cab` inside `.cab-inner`; text color comes from the surface.
- **Do** label every control in Michroma uppercase, .56–.72rem, tracking ≥ .12em.
- **Do** time every transition with `var(--beat)` and either `var(--ease-out)` or `steps(n, end)`.
- **Do** give raised surfaces a 1px top highlight and 1px bottom shadow; give wells an inset shadow.
- **Do** keep hairlines at 1px, `rgba(0,0,0,.28)` on aluminum and `#2c2d33`-family on tolex.
- **Do** keep hit targets ≥ 40px (`.strip-menu`, knobs, tabs) and preserve `:focus-visible` rings (`--alu-hi` on tolex, `--silk` on aluminum, offset 3px).
- **Do** preload any new font file and subset it; fonts are self-hosted in `fonts/`.

### Don't:
- **Don't** use red anywhere except inside a `.lamp`. No red errors, badges, or hover states.
- **Don't** introduce a third material (glass cards, gradients in color, photography backgrounds) or any color outside the tolex/alu/silk/ink tokens.
- **Don't** use pill buttons, drop-shadowed cards, or text links styled as buttons; the primary action is always a `.knob-btn`.
- **Don't** set Michroma in mixed case, or Big Shoulders below ~2rem or lighter than 700.
- **Don't** ease with `ease`, `ease-in-out`, or durations other than beat multiples; don't fade colors — snap them with `steps()`.
- **Don't** add ambient/floating shadows (e.g. `0 8px 24px rgba(0,0,0,.1)`); every shadow must describe an edge, a well, or the lamp glow.
- **Don't** hard-code a second lamp state; drive on/off only via `--on` through `.lamp-on` or `[data-armed]`.
- **Don't** invent gear lists, credits, contact details, or photos — the video and text are the only proof on hand (see PRODUCT.md).
