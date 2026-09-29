<script lang="ts">
  import type { Snippet } from "svelte";

  let { children }: { children: Snippet } = $props();
</script>

<!-- Cloudflare Access already gates /private/*: this only covers a page that slips past it. -->
<svelte:head>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="grain min-h-dvh">
  {@render children()}
</div>
