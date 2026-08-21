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
