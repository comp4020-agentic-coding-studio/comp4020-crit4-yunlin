# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 141h to cutoff at the start of this
run. Still deepen phase, not the final run. Prior run (159h out) had played
the instrument thoroughly in a real browser and concluded its deepen list was
essentially exhausted, with one open question: whether a fresh pass would
find anything genuinely new before falling back to drafting finishing-step
files early.

It did. This crit never had the Lighthouse accessibility+performance sensor
that crit-1 and assignment-1 both wired up (see MEMORY.md's working-environment
bullet) --- checked and confirmed the gap was real (`ls scripts/`, `grep audit
package.json`) before treating it as work, per the standing "verify the
absence, don't assume it" deepen-phase habit. Ported `scripts/audit.ts` and
the `chrome-launcher`/`lighthouse` devDependencies from
`comp4020-ass1-yunlin`, adapted the header comment for this repo (no
aria-pressed/aria-live widget here, just the grove's aria-label/role/
aria-hidden markup), wired `check:audit` as its own package.json script (not
folded into `check` --- matches both prior repos' pattern, since it launches a
full Chrome instance and CI doesn't need to gate on it). Ran it: **100/100 on
both accessibility and performance**, first try, no defects found. Documented
the new sensor in this repo's `CLAUDE.md` under "The checks."

Commits this run:
- `1d0f942` --- audit.ts, package.json script wiring, lockfile
- `d15af76` --- CLAUDE.md documentation of the sensor

`pnpm check` (typecheck, build, 23 tests) and `pnpm check:audit` both green.
`pnpm check:evidence` still red as expected --- PROCESS.md and
`reflections/crit-4.md` are template boilerplate, which is correct for a
non-final run; that gate is the pre-ship check, not a mid-deepen requirement.

## Next action

Not this deliverable's final run yet. When a future run's prompt calls it the
last one:
- Write `PROCESS.md` for real, citing at minimum: the bamboo-chimes build
  (`3fb5e9f`), the spec test (`f931494`), and this run's audit-sensor addition
  (`1d0f942...d15af76`) as a "wiring a standing gap, not just retrying" moment
  --- same shape MEMORY.md already values.
- Write `reflections/crit-4.md` (150--300 words, the two standing prompts).
- Re-run `pnpm check` and `pnpm check:evidence` clean, then the finishing
  browser sweep (both viewports, console clean) before push.
- Multi-touch chords remain an acknowledged, unclosable gap in this
  environment (no real touch hardware, no agent-browser multi-touch
  primitive) --- don't keep re-opening it as a task.
- If a future deepen run finds the checklist dry again before the final run
  is called, that's still the signal to check rubric/spec text for a named
  scenario not yet tried (per the assignment-1 precedent), not to draft
  PROCESS.md/reflection early --- this run's actual new find (the audit gap)
  confirms fresh passes can still surface real, non-busywork checks this far
  out, so don't assume dry too early.
