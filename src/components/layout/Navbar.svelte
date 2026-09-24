<script lang="ts">
  import {
    Briefcase,
    Clock,
    House,
    Mail,
    MessageSquare,
    Wrench,
  } from "@lucide/svelte";
  import { onMount } from "svelte";
  import { prefersReducedMotion, Spring } from "svelte/motion";
  import { GithubIcon } from "@/components/ui/icons";

  const NAV_ITEMS = [
    { id: "home", label: "Home", icon: House },
    { id: "skills", label: "Skills", icon: Wrench },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "timeline", label: "Timeline", icon: Clock },
    { id: "github", label: "GitHub", icon: GithubIcon },
    { id: "reviews", label: "Reviews", icon: MessageSquare },
    { id: "contact", label: "Contact", icon: Mail },
  ];
  const VISIBILITY_THRESHOLDS = [0, 0.25, 0.5, 0.75, 1];
  const SCROLLED_OFFSET_PX = 24;

  let activeId = $state("home");
  let links: HTMLAnchorElement[] = $state([]);
  let hasScrolled = $state(false);

  // The highlight pill glides to the active link with a small overshoot.
  const indicator = new Spring(
    { x: 0, width: 0 },
    { stiffness: 0.18, damping: 0.55 },
  );

  $effect(() => {
    const link = links[NAV_ITEMS.findIndex((item) => item.id === activeId)];
    if (!link) return;
    const next = { x: link.offsetLeft, width: link.offsetWidth };
    // The first placement and reduced motion jump straight there.
    const isInstant =
      prefersReducedMotion.current || indicator.current.width === 0;
    indicator.set(next, { instant: isInstant });
  });

  const handleScroll = () => {
    hasScrolled = window.scrollY > SCROLLED_OFFSET_PX;
  };

  onMount(() => {
    const visibility = new Map<string, number>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visibility.set(entry.target.id, entry.intersectionRatio);
        }
        let bestId = "home";
        let bestRatio = 0;
        for (const [id, ratio] of visibility) {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        }
        // Near the top, the hero owns the highlight even if a section peeks in.
        activeId = window.scrollY < window.innerHeight * 0.5 ? "home" : bestId;
      },
      { threshold: VISIBILITY_THRESHOLDS },
    );
    for (const item of NAV_ITEMS) {
      const element = document.getElementById(item.id);
      if (element && item.id !== "home") observer.observe(element);
    }
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav
  aria-label="Primary"
  class="fixed inset-x-0 top-4 z-50 flex justify-center px-3"
>
  <div
    class="pill relative flex items-center rounded-full border p-1 transition-colors duration-300"
    class:scrolled={hasScrolled}
  >
    <span
      class="absolute top-1 bottom-1 left-0 rounded-full bg-accent"
      style:transform="translateX({indicator.current.x}px)"
      style:width="{indicator.current.width}px"
      aria-hidden="true"
    ></span>
    {#each NAV_ITEMS as item, i (item.id)}
      <a
        bind:this={links[i]}
        href="#{item.id}"
        aria-label={item.label}
        aria-current={activeId === item.id ? "true" : undefined}
        class={[
          "relative z-10 flex items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition-colors duration-200",
          activeId === item.id ? "text-on-accent" : "text-muted hover:text-ink",
        ]}
      >
        <span class="md:hidden"><item.icon size={16} /></span>
        <span class="hidden md:inline">{item.label}</span>
      </a>
    {/each}
  </div>
</nav>

<style>
  /* Always readable over the hero's clouds, a touch firmer once the page scrolls. */
  .pill {
    background: color-mix(in oklab, var(--color-page) 55%, transparent);
    border-color: color-mix(in oklab, var(--color-line) 50%, transparent);
  }
  .pill.scrolled {
    background: color-mix(in oklab, var(--color-surface) 88%, transparent);
    border-color: var(--color-line);
  }
</style>
