import { useHead } from "@solidjs/meta";
import { createUniqueId } from "solid-js";
import { PERSON_SCHEMA } from "@/config/structuredData";

/**
 * Injects the schema.org JSON-LD block into <head>.
 *
 * Renders nothing — it only registers a head tag via @solidjs/meta. Because
 * the script is emitted by the app bundle (not written inline in index.html),
 * it is covered by the CSP `script-src 'self'`; there is no inline-script hash
 * to recompute when the schema changes.
 */
export const StructuredData = () => {
  useHead({
    tag: "script",
    id: createUniqueId(),
    props: {
      type: "application/ld+json",
      children: JSON.stringify(PERSON_SCHEMA),
    },
  });

  return null;
};
