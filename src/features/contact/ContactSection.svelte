<script lang="ts">
  import { ShuffleText } from "@/components/ui";
  import { SOCIALS } from "@/config/socials";
  import { pointerLight } from "@/utils";

  let isActive = $state(false);
</script>

<section
  id="contact"
  class="contact relative flex min-h-[80svh] scroll-mt-24 flex-col items-center justify-center gap-10 px-5 py-24 text-center"
>
  <div class="reveal flex flex-col items-center gap-3">
    <span class="font-display text-sm tracking-[0.2em] text-accent uppercase">
      Continue?
    </span>
    <h2 class="m-0 font-display text-4xl font-semibold text-ink md:text-5xl">
      Let's talk
    </h2>
    <p class="m-0 max-w-md text-balance text-muted">
      A project, a role, or just a hello. My inbox is open, my LinkedIn too.
    </p>
  </div>

  <div class="reveal" {@attach pointerLight}>
    <a
      href={SOCIALS.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      data-glow
      class="disc"
      onpointerenter={() => (isActive = true)}
      onpointerleave={() => (isActive = false)}
      onfocus={() => (isActive = true)}
      onblur={() => (isActive = false)}
    >
      <ShuffleText text="Get in touch" activeText="Say hi!" {isActive} />
    </a>
  </div>
</section>

<style>
  .contact {
    background: radial-gradient(
      ellipse 50% 45% at 50% 62%,
      rgb(255 170 70 / 0.18),
      transparent 70%
    );
  }
  .disc {
    --glow-radius: 160px;
    display: grid;
    place-items: center;
    width: clamp(12rem, 42vw, 15rem);
    aspect-ratio: 1;
    border-radius: 999px;
    background: radial-gradient(
      circle at 35% 30%,
      #ffe08a,
      var(--color-accent) 45%,
      var(--color-accent-deep)
    );
    color: var(--color-on-accent);
    font-family: var(--font-display);
    font-size: 1.6rem;
    box-shadow:
      0 30px 70px -20px rgb(255 170 60 / 0.45),
      inset 0 -8px 0 rgb(0 0 0 / 0.12);
    transition:
      scale var(--t-signature) var(--ease-spring),
      box-shadow var(--t-surface);
  }
  .disc:hover,
  .disc:focus-visible {
    scale: 1.05;
    box-shadow:
      0 40px 90px -20px rgb(255 170 60 / 0.65),
      inset 0 -8px 0 rgb(0 0 0 / 0.12);
  }
  .disc:active {
    scale: 0.97;
  }
  /* The ring of light that follows the pointer sits just outside the disc. */
  .disc::before {
    inset: -6px;
    background: radial-gradient(
      var(--glow-radius) circle at var(--gx, 50%) var(--gy, 50%),
      #fff3c4,
      transparent 60%
    );
    padding: 3px;
  }
</style>
