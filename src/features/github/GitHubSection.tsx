import { Github } from "lucide-solid";
import { createResource, ErrorBoundary, Show, Suspense } from "solid-js";
import { ContentContainer } from "@/components/layout";
import { ContributionGrid } from "./components/ContributionGrid";
import { fetchGitHubContributions } from "./utils";

export const GitHubSection = () => {
  const [contributionsData] = createResource(fetchGitHubContributions);

  return (
    <section id="github" class="py-16 bg-base-200">
      <ContentContainer>
        <div class="mb-8 text-center">
          <h2 class="mb-4 text-4xl font-bold flex items-center justify-center gap-3">
            <Github size={32} />
            Activité GitHub
          </h2>
          <p class="text-base-content/70">
            Découvrez mes contributions open source et projets sur GitHub
          </p>
        </div>

        <div class="mb-6 flex justify-center">
          <a
            href="https://github.com/Jordan-Kowal"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-primary btn-outline"
          >
            <Github size={20} />
            Voir mon profil GitHub
          </a>
        </div>

        <ErrorBoundary
          fallback={(err) => (
            <div class="alert alert-error">
              <span>
                Erreur lors du chargement des données GitHub: {err.message}
              </span>
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
                  <div class="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div class="stat">
                      <div class="stat-title">Contributions totales</div>
                      <div class="stat-value text-primary">
                        {data().totalContributions.toLocaleString()}
                      </div>
                      <div class="stat-desc">contributions cette année</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title">Série actuelle</div>
                      <div class="stat-value text-secondary">
                        {data().currentStreak}
                      </div>
                      <div class="stat-desc">jours consécutifs</div>
                    </div>
                    <div class="stat">
                      <div class="stat-title">Meilleure série</div>
                      <div class="stat-value text-accent">
                        {data().longestStreak}
                      </div>
                      <div class="stat-desc">jours consécutifs</div>
                    </div>
                  </div>

                  {/* Grille de contributions */}
                  <div class="card bg-base-100 shadow-xl">
                    <div class="card-body">
                      <h3 class="card-title mb-4">Grille d'activité</h3>
                      <ContributionGrid />
                      <div class="mt-4 flex items-center justify-center gap-4 text-sm text-base-content/70">
                        <span>Moins</span>
                        <div class="flex gap-1">
                          <div class="w-3 h-3 rounded-sm bg-base-300"></div>
                          <div class="w-3 h-3 rounded-sm bg-primary/20"></div>
                          <div class="w-3 h-3 rounded-sm bg-primary/40"></div>
                          <div class="w-3 h-3 rounded-sm bg-primary/60"></div>
                          <div class="w-3 h-3 rounded-sm bg-primary"></div>
                        </div>
                        <span>Plus</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Show>
          </Suspense>
        </ErrorBoundary>
      </ContentContainer>
    </section>
  );
};
