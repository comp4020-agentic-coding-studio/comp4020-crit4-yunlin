# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 100h to cutoff at the start of this
run --- not called the final run. Working tree was clean and `pnpm check`
was already green at the start, but the deepen checklist from the last
several `now.md`s was genuinely dry (reduced-motion, dark-mode,
tab-visibility, resize, touch-viewport, keyboard-gesture-audio-unlock,
drag-strum, hover-cursor false-alarm, `:nth-child` bug --- all already
checked). Re-read `main.ts`'s event wiring fresh rather than re-running an
already-green check, and found a real bug this time.

**Found and fixed a genuine double-strike bug.** The grove had a delegated
`pointerdown` listener (via debounced `maybeStrike`, needed for drag-strum)
*and* a plain `click` listener per button calling `playChime` directly
(needed because keyboard Enter/Space dispatches `click` with no preceding
`pointerdown`). Every mouse/touch tap fires both `pointerdown` and a
synthesized `click`, so every tap struck the chime twice --- audible as a
flam, not a clean note. Confirmed by patching
`AudioContext.prototype.createOscillator` via `agent-browser eval` to count
calls per gesture: mouse click read 4 (double-strike), keyboard Enter read
2 (correct), on the same build. Fixed by routing `click` through the same
debounced `maybeStrike` (commit `2b40af7`). Verified after the fix: mouse
click, keyboard Enter, and keyboard Space all read 2; a drag across 4 tubes
read 8 (4 correct strikes, no doubling introduced). Full `pnpm check` (23
tests) and `pnpm check:audit` (100/100 both) stayed green, browser sweep at
both marking viewports (1920x1080, 390x844) clean console, both screenshots
normal. Pushed: `1ed79cc..2b40af7`.

See the new MEMORY.md entry (end of the crit-4 bullet list) for the general
lesson: two individually-correct listeners on the same interaction can
double-fire it with nothing structural (`tsc`/build/vitest) catching it, and
the oscillator-call-counting technique generalises to any Web Audio
instrument.

## Next action

Not this deliverable's final run yet. This bug is the kind of "moment that
mattered" `PROCESS.md` should cite when that's written --- a correction that
would have shipped silently to the crit's cold-open pod-play otherwise, and
a real defect a green check suite didn't catch, distinct from the earlier
"clean result, not a bug" absence-checks. When a future run's prompt calls
it the last one:

- Write `PROCESS.md` for real, citing at minimum: the bamboo-chimes build
  (`3fb5e9f`), the spec test (`f931494`), the audit-sensor addition
  (`1d0f942`...`d15af76`), and this run's double-strike fix (`2b40af7`) ---
  the last one is probably the strongest "moments that mattered" citation
  in the repo so far, since it's a real bug found by a technique (event-path
  reading, not re-running a green check) rather than a retry.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then the finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords remain an acknowledged, unclosable gap in this
  environment --- don't keep re-opening it as a task.
- Don't re-check the live-URL-is-404 thing as if it were new information ---
  it's expected pre-publish state, already logged in an earlier `now.md`,
  not a recurring finding.

If a future deepen run finds the checklist dry again: this run's find came
from re-reading `main.ts`'s event-wiring logic line by line rather than
re-testing an already-verified scenario --- worth the same kind of fresh
source read (not just browser-behaviour scenarios) before concluding the
list is truly exhausted. If nothing new turns up on a careful pass, that's
the actual signal to treat the next run as the finishing-steps run rather
than manufacture a speculative check.
