import { ContentContainer } from "@/components/layout";

export function HeroBanner() {
  return (
    <div class="relative h-screen w-full bg-base-300 overflow-hidden">
      <ContentContainer>
        <img
          alt="Jordan Kowal"
          src="/images/jordan-wttj.png"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 h-full object-cover object-bottom"
        />
        {/* SVG white-curved-bottom */}
        <svg
          aria-hidden="true"
          class="absolute inset-0 z-10 h-full w-full text-base-100"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
          xmlns="http://www.w3.org/2000/svg"
          style={{ "pointer-events": "none" }}
        >
          <path
            d="M 0,80 C 20,88 60,95 100,97 L 100,100 L 0,100 Z"
            fill="currentColor"
          />
        </svg>
      </ContentContainer>
    </div>
  );
}
