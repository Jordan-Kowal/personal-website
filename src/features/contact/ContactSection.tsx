import { FOOTER_HEIGHT_PX } from "@/config/layout";
import { SOCIALS } from "@/config/socials";

export const ContactSection = () => {
  return (
    <section
      id="contact"
      class="relative bg-base-200 flex flex-col items-center justify-center"
      style={{ height: `calc(100vh - ${FOOTER_HEIGHT_PX}px)` }}
    >
      {/* Decorative lines */}
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-[calc(50%-12rem)] bg-base-100" />
      <div class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-[calc(50%-12rem)] bg-base-100" />
      {/* Ripple CTA button with decorative arcs */}
      <div class="relative" style={{ width: "400px", height: "400px" }}>
        <svg
          aria-hidden="true"
          class="absolute inset-0"
          viewBox="0 0 400 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left arc: from top center to left of button */}
          <path
            d="M 200 8 A 192 192 0 0 0 8 200"
            stroke="currentColor"
            stroke-width="4"
            class="text-base-100"
          />
          {/* Bottom-right arc: from right of button to bottom center */}
          <path
            d="M 392 200 A 192 192 0 0 1 200 392"
            stroke="currentColor"
            stroke-width="4"
            class="text-base-100"
          />
        </svg>
        {/* Ping animation */}
        <div class="absolute left-10 top-10 w-80 h-80 flex items-center justify-center">
          <div class="absolute w-52 h-52 rounded-full bg-primary animate-ping duration-[1.5s]" />
        </div>
        {/* Button */}
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          class="absolute left-10 top-10 btn btn-primary btn-circle no-underline! w-80 h-80 text-2xl font-bold shadow-lg z-10"
        >
          Get in touch
        </a>
      </div>
    </section>
  );
};
