import { SOCIALS } from "@/config/socials";

/**
 * Schema.org JSON-LD structured data for the site.
 *
 * Prerendered into <head> by the root layout. A JSON-LD block is data, never
 * executed, so the CSP `script-src` does not apply to it.
 *
 * Uses the `Person` type (this is a personal/resume site). `sameAs` lists the
 * public social profiles so search engines link this page to those identities.
 */
export const PERSON_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Jordan Kowal",
  url: "https://www.jordankowal.com",
  image: "https://www.jordankowal.com/logo.png",
  jobTitle: "Software Engineer",
  description:
    "Fullstack engineer with a product mindset, leveraging AI to ship faster and smarter.",
  sameAs: [SOCIALS.github, SOCIALS.linkedin, SOCIALS.youtube],
} as const;
