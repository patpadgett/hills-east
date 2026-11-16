# Design direction — making Hills East look a lot better

> **Status: proposals, not decisions.** Nothing here is implemented. `DESIGN.md` remains the
> authoritative description of the current build; this file is a prioritized wishlist for a
> future visual pass. Some items need assets the studio has not supplied yet.

Written 2026-11-15, after reviewing `index.html`, `styles.css`, `script.js`, the current
playback-unit screenshots, and the asset inventory.

## The short version

The rack concept is already strong. What holds the site back is not hardware detail — it's
that the page has no evidence of the studio or its sound. Most of these changes are about
putting real work, real space, and real sound inside the rack, then letting the few genuinely
great objects (VU meters, champagne booking plate) carry more weight.

---

## 1. Give it a voice before anything else

This is a recording studio whose site never plays a recording. The playback unit plays two
YouTube videos by a band, not John's work. The single biggest upgrade is a real "Hear the
room" moment — one or two credited tracks, ideally with an A/B (rough vs. finished) — using
the parked playlist module. That changes the site from a beautiful metaphor into a reason to
hire John.

Needs audio files from the studio. Nothing else on this list matters as much.

## 2. Recompose the hero around a real image

The monitor is the largest thing on the page, and it currently loops a logo whose dripping
black-metal wordmark fights the site's precise Big Shoulders / Michroma / champagne system.
It is the only place the identity breaks.

- Use one real photograph of the live room or a session — treated dark and warm, 4:5 or
  square, inside the same CRT bezel — instead of (or alternating with) the ident. There is no
  room photography anywhere in `assets/`; that is the real gap.
- If the ident stays, rebuild it inside the site's type system: the nested triangles, the
  wordmark set in Big Shoulders, champagne light, film grain. One visual language.
- Then let the hero own the page. The h1 is capped at 3.6rem
  (`clamp(2.5rem, 4.2vw, 3.6rem)`) while the monitor is roughly 500px, so the headline reads
  as a caption to a logo. Increase it, and pull the copy column up — `padding-bottom: 3.4rem`
  leaves the text floating low against a lot of dead black.

## 3. Make the meter bridge the signature, not a sidebar

The cream VU meters are the best object on the site and they sit at ~150px wide in a mostly
empty right column (`max-width: 160px`). Enlarge them, align their height to the screen, and
consider putting them full-width under the video so the needles become the page's
characteristic motion.

Also fix a visible craft bug: `CH 2 · FADE AWAY` wraps inside
`.source { flex: 0 1 12.5rem }`, so the second source button is taller than the first. Equal
heights, or shorter labels.

## 4. Turn the rack rails into navigation

The rails are the one piece of hardware doing nothing. Engrave unit designations and section
names into the rail and make them jump links. That also fixes a real mobile problem: below
900px the header hides Room, Videos, and How it works, leaving only Book, so phones have no
navigation except scrolling. A slim sticky 1U strip would keep the metaphor present on a long
page.

## 5. Rework the close

The champagne booking plate is the right climax — the only warm surface, so the eye lands
there. But it is a seven-field form with the CTA at the very bottom, and on mobile that is a
full screen of typing before the ask. Make phone / text / email the visible primary actions,
keep the form as the secondary path, and reduce it to name, contact, and message. Style the
honesty note as a small silkscreen tag, not a paragraph under the button.

## 6. Typographic and material polish

- Too many tracked-out Michroma legends compete at ~11.5px; they have become texture instead
  of labels. Reserve silkscreen for actual hardware markings and let Archivo carry
  instructions at a larger size.
- "How a session comes together" hides two-thirds of its content behind the knob. Keep the
  chicken-head selector as a highlight control, but show all three stages
  (Talk → Track → Finish) so the process is scannable, with the active one lit.
- The palette is one temperature across every black unit for four screens. A second
  practical light source — an amber pool, a warmer plate gradient, a photograph — would
  restore depth.
- The 45° sheen plus repeating 1px stripes create a fine moiré at large sizes. The brushed
  metal texture could be quieter and more convincing.

---

## What not to touch

The continuous rails, bolted ears, champagne plate, red jewel family, VU meters, local fonts,
44px targets, visible focus, and the no-generic-cards discipline. The rack is not the problem
— it's that the rack is currently empty.

## If only one pass happens

Do **#2 and #3 together**: rebuild the hero around a real room image and give the playback
unit a screen/meter composition worth the name. The rest can follow.
