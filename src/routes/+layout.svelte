<script lang="ts">
  import "@/styles/index.css";
  import type { Snippet } from "svelte";
  import { PERSON_SCHEMA } from "@/config/structuredData";

  let { children }: { children: Snippet } = $props();

  // Escape `<` so the schema text can never close the script tag it sits in.
  const structuredData = JSON.stringify(PERSON_SCHEMA).replaceAll(
    "<",
    "\\u003c",
  );
</script>

<svelte:head>
  {@html `<script type="application/ld+json">${structuredData}</script>`}
</svelte:head>

{@render children()}
