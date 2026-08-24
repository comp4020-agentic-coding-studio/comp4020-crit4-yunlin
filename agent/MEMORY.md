# MEMORY

Durable self-knowledge, curated run by run; ephemeral state belongs in
`now.md`, not here.

## Aesthetic throughline

Crit 1 (comp4020-crit1-yunlin) established a voice worth carrying forward
where a brief leaves the look open: pre-CSS/brutalist restraint --- system
serif, paper-toned background, classic blue links, one colour held back for a
single accent --- argued through content, not just applied as a skin. That
crit's site is a shrine to Ni Zan (倪瓒), the painter this agent is named
after; the pairing of "sparse ink-wash, empty paper, almost no figures" with
"taste is what you leave out" is this agent's own idea and can be reused as a
lens (not necessarily the literal content) when a future brief's subject
matter is open-ended.

Crit 2 (comp4020-crit2-yunlin, "unsolicited redesign" --- content given, look
open) confirmed the lens travels: kept system serif / paper tone / classic
blue, but the single accent colour became a "seal stamp" (one red, used for
exactly two things: a kicker line and the current-nav underline), argued in
that crit's colophon as the ink-wash equivalent of a single red seal on an
otherwise monochrome scroll. The throughline isn't "reuse Ni Zan content"
--- it's "one held-back accent colour, justified by an ink-wash logic, argued
in prose the site itself carries (usually a colophon page)." Reuse that
pattern, not the specific seal/scroll framing, when a future brief again
leaves the look open.

Crit 4 (comp4020-crit4-yunlin, "an instrument" --- a browser-based musical
instrument, first genuinely non-document brief) confirmed the lens survives
the jump from prose/document sites to an interactive, sound-making page: kept
paper tone, system-serif stack, and the single held-back accent (`--seal`,
the same muted red), but reused it for a single *meaning* --- "this tube is
sounding" --- rather than two fixed roles, since a one-page instrument has no
kicker line or nav underline to hang the pattern on. Worth noting for the
next brief that isn't document-shaped: the pattern generalises as "the
accent marks one recurring event/state in the interaction," not just "two
named UI elements," and it's fine for that one meaning to touch more than
two DOM locations (here: strike glow, focus ring, favicon) as long as they
all mean the same thing. No colophon page was written to carry the prose
argument this time --- the brief's spec explicitly wants a single opening
screen that is the whole instrument, and a second page would cut against
"the browser is the instrument" rather than support it. The argument instead
lives in `PROCESS.md`/the reflection, not in the shipped site --- a
different split from crits 1--2 that future weeks should expect whenever the
brief itself asks for minimal chrome, not just an open-ended look.

## Content practices

When prose makes a specific, checkable claim --- a date, a name, an
attribution, a "this page does X" claim about the site itself --- verify it
before shipping rather than trusting memory or a first draft. Crit 1 caught
three, in two distinct categories:

- **Self-referential claims about the site's own markup/design**, checkable
  against the code on the same page: `colophon.html` claiming a motif ran on
  every page when it only existed on one (checked against the rendered
  site), and later claiming its own SVG motif was "three horizontal lines"
  when it's actually one horizontal line plus five vertical strokes (checked
  by counting the `<line>` elements two paragraphs above the claim). Both
  were caught on separate passes despite the SVG source sitting right there
  --- a design self-description needs the same scrutiny as a historical one,
  and doesn't get caught by proofreading for rhythm or by fact-checking
  external claims, since it's neither.
- **External historical/factual claims**: `rongxi.html` misattributing a
  painting's dedication (checked against China Online Museum / NPM
  exhibition notes, not memory). `ni-zan.html`'s biography (birth year/place,
  courtesy name Yuanzhen, the ~1352 property-giveaway timing relative to the
  Red Turban Rebellion, the "yi qi" colophon philosophy) got the same
  treatment a few runs later, against Britannica, China Online Museum, and
  a third independent source (Ink & Brush) --- and checked out clean, no fix
  needed. Worth noting: this page had never had an explicit fact-check
  logged before, despite being the most fact-dense page in the site and
  present since the very first build commit --- it's easy to fact-check the
  page a bug was already found on and assume the others are fine by
  association.

All three were plausible-sounding and all were wrong. Worth a deliberate pass
of *both* kinds whenever a future brief's content leans on factual detail or
describes its own design --- treat "here's what this page/motif/layout does"
as its own checkable-claim category, not a subset of proofreading.

Crit 2 added a fourth failure shape to watch for: **the same fact stated
twice with two different numbers, neither one wrong in isolation.**
`index.html` said TUG's typesetting system was "45-year-old"; `tex.html`'s
meta description said it was "still used forty years on" --- both about the
same 1978 start date, on the same site, five years apart from each other.
Neither claim looks wrong read alone (a fresh single-page proofread would
pass both), and it isn't the "wrong count on one page" shape from crit 1
either --- it only surfaces by holding two pages' claims about the same fact
next to each other. Fixed by rewording both to non-numeric "decades-old" /
"decades on," per the existing lesson below that a loose term is safer than
a specific number when the number is going to keep drifting anyway (here,
against each other, not just against the calendar). Worth a deliberate
cross-page pass --- not just per-page --- whenever content repeats the same
fact (an age, a count, a date) more than once across a multi-page site.

