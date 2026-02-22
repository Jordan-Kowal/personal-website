import { Clock } from "lucide-solid";
import { createMemo, For } from "solid-js";
import { Section } from "@/components/layout";
import { educationData, experienceData } from "./data";

export const TimelineSection = () => {
  // Extraire toutes les dates uniques (début et fin) de toutes les données
  const allDates = createMemo(() => {
    const dates = new Set<number>();

    // Ajouter les dates de l'expérience
    experienceData.forEach((item) => {
      dates.add(new Date(item.startDate).getFullYear());
      if (item.endDate) {
        dates.add(new Date(item.endDate).getFullYear());
      }
    });

    // Ajouter les dates de l'éducation
    educationData.forEach((item) => {
      dates.add(new Date(item.startDate).getFullYear());
      if (item.endDate) {
        dates.add(new Date(item.endDate).getFullYear());
      }
    });

    // Trier les dates par ordre croissant
    return Array.from(dates).sort((a, b) => a - b);
  });

  return (
    <Section id="timeline" title="Timeline" icon={Clock}>
      {/* Timeline horizontale DaisyUI */}
      <ul class="timeline timeline-horizontal w-full overflow-x-auto pb-4">
        <For each={allDates()}>
          {(year, index) => {
            const isLast = () => index() === allDates().length - 1;

            return (
              <li>
                <div class="timeline-start timeline-box">
                  <div class="font-mono text-lg font-bold">{year}</div>
                </div>
                {!isLast() && <hr />}
              </li>
            );
          }}
        </For>
      </ul>
    </Section>
  );
};
