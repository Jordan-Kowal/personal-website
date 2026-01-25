import "@/config/dayjs";
import { Footer, Navbar } from "@/components/layout";
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
      id="home"
      data-theme={DEFAULT_THEME}
      class="min-w-full prose prose-sm md:prose-base bg-base-100"
    >
      <HeroBanner />
      <Navbar />
      <SkillsSection />
      <ProjectsSection />
      <TimelineSection />
      <GitHubSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};
