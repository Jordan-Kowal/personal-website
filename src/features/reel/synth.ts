import { type Note, notesFrom, type Voice } from "./music";

// Plays the score with the browser's own synthesizer: square and triangle waves plus filtered
// noise, the sounds an 8-bit console made. No audio file to load.

type Envelope = "hold" | "decay" | "swell";

const VOICES: Record<
  Voice,
  {
    source: OscillatorType | "noise";
    filter?: BiquadFilterType;
    envelope: Envelope;
    gain: number;
  }
> = {
  lead: { source: "square", envelope: "hold", gain: 0.16 },
  arp: { source: "square", envelope: "hold", gain: 0.06 },
  bass: { source: "triangle", envelope: "hold", gain: 0.45 },
  kick: { source: "sine", envelope: "decay", gain: 0.9 },
  snare: {
    source: "noise",
    filter: "bandpass",
    envelope: "decay",
    gain: 0.45,
  },
  hat: { source: "noise", filter: "highpass", envelope: "decay", gain: 0.12 },
  crash: {
    source: "noise",
    filter: "highpass",
    envelope: "decay",
    gain: 0.22,
  },
  whoosh: {
    source: "noise",
    filter: "bandpass",
    envelope: "swell",
    gain: 0.35,
  },
};
const MASTER_GAIN = 0.35;
// Scheduling slightly ahead, so the first notes are not late.
const LOOKAHEAD_IN_S = 0.05;
const ATTACK_IN_S = 0.004;
const SILENT = 0.0001;

export class ReelSynth {
  #context: AudioContext | undefined;
  #master: GainNode | undefined;
  #noise: AudioBuffer | undefined;
  #sources = new Set<AudioScheduledSourceNode>();
  #muted = false;
  // Bumped on every stop, so a play still waiting on the context does not schedule after it.
  #generation = 0;

  /** Schedules every note of `score` from the reel time `readT` gives once the audio is running. */
  async play(score: readonly Note[], readT: () => number): Promise<void> {
    this.stop();
    const generation = this.#generation;
    const context = this.#ensureContext();
    await context.resume();
    if (generation !== this.#generation) return;
    const t = readT();
    const origin = context.currentTime + LOOKAHEAD_IN_S - t;
    for (const note of notesFrom(score, t)) {
      this.#schedule(note, origin + note.at);
    }
  }

  stop(): void {
    this.#generation++;
    for (const source of this.#sources) source.stop();
    this.#sources.clear();
  }

  setMuted(muted: boolean): void {
    this.#muted = muted;
    if (this.#master) this.#master.gain.value = muted ? 0 : MASTER_GAIN;
  }

  close(): void {
    this.stop();
    void this.#context?.close();
    this.#context = undefined;
  }

  #ensureContext(): AudioContext {
    if (this.#context) return this.#context;
    const context = new AudioContext();
    this.#master = context.createGain();
    this.#master.gain.value = this.#muted ? 0 : MASTER_GAIN;
    this.#master.connect(context.destination);
    this.#noise = context.createBuffer(
      1,
      context.sampleRate,
      context.sampleRate,
    );
    const samples = this.#noise.getChannelData(0);
    for (let i = 0; i < samples.length; i++) samples[i] = Math.random() * 2 - 1;
    this.#context = context;
    return context;
  }

  #schedule(note: Note, at: number): void {
    const context = this.#context;
    if (!context || !this.#master) return;
    const voice = VOICES[note.voice];
    const end = at + note.lengthInS;
    const gain = context.createGain();
    const peak = voice.gain * note.volume;
    gain.gain.setValueAtTime(SILENT, at);
    if (voice.envelope === "swell") {
      gain.gain.exponentialRampToValueAtTime(peak, end - 0.02);
      gain.gain.linearRampToValueAtTime(0, end);
    } else if (voice.envelope === "decay") {
      gain.gain.linearRampToValueAtTime(peak, at + ATTACK_IN_S);
      gain.gain.exponentialRampToValueAtTime(SILENT, end);
    } else {
      gain.gain.linearRampToValueAtTime(peak, at + ATTACK_IN_S);
      gain.gain.setValueAtTime(peak, Math.max(at + ATTACK_IN_S, end - 0.02));
      gain.gain.linearRampToValueAtTime(0, end);
    }
    gain.connect(this.#master);

    let source: AudioScheduledSourceNode;
    let pitch: AudioParam;
    if (voice.source === "noise") {
      const noise = context.createBufferSource();
      noise.buffer = this.#noise ?? null;
      noise.loop = true;
      const filter = context.createBiquadFilter();
      filter.type = voice.filter ?? "bandpass";
      noise.connect(filter).connect(gain);
      source = noise;
      pitch = filter.frequency;
    } else {
      const oscillator = context.createOscillator();
      oscillator.type = voice.source;
      oscillator.connect(gain);
      source = oscillator;
      pitch = oscillator.frequency;
    }
    pitch.setValueAtTime(note.frequency, at);
    if (note.slideTo !== undefined) {
      pitch.exponentialRampToValueAtTime(note.slideTo, end);
    }

    source.onended = () => {
      this.#sources.delete(source);
      gain.disconnect();
    };
    source.start(at);
    source.stop(end);
    this.#sources.add(source);
  }
}
