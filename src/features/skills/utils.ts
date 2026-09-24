/** Slots in a bag: every item plus at least one empty slot, rounded up to full rows. */
export const bagCapacity = (itemCount: number, columns: number) =>
  Math.ceil((itemCount + 1) / columns) * columns;

const clampUnit = (value: number) => Math.min(1, Math.max(-1, value));

const toChannels = (hex: string) =>
  [1, 3, 5].map((start) => Number.parseInt(hex.slice(start, start + 2), 16));

const toHex = (channels: number[]) =>
  `#${channels.map((channel) => Math.round(channel).toString(16).padStart(2, "0")).join("")}`;

/** WCAG relative luminance of a `#rrggbb` colour, from 0 (black) to 1 (white). */
export const relativeLuminance = (hex: string) => {
  const [r, g, b] = toChannels(hex).map((channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const LIFT_STEP = 0.05;

/**
 * Mixes a colour toward `towards` until its luminance reaches `minLuminance`.
 * Brand colours like Three.js black or Django green would vanish on the page's near-black otherwise.
 */
export const liftColor = ({
  hex,
  minLuminance,
  towards = "#f4ede4",
}: {
  hex: string;
  minLuminance: number;
  towards?: string;
}) => {
  const from = toChannels(hex);
  const to = toChannels(towards);
  for (let amount = 0; amount <= 1; amount += LIFT_STEP) {
    const mixed = toHex(
      from.map((channel, i) => channel + (to[i] - channel) * amount),
    );
    if (relativeLuminance(mixed) >= minLuminance) return mixed;
  }
  return towards;
};

const INLAY_DARK = "#15110d";
const INLAY_LIGHT = "#f4ede4";
// Above this, dark letters read better than white ones: JavaScript's yellow, not CSS's purple.
const INLAY_LUMINANCE_THRESHOLD = 0.3;

/** The colour filling a logo's cut-outs: near-black on a bright logo, off-white on a dark one. */
export const inlayColor = (hex: string) =>
  relativeLuminance(hex) > INLAY_LUMINANCE_THRESHOLD ? INLAY_DARK : INLAY_LIGHT;

/**
 * Rotation that turns an item's face toward the pointer, `dx`/`dy` px away on screen.
 * Grows with distance up to `maxAngle`, reached at `reach` px.
 */
export const tiltToward = ({
  dx,
  dy,
  reach,
  maxAngle,
}: {
  dx: number;
  dy: number;
  reach: number;
  maxAngle: number;
}) => {
  // Screen y points down: a pointer below tips the face down, a positive turn around x.
  return {
    x: clampUnit(dy / reach) * maxAngle,
    y: clampUnit(dx / reach) * maxAngle,
  };
};

type Positioned = {
  offsetLeft: number;
  offsetTop: number;
  offsetParent: unknown;
};

/**
 * Where `element` sits inside `ancestor`, in CSS px, from layout alone: transforms don't count.
 * `ancestor` must be positioned (relative, absolute...), or the offset chain skips it.
 */
export const layoutOffset = (element: Positioned, ancestor: unknown) => {
  let x = 0;
  let y = 0;
  let current: Positioned | null = element;
  while (current && current !== ancestor) {
    x += current.offsetLeft;
    y += current.offsetTop;
    current = current.offsetParent as Positioned | null;
  }
  return { x, y };
};
