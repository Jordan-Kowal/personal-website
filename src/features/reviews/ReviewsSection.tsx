import { createSignal, For, onCleanup, onMount } from "solid-js";
import { Section } from "@/components/layout";
import { ReviewCard } from "@/components/ui";
import { reviewsData } from "./data";

const INTERVAL_MS = 5000;

export const ReviewsSection = () => {
  const [activeIndex, setActiveIndex] = createSignal(0);
  let intervalId: ReturnType<typeof setInterval>;

  const resetTimer = () => {
    clearInterval(intervalId);
    intervalId = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % reviewsData.length);
    }, INTERVAL_MS);
  };

  const goTo = (index: number) => {
    setActiveIndex(index);
    resetTimer();
  };

  onMount(() => {
    resetTimer();
    onCleanup(() => clearInterval(intervalId));
  });

  return (
    <Section id="reviews" title="Reviews">
      <div class="flex flex-col items-center gap-4">
        <div class="w-full max-w-md overflow-hidden">
          <div
            class="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${activeIndex() * 100}%)` }}
          >
            <For each={reviewsData}>
              {(review) => (
                <div class="w-full shrink-0">
                  <ReviewCard
                    rating={review.rating}
                    quote={review.comment}
                    author={review.name}
                    class="w-full"
                  />
                </div>
              )}
            </For>
          </div>
        </div>
        <div class="flex gap-2 my-2">
          <For each={reviewsData}>
            {(_, i) => (
              <button
                type="button"
                class={`w-2 h-2 rounded-full transition-colors cursor-pointer ${
                  activeIndex() === i() ? "bg-primary" : "bg-base-300"
                }`}
                onClick={() => goTo(i())}
              />
            )}
          </For>
        </div>
      </div>
    </Section>
  );
};
