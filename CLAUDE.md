# Frontend Personal Website

Single-page site: Hero, Skills, Projects, Timeline, GitHub Activity, Reviews, Contact, one folder per section in `src/features/`. Navbar, Section and Footer live in `src/components/layout/`.

Stack: SvelteKit (static adapter, prerendered, no server code), Svelte 5 runes, Threlte + Three.js, Tailwind CSS v4, Lucide Svelte, Day.js, Bun.

Look: warm near-black, one yellow accent, Pixelify Sans for headings. Tokens live in `src/styles/index.css`; `docs/redesign.md` explains the direction.

## Commands

```bash
bun start              # Dev server
bun run build          # vite build, then scripts/cspHash.ts allows the inline boot script in the CSP
bun quality            # Everything CI runs but the build (also the pre-commit hook)
bun biome:check:fix    # Lint/format .ts, .json, .css
bun prettier:check:fix # Format .svelte (Biome cannot parse their templates)
bun run test           # Unit tests for pure utils
```

## Conventions

- Code used by one feature stays in `src/features/{name}/`; promote to `src/{type}/` only on a second consumer.
- This repo keeps barrels: `index.ts` at every level except `src/components/`, components re-exported as `export { default as X } from "./X.svelte"`.
- Logic worth testing goes in a plain `.ts` util next to a `.test.ts`, not in the component.
- DOM behaviour shared across components is an attachment (`{@attach ...}`), see `src/utils/`.
- Threlte stores (`size`, ...) are read as `$size` in reactive code: `.current` is not tracked.

## Motion and 3D

- Every animation has a `prefers-reduced-motion` path: CSS in `styles/index.css`, JS via `prefersReducedMotion` from `svelte/motion`.
- Three.js is dynamically imported after mount and only when `hasWebGL()` holds; the HTML is complete without it. Parents import the canvas component as `import type` only, or three.js lands in the main bundle.
- Canvases use `renderMode="on-demand"` and stop their task when offscreen or when the tab is hidden.