Not every self-referential claim is a bug waiting to be found, though, and
it's worth telling the two failure modes apart. `colophon.html`'s "Type is
the system serif" describes an ordered fallback stack
(`Georgia, "Times New Roman", Times, serif`) rather than the bare `serif`
keyword --- but "system serif" is standard shorthand for "no webfont, use
whatever serif the OS has," which an ordered stack is exactly how you
implement portably. Judged this a defensible use of shorthand, not a false
claim, and left it alone after two passes considered it. Contrast with a
fourth self-referential check this same crit: "drawn once and repeated on
every page" (colophon.html, about its own motif), verified by diffing the
SVG block across all four pages --- genuinely identical, so this one checked
out true. The lesson: checkable design-claims are worth verifying against
the code every time, but verification sometimes confirms the prose rather
than correcting it, and a specific count or coverage claim (wrong twice
here) is a different risk level than a loose descriptive term like "system"
or "a handful" (not wrong, just imprecise by design).

## Redesign-brief practice (crit 2)

When a brief hands the agent someone else's real content to restructure
(crit 2's "unsolicited redesign" of a real organisation's site), the
content-practices discipline above --- verify, don't trust memory or a first
draft --- extends to *sourcing*, not just claims already drafted. Picking
tug.org (TeX Users Group) as the target, every fact used (founding year,
Knuth's `Art of Computer Programming` history, the postal address, membership
aims) was pulled by `curl`-ing the organisation's real pages directly and
reading the raw HTML, not from a `WebSearch`/`WebFetch` summary of the site.
Two reasons this mattered here specifically: `WebFetch` returned a flat 403
on tug.org (some sites block it outright, so it can't always be reached even
if you wanted the shortcut), and a search engine's paraphrase of "what the
site is like" is already one layer of restructuring removed from the ground
truth a redesign brief is asking the agent to improve on honestly. `curl` on
the same URL worked fine. Worth trying `curl` before concluding a page is
unreachable, and worth doing so anyway even when `WebFetch` succeeds, since a
redesign's whole premise depends on the *original* being read accurately, not
summarized.

A second lesson from the same crit: **picking the subject is itself a design
decision**, not a precondition to design. Choosing an organisation whose own
mission (typesetting quality) makes the redesign's thesis checkable and a
little ironic (their site about good typesetting isn't itself well-typeset)
did real argumentative work that a safer, more generic choice (a local café,
a gym) wouldn't have. Worth spending real deliberation on the subject choice
itself next time a brief leaves it open, rather than treating it as a fast
precursor to the "real" work of building.

## Deepen-phase practice

Once content and rendering checks are both settled and read passes hit
diminishing returns, the temptation in a long deepen phase (days of >24h-out
runs with nothing newly broken) is either to manufacture a redundant pass or
to declare victory. A third option earned its keep in crit 1: re-read the
whole site fresh looking for a real, checkable *absence* rather than a wrong
claim --- a spec line the site asserts about itself ("a committed visual
style") that isn't actually backed up anywhere (crit 1: no favicon, every
tab silently using the browser default). The habit that keeps this from
becoming its own busywork: verify the absence is real before spending a
commit on it, the same "check it, don't assume it" discipline as the content
practices above, applied to gaps instead of claims --- `curl` the built site
for the missing asset (favicon.ico 404 confirmed) and check `agent-browser
console` to confirm it wasn't already failing a stated bar (no console
error logged, so this was polish, not a regression). Cheap to check, and
it's the difference between a genuine improvement and inventing work to
look busy.

Crit 2 hit the exact same absence --- no favicon, confirmed missing from
every page's `<head>` before adding one --- which makes it worth promoting
from "a thing crit 1 happened to find" to a standing item on the deepen-phase
absence-check for this starter template specifically: it doesn't ship one,
and it's cheap enough (one small SVG reusing the site's own accent colour,
one `<link rel="icon">` per page) to just check and fix routinely rather than
wait to rediscover it each time.

Assignment 1 (comp4020-ass1-yunlin, a gerrymandering explainer) hit it a
third time, in a different repo built from the same starter --- confirms
this is a property of the starter template itself, not something specific
to the crit repos, so check for it on every deliverable built from this
template, assignments included. Fixed the same way: an SVG favicon that
reused the site's own two accent colours already in `styles.css`
(`--party-a`/`--party-b`, a 60/40 pie split matching the fixed vote share
the mechanic is about) rather than inventing a new colour, one `<link
rel="icon">` in the single `index.html`.

A related question that comes up once the absence-check is also exhausted:
whether to widen scope, since a brief that only asks for "a handful of
pages" rarely sets a hard ceiling. For crit 1 the answer was no --- the
site's own thesis is "taste is what you leave out," so padding it with more
pages for the sake of having more would undercut the argument the site
makes about itself rather than strengthen it. Restraint-themed work has an
unusually low scope-creep ceiling: check what the site is *arguing*, not
just what the brief technically permits, before treating "I could add more"
as a deepen-phase task.

The 24h finishing-steps threshold in the doctrine is a guideline for a
judgment call, not a literal clock to wait out. Crit 1's last few deepen
runs (28h down to ~39h out) had already exhausted both the content
read-passes and the absence-check, to the point that `now.md` itself
flagged repeating the same "not enough time elapsed" due-diligence check
every run as the busywork the deepen phase warns against. At 28h --- close
to but technically still outside the 24h mark --- the right call was to
start the finishing steps anyway (reflection, final sensor sweep, browser
pass at both viewports, commit, push) rather than run one more no-op pass
waiting to cross the line. The tell: if a fresh deepen-phase pass would
have nothing new to check, that's the signal to finish early, not a reason
to wait for the threshold to become literally true.

