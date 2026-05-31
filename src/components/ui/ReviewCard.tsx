import type { Component } from "solid-js";
import { For } from "solid-js";

type ReviewCardProps = {
  rating: number;
  quote: string;
  author: string;
  class?: string;
};

export const ReviewCard: Component<ReviewCardProps> = (props) => {
  return (
    <div
      class={`flex flex-col items-center text-center gap-2 ${props.class || ""}`}
    >
      <div
        class="rating rating-sm mb-1"
        role="img"
        aria-label={`Rated ${props.rating} out of 5`}
      >
        <For each={Array.from({ length: 5 })}>
          {(_, i) => (
            <div
              aria-hidden="true"
              aria-current={i() === props.rating - 1 ? "true" : undefined}
              class="mask mask-star-2 bg-orange-400"
              classList={{ "opacity-20": i() >= props.rating }}
            />
          )}
        </For>
      </div>
      <p class="text-sm italic text-base-content/90 leading-snug m-0!">
        "{props.quote}"
      </p>
      <span class="text-xs font-semibold text-base-content/60">
        — {props.author}
      </span>
    </div>
  );
};
