import "@/config/dayjs";
import { MetaProvider } from "@solidjs/meta";
import { Footer, Navbar } from "@/components/layout";
import { StructuredData } from "@/components/meta";
import { ContactSection } from "@/features/contact";
import { GitHubSection } from "@/features/github";
import { HeroBanner } from "@/features/hero";
import { ProjectsSection } from "@/features/projects";
import { ReviewsSection } from "@/features/reviews";
import { SkillsSection } from "@/features/skills";
import { TimelineSection } from "@/features/timeline";
import { DEFAULT_THEME } from "./config/daisyui";

export const App = () => {
  return (
    <MetaProvider>
      <StructuredData />
      <a
        href="#home"
        class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 btn btn-primary"
      >
        Skip to content
      </a>
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
        <ContactSection />
        <Footer />
      </div>
    </MetaProvider>
  );
};
