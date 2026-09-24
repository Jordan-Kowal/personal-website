# Redesign v4: SvelteKit + Threlte

Branch `redesign-svelte`. Nothing committed, nothing deployed.

## The direction

A small island at golden hour that you land on, with the content laid out as physical cards around
it. Warm near-black, one yellow accent (the old site's), a pixel display face for headings. The
surface is quiet: each section gets one interaction that explains it, nothing more.

| Section | What it became | Its one signature |
| --- | --- | --- |
| Hero | Low-poly island in Threlte, with fog and golden light, a climbing crag, a stream with a waterfall, a bike and a forest. The portrait is a trading card standing on it | Camera follows the pointer, trees lean away from it and wobble when clicked. The card tilts with a holo sheen and flips to a character sheet. The name shuffles in |
| Skills | An inventory: three bags of square slots, each item a 3D model of its logo | Items turn toward the cursor; the inspected one spins, with its name. Category chips pick out their items and dim the rest |
| Projects | A card binder you drag through, the centre card facing you | Drag or flick through, click the centre card to flip it, click again to flip back |
| Timeline | A level map, oldest first: yellow quests (work), blue training (school) | The trail fills as you scroll, reached stops light up. Each stop ends on its reward: +Experience or +Intellect, and how long it lasted |
| GitHub | The year as a 3D city with a flag on the 1st of each month | Drag to orbit (all the way round, and over), zoom with the buttons or a pinch, hover a building to light it up and read the day |
| Reviews | Joke reviews tossed on a table | They pop in one by one; drag and throw them around, "Tidy up" deals them back |
| Contact | A big yellow disc | Glow that follows the pointer, text shuffles to "Say hi!" |

## Decisions I made alone, easy to undo

- **Display font**: Pixelify Sans, from Google Fonts like Nunito Sans (no package). One token:
  `--font-display` in `src/styles/index.css`.
- **Svelte Bits**: its components weren't copied in. Each needed `gsap` or `motion`, so the same
  effects are written with Svelte's own `Spring` and CSS. That's zero extra dependencies, and each
  one has a reduced-motion path.
- **Island placement**: the hero measures where the card is and passes that point to the scene, so
  the island stays under the card on every screen size.
- **Hero CTA**: "Press start" now leads to Skills (it starts the visit). The only contact action is
  the disc at the end, now labelled "Get in touch".
- **Level on the card** = current year minus 1989, so only the birth year ships. It ticks over on
  January 1st, not on the birthday.
- **Skill icons**: brand logos are vendored as SVG paths from simple-icons 16.31.0 (CC0), generic
  skills use Lucide's icon data (`src/features/skills/icons.ts`, generated). No package added. Dark
  brand colours (Three.js, Django) are lifted so they show on the page. Cut-out letters (CSS, JS,
  HTML5) are filled in near-black or off-white, whichever reads on the logo's colour.
- **CSP**: SvelteKit boots the page from an inline script. `scripts/cspHash.ts` adds its hash to
  `_headers` on every build, so no `unsafe-inline`. Tested with the real policy enforced: zero
  errors.

## Dependencies

Installed with your go: `svelte`, `@sveltejs/kit`, `@sveltejs/adapter-static`,
`@sveltejs/vite-plugin-svelte`, `svelte-check`, `three`, `@types/three`, `@threlte/core`,
`@threlte/extras`, `@lucide/svelte`. Removed: `solid-js`, `@solidjs/meta`, `lucide-solid`,
`vite-plugin-solid`, `solid-devtools`, `daisyui`, `@tailwindcss/typography`.

Your `bunfig.toml` refuses packages published less than 7 days ago, so `svelte` came in as 5.57.0
(latest 5.57.1), `@sveltejs/vite-plugin-svelte` as 7.3.0 and `@lucide/svelte` as 1.46.0.

Added after review: `typescript` back to 6.0.3 (`svelte-check` doesn't run on 7) and
`@types/bun` 1.4.0, both matching pushovers' `web/`.

## Verified

- `bun biome:check`: clean. `bun test src`: 89 pass, 0 fail. `bun run build`: no warnings.
- In a browser, with the production CSP enforced: 1440×900, 1920×1080, 390×844, a mobile to
  desktop resize, `prefers-reduced-motion`, and the page with JS blocked (all content readable).
- Interactions: card flip, project flip (focus moves to the face turned to), screenshot modal
  (arrows, Escape), review swipe, skyline drag and hover.
- Weight: Three.js is 195 KB gzipped, in its own chunk, loaded after the page appears and only
  if WebGL is available. The HTML is 10.5 KB gzipped.

## Not done, or not checked

- Real mobile touch (only emulated in Playwright), Safari, and an actual 60 fps pass on a modest
  machine.
- `public/og-image.jpg` and `public/screenshots/personal-website*.webp` still show the old site.
- Phase 2 as discussed: the live multiplayer island (Colyseus, like pushovers) and, if the island
  earns a physics toy, Rapier.
