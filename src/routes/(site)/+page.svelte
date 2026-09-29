<script lang="ts">
  import { Footer, Navbar } from "@/components/layout";
  import { ContactSection } from "@/features/contact";
  import { GitHubSection } from "@/features/github";
  import { HeroBanner } from "@/features/hero";
  import { ProjectsSection } from "@/features/projects";
  import { ReviewsSection } from "@/features/reviews";
  import { SkillsSection } from "@/features/skills";
  import { TimelineSection } from "@/features/timeline";
</script>

<a
  href="#skills"
  class="sr-only rounded-full bg-accent px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100"
>
  Skip to content
</a>
<div class="grain">
  <Navbar />
  <HeroBanner />
  <main>
    <SkillsSection />
    <ProjectsSection />
    <TimelineSection />
    <GitHubSection />
    <ReviewsSection />
    <ContactSection />
  </main>
  <Footer />
</div>
