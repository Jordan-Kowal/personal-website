import { Github } from "lucide-solid";
import { createResource, ErrorBoundary, Show, Suspense } from "solid-js";
import { Section } from "@/components/layout";
import { ContributionGrid } from "./components/ContributionGrid";
import { fetchGitHubContributions } from "./utils";

export const GitHubSection = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  return (
    <Section id="github" title="GitHub Activity" alternate icon={Github}>
      <ErrorBoundary
        fallback={(err) => (
          <div class="alert alert-error">
            <span>Error loading GitHub data: {err.message}</span>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div class="flex justify-center items-center py-12">
              <span class="loading loading-spinner loading-lg"></span>
            </div>
          }
        >
          <Show when={contributionsData()}>
            {(data) => (
              <div class="flex flex-col items-center gap-6">
                <div class="stats stats-vertical sm:stats-horizontal shadow max-w-xl mx-auto">
                  <div class="stat min-w-40">
                    <div class="stat-title">Total contributions</div>
                    <div class="stat-value text-primary">
                      {data().totalContributions.toLocaleString()}
                    </div>
                    <div class="stat-desc">contributions this year</div>
                  </div>
                  <div class="stat min-w-40">
                    <div class="stat-title">Current streak</div>
                    <div class="stat-value text-secondary">
                      {data().currentStreak}
                    </div>
                    <div class="stat-desc">consecutive days</div>
                  </div>
                  <div class="stat min-w-40">
                    <div class="stat-title">Days since last incident</div>
                    <div class="stat-value text-accent">??</div>
                    <div class="stat-desc">it's gonna be fine...</div>
                  </div>
                </div>

                <div class="card">
                  <div class="card-body pb-0!">
                    <ContributionGrid />
                    <div class="mt-4 flex items-center justify-center gap-4 text-sm text-base-content/70">
                      <span>Less</span>
                      <div class="flex gap-1">
                        <div class="w-3 h-3 rounded-sm bg-base-300"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/20"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/40"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary/60"></div>
                        <div class="w-3 h-3 rounded-sm bg-primary"></div>
                      </div>
                      <span>More</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Show>
        </Suspense>
      </ErrorBoundary>
    </Section>
  );
};
