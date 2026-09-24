// Post-build step. SvelteKit boots the prerendered page from an inline <script>, which the CSP in
// `_headers` (`script-src 'self'`) would block. This allows exactly that script by its hash,
// recomputed on every build, so there is never a stale hash nor an 'unsafe-inline'.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const OUTPUT_DIR = "dist";
const INLINE_SCRIPT = /<script>([\s\S]*?)<\/script>/g;
const SCRIPT_SRC = "script-src 'self'";

const html = readFileSync(`${OUTPUT_DIR}/index.html`, "utf8");
const hashes = [...html.matchAll(INLINE_SCRIPT)].map(
  ([, body]) =>
    `'sha256-${createHash("sha256").update(body).digest("base64")}'`,
);
if (hashes.length === 0) {
  throw new Error(
    "No inline script found in index.html: the CSP step is out of date.",
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
  headers.replace(SCRIPT_SRC, `${SCRIPT_SRC} ${hashes.join(" ")}`),
);
console.log(`CSP: allowed ${hashes.length} inline script(s) by hash.`);
