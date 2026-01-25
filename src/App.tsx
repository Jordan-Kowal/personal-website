import "@/config/dayjs";
import { Footer } from "@/components/layout";
import { GitHubSection } from "@/features/github";
import { HeroBanner } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ReviewsSection } from "@/features/reviews";
import { SkillsSection } from "@/features/skills";
import { TimelineSection } from "@/features/timeline";
import { DEFAULT_THEME } from "./config/daisyui";

export const App = () => {
  return (
    <div
      data-theme={DEFAULT_THEME}
      class="min-w-full prose prose-sm md:prose-base bg-base-100"
    >
      <HeroBanner />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
      <GitHubSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};