When several consecutive deepen runs on the same deliverable have already
re-checked source, links, audits and a manual keyboard pass with nothing new
turning up (assignment 1, ~117h out, after two prior runs found nothing),
the rubric itself is a source of genuinely new, non-redundant checks: its
HD band for the artefact criterion named a specific scenario --- "holds up
under use it wasn't designed for: the keyboard, a resize mid-interaction, a
slow connection" --- that hadn't been tested yet, distinct from the earlier
keyboard-only pass. Ran it with `agent-browser`: selected a district,
redrew one cell, resized the live session from 1920x1080 to 390x844
mid-interaction (`agent-browser set viewport`, no reload), and confirmed
the redrawn cell kept its new district state and styling, the mechanic
still worked post-resize, and Tab/Enter still moved focus onto the correct
rebuilt button afterward. All held up; nothing to fix, but it closed a real
verification gap the rubric explicitly names rather than repeating a check
already known to be green. Worth doing this --- reread the marking bands
themselves for a named scenario not yet tried --- before declaring a
deepen phase truly dry, on any future deliverable whose rubric spells out
specific resilience scenarios.

## Working environment

- **Making a deliverable repo public / turning on GitHub Pages is not this
  agent's job.** The doctrine is explicit: "the trusted harness scans,
  publishes, deploys and freezes the exact commit you pushed; you never
  receive its GitHub credential." Confirmed concretely in assignment 1 at
  111h out: `gh auth login` is unconfigured in this environment, so there's
  no credential to act with even if the doctrine didn't already say not to.
  A prior `now.md` draft drifted into treating "make the repo public per the
  submission mechanism" as a finishing step for this agent to do —
  corrected; my job stops at a clean, pushed commit. Worth re-checking this
  file against the doctrine text if a future `now.md` hand-off ever again
  implies publishing/deploying is something to act on directly.
- A fresh shell needs `mise trust /home/ben/.config/mise/config.local.toml`
  before any `pnpm`/mise-shimmed command works --- it errors with "not
  trusted" otherwise. Safe to trust; it only holds low-stakes env vars per
  Ben's global CLAUDE.md.
- `agent-browser`: launching with `--width`/`--height` on the *first* open of
  a session reliably times out on `Page.navigate` (Chrome also needs `--args
  "--no-sandbox"` in this container). Reliable sequence: `open <url>` once
  with no size args to get a live session, then `agent-browser set viewport
  <w> <h>`, then `open <url>` again --- that combination actually changed
  `window.innerWidth`/`innerHeight` in testing, unlike passing size flags to
  `open` directly.
- This template's stylelint config (`stylelint-config-standard`) wants
  **range context** media queries (`(width <= 480px)`, not `(max-width:
  480px)`) and the **shortest valid hex** for colours (`#00e` not `#0000ee`)
  --- catches these on the first `pnpm check`, not before. Worth writing CSS
  with both in mind from the start in future weeks using the same template.
- Same config's `no-descending-specificity` rule fires on **source order
  relative to specificity**, not on any one rule being invalid: a plain-element
  selector (`a`, `footer a`) written *after* a higher-specificity one
  (`.site-title a`, `a:visited`) that touches the same property fails, even
  across unrelated sections of the file, and `vite build` succeeds while it
  does. Crit 2's stylesheet hit this three times in one `pnpm check` run
  because element selectors (`a`, `h1`, `p`) were interleaved after
  class/attribute selectors. Fix: order the whole file low-to-high specificity
  --- bare elements first, then layout containers, then component
  classes/attribute selectors last --- from the first draft, not as a
  post-hoc reorder (fixing one error exposes the next, one at a time).
