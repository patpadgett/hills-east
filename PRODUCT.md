# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Static HTML/CSS/JS, no build step. Deploy target: GitHub Pages (`github.com/patpadgett/hills-east`, branch `main`, `CNAME` → hills-east.patpadgett.com). A `build-single.py` pass also produces a self-contained `Hills-East-Recording.html` with assets and scripts inlined.

## Users

Independent musicians, bands, and vocalists in the Kansas City metro looking for a room to record in and someone to finish the record. Situation: they have songs, maybe references, and want to know what this room is, whether it fits them, and how to get in touch with John.

Secondary: Patrick (site owner/builder), who publishes and maintains the page.

## Product Purpose

A single-page website for Hills East Recording, John Matthews' recording studio in Lenexa, Kansas. Success: a visitor understands it is a real studio run by a real person, feels the room's character, and reaches John directly.

## Positioning

Open decision. John's genres, room type (home vs commercial), whether he mixes and masters, gear, and credits are still unconfirmed. Nothing about these may be claimed; copy stays honest and general until John supplies facts.

## Operating Context

Recording sessions, mixing, finishing records; conversation-first booking (talk it through, then get in the room). Lenexa, KS — Johnson County, Kansas City metro.

## Capabilities and Constraints

- **Booking form**: real fields (name, email, project, need, message) with a honeypot. A serverless delivery path is built into `script.js` (`BOOK_FORM.endpoint` / `BOOK_FORM.accessKey`) but **no backend key is configured**, so nothing is sent yet. Until one is set, the form says so honestly and preserves the visitor's text.
- **Contact details (confirmed)**: John Matthews — **816-694-6288**, shown in the header, the booking unit and the footer; **hillseastrecording@gmail.com**, shown in the booking unit. Both are `tel:` / `mailto:` links.
- **Playback unit**: two YouTube videos by Beneath The Skin — "Internal" (`RE-oPaanCas`) and "Fade Away" (`ZrAWnT-ecWM`) — with Play/Pause and Stop transport and a stereo VU meter bridge.
- **Playlist unit**: built and verified (local audio + live 10-band FFT), then parked outside the published tree until the MP3s arrive. See `../hills-east-playlist-unit/`.
- **No** equipment list, rates, credits, testimonials, or client names. Do not fabricate them.
- Studio location may be stated as Lenexa, Kansas (confirmed).

## Brand Commitments

- Name: Hills East Recording (confirmed). Owner: John Matthews.
- The looping studio ident must anchor the top of the site (Patrick's explicit request). Current asset: `assets/hills-east-ident.mp4` (560×560) with `assets/hills-east-poster.webp`.
- The page is a 19-inch equipment rack: continuous rails, bolted ears, brushed-black plates, a champagne booking plate, red jewel lamps, silkscreen legends. See `DESIGN.md`.
- Patrick's conventions: action-oriented, non-self-referential CTAs; no internal/meta language in visitor-facing copy; distinctive, not template-like.

## Evidence on Hand

- `assets/hills-east-ident.mp4` + `assets/hills-east-poster.webp` — the studio ident loop and poster.
- Two published YouTube videos (above) — the only moving picture of the studio's work so far.
- John's direct phone and email.
- A built, parked playlist unit with its own QA probes (`../hills-east-playlist-unit/`).

Still absent: room or gear photos, credits, testimonials, rates, and any audio the studio owns. Future work must not invent them.

## Product Principles

1. Say only what is true; leave visible, labeled slots for what John will supply.
2. The room is the pitch — let the ident and the videos carry the first viewport.
3. One action: reach John. Every section should return the visitor to his contact details.
4. Feel like a specific place in Lenexa, not a stock "studio" template.
5. Distinguish simulated display data from real measurement, and keep visitor-facing text free of build commentary.

## Open Decisions

- Which form backend will carry booking messages (Web3Forms and Formspree are both wired for).
- The playlist's track list and audio files.
- John's genres, room type, mixing/mastering scope, gear, rates and credits.
