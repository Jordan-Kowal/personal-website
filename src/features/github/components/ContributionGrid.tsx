import type { Component } from "solid-js";
import { createResource, For, Show } from "solid-js";
import type { GitHubContribution } from "../types";
import { fetchGitHubContributions, getContributionLevelClass } from "../utils";

const formatShortDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

export const ContributionGrid: Component = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  return (
    <div class="w-full">
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

          return (
            <div class="flex gap-1 justify-center flex-wrap relative">
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
          );
        }}
      </Show>
    </div>
  );
};
