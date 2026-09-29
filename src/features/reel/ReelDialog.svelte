<script lang="ts">
  import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from "@lucide/svelte";
  import { untrack } from "svelte";
  import { prefersReducedMotion } from "svelte/motion";
  import { SCORE } from "./music";
  import Reel from "./Reel.svelte";
  import { ReelSynth } from "./synth";
  import { END_CARD_IN_S, STAGE } from "./timeline";

  type Props = {
    /** Opening restarts the reel from the top; Escape or the close button set it back to false. */
    open: boolean;
  };

  const CONTROLS_HEIGHT_IN_PX = 64;
  const MUTED_KEY = "reel-muted";

  let { open = $bindable() }: Props = $props();
  let dialog: HTMLDialogElement | undefined = $state();
  let t = $state(0);
  let playing = $state(false);
  let innerWidth = $state(STAGE.width);
  let innerHeight = $state(STAGE.height);
  let frame = 0;
  let lastNow: number | undefined;
  let muted = $state(localStorage.getItem(MUTED_KEY) === "true");
  const synth = new ReelSynth();

  const hasEnded = $derived(t >= END_CARD_IN_S);
  const scale = $derived(
    Math.min(
      innerWidth / STAGE.width,
      (innerHeight - CONTROLS_HEIGHT_IN_PX) / STAGE.height,
    ),
  );

  // Plays once and holds on the end card, rather than looping back to the blinking cursor.
  const tick = (now: number): void => {
    if (lastNow !== undefined) {
      t = Math.min(END_CARD_IN_S, t + (now - lastNow) / 1000);
    }
    lastNow = now;
    if (t >= END_CARD_IN_S) {
      playing = false;
      return;
    }
    frame = requestAnimationFrame(tick);
  };

  const togglePlay = (): void => {
    if (hasEnded) t = 0;
    playing = !playing;
  };

  const handleKeydown = (event: KeyboardEvent): void => {
    // A focused button already toggles on Space.
    if (event.code !== "Space" || event.target instanceof HTMLButtonElement)
      return;
    event.preventDefault();
    togglePlay();
  };

  // Read by the synth once the audio is running, which may be a few frames after play.
  const readT = (): number => t;

  const toggleMute = (): void => {
    muted = !muted;
    localStorage.setItem(MUTED_KEY, String(muted));
  };

  const handleClose = (): void => {
    open = false;
    playing = false;
  };

  // Stays mounted once opened: remounting would spin up its 3D polaroids' WebGL context again.
  $effect(() => {
    if (!dialog) return;
    if (open) {
      t = 0;
      // Untracked: toggling the OS setting mid-play must not restart the reel.
      playing = !untrack(() => prefersReducedMotion.current);
      dialog.showModal();
    } else if (dialog.open) {
      dialog.close();
    }
  });

  $effect(() => {
    if (!playing) return;
    lastNow = undefined;
    frame = requestAnimationFrame(tick);
    void synth.play(SCORE, readT);
    return () => {
      cancelAnimationFrame(frame);
      synth.stop();
    };
  });

  $effect(() => synth.setMuted(muted));

  $effect(() => () => synth.close());
</script>

<svelte:window bind:innerWidth bind:innerHeight />

<dialog
  bind:this={dialog}
  class="reel-view"
  aria-label="Showreel"
  onclose={handleClose}
  onkeydown={handleKeydown}
>
  <div class="flex h-dvh flex-col items-center justify-center">
    <div
      class="relative overflow-hidden"
      style:width="{STAGE.width * scale}px"
      style:height="{STAGE.height * scale}px"
    >
      <div class="origin-top-left" style:transform="scale({scale})">
        <Reel {t} />
      </div>
    </div>
    <div
      class="flex w-full max-w-5xl items-center gap-4 px-5"
      style:height="{CONTROLS_HEIGHT_IN_PX}px"
    >
      <button
        type="button"
        class="flex w-32 items-center justify-center gap-2 rounded-full bg-accent py-1.5 font-display text-on-accent transition-colors duration-150 hover:bg-accent-deep"
        onclick={togglePlay}
      >
        {#if hasEnded}
          <RotateCcw size={16} /> Replay
        {:else if playing}
          <Pause size={16} /> Pause
        {:else}
          <Play size={16} /> Play
        {/if}
      </button>
      <input
        type="range"
        class="flex-1 accent-accent"
        min="0"
        max={END_CARD_IN_S}
        step="0.01"
        aria-label="Time"
        bind:value={t}
        oninput={() => (playing = false)}
      />
      <button
        type="button"
        class="flex items-center rounded-full border border-line p-2 text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
        aria-label="Mute"
        aria-pressed={muted}
        onclick={toggleMute}
      >
        {#if muted}
          <VolumeX size={16} />
        {:else}
          <Volume2 size={16} />
        {/if}
      </button>
      <button
        type="button"
        class="flex items-center gap-2 rounded-full border border-line px-4 py-1.5 font-display text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
        onclick={() => dialog?.close()}
      >
        <X size={16} /> Close
      </button>
    </div>
  </div>
</dialog>

<style>
  .reel-view {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    margin: 0;
    padding: 0;
    border: 0;
    overflow: hidden;
    background: black;
    color: var(--color-ink);
  }
  .reel-view::backdrop {
    background: black;
  }
  :global(html:has(.reel-view[open])) {
    overflow: hidden;
  }
</style>
