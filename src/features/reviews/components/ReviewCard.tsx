import type { Component } from "solid-js";
import { For, Show } from "solid-js";
import type { Review } from "../types";

type ReviewCardProps = {
  review: Review;
};

export const ReviewCard: Component<ReviewCardProps> = (props) => {
  return (
    <div class="card bg-base-100 shadow-xl h-full">
      <div class="card-body">
        {/* Rating */}
        <div class="rating rating-sm mb-3">
          <For each={Array.from({ length: 5 })}>
            {(_, index) => {
              const isFilled = index() < props.review.rating;
              return (
                <div
                  class={`mask mask-star-2 ${isFilled ? "bg-warning" : "bg-base-300"}`}
                  aria-label={`${index() + 1} star`}
                  aria-current={isFilled ? "true" : undefined}
                  role="img"
                />
              );
            }}
          </For>
        </div>

        {/* Comment */}
        <p class="italic text-base-content/90 mb-4 flex-1">
          "{props.review.comment}"
        </p>

        {/* Name avec avatar */}
        <div class="flex items-center justify-between gap-2">
          <div class="text-sm font-semibold text-base-content/70">
            — {props.review.name}
          </div>
          <Show when={props.review.avatar}>
            <div class="avatar">
              <div class="w-8 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img src={props.review.avatar} alt={props.review.name} />
              </div>
            </div>
          </Show>
        </div>
      </div>
    </div>
  );
};
