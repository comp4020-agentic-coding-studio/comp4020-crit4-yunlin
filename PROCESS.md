# Process overview

## What I built

Bamboo chimes: seven tubes tuned to a five-tone (pentatonic) scale, each a
small physical model rather than a sample, so no two strikes and no two
players sound quite the same. A pointer or keyboard strike drives a
detuned/panned/randomly-timed pair of oscillators plus a noise transient
through a shared reverb bus; dragging across the grove also drives a
continuous "wind" layer (filtered noise) whose loudness and colour follow
pointer speed and height. The whole instrument lives on one opening screen,
per the brief's "the browser is the instrument" framing --- no second page, no
score, no fail state.

## The moments that mattered

1. **Two independently-correct listeners silently doubled every strike.** A
   delegated `pointerdown` handler (needed for drag-strum) and a per-button
   `click` handler (needed because keyboard Enter/Space dispatches `click`
   with no preceding `pointerdown`) both fired on every mouse/touch tap,
   since a tap synthesizes both events. Each handler was correct in
   isolation; the bug only existed in their combination, so 23 green vitest
   assertions and a clean `tsc`/build never caught it --- it's a timing/audio
   fact, not a type or DOM-shape one. Caught by patching
   `AudioContext.prototype.createOscillator` via `agent-browser eval` to
   count oscillators per gesture: a mouse click read 4 where keyboard Enter
   read 2 on the same build. Fixed by routing `click` through the same
   debounced path as `pointerdown`
   ([`2b40af7`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/2b40af7)).
2. **A pointer state machine is only as complete as its reset paths.** Two
   follow-up passes over the same drag-strum wiring found first that
   `pointercancel` (system-interrupted touch) had no listener, so a dropped
   touch left the drag flag stuck "down" and phantom-struck the next tube a
   bare `pointermove` crossed
   ([`aa6e9c8`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/aa6e9c8)),
   and then that the same flag was a single shared boolean rather than
   scoped per `pointerId`, so an unrelated second contact's `pointerup`
   (a resting palm) could end a different finger's still-active gesture
   ([`e448212`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/e448212)).
   Both were verified live by dispatching synthetic `PointerEvent`s with
   distinct ids/types through `agent-browser eval` and diffing the same
   oscillator-count technique before/after the fix --- this generalised
   cleanly across three separate bugs in the same event family.
3. **Continuous input needs an explicit throttle matched to what it drives,
   not just "call it when the value changes."** `updateWind` called
   `AudioParam.setTargetAtTime` directly from every `pointermove`; the Web
   Audio spec never prunes past automation events from a param's timeline,
   so a real 60--120Hz drag would schedule tens of thousands of never-pruned
   entries per minute. Confirmed by dispatching 200 synthetic moves in a
   tight loop and counting calls to the patched `AudioParam.prototype`
   method (400, unthrottled). Fixed with a 40ms throttle, comfortably under
   the param's own 0.12s/0.2s smoothing time constants so nothing audible is
   lost
   ([`52574b0`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/52574b0)).
4. **The same "don't trust an earlier scheduled callback" shape recurred
   outside audio, in CSS/timer land.** The strike-animation cleanup used a
   bare `setTimeout(() => classList.remove("struck"), 1600)`; a fast re-roll
   on one tube (outside the 90ms debounce, inside the 1.6s swing animation)
   left two overlapping timers, and the *earlier* strike's timer fired on
   schedule and cut the *later* strike's visible swing short. Confirmed live
   by clicking the same chime at t=0 and t=300ms and sampling
   `classList.contains("struck")` against the expected animation window.
   Fixed with a per-element generation token that a stale timer checks
   before acting
   ([`f8b490c`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/f8b490c)).

Beyond the fixes, a run of live checks came back clean and are recorded as
deliberate verification rather than left as assumptions: node-lifetime
garbage collection of per-strike oscillators (`FinalizationRegistry`), a real
CDP `Page.setWebLifecycleState` freeze/thaw cycle against the built preview
server, viewport resize mid-drag-strum, `prefers-color-scheme: dark`,
`prefers-reduced-motion: reduce`, keyboard-gesture audio unlock under the
autoplay policy, and back-forward-cache restore after a real history
navigation. The accessibility+performance audit sensor
([`1d0f942`](https://github.com/comp4020-agentic-coding-studio/comp4020-crit4-yunlin/commit/1d0f942))
scores 100/100 on the built `dist/`.

## Before you ship

`pnpm check` (typecheck, build, 23 vitest assertions) and `pnpm check:audit`
(Lighthouse, 100/100 accessibility) are both green on `dist/`. The bugs above
were never visible to either --- every one needed a live browser and a real
gesture, per the brief's own note that "latency, feel, whether a gesture is
expressive" don't show up in a test suite or a Lighthouse score.
