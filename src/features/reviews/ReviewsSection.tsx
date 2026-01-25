import { For } from "solid-js";
import { ContentContainer } from "@/components/layout";
import { ReviewCard } from "./components/ReviewCard";
import { reviewsData } from "./data";

export const ReviewsSection = () => {
  return (
    <section id="reviews" class="py-16 bg-base-200">
      <ContentContainer>
        <h2 class="mb-8 text-center text-4xl font-bold">Avis clients</h2>

        {/* Grille 2x4 */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <For each={reviewsData}>
            {(review) => <ReviewCard review={review} />}
          </For>
        </div>
      </ContentContainer>
    </section>
  );
};
