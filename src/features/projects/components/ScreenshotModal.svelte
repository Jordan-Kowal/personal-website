<script lang="ts">
  import { ChevronLeft, ChevronRight, X } from "@lucide/svelte";
  import { toScreenshotUrl } from "../utils";

  type Props = {
    screenshots: string[];
    onClose: () => void;
  };

  let { screenshots, onClose }: Props = $props();
  let index = $state(0);
  let dialog: HTMLDialogElement | undefined = $state();

  let hasSeveral = $derived(screenshots.length > 1);

  const go = (step: number) => {
    index = (index + step + screenshots.length) % screenshots.length;
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") go(1);
    if (event.key === "ArrowLeft") go(-1);
  };

  // The native dialog brings focus trapping, Escape and the backdrop for free.
  $effect(() => {
    dialog?.showModal();
  });
</script>

<dialog
  bind:this={dialog}
  class="m-auto max-h-[90vh] w-[min(64rem,94vw)] overflow-visible rounded-(--radius-card) border border-line bg-surface p-0 text-ink backdrop:bg-black/75"
  aria-label="Screenshots"
  onclose={onClose}
  onkeydown={handleKeydown}
  onclick={(event) => {
    if (event.target === dialog) dialog?.close();
  }}
>
  <div class="relative">
    <img
      src={toScreenshotUrl(screenshots[index])}
      alt="Screenshot {index + 1} of {screenshots.length}"
      class="block max-h-[80vh] w-full rounded-t-(--radius-card) object-contain"
    />
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <span class="font-display text-sm text-muted">
        {index + 1} / {screenshots.length}
      </span>
      <div class="flex gap-2">
        {#if hasSeveral}
          <button
            type="button"
            class="nav"
            aria-label="Previous screenshot"
            onclick={() => go(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            class="nav"
            aria-label="Next screenshot"
            onclick={() => go(1)}
          >
            <ChevronRight size={18} />
          </button>
        {/if}
        <button
          type="button"
          class="nav"
          aria-label="Close"
          onclick={() => dialog?.close()}
        >
          <X size={18} />
        </button>
      </div>
    </div>
  </div>
</dialog>

<style>
  .nav {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 999px;
    border: 1px solid var(--color-line);
    color: var(--color-ink);
    transition:
      border-color var(--t-control),
      color var(--t-control);
  }
  .nav:hover {
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
</style>
