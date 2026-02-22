import { Briefcase } from "lucide-solid";
import { createSignal, For } from "solid-js";
import { Section } from "@/components/layout";
import { ProjectCard } from "./components/ProjectCard";

type Project = {
  id: number;
  title: string;
  description: string;
  technologies: string[];
};

const projects: Project[] = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description:
      "A full-featured e-commerce platform with payment integration, inventory management, and admin dashboard.",
    technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
  },
  {
    id: 2,
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates, drag-and-drop, and team collaboration features.",
    technologies: ["Vue.js", "Firebase", "TypeScript"],
  },
  {
    id: 3,
    title: "Weather Dashboard",
    description:
      "Beautiful weather dashboard with forecasts, maps, and weather alerts for multiple locations.",
    technologies: ["Solid.js", "OpenWeather API", "Tailwind CSS"],
  },
  {
    id: 4,
    title: "Social Media Analytics",
    description:
      "Analytics platform for social media metrics with data visualization, reports, and insights.",
    technologies: ["Python", "Django", "Chart.js", "PostgreSQL"],
  },
  {
    id: 5,
    title: "Learning Management System",
    description:
      "Online learning platform with courses, quizzes, progress tracking, and certificate generation.",
    technologies: ["React", "MongoDB", "Express", "Node.js"],
  },
  {
    id: 6,
    title: "Recipe Sharing App",
    description:
      "Community-driven recipe sharing platform with search, favorites, meal planning, and shopping lists.",
    technologies: ["Next.js", "Prisma", "PostgreSQL", "AWS"],
  },
];

export const ProjectsSection = () => {
  const [currentIndex, setCurrentIndex] = createSignal(0);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  };

  return (
    <Section id="projects" title="Projects" alternate icon={Briefcase}>
      <div class="relative flex h-[400px] items-center justify-center overflow-hidden">
        <For each={projects}>
          {(project, index) => {
            // Calcul réactif - currentIndex() déclenche la réactivité
            const relativePosition = () => {
              const current = currentIndex();
              const total = projects.length;
              let pos = index() - current;

              // Normaliser la position relative pour gérer le wrap-around
              if (pos > total / 2) {
                pos -= total;
              } else if (pos < -total / 2) {
                pos += total;
              }

              return pos;
            };

            const style = () => {
              const pos = relativePosition();
              const baseOffset = 150;
              const offset = pos * baseOffset;
              let scale = 1;
              let zIndex = 20;

              if (pos === 0) {
                scale = 1;
                zIndex = 20;
              } else if (Math.abs(pos) === 1) {
                scale = 0.9;
                zIndex = 10;
              } else if (Math.abs(pos) === 2) {
                scale = 0.8;
                zIndex = 0;
              } else {
                scale = 0;
                zIndex = -1;
              }

              return {
                transform: `translateX(calc(-50% + ${offset}px)) scale(${scale})`,
                "z-index": zIndex,
                opacity: scale > 0 ? 1 : 0,
              };
            };

            return (
              <div
                class="absolute left-1/2 h-[400px] w-[300px] origin-center transition-all duration-500 ease-in-out"
                style={style()}
              >
                <ProjectCard
                  title={project.title}
                  description={project.description}
                  technologies={project.technologies}
                  isActive={relativePosition() === 0}
                />
              </div>
            );
          }}
        </For>
      </div>

      {/* Navigation */}
      <div class="mt-8 flex justify-center gap-4">
        <button
          onclick={goToPrev}
          class="btn btn-outline btn-primary"
          aria-label="Previous project"
          type="button"
        >
          ← Previous
        </button>
        <div class="flex items-center gap-2">
          <span class="text-sm">
            {currentIndex() + 1} / {projects.length}
          </span>
        </div>
        <button
          onclick={goToNext}
          class="btn btn-outline btn-primary"
          type="button"
          aria-label="Next project"
        >
          Next →
        </button>
      </div>
    </Section>
  );
};
