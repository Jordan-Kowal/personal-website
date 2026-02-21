import type { Component } from "solid-js";
import { createResource, For, Show } from "solid-js";
import type { GitHubContribution } from "../types";
import { fetchGitHubContributions, getContributionLevelClass } from "../utils";

export const ContributionGrid: Component = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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
              // Compléter la dernière semaine si nécessaire
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
                      {(contribution, dayIndex) => (
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
                              class={`tooltip ${dayIndex() < 3 ? "tooltip-bottom" : "tooltip-top"}`}
                              data-tip={`${contribution.count} ${contribution.count === 1 ? "contribution" : "contributions"} on ${formatShortDate(contribution.date)}`}
                            >
                              <div
                                class={`w-3 h-3 rounded-sm ${getContributionLevelClass(contribution.level)} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
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
