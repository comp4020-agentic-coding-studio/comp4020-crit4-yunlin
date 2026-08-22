// Bamboo chimes: seven tubes tuned to a five-tone (pentatonic) scale, each one
// a small physical model rather than a sample — so no two strikes, and no two
// players, sound quite the same.

const NOTE_FREQS = [220.0, 246.94, 293.66, 329.63, 392.0, 440.0, 523.25];

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let dryGain: GainNode | null = null;
let wetGain: GainNode | null = null;
let reverb: ConvolverNode | null = null;
let windSource: AudioBufferSourceNode | null = null;
let windFilter: BiquadFilterNode | null = null;
let windGain: GainNode | null = null;

function createReverbImpulse(ctx: AudioContext, seconds: number, decay: number): AudioBuffer {
  const length = Math.floor(ctx.sampleRate * seconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return impulse;
}

function ensureAudio(): AudioContext {
  if (audioCtx) {
    if (audioCtx.state === "suspended") void audioCtx.resume();
    return audioCtx;
  }

  const ctx = new AudioContext();
  audioCtx = ctx;

  masterGain = ctx.createGain();
  masterGain.gain.value = 0.85;
  masterGain.connect(ctx.destination);

  dryGain = ctx.createGain();
  dryGain.gain.value = 0.75;
  dryGain.connect(masterGain);

  wetGain = ctx.createGain();
  wetGain.gain.value = 0.4;
  reverb = ctx.createConvolver();
  reverb.buffer = createReverbImpulse(ctx, 2.4, 2.5);
  reverb.connect(wetGain);
  wetGain.connect(masterGain);

  startWind(ctx);

  return ctx;
}

function startWind(ctx: AudioContext): void {
  const noiseLength = ctx.sampleRate * 2;
  const buffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < noiseLength; i++) data[i] = Math.random() * 2 - 1;

  windSource = ctx.createBufferSource();
  windSource.buffer = buffer;
  windSource.loop = true;

  windFilter = ctx.createBiquadFilter();
  windFilter.type = "bandpass";
  windFilter.frequency.value = 500;
  windFilter.Q.value = 0.6;

  windGain = ctx.createGain();
  windGain.gain.value = 0;

  windSource.connect(windFilter);
  windFilter.connect(windGain);
  windGain.connect(masterGain!);
  windSource.start();
}

function updateWind(speed: number, verticalFraction: number): void {
  if (!windGain || !windFilter || !audioCtx) return;
  const now = audioCtx.currentTime;
  const targetGain = Math.min(0.14, speed * 0.0006);
  windGain.gain.setTargetAtTime(targetGain, now, 0.12);
  const targetFreq = 250 + (1 - verticalFraction) * 1100;
  windFilter.frequency.setTargetAtTime(targetFreq, now, 0.2);
}

function strike(noteIndex: number, pan: number): void {
  const ctx = ensureAudio();
  const freq = NOTE_FREQS[noteIndex];
  const now = ctx.currentTime;

  // Every strike is detuned, panned and timed slightly differently, so the
  // same tube never rings twice identically.
  const detune = (Math.random() - 0.5) * 14;
  const decay = 1.4 + Math.random() * 0.7;
  const attack = 0.004 + Math.random() * 0.006;

  const fundamental = ctx.createOscillator();
  fundamental.type = "sine";
  fundamental.frequency.value = freq;
  fundamental.detune.value = detune;

  const overtone = ctx.createOscillator();
  overtone.type = "sine";
  overtone.frequency.value = freq * 2.756;
  overtone.detune.value = detune;

  const strikeNoise = ctx.createBufferSource();
  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const noiseData = noiseBuffer.getChannelData(0);
  for (let i = 0; i < noiseData.length; i++) {
    noiseData[i] = (Math.random() * 2 - 1) * (1 - i / noiseData.length);
  }
  strikeNoise.buffer = noiseBuffer;
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "highpass";
  noiseFilter.frequency.value = 2000;

  const fundamentalEnv = ctx.createGain();
  fundamentalEnv.gain.setValueAtTime(0, now);
  fundamentalEnv.gain.linearRampToValueAtTime(0.5, now + attack);
  fundamentalEnv.gain.exponentialRampToValueAtTime(0.0005, now + decay);

  const overtoneEnv = ctx.createGain();
  overtoneEnv.gain.setValueAtTime(0, now);
  overtoneEnv.gain.linearRampToValueAtTime(0.14, now + attack);
  overtoneEnv.gain.exponentialRampToValueAtTime(0.0005, now + decay * 0.55);

  const noiseEnv = ctx.createGain();
  noiseEnv.gain.setValueAtTime(0.2, now);
  noiseEnv.gain.exponentialRampToValueAtTime(0.0005, now + 0.06);

  const panner = ctx.createStereoPanner();
  panner.pan.value = Math.max(-1, Math.min(1, pan));

  fundamental.connect(fundamentalEnv);
  overtone.connect(overtoneEnv);
  strikeNoise.connect(noiseFilter);
  noiseFilter.connect(noiseEnv);

  fundamentalEnv.connect(panner);
  overtoneEnv.connect(panner);
  noiseEnv.connect(panner);
  panner.connect(dryGain!);
  panner.connect(reverb!);

  fundamental.start(now);
  overtone.start(now);
  strikeNoise.start(now);
  fundamental.stop(now + decay + 0.1);
  overtone.stop(now + decay + 0.1);
}

