import type { Component } from "solid-js";
import { GithubIcon, LinkedinIcon, YoutubeIcon } from "@/components/ui/icons";
import { FOOTER_HEIGHT_PX } from "@/config/layout";
import { SOCIALS } from "@/config/socials";

export const Footer: Component = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      class="flex items-center justify-between bg-neutral text-neutral-content px-4"
      style={{ "min-height": `${FOOTER_HEIGHT_PX}px` }}
    >
      <p class="m-0!">
        © 2023–{currentYear} Jordan Kowal - All rights reserved
      </p>
      <nav class="flex gap-4">
        <a
          href={SOCIALS.github}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors text-neutral-content"
          aria-label="GitHub"
        >
          <GithubIcon size={24} />
        </a>
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors text-neutral-content"
          aria-label="LinkedIn"
        >
          <LinkedinIcon size={24} />
        </a>
        <a
          href={SOCIALS.youtube}
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors text-neutral-content"
          aria-label="YouTube"
        >
          <YoutubeIcon size={24} />
        </a>
      </nav>
    </footer>
  );
};