- `pnpm add` can fail with `ERR_PNPM_UNEXPECTED_STORE` (store at
  `~/.local/share/pnpm/store/v11` vs a project-local one it wants to switch
  to) --- fixed by pinning the existing store. The specific path varies by
  repo (each repo's own `node_modules` records which store it was installed
  against, and pnpm's error message names the one it wants): assignment 1
  needed `--store-dir /home/ben/.local/share/pnpm/store/v11`, but crit 4
  needed the opposite direction, a *repo-local*
  `.local/share/pnpm/store/v11` under the checkout itself --- read the
  `ERR_PNPM_UNEXPECTED_STORE` message's own two paths rather than assuming
  either direction from memory.
- Lighthouse accessibility/performance audits don't need a second browser
  install: `chrome-launcher`'s `launch({ chromePath })` can point straight at
  the Chrome binary `agent-browser` already keeps at
  `~/.agent-browser/browsers/chrome-<version>/chrome`, with flags
  `["--headless=new", "--no-sandbox", "--disable-gpu"]`. Used this in
  crit-1's `scripts/audit.ts` to wire the accessibility+performance sensor
  the starter template names but doesn't provide --- worth reusing whenever a
  future week's template has the same gap. Ported directly into assignment
  1's `scripts/audit.ts` (same script, `check:audit` script name, same two
  new devDependencies) and it paid for itself immediately: first run found
  two real defects a green `pnpm check` and a manual `agent-browser`
  keyboard pass had both missed (see the next bullet, and the label-mismatch
  one below) --- worth running once any widget has custom ARIA, not only
  once per template as a box-ticking exercise. Ported a third time into
  crit 4 (bamboo chimes) at 141h out, mid-deepen, specifically because a
  fresh "is the deepen list really dry" pass found this sensor had never
  been wired for that repo at all --- and this time it came back **100/100
  clean on the first run**, no defects. Worth recording the null result
  alongside the two positive ones: the pattern is worth porting on its own
  terms (a real accessibility+performance sensor a green `pnpm check`
  doesn't provide), not just because it has a track record of finding bugs
  --- a clean result is still a genuine check discharged, not evidence the
  porting was wasted effort.
- Lighthouse/axe's `label-content-name-mismatch` check treats **any**
  `aria-hidden="true"` DOM text node as a "visible label" that must be
  echoed in the element's accessible name --- being `aria-hidden` doesn't
  exempt it, even though that same text is (correctly) excluded from the
  accessible name computation itself. Assignment 1 had per-cell party
  letters and district-number badges as `aria-hidden` spans purely for
  sighted-user visual reinforcement (the full description already lives in
  the button's `aria-label`), and every one of the 50 grid cells failed the
  check. Fix: move that decorative text out of DOM text nodes entirely into
  CSS generated content (`content: attr(data-party)` / `attr(data-district)`
  via `::before`/`::after`) --- generated content isn't part of
  `textContent` so the check no longer sees it, and it's a more accurate
  model of what that text always was (decoration, not an independent
  label). Contrast colour failures on the same audit run are the plainer
  case: `--party-a`/`--party-b` text at 4.18:1/3.74:1 against the page
  background were both under WCAG AA's 4.5:1 floor for bold body text;
  darkening the same hue (keep favicon/JS colour constants in sync if a
  favicon or canvas fill duplicates the CSS custom property in hex) is the
  whole fix. Worth checking both audits on any widget with custom ARIA or
  a light-background accent colour, even after a clean manual pass ---
  they catch a different failure family than a keyboard walk does.
- `agent-browser find text "<X>" click` matches whichever element contains
  that text first, silently, with no error if it's the wrong one --- in
  assignment 1 it clicked a `<strong>B</strong>` in a paragraph instead of a
  grid cell whose visible letter was also "B", and the resulting screenshot
  looked identical to before, reading as "nothing happened" when actually a
  different click just landed. `agent-browser snapshot` (accessibility-tree
  dump with `[ref=eN]` ids) followed by `click "ref=eN"` is the reliable
  pattern once a page has more than one element sharing visible text ---
  re-run `snapshot` after any render that could have replaced the DOM, since
  a stale ref fails to resolve rather than clicking the wrong thing.
- **jsdom does not model keyboard-focus loss on DOM-node removal the way a
  real browser does.** A widget whose click handler does
  `container.innerHTML = ""` and rebuilds children (a common pattern for
  "re-render on state change") will silently drop focus to `<body>` in
  Chrome on every click --- but a jsdom-based interaction test that only
  asserts the resulting DOM state (text, aria-labels, attributes) stays
  green straight through that regression, since jsdom's activeElement
  behaviour around removed nodes doesn't reproduce the real-browser gap.
  Assignment 1's `spec/interaction.test.ts` was fully green while the live
  page bounced a keyboard user back to the top of the document after every
  click. Only caught by manually driving the dev server with `agent-browser`
  (`press Tab`, `press Enter`, then reading `document.activeElement`) rather
  than trusting the automated suite. Any future widget with a
  rebuild-on-click render pattern needs this specific manual keyboard check
  --- it is not a case automated jsdom tests can substitute for, however
  thorough the assertions.
- **`:nth-child` miscounts the moment a decorative, non-repeating sibling
  sits among the repeated items it's meant to style.** Crit 4's chime rack
  had a `<div class="beam">` as the grove's first child before seven
  `<button class="chime">` siblings; `.chime:nth-child(2)` through `(8)` was
  meant to give each button a distinct height but every index was off by
  one, so the wrong buttons got the wrong heights. `tsc`, `vite build` and
  the vitest suite all stayed green --- nothing about that bug is
  type-checkable or assertable from markup structure, it's purely a rendered
  proportions bug --- and it was only visible once actually screenshotted in
  a browser (per the standing "open it and look" practice). Fixed by
  dropping the sibling-counting selector entirely: an inline
  `style="--h: 88%"` custom property per button plus one CSS rule
  (`height: var(--h, 100%)`) is both more robust (survives a sibling being
  added/removed/reordered) and easier to read than any `:nth-of-type` fix.
  Prefer explicit per-element custom properties over `:nth-child`/
  `:nth-of-type` arithmetic for per-item variation whenever the list of
  repeated elements might have any non-repeating sibling nearby (a
  decorative wrapper, a label, a beam) --- don't wait for the visual bug to
  reintroduce the lesson.
- `agent-browser drag <src> <dst>` (CSS selectors, not refs) drives a real
  pointer-down/move/up sequence across two elements in one call --- useful
  for exercising a continuous multi-target gesture (crit 4's drag-strum
  across four chime buttons) without hand-rolling `move`/`down`/`up`
  primitives, which this CLI's `--help` doesn't actually expose as separate
  subcommands despite mentioning them in usage text.
- A screenshot taken immediately after a gesture on a *physically-modelled*
  (not just CSS-transitioned) widget can look broken purely from timing, not
  from a real bug. Crit 4's drag-strum screenshot showed the struck tubes
  visibly skewed/leaning --- read at first glance as a stuck transform --- but
  a second screenshot ~1.5s later showed them settled back to vertical: a
  deliberate sway-on-strike animation, not stuck state. The fix for that
  false alarm was "wait and reshoot," not "go read the animation code."
  Worth a deliberate pause-and-reshoot before logging any visual anomaly as a
  bug on a widget whose whole point is a continuous physical decay/settle
  curve rather than a snap transition.
- `agent-browser set media light reduced-motion` emulates
  `prefers-reduced-motion: reduce` on a live session; combined with a
  strike/click and an `eval` reading `matchMedia(...).matches`,
  `getComputedStyle(...).transitionDuration`/`.animationName`, and the
  `errors`/`console` output, it's a direct way to confirm a
  `@media (prefers-reduced-motion: reduce)` CSS block actually disables the
  motion (crit 4: `styles.css`'s block zeroed transition/animation as
  expected) without silently breaking the interaction path it decorates
  (the chime's strike-to-sound handler fired with no errors, class still
  applied). A CSS media query's mere presence in the stylesheet --- which a
  build/lint pass can already confirm --- doesn't tell you the reduced path
  still works end to end; worth this specific browser check on any widget
  that both animates on interaction and makes sound or changes state on
  that same interaction.
- A DOM test confirming a control is a real `<button>` (keyboard-focusable
  by markup) is not the same claim as "a keyboard user can actually trigger
  the sound," whenever the sound is gated behind the Web Audio autoplay
  policy ("the context starts suspended until a user gesture resumes it").
  jsdom has no autoplay policy to violate, so `spec/instrument.test.ts`
  passing on chime buttons being real `<button>` elements says nothing
  about whether a real browser treats an Enter/Space-triggered click as the
  qualifying gesture. Checked live in crit 4: wrapped the `AudioContext`
  constructor via `agent-browser eval` to capture the instance
  (`window.AudioContext = function(...a){ const c = new orig(...a); window.__ctx
  = c; return c }`), tabbed to a chime, pressed Enter, read
  `window.__ctx.state` --- `"running"`, no console errors; repeated with
  Space on a second chime, `.struck` class applied too. Clean result here,
  but worth the same live check (not just the structural DOM test) on any
  future instrument/game brief that both requires keyboard operability and
  gates its first sound behind a user-gesture-unlocked `AudioContext`.
- **Before manufacturing a touch-specific manual test, check whether the code
  branches on `event.pointerType` at all.** This CLI has no dedicated
  touch-dispatch subcommand outside the MCP `mobile` tools profile ---
  `agent-browser set device "<name>"` changes viewport/UA but not
  `navigator.maxTouchPoints`/`ontouchstart`, so a genuine CDP touch event is
  awkward to force through the plain CLI. Checked crit 4's `main.ts` first:
  its pointer/click handlers never branch on `pointerType`, so a mouse-driven
  `pointerdown`/`click` (already exercised elsewhere) exercises the identical
  code path a real touch tap would. Concluded touch playability didn't need
  a separate forced-touch test rather than spending more effort trying to
  fake one --- worth this same "read the handler for a pointerType branch
  first" check before treating "I can't easily emulate touch" as a
  verification gap that needs closing by force.
- **A fixed-palette page's dark-mode "absence" and a Web-Audio page's
  tab-hidden behaviour are both worth checking live rather than reasoning
  about from the source alone, even when the code gives a strong hint of
  what will happen.** Crit 4 had neither a `prefers-color-scheme` media
  query nor a `visibilitychange` handler, and reading `styles.css`/`main.ts`
  suggested both were fine: colours are hardcoded custom properties
  (`--paper`/`--ink`) rather than referencing system colours, so nothing
  should respond to an OS dark-mode toggle; and strike envelopes are
  scheduled with `AudioParam` automation on the audio thread, not
  `setTimeout` on the main thread, so background-tab timer throttling
  shouldn't matter. Confirmed both live rather than trusting the reasoning:
  `agent-browser set media dark` plus a screenshot showed identical
  paper-toned rendering and unchanged `getComputedStyle` body colours (the
  absence is a deliberate part of the paper-tone aesthetic, not an
  oversight); overriding `document.hidden`/`visibilityState` and dispatching
  `visibilitychange` mid-strike (via a patched `window.AudioContext` capturing
  the instance, same technique as the keyboard-gesture check already logged
  here) kept `audioCtx.state` at `"running"` throughout with no console
  errors, and a fresh strike after restoring visibility still fired clean.
  Worth the live check specifically because "the code suggests X should be
  safe" and "X is confirmed safe" are different claims, and the live check
  is cheap once the AudioContext-patching technique already exists.
- **A hovering simulated cursor is a second concrete cause of the
  "screenshot looks broken right after a gesture, but isn't" false-alarm
  shape**, distinct from the sway-in-progress one already logged above. Crit
  4's shortest chime tube rendered solid dark with no visible lighter
  gradient at its base right after being struck, unlike its neighbours ---
  looked like a real rendering bug at a glance. Checked computed styles
  first (identical gradient stops on every tube, `.struck` class already
  cleared): the actual cause was the CDP-driven mouse cursor still resting
  on that tube from the preceding click, so `:hover` (`opacity: 1`) removed
  the alpha-blend with the pale page background that makes every other
  tube's lighter gradient read as "lighter" at the default `opacity: 0.82`.
  `agent-browser mouse move` to a neutral point and reshooting confirmed all
  tubes render identically. Worth moving the simulated cursor away before
  screenshotting any hover-sensitive widget, and worth checking computed
  styles (not just re-reading animation code) as the first diagnostic step
  when a screenshot looks wrong right after a click.
- **Two independently-correct event listeners on the same interaction can
  silently double-fire it, and nothing structural catches this.** Crit 4's
  chime grove had a delegated `pointerdown` listener on the container (via a
  debounced `maybeStrike`, needed so drag-strum could hit multiple tubes on
  `pointermove`) *and* a plain `click` listener on each button calling
  `playChime` directly (needed because keyboard Enter/Space dispatches
  `click` with no preceding `pointerdown`). Every mouse or touch tap fires
  both `pointerdown` *and* a synthesized `click`, so every tap struck the
  chime twice --- two overlapping, independently-detuned/panned notes
  instead of one, audible as a flam rather than a clean strike. Each
  listener was individually reasonable and individually correct in
  isolation; the bug only exists in their combination, which is exactly why
  `tsc`, `vite build`, and 23 green vitest assertions (none of which drive a
  real click-then-keyboard-focus sequence through both paths) never caught
  it, and neither did any prior manual pass, because a single manual click
  sounds fine unless you're specifically listening for a doubled note.
  Caught by patching `AudioContext.prototype.createOscillator` via
  `agent-browser eval` to count calls per gesture (this instrument's
  `strike()` creates exactly 2 oscillators per note): a mouse click read 4
  (double-strike) where keyboard Enter read 2 (correct) on the same build.
  Fixed by routing the `click` listener through the same debounced
  `maybeStrike` instead of calling `playChime` directly, so a tap's own
  `pointerdown` suppresses its later synthesized `click` while a bare
  keyboard `click` (no preceding `pointerdown` in the debounce map) still
  fires once. General lesson: whenever a widget wires *both* a delegated
  pointer listener (for drag/multi-target gestures) *and* a per-element
  `click` listener (for keyboard activation) on the same control, check for
  double-firing on a plain click/tap specifically --- the
  oscillator-call-counting technique generalises to any Web Audio instrument
  by patching whatever node-creation call is unique-per-strike and diffing
  the count between a mouse gesture and a keyboard gesture on the same
  control.
- **A pointer-drag state machine that resets on `pointerup`/`pointerleave`
  but not `pointercancel` will get stuck "down."** Two runs after the
  double-strike fix above, re-reading the same grove's drag-strum wiring
  (a local `pointerDown` boolean gating whether `pointermove` counts as a
  strike) found a second bug in the same event set: `pointercancel` --- the
  event a touch fires when the system interrupts it mid-gesture (a
  notification swipe, an incoming call, palm rejection) *instead of*
  `pointerup` --- had no listener, so `pointerDown` stayed `true` forever
  once that happened. The next bare `pointermove` over any untouched tube,
  with nothing actually pressed, then read as an in-progress drag and
  phantom-struck it. Confirmed with the same oscillator-count technique:
  dispatch real `PointerEvent`s (`pointerdown` on tube A, `pointercancel`,
  then a bare `pointermove` on never-struck tube B) and diff the count
  before/after the fix (2 → 4 broken, 2 → 2 fixed). Fixed by adding a
  `pointercancel` listener mirroring the existing `pointerup`/`pointerleave`
  ones. General lesson, generalising the double-strike one above: an
  interaction state machine driven by DOM events is only as complete as its
  *reset* paths, and `tsc`/build/vitest can't see a missing one --- when a
  boolean gates behaviour across a pointer gesture, explicitly enumerate
  every event that should end the gesture (`pointerup`, `pointerleave`,
  *and* `pointercancel` at minimum) rather than reasoning from the "happy
  path" events alone, and worth the same live re-read/probe pass on any
  future pointer-driven widget in this repo family, not just this one.
- **That same boolean must also be scoped per `pointerId`, not shared
  globally, or an unrelated pointer's end-of-gesture event corrupts a
  different pointer's still-active gesture.** A third pass over the same
  drag-strum wiring, well after the double-strike and pointercancel fixes
  above were both closed and the deepen list had been declared dry, asked a
  different question of the same code --- not "which events are missing" but
  "what if a *second, unrelated* pointer fires one of the events this code
  already listens for?" `pointerDown = true/false` was set by *any*
  pointerdown/pointerup/pointerleave/pointercancel on the container,
  regardless of whose pointer fired it: a resting palm or an incidental
  second finger releasing mid-drag zeroed the shared flag and silently ended
  a *different*, still-down finger's drag-strum for the rest of the gesture.
  Confirmed with the same oscillator-count technique, this time dispatching
  two distinct `pointerId`s: pointerdown id=1, pointermove id=1 (strikes,
  correct), pointerup id=2 (a different id), pointermove id=1 (pre-fix: no
  strike, count stuck; post-fix: strikes, count rises) --- and re-checked
  that a genuine same-id pointerup still correctly ends *that* pointer's own
  gesture, no regression. Fixed by replacing the boolean with a
  `Set<number>` of active pointer ids, added/removed by `event.pointerId` on
  every listener. General lesson, sitting one level above the pointercancel
  fix's "enumerate every reset event": a boolean shared across *all*
  pointers conflates "my gesture ended" with "some gesture ended," and the
  fix for one doesn't fix the other --- once a widget's event set is
  confirmed complete (every reset path enumerated), still check whether the
  state those events flip is scoped to the pointer that fired them. This
  bug shape also survived two entire prior "declare the deepen phase dry"
  hand-offs undetected, because both previous passes re-verified *already-
  found* angles rather than asking a genuinely new question of the same
  code --- worth remembering that "re-read with a different question" can
  out-perform "re-verify the existing checklist" once a deepen phase
  otherwise reads as exhausted.
- **Touch pointers get implicit pointer capture on `pointerdown`: `event.target`
  in later `pointermove`s stays pinned to the element first touched, even as
  the finger slides onto a sibling** --- distinct from the two event-*absence*
  bugs above (this one fires on every touch drag, not an edge-case event).
  Crit 4's drag-strum read `event.target` off the `pointermove` event to
  decide which tube to strike next; on a real touchscreen this would never
  see a different tube once the finger moved off the one it started on,
  because capture keeps re-targeting events at the original element
  regardless of where the finger physically is (mouse pointers aren't
  captured this way, so a mouse-driven manual pass over this exact code
  wouldn't have surfaced it). Confirmed via `WebSearch` against MDN/W3C
  spec text and the `openseadragon`/Mozilla bug trackers before treating it
  as real, then verified live: patched `AudioContext.createOscillator` to
  count (same technique as the double-strike/pointercancel fixes),
  dispatched a real `pointerdown` on tube 0, then a `pointermove` **also
  dispatched on tube 0** (simulating capture) but with `clientX`/`clientY`
  over tube 1 --- oscillator count rose from 2 to 4 and the `.struck` class
  landed on tube 1, confirming `document.elementFromPoint(event.clientX,
  event.clientY)` (which re-does hit-testing at the real coordinates,
  ignoring capture) fixes it where `event.target` couldn't. Checked the
  target buttons were childless (`<button class="chime">`, no descendant
  spans/svgs) before relying on `elementFromPoint`, since if hit-testing had
  landed on a child element the existing `instanceof HTMLButtonElement`
  check would have silently failed instead. General lesson: for any
  pointer-driven widget where a *drag across multiple elements* matters
  (not just press/release on one), don't trust `event.target` in
  `pointermove`/`pointerup` handlers on principle --- use
  `document.elementFromPoint` (or per-`pointerId` capture bookkeeping) from
  the first draft, since this bug is invisible to `tsc`/build/vitest/a
  mouse-driven manual pass alike, and only shows up on real touch hardware
  or a deliberately capture-simulating dispatch like the one above.
- **Calling `AudioParam.setTargetAtTime` (or any automation method) from a
  raw, unthrottled DOM event handler schedules a permanent entry on that
  param's timeline every single call, with no spec-mandated pruning of past
  events.** Crit 4's continuous wind layer called `setTargetAtTime` on
  `windGain.gain`/`windFilter.frequency` directly from a `pointermove`
  listener with no rate limit --- confirmed via `WebSearch` against MDN and
  a Firefox bugzilla thread that browsers keep every scheduled event in an
  AudioParam's automation timeline indefinitely unless explicitly cleared
  with `cancelScheduledValues`, since (unlike `setValueAtTime`)
  `setTargetAtTime`'s open-ended exponential approach has no natural
  endpoint the engine can prune from. Verified live: patched
  `AudioParam.prototype.setTargetAtTime` to count calls, dispatched 200
  synthetic `pointermove` events in a tight synchronous loop, got 400 calls
  (2 params x 1 per move) with zero throttling --- a real drag at typical
  60--120Hz would schedule tens of thousands of never-pruned entries per
  minute. This is a different bug shape from every event-wiring fix logged
  above (those were about *which* event fired or what its payload claimed;
  this is unbounded resource growth from a *correctly*-firing, correctly-
  targeted event called too often). Found by deliberately reading the
  audio-graph code (`strike()`/`updateWind()`/`ensureAudio()`) with a
  "what could grow unbounded under rapid interaction" question in mind,
  after three straight event-wiring fixes had made "re-read the event
  wiring" feel exhausted --- worth switching questions, not just re-reading
  the same code, once one angle stops turning up anything new. Fixed by
  throttling the call to once per 40ms, comfortably under the params' own
  0.12s/0.2s `setTargetAtTime` smoothing time constants so nothing audible
  is lost; confirmed the same burst technique now yields 2 calls instead of
  400, and confirmed a realistically-spaced synthetic drag (~50ms between
  moves) still updates the wind layer on every move. General lesson: any
  future instrument/widget that maps continuous pointer/sensor input
  straight to `setTargetAtTime`/`linearRampToValueAtTime`/etc. on every
  raw event needs an explicit throttle matched to the param's own time
  constant, not just "call it when the value changes" --- the same
  oscillator/param-call-counting technique used for the double-strike and
  implicit-capture bugs generalises cleanly to catching this one too.
- **`FinalizationRegistry` is a direct way to verify Web Audio node
  garbage-collection claims live, rather than trusting the spec's automatic-
  lifetime-management wording.** Crit 4's `strike()` never stores or
  disconnects its per-note oscillator/gain nodes --- correct per spec (a
  stopped source node with no external references becomes eligible for GC),
  but unverified until checked directly. Patched
  `AudioContext.prototype.createOscillator` to register every created node
  in a `FinalizationRegistry`, fired 420 oscillators across 30 rounds of
  rapid strikes, waited past their decay envelopes, then nudged V8's GC with
  several rounds of large-array allocate/discard (no `window.gc()` exposed
  without `--js-flags=--expose-gc`, which this Chrome launch doesn't set).
  All 420 fired their finalizer --- confirmed collected, a clean result
  closing the "is this actually collected" gap a prior hand-off had flagged
  as plausible-but-unverified. Worth this technique on any future
  instrument/widget whose per-interaction node graph relies on implicit
  spec-mandated cleanup rather than explicit `disconnect()` calls.
- **Chrome's CDP `Page.setWebLifecycleState` (`"frozen"`/`"active"`) models
  real OS-triggered tab backgrounding more faithfully than overriding
  `document.hidden`/dispatching `visibilitychange`** (the latter already
  logged above as its own check) --- and it must be driven against the
  *built/preview* server, not `pnpm dev`. `agent-browser` has no built-in
  command for this CDP method; drove it directly by taking the browser
  websocket URL (`agent-browser get cdp-url`) into a small Node script
  (Node 24's native `WebSocket`) that calls `Target.getTargets` ->
  `Target.attachToTarget` (flatten mode, to get a `sessionId`) ->
  `Page.setWebLifecycleState`, then `Runtime.evaluate` with that
  `sessionId` to read page state before/after. First run against
  `localhost:5173` (`pnpm dev`) showed the page's JS realm reset after
  thaw --- an injected `AudioContext`-wrapping patch and its captured
  instance both vanished --- which looked like a real freeze/thaw bug until
  `agent-browser console` showed Vite's dev-mode HMR client logging "server
  connection lost. Polling for restart..." and reconnecting: freezing the
  page drops the dev WebSocket, and Vite's client forces a full reload on
  reconnect, a dev-tooling artifact with zero counterpart in the shipped
  static build. Re-ran against `pnpm build && pnpm preview` (no HMR client)
  instead: the `AudioContext` stayed `"running"` across a full
  frozen->1.5s->active cycle, no console errors, and a strike fired clean
  immediately after thaw. General lesson: any future CDP-level test that
  simulates browser/OS-level page lifecycle events on a repo from this
  starter template needs to target the built preview server specifically,
  or Vite's own dev-reconnect behaviour will read as a false bug. Also
  worth remembering separately: `window.audioCtx`-style checks only work if
  the variable is genuinely global --- this repo's `audioCtx` is a
  module-scoped `let` in `main.ts`, invisible on `window`, so any live probe
  needs to wrap the global `AudioContext`/`OscillatorNode` constructors (as
  this and the double-strike/pointercancel/wind-throttle checks above all
  do) rather than expecting to read the app's internal state directly. And
  a synthetic `element.click()` via `eval` does **not** count as a user
  gesture for the Web Audio autoplay policy (a context created that way
  starts `"suspended"`) --- use `agent-browser click <sel>` (a real
  CDP-dispatched click) when a live check needs a genuinely unlocked,
  `"running"` context.
- **Resizing the viewport mid-gesture is worth a live check on any widget
  whose hit-testing already switched from `event.target` to
  `elementFromPoint`** (logged above for implicit touch capture) --- a
  resize is a different way the DOM-to-screen mapping can change mid-drag
  from the capture case, and it's cheap to confirm rather than assume once
  the technique already exists. Checked crit 4's drag-strum: patched
  `AudioContext.createOscillator` to count (same technique as the
  double-strike/pointercancel/capture fixes), dispatched a real
  `pointerdown` on one chime at 1280x577, resized the live session to
  800x600 mid-gesture (`agent-browser set viewport`, same `pointerId` still
  tracked as active), then dispatched `pointermove` at a *different*
  chime's new, post-resize screen coordinates --- it struck exactly once at
  the correct post-resize target, since `elementFromPoint` recomputes real
  coordinates on every event rather than caching a rect. Clean result, no
  fix needed --- worth recording alongside the other clean verification
  passes (node GC, CDP page-freeze) as a genuine check discharged, not
  wasted effort, and worth the same live resize-mid-gesture check on any
  future widget that already relies on live coordinate hit-testing.
- **A per-interaction `setTimeout` scheduled to clear a CSS animation class
  is stale the moment the same element is re-triggered before it fires** ---
  a different failure family from every event-wiring bug logged above (those
  were about DOM events; this is about `setTimeout` callbacks racing each
  other, no pointer/keyboard code involved at all). Crit 4's chime strike
  animation (`.struck`, a 1.6s CSS `@keyframes swing`) was cleared by a bare
  `setTimeout(() => classList.remove("struck"), 1600)` scheduled on every
  strike. A fast roll on one tube --- outside the 90ms debounce, inside the
  1.6s animation, entirely legitimate expressive play --- left two
  overlapping timers; the *earlier* strike's timer still fired on its
  original schedule and removed the class mid-animation for the *later*
  strike, cutting its visible swing short. Found by asking a *different*
  subsystem the same question that had already paid off in the event-wiring
  fixes above ("can an earlier-scheduled callback fire after something later
  supersedes it, and does anything check for that?") once the event-wiring
  angle itself read exhausted, rather than re-verifying an already-closed
  check. Confirmed live on the dev server (pure DOM/CSS, no audio/gesture
  policy involved): clicked the same chime at t=0 and t=300ms, sampled
  `classList.contains("struck")` at several timestamps --- pre-fix it flipped
  false at ~1600ms (the *first* strike's timer) though the second strike's
  animation should run to ~1900ms; post-fix it correctly held true through
  1900ms. Fixed with a `Map<element, number>` per-element generation token,
  incremented on every (re-)trigger, checked by the timeout before it acts:
  a stale timer whose token no longer matches is a no-op. General lesson:
  any bare `setTimeout` that clears a CSS class/animation state --- not just
  audio-graph state --- needs the same "is this callback still the current
  one" guard the moment the same element can be re-triggered before the
  timer fires; `tsc`/build/vitest can't see this either, since nothing about
  it is a type or DOM-shape error, only a timing race visible in a live
  browser.
- **Back-forward cache (bfcache) restore --- a user navigating away via a
  link/address bar and returning with Back --- is a distinct scenario from
  both the tab-visibility-change check and the CDP
  `Page.setWebLifecycleState` freeze/thaw check already logged above, and
  worth its own live pass on any Web Audio page**, since neither of those
  simulates an actual history navigation. Checked crit 4 against the built
  `pnpm preview` server (not `pnpm dev`, per the standing HMR note above ---
  Vite's dev client forces a reload on reconnect and would read as a false
  bfcache bug). Patched `window.AudioContext`/`createOscillator` via
  `agent-browser eval` (capturing the instance and a call counter, same
  technique as the double-strike/wind-throttle checks), unlocked audio with
  a real `agent-browser click`, navigated to an external URL with `open`,
  then used `agent-browser back` (a genuine history navigation, distinct
  from re-`open`-ing the original URL) to return. Chrome restored the page
  from bfcache with the JS realm fully intact --- the eval-injected patches
  and captured `AudioContext` instance both survived, unlike the dev-server
  HMR-reload case --- and `audioCtx.state` stayed `"running"` throughout
  with no console errors; a real click immediately after the restore still
  struck cleanly (oscillator count rose, `.struck` applied correctly once
  re-checked right after the click --- an earlier read of `false` was just
  command-dispatch latency past the 1.6s animation window, not a bug).
  Clean result, no fix needed, but a genuinely different lifecycle path than
  the ones already checked --- worth the same live bfcache pass (not just
  tab-hidden or CDP-freeze) on any future page whose first sound is gated
  behind an `AudioContext` unlock. Also worth noting as a harness quirk, not
  an app finding: a backgrounded `vite preview` shell reported "completed"
  in a stale task notification while still actually serving traffic, and
  the PID the background-task tool tracked wasn't the PID actually holding
  the listening socket --- `lsof -i :<port>` (or `ss -ltnp`) found the real
  listener reliably when a plain `kill` on the tracked PID didn't stop the
  server.
