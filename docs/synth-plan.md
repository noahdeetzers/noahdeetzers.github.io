# Home Page Synth Devices — Plan

## Vision
Four small, stylized audio devices sitting on the dot-field "drafting table." They look like physical hardware on cloth — warping with the dots, casting subtle shadows. All built with pure Web Audio API (swappable to RNBO later).

## Decisions
- **Build order:** Synth → Drum Pad → Sequencer → FX
- **Engine:** Pure Web Audio API (no RNBO dependency for now)
- **Sound:** Analog mellow sine lead vibe — soft oscillators, warm filter, smooth envelopes
- **Audio starts:** Only on interaction — playing the synth keyboard or enabling a sequencer channel. FX box is on by default with a preset.

---

## Signal Flow
```
  ┌──────────┐     ┌──────────┐
  │  SYNTH   │     │   DRUM   │
  │ (manual  │     │  (manual │
  │  or seq) │     │  or seq) │
  └────┬─────┘     └────┬─────┘
       │                 │
       │   ┌──────────┐  │
       └──►│   SEQ    │◄─┘
           │  ch1: synth
           │  ch2: drum │
           └─────┬─────┘
                 │ (audio from synth+drum)
           ┌─────▼─────┐
           │    FX     │
           │ delay/rev │
           │ (preset)  │
           └─────┬─────┘
                 │
            speakers
```

**Routing:**
- Synth + Drum each have their own `GainNode` output
- Both feed into the FX unit's input
- FX unit connects to `AudioContext.destination`
- Sequencer doesn't process audio — it triggers notes on Synth (ch1) and Drum (ch2)
- Playing the synth keyboard or drum pads manually also works (bypasses sequencer)

---

## Device #1: Mono Synth

### Audio Engine (Web Audio API)
```
OscillatorNode (sine) → BiquadFilterNode (lowpass) → GainNode (envelope) → output
```
- **Oscillator:** Sine wave. Knob to blend toward triangle for tonal variation.
- **Filter:** Lowpass, `cutoff` (200–8000 Hz), `resonance` (0–20). Gives that mellow analog sweep.
- **Envelope:** Attack + Release (AR). On noteOn: ramp gain 0→1 over attack time. On noteOff: ramp 1→0 over release time.
- **Parameters exposed as knobs:**
  - `cutoff` — filter frequency
  - `resonance` — filter Q
  - `attack` — envelope attack (10ms–2s)
  - `release` — envelope release (10ms–3s)

### Visual Layout (~240px wide)
```
┌─────────────────────────┐
│  SYNTH            [pwr] │
│                         │
│  (cut) (res) (atk) (rel)│  ← 4 knobs
│                         │
│  ┌─┬─┬─┬─┬─┬─┬─┬─┬─┬─┐│  ← 10 keys (C4–D5)
│  │ │█│ │█│ │ │█│ │█│ │██ │  (black keys overlaid)
│  └─┴─┴─┴─┴─┴─┴─┴─┴─┴─┘│
└─────────────────────────┘
```

### Component Breakdown
- **`SynthDevice.jsx`** — device shell, audio engine init, parameter state
- **`Knob.jsx`** — reusable SVG knob. Vertical drag. Value label below. Props: `label`, `min`, `max`, `value`, `onChange`
- **`MiniKeys.jsx`** — 1+ octave keyboard. Click/touch = noteOn, release = noteOff. Black keys overlaid with CSS. Highlight on press.

### Knob Interaction
- Click + drag up = increase, drag down = decrease
- Sensitivity: ~200px drag = full range
- Visual: ring arc fills as value increases (like a hardware pot indicator)
- Touch: same behavior with `touchstart`/`touchmove`

### Key Interaction
- `mousedown` / `touchstart` → noteOn (frequency from key index)
- `mouseup` / `touchend` → noteOff
- Visual: key darkens/highlights while held
- Frequency map: C4 (261.63) through D5 (587.33)

---

## Device #2: Drum Pad (future)
- 4×2 grid of pads
- Each pad = synthesized drum (kick, snare, hat, clap, etc.) via Web Audio
- Kick: low sine with pitch envelope. Snare: noise burst + tone. Hat: filtered noise with fast decay.
- Click/tap to trigger, visual flash on hit
- Output feeds into FX chain

## Device #3: Step Sequencer (future)
- Two channels: ch1 → synth, ch2 → drum
- 8 or 16 steps, toggle on/off per step
- Tempo knob (60–180 BPM)
- Play/stop button
- ch1 steps send note values to synth (fixed pitch or per-step pitch)
- ch2 steps trigger drum pad voices (per-step pad selection)
- Visual: active step highlights as it plays

## Device #4: FX Unit (future)
- Delay + Reverb (convolver or algorithmic)
- Knobs: `delay time`, `feedback`, `reverb mix`, `dry/wet`
- On by default with a mellow preset
- Processes combined synth + drum output
- Could add chorus or lo-fi bitcrusher as extra flavor

---

## Shared Audio Context
```js
// src/audio/audioEngine.js
// Singleton — created on first user interaction
let ctx = null
export function getAudioContext() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

// Master bus
let masterGain = null
export function getMasterBus() {
  if (!masterGain) {
    const c = getAudioContext()
    masterGain = c.createGain()
    masterGain.connect(c.destination)
  }
  return masterGain
}
```
All devices import from this module. FX unit sits between device outputs and master bus.

---

## Layout on Home Page
```
         ┌──────────────────────────┐
         │        [photo]           │
         │       Noah Deetz         │
         │       subtitle           │
         │                          │
 [synth]    about paragraph    [drums]
         │                          │
 [seq]      category cards     [fx]
         │                          │
         └──────────────────────────┘
```
- Devices positioned with `position: absolute` inside a relative container
- Left devices: synth (top-left), sequencer (bottom-left)
- Right devices: drums (top-right), fx (bottom-right)
- Each wrapped in `<FabricWarp>`, marked `data-fabric-exclude` + `data-beam-block`
- Mobile (<768px): devices reflow into a horizontal scroll strip below the about section, or collapse into a single "open studio" button

---

## File Structure
```
src/
  audio/
    audioEngine.js        ← shared AudioContext + master bus
    synthEngine.js        ← synth oscillator/filter/envelope logic
    drumEngine.js         ← (future) drum voice synthesis
    fxEngine.js           ← (future) delay/reverb processing
  components/
    synth/
      SynthDevice.jsx     ← device #1 shell
      Knob.jsx            ← reusable knob (shared across all devices)
      MiniKeys.jsx        ← keyboard for synth
    drum/                 ← (future)
      DrumDevice.jsx
      DrumPad.jsx
    sequencer/            ← (future)
      SeqDevice.jsx
      StepRow.jsx
    fx/                   ← (future)
      FxDevice.jsx
```

---

## Phase 1 Implementation (Synth Only)
1. Create `src/audio/audioEngine.js` — singleton context + master bus
2. Create `src/audio/synthEngine.js` — oscillator, filter, envelope, noteOn/noteOff
3. Create `src/components/synth/Knob.jsx` — SVG knob with drag
4. Create `src/components/synth/MiniKeys.jsx` — clickable keyboard
5. Create `src/components/synth/SynthDevice.jsx` — combines everything
6. Add to Home.jsx with fabric integration
7. Style for light + dark mode
8. Test on desktop + mobile
