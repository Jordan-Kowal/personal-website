// Post-build step. SvelteKit boots each prerendered page from an inline <script>, which the CSP in
// `_headers` (`script-src 'self'`) would block. This allows exactly those scripts by their hash,
// recomputed on every build, so there is never a stale hash nor an 'unsafe-inline'.
// The CSP is shared by every page, so it carries the hashes of all of them.
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";

const OUTPUT_DIR = "dist";
const INLINE_SCRIPT = /<script>([\s\S]*?)<\/script>/g;
const SCRIPT_SRC = "script-src 'self'";

const pages = readdirSync(OUTPUT_DIR, { recursive: true, encoding: "utf8" })
  .filter((file) => file.endsWith(".html"))
  .map((file) => readFileSync(`${OUTPUT_DIR}/${file}`, "utf8"));
const hashes = new Set(
  pages.flatMap((html) =>
    [...html.matchAll(INLINE_SCRIPT)].map(
      ([, body]) =>
        `'sha256-${createHash("sha256").update(body).digest("base64")}'`,
    ),
  ),
);
if (hashes.size === 0) {
  throw new Error(
    "No inline script found in the built pages: the CSP step is out of date.",
  );
}

const headersPath = `${OUTPUT_DIR}/_headers`;
const headers = readFileSync(headersPath, "utf8");
if (!headers.includes(SCRIPT_SRC)) {
  throw new Error(
    `"${SCRIPT_SRC}" not found in _headers: the CSP step is out of date.`,
  );
}
writeFileSync(
  headersPath,
  headers.replace(SCRIPT_SRC, `${SCRIPT_SRC} ${[...hashes].join(" ")}`),
);
console.log(
  `CSP: allowed ${hashes.size} inline script(s) by hash across ${pages.length} page(s).`,
);