function setupChimes(): void {
  const grove = document.querySelector<HTMLElement>("#grove");
  if (!grove) return;
  const chimes = Array.from(grove.querySelectorAll<HTMLButtonElement>(".chime"));
  const struckRecently = new Set<HTMLButtonElement>();

  function playChime(chime: HTMLButtonElement): void {
    const noteIndex = Number(chime.dataset.note ?? "0");
    const rect = chime.getBoundingClientRect();
    const groveRect = grove!.getBoundingClientRect();
    const center = rect.left + rect.width / 2 - groveRect.left;
    const pan = (center / groveRect.width) * 2 - 1;

    strike(noteIndex, pan);

    if (struckRecently.has(chime)) {
      chime.classList.remove("struck");
      // Force a reflow so the animation restarts on rapid re-strikes.
      void chime.offsetWidth;
    }
    chime.style.setProperty("--swing-angle", `${(Math.random() - 0.5) * 12 + (pan > 0 ? 5 : -5)}deg`);
    chime.classList.add("struck");
    struckRecently.add(chime);
    setTimeout(() => {
      chime.classList.remove("struck");
      struckRecently.delete(chime);
    }, 1600);
  }

  let pointerDown = false;
  const lastStruck = new Map<HTMLButtonElement, number>();

  function maybeStrike(target: EventTarget | null): void {
    if (!(target instanceof HTMLButtonElement) || !target.classList.contains("chime")) return;
    const last = lastStruck.get(target) ?? 0;
    const nowMs = performance.now();
    if (nowMs - last < 90) return;
    lastStruck.set(target, nowMs);
    playChime(target);
  }

  grove.addEventListener("pointerdown", (event) => {
    pointerDown = true;
    maybeStrike(event.target);
  });
  grove.addEventListener("pointerup", () => {
    pointerDown = false;
  });
  grove.addEventListener("pointerleave", () => {
    pointerDown = false;
  });
  // A touch can be interrupted by the system (a notification swipe, an
  // incoming call, palm rejection) without ever firing "pointerup" --- without
  // this, the next bare pointermove over an untouched tube reads as a drag
  // still in progress and phantom-strikes it.
  grove.addEventListener("pointercancel", () => {
    pointerDown = false;
  });
  grove.addEventListener("pointermove", (event) => {
    if (pointerDown) maybeStrike(event.target);
  });

  // Keyboard activation (Enter/Space) dispatches "click" with no preceding
  // "pointerdown", so this still needs its own listener --- but it must go
  // through the same debounced path as pointerdown, or a mouse/touch tap
  // (which fires both pointerdown and click) double-strikes the chime.
  for (const chime of chimes) {
    chime.addEventListener("click", () => maybeStrike(chime));
  }

  // A gentle continuous layer, like moving air in the grove: its loudness and
  // colour follow how fast and how high the pointer moves over the tubes.
  let lastX = 0;
  let lastY = 0;
  let lastT = 0;
  grove.addEventListener("pointermove", (event) => {
    const rect = grove.getBoundingClientRect();
    const now = performance.now();
    if (lastT > 0) {
      const dt = Math.max(1, now - lastT);
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const speed = Math.sqrt(dx * dx + dy * dy) / (dt / 1000);
      const verticalFraction = (event.clientY - rect.top) / rect.height;
      if (audioCtx) updateWind(speed, verticalFraction);
    }
    lastX = event.clientX;
    lastY = event.clientY;
    lastT = now;
  });
  grove.addEventListener("pointerleave", () => {
    lastT = 0;
    if (audioCtx) updateWind(0, 0.5);
  });
}

setupChimes();
