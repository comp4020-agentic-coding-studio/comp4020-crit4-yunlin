# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 45h to cutoff at the start of this
run --- not called the final run. Re-confirmed the brief against the course
source (unchanged: playable instrument, no score/fail state, opening screen
invites the first sound). Working tree was already clean, `pnpm check` green
(23 tests, typecheck, build) at the start --- no code changes this run.

Read `main.ts`/`index.html`/`styles.css` end to end looking for a new bug
via the same "different subsystem" discipline the last several runs used,
plus specifically re-applying the "can an earlier scheduled thing outlive
its relevance" question that had paid off twice before (double-strike/
pointercancel family, then the stale swing-timer fix). Traced through the
`struckRecently` Set / `strikeToken` Map interaction, the wind layer's
shared (not per-pointerId) `lastX`/`lastY`/`lastT` state, and the `.beam`
decorative div's absolute positioning relative to the chime buttons --- none
of these produced a real defect:

- `struckRecently`/`strikeToken` interaction re-verified consistent (already
  fixed in `f8b490c`); no new issue found on a fresh read.
- The wind layer's continuous-motion state (`lastX/lastY/lastT`) genuinely
  is shared across all pointers, not scoped per pointerId like the strike
  gating already is --- but this is defensible as a single ambient-breeze
  layer for the whole grove rather than a per-finger effect, and any
  artefact from it is a momentary inaudible-ish gain/filter blip, not a
  correctness bug like the strike-gating one was. Judged not worth chasing;
  it also falls inside the acknowledged multi-touch verification gap
  `now.md` already says not to re-open.
- `.beam`'s `top: 1.6rem` sits well above where chimes start
  (`.grove`'s `padding-top: 2.5rem`), so it never overlaps the chime
  hit-targets despite having no explicit `pointer-events: none` --- checked
  the numbers, not just assumed the layout was fine.

Ran one genuinely new live-browser check instead of re-verifying a closed
one: resize mid-drag-strum. Patched `AudioContext.prototype.createOscillator`
to count calls (same technique as the double-strike/pointercancel fixes),
dispatched a real `pointerdown` on chime 0 at 1280x577 (osc count 0→2,
`.struck` applied), resized the live session to 800x600 mid-gesture
(`agent-browser set viewport`, same pointerId still "active"), then
dispatched a `pointermove` at chime 5's *new*, post-resize screen
coordinates --- `elementFromPoint` correctly resolved to chime 5's
post-resize position, it struck exactly once (osc count 2→4), console
stayed clean throughout. Confirms the `elementFromPoint`-based hit-testing
(already switched to for the implicit-touch-capture fix) is also robust to
a viewport change mid-gesture, since it recomputes real coordinates on
every event rather than caching anything. A clean result, not a bug ---
closing a plausible-but-unchecked angle the same way the node-GC and
CDP-freeze checks did earlier.

No commit this run: nothing needed fixing, and there is no value in
manufacturing a change. Dev server and Chrome were both shut down clean at
the end.

## Next action

This deepen phase is now genuinely close to dry: every subsystem examined
this way (pointer/click event wiring, wind-automation growth, CSS timer
cleanup, node GC, CDP page-freeze, and now resize-mid-gesture) has yielded
either a real fix or a clean, deliberately-checked negative result. The
remaining acknowledged gap (multi-touch chording) is unclosable in this
environment and should stay closed per the standing note below.

When a future run's prompt calls this deliverable's run "last":

- Write `PROCESS.md` for real (still the unfilled template as of this run).
  Cite at minimum: the bamboo-chimes build (`3fb5e9f`), the spec test
  (`f931494`), the audit-sensor addition (`1d0f942`...`d15af76`), the three
  event-wiring fixes (double-strike `2b40af7` + pointercancel `aa6e9c8`
  sharing a root cause of incomplete event coverage; implicit-capture
  `7f8b527` as its own "don't trust event.target" shape), the wind-
  automation throttle (`52574b0`, unbounded resource growth), the per-
  pointerId drag-state fix (`e448212`, a shared-boolean-across-independent-
  sources bug), the stale-timer swing-animation fix (`f8b490c`, same "don't
  trust an earlier scheduled callback" family but in CSS/timer land), and
  the clean verification passes (node-lifetime GC, CDP page-freeze,
  resize-mid-drag-strum) as evidence of deliberate checking, not just
  fixing what broke on its own.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then a finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords (deliberately playing more than one note at once via
  genuine simultaneous touches) remain an acknowledged, unclosable-to-verify
  gap in this environment --- don't re-open it as a task.
- The wind layer's shared (non-per-pointerId) motion state is a known,
  judged-acceptable simplification, not a task --- don't re-open it either
  unless a future run finds a concretely audible symptom, not just the
  theoretical shared-state shape.
- Don't re-check the live-URL-is-404 thing as if it were new information.

If a future run needs a fresh angle before being called last and this
hand-off's "genuinely dry" read turns out wrong: the question that has now
paid off in two different subsystems (event wiring, CSS timer cleanup) is
"can an earlier-scheduled/earlier-captured thing outlive its relevance and
act on stale state" --- try it against a subsystem not yet examined this
way, rather than re-verifying an already-closed check.
