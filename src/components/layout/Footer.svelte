<script lang="ts">
  import { GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/icons";
  import { SOCIALS } from "@/config/socials";

  const currentYear = new Date().getFullYear();
</script>

<footer
  class="flex flex-col items-center justify-between gap-3 border-t border-line px-5 py-5 text-sm text-muted sm:flex-row"
>
  <p class="m-0">© 2023–{currentYear} Jordan Kowal - All rights reserved</p>
  <nav aria-label="Social links" class="flex gap-4">
    <a
      href={SOCIALS.github}
      target="_blank"
      rel="noopener noreferrer"
      class="transition-colors hover:text-accent"
      aria-label="GitHub"
    >
      <GithubIcon size={20} />
    </a>
    <a
      href={SOCIALS.linkedin}
      target="_blank"
      rel="noopener noreferrer"
      class="transition-colors hover:text-accent"
      aria-label="LinkedIn"
    >
      <LinkedinIcon size={20} />
    </a>
    <a
      href={SOCIALS.youtube}
      target="_blank"
      rel="noopener noreferrer"
      class="transition-colors hover:text-accent"
      aria-label="YouTube"
    >
      <YoutubeIcon size={20} />
    </a>
  </nav>
</footer>
