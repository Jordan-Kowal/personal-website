import type { Component } from "solid-js";
import {
  createResource,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
} from "solid-js";
import type { GitHubContribution } from "../types";
import { fetchGitHubContributions, getContributionLevelClass } from "../utils";

const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const ContributionGrid: Component = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);
  const [scale, setScale] = createSignal(1);
  const [gridHeight, setGridHeight] = createSignal(0);
  let wrapperRef!: HTMLDivElement;
  let gridRef!: HTMLDivElement;

  const updateScale = () => {
    if (!gridRef) return;
    const availableWidth = window.innerWidth - 32;
    const gridWidth = gridRef.offsetWidth;
    const newScale = Math.min(1, availableWidth / gridWidth);
    setScale(newScale);
    setGridHeight(gridRef.offsetHeight * newScale);
  };

  onMount(() => {
    window.addEventListener("resize", updateScale);
    onCleanup(() => window.removeEventListener("resize", updateScale));
  });

  return (
    <div ref={wrapperRef} class="w-full overflow-hidden">
      <Show
        when={!contributionsData.loading && contributionsData()}
        fallback={
          <div class="flex justify-center items-center py-12">
            <span class="loading loading-spinner loading-lg"></span>
          </div>
        }
      >
        {(data) => {
          const contributions = () => data().contributions;
          const weeks: GitHubContribution[][] = [];
          let currentWeek: GitHubContribution[] = [];

          contributions().forEach((contribution, index) => {
            currentWeek.push(contribution);
            if (
              currentWeek.length === 7 ||
              index === contributions().length - 1
            ) {
              while (
                currentWeek.length < 7 &&
                index === contributions().length - 1
              ) {
                currentWeek.push({
                  date: "",
                  count: 0,
                  level: 0,
                });
              }
              weeks.push([...currentWeek]);
              currentWeek = [];
            }
          });

          requestAnimationFrame(updateScale);

          return (
            <div
              style={{ height: gridHeight() ? `${gridHeight()}px` : "auto" }}
            >
              <div
                ref={gridRef}
                class="flex gap-1 absolute left-1/2"
                style={{
                  transform: `translateX(-50%) scale(${scale()})`,
                  "transform-origin": "top center",
                }}
              >
                <For each={weeks}>
                  {(week) => (
                    <div class="flex flex-col gap-1">
                      <For each={week}>
                        {(contribution) => (
                          <Show
                            when={contribution.date}
                            fallback={
                              <div class="w-3 h-3 rounded-sm bg-transparent" />
                            }
                          >
                            <Show
                              when={contribution.count > 0}
                              fallback={
                                <div
                                  class={`w-3 h-3 rounded-sm ${getContributionLevelClass(contribution.level)}`}
                                />
                              }
                            >
                              <div
                                class="tooltip tooltip-top cursor-pointer"
                                data-tip={`${contribution.count} contributions on ${formatShortDate(contribution.date)}`}
                              >
                                <div
                                  class={`w-3 h-3 rounded-sm ${getContributionLevelClass(contribution.level)}`}
                                />
                              </div>
                            </Show>
                          </Show>
                        )}
                      </For>
                    </div>
                  )}
                </For>
              </div>
            </div>
          );
        }}
      </Show>
    </div>
  );
};
