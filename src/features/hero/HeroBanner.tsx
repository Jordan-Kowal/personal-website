import { For } from "solid-js";
import { ContentContainer } from "@/components/layout";
import { ReviewCard } from "@/components/ui";
import { reviewsData } from "@/features/reviews/data";

const LEFT_CARDS = [
  { review: reviewsData[0], top: "8%", left: "2%" },
  { review: reviewsData[1], top: "36%", left: "5%" },
  { review: reviewsData[2], top: "64%", left: "2%" },
];

const RIGHT_CARDS = [
  { review: reviewsData[3], top: "8%", right: "2%" },
  { review: reviewsData[4], top: "36%", right: "5%" },
  { review: reviewsData[5], top: "64%", right: "2%" },
];

export function HeroBanner() {
  return (
    <div class="relative h-screen w-full bg-base-300 overflow-hidden">
      <ContentContainer>
        <img
          alt="Jordan Kowal"
          src="/images/jordan-wttj.png"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 h-full object-cover object-bottom"
        />
        {/* Review cards container - capped width so cards stay near portrait */}
        <div class="absolute inset-0 z-5 mx-auto max-w-6xl">
          {/* Left side */}
          <For each={LEFT_CARDS}>
            {(card, i) => (
              <div
                class="absolute hidden max-w-52 lg:flex"
                style={{
                  top: card.top,
                  left: card.left,
                  animation: `fade-in-up 0.6s ease-out ${0.2 + i() * 0.15}s both`,
                }}
              >
                <ReviewCard
                  rating={card.review.rating}
                  quote={card.review.comment}
                  author={card.review.name}
                  class="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                />
              </div>
            )}
          </For>
          {/* Right side */}
          <For each={RIGHT_CARDS}>
            {(card, i) => (
              <div
                class="absolute hidden max-w-52 lg:flex"
                style={{
                  top: card.top,
                  right: card.right,
                  animation: `fade-in-up 0.6s ease-out ${0.5 + i() * 0.15}s both`,
                }}
              >
                <ReviewCard
                  rating={card.review.rating}
                  quote={card.review.comment}
                  author={card.review.name}
                  class="bg-base-100/90 backdrop-blur-sm rounded-xl p-4 shadow-lg"
                />
              </div>
            )}
          </For>
        </div>
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
