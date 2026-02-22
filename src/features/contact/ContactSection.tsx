import { FOOTER_HEIGHT_PX } from "@/config/layout";
import { SOCIALS } from "@/config/socials";

const BUTTON_SIZE = 240;
const STROKE_OFFSET = 6;
// Derived from BUTTON_SIZE and STROKE_OFFSET
const CONTAINER_SIZE = BUTTON_SIZE * 1.25;
const INSET = (CONTAINER_SIZE - BUTTON_SIZE) / 2;
const PING_SIZE = Math.round((BUTTON_SIZE * 2) / 3);
const CENTER = CONTAINER_SIZE / 2;
const ARC_RADIUS = CENTER - STROKE_OFFSET;
const ARC_END = CONTAINER_SIZE - STROKE_OFFSET;

export const ContactSection = () => {
  return (
    <section
      id="contact"
      class="relative bg-base-200 flex flex-col items-center justify-center"
      style={{ height: `calc(100vh - ${FOOTER_HEIGHT_PX}px)` }}
    >
      {/* Decorative lines */}
      <div
        class="absolute top-0 left-1/2 -translate-x-1/2 w-1 bg-base-100"
        style={{ height: `calc(50% - ${CENTER - STROKE_OFFSET}px)` }}
      />
      <div
        class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 bg-base-100"
        style={{ height: `calc(50% - ${CENTER - STROKE_OFFSET}px)` }}
      />
      {/* Ripple CTA button with decorative arcs */}
      <div
        class="relative"
        style={{ width: `${CONTAINER_SIZE}px`, height: `${CONTAINER_SIZE}px` }}
      >
        <svg
          aria-hidden="true"
          class="absolute inset-0"
          viewBox={`0 0 ${CONTAINER_SIZE} ${CONTAINER_SIZE}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Top-left arc: from top center to left of button */}
          <path
            d={`M ${CENTER} 6 A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 0 6 ${CENTER}`}
            stroke="currentColor"
            stroke-width="4"
            class="text-base-100"
          />
          {/* Bottom-right arc: from right of button to bottom center */}
          <path
            d={`M ${ARC_END} ${CENTER} A ${ARC_RADIUS} ${ARC_RADIUS} 0 0 1 ${CENTER} ${ARC_END}`}
            stroke="currentColor"
            stroke-width="4"
            class="text-base-100"
          />
        </svg>
        {/* Ping animation */}
        <div
          class="absolute flex items-center justify-center"
          style={{
            left: `${INSET}px`,
            top: `${INSET}px`,
            width: `${BUTTON_SIZE}px`,
            height: `${BUTTON_SIZE}px`,
          }}
        >
          <div
            class="absolute rounded-full bg-primary animate-ping duration-[1.5s]"
            style={{ width: `${PING_SIZE}px`, height: `${PING_SIZE}px` }}
          />
        </div>
        {/* Button */}
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          class="absolute btn btn-primary btn-circle no-underline! text-2xl font-bold shadow-lg z-10"
          style={{
            left: `${INSET}px`,
            top: `${INSET}px`,
            width: `${BUTTON_SIZE}px`,
            height: `${BUTTON_SIZE}px`,
          }}
        >
          Get in touch
        </a>
      </div>
    </section>
  );
};
