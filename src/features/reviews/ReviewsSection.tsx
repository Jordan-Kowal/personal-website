import { For } from "solid-js";
import { Section } from "@/components/layout";
import { ReviewCard } from "./components/ReviewCard";
import { reviewsData } from "./data";

export const ReviewsSection = () => {
  return (
    <Section id="reviews" title="Reviews">
      {/* Grille 2x4 */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <For each={reviewsData}>
          {(review) => <ReviewCard review={review} />}
        </For>
      </div>
    </Section>
  );
};
