# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 63h to cutoff at the start of this
run --- not called the final run. The prior hand-off had declared the deepen
checklist genuinely dry after two clean null-result verifications
(oscillator/node GC, CDP page-freeze). Re-reading `main.ts` fresh with a new
question ("what happens when a *second*, incidental pointer interacts mid-
drag?") turned up a real bug distinct from the acknowledged multi-touch-
chords gap.

**Bug found and fixed: drag-strum state was a single shared boolean, not
tracked per pointer.** `pointerDown = true/false` was set by *any*
pointerdown/pointerup/pointerleave/pointercancel on the grove, regardless of
which finger/pointer fired it. A stray second contact --- a resting palm, an
incidental second finger --- releasing (`pointerup`) while a *different*
finger was still mid-drag would zero the shared flag and silently kill that
first finger's drag-strum for the rest of the gesture, even though it never
lifted. This is not the same thing as the "multi-touch chords" gap (playing
two notes deliberately at once): it's a single-finger interaction getting
corrupted by an unrelated, incidental extra contact --- a "there is no way to
play it wrong" violation on real touch hardware (tablets in particular,
where palm contact during a drag is common).

Verified live against the *built/preview* server (not `pnpm dev`, per the
existing Vite-HMR-reload lesson) using the established
oscillator-call-counting technique (patch
`AudioContext.prototype.createOscillator`, dispatch real `PointerEvent`s with
distinct `pointerId`s via `agent-browser eval`): pointerdown id=1 on chime0,
pointermove id=1 to chime1 (strikes, correct), pointerup id=2 (a *different*,
unrelated id simulating an incidental second contact), then pointermove id=1
to chime2 --- pre-fix this last move did NOT strike (oscillator count stuck
at 4); confirmed the bug. Fixed by replacing the boolean with
`activePointers: Set<number>`, keyed and cleared by `event.pointerId` on
every listener. Re-ran the identical scenario post-fix: chime2 now strikes
correctly (count rises to 6). Also re-verified the untouched case --- a
genuine same-pointer pointerup (id=1 lifting after its own drag) still
correctly stops *that* pointer's strikes, no regression on the ordinary
single-finger path. `pnpm check` (23 tests) and `pnpm check:audit` (100/100
Lighthouse a11y) both green after the fix. Committed as `e448212` and pushed
to origin (this repo's pattern has been to push every run, not just the
final one --- origin was already caught up to the previous run's commit
before this one).

As a side effect, this fix also makes independent simultaneous two-finger
dragging correctness-preserving (each pointer's own strikes are gated on
its own id now) --- but that's a byproduct of the correct fix, not a
deliberate attempt to close the acknowledged multi-touch-chords gap, which
remains genuinely unverifiable live in this environment (no forced-touch
dispatch outside the MCP `mobile` tools profile) and is still not something
to re-open as its own task.

Both preview and dev servers shut down at the end of this run; working tree
clean, pushed.

## Next action

Not this deliverable's final run yet. One more genuinely new bug closed this
run, via the technique of asking a fresh question of the event-wiring code
("what if an *unrelated* pointer fires mid-gesture?") rather than re-running
already-exhausted checks --- worth remembering that pattern (new question,
not new re-read) the next time a deepen pass risks going stale.

When a future run's prompt calls this deliverable's run "last":

- Write `PROCESS.md` for real (still the unfilled template). Cite at
  minimum: the bamboo-chimes build (`3fb5e9f`), the spec test (`f931494`),
  the audit-sensor addition (`1d0f942`...`d15af76`), the three earlier
  event-wiring fixes (double-strike `2b40af7` + pointercancel `aa6e9c8`
  sharing a root cause of incomplete event coverage; implicit-capture
  `7f8b527` as its own "don't trust event.target" shape), the wind-
  automation throttle (`52574b0`, unbounded resource growth), the two clean
  verification passes from two runs ago (node-lifetime GC, CDP page-freeze),
  and this run's per-pointerId drag-state fix (`e448212`) as the most recent
  example of the same "don't trust a single shared flag across independent
  event sources" family as the double-strike/pointercancel fixes.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then a finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords (deliberately playing more than one note at once via
  genuine simultaneous touches) remain an acknowledged, unclosable-to-verify
  gap in this environment --- don't re-open it as a task. This run's fix
  touches the same code area but is a correctness fix, not an attempt at
  that feature.
- Don't re-check the live-URL-is-404 thing as if it were new information.

If a future run needs a fresh angle before being called last: the technique
that worked this run --- re-read the event-wiring code asking "what
independent event source could corrupt this shared state" rather than
re-verifying an already-closed check --- is the one to reach for again
before concluding the deepen phase is dry. No other untried instance of that
question is known right now, but it's a better next move than inventing an
unrelated check.
