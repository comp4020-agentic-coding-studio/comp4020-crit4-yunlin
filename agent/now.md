# Hand-off

## State

comp4020-crit4-yunlin ("An instrument" --- turn the browser into something a
stranger can pick up and play), 165h to cutoff at the start of this run. Repo
arrived at the bare starter commit (`8ea0275`); this was the first build run.

Built **Bamboo chimes**: seven ink-wash tubes hanging from a beam, each a real
`<button>` tuned to a note of a five-tone scale. Striking one --- click,
drag-strum across several, touch, or Tab+Enter --- runs a small physical
model (sine fundamental + overtone + noise transient, humanised detune/
timing/decay per strike, shared convolution reverb) rather than a sample. A
continuous filtered-noise "wind" layer tracks pointer speed and height as a
second, non-percussive expressive channel. No score, no fail state. Visual
language continues the group's ink-wash/paper throughline: paper background,
system-serif-stack type, one held-back accent (`--seal`, a muted red) used
for exactly one *meaning* --- "this tube is sounding" --- applied to the
struck-chime glow, the keyboard focus ring, and the favicon's one accented
tube. See the aesthetic-throughline note in `MEMORY.md` for why three DOM
locations is still "one accent" and not scope creep on the crit-2 pattern.

Also: `public/favicon.svg` (this template ships none --- routine fix, see
existing MEMORY.md item), `public/card.png` replaced with a real 1200x630
screenshot of the built page, `spec/starter.test.ts` deleted (starter page is
gone) and replaced with `spec/instrument.test.ts` covering this week's
mechanically-checkable spec lines: every chime is a real button (keyboard
operable), every chime has an accessible name, no `<audio>`/prerecorded
media, `AudioContext` present in the bundle, `touch-action: none` on the
instrument (so touch-drag strikes tubes instead of scrolling), and no
score/fail language in the page text.

Verified in a real browser (`agent-browser`, `--args "--no-sandbox"` needed
in this container): desktop (1280x800) and mobile (390x844) viewports both
render correctly; click, Tab+Enter keyboard play, and a `drag` gesture across
four buttons (strum) all fired the strike animation/audio path with a clean
console. `pnpm check` is green (typecheck, build, 3 spec files / 23 tests).
Dev server was shut down after testing.

Three commits ahead of `origin/main`, not pushed --- this isn't the final run,
and the doctrine only calls for a push as a finishing step. `PROCESS.md` and
`reflections/crit-4.md` are still template boilerplate: write those on the
finishing run, not before.

## Next action

Deepen phase. Things worth doing before the final run, roughly in order:
- Re-open in a browser and just play it for a while --- the crit opens cold
  with the pod playing before anyone talks, so the single best use of time
  here is making the first 30 seconds of unguided play more inviting/legible
  (the spec: "a stranger can play it uninstructed").
- Consider whether seven identical-looking buttons is enough visual variety,
  or whether the tubes should visibly differ (width/shade) by pitch so
  sighted play has a spatial logic beyond left-to-right pitch order (which
  is already true but not signalled visually beyond height).
- Multi-touch chords: only single-pointer strikes are tested so far (mouse
  drag, one touch). If a phone/tablet with real multi-touch is available,
  check two simultaneous fingers on two tubes actually sound together ---
  Pointer Events should handle this per-pointer-id already since nothing in
  `main.ts` assumes a single active pointer, but it hasn't been verified on
  real multi-touch hardware, only simulated single-pointer drag.
- No page-two/colophon planned deliberately: the brief's opening screen is
  the whole instrument, and a second page would dilute "the browser is the
  instrument" rather than deepen it --- matches the crit-1 lesson about
  restraint having a low scope-creep ceiling. Revisit only if a future pass
  finds a real gap, not for its own sake.
- Standard finishing steps not yet due: `PROCESS.md`, `reflections/crit-4.md`,
  final `pnpm check` + `check:evidence`, commit, push. Do these on the run
  the prompt calls last, per doctrine, not early.
</content>
