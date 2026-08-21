# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 111h to cutoff at the start of this
run --- not called the final run. Working tree was already clean; `pnpm
check` (typecheck, build, 23 tests) stayed green with no drift, so this run
made no commits to the app itself.

Closed the two genuinely-untested categories the previous `now.md` named:

- **`prefers-color-scheme: dark`.** `styles.css` has no dark-mode media
  query at all. Confirmed live (`agent-browser set media dark` +
  screenshot + `getComputedStyle`) that the page renders identically to
  light preference --- paper background, ink text, unchanged --- because
  every colour is a hardcoded custom property, not a system colour. Judged
  this a deliberate part of the paper-tone aesthetic (consistent with the
  standing throughline in this file), not an oversight worth fixing.
- **Tab visibility loss mid-strike.** `main.ts` has no `visibilitychange`
  handler and the continuous wind loop/strike envelopes are `AudioParam`
  automation on the audio thread, not `setTimeout`. Confirmed live: patched
  `window.AudioContext` to capture the instance (same technique as the
  keyboard-gesture-unlocks-audio check already in MEMORY.md), struck a
  chime, forced `document.hidden`/`visibilityState` + dispatched
  `visibilitychange` mid-ring, and confirmed `audioCtx.state` stayed
  `"running"` with no console errors both while hidden and after restoring
  visibility, with a fresh strike afterward still firing clean.

Both were clean results, not bugs --- see the new MEMORY.md entry above the
hover-cursor one for the general lesson (verify absence-of-handling claims
live even when the source strongly suggests they're safe).

## Next action

Not this deliverable's final run yet. When a future run's prompt calls it
the last one, the plan already logged the last few runs still holds:

- Write `PROCESS.md` for real, citing at minimum: the bamboo-chimes build
  (`3fb5e9f`), the spec test (`f931494`), and the audit-sensor addition
  (`1d0f942`...`d15af76`) as a "wiring a standing gap, not just retrying"
  moment.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then the finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords remain an acknowledged, unclosable gap in this
  environment --- don't keep re-opening it as a task.
- Don't re-check the live-URL-is-404 thing as if it were new information ---
  it's expected pre-publish state, already logged in an earlier `now.md`,
  not a recurring finding.

If a future deepen run finds the checklist dry yet again: every
genuinely-new find across recent runs (audit sensor, reduced-motion,
keyboard-gesture-unlocks-audio, touch-viewport, resize-mid-interaction,
dark-mode absence, tab-visibility mid-strike) came from rereading the
brief/spec/CSS/JS for a scenario not yet manually driven in a browser, never
from re-running an already-green check. At this point the standing list of
"scenario not yet tried" is genuinely thin --- worth rereading the rubric's
marking bands again (the technique that broke assignment 1's dry streak,
per the Deepen-phase practice entry in MEMORY.md) before manufacturing a
speculative check, or concluding the next run should just be the final run's
finishing steps if it's close enough to cutoff.
