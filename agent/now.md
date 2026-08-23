# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 52h to cutoff at the start of this
run --- not called the final run. Confirmed the brief against the course
source (unchanged from prior runs' understanding: playable instrument, no
score/fail state, opening screen invites the first sound).

The last several runs had exhausted the event-wiring angle (double-strike,
pointercancel, per-pointerId scoping, implicit-capture target, wind-
automation throttling) and two clean verification passes (node GC, CDP
page-freeze) with nothing new. This run tried a different subsystem instead
of re-reading the same event code: the CSS "struck" swing-animation cleanup
timer in `setupChimes`/`playChime`.

**Bug found and fixed: a fast roll on one chime cut its own swing animation
short.** Each strike scheduled its own `setTimeout(() => remove "struck"
class, 1600ms)`. Re-striking the same chime before that timer fired (easily
reachable --- the debounce is only 90ms, the animation is 1.6s, and a fast
tremolo/roll on one tube is completely legitimate expressive play, not an
edge case) left two overlapping timers. The *earlier* strike's timer still
fired on its original schedule and yanked the class off mid-animation for
the *later* strike, cutting its visible swing short by however much time had
elapsed between the two strikes.

Verified live on the dev server (no audio/gesture policy involved here, pure
DOM/CSS): clicked the same chime at t=0 and t=300, then sampled
`classList.contains("struck")` at several timestamps. Pre-fix: struck flips
false at ~1600ms (the *first* strike's timer), even though the second
strike's animation should run until ~1900ms. Post-fix: struck correctly
stays true through 1900ms and flips false only between 1900--2000ms (the
*second* strike's own timer). Re-checked the ordinary single-strike case
(no re-strike) still clears at exactly ~1600ms --- no regression.

Fix: a `Map<HTMLButtonElement, number>` per-chime generation token,
incremented on every strike; each strike's cleanup timeout checks the token
still matches before removing the class, so only the most recent strike's
timer can end the animation.

`pnpm check` (23 tests, typecheck, build) green after the fix. Only
`main.ts` changed --- no markup/ARIA touched, so didn't re-run
`pnpm check:audit` (no reason to expect a change there). Committed as
`f8b490c` and pushed to origin; dev server and Chrome both shut down clean
at the end of the run.

## Next action

Not this deliverable's final run yet. This run's technique --- when the
event-wiring angle reads exhausted, look at a *different* subsystem
entirely (this time: CSS animation/timer cleanup, not audio or pointer
state) --- is the one to reach for again before declaring the deepen phase
dry, rather than re-verifying already-closed checks.

When a future run's prompt calls this deliverable's run "last":

- Write `PROCESS.md` for real (still the unfilled template as of this run).
  Cite at minimum: the bamboo-chimes build (`3fb5e9f`), the spec test
  (`f931494`), the audit-sensor addition (`1d0f942`...`d15af76`), the three
  event-wiring fixes (double-strike `2b40af7` + pointercancel `aa6e9c8`
  sharing a root cause of incomplete event coverage; implicit-capture
  `7f8b527` as its own "don't trust event.target" shape), the wind-
  automation throttle (`52574b0`, unbounded resource growth), the per-
  pointerId drag-state fix (`e448212`, a shared-boolean-across-independent-
  sources bug), the two clean verification passes (node-lifetime GC, CDP
  page-freeze), and this run's stale-timer swing-animation fix (`f8b490c`)
  as an example of the same "don't trust the first-scheduled callback to
  still be the right one to run" family, but in the CSS/timer subsystem
  rather than audio or pointer events.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then a finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords (deliberately playing more than one note at once via
  genuine simultaneous touches) remain an acknowledged, unclosable-to-verify
  gap in this environment --- don't re-open it as a task.
- Don't re-check the live-URL-is-404 thing as if it were new information.

If a future run needs a fresh angle before being called last: two
subsystems (event wiring, CSS animation cleanup) have now each yielded a
real bug from the same underlying question shape --- "can an earlier,
already-scheduled callback fire after a later one supersedes it, and does
anything check for that?" Worth trying that same question against any
other subsystem not yet examined this way (none identified yet) before
falling back to re-verifying an already-closed check.
