// Static SVGs for the GitHub profile README (github.com/Jordan-Kowal/Jordan-Kowal): `bun docs/github-profile/generate.ts`.
// Writes self-contained SVGs to ./assets. GitHub's image proxy blocks fetches from inside an SVG,
// so fonts and bitmaps are inlined as data URIs, and all motion is CSS keyframes (no JS in <img>).
// Copy ./assets into the profile repo after a run. Its daily starfall.svg is drawn there, by scripts/starfall.ts.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { $ } from "bun";
import { CATEGORY_COLORS, SKILL_GROUPS } from "@/features/skills/constants";
import { SKILL_ICONS } from "@/features/skills/icons";
import { liftColor } from "@/features/skills/utils";
import { experienceData } from "@/features/timeline/data";

const ROOT = import.meta.dir;
const RAW = join(ROOT, "raw");
const ASSETS = join(ROOT, "assets");
const BIRTH_YEAR = 1989;

const C = {
  page: "#14110e",
  surface: "#1d1814",
  raised: "#262019",
  line: "#342b22",
  ink: "#f4ede4",
  muted: "#a89a8b",
  accent: "#ffc83d",
  accentDeep: "#f59e0b",
  onAccent: "#1a1204",
};
const EASE_ARRIVE = "cubic-bezier(0.19, 1, 0.22, 1)";

mkdirSync(RAW, { recursive: true });
mkdirSync(ASSETS, { recursive: true });

// ---------- Fonts ----------

const FONT_SOURCES = {
  pixel400: "Pixelify+Sans:wght@400",
  pixel700: "Pixelify+Sans:wght@700",
  sans400: "Nunito+Sans:wght@400",
  sans700: "Nunito+Sans:wght@700",
} as const;

