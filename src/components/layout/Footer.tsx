import { Github, Linkedin, Youtube } from "lucide-solid";
import type { Component } from "solid-js";

export const Footer: Component = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer class="footer sm:footer-horizontal bg-neutral text-neutral-content items-center p-4">
      <aside class="grid-flow-col items-center">
        <p>Copyright © {currentYear} - All right reserved</p>
      </aside>
      <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
        <a
          href="https://github.com/jordan-kowal"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors"
          aria-label="GitHub"
        >
          <Github size={24} />
        </a>
        <a
          href="https://www.linkedin.com/in/jordan-kowal/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors"
          aria-label="LinkedIn"
        >
          <Linkedin size={24} />
        </a>
        <a
          href="https://www.youtube.com/watch?v=8d9u9qAZrpY"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-primary transition-colors"
          aria-label="YouTube"
        >
          <Youtube size={24} />
        </a>
      </nav>
    </footer>
  );
};
