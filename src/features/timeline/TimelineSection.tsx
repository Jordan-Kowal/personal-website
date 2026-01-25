import { Briefcase, Code, Database, GraduationCap, Users } from "lucide-solid";
import { createMemo, createSignal, For, Show } from "solid-js";
import { ContentContainer } from "@/components/layout";
import { TimelineCard } from "./components/TimelineCard";
import { educationData, experienceData } from "./data";
import type { TimelineView } from "./types";
import { calculateExperienceStats } from "./utils";

export const TimelineSection = () => {
  const [view, setView] = createSignal<TimelineView>("experience");

  const stats = createMemo(() => calculateExperienceStats());

  const currentData = createMemo(() => {
    const data = view() === "education" ? educationData : experienceData;
    // Inverser l'ordre pour commencer par le plus récent
    return [...data].reverse();
  });

  // Générer les années pour les badges (tous les 5 ans de 2010 à aujourd'hui)
  const years = createMemo(() => {
    const startYear = 2010;
    const endYear = new Date().getFullYear();
    const yearList: number[] = [];

    // Ajouter les années tous les 5 ans à partir de 2010
    for (let year = startYear; year <= endYear; year += 5) {
      yearList.push(year);
    }

    // Toujours inclure l'année actuelle si elle n'est pas déjà incluse
    if (yearList[yearList.length - 1] !== endYear) {
      yearList.push(endYear);
    }

    return yearList;
  });

  const getYear = (dateString: string) => {
    return new Date(dateString).getFullYear();
  };

  const shouldShowYearBadge = (itemYear: number, index: number) => {
    const yearsList = years();
    const itemIndex = yearsList.indexOf(itemYear);

    // Afficher le badge si c'est une année marquante (tous les 5 ans)
    if (itemIndex !== -1) {
      return true;
    }

    // Afficher aussi pour le premier élément
    return index === 0;
  };

  return (
    <section class="py-16">
      <ContentContainer>
        <h2 class="mb-8 text-center text-4xl font-bold">Timeline</h2>

        {/* Stats */}
        <div class="mb-12 stats stats-vertical lg:stats-horizontal shadow w-full">
          <div class="stat">
            <div class="stat-figure text-primary">
              <Database size={24} />
            </div>
            <div class="stat-title">Backend</div>
            <div class="stat-value text-primary">{stats().backendYears}+</div>
            <div class="stat-desc">années d'expérience</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-secondary">
              <Users size={24} />
            </div>
            <div class="stat-title">Product Management</div>
            <div class="stat-value text-secondary">
              {stats().productManagementYears}+
            </div>
            <div class="stat-desc">années d'expérience</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-accent">
              <Code size={24} />
            </div>
            <div class="stat-title">Software Developer</div>
            <div class="stat-value text-accent">
              {stats().softwareDeveloperYears}+
            </div>
            <div class="stat-desc">années d'expérience</div>
          </div>

          <div class="stat">
            <div class="stat-figure text-info">
              <Briefcase size={24} />
            </div>
            <div class="stat-title">Total Expérience</div>
            <div class="stat-value text-info">{stats().totalYears}+</div>
            <div class="stat-desc">années professionnelles</div>
          </div>
        </div>

        {/* Toggle buttons */}
        <div class="mb-12 flex justify-center">
          <div class="join">
            <button
              onclick={() => setView("experience")}
              class={`join-item btn btn-lg ${
                view() === "experience"
                  ? "btn-active btn-primary"
                  : "btn-outline btn-primary"
              }`}
              type="button"
            >
              <Briefcase size={20} />
              Expérience
            </button>
            <button
              onclick={() => setView("education")}
              class={`join-item btn btn-lg ${
                view() === "education"
                  ? "btn-active btn-primary"
                  : "btn-outline btn-primary"
              }`}
              type="button"
            >
              <GraduationCap size={20} />
              Éducation
            </button>
          </div>
        </div>

        {/* Timeline DaisyUI */}
        <ul class="timeline timeline-snap-icon timeline-vertical max-md:timeline-compact">
          <For each={currentData()}>
            {(item, index) => {
              const isEven = () => index() % 2 === 0;
              const isLast = () => index() === currentData().length - 1;
              const itemYear = getYear(item.startDate);
              const showBadge = shouldShowYearBadge(itemYear, index());

              return (
                <li>
                  <Show when={index() > 0}>
                    <hr />
                  </Show>
                  <div
                    class={`timeline-${isEven() ? "start" : "end"} mb-10 ${
                      isEven() ? "md:text-end" : ""
                    }`}
                  >
                    <TimelineCard item={item} />
                  </div>
                  <div class="timeline-middle">
                    <div class="flex flex-col items-center gap-2">
                      <Show
                        when={view() === "experience"}
                        fallback={<GraduationCap size={20} />}
                      >
                        <Briefcase size={20} />
                      </Show>
                      <Show when={showBadge}>
                        <span class="badge badge-primary badge-lg font-mono">
                          {itemYear}
                        </span>
                      </Show>
                    </div>
                  </div>
                  <Show when={!isLast()}>
                    <hr />
                  </Show>
                </li>
              );
            }}
          </For>
        </ul>
      </ContentContainer>
    </section>
  );
};