const fetchFont = async (name: keyof typeof FONT_SOURCES) => {
  const woff2 = join(RAW, `${name}.woff2`);
  if (!existsSync(woff2)) {
    // Without a browser user agent, Google Fonts answers with plain TTF URLs.
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=${FONT_SOURCES[name]}`,
      )
    ).text();
    const url = css.match(/url\((https:[^)]+\.ttf)\)/)?.[1];
    if (!url) throw new Error(`No TTF for ${name}`);
    const ttf = join(RAW, `${name}.ttf`);
    writeFileSync(ttf, new Uint8Array(await (await fetch(url)).arrayBuffer()));
    await $`uvx --from fonttools[woff] pyftsubset ${ttf} --unicodes=U+0020-007E,U+00B7,U+2022,U+2190-2193,U+25B6,U+2605 --flavor=woff2 --output-file=${woff2}`.quiet();
  }
  return readFileSync(woff2).toString("base64");
};

const FONTS = {
  pixel400: await fetchFont("pixel400"),
  pixel700: await fetchFont("pixel700"),
  sans400: await fetchFont("sans400"),
  sans700: await fetchFont("sans700"),
};

const fontFace = (uses: Array<keyof typeof FONTS>) =>
  uses
    .map((key) => {
      const family = key.startsWith("pixel") ? "Pixelify" : "Nunito";
      const weight = key.endsWith("700") ? 700 : 400;
      return `@font-face{font-family:${family};font-weight:${weight};src:url(data:font/woff2;base64,${FONTS[key]}) format("woff2")}`;
    })
    .join("");

const BASE_CSS = `.px{font-family:Pixelify,ui-monospace,monospace}.sans{font-family:Nunito,-apple-system,"Segoe UI",sans-serif}`;
const REDUCED = (rules: string) =>
  `@media (prefers-reduced-motion: reduce){${rules}}`;

const svg = (width: number, height: number, style: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>${style}</style>${body}</svg>`;

const escapeXml = (text: string) =>
  text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const bitmap = async (input: string, crop: string, width: number) => {
  const out = join(RAW, `${crop.replaceAll(/[^0-9]/g, "_")}-${width}.webp`);
  await $`magick ${input} -crop ${crop} +repage -resize ${width}x -quality 82 ${out}`.quiet();
  return `data:image/webp;base64,${readFileSync(out).toString("base64")}`;
};

// ---------- Lucide icons ----------

const lucide = (name: string) => {
  const source = readFileSync(
    join(ROOT, `../../node_modules/@lucide/svelte/dist/icons/${name}.svelte`),
    "utf8",
  );
  return [...source.matchAll(/\[\s*"(\w+)",\s*(\{[^}]*\})\s*\]/g)]
    .map(([, tag, attrs]) => {
      const pairs = Object.entries(JSON.parse(attrs) as Record<string, string>)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${tag} ${pairs}/>`;
    })
    .join("");
};
const LINKEDIN = `<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>`;

const icon = ({
  nodes,
  x,
  y,
  size,
  color,
}: {
  nodes: string;
  x: number;
  y: number;
  size: number;
  color: string;
}) =>
  `<g transform="translate(${x} ${y}) scale(${size / 24})" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${nodes}</g>`;

// ---------- banner ----------

const buildBanner = async () => {
  const hero = join(ROOT, "hero.png");
  const island = await bitmap(hero, "800x560+680+430", 640);
  const cloudBig = await bitmap(hero, "220x150+1128+58", 220);
  const cloudSmall = await bitmap(hero, "170x115+575+112", 170);
  const W = 1280;
  const H = 420;
  const style = `${fontFace(["pixel400", "pixel700", "sans400"])}${BASE_CSS}
.in{animation:in 900ms ${EASE_ARRIVE} backwards}
.d1{animation-delay:120ms}.d2{animation-delay:260ms}.d3{animation-delay:420ms}.d4{animation-delay:700ms}
@keyframes in{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}
.island{animation:bob 6s ease-in-out infinite alternate}
@keyframes bob{from{transform:translateY(0)}to{transform:translateY(-10px)}}
.cloud1{animation:drift 14s ease-in-out infinite alternate}
.cloud2{animation:drift 19s ease-in-out infinite alternate-reverse}
@keyframes drift{from{transform:translateX(-18px)}to{transform:translateX(22px)}}
.blink{animation:blink 1.1s steps(1) infinite}
@keyframes blink{50%{opacity:0}}
.spark{animation:twinkle 2.4s ease-in-out infinite}
@keyframes twinkle{0%,100%{opacity:.15}50%{opacity:1}}
${REDUCED(".in,.island,.cloud1,.cloud2,.blink,.spark{animation:none}")}`;
  const sparks = [
    [640, 92, 0],
    [1210, 300, 0.8],
    [760, 360, 1.5],
    [1180, 70, 2],
    [560, 330, 1.1],
  ]
    .map(
      ([x, y, delay]) =>
        `<rect class="spark" x="${x}" y="${y}" width="4" height="4" fill="${C.accent}" style="animation-delay:${delay}s"/>`,
    )
    .join("");
  const body = `
<defs>
  <radialGradient id="glow" cx="0.72" cy="0.55" r="0.55">
    <stop offset="0" stop-color="#4a3418" stop-opacity="0.9"/>
    <stop offset="1" stop-color="${C.page}" stop-opacity="0"/>
  </radialGradient>
  <radialGradient id="fade" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0.62" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
  </radialGradient>
  <mask id="softIsland" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#fade)"/></mask>
  <mask id="softCloud" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#fade)"/></mask>
</defs>
<rect width="${W}" height="${H}" rx="22" fill="${C.page}"/>
<rect width="${W}" height="${H}" rx="22" fill="url(#glow)"/>
<g class="cloud1"><image href="${cloudSmall}" x="640" y="40" width="170" height="115" mask="url(#softCloud)"/></g>
<g class="cloud2"><image href="${cloudBig}" x="1040" y="22" width="220" height="150" mask="url(#softCloud)"/></g>
<g class="island"><image href="${island}" x="660" y="0" width="620" height="434" mask="url(#softIsland)"/></g>
${sparks}
<g class="in d1"><text class="px" x="72" y="138" font-size="17" letter-spacing="6" fill="${C.accent}">PLAYER 1 · SOFTWARE ENGINEER</text></g>
<g class="in d2"><text class="px" x="68" y="226" font-size="86" font-weight="700" fill="${C.ink}">Jordan Kowal</text></g>
<g class="in d3"><text class="sans" x="72" y="276" font-size="22" fill="${C.muted}">Fullstack engineer with a product mindset,</text>
<text class="sans" x="72" y="306" font-size="22" fill="${C.muted}">leveraging AI to ship faster and smarter.</text></g>
<g class="in d4"><text class="px blink" x="72" y="368" font-size="18" letter-spacing="4" fill="${C.accent}">▶ PRESS START</text></g>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="${C.line}"/>`;
  writeFileSync(join(ASSETS, "banner.svg"), svg(W, H, style, body));
};

// ---------- buttons ----------

// Advance widths per character, in em, read from the subset fonts so pills fit their label.
const measureFont = async (key: keyof typeof FONTS) => {
  const script = `import json,sys;from fontTools.ttLib import TTFont;f=TTFont(sys.argv[1]);m=f["hmtx"].metrics;u=f["head"].unitsPerEm;print(json.dumps({chr(c):m[g][0]/u for c,g in f.getBestCmap().items()}))`;
  const out =
    await $`uvx --from fonttools[woff] python -c ${script} ${join(RAW, `${key}.woff2`)}`.text();
  const widths = JSON.parse(out) as Record<string, number>;
  return (text: string, size: number) =>
    [...text].reduce((total, char) => total + (widths[char] ?? 0.6) * size, 0);
};

const buildButtons = async () => {
  const measurePixel = await measureFont("pixel700");
  const measureSans = await measureFont("sans700");
  const buttons = [
    {
      file: "btn-start",
      label: "Press start",
      icon: lucide("gamepad-2"),
      primary: true,
    },
    {
      file: "btn-trailer",
      label: "Watch trailer · 20s",
      icon: lucide("clapperboard"),
    },
    { file: "btn-resume", label: "Resume", icon: lucide("file-text") },
    { file: "btn-linkedin", label: "LinkedIn", icon: LINKEDIN },
  ];
  const H = 52;
  const PAD_X = 24;
  const ICON_SIZE = 20;
  const ICON_GAP = 10;
  for (const button of buttons) {
    const fontSize = button.primary ? 18 : 17;
    const textWidth = button.primary
      ? measurePixel(button.label, fontSize)
      : measureSans(button.label, fontSize);
    const W = Math.ceil(PAD_X * 2 + ICON_SIZE + ICON_GAP + textWidth);
    const textX = PAD_X + ICON_SIZE + ICON_GAP;
    const iconY = (H - ICON_SIZE) / 2;
    const color = button.primary ? C.onAccent : C.ink;
    const style = `${fontFace(button.primary ? ["pixel700"] : ["sans700"])}${BASE_CSS}
.sheen{animation:sheen 3.6s ease-in-out infinite}
@keyframes sheen{0%,60%{transform:translateX(-120px)}100%{transform:translateX(${W + 40}px)}}
${REDUCED(".sheen{display:none}")}`;
    const label = `<text class="${button.primary ? "px" : "sans"}" x="${textX}" y="${H / 2}" dominant-baseline="central" font-size="${fontSize}" font-weight="700" fill="${color}">${escapeXml(button.label)}</text>`;
    const body = button.primary
      ? `<defs><clipPath id="pill"><rect width="${W}" height="${H}" rx="${H / 2}"/></clipPath></defs>
<rect width="${W}" height="${H}" rx="${H / 2}" fill="${C.accent}"/>
<g clip-path="url(#pill)"><rect class="sheen" x="0" y="-10" width="40" height="${H + 20}" fill="#fff" opacity="0.35" transform="skewX(-20)"/></g>
${icon({ nodes: button.icon, x: PAD_X, y: iconY, size: ICON_SIZE, color })}
${label}`
      : `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="${H / 2 - 1}" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
${icon({ nodes: button.icon, x: PAD_X, y: iconY, size: ICON_SIZE, color })}
${label}`;
    writeFileSync(join(ASSETS, `${button.file}.svg`), svg(W, H, style, body));
  }
};

// ---------- player card + character sheet ----------

const buildCard = async () => {
  const photo = join(RAW, "portrait.webp");
  await $`magick ${join(ROOT, "../../public/images/jordan-wttj.webp")} -resize 560x -quality 82 ${photo}`.quiet();
  const href = `data:image/webp;base64,${readFileSync(photo).toString("base64")}`;
  const level = new Date().getFullYear() - BIRTH_YEAR;
  const W = 360;
  const H = 500;
  const style = `${fontFace(["pixel400", "pixel700"])}${BASE_CSS}
.holo{animation:holo 5s ease-in-out infinite}
@keyframes holo{0%,55%{transform:translateX(-260px)}100%{transform:translateX(520px)}}
.float{animation:float 5s ease-in-out infinite alternate}
@keyframes float{to{transform:translateY(-6px)}}
${REDUCED(".holo{display:none}.float{animation:none}")}`;
  const body = `
<defs>
  <radialGradient id="portraitBg" cx="0.5" cy="0.3" r="0.75"><stop offset="0" stop-color="#ffcf7a"/><stop offset="0.55" stop-color="#e0892f"/><stop offset="1" stop-color="#7a3f1c"/></radialGradient>
  <clipPath id="portrait"><rect x="16" y="58" width="${W - 32}" height="362" rx="12"/></clipPath>
  <clipPath id="cardClip"><rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="18"/></clipPath>
  <linearGradient id="holoGrad" x1="0" x2="1">
    <stop offset="0" stop-color="#fff" stop-opacity="0"/>
    <stop offset="0.5" stop-color="#fff6d8" stop-opacity="0.32"/>
    <stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </linearGradient>
</defs>
<g class="float">
<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
<text class="px" x="24" y="42" font-size="22" fill="${C.ink}">Jordan Kowal</text>
<text class="px" x="${W - 24}" y="42" font-size="15" fill="${C.accent}" text-anchor="end">LV ${level}</text>
<rect x="16" y="58" width="${W - 32}" height="362" rx="12" fill="url(#portraitBg)"/>
<image href="${href}" x="16" y="58" width="${W - 32}" height="362" preserveAspectRatio="xMidYMin slice" clip-path="url(#portrait)"/>
<text class="px" x="24" y="452" font-size="13" letter-spacing="2.5" fill="${C.accent}">SOFTWARE ENGINEER</text>
<text class="px" x="${W - 24}" y="452" font-size="13" fill="${C.muted}" text-anchor="end">#001</text>
<text class="px" x="${W / 2}" y="478" font-size="11" letter-spacing="2" fill="${C.muted}" text-anchor="middle">★ ★ ★  LEGENDARY  ★ ★ ★</text>
<g clip-path="url(#cardClip)"><rect class="holo" x="0" y="-60" width="200" height="${H + 120}" fill="url(#holoGrad)" transform="rotate(18 180 250)"/></g>
</g>`;
  writeFileSync(join(ASSETS, "player-card.svg"), svg(W, H, style, body));
};

const buildSheet = () => {
  const W = 500;
  const H = 500;
  const level = new Date().getFullYear() - BIRTH_YEAR;
  const rows = [
    ["Level", String(level)],
    ["Class", "Fullstack engineer"],
    ["Guild", experienceData[0].entity],
    ["Location", "Toulouse, France"],
    ["Specialization", "Python · TypeScript · AI"],
  ];
  const perks = [
    { nodes: lucide("lightbulb"), text: "Product mindset" },
    { nodes: lucide("bot"), text: "Ships faster and smarter with AI" },
    { nodes: lucide("zap"), text: "Hyper, self-taught and cheerful" },
    {
      nodes: lucide("dumbbell"),
      text: "Climbs, lifts, runs. Mostly to eat more",
    },
  ];
  const style = `${fontFace(["pixel400", "sans400", "sans700"])}${BASE_CSS}
.row{animation:row 700ms ${EASE_ARRIVE} backwards}
@keyframes row{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
.xp{animation:xp 1600ms ${EASE_ARRIVE} 600ms both}
@keyframes xp{from{transform:scaleX(0)}to{transform:scaleX(1)}}
${REDUCED(".row,.xp{animation:none}")}`;
  const rowsSvg = rows
    .map(
      (
        [label, value],
        index,
      ) => `<g class="row" style="animation-delay:${100 + index * 90}ms">
<text class="sans" x="32" y="${100 + index * 48}" font-size="11.5" letter-spacing="1.6" fill="${C.muted}">${label.toUpperCase()}</text>
<text class="sans" x="32" y="${120 + index * 48}" font-size="17" font-weight="700" fill="${C.ink}">${escapeXml(value)}</text></g>`,
    )
    .join("");
  const perksSvg = perks
    .map(
      (
        perk,
        index,
      ) => `<g class="row" style="animation-delay:${600 + index * 90}ms">
<rect x="32" y="${370 + index * 30}" width="22" height="22" rx="6" fill="${C.raised}" stroke="${C.line}"/>
${icon({ nodes: perk.nodes, x: 36, y: 374 + index * 30, size: 14, color: C.accent })}
<text class="sans" x="66" y="${386 + index * 30}" font-size="15" fill="${C.ink}">${escapeXml(perk.text)}</text></g>`,
    )
    .join("");
  const yearProgress =
    (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) /
    (365 * 24 * 3600 * 1000);
  const body = `
<rect x="6" y="6" width="${W - 12}" height="${H - 12}" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
<text class="px" x="32" y="56" font-size="26" fill="${C.accent}">Character sheet</text>
${rowsSvg}
<text class="sans" x="300" y="100" font-size="11.5" letter-spacing="1.6" fill="${C.muted}">XP TO LV ${level + 1}</text>
<rect x="300" y="110" width="160" height="12" rx="3" fill="${C.raised}" stroke="${C.line}"/>
<rect class="xp" x="300" y="110" width="${Math.round(160 * yearProgress)}" height="12" rx="3" fill="${C.accent}" style="transform-origin:300px 0"/>
<text class="px" x="32" y="350" font-size="18" fill="${C.accent}">Perks</text>
${perksSvg}`;
  writeFileSync(join(ASSETS, "character-sheet.svg"), svg(W, H, style, body));
};

// ---------- inventory ----------

const buildInventory = () => {
  const W = 896;
  const SLOT = 64;
  const GAP = 8;
  const PER_ROW = 12;
  const LEFT = 24;
  const LABEL = 34;
  const MIN_ICON_LUMINANCE = 0.12;
  let y = 24;
  const parts: string[] = [];
  const positions: Array<[number, number]> = [];
  for (const group of SKILL_GROUPS) {
    parts.push(
      `<text class="px" x="${LEFT}" y="${y + 16}" font-size="15" letter-spacing="3" fill="${C.accent}">${escapeXml(group.title.toUpperCase())}</text>`,
    );
    y += 30;
    const filled = group.skills.length;
    const total = Math.ceil(filled / PER_ROW) * PER_ROW;
    for (let index = 0; index < total; index++) {
      const x = LEFT + (index % PER_ROW) * (SLOT + GAP);
      const slotY = y + Math.floor(index / PER_ROW) * (SLOT + LABEL + GAP);
      const skill = group.skills[index];
      parts.push(
        `<rect x="${x}" y="${slotY}" width="${SLOT}" height="${SLOT}" rx="12" fill="${skill ? C.raised : C.page}" stroke="${C.line}" stroke-width="1.5"/>`,
      );
      if (!skill) continue;
      positions.push([x, slotY]);
      const data = SKILL_ICONS[skill.label];
      const size = 30;
      const ix = x + (SLOT - size) / 2;
      const iy = slotY + (SLOT - size) / 2;
      if (data.kind === "logo") {
        const colors = data.shapeColors?.map((hex) =>
          liftColor({ hex, minLuminance: MIN_ICON_LUMINANCE }),
        );
        const color = liftColor({
          hex: data.color,
          minLuminance: MIN_ICON_LUMINANCE,
        });
        const paths = colors
          ? data.path
              .split(/(?=M)/)
              .map(
                (d, i) =>
                  `<path d="${d}" fill="${colors[i % colors.length]}"/>`,
              )
              .join("")
          : `<path d="${data.path}" fill="${color}"/>`;
        parts.push(
          `<g transform="translate(${ix} ${iy}) scale(${size / 24})">${paths}</g>`,
        );
      } else {
        const nodes = data.nodes
          .map(
            ([tag, attrs]) =>
              `<${tag} ${Object.entries(attrs)
                .map(([key, value]) => `${key}="${value}"`)
                .join(" ")}/>`,
          )
          .join("");
        parts.push(
          icon({
            nodes,
            x: ix,
            y: iy,
            size,
            color: CATEGORY_COLORS[skill.category].border,
          }),
        );
      }
      // Two-word names that overflow the slot wrap onto a second line.
      const lines =
        skill.label.length > 11 ? skill.label.split(" ") : [skill.label];
      lines.forEach((line, lineIndex) => {
        parts.push(
          `<text class="sans" x="${x + SLOT / 2}" y="${slotY + SLOT + 14 + lineIndex * 12}" font-size="${line.length > 11 ? 10 : 11}" fill="${C.muted}" text-anchor="middle">${escapeXml(line)}</text>`,
        );
      });
    }
    y += Math.ceil(filled / PER_ROW) * (SLOT + LABEL + GAP) + 14;
  }
  const H = y + 6;
  // The cursor hops from item to item like an inventory selection, holding on each one.
  const hold = 100 / positions.length;
  const frames = positions
    .map(([x, py], index) => {
      const start = (index * hold).toFixed(3);
      const end = ((index + 1) * hold - hold * 0.12).toFixed(3);
      const t = `transform:translate(${x - 3}px,${py - 3}px)`;
      return `${start}%{${t}}${end}%{${t}}`;
    })
    .join("");
  const style = `${fontFace(["pixel400", "sans400"])}${BASE_CSS}
.cursor{animation:cursor ${positions.length * 1.1}s ${EASE_ARRIVE} infinite}
@keyframes cursor{${frames}100%{transform:translate(${positions[0][0] - 3}px,${positions[0][1] - 3}px)}}
.pulse{animation:pulse 1.1s ease-in-out infinite}
@keyframes pulse{50%{opacity:.45}}
${REDUCED(".cursor{display:none}")}`;
  const body = `<rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="18" fill="${C.surface}" stroke="${C.line}" stroke-width="2"/>
${parts.join("")}
<g class="cursor"><rect class="pulse" width="${SLOT + 6}" height="${SLOT + 6}" rx="14" fill="none" stroke="${C.accent}" stroke-width="2.5"/></g>`;
  writeFileSync(join(ASSETS, "inventory.svg"), svg(W, H, style, body));
};

await buildBanner();
await buildButtons();
await buildCard();
buildSheet();
buildInventory();
