# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 76h to cutoff at the start of this
run --- not called the final run. Working tree was clean and `pnpm check`/
`pnpm check:audit` were already green (the implicit-capture fix from the
previous run had landed). Followed the previous hand-off's own suggested
third angle: stopped re-reading event wiring and instead read the audio-graph
code (`strike()`, `updateWind()`, `ensureAudio()`) for a failure mode nobody
had looked for yet.

**Found and fixed unbounded AudioParam automation growth in the wind
layer.** `updateWind()` calls `setTargetAtTime` on `windGain.gain` and
`windFilter.frequency`, and was wired straight to a raw `pointermove`
listener with no throttling. Per the Web Audio spec (confirmed via
`WebSearch` against MDN/bugzilla discussion before treating it as real),
`setTargetAtTime` calls append to a param's automation timeline and are
never pruned --- so every single pointermove during a drag schedules two more
permanent entries. Verified live in `agent-browser`: patched
`AudioParam.prototype.setTargetAtTime` to count calls, dispatched 200
synthetic `pointermove` events in a tight loop, got 400 calls (2 params x
1 per move) with zero throttling. A real drag at 60-120Hz would schedule
tens of thousands of these per minute, none ever pruned per spec --- a
different bug shape from all four prior finds in this deliverable
(those were event-wiring gaps/lies; this is unbounded resource growth in the
audio graph itself, exactly the "rapid-fire exhausting some resource" angle
the previous hand-off named as untried). Fixed by throttling the call to
once per 40ms (well under the params' own 0.12s/0.2s smoothing time
constants, so no audible loss of responsiveness) --- confirmed the burst
count dropped 400->2 for the same synthetic burst, and confirmed a
realistically-spaced drag (one move per ~50ms) still updates the wind layer
on every move. `pnpm check` (23 tests) stayed green throughout; this bug is
invisible to jsdom/vitest just like the four before it, only found by
reading the audio code with a resource-growth question in mind rather than
running an already-green scenario again. Commit `52574b0`. Pushed.

Full lesson written into `MEMORY.md`'s Working environment section.

## Next action

Not this deliverable's final run yet. When a future run's prompt calls it
the last one:

- Write `PROCESS.md` for real (still the unfilled template as of this run),
  citing at minimum: the bamboo-chimes build (`3fb5e9f`), the spec test
  (`f931494`), the audit-sensor addition (`1d0f942`...`d15af76`), the three
  event-wiring fixes as two moments (double-strike `2b40af7` + pointercancel
  `aa6e9c8` sharing a root cause of incomplete event coverage; implicit-
  capture `7f8b527` as its own distinct "don't trust event.target" shape),
  and this run's wind-automation throttle (`52574b0`) as a fifth, different
  shape again: unbounded resource growth in the audio graph rather than a
  wiring gap.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts;
  `reflections/` currently has no crit-4.md, only the template README).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then the finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords remain an acknowledged, unclosable gap in this
  environment --- don't keep re-opening it as a task.
- Don't re-check the live-URL-is-404 thing as if it were new information.

If a future deepen run finds the checklist dry again: five real bugs have
now come from reading `main.ts` by hand with a specific failure-mode
question in mind, never from re-running an already-green scenario. Angles
tried so far: "what event isn't handled" (double-strike, pointercancel),
"is a handled event's payload trustworthy" (implicit capture), "does
anything grow unbounded under repeated/rapid interaction" (this run's wind
fix). Angles not yet tried: `AudioContext` behaviour across an actual tab
suspend/resume cycle triggered by the OS (not just the `visibilitychange`
override already checked), and whether `strike()`'s per-note oscillator/gain
node graph is ever actually garbage-collected under sustained rapid-fire
strikes (plausible it already is, per spec semantics for stopped source
nodes with no external refs, but not verified live the way the wind-param
growth was). If a careful pass on one of those turns up nothing, that's the
actual signal to treat the next run as the finishing-steps run.
