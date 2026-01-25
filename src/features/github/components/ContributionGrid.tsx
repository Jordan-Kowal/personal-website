import type { Component } from "solid-js";
import { createResource, For, Show } from "solid-js";
import type { GitHubContribution } from "../types";
import { fetchGitHubContributions, getContributionLevelClass } from "../utils";

export const ContributionGrid: Component = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  const formatShortDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div class="w-full overflow-x-auto">
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
                          <div class="relative group">
                            <div
                              class={`w-3 h-3 rounded-sm ${getContributionLevelClass(
                                contribution.level,
                              )} hover:ring-2 hover:ring-primary transition-all cursor-pointer`}
                            />
                            {/* Tooltip au hover - positionné en bas si en haut de la grille, en haut si en bas */}
                            <div
                              class={`absolute left-1/2 -translate-x-1/2 hidden group-hover:block z-50 whitespace-nowrap ${
                                dayIndex() < 3
                                  ? "top-full mt-2"
                                  : "bottom-full mb-2"
                              }`}
                            >
                              <div class="bg-base-200 text-base-content px-2 py-1 rounded shadow-lg border border-base-300 text-xs">
                                <div class="font-semibold">
                                  {contribution.count} contribution
                                  {contribution.count !== 1 ? "s" : ""}
                                </div>
                                <div class="text-base-content/70">
                                  {formatShortDate(contribution.date)}
                                </div>
                              </div>
                              {/* Flèche du tooltip */}
                              <div
                                class={`absolute left-1/2 -translate-x-1/2 ${
                                  dayIndex() < 3
                                    ? "bottom-full mb-0"
                                    : "top-full mt-0"
                                }`}
                              >
                                <div
                                  class={`w-2 h-2 bg-base-200 border-r border-b border-base-300 ${
                                    dayIndex() < 3 ? "rotate-225" : "rotate-45"
                                  }`}
                                ></div>
                              </div>
                            </div>
                          </div>
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
