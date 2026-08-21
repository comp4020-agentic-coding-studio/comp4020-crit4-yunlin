# Hand-off

## State

comp4020-crit4-yunlin ("An instrument"), 117h to cutoff at the start of this
run --- not called the final run. Working tree was already clean; `pnpm
check` (typecheck, build, 23 tests) stayed green with no drift, so this run
made no commits.

Per the standing "reread the brief for an untested scenario before declaring
the deepen list dry" habit, ran two new live-browser checks rather than
re-verifying old ones:

- **Touch-capable viewport.** `agent-browser set device "iPhone 16"` (the
  CLI has no dedicated touch-dispatch subcommand outside MCP's `mobile`
  profile) then struck a chime at 393x852. Confirmed the AudioContext
  resumes and no console errors fire at mobile viewport size. Checked
  `main.ts` first: the pointer/click handlers never branch on
  `event.pointerType`, so a real touch tap (which Chrome resolves to the
  same `pointerdown`/`click` events already exercised) doesn't need a
  separate code path tested --- concluded this before spending more effort
  trying to force genuine CDP touch dispatch through this CLI.
- **Resize mid-interaction.** Struck a chime at the mobile viewport, then
  `agent-browser set viewport 1920 1080` on the *same live session* (no
  reload), then struck both edge chimes (note 0 and note 6, the widest pan
  extremes). Audio kept running, no console errors, both edge chimes
  panned correctly post-resize --- expected, since `playChime` reads
  `getBoundingClientRect()` live at strike time rather than caching layout,
  but worth the same live confirmation the rubric-scenario lesson in
  MEMORY.md names generically (resize mid-interaction) and this repo
  specifically hadn't logged before.

One false alarm caught and resolved before logging anything as a bug: a
post-resize screenshot showed the last-struck chime (note 6, the shortest
tube) rendering solid dark with no visible lighter gradient at its base,
unlike its neighbours. Inspected computed styles first (identical gradient
stops on all seven chimes, `.struck` class already cleared) rather than
assuming a real defect. The actual cause: the simulated mouse cursor was
still resting on that chime from the preceding click, so `:hover`
(`opacity: 1`) removed the alpha-blend with the pale page background that
makes every other tube's lighter gradient read as "lighter" at the default
`opacity: 0.82`. Moving the mouse away and reshooting confirmed all seven
tubes render identically. Same family as the sway-on-strike false alarm
already in MEMORY.md (screenshot artifact from transient interaction state,
not a rendering bug) --- this time the transient state was cursor hover, not
animation-in-progress. Worth remembering as a second concrete cause of that
same failure shape.

`pnpm check:evidence` still red as expected --- PROCESS.md and
`reflections/crit-4.md` are template boilerplate, correct for a non-final
run.

## Next action

Not this deliverable's final run yet. When a future run's prompt calls it
the last one, the plan already logged holds:

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

If a future deepen run finds the checklist dry yet again: the genuinely-new
finds across recent runs (audit sensor, reduced-motion, keyboard-gesture-
unlocks-audio, touch-viewport, resize-mid-interaction) all came from
rereading the brief/spec/CSS/JS for a scenario not yet manually driven in a
browser, not from re-running old checks. This run's find was resize
mid-interaction plus confirming no `pointerType` branching exists in
`main.ts` (so mouse-driven pointer tests already generalise to touch).
Genuinely-untested categories left, if another non-final run lands here:
whether `prefers-color-scheme: dark` does anything visible (the site has no
dark-mode CSS at all --- worth confirming that's a deliberate absence, not
an oversight, before the final run, the same "verify the absence is real"
discipline as the favicon check in MEMORY.md); and a check of what happens
if the tab loses focus/visibility mid-strike (`visibilitychange`) given the
continuous wind-noise loop in `main.ts` --- neither has been tried yet.
