import { ContentContainer } from "@/components/layout";

export function HeroBanner() {
  return (
    <div class="relative h-screen w-full bg-base-300 overflow-hidden">
      <ContentContainer>
        <figure class="diff aspect-video h-screen m-0!" tabindex="0">
          <div class="diff-item-1" role="img" tabindex="0">
            <img
              alt="daisy"
              src="/images/jordan-wordcloud.png"
              class="object-bottom object-cover"
            />
          </div>
          <div class="diff-item-2" role="img">
            <img
              alt="daisy"
              src="/images/jordan-wttj.png"
              class="object-bottom object-cover"
            />
          </div>
          <div class="diff-resizer"></div>
        </figure>
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
