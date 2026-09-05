# Hills East Recording — website

One-page site for John Matthews' recording studio in Lenexa, Kansas.
Flat HTML/CSS/JS, no build step, self-hosted fonts.

## Preview

    cd hills-east-recording
    python3 -m http.server 8080

Open http://127.0.0.1:8080/

## Files

- index.html — page structure and copy
- styles.css — the whole visual system (tokens at the top)
- script.js — jewel-lamp record-arm, rotary selector tabs, mobile drawer, video toggle, form validation + dummy success state
- Hills_East_Recording.mp4 — the studio ident loop (560×560, 16 fps, 6 s), anchored in the hero meter window
- assets/hills-east-poster.jpg — first frame of the video, used as poster
- assets/favicon.svg — nested-triangle mark derived from the ident
- fonts/ — Big Shoulders Display (display), Michroma (silkscreen labels), Archivo (body); Google Fonts, OFL
- PRODUCT.md — confirmed product facts (what may and may not be claimed)
- DESIGN.md — the visual system, written from the built page
- .impeccable/ — design-process artifacts (surface brief, review captures). Not needed to deploy.

## Design direction

The site is a tube amp head. Brushed-aluminum control panels (hero, Channels, Book) sit on a black tolex cabinet (The room, How a session comes together). Labels are silkscreen caps; the display voice is a tall condensed grotesk; controls are chicken-head knobs, a rotary selector, hex-nut input jacks, corner screws and rivets. The color law is black / aluminum / white plus a single red jewel lamp that lights only when you arm the primary control or send the form (Ready → Armed → Recording). Motion steps at 375 ms, the beat of the ident loop.

The ident video is the only real asset, so it is the hero: framed as a meter window, with its own pause control.

## Before launch — things John must supply

Nothing below was invented; each is a clearly labeled slot.

1. Contact details: phone, email, Instagram. Add to the footer and/or spec plate (`.plate`) once known.
2. Form backend: `<form action="/inquiry" method="post">` in index.html. Point it at Formspree / Netlify Forms / your handler, then delete the fake delay in script.js (marked with a comment).
3. Room facts: gear list, room dimensions, genres John actually tracks, credits, rates, hours. The copy is honest-general on purpose; tighten it when facts arrive.
4. Photos: if John has room photos, the tolex sections (The room) are where they belong.

## Research notes

- No public listing for Hills East Recording was found; all facts come from Patrick (name, owner, Lenexa KS, video asset).
- Prior build (john-matthews-recording-studio/) used a warm editorial look and a generic 'JM / STUDIO' brand; this is a full redesign that keeps only the video and poster.
- Type choices: Michroma echoes Eurostile-style amp silkscreen; Big Shoulders Display gives a condensed, tall display voice that sits with the ident's spiky lettering without imitating it; Archivo is a neutral workhorse body.

## Deploy

Static. The prior repo (github.com/patpadgett/john-matthews-recording-studio) deployed via GitHub Pages Actions; copy .github/workflows from it, or drop this folder on any static host.
