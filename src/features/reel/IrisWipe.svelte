<script lang="ts">
  import { easeInOutCubic, easeOutExpo, progress, STAGE } from "./timeline";

  type Props = {
    t: number;
    /** The moment the stage is fully covered, where the scene underneath switches. */
    at: number;
    halfInS: number;
    center: { x: number; y: number };
  };

  let { t, at, halfInS, center }: Props = $props();

  // Far enough from any center point to cover every corner of the stage.
  const COVER_RADIUS_IN_PX = Math.hypot(STAGE.width, STAGE.height);

  // A disc grows out of `center` to cover the stage, then a hole opens in it from the stage center.
  const grow = $derived(easeInOutCubic(progress(t, at - halfInS, at)));
  const open = $derived(easeOutExpo(progress(t, at, at + halfInS)));
  const discRadius = $derived(grow * COVER_RADIUS_IN_PX);
  const holeRadius = $derived(open * COVER_RADIUS_IN_PX);
</script>

{#if t >= at - halfInS && t < at + halfInS}
  <div
    class="pointer-events-none absolute inset-0"
    style:background="var(--color-accent)"
    style:clip-path="circle({discRadius}px at {center.x}px {center.y}px)"
    style:mask-image="radial-gradient(circle at 50% 50%, transparent
    {holeRadius}px, black {holeRadius + 1}px)"
  ></div>
  {#if open > 0}
    <div
      class="pointer-events-none absolute top-1/2 left-1/2 rounded-full border-[6px] border-page"
      style:width="{holeRadius * 2}px"
      style:height="{holeRadius * 2}px"
      style:transform="translate(-50%, -50%)"
      style:opacity={1 - open}
    ></div>
  {/if}
{/if}
