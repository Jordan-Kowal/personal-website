import type { Component } from "solid-js";
import {
  createEffect,
  createMemo,
  createSignal,
  For,
  onCleanup,
  Show,
} from "solid-js";
import type { TimelineItem } from "../types";
import { dateToPosition } from "../utils";

const getYearStep = (width: number): number => {
  if (width >= 768) return 1;
  if (width >= 640) return 2;
  return 3;
};

type TimelineLineProps = {
  startYear: number;
  endYear: number;
  hoveredItem: TimelineItem | null;
};

export const TimelineLine: Component<TimelineLineProps> = (props) => {
  const [yearStep, setYearStep] = createSignal(getYearStep(window.innerWidth));

  createEffect(() => {
    const onResize = () => setYearStep(getYearStep(window.innerWidth));
    window.addEventListener("resize", onResize);
    onCleanup(() => window.removeEventListener("resize", onResize));
  });

  const years = createMemo(() => {
    const step = yearStep();
    const result: number[] = [];
    for (let y = props.startYear; y <= props.endYear; y += step) {
      result.push(y);
    }
    return result;
  });

  const highlightRange = createMemo(() => {
    if (!props.hoveredItem) return null;
    const startPos = dateToPosition(
      props.hoveredItem.startDate,
      props.startYear,
      props.endYear,
    );
    const isExperience = props.hoveredItem.category === "experience";
    const endPos = props.hoveredItem.endDate
      ? dateToPosition(
          props.hoveredItem.endDate,
          props.startYear,
          props.endYear,
        )
      : 100;
    return { left: startPos, width: endPos - startPos, isExperience };
  });

  return (
    <div class="relative h-1 w-full">
      {/* Solid base line */}
      <div class="absolute inset-0 rounded-full bg-base-300" />

      {/* Highlight range for hovered item */}
      <Show when={highlightRange()}>
        {(range) => (
          <div
            class="absolute top-0 h-full rounded-full transition-all duration-300"
            classList={{
              "bg-primary": range().isExperience,
              "bg-teal-500": !range().isExperience,
            }}
            style={{
              left: `${range().left}%`,
              width: `${range().width}%`,
            }}
          />
        )}
      </Show>

      {/* Year markers */}
      <For each={years()}>
        {(year) => {
          const left = () =>
            dateToPosition(`${year}-01-01`, props.startYear, props.endYear);
          return (
            <div
              class="absolute -top-0.5 z-20 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${left()}%` }}
            >
              <div class="h-2 w-2 rounded-full bg-base-content/30" />
              <span class="mt-1 select-none font-mono text-[10px] text-base-content/40">
                {year}
              </span>
            </div>
          );
        }}
      </For>
    </div>
  );
};
