import { createResource, ErrorBoundary, Show, Suspense } from "solid-js";
import { Section } from "@/components/layout";
import { ContributionGrid } from "./components/ContributionGrid";
import { fetchGitHubContributions } from "./utils";

export const GitHubSection = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  return (
    <Section
      id="github"
      title="GitHub Activity"
      description="Can you guess when I broke production?"
      alternate
    >
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
              <div class="space-y-6">
                {/* Stats */}
                <div class="stats stats-vertical lg:stats-horizontal shadow w-full ">
                  {/* <div class="stats stats-vertical lg:stats-horizontal shadow w-full bg-base-100"> */}
                  <div class="stat">
                    <div class="stat-title">Total Contributions</div>
                    <div class="stat-value text-primary">
                      {data().totalContributions.toLocaleString()}
                    </div>
                    <div class="stat-desc">contributions this year</div>
                  </div>
                  <div class="stat">
                    <div class="stat-title">Current Streak</div>
                    <div class="stat-value text-secondary">
                      {data().currentStreak}
                    </div>
                    <div class="stat-desc">consecutive days</div>
                  </div>
                  <div class="stat">
                    <div class="stat-title">Longest Streak</div>
                    <div class="stat-value text-accent">
                      {data().longestStreak}
                    </div>
                    <div class="stat-desc">consecutive days</div>
                  </div>
                </div>

                {/* Contribution Grid */}
                <div class="card">
                  <div class="card-body">
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
